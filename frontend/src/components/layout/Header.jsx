import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Heart, Search } from 'lucide-react'
import { useAuth }     from '../../context/AuthContext'
import { useCart }     from '../../context/CartContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useTranslation } from 'react-i18next'
import s from './Header.module.css'

export default function Header() {
  const [scrolled,    setScrolled]   = useState(false)
  const [menuOpen,    setMenuOpen]   = useState(false)
  const { user, logout }             = useAuth()
  const { totalItems, setIsOpen }    = useCart()
  const { currencies, current, selectCurrency } = useCurrency()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquer le scroll quand menu mobile ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function closeMenu() { setMenuOpen(false) }

  function toggleLang() {
    const next = i18n.language === 'fr' ? 'en' : 'fr'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  const navLinks = [
    { to: '/catalogue', label: t('nav.collection') },
    { to: '/catalogue?cat=parfums', label: t('nav.perfumes') },
    { to: '/catalogue?cat=islamique', label: t('nav.islamic') },
    { to: '/catalogue?cat=deco', label: t('nav.deco') },
  ]

  return (
    <>
      <header className={`${s.header} ${scrolled ? s.scrolled : ''}`}>
        <div className={s.inner}>
          {/* Burger mobile */}
          <button
            className={`${s.burger} ${menuOpen ? s.open : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            <span className={s.burgerLine} />
            <span className={s.burgerLine} />
            <span className={s.burgerLine} />
          </button>

          {/* Logo */}
          <Link to="/" className={s.logo}>
            Rif <span>Line</span>
          </Link>

          {/* Nav desktop */}
          <nav className={s.nav}>
            {navLinks.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `${s.navLink} ${isActive ? s.active : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className={s.actions}>
            {/* Langue */}
            <button className={s.langBtn} onClick={toggleLang} aria-label="Language">
              {i18n.language === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Devise */}
            {currencies.length > 0 && (
              <select
                className={s.currencySelect}
                value={current}
                onChange={e => selectCurrency(e.target.value)}
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            )}

            {/* Wishlist */}
            {user && (
              <button className={s.actionBtn} onClick={() => navigate('/wishlist')} aria-label="Wishlist">
                <Heart size={18} strokeWidth={1.5} />
              </button>
            )}

            {/* Compte */}
            <button
              className={s.actionBtn}
              onClick={() => navigate(user ? '/compte' : '/login')}
              aria-label="Compte"
            >
              <User size={18} strokeWidth={1.5} />
            </button>

            {/* Panier */}
            <button
              className={s.actionBtn}
              onClick={() => setIsOpen(true)}
              aria-label="Panier"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className={s.cartBadge}>{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div className={`${s.mobileMenu} ${menuOpen ? s.open : ''}`}>

        {/* Liens navigation */}
        <nav className={s.mobileNavLinks}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className={s.mobileNavLink} onClick={closeMenu}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions compte */}
        <div className={s.mobileActions}>
          <Link to={user ? '/compte' : '/login'} className={s.mobileActionLink} onClick={closeMenu}>
            <User size={16} strokeWidth={1.5} />
            {user ? t('nav.account') : t('nav.login')}
          </Link>
          {user && (
            <Link to="/wishlist" className={s.mobileActionLink} onClick={closeMenu}>
              <Heart size={16} strokeWidth={1.5} />
              {t('wishlist.title')}
            </Link>
          )}
          {user && (
            <Link to="/commandes" className={s.mobileActionLink} onClick={closeMenu}>
              <ShoppingBag size={16} strokeWidth={1.5} />
              {t('orders.title')}
            </Link>
          )}

          {/* Langue + devise */}
          <div className={s.mobileLangCurrencyRow}>
            <button className={s.mobileLangBtn} onClick={() => { toggleLang(); closeMenu() }}>
              {i18n.language === 'fr' ? 'EN' : 'FR'}
            </button>
            {currencies.length > 0 && (
              <select
                className={s.mobileCurrencySelect}
                value={current}
                onChange={e => selectCurrency(e.target.value)}
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            )}
          </div>
        </div>

      </div>
    </>
  )
}
