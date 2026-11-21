// Seeds Sanity with the static content in src/lib/data (English only).
//
//   pnpm exec tsx scripts/seed-sanity.ts          dry run: checks everything, writes nothing
//   pnpm exec tsx scripts/seed-sanity.ts --write  uploads photos and creates the 18 documents
//
// --write needs SANITY_WRITE_TOKEN (an Editor token) in .env.local. The token
// is never printed. Re-running replaces the same documents, never duplicates.

import { createClient } from "@sanity/client";
import { CATEGORY_IDS } from "../src/lib/content/types";
import { EXPERIENCES } from "../src/lib/data/experiences";
import { GUIDES } from "../src/lib/data/guides";
import { TRIP_IDEAS } from "../src/lib/data/trip-ideas";

try {
    process.loadEnvFile(".env.local");
} catch {
    // .env.local is optional for a dry run
}

const WRITE = process.argv.includes("--write");
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "jkjqvoz4";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// Must match studio/schemaTypes/options.ts and validation.ts.
const EFFORTS = ["easy", "moderate", "demanding"];
const GUIDE_CATEGORIES = [
    "getting-there",
    "practical-info",
    "before-you-go",
    "planning",
    "local-advice",
];
const SLUG_SHAPE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Doc = { _id: string; _type: string } & Record<string, unknown>;
type Section = { title: string; description: string };

const problems: string[] = [];
const check = (ok: unknown, message: string) => {
    if (!ok) problems.push(message);
};
const hasText = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0;

/* A translated field: English only for now. The key matches the language id. */
const loc = (value: string) => [{ _key: "en", language: "en", value }];

const sections = (items: Section[] | undefined) =>
    items?.map((s, i) => ({
        _type: "section",
        _key: `section-${i + 1}`,
        title: loc(s.title),
        description: loc(s.description),
    }));

function validate() {
    const common = (
        kind: string,
        items: { slug: string; image: string; alt: string }[]
    ) => {
        const seen = new Set<string>();
        for (const item of items) {
            const who = `${kind} "${item.slug}"`;
            check(
                SLUG_SHAPE.test(item.slug) && item.slug.length <= 80,
                `${who}: slug is not lowercase words joined by hyphens`
            );
            check(!seen.has(item.slug), `${who}: duplicate slug`);
            seen.add(item.slug);
            check(item.image.startsWith("https://"), `${who}: image is not an https URL`);
            check(hasText(item.alt), `${who}: missing alt text`);
        }
    };
    const needText = (who: string, item: object, keys: string[]) => {
        const record = item as Record<string, unknown>;
        for (const key of keys) check(hasText(record[key]), `${who}: ${key} is empty`);
    };

    common("experience", EXPERIENCES);
    common("trip idea", TRIP_IDEAS);
    common("guide", GUIDES);

    for (const e of EXPERIENCES) {
        const who = `experience "${e.slug}"`;
        needText(who, e, ["title", "description", "body", "duration", "area", "bestFor"]);
        check(e.categories.length >= 1 && e.categories.length <= 3, `${who}: needs 1 to 3 categories`);
        check(new Set(e.categories).size === e.categories.length, `${who}: repeated category`);
        for (const c of e.categories) {
            check((CATEGORY_IDS as readonly string[]).includes(c), `${who}: unknown category "${c}"`);
        }
        check(EFFORTS.includes(e.effort), `${who}: unknown effort "${e.effort}"`);
        check(
            e.elevationM === undefined || (e.elevationM >= 0 && e.elevationM <= 3000),
            `${who}: elevationM out of range`
        );
        for (const s of [...(e.highlights ?? []), ...(e.practicalNotes ?? [])]) {
            needText(`${who} section`, s, ["title", "description"]);
        }
    }

    for (const g of GUIDES) {
        const who = `guide "${g.slug}"`;
        needText(who, g, ["title", "excerpt", "body"]);
        check(GUIDE_CATEGORIES.includes(g.category), `${who}: unknown category "${g.category}"`);
        check(
            Number.isInteger(g.readMinutes) && g.readMinutes >= 1 && g.readMinutes <= 60,
            `${who}: readMinutes must be a whole number from 1 to 60`
        );
    }

    const experienceSlugs = new Set(EXPERIENCES.map((e) => e.slug));
    for (const t of TRIP_IDEAS) {
        const who = `trip idea "${t.slug}"`;
        needText(who, t, ["title", "description", "body"]);
        check(t.experienceSlugs.length >= 1, `${who}: no experiences`);
        check(
            new Set(t.experienceSlugs).size === t.experienceSlugs.length,
            `${who}: repeated experience`
        );
        for (const s of t.experienceSlugs) {
            check(experienceSlugs.has(s), `${who}: experience "${s}" does not exist`);
        }
        check(t.days.length >= 1, `${who}: no days`);
        for (const d of t.days) needText(`${who} day`, d, ["title", "description"]);
    }
}

async function main() {
    validate();

    const client = createClient({
        projectId: PROJECT_ID,
        dataset: DATASET,
        apiVersion: "2025-01-01",
        useCdn: false,
        token: WRITE ? process.env.SANITY_WRITE_TOKEN : undefined,
    });
    check(!WRITE || process.env.SANITY_WRITE_TOKEN, "SANITY_WRITE_TOKEN is not set in .env.local");

    // Each distinct photo is downloaded once, even when several documents use it.
    const all = [...EXPERIENCES, ...TRIP_IDEAS, ...GUIDES];
    const photos = new Map<string, { slug: string; buffer: Buffer; type: string }>();
    for (const item of all) {
        if (photos.has(item.image) || !item.image.startsWith("https://")) continue;
        try {
            const res = await fetch(item.image);
            const type = res.headers.get("content-type") ?? "";
            if (!res.ok || !type.startsWith("image/")) {
                throw new Error(`HTTP ${res.status}, ${type || "no content type"}`);
            }
            photos.set(item.image, {
                slug: item.slug,
                buffer: Buffer.from(await res.arrayBuffer()),
                type,
            });
        } catch (error) {
            problems.push(
                `photo for "${item.slug}": ${(error as Error).message} (${item.image.slice(0, 60)}...)`
            );
        }
    }

    const assetIds = new Map<string, string>();
    if (WRITE && problems.length === 0) {
        for (const [url, photo] of photos) {
            const ext = photo.type.split("/")[1].replace("jpeg", "jpg");
            const asset = await client.assets.upload("image", photo.buffer, {
                filename: `${photo.slug}.${ext}`,
                contentType: photo.type,
            });
            assetIds.set(url, asset._id);
        }
    }
    const imageRef = (url: string) => ({
        _type: "image",
        asset: { _type: "reference", _ref: assetIds.get(url) ?? "(uploaded on --write)" },
    });
    const slugOf = (slug: string) => ({ _type: "slug", current: slug });

    const docs: Doc[] = [
        ...EXPERIENCES.map((e, i) => ({
            _id: `experience-${e.slug}`,
            _type: "experience",
            slug: slugOf(e.slug),
            title: loc(e.title),
            categories: e.categories,
            description: loc(e.description),
            body: loc(e.body),
            duration: loc(e.duration),
            elevationM: e.elevationM,
            area: loc(e.area),
            effort: e.effort,
            bestFor: loc(e.bestFor),
            image: imageRef(e.image),
            alt: loc(e.alt),
            highlights: sections(e.highlights),
            practicalNotes: sections(e.practicalNotes),
            insiderTip: e.insiderTip ? loc(e.insiderTip) : undefined,
            order: i + 1,
        })),
        ...TRIP_IDEAS.map((t, i) => ({
            _id: `trip-idea-${t.slug}`,
            _type: "tripIdea",
            slug: slugOf(t.slug),
            title: loc(t.title),
            description: loc(t.description),
            body: loc(t.body),
            experiences: t.experienceSlugs.map((s) => ({
                _type: "reference",
                _key: s,
                _ref: `experience-${s}`,
            })),
            days: t.days.map((d, n) => ({
                _type: "day",
                _key: `day-${n + 1}`,
                title: loc(d.title),
                description: loc(d.description),
            })),
            image: imageRef(t.image),
            alt: loc(t.alt),
            featured: t.featured ?? false,
            order: i + 1,
        })),
        ...GUIDES.map((g, i) => ({
            _id: `guide-${g.slug}`,
            _type: "guide",
            slug: slugOf(g.slug),
            category: g.category,
            title: loc(g.title),
            excerpt: loc(g.excerpt),
            body: loc(g.body),
            readMinutes: g.readMinutes,
            image: imageRef(g.image),
            alt: loc(g.alt),
            order: i + 1,
        })),
    ];

    // What is already in the dataset (published documents only).
    const existing = await client.fetch<{ _id: string }[]>(
        `*[_type in ["experience","tripIdea","guide"]]{_id}`
    );
    const seedIds = new Set(docs.map((d) => d._id));
    const replaced = existing.filter((d) => seedIds.has(d._id)).length;
    const others = existing.filter((d) => !seedIds.has(d._id)).map((d) => d._id);

    console.log(`Project ${PROJECT_ID}, dataset ${DATASET}, mode: ${WRITE ? "WRITE" : "dry run"}`);
    console.log(
        `${EXPERIENCES.length} experiences, ${TRIP_IDEAS.length} trip ideas, ${GUIDES.length} guides, ` +
        `${photos.size} distinct photos`
    );
    for (const d of docs) console.log(`  ${d._type.padEnd(10)} ${d._id}  order ${d.order}`);
    console.log(`In the dataset already: ${existing.length} document(s); ${replaced} would be replaced.`);
    if (others.length > 0) console.log(`Not part of the seed, left alone: ${others.join(", ")}`);

    if (problems.length > 0) {
        console.log(`\n${problems.length} problem(s). Nothing was written:`);
        for (const p of problems) console.log(`  - ${p}`);
        process.exitCode = 1;
        return;
    }
    if (!WRITE) {
        console.log("\nNo problems found. Dry run only: nothing was written. Add --write to seed.");
        return;
    }

    const tx = client.transaction();
    for (const d of docs) tx.createOrReplace(d);
    await tx.commit();
    console.log(`\nDone: ${docs.length} documents written, ${assetIds.size} photos uploaded.`);
}

main().catch((error) => {
    console.error(`Failed: ${(error as Error).message}`);
    process.exit(1);
});