// Called by a Sanity webhook after content is published, changed or deleted.
// It clears the cached content so the site shows the edit within seconds.
//
// Every content tag is cleared on every call, whatever changed: trip ideas
// point at experiences, so a change to one can show up in the other, and the
// content is small enough that refetching all of it is cheap.

import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

// Keep in step with the tags used in src/lib/content/sanity.ts.
const TAGS = ["experience", "tripIdea", "guide"];

const digest = (value: string) => createHash("sha256").update(value).digest();

export async function POST(request: Request) {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
        return Response.json({ error: "Revalidation is not configured" }, { status: 503 });
    }

    // Hashing first makes both sides the same length for the constant-time compare.
    const sent = request.headers.get("x-revalidate-secret") ?? "";
    if (!timingSafeEqual(digest(sent), digest(secret))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    for (const tag of TAGS) revalidateTag(tag, { expire: 0 });
    return Response.json({ revalidated: TAGS });
}