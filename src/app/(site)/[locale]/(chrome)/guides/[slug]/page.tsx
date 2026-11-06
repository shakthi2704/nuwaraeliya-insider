import { notFound } from "next/navigation";
import { GUIDES } from "@/lib/data/guides";
import GuideDetail from "@/components/guides/GuideDetail";

export function generateStaticParams() {
    return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export default async function GuideDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const guide = GUIDES.find((g) => g.slug === slug);

    if (!guide) {
        notFound();
    }

    return <GuideDetail guide={guide} />;
}