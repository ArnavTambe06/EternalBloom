import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, ShoppingBag, Sparkles, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { supabase } from '@/services/supabase'
import { Link } from 'react-router-dom'

interface Stats {
  products: number
  categories: number
  orders: number
  customOrders: number
  pendingOrders: number
  revenue: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0, categories: 0, orders: 0,
    customOrders: 0, pendingOrders: 0, revenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: products },
        { count: categories },
        { count: orders },
        { count: customOrders },
        { count: pendingOrders },
        { data: ordersData },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('custom_orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('total').eq('payment_status', 'paid'),
      ])

      const revenue = ordersData?.reduce((sum, o) => sum + Number(o.total), 0) || 0

      setStats({
        products: products || 0,
        categories: categories || 0,
        orders: orders || 0,
        customOrders: customOrders || 0,
        pendingOrders: pendingOrders || 0,
        revenue,
      })

      const { data: recent } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentOrders(recent || [])
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: <Package size={20} />, color: '#FF85D0', href: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, icon: <ShoppingBag size={20} />, color: '#FFC8A2', href: '/admin/orders' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: <Clock size={20} />, color: '#FFE680', href: '/admin/orders' },
    { label: 'Custom Orders', value: stats.customOrders, icon: <Sparkles size={20} />, color: '#C8A2FF', href: '/admin/custom-orders' },
    { label: 'Revenue (Paid)', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: <TrendingUp size={20} />, color: '#A2FFC8', href: '/admin/orders' },
    { label: 'Categories', value: stats.categories, icon: <CheckCircle size={20} />, color: '#A2C8FF', href: '/admin/categories' },
  ]

  const statusColor: Record<string, string> = {
    pending: '#FFB800', confirmed: '#4A6FA5',
    processing: '#9B59B6', shipped: '#2196F3',
    delivered: '#5A8C6E', cancelled: '#C33',
  }

  return (
    <div style={{ padding: '32px 36px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28, fontWeight: 700,
          color: 'var(--on-surface)',
        }}>Dashboard</h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14, color: 'var(--on-surface-muted)', marginTop: 4,
        }}>
          Welcome back! Here's what's happening with Eternal Bloom.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16, marginBottom: 36,
      }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link to={card.href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                style={{
                  backgroundColor: 'var(--surface-white)',
                  borderRadius: 16, padding: '20px 24px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  cursor: 'pointer', transition: 'box-shadow 0.3s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12, fontWeight: 600,
                      color: 'var(--on-surface-muted)',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      marginBottom: 8,
                    }}>{card.label}</p>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 28, fontWeight: 700,
                      color: 'var(--on-surface)',
                    }}>{loading ? '—' : card.value}</p>
                  </div>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: `${card.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: card.color,
                  }}>
                    {card.icon}
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{
        backgroundColor: 'var(--surface-white)',
        borderRadius: 16, padding: '24px',
        border: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--on-surface)' }}>
            Recent Orders
          </h2>
          <Link to="/admin/orders" style={{
            fontFamily: 'var(--font-body)', fontSize: 13,
            fontWeight: 600, color: 'var(--primary)',
          }}>View all</Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-surface-muted)', textAlign: 'center', padding: '24px 0' }}>
            No orders yet
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Order ID', 'Date', 'Status', 'Payment', 'Total'].map(h => (
                  <th key={h} style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--on-surface-muted)',
                    padding: '8px 12px', textAlign: 'left',
                    borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={order.id} style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '12px 12px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface-muted)' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      backgroundColor: `${statusColor[order.status] || '#999'}18`,
                      color: statusColor[order.status] || '#999',
                      padding: '3px 10px', borderRadius: 999,
                      fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>{order.status}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      backgroundColor: order.payment_status === 'paid' ? '#EEF7F2' : '#FFF5E0',
                      color: order.payment_status === 'paid' ? '#5A8C6E' : '#B88B00',
                      padding: '3px 10px', borderRadius: 999,
                      fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>{order.payment_status}</span>
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                    ₹{Number(order.total).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}