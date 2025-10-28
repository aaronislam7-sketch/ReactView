# Blueprint v5.0 Quick Reference

**One-page cheat sheet for template developers**

---

## 📐 JSON Schema Essentials

```json
{
  "schema_version": "5.0",
  "scene_id": "hook1a",
  "template_id": "Hook1AQuestionBurst",
  
  "style_tokens": {
    "mode": "notebook",
    "colors": { "accent": "#E74C3C" }
  },
  
  "beats": {
    "entrance": 0.6,
    "exit": 15.0
  },
  
  "layers": [
    {
      "id": "titleSeq1",
      "type": "header",
      "text": "Hello World",
      "anim": [
        { "preset": "fadeUpIn", "start": 0.6, "dur": 0.9, "ease": "smooth" }
      ]
    }
  ]
}
```

---

## 🎨 Layer ID Conventions

| Type | ID Pattern | Example |
|------|-----------|---------|
| Text | `titleSeq1` | Main headers |
| Images | `imageSeq1` | Photos, illustrations |
| Complex animations | `animationSeq1` | Maps, charts, diagrams |
| Lottie | `lottieSeq1` | JSON animations |
| Annotations | `annotationSeq1` | Arrows, callouts |
| Groups | `exitGroup` | Coordinated exits |

---

## ⏱️ Timing Rules

- **Author in seconds (always)** → JSON is FPS-agnostic
- **Absolute timing** → All `start` values from scene start (not relative)
- **Frame conversion** → 4s @ 30fps = 120 frames, 4s @ 60fps = 240 frames (same duration)
- **toFrames() helper** → Presets convert seconds to frames: `toFrames(seconds, fps)`
- **Breathing room** → 0.8–1.5s between major changes

---

## 🎭 Animation Presets (10 Core)

### Entrances
```javascript
// All accept seconds, convert to frames internally
fadeUpIn(frame, { start, dur, dist, ease }, easingMap, fps)
slideInLeft(frame, { start, dur, dist, ease }, easingMap, fps)
slideInRight(frame, { start, dur, dist, ease }, easingMap, fps)
popInSpring(frame, { start, mass, stiffness, damping }, easingMap, fps)
```

### Emphasis
```javascript
pulseEmphasis(frame, { start, dur, scale }, easingMap, fps)
breathe(frame, { start, loop }, easingMap, fps)
```

### Exits
```javascript
fadeDownOut(frame, { start, dur, dist, ease }, easingMap, fps)
```

### Complex
```javascript
drawOnPath(frame, { start, dur, length, ease }, easingMap, fps)
shrinkToCorner(frame, { start, dur, targetScale, targetPos }, easingMap, fps)
highlightSwipe(frame, { start, dur, rect }, easingMap, fps) // Hook returns JSX
```

---

## 📊 Easing Map (EZ)

| Name | Bezier | Use Case |
|------|--------|----------|
| `smooth` | `0.4, 0, 0.2, 1` | Default for most things |
| `power2InOut` | `0.45, 0, 0.55, 1` | Camera pans, big moves |
| `power3InOut` | `0.65, 0, 0.35, 1` | Hero entrances |
| `power3In` | `0.55, 0, 1, 0.45` | Confident exits |
| `power2Out` | `0, 0, 0.2, 1` | Gentle landings |
| `backOut` | `0.175, 0.885, 0.32, 1.275` | Tiny overshoot |

---

## 🎨 Style Tokens

```javascript
// Global baseline (STYLE constants)
colors: {
  bgNotebook: '#FFF9F0',
  bgWhiteboard: '#FAFBFC',
  ink: '#1A1A1A',
  accent: '#FF6B35',
  accent2: '#9B59B6'
}

// Per-scene override (JSON)
"style_tokens": {
  "mode": "whiteboard",
  "colors": { "accent": "#E74C3C" }
}
```

---

## 📤 Template Exports (Required)

```javascript
export const TEMPLATE_ID = 'Hook1AQuestionBurst';
export const TEMPLATE_VERSION = '5.0.0';

export const Hook1AQuestionBurst = ({ scene, styles, presets, easingMap, transitions }) => {
  // Component
};

export const getDuration = (scene, fps) => {
  const tailPadding = 0.5;
  return toFrames(scene.beats.exit + tailPadding, fps);
};
export const DURATION_MIN_FRAMES = 450;
export const DURATION_MAX_FRAMES = 540;
export const SUPPORTED_MODES = ['notebook', 'whiteboard'];
export const CAPABILITIES = { usesSVG: true, usesLottie: false };
export const PRESETS_REQUIRED = ['fadeUpIn', 'pulseEmphasis'];
export const getPosterFrame = (scene, fps) => Math.round(scene.beats.emphasis * fps);
```

---

## 🆔 ID Factory Pattern

```javascript
// Parent wraps scene with context
<SceneIdContext.Provider value={uniqueId}>
  <TemplateComponent scene={scene} />
</SceneIdContext.Provider>

// In template
const id = useSceneId();

// Usage
<clipPath id={id('highlighter-clip')}>...</clipPath>
<mask id={id('text-mask')}>...</mask>

// Output: s-hook1a-highlighter-clip, s-hook1a-text-mask
```

---

## ✅ Quality Checklist

- [ ] Frame-driven (no `useState` triggers)
- [ ] ID factory for all `<defs>`
- [ ] Beats in JSON (seconds, absolute)
- [ ] Uses preset functions (not inline interpolate)
- [ ] Presets accept seconds, convert to frames internally
- [ ] EZ easing map (no hardcoded beziers)
- [ ] **Strict zero wobble** (ALL rough.js: `roughness: 0, bowing: 0`)
- [ ] Fonts preloaded in preview AND render contexts (SSR)
- [ ] Respects `scene.style_tokens.mode`
- [ ] All required exports present

---

## 🚫 Anti-Patterns

- ❌ No text blocks >2 lines
- ❌ No GSAP in exports
- ❌ No `Math.random()` or frame-based IDs
- ❌ No inline bezier curves (use EZ map)
- ❌ No non-token colors
- ❌ **No wobble** (ALL rough.js MUST be `roughness: 0, bowing: 0`)
- ❌ No unpreloaded fonts (breaks SSR)

---

## 🧪 Test Scenarios

1. **FPS scaling** → Run at 30fps, 60fps, verify auto-scaling
2. **Mode switch** → Toggle notebook ↔ whiteboard, check colors/textures
3. **Multi-scene** → Render 3x in composition, verify ID uniqueness
4. **Export parity** → Compare preview vs MP4 (frame-by-frame)

---

**See Template_blueprint_V5.md for full details.**
