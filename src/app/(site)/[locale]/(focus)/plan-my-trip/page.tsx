import type { Metadata } from "next";
import PlannerWizard from "@/components/planner/PlannerWizard";
import { getExperiences, getTripIdea } from "@/lib/content";
import type {
    CategoryId,
    Experience,
    ExperienceSummary,
    TripIdea,
} from "@/lib/content/types";
import {
    DAY_OPTIONS,
    knownSlugs,
    parseDraft,
    type PartialAnswers,
} from "@/lib/planner/answers";
export const metadata: Metadata = {
    title: "Trip Planner",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

/* A trip idea gives the questionnaire a head start: its length, and the
   main category of each experience it includes. Everything else is still
   asked. */
function answersFromIdea(
    idea: TripIdea,
    experiences: Experience[]
): PartialAnswers {
    const head: PartialAnswers = {};

    const length = Math.min(idea.days.length, 4);
    const days = DAY_OPTIONS.find((option) => option === length);
    if (days) head.days = days;

    const interests: CategoryId[] = [];
    for (const slug of idea.experienceSlugs) {
        const experience = experiences.find((e) => e.slug === slug);
        const category = experience?.categories[0];
        if (category && !interests.includes(category)) interests.push(category);
    }
    if (interests.length > 0) head.interests = interests;

    return head;
}

export default async function PlanMyTripPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: SearchParams;
}) {
    const { locale } = await params;
    const sp = await searchParams;
    const experiences = await getExperiences(locale);

    /* Answers already in the link win over the trip idea's suggestions. */
    const ideaSlug = first(sp.idea);
    const idea = ideaSlug ? await getTripIdea(ideaSlug, locale) : undefined;
    /* parseDraft only checks the shape of saved slugs: drop the ones that no
       longer exist. */
    const draft = parseDraft(sp);
    if (draft.pinned) {
        const pinned = knownSlugs(draft.pinned, experiences);
        if (pinned.length > 0) draft.pinned = pinned;
        else delete draft.pinned;
    }
    const initial: PartialAnswers = {
        ...(idea ? answersFromIdea(idea, experiences) : {}),
        ...draft,
    };
    /* Only what the wizard shows goes to the browser. */
    const summaries: ExperienceSummary[] = experiences.map(
        ({ slug, categories, image, alt }) => ({ slug, categories, image, alt })
    );

    /* The key restarts the wizard if the link changes during a visit. */
    return (
        <PlannerWizard
            key={JSON.stringify(initial)}
            initial={initial}
            experiences={summaries}
        />
    );
}