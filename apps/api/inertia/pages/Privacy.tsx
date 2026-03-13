import { Head, Link } from '@inertiajs/react'
import { useTranslation, Trans } from 'react-i18next'
import { LegalNav } from '../components/Nav'
import { SimpleFooter } from '../components/Footer'

export default function Privacy() {
  const { t } = useTranslation()

  return (
    <>
      <Head title={t('privacy.title')} />
      <LegalNav />

      <div className="hero-legal">
        <div className="hero-legal-inner">
          <div className="legal-label">{t('privacy.heroLabel')}</div>
          <h1>{t('privacy.heroTitle')}</h1>
          <p>{t('privacy.heroSubtitle')}</p>
          <div className="last-updated">&#128197; {t('privacy.lastUpdated')}</div>
        </div>
      </div>

      <div className="legal-body">
        <div className="toc">
          <h2>{t('privacy.toc')}</h2>
          <ol>
            <li><a href="#responsable">{t('privacy.tocItems.responsable')}</a></li>
            <li><a href="#donnees">{t('privacy.tocItems.donnees')}</a></li>
            <li><a href="#enfants">{t('privacy.tocItems.enfants')}</a></li>
            <li><a href="#finalites">{t('privacy.tocItems.finalites')}</a></li>
            <li><a href="#partage">{t('privacy.tocItems.partage')}</a></li>
            <li><a href="#conservation">{t('privacy.tocItems.conservation')}</a></li>
            <li><a href="#securite">{t('privacy.tocItems.securite')}</a></li>
            <li><a href="#droits">{t('privacy.tocItems.droits')}</a></li>
            <li><a href="#cookies">{t('privacy.tocItems.cookies')}</a></li>
            <li><a href="#transferts">{t('privacy.tocItems.transferts')}</a></li>
            <li><a href="#modifications">{t('privacy.tocItems.modifications')}</a></li>
            <li><a href="#contact-priv">{t('privacy.tocItems.contact')}</a></li>
          </ol>
        </div>

        <div className="info-box">
          <p>&#128203; <strong>{t('privacy.summary').split('.')[0]}.</strong> {t('privacy.summary').split('.').slice(1).join('.')}</p>
        </div>

        <div className="legal-section" id="responsable">
          <h2>{t('privacy.s1Title')}</h2>
          <p dangerouslySetInnerHTML={{ __html: t('privacy.s1P1') }} />
          <p dangerouslySetInnerHTML={{ __html: `${t('privacy.s1P2')}<a href="mailto:privacy@monpetitconteur.app">privacy@monpetitconteur.app</a>` }} />
        </div>

        <div className="legal-section" id="donnees">
          <h2>{t('privacy.s2Title')}</h2>
          <h3>{t('privacy.s2_1Title')}</h3>
          <p>{t('privacy.s2_1P')}</p>
          <ul>
            <li>{t('privacy.s2_1Li1')}</li>
            <li>{t('privacy.s2_1Li2')}</li>
            <li>{t('privacy.s2_1Li3')}</li>
          </ul>
          <h3>{t('privacy.s2_2Title')}</h3>
          <p>{t('privacy.s2_2P')}</p>
          <ul>
            <li>{t('privacy.s2_2Li1')}</li>
            <li>{t('privacy.s2_2Li2')}</li>
            <li>{t('privacy.s2_2Li3')}</li>
          </ul>
          <div className="warning-box">
            <p>&#9888;&#65039; {t('privacy.s2_2Warning')}</p>
          </div>
          <h3>{t('privacy.s2_3Title')}</h3>
          <ul>
            <li>{t('privacy.s2_3Li1')}</li>
            <li>{t('privacy.s2_3Li2')}</li>
            <li>{t('privacy.s2_3Li3')}</li>
          </ul>
          <h3>{t('privacy.s2_4Title')}</h3>
          <p>{t('privacy.s2_4P')}</p>
          <h3>{t('privacy.s2_5Title')}</h3>
          <ul>
            <li>{t('privacy.s2_5Li1')}</li>
            <li>{t('privacy.s2_5Li2')}</li>
            <li>{t('privacy.s2_5Li3')}</li>
          </ul>
        </div>

        <div className="legal-section" id="enfants">
          <h2>{t('privacy.s3Title')}</h2>
          <p dangerouslySetInnerHTML={{ __html: t('privacy.s3P1') }} />
          <p>{t('privacy.s3P2')}</p>
          <ul>
            <li>{t('privacy.s3Li1')}</li>
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s3Li2') }} />
            <li>{t('privacy.s3Li3')}</li>
            <li>{t('privacy.s3Li4')}</li>
          </ul>
          <div className="info-box">
            <p dangerouslySetInnerHTML={{ __html: `&#9989; ${t('privacy.s3Info')}` }} />
          </div>
        </div>

        <div className="legal-section" id="finalites">
          <h2>{t('privacy.s4Title')}</h2>
          <p>{t('privacy.s4P')}</p>
          <ul>
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s4Li1') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s4Li2') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s4Li3') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s4Li4') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s4Li5') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s4Li6') }} />
          </ul>
        </div>

        <div className="legal-section" id="partage">
          <h2>{t('privacy.s5Title')}</h2>
          <p>{t('privacy.s5P')}</p>
          <h3>{t('privacy.s5_1Title')}</h3>
          <ul>
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s5_1Li1') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s5_1Li2') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s5_1Li3') }} />
          </ul>
          <h3>{t('privacy.s5_2Title')}</h3>
          <p>{t('privacy.s5_2P')}</p>
          <div className="info-box">
            <p>&#128274; {t('privacy.s5Info')}</p>
          </div>
        </div>

        <div className="legal-section" id="conservation">
          <h2>{t('privacy.s6Title')}</h2>
          <ul>
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s6Li1') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s6Li2') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s6Li3') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s6Li4') }} />
          </ul>
        </div>

        <div className="legal-section" id="securite">
          <h2>{t('privacy.s7Title')}</h2>
          <p>{t('privacy.s7P')}</p>
          <ul>
            <li>{t('privacy.s7Li1')}</li>
            <li>{t('privacy.s7Li2')}</li>
            <li>{t('privacy.s7Li3')}</li>
            <li>{t('privacy.s7Li4')}</li>
            <li>{t('privacy.s7Li5')}</li>
          </ul>
        </div>

        <div className="legal-section" id="droits">
          <h2>{t('privacy.s8Title')}</h2>
          <p>{t('privacy.s8P1')}</p>
          <ul>
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s8Li1') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s8Li2') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s8Li3') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s8Li4') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s8Li5') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s8Li6') }} />
            <li dangerouslySetInnerHTML={{ __html: t('privacy.s8Li7') }} />
          </ul>
          <p>{t('privacy.s8P2')}<a href="mailto:privacy@monpetitconteur.app">privacy@monpetitconteur.app</a>{t('privacy.s8P2End')}</p>
          <p>{t('privacy.s8P3')}<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">{t('privacy.s8P3Link')}</a>{t('privacy.s8P3End')}</p>
        </div>

        <div className="legal-section" id="cookies">
          <h2>{t('privacy.s9Title')}</h2>
          <p>{t('privacy.s9P1')}</p>
          <ul>
            <li>{t('privacy.s9Li1')}</li>
            <li>{t('privacy.s9Li2')}</li>
            <li>{t('privacy.s9Li3')}</li>
          </ul>
          <p>{t('privacy.s9P2')}</p>
        </div>

        <div className="legal-section" id="transferts">
          <h2>{t('privacy.s10Title')}</h2>
          <p>{t('privacy.s10P')}</p>
          <ul>
            <li>{t('privacy.s10Li1')}</li>
            <li>{t('privacy.s10Li2')}</li>
          </ul>
        </div>

        <div className="legal-section" id="modifications">
          <h2>{t('privacy.s11Title')}</h2>
          <p>{t('privacy.s11P1')}</p>
          <ul>
            <li>{t('privacy.s11Li1')}</li>
            <li>{t('privacy.s11Li2')}</li>
            <li>{t('privacy.s11Li3')}</li>
          </ul>
          <p>{t('privacy.s11P2')}</p>
        </div>

        <div className="legal-section" id="contact-priv">
          <h2>{t('privacy.s12Title')}</h2>
          <p>{t('privacy.s12P1')}</p>
          <p>&#128231; <a href="mailto:privacy@monpetitconteur.app">privacy@monpetitconteur.app</a><br />
          &#128238; {t('privacy.s12Address')}</p>
          <p>{t('privacy.s12P2')}<Link href="/contact">{t('privacy.s12P2Link')}</Link>.</p>
        </div>
      </div>

      <SimpleFooter />
    </>
  )
}
