import {defineField} from 'sanity'
import {requireEnglish} from './validation'

export const imageFields = [
  defineField({
    name: 'image',
    title: 'Photo',
    type: 'image',
    options: {hotspot: true},
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'alt',
    title: 'Photo description (alt text)',
    type: 'internationalizedArrayString',
    description: 'Describes the photo for screen readers. Say what is in the photo.',
    validation: (rule) => rule.custom(requireEnglish),
  }),
]

export const orderField = defineField({
  name: 'order',
  title: 'Order',
  type: 'number',
  description: 'Lower numbers come first on the site (1 is first).',
  validation: (rule) => rule.required().integer().min(1),
})
