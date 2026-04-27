import { Link } from 'react-router-dom'
import s from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.grid}>
          {/* Marque */}
          <div className={s.brand}>
            <Link to="/" className={s.logo}>Rif <span>Line</span></Link>
            <div className={s.goldLine} />
            <p>Une sélection raffinée de parfums, d'art islamique, de décoration et de produits alimentaires d'exception.</p>
          </div>

          {/* Collection */}
          <div className={s.col}>
            <h4>Collection</h4>
            <ul>
              <li><Link to="/catalogue">Tout voir</Link></li>
              <li><Link to="/catalogue?cat=parfums">Parfums</Link></li>
              <li><Link to="/catalogue?cat=islamique">Art islamique</Link></li>
              <li><Link to="/catalogue?cat=deco">Décoration</Link></li>
              <li><Link to="/catalogue?cat=alimentaire">Alimentaire</Link></li>
            </ul>
          </div>

          {/* Compte */}
          <div className={s.col}>
            <h4>Mon compte</h4>
            <ul>
              <li><Link to="/login">Connexion</Link></li>
              <li><Link to="/register">Inscription</Link></li>
              <li><Link to="/commandes">Mes commandes</Link></li>
              <li><Link to="/wishlist">Ma wishlist</Link></li>
            </ul>
          </div>

          {/* Infos */}
          <div className={s.col}>
            <h4>Informations</h4>
            <ul>
              <li><Link to="/livraison">Livraison</Link></li>
              <li><Link to="/retours">Retours</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className={s.bottom}>
          <p className={s.copyright}>© {new Date().getFullYear()} Rif Line. Tous droits réservés.</p>
          <div className={s.bottomLinks}>
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/confidentialite">Confidentialité</Link>
            <Link to="/cgv">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
