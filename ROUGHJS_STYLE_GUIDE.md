# rough.js Style Guide - Knode Templates

## Core Principle

**rough.js is for STYLE, not distraction.**

The goal is subtle sketchy character, NOT jittery chaos.

---

## ✅ Correct Parameter Ranges

### For Lines (underlines, connectors, arrows)
```javascript
{
  roughness: 0.6 - 1.0,  // Subtle wobble
  bowing: 1 - 2,         // Gentle curve
  strokeWidth: 4 - 7,    // Marker weight
}
```

### For Circles (accents, highlights)
```javascript
{
  roughness: 0.5 - 0.8,  // Very subtle
  bowing: 1 - 2,         // Minimal
  strokeWidth: 4 - 6,
}
```

### For Rectangles / Boxes (frames, containers)
```javascript
{
  roughness: 0.7 - 1.0,
  bowing: 1 - 2,
  strokeWidth: 3 - 5,
  fillStyle: 'hachure',
  hachureGap: 6 - 10,
}
```

### For Stars / Complex Paths (decorative)
```javascript
{
  roughness: 0.6 - 1.0,
  bowing: 1 - 2,
  strokeWidth: 2 - 4,
  fillStyle: 'hachure',
  hachureGap: 8 - 12,
}
```

---

## ❌ What NOT To Do

### Too Jittery (AVOID)
```javascript
{
  roughness: 2.5,   // ❌ Way too wobbly
  bowing: 8,        // ❌ Too much curve
}
```

**Problem:** Lines look shaky and distract from content.

### Too Perfect (AVOID)
```javascript
{
  roughness: 0,     // ❌ No character
  bowing: 0,        // ❌ Digital feel
}
```

**Problem:** Defeats the purpose of rough.js.

---

## 🎯 The Sweet Spot

**Target Feel:** "Hand-drawn by someone with a steady hand"

- **NOT:** Shaky/nervous sketch
- **NOT:** Perfect digital line
- **YES:** Confident marker stroke with natural variation

### Visual Comparison

**Too Jittery (2.5 roughness):**
```
~~~~~∿∿∿~~~~~∿∿∿~~~~~
```

**Just Right (0.8 roughness):**
```
————～————～————～————
```

**Too Perfect (0 roughness):**
```
————————————————————
```

---

## 📊 Hook 1A Reference

### Current Settings (APPROVED ✅)

```javascript
// Underline 1
{
  roughness: 0.8,
  bowing: 2,
  strokeWidth: 6,
}

// Underline 2
{
  roughness: 1.0,
  bowing: 2,
  strokeWidth: 7,
}

// Accent Circle
{
  roughness: 0.6,
  bowing: 1,
  strokeWidth: 5,
}

// Stars
{
  roughness: 0.8,
  bowing: 1,
  strokeWidth: 3,
  fillStyle: 'hachure',
  hachureGap: 8,
}

// Scribbles
{
  roughness: 1.0,
  bowing: 2,
  strokeWidth: 4,
}
```

---

## 🎨 When to Use Each Setting

### Subtle Accent (0.5 - 0.7)
- Background circles
- Decorative frames
- Subtle highlights

### Standard Sketch (0.7 - 1.0)
- Main underlines
- Connecting lines
- Content boxes

### Expressive Mark (1.0 - 1.2)
- Emphasis strokes
- Scribbles
- Handwritten labels

### Maximum (1.2 - 1.5)
- ONLY for intentional "messy" effect
- Brief moments of chaos
- Never for primary content

---

## 🚀 Application to All Templates

All 8 templates will follow these ranges:

### Hook 1A (Question Burst) ✅
- Lines: 0.8 - 1.0 roughness
- Circles: 0.6 roughness
- Stars: 0.8 roughness

### Hook 1E (Ambient Mystery)
- Fog clouds: 0.7 roughness
- Wispy lines: 0.8 roughness
- Mystery circles: 0.6 roughness

### Explain 2A (Concept Breakdown)
- Box frames: 0.9 roughness
- Connecting lines: 0.8 roughness
- Labels: 1.0 roughness

### Explain 2B (Analogy)
- Comparison frames: 0.8 roughness
- Arrows: 0.9 roughness
- Brackets: 1.0 roughness

### Apply 3A (Micro Quiz)
- Option circles: 0.7 roughness
- Check marks: 0.9 roughness
- Feedback boxes: 0.8 roughness

### Apply 3B (Scenario Choice)
- Path lines: 0.8 roughness
- Choice bubbles: 0.7 roughness
- Outcome frames: 0.9 roughness

### Reflect 4A (Key Takeaways)
- Takeaway boxes: 0.8 roughness
- Bullet points: 1.0 roughness
- Connecting lines: 0.7 roughness

### Reflect 4D (Forward Link)
- Bridge shapes: 0.9 roughness
- Arrow paths: 0.8 roughness
- Next step boxes: 0.7 roughness

---

## ✨ Key Takeaways

1. **Roughness < 1.0 for most elements**
2. **Bowing < 2 for all elements**
3. **StrokeWidth matters more than roughness for impact**
4. **Hachure fills add character without jitter**
5. **Test at 30fps - what looks good in preview may jitter in motion**

---

## 🎯 Quality Check

Before finalizing any template, ask:

- [ ] Does this enhance the content or distract from it?
- [ ] Would I notice the sketch style or the wobbly lines first?
- [ ] If I blur my eyes, do I see shapes or chaos?
- [ ] Does motion make it worse?

**If roughness distracts → reduce it.**

---

**Updated:** 2025-10-23  
**Status:** Applied to Hook 1A, ready for templates 2-8
