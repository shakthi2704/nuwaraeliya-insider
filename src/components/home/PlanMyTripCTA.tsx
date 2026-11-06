import { ArrowRight, CalendarClock, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";

export default function PlanMyTripCTA() {
    const t = useTranslations("planMyTripCTA");
    const points = t.raw("points") as string[];

    return (
        <section
            aria-labelledby="plan-cta-heading"
            className="w-full bg-surface-container-high px-margin py-20 md:px-margin-md lg:px-margin-lg"
        >
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl border border-primary/20 bg-primary-container text-on-primary shadow-xl">
                {/* Texture: the hero photograph, blended into the green */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/03.jpg"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
                />

                <div className="relative z-10 flex flex-col items-center justify-between gap-12 p-8 md:p-16 lg:flex-row">
                    <div className="flex max-w-2xl flex-col">
                        <div className="mb-4 inline-flex items-center gap-2 self-start rounded bg-secondary px-3 py-1 font-sans text-label-md text-on-secondary">
                            <CalendarClock className="size-4" />
                            <span>{t("badge")}</span>
                        </div>
                        <h2
                            id="plan-cta-heading"
                            className="mb-4 font-display text-headline-xl-mobile tracking-tight text-on-primary md:text-headline-xl"
                        >
                            {t("heading")}
                        </h2>
                        <p className="mb-6 font-display text-body-xl text-surface-container-high">
                            {t("description")}
                        </p>
                        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-label-md text-surface-container-high">
                            {points.map((point) => (
                                <li key={point} className="flex items-center gap-2">
                                    <Check
                                        className="size-4 text-secondary-fixed"
                                        strokeWidth={2.25}
                                    />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex w-full shrink-0 flex-col items-center gap-3 lg:w-auto">
                        <ButtonLink
                            href="/plan-my-trip"
                            variant="accent"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            {t("cta")}
                            <ArrowRight className="size-[18px]" />
                        </ButtonLink>
                        <span className="font-sans text-caption text-primary-fixed-dim">
                            {t("note")}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}