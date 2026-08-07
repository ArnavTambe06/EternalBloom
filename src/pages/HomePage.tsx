import { Hero } from '@/components/sections/Hero'
import { CategoriesSection } from '@/components/sections/CategoriesSection'

export function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <CategoriesSection />
      {/* Products section coming next */}
      <div id="products" />
    </div>
  )
}