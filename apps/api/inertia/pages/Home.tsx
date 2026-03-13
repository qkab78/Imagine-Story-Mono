import { Head } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { AppleIcon } from '../components/AppleIcon'

function Stars() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    for (let i = 0; i < 20; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      const size = Math.random() * 4 + 2
      star.style.width = `${size}px`
      star.style.height = `${size}px`
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.animationDelay = `${Math.random() * 3}s`
      star.style.animationDuration = `${2 + Math.random() * 3}s`
      container.appendChild(star)
    }
  }, [])

  return <div className="hero-stars" ref={containerRef} />
}

function PhoneMockup() {
  const { t } = useTranslation()

  return (
    <div className="hero-visual">
      <div className="phone-glow" />
      <div className="phone-mockup">
        <div className="phone-screen">
          <div className="phone-notch" />
          <div className="screen-content">
            <div className="screen-greeting">
              {t('home.phoneMockup.greeting')} &#128075;
              <small>{t('home.phoneMockup.greetingSub')}</small>
            </div>
            <div className="screen-card">
              <div className="screen-card-icon">&#10024;</div>
              <div className="screen-card-text">
                <div className="screen-card-title">{t('home.phoneMockup.createStory')}</div>
                <div className="screen-card-sub">{t('home.phoneMockup.createStorySub')}</div>
              </div>
              <div className="screen-card-badge">4/5</div>
            </div>
            <div className="screen-card">
              <div className="screen-card-icon" style={{ background: 'linear-gradient(135deg,#2D6A4F,#4A9B6F)' }}>&#128214;</div>
              <div className="screen-card-text">
                <div className="screen-card-title">{t('home.phoneMockup.readStory')}</div>
                <div className="screen-card-sub">{t('home.phoneMockup.readStorySub')}</div>
              </div>
            </div>
            <div className="screen-section-title">&#10024; {t('home.phoneMockup.recentStories')}</div>
            <div className="screen-story-card">
              <div className="screen-story-title">{t('home.phoneMockup.story1')}</div>
              <div className="screen-story-meta">{t('home.phoneMockup.story1Meta')} <span className="screen-story-meta-right">{t('home.phoneMockup.story1Date')}</span></div>
            </div>
            <div className="screen-story-card">
              <div className="screen-story-title">{t('home.phoneMockup.story2')}</div>
              <div className="screen-story-meta">{t('home.phoneMockup.story2Meta')} <span className="screen-story-meta-right">{t('home.phoneMockup.story2Date')}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="floating-card floating-card-1">
        <span style={{ fontSize: 18 }}>&#127912;</span>
        <span>{t('home.phoneMockup.floatingCard1')}</span>
      </div>
      <div className="floating-card floating-card-2">
        <div className="fc-dot" />
        <span>{t('home.phoneMockup.floatingCard2')}</span>
      </div>
    </div>
  )
}

function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    { icon: '\uD83E\uDDB8', titleKey: 'step1Title', descKey: 'step1Desc' },
    { icon: '\uD83C\uDF0D', titleKey: 'step2Title', descKey: 'step2Desc' },
    { icon: '\uD83C\uDFA8', titleKey: 'step3Title', descKey: 'step3Desc' },
    { icon: '\uD83E\uDDED', titleKey: 'step4Title', descKey: 'step4Desc' },
    { icon: '\u2728', titleKey: 'step5Title', descKey: 'step5Desc' },
  ]

  return (
    <section className="how-bg" id="how">
      <div className="section-inner">
        <div className="section-label">{t('home.howItWorks.label')}</div>
        <h2 className="section-title" style={{ color: 'white' }}>{t('home.howItWorks.title')}</h2>
        <p className="section-sub">{t('home.howItWorks.subtitle')}</p>
        <div className="steps">
          {steps.map((step, i) => (
            <div className="step" key={i}>
              <div className="step-num">{step.icon}</div>
              <div className="step-title">{t(`home.howItWorks.${step.titleKey}`)}</div>
              <div className="step-desc">{t(`home.howItWorks.${step.descKey}`)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const { t } = useTranslation()

  const features = [
    { icon: '\uD83E\uDD16', titleKey: 'aiTitle', descKey: 'aiDesc', featured: true },
    { icon: '\uD83C\uDFA8', titleKey: 'stylesTitle', descKey: 'stylesDesc' },
    { icon: '\uD83C\uDF10', titleKey: 'multilingualTitle', descKey: 'multilingualDesc' },
    { icon: '\uD83D\uDCDA', titleKey: 'libraryTitle', descKey: 'libraryDesc' },
    { icon: '\uD83D\uDD14', titleKey: 'storyTimeTitle', descKey: 'storyTimeDesc' },
    { icon: '\uD83E\uDDD2', titleKey: 'ageTitle', descKey: 'ageDesc' },
  ]

  return (
    <section id="features">
      <div className="section-inner">
        <div className="section-label">{t('home.features.label')}</div>
        <h2 className="section-title">{t('home.features.title')}</h2>
        <p className="section-sub">{t('home.features.subtitle')}</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className={`feature-card${f.featured ? ' featured' : ''}`} key={i}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{t(`home.features.${f.titleKey}`)}</div>
              <div className="feature-desc">{t(`home.features.${f.descKey}`)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Screenshots() {
  const { t } = useTranslation()

  const screens = [
    { labelKey: 'home', image: '/images/screenshot-home.png' },
    { labelKey: 'explore', image: '/images/screenshot-explore.png' },
    { labelKey: 'heroStep', image: '/images/screenshot-hero-step.png' },
    { labelKey: 'recap', image: '/images/screenshot-recap.png' },
    { labelKey: 'profile', image: '/images/screenshot-profile.png' },
  ]

  return (
    <section className="screenshots">
      <div className="section-inner">
        <div className="section-label">{t('home.screenshots.label')}</div>
        <h2 className="section-title">{t('home.screenshots.title')}</h2>
        <p className="section-sub">{t('home.screenshots.subtitle')}</p>
        <div className="screenshots-scroll">
          {screens.map((s, i) => (
            <div className="screenshot-frame" key={i}>
              <div className="screenshot-screen">
                <img src={s.image} alt={t(`home.screenshots.${s.labelKey}`)} />
              </div>
              <div className="screenshot-label">{t(`home.screenshots.${s.labelKey}`)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const { t } = useTranslation()

  return (
    <section id="pricing">
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <div className="section-label">{t('home.pricing.label')}</div>
        <h2 className="section-title" style={{ margin: '0 auto 20px' }}>{t('home.pricing.title')}</h2>
        <p className="section-sub" style={{ margin: '0 auto' }}>{t('home.pricing.subtitle')}</p>
        <div className="pricing-grid">
          <div className="plan-card">
            <div className="plan-name">{t('home.pricing.free')}</div>
            <div className="plan-price">
              <span className="plan-price-num">{t('home.pricing.freePrice')}</span>
              <span className="plan-price-period">{t('home.pricing.perMonth')}</span>
            </div>
            <div className="plan-desc">{t('home.pricing.freeDesc')}</div>
            <ul className="plan-features">
              <li>{t('home.pricing.freeFeature1')}</li>
              <li>{t('home.pricing.freeFeature2')}</li>
              <li>{t('home.pricing.freeFeature3')}</li>
              <li>{t('home.pricing.freeFeature4')}</li>
            </ul>
            <a href="#download" className="plan-cta plan-cta-free">{t('home.pricing.startFree')}</a>
          </div>
          <div className="plan-card popular">
            <div className="plan-badge">&#10024; {t('home.pricing.popular')}</div>
            <div className="plan-name">{t('home.pricing.premium')}</div>
            <div className="plan-price">
              <span className="plan-price-num" style={{ color: 'var(--gold-light)' }}>{t('home.pricing.premiumPrice')}</span>
              <span className="plan-price-period">{t('home.pricing.perMonth')}</span>
            </div>
            <div className="plan-desc">{t('home.pricing.premiumDesc')}</div>
            <ul className="plan-features">
              <li>{t('home.pricing.premiumFeature1')}</li>
              <li>{t('home.pricing.premiumFeature2')}</li>
              <li>{t('home.pricing.premiumFeature3')}</li>
              <li>{t('home.pricing.premiumFeature4')}</li>
              <li>{t('home.pricing.premiumFeature5')}</li>
              <li>{t('home.pricing.premiumFeature6')}</li>
            </ul>
            <a href="#download" className="plan-cta plan-cta-premium">{t('home.pricing.goPremium')}</a>
          </div>
        </div>
        <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>{t('home.pricing.managedByAppStore')}</p>
      </div>
    </section>
  )
}

function Testimonials() {
  const { t } = useTranslation()

  const testimonials = [
    { textKey: 't1Text', nameKey: 't1Name', roleKey: 't1Role', avatar: '\uD83D\uDC69', bg: '#FDE8C0' },
    { textKey: 't2Text', nameKey: 't2Name', roleKey: 't2Role', avatar: '\uD83D\uDC68', bg: '#D4ECD4' },
    { textKey: 't3Text', nameKey: 't3Name', roleKey: 't3Role', avatar: '\uD83D\uDC69', bg: '#E0D4F5' },
  ]

  return (
    <section className="testimonials-bg">
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <div className="section-label">{t('home.testimonials.label')}</div>
        <h2 className="section-title" style={{ margin: '0 auto 10px' }}>{t('home.testimonials.title')}</h2>
        <p className="section-sub" style={{ margin: '0 auto' }}>{t('home.testimonials.subtitle')}</p>
        <div className="testimonials-grid">
          {testimonials.map((item, i) => (
            <div className="testimonial" key={i}>
              <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="testimonial-text">&laquo; {t(`home.testimonials.${item.textKey}`)} &raquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: item.bg }}>{item.avatar}</div>
                <div>
                  <div className="testimonial-name">{t(`home.testimonials.${item.nameKey}`)}</div>
                  <div className="testimonial-role">{t(`home.testimonials.${item.roleKey}`)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqKeys = [1, 2, 3, 4, 5, 6]

  return (
    <section id="faq">
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <div className="section-label">{t('home.faq.label')}</div>
        <h2 className="section-title" style={{ margin: '0 auto 10px' }}>{t('home.faq.title')}</h2>
        <p className="section-sub" style={{ margin: '0 auto' }}>{t('home.faq.subtitle')}</p>
        <div className="faq-list" style={{ textAlign: 'left' }}>
          {faqKeys.map((num, i) => (
            <div className={`faq-item${openIndex === i ? ' open' : ''}`} key={i}>
              <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                {t(`home.faq.q${num}`)}
                <span className="faq-toggle">+</span>
              </button>
              <div className="faq-answer">{t(`home.faq.a${num}`)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { t } = useTranslation()

  return (
    <section className="cta-section" id="download">
      <div className="section-inner">
        <h2 className="section-title">{t('home.cta.title')}</h2>
        <p className="section-sub">{t('home.cta.subtitle')}</p>
        <div className="cta-buttons">
          <a href="#" className="btn-appstore">
            <AppleIcon />
            {t('home.cta.downloadAppStore')}
          </a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { t } = useTranslation()

  return (
    <>
      <Head title={t('home.title')} />
      <Nav />

      <section className="hero">
        <div className="hero-bg" />
        <Stars />
        <div className="hero-inner">
          <div>
            <div className="hero-badge">&#10024; {t('home.heroBadge')}</div>
            <h1>{t('home.heroTitle1')}<em>{t('home.heroTitleEm')}</em>{t('home.heroTitle2')}</h1>
            <p className="hero-sub">{t('home.heroSub')}</p>
            <div className="hero-actions">
              <a href="#download" className="btn-primary">
                <AppleIcon />
                {t('home.downloadIos')}
              </a>
              <a href="#how" className="btn-secondary">{t('home.seeHow')} &rarr;</a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-num">{t('home.statStories')}</div>
                <div className="stat-label">{t('home.statStoriesLabel')}</div>
              </div>
              <div className="stat">
                <div className="stat-num">{t('home.statRating')}</div>
                <div className="stat-label">{t('home.statRatingLabel')}</div>
              </div>
              <div className="stat">
                <div className="stat-num">{t('home.statAge')}</div>
                <div className="stat-label">{t('home.statAgeLabel')}</div>
              </div>
            </div>
          </div>
          <PhoneMockup />
        </div>
      </section>

      <HowItWorks />
      <Features />
      <Screenshots />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </>
  )
}
