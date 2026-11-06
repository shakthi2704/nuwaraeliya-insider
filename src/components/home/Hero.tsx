import Image from "next/image";
import { ArrowDown, CalendarDays, Leaf } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* One orchestrated entrance: each element fades up in sequence.
   Pure CSS (no client state), and switched off for reduced motion. */
const enter =
    "opacity-0 animate-fade-up motion-reduce:animate-none motion-reduce:opacity-100";

export default function Hero() {
    const t = useTranslations("hero");
    const stats = t.raw("stats") as { value: string; label: string }[];

    return (
        /* -mt-20 slides the hero under the fixed 5rem header (main has pt-20) */
        <section className="relative isolate -mt-20 flex min-h-[max(100svh,40rem)] w-full flex-col overflow-hidden bg-primary-container text-on-primary">
            {/* Photograph */}
            <Image
                src="/images/03.jpg"
                alt=""
                fill
                sizes="100vw"
                loading="eager"
                fetchPriority="high"
                className="-z-20 object-cover object-[center_55%]"
            />

            {/* Scrim: forest green, heavier at the bottom where the stats sit */}
            <div className="absolute inset-0 -z-10 bg-linear-to-b from-primary-container/70 via-primary-container/40 to-primary-container/95" />

            {/* Centered content */}
            <div className="flex flex-1 items-center justify-center px-margin pb-12 pt-32 md:px-margin-md lg:px-margin-lg">
                <div className="flex w-full max-w-4xl flex-col items-center text-center">
                    <div
                        className={cn(
                            enter,
                            "mb-6 inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/15 px-3.5 py-1.5 text-primary-fixed shadow-sm backdrop-blur-md"
                        )}
                        style={{ animationDelay: "0.2s" }}
                    >
                        <Leaf className="size-4 text-tertiary-fixed-dim" />
                        <span className="font-sans text-label-md uppercase tracking-wider">
                            {t("locationTag")}
                        </span>
                    </div>

                    <p
                        className={cn(
                            enter,
                            "font-display text-body-xl italic text-tertiary-fixed-dim"
                        )}
                        style={{ animationDelay: "0.3s" }}
                    >
                        {t("welcomeTo")}
                    </p>

                    <h1
                        className={cn(
                            enter,
                            "font-display text-[length:clamp(3.5rem,9vw,8rem)] font-normal leading-[0.95] tracking-[-0.03em] text-on-primary drop-shadow-sm"
                        )}
                        style={{ animationDelay: "0.4s" }}
                    >
                        Nuwara
                        <br />
                        <span className="italic text-secondary-fixed">Eliya</span>
                    </h1>

                    <p
                        className={cn(
                            enter,
                            "mt-8 max-w-xl font-display text-body-xl text-surface-container-high"
                        )}
                        style={{ animationDelay: "0.55s" }}
                    >
                        {t("tagline")}
                    </p>

                    <div
                        className={cn(
                            enter,
                            "mt-10 flex flex-wrap items-center justify-center gap-4"
                        )}
                        style={{ animationDelay: "0.7s" }}
                    >
                        <ButtonLink href="/plan-my-trip" variant="accent" size="lg">
                            {t("ctaPlanTrip")}
                            <CalendarDays className="size-[18px]" />
                        </ButtonLink>
                        <ButtonLink href="/experiences" variant="light" size="lg">
                            {t("ctaExplorePlaces")}
                            <ArrowDown className="size-[18px] text-secondary" />
                        </ButtonLink>
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div
                className={cn(
                    enter,
                    "border-t border-on-primary/10 bg-primary-container/80 backdrop-blur-xl"
                )}
                style={{ animationDelay: "0.9s" }}
            >
                <dl className="mx-auto grid max-w-[90rem] grid-cols-2 px-margin md:grid-cols-4 md:px-margin-md lg:px-margin-lg">
                    {stats.map(({ value, label }, i) => (
                        <div
                            key={label}
                            className={cn(
                                "py-5 text-center",
                                i < stats.length - 1 &&
                                "md:border-r md:border-on-primary/10"
                            )}
                        >
                            <dt className="sr-only">{label}</dt>
                            <dd className="font-display text-headline-sm text-on-primary">
                                {value}
                            </dd>
                            <p
                                aria-hidden="true"
                                className="mt-0.5 font-sans text-caption uppercase tracking-widest text-primary-fixed-dim"
                            >
                                {label}
                            </p>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}