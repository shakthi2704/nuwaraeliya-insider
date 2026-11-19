import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ItineraryView from "@/components/planner/ItineraryView";
import { Link } from "@/i18n/navigation";
import { getExperiences } from "@/lib/content";
import { knownSlugs, parseAnswers } from "@/lib/planner/answers";
import { generateItinerary } from "@/lib/planner/engine";

/* Every itinerary is its own address built from query answers, so there is
   nothing here for a search engine to index. */
export const metadata: Metadata = {
    title: "Your itinerary",
    robots: { index: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
export default async function ItineraryPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: SearchParams;
}) {
    const t = await getTranslations("result");
    const { locale } = await params;
    const parsed = parseAnswers(await searchParams);

    /* A link missing answers, or edited by hand, cannot be rebuilt. */
    if (!parsed) {
        return (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-margin py-24 text-center">
                <h1 className="font-display text-headline-xl-mobile text-primary md:text-headline-xl">
                    {t("invalid.title")}
                </h1>
                <p className="font-sans text-body-lg text-on-surface-variant">
                    {t("invalid.text")}
                </p>
                <Link
                    href="/plan-my-trip"
                    className="font-sans text-label-lg text-secondary underline underline-offset-4 transition-colors hover:text-primary"
                >
                    {t("invalid.cta")}
                </Link>
            </div>
        );
    }
    const experiences = await getExperiences(locale);

    /* Saved places that no longer exist are dropped, so the result never
       shows a bare slug. */
    const answers = {
        ...parsed,
        pinned: knownSlugs(parsed.pinned, experiences),
    };

    return (
        <ItineraryView
            itinerary={generateItinerary(answers, experiences)}
            experiences={experiences}
        />
    );
}