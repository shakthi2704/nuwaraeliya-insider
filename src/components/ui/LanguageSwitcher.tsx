"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/* Each language's own name, for screen readers. Add a line here when a new
   language is added to routing.ts. */
const LANGUAGE_NAMES: Record<string, string> = {
    en: "English",
    de: "Deutsch",
};

/* The query string of the page being left, so a filtered list such as
   /experiences?category=nature keeps its filter after switching language. */
function currentQuery() {
    const query: Record<string, string | string[]> = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
        const existing = query[key];
        query[key] =
            existing === undefined
                ? value
                : Array.isArray(existing)
                    ? [...existing, value]
                    : [existing, value];
    });
    return query;
}

/* "EN | DE". The current language is a filled label; the others are links.
   The navbar passes its own colours so the switcher matches the transparent
   and solid header states. */
export default function LanguageSwitcher({
    className,
    activeClassName = "bg-primary-container text-on-primary-container",
    idleClassName = "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
}: {
    className?: string;
    activeClassName?: string;
    idleClassName?: string;
}) {
    const t = useTranslations("navigation");
    const activeLocale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const itemClass =
        "inline-flex h-8 min-w-9 items-center justify-center rounded-md px-2 font-sans text-label-md font-semibold tracking-wider transition-colors";

    return (
        <nav
            aria-label={t("language")}
            className={cn("flex items-center gap-1", className)}
        >
            {routing.locales.map((locale, index) => {
                const label = locale.toUpperCase();
                const name = LANGUAGE_NAMES[locale] ?? label;

                return (
                    <Fragment key={locale}>
                        {index > 0 ? (
                            <span
                                aria-hidden="true"
                                className="select-none opacity-30"
                            >
                                |
                            </span>
                        ) : null}

                        {locale === activeLocale ? (
                            <span
                                aria-current="true"
                                title={name}
                                className={cn(itemClass, activeClassName)}
                            >
                                {label}
                            </span>
                        ) : (
                            <Link
                                href={pathname}
                                locale={locale}
                                lang={locale}
                                hrefLang={locale}
                                aria-label={`${name} (${label})`}
                                title={name}
                                className={cn(itemClass, idleClassName)}
                                onClick={(event) => {
                                    /* Plain links already keep the page; only
                                       step in when there is a query to carry
                                       over. New-tab clicks are left alone. */
                                    if (
                                        !window.location.search ||
                                        event.metaKey ||
                                        event.ctrlKey ||
                                        event.shiftKey ||
                                        event.altKey ||
                                        event.button !== 0
                                    ) {
                                        return;
                                    }
                                    event.preventDefault();
                                    router.replace(
                                        { pathname, query: currentQuery() },
                                        { locale }
                                    );
                                }}
                            >
                                {label}
                            </Link>
                        )}
                    </Fragment>
                );
            })}
        </nav>
    );
}