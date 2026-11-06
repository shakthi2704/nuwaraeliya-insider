import { ArrowRight, BookOpen, Flag, Headset, Mountain, Route } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { EXPERIENCES } from "@/lib/data/experiences";

const WAYPOINTS = [
    { key: "home", href: "/", icon: Mountain },
    { key: "guides", href: "/guides", icon: BookOpen },
    { key: "planner", href: "/plan-my-trip", icon: Route },
    { key: "ask", href: "/ask-an-insider", icon: Headset },
] as const;

/* Real experiences a visitor is likely to be looking for. */
const POPULAR_SLUGS = [
    "pedro-tea-estate",
    "single-tree-hill-sunrise",
    "horton-plains-worlds-end",
];

export default function NotFoundPage() {
    const t = useTranslations("notFound");

    const popular = POPULAR_SLUGS.map((slug) =>
        EXPERIENCES.find((e) => e.slug === slug)
    ).filter((e): e is NonNullable<typeof e> => Boolean(e));

    return (
        <>
            {/* Message */}
            <section className="w-full bg-surface px-margin pb-12 pt-16 md:px-margin-md lg:px-margin-lg">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
                    <p
                        aria-hidden="true"
                        className="font-display text-[8rem] font-light leading-none text-primary/15 md:text-[12rem]"
                    >
                        {t("code")}
                    </p>
                    <span className="font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                        {t("eyebrow")}
                    </span>
                    <h1 className="font-display text-display-lg-mobile tracking-tight text-primary md:text-display-lg">
                        {t("heading")}
                    </h1>
                    <p className="max-w-xl font-sans text-body-lg text-on-surface-variant">
                        {t("text")}
                    </p>

                    {popular.length > 0 ? (
                        <div className="mt-2 flex flex-col items-center gap-3">
                            <p className="font-sans text-caption font-semibold uppercase tracking-wider text-outline">
                                {t("popularLabel")}
                            </p>
                            <ul className="flex flex-wrap justify-center gap-2">
                                {popular.map((exp) => (
                                    <li key={exp.slug}>
                                        <Link
                                            href={`/experiences/${exp.slug}`}
                                            className="inline-block rounded-full bg-surface-container px-4 py-2 font-sans text-label-md text-primary transition-colors hover:bg-surface-container-high"
                                        >
                                            {exp.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            </section>

            {/* Where to go next */}
            <section className="w-full bg-surface px-margin pb-12 md:px-margin-md lg:px-margin-lg">
                <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {WAYPOINTS.map(({ key, href, icon: Icon }) => (
                        <li
                            key={key}
                            className="group relative flex flex-col gap-4 rounded-2xl bg-surface-container-low p-6 transition-colors hover:bg-surface-container has-[.card-link:focus-visible]:outline-2 has-[.card-link:focus-visible]:outline-offset-2 has-[.card-link:focus-visible]:outline-secondary"
                        >
                            <span className="flex size-11 items-center justify-center rounded-xl bg-surface-container-lowest text-primary shadow-sm">
                                <Icon className="size-[22px]" aria-hidden="true" />
                            </span>
                            <div className="flex flex-col gap-1.5">
                                <h2 className="font-display text-headline-sm text-primary">
                                    {t(`waypoints.${key}.title`)}
                                </h2>
                                <p className="font-sans text-body-md text-on-surface-variant">
                                    {t(`waypoints.${key}.text`)}
                                </p>
                            </div>
                            <Link
                                href={href}
                                className="card-link mt-auto inline-flex items-center gap-1.5 font-sans text-label-md text-secondary transition-colors after:absolute after:inset-0 group-hover:text-primary focus-visible:outline-none"
                            >
                                {t(`waypoints.${key}.cta`)}
                                <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Report a broken link */}
            <section className="w-full bg-surface px-margin pb-20 md:px-margin-md lg:px-margin-lg">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary p-8 text-on-primary shadow-xl sm:p-12">
                    <div
                        className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full bg-secondary/30 blur-3xl"
                        aria-hidden="true"
                    />
                    <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-8">
                            <span className="mb-2 flex items-center gap-2 font-sans text-label-md font-semibold uppercase tracking-widest text-secondary-container">
                                <Flag className="size-4" aria-hidden="true" />
                                {t("report.eyebrow")}
                            </span>
                            <h2 className="mb-3 font-display text-headline-xl-mobile leading-tight text-on-primary md:text-headline-xl">
                                {t("report.heading")}
                            </h2>
                            <p className="max-w-2xl font-sans text-body-lg text-on-primary-container">
                                {t("report.text")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 lg:col-span-4">
                            <ButtonLink
                                href="/ask-an-insider?topic=broken-link"
                                variant="secondary"
                                size="lg"
                                className="w-full"
                            >
                                {t("report.cta")}
                            </ButtonLink>
                            <Link
                                href="/trip-ideas"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-on-primary/10 px-6 py-3 text-center font-sans text-label-md text-on-primary transition-colors hover:bg-on-primary/20"
                            >
                                {t("report.secondary")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}