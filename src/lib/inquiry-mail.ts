import nodemailer, { type Transporter } from "nodemailer";
import { formatInquiryEmail, type Inquiry } from "@/lib/inquiry";

/* Sending a question to the owner by email over SMTP. Settings come from
   environment variables, so nothing secret lives in the code:

     SMTP_HOST      mail server host (required)
     SMTP_PORT      port, default 587 (use 1025 for Mailpit)
     SMTP_SECURE    "true" for a connection that is encrypted from the start
                    (usually port 465); leave empty for STARTTLS or none
     SMTP_USER      login, optional (Mailpit needs none)
     SMTP_PASS      password, optional
     INQUIRY_FROM   the sender address shown on the email (required)
     INQUIRY_TO     where questions are delivered (required)  */

export type MailConfig = {
    host: string;
    port: number;
    secure: boolean;
    user: string | undefined;
    pass: string | undefined;
    from: string;
    to: string;
};

type Env = Record<string, string | undefined>;

/* Returns null when the required settings are missing, so the caller can
   report "not configured" instead of crashing. */
export function readMailConfig(env: Env = process.env): MailConfig | null {
    const host = env.SMTP_HOST?.trim();
    const from = env.INQUIRY_FROM?.trim();
    const to = env.INQUIRY_TO?.trim();
    if (!host || !from || !to) return null;

    const port = Number(env.SMTP_PORT) || 587;
    return {
        host,
        port,
        secure: env.SMTP_SECURE?.trim().toLowerCase() === "true",
        user: env.SMTP_USER?.trim() || undefined,
        pass: env.SMTP_PASS || undefined,
        from,
        to,
    };
}

export function createMailTransport(config: MailConfig): Transporter {
    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth:
            config.user && config.pass
                ? { user: config.user, pass: config.pass }
                : undefined,
        /* Never let a slow mail server hold a visitor's request open. */
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
    });
}

/* Sends one question. Throws if the mail server refuses or cannot be
   reached; the caller decides what the visitor sees. A transport can be
   passed in for testing. */
export async function sendInquiry(
    data: Inquiry,
    config: MailConfig,
    transport: Transporter = createMailTransport(config)
): Promise<void> {
    const { subject, text, replyTo } = formatInquiryEmail(data);

    await transport.sendMail({
        from: config.from,
        to: config.to,
        replyTo,
        subject,
        text,
    });
}