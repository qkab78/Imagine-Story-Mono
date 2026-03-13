import { Head } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
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
  return (
    <div className="hero-visual">
      <div className="phone-glow" />
      <div className="phone-mockup">
        <div className="phone-screen">
          <div className="phone-notch" />
          <div className="screen-content">
            <div className="screen-greeting">
              Bonjour John ! &#128075;
              <small>Prete pour une nouvelle aventure ?</small>
            </div>
            <div className="screen-card">
              <div className="screen-card-icon">&#10024;</div>
              <div className="screen-card-text">
                <div className="screen-card-title">Creer une histoire</div>
                <div className="screen-card-sub">Invente une nouvelle aventure</div>
              </div>
              <div className="screen-card-badge">4/5</div>
            </div>
            <div className="screen-card">
              <div className="screen-card-icon" style={{ background: 'linear-gradient(135deg,#2D6A4F,#4A9B6F)' }}>&#128214;</div>
              <div className="screen-card-text">
                <div className="screen-card-title">Lire une histoire</div>
                <div className="screen-card-sub">Decouvre tes histoires</div>
              </div>
            </div>
            <div className="screen-section-title">&#10024; Histoires recentes</div>
            <div className="screen-story-card">
              <div className="screen-story-title">Mika, heros de la famille</div>
              <div className="screen-story-meta">3 chapitres <span className="screen-story-meta-right">Il y a 3j</span></div>
            </div>
            <div className="screen-story-card">
              <div className="screen-story-title">L'aventure de Jules</div>
              <div className="screen-story-meta">3 chapitres <span className="screen-story-meta-right">Aujourd'hui</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="floating-card floating-card-1">
        <span style={{ fontSize: 18 }}>&#127912;</span>
        <span>4 styles d'illustration</span>
      </div>
      <div className="floating-card floating-card-2">
        <div className="fc-dot" />
        <span>Genere en quelques secondes</span>
      </div>
    </div>
  )
}

function HowItWorks() {
  const steps = [
    { icon: '\uD83E\uDDB8', title: 'Nommez le heros', desc: 'Donnez un prenom, choisissez le type de personnage et la carnation.' },
    { icon: '\uD83C\uDF0D', title: 'Personnalisez', desc: "Choisissez la langue, l'age de l'enfant et le nombre de chapitres." },
    { icon: '\uD83C\uDFA8', title: 'Style visuel', desc: 'Doux & Magique, Disney/Pixar, Aquarelle ou Classique — votre choix.' },
    { icon: '\uD83E\uDDED', title: 'Theme & ambiance', desc: 'Courage, magie, amitie... Choisissez le ton : joyeux, calme, aventurier.' },
    { icon: '\u2728', title: 'Votre histoire', desc: "L'IA genere un conte illustre unique, pret a etre lu en quelques secondes." },
  ]

  return (
    <section className="how-bg" id="how">
      <div className="section-inner">
        <div className="section-label">Comment ca marche</div>
        <h2 className="section-title" style={{ color: 'white' }}>En 5 etapes, une histoire unique</h2>
        <p className="section-sub">De l'idee au conte illustre, notre assistant magique guide chaque etape pour creer une aventure parfaite.</p>
        <div className="steps">
          {steps.map((step, i) => (
            <div className="step" key={i}>
              <div className="step-num">{step.icon}</div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    { icon: '\uD83E\uDD16', title: 'IA generative avancee', desc: "Notre intelligence artificielle cree des histoires coherentes, educatives et captivantes, adaptees a l'age et aux preferences de votre enfant.", featured: true },
    { icon: '\uD83C\uDFA8', title: "4 styles d'illustration", desc: "Choisissez entre Doux & Magique (japonais pastel), Disney/Pixar (3D vibrant), Aquarelle ou Classique pour illustrer chaque histoire." },
    { icon: '\uD83C\uDF10', title: 'Multilingue', desc: "Generez des histoires en francais, anglais, arabe, japonais et bien d'autres langues pour une experience vraiment personnalisee." },
    { icon: '\uD83D\uDCDA', title: 'Bibliotheque personnelle', desc: "Toutes vos histoires creees sont sauvegardees dans une bibliotheque magnifique, prete a etre relue a tout moment." },
    { icon: '\uD83D\uDD14', title: 'Heure du conte', desc: "Configurez un rappel quotidien pour l'heure du conte. Une routine apaisante qui prepare votre enfant au sommeil." },
    { icon: '\uD83E\uDDD2', title: "Adapte par age", desc: "Le vocabulaire, la complexite narrative et les themes sont automatiquement ajustes selon l'age de l'enfant (3 a 12 ans)." },
  ]

  return (
    <section id="features">
      <div className="section-inner">
        <div className="section-label">Fonctionnalites</div>
        <h2 className="section-title">Tout pour une experience magique</h2>
        <p className="section-sub">Une application pensee pour les parents et les enfants, avec des fonctionnalites qui rendent chaque histoire speciale.</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className={`feature-card${f.featured ? ' featured' : ''}`} key={i}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Screenshots() {
  const screens = [
    { label: 'Accueil', image: '/images/screenshot-home.png' },
    { label: 'Explorer', image: '/images/screenshot-explore.png' },
    { label: 'Etape 1 : Heros', image: '/images/screenshot-hero-step.png' },
    { label: 'Recapitulatif', image: '/images/screenshot-recap.png' },
    { label: 'Profil', image: '/images/screenshot-profile.png' },
  ]

  return (
    <section className="screenshots">
      <div className="section-inner">
        <div className="section-label">L'application</div>
        <h2 className="section-title">Concue avec amour</h2>
        <p className="section-sub">Une interface chaleureuse et intuitive, pensee pour les parents comme pour les enfants.</p>
        <div className="screenshots-scroll">
          {screens.map((s, i) => (
            <div className="screenshot-frame" key={i}>
              <div className="screenshot-screen">
                <img src={s.image} alt={s.label} />
              </div>
              <div className="screenshot-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing">
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <div className="section-label">Tarifs</div>
        <h2 className="section-title" style={{ margin: '0 auto 20px' }}>Simple et transparent</h2>
        <p className="section-sub" style={{ margin: '0 auto' }}>Commencez gratuitement, passez a Premium quand vous voulez.</p>
        <div className="pricing-grid">
          <div className="plan-card">
            <div className="plan-name">Gratuit</div>
            <div className="plan-price">
              <span className="plan-price-num">0&#8364;</span>
              <span className="plan-price-period"> / mois</span>
            </div>
            <div className="plan-desc">Parfait pour decouvrir la magie des contes personnalises.</div>
            <ul className="plan-features">
              <li>5 histoires par mois</li>
              <li>3 styles d'illustration</li>
              <li>Bibliotheque personnelle</li>
              <li>Rappel heure du conte</li>
            </ul>
            <a href="#download" className="plan-cta plan-cta-free">Commencer gratuitement</a>
          </div>
          <div className="plan-card popular">
            <div className="plan-badge">&#10024; Populaire</div>
            <div className="plan-name">Premium</div>
            <div className="plan-price">
              <span className="plan-price-num" style={{ color: 'var(--gold-light)' }}>4,99&#8364;</span>
              <span className="plan-price-period"> / mois</span>
            </div>
            <div className="plan-desc">Des histoires illimitees et toutes les fonctionnalites exclusives.</div>
            <ul className="plan-features">
              <li>Histoires illimitees</li>
              <li>Tous les styles d'illustration</li>
              <li>Tous les themes & ambiances</li>
              <li>Histoires multilingues</li>
              <li>Acces a la bibliotheque Explorer</li>
              <li>Support prioritaire</li>
            </ul>
            <a href="#download" className="plan-cta plan-cta-premium">Passer a Premium</a>
          </div>
        </div>
        <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>Abonnement gere via App Store. Annulable a tout moment.</p>
      </div>
    </section>
  )
}

function Testimonials() {
  const testimonials = [
    {
      text: "Mon fils de 5 ans me demande une nouvelle histoire chaque soir. La personnalisation est bluffante — il reconnait ses jeux et ses passions dans l'histoire !",
      name: 'Marie L.',
      role: 'Maman de Lucas, 5 ans',
      avatar: '\uD83D\uDC69',
      bg: '#FDE8C0',
    },
    {
      text: "Les illustrations sont magnifiques ! J'ai choisi le style aquarelle et les images ressemblent a de vrais livres d'enfants de qualite.",
      name: 'Thomas P.',
      role: 'Papa de Lea, 7 ans',
      avatar: '\uD83D\uDC68',
      bg: '#D4ECD4',
    },
    {
      text: "L'histoire en arabe pour ma fille a ete parfaite. Elle a adore etre la superheroïne de l'histoire. Une app vraiment unique sur le marche.",
      name: 'Nadia K.',
      role: 'Maman de Yasmine, 6 ans',
      avatar: '\uD83D\uDC69',
      bg: '#E0D4F5',
    },
  ]

  return (
    <section className="testimonials-bg">
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <div className="section-label">Temoignages</div>
        <h2 className="section-title" style={{ margin: '0 auto 10px' }}>Des familles enchantees</h2>
        <p className="section-sub" style={{ margin: '0 auto' }}>Des milliers de familles creent chaque soir des histoires magiques.</p>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial" key={i}>
              <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="testimonial-text">&laquo; {t.text} &raquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: t.bg }}>{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
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
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: 'Comment sont generees les histoires ?', a: "Nos histoires sont creees grace a une intelligence artificielle specialement entrainee pour produire des contenus adaptes aux enfants. Chaque histoire est unique, generee a partir de vos choix (prenom, theme, age, ambiance) pour offrir une aventure vraiment personnalisee." },
    { q: "Le contenu est-il adapte et securise pour les enfants ?", a: "Absolument. Tous les contenus sont filtres et controles pour garantir qu'ils sont appropries, bienveillants et educatifs. Nous ne tolerons aucun contenu violent, effrayant ou inapproprie pour les enfants." },
    { q: "Puis-je annuler mon abonnement a tout moment ?", a: "Oui. L'abonnement Premium est gere directement par l'App Store d'Apple. Vous pouvez l'annuler a tout moment depuis les Reglages de votre iPhone, sans frais supplementaires. Vous conservez l'acces jusqu'a la fin de la periode payee." },
    { q: "Mes donnees et celles de mon enfant sont-elles protegees ?", a: "Oui. Nous respectons strictement le RGPD et ne collectons que les donnees necessaires au fonctionnement de l'application. Nous ne vendons jamais vos donnees." },
    { q: "Quelles langues sont disponibles ?", a: "Vous pouvez creer des histoires en francais, anglais, arabe, japonais, espagnol et d'autres langues. Nous ajoutons regulierement de nouvelles langues en fonction des demandes de notre communaute." },
    { q: "Combien de temps faut-il pour generer une histoire ?", a: "Une histoire complete avec illustrations est generee en quelques secondes a quelques minutes selon votre connexion internet. Vous pouvez suivre la progression directement dans l'application." },
  ]

  return (
    <section id="faq">
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <div className="section-label">FAQ</div>
        <h2 className="section-title" style={{ margin: '0 auto 10px' }}>Questions frequentes</h2>
        <p className="section-sub" style={{ margin: '0 auto' }}>Tout ce que vous devez savoir sur Mon Petit Conteur.</p>
        <div className="faq-list" style={{ textAlign: 'left' }}>
          {faqs.map((faq, i) => (
            <div className={`faq-item${openIndex === i ? ' open' : ''}`} key={i}>
              <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                {faq.q}
                <span className="faq-toggle">+</span>
              </button>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="cta-section" id="download">
      <div className="section-inner">
        <h2 className="section-title">Creez votre premiere histoire magique</h2>
        <p className="section-sub">Rejoignez des milliers de familles qui offrent chaque soir a leurs enfants une aventure unique et personnalisee.</p>
        <div className="cta-buttons">
          <a href="#" className="btn-appstore">
            <AppleIcon />
            Telecharger sur App Store
          </a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Head title="Des histoires personnalisees pour vos enfants" />
      <Nav />

      <section className="hero">
        <div className="hero-bg" />
        <Stars />
        <div className="hero-inner">
          <div>
            <div className="hero-badge">&#10024; Histoires generees par IA</div>
            <h1>Des histoires <em>magiques</em> pour votre enfant</h1>
            <p className="hero-sub">Creez en quelques minutes des contes personnalises ou votre enfant est le heros. Illustrations uniques, themes educatifs, aventures inoubliables.</p>
            <div className="hero-actions">
              <a href="#download" className="btn-primary">
                <AppleIcon />
                Telecharger sur iOS
              </a>
              <a href="#how" className="btn-secondary">Voir comment ca marche &rarr;</a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-num">5 000+</div>
                <div className="stat-label">Histoires creees</div>
              </div>
              <div className="stat">
                <div className="stat-num">4.8&#9733;</div>
                <div className="stat-label">Note App Store</div>
              </div>
              <div className="stat">
                <div className="stat-num">3&ndash;12</div>
                <div className="stat-label">Ans, adapte par age</div>
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
