import {defineArrayMember, defineField, defineType} from 'sanity'
import {imageFields, orderField} from './imageFields'
import {slugField} from './slugField'
import {requireEnglish} from './validation'

export const tripIdea = defineType({
  name: 'tripIdea',
  title: 'Trip idea',
  type: 'document',
  orderings: [{title: 'Order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title.0.value', media: 'image'}},
  fields: [
    slugField,
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.custom(requireEnglish),
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
      title: 'Introduction',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.custom(requireEnglish),
    }),
    defineField({
      name: 'experiences',
      title: 'Experiences included',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'experience'}]})],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'days',
      title: 'Day by day',
      type: 'array',
      description: 'The number of days shown on the site is the number of entries here.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'day',
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
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    ...imageFields,
    defineField({
      name: 'featured',
      type: 'boolean',
      description: 'Shows a "Featured" tag on the card.',
      initialValue: false,
    }),
    orderField,
  ],
})
