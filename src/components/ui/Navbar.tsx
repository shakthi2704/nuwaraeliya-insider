"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Leaf, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import SavedTripDrawer, {
    type SavedTripItem,
} from "@/components/saved/SavedTripDrawer";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ButtonLink } from "./Button";

const NAV_LINKS = [
    { key: "experiences", href: "/experiences" },
    { key: "tripIdeas", href: "/trip-ideas" },
    { key: "guides", href: "/guides" },
    { key: "about", href: "/about" },
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
            link: "text-on-primary/85 hover:bg-surface-container-lowest/10 hover:text-on-primary",
            linkActive: "bg-surface-container-lowest/20 text-on-primary",
            toggle: "text-on-primary hover:bg-surface-container-lowest/10",
        }
        : {
            tile: "bg-primary-container text-on-primary",
            title: "text-primary group-hover:text-secondary",
            subtitle: "text-on-surface-variant",
            link: "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
            linkActive: "bg-primary-container text-on-primary-container",
            toggle: "text-on-surface hover:bg-surface-container",
        };

    return (
        <>
            <header
                className={cn(
                    "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
                    overHero
                        ? "bg-transparent"
                        : "bg-surface/90 shadow-nav backdrop-blur-xl"
                )}
            >
                <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between px-margin md:px-margin-md lg:px-margin-lg">
                    {/* Wordmark. The leaf tile is a placeholder until the real logo exists. */}
                    <Link
                        href="/"
                        onClick={closeMenu}
                        className="group flex items-center gap-3"
                    >
                        <span
                            aria-hidden="true"
                            className={cn(
                                "flex size-9 items-center justify-center rounded-lg transition-colors duration-300",
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

                    {/* Desktop navigation */}
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
                                        "rounded-lg px-4 py-2 font-sans text-label-lg transition-all",
                                        active ? tone.linkActive : tone.link
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

                        <ButtonLink
                            href="/plan-my-trip"
                            size="md"
                            variant={overHero ? "light" : "primary"}
                            className="hidden sm:inline-flex"
                        >
                            {t("planTrip")}
                            <ArrowRight className="size-[18px]" />
                        </ButtonLink>

                        {/* Mobile menu toggle */}
                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                            className={cn(
                                "inline-flex size-10 items-center justify-center rounded-lg transition-colors lg:hidden",
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
                from the keyboard tab order. */}
            <div
                id="mobile-menu"
                className={cn(
                    "fixed inset-x-0 top-20 z-40 border-t border-outline-variant/40 bg-surface/95 px-margin pb-6 pt-3 shadow-float backdrop-blur-xl lg:hidden",
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