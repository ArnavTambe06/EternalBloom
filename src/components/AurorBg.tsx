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
            var(--aurora-pink) 0%, transparent 65%),
          radial-gradient(ellipse 55% 45% at 88% 18%,
            var(--aurora-peach) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 50% 95%,
            var(--aurora-yellow) 0%, transparent 65%),
          radial-gradient(ellipse 45% 40% at 82% 75%,
            var(--aurora-blush) 0%, transparent 55%)
        `,
      }}
    />
  )
}
