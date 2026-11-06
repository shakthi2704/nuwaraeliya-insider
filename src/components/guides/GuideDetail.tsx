import { ArrowRight, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import GuideCard from "@/components/guides/GuideCard";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { GUIDES, type Guide } from "@/lib/data/guides";

export default function GuideDetail({ guide }: { guide: Guide }) {
    const t = useTranslations("guideDetail");

    const [lead, ...paragraphs] = guide.body.split("\n\n");

    /* Keep reading: same category first, then data order. */
    const related = GUIDES.filter((g) => g.slug !== guide.slug)
        .map((g) => ({ g, sameCategory: g.category === guide.category ? 1 : 0 }))
        .sort((a, b) => b.sameCategory - a.sameCategory)
        .slice(0, 2)
        .map(({ g }) => g);

    return (
        <>
            <article>
                {/* Hero: bleeds under the fixed header (main has pt-20) */}
                <header className="relative isolate -mt-20 flex h-[30rem] flex-col justify-end overflow-hidden bg-primary-container text-on-primary md:h-[520px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={guide.image}
                        alt={guide.alt}
                        loading="eager"
                        fetchPriority="high"
                        className="absolute inset-0 -z-20 h-full w-full object-cover"
                    />
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
                                            href="/guides"
                                            className="transition-colors hover:text-secondary-fixed"
                                        >
                                            {t("guides")}
                                        </Link>
                                    </li>
                                    <li aria-hidden="true" className="text-surface-variant/60">
                                        /
                                    </li>
                                    <li
                                        aria-current="page"
                                        className="font-semibold text-secondary-container"
                                    >
                                        {guide.category}
                                    </li>
                                </ol>
                            </nav>

                            <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-block rounded-full bg-secondary-container/90 px-3 py-1 font-sans text-label-md uppercase tracking-wider text-on-secondary-fixed shadow-sm backdrop-blur-md">
                                    {guide.category}
                                </span>
                                <span className="inline-flex items-center gap-1.5 font-sans text-label-md text-surface">
                                    <Clock className="size-4" aria-hidden="true" />
                                    {guide.readTime}
                                </span>
                            </div>

                            <h1 className="font-display text-display-lg-mobile text-balance text-surface-container-lowest drop-shadow-sm md:text-display-lg">
                                {guide.title}
                            </h1>
                        </div>
                    </div>
                </header>

                {/* Reading column */}
                <div className="w-full bg-surface px-margin py-16 md:px-margin-md lg:px-margin-lg">
                    <div className="mx-auto flex max-w-3xl flex-col gap-14">
                        <div className="flex flex-col gap-6">
                            <p className="font-display text-body-xl leading-relaxed text-on-surface">
                                {lead}
                            </p>
                            {paragraphs.map((paragraph, i) => (
                                <p
                                    key={i}
                                    className="font-sans text-body-lg leading-relaxed text-on-surface-variant"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Inline planner card */}
                        <aside className="flex flex-col gap-5 rounded-2xl bg-surface-container-low p-7 shadow-sm md:p-8">
                            <div className="flex flex-col gap-2">
                                <span className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                                    {t("plan.eyebrow")}
                                </span>
                                <h2 className="font-display text-headline-md text-primary">
                                    {t("plan.heading")}
                                </h2>
                                <p className="font-sans text-body-md text-on-surface-variant">
                                    {t("plan.text")}
                                </p>
                            </div>
                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                <ButtonLink href="/plan-my-trip" size="lg">
                                    {t("plan.cta")}
                                    <ArrowRight className="size-[18px]" aria-hidden="true" />
                                </ButtonLink>
                                <Link
                                    href="/ask-an-insider"
                                    className="font-sans text-label-lg text-secondary transition-colors hover:text-primary"
                                >
                                    {t("plan.ask")}
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </article>

            {/* Keep reading */}
            {related.length > 0 ? (
                <section
                    aria-labelledby="keep-reading-heading"
                    className="w-full border-t border-surface-container-high bg-surface-container-low px-margin py-20 md:px-margin-md lg:px-margin-lg"
                >
                    <div className="mx-auto flex max-w-7xl flex-col gap-10">
                        <div className="flex flex-col justify-between gap-6 border-b border-surface-container-high pb-2 md:flex-row md:items-end">
                            <div>
                                <span className="mb-2 block font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                                    {t("related.eyebrow")}
                                </span>
                                <h2
                                    id="keep-reading-heading"
                                    className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl"
                                >
                                    {t("related.heading")}
                                </h2>
                            </div>
                            <Link
                                href="/guides"
                                className="inline-flex shrink-0 items-center gap-2 font-sans text-label-lg text-secondary transition-colors hover:text-primary"
                            >
                                {t("related.viewAll")}
                                <ArrowRight className="size-[18px]" aria-hidden="true" />
                            </Link>
                        </div>

                        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {related.map((g) => (
                                <li key={g.slug} className="grid">
                                    <GuideCard guide={g} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            ) : null}
        </>
    );
}