"use client";

import { useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Rating = "best" | "good" | "ok" | "wet";

type Month = {
    short: string;
    full: string;
    rating: Rating;
    note: string;
};

type Season = {
    range: string;
    title: string;
    description: string;
};

/* swatch: legend dot and bar color. fill: bar height inside its track.
   Classes are written out in full so Tailwind can see them. */
const RATING: Record<Rating, { swatch: string; fill: string }> = {
    best: { swatch: "bg-primary-container", fill: "h-full" },
    good: { swatch: "bg-secondary", fill: "h-[72%]" },
    ok: { swatch: "bg-secondary-fixed-dim", fill: "h-[48%]" },
    wet: { swatch: "bg-outline-variant", fill: "h-[22%]" },
};

const RATINGS = Object.keys(RATING) as Rating[];

/* The current month can only be known in the browser. The server snapshot
   (-1) means "unknown", so nothing is highlighted until hydration, and
   there is no server/client mismatch or stale build-time month. */
const subscribe = () => () => { };
const getClientMonth = () => new Date().getMonth();
const getServerMonth = () => -1;

export default function SeasonalGuideStrip() {
    const t = useTranslations("seasonalGuide");
    const currentMonth = useSyncExternalStore(
        subscribe,
        getClientMonth,
        getServerMonth
    );
    const MONTHS = t.raw("months") as Month[];
    const SEASONS = t.raw("seasons") as Season[];
    const current = currentMonth >= 0 ? MONTHS[currentMonth] : null;

    return (
        <section className="bg-surface-container-low py-margin-lg">
            <div className="mx-auto max-w-[90rem] px-margin md:px-margin-md lg:px-margin-lg">
                {/* Header */}
                <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-xl">
                        <span className="mb-3 block font-sans text-label-md uppercase tracking-widest text-secondary">
                            {t("eyebrow")}
                        </span>
                        <h2 className="font-display text-headline-xl-mobile text-on-surface md:text-headline-xl">
                            {t("heading")}
                        </h2>
                    </div>
                    <p className="max-w-md font-sans text-body-lg text-on-surface-variant">
                        {t("intro")}
                    </p>
                </div>

                {/* Legend */}
                <ul className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                    {RATINGS.map((r) => (
                        <li key={r} className="flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "size-2 shrink-0 rounded-full",
                                    RATING[r].swatch
                                )}
                            />
                            <span className="font-sans text-label-md text-on-surface-variant">
                                {t(`ratings.${r}`)}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Twelve months */}
                <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
                    {MONTHS.map((month, i) => {
                        const isCurrent = i === currentMonth;
                        return (
                            <li
                                key={month.short}
                                aria-current={isCurrent ? "date" : undefined}
                                className={cn(
                                    "relative flex flex-col items-center gap-2 rounded-xl border px-1 py-4 transition-all duration-200 hover:-translate-y-1",
                                    isCurrent
                                        ? "border-transparent bg-primary-container text-on-primary shadow-float"
                                        : "border-outline-variant/40 bg-surface-container-lowest text-on-surface"
                                )}
                            >
                                {isCurrent && (
                                    <span className="absolute -top-2.5 whitespace-nowrap rounded-full bg-tertiary-fixed px-2 py-0.5 font-sans text-caption font-semibold uppercase tracking-wider text-on-tertiary-fixed">
                                        {t("nowBadge")}
                                    </span>
                                )}

                                <span className="sr-only">{month.full}</span>
                                <span
                                    aria-hidden="true"
                                    className="font-sans text-label-md uppercase tracking-wider"
                                >
                                    {month.short}
                                </span>

                                <div
                                    aria-hidden="true"
                                    className={cn(
                                        "relative flex h-9 w-full items-end overflow-hidden rounded",
                                        isCurrent
                                            ? "bg-on-primary/10"
                                            : "bg-surface-container"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-full rounded",
                                            RATING[month.rating].fill,
                                            isCurrent
                                                ? "bg-secondary-fixed"
                                                : RATING[month.rating].swatch
                                        )}
                                    />
                                </div>

                                <span
                                    className={cn(
                                        "text-center font-sans text-caption uppercase tracking-wider",
                                        isCurrent
                                            ? "text-primary-fixed-dim"
                                            : "text-on-surface-variant"
                                    )}
                                >
                                    {t(`ratings.${month.rating}`)}
                                </span>
                            </li>
                        );
                    })}
                </ul>

                {/* This month, in a sentence */}
                {current && (
                    <div className="mt-6 flex flex-col gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                        <div className="flex items-center gap-3">
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "size-2 shrink-0 rounded-full",
                                    RATING[current.rating].swatch
                                )}
                            />
                            <span className="font-sans text-label-md uppercase tracking-wider text-on-surface">
                                {t("currentlyLabel", { month: current.full })}
                            </span>
                        </div>
                        <p className="font-display text-body-lg italic text-on-surface-variant">
                            {current.note}
                        </p>
                    </div>
                )}

                {/* Four seasons */}
                <div className="mt-12 grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
                    {SEASONS.map((season) => (
                        <article
                            key={season.title}
                            className="flex flex-col gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6"
                        >
                            <span className="font-sans text-label-md uppercase tracking-wider text-secondary">
                                {season.range}
                            </span>
                            <h3 className="font-display text-headline-sm text-on-surface">
                                {season.title}
                            </h3>
                            <p className="font-sans text-body-md text-on-surface-variant">
                                {season.description}
                            </p>
                        </article>
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <ButtonLink href="/plan-my-trip" size="lg">
                        {t("cta")}
                        <ArrowRight className="size-[18px]" />
                    </ButtonLink>
                </div>
            </div>
        </section>
    );
}