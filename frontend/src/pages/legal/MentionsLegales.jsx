import s from './Legal.module.css'

export default function MentionsLegales() {
  return (
    <div className={s.page}>
      <div className="container">
        <div className={s.hero}>
          <p className={s.label}>Informations légales</p>
          <h1 className={s.title}>Mentions légales</h1>
          <p className={s.updated}>Dernière mise à jour : janvier 2025</p>
        </div>

        <div className={s.content}>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>1. Éditeur du site</h2>
            <p>Le site <strong>rif-line.com</strong> est édité par :</p>
            <ul>
              <li><strong>Raison sociale :</strong> Rifline</li>
              <li><strong>Forme juridique :</strong> Auto-entrepreneur</li>
              <li><strong>Adresse :</strong> Oyonnax, 01100, France</li>
              <li><strong>Téléphone :</strong> +33 7 67 74 52 01</li>
              <li><strong>Email :</strong> rifline74@gmail.com</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>2. Hébergement</h2>
            <p>Le site est hébergé par :</p>
            <ul>
              <li><strong>Hébergeur :</strong> O2switch</li>
              <li><strong>Adresse :</strong> 222-224 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand, France</li>
              <li><strong>Site web :</strong> <a href="https://www.o2switch.fr" target="_blank" rel="noopener noreferrer">www.o2switch.fr</a></li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>3. Propriété intellectuelle</h2>
            <p>L'ensemble des contenus présents sur ce site (textes, images, logos, graphismes, etc.) est protégé par le droit de la propriété intellectuelle et appartient exclusivement à Rifline ou à ses partenaires.</p>
            <p>Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de Rifline.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>4. Responsabilité</h2>
            <p>Rifline s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, Rifline ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.</p>
            <p>Rifline décline toute responsabilité pour tout dommage résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition sur le site.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>5. Liens hypertextes</h2>
            <p>Le site peut contenir des liens vers d'autres sites internet. Rifline n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>6. Droit applicable</h2>
            <p>Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
          </div>

        </div>
      </div>
    </div>
  )
}
