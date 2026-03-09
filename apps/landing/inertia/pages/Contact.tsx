import { Head, Link } from '@inertiajs/react'
import { useState, FormEvent } from 'react'
import { LegalNav } from '../components/Nav'
import { SimpleFooter } from '../components/Footer'

interface FormErrors {
  firstName?: boolean
  email?: boolean
  subject?: boolean
  message?: boolean
  consent?: boolean
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showErrorBanner, setShowErrorBanner] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
    appVersion: '',
    privacyConsent: false,
    newsletter: false,
  })

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = true
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = true
    if (!formData.subject) newErrors.subject = true
    if (formData.message.trim().length < 20) newErrors.message = true
    if (!formData.privacyConsent) newErrors.consent = true

    setErrors(newErrors)
    const hasErrors = Object.keys(newErrors).length > 0
    setShowErrorBanner(hasErrors)
    return !hasErrors
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitting(false)
    setSubmitted(true)
  }

  function resetForm() {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
      appVersion: '',
      privacyConsent: false,
      newsletter: false,
    })
    setErrors({})
    setShowErrorBanner(false)
    setSubmitted(false)
  }

  return (
    <>
      <Head title="Contact" />
      <LegalNav />

      <div className="page-hero">
        <div className="label">Support</div>
        <h1>Nous contacter</h1>
        <p>Une question, un retour ou un probleme ? Notre equipe est la pour vous aider.</p>
      </div>

      <div className="contact-body">
        <div className="contact-info">
          <h2>Comment pouvons-nous vous aider ?</h2>
          <p>Nous repondons a toutes les demandes liees a l'application, aux abonnements, a la confidentialite des donnees et aux retours d'experience.</p>
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-card-icon">&#128231;</div>
              <div className="contact-card-content">
                <h3>Email support</h3>
                <p>Pour toute demande generale</p>
                <a href="mailto:support@contesmagiques.app">support@contesmagiques.app</a>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">&#128274;</div>
              <div className="contact-card-content">
                <h3>Confidentialite & RGPD</h3>
                <p>Exercer vos droits sur vos donnees</p>
                <a href="mailto:privacy@contesmagiques.app">privacy@contesmagiques.app</a>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">&#128179;</div>
              <div className="contact-card-content">
                <h3>Abonnement</h3>
                <p>Questions de facturation et remboursement</p>
                <a href="mailto:billing@contesmagiques.app">billing@contesmagiques.app</a>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">&#129309;</div>
              <div className="contact-card-content">
                <h3>Partenariats & presse</h3>
                <p>Collaborations et relations medias</p>
                <a href="mailto:hello@contesmagiques.app">hello@contesmagiques.app</a>
              </div>
            </div>
          </div>
          <div className="response-time">
            <div className="icon">&#9201;&#65039;</div>
            <p><strong>Temps de reponse moyen :</strong> 24 a 48 heures ouvrees. Nous faisons tout pour repondre plus vite !</p>
          </div>
        </div>

        <div className="contact-form-wrap">
          {!submitted ? (
            <div>
              <div className="form-title">Envoyer un message</div>
              <div className="form-subtitle">Tous les champs marques d'un <span style={{ color: 'var(--gold)' }}>*</span> sont obligatoires.</div>

              <div className={`form-error-banner${showErrorBanner ? ' show' : ''}`}>
                &#9888;&#65039; Veuillez corriger les erreurs ci-dessous avant d'envoyer.
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Prenom <span className="required">*</span></label>
                    <input
                      type="text"
                      id="firstName"
                      className={`form-control${errors.firstName ? ' error' : ''}`}
                      placeholder="Votre prenom"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    <div className={`field-error${errors.firstName ? ' show' : ''}`}>Veuillez entrer votre prenom.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Nom</label>
                    <input
                      type="text"
                      id="lastName"
                      className="form-control"
                      placeholder="Votre nom"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control${errors.email ? ' error' : ''}`}
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <div className={`field-error${errors.email ? ' show' : ''}`}>Veuillez entrer une adresse email valide.</div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Sujet <span className="required">*</span></label>
                  <select
                    id="subject"
                    className={`form-control${errors.subject ? ' error' : ''}`}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="">— Choisissez un sujet —</option>
                    <option value="bug">Signaler un bug</option>
                    <option value="account">Probleme de compte</option>
                    <option value="billing">Question d'abonnement / facturation</option>
                    <option value="content">Contenu d'une histoire</option>
                    <option value="privacy">Donnees personnelles / RGPD</option>
                    <option value="feature">Suggestion de fonctionnalite</option>
                    <option value="partnership">Partenariat / Presse</option>
                    <option value="other">Autre</option>
                  </select>
                  <div className={`field-error${errors.subject ? ' show' : ''}`}>Veuillez choisir un sujet.</div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message <span className="required">*</span></label>
                  <textarea
                    id="message"
                    className={`form-control${errors.message ? ' error' : ''}`}
                    placeholder="Decrivez votre demande en detail. Plus vous donnez de contexte, mieux nous pourrons vous aider."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  <div className={`field-error${errors.message ? ' show' : ''}`}>Veuillez ecrire votre message (minimum 20 caracteres).</div>
                </div>

                <div className="form-group">
                  <label htmlFor="appVersion">Version de l'application (optionnel)</label>
                  <input
                    type="text"
                    id="appVersion"
                    className="form-control"
                    placeholder="Ex : 1.2.3 (visible dans Reglages > A propos)"
                    value={formData.appVersion}
                    onChange={(e) => setFormData({ ...formData, appVersion: e.target.value })}
                  />
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    id="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                  />
                  <label htmlFor="privacyConsent">
                    J'accepte que mes donnees soient traitees pour repondre a ma demande, conformement a la <Link href="/privacy">Politique de confidentialite</Link>. <span style={{ color: 'var(--gold)' }}>*</span>
                  </label>
                </div>
                <div className={`field-error${errors.consent ? ' show' : ''}`} style={{ marginTop: -16, marginBottom: 20 }}>
                  Vous devez accepter la politique de confidentialite.
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={formData.newsletter}
                    onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                  />
                  <label htmlFor="newsletter">
                    Je souhaite recevoir les actualites de Contes Magiques (nouveautes, mises a jour). Desabonnement possible a tout moment.
                  </label>
                </div>

                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? (
                    <span>&#8987; Envoi en cours...</span>
                  ) : (
                    <span>&#10024; Envoyer mon message</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="form-success" style={{ display: 'block' }}>
              <div className="success-icon">&#127881;</div>
              <h3>Message envoye !</h3>
              <p>Merci pour votre message. Notre equipe vous repondra dans les 24 a 48 heures ouvrees. Pensez a verifier vos spams si vous ne recevez pas de reponse.</p>
              <button className="btn-reset" onClick={resetForm}>Envoyer un autre message</button>
            </div>
          )}
        </div>
      </div>

      <SimpleFooter />
    </>
  )
}
