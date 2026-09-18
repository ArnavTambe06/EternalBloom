import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, X, MapPin, Phone, Mail, CalendarDays } from 'lucide-react'
import { supabase } from '@/services/supabase'

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const statusColor: Record<string, string> = {
  pending: '#B77A00', confirmed: '#4A6FA5', processing: '#8B55A8',
  shipped: '#2378B8', delivered: '#4F8064', cancelled: '#B24B42',
}

const formatCurrency = (value: unknown) => `₹${Number(value || 0).toLocaleString('en-IN')}`
const formatDate = (value: string) => new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data, error: loadError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    if (loadError) setError(loadError.message)
    setOrders(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    const { error: updateError } = await supabase.from('orders').update({ status }).eq('id', id)
    if (updateError) setError(updateError.message)
    else {
      setOrders(current => current.map(order => order.id === id ? { ...order, status } : order))
      setSelected((current: any) => current?.id === id ? { ...current, status } : current)
    }
    setUpdating(null)
  }

  const updatePayment = async (id: string, payment_status: string) => {
    setUpdating(id)
    const { error: updateError } = await supabase.from('orders').update({ payment_status }).eq('id', id)
    if (updateError) setError(updateError.message)
    else {
      setOrders(current => current.map(order => order.id === id ? { ...order, payment_status } : order))
      setSelected((current: any) => current?.id === id ? { ...current, payment_status } : current)
    }
    setUpdating(null)
  }

  const filtered = filter === 'all' ? orders : orders.filter(order => order.status === filter)

  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 28 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--on-surface-muted)', marginBottom: 7 }}>Store operations</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--on-surface)' }}>Orders</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-surface-muted)', marginTop: 4 }}>{orders.length} total orders</p>
        </div>
        {selected && <button onClick={() => setSelected(null)} style={closeListButtonStyle}><X size={15} /> Close details</button>}
      </div>

      {error && <div style={{ padding: '12px 14px', marginBottom: 20, borderRadius: 10, background: '#FFF1F0', border: '1px solid rgba(180,55,45,0.2)', color: '#A4493F', fontFamily: 'var(--font-body)', fontSize: 13 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', ...statusOptions].map(status => (
          <button key={status} onClick={() => setFilter(status)} style={{
            padding: '8px 16px', borderRadius: 999,
            border: `1.5px solid ${filter === status ? 'var(--accent)' : 'var(--border)'}`,
            backgroundColor: filter === status ? 'var(--accent-bg)' : 'transparent',
            color: filter === status ? 'var(--accent)' : 'var(--on-surface-muted)',
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
          }}>{status === 'all' ? 'All Orders' : status}</button>
        ))}
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface)' }}>
                {['Order', 'Customer', 'Date', 'Status', 'Payment', 'Total', ''].map(heading => (
                  <th key={heading} style={tableHeadingStyle}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={emptyCellStyle}>Loading orders...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={emptyCellStyle}>No orders found.</td></tr>
              ) : filtered.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }}
                  onClick={() => { setError(''); setSelected(order) }}
                  style={{ borderBottom: '1px solid var(--border)', backgroundColor: selected?.id === order.id ? 'var(--accent-bg)' : 'transparent', cursor: 'pointer' }}
                >
                  <td style={{ ...tableCellStyle, fontWeight: 700, color: 'var(--on-surface)' }}>#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td style={{ ...tableCellStyle, color: 'var(--on-surface)' }}>{order.address?.full_name || order.guest_email || 'Customer'}</td>
                  <td style={{ ...tableCellStyle, color: 'var(--on-surface-muted)' }}>{formatDate(order.created_at)}</td>
                  <td style={tableCellStyle}><StatusBadge value={order.status} color={statusColor[order.status]} /></td>
                  <td style={tableCellStyle}><StatusBadge value={order.payment_status} color={order.payment_status === 'paid' ? '#4F8064' : '#B77A00'} soft /></td>
                  <td style={{ ...tableCellStyle, fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{formatCurrency(order.total)}</td>
                  <td style={tableCellStyle}><Eye size={15} color="var(--on-surface-faint)" /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selected && <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} style={drawerBackdropStyle} />
          <motion.aside
            className="admin-order-drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            role="dialog" aria-modal="true" aria-label={`Order ${selected.id.slice(0, 8)}`}
            onClick={event => event.stopPropagation()}
            style={drawerStyle}
          >
            <div style={drawerHeaderStyle}>
              <div>
                <p style={eyebrowStyle}>Order details</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 23, fontWeight: 700, color: 'var(--on-surface)', marginTop: 4 }}>#{selected.id.slice(0, 8).toUpperCase()}</h2>
                <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface-muted)', marginTop: 7 }}><CalendarDays size={13} /> {formatDate(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} style={drawerCloseStyle} aria-label="Close order details"><X size={18} /></button>
            </div>

            <div style={drawerBodyStyle}>
              <section style={sectionStyle}>
                <p style={sectionLabelStyle}>Customer</p>
                <div style={infoCardStyle}>
                  <p style={infoTitleStyle}>{selected.address?.full_name || 'Guest customer'}</p>
                  {selected.guest_email && <p style={infoLineStyle}><Mail size={14} /> {selected.guest_email}</p>}
                  {selected.address?.phone && <a href={`tel:${selected.address.phone}`} style={{ ...infoLineStyle, color: 'var(--accent)', textDecoration: 'none' }}><Phone size={14} /> {selected.address.phone}</a>}
                </div>
              </section>

              <section style={sectionStyle}>
                <p style={sectionLabelStyle}>Delivery address</p>
                <div style={infoCardStyle}>
                  <p style={{ ...infoLineStyle, alignItems: 'flex-start' }}><MapPin size={14} style={{ marginTop: 3, flexShrink: 0 }} /><span>{selected.address?.line1}{selected.address?.line2 ? `, ${selected.address.line2}` : ''}<br />{selected.address?.city}, {selected.address?.state}<br />{selected.address?.pincode}</span></p>
                </div>
              </section>

              <section style={sectionStyle}>
                <p style={sectionLabelStyle}>Order summary</p>
                <div style={summaryCardStyle}>
                  <SummaryRow label="Subtotal" value={formatCurrency(selected.subtotal)} />
                  <SummaryRow label="Shipping" value={Number(selected.shipping) === 0 ? 'Free' : formatCurrency(selected.shipping)} />
                  <SummaryRow label="Total" value={formatCurrency(selected.total)} strong />
                </div>
              </section>

              <section style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}><p style={sectionLabelStyle}>Items to fulfil</p><span style={itemCountStyle}>{selected.order_items?.length || 0} line items</span></div>
                <div style={infoCardStyle}>
                  {selected.order_items?.length ? selected.order_items.map((item: any) => <div key={item.id} style={itemRowStyle}>
                    <div style={itemImageStyle}>{item.product_image && <img src={item.product_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</div>
                    <div style={{ minWidth: 0, flex: 1 }}><p style={infoTitleStyle}>{item.product_name}</p><p style={infoLineTextStyle}>Qty: {item.quantity}{item.selected_variant ? ` · ${item.selected_variant.name}` : item.selected_color ? ` · ${item.selected_color.name}` : ''}</p></div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>{formatCurrency(Number(item.price) * Number(item.quantity))}</p>
                  </div>) : <p style={infoLineTextStyle}>No item details recorded.</p>}
                </div>
              </section>

              <section style={{ ...sectionStyle, paddingBottom: 8 }}>
                <p style={sectionLabelStyle}>Admin actions</p>
                <div style={controlGroupStyle}><label style={controlLabelStyle}>Fulfilment status<select value={selected.status} onChange={event => updateStatus(selected.id, event.target.value)} disabled={updating === selected.id} style={controlSelectStyle}>{statusOptions.map(status => <option key={status} value={status}>{status}</option>)}</select></label><label style={controlLabelStyle}>Payment status<select value={selected.payment_status} onChange={event => updatePayment(selected.id, event.target.value)} disabled={updating === selected.id} style={controlSelectStyle}>{['pending', 'paid', 'failed', 'refunded'].map(status => <option key={status} value={status}>{status}</option>)}</select></label></div>
                {updating === selected.id && <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--accent)', marginTop: 8 }}>Saving order updates...</p>}
              </section>
            </div>
          </motion.aside>
        </>}
      </AnimatePresence>
      <style>{`@media (max-width: 640px) { .admin-order-drawer { width: 100% !important; } }`}</style>
    </div>
  )
}

function StatusBadge({ value, color, soft = false }: { value: string; color: string; soft?: boolean }) {
  return <span style={{ backgroundColor: `${color}${soft ? '16' : '18'}`, color, padding: '4px 10px', borderRadius: 999, fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{value}</span>
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}><span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface-muted)' }}>{label}</span><span style={{ fontFamily: 'var(--font-body)', fontSize: strong ? 16 : 13, fontWeight: strong ? 800 : 600, color: strong ? 'var(--accent)' : 'var(--on-surface)' }}>{value}</span></div>
}

const eyebrowStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--on-surface-muted)' }
const sectionLabelStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--on-surface-muted)', marginBottom: 9 }
const tableHeadingStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--on-surface-muted)', padding: '13px 16px', textAlign: 'left', borderBottom: '1px solid var(--border)' }
const tableCellStyle: React.CSSProperties = { padding: '15px 16px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface)' }
const emptyCellStyle: React.CSSProperties = { padding: '54px 40px', textAlign: 'center', color: 'var(--on-surface-muted)', fontFamily: 'var(--font-body)', fontSize: 13 }
const closeListButtonStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 13px', borderRadius: 999, border: '1px solid var(--border)', background: '#FFFFFF', color: 'var(--on-surface-muted)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }
const drawerBackdropStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(27,18,20,0.34)', backdropFilter: 'blur(2px)', zIndex: 199 }
const drawerStyle: React.CSSProperties = { position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 200, width: 'min(460px, 100vw)', display: 'flex', flexDirection: 'column', background: '#FFFDFC', boxShadow: '-18px 0 48px rgba(36,27,32,0.18)', borderLeft: '1px solid rgba(232,163,185,0.3)' }
const drawerHeaderStyle: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '28px 28px 22px', background: 'linear-gradient(135deg, #fffaf3, #fff0e8)', borderBottom: '1px solid var(--border)', flexShrink: 0 }
const drawerCloseStyle: React.CSSProperties = { width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.72)', color: 'var(--on-surface)', cursor: 'pointer', flexShrink: 0 }
const drawerBodyStyle: React.CSSProperties = { flex: 1, overflowY: 'auto', padding: '22px 28px 36px' }
const sectionStyle: React.CSSProperties = { marginBottom: 22 }
const infoCardStyle: React.CSSProperties = { padding: '13px 14px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)' }
const infoTitleStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1.45 }
const infoLineStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface)', lineHeight: 1.6, marginTop: 5 }
const infoLineTextStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--on-surface-muted)', lineHeight: 1.5, marginTop: 3 }
const summaryCardStyle: React.CSSProperties = { padding: '3px 14px 0', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)' }
const itemCountStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--on-surface-muted)' }
const itemRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border)' }
const itemImageStyle: React.CSSProperties = { width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: 'var(--surface-soft)', flexShrink: 0 }
const controlGroupStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }
const controlLabelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 7, fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--on-surface-muted)' }
const controlSelectStyle: React.CSSProperties = { width: '100%', padding: '11px 10px', borderRadius: 9, border: '1px solid var(--border)', background: '#FFFFFF', color: 'var(--on-surface)', fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'capitalize', cursor: 'pointer', outline: 'none' }
