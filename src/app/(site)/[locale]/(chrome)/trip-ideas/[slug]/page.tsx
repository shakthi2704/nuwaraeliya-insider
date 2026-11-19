import { notFound } from "next/navigation";
import TripIdeaDetail from "@/components/trip-ideas/TripIdeaDetail";
import { routing } from "@/i18n/routing";
import { getExperiences, getTripIdea, getTripIdeas } from "@/lib/content";

export async function generateStaticParams() {
    /* Slugs are the same in every language. */
    const ideas = await getTripIdeas(routing.defaultLocale);
    return ideas.map((idea) => ({ slug: idea.slug }));
}

export default async function TripIdeaDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const [idea, experiences] = await Promise.all([
        getTripIdea(slug, locale),
        getExperiences(locale),
    ]);

    if (!idea) {
        notFound();
    }

    return <TripIdeaDetail idea={idea} experiences={experiences} />;
}