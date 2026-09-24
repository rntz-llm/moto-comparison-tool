// Candidate bikes. Researched September 2026; see README.md and the About tab for method and sources.
//
// Per model:
//   hp / wetKg / seatMm / tankL : manufacturer figures (an option may override them)
//   delivery : 'relaxed' | 'normal' | 'punchy'  (how the power arrives; feeds the Power score)
//   scores   : researched 0-5 scores for the subjective criteria, with a note for each
//   options  : the ways you could buy it (new / used generations), each with a typical
//              on-the-road price in GBP, a price range, a test-ride score, and optional
//              adjustments (adj) or spec overrides (specs)
//   search   : names used to build listing-site searches (slug: AutoTrader model page,
//              null where AutoTrader has none; mcn: MCN path when it differs)
window.MOTO_BIKES = [
  {
    id: 'tenere700', make: 'Yamaha', model: 'Ténéré 700', style: 'Adventure',
    engine: '689cc parallel twin (CP2)', hp: 72, torqueNm: 68, wetKg: 205, seatMm: 875, tankL: 16,
    delivery: 'normal', drive: 'chain',
    summary: 'The rally-bred middleweight benchmark. Simple, tough, brilliant to stand up on, and the closest thing on this list to the Tuareg you liked, with a less revvy but very characterful engine.',
    tall: '875mm seat and a long seat-to-peg distance suit a 34" inseam. Bars are tall and wide. The stock seat is narrow and firm; a comfort seat is a common first upgrade.',
    pros: ['Superb standing position', 'Proven, simple engine', 'Holds its value', 'Huge aftermarket'],
    cons: ['Firm, narrow stock seat', 'Buffeting from the small screen at 75mph', 'Some buzz above 5,500rpm'],
    scores: {
      comfort: [3.5, 'Roomy for a tall rider, but the stock seat gets sore after 2 hours. A £300 comfort seat fixes most of it.'],
      highway: [3, 'Stable at 75mph on its 21" front, but the rally screen buffets tall riders and the twin gets buzzy around 75–80. An aftermarket screen helps.'],
      standing: [5, 'The class benchmark: tall bars, slim tank, pegs right under you.'],
      fun: [4.5, 'Torquey CP2 with a great crossplane-style bark. Light and playful on B-roads; long-travel forks dive under hard braking.'],
      reliability: [4.5, 'Excellent record since 2019. The CP2 engine is shared with the MT-07 and Tracer 7. Early bikes had a fuel pump recall.'],
      running: [4, 'Around 60mpg. Services every 6,000 miles, valve check at 24,000. Insurance is mid-pack. Chain drive.'],
      luggage: [4.5, 'Every luggage maker supports it: racks, soft and hard panniers, tank bags.'],
      greenlane: [5, 'Among the best big twins off-road. Easy green-laning.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 9750, range: [9495, 9995], testRide: 4.5,
        note: 'RRP £9,995 OTR; UK dealers are advertising £9,500–9,750. 2025 update added ride-by-wire, rider modes and a TFT. Demo bikes at Lind Yamaha, Newmarket (14 miles).' },
      { id: 'used-22', label: 'Used 2022–25', condition: 'used', years: '2022–25', price: 7900, range: [7400, 8700], testRide: 4.5,
        note: 'Plenty on the market (160+ on AutoTrader). Most have some accessories fitted.' },
      { id: 'used-19', label: 'Used 2019–21', condition: 'used', years: '2019–21', price: 6800, range: [6000, 7500], testRide: 4.5, adj: { reliability: -0.25 },
        note: 'Check the fuel pump recall was done and look for trail-riding damage.' }
    ],
    search: { at: ['YAMAHA', 'TENERE 700'], slug: 'yamaha/tenere-700', q: 'Yamaha Tenere 700' }
  },
  {
    id: 'tuareg660', make: 'Aprilia', model: 'Tuareg 660', style: 'Adventure',
    engine: '659cc parallel twin', hp: 80, torqueNm: 70, wetKg: 204, seatMm: 860, tankL: 18,
    delivery: 'normal', drive: 'chain',
    summary: 'The bike you test-rode and loved. The most rev-happy, best-handling bike in the class, with good wind protection. It is also the priciest new, and its dealer network near Cambridge is thin.',
    tall: 'You found it comfortable. 860mm seat, upright and roomy, with tall bars that work standing up.',
    pros: ['You already know it fits you', 'Rev-happy RS660-derived engine', 'Best electronics in class', 'Good screen'],
    cons: ['80hp felt slightly much on your test ride', 'Few dealers (nearest: Peterborough)', 'Aprilia electrical niggles reported'],
    scores: {
      comfort: [4.5, 'Your own test ride: comfortable and a good fit. Good seat and a roomy riding position.'],
      highway: [4, 'Better screen than the Ténéré, smooth 270° twin, stable at motorway speeds.'],
      standing: [5, 'You rated it great: tall bars and a narrow waist.'],
      fun: [5, 'Revs out like a sportsbike, with a sweet chassis and cornering electronics. The most fun-per-pound in the class.'],
      reliability: [3, 'The engine is robust, but owners report electrical and software niggles and there have been recalls. Parts and dealer support are thinner than for the Japanese brands.'],
      running: [3.5, 'Around 55mpg. Services every 6,200 miles (10,000km). Parts cost more than for the Japanese brands.'],
      luggage: [4.5, 'OEM aluminium panniers and racks, plus growing aftermarket support.'],
      greenlane: [5, 'Excellent off-road for its size.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 10999, range: [10495, 10999], testRide: 3,
        note: '£10,999 OTR (Rally variant £10,495). Euro 5+ engine, 79hp. Nearest dealer: Wheels, Peterborough (30 miles); ask ahead about a demo.', specs: { hp: 79 } },
      { id: 'used-23', label: 'Used 2023–24', condition: 'used', years: '2023–24', price: 7900, range: [6900, 8900], testRide: 3.5,
        note: 'About 50 listed UK-wide, so you may need to travel for a test ride.' },
      { id: 'used-22', label: 'Used 2022', condition: 'used', years: '2022', price: 6900, range: [6300, 7700], testRide: 3.5, adj: { reliability: -0.25 },
        note: 'First-year bikes: check that recall and software updates have been done.' }
    ],
    search: { at: ['APRILIA', 'TUAREG 660'], slug: 'aprilia/tuareg-660', q: 'Aprilia Tuareg 660' }
  },
  {
    id: 'transalp750', make: 'Honda', model: 'XL750 Transalp', style: 'Adventure',
    engine: '755cc parallel twin (270°)', hp: 91, torqueNm: 75, wetKg: 208, seatMm: 850, tankL: 16.9,
    delivery: 'normal', drive: 'chain',
    summary: 'A light, road-biased all-rounder with Honda reliability and a rev-happy engine. Its 91hp is at the top of your range, though it builds progressively and is mostly at the top end.',
    tall: '850mm seat, upright and roomy. The bars are a touch low when standing; bar risers are a common £60 fix.',
    pros: ['Honda reliability', 'Light for its power', 'Rev-happy, fun engine', 'Honda dealer in Cambridge'],
    cons: ['91hp is above your comfort band', '2023–24 suspension is soft', 'Buffeting from the 2023–24 screen'],
    scores: {
      comfort: [4, 'Roomy and upright with a decent seat. Good for full days.'],
      highway: [3.5, 'Relaxed at 75mph with some buffeting from the 2023–24 screen; the 2025 update brought a better screen.'],
      standing: [4, 'Decent, but bars sit a little low for 6\'4" standing. Risers fix it.'],
      fun: [4, 'Zingy 270° twin that loves revs, in a light, agile bike. Soft suspension limits hard riding on early bikes.'],
      reliability: [4.5, 'Honda build quality. Engine shared with the Hornet 750.'],
      running: [4.5, 'Around 60mpg. Services every 8,000 miles, valve check at 16,000.'],
      luggage: [4.5, 'OEM panniers and top box plus wide aftermarket support.'],
      greenlane: [4, '21" front and decent clearance. Softer than the Ténéré off-road.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 9999, range: [9499, 9999], testRide: 4.5, adj: { highway: 0.5, fun: 0.25 },
        note: '£9,999 OTR with E-Clutch; revised suspension and a new screen for 2025. Demo bikes at John Banks Honda, Cambridge (3 miles).' },
      { id: 'used-23', label: 'Used 2023–24', condition: 'used', years: '2023–24', price: 7100, range: [6500, 7900], testRide: 4.5,
        note: 'Plentiful. First-generation suspension and screen.' }
    ],
    search: { at: ['HONDA', 'XL750 TRANSALP'], slug: 'honda/xl750-transalp', q: 'Honda Transalp 750' }
  },
  {
    id: 'vstrom800de', make: 'Suzuki', model: 'V-Strom 800DE', style: 'Adventure',
    engine: '776cc parallel twin (270°)', hp: 83, torqueNm: 78, wetKg: 230, seatMm: 855, tankL: 20,
    delivery: 'relaxed', drive: 'chain',
    summary: 'Roomy, smooth and unfussy, with a 20-litre tank. Its power is soft and linear, so the 83hp is less intimidating than the number suggests. Heavier than the Ténéré or Tuareg.',
    tall: 'One of the roomiest cockpits here: wide bars, long seat, good legroom for a 34" inseam.',
    pros: ['Very roomy', 'Smooth, gentle engine', '20L tank (300+ miles range)', 'Suzuki reliability'],
    cons: ['230kg: heaviest of the middleweights', 'Small non-adjustable screen', 'Not especially exciting'],
    scores: {
      comfort: [4.5, 'Big, well-padded seat and a roomy riding position. Among the best here for tall riders.'],
      highway: [4, 'Twin balancers make it very smooth at 75mph. The screen is small; tall riders often fit a taller one.'],
      standing: [4.5, 'Wide, high bars and good standing ergonomics.'],
      fun: [3.5, 'Torquey and competent but not thrilling. Its weight shows on tight roads.'],
      reliability: [4.5, 'Solid so far and Suzuki\'s record is excellent.'],
      running: [4, 'Around 58mpg. Services every 7,500 miles.'],
      luggage: [4.5, 'OEM aluminium cases and good aftermarket support.'],
      greenlane: [4, 'Capable (21" front, long travel), but you feel the weight.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 9999, range: [9499, 9999], testRide: 3.5,
        note: '£9,999 OTR on Suzuki UK. Nearest dealer: St Neots Motorcycles (17 miles); demo availability varies.' },
      { id: 'used-23', label: 'Used 2023–25', condition: 'used', years: '2023–25', price: 7900, range: [7200, 8600], testRide: 4,
        note: 'Fewer listed than the Ténéré or Transalp.' }
    ],
    search: { at: ['SUZUKI', 'V-STROM 800DE'], slug: 'suzuki/v-strom-800', mcn: 'suzuki/v-strom-800de', q: 'Suzuki V-Strom 800DE' }
  },
  {
    id: 'nc750x', make: 'Honda', model: 'NC750X', style: 'Adventure-tourer',
    engine: '745cc parallel twin (low-revving)', hp: 58, torqueNm: 69, wetKg: 214, seatMm: 800, tankL: 14.1,
    delivery: 'relaxed', drive: 'chain',
    summary: 'The sensible choice: extremely reliable, 70–80mpg, a lockable 23-litre "frunk", and optional DCT. The engine runs out of revs at 7,000rpm, so it is relaxing rather than exciting, and the 800mm seat is low for your legs.',
    tall: 'The low 800mm seat bends a 34" leg sharply. Tall owners fit the accessory high seat or lowered pegs.',
    pros: ['Bulletproof', 'Best fuel economy here', 'Frunk storage', 'Cheap to own'],
    cons: ['Cramped legroom for 6\'4"', 'Not rev-happy', 'Low bars for standing'],
    scores: {
      comfort: [3, 'Good seat and upright bars, but the low seat cramps your knees on long days.'],
      highway: [3.5, 'Very relaxed and smooth at 75mph. The screen is fine with the taller accessory version.'],
      standing: [2, 'Bars too low. Not built for it.'],
      fun: [2, 'Torquey low down but hits the limiter early. Competent handling, no drama.'],
      reliability: [5, 'One of the most reliable bikes on sale.'],
      running: [5, '70–80mpg, cheap insurance, 8,000-mile services.'],
      luggage: [5, '23L frunk where the tank would be, plus OEM panniers and top box.'],
      greenlane: [1.5, 'Road bike.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 7999, range: [7899, 8399], testRide: 4.5,
        note: 'About £7,999 OTR manual, £8,399 DCT. Six-year warranty offer. Demo at John Banks Honda, Cambridge.' },
      { id: 'used-21', label: 'Used 2021–25', condition: 'used', years: '2021–25', price: 5900, range: [4900, 7000], testRide: 4.5,
        note: 'Very common; manual and DCT both easy to find.' },
      { id: 'used-16', label: 'Used 2016–20', condition: 'used', years: '2016–20', price: 4600, range: [4000, 5300], testRide: 4.5, specs: { hp: 54, wetKg: 220 },
        note: 'Heavier previous generation, 54hp.' }
    ],
    search: { at: ['HONDA', 'NC750X'], slug: 'honda/nc750x', q: 'Honda NC750X' }
  },
  {
    id: 'nx500', make: 'Honda', model: 'NX500 / CB500X', style: 'Adventure-tourer',
    engine: '471cc parallel twin', hp: 47, torqueNm: 43, wetKg: 196, seatMm: 830, tankL: 17.5,
    delivery: 'normal', drive: 'chain',
    summary: 'Cheap, light and indestructible. You can wring its neck without doing anything silly, which suits your "push it to the limit" itch. It is small for a 6\'4" rider and working hard at 75mph.',
    tall: 'The cockpit is compact. Your knees will be bent and the bars close; fine for an hour, tiring on all-day rides.',
    pros: ['Cheap to buy and run', 'You can use all the power safely', 'Honda reliability', 'Light and easy'],
    cons: ['Small for a tall rider', 'Busy and buzzy at 75mph', 'Soft budget suspension'],
    scores: {
      comfort: [3, 'Plush enough, but compact for your size.'],
      highway: [3, 'Sits at 75–80mph with some buzz; being light, it gets pushed about in crosswinds.'],
      standing: [3, 'OK, though bars are low for your height.'],
      fun: [3.5, 'Light and thrashable. The fun of a small bike ridden hard.'],
      reliability: [5, 'Honda\'s 500 twin is famously durable.'],
      running: [5, 'Around 70mpg, low insurance group, cheap tyres.'],
      luggage: [4, 'OEM racks and panniers; lots of aftermarket.'],
      greenlane: [2.5, '19" front. Fine on easy byways with the right tyres.']
    },
    options: [
      { id: 'new', label: 'New NX500 2026', condition: 'new', years: '2026', price: 6599, range: [6499, 6999], testRide: 4.5,
        note: 'About £6,599 OTR; £6,999 with E-Clutch. Demo at John Banks Honda, Cambridge.' },
      { id: 'used-nx', label: 'Used NX500 2024–25', condition: 'used', years: '2024–25', price: 5400, range: [4900, 5995], testRide: 4.5 },
      { id: 'used-cb', label: 'Used CB500X 2019–23', condition: 'used', years: '2019–23', price: 4300, range: [3800, 5000], testRide: 4.5, specs: { wetKg: 199 },
        note: 'Same bike under its previous name. Very common.' }
    ],
    search: { at: ['HONDA', 'NX500'], slug: 'honda/nx500', q: 'Honda NX500', alt: ['Honda CB500X'] }
  },
  {
    id: 'versys650', make: 'Kawasaki', model: 'Versys 650', style: 'Adventure-tourer',
    engine: '649cc parallel twin', hp: 66, torqueNm: 61, wetKg: 219, seatMm: 845, tankL: 21,
    delivery: 'normal', drive: 'chain',
    summary: 'An underrated road-going all-rounder: revvy twin, sharp handling, adjustable screen and a 21-litre tank. Squarely in your power sweet spot and good value used.',
    tall: 'Upright and roomy with wide bars. Knees are bent a bit for a 34" inseam but it is well liked by tall riders.',
    pros: ['Power in your sweet spot', 'Fun, revvy engine', 'Huge range', 'Good value used'],
    cons: ['Some buzz through bars and pegs', 'Road-only', 'Styling divides opinion'],
    scores: {
      comfort: [3.5, 'Good seat and a roomy riding position.'],
      highway: [3.5, 'Adjustable screen and stable, with some high-frequency vibration at 75mph.'],
      standing: [2.5, 'Bars are a little low for standing.'],
      fun: [4, 'Rev-happy twin with a zingy top end and sharp handling. Lots of fun on B-roads and not scary.'],
      reliability: [4.5, 'The ER-6 family engine is well proven.'],
      running: [4.5, 'Around 60mpg, 7,600-mile services, modest insurance.'],
      luggage: [4.5, 'OEM panniers (Tourer editions) and a good aftermarket.'],
      greenlane: [1, 'Road bike.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 8049, range: [7799, 8049], testRide: 3.5,
        note: '£8,049 OTR. Nearest dealers: Wheels, Peterborough and Orwell, Ipswich.' },
      { id: 'used-22', label: 'Used 2022–25', condition: 'used', years: '2022–25', price: 6400, range: [5800, 7200], testRide: 4 },
      { id: 'used-15', label: 'Used 2015–21', condition: 'used', years: '2015–21', price: 4400, range: [3800, 5500], testRide: 4, specs: { wetKg: 216 } }
    ],
    search: { at: ['KAWASAKI', 'VERSYS 650'], slug: 'kawasaki/versys-650', q: 'Kawasaki Versys 650' }
  },
  {
    id: 'vstrom650', make: 'Suzuki', model: 'V-Strom 650 / XT', style: 'Adventure-tourer',
    engine: '645cc V-twin', hp: 70, torqueNm: 62, wetKg: 213, seatMm: 835, tankL: 20,
    delivery: 'relaxed', drive: 'chain',
    summary: 'The used-market hero: comfortable, reliable, cheap and endlessly accessorised. Its SV650-derived V-twin is smooth and characterful. No longer sold new in the UK.',
    tall: 'Famously roomy. A long seat, tall bars and good legroom; most tall owners only swap the screen.',
    pros: ['Very comfortable', 'Nearly unkillable', 'Cheap', 'Huge aftermarket'],
    cons: ['Stock screen buffets tall riders', 'Dated and soft', 'No longer sold new'],
    scores: {
      comfort: [4, 'Roomy and well-padded. A proven long-distance bike.'],
      highway: [3.5, 'Smooth, stable V-twin at 75mph. The stock screen buffets a 6\'4" rider; a taller aftermarket screen is the usual fix.'],
      standing: [3, 'Acceptable. The XT version has slightly better bars.'],
      fun: [3, 'Characterful V-twin with good midrange, but soft suspension and a dated chassis.'],
      reliability: [5, 'Legendary.'],
      running: [4.5, 'Around 55–60mpg, 7,500-mile services, cheap parts.'],
      luggage: [5, 'As well supported as anything on the road.'],
      greenlane: [2, 'The XT\'s spoked wheels help, but it is a road bike.']
    },
    options: [
      { id: 'used-17', label: 'Used 2017–23', condition: 'used', years: '2017–23', price: 5000, range: [4300, 6000], testRide: 4.5 },
      { id: 'used-12', label: 'Used 2012–16', condition: 'used', years: '2012–16', price: 3600, range: [3000, 4300], testRide: 4.5, adj: { reliability: -0.25 }, specs: { hp: 69, wetKg: 214 } }
    ],
    search: { at: ['SUZUKI', 'V-STROM 650'], slug: 'suzuki/v-strom-650', q: 'Suzuki V-Strom 650' }
  },
  {
    id: 'tracer7', make: 'Yamaha', model: 'Tracer 7 / GT', style: 'Sport-tourer',
    engine: '689cc parallel twin (CP2)', hp: 72, torqueNm: 67, wetKg: 196, seatMm: 835, tankL: 17,
    delivery: 'normal', drive: 'chain',
    summary: 'An MT-07 with a fairing and upright bars: light, flickable and huge fun on twisty roads. The GT adds panniers and a comfier seat. Sportier and less roomy than the adventure bikes.',
    tall: 'Upright bars, but the seat-to-peg distance is sporty. Tall riders report cramped knees after an hour or two.',
    pros: ['Great on twisty roads', 'Light', 'Proven engine', 'GT comes with panniers'],
    cons: ['Knee bend for tall riders', 'Budget suspension', 'Road-only'],
    scores: {
      comfort: [3, 'Upright but compact. The GT seat is better.'],
      highway: [3.5, 'Adjustable screen and stable, with some CP2 buzz at 75mph.'],
      standing: [2, 'Not designed for it.'],
      fun: [4.5, 'The CP2 in a light chassis is one of the most fun road bikes here.'],
      reliability: [4.5, 'Proven engine and electrics.'],
      running: [4.5, 'Around 60mpg, 6,000-mile services, reasonable insurance.'],
      luggage: [4, 'GT has panniers as standard; plain Tracer 7 takes them as accessories.'],
      greenlane: [1, 'Road bike.']
    },
    options: [
      { id: 'new', label: 'New Tracer 7 2026', condition: 'new', years: '2026', price: 8600, range: [8250, 8908], testRide: 4.5,
        note: 'RRP £8,908 OTR; dealers are advertising from about £8,250. Demo at Lind Yamaha, Newmarket.' },
      { id: 'used-20', label: 'Used Tracer 7/GT 2020–25', condition: 'used', years: '2020–25', price: 6300, range: [5200, 7300], testRide: 4.5 },
      { id: 'used-16', label: 'Used Tracer 700 2016–19', condition: 'used', years: '2016–19', price: 4500, range: [3900, 5200], testRide: 4.5, adj: { highway: -0.5 }, specs: { hp: 74 },
        note: 'Earlier Tracer 700 has a poorer screen.' }
    ],
    search: { at: ['YAMAHA', 'TRACER 7'], slug: 'yamaha/tracer-7', q: 'Yamaha Tracer 7' }
  },
  {
    id: 'tigersport660', make: 'Triumph', model: 'Tiger Sport 660', style: 'Sport-tourer',
    engine: '660cc inline triple', hp: 80, torqueNm: 64, wetKg: 206, seatMm: 835, tankL: 17.2,
    delivery: 'normal', drive: 'chain',
    summary: 'Revvy, great-sounding triple in a light, easy chassis. The used 80hp bikes sit near your sweet spot. The 2026 update jumped to 94hp with a 12,650rpm redline, which is more than you want.',
    tall: 'Upright, but the seat-to-peg distance is compact; tall riders report tight knees.',
    pros: ['Triple sound and character', 'Smooth at 75mph', '10,000-mile service intervals', 'Strong Triumph demo network'],
    cons: ['Compact for 6\'4"', '2026 model is 94hp', 'Road-only'],
    scores: {
      comfort: [3, 'Good seat and bars, but tight knees for a 34" inseam on long days.'],
      highway: [4, 'Smooth triple, good adjustable screen, stable at 75mph.'],
      standing: [2, 'Not designed for it.'],
      fun: [4.5, 'Triple howl, eager revs and agile handling.'],
      reliability: [4, 'Modern Triumphs are solid; the 660 triple has a clean record.'],
      running: [4, 'Around 55mpg with 10,000-mile service intervals.'],
      luggage: [4, 'OEM panniers and top box.'],
      greenlane: [1, 'Road bike.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 9295, range: [9295, 9295], testRide: 4.5, specs: { hp: 94, wetKg: 211 }, delivery: 'punchy',
        note: '£9,295 OTR. New engine: 94hp at 11,250rpm, 12,650rpm redline. Demos at Peterborough Triumph and Triumph Essex (Dunmow).' },
      { id: 'used-22', label: 'Used 2022–25', condition: 'used', years: '2022–25', price: 6300, range: [5500, 7200], testRide: 4.5,
        note: '80hp original engine. About 100 on AutoTrader.' }
    ],
    search: { at: ['TRIUMPH', 'TIGER SPORT 660'], slug: 'triumph/tiger-sport-660', q: 'Triumph Tiger Sport 660' }
  },
  {
    id: 'tiger850', make: 'Triumph', model: 'Tiger 850 Sport', style: 'Adventure-tourer',
    engine: '888cc inline triple (T-plane)', hp: 84, torqueNm: 82, wetKg: 213, seatMm: 830, tankL: 20,
    delivery: 'relaxed', drive: 'chain',
    summary: 'A detuned Tiger 900: a smooth, grunty triple with a lazy delivery, a planted chassis and adjustable seat. A strong long-distance bike that is fun without being frantic.',
    tall: 'Adjustable 810–830mm seat. Roomy upper body; a 34" inseam will want the accessory high seat.',
    pros: ['Superb at 75mph', 'Lazy, tractable power', 'Adjustable seat', 'Triple character'],
    cons: ['Seat on the low side', 'Some recalls on early Tiger 900-family bikes'],
    scores: {
      comfort: [3.5, 'Comfortable and roomy up top; legroom is fine with the high seat.'],
      highway: [4.5, 'Smooth, planted and quiet at 75mph with an adjustable screen.'],
      standing: [3, 'Acceptable.'],
      fun: [4, 'Characterful T-plane triple with a great sound. Less rev-happy than the 660.'],
      reliability: [3.5, 'Early Tiger 900-family bikes had several recalls and some electrical niggles. Check the recall history.'],
      running: [4, 'Around 55mpg with 10,000-mile service intervals.'],
      luggage: [4.5, 'OEM panniers and top box.'],
      greenlane: [2.5, '19" cast front. Gravel tracks only.']
    },
    options: [
      { id: 'used-21', label: 'Used 2021–24', condition: 'used', years: '2021–24', price: 6900, range: [6000, 7500], testRide: 4,
        note: 'Mostly sold through Triumph dealers as approved used.' }
    ],
    search: { at: ['TRIUMPH', 'TIGER 850 SPORT'], slug: null, mcn: 'triumph/tiger-850-sport', q: 'Triumph Tiger 850 Sport' }
  },
  {
    id: 'tiger800', make: 'Triumph', model: 'Tiger 800 XC / XR', style: 'Adventure-tourer',
    engine: '800cc inline triple', hp: 94, torqueNm: 79, wetKg: 215, seatMm: 845, tankL: 19,
    delivery: 'relaxed', drive: 'chain',
    summary: 'The previous-generation Tiger: silky triple, very linear power and a roomy XC chassis. Lots of bike for the money used, but getting old, and 94hp is on paper more than you want (it is gentle in practice).',
    tall: 'XC versions have an 840–860mm seat and tall bars, which suit a 34" inseam. XR versions are lower.',
    pros: ['Very smooth triple', 'Roomy XC ergonomics', 'Cheap for what it is', 'Plentiful'],
    cons: ['Ageing', 'Regulator and switchgear issues are known', '94hp on paper'],
    scores: {
      comfort: [4, 'The XC is roomy and upright with a good seat.'],
      highway: [4.5, 'Turbine-smooth at 75mph and very stable.'],
      standing: [3.5, 'XC bars work reasonably standing.'],
      fun: [4, 'The triple whine is addictive and it handles well, but it is heavy-ish.'],
      reliability: [3.5, 'Generally good, with known regulator/rectifier and switchgear issues.'],
      running: [4, 'Around 50mpg with 10,000-mile services (2018 on).'],
      luggage: [4.5, 'OEM and aftermarket panniers.'],
      greenlane: [3, 'XC with 21" spoked front is decent; XR is road-only.']
    },
    options: [
      { id: 'used-18', label: 'Used 2018–20', condition: 'used', years: '2018–20', price: 6200, range: [5600, 6800], testRide: 4.5,
        note: 'Gen 2 update: better screen, electronics and 10,000-mile services.' },
      { id: 'used-15', label: 'Used 2015–17', condition: 'used', years: '2015–17', price: 4700, range: [4100, 5500], testRide: 4.5, adj: { reliability: -0.25, running: -0.5 },
        note: 'Services every 6,000 miles on these earlier bikes.' }
    ],
    search: { at: ['TRIUMPH', 'TIGER 800'], slug: 'triumph/tiger-800', q: 'Triumph Tiger 800 XC' }
  },
  {
    id: 'f750gs', make: 'BMW', model: 'F 750 GS', style: 'Adventure',
    engine: '853cc parallel twin (270°)', hp: 77, torqueNm: 83, wetKg: 224, seatMm: 815, tankL: 15,
    delivery: 'relaxed', drive: 'chain',
    summary: 'The softer, cheaper sibling of the F 850 GS. Good value used, very well equipped with luggage, and the power is easy. Look for one with the high seat.',
    tall: 'Stock 815mm seat is low for you. The optional high seat (850mm) is common on used bikes and makes it much better.',
    pros: ['Good value used', 'Easy power', 'Great OEM luggage', 'BMW demo network'],
    cons: ['Low stock seat', 'Some vibration', 'Dealer servicing is expensive'],
    scores: {
      comfort: [3.5, 'Good with the high seat; cramped with the standard one.'],
      highway: [3.5, 'Stable, with some vibration from the twin and a small screen.'],
      standing: [3.5, 'Reasonable bar height.'],
      fun: [3, 'Torquey and easy, but not rev-happy or playful.'],
      reliability: [3.5, 'Mostly fine; some early engine and electrical complaints.'],
      running: [3, 'Around 55mpg; BMW dealer servicing costs more.'],
      luggage: [5, 'Excellent OEM Vario luggage and everything aftermarket.'],
      greenlane: [3, '19" front. Light green lanes only.']
    },
    options: [
      { id: 'used-18', label: 'Used 2018–23', condition: 'used', years: '2018–23', price: 5900, range: [5000, 7000], testRide: 4 }
    ],
    search: { at: ['BMW', 'F 750 GS'], slug: 'bmw/f-750-gs', q: 'BMW F750GS' }
  },
  {
    id: 'f800gs', make: 'BMW', model: 'F 800 GS (2024+)', style: 'Adventure',
    engine: '895cc parallel twin (270°)', hp: 87, torqueNm: 92, wetKg: 227, seatMm: 815, tankL: 15,
    delivery: 'relaxed', drive: 'chain',
    summary: 'The current mid-size GS, replacing the F 750 GS: more torque, better suspension and a smoother engine. Well equipped, but pricey and heavy for the class.',
    tall: 'Base seat is 815mm; high-seat options raise it substantially and are worth specifying.',
    pros: ['Refined and torquey', 'Excellent luggage options', 'Strong BMW demo network'],
    cons: ['Expensive', 'Heavy', 'Low stock seat'],
    scores: {
      comfort: [4, 'Comfortable with a high seat fitted.'],
      highway: [4, 'Smooth and stable at 75mph.'],
      standing: [4, 'Good bar height.'],
      fun: [3.5, 'Punchy midrange but not especially playful.'],
      reliability: [3.5, 'New model; BMW\'s record on this twin is decent.'],
      running: [3, 'Dealer servicing costs more.'],
      luggage: [5, 'Excellent OEM and aftermarket.'],
      greenlane: [3.5, '21" front version available.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 10500, range: [9995, 10900], testRide: 4,
        note: 'About £10,500 OTR in base trim; options add up quickly. Demo at Sycamore Motorrad, Peterborough.' },
      { id: 'used-24', label: 'Used 2024–25', condition: 'used', years: '2024–25', price: 8900, range: [8400, 9500], testRide: 4 }
    ],
    search: { at: ['BMW', 'F 800 GS'], slug: 'bmw/f-800-gs', q: 'BMW F800GS 2024' }
  },
  {
    id: 'v85tt', make: 'Moto Guzzi', model: 'V85 TT', style: 'Adventure',
    engine: '853cc transverse V-twin', hp: 76, torqueNm: 82, wetKg: 229, seatMm: 830, tankL: 23,
    delivery: 'relaxed', drive: 'shaft',
    summary: 'The characterful one: transverse V-twin with its torque rock, shaft drive, a 23-litre tank and beautiful styling. Relaxed rather than fast, and a joy to ride. Dealer support is sparse.',
    tall: 'Upright and relaxed with a plush seat. Legroom is reasonable for a 34" inseam; a higher accessory seat exists.',
    pros: ['Unique character and sound', 'Shaft drive, no chain', '23L tank', 'Relaxed power'],
    cons: ['Few dealers', 'Heavy-ish', 'Expensive new'],
    scores: {
      comfort: [3.5, 'Plush seat and a relaxed riding position.'],
      highway: [3.5, 'Pleasant, mild vibration at 75mph. Stable. The TT Travel has a taller screen.'],
      standing: [3.5, 'Reasonable.'],
      fun: [4.5, 'Most character on the list. Not quick, but it makes every ride feel like an occasion.'],
      reliability: [3.5, 'Early 2019–20 bikes had fuelling issues and a recall; later ones are better. Few specialists.'],
      running: [4, 'Shaft drive saves on chains. Around 50–55mpg; 6,000-mile services.'],
      luggage: [4.5, 'OEM panniers (standard on the TT Travel).'],
      greenlane: [3.5, 'Spoked 21" front, decent on byways.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 11000, range: [10998, 12240], testRide: 3,
        note: 'RRP £12,240 OTR but dealers advertise from £10,998, often with £1,000 accessory offers. Dealer: Wheels, Peterborough.' },
      { id: 'used-21', label: 'Used 2021–24', condition: 'used', years: '2021–24', price: 7400, range: [6500, 8500], testRide: 3.5 },
      { id: 'used-19', label: 'Used 2019–20', condition: 'used', years: '2019–20', price: 6300, range: [5700, 7000], testRide: 3.5, adj: { reliability: -0.25 }, specs: { hp: 76 } }
    ],
    search: { at: ['MOTO GUZZI', 'V85 TT'], slug: 'moto-guzzi/v85', mcn: 'moto-guzzi/v85-tt', q: 'Moto Guzzi V85 TT' }
  },
  {
    id: 'himalayan450', make: 'Royal Enfield', model: 'Himalayan 450', style: 'Adventure',
    engine: '452cc single', hp: 40, torqueNm: 40, wetKg: 196, seatMm: 845, tankL: 17,
    delivery: 'normal', drive: 'chain',
    summary: 'Cheap, charming and genuinely capable on byways, with a dealer 2 miles from central Cambridge. Motorways are its weak spot: 75mph is near its comfortable limit.',
    tall: 'Adjustable 825–845mm seat with tall bars. Surprisingly roomy; a tall-seat accessory exists.',
    pros: ['Cheap', 'Great for exploring back roads', 'Tall bars, good standing position', 'Dealer in Girton'],
    cons: ['Strained at 75mph', 'Early-model recalls', 'Single-cylinder vibes'],
    scores: {
      comfort: [3.5, 'Roomy and upright for its size; the seat is firm on long days.'],
      highway: [3, 'Cruises at 70–75mph without fuss. Single-cylinder vibes build up on long stints.'],
      standing: [4, 'Tall bars, good standing position.'],
      fun: [3.5, 'You can thrash it everywhere. Charming character.'],
      reliability: [3, 'The new Sherpa 450 engine had several recalls and teething issues in 2024. Improving.'],
      running: [5, 'Around 70mpg, low insurance, cheap parts.'],
      luggage: [4.5, 'OEM racks and panniers.'],
      greenlane: [4.5, 'Very capable on UK byways.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 5850, range: [5450, 5999], testRide: 4.5,
        note: 'About £5,800–6,000 OTR. Demo at Haywards, Girton (2 miles).' },
      { id: 'used-24', label: 'Used 2024–25', condition: 'used', years: '2024–25', price: 4600, range: [4200, 5200], testRide: 4, adj: { reliability: -0.25 },
        note: 'Check recall work has been done.' }
    ],
    search: { at: ['ROYAL ENFIELD', 'HIMALAYAN'], slug: 'royal-enfield/himalayan-450', mcn: 'enfield/himalayan', q: 'Royal Enfield Himalayan 450' }
  },
  {
    id: 'kle500', make: 'Kawasaki', model: 'KLE500 (2026)', style: 'Adventure',
    engine: '451cc parallel twin', hp: 44, torqueNm: 43, wetKg: 194, seatMm: 860, tankL: 16,
    delivery: 'normal', drive: 'chain',
    summary: 'New for 2026: Ninja 500 engine in a tall, off-road-leaning chassis with a 21" front. A smoother twin than the singles in this class. Very new, so long-term reports are thin.',
    tall: '860mm seat and standing-oriented bars. Promising for a tall rider, but try one.',
    pros: ['Smooth twin', 'Tall seat', 'Good standing position', 'Proven engine'],
    cons: ['Brand new model', 'Little in reserve at 75mph'],
    scores: {
      comfort: [3.5, 'Tall seat with a hollowed comfort cushion. Few long-distance reports yet.'],
      highway: [3, 'The twin is smoother than a single; the screen is small. A new model, so few long-term motorway reports yet.'],
      standing: [4.5, 'Bars and pegs placed for standing, KX-style.'],
      fun: [3.5, 'Revvy twin in a light bike.'],
      reliability: [4, 'Engine proven in the Ninja 500 / Z500. New chassis.'],
      running: [4.5, 'Around 70mpg, low insurance.'],
      luggage: [4, 'Accessory packs with racks and cases.'],
      greenlane: [4.5, '21/17" wheels and long travel.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 5999, range: [5999, 6599], testRide: 3.5,
        note: '£5,999 OTR; SE £6,599. New model, so demo bikes may be scarce.' }
    ],
    search: { at: ['KAWASAKI', 'KLE500'], slug: 'kawasaki/kle500', q: 'Kawasaki KLE500 2026' }
  },
  {
    id: 'ktm390adv', make: 'KTM', model: '390 Adventure R', style: 'Adventure',
    engine: '399cc single', hp: 44, torqueNm: 39, wetKg: 178, seatMm: 870, tankL: 14,
    delivery: 'punchy', drive: 'chain',
    summary: 'Light, revvy and brilliant off-road, with the best electronics in its class. It is a KTM, which you are wary of, and a single at 75mph is tiring.',
    tall: '870mm seat and narrow body give plenty of legroom, but it is a small bike under a 6\'4" rider.',
    pros: ['Very light and agile', 'Great electronics', 'Tall seat'],
    cons: ['Buzzy at 75mph', 'KTM reliability reputation', 'Firm, narrow seat'],
    scores: {
      comfort: [3, 'Legroom is good; the seat is narrow and hard.'],
      highway: [2.5, 'A revvy single: buzzy at 75mph, and light enough to be pushed about by gusts.'],
      standing: [4.5, 'Designed to be ridden standing.'],
      fun: [4, 'Revvy and very agile.'],
      reliability: [2.5, 'Mixed build-quality reports on the Indian-built 390 range.'],
      running: [4, 'Cheap to insure and fuel.'],
      luggage: [3, 'Racks available; less support than the big names.'],
      greenlane: [5, 'The most off-road-capable bike here.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 6199, range: [6199, 6199], testRide: 3.5,
        note: '£6,199 OTR. Dealers: Jim Aim, Braintree; Orwell, Ipswich.' },
      { id: 'used-20', label: 'Used 390 Adventure 2020–24', condition: 'used', years: '2020–24', price: 3900, range: [3400, 4500], testRide: 4, adj: { reliability: -0.25 }, specs: { hp: 43, wetKg: 172, seatMm: 855 },
        note: 'Previous generation.' }
    ],
    search: { at: ['KTM', '390 ADVENTURE'], slug: 'ktm/390-adventure', q: 'KTM 390 Adventure' }
  },
  {
    id: 'cf450mt', make: 'CFMOTO', model: '450MT', style: 'Adventure',
    engine: '449cc parallel twin', hp: 44, torqueNm: 44, wetKg: 190, seatMm: 820, tankL: 17.5,
    delivery: 'normal', drive: 'chain',
    summary: 'Excellent value small adventure bike with a smooth twin and good off-road chops. Compact for your size, and a young brand with a small dealer network.',
    tall: 'Low 820mm seat and compact cockpit. Probably cramped for 6\'4".',
    pros: ['Great value', 'Smooth twin', 'Well equipped'],
    cons: ['Cramped for tall riders', 'Small dealer network', 'Unknown long-term reliability'],
    scores: {
      comfort: [2.5, 'Compact for a tall rider.'],
      highway: [3, 'Smoother than a single, with an adjustable screen. Some buzz at 75mph.'],
      standing: [3.5, 'OK, but low for your height.'],
      fun: [3.5, 'Light and eager.'],
      reliability: [3, 'Early reports are good, but there is little long-term data and parts supply can be slow.'],
      running: [4.5, 'Cheap to run.'],
      luggage: [4, 'Some trims include racks and crash bars.'],
      greenlane: [4.5, 'Capable.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 5899, range: [5699, 5899], testRide: 3,
        note: '£5,699 plus about £200 on-the-road charges. Dealer: Jim Aim, Braintree.' },
      { id: 'used-24', label: 'Used 2024–25', condition: 'used', years: '2024–25', price: 4600, range: [4200, 5000], testRide: 3.5 }
    ],
    search: { at: ['CFMOTO', '450MT'], slug: 'cfmoto/450mt', q: 'CFMOTO 450MT' }
  },
  {
    id: 'cf800mtx', make: 'CFMOTO', model: '800MT-X', style: 'Adventure',
    engine: '799cc parallel twin (KTM LC8c-derived)', hp: 90, torqueNm: 86, wetKg: 220, seatMm: 870, tankL: 22.5,
    delivery: 'punchy', drive: 'chain',
    summary: 'KTM 790 Adventure-style engine and spec (cruise control, cornering ABS, 870mm seat, 22.5L tank) for a lot less money. Punchy 90hp, so above your comfort band, and brand support is the unknown.',
    tall: 'Tall 870mm seat with low pegs and wide bars. Reviews call it roomy.',
    pros: ['Huge spec for the money', 'Roomy', 'Long range', 'Cruise control'],
    cons: ['90hp, delivered with KTM-style punch', 'Young brand, few dealers', 'Resale values uncertain'],
    scores: {
      comfort: [4, 'Tall seat and a roomy riding position.'],
      highway: [4, 'Cruise control and an adjustable screen. Stable.'],
      standing: [4, 'Wide bars, rally-ish stance.'],
      fun: [4, 'Revvy, strong twin in a well-sorted chassis.'],
      reliability: [3, 'The engine design is proven in KTMs; CFMOTO\'s build quality and UK parts supply are less certain.'],
      running: [3.5, 'Mid-pack fuel economy; insurance may be higher for a less-known brand.'],
      luggage: [4, 'OEM racks; aftermarket support is growing.'],
      greenlane: [4.5, '21/18" wheels and long travel.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 7200, range: [7198, 8199], testRide: 3,
        note: 'List £7,999; currently offered at £6,999 plus about £200 on-the-road charges. Dealer: Jim Aim, Braintree (35 miles).' },
      { id: 'used-mt', label: 'Used 800MT Touring 2022–24', condition: 'used', years: '2022–24', price: 5600, range: [4900, 6500], testRide: 3.5,
        specs: { hp: 95, wetKg: 231, seatMm: 825 }, adj: { greenlane: -2, standing: -0.5 },
        note: 'The road-oriented 800MT with 19" wheels: heavier, lower, 95hp.' }
    ],
    search: { at: ['CFMOTO', '800MT'], slug: 'cfmoto/800mt-x', q: 'CFMOTO 800MT' }
  },
  {
    id: 'africatwin1000', make: 'Honda', model: 'CRF1000L Africa Twin', style: 'Adventure',
    engine: '998cc parallel twin (270°)', hp: 94, torqueNm: 98, wetKg: 232, seatMm: 860, tankL: 18.8,
    delivery: 'relaxed', drive: 'chain',
    summary: 'A stretch option: big, tall, comfortable and tractable, with a soulful twin. Its power is gentle and torquey, but 94hp and 232kg are at the edge of what you asked for.',
    tall: 'Adjustable 850/870mm seat, tall bars. A very good fit for a 6\'4" rider.',
    pros: ['Excellent tall-rider fit', 'Very comfortable', 'Honda reliability', 'Great off-road for its size'],
    cons: ['94hp', '232kg and tall centre of gravity', 'Buffeting from the standard screen'],
    scores: {
      comfort: [4.5, 'Big, roomy and comfortable all day.'],
      highway: [4, 'Stable and smooth; the standard screen buffets (the Adventure Sports version is better).'],
      standing: [4.5, 'Tall bars, excellent standing.'],
      fun: [4, 'Torquey, characterful twin; handles well for its size.'],
      reliability: [4.5, 'Very solid.'],
      running: [3.5, 'Around 50mpg; tyres and chains cost more on a bigger bike.'],
      luggage: [5, 'Everything is available.'],
      greenlane: [4.5, 'Very capable for its size.']
    },
    options: [
      { id: 'used-16', label: 'Used 2016–19', condition: 'used', years: '2016–19', price: 6800, range: [5800, 8000], testRide: 4.5, adj: { reliability: -0.25 } }
    ],
    search: { at: ['HONDA', 'CRF1000L AFRICA TWIN'], slug: 'honda/crf1000l-africa-twin', q: 'Honda Africa Twin CRF1000L' }
  },
  {
    id: 'xl700v', make: 'Honda', model: 'XL700V Transalp', style: 'Adventure-tourer',
    engine: '680cc V-twin', hp: 59, torqueNm: 60, wetKg: 214, seatMm: 841, tankL: 17.5,
    delivery: 'relaxed', drive: 'chain',
    summary: 'The budget classic: a smooth, unburstable V-twin tourer for about £3,500. Old (2008–12) and soft, but cheap to buy, cheap to fix, and comfortable.',
    tall: 'Upright and fairly roomy; 841mm seat.',
    pros: ['Very cheap', 'Unburstable engine', 'Comfortable and smooth'],
    cons: ['14–18 years old', 'Soft, dated chassis', 'Not exciting'],
    scores: {
      comfort: [3.5, 'Upright, roomy enough, decent seat.'],
      highway: [3.5, 'Smooth V-twin and a decent screen; comfortable at 75mph.'],
      standing: [3, 'OK.'],
      fun: [2.5, 'Soft and gentle.'],
      reliability: [4.5, 'Engine is famously tough. Corrosion, fork seals and electrics are the usual weak points.'],
      running: [4.5, 'Around 55mpg and cheap parts.'],
      luggage: [4.5, 'Racks and panniers are easy to find.'],
      greenlane: [3, '21" front; fine on easy byways.']
    },
    options: [
      { id: 'used-08', label: 'Used 2008–12', condition: 'used', years: '2008–12', price: 3400, range: [2800, 4200], testRide: 4, adj: { reliability: -0.5 },
        note: 'Condition matters more than year. Budget for tyres, chain and a service.' }
    ],
    search: { at: ['HONDA', 'XL700V TRANSALP'], slug: null, mcn: 'honda/xl700v-transalp', q: 'Honda XL700V Transalp' }
  },
  {
    id: 'xt660z', make: 'Yamaha', model: 'XT660Z Ténéré', style: 'Dual-sport',
    engine: '660cc single', hp: 48, torqueNm: 58, wetKg: 206, seatMm: 895, tankL: 23,
    delivery: 'normal', drive: 'chain',
    summary: 'A tall, tough big single with a 23-litre tank, built for overland travel. Fits a tall rider well, but the single-cylinder vibes make long motorway stints hard work.',
    tall: '895mm seat: one of the few bikes where a 34" inseam feels at home.',
    pros: ['Tall rider fit', '23L tank', 'Tough', 'Cheap'],
    cons: ['Vibey at 75mph', 'Old', 'Plank seat'],
    scores: {
      comfort: [4, 'Great legroom; the plank seat tires you on long days.'],
      highway: [2, 'Big single thumps at 75mph; buzzy mirrors and tingly hands.'],
      standing: [4.5, 'Tall bars, made for standing.'],
      fun: [3, 'Torquey thumper; fun on back roads.'],
      reliability: [4.5, 'Tough, simple engine.'],
      running: [4.5, 'Around 60mpg, simple to maintain.'],
      luggage: [4.5, 'Overland favourite; lots of racks.'],
      greenlane: [4.5, 'Very capable.']
    },
    options: [
      { id: 'used-08', label: 'Used 2008–16', condition: 'used', years: '2008–16', price: 3700, range: [3000, 4500], testRide: 3.5, adj: { reliability: -0.5 } }
    ],
    search: { at: ['YAMAHA', 'XT660Z TENERE'], slug: null, mcn: 'yamaha/xt660z-tenere', q: 'Yamaha XT660Z Tenere' }
  },
  {
    id: 'hornet750', make: 'Honda', model: 'CB750 Hornet', style: 'Naked',
    engine: '755cc parallel twin (270°)', hp: 91, torqueNm: 75, wetKg: 190, seatMm: 795, tankL: 15.2,
    delivery: 'punchy', drive: 'chain',
    summary: 'Included as a naked-bike benchmark: the Transalp engine in a light roadster. Hugely fun and cheap, but no wind protection and cramped for 6\'4".',
    tall: '795mm seat. Cramped for a 34" inseam.',
    pros: ['Cheap for the performance', 'Light and fun', 'Honda reliability'],
    cons: ['No wind protection', 'Cramped for tall riders', '91hp in a light bike'],
    scores: {
      comfort: [2.5, 'Cramped legroom for a 34" inseam.'],
      highway: [2, 'Stable, but wind blast at 75mph is tiring.'],
      standing: [1.5, 'Not designed for it.'],
      fun: [4.5, 'Rev-happy engine, light chassis. Great on twisty roads.'],
      reliability: [4.5, 'Honda.'],
      running: [4.5, 'Around 60mpg.'],
      luggage: [3, 'Tail pack or soft panniers only.'],
      greenlane: [0.5, 'No.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 7899, range: [7499, 7899], testRide: 4.5,
        note: 'About £7,899 OTR. Demo at John Banks Honda, Cambridge.' },
      { id: 'used-23', label: 'Used 2023–25', condition: 'used', years: '2023–25', price: 5900, range: [5300, 6800], testRide: 4.5 }
    ],
    search: { at: ['HONDA', 'CB750 HORNET'], slug: 'honda/cb750-hornet', q: 'Honda CB750 Hornet' }
  },
  {
    id: 'tdm900', make: 'Yamaha', model: 'TDM900', style: 'Adventure-tourer',
    engine: '897cc parallel twin (270°)', hp: 86, torqueNm: 89, wetKg: 223, seatMm: 825, tankL: 20,
    delivery: 'relaxed', drive: 'chain',
    summary: 'A tall, long-travel road all-rounder with a torquey 270° twin, famous for being fun on twisty roads. Cheap now, but getting old (2002–2014) and scarce: only a handful are listed at any time.',
    tall: 'Upright, with long-travel suspension, a roomy seat-to-peg distance and wide bars. Popular with tall riders.',
    pros: ['Torquey, characterful twin', 'Great on twisty roads', 'Upright and roomy', 'Cheap'],
    cons: ['12–24 years old', 'Scarce: few for sale', 'Small screen'],
    scores: {
      comfort: [4, 'Upright and roomy, with plush long-travel suspension. A proven touring bike.'],
      highway: [3.5, 'Smooth, balanced twin and stable at 75mph. The small screen buffets a tall rider.'],
      standing: [2.5, 'Wide bars, but a road bike.'],
      fun: [4, 'Grunty 270° twin, light steering, loves B-roads.'],
      reliability: [4.5, 'Tough, simple engine and chassis.'],
      running: [4, 'Around 50mpg and 6,000-mile services. Parts are cheap.'],
      luggage: [4, 'Givi and Yamaha racks and panniers are common on used bikes.'],
      greenlane: [1.5, 'Road bike with 18/17" wheels.']
    },
    options: [
      { id: 'used-02', label: 'Used 2002–14', condition: 'used', years: '2002–14', price: 2800, range: [2000, 3800], testRide: 3, adj: { reliability: -0.5 },
        note: 'Only about 3 on AutoTrader at a time, so look on eBay, Gumtree and Facebook too. Check chain, suspension, corrosion and history.' }
    ],
    search: { at: ['YAMAHA', 'TDM900'], slug: 'yamaha/tdm900', mcn: 'yamaha/tdm900', q: 'Yamaha TDM900' }
  },
  {
    id: 'k75', make: 'BMW', model: 'K75', style: 'Sport-tourer',
    engine: '740cc inline triple', hp: 75, torqueNm: 68, wetKg: 228, seatMm: 810, tankL: 21,
    delivery: 'relaxed', drive: 'shaft',
    summary: 'A 1985–96 classic: smooth "flying brick" triple, shaft drive and a big tank, with engines known to run past 150,000 miles. Comfortable and understated, but 30–40 years old, with dated brakes and suspension.',
    tall: '810mm seat and upright bars; roomy enough, with a slight knee bend for a 34" inseam. The K75RT adds a full touring fairing (and weight).',
    pros: ['Very smooth triple', 'Shaft drive', 'Long-lived engine', 'Cheap classic'],
    cons: ['30–40 years old', 'Dated brakes and suspension', 'Parts via specialists'],
    scores: {
      comfort: [3.5, 'Upright and comfortable, with a slight knee bend.'],
      highway: [3.5, 'Smooth and stable at 75mph. Wind protection depends on the variant (RT best, base K75 minimal).'],
      standing: [1.5, 'Not designed for it.'],
      fun: [3, 'Charming triple, but heavy with period brakes and suspension.'],
      reliability: [4.5, 'The engine and shaft drive are famously durable.'],
      running: [3.5, 'Shaft drive and around 50mpg, but specialist parts and labour. Classic insurance can be cheap with a mileage limit.'],
      luggage: [4.5, 'BMW and Krauser panniers are common.'],
      greenlane: [0.5, 'No.']
    },
    options: [
      { id: 'used-85', label: 'Used 1985–96', condition: 'used', years: '1985–96', price: 3300, range: [2500, 4500], testRide: 3, adj: { reliability: -1 },
        note: 'Most observed prices are £2,900–4,300. Rare on AutoTrader; try eBay and classic sites. Check the gearbox input spline, fuel pump and electrics. K75RT variant: about 258kg.' }
    ],
    search: { at: ['BMW', 'K 75'], slug: 'bmw/k-75', mcn: 'bmw/k75', q: 'BMW K75' }
  },
  {
    id: 'f650dakar', make: 'BMW', model: 'F650GS Dakar', style: 'Adventure',
    engine: '652cc single (Rotax)', hp: 50, torqueNm: 60, wetKg: 192, seatMm: 890, tankL: 17.3,
    delivery: 'normal', drive: 'chain',
    summary: 'The tall version of BMW\'s 2000–07 single: 21" front, long travel, 890mm seat. Cheap, frugal and a good fit for long legs, but a single is buzzy at 75mph. (The 2008+ "F650GS" is a different, 800cc twin.)',
    tall: '890mm seat, one of the tallest here, suits a 34" inseam.',
    pros: ['Tall rider fit', 'Very cheap', 'Frugal', 'Capable off-road'],
    cons: ['Buzzy at 75mph', 'Water pump and swingarm bearing issues', '18–25 years old'],
    scores: {
      comfort: [4, 'Great legroom; the seat gets tiring on long days.'],
      highway: [2.5, 'Holds 75mph, but single-cylinder vibes wear on you.'],
      standing: [4, 'Tall, with decent bars for standing.'],
      fun: [3, 'Light-ish and thumpy.'],
      reliability: [4, 'The Rotax single is tough; water pump seals and ungreased swingarm bearings are known issues.'],
      running: [4, 'Around 60mpg and cheap parts.'],
      luggage: [4.5, 'A long-time overlanders\' favourite.'],
      greenlane: [4, '21" front and long travel.']
    },
    options: [
      { id: 'used-00', label: 'Used 2000–07', condition: 'used', years: '2000–07', price: 2300, range: [1500, 3200], testRide: 3.5, adj: { reliability: -0.5 },
        note: 'Bennetts puts a good private one at about £1,500 and a very tidy one at £2,500–3,000. Check the water pump, swingarm bearings and lambda sensor.' }
    ],
    search: { at: ['BMW', 'F 650 GS'], slug: 'bmw/f-650', mcn: 'bmw/f650gs', q: 'BMW F650GS Dakar' }
  },
  {
    id: 'r1200gs', make: 'BMW', model: 'R1200GS', style: 'Adventure',
    engine: '1170cc boxer twin', hp: 100, torqueNm: 115, wetKg: 229, seatMm: 850, tankL: 20,
    delivery: 'relaxed', drive: 'shaft',
    summary: 'The default big adventure tourer: supremely comfortable, stable and torquey, with shaft drive. Its 100–125hp is well beyond your comfort band on paper, though a boxer delivers it very lazily.',
    tall: 'Adjustable 850/870mm seat and a roomy riding position. An excellent tall-rider bike.',
    pros: ['Superb long-distance comfort', 'Shaft drive', 'Everything available for it', 'Plentiful used'],
    cons: ['100–125hp', 'Final drive and early-LC issues', 'Expensive to service'],
    scores: {
      comfort: [4.5, 'All-day comfortable, with an adjustable seat and roomy riding position.'],
      highway: [4, 'Planted and smooth at 75mph with a decent screen.'],
      standing: [3.5, 'OK; the cylinders sit close to your shins.'],
      fun: [3.5, 'Torquey and surprisingly agile, but heavy and not rev-happy.'],
      reliability: [3.5, 'Mostly durable. Air-cooled bikes had final drive failures; early water-cooled (2013–14) bikes had some teething issues.'],
      running: [3, 'Around 45–50mpg, pricey BMW servicing and big tyres.'],
      luggage: [5, 'Everything exists for it.'],
      greenlane: [3.5, 'Capable, but hard work on loose surfaces.']
    },
    options: [
      { id: 'used-04', label: 'Used 2004–09 (air-cooled)', condition: 'used', years: '2004–09', price: 4500, range: [3500, 5500], testRide: 4.5, adj: { reliability: -0.25 }, specs: { hp: 100, wetKg: 229 },
        note: 'Check final drive for play or leaks, and service history.' },
      { id: 'used-10', label: 'Used 2010–12 (DOHC)', condition: 'used', years: '2010–12', price: 5600, range: [4800, 6500], testRide: 4.5, specs: { hp: 110, wetKg: 229 } },
      { id: 'used-13', label: 'Used 2013–18 (water-cooled)', condition: 'used', years: '2013–18', price: 7600, range: [6000, 9500], testRide: 4.5, adj: { highway: 0.5, fun: 0.25 }, specs: { hp: 125, wetKg: 244 },
        note: 'Smoother, stronger and better equipped. 2013–14 bikes: check recall work.' }
    ],
    search: { at: ['BMW', 'R 1200 GS'], slug: 'bmw/r-1200-gs', mcn: 'bmw/r1200gs', q: 'BMW R1200GS' }
  },
  {
    id: 'r1150gs', make: 'BMW', model: 'R1150GS', style: 'Adventure',
    engine: '1130cc boxer twin', hp: 85, torqueNm: 98, wetKg: 249, seatMm: 840, tankL: 22,
    delivery: 'relaxed', drive: 'shaft',
    summary: 'The 1999–2004 predecessor of the R1200GS: 85hp, lazy and very comfortable, with shaft drive and a 22L tank (30L on the Adventure). Heavy at 249kg, and the servo brakes and final drive need checking.',
    tall: 'Adjustable 840/860mm seat and a roomy riding position.',
    pros: ['Very comfortable', 'Lazy, torquey engine', 'Shaft drive', 'Cheap for a big GS'],
    cons: ['249kg', 'Servo brakes (2002+) and final drive can be costly', '22–27 years old'],
    scores: {
      comfort: [4.5, 'Big, roomy and comfortable.'],
      highway: [4, 'Stable and relaxed at 75mph; buffeting from the standard screen.'],
      standing: [3.5, 'OK.'],
      fun: [3, 'Characterful boxer, but heavy and old.'],
      reliability: [3.5, 'Generally rugged; known issues are servo ABS brakes, final drive, clutch splines and fuel pump controller.'],
      running: [3, 'Around 45mpg; specialist servicing.'],
      luggage: [5, 'Everything exists for it.'],
      greenlane: [3.5, 'Capable, but hard work on loose surfaces.']
    },
    options: [
      { id: 'used-99', label: 'Used 1999–2004', condition: 'used', years: '1999–2004', price: 3300, range: [2200, 4500], testRide: 3.5, adj: { reliability: -0.5 },
        note: 'Adventure versions (30L tank, taller) command a premium. Check final drive, servo brake operation and clutch.' }
    ],
    search: { at: ['BMW', 'R 1150 GS'], slug: 'bmw/r-1150-gs', mcn: 'bmw/r1150gs-adventure', q: 'BMW R1150GS' }
  },
  {
    id: 'scoutsixty', make: 'Indian', model: 'Scout Sixty', style: 'Cruiser',
    engine: '999cc V-twin', hp: 78, torqueNm: 88, wetKg: 254, seatMm: 643, tankL: 12.5,
    delivery: 'relaxed', drive: 'belt',
    summary: 'A well-made, good-looking cruiser with a smooth V-twin and belt drive. For a 6\'4" rider who wants long days and twisty roads it is a poor fit: very low seat, feet forward, little lean angle and no wind protection.',
    tall: '643mm seat puts your knees high. Tall owners fit extended-reach kits for bars, seat and pegs.',
    pros: ['Smooth, characterful V-twin', 'Belt drive', 'Build quality'],
    cons: ['Cramped for 6\'4"', 'Little lean angle', 'No wind protection', 'Small tank'],
    scores: {
      comfort: [1.5, 'Very low seat, cramped legroom for a 34" inseam, short-travel rear shocks.'],
      highway: [2.5, 'Stable, but full wind blast at 75mph.'],
      standing: [0.5, 'No.'],
      fun: [2.5, 'Nice engine and sound, but pegs scrape early on twisty roads.'],
      reliability: [4, 'Liquid-cooled engine has a good record.'],
      running: [3.5, 'Belt drive is low-maintenance; around 45–50mpg.'],
      luggage: [2.5, 'Saddlebags available; limited capacity, and the 12.5L tank limits range.'],
      greenlane: [0, 'No.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 9995, range: [9995, 11695], testRide: 3.5, specs: { hp: 85, wetKg: 243, seatMm: 649 },
        note: 'New-generation 999cc, 85hp. £9,995; Bobber £10,995, Classic £11,695. Demo fleet at Krazy Horse, Bury St Edmunds (27 miles); also Freedom Motorcycles, March.' },
      { id: 'used-16', label: 'Used 2016–24', condition: 'used', years: '2016–24', price: 6300, range: [5500, 8000], testRide: 3.5,
        note: 'Only about 5 on AutoTrader.' }
    ],
    search: { at: ['INDIAN', 'SCOUT SIXTY'], slug: 'indian/scout-sixty', mcn: 'indian/scout-sixty', q: 'Indian Scout Sixty' }
  },
  {
    id: 'scrambler400x', make: 'Triumph', model: 'Scrambler 400 X', style: 'Retro',
    engine: '398cc single', hp: 40, torqueNm: 38, wetKg: 185, seatMm: 835, tankL: 13,
    delivery: 'normal', drive: 'chain',
    summary: 'A light, punchy retro scrambler: great fun on B-roads and gravel, cheap, with 10,000-mile services. Small for a 6\'4" rider and working hard at 75mph with no screen.',
    tall: '835mm seat and wide bars, but a compact bike overall. Fine for an hour; cramped for all-day rides.',
    pros: ['Fun and light', 'Cheap to buy and run', '10,000-mile services', 'Triumph demo network'],
    cons: ['Small for 6\'4"', 'No wind protection', 'Buzzy at 75mph'],
    scores: {
      comfort: [2.5, 'Upright, but compact for your size.'],
      highway: [2, 'No screen and a revving single at 75mph.'],
      standing: [3.5, 'Wide bars; OK standing.'],
      fun: [4, 'Light, punchy and playful. You can use all of it.'],
      reliability: [3.5, 'Bajaj-built; mostly good reports so far, with some early quality niggles.'],
      running: [4.5, 'Around 65–70mpg, 10,000-mile services, cheap insurance.'],
      luggage: [3, 'Racks and soft luggage.'],
      greenlane: [3.5, '19" front and decent travel; the 400 XC (spoked wheels) is better.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 5595, range: [5595, 6645], testRide: 4.5,
        note: '£5,595 OTR; the off-road-leaning 400 XC is £6,545. Demos at Peterborough Triumph and Triumph Essex.' },
      { id: 'used-24', label: 'Used 2024–25', condition: 'used', years: '2024–25', price: 4600, range: [4000, 5300], testRide: 4.5,
        note: 'About 55 on AutoTrader.' }
    ],
    search: { at: ['TRIUMPH', 'SCRAMBLER 400 X'], slug: 'triumph/scrambler-400-x', mcn: 'triumph/scrambler-400-x', q: 'Triumph Scrambler 400 X' }
  },
  {
    id: 'interceptor650', make: 'Royal Enfield', model: 'Interceptor 650', style: 'Retro',
    engine: '648cc parallel twin (270°)', hp: 47, torqueNm: 52, wetKg: 217, seatMm: 804, tankL: 13.7,
    delivery: 'relaxed', drive: 'chain',
    summary: 'A charming retro roadster with a sweet-sounding, relaxed twin. Cheap used, with a dealer in Girton. The low seat and lack of wind protection count against it for long motorway days.',
    tall: '804mm seat bends a 34" leg noticeably; bars are upright and comfortable.',
    pros: ['Lovely engine and sound', 'Cheap used', 'Dealer 2 miles away', 'Proven reliable'],
    cons: ['Low seat for your legs', 'No wind protection', 'Soft suspension, modest brakes'],
    scores: {
      comfort: [3, 'Comfy seat and upright bars; legroom is short for you.'],
      highway: [2.5, 'Smooth and happy at 70mph, but wind blast at 75 with no screen.'],
      standing: [2, 'Not designed for it.'],
      fun: [3.5, 'Characterful and engaging at sane speeds; soft chassis.'],
      reliability: [4, 'The 650 twin has proved reliable since 2018. Watch for corrosion on finishes.'],
      running: [4.5, 'Around 60mpg, cheap parts and insurance.'],
      luggage: [3, 'Rack and soft panniers.'],
      greenlane: [1, 'Road bike.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 7049, range: [6799, 7049], testRide: 4.5,
        note: 'From £7,049 on Royal Enfield UK. Demo at Haywards, Girton (2 miles).' },
      { id: 'used-19', label: 'Used 2019–24', condition: 'used', years: '2019–24', price: 3800, range: [3000, 4650], testRide: 4.5,
        note: 'Plentiful: about 75 on AutoTrader.' }
    ],
    search: { at: ['ROYAL ENFIELD', 'INTERCEPTOR 650'], slug: 'royal-enfield/interceptor-650', mcn: 'enfield/interceptor-650', q: 'Royal Enfield Interceptor 650' }
  },
  {
    id: 'xrv750', make: 'Honda', model: 'XRV750 Africa Twin', style: 'Adventure',
    engine: '742cc V-twin', hp: 60, torqueNm: 62, wetKg: 234, seatMm: 880, tankL: 23,
    delivery: 'relaxed', drive: 'chain',
    summary: 'The original 1990–2003 Africa Twin: tall, comfortable, with a proper fairing and a 23-litre tank. A near-legendary overlander, now a rising classic; age and parts availability are the risks.',
    tall: '880mm seat and tall bars. A great fit for a 34" inseam.',
    pros: ['Tall rider fit', 'Good fairing', '23L tank', 'Classic, holding value'],
    cons: ['23–36 years old', 'Heavy for 60hp', 'Parts getting scarcer'],
    scores: {
      comfort: [4, 'Tall, roomy and comfortable.'],
      highway: [3.5, 'Good fairing and smooth V-twin; relaxed at 75mph.'],
      standing: [4, 'Tall bars; good standing.'],
      fun: [3, 'Charismatic, but soft and heavy by modern standards.'],
      reliability: [4.5, 'Famously tough. Known weak points: regulator/rectifier and fuel pump relay.'],
      running: [3.5, 'Around 45mpg, and carburettors need looking after.'],
      luggage: [4.5, 'Well supported.'],
      greenlane: [4, 'Capable, if heavy.']
    },
    options: [
      { id: 'used-90', label: 'Used 1990–2003', condition: 'used', years: '1990–2003', price: 4500, range: [3500, 5800], testRide: 3, adj: { reliability: -1 },
        note: 'Everyday usable bikes mostly sell for £3,000–4,300; the best are above £5,500. Only about 3 on AutoTrader.' }
    ],
    search: { at: ['HONDA', 'XRV750 AFRICA TWIN'], slug: 'honda/xrv750-africa-twin', mcn: 'honda/xrv750-africa-twin', q: 'Honda XRV750 Africa Twin' }
  },
  {
    id: 'zx4rr', make: 'Kawasaki', model: 'Ninja ZX-4RR', style: 'Sport',
    engine: '399cc inline four', hp: 77, torqueNm: 39, wetKg: 189, seatMm: 800, tankL: 15,
    delivery: 'normal', drive: 'chain',
    summary: 'A 399cc four that screams to 16,000rpm: huge fun when you are pushing hard, but not especially fast at road speeds, which is the appeal. It is a supersport bike, so very cramped for 6\'4", with no luggage and little comfort. (Assumed from "XZ-4R"; the UK sells the ZX-4RR.)',
    tall: 'Clip-ons, high pegs and an 800mm seat. Very cramped for a 34" inseam.',
    pros: ['Incredible engine sound and revs', 'Sharp handling', 'Reliable'],
    cons: ['Very cramped for 6\'4"', 'Buzzy at motorway speeds', 'No luggage'],
    scores: {
      comfort: [1.5, 'Supersport riding position; very cramped for you.'],
      highway: [2, 'Around 9,000rpm at 75mph with a small fairing. Tiring.'],
      standing: [0.5, 'No.'],
      fun: [5, 'Wringing out a 16,000rpm four on a B-road is the whole point.'],
      reliability: [4.5, 'Modern Kawasaki.'],
      running: [3, 'Around 50mpg; supersport insurance costs more.'],
      luggage: [1.5, 'Tail pack only.'],
      greenlane: [0, 'No.']
    },
    options: [
      { id: 'new', label: 'New 2026', condition: 'new', years: '2026', price: 8799, range: [8799, 8799], testRide: 3.5,
        note: '£8,799. Nearest dealers: Wheels, Peterborough; Orwell, Ipswich.' },
      { id: 'used-23', label: 'Used 2023–25', condition: 'used', years: '2023–25', price: 7000, range: [6600, 7500], testRide: 4,
        note: 'About 55 on AutoTrader.' }
    ],
    search: { at: ['KAWASAKI', 'NINJA ZX-4RR'], slug: 'kawasaki/ninja-zx-4rr', mcn: 'kawasaki/zx-4rr', q: 'Kawasaki ZX-4RR' }
  },
  {
    id: 'vfr400', make: 'Honda', model: 'VFR400R (NC30)', style: 'Sport',
    engine: '399cc V4', hp: 59, torqueNm: 40, wetKg: 182, seatMm: 755, tankL: 15,
    delivery: 'normal', drive: 'chain',
    summary: 'A 1989–93 cult classic: gear-driven V4, race-bred chassis, gorgeous. Tiny for a 6\'4" rider, over 30 years old, and parts are getting scarce. A collector\'s toy more than a touring bike.',
    tall: '755mm seat and low clip-ons. You will be folded up.',
    pros: ['V4 sound', 'Legendary handling', 'Classic value'],
    cons: ['Tiny for 6\'4"', '33–37 years old', 'Parts scarcity', 'Mostly grey imports'],
    scores: {
      comfort: [1, 'Far too small for a tall rider.'],
      highway: [1.5, 'Revving hard at 75mph with an old, small fairing.'],
      standing: [0.5, 'No.'],
      fun: [4.5, 'Gear-driven cam whine and sublime handling.'],
      reliability: [4.5, 'Honda-built and robust.'],
      running: [3, 'Parts are expensive; classic insurance can help.'],
      luggage: [1, 'Almost none.'],
      greenlane: [0, 'No.']
    },
    options: [
      { id: 'used-89', label: 'Used 1989–93', condition: 'used', years: '1989–93', price: 4800, range: [3000, 8000], testRide: 3, adj: { reliability: -1 },
        note: 'Tidy grey imports are £3,000–5,000; rarer UK-spec bikes (62hp) £4,000–6,000, mint up to £9,000. Few for sale, and parts are getting scarce.' }
    ],
    search: { at: ['HONDA', 'VFR400'], slug: 'honda/vfr400', mcn: 'honda/vfr400', q: 'Honda VFR400 NC30' }
  },
  {
    id: 'crf300l', make: 'Honda', model: 'CRF300L Rally', style: 'Dual-sport', reference: true,
    engine: '286cc single', hp: 27, torqueNm: 27, wetKg: 153, seatMm: 885, tankL: 12.8,
    delivery: 'normal', drive: 'chain',
    summary: 'Your current bike, included as a reference point for the scores. Scored from what you described: bars too low and close, nervous at motorway speeds, squishy suspension.',
    tall: 'Good legroom; bars too low and close when standing.',
    pros: ['Light', 'Great off-road', 'Cheap to run'],
    cons: ['Wobbly at motorway speeds', 'Low bars', 'Underpowered for touring'],
    scores: {
      comfort: [2.5, 'OK legroom; narrow seat and low, close bars.'],
      highway: [1.5, 'You found it wobbly and nervous at freeway speeds.'],
      standing: [2, 'You found the bars too low and close.'],
      fun: [3, 'Fun off-road; squishy on the road.'],
      reliability: [5, 'Honda.'],
      running: [5, 'Very cheap to run.'],
      luggage: [3.5, 'Rally racks available.'],
      greenlane: [5, 'Ideal.']
    },
    options: [
      { id: 'used-21', label: 'Used 2021–25', condition: 'used', years: '2021–25', price: 4800, range: [4200, 5500], testRide: 4.5 }
    ],
    search: { at: ['HONDA', 'CRF300L RALLY'], slug: 'honda/crf300-rally', mcn: 'honda/crf300l', q: 'Honda CRF300L Rally' }
  }
];
