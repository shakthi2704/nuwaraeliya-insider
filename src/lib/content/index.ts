// The one place the site reads content from. Today it returns the static
// files in src/lib/data. When Sanity arrives, only this file changes: pages
// and components keep calling the same functions.
//
// Every function takes the locale already, so call sites are final. The
// static content is English only and ignores it for now.

/* eslint-disable @typescript-eslint/no-unused-vars -- locale is unused until
   the content comes from Sanity */

import type { Experience, Guide, TripIdea } from "@/lib/content/types";
import { EXPERIENCES } from "@/lib/data/experiences";
import { GUIDES } from "@/lib/data/guides";
import { TRIP_IDEAS } from "@/lib/data/trip-ideas";

export async function getExperiences(_locale: string): Promise<Experience[]> {
    return EXPERIENCES;
}

export async function getExperience(
    slug: string,
    locale: string
): Promise<Experience | undefined> {
    const all = await getExperiences(locale);
    return all.find((experience) => experience.slug === slug);
}

export async function getGuides(_locale: string): Promise<Guide[]> {
    return GUIDES;
}

export async function getGuide(
    slug: string,
    locale: string
): Promise<Guide | undefined> {
    const all = await getGuides(locale);
    return all.find((guide) => guide.slug === slug);
}

export async function getTripIdeas(_locale: string): Promise<TripIdea[]> {
    return TRIP_IDEAS;
}

export async function getTripIdea(
    slug: string,
    locale: string
): Promise<TripIdea | undefined> {
    const all = await getTripIdeas(locale);
    return all.find((idea) => idea.slug === slug);
}