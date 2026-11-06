import { ArrowRight, Clock, Footprints, MapPin, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import AddToTripButton from "@/components/experiences/AddToTripButton";
import { Link } from "@/i18n/navigation";
import type { Experience } from "@/lib/data/experiences";

const formatMetres = (m: number) => m.toLocaleString("en-US");

/* Index card for one experience. The title link is stretched over the whole
   card, and the Add to Trip button sits above it (relative z-10), so a click
   on the card opens the page while the button only saves. */
export default function ExperienceCard({
    experience,
}: {
    experience: Experience;
}) {
    const t = useTranslations("experiencesPage");
    const tFeatured = useTranslations("featuredExperiences");
    const tCategory = useTranslations("categories");
    const tEffort = useTranslations("effort");

    const facts = [
        { key: "duration", icon: Clock, value: experience.duration },
        { key: "area", icon: MapPin, value: experience.area },
        { key: "effort", icon: Footprints, value: tEffort(experience.effort) },
        { key: "bestFor", icon: Users, value: experience.bestFor },
    ];

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float has-[.card-link:focus-visible]:outline-2 has-[.card-link:focus-visible]:outline-offset-2 has-[.card-link:focus-visible]:outline-secondary">
            {/* Photo, category chip, elevation */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={experience.image}
                    alt={experience.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-transparent" />

                <span className="absolute left-4 top-4 rounded-full bg-surface-container-lowest/90 px-2.5 py-1 font-sans text-caption font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
                    {tCategory(experience.categories[0])}
                </span>

                {experience.elevationM ? (
                    <span className="absolute bottom-3 left-4 font-sans text-caption uppercase tracking-widest text-on-primary">
                        {tFeatured("elevation", {
                            value: formatMetres(experience.elevationM),
                        })}
                    </span>
                ) : null}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between gap-5 p-6">
                <div className="flex flex-col gap-2">
                    <h2 className="font-display text-headline-sm text-primary transition-colors group-hover:text-secondary">
                        <Link
                            href={`/experiences/${experience.slug}`}
                            className="card-link after:absolute after:inset-0 focus-visible:outline-none"
                        >
                            {experience.title}
                        </Link>
                    </h2>
                    <p className="line-clamp-2 font-sans text-body-md text-on-surface-variant">
                        {experience.description}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <dl className="grid grid-cols-2 gap-x-2 gap-y-2.5 rounded-lg bg-surface-container-low/60 p-3">
                        {facts.map(({ key, icon: Icon, value }) => (
                            <div
                                key={key}
                                className="flex min-w-0 items-center gap-1.5 text-on-surface-variant"
                            >
                                <Icon
                                    className="size-4 shrink-0 text-secondary"
                                    aria-hidden="true"
                                />
                                <dd className="truncate font-sans text-caption">{value}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 font-sans text-label-md text-secondary transition-colors group-hover:text-primary">
                            {t("viewExperience")}
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </span>

                        <div className="relative z-10">
                            <AddToTripButton slug={experience.slug} compact />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}