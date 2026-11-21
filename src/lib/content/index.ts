// The one place the site reads content from. Pages and components call these
// functions and never know where the content lives (today: Sanity, through
// ./sanity). Every function takes the locale; a field with no translation in
// that locale falls back to English.

import type { Experience, Guide, TripIdea } from "@/lib/content/types";
import {
    fetchExperiences,
    fetchGuides,
    fetchTripIdeas,
} from "@/lib/content/sanity";

export async function getExperiences(locale: string): Promise<Experience[]> {
    return fetchExperiences(locale);
}

export async function getExperience(
    slug: string,
    locale: string
): Promise<Experience | undefined> {
    const all = await getExperiences(locale);
    return all.find((experience) => experience.slug === slug);
}

export async function getGuides(locale: string): Promise<Guide[]> {
    return fetchGuides(locale);
}

export async function getGuide(
    slug: string,
    locale: string
): Promise<Guide | undefined> {
    const all = await getGuides(locale);
    return all.find((guide) => guide.slug === slug);
}

export async function getTripIdeas(locale: string): Promise<TripIdea[]> {
    return fetchTripIdeas(locale);
}

export async function getTripIdea(
    slug: string,
    locale: string
): Promise<TripIdea | undefined> {
    const all = await getTripIdeas(locale);
    return all.find((idea) => idea.slug === slug);
}