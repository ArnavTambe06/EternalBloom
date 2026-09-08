import { ArrowRight, Gift, Heart, Sparkles } from 'lucide-react'

function BotanicalIllustration() {
  return (
    <div className="hero-botanical" aria-hidden="true">
      <svg viewBox="0 0 560 620" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="hero-botanical__stem" stroke="currentColor" strokeLinecap="round">
          <path d="M374 594C375 480 378 375 418 238" strokeWidth="3" />
          <path d="M375 592C336 482 294 396 207 319" strokeWidth="2.5" />
          <path d="M378 592C418 484 470 409 524 361" strokeWidth="2.5" />
          <path d="M379 511C343 475 311 459 274 452" strokeWidth="2" />
          <path d="M401 439C441 412 467 392 490 360" strokeWidth="2" />
          <path d="M400 325C363 291 348 269 340 237" strokeWidth="2" />
        </g>
        <g className="hero-botanical__flower hero-botanical__flower--top" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M418 238C390 213 376 173 387 133C397 98 425 72 457 62C459 102 450 144 428 175C413 196 411 218 418 238Z" />
          <path d="M418 238C431 201 457 173 490 156C521 141 545 139 558 141C541 184 512 218 478 233C455 243 436 244 418 238Z" />
          <path d="M418 238C389 214 364 194 350 165C337 137 337 109 342 89C380 107 407 133 417 168C423 190 423 217 418 238Z" />
          <path d="M418 238C416 205 422 165 442 130" />
        </g>
        <g className="hero-botanical__flower hero-botanical__flower--middle" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M207 319C181 296 165 268 169 236C173 207 190 185 213 172C224 205 222 236 208 260C198 278 199 301 207 319Z" />
          <path d="M207 319C219 286 244 262 273 252C293 245 309 245 322 249C308 282 287 308 259 320C239 329 221 328 207 319Z" />
          <path d="M207 319C186 301 164 286 152 264C141 243 140 221 144 206C174 218 196 240 204 266C210 284 210 303 207 319Z" />
          <path d="M207 319C204 290 208 258 222 229" />
        </g>
        <g className="hero-botanical__flower hero-botanical__flower--bottom" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M524 361C502 340 490 314 494 286C499 258 516 237 539 225C548 255 546 281 535 303C527 321 527 343 524 361Z" />
          <path d="M524 361C537 333 558 313 584 306C603 301 618 302 630 306C618 335 598 355 574 364C555 371 538 369 524 361Z" />
          <path d="M524 361C507 348 490 338 481 320C473 303 474 286 478 273C502 283 518 300 524 322C529 336 528 351 524 361Z" />
          <path d="M524 361C521 337 524 311 536 287" />
        </g>
        <g className="hero-botanical__leaves" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M347 480C309 452 277 443 240 448C269 474 304 488 347 480Z" />
          <path d="M426 460C455 432 484 420 516 424C493 450 464 464 426 460Z" />
          <path d="M387 535C417 515 443 509 468 515C447 536 421 544 387 535Z" />
          <path d="M332 402C307 379 282 367 257 369C276 395 300 407 332 402Z" />
        </g>
      </svg>
    </div>
  )
}

const benefits = [
  { icon: Sparkles, title: '100%', detail: 'Handmade' },
  { icon: Gift, title: 'Customisable', detail: 'for you' },
  { icon: Heart, title: 'Crafted to', detail: 'last forever' },
]

export function Hero() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="landing-hero">
      <div className="wrap landing-hero__inner">
        <div className="landing-hero__copy">
          <p className="landing-hero__eyebrow">
            Handmade in India <span>·</span> Never-dying creations
          </p>
          <h1>
            Creations that <em>never fade.</em>
          </h1>
          <p className="landing-hero__description">
            Handcrafted Chenille keychains, desk buddies, bouquets &amp; more — made slowly, meant to stay.
          </p>
          <div className="landing-hero__actions">
            <button className="landing-hero__primary" type="button" onClick={scrollToProducts}>
              Shop the collection <ArrowRight size={16} />
            </button>
            <span className="landing-hero__note">Made with love / made to last</span>
          </div>
          <div className="landing-hero__benefits">
            {benefits.map(({ icon: Icon, title, detail }, index) => (
              <div className="hero-benefit" key={title}>
                <Icon size={28} strokeWidth={1.6} />
                <p><strong>{title}</strong><span>{detail}</span></p>
                {index < benefits.length - 1 && <i aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
        <div className="landing-hero__art">
          <BotanicalIllustration />
          <p className="hero-art-note">Made with love<br />made to last <span>♡</span></p>
        </div>
      </div>
    </section>
  )
}
