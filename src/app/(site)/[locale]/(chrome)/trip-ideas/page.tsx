import type { Metadata } from "next";
import { ArrowRight, CalendarDays } from "lucide-react";
import { getTranslations } from "next-intl/server";
import TripIdeasGrid from "@/components/trip-ideas/TripIdeasGrid";
import { ButtonLink } from "@/components/ui/Button";
import { TRIP_IDEAS } from "@/lib/data/trip-ideas";

export const metadata: Metadata = {
    title: "Trip Ideas",
};

export default async function TripIdeasPage() {
    const t = await getTranslations("tripIdeasPage");

    return (
        <>
            {/* Header */}
            <section className="w-full bg-surface px-margin pb-8 pt-12 md:px-margin-md lg:px-margin-lg">
                <div className="mx-auto flex max-w-7xl flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
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

                        <p className="inline-flex items-center gap-2.5 rounded-full bg-surface-container-high px-3 py-1 font-sans text-caption text-on-surface-variant">
                            <span
                                className="size-2 rounded-full bg-secondary"
                                aria-hidden="true"
                            />
                            {t("count", { count: TRIP_IDEAS.length })}
                        </p>
                    </div>

                    <div className="flex max-w-3xl flex-col gap-3">
                        <h1 className="font-display text-display-lg-mobile tracking-tight text-primary md:text-display-lg">
                            {t("headingLead")}{" "}
                            <br className="hidden sm:inline" />
                            <em className="font-light italic text-secondary">
                                {t("headingAccent")}
                            </em>
                        </h1>
                        <p className="max-w-2xl font-sans text-body-lg text-on-surface-variant">
                            {t("subheading")}
                        </p>
                    </div>
                </div>
            </section>

            <TripIdeasGrid />

            {/* Planner CTA */}
            <section className="w-full bg-primary px-margin py-20 text-on-primary md:px-margin-md lg:px-margin-lg">
                <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                        <CalendarDays className="size-6" aria-hidden="true" />
                    </span>

                    <div className="flex flex-col gap-3">
                        <h2 className="font-display text-headline-xl-mobile tracking-tight text-on-primary md:text-headline-xl">
                            {t("ctaHeading")}
                        </h2>
                        <p className="mx-auto max-w-xl font-sans text-body-lg text-on-primary-container">
                            {t("ctaText")}
                        </p>
                    </div>

                    <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
                        <ButtonLink
                            href="/plan-my-trip"
                            variant="secondary"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            {t("ctaPrimary")}
                            <ArrowRight className="size-5" aria-hidden="true" />
                        </ButtonLink>
                        <ButtonLink
                            href="/experiences"
                            variant="primary"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            {t("ctaSecondary")}
                        </ButtonLink>
                    </div>
                </div>
            </section>
        </>
    );
}