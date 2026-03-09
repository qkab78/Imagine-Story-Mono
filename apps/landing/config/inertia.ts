import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  rootView: 'inertia_layout',

  sharedData: {
    appName: 'Contes Magiques',
  },

  ssr: {
    enabled: false,
  },
})
