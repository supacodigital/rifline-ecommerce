import s from './Legal.module.css'

export default function CGV() {
  return (
    <div className={s.page}>
      <div className="container">
        <div className={s.hero}>
          <p className={s.label}>Conditions générales</p>
          <h1 className={s.title}>Conditions générales de vente</h1>
          <p className={s.updated}>Dernière mise à jour : janvier 2025</p>
        </div>

        <div className={s.content}>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>1. Objet et champ d'application</h2>
            <p>Les présentes Conditions Générales de Vente (CGV) régissent toutes les ventes effectuées sur le site <strong>rif-line.com</strong>, exploité par Rifline, à destination de consommateurs au sens de l'article liminaire du Code de la consommation.</p>
            <p>Toute commande passée sur le site implique l'acceptation sans réserve des présentes CGV. Rifline se réserve le droit de modifier ses CGV à tout moment, les conditions applicables étant celles en vigueur à la date de la commande.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>2. Produits</h2>
            <p>Les produits proposés à la vente sont ceux figurant sur le site au moment de la consultation par le client. Rifline se réserve le droit de modifier à tout moment l'assortiment de produits proposés.</p>
            <p>Les photographies et descriptions des produits sont fournies à titre indicatif. En cas d'erreur ou d'omission sur la fiche produit, la responsabilité de Rifline ne saurait être engagée.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>3. Prix</h2>
            <p>Les prix sont indiqués en euros, toutes taxes comprises (TTC). Rifline se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable est celui affiché au moment de la validation de la commande.</p>
            <p>Les frais de livraison sont indiqués séparément lors du processus de commande et sont à la charge du client, sauf promotion spécifique.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>4. Commande</h2>
            <p>Pour passer commande, le client doit :</p>
            <ul>
              <li>Créer un compte ou se connecter à son espace client</li>
              <li>Sélectionner les produits et les ajouter au panier</li>
              <li>Valider son panier et renseigner ses coordonnées de livraison</li>
              <li>Choisir son mode de livraison</li>
              <li>Procéder au paiement sécurisé</li>
            </ul>
            <p>La commande est définitivement enregistrée après confirmation du paiement. Un email de confirmation est envoyé au client récapitulant les détails de sa commande.</p>
            <p>Rifline se réserve le droit de refuser ou d'annuler toute commande en cas de litige relatif au paiement d'une commande précédente, de rupture de stock ou de suspicion de fraude.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>5. Paiement</h2>
            <p>Le paiement s'effectue en ligne de manière sécurisée via notre prestataire SumUp. Les moyens de paiement acceptés sont :</p>
            <ul>
              <li>Carte bancaire (Visa, Mastercard, American Express)</li>
            </ul>
            <p>Le débit est effectué au moment de la validation de la commande. Aucune donnée bancaire n'est conservée par Rifline.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>6. Livraison</h2>
            <p>Les commandes sont expédiées dans un délai de 2 à 5 jours ouvrés après confirmation du paiement. Ce délai peut varier en période de forte activité.</p>
            <p>Rifline propose plusieurs modes de livraison :</p>
            <ul>
              <li><strong>Colissimo domicile :</strong> livraison à l'adresse indiquée</li>
              <li><strong>Mondial Relay :</strong> livraison en point relais</li>
            </ul>
            <p>En cas de retard de livraison imputable au transporteur, Rifline ne saurait être tenue responsable. Le client est invité à contacter notre service client à <a href="mailto:rifline74@gmail.com">rifline74@gmail.com</a>.</p>
            <p>Tout colis endommagé à la réception doit faire l'objet de réserves auprès du transporteur dans les meilleurs délais.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>7. Droit de rétractation</h2>
            <p>Conformément à l'article L221-18 du Code de la consommation, le client dispose d'un délai de <strong>14 jours calendaires</strong> à compter de la réception de sa commande pour exercer son droit de rétractation, sans avoir à justifier de motifs.</p>
            <p>Pour exercer ce droit, le client doit notifier sa décision par email à <a href="mailto:rifline74@gmail.com">rifline74@gmail.com</a>, en indiquant son numéro de commande.</p>
            <p>Les produits doivent être retournés dans leur emballage d'origine, non ouverts et non utilisés. Les frais de retour sont à la charge du client.</p>
            <p>Le remboursement est effectué dans un délai de 14 jours à compter de la réception du retour, par le même moyen de paiement que celui utilisé lors de l'achat.</p>
            <p><strong>Exception :</strong> conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux produits descellés par le consommateur après la livraison et qui ne peuvent être renvoyés pour des raisons d'hygiène ou de protection de la santé (parfums ouverts, cosmétiques entamés).</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>8. Garanties légales</h2>
            <p>Tous les produits vendus bénéficient des garanties légales suivantes :</p>
            <ul>
              <li><strong>Garantie légale de conformité</strong> (articles L217-4 et suivants du Code de la consommation) : 2 ans à compter de la livraison</li>
              <li><strong>Garantie contre les vices cachés</strong> (articles 1641 et suivants du Code civil)</li>
            </ul>
            <p>En cas de défaut de conformité, le client peut demander la réparation ou le remplacement du produit, ou, si ces solutions sont impossibles, un remboursement.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>9. Responsabilité</h2>
            <p>Rifline ne saurait être tenue responsable de l'inexécution du contrat en cas de force majeure, de rupture de stock ou d'indisponibilité du produit, de perturbation ou grève totale ou partielle des services postaux et moyens de transport.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>10. Données personnelles</h2>
            <p>Le traitement des données personnelles collectées lors de la commande est détaillé dans notre <a href="/confidentialite">Politique de confidentialité</a>.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>11. Propriété intellectuelle</h2>
            <p>L'ensemble des éléments constituant le site rif-line.com est protégé par le droit d'auteur et le droit des marques. Toute reproduction, même partielle, est interdite sans accord préalable.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>12. Litiges et droit applicable</h2>
            <p>Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, le client peut recourir à la médiation de la consommation.</p>
            <p>Conformément aux articles L611-1 et suivants du Code de la consommation, le client peut saisir gratuitement le médiateur de la consommation compétent. La liste des médiateurs agréés est disponible sur <a href="https://www.economie.gouv.fr" target="_blank" rel="noopener noreferrer">www.economie.gouv.fr</a>.</p>
            <p>À défaut de résolution amiable, les tribunaux français seront seuls compétents.</p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>13. Contact</h2>
            <p>Pour toute question relative à vos commandes ou aux présentes CGV :</p>
            <ul>
              <li><strong>Email :</strong> <a href="mailto:rifline74@gmail.com">rifline74@gmail.com</a></li>
              <li><strong>WhatsApp :</strong> +33 7 67 74 52 01</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}
