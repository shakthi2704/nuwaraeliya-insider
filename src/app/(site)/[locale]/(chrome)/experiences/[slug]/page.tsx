import { notFound } from "next/navigation";
import ExperienceDetail from "@/components/experiences/ExperienceDetail";
import { routing } from "@/i18n/routing";
import { getExperience, getExperiences } from "@/lib/content";

export async function generateStaticParams() {
    /* Slugs are the same in every language. */
    const experiences = await getExperiences(routing.defaultLocale);
    return experiences.map((exp) => ({ slug: exp.slug }));
}

export default async function ExperienceDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const [experience, experiences] = await Promise.all([
        getExperience(slug, locale),
        getExperiences(locale),
    ]);

    if (!experience) {
        notFound();
    }

    return <ExperienceDetail experience={experience} experiences={experiences} />;
}