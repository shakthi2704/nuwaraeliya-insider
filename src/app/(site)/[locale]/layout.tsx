import type { Metadata, Viewport } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "../../globals.css";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";

/* Editorial serif for headlines. The opsz axis lets the browser pick
   the right optical size automatically, as in the Stitch design. */
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

/* Interface and body text. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nuwara Insider - Plan Your Nuwara Eliya Trip",
    template: "%s | Nuwara Insider",
  },
  description:
    "Curated experiences, realistic trip ideas and a trip planner for Nuwara Eliya, Sri Lanka - from someone who actually lives here.",
  keywords: [
    "Nuwara Eliya",
    "Sri Lanka travel",
    "things to do Nuwara Eliya",
    "Nuwara Eliya trip planner",
    "hill country Sri Lanka",
    "tea country Sri Lanka",
    "Horton Plains",
    "World's End Sri Lanka",
  ],
  openGraph: {
    title: "Nuwara Insider",
    description: "Your Nuwara Eliya trip, thoughtfully planned.",
    url: "https://nuwaraeliyaguide.com",
    siteName: "Nuwara Insider",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuwara Insider",
    description: "Your Nuwara Eliya trip, thoughtfully planned.",
  },
};

/* Tints the mobile browser bar to match the page background. */
export const viewport: Viewport = {
  themeColor: "#f4fbf5",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${newsreader.variable} ${jakarta.variable}`}
      data-lang-bar={routing.locales.length > 1 ? "true" : undefined}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}