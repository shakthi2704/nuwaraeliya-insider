import {defineArrayMember, defineField, defineType} from 'sanity'
import {imageFields, orderField} from './imageFields'
import {CATEGORY_OPTIONS, EFFORT_OPTIONS} from './options'
import {slugField} from './slugField'
import {requireEnglish} from './validation'

const sectionItem = defineArrayMember({
  type: 'object',
  name: 'section',
  fields: [
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.custom(requireEnglish),
    }),
    defineField({
      name: 'description',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.custom(requireEnglish),
    }),
  ],
  preview: {select: {title: 'title.0.value', subtitle: 'description.0.value'}},
})

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  orderings: [{title: 'Order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title.0.value', subtitle: 'area.0.value', media: 'image'}},
  fields: [
    slugField,
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.custom(requireEnglish),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {list: CATEGORY_OPTIONS},
      description: 'The first one is the main category shown on cards.',
      validation: (rule) => rule.required().min(1).max(3).unique(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'internationalizedArrayText',
      description: 'The teaser on cards.',
      validation: (rule) => rule.custom(requireEnglish),
    }),
    defineField({
      name: 'body',
      title: 'Full write-up',
      type: 'internationalizedArrayText',
      description: 'Paragraphs separated by a blank line.',
      validation: (rule) => rule.custom(requireEnglish),
    }),
    defineField({
      name: 'duration',
      type: 'internationalizedArrayString',
      description: 'For example "Half day" or "2 – 3 hours".',
      validation: (rule) => rule.custom(requireEnglish),
    }),
    defineField({
      name: 'elevationM',
      title: 'Elevation (metres)',
      type: 'number',
      validation: (rule) => rule.min(0).max(3000),
    }),
    defineField({
      name: 'area',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.custom(requireEnglish),
    }),
    defineField({
      name: 'effort',
      type: 'string',
      options: {list: EFFORT_OPTIONS, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bestFor',
      title: 'Best for',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.custom(requireEnglish),
    }),
    ...imageFields,
    defineField({
      name: 'highlights',
      title: 'What to expect (optional)',
      type: 'array',
      of: [sectionItem],
    }),
    defineField({
      name: 'practicalNotes',
      title: 'Field notes (optional)',
      type: 'array',
      of: [sectionItem],
    }),
    defineField({
      name: 'insiderTip',
      title: 'Insider tip (optional)',
      type: 'internationalizedArrayText',
      description: 'One short tip in your own words. Only add what you know to be true.',
    }),
    orderField,
  ],
})
