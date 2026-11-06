import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { EXPERIENCES } from "@/lib/data/experiences";

/* The row shows the experiences after the three featured ones above it. */
const FIRST_INDEX = 3;
const COUNT = 3;

export default function CompactExperienceRow() {
    const t = useTranslations("featuredExperiences");
    const tCategory = useTranslations("categories");

    const items = EXPERIENCES.slice(FIRST_INDEX, FIRST_INDEX + COUNT);
    if (items.length === 0) return null;

    return (
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {items.map((exp) => (
                <li
                    key={exp.slug}
                    className="group relative flex flex-col justify-between rounded-xl border border-surface-container-highest bg-surface-container-low p-6 transition-colors hover:bg-surface-container has-[.card-link:focus-visible]:outline-2 has-[.card-link:focus-visible]:outline-offset-2 has-[.card-link:focus-visible]:outline-secondary"
                >
                    <div>
                        <div className="mb-3 flex items-center justify-between gap-4 font-sans text-caption font-semibold uppercase tracking-wider text-secondary">
                            <span>{tCategory(exp.categories[0])}</span>
                            <span className="shrink-0">{exp.duration}</span>
                        </div>
                        <h3 className="mb-2 font-display text-headline-sm text-primary transition-colors group-hover:text-secondary">
                            {exp.title}
                        </h3>
                        <p className="mb-6 line-clamp-3 font-sans text-body-md text-on-surface-variant">
                            {exp.description}
                        </p>
                    </div>

                    {/* Stretched link: the whole card is clickable */}
                    <Link
                        href={`/experiences/${exp.slug}`}
                        className="card-link inline-flex items-center gap-1.5 font-sans text-label-md text-secondary transition-colors after:absolute after:inset-0 group-hover:text-primary focus-visible:outline-none"
                    >
                        {t("viewExperience")}
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                </li>
            ))}
        </ul>
    );
}