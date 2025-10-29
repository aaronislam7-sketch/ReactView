# Tier 1 Implementation Complete ✅

**Blueprint v5.0 - Foundation Layer**  
**Date:** 2025-10-28  
**Status:** Ready for Testing

---

## 📦 Files Created/Updated

### **1. Created: `src/sdk/SceneIdContext.jsx`**
Context-based ID factory for deterministic, namespaced IDs.

**Features:**
- `SceneIdContext` - React context for scene ID
- `useSceneId()` - Hook that returns ID generator function
- `generateSceneId()` - Direct ID generator (non-React)

**Usage:**
```jsx
// Parent wraps scene
<SceneIdContext.Provider value="hook1a">
  <TemplateComponent scene={scene} />
</SceneIdContext.Provider>

// In template
const id = useSceneId();
<clipPath id={id('text-mask')}>...</clipPath>
// Output: s-hook1a-text-mask
```

---

### **2. Updated: `src/sdk/easing.ts`**
Added Blueprint v5.0 EZ easing map.

**New Exports:**
- `EZ` - Object with 6 core Remotion easing functions
  - `smooth` - Default for most animations
  - `power2InOut` - Camera pans, big moves
  - `power3InOut` - Hero entrances
  - `power3In` - Confident exits
  - `power2Out` - Gentle landings
  - `backOut` - Tiny overshoot for charm
- `getEasing(name)` - Get easing by name with fallback

**Legacy easings preserved** (marked as deprecated)

---

### **3. Updated: `src/sdk/time.ts`**
Added frame conversion utilities.

**New Exports:**
- `toFrames(seconds, fps)` - Convert seconds to frame count
- `msToFrames(milliseconds, fps)` - Convert ms to frames
- `useTime()` - Updated to use new helpers internally

**Key Principle:**
- Time ALWAYS in seconds (FPS-agnostic)
- Frame count adjusts when FPS changes
- Example: 4s @ 30fps = 120 frames, 4s @ 60fps = 240 frames

---

### **4. Created: `src/sdk/presets.js`**
10 core animation presets following Blueprint v5.0 spec.

#### **Entrances (4)**

1. **`fadeUpIn(frame, config, easingMap, fps)`**
   - Config: `{ start, dur, dist, ease }`
   - Returns: `{ opacity, translateY }`

2. **`slideInLeft(frame, config, easingMap, fps)`**
   - Config: `{ start, dur, dist, ease }`
   - Returns: `{ opacity, translateX }`

3. **`slideInRight(frame, config, easingMap, fps)`**
   - Config: `{ start, dur, dist, ease }`
   - Returns: `{ opacity, translateX }`

4. **`popInSpring(frame, config, easingMap, fps)`**
   - Config: `{ start, mass, stiffness, damping }`
   - Returns: `{ opacity, scale }`
   - Uses Remotion spring physics

#### **Emphasis (2)**

5. **`pulseEmphasis(frame, config, easingMap, fps)`**
   - Config: `{ start, dur, scale, ease }`
   - Returns: `{ scale }`
   - Scales up then back (attention grabber)

6. **`breathe(frame, config, easingMap, fps)`**
   - Config: `{ start, loop, amount }`
   - Returns: `{ scale }`
   - Looping sine wave for idle animation

#### **Exits (1)**

7. **`fadeDownOut(frame, config, easingMap, fps)`**
   - Config: `{ start, dur, dist, ease }`
   - Returns: `{ opacity, translateY }`

#### **Complex (3)**

8. **`drawOnPath(frame, config, easingMap, fps)`**
   - Config: `{ start, dur, length, ease }`
   - Returns: `{ strokeDasharray, strokeDashoffset }`
   - For SVG path animations

9. **`shrinkToCorner(frame, config, easingMap, fps)`**
   - Config: `{ start, dur, targetScale, targetPos, ease }`
   - Returns: `{ scale, translateX, translateY }`

10. **`useHighlightSwipe(frame, config, easingMap, fps)`**
    - Config: `{ start, dur, rect, ease }`
    - Returns: `{ clipPathId, defsJSX, style, progress }`
    - Hook pattern (returns JSX for `<defs>`)

**All Presets:**
- ✅ Accept seconds in config (FPS-agnostic)
- ✅ Convert to frames internally via `toFrames()`
- ✅ Auto-clamping with extrapolate: 'clamp'
- ✅ Use centralized EZ easing map
- ✅ Return style objects or raw values

**Additional Exports:**
- `PRESET_REGISTRY` - Object with all preset functions
- `getPreset(name)` - Get preset by name

---

### **5. Updated: `src/sdk/index.js`**
Added exports for new Blueprint v5.0 systems.

**New Exports:**
```javascript
// Presets
export * from './presets';

// Scene ID Context
export { SceneIdContext, useSceneId, generateSceneId } from './SceneIdContext';

// Easing Map
export { EZ, getEasing } from './easing';
```

---

## 🎯 Blueprint Compliance

### ✅ **Unit Consistency**
- All JSON authored in seconds
- Presets convert seconds → frames internally
- FPS changes don't break timing

### ✅ **ID Factory**
- Context-based pattern implemented
- Deterministic, namespaced IDs
- Parent must wrap with `<SceneIdContext.Provider>`

### ✅ **Easing Map**
- 6 core easings defined
- Named access via `getEasing()`
- Fallback to 'smooth' if not found

### ✅ **Preset Library**
- 10 core presets implemented
- Config-based API (Pattern A)
- Raw values for special cases (Pattern B)
- Hooks for JSX needs (Pattern C)

---

## 📊 Usage Examples

### **Example 1: Simple Entrance**
```javascript
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { fadeUpIn, EZ } from './sdk';

const MyComponent = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const titleAnim = fadeUpIn(frame, {
    start: 0.6,      // seconds
    dur: 0.9,        // seconds
    dist: 50,        // pixels
    ease: 'power3InOut'
  }, EZ, fps);
  
  return (
    <div style={{
      opacity: titleAnim.opacity,
      transform: `translateY(${titleAnim.translateY}px)`
    }}>
      Hello World
    </div>
  );
};
```

### **Example 2: ID Factory**
```jsx
import { SceneIdContext, useSceneId } from './sdk';

// Parent
const App = () => (
  <SceneIdContext.Provider value="hook1a">
    <Hook1ATemplate scene={scene} />
  </SceneIdContext.Provider>
);

// Template
const Hook1ATemplate = ({ scene }) => {
  const id = useSceneId();
  
  return (
    <svg>
      <defs>
        <clipPath id={id('text-clip')}>
          <rect x={0} y={0} width={800} height={80} />
        </clipPath>
      </defs>
      <text clipPath={`url(#${id('text-clip')})`}>
        Clipped text
      </text>
    </svg>
  );
};
```

### **Example 3: Highlight Swipe (Hook Pattern)**
```jsx
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { useHighlightSwipe, EZ } from './sdk';

const MyComponent = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const highlight = useHighlightSwipe(frame, {
    start: 2.1,
    dur: 0.6,
    rect: { x: 560, y: 320, width: 800, height: 80 }
  }, EZ, fps);
  
  return (
    <svg>
      <defs>{highlight.defsJSX}</defs>
      <text style={highlight.style}>
        Highlighted text
      </text>
    </svg>
  );
};
```

---

## 🧪 Testing Checklist

### **Manual Tests**
- [ ] Import presets in a template
- [ ] Call `fadeUpIn()` with seconds config
- [ ] Verify frame conversion at 30fps, 60fps
- [ ] Use `useSceneId()` in template, check generated IDs
- [ ] Render multiple scenes in composition (ID collision test)
- [ ] Test `useHighlightSwipe()` hook returns valid JSX

### **Integration Tests**
- [ ] Hook1A refactor using new presets (Tier 2)
- [ ] Update Hook1A JSON to v5 schema (Tier 2)
- [ ] Test mode switching (notebook/whiteboard) (Tier 2)
- [ ] Export MP4, verify preview parity (Tier 2)

---

## 🔄 Next Steps: Tier 2

**Ready to proceed with template refactoring:**

1. **Add required exports to Hook1A**
   - `TEMPLATE_ID`, `TEMPLATE_VERSION`
   - `getDuration(scene, fps)` - derived from `beats.exit + tailPadding`
   - `DURATION_MIN_FRAMES`, `DURATION_MAX_FRAMES`
   - `SUPPORTED_MODES`, `CAPABILITIES`

2. **Refactor Hook1A animations**
   - Replace inline `interpolate()` calls with preset functions
   - Extract beat logic to use seconds
   - Apply `useSceneId()` for all SVG IDs

3. **Update `hook_1a_knodovia_map.json`**
   - Bump schema to v5.0
   - Remove `duration_s` (derived from beats)
   - Add layer definitions (optional - can be template-rendered)

4. **Test mode switching**
   - Verify notebook/whiteboard toggle works
   - Check color/texture inheritance

---

## ⚠️ Known Issues

### **Pre-existing Build Error**
```
error during build:
[vite]: Rollup failed to resolve import "gsap" from "Explain2BAnalogy.jsx"
```

**Status:** Unrelated to Tier 1 changes  
**Cause:** GSAP import in Explain2B template (not in node_modules)  
**Fix:** Either install GSAP or remove import from Explain2B (Blueprint says no GSAP in exports)

---

## 📝 Notes

### **Backward Compatibility**
- Legacy easing arrays preserved (marked deprecated)
- Old `animations.js` still exists (not removed yet)
- Templates can gradually migrate to new presets

### **TypeScript Support**
- `easing.ts` and `time.ts` have proper types
- `presets.js` and `SceneIdContext.jsx` use JSDoc (could migrate to TS later)

### **Performance**
- No performance regressions expected
- Presets use same Remotion primitives as before
- ID factory adds negligible overhead (context lookup)

---

**✅ Tier 1 Complete - Ready for Tier 2 Implementation**
