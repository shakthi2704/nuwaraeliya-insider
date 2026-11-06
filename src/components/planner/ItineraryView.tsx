import { ArrowLeft, ExternalLink, Headset, Info, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import DayPanel from "@/components/planner/DayPanel";
import DayTabs, { type DayTabItem } from "@/components/planner/DayTabs";
import ItineraryActions from "@/components/planner/ItineraryActions";
import { Link } from "@/i18n/navigation";
import { EXPERIENCES } from "@/lib/data/experiences";
import { encodeAnswers } from "@/lib/planner/answers";
import type {
    Itinerary,
    LeftOutReason,
    Notice,
    PlanStop,
} from "@/lib/planner/engine";
import { formatClock } from "@/lib/planner/format";

const titleOf = (slug: string) =>
    EXPERIENCES.find((e) => e.slug === slug)?.title ?? slug;

const mapsUrl = (title: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${title}, Nuwara Eliya, Sri Lanka`
    )}`;

const listOf = (items: string[]) =>
    new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(items);

/* The whole result page body for a finished itinerary. A server component:
   it only reads the plan and lays it out. The interactive parts (day tabs,
   share and print) are small client components inside it. */
export default function ItineraryView({ itinerary }: { itinerary: Itinerary }) {
    const t = useTranslations("result");
    const tPlanner = useTranslations("planner");
    const tCategory = useTranslations("categories");

    const { answers, days, notices } = itinerary;

    const stopsOf = (dayIndex: number) =>
        days[dayIndex].items.filter(
            (item): item is PlanStop => item.kind === "stop"
        );

    /* The answers, as the summary strip shows them. */
    const month =
        answers.month === null
            ? tPlanner("options.month.unsure.title")
            : tPlanner(`options.month.${answers.month}.title`);

    const facts = [
        {
            key: "length",
            value: tPlanner(`options.days.${answers.days}.title`),
        },
        {
            key: "party",
            value: tPlanner(`options.party.${answers.party}.title`),
        },
        { key: "month", value: month },
        {
            key: "pace",
            value: tPlanner(`options.pace.${answers.pace}.title`),
        },
        {
            key: "transit",
            value: tPlanner(`options.transit.${answers.transit}.title`),
        },
    ];

    /* One sentence per reason, naming the experiences it applies to. */
    const leftOutLines = (items: { slug: string; reason: LeftOutReason }[]) =>
        (["needs-vehicle", "early-start", "too-demanding"] as const).flatMap(
            (reason) => {
                const slugs = items
                    .filter((item) => item.reason === reason)
                    .map((item) => item.slug);
                return slugs.length > 0
                    ? [
                        {
                            reason,
                            text: t(`notice.leftOut.${reason}`, {
                                count: slugs.length,
                                titles: listOf(slugs.map(titleOf)),
                            }),
                        },
                    ]
                    : [];
            }
        );

    const noticeText = (notice: Notice): string => {
        switch (notice.code) {
            case "fewer-stops":
                return t("notice.fewerStops", {
                    planned: notice.planned,
                    wanted: notice.wanted,
                });
            case "interest-uncovered":
                return t("notice.uncovered", {
                    interests: listOf(notice.categories.map((id) => tCategory(id))),
                });
            case "few-matches":
                return t("notice.fewMatches", {
                    matched: notice.matched,
                    total: notice.total,
                });
            case "pinned-not-placed":
                return t("notice.pinned", {
                    count: notice.slugs.length,
                    titles: listOf(notice.slugs.map(titleOf)),
                });
            case "wet-month":
                return t("notice.wet", { month });
            case "left-out":
                return ""; // shown line by line, see leftOutLines
        }
    };

    /* Tab content for each day. */
    const tabs: DayTabItem[] = days.map((day, i) => {
        const stops = stopsOf(i);
        const first = titleOf(stops[0].slug);
        return {
            number: day.day,
            subtitle:
                stops.length > 1
                    ? t("view.subtitleMore", { first, count: stops.length - 1 })
                    : first,
            summary: t("view.daySummary", {
                count: stops.length,
                from: formatClock(day.startsAt),
                to: formatClock(day.endsAt),
            }),
            panel: <DayPanel day={day} />,
        };
    });

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-margin py-8 md:px-margin-md md:py-12 lg:px-margin-lg">
            <Link
                href={`/plan-my-trip?${encodeAnswers(answers)}`}
                className="inline-flex w-fit items-center gap-2 font-sans text-label-lg text-on-surface-variant transition-colors hover:text-primary print:hidden"
            >
                <ArrowLeft className="size-[18px]" aria-hidden="true" />
                {t("view.edit")}
            </Link>

            {/* Title and actions */}
            <header className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <span className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                        {t("view.eyebrow")}
                    </span>
                    <h1 className="font-display text-display-lg-mobile tracking-tight text-primary md:text-display-lg">
                        {t("view.title", { count: days.length })}
                    </h1>
                    <p className="max-w-2xl font-sans text-body-lg text-on-surface-variant">
                        {t("view.intro")}
                    </p>
                </div>
                <ItineraryActions />
            </header>

            {/* Summary strip */}
            <section aria-label={t("view.summary")} className="flex flex-col gap-3">
                <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-surface-container-lowest p-5 shadow-sm sm:grid-cols-3 lg:grid-cols-5">
                    {facts.map(({ key, value }) => (
                        <div key={key} className="flex flex-col gap-1">
                            <dt className="font-sans text-caption font-semibold uppercase tracking-wider text-outline">
                                {t(`view.facts.${key}`)}
                            </dt>
                            <dd className="font-sans text-label-lg text-primary">{value}</dd>
                        </div>
                    ))}
                </dl>
                <p className="font-sans text-body-md text-on-surface-variant">
                    <span className="font-semibold text-primary">
                        {t("view.interests")}:{" "}
                    </span>
                    {listOf(answers.interests.map((id) => tCategory(id)))}
                </p>
            </section>

            {/* Notes on this plan */}
            {notices.length > 0 ? (
                <section
                    aria-label={t("notice.title")}
                    className="flex items-start gap-4 rounded-2xl bg-surface-container p-5"
                >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                        <Info className="size-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-sans text-label-lg text-primary">
                            {t("notice.title")}
                        </h2>
                        <ul className="flex list-disc flex-col gap-1.5 pl-5 font-sans text-body-md text-on-surface-variant">
                            {notices.flatMap((notice, i) =>
                                notice.code === "left-out"
                                    ? leftOutLines(notice.items).map((line) => (
                                        <li key={`left-out-${line.reason}`}>{line.text}</li>
                                    ))
                                    : [<li key={`${notice.code}-${i}`}>{noticeText(notice)}</li>]
                            )}
                        </ul>
                    </div>
                </section>
            ) : null}

            {days.length === 0 ? (
                <section className="flex flex-col items-center gap-4 rounded-2xl bg-surface-container-low p-10 text-center">
                    <h2 className="font-display text-headline-md text-primary">
                        {t("empty.title")}
                    </h2>
                    <p className="max-w-lg font-sans text-body-md text-on-surface-variant">
                        {t("empty.text")}
                    </p>
                    <Link
                        href={`/plan-my-trip?${encodeAnswers(answers)}`}
                        className="font-sans text-label-lg text-secondary underline underline-offset-4"
                    >
                        {t("view.edit")}
                    </Link>
                </section>
            ) : (
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <DayTabs items={tabs} />
                    </div>

                    {/* Sidebar */}
                    <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:col-span-4 print:hidden">
                        <section className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
                            <div className="flex items-center gap-2">
                                <MapPin className="size-5 text-secondary" aria-hidden="true" />
                                <h2 className="font-sans text-label-lg text-primary">
                                    {t("places.title")}
                                </h2>
                            </div>
                            <p className="font-sans text-caption text-on-surface-variant">
                                {t("places.text")}
                            </p>
                            {days.map((day, i) => (
                                <div key={day.day} className="flex flex-col gap-2">
                                    <h3 className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                                        {t("day.label", { number: day.day })}
                                    </h3>
                                    <ul className="flex flex-col gap-1.5">
                                        {stopsOf(i).map((stop) => (
                                            <li key={stop.slug}>
                                                <a
                                                    href={mapsUrl(titleOf(stop.slug))}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-start gap-1.5 font-sans text-body-md text-primary transition-colors hover:text-secondary"
                                                >
                                                    {titleOf(stop.slug)}
                                                    <ExternalLink
                                                        className="mt-1 size-3.5 shrink-0"
                                                        aria-hidden="true"
                                                    />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        <section className="flex flex-col gap-3 rounded-2xl bg-surface-container p-6">
                            <div className="flex items-center gap-2">
                                <Headset
                                    className="size-5 text-secondary"
                                    aria-hidden="true"
                                />
                                <h2 className="font-sans text-label-lg text-primary">
                                    {t("help.title")}
                                </h2>
                            </div>
                            <p className="font-sans text-body-md text-on-surface-variant">
                                {t("help.text")}
                            </p>
                            <Link
                                href="/ask-an-insider"
                                className="font-sans text-label-lg text-secondary underline underline-offset-4 transition-colors hover:text-primary"
                            >
                                {t("help.cta")}
                            </Link>
                        </section>
                    </aside>
                </div>
            )}
        </div>
    );
}