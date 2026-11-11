"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Globe, Leaf, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import SavedTripDrawer, {
    type SavedTripItem,
} from "@/components/saved/SavedTripDrawer";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ButtonLink } from "./Button";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_LINKS = [
    { key: "experiences", href: "/experiences" },
    { key: "tripIdeas", href: "/trip-ideas" },
    { key: "guides", href: "/guides" },
    { key: "Ask an Insider", href: "/ask-an-insider" },
] as const;

/* Pages whose hero photo runs underneath the header. */
const TRANSPARENT_PAGES = ["/"];

export default function Navbar({
    savedItems,
}: {
    savedItems: SavedTripItem[];
}) {
    const t = useTranslations("navigation");
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    /* Transparent only while resting on top of a hero photo. Scrolling or
       opening the mobile menu turns the header solid. */
    const overHero =
        TRANSPARENT_PAGES.includes(pathname) && !scrolled && !menuOpen;

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Escape closes the mobile menu
    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [menuOpen]);

    /* Colors for the two header states. */
    const tone = overHero
        ? {
            tile: "bg-surface-container-lowest/15 text-on-primary",
            title: "text-on-primary group-hover:text-primary-fixed",
            subtitle: "text-primary-fixed-dim",
            link: "text-on-primary/85 hover:text-tertiary-container",
            linkActive: "text-tertiary-container",
            toggle: "text-on-primary hover:bg-surface-container-lowest/10",
            langText: "text-on-primary",
            langActive: "bg-surface-container-lowest/25 text-on-primary",
            langIdle:
                "text-on-primary/75 hover:bg-surface-container-lowest/10 hover:text-on-primary",
        }
        : {
            tile: "bg-surface-container-lowest/15 text-on-primary",
            title: "text-on-primary group-hover:text-primary-fixed",
            subtitle: "text-primary-fixed-dim",
            link: "text-on-primary/85 hover:text-tertiary-container",
            linkActive: "text-tertiary-container",
            toggle: "text-on-primary hover:bg-surface-container-lowest/10",
            langText: "text-on-primary",
            langActive: "bg-primary-container text-on-primary-container",
            langIdle:
                "text-on-primary/75 hover:bg-surface-container-lowest/10 hover:text-on-primary",
        };

    return (
        <>
            <header
                className={cn(
                    "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
                    overHero
                        ? "bg-primary-container-darkest border-b border-tertiary-container shadow-[0_8px_32px_rgba(0,0,0,0.22)] backdrop-blur-xl"
                        : "bg-[color-mix(in_srgb,var(--color-primary-container-darkest)_90%,transparent)] border-b border-transparent backdrop-blur-sm"
                )}
            >
                {/* Top bar: globe + language switcher. No background of its own,
                    so it shows the same surface as the header. */}
                <div className="mx-auto flex h-9 max-w-[90rem] items-center justify-end gap-1.5 px-margin md:px-margin-md lg:px-margin-lg">
                    <Globe
                        aria-hidden="true"
                        className={cn("size-4", tone.langText)}
                        strokeWidth={1.75}
                    />
                    <LanguageSwitcher
                        className={tone.langText}
                        activeClassName={tone.langActive}
                        idleClassName={tone.langIdle}
                    />
                </div>

                <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-margin md:px-margin-md lg:px-margin-lg">
                    {/* Wordmark. The leaf tile is a placeholder until the real logo exists. */}
                    <Link
                        href="/"
                        onClick={closeMenu}
                        className="group flex items-center gap-3"
                    >
                        <span
                            aria-hidden="true"
                            className={cn(
                                "flex size-9 items-center justify-center rounded-md transition-colors duration-300",
                                tone.tile
                            )}
                        >
                            <Leaf className="size-5" strokeWidth={1.75} />
                        </span>
                        <span className="flex flex-col">
                            <span
                                className={cn(
                                    "font-headline-sm text-headline-sm leading-none tracking-tight transition-colors",
                                    tone.title
                                )}
                            >
                                {t("logoTitle")}
                            </span>
                            <span
                                className={cn(
                                    "mt-1 font-caption text-caption uppercase tracking-widest transition-colors duration-300",
                                    tone.subtitle
                                )}
                            >
                                {t("logoSubtitle")}
                            </span>
                        </span>
                    </Link>

                    {/* Desktop navigation: underline on hover */}
                    <nav
                        className="hidden items-center gap-2 lg:flex"
                        aria-label={t("primaryNav")}
                    >
                        {NAV_LINKS.map(({ key, href }) => {
                            const active = isActive(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "bg-linear-to-r from-tertiary-container to-tertiary-container bg-size-[0%_2px] bg-position-[0_100%] bg-no-repeat px-3 py-2 font-sans text-label-lg transition-[background-size,color] duration-300 ease-out hover:bg-size-[100%_2px]",
                                        active
                                            ? cn(tone.linkActive, "bg-size-[100%_2px]")
                                            : tone.link
                                    )}
                                >
                                    {t(key)}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <SavedTripDrawer
                            items={savedItems}
                            triggerClassName={tone.toggle}
                        />

                        {/* Plan My Trip: lifts on hover, arrow slides right */}
                        <ButtonLink
                            href="/plan-my-trip"
                            size="sm"
                            variant={overHero ? "accent" : "light"}
                            className="group hidden sm:inline-flex hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                        >
                            {t("planTrip")}
                            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" />
                        </ButtonLink>

                        {/* Mobile menu toggle */}
                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                            className={cn(
                                "inline-flex size-10 items-center justify-center rounded-md transition-colors lg:hidden",
                                tone.toggle
                            )}
                        >
                            {menuOpen ? (
                                <X className="size-6" />
                            ) : (
                                <Menu className="size-6" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile menu. `invisible` when closed also removes its links
                from the keyboard tab order. Header = 2.25rem bar + 4rem row. */}
            <div
                id="mobile-menu"
                className={cn(
                    "fixed inset-x-0 top-[6.25rem] z-40 border-t border-outline-variant/40 bg-surface/95 px-margin pb-6 pt-3 shadow-float backdrop-blur-xl lg:hidden",
                    "transition-[opacity,transform,visibility] duration-200 ease-out",
                    menuOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0"
                )}
            >
                <nav className="flex flex-col gap-1" aria-label={t("primaryNav")}>
                    {NAV_LINKS.map(({ key, href }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={closeMenu}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "rounded-lg px-4 py-3 font-sans text-label-lg transition-colors",
                                    active
                                        ? "bg-primary-container text-on-primary-container"
                                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                                )}
                            >
                                {t(key)}
                            </Link>
                        );
                    })}
                </nav>
                <ButtonLink
                    href="/plan-my-trip"
                    size="lg"
                    onClick={closeMenu}
                    className="mt-4 w-full"
                >
                    {t("planTrip")}
                    <ArrowRight className="size-[18px]" />
                </ButtonLink>
            </div>
        </>
    );
}