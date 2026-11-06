import {
    ArrowRight,
    ArrowUpRight,
    Backpack,
    CalendarDays,
    Clock,
    Compass,
    ShieldCheck,
    type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { EXPERIENCES } from "@/lib/data/experiences";
import type { TripIdea } from "@/lib/data/trip-ideas";

type Fact = { key: string; icon: LucideIcon; value: string };

/* Small label with a short rule in front, as on the experience page. */
function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <span className="h-0.5 w-8 bg-secondary" aria-hidden="true" />
            <span className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                {children}
            </span>
        </div>
    );
}

export default function TripIdeaDetail({ idea }: { idea: TripIdea }) {
    const t = useTranslations("tripIdeaDetail");

    const facts: Fact[] = [
        { key: "duration", icon: Clock, value: idea.duration },
        {
            key: "days",
            icon: CalendarDays,
            value: t("daysValue", { count: idea.days.length }),
        },
        {
            key: "experiences",
            icon: Compass,
            value: t("experiencesValue", { count: idea.highlights.length }),
        },
    ];

    /* A highlight links to its experience page when the title matches an
       experience exactly; otherwise it stays plain text. */
    const highlights = idea.highlights.map((title) => ({
        title,
        slug: EXPERIENCES.find((e) => e.title === title)?.slug,
    }));

    return (
        <>
            <article>
                {/* Hero: bleeds under the fixed header (main has pt-20) */}
                <header className="relative isolate -mt-20 flex h-[30rem] flex-col justify-end overflow-hidden bg-primary-container text-on-primary md:h-[520px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={idea.image}
                        alt={idea.alt}
                        loading="eager"
                        fetchPriority="high"
                        className="absolute inset-0 -z-20 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary-container/90 via-primary-container/45 to-primary-container/35" />

                    <div className="mx-auto w-full max-w-[90rem] px-margin pb-14 pt-28 md:px-margin-md lg:px-margin-lg">
                        <div className="flex max-w-4xl flex-col gap-4">
                            {/* Breadcrumbs */}
                            <nav aria-label={t("breadcrumb")}>
                                <ol className="flex flex-wrap items-center gap-2 font-sans text-label-md uppercase tracking-wider text-surface">
                                    <li>
                                        <Link
                                            href="/"
                                            className="transition-colors hover:text-secondary-fixed"
                                        >
                                            {t("home")}
                                        </Link>
                                    </li>
                                    <li aria-hidden="true" className="text-surface-variant/60">
                                        /
                                    </li>
                                    <li>
                                        <Link
                                            href="/trip-ideas"
                                            className="transition-colors hover:text-secondary-fixed"
                                        >
                                            {t("tripIdeas")}
                                        </Link>
                                    </li>
                                    <li aria-hidden="true" className="text-surface-variant/60">
                                        /
                                    </li>
                                    <li
                                        aria-current="page"
                                        className="font-semibold text-secondary-container"
                                    >
                                        {idea.title}
                                    </li>
                                </ol>
                            </nav>

                            <div>
                                <span className="inline-block rounded-full bg-secondary-container/90 px-3 py-1 font-sans text-label-md uppercase tracking-wider text-on-secondary-fixed shadow-sm backdrop-blur-md">
                                    {idea.duration}
                                </span>
                            </div>

                            <h1 className="font-display text-display-lg-mobile text-balance text-surface-container-lowest drop-shadow-sm md:text-display-lg">
                                {idea.title}
                            </h1>
                        </div>
                    </div>
                </header>

                {/* At a glance */}
                <section
                    aria-label={t("quickFacts")}
                    className="relative z-20 w-full bg-surface-container-lowest shadow-bar"
                >
                    <dl className="mx-auto grid w-full max-w-[90rem] grid-cols-1 gap-6 px-margin py-6 sm:grid-cols-3 md:px-margin-md lg:px-margin-lg">
                        {facts.map(({ key, icon: Icon, value }) => (
                            <div key={key} className="flex items-start gap-3.5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary shadow-sm">
                                    <Icon className="size-5" aria-hidden="true" />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="font-sans text-caption font-semibold uppercase tracking-wider text-outline">
                                        {t(`facts.${key}`)}
                                    </dt>
                                    <dd className="font-sans text-label-lg text-primary">
                                        {value}
                                    </dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* Two columns: itinerary (8) + sticky sidebar (4) */}
                <div className="w-full bg-surface">
                    <div className="mx-auto grid w-full max-w-[90rem] grid-cols-1 items-start gap-gutter-lg px-margin py-16 md:px-margin-md lg:grid-cols-12 lg:px-margin-lg">
                        {/* Left: about + days */}
                        <div className="flex flex-col gap-14 lg:col-span-8">
                            <section className="flex flex-col gap-5">
                                <Eyebrow>{t("about.eyebrow")}</Eyebrow>
                                <h2 className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
                                    {t("about.heading")}
                                </h2>
                                <div className="flex flex-col gap-4 font-sans text-body-lg text-on-surface-variant">
                                    {idea.body.split("\n\n").map((paragraph, i) => (
                                        <p key={i}>{paragraph}</p>
                                    ))}
                                </div>
                            </section>

                            <section className="flex flex-col gap-6">
                                <Eyebrow>{t("itinerary.eyebrow")}</Eyebrow>
                                <h2 className="font-display text-headline-md text-primary">
                                    {t("itinerary.heading")}
                                </h2>

                                <ol className="flex flex-col gap-6">
                                    {idea.days.map((day, i) => (
                                        <li
                                            key={day.title}
                                            className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-7 shadow-sm md:p-8"
                                        >
                                            <span className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                                                {t("day")} {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <h3 className="font-display text-headline-md text-primary">
                                                {day.title}
                                            </h3>
                                            <p className="font-sans text-body-lg text-on-surface-variant">
                                                {day.description}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        </div>

                        {/* Right: sticky sidebar */}
                        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:col-span-4">
                            {/* What this trip covers + planner button */}
                            <div className="flex flex-col gap-6 rounded-2xl bg-surface-container-lowest p-7 shadow-md">
                                <div className="flex flex-col gap-4">
                                    <h2 className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                                        {t("highlightsLabel")}
                                    </h2>
                                    <ul className="flex flex-col gap-3">
                                        {highlights.map(({ title, slug }) => (
                                            <li
                                                key={title}
                                                className="flex items-start gap-2.5 border-b border-surface-container-high pb-3 last:border-0 last:pb-0"
                                            >
                                                {slug ? (
                                                    <Link
                                                        href={`/experiences/${slug}`}
                                                        className="group inline-flex w-full items-start justify-between gap-2 font-sans text-label-lg text-primary transition-colors hover:text-secondary"
                                                    >
                                                        {title}
                                                        <ArrowUpRight
                                                            className="mt-0.5 size-4 shrink-0 text-secondary"
                                                            aria-hidden="true"
                                                        />
                                                    </Link>
                                                ) : (
                                                    <span className="font-sans text-label-lg text-primary">
                                                        {title}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <ButtonLink
                                        href={`/plan-my-trip?idea=${idea.slug}`}
                                        size="lg"
                                        className="w-full"
                                    >
                                        {t("plan.cta")}
                                        <ArrowRight className="size-[18px]" aria-hidden="true" />
                                    </ButtonLink>
                                    <p className="flex items-start gap-2.5 font-sans text-caption text-on-surface-variant">
                                        <ShieldCheck
                                            className="size-[18px] shrink-0 text-secondary"
                                            aria-hidden="true"
                                        />
                                        {t("plan.note")}
                                    </p>
                                </div>
                            </div>

                            {/* What to pack: links to the real guide */}
                            <div className="flex flex-col gap-3 rounded-2xl bg-surface-container p-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-full bg-surface-container-lowest text-secondary shadow-sm">
                                        <Backpack className="size-[22px]" aria-hidden="true" />
                                    </span>
                                    <h2 className="font-sans text-label-lg text-primary">
                                        {t("pack.heading")}
                                    </h2>
                                </div>
                                <p className="font-sans text-body-md text-on-surface-variant">
                                    {t("pack.text")}
                                </p>
                                <Link
                                    href="/guides/what-to-pack"
                                    className="inline-flex items-center gap-1.5 font-sans text-label-md text-secondary transition-colors hover:text-primary"
                                >
                                    {t("pack.cta")}
                                    <ArrowRight className="size-4" aria-hidden="true" />
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </article>

            {/* Closing CTA */}
            <section className="w-full bg-primary px-margin py-20 text-on-primary md:px-margin-md lg:px-margin-lg">
                <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
                    <div className="flex flex-col gap-3">
                        <h2 className="font-display text-headline-xl-mobile tracking-tight text-on-primary md:text-headline-xl">
                            {t("cta.heading")}
                        </h2>
                        <p className="mx-auto max-w-xl font-sans text-body-lg text-on-primary-container">
                            {t("cta.text")}
                        </p>
                    </div>

                    <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
                        <ButtonLink
                            href={`/plan-my-trip?idea=${idea.slug}`}
                            variant="secondary"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            {t("cta.primary")}
                            <ArrowRight className="size-5" aria-hidden="true" />
                        </ButtonLink>
                        <ButtonLink
                            href="/ask-an-insider"
                            variant="primary"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            {t("cta.secondary")}
                        </ButtonLink>
                    </div>
                </div>
            </section>
        </>
    );
}