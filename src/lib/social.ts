/* Social accounts shown in the footer.

   To go live: replace PLACEHOLDER_URL with the real profile address. To
   remove a platform: delete its line. To add one (TikTok, say): add a line
   here, add its name to SocialPlatform, and add its icon to SocialLinks.tsx.

   PLACEHOLDER_URL is example.com on purpose, never a made-up handle, so a
   visitor can never be sent to someone else's page. Placeholder links show
   in development so the layout can be checked, and are hidden in production
   builds (including Vercel previews) until a real address is set. */

export type SocialPlatform = "instagram" | "facebook";

export type SocialLink = {
    platform: SocialPlatform;
    /** Brand name, used in the accessible label. Not translated. */
    name: string;
    url: string;
};

export const PLACEHOLDER_URL = "https://example.com";

export const SOCIAL_LINKS: SocialLink[] = [
    { platform: "instagram", name: "Instagram", url: PLACEHOLDER_URL },
    { platform: "facebook", name: "Facebook", url: PLACEHOLDER_URL },
];

export function visibleSocialLinks(): SocialLink[] {
    const isProduction = process.env.NODE_ENV === "production";
    return SOCIAL_LINKS.filter(
        (link) =>
            link.url !== "" && !(isProduction && link.url === PLACEHOLDER_URL)
    );
}