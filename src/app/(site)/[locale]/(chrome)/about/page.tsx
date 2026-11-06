import type { Metadata } from "next";
import Image from "next/image";
import {
    ArrowRight,
    Bookmark,
    BookOpen,
    Car,
    CloudRain,
    Compass,
    MapPin,
    Mountain,
    MountainSnow,
    Route,
    Ruler,
    SlidersHorizontal,
    Sunrise,
    Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { EXPERIENCES } from "@/lib/data/experiences";
import { GUIDES } from "@/lib/data/guides";
import { TRIP_IDEAS } from "@/lib/data/trip-ideas";

export const metadata: Metadata = {
    title: "About",
};

const PRINCIPLES = [
    { key: "pacing", icon: Mountain },
    { key: "mornings", icon: Sunrise },
    { key: "advice", icon: Compass },
    { key: "estimates", icon: Ruler },
] as const;

/* Each rule here is a real rule in src/lib/planner/engine.ts. If a rule
   changes there, change its sentence in messages (aboutPage.planner.rules). */
const PLANNER_RULES = [
    { key: "pace", icon: SlidersHorizontal },
    { key: "party", icon: Users },
    { key: "transit", icon: Car },
    { key: "month", icon: CloudRain },
    { key: "saved", icon: Bookmark },
] as const;

/* The two smaller photographs beside the big one are real experiences, so
   they link to their pages and swap to your own photos automatically when
   the experience images are replaced. */
const MOSAIC_SLUGS = ["pedro-tea-estate", "horton-plains-worlds-end"];

export default async function AboutPage() {
    const t = await getTranslations("aboutPage");

    const mosaic = MOSAIC_SLUGS.map((slug) =>
        EXPERIENCES.find((experience) => experience.slug === slug)
    ).filter((e): e is NonNullable<typeof e> => Boolean(e));

    /* Counted from the data, so the numbers can never go stale. The heights
       are the same values shown on the experience cards. */
    const heights = EXPERIENCES.map((e) => e.elevationM).filter(
        (n): n is number => typeof n === "number"
    );
    const lowest = Math.min(...heights);
    const highest = Math.max(...heights);

    const record = [
        {
            key: "elevation",
            icon: MountainSnow,
            value: t("numbers.items.elevation.value", {
                min: lowest,
                max: highest,
            }),
        },
        {
            key: "experiences",
            icon: MapPin,
            value: String(EXPERIENCES.length),
        },
        {
            key: "tripIdeas",
            icon: Route,
            value: String(TRIP_IDEAS.length),
        },
        {
            key: "guides",
            icon: BookOpen,
            value: String(GUIDES.length),
        },
    ] as const;

    return (
        <>
            {/* Header: headline, intro, then a photo mosaic */}
            <section className="relative w-full overflow-hidden bg-surface px-margin pb-12 pt-12 md:px-margin-md lg:px-margin-lg">
                <div
                    className="pointer-events-none absolute -top-40 right-1/4 size-96 rounded-full bg-secondary/10 blur-3xl"
                    aria-hidden="true"
                />

                <div className="relative mx-auto flex max-w-7xl flex-col gap-10">
                    <p className="flex items-center gap-2 font-sans text-caption uppercase tracking-widest">
                        <span className="font-semibold text-secondary">
                            {t("crumbSection")}
                        </span>
                        <span className="text-outline-variant" aria-hidden="true">
                            /
                        </span>
                        <span className="text-on-surface-variant">
                            {t("crumbPlace")}
                        </span>
                    </p>

                    <div className="grid grid-cols-1 items-end gap-gutter-lg lg:grid-cols-12">
                        <h1 className="font-display text-display-lg-mobile tracking-tight text-primary md:text-display-lg lg:col-span-8">
                            {t("headingLead")}{" "}
                            <br className="hidden sm:inline" />
                            <em className="font-light italic text-secondary">
                                {t("headingAccent")}
                            </em>
                        </h1>
                        <p className="font-sans text-body-lg text-on-surface-variant lg:col-span-4 lg:pb-2">
                            {t("subheading")}
                        </p>
                    </div>

                    {/* Mosaic: one big photograph, two smaller beside it */}
                    <div className="grid grid-cols-1 gap-gutter-sm md:grid-cols-12">
                        <div className="group relative h-[380px] overflow-hidden rounded-xl bg-primary-container shadow-sm md:col-span-8 md:h-[460px]">
                            <Image
                                src="/images/03.jpg"
                                alt=""
                                fill
                                priority
                                sizes="(min-width: 768px) 66vw, 100vw"
                                className="object-cover object-[center_55%] transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-primary/80 via-primary/20 to-transparent p-6 text-on-primary sm:p-8">
                                <span className="font-sans text-label-md font-semibold uppercase tracking-wider text-secondary-container">
                                    {t("mosaic.label")}
                                </span>
                                <p className="font-display text-headline-sm text-on-primary">
                                    {t("mosaic.place")}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-gutter-sm md:col-span-4">
                            {mosaic.map((experience) => (
                                <Link
                                    key={experience.slug}
                                    href={`/experiences/${experience.slug}`}
                                    className="group relative block h-[180px] overflow-hidden rounded-xl bg-primary-container shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary md:h-[222px]"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={experience.image}
                                        alt={experience.alt}
                                        loading="lazy"
                                        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end gap-0.5 bg-linear-to-t from-primary/80 via-primary/10 to-transparent p-5 text-on-primary">
                                        <span className="font-sans text-caption uppercase tracking-wider text-secondary-container">
                                            {experience.area}
                                        </span>
                                        <span className="font-sans text-label-lg text-on-primary">
                                            {experience.title}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Principles */}
            <section className="w-full bg-surface px-margin pb-20 pt-8 md:px-margin-md lg:px-margin-lg">
                <div className="mx-auto flex max-w-7xl flex-col gap-10">
                    <div className="flex max-w-2xl flex-col gap-3">
                        <span className="font-sans text-label-md font-semibold uppercase tracking-widest text-secondary">
                            {t("principles.eyebrow")}
                        </span>
                        <h2 className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
                            {t("principles.heading")}
                        </h2>
                    </div>

                    <ul className="grid grid-cols-1 gap-gutter md:grid-cols-2">
                        {PRINCIPLES.map(({ key, icon: Icon }, index) => (
                            <li
                                key={key}
                                className="flex flex-col gap-5 rounded-2xl bg-surface-container-low p-6 sm:p-8"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-surface-container-lowest text-primary shadow-sm">
                                        <Icon
                                            className="size-[22px]"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span
                                        className="font-display text-headline-md text-outline-variant"
                                        aria-hidden="true"
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-display text-headline-sm text-primary">
                                        {t(`principles.items.${key}.title`)}
                                    </h3>
                                    <p className="font-sans text-body-md text-on-surface-variant">
                                        {t(`principles.items.${key}.text`)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* The record: what the site holds, counted from its own data */}
            <section className="w-full bg-surface-container-high px-margin py-16 md:px-margin-md lg:px-margin-lg">
                <div className="mx-auto flex max-w-7xl flex-col gap-10">
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
                        <div className="flex flex-col gap-2">
                            <span className="font-sans text-label-md font-semibold uppercase tracking-widest text-secondary">
                                {t("numbers.eyebrow")}
                            </span>
                            <h2 className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
                                {t("numbers.heading")}
                            </h2>
                        </div>
                        <span className="font-sans text-caption uppercase tracking-wider text-on-surface-variant">
                            {t("numbers.caption")}
                        </span>
                    </div>

                    <ul className="grid grid-cols-1 gap-gutter-sm sm:grid-cols-2 lg:grid-cols-4">
                        {record.map(({ key, icon: Icon, value }) => (
                            <li
                                key={key}
                                className="flex flex-col justify-between gap-8 rounded-xl bg-surface-container-lowest p-6 shadow-sm sm:p-8"
                            >
                                <span className="flex size-12 items-center justify-center rounded-xl bg-secondary-container/60 text-secondary">
                                    <Icon className="size-7" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col gap-1">
                                    <span className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
                                        {value}
                                    </span>
                                    <span className="font-sans text-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                                        {t(`numbers.items.${key}.label`)}
                                    </span>
                                    <p className="mt-2 font-sans text-body-md text-on-surface-variant">
                                        {t(`numbers.items.${key}.text`)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* How the planner works */}
            <section className="w-full bg-surface px-margin py-20 md:px-margin-md lg:px-margin-lg">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-gutter-lg">
                    <div className="flex flex-col gap-5 lg:col-span-5">
                        <span className="font-sans text-label-md font-semibold uppercase tracking-widest text-secondary">
                            {t("planner.eyebrow")}
                        </span>
                        <h2 className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
                            {t("planner.heading")}
                        </h2>
                        <p className="font-sans text-body-lg text-on-surface-variant">
                            {t("planner.intro")}
                        </p>
                        <Link
                            href="/plan-my-trip"
                            className="mt-2 inline-flex items-center gap-1.5 self-start font-sans text-label-lg text-secondary transition-colors hover:text-primary"
                        >
                            {t("planner.cta")}
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                    </div>

                    <ul className="flex flex-col gap-4 lg:col-span-7">
                        {PLANNER_RULES.map(({ key, icon: Icon }) => (
                            <li
                                key={key}
                                className="flex items-start gap-4 rounded-2xl bg-surface-container-low p-5 sm:p-6"
                            >
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest text-primary shadow-sm">
                                    <Icon className="size-[22px]" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-sans text-label-lg font-semibold text-primary">
                                        {t(`planner.rules.${key}.title`)}
                                    </h3>
                                    <p className="font-sans text-body-md text-on-surface-variant">
                                        {t(`planner.rules.${key}.text`)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Closing banner */}
            <section className="w-full bg-surface px-margin pb-20 md:px-margin-md lg:px-margin-lg">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary p-8 text-on-primary shadow-xl sm:p-12">
                    <div
                        className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full bg-secondary/30 blur-3xl"
                        aria-hidden="true"
                    />
                    <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                            <span className="mb-2 block font-sans text-label-md font-semibold uppercase tracking-widest text-secondary-container">
                                {t("cta.eyebrow")}
                            </span>
                            <h2 className="mb-3 font-display text-headline-xl-mobile leading-tight text-on-primary md:text-headline-xl">
                                {t("cta.heading")}
                            </h2>
                            <p className="max-w-xl font-sans text-body-lg text-on-primary-container">
                                {t("cta.text")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 lg:col-span-5">
                            <ButtonLink
                                href="/plan-my-trip"
                                variant="secondary"
                                size="lg"
                                className="w-full"
                            >
                                {t("cta.plan")}
                            </ButtonLink>
                            <ButtonLink
                                href="/ask-an-insider"
                                variant="light"
                                size="lg"
                                className="w-full"
                            >
                                {t("cta.ask")}
                            </ButtonLink>
                            <Link
                                href="/trip-ideas"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-on-primary/10 px-6 py-3 text-center font-sans text-label-md text-on-primary transition-colors hover:bg-on-primary/20"
                            >
                                {t("cta.ideas")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}