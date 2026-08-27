import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, ImageIcon } from 'lucide-react'
import { supabase } from '@/services/supabase'
import type { Category } from '@/types'

const F: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid rgba(255,133,208,0.25)',
  borderRadius: 10,
  fontFamily: 'DM Sans, sans-serif', fontSize: 14,
  color: '#1C0F0A', backgroundColor: '#FFF8F5',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}
const focusF = (e: React.FocusEvent<any>) => {
  e.target.style.borderColor = '#FF85D0'
  e.target.style.boxShadow = '0 0 0 3px rgba(255,133,208,0.12)'
}
const blurF = (e: React.FocusEvent<any>) => {
  e.target.style.borderColor = 'rgba(255,133,208,0.25)'
  e.target.style.boxShadow = 'none'
}
const LBL: React.CSSProperties = {
  display: 'block', fontFamily: 'DM Sans, sans-serif',
  fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: '#9C7B6E', marginBottom: 8,
}

const emptyForm = { name: '', slug: '', description: '', image_url: '' }
type Mode = 'closed' | 'create' | 'edit'

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<Mode>('closed')
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('categories').select('*').order('sort_order', { ascending: true })
    setCategories(data || [])
    setLoading(false)
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const closeForm = () => { setMode('closed'); setEditing(null) }

  const openCreate = () => {
    setEditing(null); setForm({ ...emptyForm }); setMode('create')
  }
  const openEdit = (c: Category) => {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug, description: c.description || '', image_url: c.image_url || '' })
    setMode('edit')
  }

  const handleSave = async () => {
    if (!form.name) return
    setSaving(true)
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: form.description,
      image_url: form.image_url,
    }
    if (editing) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editing.id)
      if (!error) setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, ...payload } : c))
    } else {
      const { data, error } = await supabase
        .from('categories').insert({ ...payload, sort_order: categories.length }).select().single()
      if (!error && data) setCategories(prev => [...prev, data as Category])
    }
    setSaving(false)
    closeForm()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in it will be uncategorized.')) return
    setDeleting(id)
    await supabase.from('categories').delete().eq('id', id)
    setCategories(prev => prev.filter(c => c.id !== id))
    setDeleting(null)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#1C0F0A' }}>
            Categories
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#9C7B6E', marginTop: 4 }}>
            {categories.length} categories
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 22px', borderRadius: 999,
            background: 'linear-gradient(135deg,#FF85D0,#FFC8A2,#FFE680)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700,
            color: '#1C0F0A', boxShadow: '0 4px 16px rgba(255,133,208,0.3)',
          }}
        >
          <Plus size={16} /> Add Category
        </motion.button>
      </div>

      {/* Categories grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9C7B6E', fontFamily: 'DM Sans, sans-serif' }}>
          Loading...
        </div>
      ) : categories.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0',
          backgroundColor: 'white', borderRadius: 16,
          border: '1px solid rgba(255,133,208,0.15)',
        }}>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#1C0F0A', marginBottom: 8 }}>
            No categories yet
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#9C7B6E', marginBottom: 24 }}>
            Add your first category to start organizing products.
          </p>
          <button
            onClick={openCreate}
            style={{
              padding: '11px 24px', borderRadius: 999,
              background: 'linear-gradient(135deg,#FF85D0,#FFC8A2)',
              border: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700,
              color: '#1C0F0A',
            }}
          >Add First Category</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(255,133,208,0.18)',
                borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(255,133,208,0.06)',
              }}
            >
              {/* Category image */}
              <div style={{
                width: '100%', aspectRatio: '16/9',
                backgroundColor: 'rgba(255,200,162,0.08)',
                overflow: 'hidden',
              }}>
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg,rgba(255,133,208,0.1),rgba(255,200,162,0.1))',
                  }}>
                    <ImageIcon size={24} color="rgba(156,123,110,0.3)" />
                  </div>
                )}
              </div>

              <div style={{ padding: '16px' }}>
                <p style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 16, fontWeight: 600, color: '#1C0F0A', marginBottom: 4,
                }}>{cat.name}</p>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 12, color: '#9C7B6E', marginBottom: 4,
                }}>/{cat.slug}</p>
                {cat.description && (
                  <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 12, color: '#5C4033', lineHeight: 1.4, marginBottom: 12,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>{cat.description}</p>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => openEdit(cat)}
                    style={{
                      flex: 1, padding: '9px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      background: 'linear-gradient(135deg,rgba(255,133,208,0.12),rgba(255,200,162,0.12))',
                      border: '1.5px solid rgba(255,133,208,0.25)',
                      borderRadius: 10, cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600,
                      color: '#1C0F0A',
                    }}
                  >
                    <Edit2 size={13} /> Edit
                  </motion.button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deleting === cat.id}
                    style={{
                      padding: '9px 14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1.5px solid rgba(200,50,50,0.2)',
                      borderRadius: 10, cursor: 'pointer',
                      backgroundColor: 'transparent', color: '#C33',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Centered modal ── */}
      <AnimatePresence>
        {mode !== 'closed' && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeForm}
              style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(28,15,10,0.5)',
                backdropFilter: 'blur(4px)', zIndex: 1000,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95}}
              animate={{ opacity: 1, scale: 1}}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              style={{
                position: 'fixed',
                top: '50%', left: '50%',
                x: '-50%', y: '-50%',
                zIndex: 1001,
                width: '90vw', maxWidth: 560,
                maxHeight: '90vh', overflowY: 'auto',
                backgroundColor: '#FFF8F5',
                borderRadius: 24,
                boxShadow: '0 32px 80px rgba(255,133,208,0.2)',
                border: '1px solid rgba(255,133,208,0.2)',
              }}
            >
              {/* Header */}
              <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                backgroundColor: '#FFF8F5',
                padding: '20px 28px',
                borderBottom: '1px solid rgba(255,133,208,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderRadius: '24px 24px 0 0',
              }}>
                <h2 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 20, fontWeight: 700, color: '#1C0F0A',
                }}>
                  {mode === 'edit' ? `Edit: ${editing?.name}` : 'Add New Category'}
                </h2>
                <button
                  onClick={closeForm}
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    backgroundColor: 'rgba(255,133,208,0.12)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={15} color="#1C0F0A" />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '28px' }}>
                {/* Image preview */}
                {form.image_url && (
                  <div style={{
                    width: '100%', aspectRatio: '16/9',
                    borderRadius: 14, overflow: 'hidden',
                    marginBottom: 24,
                    border: '1px solid rgba(255,133,208,0.2)',
                  }}>
                    <img src={form.image_url} alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => (e.target as HTMLImageElement).style.display = 'none'}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
                  <div>
                    <label style={LBL}>Category Name *</label>
                    <input
                      style={F} value={form.name}
                      placeholder="e.g. Keychains"
                      onChange={e => {
                        set('name', e.target.value)
                        if (!editing) set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
                      }}
                      onFocus={focusF} onBlur={blurF}
                    />
                  </div>
                  <div>
                    <label style={LBL}>Slug (auto-generated)</label>
                    <input
                      style={{ ...F, color: '#9C7B6E' }} value={form.slug}
                      placeholder="keychains"
                      onChange={e => set('slug', e.target.value)}
                      onFocus={focusF} onBlur={blurF}
                    />
                  </div>
                  <div>
                    <label style={LBL}>Description</label>
                    <input
                      style={F} value={form.description}
                      placeholder="e.g. Carry a little bloom and a lot of love"
                      onChange={e => set('description', e.target.value)}
                      onFocus={focusF} onBlur={blurF}
                    />
                  </div>
                  <div>
                    <label style={LBL}>Image URL</label>
                    <input
                      style={F} value={form.image_url}
                      placeholder="https://res.cloudinary.com/..."
                      onChange={e => set('image_url', e.target.value)}
                      onFocus={focusF} onBlur={blurF}
                    />
                    <p style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: 11,
                      color: '#9C7B6E', marginTop: 6,
                    }}>
                      Upload image to Cloudinary first → copy the URL → paste here
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button
                    onClick={closeForm}
                    style={{
                      padding: '12px 24px', borderRadius: 999,
                      border: '1.5px solid rgba(255,133,208,0.3)',
                      background: 'transparent',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 14, fontWeight: 500, color: '#5C4033', cursor: 'pointer',
                    }}
                  >Cancel</button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    disabled={saving || !form.name}
                    style={{
                      padding: '12px 32px', borderRadius: 999,
                      background: 'linear-gradient(135deg,#FF85D0,#FFC8A2,#FFE680)',
                      border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 14, fontWeight: 700, color: '#1C0F0A',
                      opacity: saving || !form.name ? 0.6 : 1,
                      boxShadow: '0 4px 16px rgba(255,133,208,0.3)',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    {saving && (
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        border: '2px solid rgba(28,15,10,0.3)',
                        borderTopColor: '#1C0F0A',
                        animation: 'spin 0.7s linear infinite',
                      }} />
                    )}
                    {saving ? 'Saving...' : mode === 'edit' ? 'Update Category' : 'Add Category'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}