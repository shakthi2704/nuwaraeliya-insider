import {
    CATEGORY_IDS,
    EXPERIENCES,
    type CategoryId,
} from "@/lib/data/experiences";

/* What the questionnaire collects, and how it travels in the URL.
   A finished plan is rebuilt from the URL alone, so a shared link always
   shows the same itinerary. */

export const DAY_OPTIONS = [1, 2, 3, 4] as const; // 4 means "4 or more"
export const PARTY_IDS = ["solo", "couple", "family", "friends"] as const;
export const PACE_IDS = ["relaxed", "balanced", "active"] as const;
export const TRANSIT_IDS = ["private-driver", "train-local", "self-drive"] as const;

export type Days = (typeof DAY_OPTIONS)[number];
export type Party = (typeof PARTY_IDS)[number];
export type Pace = (typeof PACE_IDS)[number];
export type Transit = (typeof TRANSIT_IDS)[number];

export type PlannerAnswers = {
    days: Days;
    party: Party;
    interests: CategoryId[]; // at least one
    pace: Pace;
    month: number | null; // 1-12, or null when the traveler is not sure yet
    transit: Transit;
    pinned: string[]; // saved experiences to keep in the plan (slugs)
};

/* A questionnaire in progress: every field may still be missing. */
export type PartialAnswers = Partial<PlannerAnswers>;

/* Short URL keys keep shared links readable. */
const KEY = {
    days: "d",
    party: "p",
    interests: "i",
    pace: "r",
    month: "m",
    transit: "t",
    pinned: "s",
} as const;

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

const oneOf = <T extends string>(
    allowed: readonly T[],
    value: string | undefined
): T | undefined => allowed.find((item) => item === value);

const unique = <T>(items: T[]) => [...new Set(items)];

const KNOWN_SLUGS = new Set(EXPERIENCES.map((experience) => experience.slug));
const MAX_PINNED = 12;

/* Lenient: reads whatever valid parts are present and ignores the rest.
   Used to restore a draft or pre-fill the questionnaire. */
export function parseDraft(params: RawParams): PartialAnswers {
    const draft: PartialAnswers = {};

    const days = Number(first(params[KEY.days]));
    const dayOption = DAY_OPTIONS.find((option) => option === days);
    if (dayOption) draft.days = dayOption;

    const party = oneOf(PARTY_IDS, first(params[KEY.party]));
    if (party) draft.party = party;

    const rawInterests = first(params[KEY.interests]);
    if (rawInterests !== undefined) {
        const interests = unique(
            rawInterests
                .split(",")
                .filter((id): id is CategoryId =>
                    CATEGORY_IDS.some((category) => category === id)
                )
        );
        if (interests.length > 0) draft.interests = interests;
    }

    const pace = oneOf(PACE_IDS, first(params[KEY.pace]));
    if (pace) draft.pace = pace;

    /* "0" is how "not sure yet" travels: month is null, but answered. */
    const rawMonth = first(params[KEY.month]);
    if (rawMonth === "0") {
        draft.month = null;
    } else {
        const month = Number(rawMonth);
        if (Number.isInteger(month) && month >= 1 && month <= 12) {
            draft.month = month;
        }
    }

    const transit = oneOf(TRANSIT_IDS, first(params[KEY.transit]));
    if (transit) draft.transit = transit;

    const rawPinned = first(params[KEY.pinned]);
    if (rawPinned !== undefined) {
        const pinned = unique(
            rawPinned.split(",").filter((slug) => KNOWN_SLUGS.has(slug))
        ).slice(0, MAX_PINNED);
        if (pinned.length > 0) draft.pinned = pinned;
    }

    return draft;
}

/* True when every required answer is present. Month and pinned are optional. */
export function isComplete(
    draft: PartialAnswers
): draft is PartialAnswers &
Pick<PlannerAnswers, "days" | "party" | "interests" | "pace" | "transit"> {
    return Boolean(
        draft.days &&
        draft.party &&
        draft.interests &&
        draft.interests.length > 0 &&
        draft.pace &&
        draft.transit
    );
}

/* Strict: a complete set of answers, or null. Used by the result page. */
export function parseAnswers(params: RawParams): PlannerAnswers | null {
    const draft = parseDraft(params);
    if (!isComplete(draft)) return null;

    return {
        days: draft.days,
        party: draft.party,
        interests: draft.interests,
        pace: draft.pace,
        month: draft.month ?? null,
        transit: draft.transit,
        pinned: draft.pinned ?? [],
    };
}

/* Query string without the leading "?". Skips anything not yet answered.
   Interest order is kept as chosen so the link reads naturally. */
export function encodeAnswers(answers: PartialAnswers): string {
    const params = new URLSearchParams();

    if (answers.days) params.set(KEY.days, String(answers.days));
    if (answers.party) params.set(KEY.party, answers.party);
    if (answers.interests?.length) {
        params.set(KEY.interests, answers.interests.join(","));
    }
    if (answers.pace) params.set(KEY.pace, answers.pace);
    if (answers.month !== undefined) {
        params.set(KEY.month, String(answers.month ?? 0));
    }
    if (answers.transit) params.set(KEY.transit, answers.transit);
    if (answers.pinned?.length) params.set(KEY.pinned, answers.pinned.join(","));

    return params.toString();
}