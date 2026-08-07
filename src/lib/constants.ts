export const BRAND = {
  name: 'Eternal Bloom',
  tagline: 'Never-Dying Creation for Life',
  subtitle: 'Designed with patience, packed with emotions',
  email: 'hello@eternalbloom.in',
  instagram: 'https://www.instagram.com/its.eternalbloom?igsh=MXpxdHR6ZmtmMWxw',
}

export const CATEGORIES = [
  { name: 'Keychains', slug: 'keychains', emoji: '🌸', tagline: 'Carry a little bloom and a lot of love' },
  { name: 'Desk Buddies', slug: 'desk-buddies', emoji: '🪴', tagline: 'Small handmade joys for your space' },
  { name: 'Flower Cards', slug: 'flower-cards', emoji: '💌', tagline: 'Where flowers express what words cannot' },
  { name: 'Hair Accessories', slug: 'hair-accessories', emoji: '🌺', tagline: 'Wear blossoms that never go out of style' },
  { name: 'Personalized Bouquets', slug: 'bouquets', emoji: '💐', tagline: 'Every stem tells your story' },
  { name: 'Magnets', slug: 'magnets', emoji: '🧲', tagline: 'Cute little things that stick around' },
  { name: 'Charms', slug: 'charms', emoji: '✨', tagline: 'Tiny treasures, big smiles' },
  { name: 'Lamps', slug: 'lamps', emoji: '🪔', tagline: 'Handcrafted light for your world' },
  { name: 'Everlasting Flowers', slug: 'everlasting-flowers', emoji: '🌹', tagline: 'Beauty that never fades' },
  { name: 'Garlands', slug: 'garlands', emoji: '🌼', tagline: 'String together moments of joy' },
]

export const SHIPPING = {
  freeAbove: 999,
  flat: 80,
}

export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID as string