// Scoring: criteria definitions, the price / power / weight curves, and the
// overall formula. Everything here is pure; app.js supplies settings and overrides.
(function () {
  'use strict';

  // kind: 'computed' (from specs/price), 'researched' (per model, editable),
  //       'option' (depends on the new/used option picked)
  const CRITERIA = [
    { key: 'price', label: 'Price', short: 'Price', kind: 'computed', weight: 8,
      help: 'On-the-road price through the price curve. Flat below about £4k, steady £4–8k, steep £8–12k, zero above £12.5k.' },
    { key: 'running', label: 'Running costs', short: 'Running', kind: 'researched', weight: 4,
      help: 'Routine costs: fuel economy, insurance, service intervals and prices, parts prices, tyres and chains.' },
    { key: 'power', label: 'Power', short: 'Power', kind: 'computed', weight: 6,
      help: 'Peak bhp through the power curve (sweet spot 40–70). Above 70bhp, relaxed engines count as less powerful and punchy ones as more.' },
    { key: 'comfort', label: 'Tall-rider comfort', short: 'Comfort', kind: 'researched', weight: 9,
      help: 'Ergonomics for 6\'4" and a 34" inseam: legroom, bar reach and seat over 2+ hours. Vibration and wind count under Motorway manners.' },
    { key: 'highway', label: 'Motorway manners', short: 'Motorway', kind: 'researched', weight: 7,
      help: 'Stability, vibration and wind protection at 75mph. Power is judged under Power, not here.' },
    { key: 'standing', label: 'Standing position', short: 'Standing', kind: 'researched', weight: 4,
      help: 'Bar height and reach when standing on the pegs.' },
    { key: 'fun', label: 'Fun factor', short: 'Fun', kind: 'researched', weight: 7,
      help: 'Twisty-road ability, rev-happiness, character and sound (not loudness).' },
    { key: 'reliability', label: 'Reliability', short: 'Reliable', kind: 'researched', weight: 7,
      help: 'How likely it is to go wrong, and how easily it gets fixed (parts availability, dealer support). Age is deducted per used option; costs count under Running costs.' },
    { key: 'weight', label: 'Weight & confidence', short: 'Weight', kind: 'computed', weight: 5,
      help: 'Wet weight through the weight curve: under 170kg feels nervous, 185–230kg is ideal, over 272kg (600lb) is worrying.' },
    { key: 'luggage', label: 'Luggage & touring', short: 'Luggage', kind: 'researched', weight: 3,
      help: 'Racks, panniers and touring capacity, including fuel range.' },
    { key: 'testride', label: 'Test-ride access', short: 'Test ride', kind: 'option', weight: 3,
      help: 'How easy it is to test-ride the option you picked: nearby dealer demo fleets for new bikes, how common the bike is for used.' },
    { key: 'abs', label: 'ABS', short: 'ABS', kind: 'option', weight: 5, binary: true,
      help: 'Anti-lock brakes. Has ABS scores 5, no ABS scores 0. Where ABS was an optional extra, it scores 2.5 until you mark whether the bike you found has it.' },
    { key: 'greenlane', label: 'Green-laning', short: 'Green lane', kind: 'researched', weight: 1,
      help: 'Ability on UK byways and gravel. The worry of dropping a heavy bike counts under Weight.' }
  ];

  // Curves are [x, score] points, linearly interpolated and flat beyond the ends.
  const DEFAULT_CURVES = {
    price: [[3000, 5], [4000, 4.8], [8000, 2.9], [12000, 0.5], [12500, 0]],
    power: [[25, 1], [35, 4], [40, 5], [70, 5], [90, 2.5], [100, 1.5], [125, 0]],
    weight: [[140, 2], [170, 4.2], [185, 5], [230, 5], [260, 3.4], [290, 1.2], [310, 0]]
  };

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

  function effectiveHp(hp, delivery) {
    if (hp <= POWER_KNEE) return hp;
    return POWER_KNEE + (hp - POWER_KNEE) * (DELIVERY_FACTOR[delivery] || 1);
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

    const curves = settings.curves || DEFAULT_CURVES;
    const scores = {};
    const source = {};
    for (const c of CRITERIA) {
      let s, src = 'data';
      if (c.key === 'price') s = interp(curves.price, price);
      else if (c.key === 'power') s = interp(curves.power, effectiveHp(specs.hp, delivery));
      else if (c.key === 'weight') s = interp(curves.weight, specs.wetKg);
      else if (c.key === 'testride') s = option.testRide;
      else if (c.key === 'abs') s = ABS_SCORE[option.abs || bike.abs || 'yes'];
      else s = bike.scores[c.key][0];
      if (option.adj && typeof option.adj[c.key] === 'number') { s += option.adj[c.key]; src = 'option'; }
      if (c.kind !== 'computed' && typeof overrides[c.key] === 'number') { s = overrides[c.key]; src = 'you'; }
      scores[c.key] = clamp5(s);
      source[c.key] = src;
    }
    if (priceOverridden) source.price = 'you';
    return { specs, delivery, price, scores, source, effHp: effectiveHp(specs.hp, delivery) };
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

  window.MotoScoring = { CRITERIA, DEFAULT_CURVES, DELIVERY_FACTOR, PENALTY, ABS_SCORE, ABS_LABEL, interp, effectiveHp, evaluate, overall };
})();
