import { supabase } from './supabase'

export interface CustomOrderPayload {
  userId?: string
  name: string
  email: string
  phone?: string
  category?: string
  description: string
  referenceImages?: string[]
  budget?: string
  occasion?: string
}

export async function submitCustomOrder(payload: CustomOrderPayload) {
  const { data, error } = await supabase
    .from('custom_orders')
    .insert({
      user_id: payload.userId || null,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      category: payload.category || null,
      description: payload.description,
      reference_images: payload.referenceImages || [],
      budget: payload.budget || null,
      occasion: payload.occasion || null,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserCustomOrders(userId: string) {
  const { data, error } = await supabase
    .from('custom_orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}