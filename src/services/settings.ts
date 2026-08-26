import { supabase } from './supabase'
import { SHIPPING } from '@/lib/constants'

export interface ShippingSettings {
  flat: number
  freeAbove: number
}

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  flat: SHIPPING.flat,
  freeAbove: SHIPPING.freeAbove,
}

const SHIPPING_SETTING_KEYS = ['shipping_flat', 'free_shipping_above']

function validNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

export async function getShippingSettings(): Promise<ShippingSettings> {
  const { data, error } = await supabase
    .from('store_settings')
    .select('key, value')
    .in('key', SHIPPING_SETTING_KEYS)

  if (error) throw error

  const values = new Map((data || []).map(row => [row.key, Number(row.value)]))
  const flat = values.get('shipping_flat')
  const freeAbove = values.get('free_shipping_above')

  return {
    flat: validNonNegativeNumber(flat) ? flat : DEFAULT_SHIPPING_SETTINGS.flat,
    freeAbove: validNonNegativeNumber(freeAbove)
      ? freeAbove
      : DEFAULT_SHIPPING_SETTINGS.freeAbove,
  }
}

export async function updateShippingSettings(settings: ShippingSettings) {
  const { error } = await supabase
    .from('store_settings')
    .upsert([
      { key: 'shipping_flat', value: settings.flat },
      { key: 'free_shipping_above', value: settings.freeAbove },
    ], { onConflict: 'key' })

  if (error) throw error
}
