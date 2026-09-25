// Next Bike Shortlist: UI, state and rendering.
(function () {
  'use strict';
  const BIKES = window.MOTO_BIKES;
  const DEALERS = window.MOTO_DEALERS;
  const { CRITERIA, DEFAULT_CURVES, POWER_KNEE, REV_K, REV_CAP, revReference, FIT_PENALTY, PENALTY, ABS_LABEL, evaluate, overall, interp, effectiveHp } = window.MotoScoring;
  const L = window.MotoListings;
  const esc = L.esc;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const STORE_KEY = 'next-bike-shortlist-v1';
  const BIKE_BY_ID = Object.fromEntries(BIKES.map(b => [b.id, b]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const gbp = n => '£' + Math.round(n).toLocaleString('en-GB');
  const fmt1 = n => (Math.round(n * 10) / 10).toFixed(1);
  // Overall scores (0–10) show two significant figures: 7.4, or 10 at the top.
  const fmtOverall = n => { const r = Math.round(n * 10) / 10; return r >= 10 ? '10' : r.toFixed(1); };

  const DEFAULT_WEIGHTS = Object.fromEntries(CRITERIA.map(c => [c.key, c.weight]));
  const PRESETS = [
    // Every preset keeps tall-rider fit high; each shifts emphasis for one kind of riding.
    { id: 'default', label: 'Balanced', weights: DEFAULT_WEIGHTS,
      desc: 'Your brief as a whole: price, fit and road manners first, then fun and reliability.' },
    { id: 'cheap', label: 'Cheap & sensible', weights: Object.assign({}, DEFAULT_WEIGHTS, { price: 10, running: 7, reliability: 9, fun: 4, power: 4, standing: 2 }),
      desc: 'Low cost to buy and run, and nothing to worry about.' },
    { id: 'tour', label: 'Long trips', weights: Object.assign({}, DEFAULT_WEIGHTS, { fit: 10, highway: 10, luggage: 8, reliability: 8, price: 5, power: 4, weight: 3, fun: 5, standing: 3, greenlane: 0 }),
      desc: 'Multi-day trips: all-day fit, calm at 75mph, room for luggage, and reliable far from home.' },
    { id: 'twisties', label: 'Twisty roads', weights: Object.assign({}, DEFAULT_WEIGHTS, { fun: 10, power: 7, weight: 7, highway: 4, price: 7, standing: 2, luggage: 1, greenlane: 0 }),
      desc: 'B-road fun: rev-happy, agile and not too heavy. Motorway comfort matters less.' },
    { id: 'explore', label: 'Explorer', weights: Object.assign({}, DEFAULT_WEIGHTS, { standing: 7, greenlane: 5, luggage: 6, highway: 6, weight: 6, fun: 6 }),
      desc: 'Back roads, byways and camping: good standing position, some green-lane ability, luggage.' },
    { id: 'custom', label: 'Custom', desc: 'Your own weights. Moving any slider saves the current weights here.' }
  ];
  const sameWeights = (a, b) => CRITERIA.every(c => (a[c.key] || 0) === (b[c.key] || 0));
  const presetWeights = id => id === 'custom' ? state.customWeights : PRESETS.find(p => p.id === id).weights;

  const DEFAULT_STATE = {
    tab: 'compare',
    weights: DEFAULT_WEIGHTS,
    // Which preset the sliders show. 'custom' is the user's own set, kept in
    // customWeights; editing any slider copies the current weights into it.
    preset: 'default',
    customWeights: DEFAULT_WEIGHTS,
    penalty: 'mild',
    optionMode: 'best',
    usedPrivate: false,
    curves: DEFAULT_CURVES,
    picks: {},
    overrides: {},
    notes: {},
    starred: {},
    hidden: {},
    filters: { q: '', maxPrice: 12000, maxHp: 100, cond: 'any', starredOnly: false, showHidden: false, showRef: false, mins: {} },
    sort: { key: 'overall', dir: -1 },
    home: { postcode: 'CB2 1TN', lat: 52.2051, lng: 0.1162, label: 'Cambridge CB2 1TN' },
    radius: 50,
    searchMaxPrice: 12000,
    listingBikes: {},
    listings: [],
    mapRange: 60,
    dealersPickedOnly: false,
    powerKnee: POWER_KNEE,
    revK: REV_K
  };
  const REV_REF = revReference(BIKES);
  const rpmEquiv = hpPerNm => Math.round(hpPerNm * 7121 / 100) * 100;

  // Earlier default curves. A saved curve still equal to one of these moves to
  // the current default; curves you've edited are kept.
  const OLD_DEFAULT_CURVES = [
    {
      price: [[3000, 5], [4000, 4.8], [5000, 4.4], [6000, 3.9], [7000, 3.4], [8000, 2.9], [9000, 2.2], [10000, 1.6], [11000, 1.0], [12000, 0.5], [12500, 0]],
      power: [[25, 1], [30, 2.5], [35, 4], [40, 5], [70, 5], [75, 4.5], [80, 3.8], [90, 2.5], [100, 1.5], [110, 0.8], [125, 0]],
      weight: [[140, 2], [155, 3], [170, 4.2], [185, 5], [230, 5], [245, 4.3], [260, 3.4], [272, 2.5], [290, 1.2], [310, 0]]
    },
    {
      price: [[3000, 5], [4000, 4.8], [8000, 2.9], [12000, 0.5], [12500, 0]],
      power: [[25, 1], [35, 4], [40, 5], [70, 5], [90, 2.5], [100, 1.5], [125, 0]],
      weight: [[140, 2], [170, 4.2], [185, 5], [230, 5], [260, 3.4], [290, 1.2], [310, 0]]
    },
    { weight: [[140, 2.5], [180, 5], [200, 5], [300, 0]] }
  ];

  function loadState() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { saved = null; }
    return mergeState(saved);
  }
  function mergeState(saved) {
    const s = clone(DEFAULT_STATE);
    if (saved && typeof saved === 'object') {
      for (const k of Object.keys(s)) {
        if (!(k in saved)) continue;
        if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) s[k] = Object.assign(s[k], saved[k]);
        else s[k] = saved[k];
      }
      // Saves from before Tall-rider fit existed had one comfort weight covering
      // legroom; it carries over to fit.
      for (const k of ['weights', 'customWeights']) {
        const old = saved[k];
        if (old && typeof old === 'object' && !('fit' in old) && typeof old.comfort === 'number') {
          s[k].fit = old.comfort;
        }
      }
      for (const c of CRITERIA) if (typeof s.weights[c.key] !== 'number') s.weights[c.key] = c.weight;
      for (const c of CRITERIA) if (typeof s.customWeights[c.key] !== 'number') s.customWeights[c.key] = c.weight;
      delete s.filters.styles; // style filter was removed
      // Seat & ride comfort was removed; its ride half is now part of Road manners.
      delete s.weights.comfort; delete s.customWeights.comfort; delete s.filters.mins.comfort;
      for (const ov of Object.values(s.overrides)) delete ov.comfort;
      if (s.sort.key === 'comfort') s.sort = { key: 'overall', dir: -1 };
      // Saved before presets were tracked: weights matching a preset select it;
      // anything else becomes the custom set.
      if (!('preset' in saved)) {
        const match = PRESETS.find(p => p.id !== 'custom' && sameWeights(p.weights, s.weights));
        if (match) s.preset = match.id;
        else { s.preset = 'custom'; s.customWeights = clone(s.weights); }
      }
      if (!PRESETS.some(p => p.id === s.preset)) s.preset = 'custom';
      // A named preset always shows its current definition.
      if (s.preset !== 'custom') s.weights = clone(PRESETS.find(p => p.id === s.preset).weights);
      for (const k of Object.keys(DEFAULT_CURVES)) {
        if (OLD_DEFAULT_CURVES.some(old => JSON.stringify(s.curves[k]) === JSON.stringify(old[k]))) s.curves[k] = clone(DEFAULT_CURVES[k]);
      }
    }
    return s;
  }
  let state = loadState();
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
    }, 150);
  }
  const expanded = {};

  // ---------------------------------------------------------------- scoring
  function settings() { return { usedPrivate: state.usedPrivate, curves: state.curves, powerKnee: state.powerKnee, revK: state.revK, revRef: REV_REF }; }

  function evalOption(bike, opt) {
    const ev = evaluate(bike, opt, settings(), state.overrides[bike.id]);
    ev.overall = overall(ev.scores, state.weights, state.penalty);
    ev.option = opt;
    return ev;
  }

  function pickOption(bike, evs) {
    const manual = state.picks[bike.id];
    if (manual) {
      const m = evs.find(e => e.option.id === manual);
      if (m) return { ev: m, manual: true };
    }
    const byOverall = (a, b) => b.overall - a.overall;
    const mode = state.optionMode;
    let pool = evs;
    if (mode === 'new' || mode === 'used') {
      const p = evs.filter(e => e.option.condition === mode);
      if (p.length) pool = p;
    }
    if (mode === 'cheapest') return { ev: evs.slice().sort((a, b) => a.price - b.price)[0] };
    return { ev: pool.slice().sort(byOverall)[0], fallback: pool === evs && (mode === 'new' || mode === 'used') };
  }

  function computeRows() {
    return BIKES.map(bike => {
      const evs = bike.options.map(o => evalOption(bike, o));
      const { ev, manual, fallback } = pickOption(bike, evs);
      return { bike, evs, ev, manual, fallback };
    });
  }

  function passesFilters(r) {
    const f = state.filters, b = r.bike, ev = r.ev;
    if (b.reference && !f.showRef) return false;
    if (state.hidden[b.id] && !f.showHidden) return false;
    if (f.starredOnly && !state.starred[b.id]) return false;
    if (ev.price > f.maxPrice) return false;
    if (f.maxHp < 100 && ev.specs.hp > f.maxHp) return false;
    if (f.cond !== 'any' && !b.options.some(o => o.condition === f.cond)) return false;
    if (f.q) {
      const hay = (b.make + ' ' + b.model + ' ' + b.engine + ' ' + b.style).toLowerCase();
      if (!f.q.toLowerCase().split(/\s+/).every(t => hay.includes(t))) return false;
    }
    for (const [k, v] of Object.entries(f.mins)) if (v > 0 && ev.scores[k] < v) return false;
    return true;
  }

  function sortRows(rows) {
    const { key, dir } = state.sort;
    const val = r => {
      switch (key) {
        case 'overall': return r.ev.overall;
        case 'name': return (r.bike.make + ' ' + r.bike.model).toLowerCase();
        case 'price': return r.ev.price;
        case 'hp': return r.ev.specs.hp;
        case 'kg': return r.ev.specs.wetKg;
        case 'seat': return r.ev.specs.seatMm;
        case 'knee': return r.ev.geo ? r.ev.geo.knee : -1;
        case 'star': return state.starred[r.bike.id] ? 1 : 0;
        default: return r.ev.scores[key];
      }
    };
    return rows.sort((a, b) => {
      const va = val(a), vb = val(b);
      if (va < vb) return -dir;
      if (va > vb) return dir;
      return b.ev.overall - a.ev.overall;
    });
  }

  const absText = s => s >= 5 ? 'Yes' : s <= 0 ? 'No' : 'Some';
  function powerNote(ev) {
    const rev = `${ev.specs.hp}bhp and ${ev.specs.torqueNm}Nm: ${ev.hpPerNm.toFixed(2)} hp per Nm (about ${rpmEquiv(ev.hpPerNm).toLocaleString('en-GB')}rpm-equivalent; typical ${REV_REF.toFixed(2)})`;
    if (ev.specs.hp <= state.powerKnee) return `${rev}. Below ${state.powerKnee}bhp, so no rev-happiness adjustment.`;
    const kind = ev.rev > 1.02 ? 'rev-happy' : ev.rev < 0.98 ? 'torquey' : 'typical';
    return `${rev}. ${kind[0].toUpperCase() + kind.slice(1)}: power over ${state.powerKnee}bhp ×${ev.rev.toFixed(2)}, counted as ${Math.round(ev.effHp)}bhp.`;
  }
  function fitNote(g) {
    const parts = [`Knee ${Math.round(g.knee)}°, hip ${Math.round(g.hip)}°, forward lean ${Math.round(g.lean)}° for a 6′4″ rider with a 34″ inseam`];
    const cuts = [];
    if (g.hip < FIT_PENALTY.hipBelow) cuts.push(`crouched hip −${((FIT_PENALTY.hipBelow - g.hip) * FIT_PENALTY.perHipDegree).toFixed(1)}`);
    if (g.lean > FIT_PENALTY.leanAbove) cuts.push(`forward lean −${((g.lean - FIT_PENALTY.leanAbove) * FIT_PENALTY.perLeanDegree).toFixed(1)}`);
    if (g.knee > 100) cuts.push('feet-forward controls');
    return parts[0] + (cuts.length ? ` (${cuts.join(', ')})` : '') + `. Source: ${g.src}, ${g.model}.`;
  }
  function absNote(ev) {
    if (ev.source.abs === 'you') return ev.scores.abs >= 5 ? 'You marked this bike as having ABS.' : 'You marked this bike as having no ABS.';
    const status = ev.option.abs || 'yes';
    if (ev.option.absNote) return ev.option.absNote;
    return status === 'yes' ? 'ABS as standard.' : status === 'no' ? 'No ABS on this model.' : 'ABS was optional; check the listing.';
  }

  // Diverging brick → grey → green; returns inline CSS custom properties.
  function scoreStyle(s) {
    const t = Math.min(1, Math.abs(s - 2.5) / 2.5);
    return `--h:${s < 2.5 ? 10 : 150};--t:${t.toFixed(2)}`;
  }

  // ---------------------------------------------------------------- masthead
  function renderSign(rows) {
    const top = rows.filter(r => !r.bike.reference && passesFilters(r)).slice().sort((a, b) => b.ev.overall - a.ev.overall).slice(0, 3);
    $('#route-sign').innerHTML = `<div class="rs-head">Top of your list</div>` + top.map(r => `
      <button class="route-row" type="button" data-goto="${r.bike.id}">
        <span class="rs-arrow" aria-hidden="true">↑</span>
        <span class="rs-name">${esc(r.bike.make)} ${esc(r.bike.model)}</span>
        <span class="rs-score">${fmtOverall(r.ev.overall)}</span>
      </button>`).join('');
  }

  // ---------------------------------------------------------------- weights
  function renderWeights() {
    const total = CRITERIA.reduce((s, c) => s + (state.weights[c.key] || 0), 0) || 1;
    $('#weights-list').innerHTML = CRITERIA.map(c => {
      const w = state.weights[c.key] || 0;
      return `<div class="w-row${w ? '' : ' zero'}" title="${esc(c.help)}">
        <label for="w-${c.key}">${esc(c.label)}</label>
        <span class="w-val">${w}</span>
        <span class="w-share">${Math.round(w / total * 100)}%</span>
        <input type="range" id="w-${c.key}" data-w="${c.key}" min="0" max="10" step="1" value="${w}" aria-describedby="w-${c.key}-help">
        <span id="w-${c.key}-help" hidden>${esc(c.help)}</span>
      </div>`;
    }).join('');
    $('#presets').innerHTML = PRESETS.map(p => `<button type="button" class="chip" data-preset="${p.id}" aria-pressed="${state.preset === p.id}" title="${esc(p.desc)}">${esc(p.label)}</button>`).join('');
  }

  // ---------------------------------------------------------------- filters
  function renderFilters() {
    const f = state.filters;
    $('#f-q').value = f.q;
    $('#f-maxprice').value = f.maxPrice;
    $('#f-maxprice-out').textContent = f.maxPrice >= 13000 ? 'any' : gbp(f.maxPrice);
    $('#f-maxhp').value = f.maxHp;
    $('#f-maxhp-out').textContent = f.maxHp >= 100 ? 'any' : f.maxHp + ' bhp';
    $('#f-mode').value = state.optionMode;
    $('#f-cond').value = f.cond;
    $('#f-starred').checked = f.starredOnly;
    $('#f-showhidden').checked = f.showHidden;
    $('#f-showref').checked = f.showRef;
    $('#f-private').checked = state.usedPrivate;
    $('#f-mins').innerHTML = CRITERIA.map(c => {
      const v = f.mins[c.key] || 0;
      if (c.binary) return `<label class="field"><span class="field-label">${esc(c.label)}</span>
        <select data-min="${c.key}"><option value="0"${v ? '' : ' selected'}>Any</option><option value="5"${v ? ' selected' : ''}>Must have ABS</option></select></label>`;
      return `<label class="field"><span class="field-label">${esc(c.label)} ≥ <output>${v ? fmt1(v) : 'any'}</output></span>
        <input type="range" min="0" max="5" step="0.5" value="${v}" data-min="${c.key}"></label>`;
    }).join('');
    const n = Object.values(f.mins).filter(v => v > 0).length;
    $('#min-count').textContent = n ? n : '';
  }

  // ---------------------------------------------------------------- table
  function visibleCriteria() { return CRITERIA.filter(c => (state.weights[c.key] || 0) > 0); }

  function renderTable() {
    const all = computeRows();
    renderSign(all);
    const rows = sortRows(all.filter(passesFilters));
    const crits = visibleCriteria();
    const sortAttr = key => state.sort.key === key ? ` aria-sort="${state.sort.dir > 0 ? 'ascending' : 'descending'}"` : '';
    const arrow = key => state.sort.key === key ? (state.sort.dir > 0 ? '▲' : '▼') : '▼';
    const th = (key, label, cls, extra) => `<th class="${cls || ''}"${sortAttr(key)} scope="col"><button type="button" data-sort="${key}">${label}<span class="arrow" aria-hidden="true">${arrow(key)}</span></button>${extra || ''}</th>`;
    $('#bikes-thead').innerHTML = `<tr>
      ${th('star', '<span aria-label="Shortlist">★</span>', '')}
      ${th('name', 'Bike', 'col-bike')}
      ${th('overall', 'Overall', '')}
      <th scope="col">Option</th>
      ${th('price', 'Price', '')}
      ${th('hp', 'bhp', '')}
      ${th('kg', 'Wet kg', '')}
      ${th('seat', 'Seat', '')}
      ${th('knee', 'Knee°', '')}
      ${crits.map(c => th(c.key, esc(c.short), 'crit', `<span class="w-tag">×${state.weights[c.key]}</span>`)).join('')}
    </tr>`;
    const ncols = 9 + crits.length;
    const html = rows.map(r => rowHtml(r, crits, ncols)).join('');
    $('#bikes-tbody').innerHTML = html || `<tr><td colspan="${ncols}" class="empty">No bikes match these filters. Loosen the price or power limit, or clear the minimum scores.</td></tr>`;
    const hiddenCount = all.filter(r => !passesFilters(r) && !r.bike.reference).length;
    $('#table-status').textContent = `Showing ${rows.length} of ${all.filter(r => !r.bike.reference).length} bikes` + (hiddenCount ? ` · ${hiddenCount} filtered out` : '') + ` · scored on the ${state.optionMode === 'best' ? 'best-scoring' : state.optionMode === 'cheapest' ? 'cheapest' : state.optionMode} option unless you picked one.`;
  }

  function rowHtml(r, crits, ncols) {
    const b = r.bike, ev = r.ev, open = !!expanded[b.id];
    const conds = Array.from(new Set(b.options.map(o => o.condition)));
    const tags = [`<span class="tag">${esc(b.style)}</span>`];
    if (b.reference) tags.push('<span class="tag ref">Your bike</span>');
    if (!conds.includes('new')) tags.push('<span class="tag">Used only</span>');
    if (!conds.includes('used')) tags.push('<span class="tag">New only</span>');
    if (r.fallback) tags.push(`<span class="tag warn">No ${state.optionMode} option</span>`);
    if (state.hidden[b.id]) tags.push('<span class="tag">Hidden</span>');
    const opts = b.options.map(o => `<option value="${o.id}"${o.id === ev.option.id ? ' selected' : ''}>${esc(o.label)}</option>`).join('');
    const priceSrc = ev.price !== ev.option.price ? (state.overrides[b.id] && typeof state.overrides[b.id].price === 'number' ? 'your price' : 'private sale') : (ev.option.range[0] !== ev.option.range[1] ? `${gbp(ev.option.range[0])}–${gbp(ev.option.range[1]).slice(1)}` : '');
    let html = `<tr class="row${open ? ' open' : ''}${state.hidden[b.id] ? ' is-hidden' : ''}" data-bike="${b.id}" aria-expanded="${open}">
      <td><button type="button" class="star" data-star="${b.id}" aria-pressed="${!!state.starred[b.id]}" aria-label="Shortlist ${esc(b.model)}">★</button></td>
      <td class="col-bike"><span class="bike-make">${esc(b.make)}</span><span class="bike-name">${esc(b.model)}</span><span class="bike-meta">${tags.join('')}</span></td>
      <td><div class="overall"><span class="overall-num">${fmtOverall(ev.overall)}</span><span class="overall-bar"><i style="width:${(ev.overall / 10 * 100).toFixed(1)}%"></i></span></div></td>
      <td><select class="opt-select" data-opt="${b.id}" aria-label="Buying option for ${esc(b.model)}">${opts}</select></td>
      <td class="price">${gbp(ev.price)}${priceSrc ? `<small>${esc(priceSrc)}</small>` : ''}</td>
      <td class="spec">${ev.specs.hp}</td>
      <td class="spec">${ev.specs.wetKg}</td>
      <td class="spec">${ev.specs.seatMm}</td>
      <td class="spec" title="${ev.geo ? esc(`Knee ${Math.round(ev.geo.knee)}°, hip ${Math.round(ev.geo.hip)}°, lean ${Math.round(ev.geo.lean)}° for a 6′4″ rider`) : 'No geometry data'}">${ev.geo ? Math.round(ev.geo.knee) + '°' : '–'}</td>
      ${crits.map(c => {
        const s = ev.scores[c.key];
        const src = ev.source[c.key];
        const title = c.key === 'power' ? powerNote(ev) : (b.scores[c.key] ? b.scores[c.key][1] : c.help);
        const text = c.binary ? absText(s) : fmt1(s);
        return `<td class="score"><span class="score-chip${src === 'you' ? ' you' : ''}" style="${scoreStyle(s)}" title="${esc(c.binary ? absNote(ev) : title)}">${text}</span></td>`;
      }).join('')}
    </tr>`;
    if (open) html += `<tr class="detail" data-detail="${b.id}"><td colspan="${ncols}">${detailHtml(r)}</td></tr>`;
    return html;
  }

  function detailHtml(r) {
    const b = r.bike, ev = r.ev;
    const ov = state.overrides[b.id] || {};
    const critItems = CRITERIA.map(c => {
      const s = ev.scores[c.key];
      let note;
      if (c.key === 'price') note = `${gbp(ev.price)} on the road for “${ev.option.label}”.`;
      else if (c.key === 'power') note = powerNote(ev);
      else if (c.key === 'weight') note = `${ev.specs.wetKg}kg wet (${Math.round(ev.specs.wetKg * 2.2046)}lb).`;
      else if (c.key === 'testride') note = ev.option.condition === 'new' ? 'New: based on the nearest dealer and the brand’s demo fleet.' : 'Used: based on how many are for sale nearby.';
      else if (c.key === 'abs') note = absNote(ev);
      else if (c.key === 'fit' && ev.geo) note = fitNote(ev.geo);
      else note = b.scores[c.key][1];
      if (ev.option.adj && ev.option.adj[c.key] && ev.source[c.key] !== 'you') note += ` (${ev.option.adj[c.key] > 0 ? '+' : ''}${ev.option.adj[c.key]} for this option)`;
      const editable = c.kind !== 'computed';
      const input = c.binary
        ? `<select data-ov="${b.id}" data-key="${c.key}" aria-label="Does the bike you found have ABS?">
            <option value=""${typeof ov[c.key] === 'number' ? '' : ' selected'}>As listed</option>
            <option value="5"${ov[c.key] === 5 ? ' selected' : ''}>Has ABS</option>
            <option value="0"${ov[c.key] === 0 ? ' selected' : ''}>No ABS</option></select>`
        : editable
        ? `<input type="number" min="0" max="5" step="0.5" data-ov="${b.id}" data-key="${c.key}" value="${typeof ov[c.key] === 'number' ? ov[c.key] : ''}" placeholder="mine" aria-label="My ${esc(c.label)} score">`
        : '<span></span>';
      return `<div class="crit-item"><span class="ci-label">${esc(c.label)}</span>
        <span><span class="score-chip${ev.source[c.key] === 'you' ? ' you' : ''}" style="${scoreStyle(s)}">${c.binary ? absText(s) : fmt1(s)}</span></span>
        <span class="ci-note">${esc(note)}</span>${input}</div>`;
    }).join('');
    const optItems = r.evs.map(e => `<label class="opt-item${e.option.id === ev.option.id ? ' sel' : ''}">
        <input type="radio" name="opt-${b.id}" data-opt-radio="${b.id}" value="${e.option.id}"${e.option.id === ev.option.id ? ' checked' : ''}>
        <span><span class="oi-label">${esc(e.option.label)}</span> · ${gbp(e.price)} <span class="hint">(${gbp(e.option.range[0])}–${gbp(e.option.range[1]).slice(1)})</span></span>
        <span class="oi-score">${fmtOverall(e.overall)}</span>
        ${e.option.note ? `<span class="oi-note">${esc(e.option.note)}</span>` : ''}
      </label>`).join('');
    return `<div class="detail-inner">
      <div class="detail-block">
        <div><h4>Summary</h4><p>${esc(b.summary)}</p></div>
        <div><h4>For a 6′4″ rider</h4><p>${esc(b.tall)}</p></div>
        <div class="pc">
          <div><h4>Good</h4><ul>${b.pros.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>
          <div><h4>Watch out</h4><ul>${b.cons.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>
        </div>
        <dl class="specs-grid">
          <div><dt>Engine</dt><dd>${esc(b.engine)}</dd></div>
          <div><dt>Power</dt><dd>${ev.specs.hp} bhp</dd></div>
          <div><dt>Torque</dt><dd>${b.torqueNm} Nm</dd></div>
          <div><dt>Wet weight</dt><dd>${ev.specs.wetKg} kg</dd></div>
          <div><dt>Seat</dt><dd>${ev.specs.seatMm} mm</dd></div>
          <div><dt>Tank</dt><dd>${b.tankL} L</dd></div>
          <div><dt>Knee / hip / lean</dt><dd>${ev.geo ? `${Math.round(ev.geo.knee)}° / ${Math.round(ev.geo.hip)}° / ${Math.round(ev.geo.lean)}°` : '–'}</dd></div>
          <div><dt>Final drive</dt><dd>${esc(b.drive)}</dd></div>
        </dl>
      </div>
      <div class="detail-block">
        <div><h4>Scores and why</h4><p class="hint">Type your own score (0–5) to override a researched one. Clear the box to go back.</p></div>
        <div class="crit-list">${critItems}</div>
      </div>
      <div class="detail-block">
        <div><h4>Buying options</h4><div class="opt-list">${optItems}</div>
          ${r.manual ? `<button type="button" class="link-btn" data-unpick="${b.id}">Let the table choose the option again</button>` : ''}</div>
        <div class="my-row">
          <label class="field"><span class="field-label">My price (£)</span>
            <input type="number" min="0" step="50" data-ov="${b.id}" data-key="price" value="${typeof ov.price === 'number' ? ov.price : ''}" placeholder="e.g. a listing"></label>
          <div class="field"><span class="field-label">In the table</span>
            <button type="button" class="btn btn-quiet" data-hide="${b.id}">${state.hidden[b.id] ? 'Unhide' : 'Hide this bike'}</button></div>
        </div>
        <label class="field"><span class="field-label">My notes</span>
          <textarea rows="3" data-note="${b.id}" placeholder="Test-ride impressions, questions for the seller…">${esc(state.notes[b.id] || '')}</textarea></label>
        <div class="btn-row">
          <button type="button" class="btn" data-find="${b.id}">Find listings &amp; dealers</button>
        </div>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------------- scoring tab
  function renderFormula() {
    const p = (PENALTY[state.penalty] || PENALTY.none).p;
    const lines = [
      'score_i  = 0–5 for each criterion i',
      'w_i      = your weight for criterion i (0–10)',
      '',
      p === 1 ? 'overall  = 2 × Σ(w_i × score_i) / Σ w_i                     (weak-spot penalty: none)'
        : p === 0 ? 'overall  = 2 × exp( Σ(w_i × ln score_i) / Σ w_i )           (weak-spot penalty: strong)'
          : `overall  = 2 × ( Σ(w_i × score_i^${p}) / Σ w_i )^(1/${p})        (weak-spot penalty: ${state.penalty})`,
      '           so the overall score runs 0–10',
      '',
      `Power above ${state.powerKnee}bhp counts as ${state.powerKnee} + (bhp − ${state.powerKnee}) × factor,`,
      `where factor = (hp per Nm ÷ ${REV_REF.toFixed(2)})^${state.revK}, kept between ${REV_CAP[0]} and ${REV_CAP[1]}.`,
      `(${REV_REF.toFixed(2)} hp per Nm is the typical engine here; hp per Nm × 7121 ≈ rpm of peak power.)`,
      '',
      `Fit = knee-angle curve − ${FIT_PENALTY.perHipDegree} per degree of hip angle under ${FIT_PENALTY.hipBelow}°`,
      `                        − ${FIT_PENALTY.perLeanDegree} per degree of forward lean over ${FIT_PENALTY.leanAbove}°`
    ];
    $('#formula').textContent = lines.join('\n');
  }

  const CURVE_META = {
    price: { title: 'Price → score', unit: '£', xLabel: v => v >= 1000 ? '£' + (v / 1000) + 'k' : '£' + v, min: 2000, max: 13000, step: 100,
      ticks: [2000, 4000, 6000, 8000, 10000, 12000],
      desc: 'Gentle below £4.5k, where price matters less. Steeper from £4.5–8k. Steep from £8k to zero at £11k, where a bike has to earn it.' },
    power: { title: 'Power → score', unit: 'bhp', xLabel: v => v + '', min: 20, max: 130, step: 1,
      ticks: [20, 40, 60, 80, 100, 120],
      desc: 'Sweet spot 40–60bhp. Less than that struggles at 75mph; above 60 it gets more than you want, reaching zero at 100. Dots show each bike after the rev-happiness adjustment.' },
    weight: { title: 'Wet weight → score', unit: 'kg', xLabel: v => v + '', min: 130, max: 320, step: 1,
      ticks: [140, 170, 200, 230, 260, 290, 320],
      desc: 'Full marks up to 200kg; heavier bikes get more unwieldy and worrying to drop, reaching zero at 300kg. Nervousness at speed is scored under Road manners, not here.' },
    fit: { title: 'Knee angle → fit', unit: '°', xLabel: v => v + '°', min: 55, max: 135, step: 1,
      ticks: [60, 70, 80, 90, 100, 110, 120, 130],
      desc: 'Knee angle for a 6′4″ rider with a 34″ inseam; smaller means more bent. 78° is your CRF300L Rally. Above 100° means feet-forward cruiser controls. Dots are the bikes before hip and lean deductions.' }
  };
  const SCORE_STEP = 0.1;

  // Chart geometry in viewBox units (0 0 320 180).
  function curveGeom(key) {
    const m = CURVE_META[key];
    const X0 = 34, X1 = 310, Y0 = 150, Y1 = 12;
    return {
      X0, X1, Y0, Y1,
      sx: v => X0 + (Math.max(m.min, Math.min(m.max, v)) - m.min) / (m.max - m.min) * (X1 - X0),
      sy: s => Y0 - s / 5 * (Y0 - Y1),
      vx: x => m.min + (x - X0) / (X1 - X0) * (m.max - m.min),
      vy: y => (Y0 - y) / (Y0 - Y1) * 5
    };
  }
  const fmtX = (key, v) => key === 'price' ? gbp(v) : key === 'fit' ? v + '° knee' : v + ' ' + CURVE_META[key].unit;
  const pointsText = pts => pts.map(p => p[0] + ':' + p[1]).join(', ');

  function renderCurves() {
    const rows = computeRows().filter(r => !r.bike.reference);
    $('#curves').innerHTML = Object.keys(CURVE_META).map(key => {
      const m = CURVE_META[key];
      const pts = state.curves[key];
      return `<div class="curve-card" data-curve="${key}">
        <h3>${m.title}</h3>
        <p class="hint">${m.desc}</p>
        <svg viewBox="0 0 320 180" role="group" aria-label="${m.title} curve editor">${curveSvg(key, pts, rows)}</svg>
        <div class="curve-tip" aria-live="polite"></div>
        <p class="hint">Drag a point to reshape the curve. Double-click the chart to add a point, or a point to remove it. Focused points also move with the arrow keys (Shift for bigger steps) and Delete removes them.</p>
        <label class="field"><span class="field-label">Points (${m.unit}: score)</span>
          <input type="text" class="curve-points" data-curve-input="${key}" value="${esc(pointsText(pts))}" spellcheck="false"></label>
        ${key === 'power' ? `<label class="field"><span class="field-label">Rev-happiness adjustment starts at <output id="power-knee-out">${state.powerKnee} bhp</output></span>
          <input type="range" id="power-knee" min="40" max="110" step="5" value="${state.powerKnee}">
          <span class="hint">Default ${POWER_KNEE} bhp. Above this, engines that make their power high in the revs count as more powerful, and torquey ones as less.</span></label>
        <label class="field"><span class="field-label">Rev-happiness adjustment strength <output id="rev-k-out">${state.revK}</output></span>
          <input type="range" id="rev-k" min="0" max="3" step="0.25" value="${state.revK}">
          <span class="hint">0 turns it off. Default ${REV_K}: a bike revving 20% higher than typical (in hp per Nm) has its power over the threshold counted ×1.44.</span></label>` : ''}
        <div class="btn-row"><button type="button" class="link-btn" data-curve-reset="${key}">Reset this curve</button><span class="hint" data-curve-status="${key}"></span></div>
      </div>`;
    }).join('');
    $$('.curve-card').forEach(card => attachCurveEditor(card));
  }

  function curvePaths(key, pts) {
    const m = CURVE_META[key], g = curveGeom(key);
    // Straight segments between knots, flat beyond the ends.
    const xs = [m.min].concat(pts.map(p => p[0]).filter(x => x > m.min && x < m.max), [m.max]);
    const line = xs.map((v, i) => (i ? 'L' : 'M') + g.sx(v).toFixed(1) + ' ' + g.sy(interp(pts, v)).toFixed(1)).join('');
    return { line, area: line + `L${g.X1} ${g.Y0}L${g.X0} ${g.Y0}Z` };
  }

  function curveSvg(key, pts, rows) {
    const m = CURVE_META[key], g = curveGeom(key);
    let out = '<g class="grid">';
    for (let s = 0; s <= 5; s++) out += `<line x1="${g.X0}" x2="${g.X1}" y1="${g.sy(s)}" y2="${g.sy(s)}"></line>`;
    out += '</g><g class="axis">';
    for (let s = 0; s <= 5; s++) out += `<text x="${g.X0 - 8}" y="${g.sy(s) + 4}" text-anchor="end">${s}</text>`;
    for (const t of m.ticks) out += `<text x="${g.sx(t)}" y="${g.Y0 + 18}" text-anchor="middle">${m.xLabel(t)}</text>`;
    out += '</g>';
    const { line, area } = curvePaths(key, pts);
    out += `<path class="curve-area" d="${area}"></path><path class="curve" d="${line}"></path>`;
    out += `<rect class="curve-bg" x="${g.X0}" y="${g.Y1 - 6}" width="${g.X1 - g.X0}" height="${g.Y0 - g.Y1 + 12}"></rect>`;
    out += `<line class="hover-line" x1="0" x2="0" y1="${g.Y1}" y2="${g.Y0}" visibility="hidden"></line>`;
    for (const r of rows) {
      const v = key === 'price' ? r.ev.price : key === 'power' ? r.ev.effHp : key === 'fit' ? (r.ev.geo ? r.ev.geo.knee : null) : r.ev.specs.wetKg;
      if (v == null || v < m.min || v > m.max) continue;
      out += `<circle class="bike-dot" data-v="${v}" cx="${g.sx(v).toFixed(1)}" cy="${g.sy(interp(pts, v)).toFixed(1)}" r="3"><title>${esc(r.bike.make + ' ' + r.bike.model)}</title></circle>`;
    }
    pts.forEach((p, i) => {
      out += `<g class="knot" data-i="${i}" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${p[1]}"
        aria-label="Point ${i + 1} of ${pts.length}" aria-valuetext="${esc(fmtX(key, p[0]))} scores ${fmt1(p[1])}" transform="translate(${g.sx(p[0]).toFixed(1)} ${g.sy(p[1]).toFixed(1)})">
        <circle class="pt-hit" r="11"></circle><circle class="pt" r="4.5"></circle></g>`;
    });
    return out;
  }

  // Redraw the moving parts of one chart without rebuilding it, so a drag keeps its pointer capture.
  function updateCurveGraphics(card, key) {
    const pts = state.curves[key], g = curveGeom(key);
    const { line, area } = curvePaths(key, pts);
    card.querySelector('.curve').setAttribute('d', line);
    card.querySelector('.curve-area').setAttribute('d', area);
    card.querySelectorAll('.knot').forEach(k => {
      const p = pts[+k.dataset.i];
      k.setAttribute('transform', `translate(${g.sx(p[0]).toFixed(1)} ${g.sy(p[1]).toFixed(1)})`);
      k.setAttribute('aria-valuenow', p[1]);
      k.setAttribute('aria-valuetext', `${fmtX(key, p[0])} scores ${fmt1(p[1])}`);
    });
    card.querySelectorAll('.bike-dot').forEach(d => d.setAttribute('cy', g.sy(interp(pts, +d.dataset.v)).toFixed(1)));
    card.querySelector('[data-curve-input]').value = pointsText(pts);
  }

  // Keep point i inside the chart and strictly between its neighbours.
  function placePoint(key, i, v, s) {
    const m = CURVE_META[key], pts = state.curves[key];
    const lo = i > 0 ? pts[i - 1][0] + m.step : m.min;
    const hi = i < pts.length - 1 ? pts[i + 1][0] - m.step : m.max;
    v = Math.round(v / m.step) * m.step;
    v = Math.max(lo, Math.min(hi, v));
    s = Math.round(Math.max(0, Math.min(5, s)) / SCORE_STEP) * SCORE_STEP;
    pts[i] = [v, +s.toFixed(2)];
  }

  let signFrame = 0;
  function liveSign() {
    if (signFrame) return;
    signFrame = requestAnimationFrame(() => { signFrame = 0; renderSign(computeRows()); });
  }

  function commitCurve(key, focusIndex) {
    save();
    renderSign(computeRows());
    renderCurves();
    if (focusIndex != null) {
      const k = document.querySelector(`.curve-card[data-curve="${key}"] .knot[data-i="${focusIndex}"]`);
      if (k) k.focus();
    }
  }

  function attachCurveEditor(card) {
    const key = card.dataset.curve;
    const m = CURVE_META[key], g = curveGeom(key);
    const svg = card.querySelector('svg');
    const tip = card.querySelector('.curve-tip');
    const hoverLine = svg.querySelector('.hover-line');
    const toChart = (evt) => {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    };
    const showAt = (x) => {
      x = Math.max(g.X0, Math.min(g.X1, x));
      const v = Math.round(g.vx(x) / m.step) * m.step;
      hoverLine.setAttribute('x1', x); hoverLine.setAttribute('x2', x); hoverLine.setAttribute('visibility', 'visible');
      tip.textContent = `${fmtX(key, v)} → ${fmt1(interp(state.curves[key], v))}`;
    };
    let drag = null;
    let lastPress = null;
    let suppressDblUntil = 0;

    svg.addEventListener('pointermove', (evt) => {
      const loc = toChart(evt);
      if (drag) {
        drag.moved = true;
        lastPress = null;
        placePoint(key, drag.i, g.vx(loc.x - drag.dx), g.vy(loc.y - drag.dy));
        updateCurveGraphics(card, key);
        const p = state.curves[key][drag.i];
        hoverLine.setAttribute('visibility', 'hidden');
        tip.textContent = `Point ${drag.i + 1}: ${fmtX(key, p[0])} → ${fmt1(p[1])}`;
        liveSign();
        return;
      }
      if (evt.target.closest('.knot')) {
        const p = state.curves[key][+evt.target.closest('.knot').dataset.i];
        hoverLine.setAttribute('visibility', 'hidden');
        tip.textContent = `${fmtX(key, p[0])} → ${fmt1(p[1])}. Drag to move, double-click to remove.`;
      } else showAt(loc.x);
    });
    svg.addEventListener('pointerleave', () => { if (!drag) { hoverLine.setAttribute('visibility', 'hidden'); tip.textContent = ''; } });

    svg.addEventListener('pointerdown', (evt) => {
      const knot = evt.target.closest('.knot');
      if (!knot || evt.button !== 0) return;
      evt.preventDefault();
      knot.focus({ preventScroll: true });
      const i = +knot.dataset.i, p = state.curves[key][i], loc = toChart(evt);
      // Remember where on the point it was grabbed so it doesn't jump under the cursor.
      // Pointer capture retargets the browser's dblclick to the svg, so a
      // double-press on a point is detected here instead.
      const now = performance.now();
      if (lastPress && lastPress.i === i && now - lastPress.t < 450) {
        lastPress = null;
        suppressDblUntil = now + 600;
        const pts = state.curves[key];
        if (pts.length <= 2) { tip.textContent = 'A curve needs at least two points.'; return; }
        pts.splice(i, 1);
        commitCurve(key);
        return;
      }
      lastPress = { i, t: now };
      drag = { i, dx: loc.x - g.sx(p[0]), dy: loc.y - g.sy(p[1]), moved: false, pointerId: evt.pointerId };
      svg.setPointerCapture(evt.pointerId);
      svg.classList.add('dragging');
    });
    const endDrag = () => {
      if (!drag) return;
      const { i, moved, pointerId } = drag;
      drag = null;
      svg.classList.remove('dragging');
      try { svg.releasePointerCapture(pointerId); } catch (e) { /* already released */ }
      if (moved) commitCurve(key, i);
    };
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);

    svg.addEventListener('dblclick', (evt) => {
      if (performance.now() < suppressDblUntil || evt.target.closest('.knot')) return;
      const pts = state.curves[key];
      const loc = toChart(evt);
      const v = Math.round(g.vx(Math.max(g.X0, Math.min(g.X1, loc.x))) / m.step) * m.step;
      if (pts.some(p => Math.abs(p[0] - v) < m.step)) return;
      const s = Math.round(Math.max(0, Math.min(5, g.vy(loc.y))) / SCORE_STEP) * SCORE_STEP;
      pts.push([v, +s.toFixed(2)]);
      pts.sort((a, b) => a[0] - b[0]);
      commitCurve(key, pts.findIndex(p => p[0] === v));
    });

    svg.addEventListener('keydown', (evt) => {
      const knot = evt.target.closest('.knot');
      if (!knot) return;
      const i = +knot.dataset.i, pts = state.curves[key], p = pts[i];
      const big = evt.shiftKey ? 10 : 1;
      let v = p[0], s = p[1];
      switch (evt.key) {
        case 'ArrowLeft': v -= m.step * big; break;
        case 'ArrowRight': v += m.step * big; break;
        case 'ArrowUp': s += SCORE_STEP * (evt.shiftKey ? 5 : 1); break;
        case 'ArrowDown': s -= SCORE_STEP * (evt.shiftKey ? 5 : 1); break;
        case 'Delete': case 'Backspace':
          evt.preventDefault();
          if (pts.length > 2) { pts.splice(i, 1); commitCurve(key, Math.max(0, i - 1)); }
          return;
        default: return;
      }
      evt.preventDefault();
      placePoint(key, i, v, s);
      updateCurveGraphics(card, key);
      tip.textContent = `Point ${i + 1}: ${fmtX(key, pts[i][0])} → ${fmt1(pts[i][1])}`;
      save();
      liveSign();
    });
  }

  // ---------------------------------------------------------------- listings tab
  function pickedBikes() { return BIKES.filter(b => state.listingBikes[b.id]); }

  function renderListingControls() {
    $('#home-postcode').value = state.home.postcode;
    $('#radius').value = String(state.radius);
    $('#search-maxprice').value = state.searchMaxPrice;
    $('#home-status').textContent = `Distances are measured from ${state.home.label}.`;
    $('#listing-bikes').innerHTML = BIKES.filter(b => !b.reference || state.filters.showRef).map(b =>
      `<button type="button" class="chip" data-lbike="${b.id}" aria-pressed="${!!state.listingBikes[b.id]}">${state.starred[b.id] ? '★ ' : ''}${esc(b.make)} ${esc(b.model)}</button>`).join('');
    $$('.seg[data-range]').forEach(bt => bt.setAttribute('aria-pressed', String(+bt.dataset.range === state.mapRange)));
    $('#dealers-picked-only').checked = state.dealersPickedOnly;
    const sel = $('#lf-bike');
    const cur = sel.value;
    sel.innerHTML = BIKES.map(b => `<option value="${b.id}">${esc(b.make)} ${esc(b.model)}</option>`).join('');
    if (cur) sel.value = cur; else if (pickedBikes()[0]) sel.value = pickedBikes()[0].id;
  }

  function renderLinks() {
    const bikes = pickedBikes();
    const table = $('#links-table');
    if (!bikes.length) {
      table.innerHTML = '<tbody><tr><td class="empty">Pick one or more bikes above to build searches. “Shortlist” picks the bikes you starred.</td></tr></tbody>';
      return;
    }
    const opts = { postcode: state.home.postcode, radius: state.radius, maxPrice: state.searchMaxPrice };
    table.innerHTML = `<thead><tr><th scope="col">Bike</th><th scope="col">Search on</th></tr></thead><tbody>` + bikes.map(b => {
      const links = L.siteLinks(b, opts);
      return `<tr><td><strong>${esc(b.make)} ${esc(b.model)}</strong><div class="hint">${b.options.map(o => esc(o.label) + ' ~' + gbp(o.price)).join(' · ')}</div></td>
        <td><div class="site-links">${links.map(l => `<a class="site-link" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.site)}${l.note ? ` <small>${esc(l.note)}</small>` : ''}</a>`).join('')}</div></td></tr>`;
    }).join('') + '</tbody>';
  }

  function listingDistance(li) { return li.lat != null ? L.milesBetween(state.home, li) : null; }

  function renderSaved() {
    const table = $('#saved-table');
    const items = state.listings.map(li => Object.assign({ dist: listingDistance(li) }, li)).sort((a, b) => (a.dist ?? 1e9) - (b.dist ?? 1e9));
    if (!items.length) {
      table.innerHTML = '<tbody><tr><td class="empty">No saved listings yet. When you find an ad you like, add it above: it goes on the map and into this list, nearest first.</td></tr></tbody>';
      return items;
    }
    table.innerHTML = `<thead><tr><th scope="col">#</th><th scope="col">Bike</th><th scope="col">Price</th><th scope="col">Distance</th><th scope="col">Details</th><th scope="col"><span class="visually-hidden">Actions</span></th></tr></thead><tbody>` +
      items.map((li, i) => {
        const b = BIKE_BY_ID[li.bikeId];
        return `<tr>
          <td><span class="num-badge">${i + 1}</span></td>
          <td><strong>${b ? esc(b.make + ' ' + b.model) : 'Unknown'}</strong>${li.year ? `<div class="hint">${esc(li.year)}${li.miles ? ' · ' + Number(li.miles).toLocaleString('en-GB') + ' mi' : ''}</div>` : ''}</td>
          <td class="price">${gbp(li.price)}<small>${esc(li.seller)}</small></td>
          <td><span class="dist">${li.dist != null ? Math.round(li.dist) + ' mi' : '?'}</span><div class="hint">${esc(li.whereLabel || li.where)}</div></td>
          <td>${li.url ? `<a href="${esc(li.url)}" target="_blank" rel="noopener noreferrer">Open ad</a>` : ''}${li.notes ? `<div class="hint">${esc(li.notes)}</div>` : ''}</td>
          <td><div class="row-actions">
            <button type="button" class="link-btn" data-use-price="${li.id}" title="Use this price for the bike in the Compare table">Use price</button>
            <button type="button" class="link-btn" data-del-listing="${li.id}">Remove</button></div></td>
        </tr>`;
      }).join('') + '</tbody>';
    return items;
  }

  function dealerRows() {
    const brands = new Set(pickedBikes().map(b => b.make));
    return DEALERS.map(d => Object.assign({ dist: L.milesBetween(state.home, d), hit: d.brands.some(x => brands.has(x)) }, d))
      .filter(d => !state.dealersPickedOnly || d.hit || (brands.size === 0))
      .sort((a, b) => a.dist - b.dist);
  }

  function renderDealers() {
    const rows = dealerRows();
    const brands = new Set(pickedBikes().map(b => b.make));
    $('#dealers-table').innerHTML = `<thead><tr><th scope="col">Distance</th><th scope="col">Dealer</th><th scope="col">Brands</th><th scope="col">Test rides</th><th scope="col">Directions</th></tr></thead><tbody>` +
      rows.map(d => `<tr>
        <td class="dist">${Math.round(d.dist)} mi</td>
        <td><a href="${esc(d.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(d.name)}</strong></a><div class="hint">${esc(d.address)}</div>${d.phone ? `<div class="hint">Tel ${esc(d.phone)}</div>` : ''}</td>
        <td><div class="brand-list">${d.brands.map(x => `<span class="tag${brands.has(x) ? ' hit' : ''}">${esc(x)}</span>`).join('')}</div></td>
        <td>${esc(d.testRide)}</td>
        <td><a href="https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(state.home.lat + ',' + state.home.lng)}&destination=${encodeURIComponent(d.lat + ',' + d.lng)}" target="_blank" rel="noopener noreferrer">Route</a></td>
      </tr>`).join('') + '</tbody>';
    const locs = window.MOTO_LOCATORS;
    const wanted = brands.size ? Array.from(brands) : Object.keys(locs);
    $('#locators').innerHTML = 'Official dealer finders: ' + wanted.filter(b => locs[b]).map(b => `<a href="${esc(locs[b])}" target="_blank" rel="noopener noreferrer">${esc(b)}</a>`).join(' · ');
  }

  function renderMapNow(savedSorted) {
    const brands = new Set(pickedBikes().map(b => b.make));
    const points = [];
    for (const d of DEALERS) {
      const hit = d.brands.some(x => brands.has(x));
      if (state.dealersPickedOnly && brands.size && !hit) continue;
      points.push({ kind: hit ? 'dealer' : 'dealer-dim', lat: d.lat, lng: d.lng, label: d.name,
        html: `<strong>${esc(d.name)}</strong>${esc(d.brands.join(', '))}<br>${Math.round(L.milesBetween(state.home, d))} miles · <a href="${esc(d.url)}" target="_blank" rel="noopener noreferrer">Website</a>` });
    }
    (savedSorted || []).forEach((li, i) => {
      if (li.lat == null) return;
      const b = BIKE_BY_ID[li.bikeId];
      points.push({ kind: 'listing', lat: li.lat, lng: li.lng, n: i + 1, label: `Listing ${i + 1}`,
        html: `<strong>${i + 1}. ${b ? esc(b.make + ' ' + b.model) : ''}</strong>${gbp(li.price)} · ${esc(li.whereLabel || li.where)}<br>${Math.round(li.dist)} miles${li.url ? ` · <a href="${esc(li.url)}" target="_blank" rel="noopener noreferrer">Open ad</a>` : ''}` });
    });
    L.renderMap($('#map'), $('#map-tip'), state.home, state.mapRange, points);
  }

  function renderListingsTab() {
    renderListingControls();
    renderLinks();
    const saved = renderSaved();
    renderDealers();
    renderMapNow(saved);
  }

  // ---------------------------------------------------------------- about
  function renderBackup() { $('#backup-text').value = JSON.stringify(state, null, 1); }

  // ---------------------------------------------------------------- tabs & render
  function setTab(tab) {
    state.tab = tab;
    $$('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    $$('.tabpanel').forEach(p => { p.hidden = p.id !== 'tab-' + tab; });
    renderTab();
    save();
  }
  function renderTab() {
    if (state.tab === 'compare') renderTable();
    else if (state.tab === 'scoring') { renderFormula(); renderCurves(); }
    else if (state.tab === 'listings') renderListingsTab();
    else if (state.tab === 'about') renderBackup();
  }
  function renderAll() {
    renderWeights();
    renderFilters();
    $('#penalty').innerHTML = Object.entries(PENALTY).map(([k, v]) => `<option value="${k}"${k === state.penalty ? ' selected' : ''}>${esc(v.label)}</option>`).join('');
    renderSign(computeRows());
    setTab(state.tab);
  }

  // ---------------------------------------------------------------- events
  function changed(opts) {
    save();
    if (opts && opts.weights) renderWeights();
    if (opts && opts.filters) renderFilters();
    renderTab();
    if (state.tab !== 'compare') renderSign(computeRows());
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, [data-bike], label.opt-item');
    if (!t) return;
    const d = t.dataset;
    if (d.tab) { setTab(d.tab); return; }
    if (d.goto) {
      Object.keys(expanded).forEach(k => delete expanded[k]);
      expanded[d.goto] = true;
      setTab('compare');
      const row = document.querySelector(`tr.row[data-bike="${d.goto}"]`);
      if (row) row.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      return;
    }
    if (d.preset) { state.preset = d.preset; state.weights = clone(presetWeights(d.preset)); changed({ weights: true }); return; }
    if (d.sort) {
      if (state.sort.key === d.sort) state.sort.dir *= -1;
      else state.sort = { key: d.sort, dir: d.sort === 'name' || d.sort === 'price' || d.sort === 'kg' ? 1 : -1 };
      changed(); return;
    }
    if (d.star) { state.starred[d.star] = !state.starred[d.star]; if (!state.starred[d.star]) delete state.starred[d.star]; changed(); return; }
    if (d.hide) { state.hidden[d.hide] = !state.hidden[d.hide]; if (!state.hidden[d.hide]) delete state.hidden[d.hide]; changed(); return; }
    if (d.unpick) { delete state.picks[d.unpick]; changed(); return; }
    if (d.find) {
      state.listingBikes = { [d.find]: true };
      setTab('listings');
      $('#lf-bike').value = d.find;
      window.scrollTo({ top: 0 });
      return;
    }
    if (d.lbike) { state.listingBikes[d.lbike] = !state.listingBikes[d.lbike]; if (!state.listingBikes[d.lbike]) delete state.listingBikes[d.lbike]; changed(); return; }
    if (d.range) { state.mapRange = +d.range; changed(); return; }
    if (d.curveReset) { state.curves[d.curveReset] = clone(DEFAULT_CURVES[d.curveReset]); changed(); return; }
    if (d.delListing) { state.listings = state.listings.filter(l => l.id !== d.delListing); changed(); return; }
    if (d.usePrice) {
      const li = state.listings.find(l => l.id === d.usePrice);
      if (li) { (state.overrides[li.bikeId] = state.overrides[li.bikeId] || {}).price = +li.price; changed(); }
      return;
    }
    if (t.matches('tr.row')) {
      if (e.target.closest('select, input, a, button')) return;
      expanded[d.bike] = !expanded[d.bike];
      renderTable();
    }
  });

  document.addEventListener('keydown', (e) => {
    const row = e.target.closest && e.target.closest('tr.row');
    if (row && e.target === row && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      expanded[row.dataset.bike] = !expanded[row.dataset.bike];
      renderTable();
    }
  });

  document.addEventListener('input', (e) => {
    const t = e.target, d = t.dataset;
    if (t.id === 'power-knee' || t.id === 'rev-k') {
      if (t.id === 'power-knee') { state.powerKnee = +t.value; $('#power-knee-out').textContent = t.value + ' bhp'; }
      else { state.revK = +t.value; $('#rev-k-out').textContent = t.value; }
      renderFormula(); liveSign(); save();
      return;
    }
    if (d.w) {
      // Any edit lands in Custom: starting from a preset copies its weights first.
      state.weights[d.w] = +t.value;
      state.customWeights = clone(state.weights);
      if (state.preset !== 'custom') {
        state.preset = 'custom';
        $$('#presets .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.preset === 'custom')));
      }
      const row = t.closest('.w-row');
      row.querySelector('.w-val').textContent = t.value;
      const total = CRITERIA.reduce((s, c) => s + (state.weights[c.key] || 0), 0) || 1;
      $$('.w-row').forEach((r, i) => { r.querySelector('.w-share').textContent = Math.round((state.weights[CRITERIA[i].key] || 0) / total * 100) + '%'; r.classList.toggle('zero', !state.weights[CRITERIA[i].key]); });
      save(); renderTab(); if (state.tab !== 'compare') renderSign(computeRows());
      return;
    }
    if (d.min) {
      state.filters.mins[d.min] = +t.value;
      const out = t.previousElementSibling && t.previousElementSibling.querySelector('output');
      if (out) out.textContent = +t.value ? fmt1(+t.value) : 'any';
      const n = Object.values(state.filters.mins).filter(v => v > 0).length;
      $('#min-count').textContent = n ? n : '';
      changed(); return;
    }
    if (d.note) { state.notes[d.note] = t.value; if (!t.value) delete state.notes[d.note]; save(); return; }
    switch (t.id) {
      case 'f-q': state.filters.q = t.value; changed(); break;
      case 'f-maxprice': state.filters.maxPrice = +t.value; $('#f-maxprice-out').textContent = +t.value >= 13000 ? 'any' : gbp(+t.value); if (+t.value >= 13000) state.filters.maxPrice = 1e9; changed(); break;
      case 'f-maxhp': state.filters.maxHp = +t.value; $('#f-maxhp-out').textContent = +t.value >= 100 ? 'any' : t.value + ' bhp'; changed(); break;
    }
  });

  document.addEventListener('change', (e) => {
    const t = e.target, d = t.dataset;
    if (d.opt) { state.picks[d.opt] = t.value; changed(); return; }
    if (d.optRadio) { state.picks[d.optRadio] = t.value; changed(); return; }
    if (d.ov) {
      const o = state.overrides[d.ov] = state.overrides[d.ov] || {};
      const v = t.value === '' ? null : +t.value;
      if (v === null || !isFinite(v)) delete o[d.key];
      else o[d.key] = d.key === 'price' ? Math.max(0, v) : Math.max(0, Math.min(5, v));
      if (!Object.keys(o).length) delete state.overrides[d.ov];
      changed(); return;
    }
    if (d.curveInput) {
      const status = document.querySelector(`[data-curve-status="${d.curveInput}"]`);
      const pts = t.value.split(',').map(s => s.trim()).filter(Boolean).map(s => s.split(':').map(Number));
      if (pts.length < 2 || pts.some(p => p.length !== 2 || !p.every(isFinite) || p[1] < 0 || p[1] > 5)) {
        status.textContent = 'Use pairs like 4000:4.8, 8000:2.9 with scores from 0 to 5.';
        return;
      }
      state.curves[d.curveInput] = pts.sort((a, b) => a[0] - b[0]);
      changed(); return;
    }
    switch (t.id) {
      case 'penalty': state.penalty = t.value; changed(); break;
      case 'f-mode': state.optionMode = t.value; state.picks = {}; changed(); break;
      case 'f-cond': state.filters.cond = t.value; changed(); break;
      case 'f-starred': state.filters.starredOnly = t.checked; changed(); break;
      case 'f-showhidden': state.filters.showHidden = t.checked; changed(); break;
      case 'f-showref': state.filters.showRef = t.checked; changed(); break;
      case 'f-private': state.usedPrivate = t.checked; changed(); break;
      case 'radius': state.radius = +t.value; changed(); break;
      case 'search-maxprice': state.searchMaxPrice = +t.value || 0; changed(); break;
      case 'power-knee': state.powerKnee = +t.value; changed(); break;
      case 'rev-k': state.revK = +t.value; changed(); break;
      case 'dealers-picked-only': state.dealersPickedOnly = t.checked; changed(); break;
      case 'home-postcode': setHome(t.value); break;
    }
  });

  // Back to Balanced; the Custom set is kept.
  $('#weights-reset').addEventListener('click', () => { state.preset = 'default'; state.weights = clone(DEFAULT_WEIGHTS); state.penalty = 'mild'; renderAll(); save(); });
  $('#search-setup').addEventListener('submit', (e) => { e.preventDefault(); setHome($('#home-postcode').value); });
  $('#pick-starred').addEventListener('click', () => { state.listingBikes = Object.fromEntries(Object.keys(state.starred).map(k => [k, true])); changed(); });
  $('#pick-top5').addEventListener('click', () => {
    const top = computeRows().filter(r => !r.bike.reference && passesFilters(r)).sort((a, b) => b.ev.overall - a.ev.overall).slice(0, 5);
    state.listingBikes = Object.fromEntries(top.map(r => [r.bike.id, true])); changed();
  });
  $('#pick-none').addEventListener('click', () => { state.listingBikes = {}; changed(); });

  async function setHome(text) {
    const status = $('#home-status');
    status.textContent = 'Looking up…';
    const g = await L.geocode(text);
    if (!g) { status.textContent = `Couldn’t find “${text}”. Try a postcode like CB2 1TN, a district like CB4, or a town name.`; return; }
    const pc = L.normPostcode(text) || (/^[A-Z]{1,2}\d[A-Z\d]?$/i.test(text.trim()) ? text.trim().toUpperCase() : state.home.postcode);
    state.home = { postcode: pc, lat: g.lat, lng: g.lng, label: g.label };
    changed();
  }

  $('#listing-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = $('#lf-status');
    const where = $('#lf-where').value.trim();
    status.textContent = 'Finding the location…';
    const g = await L.geocode(where);
    const li = {
      id: 'l' + Date.now().toString(36),
      bikeId: $('#lf-bike').value,
      url: $('#lf-url').value.trim(),
      price: +$('#lf-price').value,
      year: $('#lf-year').value,
      miles: $('#lf-miles').value,
      where,
      whereLabel: g ? g.label : where,
      lat: g ? g.lat : null,
      lng: g ? g.lng : null,
      seller: $('#lf-seller').value,
      notes: $('#lf-notes').value.trim()
    };
    state.listings.push(li);
    status.textContent = g ? `Saved. ${Math.round(L.milesBetween(state.home, g))} miles away.` : `Saved, but “${where}” wasn’t recognised, so it isn’t on the map. Try a postcode district like PE19.`;
    ['#lf-url', '#lf-price', '#lf-year', '#lf-miles', '#lf-where', '#lf-notes'].forEach(s => { $(s).value = ''; });
    changed();
  });

  $('#backup-copy').addEventListener('click', async () => {
    const ta = $('#backup-text');
    ta.value = JSON.stringify(state, null, 1);
    try { await navigator.clipboard.writeText(ta.value); $('#backup-status').textContent = 'Copied.'; }
    catch (err) { ta.select(); $('#backup-status').textContent = 'Selected. Press Ctrl+C or ⌘C to copy.'; }
  });
  $('#backup-import').addEventListener('click', () => {
    try {
      state = mergeState(JSON.parse($('#backup-text').value));
      save(); renderAll();
      $('#backup-status').textContent = 'Loaded.';
    } catch (err) { $('#backup-status').textContent = 'That isn’t valid backup data. Paste the whole block, starting with {.'; }
  });
  let resetArmed = false;
  $('#backup-reset').addEventListener('click', (e) => {
    if (!resetArmed) { resetArmed = true; e.target.textContent = 'Click again to erase everything'; setTimeout(() => { resetArmed = false; e.target.textContent = 'Reset everything'; }, 4000); return; }
    state = clone(DEFAULT_STATE);
    save(); renderAll();
    $('#backup-status').textContent = 'Reset to defaults.';
  });

  // Legend swatches
  $$('.legend-scale i').forEach(i => { i.setAttribute('style', scoreStyle(+i.style.getPropertyValue('--s'))); });

  // Tab rows are focusable for keyboard users
  new MutationObserver(() => { $$('tr.row').forEach(r => { if (!r.hasAttribute('tabindex')) r.setAttribute('tabindex', '0'); }); })
    .observe($('#bikes-tbody'), { childList: true });

  renderAll();
})();
