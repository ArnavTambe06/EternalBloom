import { motion } from 'framer-motion'
import { Package, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const mockOrders = [
  {
    id: 'ORD001', date: 'Aug 5, 2026', status: 'Delivered',
    total: 528, items: [
      { name: 'Bow Keychain', qty: 2, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80' },
      { name: 'Daisy Hair Clip', qty: 1, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80&q=80' },
    ],
  },
  {
    id: 'ORD002', date: 'Aug 7, 2026', status: 'Processing',
    total: 349, items: [
      { name: 'Daisy Desk Buddy', qty: 1, image: 'https://images.unsplash.com/photo-1487530811015-780680fb1f4e?w=80&q=80' },
    ],
  },
]

const statusColor: Record<string, string> = {
  Delivered: '#91A57A',
  Processing: '#D68C6A',
  Shipped: '#63B3ED',
  Pending: '#786A61',
  Cancelled: '#E53E3E',
}

export function MyOrdersPage() {
  return (
    <div style={{ backgroundColor: '#FFF9F2', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 32, fontWeight: 700, color: '#46352A', marginBottom: 6,
        }}>My Orders</h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#786A61', marginBottom: 32 }}>
          Track and manage your Eternal Bloom orders
        </p>

        {mockOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Package size={48} color="#E7DDD5" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#46352A', marginBottom: 8 }}>
              No orders yet
            </p>
            <Link to="/" style={{
              display: 'inline-block', marginTop: 16,
              padding: '12px 24px', backgroundColor: '#B56A45',
              color: 'white', borderRadius: 12, textDecoration: 'none',
              fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 600,
            }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mockOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  backgroundColor: 'white', borderRadius: 18,
                  padding: '20px 24px',
                  border: '1px solid #E7DDD5',
                  boxShadow: '0 2px 12px rgba(70,53,42,0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 700, color: '#46352A' }}>
                      #{order.id}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#786A61', marginTop: 2 }}>
                      {order.date}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      backgroundColor: `${statusColor[order.status]}20`,
                      color: statusColor[order.status],
                      padding: '4px 12px', borderRadius: 999,
                      fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 600,
                    }}>{order.status}</span>
                    <ChevronRight size={16} color="#786A61" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  {order.items.map(item => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 8,
                        overflow: 'hidden', backgroundColor: '#F6EFE7',
                      }}>
                        <img src={item.image} alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#46352A', fontWeight: 500 }}>
                          {item.name}
                        </p>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#786A61' }}>
                          Qty: {item.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, backgroundColor: '#F6EFE7', marginBottom: 12 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#786A61' }}>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </span>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 15, fontWeight: 700, color: '#B56A45' }}>
                    ₹{order.total}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}