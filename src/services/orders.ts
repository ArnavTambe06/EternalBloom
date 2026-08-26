import { supabase } from './supabase'
import type { CartItem, Address } from '@/types'

export interface CreateOrderPayload {
  userId?: string
  guestEmail?: string
  items: CartItem[]
  address: Address
  subtotal: number
  shipping: number
  total: number
  notes?: string
}

export async function createOrder(payload: CreateOrderPayload) {
  // 1. Create order — COD so payment_status stays pending
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: payload.userId || null,
      guest_email: payload.guestEmail || null,
      address: payload.address,
      status: 'pending',
      payment_status: 'pending', // COD — paid on delivery
      payment_id: null,
      razorpay_order_id: null,
      subtotal: payload.subtotal,
      shipping: payload.shipping,
      total: payload.total,
      notes: payload.notes || null,
    })
    .select()
    .single()

  if (orderError) throw orderError

  // 2. Create order items
  const orderItems = payload.items.map(item => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    product_image: item.selected_variant?.images?.[0] || item.product.images?.[0] || null,
    price: item.product.price,
    quantity: item.quantity,
    selected_variant: item.selected_variant || null,
    selected_color: item.selected_color || null,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  return order
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items(*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items(*)`)
    .eq('id', orderId)
    .single()

  if (error) throw error
  return data
}
