export function AuroraBg() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        /* Single CSS gradient — zero GPU cost, same visual effect */
        background: `
          radial-gradient(ellipse 70% 50% at 15% 10%,
            rgba(255,133,208,0.28) 0%, transparent 65%),
          radial-gradient(ellipse 55% 45% at 88% 18%,
            rgba(255,200,162,0.22) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 50% 95%,
            rgba(255,230,128,0.20) 0%, transparent 65%),
          radial-gradient(ellipse 45% 40% at 82% 75%,
            rgba(255,163,224,0.18) 0%, transparent 55%)
        `,
      }}
    />
  )
}