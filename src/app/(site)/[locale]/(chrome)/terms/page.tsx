import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
    title: "Terms of use",
};

export default function TermsPage() {
    return <LegalDocument namespace="termsPage" otherHref="/privacy" />;
}