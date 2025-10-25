# 🎬 Start Here — GSAP Templates (Production State)

This is your jumping-off point for continuing work. Everything below is scoped to next actions, testing, and where to pick up.

---

## ✅ Current Status

- Hook1A, Hook1E: Complete (cinematic, mid-scene transitions)
- Explain2A, Explain2B: Complete (stagger, breathe, mid-scene)
- Apply3A, Apply3B: Complete (cascade, flip, spotlight expand)
- Reflect4A, Reflect4D: Complete (title shrink, bridge motion, forward path)
- Zero Wobble: Enforced across all templates (roughness: 0, bowing: 0)

---

## ▶️ Quick Run

```bash
npm run dev
```

Open the player and scrub through:
- Hook1A: 6–7s mid-scene move, then cascade
- Explain2B: side-swap mid-scene, gentle breathe
- Apply3A: flip reveal on correct answer, pulse
- Reflect4D: current shrinks to corner, next expands

---

## 🧪 Test Plan (15 min)

1) Load each template and verify:
- Smooth entries (no pops), no jitter or wobble
- One clear mid-scene transition per template
- Rough.js lines are crisp (no wavy edges)

2) Scrubbing and reset
- Scrub the timeline; hit the Reload Player button in `App.jsx`
- Ensure states reset cleanly; no stuck animations

3) Visual polish
- Fonts use rough, hand-drawn vibe (`'Cabin Sketch'` where relevant)
- Color accents match style tokens; emphasis moments feel intentional

---

## 🔧 Where To Continue Next (when you return)

1) Narrative QA pass (recommended)
- Tweak beat timings to your VO read for each template
- Adjust GSAP ease/durations: aim for “TED-talk calm + playful marks”

2) Add two micro-finishes per template
- A tiny underline draw or highlight sweep near a key phrase
- A single subtle pulse after the mid-scene transition lands

3) Export smoke test
```bash
npm run build
```
Confirm successful build; spot-check `dist/index.html` playback.

---

## 🗂️ Key Files You’ll Touch

- Templates: `src/templates/*.jsx`
- Anim utils: `src/utils/gsapAnimations.js`
- Rough helpers: `src/utils/roughHelpers.js`
- Scene data: `src/scenes/*.json`

---

## 🧭 Style Guardrails

- Zero wobble: keep `roughness: 0`, `bowing: 0`
- No jitter/rotate hacks; prefer scale-based pulse/breathe
- One mid-scene move per template minimum
- Favor `cascadeReveal`, `gracefulMove`, `pulseEmphasis`

---

## 🧰 Handy Snippets

```javascript
// Mid-scene reposition
gracefulMove(ref.current, { y: -160, scale: 0.8, duration: 1.1 });

// Content cascade
cascadeReveal([a, b, c], { stagger: 0.15, ease: 'back.out(1.5)' });

// Subtle focus
pulseEmphasis(el, { scale: 1.05, duration: 0.35, repeat: 1, yoyo: true });
```

---

## 📌 Parking Lot (future nice-to-haves)

- Add a lightweight “draw path” helper for sketch bridges
- Build a preset palette for template-specific accents
- Optional: small particle trails for Apply/Reflect moments

---

When you open this project next time, start with the Test Plan above, then do the Narrative QA pass. You’re in a great state to ship a polished demo cut. 🚀