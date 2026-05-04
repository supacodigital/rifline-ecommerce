import { Outlet } from 'react-router-dom'
import Header         from './Header'
import Footer         from './Footer'
import CartDrawer     from '../ui/CartDrawer'
import WhatsAppButton from '../ui/WhatsAppButton'

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  )
}
