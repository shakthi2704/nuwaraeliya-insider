import { setRequestLocale } from "next-intl/server";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";

export default async function ChromeLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <Navbar />
            <main className="pt-20">{children}</main>
            <Footer />
        </>
    );
}