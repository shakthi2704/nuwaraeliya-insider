import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import GuideCard from "@/components/guides/GuideCard";
import { Link } from "@/i18n/navigation";
import { GUIDES } from "@/lib/data/guides";
import { cn } from "@/lib/utils";

/* Guide categories are free text in the data, so a topic id is just the
   category lowercased and hyphenated ("Getting There" -> "getting-there"). */
const topicId = (category: string) =>
    category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

/* One entry per distinct category, in data order. */
const TOPICS = GUIDES.reduce<{ id: string; label: string }[]>((list, guide) => {
    const id = topicId(guide.category);
    if (!list.some((topic) => topic.id === id)) {
        list.push({ id, label: guide.category });
    }
    return list;
}, []);

const pill =
    "inline-block shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-sans text-label-md transition-all";
const pillOn = "bg-primary text-on-primary shadow-sm";
const pillOff =
    "bg-surface-container-low text-on-surface hover:bg-surface-container";

/* The filter lives in the URL (?topic=...), so a filtered view is shareable
   and the back button works. An unknown topic is ignored (shows everything). */
export default function GuidesGrid({ topic }: { topic?: string }) {
    const t = useTranslations("guidesPage");

    const active = TOPICS.find((entry) => entry.id === topic);
    const visible = active
        ? GUIDES.filter((guide) => topicId(guide.category) === active.id)
        : GUIDES;

    /* The cover story shows on the unfiltered view only. */
    const lead = active ? undefined : GUIDES[0];
    const rest = active ? visible : GUIDES.slice(1);

    return (
        <section className="w-full bg-surface px-margin pb-20 md:px-margin-md lg:px-margin-lg">
            <div className="mx-auto max-w-7xl">
                {/* Sticky topic bar, sits just under the fixed header */}
                <div
                    role="navigation"
                    aria-label={t("filtersLabel")}
                    className="sticky top-24 z-40 mb-8 rounded-2xl bg-surface/90 px-3 py-3 shadow-sm backdrop-blur-md sm:px-4"
                >
                    <ul className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <li className="shrink-0">
                            <Link
                                href="/guides"
                                scroll={false}
                                aria-current={!active ? "true" : undefined}
                                className={cn(pill, !active ? pillOn : pillOff)}
                            >
                                {t("allTopics", { count: GUIDES.length })}
                            </Link>
                        </li>
                        {TOPICS.map(({ id, label }) => {
                            const isActive = active?.id === id;
                            return (
                                <li key={id} className="shrink-0">
                                    <Link
                                        href={`/guides?topic=${id}`}
                                        scroll={false}
                                        aria-current={isActive ? "true" : undefined}
                                        className={cn(pill, isActive ? pillOn : pillOff)}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Cover story */}
                {lead ? (
                    <article className="group relative mb-14 overflow-hidden rounded-3xl bg-surface-container-lowest shadow-md has-[.card-link:focus-visible]:outline-2 has-[.card-link:focus-visible]:outline-offset-2 has-[.card-link:focus-visible]:outline-secondary">
                        <div className="grid grid-cols-1 items-stretch lg:min-h-[440px] lg:grid-cols-12">
                            {/* Photo */}
                            <div className="relative min-h-[300px] overflow-hidden lg:col-span-7 lg:min-h-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={lead.image}
                                    alt={lead.alt}
                                    loading="eager"
                                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-primary/70 via-primary/10 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-surface-container-lowest" />
                            </div>

                            {/* Story */}
                            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:col-span-5 lg:p-10">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-wrap items-center gap-2 font-sans">
                                        <span className="rounded bg-secondary/10 px-2.5 py-0.5 text-label-md font-semibold uppercase tracking-wider text-secondary">
                                            {lead.category}
                                        </span>
                                        <span className="text-outline" aria-hidden="true">
                                            &bull;
                                        </span>
                                        <span className="text-caption text-on-surface-variant">
                                            {lead.readTime}
                                        </span>
                                    </div>

                                    <h2 className="font-display text-headline-md leading-snug tracking-tight text-primary">
                                        <Link
                                            href={`/guides/${lead.slug}`}
                                            className="card-link after:absolute after:inset-0 focus-visible:outline-none"
                                        >
                                            {lead.title}
                                        </Link>
                                    </h2>

                                    <p className="font-display text-body-lg text-on-surface-variant">
                                        {lead.excerpt}
                                    </p>
                                </div>

                                {/* Looks like a button; the title link above covers the whole card */}
                                <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-sans text-label-md text-on-primary shadow-sm transition-colors group-hover:bg-secondary">
                                    {t("readGuide")}
                                    <ArrowRight className="size-[17px]" aria-hidden="true" />
                                </span>
                            </div>
                        </div>
                    </article>
                ) : null}

                {/* Section title */}
                <div className="flex flex-col justify-between gap-2 pb-6 sm:flex-row sm:items-baseline">
                    <div>
                        <span className="mb-1 block font-sans text-label-md font-semibold uppercase tracking-wider text-secondary">
                            {t("moreEyebrow")}
                        </span>
                        <h2 className="font-display text-headline-md text-primary">
                            {active ? active.label : t("moreHeading")}
                        </h2>
                    </div>
                    <p className="font-sans text-body-md text-on-surface-variant">
                        {t("showing", { count: rest.length })}
                    </p>
                </div>

                {/* Grid */}
                <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((guide) => (
                        <li key={guide.slug} className="grid">
                            <GuideCard guide={guide} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}