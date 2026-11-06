import { useSyncExternalStore } from "react";
import {
    encodeAnswers,
    parseDraft,
    type PartialAnswers,
} from "@/lib/planner/answers";

/* The questionnaire in progress, kept in the browser so a returning visitor
   finds their answers still there. Stored in the same short query-string
   format as the shared URL, so one parser validates both and stale or edited
   values are simply ignored. Same pattern as saved-trip.ts: useSyncExternalStore
   avoids hydration mismatches because the server always renders "no draft". */

const STORAGE_KEY = "nuwara-insider:planner-draft";
const EMPTY: PartialAnswers = {};

let cachedRaw: string | null = null;
let cachedDraft: PartialAnswers = EMPTY;

const listeners = new Set<() => void>();

function readRaw(): string | null {
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null; // storage blocked (private mode, etc.)
    }
}

/* Returns the same object until the stored text changes, as React requires. */
function getSnapshot(): PartialAnswers {
    const raw = readRaw();
    if (raw === cachedRaw) return cachedDraft;

    cachedRaw = raw;
    cachedDraft = raw
        ? parseDraft(Object.fromEntries(new URLSearchParams(raw)))
        : EMPTY;
    return cachedDraft;
}

function getServerSnapshot(): PartialAnswers {
    return EMPTY;
}

function subscribe(listener: () => void) {
    listeners.add(listener);

    /* Fires when another tab changes the draft. */
    const onStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY || e.key === null) listener();
    };
    window.addEventListener("storage", onStorage);

    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

function notify() {
    listeners.forEach((listener) => listener());
}

export function saveDraft(answers: PartialAnswers) {
    try {
        const encoded = encodeAnswers(answers);
        if (encoded) window.localStorage.setItem(STORAGE_KEY, encoded);
        else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        /* storage blocked: the draft is simply not kept */
    }
    notify();
}

export function clearDraft() {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        /* nothing to do */
    }
    notify();
}

/* Client components only. */
export function useDraft(): PartialAnswers {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}