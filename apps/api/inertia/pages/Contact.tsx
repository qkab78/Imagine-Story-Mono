import { Head, Link } from '@inertiajs/react'
import { useTranslation } from 'react-i18next'
import { LegalNav } from '../components/Nav'
import { SimpleFooter } from '../components/Footer'
import { useContactForm } from '../hooks/useContactForm'

export default function Contact() {
  const { t } = useTranslation()
  const { form, onSubmit, resetForm, submitted, submitting, serverError, errors } = useContactForm()
  const { register } = form
  const hasErrors = Object.keys(errors).length > 0

  return (
    <>
      <Head title={t('contact.title')} />
      <LegalNav />

      <div className="page-hero">
        <div className="label">{t('contact.heroLabel')}</div>
        <h1>{t('contact.heroTitle')}</h1>
        <p>{t('contact.heroSubtitle')}</p>
      </div>

      <div className="contact-body">
        <div className="contact-info">
          <h2>{t('contact.infoTitle')}</h2>
          <p>{t('contact.infoSubtitle')}</p>
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-card-icon">&#128231;</div>
              <div className="contact-card-content">
                <h3>{t('contact.emailSupport')}</h3>
                <p>{t('contact.emailSupportDesc')}</p>
                <a href="mailto:support@monpetitconteur.app">support@monpetitconteur.app</a>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">&#128274;</div>
              <div className="contact-card-content">
                <h3>{t('contact.privacyGdpr')}</h3>
                <p>{t('contact.privacyGdprDesc')}</p>
                <a href="mailto:privacy@monpetitconteur.app">privacy@monpetitconteur.app</a>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">&#128179;</div>
              <div className="contact-card-content">
                <h3>{t('contact.subscription')}</h3>
                <p>{t('contact.subscriptionDesc')}</p>
                <a href="mailto:billing@monpetitconteur.app">billing@monpetitconteur.app</a>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">&#129309;</div>
              <div className="contact-card-content">
                <h3>{t('contact.partnerships')}</h3>
                <p>{t('contact.partnershipsDesc')}</p>
                <a href="mailto:hello@monpetitconteur.app">hello@monpetitconteur.app</a>
              </div>
            </div>
          </div>
          <div className="response-time">
            <div className="icon">&#9201;&#65039;</div>
            <p><strong>{t('contact.responseTime')}</strong> {t('contact.responseTimeDesc')}</p>
          </div>
        </div>

        <div className="contact-form-wrap">
          {!submitted ? (
            <div>
              <div className="form-title">{t('contact.formTitle')}</div>
              <div className="form-subtitle">{t('contact.formSubtitle')} <span style={{ color: 'var(--gold)' }}>*</span> {t('contact.formSubtitleEnd')}</div>

              <div className={`form-error-banner${hasErrors ? ' show' : ''}`}>
                &#9888;&#65039; {t('contact.errorBanner')}
              </div>

              {serverError && (
                <div className="form-error-banner show">
                  &#9888;&#65039; {t('contact.serverError')}
                </div>
              )}

              <form onSubmit={onSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">{t('contact.firstName')} <span className="required">*</span></label>
                    <input
                      type="text"
                      id="firstName"
                      className={`form-control${errors.firstName ? ' error' : ''}`}
                      placeholder={t('contact.firstNamePlaceholder')}
                      {...register('firstName')}
                    />
                    <div className={`field-error${errors.firstName ? ' show' : ''}`}>{t('contact.firstNameError')}</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">{t('contact.lastName')}</label>
                    <input
                      type="text"
                      id="lastName"
                      className="form-control"
                      placeholder={t('contact.lastNamePlaceholder')}
                      {...register('lastName')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('contact.email')} <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control${errors.email ? ' error' : ''}`}
                    placeholder={t('contact.emailPlaceholder')}
                    {...register('email')}
                  />
                  <div className={`field-error${errors.email ? ' show' : ''}`}>{t('contact.emailError')}</div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">{t('contact.subject')} <span className="required">*</span></label>
                  <select
                    id="subject"
                    className={`form-control${errors.subject ? ' error' : ''}`}
                    {...register('subject')}
                  >
                    <option value="">{t('contact.subjectPlaceholder')}</option>
                    <option value="bug">{t('contact.subjectBug')}</option>
                    <option value="account">{t('contact.subjectAccount')}</option>
                    <option value="billing">{t('contact.subjectBilling')}</option>
                    <option value="content">{t('contact.subjectContent')}</option>
                    <option value="privacy">{t('contact.subjectPrivacy')}</option>
                    <option value="feature">{t('contact.subjectFeature')}</option>
                    <option value="partnership">{t('contact.subjectPartnership')}</option>
                    <option value="other">{t('contact.subjectOther')}</option>
                  </select>
                  <div className={`field-error${errors.subject ? ' show' : ''}`}>{t('contact.subjectError')}</div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t('contact.message')} <span className="required">*</span></label>
                  <textarea
                    id="message"
                    className={`form-control${errors.message ? ' error' : ''}`}
                    placeholder={t('contact.messagePlaceholder')}
                    rows={5}
                    {...register('message')}
                  />
                  <div className={`field-error${errors.message ? ' show' : ''}`}>{t('contact.messageError')}</div>
                </div>

                <div className="form-group">
                  <label htmlFor="appVersion">{t('contact.appVersion')}</label>
                  <input
                    type="text"
                    id="appVersion"
                    className="form-control"
                    placeholder={t('contact.appVersionPlaceholder')}
                    {...register('appVersion')}
                  />
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    id="privacyConsent"
                    {...register('privacyConsent')}
                  />
                  <label htmlFor="privacyConsent">
                    {t('contact.privacyConsent')} <Link href="/privacy">{t('contact.privacyConsentLink')}</Link>. <span style={{ color: 'var(--gold)' }}>*</span>
                  </label>
                </div>
                <div className={`field-error${errors.privacyConsent ? ' show' : ''}`} style={{ marginTop: -16, marginBottom: 20 }}>
                  {t('contact.privacyConsentError')}
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    id="newsletter"
                    {...register('newsletter')}
                  />
                  <label htmlFor="newsletter">
                    {t('contact.newsletter')}
                  </label>
                </div>

                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? (
                    <span>&#8987; {t('contact.submitting')}</span>
                  ) : (
                    <span>&#10024; {t('contact.submit')}</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="form-success" style={{ display: 'block' }}>
              <div className="success-icon">&#127881;</div>
              <h3>{t('contact.successTitle')}</h3>
              <p>{t('contact.successMessage')}</p>
              <button className="btn-reset" onClick={resetForm}>{t('contact.sendAnother')}</button>
            </div>
          )}
        </div>
      </div>

      <SimpleFooter />
    </>
  )
}
