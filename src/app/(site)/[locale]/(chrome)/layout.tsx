import type { SavedTripItem } from "@/components/saved/SavedTripDrawer";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { EXPERIENCES } from "@/lib/data/experiences";

/* Only what the saved-trip drawer shows is sent to the browser, so the long
   write-ups stay on the server. */
const SAVED_TRIP_ITEMS: SavedTripItem[] = EXPERIENCES.map(
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

/* Every normal page of the site: header, content, footer.
   The planner lives in the (focus) group instead and skips all of this. */
export default function ChromeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar savedItems={SAVED_TRIP_ITEMS} />
            <main className="pt-20">{children}</main>
            <Footer />
        </>
    );
}