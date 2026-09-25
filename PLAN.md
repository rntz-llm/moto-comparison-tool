# Motorbike comparison tool: plan

## Goal
A static website (no build step, served by `python3 -m http.server` like the
existing setup) for choosing the next bike: a sortable/filterable table of
candidate bikes, per-criterion scores (objective ones computed, subjective
ones researched and justified), and an overall 0–10 score from adjustable
weights. Bonus: listing search for chosen bikes plus a map of dealers and
saved listings, sorted by distance from Cambridge.

## Decisions (made without asking; easy to change later)

**New vs used.** One row per *model*, and each model has one or more
*options*: e.g. "New 2025 (dealer)", "Used 2021–24", "Used 2016–20 (older
generation)". Each row has a dropdown to pick which option you're
considering. A global control sets the default: "best-scoring option",
"cheapest", "new only" or "used only". An option carries price range,
year range, and adjustments to reliability (age/mileage risk) and
test-ride availability (private sale = easy; dealer = depends on brand's
demo fleet). An option can also override specs where generations differ.

**Criteria (each 0–5, each with an adjustable weight):**
| Criterion | Type | Source |
|---|---|---|
| Price | computed | on-the-road price (incl. estimated dealer fees/PDI) through a piecewise curve matching your £4k / £8k / £12k thresholds |
| Running costs | researched | insurance, servicing intervals, fuel economy, consumables, chain vs shaft |
| Power | computed | peak hp through a curve (sweet spot 35–70hp) with an adjustment for how aggressive the power delivery is |
| Tall-rider comfort | subjective | ergonomics for 6'4" / 34" inseam, seat, 2h+ comfort |
| Highway manners | subjective | 75mph comfort, stability, vibration, wind protection |
| Standing ergonomics | subjective | bar height/reach when standing |
| Fun factor | subjective | twisties, character, sound, rev-happiness |
| Reliability & maintenance | researched | reputation, service burden, parts availability, adjusted per option (age) |
| Weight & confidence | computed | wet weight curve (too light = nervous, >272kg / 600lb = worrying) |
| Luggage & touring | subjective | rack/pannier options, touring capacity |
| Test-ride access | researched | per option (used private vs dealer demo policies) |
| Green-laning | subjective | low default weight |

**Overall score.** Weighted mean of criteria (0–5), doubled to give 0–10. A "weak-spot
penalty" control switches between a plain weighted mean and a generalized
(power) mean so that one terrible score drags the total down more.
Hard limits (max price, hp range) are filters, not scores.

**Your own adjustments.** You can override any subjective score for any
bike (e.g. after a test ride), star bikes to a shortlist, hide bikes, and
add notes. Stored in browser localStorage; export/import as JSON.

**Listings (bonus).** Scraping AutoTrader/Facebook etc. isn't practical
from a static page (CORS, bot protection, ToS), so instead:
1. For each selected bike, generate pre-filled search links for AutoTrader,
   eBay, Gumtree, Facebook Marketplace and MCN (postcode, radius, max
   price, sorted by distance where supported). Craigslist is effectively
   unused in the UK; Gumtree is the equivalent.
2. A saved-listings tracker: paste a listing's URL, price and postcode or
   town; it geocodes with postcodes.io (free, no key) and shows everything
   on a map and in a table sorted by distance from home.
3. A dealer directory for the brands on the list near Cambridge, on the
   same map, with distance and notes on demo/test-ride policy.

## Files
- `index.html`: app shell (replaces the hello-world page)
- `css/styles.css`
- `js/data/bikes.js`: bike data, specs, options, subjective scores + rationale
- `js/data/dealers.js`: dealers with coordinates
- `js/scoring.js`: curves and the overall formula
- `js/app.js`: table, filters, sorting, weights, overrides
- `js/listings.js`: search links, tracker, map
- `README.md`: how to run it, how prices/scores were estimated, sources

## Steps
1. Research candidate list, UK prices (new + used), specs, reputations.
2. Research dealers near Cambridge and demo policies.
3. Build scoring + data files.
4. Build UI; test in headless Chromium.
5. Commit and push; publish a viewable copy.
