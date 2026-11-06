import type { Metadata } from "next";
import { ArrowRight, BookOpen, Clock, Headset, Tag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import GuidesGrid from "@/components/guides/GuidesGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { GUIDES } from "@/lib/data/guides";

export const metadata: Metadata = {
    title: "Travel Guides",
};

/* Header numbers come from the data, so they never go stale. */
const TOPIC_COUNT = new Set(GUIDES.map((guide) => guide.category)).size;
const TOTAL_MINUTES = GUIDES.reduce(
    (sum, guide) => sum + (parseInt(guide.readTime, 10) || 0),
    0
);

export default async function GuidesPage({
    searchParams,
}: {
    searchParams: Promise<{ topic?: string | string[] }>;
}) {
    const t = await getTranslations("guidesPage");
    const sp = await searchParams;
    const topic = Array.isArray(sp.topic) ? sp.topic[0] : sp.topic;

    const stats = [
        {
            key: "guides",
            icon: BookOpen,
            title: t("stats.guidesTitle", { count: GUIDES.length }),
            text: t("stats.guidesText"),
        },
        {
            key: "topics",
            icon: Tag,
            title: t("stats.topicsTitle", { count: TOPIC_COUNT }),
            text: t("stats.topicsText"),
        },
        {
            key: "minutes",
            icon: Clock,
            title: t("stats.minutesTitle", { count: TOTAL_MINUTES }),
            text: t("stats.minutesText"),
        },
    ];

    return (
        <>
            {/* Header */}
            <section className="relative w-full overflow-hidden bg-surface px-margin pb-10 pt-12 md:px-margin-md lg:px-margin-lg">
                {/* Soft decorative glows, as in Stitch */}
                <div
                    className="pointer-events-none absolute -top-40 right-1/4 size-96 rounded-full bg-secondary/10 blur-3xl"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute top-96 -left-20 size-80 rounded-full bg-primary/5 blur-3xl"
                    aria-hidden="true"
                />

                <div className="relative mx-auto flex max-w-7xl flex-col gap-8">
                    {/* Crumb + count */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="flex items-center gap-2 font-sans text-caption uppercase tracking-widest">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-secondary">
                                <BookOpen className="size-4" aria-hidden="true" />
                                {t("crumbSection")}
                            </span>
                            <span className="text-outline-variant" aria-hidden="true">
                                /
                            </span>
                            <span className="text-on-surface-variant">
                                {t("crumbPlace")}
                            </span>
                        </p>

                        <p className="inline-flex items-center gap-2.5 rounded-full bg-surface-container-high px-3 py-1 font-sans text-caption text-on-surface-variant">
                            <span
                                className="size-2 rounded-full bg-secondary"
                                aria-hidden="true"
                            />
                            {t("count", { count: GUIDES.length })}
                        </p>
                    </div>

                    {/* Heading block */}
                    <div className="flex max-w-4xl flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-secondary" aria-hidden="true" />
                            <span className="font-sans text-label-md font-semibold uppercase tracking-widest text-secondary">
                                {t("eyebrow")}
                            </span>
                        </div>
                        <h1 className="font-display text-display-lg-mobile tracking-tight text-primary md:text-display-lg">
                            {t("headingLead")}{" "}
                            <br className="hidden sm:inline" />
                            <em className="font-light italic text-secondary">
                                {t("headingAccent")}
                            </em>
                        </h1>
                        <p className="max-w-3xl font-display text-body-xl text-on-surface-variant">
                            {t("subheading")}
                        </p>
                    </div>

                    {/* Stat tiles */}
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {stats.map(({ key, icon: Icon, title, text }) => (
                            <li
                                key={key}
                                className="flex items-start gap-3 rounded-xl bg-surface-container-low p-3.5 shadow-sm"
                            >
                                <Icon
                                    className="mt-0.5 size-[22px] shrink-0 text-secondary"
                                    aria-hidden="true"
                                />
                                <div className="flex flex-col">
                                    <span className="font-sans text-label-md font-semibold text-primary">
                                        {title}
                                    </span>
                                    <span className="font-sans text-caption text-on-surface-variant">
                                        {text}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Topic bar, cover story and grid (topic comes from the URL) */}
            <GuidesGrid topic={topic} />

            {/* Closing banner */}
            <section className="w-full bg-surface px-margin pb-20 md:px-margin-md lg:px-margin-lg">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary p-8 text-on-primary shadow-xl sm:p-12">
                    <div
                        className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full bg-secondary/30 blur-3xl"
                        aria-hidden="true"
                    />
                    <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-8">
                            <span className="mb-2 block font-sans text-label-md font-semibold uppercase tracking-widest text-secondary-container">
                                {t("ctaEyebrow")}
                            </span>
                            <h2 className="mb-4 font-display text-headline-xl-mobile leading-tight text-on-primary md:text-headline-xl">
                                {t("ctaHeading")}
                            </h2>
                            <p className="max-w-2xl font-display text-body-lg text-on-primary-container">
                                {t("ctaText")}
                            </p>
                        </div>

                        <div className="flex flex-col justify-center gap-3 lg:col-span-4">
                            <ButtonLink
                                href="/plan-my-trip"
                                variant="secondary"
                                size="lg"
                                className="w-full"
                            >
                                {t("ctaPrimary")}
                                <ArrowRight className="size-[18px]" aria-hidden="true" />
                            </ButtonLink>
                            <Link
                                href="/ask-an-insider"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-on-primary/10 px-6 py-3 text-center font-sans text-label-md text-on-primary transition-colors hover:bg-on-primary/20"
                            >
                                <Headset className="size-[18px]" aria-hidden="true" />
                                {t("ctaSecondary")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}