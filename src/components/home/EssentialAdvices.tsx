import { ArrowRight, CalendarCheck, Car, CloudSun } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/* Each card links to an existing guide. Copy lives in messages
   (essentialAdvice.items.<key>), so only the wiring is here. */
const ADVICE = [
    { key: "weather", href: "/guides/weather", icon: CloudSun },
    { key: "transport", href: "/guides/getting-to-nuwara-eliya", icon: Car },
    { key: "seasons", href: "/guides/best-time-to-visit", icon: CalendarCheck },
] as const;

export default function EssentialAdvice() {
    const t = useTranslations("essentialAdvices");

    return (
        <section
            aria-labelledby="essential-advice-heading"
            className="w-full bg-surface px-margin py-20 md:px-margin-md lg:px-margin-lg"
        >
            <div className="mx-auto flex max-w-7xl flex-col gap-12">
                {/* Header */}
                <div className="flex flex-col justify-between gap-6 border-b border-surface-container-high pb-2 md:flex-row md:items-end">
                    <div>
                        <span className="mb-2 block font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                            {t("eyebrow")}
                        </span>
                        <h2
                            id="essential-advice-heading"
                            className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl"
                        >
                            {t("heading")}
                        </h2>
                    </div>
                    <p className="max-w-md font-sans text-body-lg text-on-surface-variant">
                        {t("intro")}
                    </p>
                </div>

                {/* Three advice cards */}
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {ADVICE.map(({ key, href, icon: Icon }) => (
                        <li
                            key={key}
                            className="group relative flex flex-col justify-between rounded-xl border border-surface-container-highest bg-surface-container-low p-8 transition-colors hover:bg-surface-container has-[.card-link:focus-visible]:outline-2 has-[.card-link:focus-visible]:outline-offset-2 has-[.card-link:focus-visible]:outline-secondary"
                        >
                            <div>
                                <div className="mb-6 flex size-12 items-center justify-center rounded bg-surface-container-highest text-primary">
                                    <Icon className="size-[26px]" aria-hidden="true" />
                                </div>
                                <h3 className="mb-3 font-display text-headline-sm text-primary">
                                    {t(`items.${key}.title`)}
                                </h3>
                                <p className="mb-6 font-sans text-body-md leading-relaxed text-on-surface-variant">
                                    {t(`items.${key}.description`)}
                                </p>
                            </div>

                            {/* Stretched link: the whole card is clickable */}
                            <Link
                                href={href}
                                className="card-link inline-flex items-center gap-2 font-sans text-label-lg text-secondary transition-colors after:absolute after:inset-0 group-hover:text-primary focus-visible:outline-none"
                            >
                                {t(`items.${key}.cta`)}
                                <ArrowRight className="size-[18px]" aria-hidden="true" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}