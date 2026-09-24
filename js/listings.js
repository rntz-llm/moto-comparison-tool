// Listing searches, geocoding and the distance map. No external services are
// required: places resolve from the embedded postcode-district/town gazetteer,
// falling back to postcodes.io when the page is allowed to reach it.
(function () {
  'use strict';
  const GEO = window.MOTO_GEO;
  const MI_PER_DEG = 69.05;

  function milesBetween(a, b) {
    const R = 3958.8, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  const FULL_PC = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/;
  const OUTCODE = /^[A-Z]{1,2}\d[A-Z\d]?$/;

  function normPostcode(text) {
    const t = String(text || '').toUpperCase().replace(/\s+/g, ' ').trim();
    const m = t.replace(/\s/g, '').match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/);
    return m ? m[1] + ' ' + m[2] : null;
  }

  const townKey = s => String(s).toLowerCase().replace(/\bsaint\b/g, 'st').replace(/[^a-z]/g, '');
  const townIndex = (() => {
    const idx = {};
    for (const name of Object.keys(GEO.towns)) {
      const k = townKey(name);
      if (!idx[k] || (GEO.towns[name][2] || 0) > (GEO.towns[idx[k]][2] || 0)) idx[k] = name;
    }
    return idx;
  })();
  const townPop = name => GEO.towns[name][2] || 0;
  function findTown(text) {
    const key = townKey(String(text).replace(/,.*$/, ''));
    if (key.length < 3) return null;
    if (townIndex[key]) return townIndex[key];
    return Object.keys(townIndex).filter(k => k.startsWith(key)).map(k => townIndex[k]).sort((a, b) => townPop(b) - townPop(a))[0] || null;
  }

  // Synchronous lookup against the embedded data.
  function geocodeLocal(text) {
    const raw = String(text || '').trim();
    if (!raw) return null;
    const ll = raw.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (ll) return { lat: +ll[1], lng: +ll[2], label: raw, precision: 'exact' };
    const up = raw.toUpperCase().replace(/\s+/g, ' ');
    const compact = up.replace(/\s/g, '');
    const full = compact.match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/);
    const out = full ? full[1] : (OUTCODE.test(compact) ? compact : null);
    if (out && GEO.outcodes[out]) {
      const [lat, lng] = GEO.outcodes[out];
      return { lat, lng, label: full ? normPostcode(compact) : out, precision: 'district' };
    }
    const name = findTown(raw);
    if (name) { const [lat, lng] = GEO.towns[name]; return { lat, lng, label: name, precision: 'town' }; }
    return null;
  }

  // Async: tries postcodes.io for a precise full postcode or a village name,
  // then falls back to the embedded data. Never throws.
  async function geocode(text) {
    const local = geocodeLocal(text);
    const pc = normPostcode(text);
    try {
      if (pc) {
        const r = await fetch('https://api.postcodes.io/postcodes/' + encodeURIComponent(pc), { signal: AbortSignal.timeout(4000) });
        if (r.ok) {
          const j = await r.json();
          if (j.result) return { lat: j.result.latitude, lng: j.result.longitude, label: pc, precision: 'exact' };
        }
      } else if (!local) {
        const r = await fetch('https://api.postcodes.io/places?limit=5&q=' + encodeURIComponent(String(text).trim()), { signal: AbortSignal.timeout(4000) });
        if (r.ok) {
          const j = await r.json();
          const hit = (j.result || []).find(p => p.country === 'England' || p.country === 'Wales' || p.country === 'Scotland');
          if (hit) return { lat: hit.latitude, lng: hit.longitude, label: hit.name_1 + (hit.county_unitary ? ', ' + hit.county_unitary : ''), precision: 'town' };
        }
      }
    } catch (e) { /* offline or blocked: use the embedded data */ }
    return local;
  }

  // ---------- listing-site searches ----------
  const enc = encodeURIComponent;
  function siteLinks(bike, opts) {
    const pc = (opts.postcode || 'CB21TN').replace(/\s/g, '');
    const r = opts.radius || 50;
    const max = opts.maxPrice || '';
    const s = bike.search;
    const queries = [s.q].concat(s.alt || []);
    const links = [];
    links.push({ site: 'AutoTrader', url: `https://www.autotrader.co.uk/bike-search?postcode=${pc}&radius=${r}&make=${enc(s.at[0])}&model=${enc(s.at[1])}${max ? '&price-to=' + max : ''}&sort=distance`, note: 'by distance' });
    links.push({ site: 'AutoTrader', url: `https://www.autotrader.co.uk/bikes/motorcycles/${s.slug}`, note: 'model page' });
    for (const q of queries) {
      links.push({ site: 'eBay', url: `https://www.ebay.co.uk/sch/422/i.html?_nkw=${enc(q)}&_stpos=${pc}&_sadis=${r}&_sop=7${max ? '&_udhi=' + max : ''}`, note: queries.length > 1 ? q.replace(bike.make, '').trim() : 'nearest first' });
      links.push({ site: 'Gumtree', url: `https://www.gumtree.com/search?search_category=motorbikes-scooters&q=${enc(q)}&search_location=${pc}&distance=${r}${max ? '&max_price=' + max : ''}`, note: queries.length > 1 ? q.replace(bike.make, '').trim() : '' });
      links.push({ site: 'Facebook', url: `https://www.facebook.com/marketplace/search/?query=${enc(q)}${max ? '&maxPrice=' + max : ''}`, note: queries.length > 1 ? q.replace(bike.make, '').trim() : '' });
    }
    links.push({ site: 'MCN', url: `https://www.motorcyclenews.com/bikes-for-sale/${s.slug}/`, note: '' });
    links.push({ site: 'Bikes in Stock', url: `https://www.bikesinstock.co.uk/bikes-for-sale/${s.slug}`, note: 'dealer stock' });
    return links;
  }

  // ---------- map ----------
  const REF_TOWNS = ['Cambridge', 'Peterborough', 'Bedford', 'Ipswich', 'Norwich', 'Chelmsford', "King's Lynn", 'Colchester',
    'Northampton', 'Huntingdon', 'Ely', 'Bury St Edmunds', 'Luton', 'Stevenage', 'Newmarket', 'Saffron Walden', 'Milton Keynes',
    'Leicester', 'London', 'St Neots', 'Great Yarmouth', 'Oxford', 'Lincoln', 'Southend-on-Sea'];

  function project(home, p) {
    return [(p.lng - home.lng) * MI_PER_DEG * Math.cos(home.lat * Math.PI / 180), -(p.lat - home.lat) * MI_PER_DEG];
  }

  const landCache = {};
  function landPath(home) {
    const key = home.lat.toFixed(3) + ',' + home.lng.toFixed(3);
    if (landCache[key]) return landCache[key];
    const d = GEO.land.map(ring => ring.map(([lng, lat], i) => {
      const [x, y] = project(home, { lat, lng });
      return (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2);
    }).join('') + 'Z').join('');
    return (landCache[key] = d);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // points: [{kind:'dealer'|'dealer-dim'|'listing', lat, lng, label, html, n}]
  function renderMap(svg, tip, home, range, points) {
    const R = range;
    const u = R / 150; // unit so marks keep a constant on-screen size
    svg.setAttribute('viewBox', `${-R} ${-R} ${2 * R} ${2 * R}`);
    const parts = [];
    parts.push(`<rect x="${-R * 2}" y="${-R * 2}" width="${R * 4}" height="${R * 4}" fill="transparent"></rect>`);
    parts.push(`<path class="land" d="${landPath(home)}"></path>`);
    const rings = [10, 25, 50, 75, 100, 150].filter(m => m < R * 1.05);
    for (const m of rings) {
      parts.push(`<circle class="ring" cx="0" cy="0" r="${m}"></circle>`);
      parts.push(`<text class="ring-label" x="${(m * 0.707 + 1.5 * u).toFixed(2)}" y="${(-m * 0.707 - 1.5 * u).toFixed(2)}" font-size="${(7 * u).toFixed(2)}">${m} mi</text>`);
    }
    for (const name of REF_TOWNS) {
      const t = GEO.towns[townIndex[townKey(name)]];
      if (!t) continue;
      const [x, y] = project(home, { lat: t[0], lng: t[1] });
      if (Math.abs(x) > R * 0.96 || Math.abs(y) > R * 0.96 || Math.hypot(x, y) < 4 * u) continue;
      // Skip towns sitting on top of a marker; the marker's tooltip names the place.
      if (points.some(p => { const [px, py] = project(home, p); return Math.hypot(px - x, py - y) < 5 * u; })) continue;
      parts.push(`<circle class="town-dot" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(1.4 * u).toFixed(2)}"></circle>`);
      parts.push(`<text class="town" x="${(x + 2.6 * u).toFixed(2)}" y="${(y + 2.8 * u).toFixed(2)}" font-size="${(7.5 * u).toFixed(2)}">${esc(name)}</text>`);
    }
    const order = { 'dealer-dim': 0, dealer: 1, listing: 2 };
    const sorted = points.slice().sort((a, b) => order[a.kind] - order[b.kind]);
    sorted.forEach((p, i) => {
      const [x, y] = project(home, p);
      if (Math.abs(x) > R * 1.1 || Math.abs(y) > R * 1.1) return;
      const cx = x.toFixed(2), cy = y.toFixed(2);
      if (p.kind === 'listing') {
        parts.push(`<circle class="listing" cx="${cx}" cy="${cy}" r="${(7 * u).toFixed(2)}"></circle>`);
        parts.push(`<text class="listing-label" x="${cx}" y="${(y + 3.3 * u).toFixed(2)}" font-size="${(9 * u).toFixed(2)}" text-anchor="middle">${p.n}</text>`);
      } else {
        const s = 9 * u;
        parts.push(`<rect class="dealer${p.kind === 'dealer-dim' ? ' dim' : ''}" x="${(x - s / 2).toFixed(2)}" y="${(y - s / 2).toFixed(2)}" width="${s.toFixed(2)}" height="${s.toFixed(2)}" rx="${(1.5 * u).toFixed(2)}"></rect>`);
      }
      parts.push(`<circle class="hit" data-i="${i}" cx="${cx}" cy="${cy}" r="${(11 * u).toFixed(2)}" tabindex="0" role="button" aria-label="${esc(p.label)}"></circle>`);
    });
    const hs = 7 * u;
    parts.push(`<path class="home" d="M0 ${-hs}L${hs} 0L0 ${hs}L${-hs} 0Z"></path>`);
    svg.innerHTML = parts.join('');

    const show = (el) => {
      const p = sorted[+el.dataset.i];
      tip.innerHTML = p.html;
      tip.hidden = false;
      const box = svg.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const left = r.left - box.left + r.width / 2;
      const top = r.top - box.top + r.height;
      tip.style.left = Math.max(4, Math.min(left - 120, box.width - 244)) + 'px';
      tip.style.top = Math.min(top + 4, box.height - 10) + 'px';
    };
    svg.querySelectorAll('.hit').forEach(el => {
      el.addEventListener('mouseenter', () => show(el));
      el.addEventListener('focus', () => show(el));
      el.addEventListener('click', (e) => { e.stopPropagation(); show(el); });
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(el); } });
    });
    svg.onclick = () => { tip.hidden = true; };
  }

  window.MotoListings = { milesBetween, geocode, geocodeLocal, normPostcode, siteLinks, renderMap, esc };
})();
