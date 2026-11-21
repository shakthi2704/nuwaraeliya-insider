import {defineField} from 'sanity'
import {LockedSlugInput} from './LockedSlugInput'
import {englishOf, MAX_SLUG_LENGTH, SLUG_SHAPE} from './validation'

/* Shared by experience, trip idea and guide. */
export const slugField = defineField({
  name: 'slug',
  title: 'Slug (web address)',
  type: 'slug',
  description:
    'Used in the page address and in shared links. Lowercase words joined by hyphens. It is locked once the document is published.',
  options: {
    source: (doc) => englishOf((doc as {title?: unknown}).title) ?? '',
    maxLength: MAX_SLUG_LENGTH,
  },
  components: {input: LockedSlugInput},
  validation: (rule) =>
    rule.required().custom((value) => {
      const current = value?.current
      if (!current) return 'Required.'
      return SLUG_SHAPE.test(current) && current.length <= MAX_SLUG_LENGTH
        ? true
        : 'Use lowercase letters, numbers and single hyphens only.'
    }),
})
