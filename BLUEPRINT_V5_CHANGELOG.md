# Blueprint v5.0 Changelog

**From:** v2.1 (Template_blueprint_FINAL)  
**To:** v5.0 (Template_blueprint_V5.md)  
**Date:** 2025-10-28

---

## 🎯 Major Additions

### 1. **ID Naming Conventions (Semantic IDs)**
- **NEW:** Use `titleSeq1`, `imageSeq1`, `animationSeq1`, `lottieSeq1`, `annotationSeq1`
- **OLD:** Generic IDs like `"hdr"`, `"note"`
- **Rationale:** Clearer intent, scalable (Seq2, Seq3...), template-agnostic

### 2. **FPS Handling (Corrected)**
- **NEW:** All JSON authored in seconds (always FPS-agnostic)
- **NEW:** FPS removed from JSON, controlled globally
- **Example:** 4s @ 30fps = 120 frames, 4s @ 60fps = 240 frames (same duration, more frames)
- **Rationale:** Time is constant, frame count adjusts for smoothness

### 3. **Beat Structure Flexibility**
- **NEW:** Minimum structure = `entrance` + `exit` required
- **NEW:** Templates can add custom beats (e.g., `questionPart2`, `mapReveal`)
- **NEW:** All beats live in JSON (for future audio sync)
- **OLD:** Implied ENTRANCE → SERVE → EXIT pattern (too rigid)

### 4. **Expanded Preset Library (10 Core)**
- **NEW Presets:**
  1. fadeUpIn
  2. fadeDownOut (not fadeOut)
  3. pulseEmphasis (not pulse)
  4. drawOnPath
  5. breathe (loopable)
  6. slideInLeft
  7. slideInRight
  8. popInSpring (with mass/stiffness/damping)
  9. shrinkToCorner (scale + translate)
  10. highlightSwipe (returns JSX with clipPath)

- **OLD:** Generic mention of "20 grab-and-go" presets (no specifics)

### 5. **Preset Function Patterns**
- **Pattern A:** Config-based, returns style object (most presets)
- **Pattern B:** Returns raw values (path morph, counters, dashoffsets)
- **Pattern C:** Hooks (only when JSX/refs needed, e.g., highlightSwipe)
- **Rationale:** Clear patterns, avoid hooks for simple transforms

### 6. **Centralized Easing Map**
- **NEW:** 6 core easings with clear use cases:
  - `smooth` — Default for most
  - `power2InOut` — Camera pans, big moves
  - `power3InOut` — Hero entrances
  - `power3In` — Confident exits
  - `power2Out` — Gentle landings
  - `backOut` — Tiny overshoot for charm
- **OLD:** Generic mention, no specific curves defined

### 7. **Style Token Inheritance**
- **NEW:** Global baseline (STYLE constants) + per-scene overrides
- **NEW:** Can override colors, fonts, mode per-scene
- **Example:**
  ```json
  "style_tokens": {
    "mode": "notebook",
    "colors": { "accent": "#E74C3C" }
  }
  ```
- **OLD:** Implied, not explicitly documented

### 8. **Template Contract (Exports)**
- **NEW:** Must export:
  - `TEMPLATE_ID`, `TEMPLATE_VERSION`
  - `Template` component
  - `getDuration(scene, fps)`
  - `DURATION_MIN`, `DURATION_MAX`
  - `SUPPORTED_MODES`
  - `CAPABILITIES` (usesSVG, usesLottie, etc.)
  - `PRESETS_REQUIRED` (optional)
  - `getPosterFrame` (optional)
- **OLD:** Vague "render layers, apply presets" guidance

### 9. **Template Props (Standardized)**
- **NEW:** Every template accepts:
  - `scene` — JSON data
  - `styles` — Global + scene tokens
  - `presets` — Animation functions
  - `easingMap` — EZ map
  - `transitions` — Multi-scene config
- **OLD:** Not specified

### 10. **ID Factory Pattern (Context-Based)**
- **NEW:** `useSceneId()` hook returns `(key) => s-${sceneId}-${key}`
- **NEW:** Derive from context, no random/frame-based values
- **NEW:** Parent MUST wrap scene with `<SceneIdContext.Provider value={uniqueId}>`
- **Rationale:** Deterministic, essential for `<defs>`, multi-scene compositions
- **OLD:** Generic `id(sceneId, key)` function signature

### 11. **GroupLayer Pattern**
- **NEW:** `<GroupLayer>` component for coordinated animations
- **NEW:** JSON supports `"type": "group"` with `"targets": ["id1", "id2"]`
- **NEW:** `"scope"` field limits grouped properties (e.g., `["transform", "opacity"]`)
- **OLD:** Manual application implied

### 12. **SVG Path Animation (Decoupled)**
- **NEW:** Use guidePath + clipPath, separate from rough.js
- **NEW:** `drawOnPath` preset handles strokeDashoffset automatically
- **OLD:** Tightly coupled to rough.js in examples

---

## 🔄 Clarifications

### Timing Philosophy
- **Absolute timing** — All `start` times are seconds from scene start (not relative)
- **Author in seconds** — JSON ALWAYS uses seconds (FPS-agnostic)
- **Convert to frames** — Templates use `toFrames(seconds, fps)` helper internally
- **Unit consistency** — Presets accept seconds, convert to frames inside function

### Mode Switching
- **Per-scene mode** — `scene.style_tokens.mode`
- **Mixable modes** — Single video can alternate notebook ↔ whiteboard
- **Inheritance** — Scene tokens override global STYLE constants

### JSON Schema Version
- **Bumped to v5.0** — Breaking changes from v3.0
- **Duration removed** — Derived from `beats.exit + tailPadding`
- **No validation yet** — Schema checks deferred (manual validation for now)
- **No migration tool** — Manual updates from v3 → v5

---

## 📦 Implementation Priorities

### Tier 1 (Foundation)
1. Update `src/sdk/easing.ts` with EZ map
2. Refactor `src/sdk/animations.js` with 10 presets (accept seconds, convert to frames)
3. Create `src/sdk/SceneIdContext.jsx` with provider pattern
4. Add `toFrames(seconds, fps)` helper to `src/sdk/time.ts`

### Tier 2 (Template Refactor)
5. Add required exports to Hook1A
6. Refactor Hook1A to use presets
7. Update `hook_1a_knodovia_map.json` to v5 schema
8. Test mode switching (notebook/whiteboard)

### Tier 3 (Validation)
9. Test FPS auto-scaling (30fps → 60fps)
10. Export MP4, verify preview parity
11. Render multi-scene composition (ID collision test)

---

## ❌ Explicitly NOT in v5.0

- Audio sync (future)
- A/B testing JSON variants (future)
- Visual timeline editor (future)
- JSON schema validation (Zod) (future)
- Migration tool v3→v5 (not needed yet)
- Preset marketplace (future)

---

## 🎓 Key Learnings

1. **Flexibility over rigidity** — Templates need breathing room for custom beats
2. **Seconds beat frames** — Author experience matters more than internal representation
3. **Start small on presets** — 10 core presets, grow organically from real usage
4. **Metadata as infrastructure** — Exports enable tooling, linting, wizard UX
5. **Context for IDs** — Better than prop-drilling or global state
6. **Strict zero wobble** — Assert `roughness: 0, bowing: 0` in all rough.js calls
7. **Font preloading critical** — Must work in SSR (Remotion export) not just preview

---

**Status:** Blueprint v5.0 is production-ready for implementation.  
**Next Step:** Begin Tier 1 foundation work (SDK updates).
