import { useSyncExternalStore } from "react";

/* Saved experiences ("Add to Trip"), kept in the browser only.
   No accounts in Phase 1: the list lives in localStorage as an array of
   experience slugs. useSyncExternalStore keeps every component that reads
   it in sync, and avoids hydration mismatches because the server always
   renders the empty list first. */

const STORAGE_KEY = "nuwara-insider:saved-trip";
const EMPTY: readonly string[] = [];

/* The snapshot must be referentially stable between reads, so the parsed
   list is cached against the raw string it came from. */
let cachedRaw: string | null = null;
let cachedSlugs: readonly string[] = EMPTY;

const listeners = new Set<() => void>();

function readRaw(): string | null {
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null; // storage blocked (private mode, etc.)
    }
}

function getSnapshot(): readonly string[] {
    const raw = readRaw();
    if (raw === cachedRaw) return cachedSlugs;

    cachedRaw = raw;
    try {
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        cachedSlugs = Array.isArray(parsed)
            ? parsed.filter((s): s is string => typeof s === "string")
            : EMPTY;
    } catch {
        cachedSlugs = EMPTY;
    }
    return cachedSlugs;
}

function getServerSnapshot(): readonly string[] {
    return EMPTY;
}

function subscribe(listener: () => void) {
    listeners.add(listener);

    /* Fires when another tab changes the list. */
    const onStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY || e.key === null) listener();
    };
    window.addEventListener("storage", onStorage);

    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

function write(slugs: readonly string[]) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
        /* storage blocked: the change is simply not saved */
    }
    /* The storage event does not fire in the tab that made the change,
       so notify local subscribers ourselves. */
    listeners.forEach((listener) => listener());
}

export function toggleSaved(slug: string) {
    const current = getSnapshot();
    write(
        current.includes(slug)
            ? current.filter((s) => s !== slug)
            : [...current, slug]
    );
}

export function removeSaved(slug: string) {
    write(getSnapshot().filter((s) => s !== slug));
}

export function clearSaved() {
    write([]);
}

/* Client components only. */
export function useSavedTrip() {
    const slugs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return {
        slugs,
        count: slugs.length,
        isSaved: (slug: string) => slugs.includes(slug),
        toggle: toggleSaved,
        remove: removeSaved,
        clear: clearSaved,
    };
}