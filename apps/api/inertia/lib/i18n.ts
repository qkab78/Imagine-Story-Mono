import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from '../locales/fr.json'
import en from '../locales/en.json'

const STORAGE_KEY = 'lang'

function getInitialLanguage(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'fr') return stored
  } catch {}

  const browserLang = navigator.language.split('-')[0].toLowerCase()
  return browserLang === 'en' ? 'en' : 'fr'
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {}
})

export default i18n
