import { notFound } from "next/navigation";
import { TRIP_IDEAS } from "@/lib/data/trip-ideas";
import TripIdeaDetail from "@/components/trip-ideas/TripIdeaDetail";

export function generateStaticParams() {
    return TRIP_IDEAS.map((idea) => ({ slug: idea.slug }));
}

export default async function TripIdeaDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const idea = TRIP_IDEAS.find((i) => i.slug === slug);

    if (!idea) {
        notFound();
    }

    return <TripIdeaDetail idea={idea} />;
}