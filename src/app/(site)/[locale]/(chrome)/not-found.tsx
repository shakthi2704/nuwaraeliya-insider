import { getLocale } from "next-intl/server";
import NotFoundPage from "@/components/NotFoundPage";
import { getExperiences } from "@/lib/content";

export default async function NotFound() {
    const locale = await getLocale();
    const experiences = await getExperiences(locale);

    return <NotFoundPage experiences={experiences} />;
}