import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GUIDES, type Guide } from "@/lib/data/guides";

/* Which guides the homepage shows, in this order. Chosen to avoid
   repeating the three guides already linked from Essential advice. */
const HOME_GUIDE_SLUGS = ["where-to-stay", "what-to-pack", "local-tips"];

const HOME_GUIDES = HOME_GUIDE_SLUGS.map((slug) =>
    GUIDES.find((guide) => guide.slug === slug)
).filter((guide): guide is Guide => Boolean(guide));

export default function LatestGuides() {
    const t = useTranslations("latestGuides");

    return (
        <section
            aria-labelledby="latest-guides-heading"
            className="w-full border-t border-surface-container-high bg-surface-container-low px-margin py-20 md:px-margin-md lg:px-margin-lg"
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-12">
                {/* Header */}
                <div className="flex flex-col justify-between gap-6 border-b border-surface-container-high pb-2 md:flex-row md:items-end">
                    <div>
                        <span className="mb-2 block font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                            {t("eyebrow")}
                        </span>
                        <h2
                            id="latest-guides-heading"
                            className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl"
                        >
                            {t("heading")}
                        </h2>
                    </div>
                    <Link
                        href="/guides"
                        className="inline-flex shrink-0 items-center gap-2 font-sans text-label-lg text-secondary transition-colors hover:text-primary"
                    >
                        {t("allGuides")}
                        <ArrowRight className="size-[18px]" aria-hidden="true" />
                    </Link>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {HOME_GUIDES.map((guide) => (
                        <article
                            key={guide.slug}
                            className="group relative flex flex-col gap-4 rounded-xl border border-primary/10 bg-surface-container-lowest p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float has-[.card-link:focus-visible]:outline-2 has-[.card-link:focus-visible]:outline-offset-2 has-[.card-link:focus-visible]:outline-secondary"
                        >
                            {/* Photo + category badge */}
                            <div className="relative h-56 w-full overflow-hidden rounded-lg bg-surface-container">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={guide.image}
                                    alt={guide.alt}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <span className="absolute left-3 top-3 rounded bg-surface-container-lowest/90 px-2.5 py-1 font-sans text-label-md text-on-surface backdrop-blur">
                                    {guide.category}
                                </span>
                            </div>

                            <p className="font-sans text-caption uppercase text-on-surface-variant">
                                {guide.readTime}
                            </p>

                            {/* Stretched link: the whole card is clickable */}
                            <h3 className="font-display text-headline-sm text-primary transition-colors group-hover:text-secondary">
                                <Link
                                    href={`/guides/${guide.slug}`}
                                    className="card-link after:absolute after:inset-0 focus-visible:outline-none"
                                >
                                    {guide.title}
                                </Link>
                            </h3>

                            <p className="line-clamp-3 font-sans text-body-md text-on-surface-variant">
                                {guide.excerpt}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}