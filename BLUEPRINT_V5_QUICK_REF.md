# Blueprint v5.0 Quick Reference

**One-page cheat sheet for template developers**

---

## 📐 JSON Schema Essentials

```json
{
  "schema_version": "5.0",
  "scene_id": "hook1a",
  "template_id": "Hook1AQuestionBurst",
  "duration_s": 18,
  
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

- **Author in seconds** → Convert to frames internally via `frames(s)`
- **Absolute timing** → All `start` values from scene start (not relative)
- **Anchor to 30fps** → 4s @ 30fps = 2s @ 60fps (auto-scales)
- **Breathing room** → 0.8–1.5s between major changes

---

## 🎭 Animation Presets (10 Core)

### Entrances
```javascript
fadeUpIn(frame, { start, dur, dist, ease }, easingMap)
slideInLeft(frame, { start, dur, dist, ease }, easingMap)
slideInRight(frame, { start, dur, dist, ease }, easingMap)
popInSpring(frame, { start, mass, stiffness, damping }, easingMap)
```

### Emphasis
```javascript
pulseEmphasis(frame, { start, dur, scale }, easingMap)
breathe(frame, { start, loop }, easingMap)
```

### Exits
```javascript
fadeDownOut(frame, { start, dur, dist, ease }, easingMap)
```

### Complex
```javascript
drawOnPath(frame, { start, dur, length, ease }, easingMap)
shrinkToCorner(frame, { start, dur, targetScale, targetPos }, easingMap)
highlightSwipe(frame, { start, dur, rect }, easingMap) // Hook returns JSX
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

export const getDuration = (scene, fps) => Math.round(scene.duration_s * fps);
export const DURATION_MIN = 450;
export const DURATION_MAX = 540;
export const SUPPORTED_MODES = ['notebook', 'whiteboard'];
export const CAPABILITIES = { usesSVG: true, usesLottie: false };
export const PRESETS_REQUIRED = ['fadeUpIn', 'pulseEmphasis'];
export const getPosterFrame = (scene, fps) => Math.round(scene.beats.emphasis * fps);
```

---

## 🆔 ID Factory Pattern

```javascript
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
- [ ] EZ easing map (no hardcoded beziers)
- [ ] Zero wobble (roughness/bowing = 0)
- [ ] Respects `scene.style_tokens.mode`
- [ ] All required exports present

---

## 🚫 Anti-Patterns

- ❌ No text blocks >2 lines
- ❌ No GSAP in exports
- ❌ No `Math.random()` or frame-based IDs
- ❌ No inline bezier curves (use EZ map)
- ❌ No non-token colors
- ❌ No wobble (must justify)

---

## 🧪 Test Scenarios

1. **FPS scaling** → Run at 30fps, 60fps, verify auto-scaling
2. **Mode switch** → Toggle notebook ↔ whiteboard, check colors/textures
3. **Multi-scene** → Render 3x in composition, verify ID uniqueness
4. **Export parity** → Compare preview vs MP4 (frame-by-frame)

---

**See Template_blueprint_V5.md for full details.**
