import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getUserOrders } from '@/services/orders'

const statusColor: Record<string, string> = {
  pending: '#FFB800', confirmed: '#4A6FA5', processing: '#9B59B6',
  shipped: '#2196F3', delivered: '#5A8C6E', cancelled: '#C33',
}

export function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    getUserOrders(user.id).then(data => {
      setOrders(data)
      setLoading(false)
    })
  }, [user])

  return (
    <div style={{ backgroundColor: 'var(--surface)', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 6 }}>
          My Orders
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-surface-muted)', marginBottom: 32 }}>
          Track and manage your Eternal Bloom orders
        </p>

        {loading ? (
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--on-surface-muted)' }}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Package size={48} color="var(--border)" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--on-surface)', marginBottom: 8 }}>
              No orders yet
            </p>
            <Link to="/#products" style={{
              display: 'inline-block', marginTop: 16,
              padding: '12px 24px',
              background: 'var(--primary-gradient)',
              borderRadius: 999, fontFamily: 'var(--font-body)',
              fontSize: 13, fontWeight: 600, color: 'var(--on-surface)',
            }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  backgroundColor: 'var(--surface-white)',
                  borderRadius: 16, padding: '20px 24px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 2px 12px rgba(212,72,154,0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface-muted)', marginTop: 2 }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      backgroundColor: `${statusColor[order.status] || '#999'}18`,
                      color: statusColor[order.status] || '#999',
                      padding: '4px 12px', borderRadius: 999,
                      fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>{order.status}</span>
                  </div>
                </div>

                {/* Items */}
                {order.order_items?.length > 0 && (
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    {order.order_items.slice(0, 3).map((item: any) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 8,
                          backgroundColor: 'var(--surface-section)', overflow: 'hidden',
                        }}>
                          {item.product_image && (
                            <img src={item.product_image} alt={item.product_name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                        <div>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface)', fontWeight: 500 }}>
                            {item.product_name}
                          </p>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--on-surface-muted)' }}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.order_items.length > 3 && (
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface-muted)', alignSelf: 'center' }}>
                        +{order.order_items.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div style={{ height: 1, backgroundColor: 'var(--border)', marginBottom: 12 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface-muted)' }}>
                    {order.order_items?.length || 0} item(s) · {order.payment_status}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                    ₹{Number(order.total).toLocaleString('en-IN')}
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