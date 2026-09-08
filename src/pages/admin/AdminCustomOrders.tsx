import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/services/supabase'

const statusOptions = ['pending', 'reviewing', 'quoted', 'accepted', 'rejected']
const statusColor: Record<string, string> = {
  pending: '#FFB800', reviewing: '#4A6FA5', quoted: '#9B59B6',
  accepted: '#5A8C6E', rejected: '#C33',
}

export function AdminCustomOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [filter, setFilter] = useState('all')
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('custom_orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('custom_orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selected?.id === id) setSelected((s: any) => ({ ...s, status }))
  }

  const saveNotes = async () => {
    if (!selected) return
    setSavingNotes(true)
    await supabase.from('custom_orders').update({ admin_notes: notes }).eq('id', selected.id)
    setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, admin_notes: notes } : o))
    setSelected((s: any) => ({ ...s, admin_notes: notes }))
    setSavingNotes(false)
  }

  const openOrder = (order: any) => {
    setSelected(order)
    setNotes(order.admin_notes || '')
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--on-surface)' }}>
          Custom Orders
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-surface-muted)', marginTop: 4 }}>
          {orders.length} custom requests
        </p>
      </div>

      {/* Filter */}
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
          >{s === 'all' ? 'All' : s}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 20 }}>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--on-surface-muted)', padding: '40px 0', textAlign: 'center' }}>Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--on-surface-muted)', padding: '40px 0', textAlign: 'center' }}>No custom orders yet.</p>
          ) : filtered.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => openOrder(order)}
              style={{
                backgroundColor: selected?.id === order.id ? 'var(--primary-pale)' : 'var(--surface-white)',
                border: `1.5px solid ${selected?.id === order.id ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 14, padding: '16px 20px',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: 'var(--on-surface)' }}>
                    {order.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface-muted)', marginTop: 2 }}>
                    {order.email} · {order.category || 'No category'} · {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <span style={{
                  backgroundColor: `${statusColor[order.status]}18`,
                  color: statusColor[order.status],
                  padding: '3px 10px', borderRadius: 999,
                  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                  textTransform: 'capitalize', flexShrink: 0,
                }}>{order.status}</span>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 13,
                color: 'var(--on-surface-muted)', lineHeight: 1.5,
                overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {order.description}
              </p>
              {order.budget && (
                <span style={{
                  display: 'inline-block', marginTop: 8,
                  backgroundColor: 'var(--surface-section)',
                  padding: '3px 10px', borderRadius: 999,
                  fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--on-surface-muted)',
                }}>Budget: {order.budget}</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Detail */}
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
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--on-surface)' }}>
                Request Details
              </h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-muted)' }}>✕</button>
            </div>

            {[
              { label: 'Name', value: selected.name },
              { label: 'Email', value: selected.email },
              { label: 'Phone', value: selected.phone || '—' },
              { label: 'Category', value: selected.category || '—' },
              { label: 'Budget', value: selected.budget || '—' },
              { label: 'Occasion', value: selected.occasion || '—' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--on-surface-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 80 }}>{f.label}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface)' }}>{f.value}</span>
              </div>
            ))}

            {selected.phone && (
  <div style={{
    padding: '12px 0',
    borderBottom: '1px solid rgba(232,163,185,0.1)',
  }}>
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#8C665D',
      marginBottom: 10,
    }}>
      Quick Contact
    </p>

    <div style={{ display: 'flex', gap: 8 }}>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/91${selected.phone.replace(/\D/g, '')}?text=Hi ${selected.name}, thank you for your custom order request at Eternal Bloom! We've reviewed your request and would like to discuss further.`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          padding: '10px',
          backgroundColor: '#25D366',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp
      </a>

      {/* Email */}
      <a
        href={`mailto:${selected.email}?subject=Your Custom Order - Eternal Bloom&body=Hi ${selected.name},%0D%0A%0D%0AThank you for your custom order request at Eternal Bloom!`}
        style={{
          flex: 1,
          padding: '10px',
          backgroundColor: 'rgba(232,163,185,0.12)',
          border: '1.5px solid rgba(232,163,185,0.3)',
          borderRadius: 10,
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 600,
          color: '#241B20',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        Email
      </a>

    </div>
  </div>
)}

            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--on-surface-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Vision</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface)', lineHeight: 1.6 }}>{selected.description}</p>
            </div>

            {/* Reference images */}
            {selected.reference_images?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--on-surface-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Reference Images</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selected.reference_images.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Update status */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--on-surface-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Update Status</p>
              <select
                value={selected.status}
                onChange={e => updateStatus(selected.id, e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid var(--border)', borderRadius: 10,
                  fontFamily: 'var(--font-body)', fontSize: 14,
                  color: 'var(--on-surface)', backgroundColor: 'var(--surface)',
                  cursor: 'pointer', outline: 'none', textTransform: 'capitalize',
                }}
              >
                {statusOptions.map(s => (
                  <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                ))}
              </select>
            </div>

            {/* Admin notes */}
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--on-surface-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Admin Notes</p>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add internal notes, quote amount, etc."
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid var(--border)', borderRadius: 10,
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  color: 'var(--on-surface)', backgroundColor: 'var(--surface)',
                  outline: 'none', resize: 'vertical',
                  lineHeight: 1.5, boxSizing: 'border-box', marginBottom: 10,
                }}
              />
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                style={{
                  width: '100%', padding: '10px',
                  background: 'var(--primary-gradient)',
                  border: 'none', borderRadius: 10,
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                  color: 'var(--on-surface)', cursor: 'pointer',
                }}
              >{savingNotes ? 'Saving...' : 'Save Notes'}</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}