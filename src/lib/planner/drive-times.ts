import type { ClusterId } from "@/lib/planner/meta";

/* Approximate one-way driving minutes between travel clusters, by road,
   in normal conditions. Hill roads are single-lane and slow, so treat these
   as estimates, never as promises: the result page labels them approximate.

   Every number is a first guess.  // verify
   Note: the Stitch result screens disagree with each other (a Hakgala to
   town leg shows both 20 and 12 minutes), so they were not used as a source.

   Travel is symmetric, so each pair is listed once. */
const PAIRS: [ClusterId, ClusterId, number][] = [
    ["town", "pedro-hawa-eliya", 15], // verify
    ["town", "badulla-road", 25], // verify
    ["town", "horton-plains", 75], // verify
    ["town", "ramboda-pass", 50], // verify
    ["pedro-hawa-eliya", "badulla-road", 35], // verify
    ["pedro-hawa-eliya", "horton-plains", 90], // verify
    ["pedro-hawa-eliya", "ramboda-pass", 60], // verify
    ["badulla-road", "horton-plains", 100], // verify
    ["badulla-road", "ramboda-pass", 75], // verify
    ["horton-plains", "ramboda-pass", 125], // verify
];

/* Moving between two places inside one cluster: a short hop. */
const WITHIN_CLUSTER_MINUTES = 5; // verify

/* Used only if a pair is missing above, so a plan never shows a free
   teleport. A missing pair is a data bug; keep this deliberately long. */
const FALLBACK_MINUTES = 90;

const TABLE = new Map<string, number>();
for (const [a, b, minutes] of PAIRS) {
    TABLE.set(`${a}|${b}`, minutes);
    TABLE.set(`${b}|${a}`, minutes);
}

export function driveMinutes(from: ClusterId, to: ClusterId): number {
    if (from === to) return WITHIN_CLUSTER_MINUTES;
    return TABLE.get(`${from}|${to}`) ?? FALLBACK_MINUTES;
}