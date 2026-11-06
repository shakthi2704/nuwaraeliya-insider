/* Planner-only facts about each experience: how long a visit takes, when it
   can start, when it works best, how it copes with rain, and where it sits.
   Kept apart from experiences.ts on purpose: these are tuning numbers for the
   rule engine, not public content. Keyed by experience slug. An experience
   with no entry here is simply left out of generated plans.

   Every value below is a first guess drafted from the Stitch screens or from
   general knowledge. Each one needs the owner's check.  // verify */

export type TimeOfDay =
    | "early-morning"
    | "morning"
    | "midday"
    | "afternoon"
    | "late-afternoon";

export type RainSuitability = "good" | "ok" | "poor";

/* Places that can be visited together without a long drive in between. */
export type ClusterId =
    | "town"
    | "pedro-hawa-eliya"
    | "badulla-road"
    | "horton-plains"
    | "ramboda-pass";

export type PlannerMeta = {
    /* Typical time spent at the place itself, in minutes. */
    visitMinutes: number;
    /* 24-hour "HH:MM". The stop should not start before `earliest` or after
       `latest`; `ideal` is where the engine tries to place it. */
    startWindow: { earliest: string; ideal: string; latest: string };
    timeOfDay: TimeOfDay;
    /* How well the visit holds up in wet weather. */
    rain: RainSuitability;
    cluster: ClusterId;
};

export const PLANNER_META: Record<string, PlannerMeta> = {
    "horton-plains-worlds-end": {
        visitMinutes: 300, // verify
        startWindow: { earliest: "05:30", ideal: "06:00", latest: "07:00" }, // verify
        timeOfDay: "early-morning",
        rain: "poor", // verify
        cluster: "horton-plains",
    },
    "pedro-tea-estate": {
        visitMinutes: 150, // verify
        startWindow: { earliest: "08:30", ideal: "08:30", latest: "10:30" }, // verify
        timeOfDay: "morning",
        rain: "ok", // verify
        cluster: "pedro-hawa-eliya",
    },
    "gregory-lake-morning": {
        visitMinutes: 90, // verify
        startWindow: { earliest: "06:00", ideal: "06:30", latest: "09:00" }, // verify
        timeOfDay: "morning",
        rain: "ok", // verify
        cluster: "town",
    },
    "ramboda-falls": {
        visitMinutes: 240, // verify, includes the road trip
        startWindow: { earliest: "09:00", ideal: "09:30", latest: "12:00" }, // verify
        timeOfDay: "morning",
        rain: "ok", // verify
        cluster: "ramboda-pass",
    },
    "hakgala-botanical-garden": {
        visitMinutes: 120, // verify
        startWindow: { earliest: "08:00", ideal: "10:00", latest: "15:30" }, // verify
        timeOfDay: "midday",
        rain: "ok", // verify
        cluster: "badulla-road",
    },
    "grand-hotel-high-tea": {
        visitMinutes: 120, // verify
        startWindow: { earliest: "15:00", ideal: "15:30", latest: "16:30" }, // verify
        timeOfDay: "afternoon",
        rain: "good", // verify
        cluster: "town",
    },
    "single-tree-hill-sunrise": {
        visitMinutes: 180, // verify
        startWindow: { earliest: "05:00", ideal: "05:30", latest: "05:45" }, // verify
        timeOfDay: "early-morning",
        rain: "poor", // verify
        cluster: "town",
    },
    "lovers-leap-waterfall": {
        visitMinutes: 120, // verify
        startWindow: { earliest: "08:30", ideal: "10:00", latest: "14:00" }, // verify
        timeOfDay: "morning",
        rain: "ok", // verify
        cluster: "pedro-hawa-eliya",
    },
    "victoria-park-birding": {
        visitMinutes: 90, // verify
        startWindow: { earliest: "06:00", ideal: "07:00", latest: "16:00" }, // verify
        timeOfDay: "morning",
        rain: "ok", // verify
        cluster: "town",
    },
};

/* undefined means "not planner-ready": the engine skips that experience. */
export function getPlannerMeta(slug: string): PlannerMeta | undefined {
    return PLANNER_META[slug];
}