import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import TripIdeaCard from "@/components/trip-ideas/TripIdeaCard";
import { Link } from "@/i18n/navigation";
import { TRIP_IDEAS } from "@/lib/data/trip-ideas";

export default function PopularTripIdeas() {
    const t = useTranslations("popularTripIdeas");
    const ideas = TRIP_IDEAS.slice(0, 3);

    return (
        <section
            aria-labelledby="trip-ideas-heading"
            className="w-full bg-surface-container-low px-margin py-20 md:px-margin-md lg:px-margin-lg"
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-12">
                {/* Header */}
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        <span className="mb-2 block font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                            {t("eyebrow")}
                        </span>
                        <h2
                            id="trip-ideas-heading"
                            className="mb-3 font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl"
                        >
                            {t("heading")}
                        </h2>
                        <p className="font-sans text-body-lg text-on-surface-variant">
                            {t("subheading")}
                        </p>
                    </div>
                    <Link
                        href="/plan-my-trip"
                        className="inline-flex shrink-0 items-center gap-2 font-sans text-label-lg text-secondary transition-colors hover:text-primary"
                    >
                        {t("customItinerary")}
                        <ArrowUpRight className="size-[18px]" />
                    </Link>
                </div>

                {/* Cards */}
                <ul className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {ideas.map((idea) => (
                        <li key={idea.slug} className="grid">
                            <TripIdeaCard idea={idea} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}