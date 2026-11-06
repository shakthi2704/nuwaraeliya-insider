import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
    title: "Privacy",
};

export default function PrivacyPage() {
    return <LegalDocument namespace="privacyPage" otherHref="/terms" />;
}