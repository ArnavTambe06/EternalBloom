export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_price?: number
  category_id: string
  category?: Category
  images: string[]
  materials?: string
  dimensions?: string
  care_instructions?: string
  color_variants?: ColorVariant[]
  is_available: boolean
  is_featured: boolean
  stock_count: number
  created_at: string
}

export interface ColorVariant {
  name: string
  hex: string
}

export interface CartItem {
  product: Product
  quantity: number
  selected_color?: ColorVariant
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'customer' | 'admin'
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  is_default: boolean
}

export interface Order {
  id: string
  user_id?: string
  guest_email?: string
  items: OrderItem[]
  address: Address
  status: OrderStatus
  payment_status: PaymentStatus
  payment_id?: string
  subtotal: number
  shipping: number
  total: number
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string
  price: number
  quantity: number
  selected_color?: ColorVariant
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'