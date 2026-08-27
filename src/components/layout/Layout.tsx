import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AuroraBg } from '@/components/AurorBg'
import { PeekingCard } from '@/components/ui/PeekingCard'

export function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <AuroraBg />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
        <Footer />
      </div>
      <PeekingCard />
      <CartDrawer />
    </div>
  )
}
