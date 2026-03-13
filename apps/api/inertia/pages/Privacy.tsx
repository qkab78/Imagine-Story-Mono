import { Head, Link } from '@inertiajs/react'
import { LegalNav } from '../components/Nav'
import { SimpleFooter } from '../components/Footer'

export default function Privacy() {
  return (
    <>
      <Head title="Politique de confidentialite" />
      <LegalNav />

      <div className="hero-legal">
        <div className="hero-legal-inner">
          <div className="legal-label">Legal</div>
          <h1>Politique de confidentialite</h1>
          <p>Nous prenons la protection de vos donnees et celles de vos enfants tres au serieux. Cette politique vous explique quelles donnees nous collectons, pourquoi, et comment vous les controlez.</p>
          <div className="last-updated">&#128197; Derniere mise a jour : 9 mars 2026</div>
        </div>
      </div>

      <div className="legal-body">
        <div className="toc">
          <h2>Table des matieres</h2>
          <ol>
            <li><a href="#responsable">Responsable du traitement</a></li>
            <li><a href="#donnees">Donnees collectees</a></li>
            <li><a href="#enfants">Protection des donnees des enfants</a></li>
            <li><a href="#finalites">Finalites du traitement</a></li>
            <li><a href="#partage">Partage des donnees</a></li>
            <li><a href="#conservation">Duree de conservation</a></li>
            <li><a href="#securite">Securite des donnees</a></li>
            <li><a href="#droits">Vos droits</a></li>
            <li><a href="#cookies">Cookies et technologies similaires</a></li>
            <li><a href="#transferts">Transferts internationaux</a></li>
            <li><a href="#modifications">Modifications</a></li>
            <li><a href="#contact-priv">Contact</a></li>
          </ol>
        </div>

        <div className="info-box">
          <p>&#128203; <strong>Resume :</strong> Nous collectons uniquement ce qui est necessaire au fonctionnement de l'application. Nous ne vendons jamais vos donnees. Vos donnees d'enfants sont particulierement protegees et ne sont jamais utilisees a des fins publicitaires.</p>
        </div>

        <div className="legal-section" id="responsable">
          <h2>1. Responsable du traitement</h2>
          <p>Le responsable du traitement des donnees personnelles collectees via l'application <strong>Contes Magiques</strong> est :</p>
          <p><strong>Contes Magiques</strong><br />
          [Nom de la societe / Nom du developpeur]<br />
          [Adresse postale complete]<br />
          Email : <a href="mailto:privacy@contesmagiques.app">privacy@contesmagiques.app</a></p>
        </div>

        <div className="legal-section" id="donnees">
          <h2>2. Donnees collectees</h2>
          <h3>2.1 Donnees de compte</h3>
          <p>Lors de la creation d'un compte, nous collectons :</p>
          <ul>
            <li>Adresse e-mail (obligatoire)</li>
            <li>Prenom et nom (facultatif)</li>
            <li>Mot de passe (stocke sous forme chiffree)</li>
          </ul>
          <h3>2.2 Donnees de profil enfant</h3>
          <p>Pour personnaliser les histoires, vous nous fournissez :</p>
          <ul>
            <li>Prenom du heros (peut etre un prenom fictif)</li>
            <li>Age de l'enfant</li>
            <li>Preferences de personnage (type, teint de peau)</li>
          </ul>
          <div className="warning-box">
            <p>&#9888;&#65039; Nous vous deconseillons de saisir le vrai prenom ou de fournir des informations d'identification directe de votre enfant. Vous pouvez utiliser un surnom ou un prenom fictif.</p>
          </div>
          <h3>2.3 Donnees d'utilisation</h3>
          <ul>
            <li>Histoires creees et leurs parametres (theme, langue, style)</li>
            <li>Logs d'utilisation de l'application (pages visitees, fonctionnalites utilisees)</li>
            <li>Donnees de performance et d'erreurs (crash reports anonymises)</li>
          </ul>
          <h3>2.4 Donnees d'abonnement</h3>
          <p>Les paiements sont traites exclusivement par Apple via l'App Store. Nous recevons uniquement la confirmation de l'abonnement, sans donnees bancaires.</p>
          <h3>2.5 Donnees techniques</h3>
          <ul>
            <li>Type d'appareil et version iOS</li>
            <li>Identifiant publicitaire (IDFA) — uniquement avec votre consentement explicite</li>
            <li>Adresse IP (anonymisee)</li>
          </ul>
        </div>

        <div className="legal-section" id="enfants">
          <h2>3. Protection des donnees des enfants</h2>
          <p>Notre application est destinee aux <strong>parents</strong> qui creent des histoires pour leurs enfants. L'application n'est pas destinee a etre utilisee directement par des enfants de moins de 13 ans sans supervision parentale.</p>
          <p>Concernant les donnees relatives aux enfants :</p>
          <ul>
            <li>Nous collectons uniquement le prenom et l'age, dans le seul but de personnaliser l'histoire</li>
            <li>Ces donnees ne sont <strong>jamais</strong> utilisees a des fins publicitaires, de profilage ou partagees avec des tiers a des fins commerciales</li>
            <li>Nous respectons le reglement general sur la protection des donnees (RGPD) et la loi COPPA (Children's Online Privacy Protection Act)</li>
            <li>Les parents peuvent demander la suppression de toutes les donnees associees a leur enfant a tout moment</li>
          </ul>
          <div className="info-box">
            <p>&#9989; <strong>Conformite Apple :</strong> Notre application respecte les directives d'Apple relatives aux applications pour enfants (section 1.3 des App Store Review Guidelines).</p>
          </div>
        </div>

        <div className="legal-section" id="finalites">
          <h2>4. Finalites du traitement</h2>
          <p>Vos donnees sont traitees pour les finalites suivantes :</p>
          <ul>
            <li><strong>Fourniture du service :</strong> Creation et stockage des histoires personnalisees (base legale : execution du contrat)</li>
            <li><strong>Personnalisation :</strong> Adapter le contenu a l'age et aux preferences (base legale : execution du contrat)</li>
            <li><strong>Communication :</strong> Envoi de notifications de rappel heure du conte si activees (base legale : consentement)</li>
            <li><strong>Amelioration du service :</strong> Analyse anonymisee de l'utilisation (base legale : interet legitime)</li>
            <li><strong>Securite :</strong> Detection de fraudes et protection de l'integrite du service (base legale : interet legitime)</li>
            <li><strong>Obligations legales :</strong> Respect des obligations legales applicables (base legale : obligation legale)</li>
          </ul>
        </div>

        <div className="legal-section" id="partage">
          <h2>5. Partage des donnees</h2>
          <p>Nous ne vendons jamais vos donnees personnelles. Nous les partageons uniquement dans les cas suivants :</p>
          <h3>5.1 Prestataires techniques</h3>
          <ul>
            <li><strong>Hebergement cloud :</strong> Stockage securise des donnees (serveurs en Europe)</li>
            <li><strong>API d'intelligence artificielle :</strong> Generation du contenu des histoires (les donnees transmises sont anonymisees)</li>
            <li><strong>Outils d'analyse :</strong> Statistiques d'utilisation anonymisees</li>
          </ul>
          <h3>5.2 Obligations legales</h3>
          <p>Nous pouvons divulguer des informations si la loi l'exige, notamment pour repondre a une decision judiciaire ou une demande d'autorite competente.</p>
          <div className="info-box">
            <p>&#128274; Tous nos prestataires sont contractuellement tenus de proteger vos donnees et de ne les utiliser qu'aux fins definies.</p>
          </div>
        </div>

        <div className="legal-section" id="conservation">
          <h2>6. Duree de conservation</h2>
          <ul>
            <li><strong>Donnees de compte :</strong> Conservees pendant toute la duree du compte, puis supprimees dans les 30 jours suivant la fermeture</li>
            <li><strong>Histoires creees :</strong> Conservees tant que le compte est actif. Vous pouvez les supprimer a tout moment.</li>
            <li><strong>Logs techniques :</strong> 90 jours maximum</li>
            <li><strong>Donnees de facturation :</strong> 10 ans (obligation comptable legale)</li>
          </ul>
        </div>

        <div className="legal-section" id="securite">
          <h2>7. Securite des donnees</h2>
          <p>Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees pour proteger vos donnees :</p>
          <ul>
            <li>Chiffrement des donnees en transit (HTTPS/TLS)</li>
            <li>Chiffrement des donnees au repos</li>
            <li>Acces restreint aux donnees aux seules personnes autorisees</li>
            <li>Audits de securite reguliers</li>
            <li>Procedure de notification en cas de violation de donnees (72h maximum)</li>
          </ul>
        </div>

        <div className="legal-section" id="droits">
          <h2>8. Vos droits</h2>
          <p>Conformement au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'acces :</strong> Obtenir une copie de vos donnees personnelles</li>
            <li><strong>Droit de rectification :</strong> Corriger des donnees inexactes</li>
            <li><strong>Droit a l'effacement :</strong> Demander la suppression de vos donnees ("droit a l'oubli")</li>
            <li><strong>Droit a la portabilite :</strong> Recevoir vos donnees dans un format structure</li>
            <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos donnees a des fins de marketing</li>
            <li><strong>Droit a la limitation :</strong> Demander la limitation du traitement dans certaines circonstances</li>
            <li><strong>Retrait du consentement :</strong> Retirer votre consentement a tout moment</li>
          </ul>
          <p>Pour exercer ces droits, contactez-nous a : <a href="mailto:privacy@contesmagiques.app">privacy@contesmagiques.app</a>. Nous repondrons dans un delai de 30 jours.</p>
          <p>Vous avez egalement le droit d'introduire une reclamation aupres de votre autorite de controle nationale (en France : la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>).</p>
        </div>

        <div className="legal-section" id="cookies">
          <h2>9. Cookies et technologies similaires</h2>
          <p>L'application mobile n'utilise pas de cookies. Des technologies similaires (stockage local) peuvent etre utilisees pour :</p>
          <ul>
            <li>Maintenir votre session de connexion</li>
            <li>Memoriser vos preferences d'affichage</li>
            <li>Ameliorer les performances de l'application</li>
          </ul>
          <p>Ce site web (landing page) peut utiliser des cookies analytiques anonymises pour mesurer l'audience. Vous pouvez les refuser via les parametres de votre navigateur.</p>
        </div>

        <div className="legal-section" id="transferts">
          <h2>10. Transferts internationaux de donnees</h2>
          <p>Vos donnees sont hebergees principalement en Europe (UE/EEE). Si des transferts vers des pays tiers sont necessaires (ex : certains services d'IA), ils sont encadres par des garanties appropriees :</p>
          <ul>
            <li>Clauses contractuelles types approuvees par la Commission europeenne</li>
            <li>Certification Privacy Shield ou equivalent</li>
          </ul>
        </div>

        <div className="legal-section" id="modifications">
          <h2>11. Modifications de cette politique</h2>
          <p>Nous pouvons mettre a jour cette politique de confidentialite. En cas de modifications significatives, nous vous en informerons par :</p>
          <ul>
            <li>Notification push dans l'application</li>
            <li>Email a l'adresse de votre compte</li>
            <li>Banniere visible dans l'application</li>
          </ul>
          <p>La date de la derniere mise a jour est indiquee en haut de cette page. Votre utilisation continue de l'application apres notification vaut acceptation des modifications.</p>
        </div>

        <div className="legal-section" id="contact-priv">
          <h2>12. Contact</h2>
          <p>Pour toute question relative a vos donnees personnelles ou pour exercer vos droits, contactez notre Delegue a la Protection des Donnees (DPO) :</p>
          <p>&#128231; <a href="mailto:privacy@contesmagiques.app">privacy@contesmagiques.app</a><br />
          &#128238; [Nom de la societe], [Adresse], [Code postal] [Ville], France</p>
          <p>Ou utilisez notre <Link href="/contact">formulaire de contact</Link>.</p>
        </div>
      </div>

      <SimpleFooter />
    </>
  )
}
