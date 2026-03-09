import { Link } from '@inertiajs/react'
import { useState } from 'react'

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="main-nav">
      <Link href="/" className="nav-logo">
        <div className="logo-icon">&#10024;</div>
        Contes Magiques
      </Link>
      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        <li><a href="#features">Fonctionnalites</a></li>
        <li><a href="#how">Comment ca marche</a></li>
        <li><a href="#pricing">Tarifs</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
      <a href="#download" className="nav-cta">Telecharger</a>
      <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </button>
    </nav>
  )
}

export function LegalNav() {
  return (
    <nav className="legal-nav">
      <Link href="/" className="nav-logo">
        <div className="logo-icon">&#10024;</div>
        Contes Magiques
      </Link>
      <Link href="/" className="nav-back">&larr; Retour a l'accueil</Link>
    </nav>
  )
}
