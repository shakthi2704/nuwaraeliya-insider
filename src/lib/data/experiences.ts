// Data shape mirrors a future Supabase `experiences` table.
// Single source of truth for the homepage teaser strip, the /experiences
// index, and /experiences/[slug] detail pages. Replace with a fetch/query
// when the DB is connected — consuming components stay identical.
//
// Display labels for categories and effort live in messages/*.json
// (`categories.*`, `effort.*`), not here. Planner-specific fields (start
// windows, season, travel clusters) are added in the planner step, once the
// planner defines exactly what it needs.

/** The 8 canonical categories from EXPERIENCE_SYSTEM.md. */
export const CATEGORY_IDS = [
    "nature",
    "tea-plantation",
    "photography",
    "adventure",
    "relaxation",
    "food-local",
    "wildlife",
    "culture",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type Effort = "easy" | "moderate" | "demanding";

export type Experience = {
    slug: string;
    /** Legacy display label. Still read by components not yet rebuilt;
     *  remove once they use `categories` + the `categories.*` messages. */
    category: string;
    /** Planner and filter tags. The first entry is the primary category
     *  shown on cards. */
    categories: CategoryId[];
    title: string;
    description: string; // short teaser — homepage card, index card
    body: string;        // full write-up — detail page
    duration: string;
    elevationM?: number; // metres above sea level, shown on cards
    area: string;        // where it is, shown on cards
    effort: Effort;
    bestFor: string;     // short human phrase, shown on cards
    image: string;
    alt: string;

    /* Optional editorial sections for the detail page. Each one renders
       only when filled in, so only add content you have verified yourself. */
    highlights?: { title: string; description: string }[]; // "What to expect"
    practicalNotes?: { title: string; description: string }[]; // "Field notes"
    insiderTip?: string; // one short tip in your own words
};
export const EXPERIENCES: Experience[] = [
    {
        slug: "horton-plains-worlds-end",
        category: "Nature",
        categories: ["nature", "adventure", "photography"],
        title: "Horton Plains & World's End",
        description:
            "Walk the plateau at dawn and reach the escarpment edge where the land drops 880 metres into the valley below. Best in the dry season when the mist clears by mid-morning.",
        body:
            "Horton Plains is a highland plateau of grassland and cloud forest, roughly forty-five minutes from town. The reserve opens at dawn, and that timing is not a suggestion — the whole point of the walk is reaching World's End, the escarpment where the plateau falls away 880 metres into the valley, before the midday mist rolls in and closes the view.\n\nThe circuit is about nine kilometres and takes three to four hours at an easy pace, passing Baker's Falls partway round. The terrain is flat to gently rolling, no technical climbing, but the altitude and early cold catch people off guard — bring a proper layer for the first hour.\n\nBest visited in the dry season, roughly January to March, when the morning mist clears reliably. Outside that window you can still go, but the view at World's End is a genuine gamble.",
        duration: "Half day",
        elevationM: 2100, // verify
        area: "Horton Plains National Park",
        effort: "moderate", // verify
        bestFor: "Walkers and early risers",
        image: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80",
        alt: "Open plateau of Horton Plains at first light",
    },
    {
        slug: "pedro-tea-estate",
        category: "Tea & Plantation",
        categories: ["tea-plantation", "photography"],
        title: "Pedro Tea Estate",
        description:
            "Follow the leaf from bush to cup inside one of the oldest working estates in the hill country. The factory tour is unhurried and the people who run it have been here for generations.",
        body:
            "Pedro is one of the oldest working tea estates around Nuwara Eliya, still processing leaf on machinery that has barely changed in a century. The factory tour walks the full process — withering, rolling, oxidation, firing — narrated by people who grew up around the same floors.\n\nUnlike the larger, more commercial estates closer to town, Pedro's tour moves at its own pace rather than a fixed script. Expect to spend two to three hours, finishing with a tasting of the estate's own grades.\n\nWorth combining with a walk through the surrounding tea rows before or after — the terraced hillsides are at their most photogenic in the hour after the morning mist lifts.",
        duration: "2 – 3 hours",
        elevationM: 1900, // verify
        area: "Nuwara Eliya Valley",
        effort: "easy", // verify
        bestFor: "Anyone curious about tea",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        alt: "Terraced tea rows on a hill-country estate",
    },
    {
        slug: "gregory-lake-morning",
        category: "Relaxation",
        categories: ["relaxation", "nature"],
        title: "Gregory Lake at First Light",
        description:
            "A quiet walk along the colonial-era bund before the town wakes. The lake sits perfectly still in the early morning, the surrounding hills reflected in it without distortion.",
        body:
            "Gregory Lake sits at the centre of town, and by mid-morning it is firmly a tourist stop — pedal boats, vendors, crowds. At first light it is a different place entirely: still water, the surrounding hills reflected without distortion, and almost nobody else on the bund.\n\nThe walk along the colonial-era bund takes about an hour at an unhurried pace, roughly circling the lake. No booking, no cost, no guide needed — just a reason to be up before the town properly wakes.\n\nBest paired with breakfast afterward at one of the cafes near the lake, once they open around eight.",
        duration: "1 – 2 hours",
        elevationM: 1868, // verify
        area: "Lake Gregory, town centre",
        effort: "easy", // verify
        bestFor: "Early risers",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
        alt: "Still lake surrounded by green hills at dawn",
    },
    {
        slug: "ramboda-falls",
        category: "Nature",
        categories: ["nature", "photography"], // verify
        title: "Ramboda Falls & Valley Tea Viewpoint",
        description:
            "A scenic road descent toward Kandy, passing the 109 m twin cataract, paired with a short stone stairway trail through damp fern grottoes.", // verify 109 m
        body:
            "Ramboda Falls is a scenic stop on the road down from Nuwara Eliya toward Kandy. The twin cataract drops about 109 metres, and a short stone stairway trail leads through damp fern grottoes for a closer look.\n\nAllow about half a day including the drive. The stairs are the only real effort, and they are worth taking slowly.", // verify, expand with your own notes
        duration: "Half day",
        elevationM: 945, // verify
        area: "Ramboda Pass",
        effort: "moderate", // verify
        bestFor: "Scenic drivers",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDErCcX3SHpVPMC7uOE_eRYIxGArr3W0gPPaO5ji26XERj71mK4MXaZ6pjCj7jRvodB3aY3c78re_v_wOcdsNNvib4hN1AQQR4WEz6T_AkqVLw401VZS1_YY70aApjHPO12iSz58N9uSaeuYEB_jXHI-k0Xf9v1C1ukEJg4EKW67-LbQzAgy1vyFxYms5ohR2AoFIzDfxBBk9hjfCOrZHJoVVeYwpuxhyB8UT_X5enCNRX8jwV5UnZ1", // placeholder from Stitch, replace with a real photo
        alt: "Tiered cascades of Ramboda Falls above a tea-covered ravine",
    },
    {
        slug: "hakgala-botanical-garden",
        category: "Nature",
        categories: ["nature", "wildlife"], // verify
        title: "Hakgala Botanical Garden",
        description:
            "Established in 1861 beneath the sheer face of Hakgala Rock, with historic rose gardens, mountain orchids and endemic montane birds.", // verify
        body:
            "Hakgala Botanical Garden was established in 1861 and sits beneath the dark rock face that gives it its name. It is known for its rose gardens, mountain orchids and the birds of the montane forest.\n\nIt is an easy, gentle walk of two to three hours, and a good counterweight to the early starts elsewhere on the itinerary. It lies on the Badulla road, south-east of the town.", // verify, expand with your own notes
        duration: "2 – 3 hours", // verify
        elevationM: 1745, // verify
        area: "Badulla Road",
        effort: "easy",
        bestFor: "Nature lovers",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAABJorTfLSWuAXUpz_UTnlX2yTgLfOYoY_2VOA9BGwPevRIfD7tq_-2zLy_td3vVN9y7lI953_69W0UASLGHXrmVpU-lccTCeLZ95b8ZvLEOmFl0dn3cUH6CO8S-YyOM7dxl49nF-CgJV_0i3RRdZt2rRCOEnMtuHDLPTh_Vf7h_vTqQS_laMcTBTD64ubCsXEfomyiHrdyfBXyZIFWV0Y0-PUcMdETApUgFfFHQMkrei6MtqjYQku", // placeholder from Stitch, replace with a real photo
        alt: "Tree ferns and flower beds at Hakgala Botanical Garden below a granite rock face",
    },
    {
        slug: "grand-hotel-high-tea",
        category: "Food & Local",
        categories: ["food-local", "culture"], // verify
        title: "Grand Hotel High Tea",
        description:
            "A classic afternoon ritual on the manicured lawn terrace, with single-estate orange pekoes and freshly baked warm scones.", // verify
        body:
            "Afternoon tea at the Grand Hotel is one of the town's colonial-era rituals. It is served on the lawn terrace, with single-estate tea and freshly baked scones.\n\nPlan about two hours and keep it for the afternoon, when the morning walks are done and the mist is settling in. It is unhurried by design.", // verify, expand with your own notes
        duration: "2 hours",
        area: "Grand Hotel grounds, Colonial Quarter",
        effort: "easy",
        bestFor: "Couples and food lovers",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0MU-h2VY9l085-d4SG8Fg5skUfIJCfen3uTH3hv6kFDDPd8UPxscL8FO04Vu6u5MCD3JqovnqhC-uhuxP7A9_926ES54qvQ9DjQJv_guKaz6Uos7Yi0NzQjI1lZPkQsnZcBQGXwsR7fuIBPdWOudNy5-66uIhI5oh6le5raTqD4bPZdsQ7YCrzvPktiimH995bIJ5pWsUnVAFCTJOGvDjqR8UOTIWSa7T6opxTTYTdUrgNQrZV4kE", // placeholder from Stitch, replace with a real photo
        alt: "Tea service with scones in a colonial-style salon with lawn views",
    },
    {
        slug: "single-tree-hill-sunrise",
        category: "Photography",
        categories: ["photography", "nature"], // verify
        title: "Single Tree Hill Sunrise Summit Hike",
        description:
            "A trail through temple grounds and tea paths above the racecourse, ending in a 360-degree dawn panorama over the Nuwara Eliya basin.", // verify
        body:
            "Single Tree Hill sits above the racecourse. The trail winds through the grounds of a Buddhist temple and along tea paths to a summit with a 360-degree view over the whole Nuwara Eliya basin.\n\nIt is a sunrise hike. Plan on a start around 5:30 AM and about three hours in total.", // verify, expand with your own notes
        duration: "3 hours", // verify
        elevationM: 2100, // verify
        area: "Above the Racecourse",
        effort: "moderate", // verify
        bestFor: "Photographers",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwrlivHh3UCCXfv6_k-oivhwjqC0wDQG4kfWbJxMEdlYhkwjXsI2FpsHZtw2RYxteG8OghDsbKTyNrXqTrhyxEPt_qw0IfbCxPeGX5gnJ4KRKAL46hdOUo4_AwOqQPt1givlmc1Pi5jwr7iQ2VDadBkbHzHkCuHXtGoHmbouGTnKJZFCEAVi76f1b6cQptNsMki0PY3LdU2yfkp28dMj2zeGtYXxb1Ob8FtqSJm-jCHYrIx4YzKEBX", // placeholder from Stitch, replace with a real photo
        alt: "Sunrise over the misty Nuwara Eliya basin seen from a hilltop with cypress trees",
    },
    {
        slug: "lovers-leap-waterfall",
        category: "Nature",
        categories: ["nature"], // verify
        title: "Lovers Leap Waterfall & Forest Trail",
        description:
            "A peaceful two-hour walk from local tea villages to a 30 m cascade tied to Kandyan royal folklore.", // verify 30 m
        body:
            "Lovers Leap is reached on foot from the tea villages around Hawa Eliya. The walk takes about two hours and ends at a 30 metre cascade, which is tied to old Kandyan royal folklore.\n\nThe trail is of moderate difficulty and runs mostly through tea country and forest.", // verify, expand with your own notes
        duration: "2 hours",
        elevationM: 1930, // verify
        area: "Hawa Eliya",
        effort: "moderate", // verify
        bestFor: "Nature lovers",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM-i9e7wm1r_5oCvYx4Ofr21IL1FTXlMbde4yDFuIAgDCB-CEF2KFNRpvJ2AnWxwJu9KpNba2jzasH-YCd4g9gA94b0kqHcbjenK4M1b8iMTH9ahK8F4ywQUCaRf8j1pVACurFl4O9mutuOv3L_uvAUfC0MD_Mn0IwGHI1dat5S2IfuyvK2HPo2a4tjc7Z_f6wado-wuqbEG9wURJv2HVTJrVd0--_f7094nQhSFXs77vXqZPQ9JyQ", // placeholder from Stitch, replace with a real photo
        alt: "A waterfall dropping over dark rocks into a pool, surrounded by highland forest",
    },
    {
        slug: "victoria-park-birding",
        category: "Wildlife",
        categories: ["wildlife", "nature"], // verify
        title: "Victoria Park Avian Walk & Flower Gardens",
        description:
            "A haven for winter migrant birds such as the Kashmir Flycatcher, within 27 acres of well-kept mountain gardens.", // verify 27 acres, Kashmir Flycatcher
        body:
            "Victoria Park is in the middle of town and is well known with birdwatchers for winter migrants such as the Kashmir Flycatcher. The grounds cover about 27 acres of carefully kept mountain flowers and trees.\n\nPaths are paved and easy, so it works well as a short, gentle stop of about an hour and a half.", // verify, expand with your own notes
        duration: "1.5 hours",
        area: "Town centre",
        effort: "easy",
        bestFor: "Birdwatchers and solo travelers",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaYEWtuBdOpdmF1iqBH6D_SFXCMfQRhFIpnogEmL7yr6bwsuLDtGB5zlal1Yj_Cx54eZgghTEiuSEEBfFN64kudw_pPMpXacYk749q3RZ_5XZPDmVyhs0D-bJNYHB3t78GpWIxGF67-U5k-bCLP7YVF3x5OO2X28lXzEFPeatKsWkZlbv8-L1n6ybXZSvowUWKLDX3ze5n8hceg2m5ZOIbEHTo9Nmm8YWKuIxkGZDsnsacY_XguysR", // placeholder from Stitch, replace with a real photo
        alt: "Tall cedar trees and flowerbeds in a misty park, with a small bird on a mossy branch",
    },
];