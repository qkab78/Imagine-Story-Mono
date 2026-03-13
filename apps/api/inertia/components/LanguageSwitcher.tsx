import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')
  }

  return (
    <button className="lang-switcher" onClick={toggleLanguage} type="button">
      {i18n.language === 'fr' ? 'EN' : 'FR'}
    </button>
  )
}
