import { useTranslations } from "next-intl";

type Principle = {
    mark: string;
    title: string;
    description: string;
};

export default function WhyTrustUs() {
    const t = useTranslations("whyTrustUs");
    const principles = t.raw("pillars") as Principle[];

    return (
        <section
            aria-labelledby="principles-heading"
            className="w-full border-b border-surface-container-highest bg-surface-container-low px-margin py-16 md:px-margin-md lg:px-margin-lg"
        >
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <span className="mb-2 block font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                            {t("eyebrow")}
                        </span>
                        <h2
                            id="principles-heading"
                            className="font-display text-headline-xl-mobile tracking-tight text-primary md:text-headline-xl"
                        >
                            {t("heading")}
                        </h2>
                    </div>
                    <p className="max-w-md font-sans text-body-md text-on-surface-variant">
                        {t("intro")}
                    </p>
                </div>

                {/* Four principles */}
                <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {principles.map((item) => (
                        <li
                            key={item.mark}
                            className="flex flex-col border-t-2 border-secondary pt-6"
                        >
                            <span className="mb-2 font-sans text-caption font-semibold uppercase tracking-wider text-secondary">
                                {item.mark}
                            </span>
                            <h3 className="mb-2 font-display text-headline-sm text-primary">
                                {item.title}
                            </h3>
                            <p className="font-sans text-body-md leading-relaxed text-on-surface-variant">
                                {item.description}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}