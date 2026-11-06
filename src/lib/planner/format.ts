/* Display helpers for the result page. The engine works in 24-hour "HH:MM"
   strings and plain minutes; these turn them into what travelers read. */

/* "08:30" -> "8:30 am", "12:00" -> "12:00 pm", "00:15" -> "12:15 am". */
export function formatClock(hhmm: string): string {
    const [h, m] = hhmm.split(":").map(Number);
    const suffix = h >= 12 ? "pm" : "am";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/* 150 -> { hours: 2, minutes: 30 }. The wording lives in messages. */
export function durationParts(totalMinutes: number): {
    hours: number;
    minutes: number;
} {
    const rounded = Math.max(0, Math.round(totalMinutes));
    return { hours: Math.floor(rounded / 60), minutes: rounded % 60 };
}