import { ArrowRight, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Guide } from "@/lib/data/guides";

/* Stitch-style guide card for the /guides index and the "Keep reading" row.
   The title link is stretched over the whole card. `as` sets the heading
   level: h2 under a page h1, h3 under a section heading. */
export default function GuideCard({
    guide,
    as: Heading = "h3",
}: {
    guide: Guide;
    as?: "h2" | "h3";
}) {
    const t = useTranslations("guidesPage");

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float has-[.card-link:focus-visible]:outline-2 has-[.card-link:focus-visible]:outline-offset-2 has-[.card-link:focus-visible]:outline-secondary">
            {/* Photo, category chip, read time */}
            <div className="relative h-56 w-full shrink-0 overflow-hidden bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={guide.image}
                    alt={guide.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded bg-surface-container-lowest/90 px-2.5 py-1 font-sans text-caption font-semibold text-primary backdrop-blur">
                    {guide.category}
                </span>
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded bg-primary/80 px-2 py-0.5 font-sans text-caption text-on-primary backdrop-blur">
                    <Clock className="size-3" aria-hidden="true" />
                    {guide.readTime}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between gap-5 p-6">
                <div>
                    <Heading className="mb-3 font-display text-headline-sm text-primary transition-colors group-hover:text-secondary">
                        <Link
                            href={`/guides/${guide.slug}`}
                            className="card-link after:absolute after:inset-0 focus-visible:outline-none"
                        >
                            {guide.title}
                        </Link>
                    </Heading>
                    <p className="line-clamp-3 font-sans text-body-md text-on-surface-variant">
                        {guide.excerpt}
                    </p>
                </div>

                <div className="flex items-center justify-between font-sans text-label-md text-secondary transition-colors group-hover:text-primary">
                    <span>{t("readGuide")}</span>
                    <ArrowRight className="size-[18px]" aria-hidden="true" />
                </div>
            </div>
        </article>
    );
}