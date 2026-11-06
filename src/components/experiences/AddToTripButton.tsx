"use client";

import { Check, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { useSavedTrip } from "@/lib/saved-trip";
import { cn } from "@/lib/utils";

/* Saves or removes one experience from the browser-only trip list.
   `aria-pressed` tells screen readers it is a toggle.

   Default: full-width button for the detail page planning card.
   `compact`: small inline button for cards. */
export default function AddToTripButton({
    slug,
    className,
    compact = false,
}: {
    slug: string;
    className?: string;
    compact?: boolean;
}) {
    const t = useTranslations("experienceDetail");
    const { isSaved, toggle } = useSavedTrip();
    const saved = isSaved(slug);

    /* Large: green when not yet saved, tonal once saved.
       Compact: tonal when not yet saved, green once saved, so a saved
       card stands out in a grid. */
    const filled = compact ? saved : !saved;

    const label = compact
        ? saved
            ? t("savedShort")
            : t("addShort")
        : saved
            ? t("savedToTrip")
            : t("addToTrip");

    const iconSize = compact ? "size-3.5" : "size-[18px]";

    return (
        <Button
            variant={filled ? "primary" : "soft"}
            size={compact ? "sm" : "lg"}
            aria-pressed={saved}
            onClick={() => toggle(slug)}
            className={cn(compact ? "" : "w-full", className)}
        >
            {saved ? (
                <Check className={iconSize} aria-hidden="true" />
            ) : (
                <Plus className={iconSize} aria-hidden="true" />
            )}
            {label}
        </Button>
    );
}