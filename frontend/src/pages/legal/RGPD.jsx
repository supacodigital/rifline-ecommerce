import { Link } from 'react-router-dom'
import s from './Legal.module.css'

export default function RGPD() {
  return (
    <div className={s.page}>
      <div className="container">
        <div className={s.hero}>
          <p className={s.label}>Règlement européen 2016/679</p>
          <h1 className={s.title}>Politique RGPD</h1>
          <p className={s.updated}>Dernière mise à jour : janvier 2025</p>
        </div>

        <div className={s.content}>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>1. Notre engagement</h2>
            <p>Rifline s'engage à respecter le Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) ainsi que la loi Informatique et Libertés modifiée. La protection de vos données personnelles est une priorité.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>2. Principes appliqués</h2>
            <p>Nous appliquons les principes fondamentaux du RGPD :</p>
            <ul>
              <li><strong>Licéité, loyauté, transparence :</strong> vos données sont traitées de manière légale et transparente</li>
              <li><strong>Limitation des finalités :</strong> vos données sont collectées pour des finalités déterminées et légitimes</li>
              <li><strong>Minimisation des données :</strong> seules les données strictement nécessaires sont collectées</li>
              <li><strong>Exactitude :</strong> vos données sont maintenues à jour</li>
              <li><strong>Limitation de la conservation :</strong> vos données ne sont pas conservées au-delà du nécessaire</li>
              <li><strong>Intégrité et confidentialité :</strong> vos données sont protégées par des mesures de sécurité adaptées</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>3. Vos droits</h2>
            <p>Le RGPD vous confère les droits suivants que vous pouvez exercer à tout moment :</p>
            <ul>
              <li><strong>Droit d'accès (art. 15) :</strong> obtenir confirmation que des données vous concernant sont traitées et en obtenir une copie</li>
              <li><strong>Droit de rectification (art. 16) :</strong> faire corriger des données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement (art. 17) :</strong> faire supprimer vos données dans certaines conditions</li>
              <li><strong>Droit à la limitation du traitement (art. 18) :</strong> faire limiter l'utilisation de vos données</li>
              <li><strong>Droit à la portabilité (art. 20) :</strong> recevoir vos données dans un format lisible par machine</li>
              <li><strong>Droit d'opposition (art. 21) :</strong> vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière</li>
              <li><strong>Droit de ne pas faire l'objet d'une décision automatisée :</strong> ne pas être soumis à une décision fondée exclusivement sur un traitement automatisé</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>4. Comment exercer vos droits</h2>
            <p>Pour exercer l'un de vos droits, contactez-nous par :</p>
            <ul>
              <li><strong>Email :</strong> <a href="mailto:rifline74@gmail.com">rifline74@gmail.com</a></li>
            </ul>
            <p>Votre demande sera traitée dans un délai d'un mois à compter de sa réception. Ce délai peut être prolongé de deux mois supplémentaires en cas de demande complexe ou nombreuse, après information de votre part.</p>
            <p>Nous pourrons vous demander de justifier de votre identité avant de traiter votre demande.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>5. Droit de réclamation</h2>
            <p>Si vous estimez que le traitement de vos données personnelles ne respecte pas la réglementation applicable, vous avez le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente :</p>
            <ul>
              <li><strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés)<br />3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07<br /><a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>6. Transferts hors UE</h2>
            <p>Aucune donnée personnelle n'est transférée vers des pays situés hors de l'Union Européenne sans garanties appropriées conformément au RGPD.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>7. Mise à jour</h2>
            <p>Cette politique RGPD peut être mise à jour à tout moment pour refléter les évolutions réglementaires ou nos pratiques. Nous vous informerons de toute modification substantielle par email ou via un avis sur le site.</p>
            <p>Pour plus de détails sur le traitement de vos données, consultez notre <Link to="/confidentialite">Politique de confidentialité</Link>.</p>
          </div>

        </div>
      </div>
    </div>
  )
}
