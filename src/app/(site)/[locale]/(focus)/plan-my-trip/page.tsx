import type { Metadata } from "next";
import PlannerWizard from "@/components/planner/PlannerWizard";
import { EXPERIENCES, type CategoryId } from "@/lib/data/experiences";
import {
    DAY_OPTIONS,
    parseDraft,
    type PartialAnswers,
} from "@/lib/planner/answers";
import { TRIP_IDEAS, type TripIdea } from "@/lib/data/trip-ideas";

export const metadata: Metadata = {
    title: "Trip Planner",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

/* A trip idea gives the questionnaire a head start: its length, and the
   main category of each experience it includes. Everything else is still
   asked. */
function answersFromIdea(idea: TripIdea): PartialAnswers {
    const head: PartialAnswers = {};

    const length = Math.min(idea.days.length, 4);
    const days = DAY_OPTIONS.find((option) => option === length);
    if (days) head.days = days;

    const interests: CategoryId[] = [];
    for (const title of idea.highlights) {
        const experience = EXPERIENCES.find((e) => e.title === title);
        const category = experience?.categories[0];
        if (category && !interests.includes(category)) interests.push(category);
    }
    if (interests.length > 0) head.interests = interests;

    return head;
}

export default async function PlanMyTripPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const sp = await searchParams;

    /* Answers already in the link win over the trip idea's suggestions. */
    const idea = TRIP_IDEAS.find((item) => item.slug === first(sp.idea));
    const initial: PartialAnswers = {
        ...(idea ? answersFromIdea(idea) : {}),
        ...parseDraft(sp),
    };

    /* The key restarts the wizard if the link changes during a visit. */
    return <PlannerWizard key={JSON.stringify(initial)} initial={initial} />;
}