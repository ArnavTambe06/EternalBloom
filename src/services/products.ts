import { supabase } from './supabase'
import type { Product, Category } from '@/types'

export async function getProducts(options?: {
  categorySlug?: string
  featured?: boolean
  limit?: number
  search?: string
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_available', true)
    .order('created_at', { ascending: false })

  if (options?.featured) query = query.eq('is_featured', true)
  if (options?.limit) query = query.limit(options.limit)
  if (options?.search) query = query.ilike('name', `%${options.search}%`)

  const { data, error } = await query
  if (error) throw error
  return (data as unknown as Product[]) || []
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!category) return []

  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', category.id)
    .eq('is_available', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as unknown as Product[]) || []
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data as Category[]) || []
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ featured: true, limit: 6 })
}