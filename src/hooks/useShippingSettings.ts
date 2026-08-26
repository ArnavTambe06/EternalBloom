import { useEffect } from 'react'
import { getShippingSettings } from '@/services/settings'
import { useCartStore } from '@/store/cartStore'

export function useShippingSettingsInit() {
  const setShippingSettings = useCartStore(state => state.setShippingSettings)

  useEffect(() => {
    getShippingSettings()
      .then(setShippingSettings)
      .catch(error => {
        // The cart keeps the built-in defaults until the settings table is available.
        console.error('Shipping settings could not be loaded:', error)
      })
  }, [setShippingSettings])
}
