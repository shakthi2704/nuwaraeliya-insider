// Data shape mirrors a future Supabase `guides` table.
// Single source of truth for the homepage teaser, the /guides index, and
// /guides/[slug] detail pages. Replace with a fetch/query when the DB is
// connected. Body is plain paragraphs separated by blank lines.

export type Guide = {
    slug: string;
    category: string;
    title: string;
    excerpt: string; // short teaser — homepage card, index card
    body: string;    // full article — detail page
    readTime: string;
    image: string;
    alt: string;
};

// Order matters: the homepage shows the first three.
export const GUIDES: Guide[] = [
    {
        slug: "getting-to-nuwara-eliya",
        category: "Getting There",
        title: "The Real Way to Get to Nuwara Eliya",
        excerpt:
            "Train, private car, or the public bus everyone warns you about — what each one actually costs, how long it really takes, and which one we'd pick.",
        body:
            "There are three realistic ways to reach Nuwara Eliya: the train, a private car, or the public bus. None of them is wrong, but each suits a different kind of traveler, and the right choice depends more on your luggage and your patience than on the map.\n\nThe train is the one people photograph. The hill-country line climbs up from Kandy to Nanu Oya, which is the station for Nuwara Eliya, a short drive from town, so you will need a taxi or tuk-tuk for the last stretch. It is slow, and that is the point. Seats in the better classes can sell out well ahead of travel, so book early rather than hoping for a seat on the day.\n\nA private car with a driver is the most flexible and the most expensive option. The road climbs in long, winding sections and takes longer than the distance suggests, so plan on most of a day from Colombo once you add stops. It works well if you have luggage, are travelling as a group, or want to stop at tea estates and viewpoints along the way.\n\nThe public bus is the cheapest and runs often, but it is crowded and has little room for bags. It suits light travelers on a flexible schedule. It is a poor first choice if you carry a large suitcase or are prone to motion sickness on winding roads.\n\nOur pick: the train for the journey itself, a car if time matters more than the experience, and the bus only if budget decides it. Schedules and fares change, so confirm them shortly before you travel.",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1771044682184-1b60ace4a7fa?w=900&q=80",
        alt: "Train crossing a lush green viaduct bridge in Sri Lanka",
    },
    {
        slug: "where-to-stay",
        category: "Practical Info",
        title: "Where to Stay, by Type of Trip",
        excerpt:
            "Colonial bungalows, working tea estates, and modern guesthouses — matched to who you're traveling with, not just star ratings.",
        body:
            "Accommodation in Nuwara Eliya falls into three broad types: colonial-era hotels and bungalows, bungalows on working tea estates, and modern guesthouses. Star ratings tell you very little about which one will suit your trip. Who you are traveling with tells you much more.\n\nFor couples, the colonial-era properties and estate bungalows are the natural fit. They offer the quiet, the views and the slow evenings the town is known for, usually with a fireplace or a dining room worth lingering in. Expect to pay more for these, and expect them to book out early in busy periods.\n\nFor families, a modern guesthouse often works better than the grand option. Rooms are more practical, meals are more flexible, and there is less to worry about with children. Ask specifically about heating and hot water, since the evenings are properly cold.\n\nFor solo travelers and tighter budgets, guesthouses close to the lake keep you within walking distance of the town, which saves on transport and lets you move at your own pace.\n\nWhichever you choose, book well ahead if you plan to visit during the April season, when the town is at its busiest, and always check that the room has heating and hot water before you pay.",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1758390286386-87c9d78cf9be?w=900&q=80",
        alt: "Lush green tea plantation on a hillside",
    },
    {
        slug: "what-to-pack",
        category: "Before You Go",
        title: "What to Actually Pack for the Cold",
        excerpt:
            "It's Sri Lanka, but it's 16°C and misty most mornings. What you genuinely need, and what every packing list gets wrong about it.",
        body:
            "Most packing lists for Sri Lanka assume heat. Nuwara Eliya does not. Mornings and evenings are properly cold, and the plateau at dawn is colder still, so the mistake most visitors make is packing for the beach and arriving in the hills with nothing warm.\n\nThe core of what you need is layers: a fleece or light insulated jacket, a few long-sleeved tops, and long trousers. You will wear the jacket early and late and take it off by midday, so choose something that packs down small.\n\nA waterproof jacket is worth more than an umbrella. Mist and short showers are common, and you will want your hands free on walks. Closed shoes with decent grip matter on wet tea-estate paths and on the Horton Plains circuit.\n\nDo not forget sun protection. At altitude the sun is strong even when it feels cool, so a hat and sunscreen belong in the bag alongside the warm layers.\n\nWhat you can leave at home: heavy winter coats, and anything formal. The dress code in the hills is relaxed, and warmth matters more than polish.",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1758390286386-87c9d78cf9be?w=900&q=80",
        alt: "A stack of warm sweaters folded on a chair",
    },
    {
        slug: "best-time-to-visit",
        category: "Planning",
        title: "The Best Time to Visit Nuwara Eliya",
        excerpt:
            "There is no single right month. Here is what each part of the year actually feels like in the hills, and who it suits.",
        body:
            "Nuwara Eliya is a year-round destination, but the months are not equal, and the best one depends on what you want from the trip.\n\nThe dry season, roughly December to March, is the most reliable time for clear views and for Horton Plains, where the morning mist is most likely to lift in time to see World's End. If the plateau is the main reason you are coming, this is the window to aim for.\n\nApril is the busiest month. The town fills up for the April season, with horse racing and plenty of visitors from across the country. It is lively and fun, but accommodation books early and prices rise, so it suits you only if you want that atmosphere.\n\nThrough the middle of the year the hills turn misty and wet. It is quieter and very green, and the tea country looks its best, but you should expect cloud and rain and plan indoor alternatives.\n\nThe shoulder months around October, November and May sit between the extremes. You can get good days and wet ones in the same week, so they reward flexible travelers and punish rigid itineraries.",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1758390286386-87c9d78cf9be?w=900&q=80",
        alt: "Aerial view of rolling green hills under a cloudy sky",
    },
    {
        slug: "weather",
        category: "Practical Info",
        title: "The Weather, Honestly",
        excerpt:
            "Cool, changeable, and rarely what the forecast app promises. How to plan around the hill-country weather instead of fighting it.",
        body:
            "The weather in Nuwara Eliya is cool by Sri Lankan standards and changes quickly. A bright morning can turn to cloud by midday and to light rain by the afternoon, so the sensible plan is to do the important thing early.\n\nTemperatures are mild during the day and drop sharply after sunset. In the coldest months, nights can fall into single digits, which surprises people who packed for the tropics.\n\nRain is possible in any month, but it is most reliable in the middle of the year and again around the inter-monsoon months. Short showers are more common than long storms, so it is rarely worth cancelling a day outright.\n\nForecast apps are a rough guide at best in the hills, because conditions vary from valley to valley. A better habit is to check the sky at breakfast, start early, and keep the afternoon flexible.\n\nThe practical rule: plan outdoor activities for the morning, keep a waterproof layer in your bag, and treat the afternoon as spare time rather than scheduled time.",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1758390286386-87c9d78cf9be?w=900&q=80",
        alt: "Winding road through misty tea plantation hills",
    },
    {
        slug: "local-tips",
        category: "Local Advice",
        title: "Local Tips Before You Arrive",
        excerpt:
            "The small practical things that make the trip easier, none of which appear in the usual guidebook summary.",
        body:
            "A few small habits make a trip to the hills noticeably easier, and most of them are things locals do without thinking.\n\nStart early. The best parts of the day here are the first hours, when the air is clear and the crowds have not arrived. Horton Plains in particular rewards an early start, and the lake is at its best at first light.\n\nAgree the price before you ride. For tuk-tuks and taxis, settle the fare before you set off rather than after, and ask your hotel what a normal fare looks like so you have a reference.\n\nCarry some cash. Smaller shops, cafes and local transport often do not take cards, so keep a modest amount of local currency with you, particularly on day trips out of town.\n\nDo not over-schedule. The roads are slow and the weather changes, so a plan with one main activity a day almost always works better than a plan with three.\n\nAsk about heating and hot water. Many visitors are surprised by how cold the evenings are, and not every room is set up for it, so check before you book.",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1758390286386-87c9d78cf9be?w=900&q=80",
        alt: "Still lake surrounded by green hills at dawn",
    },
];