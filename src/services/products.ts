import { supabase } from './supabase'
import type { Product, Category, Subcategory } from '@/types'

export async function getProducts(options?: {
  categorySlug?: string
  subcategorySlug?: string
  featured?: boolean
  limit?: number
  search?: string
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, category:categories(*), subcategory:subcategories(*)')
    .eq('is_available', true)
    .order('created_at', { ascending: false })

  if (options?.featured) query = query.eq('is_featured', true)
  if (options?.limit) query = query.limit(options.limit)
  if (options?.search) query = query.ilike('name', `%${options.search}%`)

  if (options?.categorySlug || options?.subcategorySlug) {
    const category = options.categorySlug
      ? await getCategoryBySlug(options.categorySlug)
      : null
    if (options.categorySlug && !category) return []

    if (category) query = query.eq('category_id', category.id)

    if (options.subcategorySlug) {
      let subcategoryQuery = supabase
        .from('subcategories')
        .select('id')
        .eq('slug', options.subcategorySlug)
      if (category) subcategoryQuery = subcategoryQuery.eq('category_id', category.id)
      const { data: subcategory } = await subcategoryQuery.single()
      if (!subcategory) return []
      query = query.eq('subcategory_id', subcategory.id)
    }
  }

  const { data, error } = await query
  if (error) throw error
  return (data as unknown as Product[]) || []
}

export async function getProductsByCategory(categorySlug: string, subcategorySlug?: string): Promise<Product[]> {
  return getProducts({ categorySlug, subcategorySlug })
}

export async function getCategories(): Promise<Category[]> {
  const [{ data: categories, error: categoriesError }, { data: subcategories, error: subcategoriesError }] = await Promise.all([
    supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    ,
    supabase
      .from('subcategories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ])

  if (categoriesError) throw categoriesError
  if (subcategoriesError) throw subcategoriesError
  return ((categories || []) as Category[]).map(category => ({
    ...category,
    subcategories: ((subcategories || []) as Subcategory[]).filter(subcategory => subcategory.category_id === category.id),
  }))
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const { data: subcategories, error: subcategoriesError } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', data.id)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (subcategoriesError) throw subcategoriesError
  return { ...(data as Category), subcategories: (subcategories || []) as Subcategory[] }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ featured: true, limit: 6 })
}
