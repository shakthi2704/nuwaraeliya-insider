"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, LoaderCircle, Send, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import {
    INQUIRY_NEEDS,
    INQUIRY_TOPICS,
    LIMITS,
    validateInquiry,
    type InquiryError,
    type InquiryErrors,
    type InquiryField,
    type InquiryNeed,
    type InquiryTopic,
} from "@/lib/inquiry";
import { cn } from "@/lib/utils";

/* Where the finished question is sent. The route handler is added in a
   later step; until then a valid form shows the "did not send" message. */
const ENDPOINT = "/api/inquiry";

type Values = {
    topic: InquiryTopic | "";
    message: string;
    travelDates: string;
    email: string;
    whatsapp: string;
    needs: InquiryNeed[];
};

type Status = "idle" | "sending" | "sent" | "failed";

/* Message keys use camelCase; the validator's codes use dashes. */
const ERROR_KEY: Record<
    InquiryError,
    "required" | "invalid" | "tooShort" | "tooLong"
> = {
    required: "required",
    invalid: "invalid",
    "too-short": "tooShort",
    "too-long": "tooLong",
};

const FIELD =
    "w-full rounded-lg bg-surface-container-low px-4 py-3 font-sans text-body-md text-on-surface placeholder:text-outline transition-colors focus:bg-surface-container-lowest focus:outline-2 focus:outline-secondary";
const FIELD_INVALID = "outline-1 outline-error focus:outline-error";

const emptyValues = (topic: InquiryTopic | ""): Values => ({
    topic,
    message: "",
    travelDates: "",
    email: "",
    whatsapp: "",
    needs: [],
});

/* One labelled field: label, the control, then an error (or hint) line.
   The control points at the line with aria-describedby="<name>-msg". */
function Field({
    name,
    label,
    optional,
    message,
    isError,
    meta,
    children,
}: {
    name: string;
    label: string;
    optional?: string;
    message?: string | null;
    isError?: boolean;
    meta?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={name}
                className="font-sans text-label-lg text-primary"
            >
                {label}
                {optional ? (
                    <span className="ml-2 font-normal text-on-surface-variant">
                        {optional}
                    </span>
                ) : null}
            </label>
            {children}
            {message || meta ? (
                <div className="flex items-start justify-between gap-4">
                    <p
                        id={`${name}-msg`}
                        className={cn(
                            "font-sans text-caption",
                            isError ? "text-error" : "text-on-surface-variant"
                        )}
                    >
                        {message}
                    </p>
                    {meta ? (
                        <span className="shrink-0 font-sans text-caption text-outline">
                            {meta}
                        </span>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

export default function AskInsiderForm({
    initialTopic,
}: {
    initialTopic?: InquiryTopic;
}) {
    const t = useTranslations("askInsiderForm");
    const uid = useId();
    const id = (name: string) => `${uid}-${name}`;

    const [values, setValues] = useState<Values>(emptyValues(initialTopic ?? ""));
    const [attempted, setAttempted] = useState(false);
    const [status, setStatus] = useState<Status>("idle");
    const successRef = useRef<HTMLHeadingElement>(null);

    /* Errors are worked out from the values on every render, and only shown
       after the first send attempt, so they clear as soon as a field is fixed. */
    const result = validateInquiry(values);
    const errors: InquiryErrors = attempted && !result.ok ? result.errors : {};

    useEffect(() => {
        if (status === "sent") successRef.current?.focus();
    }, [status]);

    function set<K extends keyof Values>(key: K, value: Values[K]) {
        setValues((current) => ({ ...current, [key]: value }));
    }

    function toggleNeed(need: InquiryNeed) {
        setValues((current) => ({
            ...current,
            needs: current.needs.includes(need)
                ? current.needs.filter((item) => item !== need)
                : [...current.needs, need],
        }));
    }

    function errorText(field: InquiryField): string | null {
        const code = errors[field];
        if (!code) return null;
        if (field === "contact") return t("errors.contact");
        const max =
            field === "message"
                ? LIMITS.messageMax
                : field === "travelDates"
                    ? LIMITS.datesMax
                    : LIMITS.emailMax;
        return t(`errors.${ERROR_KEY[code]}`, { min: LIMITS.messageMin, max });
    }

    function focusFirstError(found: InquiryErrors) {
        const target = found.topic
            ? id(`topic-${INQUIRY_TOPICS[0]}`)
            : found.message
                ? id("message")
                : found.travelDates
                    ? id("dates")
                    : found.email || found.contact
                        ? id("email")
                        : found.whatsapp
                            ? id("whatsapp")
                            : null;
        if (target) document.getElementById(target)?.focus();
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (status === "sending") return;

        setAttempted(true);
        if (!result.ok) {
            focusFirstError(result.errors);
            return;
        }

        setStatus("sending");
        try {
            const response = await fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.data),
            });
            setStatus(response.ok ? "sent" : "failed");
        } catch {
            setStatus("failed");
        }
    }

    function reset() {
        setValues(emptyValues(initialTopic ?? ""));
        setAttempted(false);
        setStatus("idle");
    }

    if (status === "sent") {
        return (
            <div className="flex flex-col items-start gap-5 py-4">
                <span className="flex size-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                    <Check className="size-6" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-2" role="status">
                    <h2
                        ref={successRef}
                        tabIndex={-1}
                        className="font-display text-headline-md text-primary focus:outline-none"
                    >
                        {t("success.heading")}
                    </h2>
                    <p className="max-w-lg font-sans text-body-md text-on-surface-variant">
                        {t("success.text")}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={reset}>
                        {t("success.again")}
                    </Button>
                    <ButtonLink href="/guides" variant="soft">
                        {t("success.guides")}
                    </ButtonLink>
                </div>
            </div>
        );
    }

    const sending = status === "sending";
    const contactError = errorText("contact");

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h2 className="font-display text-headline-md text-primary">
                    {t("heading")}
                </h2>
                <p className="font-sans text-body-md text-on-surface-variant">
                    {t("intro")}
                </p>
            </div>

            {/* Topic */}
            <fieldset
                className="flex flex-col gap-3"
                aria-describedby={id("topic-msg")}
            >
                <legend className="mb-3 font-sans text-label-lg text-primary">
                    {t("topic.legend")}
                </legend>
                <div className="flex flex-wrap gap-2">
                    {INQUIRY_TOPICS.map((topic) => (
                        <label key={topic} className="relative">
                            <input
                                type="radio"
                                name={id("topic")}
                                id={id(`topic-${topic}`)}
                                value={topic}
                                checked={values.topic === topic}
                                onChange={() => set("topic", topic)}
                                className="peer sr-only"
                            />
                            <span className="inline-block cursor-pointer rounded-full bg-surface-container px-4 py-2 font-sans text-label-md text-on-surface transition-colors hover:bg-surface-variant peer-checked:bg-primary-container peer-checked:text-on-primary peer-checked:hover:bg-primary-container peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-secondary">
                                {t(`topics.${topic}`)}
                            </span>
                        </label>
                    ))}
                </div>
                {errorText("topic") ? (
                    <p
                        id={id("topic-msg")}
                        className="font-sans text-caption text-error"
                    >
                        {errorText("topic")}
                    </p>
                ) : null}
            </fieldset>

            {/* Question */}
            <Field
                name={id("message")}
                label={t("message.label")}
                message={errorText("message")}
                isError
                meta={t("message.counter", {
                    count: values.message.length,
                    max: LIMITS.messageMax,
                })}
            >
                <textarea
                    id={id("message")}
                    rows={5}
                    value={values.message}
                    onChange={(event) => set("message", event.target.value)}
                    placeholder={t("message.placeholder")}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={id("message-msg")}
                    className={cn(
                        FIELD,
                        "resize-y",
                        errors.message && FIELD_INVALID
                    )}
                />
            </Field>

            {/* Dates */}
            <Field
                name={id("dates")}
                label={t("dates.label")}
                optional={t("optional")}
                message={errorText("travelDates")}
                isError
            >
                <input
                    id={id("dates")}
                    type="text"
                    value={values.travelDates}
                    onChange={(event) => set("travelDates", event.target.value)}
                    placeholder={t("dates.placeholder")}
                    aria-invalid={Boolean(errors.travelDates)}
                    aria-describedby={id("dates-msg")}
                    className={cn(FIELD, errors.travelDates && FIELD_INVALID)}
                />
            </Field>

            {/* How to reply: at least one of email or WhatsApp */}
            <fieldset className="flex flex-col gap-4">
                <legend className="font-sans text-label-lg text-primary">
                    {t("contact.legend")}
                </legend>
                <p
                    className={cn(
                        "-mt-2 font-sans text-caption",
                        contactError ? "text-error" : "text-on-surface-variant"
                    )}
                >
                    {contactError ?? t("contact.hint")}
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field
                        name={id("email")}
                        label={t("email.label")}
                        message={errorText("email")}
                        isError
                    >
                        <input
                            id={id("email")}
                            type="email"
                            autoComplete="email"
                            value={values.email}
                            onChange={(event) => set("email", event.target.value)}
                            placeholder={t("email.placeholder")}
                            aria-invalid={Boolean(errors.email || errors.contact)}
                            aria-describedby={id("email-msg")}
                            className={cn(
                                FIELD,
                                (errors.email || errors.contact) && FIELD_INVALID
                            )}
                        />
                    </Field>
                    <Field
                        name={id("whatsapp")}
                        label={t("whatsapp.label")}
                        message={errorText("whatsapp") ?? t("whatsapp.hint")}
                        isError={Boolean(errors.whatsapp)}
                    >
                        <input
                            id={id("whatsapp")}
                            type="tel"
                            autoComplete="tel"
                            value={values.whatsapp}
                            onChange={(event) => set("whatsapp", event.target.value)}
                            placeholder={t("whatsapp.placeholder")}
                            aria-invalid={Boolean(errors.whatsapp || errors.contact)}
                            aria-describedby={id("whatsapp-msg")}
                            className={cn(
                                FIELD,
                                (errors.whatsapp || errors.contact) && FIELD_INVALID
                            )}
                        />
                    </Field>
                </div>
            </fieldset>

            {/* Things to plan around */}
            <fieldset className="flex flex-col gap-4 rounded-lg bg-surface-container p-5">
                <legend className="font-sans text-label-md font-semibold uppercase tracking-wider text-secondary">
                    {t("needs.legend")}
                </legend>
                <p className="-mt-2 font-sans text-caption text-on-surface-variant">
                    {t("needs.hint")}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {INQUIRY_NEEDS.map((need) => (
                        <label
                            key={need}
                            className="flex cursor-pointer items-start gap-2.5 font-sans text-body-md text-on-surface"
                        >
                            <input
                                type="checkbox"
                                checked={values.needs.includes(need)}
                                onChange={() => toggleNeed(need)}
                                className="mt-1 size-4 shrink-0 accent-primary"
                            />
                            <span>{t(`needs.${need}`)}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            {/* Send */}
            <div className="flex flex-col gap-4">
                {status === "failed" ? (
                    <div
                        role="alert"
                        className="flex items-start gap-3 rounded-lg bg-error-container p-4 text-on-error-container"
                    >
                        <TriangleAlert
                            className="mt-0.5 size-5 shrink-0"
                            aria-hidden="true"
                        />
                        <div className="flex flex-col gap-1">
                            <p className="font-sans text-label-lg font-semibold">
                                {t("failed.heading")}
                            </p>
                            <p className="font-sans text-body-md">
                                {t("failed.text")}
                            </p>
                        </div>
                    </div>
                ) : null}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button type="submit" size="lg" disabled={sending}>
                        {sending ? (
                            <>
                                {t("sending")}
                                <LoaderCircle
                                    className="size-[18px] animate-spin"
                                    aria-hidden="true"
                                />
                            </>
                        ) : (
                            <>
                                {t("submit")}
                                <Send className="size-[18px]" aria-hidden="true" />
                            </>
                        )}
                    </Button>
                    <p className="max-w-xs font-sans text-caption text-on-surface-variant">
                        {t.rich("privacyNote", {
                            link: (chunks) => (
                                <Link
                                    href="/privacy"
                                    className="text-secondary underline underline-offset-2 hover:text-primary"
                                >
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </p>
                </div>
            </div>
        </form>
    );
}