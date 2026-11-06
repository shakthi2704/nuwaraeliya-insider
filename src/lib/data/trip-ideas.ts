// Data shape mirrors a future Supabase `trip_ideas` table (with a child
// `trip_idea_days` table for the itinerary). Single source of truth for the
// homepage teaser, the /trip-ideas index, and /trip-ideas/[slug] detail pages.
// Replace with a fetch/query when the DB is connected.

export type TripDay = {
    title: string;
    description: string;
};

export type TripIdea = {
    slug: string;
    duration: string;
    title: string;
    description: string; // short teaser — homepage card, index card
    body: string;        // longer intro — detail page
    highlights: string[];
    days: TripDay[];
    image: string;
    alt: string;
    featured?: boolean;
};

export const TRIP_IDEAS: TripIdea[] = [
    {
        slug: "week-in-the-hills",
        duration: "7 Days",
        title: "A Week in the Hills",
        description:
            "The unhurried version. Enough time to actually settle into the pace of the hill country — tea estates in the morning, the plateau at dawn, long lunches, and evenings that end early because the air turns cold. Built for people who would rather do four things well than ten things quickly.",
        body:
            "Most people give Nuwara Eliya a night or two and leave feeling they saw very little. A full week changes that. The days here have a natural shape — cold, clear mornings, mist by midday, early evenings — and a week lets you work with that rhythm instead of against it.\n\nThis plan has three anchor days (the lake, the tea estate, the plateau) and leaves the rest deliberately open. If the weather turns on the day you planned for Horton Plains, swap it with a rest day; nothing else in the week depends on the order.",
        highlights: ["Horton Plains & World's End", "Pedro Tea Estate", "Gregory Lake at First Light"],
        days: [
            {
                title: "Arrive and settle",
                description:
                    "Check in and do very little. A short walk near Gregory Lake in the late afternoon is plenty. The air turns cold quickly after sunset, so keep a warm layer close.",
            },
            {
                title: "Gregory Lake at first light",
                description:
                    "Walk the bund before the town wakes, then have a slow breakfast. Keep the rest of the day open — the first full day at altitude is better taken gently.",
            },
            {
                title: "Pedro Tea Estate",
                description:
                    "Take the factory tour in the morning, then walk the tea rows afterwards while the hillsides are at their best. Allow two to three hours in all.",
            },
            {
                title: "A day with nothing booked",
                description:
                    "Wander the town, sit in Victoria Park, read. This day is the buffer that makes the rest of the week work, and the one to give up if you need a spare day for the plateau.",
            },
            {
                title: "Horton Plains and World's End",
                description:
                    "Leave before dawn so you reach the escarpment before the mist closes in. The circuit takes three to four hours; plan to be back in town by midday and rest after.",
            },
            {
                title: "A slow day after the plateau",
                description:
                    "Start late. If you want something gentle, Hakgala Botanical Garden is a short drive out of town and works well for an afternoon.",
            },
            {
                title: "A last morning",
                description:
                    "One more walk by the lake if the weather allows, then depart. Nothing else planned, so you don't leave in a rush.",
            },
        ],
        image: "https://images.unsplash.com/photo-1748753778598-2e5c4244e90e?w=1200&q=80",
        alt: "Winding road through misty tea plantation hills",
        featured: true,
    },
    {
        slug: "three-days-as-a-couple",
        duration: "3 Days",
        title: "3 Days as a Couple",
        description:
            "A short, quiet trip built around slow mornings and one good view. Less itinerary, more mood.",
        body:
            "Three days is enough for a proper break if you resist the urge to fill it. This plan has one planned activity a day at most, long gaps in between, and early evenings — the town is at its best when it's cold, quiet and you have nowhere to be.",
        highlights: ["Gregory Lake at First Light", "Pedro Tea Estate"],
        days: [
            {
                title: "Arrive and watch the light go",
                description:
                    "Check in, rest, and walk by Gregory Lake as the afternoon fades. Eat early — the evening air is cold and the town winds down soon after dark.",
            },
            {
                title: "Pedro Tea Estate",
                description:
                    "Do the factory tour in the morning, followed by a long, unhurried lunch. Spend the afternoon indoors or walking the tea rows if the weather is kind.",
            },
            {
                title: "Gregory Lake at first light",
                description:
                    "An early walk along the bund while the lake is still, then breakfast and a slow departure.",
            },
        ],
        image: "https://images.unsplash.com/photo-1741217529666-10911b02fb1b?w=800&q=80",
        alt: "Couple silhouetted together at sunset",
    },
    {
        slug: "the-long-weekend",
        duration: "2 Days",
        title: "The Long Weekend",
        description:
            "For when you can only get away for two days but still want it to feel like a proper trip, not a rushed detour.",
        body:
            "Two days only works if you commit to one big thing and protect the rest. This plan puts the plateau first, while you have the energy for an early start, and saves the second day for the quieter lake walk.",
        highlights: ["Horton Plains & World's End", "Gregory Lake at First Light"],
        days: [
            {
                title: "Horton Plains and World's End",
                description:
                    "Leave before dawn to reach the escarpment before the mist. Be back in town by midday, then rest — the early start and the altitude catch up with most people.",
            },
            {
                title: "Gregory Lake at first light",
                description:
                    "Walk the bund before the town wakes, have breakfast, and head off without hurrying.",
            },
        ],
        image: "https://images.unsplash.com/photo-1680237659901-29f8d39ff290?w=800&q=80",
        alt: "Aerial view of rolling green hills under a cloudy sky",
    },
];