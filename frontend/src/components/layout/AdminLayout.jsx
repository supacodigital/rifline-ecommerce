import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Tag, Ticket, Users, BarChart2, DollarSign, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin',            label: 'Dashboard',   icon: LayoutDashboard, end: true },
  { to: '/admin/produits',   label: 'Produits',    icon: Package },
  { to: '/admin/commandes',  label: 'Commandes',   icon: ShoppingBag },
  { to: '/admin/categories', label: 'Catégories',  icon: Tag },
  { to: '/admin/coupons',    label: 'Coupons',     icon: Ticket },
  { to: '/admin/clients',    label: 'Clients',     icon: Users },
  { to: '/admin/rapports',   label: 'Rapports',    icon: BarChart2 },
  { to: '/admin/devises',    label: 'Devises',     icon: DollarSign },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        background: 'var(--color-bg-2)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-6) 0',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        <div style={{ padding: '0 var(--space-6) var(--space-8)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Rif <span style={{ color: 'var(--color-gold)' }}>Admin</span>
          </span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-6)',
              fontSize: 'var(--text-sm)', fontWeight: '400',
              color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
              background: isActive ? 'rgba(201,169,110,0.08)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--color-gold)' : '2px solid transparent',
              transition: 'all 200ms ease',
            })}>
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '0 var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-subtle)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', padding: 'var(--space-2) 0' }}
          >
            <ArrowLeft size={13} /> Retour boutique
          </button>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', padding: 'var(--space-2) 0' }}
          >
            <LogOut size={13} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu */}
      <main style={{ background: 'var(--color-bg)', minHeight: '100vh', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
