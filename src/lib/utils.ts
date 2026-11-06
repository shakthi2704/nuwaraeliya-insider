import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* The Highland Editorial font-size tokens (see globals.css) are custom
   names. Without registering them, tailwind-merge reads `text-label-lg`
   as a text COLOR and silently drops it whenever a real color class
   such as `text-on-primary` sits next to it. */
const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            "font-size": [
                {
                    text: [
                        "display-lg",
                        "display-lg-mobile",
                        "headline-xl",
                        "headline-xl-mobile",
                        "headline-md",
                        "headline-sm",
                        "body-xl",
                        "body-lg",
                        "body-md",
                        "label-lg",
                        "label-md",
                        "caption",
                    ],
                },
            ],
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}