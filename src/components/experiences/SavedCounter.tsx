"use client";

import { Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { useSavedTrip } from "@/lib/saved-trip";

/* "N saved to your trip" plus a link to the planner. Reads the
   browser-only saved list, so the count starts at 0 on the server and
   updates right after hydration. */
export default function SavedCounter() {
    const t = useTranslations("experiencesPage");
    const { count } = useSavedTrip();

    return (
        <div className="flex items-center gap-3">
            <p
                aria-live="polite"
                className="inline-flex items-center gap-1.5 font-sans text-caption text-on-surface-variant"
            >
                <Bookmark className="size-3.5 text-secondary" aria-hidden="true" />
                {t("savedCount", { count })}
            </p>
            <ButtonLink href="/plan-my-trip" variant="outline" size="sm">
                {t("openPlanner")}
            </ButtonLink>
        </div>
    );
}