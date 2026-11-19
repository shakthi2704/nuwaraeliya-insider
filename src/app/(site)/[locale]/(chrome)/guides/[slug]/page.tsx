import { notFound } from "next/navigation";
import GuideDetail from "@/components/guides/GuideDetail";
import { routing } from "@/i18n/routing";
import { getGuide, getGuides } from "@/lib/content";

export async function generateStaticParams() {
    /* Slugs are the same in every language. */
    const guides = await getGuides(routing.defaultLocale);
    return guides.map((guide) => ({ slug: guide.slug }));
}

export default async function GuideDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const [guide, guides] = await Promise.all([
        getGuide(slug, locale),
        getGuides(locale),
    ]);

    if (!guide) {
        notFound();
    }

    return <GuideDetail guide={guide} guides={guides} />;
}