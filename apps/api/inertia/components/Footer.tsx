import { Link } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="nav-logo">
              <div className="logo-icon">&#10024;</div>
              Mon Petit Conteur
            </Link>
            <p>{t('footer.brandDescription')}</p>
          </div>
          <div className="footer-col">
            <h4>{t('footer.application')}</h4>
            <ul>
              <li><a href="#how">{t('footer.howItWorks')}</a></li>
              <li><a href="#features">{t('footer.features')}</a></li>
              <li><a href="#pricing">{t('footer.pricing')}</a></li>
              <li><a href="#download">{t('footer.download')}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer.support')}</h4>
            <ul>
              <li><a href="#faq">{t('footer.faq')}</a></li>
              <li><Link href="/contact">{t('footer.contact')}</Link></li>
              <li><Link href="/contact">{t('footer.reportProblem')}</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer.legal')}</h4>
            <ul>
              <li><Link href="/privacy">{t('footer.privacyPolicy')}</Link></li>
              <li><Link href="/terms">{t('footer.termsOfUse')}</Link></li>
              <li><Link href="/terms#eula">{t('footer.eula')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {t('footer.copyright')}</p>
          <div className="footer-legal">
            <Link href="/privacy">{t('footer.privacy')}</Link>
            <Link href="/terms">{t('footer.terms')}</Link>
            <Link href="/contact">{t('footer.contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function SimpleFooter() {
  const { t } = useTranslation()

  return (
    <footer className="simple-footer">
      <div>
        <Link href="/">{t('footer.home')}</Link>
        <Link href="/privacy">{t('footer.privacy')}</Link>
        <Link href="/terms">{t('footer.terms')}</Link>
        <Link href="/contact">{t('footer.contact')}</Link>
      </div>
      <p>&copy; {t('footer.copyright')}</p>
    </footer>
  )
}
