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