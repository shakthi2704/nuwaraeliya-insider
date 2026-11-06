"use client";

import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Baby,
    Bus,
    CalendarDays,
    CalendarPlus,
    CalendarRange,
    Car,
    CloudSun,
    Coffee,
    Compass,
    Footprints,
    Heart,
    Leaf,
    Pencil,
    Route,
    ShieldCheck,
    Sun,
    User,
    Users,
    Zap,
    type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import OptionCard from "@/components/planner/OptionCard";
import { Button } from "@/components/ui/Button";
import { Link, useRouter } from "@/i18n/navigation";
import {
    CATEGORY_IDS,
    EXPERIENCES,
    type CategoryId,
} from "@/lib/data/experiences";
import { encodeAnswers, type PartialAnswers } from "@/lib/planner/answers";
import { clearDraft, saveDraft, useDraft } from "@/lib/planner/draft";
import {
    MONTH_UNSURE,
    STEP_IDS,
    STEP_IS_MULTI,
    STEP_OPTIONS,
    firstOpenStep,
    isStepDone,
    selectedValues,
    toggleOption,
    type StepId,
} from "@/lib/planner/steps";
import { useSavedTrip } from "@/lib/saved-trip";

/* Icons for the options that have no photo. Interests use a photo from a
   matching experience instead. */
const ICONS: Record<string, LucideIcon> = {
    "days:1": Sun,
    "days:2": CalendarDays,
    "days:3": CalendarRange,
    "days:4": CalendarPlus,
    "party:solo": User,
    "party:couple": Heart,
    "party:family": Baby,
    "party:friends": Users,
    [`month:${MONTH_UNSURE}`]: CloudSun,
    "pace:relaxed": Coffee,
    "pace:balanced": Footprints,
    "pace:active": Zap,
    "transit:private-driver": Car,
    "transit:train-local": Bus,
    "transit:self-drive": Route,
};

/* Steps that show a planning note under the options. */
const TIP_STEPS: readonly StepId[] = ["month", "interests", "pace", "transit"];

const LAST = STEP_IDS.length - 1;

export default function PlannerWizard({
    initial,
}: {
    /* Answers already known from the URL: a trip-idea deep link, or an
       "Edit preferences" link from a result page. */
    initial: PartialAnswers;
}) {
    const t = useTranslations("planner");
    const tCategory = useTranslations("categories");
    const router = useRouter();
    const draft = useDraft();
    const { slugs: savedSlugs } = useSavedTrip();

    /* Where the answers come from, in order: what the traveler changed in
       this visit, the URL, then the saved draft. No effects needed. */
    const hasInitial = Object.keys(initial).length > 0;
    const [edited, setEdited] = useState<PartialAnswers | null>(null);
    const answers = edited ?? (hasInitial ? initial : draft);

    /* The step shown. Until the traveler acts it is the first unanswered
       step, or the first step when everything is answered (editing). */
    const [pickedIndex, setPickedIndex] = useState<number | null>(null);
    const openStep = firstOpenStep(answers);
    const index = pickedIndex ?? (openStep ? STEP_IDS.indexOf(openStep) : 0);
    const step = STEP_IDS[index];
    const reachable = openStep ? STEP_IDS.indexOf(openStep) : LAST;
    const done = isStepDone(answers, step);

    /* On a step change, return to the top and focus the heading so screen
       readers announce the new question. Skipped on first render. */
    const headingRef = useRef<HTMLHeadingElement>(null);
    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        window.scrollTo({ top: 0 });
        headingRef.current?.focus();
    }, [index]);

    function select(value: string) {
        const next = toggleOption(answers, step, value);
        setEdited(next);
        setPickedIndex(index); // stop following "first open step"
        saveDraft(next);
    }

    function finish() {
        /* Saved experiences travel with the plan, so a shared link
           includes them. */
        const pinned = [...new Set([...(answers.pinned ?? []), ...savedSlugs])];
        const query = encodeAnswers({ ...answers, pinned });
        saveDraft(answers);
        router.push(`/plan-my-trip/itinerary?${query}`);
    }

    function next() {
        if (!done) return;
        if (index < LAST) setPickedIndex(index + 1);
        else finish();
    }

    function startOver() {
        clearDraft();
        setEdited({});
        setPickedIndex(0);
    }

    const stepLabel = (id: StepId) => t(`steps.${id}.label`);

    /* Options for the current step. */
    const options = STEP_OPTIONS[step].map((value) => {
        const key = `options.${step}.${value}`;
        const isInterest = step === "interests";
        const count = isInterest
            ? EXPERIENCES.filter((e) => e.categories.includes(value as CategoryId)).length
            : 0;
        const experience = isInterest
            ? (EXPERIENCES.find((e) => e.categories[0] === value) ??
                EXPERIENCES.find((e) => e.categories.includes(value as CategoryId)))
            : undefined;

        return {
            value,
            title: isInterest ? tCategory(value) : t(`${key}.title`),
            text: isInterest
                ? t("experiencesCount", { count })
                : t.has(`${key}.text`)
                    ? t(`${key}.text`)
                    : undefined,
            icon: isInterest ? Leaf : ICONS[`${step}:${value}`],
            image: experience
                ? { src: experience.image, alt: experience.alt }
                : undefined,
        };
    });

    const selected = selectedValues(answers, step);
    const multi = STEP_IS_MULTI[step];
    const inputType = multi ? "checkbox" : "radio";

    const renderCard = (o: (typeof options)[number], compact = false) => (
        <OptionCard
            key={o.value}
            type={inputType}
            name={`planner-${step}`}
            value={o.value}
            checked={selected.includes(o.value)}
            onChange={() => select(o.value)}
            title={o.title}
            text={o.text}
            icon={o.icon}
            image={o.image}
            compact={compact}
        />
    );

    /* The "selections so far" chips: every answered step except this one. */
    const chips = STEP_IDS.map((id, i) => {
        if (i === index || !isStepDone(answers, id)) return null;
        const values = selectedValues(answers, id);
        const value =
            id === "interests"
                ? t("chips.interests", { count: values.length })
                : t(`options.${id}.${values[0]}.title`);
        return { id, i, text: t("chips.format", { step: stepLabel(id), value }) };
    }).filter((chip): chip is NonNullable<typeof chip> => chip !== null);

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-margin py-8 md:py-12">
            {/* Top: back and progress */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    {index === 0 ? (
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 font-sans text-label-lg text-on-surface-variant transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="size-[18px]" aria-hidden="true" />
                            {t("nav.exit")}
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setPickedIndex(index - 1)}
                            className="inline-flex items-center gap-2 font-sans text-label-lg text-on-surface-variant transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="size-[18px]" aria-hidden="true" />
                            {t("nav.backTo", { step: stepLabel(STEP_IDS[index - 1]) })}
                        </button>
                    )}

                    <p className="flex items-center gap-3 font-sans text-caption uppercase tracking-wider text-on-surface-variant">
                        <span className="hidden sm:inline">{t("progress.label")}</span>
                        <span className="rounded-full bg-secondary-container px-3 py-1 font-semibold text-on-secondary-container">
                            {t("progress.stepOf", {
                                current: index + 1,
                                total: STEP_IDS.length,
                            })}
                        </span>
                    </p>
                </div>

                <div
                    role="progressbar"
                    aria-label={t("progress.label")}
                    aria-valuemin={1}
                    aria-valuemax={STEP_IDS.length}
                    aria-valuenow={index + 1}
                >
                    <div className="flex gap-1.5">
                        {STEP_IDS.map((id, i) => (
                            <span
                                key={id}
                                className={
                                    "h-1 flex-1 rounded-full transition-colors " +
                                    (i <= index ? "bg-primary" : "bg-surface-container-high")
                                }
                            />
                        ))}
                    </div>
                    <ol className="mt-2 hidden justify-between sm:flex">
                        {STEP_IDS.map((id, i) => {
                            const canJump = i <= reachable;
                            return (
                                <li key={id} className="flex-1 text-center">
                                    <button
                                        type="button"
                                        disabled={!canJump}
                                        onClick={() => setPickedIndex(i)}
                                        aria-current={i === index ? "step" : undefined}
                                        className={
                                            "font-sans text-caption font-semibold uppercase tracking-wider transition-colors " +
                                            (i === index
                                                ? "text-primary"
                                                : canJump
                                                    ? "text-on-surface-variant hover:text-primary"
                                                    : "cursor-default text-outline-variant")
                                        }
                                    >
                                        {i + 1}. {stepLabel(id)}
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>

            {/* Selections so far */}
            {chips.length > 0 ? (
                <section
                    aria-label={t("selections.label")}
                    className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-container-low p-3"
                >
                    <span className="mr-1 font-sans text-caption text-on-surface-variant">
                        {t("selections.label")}
                    </span>
                    {chips.map((chip) => (
                        <button
                            key={chip.id}
                            type="button"
                            onClick={() => setPickedIndex(chip.i)}
                            aria-label={t("selections.edit", { step: stepLabel(chip.id) })}
                            className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-lowest px-3 py-1 font-sans text-caption font-semibold text-primary shadow-sm transition-colors hover:bg-surface-container"
                        >
                            {chip.text}
                            <Pencil className="size-3 text-secondary" aria-hidden="true" />
                        </button>
                    ))}
                </section>
            ) : null}

            {/* The question */}
            <header className="flex flex-col items-center gap-3 text-center">
                <span className="flex items-center gap-3 font-sans text-caption font-semibold uppercase tracking-widest text-secondary">
                    <span className="h-px w-6 bg-secondary" aria-hidden="true" />
                    {t(`steps.${step}.eyebrow`)}
                    <span className="h-px w-6 bg-secondary" aria-hidden="true" />
                </span>
                <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="font-display text-headline-xl-mobile tracking-tight text-primary outline-none md:text-headline-xl"
                >
                    {t(`steps.${step}.title`)}
                </h1>
                <p className="max-w-xl font-sans text-body-lg text-on-surface-variant">
                    {t(`steps.${step}.text`)}
                </p>
                {step === "interests" ? (
                    <p
                        aria-live="polite"
                        className="rounded-full bg-secondary-container/60 px-3 py-1 font-sans text-caption font-semibold text-on-secondary-container"
                    >
                        {t("interestsSelected", {
                            count: selected.length,
                            total: CATEGORY_IDS.length,
                        })}
                    </p>
                ) : null}
            </header>

            {/* The options */}
            <fieldset className="flex flex-col gap-4">
                <legend className="sr-only">{t(`steps.${step}.title`)}</legend>

                {step === "month" ? (
                    <>
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                            {options
                                .filter((o) => o.value !== MONTH_UNSURE)
                                .map((o) => renderCard(o, true))}
                        </div>
                        {options
                            .filter((o) => o.value === MONTH_UNSURE)
                            .map((o) => renderCard(o))}
                    </>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {options.map((o) => renderCard(o))}
                    </div>
                )}
            </fieldset>

            {/* Planning note */}
            {TIP_STEPS.includes(step) ? (
                <aside className="flex items-start gap-4 rounded-2xl bg-surface-container p-5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                        <Compass className="size-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-1">
                        <h2 className="font-sans text-label-lg text-primary">
                            {t("tipTitle")}
                        </h2>
                        <p className="font-sans text-body-md text-on-surface-variant">
                            {t(`tips.${step}`)}
                        </p>
                    </div>
                </aside>
            ) : null}

            {/* Saved experiences are part of the plan */}
            {index === LAST && savedSlugs.length > 0 ? (
                <p className="text-center font-sans text-body-md text-on-surface-variant">
                    {t("savedNote", { count: savedSlugs.length })}
                </p>
            ) : null}

            {/* Back / Continue */}
            <div className="sticky bottom-4 z-10 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface-container-lowest/95 p-4 shadow-float backdrop-blur">
                    {index === 0 ? (
                        <span aria-hidden="true" className="w-24" />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setPickedIndex(index - 1)}
                            className="inline-flex items-center gap-2 font-sans text-label-lg text-on-surface-variant transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="size-[18px]" aria-hidden="true" />
                            {t("nav.back")}
                        </button>
                    )}

                    <span className="hidden font-sans text-caption text-on-surface-variant md:inline">
                        {index < LAST
                            ? t("nav.nextUp", {
                                number: index + 2,
                                step: stepLabel(STEP_IDS[index + 1]),
                            })
                            : t("nav.lastStep")}
                    </span>

                    <Button size="lg" disabled={!done} onClick={next}>
                        {index < LAST
                            ? t("nav.continueTo", { step: stepLabel(STEP_IDS[index + 1]) })
                            : t("nav.finish")}
                        <ArrowRight className="size-[18px]" aria-hidden="true" />
                    </Button>
                </div>

                <p className="flex items-center justify-center gap-2 text-center font-sans text-caption text-on-surface-variant">
                    <ShieldCheck className="size-4 text-secondary" aria-hidden="true" />
                    {t("reassurance")}
                </p>
            </div>

            {Object.keys(answers).length > 0 ? (
                <button
                    type="button"
                    onClick={startOver}
                    className="self-center font-sans text-caption text-on-surface-variant underline underline-offset-4 transition-colors hover:text-primary"
                >
                    {t("nav.startOver")}
                </button>
            ) : null}
        </div>
    );
}