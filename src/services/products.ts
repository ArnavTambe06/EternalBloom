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

  if (options?.categorySlug) {
    query = query.eq('categories.slug', options.categorySlug)
  }
  if (options?.featured) {
    query = query.eq('is_featured', true)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as Product
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Category[]
}