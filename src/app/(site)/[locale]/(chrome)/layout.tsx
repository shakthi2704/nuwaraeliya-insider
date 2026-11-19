import type { SavedTripItem } from "@/components/saved/SavedTripDrawer";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { getExperiences } from "@/lib/content";

/* Every normal page of the site: header, content, footer.
   The planner lives in the (focus) group instead and skips all of this. */
export default async function ChromeLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const experiences = await getExperiences(locale);

    /* Only what the saved-trip drawer shows is sent to the browser, so the
       long write-ups stay on the server. */
    const savedItems: SavedTripItem[] = experiences.map(
        ({ slug, title, area, duration, effort, image, alt }) => ({
            slug,
            title,
            area,
            duration,
            effort,
            image,
            alt,
        })
    );

    return (
        <>
            <Navbar savedItems={savedItems} />
            <main className="pt-[var(--header-h)]">{children}</main>
            <Footer />
        </>
    );
}