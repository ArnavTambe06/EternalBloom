import type { CSSProperties } from 'react'
import logoImage from '@/assets/logo.jpeg'

interface BrandLogoProps {
  size?: number
  style?: CSSProperties
}

export function BrandLogo({ size = 40, style }: BrandLogoProps) {
  return (
    <img
      src={logoImage}
      alt="Eternal Bloom logo"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        display: 'block',
        objectFit: 'cover',
        borderRadius: '50%',
        ...style,
      }}
    />
  )
}
