import { Link } from '@inertiajs/react'

export function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="nav-logo">
              <div className="logo-icon">&#10024;</div>
              Mon Petit Conteur
            </Link>
            <p>Des histoires personnalisees et magiques pour eveiller l'imagination de vos enfants, generees par intelligence artificielle.</p>
          </div>
          <div className="footer-col">
            <h4>Application</h4>
            <ul>
              <li><a href="#features">Fonctionnalites</a></li>
              <li><a href="#how">Comment ca marche</a></li>
              <li><a href="#pricing">Tarifs</a></li>
              <li><a href="#download">Telecharger</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/contact">Signaler un probleme</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Politique de confidentialite</Link></li>
              <li><Link href="/terms">Conditions d'utilisation</Link></li>
              <li><Link href="/terms#eula">Contrat de licence (EULA)</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Mon Petit Conteur. Tous droits reserves.</p>
          <div className="footer-legal">
            <Link href="/privacy">Confidentialite</Link>
            <Link href="/terms">CGU</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function SimpleFooter() {
  return (
    <footer className="simple-footer">
      <div>
        <Link href="/">Accueil</Link>
        <Link href="/privacy">Confidentialite</Link>
        <Link href="/terms">CGU</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <p>&copy; 2026 Mon Petit Conteur. Tous droits reserves.</p>
    </footer>
  )
}
