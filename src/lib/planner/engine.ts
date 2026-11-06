import {
    EXPERIENCES,
    type CategoryId,
    type Experience,
} from "@/lib/data/experiences";
import type { Pace, PlannerAnswers, Transit } from "@/lib/planner/answers";
import { driveMinutes } from "@/lib/planner/drive-times";
import {
    getPlannerMeta,
    type ClusterId,
    type PlannerMeta,
} from "@/lib/planner/meta";

/* Rule-based itinerary engine. A pure function: the same answers and the
   same data always give the same plan, so a shared link rebuilds exactly
   what the sender saw. No randomness, no AI, no network.

   The engine returns data and short codes only. All wording lives in the UI
   (messages), so the rules here stay readable and the copy stays English-only
   in one place.

   Assumption: the traveler stays in or near Nuwara Eliya town. Every drive
   time is an estimate, never a promise. */

/* ---------- Output types ---------- */

export type StopNote = "dawn-start" | "needs-vehicle" | "wet-weather-caution";

export type PlanStop = {
    kind: "stop";
    slug: string;
    start: string; // "HH:MM", 24-hour
    end: string;
    minutes: number;
    /* Drive from the previous stop, in minutes; null for the first stop. */
    driveFromPreviousMin: number | null;
    /* Interests this stop answers. Empty means it only rounds out the day. */
    matched: CategoryId[];
    pinned: boolean;
    notes: StopNote[];
};

export type PlanBreak = {
    kind: "break";
    start: string;
    end: string;
    minutes: number;
};

export type PlanItem = PlanStop | PlanBreak;

export type PlanDay = {
    day: number; // 1-based
    items: PlanItem[];
    startsAt: string;
    endsAt: string;
    /* When to leave town to reach the first stop on time. */
    leaveBaseAt: string;
    /* Drive from the last stop back to town. */
    returnToBaseMin: number;
    /* Total driving between stops, and total time at the places. */
    driveMinutes: number;
    activeMinutes: number;
};

/* Why an experience that matches the traveler's interests was left out. */
export type LeftOutReason = "needs-vehicle" | "early-start" | "too-demanding";

export type Notice =
    | { code: "left-out"; items: { slug: string; reason: LeftOutReason }[] }
    | { code: "fewer-stops"; planned: number; wanted: number }
    | { code: "interest-uncovered"; categories: CategoryId[] }
    | { code: "few-matches"; matched: number; total: number }
    | { code: "pinned-not-placed"; slugs: string[] }
    | { code: "wet-month" };

export type Itinerary = {
    answers: PlannerAnswers;
    days: PlanDay[];
    notices: Notice[];
};

/* ---------- Rules (tuning numbers: verify) ---------- */

const MIN = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
};

const HHMM = (minutes: number) => {
    const clamped = Math.max(0, Math.round(minutes));
    const h = Math.floor(clamped / 60);
    const m = clamped % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const roundTo5 = (minutes: number) => Math.round(minutes / 5) * 5;

/* maxLoad is the most a day may ask of the traveler, in minutes: time at the
   places plus every drive (out from town, between stops, and back). A day
   with a single stop is exempt, so a long outing like Horton Plains can
   still stand alone. */
const PACE_RULES: Record<
    Pace,
    { stopsPerDay: number; startFloor: number; dayEnd: number; maxLoad: number }
> = {
    relaxed: {
        stopsPerDay: 2,
        startFloor: MIN("08:30"),
        dayEnd: MIN("17:30"),
        maxLoad: 360,
    },
    balanced: {
        stopsPerDay: 3,
        startFloor: MIN("08:00"),
        dayEnd: MIN("18:00"),
        maxLoad: 600,
    },
    active: {
        stopsPerDay: 4,
        startFloor: MIN("06:00"),
        dayEnd: MIN("18:30"),
        maxLoad: 780,
    },
};

/* Slower on tuk-tuks, slower on unfamiliar mountain roads. */
const DRIVE_FACTOR: Record<Transit, number> = {
    "private-driver": 1,
    "train-local": 1.3,
    "self-drive": 1.25,
};

/* Far from town: not realistic without a vehicle of your own or a hired one. */
const NEEDS_VEHICLE: ReadonlySet<ClusterId> = new Set([
    "horton-plains",
    "ramboda-pass",
]);

/* The wetter months. May to September, from the "mid-year is wetter" note in
   the best-time guide.  // verify */
const WET_MONTHS: ReadonlySet<number> = new Set([5, 6, 7, 8, 9]);

const BUFFER_MIN = 15; // slack between one stop and the next
const BREAK_MIN = 60; // the midday break
const BREAK_FROM = MIN("12:00");
const BREAK_UNTIL = MIN("14:00");
const BREAK_IF_NEXT_WITHIN = 120; // only break if the next stop would be this close

/* How many pre-7 AM starts a trip can take. Dawn is where trips get tiring. */
function dawnBudget(answers: PlannerAnswers): number {
    if (answers.pace === "relaxed") return 0;
    if (answers.party === "family") return 0;
    if (answers.transit === "self-drive") return 0; // dark mountain roads
    if (answers.pace === "active") return answers.days;
    return Math.ceil(answers.days / 3);
}

/* ---------- Candidates ---------- */

type Candidate = {
    exp: Experience;
    meta: PlannerMeta;
    order: number; // position in the data, used for stable ties
    score: number;
    matched: CategoryId[];
    pinned: boolean;
    dawn: boolean;
};

function scoreCandidate(
    exp: Experience,
    answers: PlannerAnswers,
    meta: PlannerMeta,
    pinned: boolean
) {
    const matched = exp.categories.filter((id) => answers.interests.includes(id));

    /* A match on the main category counts more than a secondary one. */
    let score = 0;
    exp.categories.forEach((id, index) => {
        if (answers.interests.includes(id)) score += index === 0 ? 3 : 2;
    });

    if (answers.party === "family" && exp.effort === "easy") score += 1;

    if (answers.month && WET_MONTHS.has(answers.month)) {
        if (meta.rain === "poor") score -= 4;
        if (meta.rain === "good") score += 2;
    }

    if (pinned) score += 100;
    return { score, matched };
}

function isEligible(c: Candidate, answers: PlannerAnswers, budget: number) {
    if (c.pinned) return true; // a saved experience is never filtered out
    if (
        c.exp.effort === "demanding" &&
        (answers.party === "family" || answers.pace === "relaxed")
    ) {
        return false;
    }
    if (c.dawn && budget === 0) return false;
    /* A dawn start is only worth it for something the traveler asked for. */
    if (c.dawn && c.matched.length === 0) return false;
    if (answers.transit === "train-local" && NEEDS_VEHICLE.has(c.meta.cluster)) {
        return false;
    }
    return true;
}

/* The reason an experience the traveler asked for was filtered out, or null
   if it was not (or never matched). Mirrors isEligible, in the same order. */
function leftOutReason(
    c: Candidate,
    answers: PlannerAnswers,
    budget: number
): LeftOutReason | null {
    if (c.pinned || c.matched.length === 0) return null;
    if (
        c.exp.effort === "demanding" &&
        (answers.party === "family" || answers.pace === "relaxed")
    ) {
        return "too-demanding";
    }
    if (c.dawn && budget === 0) return "early-start";
    if (answers.transit === "train-local" && NEEDS_VEHICLE.has(c.meta.cluster)) {
        return "needs-vehicle";
    }
    return null;
}

/* ---------- Scheduling one day ---------- */

type Ctx = {
    floor: number;
    dayEnd: number;
    maxLoad: number;
    factor: number;
};

type Scheduled = {
    items: PlanItem[];
    stops: PlanStop[];
    firstStart: number;
    lastEnd: number;
    toFirstMin: number; // town to the first stop
    toBaseMin: number; // last stop back to town
};

/* Try to fit these stops into one day, in time order. Returns null when any
   stop would start after its latest time, or the day would run too late. */
function scheduleDay(
    chosen: Candidate[],
    ctx: Ctx,
    answers: PlannerAnswers
): Scheduled | null {
    const ordered = [...chosen].sort(
        (a, b) =>
            MIN(a.meta.startWindow.ideal) - MIN(b.meta.startWindow.ideal) ||
            a.order - b.order
    );

    const items: PlanItem[] = [];
    const stops: PlanStop[] = [];
    let previous: Candidate | null = null;
    let previousEnd = 0;
    let breakTaken = false;

    for (const c of ordered) {
        const ideal = MIN(c.meta.startWindow.ideal);
        const earliest = MIN(c.meta.startWindow.earliest);
        const latest = MIN(c.meta.startWindow.latest);

        let start: number;
        let drive: number | null = null;

        if (!previous) {
            /* First stop: dawn stops keep their own early time, the rest
               respect the pace's comfortable start. */
            start = c.dawn
                ? Math.max(ideal, earliest)
                : Math.max(ideal, ctx.floor, earliest);
        } else {
            drive = roundTo5(
                driveMinutes(previous.meta.cluster, c.meta.cluster) * ctx.factor
            );
            let ready = previousEnd + drive + BUFFER_MIN;
            start = Math.max(ready, ideal, earliest);

            /* A midday break, only when lunch time is being squeezed. */
            if (
                !breakTaken &&
                previousEnd >= BREAK_FROM &&
                previousEnd < BREAK_UNTIL &&
                start - previousEnd < BREAK_IF_NEXT_WITHIN
            ) {
                breakTaken = true;
                items.push({
                    kind: "break",
                    start: HHMM(previousEnd),
                    end: HHMM(previousEnd + BREAK_MIN),
                    minutes: BREAK_MIN,
                });
                ready = previousEnd + BREAK_MIN + drive + BUFFER_MIN;
                start = Math.max(ready, ideal, earliest);
            }
        }

        if (start > latest) return null;

        const end = start + c.meta.visitMinutes;

        const notes: StopNote[] = [];
        if (c.dawn) notes.push("dawn-start");
        if (
            answers.transit === "train-local" &&
            NEEDS_VEHICLE.has(c.meta.cluster)
        ) {
            notes.push("needs-vehicle");
        }
        if (
            answers.month &&
            WET_MONTHS.has(answers.month) &&
            c.meta.rain === "poor"
        ) {
            notes.push("wet-weather-caution");
        }

        const stop: PlanStop = {
            kind: "stop",
            slug: c.exp.slug,
            start: HHMM(start),
            end: HHMM(end),
            minutes: c.meta.visitMinutes,
            driveFromPreviousMin: drive,
            matched: c.matched,
            pinned: c.pinned,
            notes,
        };
        items.push(stop);
        stops.push(stop);

        previous = c;
        previousEnd = end;
    }

    if (stops.length === 0) return null;
    const firstStart = MIN(stops[0].start);
    const lastEnd = MIN(stops[stops.length - 1].end);
    if (lastEnd > ctx.dayEnd) return null;

    const firstCluster = ordered[0].meta.cluster;
    const lastCluster = ordered[ordered.length - 1].meta.cluster;
    const toFirstMin = roundTo5(driveMinutes("town", firstCluster) * ctx.factor);
    const toBaseMin = roundTo5(driveMinutes(lastCluster, "town") * ctx.factor);

    /* The day's total ask. A single stop is always allowed. */
    if (stops.length > 1) {
        const load =
            stops.reduce(
                (sum, s) => sum + s.minutes + (s.driveFromPreviousMin ?? 0),
                0
            ) +
            toFirstMin +
            toBaseMin;
        if (load > ctx.maxLoad) return null;
    }

    return { items, stops, firstStart, lastEnd, toFirstMin, toBaseMin };
}

/* ---------- The engine ---------- */

export function generateItinerary(
    answers: PlannerAnswers,
    experiences: Experience[] = EXPERIENCES
): Itinerary {
    const rules = PACE_RULES[answers.pace];
    const factor = DRIVE_FACTOR[answers.transit];
    const ctx: Ctx = {
        floor: rules.startFloor,
        dayEnd: rules.dayEnd,
        maxLoad: rules.maxLoad,
        factor,
    };
    const budget = dawnBudget(answers);
    const wanted = answers.days * rules.stopsPerDay;

    /* 1. Candidates: every experience the planner has data for. */
    const all: Candidate[] = [];
    experiences.forEach((exp, order) => {
        const meta = getPlannerMeta(exp.slug);
        if (!meta) return;
        const pinned = answers.pinned.includes(exp.slug);
        const { score, matched } = scoreCandidate(exp, answers, meta, pinned);
        all.push({
            exp,
            meta,
            order,
            score,
            matched,
            pinned,
            dawn: meta.timeOfDay === "early-morning",
        });
    });

    /* 2. Rank: saved first, then best score, then data order. */
    const pool = all
        .filter((c) => isEligible(c, answers, budget))
        .sort((a, b) => b.score - a.score || a.order - b.order);

    /* 3. Fill the days one at a time. Each day starts with the best
          remaining stop, then adds stops that fit the clock and stay close. */
    const remaining = [...pool];
    const days: PlanDay[] = [];
    let dawnUsed = 0;

    for (let d = 1; d <= answers.days; d++) {
        const dayStops: Candidate[] = [];

        while (dayStops.length < rules.stopsPerDay) {
            let best: { c: Candidate; value: number } | null = null;

            for (const c of remaining) {
                if (c.dawn && !c.pinned && dawnUsed >= budget) continue;
                if (!scheduleDay([...dayStops, c], ctx, answers)) continue;

                /* Prefer stops near the ones already in the day:
                   every 15 minutes of driving costs one point. */
                const nearest =
                    dayStops.length === 0
                        ? 0
                        : Math.min(
                            ...dayStops.map((s) =>
                                driveMinutes(s.meta.cluster, c.meta.cluster)
                            )
                        );
                const value = c.score - nearest / 15;

                if (!best || value > best.value) best = { c, value };
            }

            if (!best) break;
            dayStops.push(best.c);
            remaining.splice(remaining.indexOf(best.c), 1);
            if (best.c.dawn) dawnUsed += 1;
        }

        const scheduled = dayStops.length
            ? scheduleDay(dayStops, ctx, answers)
            : null;
        if (!scheduled) continue;

        const first = scheduled.stops[0];
        const last = scheduled.stops[scheduled.stops.length - 1];

        days.push({
            day: days.length + 1,
            items: scheduled.items,
            startsAt: first.start,
            endsAt: last.end,
            leaveBaseAt: HHMM(scheduled.firstStart - scheduled.toFirstMin),
            returnToBaseMin: scheduled.toBaseMin,
            driveMinutes: scheduled.stops.reduce(
                (sum, s) => sum + (s.driveFromPreviousMin ?? 0),
                0
            ),
            activeMinutes: scheduled.stops.reduce((sum, s) => sum + s.minutes, 0),
        });
    }

    /* 4. Notices for the UI to explain. */
    const placed = days.flatMap((day) =>
        day.items.filter((item): item is PlanStop => item.kind === "stop")
    );
    const notices: Notice[] = [];

    const leftOut = all.flatMap((c) => {
        const reason = leftOutReason(c, answers, budget);
        return reason ? [{ slug: c.exp.slug, reason }] : [];
    });
    if (leftOut.length > 0) notices.push({ code: "left-out", items: leftOut });

    if (placed.length < wanted) {
        notices.push({ code: "fewer-stops", planned: placed.length, wanted });
    }

    const covered = new Set(placed.flatMap((stop) => stop.matched));
    const uncovered = answers.interests.filter((id) => !covered.has(id));
    if (uncovered.length > 0) {
        notices.push({ code: "interest-uncovered", categories: uncovered });
    }

    const matchedStops = placed.filter((stop) => stop.matched.length > 0).length;
    if (placed.length > 0 && matchedStops * 2 < placed.length) {
        notices.push({
            code: "few-matches",
            matched: matchedStops,
            total: placed.length,
        });
    }

    const placedSlugs = new Set(placed.map((stop) => stop.slug));
    const droppedPins = answers.pinned.filter((slug) => !placedSlugs.has(slug));
    if (droppedPins.length > 0) {
        notices.push({ code: "pinned-not-placed", slugs: droppedPins });
    }

    if (answers.month && WET_MONTHS.has(answers.month)) {
        notices.push({ code: "wet-month" });
    }

    return { answers, days, notices };
}