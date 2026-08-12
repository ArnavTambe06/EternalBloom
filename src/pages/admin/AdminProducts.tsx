import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Upload, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import { supabase } from '@/services/supabase'
import type { Product, Category } from '@/types'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 10, backgroundColor: 'var(--surface)',
  fontFamily: 'var(--font-body)', fontSize: 14,
  color: 'var(--on-surface)', outline: 'none',
  boxSizing: 'border-box',
}

const emptyForm = {
  name: '', slug: '', description: '', price: '',
  compare_price: '', category_id: '', materials: '',
  dimensions: '', care_instructions: '', stock_count: '0',
  is_available: true, is_featured: false,
  images: [] as string[],
  color_variants: [] as { name: string; hex: string }[],
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [colorInput, setColorInput] = useState({ name: '', hex: '#FF85D0' })
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts((prods as any) || [])
    setCategories((cats as any) || [])
    setLoading(false)
  }

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name, slug: p.slug, description: p.description,
      price: String(p.price), compare_price: String(p.compare_price || ''),
      category_id: p.category_id || '', materials: p.materials || '',
      dimensions: p.dimensions || '', care_instructions: p.care_instructions || '',
      stock_count: String(p.stock_count), is_available: p.is_available,
      is_featured: p.is_featured, images: p.images || [],
      color_variants: (p.color_variants as any) || [],
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) return
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: form.description,
      price: parseFloat(form.price),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      category_id: form.category_id || null,
      materials: form.materials,
      dimensions: form.dimensions,
      care_instructions: form.care_instructions,
      stock_count: parseInt(form.stock_count),
      is_available: form.is_available,
      is_featured: form.is_featured,
      images: form.images,
      color_variants: form.color_variants,
    }

    if (editing) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id)
      if (!error) {
        setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload, category: p.category } as any : p))
      }
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select('*, category:categories(*)').single()
      if (!error && data) setProducts(prev => [data as any, ...prev])
    }

    setSaving(false)
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(id)
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  const handleToggleAvailable = async (p: Product) => {
    await supabase.from('products').update({ is_available: !p.is_available }).eq('id', p.id)
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_available: !p.is_available } : x))
  }

  const handleToggleFeatured = async (p: Product) => {
    await supabase.from('products').update({ is_featured: !p.is_featured }).eq('id', p.id)
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_featured: !p.is_featured } : x))
  }

  const addColor = () => {
    if (!colorInput.name) return
    set('color_variants', [...form.color_variants, { ...colorInput }])
    setColorInput({ name: '', hex: '#FF85D0' })
  }

  const removeColor = (i: number) => {
    set('color_variants', form.color_variants.filter((_, idx) => idx !== i))
  }

  // Cloudinary upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadingImage(true)

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      formData.append('folder', 'eternal-bloom/products')

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST', body: formData,
      })
      const data = await res.json()
      if (data.secure_url) {
        set('images', [...form.images, data.secure_url])
      }
    }
    setUploadingImage(false)
  }

  const removeImage = (i: number) => {
    set('images', form.images.filter((_, idx) => idx !== i))
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category as any)?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '32px 36px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--on-surface)' }}>
            Products
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-surface-muted)', marginTop: 4 }}>
            {products.length} products total
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
          <Plus size={16} /> Add Product
        </motion.button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24, maxWidth: 360 }}>
        <Search size={16} color="var(--on-surface-faint)"
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, paddingLeft: 42 }}
        />
      </div>

      {/* Product table */}
      <div style={{
        backgroundColor: 'var(--surface-white)',
        borderRadius: 16, border: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--surface)' }}>
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
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
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--on-surface-muted)', fontFamily: 'var(--font-body)' }}>
                  Loading products...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--on-surface-muted)', fontFamily: 'var(--font-body)' }}>
                  No products found.
                </td>
              </tr>
            ) : filtered.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                {/* Product */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 8,
                      backgroundColor: 'var(--surface-section)',
                      overflow: 'hidden', flexShrink: 0,
                    }}>
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>
                        {p.name}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface-muted)' }}>
                        {p.slug}
                      </p>
                    </div>
                  </div>
                </td>
                {/* Category */}
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--on-surface-muted)' }}>
                  {(p.category as any)?.name || '—'}
                </td>
                {/* Price */}
                <td style={{ padding: '14px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>
                    ₹{p.price}
                  </p>
                  {p.compare_price && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--on-surface-faint)', textDecoration: 'line-through' }}>
                      ₹{p.compare_price}
                    </p>
                  )}
                </td>
                {/* Stock */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    backgroundColor: p.stock_count > 5 ? '#EEF7F2' : p.stock_count > 0 ? '#FFF5E0' : '#FFE8E8',
                    color: p.stock_count > 5 ? '#5A8C6E' : p.stock_count > 0 ? '#B88B00' : '#C33',
                    padding: '3px 10px', borderRadius: 999,
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                  }}>
                    {p.stock_count} left
                  </span>
                </td>
                {/* Status */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button
                      onClick={() => handleToggleAvailable(p)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '3px 8px', borderRadius: 6,
                        backgroundColor: p.is_available ? '#EEF7F2' : '#FFE8E8',
                        color: p.is_available ? '#5A8C6E' : '#C33',
                        fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                      }}
                    >
                      {p.is_available ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                      {p.is_available ? 'Available' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '3px 8px', borderRadius: 6,
                        backgroundColor: p.is_featured ? '#FFF8E0' : 'transparent',
                        color: p.is_featured ? '#B88B00' : 'var(--on-surface-faint)',
                        fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                      }}
                    >
                      <Star size={11} fill={p.is_featured ? '#B88B00' : 'none'} />
                      {p.is_featured ? 'Featured' : 'Not featured'}
                    </button>
                  </div>
                </td>
                {/* Actions */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => openEdit(p)}
                      style={{
                        padding: '7px 12px',
                        border: '1.5px solid var(--border)',
                        borderRadius: 8, background: 'white',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                        fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-surface)',
                      }}
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      style={{
                        padding: '7px 10px',
                        border: '1.5px solid #FFD0D0',
                        borderRadius: 8, background: 'white',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        color: '#C33',
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(61,26,46,0.5)',
                backdropFilter: 'blur(4px)', zIndex: 200,
              }}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '100%', maxWidth: 560,
                backgroundColor: 'var(--surface-white)',
                zIndex: 201, overflowY: 'auto',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
              }}
            >
              {/* Form header */}
              <div style={{
                padding: '20px 28px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0,
                backgroundColor: 'var(--surface-white)', zIndex: 1,
              }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--on-surface)' }}>
                  {editing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    backgroundColor: 'var(--surface)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={15} color="var(--on-surface)" />
                </button>
              </div>

              {/* Form body */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Images */}
                <div>
                  <label style={{
                    display: 'block', fontFamily: 'var(--font-body)',
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--on-surface-muted)', marginBottom: 10,
                  }}>Product Images</label>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                    {form.images.map((url, i) => (
                      <div key={i} style={{ position: 'relative', width: 72, height: 72 }}>
                        <img src={url} alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                        <button
                          onClick={() => removeImage(i)}
                          style={{
                            position: 'absolute', top: -6, right: -6,
                            width: 20, height: 20, borderRadius: '50%',
                            backgroundColor: '#C33', color: 'white',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}

                    <label style={{
                      width: 72, height: 72, borderRadius: 8,
                      border: '2px dashed var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', backgroundColor: 'var(--surface)',
                      flexDirection: 'column', gap: 4,
                    }}>
                      {uploadingImage ? (
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: '2px solid var(--border)',
                          borderTopColor: 'var(--primary)',
                          animation: 'spin 0.7s linear infinite',
                        }} />
                      ) : (
                        <>
                          <Upload size={18} color="var(--on-surface-faint)" />
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--on-surface-faint)' }}>
                            Upload
                          </span>
                        </>
                      )}
                      <input
                        type="file" multiple accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--on-surface-faint)' }}>
                    Images are uploaded to Cloudinary. First image is the main display image.
                  </p>
                </div>

                {/* Basic info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { label: 'Product Name *', key: 'name', col: 2, type: 'text' },
                    { label: 'Slug (auto-generated)', key: 'slug', col: 2, type: 'text' },
                    { label: 'Price (₹) *', key: 'price', col: 1, type: 'number' },
                    { label: 'Compare Price (₹)', key: 'compare_price', col: 1, type: 'number' },
                    { label: 'Stock Count', key: 'stock_count', col: 1, type: 'number' },
                  ].map(f => (
                    <div key={f.key} style={{ gridColumn: `span ${f.col}` }}>
                      <label style={{
                        display: 'block', fontFamily: 'var(--font-body)',
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: 'var(--on-surface-muted)', marginBottom: 6,
                      }}>{f.label}</label>
                      <input
                        type={f.type}
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

                  {/* Category */}
                  <div style={{ gridColumn: 'span 1' }}>
                    <label style={{
                      display: 'block', fontFamily: 'var(--font-body)',
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'var(--on-surface-muted)', marginBottom: 6,
                    }}>Category</label>
                    <select
                      value={form.category_id}
                      onChange={e => set('category_id', e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option value="">No category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{
                    display: 'block', fontFamily: 'var(--font-body)',
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--on-surface-muted)', marginBottom: 6,
                  }}>Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                {/* Details */}
                {[
                  { label: 'Materials', key: 'materials' },
                  { label: 'Dimensions', key: 'dimensions' },
                  { label: 'Care Instructions', key: 'care_instructions' },
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
                      onChange={e => set(f.key, e.target.value)}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                ))}

                {/* Color variants */}
                <div>
                  <label style={{
                    display: 'block', fontFamily: 'var(--font-body)',
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--on-surface-muted)', marginBottom: 10,
                  }}>Colour Variants</label>

                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    {form.color_variants.map((c, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px 4px 6px',
                        border: '1.5px solid var(--border)',
                        borderRadius: 999,
                      }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: c.hex, flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12 }}>{c.name}</span>
                        <button onClick={() => removeColor(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-faint)', display: 'flex' }}>
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      placeholder="Colour name"
                      value={colorInput.name}
                      onChange={e => setColorInput(c => ({ ...c, name: e.target.value }))}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input
                      type="color"
                      value={colorInput.hex}
                      onChange={e => setColorInput(c => ({ ...c, hex: e.target.value }))}
                      style={{ width: 44, height: 40, borderRadius: 8, border: '1.5px solid var(--border)', cursor: 'pointer', padding: 2 }}
                    />
                    <button
                      onClick={addColor}
                      style={{
                        padding: '10px 16px',
                        background: 'var(--primary-gradient)',
                        border: 'none', borderRadius: 8,
                        fontFamily: 'var(--font-body)', fontSize: 13,
                        fontWeight: 600, color: 'var(--on-surface)', cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >Add</button>
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: 16 }}>
                  {[
                    { label: 'Available for sale', key: 'is_available' },
                    { label: 'Featured product', key: 'is_featured' },
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => set(f.key, !(form as any)[f.key])}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 16px',
                        border: `1.5px solid ${(form as any)[f.key] ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 10,
                        backgroundColor: (form as any)[f.key] ? 'var(--primary-pale)' : 'transparent',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {(form as any)[f.key]
                        ? <ToggleRight size={18} color="var(--primary)" />
                        : <ToggleLeft size={18} color="var(--on-surface-faint)" />
                      }
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                        color: (form as any)[f.key] ? 'var(--primary)' : 'var(--on-surface-muted)',
                      }}>{f.label}</span>
                    </button>
                  ))}
                </div>

                {/* Save button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    width: '100%', padding: '14px',
                    background: 'var(--primary-gradient)',
                    border: 'none', borderRadius: 12,
                    fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
                    color: 'var(--on-surface)', cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    boxShadow: '0 4px 16px rgba(255,133,208,0.3)',
                  }}
                >
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                </motion.button>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}