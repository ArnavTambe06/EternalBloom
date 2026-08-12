import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, GripVertical } from 'lucide-react'
import { supabase } from '@/services/supabase'
import type { Category } from '@/types'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 10, backgroundColor: 'var(--surface)',
  fontFamily: 'var(--font-body)', fontSize: 14,
  color: 'var(--on-surface)', outline: 'none',
  boxSizing: 'border-box',
}

const emptyForm = { name: '', slug: '', description: '', image_url: '' }

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    setCategories(data || [])
    setLoading(false)
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setShowForm(true)
  }

  const openEdit = (c: Category) => {
    setEditing(c)
    setForm({
      name: c.name, slug: c.slug,
      description: c.description || '',
      image_url: c.image_url || '',
    })
    setShowForm(true)
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
      const { data, error } = await supabase.from('categories').insert({ ...payload, sort_order: categories.length }).select().single()
      if (!error && data) setCategories(prev => [...prev, data as Category])
    }

    setSaving(false)
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in it will be uncategorized.')) return
    await supabase.from('categories').delete().eq('id', id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div style={{ padding: '32px 36px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--on-surface)' }}>
            Categories
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-surface-muted)', marginTop: 4 }}>
            {categories.length} categories
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 20px',
            background: 'var(--primary-gradient)',
            border: 'none', borderRadius: 12,
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
            color: 'var(--on-surface)', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255,133,208,0.3)',
          }}
        >
          <Plus size={16} /> Add Category
        </motion.button>
      </div>

      {/* Categories list */}
      <div style={{
        backgroundColor: 'var(--surface-white)',
        borderRadius: 16, border: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--on-surface-muted)', fontFamily: 'var(--font-body)' }}>
            Loading...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--on-surface-muted)', marginBottom: 16 }}>
              No categories yet. Add your first one!
            </p>
            <button
              onClick={openCreate}
              style={{
                padding: '10px 24px',
                background: 'var(--primary-gradient)',
                border: 'none', borderRadius: 999,
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                color: 'var(--on-surface)', cursor: 'pointer',
              }}
            >Add Category</button>
          </div>
        ) : (
          categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px',
                borderBottom: i < categories.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <GripVertical size={16} color="var(--on-surface-faint)" style={{ flexShrink: 0, cursor: 'grab' }} />

              {/* Image */}
              <div style={{
                width: 52, height: 52, borderRadius: 10,
                backgroundColor: 'var(--surface-section)',
                overflow: 'hidden', flexShrink: 0,
              }}>
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    🌸
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: 'var(--on-surface)' }}>
                  {cat.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface-muted)', marginTop: 2 }}>
                  /{cat.slug} {cat.description ? `· ${cat.description}` : ''}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => openEdit(cat)}
                  style={{
                    padding: '8px 14px',
                    border: '1.5px solid var(--border)',
                    borderRadius: 8, background: 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                    fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface)',
                  }}
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  style={{
                    padding: '8px 10px',
                    border: '1.5px solid #FFD0D0',
                    borderRadius: 8, background: 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    color: '#C33',
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(61,26,46,0.5)', backdropFilter: 'blur(4px)', zIndex: 200 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 201, backgroundColor: 'var(--surface-white)',
                borderRadius: 20, padding: '28px',
                width: '90vw', maxWidth: 480,
                boxShadow: '0 24px 80px rgba(61,26,46,0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--on-surface)' }}>
                  {editing ? 'Edit Category' : 'Add Category'}
                </h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-muted)' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Category Name *', key: 'name' },
                  { label: 'Slug (auto-generated)', key: 'slug' },
                  { label: 'Description', key: 'description' },
                  { label: 'Image URL (Cloudinary)', key: 'image_url' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{
                      display: 'block', fontFamily: 'var(--font-body)',
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'var(--on-surface-muted)', marginBottom: 6,
                    }}>{f.label}</label>
                    <input
                      style={inputStyle}
                      value={(form as any)[f.key]}
                      onChange={e => {
                        set(f.key, e.target.value)
                        if (f.key === 'name' && !editing) {
                          set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
                        }
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    width: '100%', padding: '13px',
                    background: 'var(--primary-gradient)',
                    border: 'none', borderRadius: 12,
                    fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
                    color: 'var(--on-surface)', cursor: saving ? 'not-allowed' : 'pointer',
                    marginTop: 4, boxShadow: '0 4px 16px rgba(255,133,208,0.3)',
                  }}
                >
                  {saving ? 'Saving...' : editing ? 'Update Category' : 'Add Category'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}