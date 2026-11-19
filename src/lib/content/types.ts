
// Shared content types and fixed vocabularies. These stay in code whatever
// the content source is (today the static files in src/lib/data, later
// Sanity). Display labels for categories and effort live in messages/*.json
// (`categories.*`, `effort.*`).

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

/* What the planner wizard (a client component) needs from an experience: its
   categories, and a photo for each interest option. The long write-ups stay
   on the server. */
export type ExperienceSummary = Pick<
    Experience,
    "slug" | "categories" | "image" | "alt"
>;

/* Guide category keys. The labels live in messages (guideMeta.category).
   The key is also the topic id in /guides?topic=... */
export type GuideCategory =
    | "getting-there"
    | "practical-info"
    | "before-you-go"
    | "planning"
    | "local-advice";

export type Guide = {
    slug: string;
    category: GuideCategory;
    title: string;
    excerpt: string; // short teaser — homepage card, index card
    body: string;    // full article — detail page
    readMinutes: number;
    image: string;
    alt: string;
};

export type TripDay = {
    title: string;
    description: string;
};

export type TripIdea = {
    slug: string;
    title: string;
    description: string; // short teaser — homepage card, index card
    body: string;        // longer intro — detail page
    experienceSlugs: string[]; // slugs of the experiences this trip includes
    days: TripDay[];
    image: string;
    alt: string;
    featured?: boolean;
};
