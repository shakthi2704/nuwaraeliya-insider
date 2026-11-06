import { ArrowRight, Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

/* One layout for the legal pages (Privacy, Terms). All wording lives in
   messages under the namespace the page passes in, shaped like this:

     crumbSection, title, updated, intro,
     summaryHeading, summary: string[],
     contentsLabel,
     sections: [{ id, title, blocks }]   a block is a string (a paragraph)
                                         or a string[] (a bulleted list),
     contact: { heading, text, cta },
     other: link label for the sibling page                              */

type Block = string | string[];
type Section = { id: string; title: string; blocks: Block[] };

export default async function LegalDocument({
    namespace,
    otherHref,
}: {
    namespace: string;
    otherHref: "/privacy" | "/terms";
}) {
    const t = await getTranslations(namespace);
    const sections = t.raw("sections") as Section[];
    const summary = t.raw("summary") as string[];

    return (
        <>
            {/* Header */}
            <section className="relative w-full overflow-hidden bg-surface px-margin pb-10 pt-12 md:px-margin-md lg:px-margin-lg">
                <div
                    className="pointer-events-none absolute -top-40 right-1/4 size-96 rounded-full bg-secondary/10 blur-3xl"
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
                        <span className="text-on-surface-variant">{t("title")}</span>
                    </p>
                    <div className="flex max-w-3xl flex-col gap-4">
                        <h1 className="font-display text-display-lg-mobile tracking-tight text-primary md:text-display-lg">
                            {t("title")}
                        </h1>
                        <p className="font-sans text-caption uppercase tracking-wider text-on-surface-variant">
                            {t("updated")}
                        </p>
                        <p className="font-sans text-body-lg text-on-surface-variant">
                            {t("intro")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contents and body */}
            <section className="w-full bg-surface px-margin pb-20 md:px-margin-md lg:px-margin-lg">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-gutter-lg">
                    {/* Contents */}
                    <nav
                        aria-label={t("contentsLabel")}
                        className="lg:col-span-3"
                    >
                        <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-6 lg:sticky lg:top-28">
                            <p className="font-sans text-label-md font-semibold uppercase tracking-widest text-secondary">
                                {t("contentsLabel")}
                            </p>
                            <ol className="flex flex-col gap-2.5">
                                {sections.map((section, index) => (
                                    <li key={section.id}>
                                        <a
                                            href={`#${section.id}`}
                                            className="flex gap-3 font-sans text-body-md text-on-surface-variant transition-colors hover:text-primary"
                                        >
                                            <span className="font-display text-on-surface-variant/60">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            {section.title}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </nav>

                    {/* Body */}
                    <div className="flex max-w-3xl flex-col gap-12 lg:col-span-9">
                        <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-6 sm:p-8">
                            <h2 className="font-display text-headline-sm text-primary">
                                {t("summaryHeading")}
                            </h2>
                            <ul className="flex flex-col gap-3">
                                {summary.map((line) => (
                                    <li key={line} className="flex items-start gap-3">
                                        <Check
                                            className="mt-1 size-4 shrink-0 text-secondary"
                                            aria-hidden="true"
                                        />
                                        <span className="font-sans text-body-md text-on-surface">
                                            {line}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {sections.map((section, index) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className="flex scroll-mt-28 flex-col gap-4"
                            >
                                <h2 className="flex items-baseline gap-4 font-display text-headline-md text-primary">
                                    <span
                                        className="text-outline-variant"
                                        aria-hidden="true"
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    {section.title}
                                </h2>
                                {section.blocks.map((block, i) =>
                                    Array.isArray(block) ? (
                                        <ul
                                            key={i}
                                            className="flex flex-col gap-2.5 pl-1"
                                        >
                                            {block.map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-start gap-3 font-sans text-body-lg text-on-surface-variant"
                                                >
                                                    <span
                                                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-secondary"
                                                        aria-hidden="true"
                                                    />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p
                                            key={i}
                                            className="font-sans text-body-lg text-on-surface-variant"
                                        >
                                            {block}
                                        </p>
                                    )
                                )}
                            </section>
                        ))}

                        {/* Contact */}
                        <div className="flex flex-col gap-4 rounded-2xl bg-primary p-6 text-on-primary sm:p-8">
                            <h2 className="font-display text-headline-sm text-on-primary">
                                {t("contact.heading")}
                            </h2>
                            <p className="font-sans text-body-md text-on-primary-container">
                                {t("contact.text")}
                            </p>
                            <ButtonLink
                                href="/ask-an-insider?topic=other"
                                variant="secondary"
                                className="self-start"
                            >
                                {t("contact.cta")}
                            </ButtonLink>
                        </div>

                        <Link
                            href={otherHref}
                            className="inline-flex items-center gap-1.5 self-start font-sans text-label-lg text-secondary transition-colors hover:text-primary"
                        >
                            {t("other")}
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}