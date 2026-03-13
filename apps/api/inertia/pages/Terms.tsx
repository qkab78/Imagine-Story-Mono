import { Head, Link } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { LegalNav } from '../components/Nav'
import { SimpleFooter } from '../components/Footer'

function CGUContent() {
  return (
    <div className="legal-body">
      <div className="info-box">
        <p>&#128203; <strong>Resume :</strong> Mon Petit Conteur est reserve aux personnes majeures agissant pour leurs enfants. Le contenu genere est a usage personnel et familial uniquement. L'abonnement est gere par Apple.</p>
      </div>

      <div className="toc">
        <h2>Table des matieres</h2>
        <ol>
          <li><a href="#acceptation">Acceptation des conditions</a></li>
          <li><a href="#description">Description du service</a></li>
          <li><a href="#compte">Creation de compte</a></li>
          <li><a href="#abonnement">Abonnement et facturation</a></li>
          <li><a href="#contenu">Contenu genere</a></li>
          <li><a href="#usage">Utilisation acceptable</a></li>
          <li><a href="#pi">Propriete intellectuelle</a></li>
          <li><a href="#responsabilite">Limitation de responsabilite</a></li>
          <li><a href="#resiliation">Resiliation</a></li>
          <li><a href="#droit">Droit applicable</a></li>
        </ol>
      </div>

      <div className="legal-section" id="acceptation">
        <h2>1. Acceptation des conditions</h2>
        <p>En telechargeant, installant ou utilisant l'application Mon Petit Conteur, vous acceptez d'etre lie par les presentes Conditions Generales d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser l'application.</p>
        <p>Ces CGU s'appliquent conjointement avec notre <Link href="/privacy">Politique de confidentialite</Link> et notre Contrat de licence utilisateur final (EULA) accessible via l'onglet ci-dessus.</p>
        <div className="warning-box">
          <p>&#9888;&#65039; L'application est reservee aux personnes de <strong>18 ans ou plus</strong>. Les mineurs peuvent utiliser l'application sous la supervision directe d'un parent ou tuteur legal.</p>
        </div>
      </div>

      <div className="legal-section" id="description">
        <h2>2. Description du service</h2>
        <p>Mon Petit Conteur est une application mobile disponible sur iOS permettant de :</p>
        <ul>
          <li>Creer des histoires personnalisees pour enfants via intelligence artificielle</li>
          <li>Choisir des parametres de personnalisation (heros, theme, langue, style visuel)</li>
          <li>Stocker et consulter une bibliotheque d'histoires creees</li>
          <li>Explorer des histoires communautaires (avec abonnement Premium)</li>
          <li>Recevoir des rappels pour l'heure du conte</li>
        </ul>
        <p>Nous nous reservons le droit de modifier, suspendre ou interrompre tout ou partie du service avec un preavis raisonnable, sauf urgence.</p>
      </div>

      <div className="legal-section" id="compte">
        <h2>3. Creation de compte</h2>
        <p>Pour acceder au service, vous devez creer un compte en fournissant des informations exactes et a jour. Vous etes responsable de :</p>
        <ul>
          <li>La confidentialite de vos identifiants de connexion</li>
          <li>Toutes les activites effectuees depuis votre compte</li>
          <li>Nous notifier immediatement de toute utilisation non autorisee</li>
        </ul>
        <p>Un seul compte par personne est autorise. La creation de comptes multiples pour contourner les limitations est interdite.</p>
      </div>

      <div className="legal-section" id="abonnement">
        <h2>4. Abonnement et facturation</h2>
        <h3>4.1 Offre gratuite</h3>
        <p>L'offre gratuite inclut la creation de 5 histoires par mois. Les histoires non utilisees ne sont pas reportees au mois suivant.</p>
        <h3>4.2 Abonnement Premium</h3>
        <p>L'abonnement Premium est disponible a un tarif mensuel ou annuel. Il donne acces a des histoires illimitees et toutes les fonctionnalites avancees.</p>
        <h3>4.3 Gestion via App Store</h3>
        <p>L'abonnement est entierement gere par Apple via l'App Store. La facturation, le renouvellement et l'annulation se font conformement aux conditions d'Apple. Pour annuler :</p>
        <ol>
          <li>Ouvrez les Reglages de votre iPhone</li>
          <li>Appuyez sur votre identifiant Apple &gt; Abonnements</li>
          <li>Selectionnez Mon Petit Conteur et annulez l'abonnement</li>
        </ol>
        <p>L'annulation prend effet a la fin de la periode en cours. Aucun remboursement n'est accorde pour la periode deja payee, sauf si Apple en decide autrement conformement a ses politiques.</p>
        <h3>4.4 Renouvellement automatique</h3>
        <p>L'abonnement se renouvelle automatiquement sauf annulation au moins 24 heures avant la fin de la periode en cours.</p>
        <h3>4.5 Modifications de prix</h3>
        <p>Nous nous reservons le droit de modifier les tarifs avec un preavis d'au moins 30 jours. Les modifications s'appliquent au renouvellement suivant la notification.</p>
      </div>

      <div className="legal-section" id="contenu">
        <h2>5. Contenu genere</h2>
        <h3>5.1 Propriete du contenu</h3>
        <p>Les histoires creees a partir de vos parametres vous appartiennent pour un usage personnel et familial. Mon Petit Conteur conserve une licence non-exclusive pour ameliorer ses services (de maniere anonymisee).</p>
        <h3>5.2 Qualite du contenu</h3>
        <p>Bien que nous fassions tous nos efforts pour garantir la qualite et la pertinence des histoires generees, le contenu est produit par intelligence artificielle et peut contenir des imperfections. Nous ne garantissons pas que chaque histoire sera parfaitement adaptee a votre enfant.</p>
        <h3>5.3 Signalement de contenu inapproprie</h3>
        <p>Si une histoire contient du contenu qui vous semble inapproprie, vous pouvez le signaler via la fonctionnalite de signalement integree ou en nous contactant a <a href="mailto:support@monpetitconteur.app">support@monpetitconteur.app</a>.</p>
      </div>

      <div className="legal-section" id="usage">
        <h2>6. Utilisation acceptable</h2>
        <p>Il est <strong>interdit</strong> de :</p>
        <ul>
          <li>Utiliser l'application a des fins commerciales sans autorisation ecrite</li>
          <li>Tenter de contourner les limitations techniques ou de securite</li>
          <li>Scraper, extraire ou reproduire en masse le contenu</li>
          <li>Creer du contenu violent, haineux, sexuel ou illegal</li>
          <li>Usurper l'identite d'autres utilisateurs</li>
          <li>Partager vos identifiants avec des tiers</li>
          <li>Utiliser des moyens automatises pour acceder au service</li>
        </ul>
      </div>

      <div className="legal-section" id="pi">
        <h2>7. Propriete intellectuelle</h2>
        <p>L'application, son interface, son logo, ses textes, ses illustrations de l'interface (hors contenu genere) sont proteges par le droit d'auteur et appartiennent a Mon Petit Conteur.</p>
        <p>Vous ne pouvez pas copier, modifier, distribuer ou creer des oeuvres derivees de l'application sans autorisation prealable ecrite.</p>
      </div>

      <div className="legal-section" id="responsabilite">
        <h2>8. Limitation de responsabilite</h2>
        <p>Mon Petit Conteur est fourni "en l'etat". Dans les limites permises par la loi applicable :</p>
        <ul>
          <li>Nous ne garantissons pas la disponibilite continue et ininterrompue du service</li>
          <li>Nous ne sommes pas responsables des dommages indirects resultant de l'utilisation de l'application</li>
          <li>Notre responsabilite totale est limitee au montant paye pour l'abonnement au cours des 3 derniers mois</li>
        </ul>
        <div className="info-box">
          <p>&#8505;&#65039; Certaines juridictions n'autorisent pas la limitation de responsabilite pour certains types de dommages. Ces limitations ne s'appliquent pas dans ces cas.</p>
        </div>
      </div>

      <div className="legal-section" id="resiliation">
        <h2>9. Resiliation</h2>
        <p>Vous pouvez resilier votre compte a tout moment depuis les parametres de l'application ou en nous contactant. Nous nous reservons le droit de suspendre ou resilier votre compte en cas de violation grave des presentes CGU.</p>
        <p>En cas de resiliation, vos histoires peuvent etre exportees sur demande dans les 30 jours suivant la resiliation. Passe ce delai, elles seront definitivement supprimees.</p>
      </div>

      <div className="legal-section" id="droit">
        <h2>10. Droit applicable et litiges</h2>
        <p>Les presentes CGU sont regies par le droit francais. En cas de litige, une solution amiable sera recherchee en priorite. A defaut, les tribunaux competents de [Ville] seront seuls competents.</p>
        <p>Pour les consommateurs residant dans l'UE, vous pouvez recourir a la plateforme de resolution des litiges en ligne de la Commission europeenne : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.</p>
      </div>
    </div>
  )
}

function EULAContent() {
  return (
    <div className="legal-body" id="eula">
      <div className="warning-box">
        <p>&#9888;&#65039; <strong>Contrat de licence utilisateur final (EULA)</strong> — Ce contrat est requis par Apple pour toutes les applications distribuees sur l'App Store. Il regit votre utilisation de l'application en tant que logiciel.</p>
      </div>

      <div className="legal-section">
        <h2>Contrat de Licence Utilisateur Final (EULA)</h2>
        <p>Ce Contrat de Licence Utilisateur Final (&laquo; EULA &raquo;) est conclu entre vous et <strong>Mon Petit Conteur</strong> (&laquo; le Concedant &raquo;) concernant votre utilisation de l'application mobile Mon Petit Conteur (&laquo; l'Application &raquo;).</p>
        <p>En telechargeant ou en utilisant l'Application, vous acceptez d'etre lie par les termes du present EULA. Si vous n'acceptez pas ces termes, ne telechargez pas et n'utilisez pas l'Application.</p>
        <p><strong>Note :</strong> Cet EULA complete et ne remplace pas les conditions d'utilisation de l'App Store d'Apple, auxquelles vous avez egalement accepte de vous conformer.</p>
      </div>

      <div className="legal-section">
        <h2>1. Octroi de licence</h2>
        <p>Le Concedant vous accorde une licence personnelle, limitee, non exclusive, non transferable et revocable pour :</p>
        <ul>
          <li>Telecharger et installer l'Application sur tout appareil Apple (iOS) que vous possedez ou controlez</li>
          <li>Utiliser l'Application a des fins personnelles et non commerciales</li>
          <li>Utiliser l'Application conformement aux regles d'utilisation definies dans les Conditions d'utilisation de l'App Store d'Apple</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>2. Restrictions</h2>
        <p>Vous vous engagez a ne pas :</p>
        <ul>
          <li>Louer, preter, vendre, redistribuer ou sous-licencier l'Application</li>
          <li>Copier, decompiler, effectuer de l'ingenierie inverse, desassembler, tenter de deriver le code source, modifier ou creer des oeuvres derivees de l'Application</li>
          <li>Utiliser l'Application pour creer un produit ou service concurrent</li>
          <li>Supprimer ou alterer tout avis de propriete sur l'Application</li>
          <li>Utiliser l'Application d'une maniere pouvant endommager, desactiver ou alterer les serveurs ou reseaux</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>3. Collecte et utilisation des donnees</h2>
        <p>L'Application collecte des donnees conformement a notre <Link href="/privacy">Politique de confidentialite</Link>. En utilisant l'Application, vous consentez a cette collecte et utilisation.</p>
      </div>

      <div className="legal-section">
        <h2>4. Mises a jour</h2>
        <p>Le Concedant peut, a sa discretion, fournir des mises a jour de l'Application. Les mises a jour peuvent etre automatiquement telechargees et installees si cette option est activee sur votre appareil. Ces mises a jour peuvent modifier des fonctionnalites existantes ou en ajouter de nouvelles, et peuvent etre soumises a des conditions supplementaires.</p>
      </div>

      <div className="legal-section">
        <h2>5. Services tiers</h2>
        <p>L'Application peut utiliser des services tiers (API d'intelligence artificielle, services d'hebergement, etc.) qui ont leurs propres conditions d'utilisation. Vous acceptez de vous conformer a ces conditions dans le cadre de votre utilisation de l'Application.</p>
      </div>

      <div className="legal-section">
        <h2>6. Relation avec Apple</h2>
        <p>Vous reconnaissez et acceptez que :</p>
        <ul>
          <li>Cet EULA est conclu entre vous et le Concedant, et non avec Apple Inc.</li>
          <li>Apple n'est pas responsable de l'Application ni de son contenu</li>
          <li>Apple n'a aucune obligation de fournir des services de maintenance ou d'assistance pour l'Application</li>
          <li>En cas de non-conformite de l'Application avec les garanties applicables, vous pouvez notifier Apple, qui remboursera alors le prix d'achat le cas echeant. Dans les limites permises par la loi, Apple n'a aucune autre obligation de garantie</li>
          <li>Apple n'est pas responsable des reclamations de tiers relatives a l'Application ou a votre possession/utilisation de l'Application</li>
          <li>Apple n'est pas responsable de l'examen ou du reglement des reclamations relatives a la propriete intellectuelle</li>
          <li>Apple et ses filiales sont des beneficiaires tiers du present EULA et, des votre acceptation, Apple aura le droit (et sera repute avoir accepte ce droit) de faire respecter cet EULA contre vous en tant que beneficiaire tiers</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>7. Garanties et exclusions</h2>
        <p>L'APPLICATION EST FOURNIE &laquo; EN L'ETAT &raquo; ET &laquo; TELLE QUE DISPONIBLE &raquo;, SANS GARANTIE D'AUCUNE SORTE. DANS LES LIMITES PERMISES PAR LA LOI APPLICABLE, LE CONCEDANT EXCLUT TOUTES LES GARANTIES, EXPRESSES OU IMPLICITES.</p>
      </div>

      <div className="legal-section">
        <h2>8. Limitation de responsabilite</h2>
        <p>Dans les limites permises par la loi applicable, le Concedant ne sera en aucun cas responsable des dommages indirects, accessoires, speciaux, consecutifs ou punitifs decoulant de l'utilisation ou de l'impossibilite d'utiliser l'Application.</p>
      </div>

      <div className="legal-section">
        <h2>9. Resiliation</h2>
        <p>Cet EULA est en vigueur jusqu'a resiliation. Vos droits en vertu de cet EULA prennent fin automatiquement sans preavis si vous ne respectez pas l'une de ses dispositions. A la resiliation, vous devez cesser toute utilisation de l'Application et detruire toutes les copies en votre possession.</p>
      </div>

      <div className="legal-section">
        <h2>10. Droit applicable</h2>
        <p>Cet EULA est regi par les lois de la Republique francaise, independamment de tout conflit de principes juridiques. Vous consentez a la juridiction exclusive des tribunaux francais.</p>
      </div>

      <div className="legal-section">
        <h2>11. Contact</h2>
        <p>Pour toute question relative a cet EULA, contactez :</p>
        <p>&#128231; <a href="mailto:legal@monpetitconteur.app">legal@monpetitconteur.app</a></p>
      </div>
    </div>
  )
}

export default function Terms() {
  const [activeTab, setActiveTab] = useState<'cgu' | 'eula'>('cgu')

  useEffect(() => {
    if (window.location.hash === '#eula') {
      setActiveTab('eula')
    }
  }, [])

  return (
    <>
      <Head title="Conditions d'utilisation & EULA" />
      <LegalNav />

      <div className="hero-legal">
        <div className="hero-legal-inner">
          <div className="legal-label">Legal</div>
          <h1>Conditions d'utilisation & EULA</h1>
          <p>En utilisant Mon Petit Conteur, vous acceptez les presentes conditions. Veuillez les lire attentivement.</p>
          <div className="last-updated">&#128197; Derniere mise a jour : 9 mars 2026</div>
        </div>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn${activeTab === 'cgu' ? ' active' : ''}`} onClick={() => setActiveTab('cgu')}>
          Conditions d'utilisation (CGU)
        </button>
        <button className={`tab-btn${activeTab === 'eula' ? ' active' : ''}`} onClick={() => setActiveTab('eula')}>
          Licence (EULA)
        </button>
      </div>

      {activeTab === 'cgu' ? <CGUContent /> : <EULAContent />}

      <SimpleFooter />
    </>
  )
}
