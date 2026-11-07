import { Leaf } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import SocialLinks from "@/components/ui/SocialLinks";



const EXPLORE = [
    { key: "experiences", href: "/experiences" },
    { key: "tripIdeas", href: "/trip-ideas" },
    { key: "guides", href: "/guides" },
    { key: "planTrip", href: "/plan-my-trip" },
    { key: "about", href: "/about" },
] as const;

const PRACTICAL = [
    { key: "gettingThere", href: "/guides/getting-to-nuwara-eliya" },
    { key: "weatherGuide", href: "/guides/weather" },
    { key: "bestTimeToVisit", href: "/guides/best-time-to-visit" },
    { key: "localTips", href: "/guides/local-tips" },
] as const;

/* /ask-an-insider, /privacy and /terms are built in a later step,
   so these links 404 until then. */
/* Ask an Insider and the legal pages. */
const CONNECT = [
    { key: "askInsider", href: "/ask-an-insider" },
    { key: "privacy", href: "/privacy" },
    { key: "terms", href: "/terms" },
] as const;

const linkClass =
    "font-sans text-body-md text-primary-fixed-dim transition-colors hover:text-on-primary";

const headingClass =
    "mb-1 font-sans text-label-lg font-semibold uppercase tracking-wider text-secondary-fixed-dim";


export default function Footer() {

    const t = useTranslations("footer");
    const year = new Date().getFullYear();
    return (
        <footer className="w-full bg-primary-container-darkest text-on-primary [&_a:focus-visible]:outline-primary-fixed">
            <div className="mx-auto max-w-[90rem] px-margin py-16 md:px-margin-md lg:px-margin-lg">
                <div className="grid grid-cols-1 gap-gutter-lg md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span
                                aria-hidden="true"
                                className="flex size-9 items-center justify-center rounded-lg bg-surface-container-lowest/15 text-on-primary"
                            >
                                <Leaf className="size-5" strokeWidth={1.75} />
                            </span>
                            <span className="font-display text-headline-sm text-on-primary">
                                {t("logoTitle")}
                            </span>
                        </div>
                        <p className="font-sans text-body-md font-medium leading-relaxed text-on-primary">
                            {t("tagline")}
                        </p>
                        <p className="font-sans text-xs leading-relaxed text-primary-fixed-dim">
                            {t("description")}
                        </p>
                        <SocialLinks />
                    </div>

                    {/* Explore */}
                    <nav aria-label={t("exploreHeading")} className="flex flex-col gap-3">
                        <h3 className={headingClass}>{t("exploreHeading")}</h3>
                        <ul className="flex flex-col gap-2.5 ">
                            {EXPLORE.map(({ key, href }) => (
                                <li key={href}>
                                    <Link href={href} className={linkClass}>
                                        {t(key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Practical information */}
                    <nav aria-label={t("practicalInfoHeading")} className="flex flex-col gap-3">
                        <h3 className={headingClass}>{t("practicalInfoHeading")}</h3>
                        <ul className="flex flex-col gap-2.5">
                            {PRACTICAL.map(({ key, href }) => (
                                <li key={href}>
                                    <Link href={href} className={linkClass}>
                                        {t(key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Local assistance */}
                    <nav aria-label={t("connectHeading")} className="flex flex-col gap-3">
                        <h3 className={headingClass}>{t("connectHeading")}</h3>
                        <ul className="flex flex-col gap-2.5">
                            {CONNECT.map(({ key, href }) => (
                                <li key={href}>
                                    <Link href={href} className={linkClass}>
                                        {t(key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded-xl bg-primary-container-dark px-6 py-4 md:flex-row">
                    <p className="text-center font-sans text-body-md text-on-primary md:text-left">
                        {t("copyright", { year })}
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
                        <span className="font-sans text-caption uppercase tracking-widest text-on-primary-container">
                            {t("region")}
                        </span>
                        <LanguageSwitcher
                            className="text-primary-fixed-dim"
                            activeClassName="bg-surface-container-lowest/20 text-on-primary"
                            idleClassName="text-primary-fixed-dim hover:bg-surface-container-lowest/10 hover:text-on-primary"
                        />
                    </div>
                </div>
            </div>
        </footer>
    )
}
