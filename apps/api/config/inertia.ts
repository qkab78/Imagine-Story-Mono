import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  rootView: 'inertia_layout',
  sharedData: {},
  ssr: {
    enabled: false,
  },
})
