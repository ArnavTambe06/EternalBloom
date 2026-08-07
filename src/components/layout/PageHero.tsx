import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface PageHeroProps {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#FFF9F2] px-5 pb-16 pt-36 sm:px-6 sm:pb-20 lg:px-8">
      <div className="absolute -right-20 top-16 h-72 w-72 rounded-full bg-[#D68C6A]/10 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-[#91A57A]/10 blur-3xl" />
      <div className="relative mx-auto max-w-3xl text-center">
        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-1.5 text-xs font-[Poppins] font-semibold text-[#786A61] transition-colors hover:text-[#B56A45]"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>
        <p className="mb-3 text-xs font-[Poppins] font-semibold uppercase tracking-[0.18em] text-[#B56A45]">
          {eyebrow}
        </p>
        <h1 className="font-[Playfair_Display] text-4xl font-bold tracking-tight text-[#46352A] sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#786A61] sm:text-lg">
          {description}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
