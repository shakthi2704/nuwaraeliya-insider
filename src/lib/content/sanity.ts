// Reads published content from Sanity and returns it in the shapes defined in
// @/lib/content/types, so pages and components do not know where it came from.
// Only @/lib/content/index.ts should import this file.
//
// Translated fields are stored as [{ language, value }]. Each one is read in
// the requested language and falls back to English.

import { createClient } from "@sanity/client";
import type { Experience, Guide, TripIdea } from "@/lib/content/types";

function client() {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    if (!projectId || !dataset) {
        throw new Error(
            "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local"
        );
    }
    return createClient({
        projectId,
        dataset,
        apiVersion: "2025-01-01",
        perspective: "published",
        useCdn: false, // Next's own cache sits in front of every read
    });
}

/* The cache is cleared by tag (see the revalidate webhook). In development
   nothing is cached, so Studio edits show on refresh. */
function read<T>(query: string, locale: string, tag: string): Promise<T> {
    return client().fetch<T>(query, { locale }, {
        cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
        next: { tags: [tag] },
    });
}

/* GROQ for one translated field: the requested language, else English. */
const t = (field: string) =>
    `coalesce(${field}[language == $locale][0].value, ${field}[language == "en"][0].value)`;

const SECTION = `{ "title": ${t("title")}, "description": ${t("description")} }`;

const EXPERIENCES = `*[_type == "experience"] | order(order asc) {
  "slug": slug.current,
  categories,
  "title": ${t("title")},
  "description": ${t("description")},
  "body": ${t("body")},
  "duration": ${t("duration")},
  elevationM,
  "area": ${t("area")},
  effort,
  "bestFor": ${t("bestFor")},
  "image": image.asset->url,
  "alt": ${t("alt")},
  "highlights": highlights[]${SECTION},
  "practicalNotes": practicalNotes[]${SECTION},
  "insiderTip": ${t("insiderTip")}
}`;

const TRIP_IDEAS = `*[_type == "tripIdea"] | order(order asc) {
  "slug": slug.current,
  "title": ${t("title")},
  "description": ${t("description")},
  "body": ${t("body")},
  "experienceSlugs": experiences[defined(@->slug.current)]->slug.current,
  "days": days[]${SECTION},
  "image": image.asset->url,
  "alt": ${t("alt")},
  featured
}`;

const GUIDES = `*[_type == "guide"] | order(order asc) {
  "slug": slug.current,
  category,
  "title": ${t("title")},
  "excerpt": ${t("excerpt")},
  "body": ${t("body")},
  readMinutes,
  "image": image.asset->url,
  "alt": ${t("alt")}
}`;

/* GROQ returns null for a field that is not set; the types use "absent". */
const withoutNulls = <T extends object>(value: T): T =>
    Object.fromEntries(Object.entries(value).filter(([, v]) => v !== null)) as T;

export async function fetchExperiences(locale: string): Promise<Experience[]> {
    const rows = await read<Experience[]>(EXPERIENCES, locale, "experience");
    return rows.map(withoutNulls);
}

export async function fetchTripIdeas(locale: string): Promise<TripIdea[]> {
    const rows = await read<TripIdea[]>(TRIP_IDEAS, locale, "tripIdea");
    return rows.map(withoutNulls);
}

export async function fetchGuides(locale: string): Promise<Guide[]> {
    return read<Guide[]>(GUIDES, locale, "guide");
}