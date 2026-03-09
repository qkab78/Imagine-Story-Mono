import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import '../css/app.css'

const appName = 'Contes Magiques'

createInertiaApp({
  progress: {
    color: '#2D6A4F',
  },

  title: (title) => (title ? `${title} — ${appName}` : appName),

  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
    return pages[`../pages/${name}.tsx`]
  },

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})
