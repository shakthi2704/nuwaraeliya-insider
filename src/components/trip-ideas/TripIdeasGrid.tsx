import TripIdeaCard from "@/components/trip-ideas/TripIdeaCard";
import type { TripIdea } from "@/lib/content/types";

/* All trip ideas as cards. The page header and CTA live in
   trip-ideas/page.tsx, as on /experiences. */
export default function TripIdeasGrid({ ideas }: { ideas: TripIdea[] }) {
    return (
        <section className="w-full bg-surface px-margin py-10 md:px-margin-md lg:px-margin-lg">
            <div className="mx-auto max-w-7xl">
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {ideas.map((idea) => (
                        <li key={idea.slug} className="grid">
                            <TripIdeaCard idea={idea} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}