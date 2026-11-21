import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import {DEFAULT_LANGUAGE, LANGUAGES} from './schemaTypes/languages'

export default defineConfig({
  name: 'default',
  title: 'Nuwara Insider',

  projectId: 'jkjqvoz4',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    internationalizedArray({
      languages: LANGUAGES,
      defaultLanguages: [DEFAULT_LANGUAGE],
      fieldTypes: ['string', 'text'],
    }),
  ],

  schema: {types: schemaTypes},
})
