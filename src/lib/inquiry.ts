/* The "Ask an Insider" form: what a question looks like, how it is
   validated, and how it is turned into an email for the owner.

   Pure logic with no dependencies, so the same rules run in the browser
   (instant feedback) and on the server (the real check). The server never
   trusts the browser: it always validates again. */

export const INQUIRY_TOPICS = [
    "roads-weather",
    "estates-factories",
    "places-heritage",
    "pacing",
    "nature-quiet",
    "itinerary-help",
    "broken-link",
    "other",
] as const;
export type InquiryTopic = (typeof INQUIRY_TOPICS)[number];

/* Things the traveler wants the answer to take into account. Optional. */
export const INQUIRY_NEEDS = [
    "infant-toddler",
    "motion-sensitivity",
    "slower-walking",
] as const;
export type InquiryNeed = (typeof INQUIRY_NEEDS)[number];

export const LIMITS = {
    messageMin: 10,
    messageMax: 2000,
    datesMax: 100,
    emailMax: 254,
} as const;

export type Inquiry = {
    topic: InquiryTopic;
    message: string;
    travelDates: string; // free text, may be empty
    email: string; // may be empty if a WhatsApp number is given
    whatsapp: string; // digits with optional leading +, may be empty
    needs: InquiryNeed[];
};

/* "contact" is the combined rule: at least an email or a WhatsApp number. */
export type InquiryField =
    | "topic"
    | "message"
    | "travelDates"
    | "email"
    | "whatsapp"
    | "contact";
export type InquiryError = "required" | "invalid" | "too-short" | "too-long";
export type InquiryErrors = Partial<Record<InquiryField, InquiryError>>;

export type ValidationResult =
    | { ok: true; data: Inquiry }
    | { ok: false; errors: InquiryErrors };

/* Control characters (except tab and line breaks) have no place in text. */
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const text = (value: unknown) =>
    typeof value === "string" ? value.replace(CONTROL, "").trim() : "";

/* Single-line fields: also collapse any run of whitespace into one space. */
const line = (value: unknown) => text(value).replace(/\s+/g, " ");

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInquiry(input: unknown): ValidationResult {
    const raw =
        input && typeof input === "object"
            ? (input as Record<string, unknown>)
            : {};
    const errors: InquiryErrors = {};

    const topicValue = line(raw.topic);
    const topic = INQUIRY_TOPICS.find((id) => id === topicValue);
    if (!topic) errors.topic = topicValue ? "invalid" : "required";

    const message = text(raw.message);
    if (!message) errors.message = "required";
    else if (message.length < LIMITS.messageMin) errors.message = "too-short";
    else if (message.length > LIMITS.messageMax) errors.message = "too-long";

    const travelDates = line(raw.travelDates);
    if (travelDates.length > LIMITS.datesMax) errors.travelDates = "too-long";

    const email = line(raw.email).toLowerCase();
    if (email && (email.length > LIMITS.emailMax || !EMAIL.test(email))) {
        errors.email = "invalid";
    }

    /* WhatsApp: allow spaces, dashes, dots and brackets while typing. */
    const whatsappRaw = line(raw.whatsapp);
    const whatsapp = whatsappRaw.replace(/[\s\-.()]/g, "");
    if (whatsapp && !/^\+?\d{7,15}$/.test(whatsapp)) {
        errors.whatsapp = "invalid";
    }

    if (!email && !whatsapp) errors.contact = "required";

    const needs = Array.isArray(raw.needs)
        ? INQUIRY_NEEDS.filter((id) => (raw.needs as unknown[]).includes(id))
        : [];

    if (Object.keys(errors).length > 0 || !topic) return { ok: false, errors };

    return {
        ok: true,
        data: { topic, message, travelDates, email, whatsapp, needs },
    };
}

/* ---------- The email the owner receives ---------- */

const TOPIC_LABELS: Record<InquiryTopic, string> = {
    "roads-weather": "Roads and weather",
    "estates-factories": "Estates and factories",
    "places-heritage": "Heritage and places",
    pacing: "Pacing for families or older travelers",
    "nature-quiet": "Quiet places and nature",
    "itinerary-help": "Help with my itinerary",
    "broken-link": "Broken link report",
    other: "Something else",
};

const NEED_LABELS: Record<InquiryNeed, string> = {
    "infant-toddler": "Travelling with an infant or toddler",
    "motion-sensitivity": "Motion sensitivity",
    "slower-walking": "Reduced walking speed",
};

/* The subject is built only from fixed labels, never from what the visitor
   typed, so nothing a visitor writes can reach an email header. */
export function formatInquiryEmail(data: Inquiry): {
    subject: string;
    text: string;
    replyTo: string | undefined;
} {
    const lines = [
        `Topic: ${TOPIC_LABELS[data.topic]}`,
        `Email: ${data.email || "(not given)"}`,
        `WhatsApp: ${data.whatsapp || "(not given)"}`,
        `Travel dates: ${data.travelDates || "(not given)"}`,
        `Plan around: ${data.needs.length > 0
            ? data.needs.map((need) => NEED_LABELS[need]).join(", ")
            : "(nothing specified)"
        }`,
        "",
        "Message:",
        data.message,
    ];

    return {
        subject: `[Nuwara Insider] ${TOPIC_LABELS[data.topic]}`,
        text: lines.join("\n"),
        replyTo: data.email || undefined,
    };
}