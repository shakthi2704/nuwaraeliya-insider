import {DEFAULT_LANGUAGE} from './languages'

type LocalizedItem = {language?: string; value?: string}

/* A translated field must have a non-empty English version. Other languages
   are optional: the site falls back to English when one is missing. */
export function requireEnglish(value: unknown): true | string {
  const items = Array.isArray(value) ? (value as LocalizedItem[]) : []
  const english = items.find((item) => item.language === DEFAULT_LANGUAGE)
  return english && english.value && english.value.trim().length > 0
    ? true
    : 'The English version is required.'
}

/* The same shape the site accepts: lowercase words joined by hyphens. */
export const SLUG_SHAPE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const MAX_SLUG_LENGTH = 80

export function englishOf(value: unknown): string | undefined {
  const items = Array.isArray(value) ? (value as LocalizedItem[]) : []
  return items.find((item) => item.language === DEFAULT_LANGUAGE)?.value
}
