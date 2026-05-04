import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth }     from './context/AuthContext'
import { CartProvider }              from './context/CartContext'
import { CurrencyProvider }          from './context/CurrencyContext'
import { WishlistProvider }          from './context/WishlistContext'

import Layout      from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'

import Home        from './pages/Home'
import Catalogue   from './pages/Catalogue'
import Product     from './pages/Product'
import Login          from './pages/Login'
import Register       from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword'
import Checkout     from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Account      from './pages/Account'
import Orders       from './pages/Orders'
import OrderDetail  from './pages/OrderDetail'
import Wishlist     from './pages/Wishlist'

import MentionsLegales from './pages/legal/MentionsLegales'
import Confidentialite  from './pages/legal/Confidentialite'
import CGV              from './pages/legal/CGV'
import RGPD             from './pages/legal/RGPD'

import AdminDashboard  from './pages/admin/Dashboard'
import AdminProducts   from './pages/admin/Products'
import AdminOrders     from './pages/admin/Orders'
import AdminCategories from './pages/admin/Categories'
import AdminCoupons    from './pages/admin/Coupons'
import AdminCustomers  from './pages/admin/Customers'
import AdminReports    from './pages/admin/Reports'
import AdminCurrencies from './pages/admin/Currencies'

// Loader minimaliste pendant la vérification de session
function AuthLoader() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '1px solid var(--color-gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

// Garde d'authentification
function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <AuthLoader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Garde admin
function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <AuthLoader />
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
            <Routes>
              {/* Storefront */}
              <Route path="/" element={<Layout />}>
                <Route index             element={<Home />} />
                <Route path="catalogue"  element={<Catalogue />} />
                <Route path="produit/:slug" element={<Product />} />
                <Route path="login"           element={<Login />} />
                <Route path="register"        element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password"  element={<ResetPassword />} />
                <Route path="checkout"     element={<RequireAuth><Checkout /></RequireAuth>} />
                <Route path="confirmation" element={<RequireAuth><Confirmation /></RequireAuth>} />
                <Route path="compte"       element={<RequireAuth><Account /></RequireAuth>} />
                <Route path="commandes"  element={<RequireAuth><Orders /></RequireAuth>} />
                <Route path="commandes/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />
                <Route path="wishlist"          element={<RequireAuth><Wishlist /></RequireAuth>} />
                <Route path="mentions-legales" element={<MentionsLegales />} />
                <Route path="confidentialite"  element={<Confidentialite />} />
                <Route path="cgv"              element={<CGV />} />
                <Route path="rgpd"             element={<RGPD />} />
              </Route>

              {/* Admin */}
              <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                <Route index                 element={<AdminDashboard />} />
                <Route path="produits"       element={<AdminProducts />} />
                <Route path="commandes"      element={<AdminOrders />} />
                <Route path="categories"     element={<AdminCategories />} />
                <Route path="coupons"        element={<AdminCoupons />} />
                <Route path="clients"        element={<AdminCustomers />} />
                <Route path="rapports"       element={<AdminReports />} />
                <Route path="devises"        element={<AdminCurrencies />} />
              </Route>
            </Routes>
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
