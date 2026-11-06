import { CloudRain, Car, Lightbulb, Sparkles, Sunrise } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Experience } from "@/lib/data/experiences";
import type { PlanStop, StopNote } from "@/lib/planner/engine";
import { durationParts, formatClock } from "@/lib/planner/format";

const NOTE_ICONS: Record<StopNote, typeof Sunrise> = {
    "dawn-start": Sunrise,
    "needs-vehicle": Car,
    "wet-weather-caution": CloudRain,
};

/* One stop of the itinerary. The day panel supplies the number marker and
   the connectors between cards; this is only the card itself.

   `leaveBaseAt` is passed for the first stop of a day, so an early start can
   say when to leave town. */
export default function StopCard({
    stop,
    experience,
    leaveBaseAt,
}: {
    stop: PlanStop;
    experience: Experience;
    leaveBaseAt?: string;
}) {
    const t = useTranslations("result");
    const tCategory = useTranslations("categories");
    const tEffort = useTranslations("effort");

    const { hours, minutes } = durationParts(stop.minutes);
    const duration =
        hours === 0
            ? t("minutes", { count: minutes })
            : minutes === 0
                ? t("hours", { count: hours })
                : t("hoursMinutes", { hours, minutes });

    /* Why this stop is here, in plain words. */
    const reasons: string[] = [];
    if (stop.pinned) reasons.push(t("why.saved"));
    if (stop.matched.length > 0) {
        const labels = stop.matched.map((id) => tCategory(id));
        reasons.push(
            t("why.matched", {
                interests: new Intl.ListFormat("en", {
                    style: "long",
                    type: "conjunction",
                }).format(labels),
            })
        );
    } else if (!stop.pinned) {
        reasons.push(t("why.filler"));
    }

    const notes = stop.notes.map((code) => ({
        code,
        text:
            code === "dawn-start"
                ? leaveBaseAt
                    ? t("note.dawnAt", { time: formatClock(leaveBaseAt) })
                    : t("note.dawn")
                : code === "needs-vehicle"
                    ? t("note.vehicle")
                    : t("note.wet"),
    }));

    const practical = experience.practicalNotes?.slice(0, 2) ?? [];

    return (
        <article className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-sm">
            {/* Time, length, tags */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="font-sans text-label-lg font-semibold text-primary">
                    {formatClock(stop.start)} &ndash; {formatClock(stop.end)}
                </p>
                <p className="font-sans text-caption text-on-surface-variant">
                    {duration}
                </p>
                {stop.pinned ? (
                    <span className="rounded-full bg-secondary-container px-2.5 py-0.5 font-sans text-caption font-semibold text-on-secondary-container">
                        {t("savedBadge")}
                    </span>
                ) : null}
            </div>

            <ul className="flex flex-wrap gap-2">
                {experience.categories.map((id) => (
                    <li
                        key={id}
                        className="rounded bg-surface-container px-2 py-0.5 font-sans text-caption text-on-surface-variant"
                    >
                        {tCategory(id)}
                    </li>
                ))}
                <li className="rounded bg-surface-container px-2 py-0.5 font-sans text-caption text-on-surface-variant">
                    {tEffort(experience.effort)}
                </li>
            </ul>

            {/* Photo and description */}
            <div className="flex flex-col gap-4 sm:flex-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={experience.image}
                    alt={experience.alt}
                    loading="eager"
                    className="h-36 w-full shrink-0 rounded-lg object-cover sm:h-auto sm:w-40"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="font-display text-headline-sm text-primary">
                        <Link
                            href={`/experiences/${experience.slug}`}
                            className="transition-colors hover:text-secondary"
                        >
                            {experience.title}
                        </Link>
                    </h3>
                    <p className="font-sans text-body-md text-on-surface-variant">
                        {experience.description}
                    </p>
                </div>
            </div>

            {/* Why it is here, notes, practical notes */}
            <ul className="flex flex-col gap-2 rounded-lg bg-surface-container-low p-3">
                <li className="flex items-start gap-2.5 font-sans text-body-md text-on-surface">
                    <Sparkles
                        className="mt-0.5 size-4 shrink-0 text-secondary"
                        aria-hidden="true"
                    />
                    <span>
                        <span className="font-semibold">{t("why.label")}: </span>
                        {reasons.join(" ")}
                    </span>
                </li>

                {notes.map(({ code, text }) => {
                    const Icon = NOTE_ICONS[code];
                    return (
                        <li
                            key={code}
                            className="flex items-start gap-2.5 font-sans text-body-md text-on-surface"
                        >
                            <Icon
                                className="mt-0.5 size-4 shrink-0 text-secondary"
                                aria-hidden="true"
                            />
                            <span>{text}</span>
                        </li>
                    );
                })}

                {practical.map((note) => (
                    <li
                        key={note.title}
                        className="flex items-start gap-2.5 font-sans text-body-md text-on-surface"
                    >
                        <Lightbulb
                            className="mt-0.5 size-4 shrink-0 text-secondary"
                            aria-hidden="true"
                        />
                        <span>
                            <span className="font-semibold">{t("practical")}: </span>
                            {note.title}. {note.description}
                        </span>
                    </li>
                ))}
            </ul>
        </article>
    );
}