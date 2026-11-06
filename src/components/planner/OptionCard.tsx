import { Check, type LucideIcon } from "lucide-react";

/* One selectable answer on a questionnaire step. A real radio or checkbox
   sits inside (visually hidden), so keyboard use, arrow keys between radios
   and screen readers all work natively. The card is only the look.

   `compact` is the small chip style used for the month grid. */
export default function OptionCard({
    type,
    name,
    value,
    checked,
    onChange,
    title,
    text,
    icon: Icon,
    image,
    compact = false,
}: {
    type: "radio" | "checkbox";
    name: string;
    value: string;
    checked: boolean;
    onChange: () => void;
    title: string;
    text?: string;
    icon?: LucideIcon;
    image?: { src: string; alt: string };
    compact?: boolean;
}) {
    const focus =
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-secondary";

    if (compact) {
        return (
            <label
                className={
                    "flex cursor-pointer items-center justify-center rounded-xl px-3 py-3 text-center font-sans text-label-lg transition-all " +
                    focus +
                    " " +
                    (checked
                        ? "bg-primary text-on-primary shadow-md"
                        : "bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container")
                }
            >
                <input
                    type={type}
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    className="sr-only"
                />
                {title}
            </label>
        );
    }

    return (
        <label
            className={
                "relative flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all " +
                focus +
                " " +
                (checked
                    ? "border-primary bg-surface-container-lowest shadow-md"
                    : "border-transparent bg-surface-container-lowest shadow-sm hover:border-outline-variant")
            }
        >
            <input
                type={type}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />

            {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="size-20 shrink-0 rounded-lg object-cover"
                />
            ) : Icon ? (
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                </span>
            ) : null}

            <span className="flex min-w-0 flex-1 flex-col gap-1 pr-8">
                <span className="font-display text-headline-sm leading-tight text-primary">
                    {title}
                </span>
                {text ? (
                    <span className="font-sans text-body-md text-on-surface-variant">
                        {text}
                    </span>
                ) : null}
            </span>

            {/* Selection mark */}
            <span
                aria-hidden="true"
                className={
                    "absolute right-4 top-4 flex size-6 items-center justify-center rounded-full transition-colors " +
                    (checked
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-transparent")
                }
            >
                <Check className="size-3.5" />
            </span>
        </label>
    );
}