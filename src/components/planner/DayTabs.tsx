"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export type DayTabItem = {
    number: number;
    subtitle: string; // short line under the tab label
    summary: string; // e.g. "3 stops, 8:00 am to 5:30 pm"
    panel: ReactNode; // the day's timeline, built on the server
};

/* Day tabs for the result page. All days stay in the page; only the active
   one is shown on screen, and print shows every day one after another.
   The tabs follow the ARIA tabs pattern: arrow keys, Home and End move
   between days. */
export default function DayTabs({ items }: { items: DayTabItem[] }) {
    const t = useTranslations("result");
    const [active, setActive] = useState(0);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const topRef = useRef<HTMLDivElement>(null);

    const many = items.length > 1;

    function move(to: number) {
        const next = (to + items.length) % items.length;
        setActive(next);
        tabRefs.current[next]?.focus();
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            move(active + 1);
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(active - 1);
        } else if (e.key === "Home") {
            e.preventDefault();
            move(0);
        } else if (e.key === "End") {
            e.preventDefault();
            move(items.length - 1);
        }
    }

    function showDay(index: number) {
        setActive(index);
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <div className="flex flex-col gap-10">
            <div ref={topRef} className="flex scroll-mt-6 flex-col gap-6">
                {/* Tabs */}
                {many ? (
                    <div
                        role="tablist"
                        aria-label={t("tabs.label")}
                        onKeyDown={onKeyDown}
                        className="flex gap-3 overflow-x-auto pb-1 print:hidden"
                    >
                        {items.map((item, i) => {
                            const selected = i === active;
                            return (
                                <button
                                    key={item.number}
                                    ref={(el) => {
                                        tabRefs.current[i] = el;
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`itinerary-tab-${item.number}`}
                                    aria-selected={selected}
                                    aria-controls={`itinerary-panel-${item.number}`}
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => setActive(i)}
                                    className={
                                        "flex min-w-44 shrink-0 flex-col gap-0.5 rounded-xl px-4 py-3 text-left transition-all " +
                                        (selected
                                            ? "bg-primary text-on-primary shadow-md"
                                            : "bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container")
                                    }
                                >
                                    <span className="font-sans text-label-lg font-semibold">
                                        {t("day.label", { number: item.number })}
                                    </span>
                                    <span
                                        className={
                                            "line-clamp-1 font-sans text-caption " +
                                            (selected
                                                ? "text-on-primary/80"
                                                : "text-on-surface-variant")
                                        }
                                    >
                                        {item.subtitle}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ) : null}

                {/* Panels: only the active one on screen, all of them in print */}
                {items.map((item, i) => (
                    <div
                        key={item.number}
                        role={many ? "tabpanel" : undefined}
                        id={`itinerary-panel-${item.number}`}
                        aria-labelledby={
                            many ? `itinerary-tab-${item.number}` : undefined
                        }
                        className={i === active ? "" : "hidden print:block"}
                    >
                        {item.panel}
                    </div>
                ))}
            </div>

            {/* Outline: the whole trip at a glance */}
            {many ? (
                <section
                    aria-labelledby="itinerary-outline-heading"
                    className="flex flex-col gap-5 print:hidden"
                >
                    <div className="flex flex-col gap-1">
                        <span className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                            {t("outline.eyebrow")}
                        </span>
                        <h2
                            id="itinerary-outline-heading"
                            className="font-display text-headline-md text-primary"
                        >
                            {t("outline.heading", { count: items.length })}
                        </h2>
                        <p className="font-sans text-body-md text-on-surface-variant">
                            {t("outline.hint")}
                        </p>
                    </div>

                    <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {items.map((item, i) => {
                            const selected = i === active;
                            return (
                                <li key={item.number} className="grid">
                                    <button
                                        type="button"
                                        onClick={() => showDay(i)}
                                        aria-current={selected ? "true" : undefined}
                                        className={
                                            "flex flex-col gap-2 rounded-xl border-2 p-5 text-left transition-all " +
                                            (selected
                                                ? "border-primary bg-surface-container-lowest shadow-md"
                                                : "border-transparent bg-surface-container-lowest shadow-sm hover:border-outline-variant")
                                        }
                                    >
                                        <span className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                                            {t("day.label", { number: item.number })}
                                        </span>
                                        <span className="font-display text-headline-sm text-primary">
                                            {item.subtitle}
                                        </span>
                                        <span className="font-sans text-caption text-on-surface-variant">
                                            {item.summary}
                                        </span>
                                        <span className="mt-1 inline-flex items-center gap-1.5 font-sans text-label-md text-secondary">
                                            {selected
                                                ? t("outline.showing")
                                                : t("outline.view", { number: item.number })}
                                            {selected ? null : (
                                                <ArrowRight
                                                    className="size-4"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ) : null}
        </div>
    );
}