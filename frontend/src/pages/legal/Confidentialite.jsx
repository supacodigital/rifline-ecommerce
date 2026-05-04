import s from './Legal.module.css'

export default function Confidentialite() {
  return (
    <div className={s.page}>
      <div className="container">
        <div className={s.hero}>
          <p className={s.label}>Protection des données</p>
          <h1 className={s.title}>Politique de confidentialité</h1>
          <p className={s.updated}>Dernière mise à jour : janvier 2025</p>
        </div>

        <div className={s.content}>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>1. Responsable du traitement</h2>
            <p>Le responsable du traitement des données personnelles collectées sur le site <strong>rif-line.com</strong> est Rifline, dont le siège est situé à Oyonnax (01100), France.</p>
            <p>Pour toute question relative à vos données personnelles, vous pouvez nous contacter à l'adresse suivante : <a href="mailto:rifline74@gmail.com">rifline74@gmail.com</a></p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>2. Données collectées</h2>
            <p>Nous collectons les données personnelles suivantes :</p>
            <ul>
              <li><strong>Données d'identification :</strong> nom, prénom, adresse email</li>
              <li><strong>Données de livraison :</strong> adresse postale, numéro de téléphone</li>
              <li><strong>Données de connexion :</strong> adresse IP, logs de navigation</li>
              <li><strong>Données de transaction :</strong> historique des commandes, montants</li>
            </ul>
            <p>Aucune donnée bancaire n'est stockée sur nos serveurs. Les paiements sont traités de manière sécurisée par notre prestataire de paiement SumUp.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>3. Finalités du traitement</h2>
            <p>Vos données sont collectées pour les finalités suivantes :</p>
            <ul>
              <li>Gestion et suivi de vos commandes</li>
              <li>Livraison de vos achats</li>
              <li>Gestion de votre compte client</li>
              <li>Envoi de communications transactionnelles (confirmation de commande, expédition)</li>
              <li>Amélioration de nos services</li>
              <li>Respect de nos obligations légales et réglementaires</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>4. Base légale du traitement</h2>
            <p>Le traitement de vos données repose sur les bases légales suivantes :</p>
            <ul>
              <li><strong>Exécution du contrat :</strong> traitement nécessaire à la gestion de vos commandes</li>
              <li><strong>Obligation légale :</strong> conservation des données de facturation</li>
              <li><strong>Intérêt légitime :</strong> amélioration de nos services et prévention de la fraude</li>
              <li><strong>Consentement :</strong> pour toute communication marketing (si applicable)</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>5. Durée de conservation</h2>
            <ul>
              <li><strong>Données de compte :</strong> pendant toute la durée de votre relation commerciale avec Rifline, puis 3 ans après votre dernière commande</li>
              <li><strong>Données de facturation :</strong> 10 ans conformément aux obligations comptables</li>
              <li><strong>Données de connexion :</strong> 12 mois</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>6. Destinataires des données</h2>
            <p>Vos données peuvent être transmises aux tiers suivants dans le cadre strict de l'exécution de vos commandes :</p>
            <ul>
              <li><strong>Prestataire de paiement :</strong> SumUp (traitement sécurisé des paiements)</li>
              <li><strong>Transporteurs :</strong> Sendcloud, Mondial Relay, Colissimo (livraison)</li>
              <li><strong>Prestataire d'emails transactionnels :</strong> Brevo</li>
            </ul>
            <p>Aucune donnée n'est vendue ou cédée à des tiers à des fins commerciales.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>7. Vos droits</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès :</strong> obtenir une copie des données vous concernant</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit à la limitation :</strong> demander la limitation du traitement</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> vous opposer à certains traitements</li>
            </ul>
            <p>Pour exercer vos droits, contactez-nous à <a href="mailto:rifline74@gmail.com">rifline74@gmail.com</a>. Vous disposez également du droit d'introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>8. Cookies</h2>
            <p>Notre site utilise des cookies techniques strictement nécessaires au bon fonctionnement du site (session, panier). Ces cookies ne requièrent pas votre consentement.</p>
            <p>Aucun cookie publicitaire ou de traçage tiers n'est utilisé sans votre consentement préalable.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>9. Sécurité</h2>
            <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction. Les communications entre votre navigateur et nos serveurs sont chiffrées via le protocole HTTPS/TLS.</p>
          </div>

        </div>
      </div>
    </div>
  )
}
