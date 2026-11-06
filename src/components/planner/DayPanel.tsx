import { Car, Coffee } from "lucide-react";
import { useTranslations } from "next-intl";
import StopCard from "@/components/planner/StopCard";
import { EXPERIENCES } from "@/lib/data/experiences";
import type { PlanDay } from "@/lib/planner/engine";
import { durationParts, formatClock } from "@/lib/planner/format";

const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
};

/* One day of the itinerary: a short summary, then the timeline of stops with
   drive connectors and the midday break. A server component, so it can be
   handed to the day tabs as ready-made content. */
export default function DayPanel({ day }: { day: PlanDay }) {
    const t = useTranslations("result");

    const duration = (minutes: number) => {
        const { hours, minutes: rest } = durationParts(minutes);
        return hours === 0
            ? t("minutes", { count: rest })
            : rest === 0
                ? t("hours", { count: hours })
                : t("hoursMinutes", { hours, minutes: rest });
    };

    /* The drive from town to the first stop is the gap between leaving and
       arriving. Driving for the day is out, between stops, and back. */
    const toFirst = toMinutes(day.startsAt) - toMinutes(day.leaveBaseAt);
    const drivingTotal = toFirst + day.driveMinutes + day.returnToBaseMin;
    const stopCount = day.items.filter((item) => item.kind === "stop").length;

    const stats = [
        { key: "leave", value: formatClock(day.leaveBaseAt) },
        { key: "stops", value: String(stopCount) },
        { key: "driving", value: duration(drivingTotal) },
        { key: "active", value: duration(day.activeMinutes) },
    ];

    let stopNumber = 0;

    return (
        <section
            aria-labelledby={`day-${day.day}-heading`}
            className="flex flex-col gap-6"
        >
            {/* Summary */}
            <header className="flex flex-col gap-5 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2
                        id={`day-${day.day}-heading`}
                        className="font-display text-headline-md text-primary"
                    >
                        {t("day.label", { number: day.day })}
                    </h2>
                    <p className="font-sans text-label-lg text-on-surface-variant">
                        {formatClock(day.startsAt)} &ndash; {formatClock(day.endsAt)}
                    </p>
                </div>

                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {stats.map(({ key, value }) => (
                        <div
                            key={key}
                            className="flex flex-col gap-1 rounded-lg bg-surface-container-low p-3"
                        >
                            <dt className="font-sans text-caption font-semibold uppercase tracking-wider text-outline">
                                {t(`day.stats.${key}`)}
                            </dt>
                            <dd className="font-sans text-label-lg text-primary">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <p className="font-sans text-caption text-on-surface-variant">
                    {t("day.pacing")}
                </p>
            </header>

            {/* Timeline */}
            <ol className="relative flex flex-col gap-4 before:absolute before:bottom-6 before:left-4 before:top-6 before:w-px before:bg-outline-variant">
                {day.items.map((item, i) => {
                    if (item.kind === "break") {
                        return (
                            <li key={`break-${i}`} className="relative pl-12">
                                <span className="absolute left-0 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-secondary text-on-secondary">
                                    <Coffee className="size-4" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col gap-1 rounded-xl bg-surface-container p-4">
                                    <p className="font-sans text-label-lg font-semibold text-primary">
                                        {t("day.break.title")}
                                        <span className="ml-2 font-normal text-on-surface-variant">
                                            {formatClock(item.start)} &ndash;{" "}
                                            {formatClock(item.end)}
                                        </span>
                                    </p>
                                    <p className="font-sans text-body-md text-on-surface-variant">
                                        {t("day.break.text")}
                                    </p>
                                </div>
                            </li>
                        );
                    }

                    const experience = EXPERIENCES.find((e) => e.slug === item.slug);
                    if (!experience) return null;

                    stopNumber += 1;
                    const isFirst = stopNumber === 1;

                    return (
                        <li key={item.slug} className="flex flex-col gap-4">
                            {/* Drive connector, before every stop but the first */}
                            {item.driveFromPreviousMin !== null ? (
                                <p className="relative flex items-center gap-2 pl-12 font-sans text-caption text-on-surface-variant">
                                    <span className="absolute left-1 z-10 flex size-6 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                                        <Car className="size-3.5" aria-hidden="true" />
                                    </span>
                                    {t("day.drive", {
                                        duration: duration(item.driveFromPreviousMin),
                                    })}
                                </p>
                            ) : null}

                            <div className="relative pl-12">
                                <span className="absolute left-0 top-5 z-10 flex size-8 items-center justify-center rounded-full bg-primary font-sans text-label-lg font-bold text-on-primary">
                                    {stopNumber}
                                </span>
                                <StopCard
                                    stop={item}
                                    experience={experience}
                                    leaveBaseAt={isFirst ? day.leaveBaseAt : undefined}
                                />
                            </div>
                        </li>
                    );
                })}
            </ol>

            <p className="flex items-center gap-2 font-sans text-caption text-on-surface-variant">
                <Car className="size-4 text-secondary" aria-hidden="true" />
                {t("day.return", { duration: duration(day.returnToBaseMin) })}
            </p>
        </section>
    );
}