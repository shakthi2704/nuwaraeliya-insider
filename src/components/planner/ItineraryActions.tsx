"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Headset, Link2, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, ButtonLink } from "@/components/ui/Button";

type CopyState = "idle" | "copied" | "failed";

/* Actions for a finished itinerary: print or save as PDF through the
   browser, copy the shareable link, and ask for local help. The link is just
   the page address, because the whole plan lives in the URL. */
export default function ItineraryActions() {
    const t = useTranslations("result");
    const [copy, setCopy] = useState<CopyState>("idle");
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    async function share() {
        let ok = true;
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch {
            ok = false; // clipboard blocked, e.g. on an insecure page
        }
        setCopy(ok ? "copied" : "failed");
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopy("idle"), 3000);
    }

    return (
        <div className="flex flex-col gap-2 print:hidden">
            <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => window.print()}>
                    <Printer className="size-[18px]" aria-hidden="true" />
                    {t("actions.print")}
                </Button>

                <Button variant="outline" onClick={share}>
                    {copy === "copied" ? (
                        <Check className="size-[18px]" aria-hidden="true" />
                    ) : (
                        <Link2 className="size-[18px]" aria-hidden="true" />
                    )}
                    {copy === "copied" ? t("actions.copied") : t("actions.share")}
                </Button>

                <ButtonLink href="/ask-an-insider">
                    <Headset className="size-[18px]" aria-hidden="true" />
                    {t("actions.ask")}
                </ButtonLink>
            </div>

            <p aria-live="polite" className="min-h-4 font-sans text-caption text-on-surface-variant">
                {copy === "copied"
                    ? t("actions.copiedNote")
                    : copy === "failed"
                        ? t("actions.failedNote")
                        : ""}
            </p>
        </div>
    );
}