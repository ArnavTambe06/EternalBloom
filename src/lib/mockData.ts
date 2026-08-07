import type { Product } from "@/types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Sunflower Crochet Bouquet",
    description: "A handmade sunflower bouquet crafted with premium cotton yarn.",
    price: 899,
    compare_price: 1199,
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
    ],
    is_available: true,
    category: {
      id: "cat-1",
      name: "Bouquets",
      slug: "bouquets",
    },
  },
  {
    id: "2",
    name: "Lavender Crochet Bouquet",
    description: "Elegant lavender bouquet perfect for gifting.",
    price: 999,
    compare_price: 1299,
    images: [
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800",
    ],
    is_available: true,
    category: {
      id: "cat-1",
      name: "Bouquets",
      slug: "bouquets",
    },
  },
  {
    id: "3",
    name: "Crochet Teddy Bear",
    description: "Soft handmade teddy bear made with plush yarn.",
    price: 749,
    compare_price: 899,
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
    ],
    is_available: true,
    category: {
      id: "cat-2",
      name: "Toys",
      slug: "toys",
    },
  },
  {
    id: "4",
    name: "Crochet Bunny",
    description: "Cute crochet bunny for kids and gifts.",
    price: 699,
    compare_price: null,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    ],
    is_available: false,
    category: {
      id: "cat-2",
      name: "Toys",
      slug: "toys",
    },
  },
  {
    id: "5",
    name: "Crochet Daisy Flower",
    description: "Minimal handcrafted daisy flower.",
    price: 299,
    compare_price: 399,
    images: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
    ],
    is_available: true,
    category: {
      id: "cat-3",
      name: "Flowers",
      slug: "flowers",
    },
  },
];