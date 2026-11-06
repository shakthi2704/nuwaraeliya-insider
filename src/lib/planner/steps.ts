import { CATEGORY_IDS } from "@/lib/data/experiences";
import {
    DAY_OPTIONS,
    PACE_IDS,
    PARTY_IDS,
    TRANSIT_IDS,
    type Days,
    type PartialAnswers,
} from "@/lib/planner/answers";

/* The questionnaire as data: which steps exist, in what order, which options
   each offers, and how an option maps onto the answers. The wizard UI only
   reads this, so adding or changing a question happens here. */

/* Stitch order, with the Style (budget) step replaced by "month". */
export const STEP_IDS = [
    "days",
    "party",
    "month",
    "interests",
    "pace",
    "transit",
] as const;

export type StepId = (typeof STEP_IDS)[number];

/* "Not sure yet" on the month step. It is stored as month: null. */
export const MONTH_UNSURE = "unsure";

const MONTH_VALUES = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
] as const;

/* Option values for each step, as strings, in display order. */
export const STEP_OPTIONS: Record<StepId, readonly string[]> = {
    days: DAY_OPTIONS.map(String),
    party: PARTY_IDS,
    month: [...MONTH_VALUES, MONTH_UNSURE],
    interests: CATEGORY_IDS,
    pace: PACE_IDS,
    transit: TRANSIT_IDS,
};

/* Only interests allow more than one choice. */
export const STEP_IS_MULTI: Record<StepId, boolean> = {
    days: false,
    party: false,
    month: false,
    interests: true,
    pace: false,
    transit: false,
};

/* What is currently selected on a step, as option values. */
export function selectedValues(answers: PartialAnswers, step: StepId): string[] {
    switch (step) {
        case "days":
            return answers.days ? [String(answers.days)] : [];
        case "party":
            return answers.party ? [answers.party] : [];
        case "month":
            if (answers.month === undefined) return [];
            return [answers.month === null ? MONTH_UNSURE : String(answers.month)];
        case "interests":
            return answers.interests ? [...answers.interests] : [];
        case "pace":
            return answers.pace ? [answers.pace] : [];
        case "transit":
            return answers.transit ? [answers.transit] : [];
    }
}

/* A step is answered when it has a valid selection. Unknown values are
   ignored, so stale drafts cannot break the wizard. */
export function isStepDone(answers: PartialAnswers, step: StepId): boolean {
    return selectedValues(answers, step).length > 0;
}

/* The first step still missing an answer, or null when all are answered. */
export function firstOpenStep(answers: PartialAnswers): StepId | null {
    return STEP_IDS.find((step) => !isStepDone(answers, step)) ?? null;
}

/* New answers after the traveler picks these option values on a step.
   Single-choice steps keep only the first value. Values that are not valid
   options are dropped. */
export function applySelection(
    answers: PartialAnswers,
    step: StepId,
    values: string[]
): PartialAnswers {
    const valid = values.filter((value) => STEP_OPTIONS[step].includes(value));
    const next: PartialAnswers = { ...answers };

    switch (step) {
        case "days": {
            const days = Number(valid[0]) as Days;
            if (valid[0]) next.days = days;
            else delete next.days;
            break;
        }
        case "party":
            if (valid[0]) next.party = valid[0] as NonNullable<PartialAnswers["party"]>;
            else delete next.party;
            break;
        case "month":
            if (!valid[0]) delete next.month;
            else next.month = valid[0] === MONTH_UNSURE ? null : Number(valid[0]);
            break;
        case "interests": {
            const interests = [...new Set(valid)] as NonNullable<
                PartialAnswers["interests"]
            >;
            if (interests.length > 0) next.interests = interests;
            else delete next.interests;
            break;
        }
        case "pace":
            if (valid[0]) next.pace = valid[0] as NonNullable<PartialAnswers["pace"]>;
            else delete next.pace;
            break;
        case "transit":
            if (valid[0]) {
                next.transit = valid[0] as NonNullable<PartialAnswers["transit"]>;
            } else delete next.transit;
            break;
    }

    return next;
}

/* Toggle one option: replaces the selection on single-choice steps, adds or
   removes it on multi-choice steps. */
export function toggleOption(
    answers: PartialAnswers,
    step: StepId,
    value: string
): PartialAnswers {
    const current = selectedValues(answers, step);

    if (!STEP_IS_MULTI[step]) return applySelection(answers, step, [value]);

    return applySelection(
        answers,
        step,
        current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value]
    );
}