"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Bookmark, Clock, MapPin, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Link, usePathname } from "@/i18n/navigation";
import { useSavedTrip } from "@/lib/saved-trip";
import { cn } from "@/lib/utils";

/* The slim shape the drawer needs for each experience. The server layout
   builds these, so the long write-ups never reach the browser. */
export type SavedTripItem = {
    slug: string;
    title: string;
    area: string;
    duration: string;
    effort: "easy" | "moderate" | "demanding";
    image: string;
    alt: string;
};

/* A bookmark button with a count badge, and the panel it opens. The panel
   is a native <dialog> opened with showModal(), which gives a focus trap,
   Escape to close and an inert page behind it without extra code.

   `triggerClassName` carries the navbar's colours for the button, so it
   matches the transparent and solid header states. */
export default function SavedTripDrawer({
    items,
    triggerClassName,
}: {
    items: SavedTripItem[];
    triggerClassName?: string;
}) {
    const t = useTranslations("savedDrawer");
    const tEffort = useTranslations("effort");
    const pathname = usePathname();
    const titleId = useId();

    const dialogRef = useRef<HTMLDialogElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [confirmClear, setConfirmClear] = useState(false);

    const { slugs, remove, clear } = useSavedTrip();

    /* Saved order is kept. A saved slug with no matching experience (one
       that was removed from the site) is ignored, so it can never show as
       an empty row or inflate the count. */
    const saved = slugs
        .map((slug) => items.find((item) => item.slug === slug))
        .filter((item): item is SavedTripItem => Boolean(item));
    const count = saved.length;

    function openDrawer() {
        setConfirmClear(false);
        dialogRef.current?.showModal();
        setOpen(true);
    }

    function closeDrawer() {
        dialogRef.current?.close();
    }

    /* Leaving the page by any route closes the panel. */
    useEffect(() => {
        dialogRef.current?.close();
    }, [pathname]);

    /* The page behind should not scroll while the panel is open. */
    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open]);

    /* Removing the last place deletes the button that had focus, so move
       focus somewhere sensible instead of dropping it. */
    useEffect(() => {
        if (open && count === 0) closeButtonRef.current?.focus();
    }, [open, count]);

    return (
        <>
            <button
                type="button"
                onClick={openDrawer}
                aria-label={t("open", { count })}
                aria-haspopup="dialog"
                className={cn(
                    "relative inline-flex size-10 items-center justify-center rounded-lg transition-colors",
                    triggerClassName
                )}
            >
                <Bookmark className="size-5" aria-hidden="true" />
                {count > 0 ? (
                    <span
                        aria-hidden="true"
                        className="absolute -right-0.5 -top-0.5 flex size-[1.125rem] items-center justify-center rounded-full bg-tertiary-container font-sans text-caption font-semibold leading-none text-on-tertiary"
                    >
                        {count}
                    </span>
                ) : null}
            </button>

            <dialog
                ref={dialogRef}
                aria-labelledby={titleId}
                onClose={() => setOpen(false)}
                /* A click on the dimmed area lands on the dialog itself,
                   because the panel inside fills it completely. */
                onClick={(event) => {
                    if (event.target === event.currentTarget) closeDrawer();
                }}
                className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-[26rem] overflow-hidden bg-surface p-0 text-on-surface shadow-float transition-transform duration-300 backdrop:bg-primary/40 backdrop:backdrop-blur-sm motion-reduce:transition-none open:starting:translate-x-full"
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 border-b border-outline-variant/40 px-6 py-5">
                        <div className="flex flex-col gap-1">
                            <h2
                                id={titleId}
                                className="font-display text-headline-sm text-primary"
                            >
                                {t("title")}
                            </h2>
                            <p className="font-sans text-caption text-on-surface-variant">
                                {t("countLine", { count })}
                            </p>
                        </div>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={closeDrawer}
                            aria-label={t("close")}
                            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-surface-container"
                        >
                            <X className="size-6" aria-hidden="true" />
                        </button>
                    </div>

                    {count === 0 ? (
                        /* Empty state */
                        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                            <span className="flex size-14 items-center justify-center rounded-full bg-surface-container text-secondary">
                                <Bookmark className="size-6" aria-hidden="true" />
                            </span>
                            <div className="flex flex-col gap-1">
                                <p className="font-display text-headline-sm text-primary">
                                    {t("emptyTitle")}
                                </p>
                                <p className="font-sans text-body-md text-on-surface-variant">
                                    {t("emptyText")}
                                </p>
                            </div>
                            <ButtonLink
                                href="/experiences"
                                variant="outline"
                                onClick={closeDrawer}
                            >
                                {t("browse")}
                            </ButtonLink>
                        </div>
                    ) : (
                        <>
                            {/* Saved places */}
                            <ul className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-5">
                                {saved.map((item) => (
                                    <li
                                        key={item.slug}
                                        className="flex gap-4 rounded-xl bg-surface-container-low p-3"
                                    >
                                        <Link
                                            href={`/experiences/${item.slug}`}
                                            onClick={closeDrawer}
                                            tabIndex={-1}
                                            aria-hidden="true"
                                            className="block size-20 shrink-0 overflow-hidden rounded-lg bg-primary-container"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.image}
                                                alt=""
                                                loading="lazy"
                                                className="size-full object-cover"
                                            />
                                        </Link>
                                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                            <Link
                                                href={`/experiences/${item.slug}`}
                                                onClick={closeDrawer}
                                                className="line-clamp-2 font-sans text-label-lg font-semibold text-primary transition-colors hover:text-secondary"
                                            >
                                                {item.title}
                                            </Link>
                                            <p className="flex items-center gap-1.5 font-sans text-caption text-on-surface-variant">
                                                <MapPin
                                                    className="size-3.5 shrink-0 text-secondary"
                                                    aria-hidden="true"
                                                />
                                                <span className="truncate">{item.area}</span>
                                            </p>
                                            <p className="flex items-center gap-1.5 font-sans text-caption text-on-surface-variant">
                                                <Clock
                                                    className="size-3.5 shrink-0 text-secondary"
                                                    aria-hidden="true"
                                                />
                                                <span className="truncate">
                                                    {item.duration} · {tEffort(item.effort)}
                                                </span>
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => remove(item.slug)}
                                            aria-label={t("remove", { title: item.title })}
                                            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-error"
                                        >
                                            <X className="size-4" aria-hidden="true" />
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Footer */}
                            <div className="flex flex-col gap-4 border-t border-outline-variant/40 px-6 py-5">
                                <div className="flex flex-col gap-2">
                                    <ButtonLink
                                        href="/plan-my-trip"
                                        size="lg"
                                        onClick={closeDrawer}
                                        className="w-full"
                                    >
                                        {t("planCta")}
                                        <ArrowRight className="size-[18px]" aria-hidden="true" />
                                    </ButtonLink>
                                    <p className="text-center font-sans text-caption text-on-surface-variant">
                                        {t("planNote")}
                                    </p>
                                </div>

                                {confirmClear ? (
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        <span className="font-sans text-caption text-on-surface-variant">
                                            {t("clearConfirm")}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                clear();
                                                setConfirmClear(false);
                                            }}
                                        >
                                            {t("clearYes")}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setConfirmClear(false)}
                                        >
                                            {t("clearNo")}
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setConfirmClear(true)}
                                        className="self-center"
                                    >
                                        {t("clear")}
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </dialog>
        </>
    );
}