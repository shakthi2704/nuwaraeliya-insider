import { notFound } from "next/navigation";
import { EXPERIENCES } from "@/lib/data/experiences";
import ExperienceDetail from "@/components/experiences/ExperienceDetail";

export function generateStaticParams() {
    return EXPERIENCES.map((exp) => ({ slug: exp.slug }));
}

export default async function ExperienceDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const experience = EXPERIENCES.find((exp) => exp.slug === slug);

    if (!experience) {
        notFound();
    }

    return <ExperienceDetail experience={experience} />;
}