// Scoring: criteria definitions, the price / power / weight curves, and the
// overall formula. Everything here is pure; app.js supplies settings and overrides.
(function () {
  'use strict';

  // kind: 'computed' (from specs/price), 'researched' (per model, editable),
  //       'option' (depends on the new/used option picked)
  const CRITERIA = [
    { key: 'price', label: 'Price', short: 'Price', kind: 'computed', weight: 8,
      help: 'On-the-road price through the price curve: gentle below £4.5k, steeper £4.5–8k, steep £8–11k, zero from £11k.' },
    { key: 'fit', label: 'Tall-rider fit', short: 'Fit', kind: 'geometry', weight: 8,
      help: 'Knee angle for a 6\'4" rider with a 34" inseam, from the bike\'s seat, peg and bar positions, through the fit curve. A crouched hip (under 105°) or forward lean over 8° takes points off.' },
    { key: 'fun', label: 'Fun factor', short: 'Fun', kind: 'researched', weight: 7,
      help: 'Twisty-road ability, rev-happiness, character and sound (not loudness).' },
    { key: 'power', label: 'Power', short: 'Power', kind: 'computed', weight: 6,
      help: 'Peak bhp through the power curve (sweet spot 40–60, zero from 100). Above 70bhp, relaxed engines count as less powerful and punchy ones as more.' },
    { key: 'weight', label: 'Weight', short: 'Weight', kind: 'computed', weight: 5,
      help: 'Wet weight through the weight curve: full marks up to 200kg, then heavier bikes get more unwieldy and worrying to drop, reaching zero at 300kg. Feeling nervous at speed counts under Road manners.' },
    { key: 'highway', label: 'Road manners', short: 'Road', kind: 'researched', weight: 8,
      help: 'Stability and nervousness at speed, vibration and wind protection at 75mph, and how well the suspension soaks up bumps. Power is judged under Power, heaviness under Weight.' },
    { key: 'reliability', label: 'Reliability', short: 'Reliable', kind: 'researched', weight: 7,
      help: 'How likely it is to go wrong, and how easily it gets fixed (parts availability, dealer support). Age is deducted per used option; costs count under Running costs.' },
    { key: 'running', label: 'Running costs', short: 'Running', kind: 'researched', weight: 4,
      help: 'Routine costs: fuel economy, insurance, service intervals and prices, parts prices, tyres and chains.' },
    { key: 'luggage', label: 'Luggage & touring', short: 'Luggage', kind: 'researched', weight: 3,
      help: 'Racks, panniers and touring capacity, including fuel range.' },
    { key: 'greenlane', label: 'Green-laning', short: 'Green lane', kind: 'researched', weight: 1,
      help: 'Ability on UK byways and gravel. The worry of dropping a heavy bike counts under Weight.' },
    { key: 'standing', label: 'Standing position', short: 'Standing', kind: 'researched', weight: 4,
      help: 'Bar height and reach when standing on the pegs.' },
    { key: 'abs', label: 'ABS', short: 'ABS', kind: 'option', weight: 5, binary: true,
      help: 'Anti-lock brakes. Has ABS scores 5, no ABS scores 0. Where ABS was an optional extra, it scores 2.5 until you mark whether the bike you found has it.' },
    { key: 'testride', label: 'Test-ride access', short: 'Test ride', kind: 'option', weight: 3,
      help: 'How easy it is to test-ride the option you picked: nearby dealer demo fleets for new bikes, how common the bike is for used.' }
  ];

  // Curves are [x, score] points, linearly interpolated and flat beyond the ends.
  const DEFAULT_CURVES = {
    price: [[2000, 5], [4500, 4.5], [8000, 3], [11000, 0]],
    power: [[20, 2], [40, 5], [60, 5], [80, 3.5], [100, 0]],
    // Flat at the light end: feeling nervous at speed is scored under Road manners.
    weight: [[140, 5], [200, 5], [300, 0]],
    // Knee angle (degrees) for a 6'4" / 34" rider. 78° is your CRF300L Rally, whose
    // legroom you called reasonable. Above 100° means feet-forward cruiser controls.
    fit: [[60, 0], [68, 1.5], [74, 3], [78, 4], [84, 5], [100, 5], [115, 3], [130, 1.5]]
  };

  // Fit deductions: a crouched hip angle, and forward lean.
  const FIT_PENALTY = { hipBelow: 105, perHipDegree: 0.15, leanAbove: 8, perLeanDegree: 0.1 };
  function fitScore(geo, curve) {
    let s = interp(curve, geo.knee);
    if (geo.hip < FIT_PENALTY.hipBelow) s -= (FIT_PENALTY.hipBelow - geo.hip) * FIT_PENALTY.perHipDegree;
    if (geo.lean > FIT_PENALTY.leanAbove) s -= (geo.lean - FIT_PENALTY.leanAbove) * FIT_PENALTY.perLeanDegree;
    return s;
  }

  // Above 70bhp, the excess counts for less (relaxed) or more (punchy).
  const DELIVERY_FACTOR = { relaxed: 0.6, normal: 1, punchy: 1.3 };
  const POWER_KNEE = 70;

  // ABS is yes/no. 'some' is an option where it was an extra on some bikes.
  // Every new bike over 125cc registered in the EU/UK since 2017 has it, so
  // options default to 'yes'; bikes.js marks the older ones that differ.
  const ABS_SCORE = { yes: 5, some: 2.5, no: 0 };
  const ABS_LABEL = { yes: 'Yes', some: 'Some', no: 'No' };

  const PENALTY = {
    none: { p: 1, label: 'None: plain weighted average' },
    mild: { p: 0.5, label: 'Mild' },
    strong: { p: 0, label: 'Strong: geometric mean' },
    harsh: { p: -1, label: 'Harsh: one weak spot sinks it' }
  };

  function interp(points, x) {
    if (!points.length) return 0;
    if (x <= points[0][0]) return points[0][1];
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i];
      if (x <= x1) {
        const [x0, y0] = points[i - 1];
        return y0 + (y1 - y0) * (x - x0) / (x1 - x0 || 1);
      }
    }
    return points[points.length - 1][1];
  }

  // knee: where the adjustment starts (bhp); defaults to POWER_KNEE, adjustable in the UI.
  function effectiveHp(hp, delivery, knee) {
    if (typeof knee !== 'number') knee = POWER_KNEE;
    if (hp <= knee) return hp;
    return knee + (hp - knee) * (DELIVERY_FACTOR[delivery] || 1);
  }

  const clamp5 = v => Math.max(0, Math.min(5, v));

  // Resolve a bike + option into specs and per-criterion scores.
  // overrides: { [criterionKey]: number, price: number } from the user.
  function evaluate(bike, option, settings, overrides) {
    overrides = overrides || {};
    const specs = Object.assign({ hp: bike.hp, wetKg: bike.wetKg, seatMm: bike.seatMm }, option.specs || {});
    const delivery = option.delivery || bike.delivery;
    let price = option.price;
    if (option.condition === 'used' && settings.usedPrivate) price = Math.round(price * 0.92 / 50) * 50;
    const priceOverridden = typeof overrides.price === 'number';
    if (priceOverridden) price = overrides.price;

    const curves = Object.assign({}, DEFAULT_CURVES, settings.curves || {});
    const geo = option.geo || bike.geo || null;
    const scores = {};
    const source = {};
    for (const c of CRITERIA) {
      let s, src = 'data';
      if (c.key === 'price') s = interp(curves.price, price);
      else if (c.key === 'power') s = interp(curves.power, effectiveHp(specs.hp, delivery, settings.powerKnee));
      else if (c.key === 'weight') s = interp(curves.weight, specs.wetKg);
      else if (c.key === 'testride') s = option.testRide;
      else if (c.key === 'abs') s = ABS_SCORE[option.abs || bike.abs || 'yes'];
      else if (c.key === 'fit' && geo) s = fitScore(geo, curves.fit);
      else s = bike.scores[c.key][0];
      if (option.adj && typeof option.adj[c.key] === 'number') { s += option.adj[c.key]; src = 'option'; }
      if (c.kind !== 'computed' && typeof overrides[c.key] === 'number') { s = overrides[c.key]; src = 'you'; }
      scores[c.key] = clamp5(s);
      source[c.key] = src;
    }
    if (priceOverridden) source.price = 'you';
    return { specs, delivery, price, scores, source, geo, effHp: effectiveHp(specs.hp, delivery, settings.powerKnee) };
  }

  // Weighted power mean of the 0–5 criterion scores, doubled so the overall
  // score runs 0–10. p=1 is the arithmetic mean; lower p punishes weak spots.
  function overall(scores, weights, penaltyKey) {
    const p = (PENALTY[penaltyKey] || PENALTY.none).p;
    let wsum = 0, acc = 0;
    for (const c of CRITERIA) {
      const w = weights[c.key] || 0;
      if (w <= 0) continue;
      const s = Math.max(p <= 0 ? 0.25 : 0, scores[c.key]);
      wsum += w;
      if (p === 0) acc += w * Math.log(s);
      else acc += w * Math.pow(s, p);
    }
    if (!wsum) return 0;
    const mean = p === 0 ? Math.exp(acc / wsum) : clamp5(Math.pow(acc / wsum, 1 / p));
    return 2 * mean;
  }

  window.MotoScoring = { CRITERIA, DEFAULT_CURVES, DELIVERY_FACTOR, POWER_KNEE, FIT_PENALTY, fitScore, PENALTY, ABS_SCORE, ABS_LABEL, interp, effectiveHp, evaluate, overall };
})();
