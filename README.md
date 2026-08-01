# Areeb ur Rehman — portfolio

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Framer Motion · GSAP ScrollTrigger.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Where things live

| Piece | File |
| --- | --- |
| **All copy and project data** | `src/lib/content.ts` |
| Boot loader (terminal sequence) | `src/components/BootLoader.tsx` |
| IDE chrome: progress bar, ruler, clock, % badge | `src/components/TopChrome.tsx` |
| Bracketed nav `[·work·]` with scroll spy | `src/components/BracketNav.tsx` |
| Cursor-follow tag + `CursorZone` label regions | `src/components/CursorTag.tsx` |
| Scramble/decode text | `src/components/ScrambleText.tsx` |
| Blur-to-sharp reveal | `src/components/Reveal.tsx` |
| Drifting orb parallax field | `src/components/AmbientField.tsx` |
| Pinned, scroll-scrubbed capability showcase | `src/components/CapabilityShowcase.tsx` |
| The 3D "system" object (CSS 3D rack) | `src/components/SystemObject.tsx` |
| Tilted 3D case-study carousel | `src/components/CaseStudies.tsx` |
| Stacked/rotated process cards | `src/components/ProcessStack.tsx` |
| Contact form + call CTA | `src/components/Contact.tsx` |
| Contact endpoint | `src/app/api/contact/route.ts` |

Motion values (durations, easings, offsets, rotation angles) follow the build
spec and are kept next to the code that uses them.

## YOU NEED TO FILL THESE IN

1. **Contact email sending is live** via Resend. Config is in `.env.local`
   (gitignored; see `.env.example`). `CONTACT_FROM` is currently
   `onboarding@resend.dev`, which only delivers to the address that owns the
   Resend account. Verify your own domain in Resend and change `CONTACT_FROM`
   to send from your own address to anyone.
2. **Project screenshots** — every case study currently renders a generated
   abstract mock with a `[· img: /projects/<id>.png ·]` tag on it. To use a real
   image: drop the file in `public/projects/` and set `image: "/projects/<id>.png"`
   on that project in `src/lib/content.ts`. IDs: `finance`, `journaling`,
   `tenant-rag`, `marketplace`, `voice-agent`, `cooking`, `automation`.
   No external image library is used, so nothing breaks if you never add them.
3. **Project copy** — problem/build/outcome text is written from the brief and
   is deliberately client-anonymous. Check the outcome claims are ones you're
   happy to stand behind.
4. **Testimonials** — none existed, so section 6 is the "how I work" process
   stack using the same fanned-card mechanic, per the spec's fallback.
5. **OG image** — `src/app/layout.tsx` sets OpenGraph text only. Add
   `src/app/opengraph-image.png` if you want a share card.

## Notes on the build

- **The 3D object is CSS 3D, not WebGL.** Six-face boxes in a `preserve-3d`
  scene, driven by the same GSAP scrub timeline as everything else. That keeps
  the hero asset-free and instant to paint: no model to lazy-load, no
  three.js/R3F in the bundle. To swap in a real 3D renderer later, replace
  `SystemObject.tsx` — the timeline targets `[data-rack]`, `[data-slab]` and
  `[data-light]`, so the contract is small.
- **Mobile and reduced motion** never pin or scrub. Both fall back to the
  swipeable stepped sequence with the same content, and the carousel flattens
  to opacity-only transitions.
- **Boot loader** runs once per session (`sessionStorage`), is skippable by
  click/Esc/Enter/Space, and is skipped entirely under reduced motion.
- The scramble effect renders one span per character grouped into inline-block
  words — read the comment in `ScrambleText.tsx` before changing it, the
  grouping is what lets long headlines wrap.
