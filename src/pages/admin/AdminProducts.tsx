import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, X,
  Upload, ToggleLeft, ToggleRight, Star,
  Image as ImageIcon,
} from 'lucide-react'
import { supabase } from '@/services/supabase'
import type { Product, Category, ProductVariant } from '@/types'

/* ── Shared styles ── */
const palette = {
  ink: '#17110D',
  muted: '#75675D',
  soft: '#F7F2EE',
  paper: '#FFFCF8',
  line: 'rgba(23,17,13,0.11)',
  lineStrong: 'rgba(23,17,13,0.18)',
  rose: '#9F6E64',
  gold: '#A77E42',
  green: '#4D765D',
  red: '#A4493F',
}

const F: React.CSSProperties = {
  width: '100%', padding: '11px 13px',
  border: `1px solid ${palette.line}`,
  borderRadius: 6,
  fontFamily: 'DM Sans, sans-serif', fontSize: 14,
  color: palette.ink, backgroundColor: '#FFFFFF',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
}
const focusF = (e: React.FocusEvent<any>) => {
  e.target.style.borderColor = palette.rose
  e.target.style.boxShadow = '0 0 0 3px rgba(159,110,100,0.12)'
}
const blurF = (e: React.FocusEvent<any>) => {
  e.target.style.borderColor = palette.line
  e.target.style.boxShadow = 'none'
}
const LBL: React.CSSProperties = {
  display: 'block',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 11, fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: palette.muted, marginBottom: 7,
}

const emptyForm = {
  name: '', slug: '', description: '', price: '',
  compare_price: '', category_id: '', materials: '',
  dimensions: '', care_instructions: '', stock_count: '0',
  is_available: true, is_featured: false,
  images: [] as string[],
  color_variants: [] as { name: string; hex: string }[],
  variants: [] as ProductVariant[],
}

type FormMode = 'closed' | 'create' | 'edit'

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [mode, setMode] = useState<FormMode>('closed')
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVariant, setUploadingVariant] = useState<number | null>(null)
  const [variantInput, setVariantInput] = useState({ name: '', images: '', color: '' })
  const fileRef = useRef<HTMLInputElement>(null)

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
    setVariantInput({ name: '', images: '', color: '' })
    setMode('create')
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    const variants = p.variants?.length
      ? p.variants.map((variant, index) => ({
          ...variant,
          id: variant.id || `variant-${index}-${variant.name}`,
          images: variant.images || [],
        }))
      : (p.color_variants || []).map((color, index) => ({
          id: `legacy-color-${index}-${color.name}`,
          name: color.name,
          color: color.hex,
          images: p.images || [],
        }))
    setForm({
      name: p.name, slug: p.slug, description: p.description,
      price: String(p.price), compare_price: String(p.compare_price || ''),
      category_id: p.category_id || '', materials: p.materials || '',
      dimensions: p.dimensions || '', care_instructions: p.care_instructions || '',
      stock_count: String(p.stock_count), is_available: p.is_available,
      is_featured: p.is_featured, images: p.images || [],
      color_variants: (p.color_variants as any) || [],
      variants,
    })
    setVariantInput({ name: '', images: '', color: '' })
    setMode('edit')
  }

  const closeForm = () => { setMode('closed'); setEditing(null) }

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
      materials: form.materials, dimensions: form.dimensions,
      care_instructions: form.care_instructions,
      stock_count: parseInt(form.stock_count),
      is_available: form.is_available, is_featured: form.is_featured,
      images: form.images.length
        ? form.images
        : form.variants.flatMap(variant => variant.images).slice(0, 2),
      color_variants: form.variants
        .filter(variant => variant.color)
        .map(variant => ({ name: variant.name, hex: variant.color })),
      variants: form.variants,
    }
    if (editing) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id)
      if (!error) {
        setProducts(prev => prev.map(p =>
          p.id === editing.id ? { ...p, ...payload, category: p.category } as any : p
        ))
      }
    } else {
      const { data, error } = await supabase.from('products')
        .insert(payload).select('*, category:categories(*)').single()
      if (!error && data) setProducts(prev => [data as any, ...prev])
    }
    setSaving(false)
    closeForm()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(id)
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  const uploadImages = async (files: File[]) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    const urls: string[] = []

    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', preset)
      fd.append('folder', 'eternal-bloom/products')
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) urls.push(data.secure_url)
    }
    return urls
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setUploadingImage(true)
    try {
      const urls = await uploadImages(Array.from(e.target.files))
      setForm(current => ({ ...current, images: [...current.images, ...urls] }))
    } finally {
      setUploadingImage(false)
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
    if (!e.target.files?.length) return
    setUploadingVariant(variantIndex)
    try {
      const urls = await uploadImages(Array.from(e.target.files))
      setForm(current => ({
        ...current,
        variants: current.variants.map((variant, index) =>
          index === variantIndex
            ? { ...variant, images: [...variant.images, ...urls] }
            : variant
        ),
      }))
    } finally {
      setUploadingVariant(null)
    }
    e.target.value = ''
  }

  const addVariant = () => {
    const name = variantInput.name.trim()
    if (!name) return
    const images = variantInput.images
      .split(/[\n,]/)
      .map(url => url.trim())
      .filter(Boolean)

    set('variants', [...form.variants, {
      id: globalThis.crypto.randomUUID(),
      name,
      images,
      ...(variantInput.color ? { color: variantInput.color } : {}),
    }])
    setVariantInput({ name: '', images: '', color: '' })
  }

  const removeVariant = (variantId: string) => {
    set('variants', form.variants.filter(variant => variant.id !== variantId))
  }

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    set('variants', form.variants.map((variant, index) =>
      index === variantIndex
        ? { ...variant, images: variant.images.filter((_, i) => i !== imageIndex) }
        : variant
    ))
  }

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category as any)?.name?.toLowerCase().includes(search.toLowerCase()))
    .filter(p => categoryFilter === 'all' || p.category_id === categoryFilter)

  /* ── Card toggle helpers ── */
  const toggleAvail = async (p: Product) => {
    await supabase.from('products').update({ is_available: !p.is_available }).eq('id', p.id)
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_available: !p.is_available } : x))
  }
  const toggleFeat = async (p: Product) => {
    await supabase.from('products').update({ is_featured: !p.is_featured }).eq('id', p.id)
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_featured: !p.is_featured } : x))
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    border: `1px solid ${palette.line}`,
    borderRadius: 8,
    padding: '18px',
    boxShadow: '0 18px 48px rgba(23,17,13,0.055)',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 600, color: palette.ink, letterSpacing: 0 }}>
            Products
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: palette.muted, marginTop: 3 }}>
            {products.length} products total
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '11px 18px', borderRadius: 6,
            background: palette.ink,
            border: `1px solid ${palette.ink}`, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700,
            color: '#FFFFFF',
            boxShadow: '0 12px 28px rgba(23,17,13,0.16)',
          }}
        >
          <Plus size={16} /> Add Product
        </motion.button>
      </div>

      {/* Search + category filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={15} color={palette.muted}
            style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...F, paddingLeft: 38 }}
            onFocus={focusF} onBlur={blurF}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[{ id: 'all', name: 'All' }, ...categories].map(cat => (
            <button
              key={(cat as any).id || 'all'}
              onClick={() => setCategoryFilter((cat as any).id || 'all')}
              style={{
                padding: '8px 14px', borderRadius: 6,
                background: categoryFilter === ((cat as any).id || 'all')
                  ? palette.ink
                  : 'white',
                border: `1px solid ${categoryFilter === ((cat as any).id || 'all') ? palette.ink : palette.line}`,
                fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500,
                color: categoryFilter === ((cat as any).id || 'all') ? '#FFFFFF' : palette.ink,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >{cat.name}</button>
          ))}
        </div>
      </div>

      {/* Product grid cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: palette.muted, fontFamily: 'DM Sans, sans-serif' }}>
          Loading products...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: palette.muted, fontSize: 15 }}>
            {products.length === 0 ? 'No products yet - add your first one.' : 'No products match your search.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={cardStyle}
            >
              {/* Image */}
              <div style={{
                width: '100%', aspectRatio: '4/3',
                borderRadius: 6, overflow: 'hidden',
                backgroundColor: palette.soft,
                marginBottom: 16,
                position: 'relative',
              }}>
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: palette.soft,
                  }}>
                    <ImageIcon size={28} color="rgba(23,17,13,0.28)" />
                  </div>
                )}
                {/* Badges */}
                <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
                  {p.is_featured && (
                    <span style={{
                      background: '#FFFFFF',
                      padding: '3px 8px', borderRadius: 4,
                      fontFamily: 'DM Sans, sans-serif', fontSize: 9, fontWeight: 800,
                      color: palette.gold, letterSpacing: '0.08em',
                      border: '1px solid rgba(167,126,66,0.28)',
                    }}>FEATURED</span>
                  )}
                  {!p.is_available && (
                    <span style={{
                      backgroundColor: 'rgba(28,15,10,0.75)', color: 'white',
                      padding: '3px 8px', borderRadius: 4,
                      fontFamily: 'DM Sans, sans-serif', fontSize: 9, fontWeight: 600,
                    }}>HIDDEN</span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div style={{ marginBottom: 14 }}>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 10,
                  fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: palette.rose, marginBottom: 5,
                }}>{(p.category as any)?.name || 'No category'}</p>
                <p style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 16, fontWeight: 600, color: palette.ink,
                  marginBottom: 6, lineHeight: 1.3,
                }}>{p.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, color: palette.ink }}>
                    ₹{p.price}
                  </span>
                  {p.compare_price && (
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: palette.muted, textDecoration: 'line-through' }}>
                      ₹{p.compare_price}
                    </span>
                  )}
                  <span style={{
                    marginLeft: 'auto',
                    fontFamily: 'DM Sans, sans-serif', fontSize: 11,
                    color: p.stock_count > 5 ? palette.green : p.stock_count > 0 ? palette.gold : palette.red,
                    fontWeight: 600,
                    backgroundColor: p.stock_count > 5 ? '#EEF7F2' : p.stock_count > 0 ? '#FFF5E0' : '#FFE8E8',
                    padding: '3px 8px', borderRadius: 4,
                  }}>
                    {p.stock_count} in stock
                  </span>
                </div>
              </div>

              {/* Quick toggles */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button
                  onClick={() => toggleAvail(p)}
                  style={{
                    flex: 1, padding: '7px 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    border: `1px solid ${palette.line}`,
                    borderRadius: 6, cursor: 'pointer',
                    backgroundColor: p.is_available ? '#EEF7F2' : '#FFE8E8',
                    color: p.is_available ? palette.green : palette.red,
                    fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  {p.is_available ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                  {p.is_available ? 'Available' : 'Hidden'}
                </button>
                <button
                  onClick={() => toggleFeat(p)}
                  style={{
                    flex: 1, padding: '7px 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    border: `1px solid ${palette.line}`,
                    borderRadius: 6, cursor: 'pointer',
                    backgroundColor: p.is_featured ? '#FFF8E0' : 'transparent',
                    color: p.is_featured ? palette.gold : palette.muted,
                    fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600,
                  }}
                >
                  <Star size={11} fill={p.is_featured ? palette.gold : 'none'} />
                  {p.is_featured ? 'Featured' : 'Not featured'}
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openEdit(p)}
                  style={{
                    flex: 1, padding: '9px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: palette.soft,
                    border: `1px solid ${palette.lineStrong}`,
                    borderRadius: 6, cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600,
                    color: palette.ink,
                  }}
                >
                  <Edit2 size={13} /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                  style={{
                    padding: '9px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(164,73,63,0.25)',
                    borderRadius: 6, cursor: 'pointer',
                    color: palette.red,
                    fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600,
                  }}
                >
                  <Trash2 size={13} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Full-page form modal ── */}
      <AnimatePresence>
        {mode !== 'closed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeForm}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(28,15,10,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5vh 16px',
            }}
          >
            {/* Modal — centered via the flex wrapper above, not position/transform math */}
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              style={{
                zIndex: 1001,
                width: '90vw', maxWidth: 760,
                maxHeight: '90vh',
                overflowY: 'auto',
                backgroundColor: palette.paper,
                borderRadius: 10,
                boxShadow: '0 34px 90px rgba(23,17,13,0.24)',
                border: `1px solid ${palette.lineStrong}`,
              }}
            >
              {/* Modal header — sticky */}
              <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                backgroundColor: palette.paper,
                padding: '20px 32px',
                borderBottom: `1px solid ${palette.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderRadius: '10px 10px 0 0',
              }}>
                <div>
                  <h2 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 22, fontWeight: 700, color: palette.ink,
                  }}>
                    {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  {mode === 'edit' && editing && (
                    <p style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 13, color: palette.muted, marginTop: 2,
                    }}>Editing: {editing.name}</p>
                  )}
                </div>
                <button
                  onClick={closeForm}
                  style={{
                    width: 36, height: 36, borderRadius: 6,
                    backgroundColor: '#FFFFFF',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={16} color={palette.ink} />
                </button>
              </div>

              {/* Modal body */}
              <div style={{ padding: '28px 32px' }}>

                {/* Section: Images */}
                <div style={{
                  backgroundColor: '#FFFFFF', borderRadius: 8,
                  padding: '24px', marginBottom: 20,
                  border: `1px solid ${palette.line}`,
                }}>
                  <p style={{ ...LBL, marginBottom: 16, fontSize: 12 }}>Product Images</p>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                    {form.images.map((url, i) => (
                      <div key={i} style={{ position: 'relative', width: 90, height: 90 }}>
                        <img src={url} alt=""
                          style={{
                            width: '100%', height: '100%',
                            objectFit: 'cover', borderRadius: 6,
                            border: `1px solid ${palette.lineStrong}`,
                          }}
                        />
                        <button
                          onClick={() => set('images', form.images.filter((_, idx) => idx !== i))}
                          style={{
                            position: 'absolute', top: -6, right: -6,
                            width: 22, height: 22, borderRadius: '50%',
                            backgroundColor: palette.ink, color: 'white',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        ><X size={11} /></button>
                        {i === 0 && (
                          <span style={{
                            position: 'absolute', bottom: 4, left: 4,
                            background: 'rgba(0,0,0,0.6)', color: 'white',
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 8, fontWeight: 700, padding: '2px 5px',
                            borderRadius: 4,
                          }}>MAIN</span>
                        )}
                      </div>
                    ))}

                    {/* Upload button */}
                    <label style={{
                      width: 90, height: 90, borderRadius: 6,
                      border: `1px dashed ${palette.lineStrong}`,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', gap: 4,
                      backgroundColor: palette.soft,
                      transition: 'all 0.2s',
                    }}>
                      {uploadingImage ? (
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%',
                          border: `2px solid ${palette.line}`,
                          borderTopColor: palette.rose,
                          animation: 'spin 0.7s linear infinite',
                        }} />
                      ) : (
                        <>
                          <Upload size={18} color={palette.muted} />
                          <span style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 10, color: palette.muted, fontWeight: 600,
                          }}>Upload</span>
                        </>
                      )}
                      <input
                        ref={fileRef}
                        type="file" multiple accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 11, color: palette.muted,
                  }}>
                    First image is the main display image. Upload multiple for gallery/hover effect.
                  </p>
                </div>

                {/* Section: Basic info */}
                <div style={{
                  backgroundColor: '#FFFFFF', borderRadius: 8,
                  padding: '24px', marginBottom: 20,
                  border: '1px solid rgba(23,17,13,0.11)',
                }}>
                  <p style={{ ...LBL, marginBottom: 20, fontSize: 12 }}>Basic Information</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={LBL}>Product Name *</label>
                      <input
                        style={F} value={form.name}
                        onChange={e => {
                          set('name', e.target.value)
                          if (!editing) set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
                        }}
                        placeholder="e.g. Bow Keychain"
                        onFocus={focusF} onBlur={blurF}
                      />
                    </div>

                    <div>
                      <label style={LBL}>Slug (auto-generated)</label>
                      <input
                        style={{ ...F, color: palette.muted }}
                        value={form.slug}
                        onChange={e => set('slug', e.target.value)}
                        placeholder="bow-keychain"
                        onFocus={focusF} onBlur={blurF}
                      />
                    </div>

                    <div>
                      <label style={LBL}>Category</label>
                      <select
                        style={{ ...F, cursor: 'pointer' }}
                        value={form.category_id}
                        onChange={e => set('category_id', e.target.value)}
                        onFocus={focusF} onBlur={blurF}
                      >
                        <option value="">No category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={LBL}>Price (₹) *</label>
                      <input
                        type="number" style={F} value={form.price}
                        onChange={e => set('price', e.target.value)}
                        placeholder="149"
                        onFocus={focusF} onBlur={blurF}
                      />
                    </div>

                    <div>
                      <label style={LBL}>Compare Price (₹)</label>
                      <input
                        type="number" style={F} value={form.compare_price}
                        onChange={e => set('compare_price', e.target.value)}
                        placeholder="199 (shows as strikethrough)"
                        onFocus={focusF} onBlur={blurF}
                      />
                    </div>

                    <div>
                      <label style={LBL}>Stock Count</label>
                      <input
                        type="number" style={F} value={form.stock_count}
                        onChange={e => set('stock_count', e.target.value)}
                        onFocus={focusF} onBlur={blurF}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={LBL}>Description</label>
                    <textarea
                      rows={4} style={{ ...F, resize: 'vertical', lineHeight: 1.6 }}
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                      placeholder="Describe the product — materials, feel, who it's perfect for..."
                      onFocus={focusF} onBlur={blurF}
                    />
                  </div>
                </div>

                {/* Section: Details */}
                <div style={{
                  backgroundColor: '#FFFFFF', borderRadius: 8,
                  padding: '24px', marginBottom: 20,
                  border: '1px solid rgba(23,17,13,0.11)',
                }}>
                  <p style={{ ...LBL, marginBottom: 20, fontSize: 12 }}>Product Details</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { label: 'Materials', key: 'materials', ph: 'e.g. 100% cotton yarn, metal keyring' },
                      { label: 'Dimensions', key: 'dimensions', ph: 'e.g. 6cm x 4cm' },
                      { label: 'Care Instructions', key: 'care_instructions', ph: 'e.g. Spot clean, air dry', col: 2 },
                    ].map(f => (
                      <div key={f.key} style={{ gridColumn: `span ${(f as any).col || 1}` }}>
                        <label style={LBL}>{f.label}</label>
                        <input
                          style={F} value={(form as any)[f.key]}
                          onChange={e => set(f.key, e.target.value)}
                          placeholder={f.ph}
                          onFocus={focusF} onBlur={blurF}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Sellable variants */}
                <div style={{
                  backgroundColor: '#FFFFFF', borderRadius: 8,
                  padding: '24px', marginBottom: 20,
                  border: '1px solid rgba(23,17,13,0.11)',
                }}>
                  <p style={{ ...LBL, marginBottom: 7, fontSize: 12 }}>Product Variants</p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: palette.muted, marginBottom: 16 }}>
                    Add each sellable style, colour, size, or form with its own images. Customers must choose one before adding it to their bag.
                  </p>

                  {form.variants.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                      {form.variants.map((variant, variantIndex) => (
                        <div key={variant.id} style={{
                          padding: 12, border: `1px solid ${palette.line}`,
                          borderRadius: 7, backgroundColor: palette.paper,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {variant.color && <span style={{
                              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                              backgroundColor: variant.color, border: '1px solid rgba(0,0,0,0.12)',
                            }} />}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: palette.ink }}>
                                {variant.name}
                              </p>
                              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: palette.muted, marginTop: 2 }}>
                                {variant.images.length} image{variant.images.length === 1 ? '' : 's'}
                              </p>
                            </div>
                            <label style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '7px 9px', border: `1px solid ${palette.line}`,
                              borderRadius: 5, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                              fontSize: 11, color: palette.ink,
                            }}>
                              <Upload size={12} />
                              {uploadingVariant === variantIndex ? 'Uploading...' : 'Upload images'}
                              <input
                                type="file" multiple accept="image/*" style={{ display: 'none' }}
                                onChange={e => handleVariantImageUpload(e, variantIndex)}
                                disabled={uploadingVariant !== null}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeVariant(variant.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: palette.muted, display: 'flex', padding: 4 }}
                              aria-label={`Remove ${variant.name}`}
                            ><X size={14} /></button>
                          </div>
                          {variant.images.length > 0 && (
                            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
                              {variant.images.map((image, imageIndex) => (
                                <div key={image} style={{ position: 'relative', width: 54, height: 54 }}>
                                  <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 5 }} />
                                  <button
                                    type="button"
                                    onClick={() => removeVariantImage(variantIndex, imageIndex)}
                                    style={{ position: 'absolute', top: -5, right: -5, width: 17, height: 17, borderRadius: '50%', background: palette.ink, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                                    aria-label="Remove variant image"
                                  ><X size={10} /></button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 10, marginBottom: 10 }}>
                    <input
                      placeholder="Variant name e.g. Blue flower / Large"
                      value={variantInput.name}
                      onChange={e => setVariantInput(current => ({ ...current, name: e.target.value }))}
                      style={F} onFocus={focusF} onBlur={blurF}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVariant())}
                    />
                    <label style={{ ...F, display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', color: palette.muted, fontSize: 11 }}>
                      <input
                        type="color" value={variantInput.color || palette.rose}
                        onChange={e => setVariantInput(current => ({ ...current, color: e.target.value }))}
                        style={{ width: 25, height: 25, padding: 0, border: 0, cursor: 'pointer' }}
                      />
                      Colour
                    </label>
                  </div>
                  <textarea
                    rows={2} placeholder="Optional image URLs, one per line (uploads can be added after creating the variant)"
                    value={variantInput.images}
                    onChange={e => setVariantInput(current => ({ ...current, images: e.target.value }))}
                    style={{ ...F, resize: 'vertical', marginBottom: 10 }}
                    onFocus={focusF} onBlur={blurF}
                  />
                  <button
                    type="button"
                    onClick={addVariant}
                    style={{ padding: '10px 18px', borderRadius: 6, background: palette.ink, border: `1px solid ${palette.ink}`, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}
                  >Add variant</button>
                </div>

                {/* Section: Visibility */}
                <div style={{
                  backgroundColor: '#FFFFFF', borderRadius: 8,
                  padding: '24px', marginBottom: 28,
                  border: '1px solid rgba(23,17,13,0.11)',
                }}>
                  <p style={{ ...LBL, marginBottom: 16, fontSize: 12 }}>Visibility</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[
                      { label: 'Available for sale', key: 'is_available', desc: 'Visible and purchasable' },
                      { label: 'Featured product', key: 'is_featured', desc: 'Shown in featured section' },
                    ].map(f => (
                      <button
                        key={f.key}
                        onClick={() => set(f.key, !(form as any)[f.key])}
                        style={{
                          flex: 1, padding: '14px 16px',
                          border: `1px solid ${(form as any)[f.key] ? palette.ink : palette.line}`,
                          borderRadius: 6,
                          background: (form as any)[f.key]
                            ? palette.soft
                            : '#FFFFFF',
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          {(form as any)[f.key]
                            ? <ToggleRight size={18} color={palette.ink} />
                            : <ToggleLeft size={18} color={palette.muted} />
                          }
                          <span style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 13, fontWeight: 700,
                            color: (form as any)[f.key] ? palette.ink : palette.muted,
                          }}>{f.label}</span>
                        </div>
                        <p style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 11, color: palette.muted, paddingLeft: 26,
                        }}>{f.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save button — sticky bottom */}
                <div style={{
                  position: 'sticky', bottom: 0,
                  backgroundColor: palette.paper,
                  padding: '16px 0',
                  borderTop: `1px solid ${palette.line}`,
                  display: 'flex', gap: 12, justifyContent: 'flex-end',
                  marginTop: -28, marginLeft: -32, marginRight: -32,
                  paddingLeft: 32, paddingRight: 32,
                }}>
                  <button
                    onClick={closeForm}
                    style={{
                      padding: '12px 24px', borderRadius: 6,
                      border: `1px solid ${palette.lineStrong}`,
                      background: 'transparent',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 14, fontWeight: 500, color: '#5C4033',
                      cursor: 'pointer',
                    }}
                  >Cancel</button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    disabled={saving || !form.name || !form.price}
                    style={{
                      padding: '12px 32px', borderRadius: 6,
                      background: palette.ink,
                      border: `1px solid ${palette.ink}`, cursor: saving ? 'not-allowed' : 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 14, fontWeight: 700, color: '#FFFFFF',
                      opacity: saving || !form.name || !form.price ? 0.6 : 1,
                      boxShadow: '0 12px 28px rgba(23,17,13,0.16)',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    {saving && (
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        border: '2px solid rgba(28,15,10,0.3)',
                        borderTopColor: '#FFFFFF',
                        animation: 'spin 0.7s linear infinite',
                      }} />
                    )}
                    {saving ? 'Saving...' : mode === 'edit' ? 'Update Product' : 'Add Product'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
