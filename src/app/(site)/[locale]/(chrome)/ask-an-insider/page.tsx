import type { Metadata } from "next";
import { ArrowRight, Info, Mail, MessageSquareText, UserRound } from "lucide-react";
import { getTranslations } from "next-intl/server";
import AskInsiderForm from "@/components/ask/AskInsiderForm";
import { ButtonLink } from "@/components/ui/Button";
import { INQUIRY_TOPICS } from "@/lib/inquiry";

export const metadata: Metadata = {
    title: "Ask an Insider",
};

const STEPS = [
    { key: "send", icon: MessageSquareText },
    { key: "read", icon: UserRound },
    { key: "reply", icon: Mail },
] as const;

export default async function AskAnInsiderPage({
    searchParams,
}: {
    searchParams: Promise<{ topic?: string | string[] }>;
}) {
    const t = await getTranslations("askInsiderPage");

    /* ?topic=broken-link (from the 404 page) pre-selects a topic. Anything
       that is not a known topic is ignored. */
    const sp = await searchParams;
    const topicParam = Array.isArray(sp.topic) ? sp.topic[0] : sp.topic;
    const initialTopic = INQUIRY_TOPICS.find((id) => id === topicParam);

    return (
        <>
            {/* Header */}
            <section className="relative w-full overflow-hidden bg-surface px-margin pb-10 pt-12 md:px-margin-md lg:px-margin-lg">
                <div
                    className="pointer-events-none absolute -top-40 right-1/4 size-96 rounded-full bg-secondary/10 blur-3xl"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute top-72 -left-20 size-80 rounded-full bg-primary/5 blur-3xl"
                    aria-hidden="true"
                />

                <div className="relative mx-auto flex max-w-7xl flex-col gap-6">
                    <p className="flex items-center gap-2 font-sans text-caption uppercase tracking-widest">
                        <span className="font-semibold text-secondary">
                            {t("crumbSection")}
                        </span>
                        <span className="text-outline-variant" aria-hidden="true">
                            /
                        </span>
                        <span className="text-on-surface-variant">
                            {t("crumbPlace")}
                        </span>
                    </p>

                    <div className="flex max-w-3xl flex-col gap-4">
                        <h1 className="font-display text-display-lg-mobile tracking-tight text-primary md:text-display-lg">
                            {t("headingLead")}{" "}
                            <br className="hidden sm:inline" />
                            <em className="font-light italic text-secondary">
                                {t("headingAccent")}
                            </em>
                        </h1>
                        <p className="max-w-2xl font-sans text-body-lg text-on-surface-variant">
                            {t("subheading")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Form and sidebar */}
            <section className="w-full bg-surface px-margin pb-20 md:px-margin-md lg:px-margin-lg">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-gutter lg:grid-cols-12 lg:gap-gutter-lg">
                    {/* Form column */}
                    <div className="lg:col-span-7">
                        <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-float sm:p-10">
                            <AskInsiderForm initialTopic={initialTopic} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="flex flex-col gap-6 lg:col-span-5">
                        <div className="flex flex-col gap-6 rounded-2xl bg-surface-container-low p-6 sm:p-8">
                            <h2 className="font-display text-headline-sm text-primary">
                                {t("expect.heading")}
                            </h2>
                            <ol className="flex flex-col gap-5">
                                {STEPS.map(({ key, icon: Icon }, index) => (
                                    <li key={key} className="flex items-start gap-4">
                                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest text-primary shadow-sm">
                                            <Icon
                                                className="size-[22px]"
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <h3 className="font-sans text-label-lg font-semibold text-primary">
                                                {index + 1}. {t(`expect.steps.${key}.title`)}
                                            </h3>
                                            <p className="font-sans text-body-md text-on-surface-variant">
                                                {t(`expect.steps.${key}.text`)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="flex items-start gap-4 rounded-2xl bg-surface-container-low p-6">
                            <Info
                                className="mt-0.5 size-5 shrink-0 text-secondary"
                                aria-hidden="true"
                            />
                            <div className="flex flex-col gap-1">
                                <h2 className="font-sans text-label-lg font-semibold text-primary">
                                    {t("scope.heading")}
                                </h2>
                                <p className="font-sans text-body-md text-on-surface-variant">
                                    {t("scope.text")}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 rounded-2xl bg-primary p-6 text-on-primary sm:p-8">
                            <h2 className="font-display text-headline-sm text-on-primary">
                                {t("planner.heading")}
                            </h2>
                            <p className="font-sans text-body-md text-on-primary-container">
                                {t("planner.text")}
                            </p>
                            <ButtonLink
                                href="/plan-my-trip"
                                variant="secondary"
                                className="self-start"
                            >
                                {t("planner.cta")}
                                <ArrowRight className="size-4" aria-hidden="true" />
                            </ButtonLink>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}