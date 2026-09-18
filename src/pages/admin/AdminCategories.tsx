import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, ImageIcon, FolderTree } from 'lucide-react'
import { supabase } from '@/services/supabase'
import type { Category, Subcategory } from '@/types'

const F: CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid rgba(232,163,185,0.25)',
  borderRadius: 10,
  fontFamily: 'DM Sans, sans-serif', fontSize: 14,
  color: '#241B20', backgroundColor: '#FFF0E8',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const focusF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = '#E8A3B9'
  e.target.style.boxShadow = '0 0 0 3px rgba(232,163,185,0.12)'
}

const blurF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = 'rgba(232,163,185,0.25)'
  e.target.style.boxShadow = 'none'
}

const LBL: CSSProperties = {
  display: 'block', fontFamily: 'DM Sans, sans-serif',
  fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: '#8C665D', marginBottom: 8,
}

const emptyForm = { name: '', slug: '', description: '', image_url: '' }
type Mode = 'closed' | 'category-create' | 'category-edit' | 'subcategory-create' | 'subcategory-edit'

const slugify = (value: string) => value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<Mode>('closed')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
  const [parentCategoryId, setParentCategoryId] = useState('')
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [{ data: cats, error: categoryError }, { data: subs, error: subcategoryError }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('subcategories').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true }),
    ])

    if (categoryError || subcategoryError) {
      setError(categoryError?.message || subcategoryError?.message || 'Could not load categories.')
    } else {
      setError('')
    }
    setCategories((cats as Category[]) || [])
    setSubcategories((subs as Subcategory[]) || [])
    setLoading(false)
  }

  const set = (key: keyof typeof emptyForm, value: string) => setForm(current => ({ ...current, [key]: value }))

  const closeForm = () => {
    setMode('closed')
    setEditingCategory(null)
    setEditingSubcategory(null)
    setParentCategoryId('')
  }

  const openCreateCategory = () => {
    setError('')
    setEditingCategory(null)
    setEditingSubcategory(null)
    setForm({ ...emptyForm })
    setMode('category-create')
  }

  const openEditCategory = (category: Category) => {
    setError('')
    setEditingCategory(category)
    setEditingSubcategory(null)
    setForm({ name: category.name, slug: category.slug, description: category.description || '', image_url: category.image_url || '' })
    setMode('category-edit')
  }

  const openCreateSubcategory = (categoryId = '') => {
    setError('')
    setEditingCategory(null)
    setEditingSubcategory(null)
    setParentCategoryId(categoryId || categories[0]?.id || '')
    setForm({ ...emptyForm })
    setMode('subcategory-create')
  }

  const openEditSubcategory = (subcategory: Subcategory) => {
    setError('')
    setEditingCategory(null)
    setEditingSubcategory(subcategory)
    setParentCategoryId(subcategory.category_id)
    setForm({ name: subcategory.name, slug: subcategory.slug, description: subcategory.description || '', image_url: subcategory.image_url || '' })
    setMode('subcategory-edit')
  }

  const handleSave = async () => {
    if (!form.name.trim() || (mode.startsWith('subcategory') && !parentCategoryId)) return
    setSaving(true)
    setError('')
    const payload = {
      name: form.name.trim(),
      slug: form.slug || slugify(form.name),
      description: form.description.trim(),
      image_url: form.image_url.trim(),
    }
    let saveError: string | null = null

    if (mode === 'category-edit' && editingCategory) {
      const { error: result } = await supabase.from('categories').update(payload).eq('id', editingCategory.id)
      saveError = result?.message || null
      if (!saveError) setCategories(current => current.map(category => category.id === editingCategory.id ? { ...category, ...payload } : category))
    } else if (mode === 'category-create') {
      const { data, error: result } = await supabase.from('categories').insert({ ...payload, sort_order: categories.length }).select().single()
      saveError = result?.message || null
      if (!saveError && data) setCategories(current => [...current, data as Category])
    } else if (mode === 'subcategory-edit' && editingSubcategory) {
      const subcategoryPayload = { ...payload, category_id: parentCategoryId }
      const { error: result } = await supabase.from('subcategories').update(subcategoryPayload).eq('id', editingSubcategory.id)
      saveError = result?.message || null
      if (!saveError) setSubcategories(current => current.map(subcategory => subcategory.id === editingSubcategory.id ? { ...subcategory, ...subcategoryPayload } : subcategory))
    } else if (mode === 'subcategory-create') {
      const subcategoryPayload = {
        ...payload,
        category_id: parentCategoryId,
        sort_order: subcategories.filter(subcategory => subcategory.category_id === parentCategoryId).length,
      }
      const { data, error: result } = await supabase.from('subcategories').insert(subcategoryPayload).select().single()
      saveError = result?.message || null
      if (!saveError && data) setSubcategories(current => [...current, data as Subcategory])
    }

    setSaving(false)
    if (saveError) setError(saveError)
    else closeForm()
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Its subcategories will be removed and products will become uncategorized.')) return
    setDeleting(id)
    const { error: result } = await supabase.from('categories').delete().eq('id', id)
    if (result) setError(result.message)
    else {
      setCategories(current => current.filter(category => category.id !== id))
      setSubcategories(current => current.filter(subcategory => subcategory.category_id !== id))
    }
    setDeleting(null)
  }

  const handleDeleteSubcategory = async (subcategory: Subcategory) => {
    if (!confirm(`Delete “${subcategory.name}”? Products assigned to it will stay in their category.`)) return
    setDeleting(subcategory.id)
    const { error: result } = await supabase.from('subcategories').delete().eq('id', subcategory.id)
    if (result) setError(result.message)
    else setSubcategories(current => current.filter(item => item.id !== subcategory.id))
    setDeleting(null)
  }

  const isSubcategoryMode = mode.startsWith('subcategory')
  const modalTitle = mode === 'category-edit'
    ? `Edit: ${editingCategory?.name}`
    : mode === 'subcategory-edit'
      ? `Edit: ${editingSubcategory?.name}`
      : mode === 'subcategory-create' ? 'Add Subcategory' : 'Add New Category'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#241B20' }}>Categories</h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#8C665D', marginTop: 4 }}>{categories.length} categories · {subcategories.length} subcategories</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button onClick={() => openCreateSubcategory()} disabled={categories.length === 0} style={{ ...secondaryButtonStyle, opacity: categories.length === 0 ? 0.5 : 1 }}><FolderTree size={15} /> Add Subcategory</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={openCreateCategory} style={primaryButtonStyle}><Plus size={16} /> Add Category</motion.button>
        </div>
      </div>

      {error && <div style={{ padding: '12px 14px', marginBottom: 20, borderRadius: 10, background: '#FFF1F0', border: '1px solid rgba(180,55,45,0.2)', color: '#A4493F', fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#8C665D', fontFamily: 'DM Sans, sans-serif' }}>Loading...</div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: 'white', borderRadius: 16, border: '1px solid rgba(232,163,185,0.15)' }}>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#241B20', marginBottom: 8 }}>No categories yet</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#8C665D', marginBottom: 24 }}>Add your first category to start organizing products.</p>
          <button onClick={openCreateCategory} style={primaryButtonStyle}>Add First Category</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {categories.map((category, index) => {
            const children = subcategories.filter(subcategory => subcategory.category_id === category.id)
            return (
              <motion.div key={category.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} style={cardStyle}>
                <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: 'rgba(244,198,168,0.08)', overflow: 'hidden' }}>
                  {category.image_url ? <img src={category.image_url} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,rgba(232,163,185,0.1),rgba(244,198,168,0.1))' }}><ImageIcon size={24} color="rgba(156,123,110,0.3)" /></div>}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 600, color: '#241B20', marginBottom: 4 }}>{category.name}</p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#8C665D' }}>/{category.slug}</p>
                    </div>
                    <span style={countStyle}>{children.length} sub</span>
                  </div>
                  {category.description && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#5C4033', lineHeight: 1.4, marginTop: 10 }}>{category.description}</p>}
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <button onClick={() => openEditCategory(category)} style={{ ...smallActionStyle, flex: 1 }}><Edit2 size={13} /> Edit</button>
                    <button onClick={() => handleDeleteCategory(category.id)} disabled={deleting === category.id} style={deleteButtonStyle}><Trash2 size={13} /></button>
                  </div>
                  <div style={{ marginTop: 18, paddingTop: 15, borderTop: '1px solid rgba(232,163,185,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                      <p style={{ ...LBL, margin: 0 }}>Subcategories</p>
                      <button onClick={() => openCreateSubcategory(category.id)} style={textButtonStyle}><Plus size={13} /> Add</button>
                    </div>
                    {children.length === 0 ? <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#8C665D' }}>No subcategories yet.</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {children.map(subcategory => <div key={subcategory.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 9px', borderRadius: 8, background: 'rgba(244,198,168,0.1)' }}>
                        <FolderTree size={13} color="#9E5E73" />
                        <div style={{ minWidth: 0, flex: 1 }}><p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: '#241B20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subcategory.name}</p><p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: '#8C665D' }}>/{subcategory.slug}</p></div>
                        <button onClick={() => openEditSubcategory(subcategory)} style={iconButtonStyle} aria-label={`Edit ${subcategory.name}`}><Edit2 size={12} /></button>
                        <button onClick={() => handleDeleteSubcategory(subcategory)} disabled={deleting === subcategory.id} style={{ ...iconButtonStyle, color: '#A4493F' }} aria-label={`Delete ${subcategory.name}`}><Trash2 size={12} /></button>
                      </div>)}
                    </div>}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {mode !== 'closed' && <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeForm} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,15,10,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000 }} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }} style={modalStyle}>
            <div style={modalHeaderStyle}>
              <div><p style={{ ...LBL, marginBottom: 5 }}>{isSubcategoryMode ? 'Nested collection' : 'Top-level collection'}</p><h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#241B20' }}>{modalTitle}</h2></div>
              <button onClick={closeForm} style={closeButtonStyle}><X size={15} color="#241B20" /></button>
            </div>
            <div style={{ padding: 28 }}>
              {isSubcategoryMode && <div style={{ marginBottom: 20 }}><label style={LBL}>Parent Category *</label><select style={{ ...F, cursor: 'pointer' }} value={parentCategoryId} onChange={event => setParentCategoryId(event.target.value)} onFocus={focusF} onBlur={blurF}><option value="">Choose a category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>}
              {form.image_url && <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', marginBottom: 24, border: '1px solid rgba(232,163,185,0.2)' }}><img src={form.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={event => { event.currentTarget.style.display = 'none' }} /></div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
                <div><label style={LBL}>{isSubcategoryMode ? 'Subcategory Name *' : 'Category Name *'}</label><input style={F} value={form.name} placeholder={isSubcategoryMode ? 'e.g. Mini Keychains' : 'e.g. Keychains'} onChange={event => { set('name', event.target.value); if (!editingCategory && !editingSubcategory) set('slug', slugify(event.target.value)) }} onFocus={focusF} onBlur={blurF} /></div>
                <div><label style={LBL}>Slug (auto-generated)</label><input style={{ ...F, color: '#8C665D' }} value={form.slug} placeholder="mini-keychains" onChange={event => set('slug', event.target.value)} onFocus={focusF} onBlur={blurF} /></div>
                <div><label style={LBL}>Description</label><textarea rows={3} style={{ ...F, resize: 'vertical', lineHeight: 1.5 }} value={form.description} placeholder="A short description for shoppers" onChange={event => set('description', event.target.value)} onFocus={focusF} onBlur={blurF} /></div>
                <div><label style={LBL}>Image URL</label><input style={F} value={form.image_url} placeholder="https://res.cloudinary.com/..." onChange={event => set('image_url', event.target.value)} onFocus={focusF} onBlur={blurF} /><p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#8C665D', marginTop: 6 }}>Upload to Cloudinary first, then paste the URL here.</p></div>
              </div>
              {error && <p style={{ color: '#A4493F', fontFamily: 'DM Sans, sans-serif', fontSize: 12, marginBottom: 16 }}>{error}</p>}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}><button onClick={closeForm} style={cancelButtonStyle}>Cancel</button><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving || !form.name.trim() || (isSubcategoryMode && !parentCategoryId)} style={{ ...primaryButtonStyle, opacity: saving || !form.name.trim() || (isSubcategoryMode && !parentCategoryId) ? 0.6 : 1 }}>{saving ? 'Saving...' : mode.endsWith('edit') ? 'Save Changes' : `Add ${isSubcategoryMode ? 'Subcategory' : 'Category'}`}</motion.button></div>
            </div>
          </motion.div>
        </>}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

const cardStyle: CSSProperties = { backgroundColor: 'white', border: '1px solid rgba(232,163,185,0.18)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(232,163,185,0.06)' }
const primaryButtonStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 18px', borderRadius: 999, background: 'linear-gradient(135deg,#E8A3B9,#F4C6A8,#F4DF9A)', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#241B20', boxShadow: '0 4px 16px rgba(232,163,185,0.25)' }
const secondaryButtonStyle: CSSProperties = { ...primaryButtonStyle, background: 'rgba(232,163,185,0.1)', border: '1px solid rgba(232,163,185,0.28)', boxShadow: 'none' }
const smallActionStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: 'linear-gradient(135deg,rgba(232,163,185,0.12),rgba(244,198,168,0.12))', border: '1.5px solid rgba(232,163,185,0.25)', borderRadius: 10, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#241B20' }
const deleteButtonStyle: CSSProperties = { ...smallActionStyle, flex: '0 0 auto', color: '#A4493F', padding: '9px 14px', background: 'transparent', borderColor: 'rgba(164,73,63,0.22)' }
const iconButtonStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: '#8C665D' }
const textButtonStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700, color: '#9E5E73' }
const countStyle: CSSProperties = { padding: '4px 8px', borderRadius: 999, background: 'rgba(232,163,185,0.12)', fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 700, color: '#9E5E73', whiteSpace: 'nowrap' }
const modalStyle: CSSProperties = { position: 'fixed', top: '50%', left: '50%', x: '-50%', y: '-50%', zIndex: 1001, width: '90vw', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFF0E8', borderRadius: 24, boxShadow: '0 32px 80px rgba(232,163,185,0.2)', border: '1px solid rgba(232,163,185,0.2)' }
const modalHeaderStyle: CSSProperties = { position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#FFF0E8', padding: '20px 28px', borderBottom: '1px solid rgba(232,163,185,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '24px 24px 0 0' }
const closeButtonStyle: CSSProperties = { width: 34, height: 34, borderRadius: '50%', backgroundColor: 'rgba(232,163,185,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const cancelButtonStyle: CSSProperties = { padding: '11px 22px', borderRadius: 999, border: '1.5px solid rgba(232,163,185,0.3)', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, color: '#5C4033', cursor: 'pointer' }
