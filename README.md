# Eternal Bloom - Chenille Florals

> A premium boutique e-commerce platform for handcrafted Chenille creations and keepsakes, designed to deliver a beautiful shopping experience with elegant UI, smooth animations, and secure online payments.

**Status:** 🚧 Active Development

---

## ✨ Features

### Customer

- 🏠 Beautiful landing page
- 🧶 Browse products by category
- 🔍 Product search
- 🖼 Animated product detail modal
- 🛒 Shopping cart
- 💳 Secure Razorpay checkout
- 👤 Google Sign-In
- ✉ Email authentication
- 🚀 Guest checkout
- 📦 Order history
- ❤️ Wishlist *(Planned)*

### Admin

- Dashboard
- Product Management
- Category Management
- Order Management
- Customer Management
- Shipping charge and free-shipping threshold settings

### Shipping settings setup

Shipping settings are stored in Supabase so an admin can update them from `/admin/settings`. Apply the SQL migration in `supabase/migrations/20260826000000_create_store_settings.sql` to the project before using the Save changes button. Anyone can read the settings for checkout, while only users with `role = 'admin'` in `user_profiles` can update them.

### Product variants

In Admin > Products, add each sellable form, style, size, or colour under Product Variants. Add the variant name, optionally paste image URLs, then upload additional images on the saved variant. Customers choose the variant in the product modal; its selected name and images are saved with the cart and order.

---

## 🛠 Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- shadcn/ui
- React Router
- Zustand
- React Hook Form
- Zod
- Lucide React

### Backend

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security

### Storage

- Cloudinary


### Emails

- Resend

### Deployment

- Vercel

---

## 📂 Project Structure

```
src/
│
├── assets/
├── components/
├── features/
├── hooks/
├── lib/
├── pages/
├── services/
├── styles/
├── types/
├── utils/
└── App.tsx
```

---

## 🎨 Design Philosophy

The website follows a premium boutique aesthetic inspired by artisan brands.

- Warm color palette
- Elegant typography
- Smooth animations
- Spacious layouts
- Mobile-first
- Accessibility-focused
- Fast performance

---

## 📱 Responsive Design

Designed specifically for

- 📱 Mobile
- 📲 Tablet
- 💻 Laptop
- 🖥 Desktop
- 🖥 Ultra-wide displays

Layouts are intentionally optimized for each screen size rather than simply scaled.

---

## 📈 Roadmap

### MVP

- [x] Project Setup
- [x] Design System
- [x] Homepage
- [x] Categories
- [x] Product Modal
- [x] Authentication
- [x] Shopping Cart
- [x] Checkout
- [x] Admin Dashboard
- [ ] Deployment

### Future

- Wishlist
- Reviews
- Coupons
- Product Recommendations
- Shipping Integration
- WhatsApp Notifications
- AI Search

---

## 📄 Author
Arnav Tambe 
