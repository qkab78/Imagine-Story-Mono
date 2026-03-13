import { Link } from '@inertiajs/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <nav className="main-nav">
      <Link href="/" className="nav-logo">
        <div className="logo-icon">&#10024;</div>
        Mon Petit Conteur
      </Link>
      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        <li><a href="#how">{t('nav.howItWorks')}</a></li>
        <li><a href="#features">{t('nav.features')}</a></li>
        <li><a href="#pricing">{t('nav.pricing')}</a></li>
        <li><a href="#faq">{t('nav.faq')}</a></li>
        <li><Link href="/contact">{t('nav.contact')}</Link></li>
      </ul>
      <LanguageSwitcher />
      <a href="#download" className="nav-cta">{t('nav.download')}</a>
      <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </button>
    </nav>
  )
}

export function LegalNav() {
  const { t } = useTranslation()

  return (
    <nav className="legal-nav">
      <Link href="/" className="nav-logo">
        <div className="logo-icon">&#10024;</div>
        Mon Petit Conteur
      </Link>
      <LanguageSwitcher />
      <Link href="/" className="nav-back">&larr; {t('nav.backToHome')}</Link>
    </nav>
  )
}
