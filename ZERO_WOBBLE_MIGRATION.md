# Zero Wobble Migration

**Goal:** Remove ALL wobbles/jitter from rough.js rendering

**Principle:** Use rough.js for SHAPE RENDERING only, not for wobble effect

---

## Changes

### roughHelpers.js
- All `roughness` → 0 or 0.1 (minimal)
- All `bowing` → 0
- Preserve `strokeWidth` for visual weight

### All 8 Templates
Need to update ALL rough.js calls:

```javascript
// BEFORE (wobble)
{
  roughness: 0.8,
  bowing: 2,
  strokeWidth: 5
}

// AFTER (zero wobble)
{
  roughness: 0,
  bowing: 0,
  strokeWidth: 5
}
```

---

## Templates to Update

1. ✅ Hook1AQuestionBurst.jsx
2. ⏳ Hook1EAmbientMystery.jsx
3. ⏳ Explain2AConceptBreakdown.jsx
4. ⏳ Explain2BAnalogy.jsx
5. ⏳ Apply3AMicroQuiz.jsx
6. ⏳ Apply3BScenarioChoice.jsx
7. ⏳ Reflect4AKeyTakeaways.jsx
8. ⏳ Reflect4DForwardLink.jsx

---

## How to Preserve Hand-Drawn Feel WITHOUT Wobbles

1. **Slight Random Offsets** - Add small random position variations (±2px)
2. **Varied Stroke Weights** - Use different strokeWidth values
3. **Organic Easing** - Use elastic/spring easing curves
4. **Imperfect Placement** - Slight asymmetry in layout
5. **Texture** - Background noise/grain
6. **Color Variation** - Slight hue/saturation shifts

**NOT:** Wobbly lines (causes jitter in motion)
