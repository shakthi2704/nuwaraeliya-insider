import {defineField, defineType} from 'sanity'
import {imageFields, orderField} from './imageFields'
import {GUIDE_CATEGORY_OPTIONS} from './options'
import {slugField} from './slugField'
import {requireEnglish} from './validation'

export const guide = defineType({
  name: 'guide',
  title: 'Travel guide',
  type: 'document',
  orderings: [{title: 'Order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title.0.value', subtitle: 'category', media: 'image'}},
  fields: [
    slugField,
    defineField({
      name: 'category',
      type: 'string',
      options: {list: GUIDE_CATEGORY_OPTIONS},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.custom(requireEnglish),
    }),
    defineField({
      name: 'excerpt',
      type: 'internationalizedArrayText',
      description: 'The teaser on cards.',
      validation: (rule) => rule.custom(requireEnglish),
    }),
    defineField({
      name: 'body',
      title: 'Article',
      type: 'internationalizedArrayText',
      description: 'Paragraphs separated by a blank line.',
      validation: (rule) => rule.custom(requireEnglish),
    }),
    defineField({
      name: 'readMinutes',
      title: 'Reading time (minutes)',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1).max(60),
    }),
    ...imageFields,
    orderField,
  ],
})
