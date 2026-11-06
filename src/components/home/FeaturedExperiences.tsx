import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { EXPERIENCES } from "@/lib/data/experiences";
import { cn } from "@/lib/utils";

import CompactExperienceRow from "@/components/home/CompactExperienceRow";

/* Whole card is clickable through the title link (stretched with ::after),
   so each card has one link for keyboard and screen-reader users. The focus
   ring is drawn around the card instead of just the title text. */
const card =
    "group relative flex overflow-hidden rounded-xl border border-primary/10 bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-secondary";

const titleLink =
    "after:absolute after:inset-0 focus-visible:outline-none";

const chip = "rounded px-3 py-1 font-sans text-label-md backdrop-blur";

const photo =
    "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105";

const formatMetres = (m: number) => m.toLocaleString("en-US");

export default function FeaturedExperiences() {
    const t = useTranslations("featuredExperiences");
    const tCategory = useTranslations("categories");
    const tEffort = useTranslations("effort");

    const [lead, ...rest] = EXPERIENCES.slice(0, 3);
    if (!lead) return null;

    return (
        <section
            id="experiences"
            aria-labelledby="featured-experiences-heading"
            className="w-full bg-surface px-margin py-20 md:px-margin-md lg:px-margin-lg"
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-12">
                {/* Header */}
                <div className="flex flex-col justify-between gap-6 border-b border-surface-container-high pb-4 md:flex-row md:items-end">
                    <div>
                        <span className="mb-2 block font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                            {t("eyebrow")}
                        </span>
                        <h2
                            id="featured-experiences-heading"
                            className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl"
                        >
                            {t("heading")}
                        </h2>
                    </div>
                    <p className="max-w-md font-sans text-body-lg text-on-surface-variant">
                        {t("subheading")}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
                    {/* Lead card */}
                    <article className={cn(card, "flex-col lg:col-span-7")}>
                        <div className="relative h-80 w-full overflow-hidden md:h-96 lg:h-auto lg:min-h-96 lg:flex-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={lead.image}
                                alt={lead.alt}
                                loading="lazy"
                                decoding="async"
                                className={photo}
                            />
                            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                                <span
                                    className={cn(
                                        chip,
                                        "bg-surface-container-lowest/90 font-semibold text-primary"
                                    )}
                                >
                                    {tCategory(lead.categories[0])}
                                </span>
                                {lead.elevationM && (
                                    <span
                                        className={cn(
                                            chip,
                                            "bg-primary-container/85 text-on-primary"
                                        )}
                                    >
                                        {t("elevation", {
                                            value: formatMetres(lead.elevationM),
                                        })}
                                    </span>
                                )}
                            </div>
                            <span
                                className={cn(
                                    chip,
                                    "absolute bottom-4 right-4 bg-primary/70 text-on-primary"
                                )}
                            >
                                {lead.duration}
                            </span>
                        </div>

                        <div className="flex flex-col justify-between gap-6 p-8">
                            <div>
                                <p className="mb-2 font-sans text-caption font-semibold uppercase tracking-wider text-secondary">
                                    {lead.area}
                                </p>
                                <h3 className="mb-3 font-display text-headline-md leading-snug text-primary transition-colors group-hover:text-secondary">
                                    <Link
                                        href={`/experiences/${lead.slug}`}
                                        className={titleLink}
                                    >
                                        {lead.title}
                                    </Link>
                                </h3>
                                <p className="mb-4 font-sans text-body-lg text-on-surface-variant">
                                    {lead.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-surface-container pt-3 font-sans text-caption text-on-surface-variant">
                                    <span>
                                        <strong className="font-semibold text-primary">
                                            {t("bestFor")}:
                                        </strong>{" "}
                                        {lead.bestFor}
                                    </span>
                                    <span aria-hidden="true" className="hidden sm:inline">&bull;</span>
                                    <span>
                                        <strong className="font-semibold text-primary">
                                            {t("effortLabel")}:
                                        </strong>{" "}
                                        {tEffort(lead.effort)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-end border-t border-surface-container pt-4">
                                <span className="inline-flex items-center gap-2 font-sans text-label-lg text-secondary transition-colors group-hover:text-primary">
                                    {t("viewExperience")}
                                    <ArrowRight className="size-4" />
                                </span>
                            </div>
                        </div>
                    </article>

                    {/* Supporting cards */}
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        {rest.map((exp) => (
                            <article
                                key={exp.slug}
                                className={cn(
                                    card,
                                    "flex-col sm:flex-row lg:flex-col"
                                )}
                            >
                                <div className="relative h-48 shrink-0 overflow-hidden sm:w-1/2 lg:w-full">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={exp.image}
                                        alt={exp.alt}
                                        loading="lazy"
                                        decoding="async"
                                        className={photo}
                                    />
                                    <span
                                        className={cn(
                                            chip,
                                            "absolute left-3 top-3 bg-surface-container-lowest/90 font-semibold text-primary"
                                        )}
                                    >
                                        {tCategory(exp.categories[0])}
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col justify-between p-6">
                                    <div>
                                        <h3 className="mb-2 font-display text-headline-sm text-primary transition-colors group-hover:text-secondary">
                                            <Link
                                                href={`/experiences/${exp.slug}`}
                                                className={titleLink}
                                            >
                                                {exp.title}
                                            </Link>
                                        </h3>
                                        <p className="mb-4 line-clamp-3 font-sans text-body-md text-on-surface-variant">
                                            {exp.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-surface-container pt-3 font-sans text-label-md">
                                        <span className="text-on-surface-variant">
                                            {exp.duration} &middot;{" "}
                                            {tEffort(exp.effort)}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-secondary transition-colors group-hover:text-primary">
                                            {t("explore")}
                                            <ArrowRight className="size-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <CompactExperienceRow />

                <div className="flex justify-center">
                    <ButtonLink href="/experiences" variant="outline" size="lg">
                        {t("browseAll")}
                        <ArrowRight className="size-[18px]" />
                    </ButtonLink>
                </div>
            </div>
        </section>
    );
}