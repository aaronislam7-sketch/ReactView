# Tier 2 Implementation Complete ✅

**Blueprint v5.0 - Hook1A Template Refactor**  
**Date:** 2025-10-28  
**Status:** Ready for Testing

---

## 📦 Files Created/Updated

### **1. Created: `src/scenes/hook_1a_knodovia_map_v5.json`**
Updated scene JSON to Blueprint v5.0 schema.

**Changes:**
- ✅ Bumped `schema_version` from "3.0" to "5.0"
- ✅ Removed `duration_s` (now derived from beats.exit)
- ✅ Removed `fps` field (controlled globally)
- ✅ Added `beats` object with all timing in **seconds**
  - `entrance`, `questionPart1`, `moveUp`, `questionPart2`, `emphasis`
  - `wipeQuestions`, `mapReveal`, `transformMap`, `welcome`
  - `subtitle`, `breathe`, `exit`
- ✅ Added `mode: "notebook"` to `style_tokens`
- ✅ Added `welcome` text to `fill.texts`

**v3.0 → v5.0 Comparison:**
```diff
{
- "schema_version": "3.0",
+ "schema_version": "5.0",
- "template_id": "hook_1a",
+ "template_id": "Hook1AQuestionBurst",
- "duration_s": 20,
- "fps": 30,
  
  "style_tokens": {
+   "mode": "notebook",
    "colors": { ... }
  },
  
+ "beats": {
+   "entrance": 0.6,
+   "questionPart1": 0.6,
+   "moveUp": 2.0,
+   ...
+   "exit": 15.0
+ },
  
  "fill": {
    "texts": {
      "questionPart1": "What if geography",
      "questionPart2": "was measured in mindsets?",
-     "subtitle": "Welcome to Knodovia..."
+     "welcome": "Welcome to Knodovia",
+     "subtitle": "A place where your perspective shapes the landscape..."
    }
  }
}
```

---

### **2. Created: `src/templates/Hook1AQuestionBurst_V5.jsx`**
Fully refactored template with Blueprint v5.0 compliance.

#### **New Imports**
```javascript
import { 
  fadeUpIn,         // Preset for entrance animations
  pulseEmphasis,    // Preset for emphasis
  breathe,          // Preset for looping idle animation
  shrinkToCorner,   // Preset for map transformation
  EZ,               // Centralized easing map
  useSceneId,       // Context-based ID factory
  toFrames          // Seconds → frames converter
} from '../sdk';
```

#### **Key Refactors**

**A. ID Factory Pattern**
```javascript
// Before (hardcoded IDs)
textGroup.setAttribute('id', 'question1-group');

// After (context-based, collision-proof)
const id = useSceneId();
textGroup.setAttribute('id', id('question1-group'));
```

**B. Beats from JSON (Seconds)**
```javascript
// Before (hardcoded frames)
const BEAT = 30;
const beats = {
  questionPart1: BEAT * 0.6,  // 18 frames
  moveUp: BEAT * 2.0,         // 60 frames
  ...
};

// After (read from JSON, convert to frames)
const sceneBeats = scene.beats || {};
const beats = {
  questionPart1: toFrames(sceneBeats.questionPart1 || 0.6, fps),
  moveUp: toFrames(sceneBeats.moveUp || 2.0, fps),
  ...
};
```

**C. Using Animation Presets**

*Welcome Text (fadeUpIn + breathe):*
```javascript
// Using preset for entrance
const welcomeAnim = fadeUpIn(frame, {
  start: sceneBeats.welcome || 10.0,  // seconds
  dur: 1.5,
  dist: 40,
  ease: 'power3InOut'
}, EZ, fps);

// Using preset for breathe
const welcomeBreathe = breathe(frame, {
  start: sceneBeats.breathe || 13.5,
  loop: 3.0,
  amount: 0.02
}, EZ, fps);
```

*Map Transformation (shrinkToCorner):*
```javascript
// Using preset for complex transform
const mapTransform = shrinkToCorner(frame, {
  start: sceneBeats.transformMap || 9.0,
  dur: 1.2,
  targetScale: 0.4,
  targetPos: { x: 600, y: -300 },
  ease: 'power2InOut'
}, EZ, fps);
```

*Pulse Emphasis:*
```javascript
// Using preset for pulse
const q1Pulse = pulseEmphasis(frame, {
  start: sceneBeats.emphasis || 4.2,
  dur: 0.8,
  scale: 1.05,
  ease: 'backOut'
}, EZ, fps);
```

**D. Centralized Easing (EZ Map)**
```javascript
// Before (inline beziers or no easing)
interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp' })

// After (named easing from EZ map)
interpolate(frame, [start, end], [0, 1], { 
  extrapolateRight: 'clamp', 
  easing: EZ.smooth 
})
```

**E. Required Exports (Blueprint v5.0)**
```javascript
export { Hook1AQuestionBurst };

export const TEMPLATE_ID = 'Hook1AQuestionBurst';
export const TEMPLATE_VERSION = '5.0.0';

export const getDuration = (scene, fps) => {
  const tailPadding = 0.5;
  return toFrames((scene.beats?.exit || 15.0) + tailPadding, fps);
};

export const DURATION_MIN_FRAMES = 450;  // 15s @ 30fps
export const DURATION_MAX_FRAMES = 540;  // 18s @ 30fps

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'pulseEmphasis',
  'breathe',
  'shrinkToCorner'
];

export const getPosterFrame = (scene, fps) => {
  return toFrames(scene.beats?.emphasis || 4.2, fps);
};
```

---

## 🎯 Blueprint Compliance Checklist

### ✅ **Determinism**
- [x] Uses only `frame`, never `useState` triggers
- [x] ID factory for all `<defs>` elements (via `useSceneId()`)
- [x] No `Math.random()` or time-based randomness

### ✅ **Timing**
- [x] All beats defined in JSON (seconds)
- [x] Animations use preset functions where applicable
- [x] Presets accept seconds, convert to frames internally
- [x] Proper breathing room (0.8–1.5s) between changes

### ✅ **Style**
- [x] Respects `scene.style_tokens.mode` (notebook/whiteboard)
- [x] Uses THEME constants with per-scene overrides
- [x] **STRICT ZERO WOBBLE** (ALL rough.js: `roughness: 0, bowing: 0`)

### ✅ **Motion**
- [x] Uses EZ easing map (no hardcoded beziers)
- [x] Presets handle clamping internally
- [x] Smooth exits (power3In easing)

### ✅ **Exports**
- [x] All required exports present
- [x] `TEMPLATE_ID`, `TEMPLATE_VERSION`
- [x] `getDuration()` derived from `beats.exit + tailPadding`
- [x] `DURATION_MIN_FRAMES`, `DURATION_MAX_FRAMES`
- [x] `SUPPORTED_MODES`, `CAPABILITIES`
- [x] `PRESETS_REQUIRED`, `getPosterFrame()`

---

## 🔄 Animation Strategy

### **Presets Used**
1. **fadeUpIn** - Welcome text entrance, subtitle entrance
2. **pulseEmphasis** - Question 1 & 2 emphasis
3. **breathe** - Welcome text idle animation
4. **shrinkToCorner** - Map transformation

### **Custom Animations Kept**
Some animations remain as inline `interpolate()` calls because they have **multiple sequential stages** that don't fit a single preset:

1. **Question 1** - 4 stages: entrance → move up → pulse → wipe left
2. **Question 2** - 3 stages: entrance → pulse → wipe left
3. **Map entrance** - Custom draw-on effect with rough.js path animation

**Rationale:** Blueprint allows custom animations for complex choreography. The key is using the EZ easing map and proper frame conversion.

---

## 🧪 Testing Checklist

### **Unit Tests**
- [ ] Import template without errors
- [ ] Render with v5.0 JSON schema
- [ ] Verify beats read from JSON correctly
- [ ] Test with different FPS (30, 60) - verify duration consistency
- [ ] Check ID factory generates unique IDs

### **Visual Tests**
- [ ] Question 1 entrance smooth (fadeUpIn-like)
- [ ] Question 1 moves up at correct time (2.0s)
- [ ] Both questions pulse at emphasis beat (4.2s)
- [ ] Both questions wipe left together (5.5s)
- [ ] Map draws in with zero wobble (6.5s)
- [ ] Map shrinks to corner (9.0s → 10.2s)
- [ ] "Welcome to Knodovia" fades up (10.0s)
- [ ] Subtitle fades in (12.0s)
- [ ] Welcome breathes subtly (13.5s+)

### **Integration Tests**
- [ ] Render full 15-18s scene
- [ ] Export MP4, compare with preview (frame-by-frame parity)
- [ ] Wrap with `<SceneIdContext.Provider>` in composition
- [ ] Render multiple Hook1A instances (ID collision test)
- [ ] Toggle notebook/whiteboard mode (colors/textures update)

### **Performance Tests**
- [ ] No lag during map drawing
- [ ] Smooth 30fps playback throughout
- [ ] SVG text rendering performant (useEffect optimized)

---

## 📝 Migration Guide (v3.0 → v5.0)

### **For Template Authors**

**Step 1: Update JSON Schema**
```javascript
// Update schema_version
"schema_version": "5.0"

// Remove duration_s, fps
- "duration_s": 20,
- "fps": 30,

// Add beats object (seconds)
+ "beats": {
+   "entrance": 0.6,
+   "exit": 15.0,
+   ...
+ }

// Add mode to style_tokens
+ "style_tokens": {
+   "mode": "notebook"
+ }
```

**Step 2: Update Template Imports**
```javascript
import { 
  fadeUpIn, pulseEmphasis, breathe, shrinkToCorner,
  EZ, useSceneId, toFrames 
} from '../sdk';
```

**Step 3: Apply ID Factory**
```javascript
const id = useSceneId();
textGroup.setAttribute('id', id('my-element'));
```

**Step 4: Read Beats from JSON**
```javascript
const sceneBeats = scene.beats || {};
const beats = {
  entrance: toFrames(sceneBeats.entrance || 0.6, fps),
  ...
};
```

**Step 5: Use Presets**
```javascript
const titleAnim = fadeUpIn(frame, {
  start: sceneBeats.entrance,
  dur: 0.9,
  dist: 50,
  ease: 'power3InOut'
}, EZ, fps);
```

**Step 6: Add Required Exports**
```javascript
export const TEMPLATE_ID = 'MyTemplate';
export const TEMPLATE_VERSION = '5.0.0';
export const getDuration = (scene, fps) => 
  toFrames((scene.beats?.exit || 15) + 0.5, fps);
// ... etc
```

---

## 🎬 Next Steps: Tier 3 Validation

**Ready to proceed with validation:**

1. **Test Hook1A_V5 in dev environment**
   - Import in composition
   - Wrap with SceneIdContext
   - Verify animations match original

2. **FPS auto-scaling test**
   - Render at 30fps, 60fps
   - Confirm 4s stays 4s (frame count adjusts)

3. **Mode switching test**
   - Toggle `style_tokens.mode` between notebook/whiteboard
   - Verify colors, textures update

4. **Export parity test**
   - Export MP4
   - Compare preview vs export (frame-by-frame)

5. **Multi-scene composition test**
   - Render 3x Hook1A with different scene_ids
   - Verify no ID collisions (check SVG IDs in dev tools)

---

## 💡 Key Learnings

### **What Worked Well**
1. **Preset integration** - fadeUpIn, pulseEmphasis, breathe, shrinkToCorner fit cleanly
2. **ID factory pattern** - Simple, effective, no collisions
3. **Seconds in JSON** - More author-friendly than frames
4. **EZ easing map** - Named easings clearer than inline beziers

### **Challenges**
1. **Multi-stage animations** - Some animations (q1, q2) have 4+ sequential stages
   - Solution: Keep as inline interpolate, use EZ easings
2. **Backwards compatibility** - Need to support both v3 and v5 JSONs
   - Solution: Fallbacks in template code (`sceneBeats.entrance || 0.6`)

### **Blueprint Flexibility**
The blueprint allows pragmatism:
- **Presets encouraged** for simple animations
- **Custom interpolate allowed** for complex choreography
- **Key requirement** is using EZ map and proper frame conversion

---

## 🚀 Files Summary

**Created:**
- ✅ `src/scenes/hook_1a_knodovia_map_v5.json` (v5.0 schema)
- ✅ `src/templates/Hook1AQuestionBurst_V5.jsx` (v5.0 compliant)

**Original files preserved:**
- ✅ `src/scenes/hook_1a_knodovia_map.json` (v3.0, untouched)
- ✅ `src/templates/Hook1AQuestionBurst.jsx` (original, untouched)

**Strategy:** Side-by-side comparison approach for safe testing.

---

**✅ Tier 2 Complete - Ready for Tier 3 Validation**
