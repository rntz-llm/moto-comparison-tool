# Next Bike Shortlist

A static site for choosing a motorbike: 35 candidate bikes in a sortable,
filterable table, scored 0–5 on twelve criteria, with an overall score
from weights you set. It also builds listing searches and shows dealers
and saved listings on a map, sorted by distance from home (Cambridge by
default).

## Run it

No build step. Serve the folder and open `index.html`:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

(See `TAILSCALE_SETUP.md` for reaching it from other devices.) Opening
`index.html` straight from disk also works.

## What's where

| File | Contents |
|---|---|
| `js/data/bikes.js` | The bikes: specs, researched scores with a reason for each, and buying options (new / used generations) with prices |
| `js/data/dealers.js` | Dealers near Cambridge, with brands, coordinates and test-ride notes |
| `js/scoring.js` | Criteria, default weights, the price / power / weight curves, and the overall formula |
| `js/app.js` | Table, filters, weights, overrides, tabs |
| `js/listings.js` | Search-link builder, geocoding, SVG map |
| `js/data/geo.js` | Generated: coastline, postcode districts and towns (see below) |
| `PLAN.md` | The design decisions this was built from |

To add a bike, copy an entry in `bikes.js`. To change how price, power or
weight score, drag the curve's points in the Scoring tab (double-click to
add or remove a point; saved in your browser), or edit the defaults in
`scoring.js`.

## How scoring works

- **Price, power, weight** are computed through curves. Price is flat below
  about £4k, steady from £4–8k and steep from £8–12k. Power peaks at
  40–70bhp; above 70, a relaxed engine counts as less powerful and a punchy
  one as more. Weight peaks at 185–230kg and falls away towards 272kg
  (600lb).
- **Comfort, motorway manners, standing position, fun, reliability, running
  costs, luggage, green-laning** are researched judgements with a one-line
  reason each. Override any of them per bike after a test ride.
- **Test-ride access** depends on the option: dealer demo fleets and
  distance for new bikes, how common the bike is for used.
- **Overall** is a weighted mean, or a weighted power mean when the
  weak-spot penalty is on (so one bad score costs more).

## Data sources

Prices and specs were checked in September 2026 against manufacturer UK
sites, dealer adverts, AutoTrader used listings, and reviews from MCN,
Bennetts BikeSocial and Visordown. New prices are on-the-road; used prices
are typical dealer asking prices for tidy bikes. They are estimates to
check, not quotes.

`js/data/geo.js` is built by `tools/build_geodata.js` from:
- Natural Earth land polygons (public domain), via the `world-atlas` npm package
- UK postcode district centroids from OS Code-Point Open (Open Government
  Licence), via github.com/Gibbs/uk-postcodes
- GeoNames GB place names (CC BY 4.0)

## Listing search

The site doesn't scrape listing sites (AutoTrader, Facebook and others
block it and forbid it). It builds pre-filled searches on AutoTrader,
eBay, Gumtree, Facebook Marketplace, MCN and Bikes in Stock instead, and
lets you save listings you find. Saved listings are geocoded from the
postcode or town you enter and plotted with the dealers.

## Publishing a single-file copy

`python3 tools/build_artifact.py` inlines everything into
`dist/next-bike-shortlist.html`.
