import EssentialAdvice from "@/components/home/EssentialAdvices";
import FeaturedExperiences from "@/components/home/FeaturedExperiences";
import Hero from "@/components/home/Hero";
import LatestGuides from "@/components/home/LatestGuides";
import PlanMyTripCTA from "@/components/home/PlanMyTripCTA";
import PopularTripIdeas from "@/components/home/PopularTripIdeas";
import SeasonalGuideStrip from "@/components/home/SeasonalGuideStrip";
import WhyTrustUs from "@/components/home/WhyTrustUs";
import { setRequestLocale } from "next-intl/server";
import { getExperiences, getGuides, getTripIdeas } from "@/lib/content";

export default async function Home({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const [experiences, tripIdeas, guides] = await Promise.all([
        getExperiences(locale),
        getTripIdeas(locale),
        getGuides(locale),
    ]);

    return (
        <>
            <Hero />
            <WhyTrustUs />
            <FeaturedExperiences experiences={experiences} />
            <PopularTripIdeas tripIdeas={tripIdeas} />
            <SeasonalGuideStrip />
            <PlanMyTripCTA />
            <EssentialAdvice />
            <LatestGuides guides={guides} />
        </>
    );
}