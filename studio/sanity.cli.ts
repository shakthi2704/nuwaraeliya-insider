import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'jkjqvoz4',
    dataset: 'production'
  },
  studioHost: 'nuwara-insider',
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    appId: 'z5xg6yx7r76unoaz7bzkbmfh',
    autoUpdates: false,
  },
})
