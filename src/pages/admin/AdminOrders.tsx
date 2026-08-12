import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/services/supabase'
import { Eye, ChevronDown } from 'lucide-react'

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const statusColor: Record<string, string> = {
  pending: '#FFB800', confirmed: '#4A6FA5', processing: '#9B59B6',
  shipped: '#2196F3', delivered: '#5A8C6E', cancelled: '#C33',
}

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selected?.id === id) setSelected((s: any) => ({ ...s, status }))
    setUpdating(null)
  }

  const updatePayment = async (id: string, payment_status: string) => {
    await supabase.from('orders').update({ payment_status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, payment_status } : o))
    if (selected?.id === id) setSelected((s: any) => ({ ...s, payment_status }))
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div style={{ padding: '32px 36px' }}>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--on-surface)' }}>
          Orders
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-surface-muted)', marginTop: 4 }}>
          {orders.length} total orders
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', ...statusOptions].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '8px 16px', borderRadius: 999,
              border: `1.5px solid ${filter === s ? 'var(--primary)' : 'var(--border)'}`,
              backgroundColor: filter === s ? 'var(--primary-pale)' : 'transparent',
              color: filter === s ? 'var(--primary)' : 'var(--on-surface-muted)',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
            }}
          >{s === 'all' ? 'All Orders' : s}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>

        {/* Orders table */}
        <div style={{
          backgroundColor: 'var(--surface-white)',
          borderRadius: 16, border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface)' }}>
                {['Order', 'Date', 'Status', 'Payment', 'Total', ''].map(h => (
                  <th key={h} style={{
                    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--on-surface-muted)',
                    padding: '12px 16px', textAlign: 'left',
                    borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--on-surface-muted)', fontFamily: 'var(--font-body)' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--on-surface-muted)', fontFamily: 'var(--font-body)' }}>No orders found.</td></tr>
              ) : filtered.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: selected?.id === order.id ? 'var(--primary-pale)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelected(order)}
                >
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface-muted)' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      backgroundColor: `${statusColor[order.status]}18`,
                      color: statusColor[order.status],
                      padding: '3px 10px', borderRadius: 999,
                      fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>{order.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      backgroundColor: order.payment_status === 'paid' ? '#EEF7F2' : '#FFF5E0',
                      color: order.payment_status === 'paid' ? '#5A8C6E' : '#B88B00',
                      padding: '3px 10px', borderRadius: 999,
                      fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>{order.payment_status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                    ₹{Number(order.total).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Eye size={15} color="var(--on-surface-faint)" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order detail panel */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              backgroundColor: 'var(--surface-white)',
              borderRadius: 16, border: '1px solid var(--border)',
              padding: '24px', height: 'fit-content',
              position: 'sticky', top: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--on-surface)' }}>
                #{selected.id.slice(0, 8).toUpperCase()}
              </h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-muted)' }}>
                ✕
              </button>
            </div>

            {/* Address */}
            <div style={{ marginBottom: 16 }}>
              <p className="label-caps" style={{ marginBottom: 8, color: 'var(--on-surface-muted)' }}>Delivery Address</p>
              <div style={{ backgroundColor: 'var(--surface)', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface)', lineHeight: 1.6 }}>
                  {selected.address?.full_name}<br />
                  {selected.address?.line1}{selected.address?.line2 ? `, ${selected.address.line2}` : ''}<br />
                  {selected.address?.city}, {selected.address?.state} — {selected.address?.pincode}<br />
                  📞 {selected.address?.phone}
                </p>
              </div>
            </div>

            {/* Financials */}
            <div style={{ marginBottom: 16 }}>
              {[
                { label: 'Subtotal', value: `₹${selected.subtotal}` },
                { label: 'Shipping', value: Number(selected.shipping) === 0 ? 'Free' : `₹${selected.shipping}` },
                { label: 'Total', value: `₹${selected.total}`, bold: true },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface-muted)' }}>{r.label}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: r.bold ? 15 : 13, fontWeight: r.bold ? 700 : 500, color: r.bold ? 'var(--primary)' : 'var(--on-surface)' }}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Update status */}
            <div style={{ marginBottom: 12 }}>
              <p className="label-caps" style={{ marginBottom: 8, color: 'var(--on-surface-muted)' }}>Order Status</p>
              <select
                value={selected.status}
                onChange={e => updateStatus(selected.id, e.target.value)}
                disabled={updating === selected.id}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid var(--border)', borderRadius: 10,
                  fontFamily: 'var(--font-body)', fontSize: 14,
                  color: 'var(--on-surface)', backgroundColor: 'var(--surface)',
                  cursor: 'pointer', outline: 'none',
                  textTransform: 'capitalize',
                }}
              >
                {statusOptions.map(s => (
                  <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                ))}
              </select>
            </div>

            {/* Update payment */}
            <div>
              <p className="label-caps" style={{ marginBottom: 8, color: 'var(--on-surface-muted)' }}>Payment Status</p>
              <select
                value={selected.payment_status}
                onChange={e => updatePayment(selected.id, e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid var(--border)', borderRadius: 10,
                  fontFamily: 'var(--font-body)', fontSize: 14,
                  color: 'var(--on-surface)', backgroundColor: 'var(--surface)',
                  cursor: 'pointer', outline: 'none',
                  textTransform: 'capitalize',
                }}
              >
                {['pending', 'paid', 'failed', 'refunded'].map(s => (
                  <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}