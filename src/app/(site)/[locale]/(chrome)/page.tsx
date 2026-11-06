import EssentialAdvice from "@/components/home/EssentialAdvices";
import FeaturedExperiences from "@/components/home/FeaturedExperiences";
import Hero from "@/components/home/Hero";
import LatestGuides from "@/components/home/LatestGuides";
import PlanMyTripCTA from "@/components/home/PlanMyTripCTA";
import PopularTripIdeas from "@/components/home/PopularTripIdeas";
import SeasonalGuideStrip from "@/components/home/SeasonalGuideStrip";
import WhyTrustUs from "@/components/home/WhyTrustUs";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <Hero />
            <WhyTrustUs />
            <FeaturedExperiences />
            <PopularTripIdeas />
            <SeasonalGuideStrip />
            <PlanMyTripCTA />
            <EssentialAdvice />
            <LatestGuides />
        </>
    );
}