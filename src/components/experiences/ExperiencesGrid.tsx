import { useTranslations } from "next-intl";
import ExperienceCard from "@/components/experiences/ExperienceCard";
import SavedCounter from "@/components/experiences/SavedCounter";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import {
    CATEGORY_IDS,
    EXPERIENCES,
    type CategoryId,
    type Effort,
} from "@/lib/data/experiences";
import { cn } from "@/lib/utils";

const EFFORT_ORDER: Effort[] = ["easy", "moderate", "demanding"];

/* Filters live in the URL (?category=...&effort=...), so a filtered view is
   shareable and the back button works. Chips are plain links. */
function filterHref(category?: CategoryId, effort?: Effort) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (effort) params.set("effort", effort);
    const qs = params.toString();
    return qs ? `/experiences?${qs}` : "/experiences";
}

const pill =
    "shrink-0 rounded-full px-4 py-2 font-sans text-label-md transition-all";
const pillOn = "bg-primary text-on-primary shadow-sm";
const pillOff =
    "bg-surface-container text-on-surface-variant hover:bg-surface-container-high";

const chip =
    "rounded-md px-2.5 py-1 font-sans text-caption font-semibold transition-colors";
const chipOn = "bg-secondary-container text-on-secondary-container";
const chipOff =
    "bg-surface-container-low text-on-surface-variant hover:bg-secondary-container";

export default function ExperiencesGrid({
    category,
    effort,
}: {
    category?: CategoryId;
    effort?: Effort;
}) {
    const t = useTranslations("experiencesPage");
    const tCategory = useTranslations("categories");
    const tEffort = useTranslations("effort");

    /* Only offer filters that match at least one experience. */
    const categoryOptions = CATEGORY_IDS.filter((id) =>
        EXPERIENCES.some((e) => e.categories.includes(id))
    );
    const effortOptions = EFFORT_ORDER.filter((value) =>
        EXPERIENCES.some((e) => e.effort === value)
    );

    const visible = EXPERIENCES.filter(
        (e) =>
            (!category || e.categories.includes(category)) &&
            (!effort || e.effort === effort)
    );

    return (
        <>
            {/* Sticky filter bar, sits just under the fixed header */}
            <section
                aria-label={t("filtersLabel")}
                className="sticky top-20 z-40 w-full bg-surface/95 px-margin py-4 shadow-sm backdrop-blur-md md:px-margin-md lg:px-margin-lg"
            >
                <div className="mx-auto flex max-w-7xl flex-col gap-3">
                    {/* Categories */}
                    <ul className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <li className="shrink-0">
                            <Link
                                href={filterHref(undefined, effort)}
                                scroll={false}
                                aria-current={!category ? "true" : undefined}
                                className={cn(pill, "inline-block", !category ? pillOn : pillOff)}
                            >
                                {t("allExperiences")}
                            </Link>
                        </li>
                        {categoryOptions.map((id) => {
                            const active = category === id;
                            return (
                                <li key={id} className="shrink-0">
                                    <Link
                                        href={filterHref(id, effort)}
                                        scroll={false}
                                        aria-current={active ? "true" : undefined}
                                        className={cn(pill, "inline-block", active ? pillOn : pillOff)}
                                    >
                                        {tCategory(id)}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Effort filter + saved counter */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="mr-1 font-sans text-caption uppercase tracking-wider text-outline">
                                {t("effortLabel")}
                            </span>
                            {effortOptions.map((value) => {
                                const active = effort === value;
                                return (
                                    <Link
                                        key={value}
                                        /* Clicking the active chip clears it */
                                        href={filterHref(category, active ? undefined : value)}
                                        scroll={false}
                                        aria-current={active ? "true" : undefined}
                                        className={cn(chip, active ? chipOn : chipOff)}
                                    >
                                        {tEffort(value)}
                                    </Link>
                                );
                            })}
                        </div>

                        <SavedCounter />
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="w-full bg-surface px-margin py-10 md:px-margin-md lg:px-margin-lg">
                <div className="mx-auto max-w-7xl">
                    {visible.length > 0 ? (
                        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {visible.map((exp) => (
                                <li key={exp.slug} className="grid">
                                    <ExperienceCard experience={exp} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center gap-4 rounded-xl bg-surface-container-low p-10 text-center">
                            <h2 className="font-display text-headline-sm text-primary">
                                {t("emptyHeading")}
                            </h2>
                            <p className="max-w-md font-sans text-body-md text-on-surface-variant">
                                {t("emptyText")}
                            </p>
                            <ButtonLink href="/experiences" variant="outline">
                                {t("clearFilters")}
                            </ButtonLink>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}