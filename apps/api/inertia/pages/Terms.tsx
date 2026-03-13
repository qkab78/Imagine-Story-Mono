import { Head, Link } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LegalNav } from '../components/Nav'
import { SimpleFooter } from '../components/Footer'

function CGUContent() {
  const { t } = useTranslation()

  return (
    <div className="legal-body">
      <div className="info-box">
        <p>&#128203; <strong>{t('terms.cguSummary').split('.')[0]}.</strong> {t('terms.cguSummary').split('.').slice(1).join('.')}</p>
      </div>

      <div className="toc">
        <h2>{t('terms.cguToc')}</h2>
        <ol>
          <li><a href="#acceptation">{t('terms.cguTocItems.acceptation')}</a></li>
          <li><a href="#description">{t('terms.cguTocItems.description')}</a></li>
          <li><a href="#compte">{t('terms.cguTocItems.compte')}</a></li>
          <li><a href="#abonnement">{t('terms.cguTocItems.abonnement')}</a></li>
          <li><a href="#contenu">{t('terms.cguTocItems.contenu')}</a></li>
          <li><a href="#usage">{t('terms.cguTocItems.usage')}</a></li>
          <li><a href="#pi">{t('terms.cguTocItems.pi')}</a></li>
          <li><a href="#responsabilite">{t('terms.cguTocItems.responsabilite')}</a></li>
          <li><a href="#resiliation">{t('terms.cguTocItems.resiliation')}</a></li>
          <li><a href="#droit">{t('terms.cguTocItems.droit')}</a></li>
        </ol>
      </div>

      <div className="legal-section" id="acceptation">
        <h2>{t('terms.cgu1Title')}</h2>
        <p>{t('terms.cgu1P1')}</p>
        <p>{t('terms.cgu1P2')}<Link href="/privacy">{t('terms.cgu1P2Link')}</Link>{t('terms.cgu1P2End')}</p>
        <div className="warning-box">
          <p dangerouslySetInnerHTML={{ __html: `&#9888;&#65039; ${t('terms.cgu1Warning')}` }} />
        </div>
      </div>

      <div className="legal-section" id="description">
        <h2>{t('terms.cgu2Title')}</h2>
        <p>{t('terms.cgu2P1')}</p>
        <ul>
          <li>{t('terms.cgu2Li1')}</li>
          <li>{t('terms.cgu2Li2')}</li>
          <li>{t('terms.cgu2Li3')}</li>
          <li>{t('terms.cgu2Li4')}</li>
          <li>{t('terms.cgu2Li5')}</li>
        </ul>
        <p>{t('terms.cgu2P2')}</p>
      </div>

      <div className="legal-section" id="compte">
        <h2>{t('terms.cgu3Title')}</h2>
        <p>{t('terms.cgu3P1')}</p>
        <ul>
          <li>{t('terms.cgu3Li1')}</li>
          <li>{t('terms.cgu3Li2')}</li>
          <li>{t('terms.cgu3Li3')}</li>
        </ul>
        <p>{t('terms.cgu3P2')}</p>
      </div>

      <div className="legal-section" id="abonnement">
        <h2>{t('terms.cgu4Title')}</h2>
        <h3>{t('terms.cgu4_1Title')}</h3>
        <p>{t('terms.cgu4_1P')}</p>
        <h3>{t('terms.cgu4_2Title')}</h3>
        <p>{t('terms.cgu4_2P')}</p>
        <h3>{t('terms.cgu4_3Title')}</h3>
        <p>{t('terms.cgu4_3P')}</p>
        <ol>
          <li>{t('terms.cgu4_3Li1')}</li>
          <li>{t('terms.cgu4_3Li2')}</li>
          <li>{t('terms.cgu4_3Li3')}</li>
        </ol>
        <p>{t('terms.cgu4_3P2')}</p>
        <h3>{t('terms.cgu4_4Title')}</h3>
        <p>{t('terms.cgu4_4P')}</p>
        <h3>{t('terms.cgu4_5Title')}</h3>
        <p>{t('terms.cgu4_5P')}</p>
      </div>

      <div className="legal-section" id="contenu">
        <h2>{t('terms.cgu5Title')}</h2>
        <h3>{t('terms.cgu5_1Title')}</h3>
        <p>{t('terms.cgu5_1P')}</p>
        <h3>{t('terms.cgu5_2Title')}</h3>
        <p>{t('terms.cgu5_2P')}</p>
        <h3>{t('terms.cgu5_3Title')}</h3>
        <p>{t('terms.cgu5_3P')}<a href="mailto:support@monpetitconteur.app">support@monpetitconteur.app</a>.</p>
      </div>

      <div className="legal-section" id="usage">
        <h2>{t('terms.cgu6Title')}</h2>
        <p dangerouslySetInnerHTML={{ __html: t('terms.cgu6P') }} />
        <ul>
          <li>{t('terms.cgu6Li1')}</li>
          <li>{t('terms.cgu6Li2')}</li>
          <li>{t('terms.cgu6Li3')}</li>
          <li>{t('terms.cgu6Li4')}</li>
          <li>{t('terms.cgu6Li5')}</li>
          <li>{t('terms.cgu6Li6')}</li>
          <li>{t('terms.cgu6Li7')}</li>
        </ul>
      </div>

      <div className="legal-section" id="pi">
        <h2>{t('terms.cgu7Title')}</h2>
        <p>{t('terms.cgu7P1')}</p>
        <p>{t('terms.cgu7P2')}</p>
      </div>

      <div className="legal-section" id="responsabilite">
        <h2>{t('terms.cgu8Title')}</h2>
        <p>{t('terms.cgu8P')}</p>
        <ul>
          <li>{t('terms.cgu8Li1')}</li>
          <li>{t('terms.cgu8Li2')}</li>
          <li>{t('terms.cgu8Li3')}</li>
        </ul>
        <div className="info-box">
          <p>&#8505;&#65039; {t('terms.cgu8Info')}</p>
        </div>
      </div>

      <div className="legal-section" id="resiliation">
        <h2>{t('terms.cgu9Title')}</h2>
        <p>{t('terms.cgu9P1')}</p>
        <p>{t('terms.cgu9P2')}</p>
      </div>

      <div className="legal-section" id="droit">
        <h2>{t('terms.cgu10Title')}</h2>
        <p>{t('terms.cgu10P1')}</p>
        <p>{t('terms.cgu10P2')}<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.</p>
      </div>
    </div>
  )
}

function EULAContent() {
  const { t } = useTranslation()

  return (
    <div className="legal-body" id="eula">
      <div className="warning-box">
        <p dangerouslySetInnerHTML={{ __html: `&#9888;&#65039; ${t('terms.eulaWarning')}` }} />
      </div>

      <div className="legal-section">
        <h2>{t('terms.eulaTitle')}</h2>
        <p dangerouslySetInnerHTML={{ __html: t('terms.eulaIntro1') }} />
        <p>{t('terms.eulaIntro2')}</p>
        <p dangerouslySetInnerHTML={{ __html: t('terms.eulaIntro3') }} />
      </div>

      <div className="legal-section">
        <h2>{t('terms.eula1Title')}</h2>
        <p>{t('terms.eula1P')}</p>
        <ul>
          <li>{t('terms.eula1Li1')}</li>
          <li>{t('terms.eula1Li2')}</li>
          <li>{t('terms.eula1Li3')}</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>{t('terms.eula2Title')}</h2>
        <p>{t('terms.eula2P')}</p>
        <ul>
          <li>{t('terms.eula2Li1')}</li>
          <li>{t('terms.eula2Li2')}</li>
          <li>{t('terms.eula2Li3')}</li>
          <li>{t('terms.eula2Li4')}</li>
          <li>{t('terms.eula2Li5')}</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>{t('terms.eula3Title')}</h2>
        <p>{t('terms.eula3P')}<Link href="/privacy">{t('terms.eula3PLink')}</Link>{t('terms.eula3PEnd')}</p>
      </div>

      <div className="legal-section">
        <h2>{t('terms.eula4Title')}</h2>
        <p>{t('terms.eula4P')}</p>
      </div>

      <div className="legal-section">
        <h2>{t('terms.eula5Title')}</h2>
        <p>{t('terms.eula5P')}</p>
      </div>

      <div className="legal-section">
        <h2>{t('terms.eula6Title')}</h2>
        <p>{t('terms.eula6P')}</p>
        <ul>
          <li>{t('terms.eula6Li1')}</li>
          <li>{t('terms.eula6Li2')}</li>
          <li>{t('terms.eula6Li3')}</li>
          <li>{t('terms.eula6Li4')}</li>
          <li>{t('terms.eula6Li5')}</li>
          <li>{t('terms.eula6Li6')}</li>
          <li>{t('terms.eula6Li7')}</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>{t('terms.eula7Title')}</h2>
        <p>{t('terms.eula7P')}</p>
      </div>

      <div className="legal-section">
        <h2>{t('terms.eula8Title')}</h2>
        <p>{t('terms.eula8P')}</p>
      </div>

      <div className="legal-section">
        <h2>{t('terms.eula9Title')}</h2>
        <p>{t('terms.eula9P')}</p>
      </div>

      <div className="legal-section">
        <h2>{t('terms.eula10Title')}</h2>
        <p>{t('terms.eula10P')}</p>
      </div>

      <div className="legal-section">
        <h2>{t('terms.eula11Title')}</h2>
        <p>{t('terms.eula11P')}</p>
        <p>&#128231; <a href="mailto:legal@monpetitconteur.app">legal@monpetitconteur.app</a></p>
      </div>
    </div>
  )
}

export default function Terms() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'cgu' | 'eula'>('cgu')

  useEffect(() => {
    if (window.location.hash === '#eula') {
      setActiveTab('eula')
    }
  }, [])

  return (
    <>
      <Head title={t('terms.title')} />
      <LegalNav />

      <div className="hero-legal">
        <div className="hero-legal-inner">
          <div className="legal-label">{t('terms.heroLabel')}</div>
          <h1>{t('terms.heroTitle')}</h1>
          <p>{t('terms.heroSubtitle')}</p>
          <div className="last-updated">&#128197; {t('terms.lastUpdated')}</div>
        </div>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn${activeTab === 'cgu' ? ' active' : ''}`} onClick={() => setActiveTab('cgu')}>
          {t('terms.tabCgu')}
        </button>
        <button className={`tab-btn${activeTab === 'eula' ? ' active' : ''}`} onClick={() => setActiveTab('eula')}>
          {t('terms.tabEula')}
        </button>
      </div>

      {activeTab === 'cgu' ? <CGUContent /> : <EULAContent />}

      <SimpleFooter />
    </>
  )
}
