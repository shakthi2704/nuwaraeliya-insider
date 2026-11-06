import {
    ArrowRight,
    Clock,
    ExternalLink,
    Footprints,
    Headset,
    MapPin,
    Mountain,
    Route,
    ShieldCheck,
    Users,
    type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import AddToTripButton from "@/components/experiences/AddToTripButton";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { EXPERIENCES, type Experience } from "@/lib/data/experiences";

const formatMetres = (m: number) => m.toLocaleString("en-US");

type Fact = { key: string; icon: LucideIcon; value: string };

/* Small label with a short rule in front, as in Stitch. */
function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <span className="h-0.5 w-8 bg-secondary" aria-hidden="true" />
            <span className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                {children}
            </span>
        </div>
    );
}

export default function ExperienceDetail({
    experience,
}: {
    experience: Experience;
}) {
    const t = useTranslations("experienceDetail");
    const tCategory = useTranslations("categories");
    const tEffort = useTranslations("effort");

    const primaryCategory = tCategory(experience.categories[0]);

    /* Quick facts come straight from the data. Elevation is optional. */
    const facts: Fact[] = [
        { key: "duration", icon: Clock, value: experience.duration },
        { key: "effort", icon: Footprints, value: tEffort(experience.effort) },
        ...(experience.elevationM
            ? [
                {
                    key: "elevation",
                    icon: Mountain,
                    value: `${formatMetres(experience.elevationM)} m`,
                },
            ]
            : []),
        { key: "location", icon: MapPin, value: experience.area },
        { key: "bestFor", icon: Users, value: experience.bestFor },
    ];

    /* Related experiences: most shared categories first, then data order. */
    const related = EXPERIENCES.filter((e) => e.slug !== experience.slug)
        .map((e) => ({
            e,
            shared: e.categories.filter((c) => experience.categories.includes(c))
                .length,
        }))
        .sort((a, b) => b.shared - a.shared)
        .slice(0, 2)
        .map(({ e }) => e);

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${experience.title}, Nuwara Eliya, Sri Lanka`
    )}`;

    return (
        <>
            <article>
                {/* Hero: bleeds under the fixed header (main has pt-20) */}
                <header className="relative isolate -mt-20 flex h-[36rem] flex-col justify-end overflow-hidden bg-primary-container text-on-primary md:h-[620px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={experience.image}
                        alt={experience.alt}
                        loading="eager"
                        fetchPriority="high"
                        className="absolute inset-0 -z-20 h-full w-full object-cover"
                    />

                    {/* Scrim: forest green, heavier at the bottom for legible text */}
                    <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary-container/90 via-primary-container/45 to-primary-container/35" />

                    <div className="mx-auto w-full max-w-[90rem] px-margin pb-14 pt-28 md:px-margin-md lg:px-margin-lg">
                        <div className="flex max-w-4xl flex-col gap-4">
                            {/* Breadcrumbs */}
                            <nav aria-label={t("breadcrumb")}>
                                <ol className="flex flex-wrap items-center gap-2 font-sans text-label-md uppercase tracking-wider text-surface">
                                    <li>
                                        <Link
                                            href="/"
                                            className="transition-colors hover:text-secondary-fixed"
                                        >
                                            {t("home")}
                                        </Link>
                                    </li>
                                    <li aria-hidden="true" className="text-surface-variant/60">
                                        /
                                    </li>
                                    <li>
                                        <Link
                                            href="/experiences"
                                            className="transition-colors hover:text-secondary-fixed"
                                        >
                                            {t("experiences")}
                                        </Link>
                                    </li>
                                    <li aria-hidden="true" className="text-surface-variant/60">
                                        /
                                    </li>
                                    <li>{primaryCategory}</li>
                                    <li aria-hidden="true" className="text-surface-variant/60">
                                        /
                                    </li>
                                    <li
                                        aria-current="page"
                                        className="font-semibold text-secondary-container"
                                    >
                                        {experience.title}
                                    </li>
                                </ol>
                            </nav>

                            {/* Category pill */}
                            <div>
                                <span className="inline-block rounded-full bg-secondary-container/90 px-3 py-1 font-sans text-label-md uppercase tracking-wider text-on-secondary-fixed shadow-sm backdrop-blur-md">
                                    {primaryCategory}
                                </span>
                            </div>

                            <h1 className="font-display text-display-lg-mobile text-balance text-surface-container-lowest drop-shadow-sm md:text-display-lg">
                                {experience.title}
                            </h1>

                            <p className="max-w-3xl font-display text-body-xl italic text-surface-bright/90">
                                {experience.description}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Quick facts strip */}
                <section
                    aria-label={t("quickFacts")}
                    className="relative z-20 w-full bg-surface-container-lowest shadow-bar"
                >
                    <dl
                        className={
                            "mx-auto grid w-full max-w-[90rem] grid-cols-2 gap-6 px-margin py-6 md:grid-cols-3 md:px-margin-md lg:px-margin-lg " +
                            (facts.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4")
                        }
                    >
                        {facts.map(({ key, icon: Icon, value }) => (
                            <div key={key} className="flex items-start gap-3.5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary shadow-sm">
                                    <Icon className="size-5" aria-hidden="true" />
                                </div>
                                <div className="flex flex-col">
                                    <dt className="font-sans text-caption font-semibold uppercase tracking-wider text-outline">
                                        {t(`facts.${key}`)}
                                    </dt>
                                    <dd className="font-sans text-label-lg text-primary">
                                        {value}
                                    </dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* Two columns: story (8) + planning column (4) */}
                <div className="w-full bg-surface">
                    <div className="mx-auto grid w-full max-w-[90rem] grid-cols-1 items-start gap-gutter-lg px-margin py-16 md:px-margin-md lg:grid-cols-12 lg:px-margin-lg">
                        {/* Left: story */}
                        <div className="flex flex-col gap-14 lg:col-span-8">
                            {/* About */}
                            <section className="flex flex-col gap-5">
                                <Eyebrow>{t("about.eyebrow")}</Eyebrow>
                                <h2 className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl">
                                    {t("about.heading")}
                                </h2>
                                <div className="flex flex-col gap-4 font-sans text-body-lg text-on-surface-variant">
                                    {experience.body.split("\n\n").map((paragraph, i) => (
                                        <p key={i}>{paragraph}</p>
                                    ))}
                                </div>
                            </section>

                            {/* What to expect: only when highlights exist */}
                            {experience.highlights?.length ? (
                                <section className="flex flex-col gap-8 rounded-2xl bg-surface-container-low p-8 shadow-sm md:p-10">
                                    <div className="flex flex-col gap-2">
                                        <span className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                                            {t("expect.eyebrow")}
                                        </span>
                                        <h2 className="font-display text-headline-md text-primary">
                                            {t("expect.heading")}
                                        </h2>
                                    </div>
                                    <ol className="flex flex-col gap-8">
                                        {experience.highlights.map((item, i) => (
                                            <li key={item.title} className="flex items-start gap-5">
                                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest font-sans text-label-lg font-bold text-secondary shadow-sm">
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <div className="flex flex-col gap-1 pt-1">
                                                    <h3 className="font-display text-headline-sm text-primary">
                                                        {item.title}
                                                    </h3>
                                                    <p className="font-sans text-body-md text-on-surface-variant">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </section>
                            ) : null}

                            {/* Field notes: only when practical notes exist */}
                            {experience.practicalNotes?.length ? (
                                <section className="flex flex-col gap-6">
                                    <Eyebrow>{t("notes.eyebrow")}</Eyebrow>
                                    <h2 className="font-display text-headline-md text-primary">
                                        {t("notes.heading")}
                                    </h2>
                                    <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                        {experience.practicalNotes.map((note) => (
                                            <li
                                                key={note.title}
                                                className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-6 shadow-sm"
                                            >
                                                <h3 className="font-sans text-label-lg text-primary">
                                                    {note.title}
                                                </h3>
                                                <p className="font-sans text-body-md text-on-surface-variant">
                                                    {note.description}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ) : null}

                            {/* Insider tip: only when a tip exists */}
                            {experience.insiderTip ? (
                                <section className="flex flex-col gap-4 rounded-2xl bg-primary-container p-8 text-on-primary shadow-md md:p-10">
                                    <span className="font-sans text-caption font-semibold uppercase tracking-widest text-primary-fixed-dim">
                                        {t("tip.eyebrow")}
                                    </span>
                                    <p className="font-display text-headline-md italic">
                                        {experience.insiderTip}
                                    </p>
                                </section>
                            ) : null}
                        </div>

                        {/* Right: sticky planning column */}
                        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:col-span-4">
                            {/* Planning card */}
                            <div className="flex flex-col gap-6 rounded-2xl bg-surface-container-lowest p-7 shadow-md">
                                <div className="flex flex-col gap-2">
                                    <span className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                                        {t("plan.eyebrow")}
                                    </span>
                                    <h2 className="font-display text-headline-md leading-tight text-primary">
                                        {t("plan.heading")}
                                    </h2>
                                    <p className="font-sans text-body-md text-on-surface-variant">
                                        {t("plan.text")}
                                    </p>
                                </div>

                                <ul className="flex flex-wrap gap-2">
                                    {experience.categories.map((id) => (
                                        <li
                                            key={id}
                                            className="rounded-full bg-surface-container px-3 py-1 font-sans text-label-md text-on-surface"
                                        >
                                            {tCategory(id)}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-col gap-3">
                                    <AddToTripButton slug={experience.slug} />
                                    <ButtonLink
                                        href="/plan-my-trip"
                                        variant="ghost"
                                        size="lg"
                                        className="w-full"
                                    >
                                        {t("plan.planAround")}
                                        <Route className="size-[18px]" aria-hidden="true" />
                                    </ButtonLink>
                                </div>

                                <p className="flex items-start gap-2.5 font-sans text-caption text-on-surface-variant">
                                    <ShieldCheck
                                        className="size-[18px] shrink-0 text-secondary"
                                        aria-hidden="true"
                                    />
                                    {t("plan.note")}
                                </p>
                            </div>

                            {/* Ask an Insider */}
                            <div className="flex flex-col gap-4 rounded-2xl bg-surface-container p-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-full bg-surface-container-lowest text-secondary shadow-sm">
                                        <Headset className="size-[22px]" aria-hidden="true" />
                                    </span>
                                    <h2 className="font-sans text-label-lg text-primary">
                                        {t("ask.heading")}
                                    </h2>
                                </div>
                                <p className="font-sans text-body-md text-on-surface-variant">
                                    {t("ask.text")}
                                </p>
                                <Link
                                    href="/ask-an-insider"
                                    className="inline-flex w-full items-center justify-between rounded-lg bg-surface-container-lowest px-4 py-2.5 font-sans text-label-md text-primary transition-colors hover:bg-surface-container-high"
                                >
                                    {t("ask.cta")}
                                    <ArrowRight className="size-[18px]" aria-hidden="true" />
                                </Link>
                            </div>

                            {/* Location (map is deferred: text + open-in-maps link) */}
                            <div className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
                                <span className="font-sans text-caption font-semibold uppercase tracking-wider text-outline">
                                    {t("location.eyebrow")}
                                </span>
                                <p className="flex items-start gap-2 font-sans text-label-lg text-primary">
                                    <MapPin
                                        className="mt-0.5 size-[18px] shrink-0 text-secondary"
                                        aria-hidden="true"
                                    />
                                    {experience.area}
                                </p>
                                <a
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 font-sans text-label-md text-secondary transition-colors hover:text-primary"
                                >
                                    {t("location.openInMaps")}
                                    <ExternalLink className="size-4" aria-hidden="true" />
                                </a>
                            </div>
                        </aside>
                    </div>
                </div>
            </article>

            {/* Pairings and nearby */}
            {related.length > 0 ? (
                <section
                    aria-labelledby="nearby-heading"
                    className="w-full border-t border-surface-container-high bg-surface-container-low px-margin py-20 md:px-margin-md lg:px-margin-lg"
                >
                    <div className="mx-auto flex max-w-[90rem] flex-col gap-10">
                        <div className="flex flex-col justify-between gap-6 border-b border-surface-container-high pb-2 md:flex-row md:items-end">
                            <div>
                                <span className="mb-2 block font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                                    {t("nearby.eyebrow")}
                                </span>
                                <h2
                                    id="nearby-heading"
                                    className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl"
                                >
                                    {t("nearby.heading")}
                                </h2>
                            </div>
                            <Link
                                href="/experiences"
                                className="inline-flex shrink-0 items-center gap-2 font-sans text-label-lg text-secondary transition-colors hover:text-primary"
                            >
                                {t("nearby.viewAll")}
                                <ArrowRight className="size-[18px]" aria-hidden="true" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {related.map((exp) => (
                                <article
                                    key={exp.slug}
                                    className="group relative flex flex-col overflow-hidden rounded-xl border border-primary/10 bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float has-[.card-link:focus-visible]:outline-2 has-[.card-link:focus-visible]:outline-offset-2 has-[.card-link:focus-visible]:outline-secondary"
                                >
                                    <div className="relative h-56 w-full overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={exp.image}
                                            alt={exp.alt}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <span className="absolute left-3 top-3 rounded bg-surface-container-lowest/90 px-3 py-1 font-sans text-label-md text-primary backdrop-blur">
                                            {tCategory(exp.categories[0])}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-2 p-6">
                                        <h3 className="font-display text-headline-sm text-primary transition-colors group-hover:text-secondary">
                                            <Link
                                                href={`/experiences/${exp.slug}`}
                                                className="card-link after:absolute after:inset-0 focus-visible:outline-none"
                                            >
                                                {exp.title}
                                            </Link>
                                        </h3>
                                        <p className="font-sans text-label-md text-on-surface-variant">
                                            {exp.duration} &middot; {tEffort(exp.effort)}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
        </>
    );
}