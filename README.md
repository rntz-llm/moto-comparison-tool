# Next Bike Shortlist

A static site for choosing a motorbike: 40 candidate bikes in a sortable,
filterable table, scored 0–5 on thirteen criteria plus ABS (yes/no), with an overall score
out of 10 from weights you set. It also builds listing searches and shows dealers
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

- **Price, power, weight** are computed through curves (points are
  value:score):
  - Price: £2,000:5, £4,500:4.5, £8,000:3, £11,000:0
  - Power: 20:2, 40:5, 60:5, 80:3.5, 100:0 (bhp). Above 70bhp, a relaxed
    engine counts as less powerful and a punchy one as more.
  - Wet weight: 140:2.5, 180:5, 200:5, 300:0 (kg)
- **Tall-rider fit** is computed from the knee angle a 6′4″ rider with a 34″
  inseam gets on each bike (from its seat, peg and bar positions), through an
  editable curve: 60°:0, 68°:1.5, 74°:3, 78°:4, 84–100°:5, 115°:3, 130°:1.5.
  A hip angle under 105° costs 0.15 per degree and forward lean over 8° costs
  0.1 per degree.
- **Seat & ride comfort, motorway manners, standing position, fun,
  reliability, running costs, luggage, green-laning** are researched judgements with a one-line
  reason each. Override any of them per bike after a test ride.
- **ABS** is yes/no per buying option (5 or 0), with 2.5 where it was an
  optional extra; mark the bike you find in its detail panel. It has a
  weight like everything else.
- **Test-ride access** depends on the option: dealer demo fleets and
  distance for new bikes, how common the bike is for used.
- **Overall** is a weighted mean of the criterion scores, or a weighted
  power mean when the weak-spot penalty is on (so one bad score costs
  more), doubled to run 0–10.

## Data sources

Prices and specs were checked in September 2026 against manufacturer UK
sites, dealer adverts, AutoTrader used listings, and reviews from MCN,
Bennetts BikeSocial and Visordown. New prices are on-the-road; used prices
are typical dealer asking prices for tidy bikes. They are estimates to
check, not quotes.

Rider geometry (knee, hip and lean angles) comes from the Motonomics
simulator (motonomics.com), recalculated with its method for 193cm / 86cm
inseam, and from cycle-ergo.com for seven older bikes, converted to the
Motonomics scale using the 13 bikes both sites cover.

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
