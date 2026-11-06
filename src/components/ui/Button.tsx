"use client";

import { forwardRef } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/* Variants map to the buttons in the Stitch screens:
   primary    forest green     header CTA, "Customize Plan"
   accent     dark terracotta  hero "Plan My Trip" (main conversion action)
   secondary  emerald          "Start Customizing in Trip Planner"
   light      frosted white    hero secondary, sits on photography
   soft       tonal            "Add to Trip", small inline actions
   outline    forest outline   quiet alternative on light surfaces
   ghost      text only        nav-style actions                      */
export type ButtonVariant =
    | "primary"
    | "accent"
    | "secondary"
    | "light"
    | "soft"
    | "outline"
    | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

const base = [
    "inline-flex items-center justify-center gap-2",
    "rounded-lg font-sans whitespace-nowrap select-none",
    "transition-all duration-200",
    "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

const variants: Record<ButtonVariant, string> = {
    primary:
        "bg-primary-container text-on-primary shadow-cta hover:bg-secondary",
    accent:
        "bg-tertiary-container text-on-tertiary shadow-md hover:bg-tertiary hover:-translate-y-0.5",
    secondary:
        "bg-secondary text-on-secondary shadow-md hover:bg-secondary-container hover:text-on-secondary-fixed",
    light:
        "bg-surface-container-lowest/90 text-primary shadow-sm backdrop-blur-md hover:bg-surface-container-lowest hover:-translate-y-0.5",
    soft:
        "bg-surface-container text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container",
    outline:
        "border-[1.5px] border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary",
    ghost:
        "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
};

const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-label-md",
    md: "px-5 py-2.5 text-label-lg",
    lg: "px-8 py-3.5 text-label-lg",
};

interface ButtonVariantsProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
}

export function buttonVariants({
    variant = "primary",
    size = "md",
    className,
}: ButtonVariantsProps = {}) {
    return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant, size, className, type = "button", ...props }, ref) => (
        <button
            ref={ref}
            type={type}
            className={buttonVariants({ variant, size, className })}
            {...props}
        />
    )
);

Button.displayName = "Button";

interface ButtonLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
}

export function ButtonLink({
    href,
    variant = "primary",
    size = "md",
    className,
    children,
    ...props
}: ButtonLinkProps) {
    return (
        <Link
            href={href}
            className={buttonVariants({ variant, size, className })}
            {...props}
        >
            {children}
        </Link>
    );
}