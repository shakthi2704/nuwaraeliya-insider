import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import type { TripIdea } from "@/lib/data/trip-ideas";
import { cn } from "@/lib/utils";

/* A card shows this many days, then "+N more days". */
const MAX_DAYS_SHOWN = 3;

/* Shared by the home page strip and the /trip-ideas index. The title link
   is stretched over the whole card; the planner button is raised above it
   (relative z-10) so it stays separately clickable. */
export default function TripIdeaCard({ idea }: { idea: TripIdea }) {
    const t = useTranslations("popularTripIdeas");

    const shown = idea.days.slice(0, MAX_DAYS_SHOWN);
    const hidden = idea.days.length - shown.length;

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-primary/10 bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float has-[.card-link:focus-visible]:outline-2 has-[.card-link:focus-visible]:outline-offset-2 has-[.card-link:focus-visible]:outline-secondary">
            {/* Photo */}
            <div className="relative h-60 w-full shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={idea.image}
                    alt={idea.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/75 via-primary/20 to-transparent" />
                <span
                    className={cn(
                        "absolute bottom-4 left-4 rounded px-3 py-1 font-sans text-label-md",
                        idea.featured
                            ? "bg-secondary text-on-secondary"
                            : "bg-surface-container-lowest/90 text-primary"
                    )}
                >
                    {idea.duration}
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                <div>
                    <h3 className="mb-2 font-display text-headline-sm text-primary transition-colors group-hover:text-secondary">
                        <Link
                            href={`/trip-ideas/${idea.slug}`}
                            className="card-link after:absolute after:inset-0 focus-visible:outline-none"
                        >
                            {idea.title}
                        </Link>
                    </h3>
                    <p className="mb-5 line-clamp-4 font-sans text-body-md text-on-surface-variant">
                        {idea.description}
                    </p>

                    <ol className="flex flex-col gap-3 rounded-lg border border-surface-container-highest bg-surface-container-low p-4">
                        {shown.map((day, i) => (
                            <li key={day.title} className="flex items-start gap-2.5">
                                <span className="mt-0.5 w-6 shrink-0 font-sans text-label-md font-semibold text-secondary">
                                    D{i + 1}
                                </span>
                                <span className="font-sans text-body-md text-on-surface">
                                    {day.title}
                                </span>
                            </li>
                        ))}
                        {hidden > 0 && (
                            <li className="pl-[34px] font-sans text-label-md text-on-surface-variant">
                                {t("moreDays", { count: hidden })}
                            </li>
                        )}
                    </ol>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-surface-container-high pt-4">
                    <span className="whitespace-nowrap font-sans text-caption font-semibold uppercase tracking-wider text-on-surface-variant">
                        {t("experiencesCount", { count: idea.highlights.length })}
                    </span>
                    <ButtonLink
                        href={`/plan-my-trip?idea=${idea.slug}`}
                        size="sm"
                        className="relative z-10"
                    >
                        {t("customize")}
                        <ArrowRight className="size-3.5" />
                    </ButtonLink>
                </div>
            </div>
        </article>
    );
}