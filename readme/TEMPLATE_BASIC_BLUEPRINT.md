# Template Basic Blueprint (Foundation)
## The Foundational Pattern for All Knode Video Templates

**Status**: Production-Ready Foundation  
**Version**: Basic v1.0  
**Use Case**: Starting point for all templates, reliable and simple

---

## Philosophy

> **"Start simple, enhance intentionally."**

This is the **BASIC** pattern - the foundation for all templates. It uses **Remotion `interpolate()`** for all animations, making it reliable, predictable, and easy to debug.

Use this pattern first. Once it works, consider enhancements from the **ENHANCEMENT** blueprint.

---

## 1. Animation Strategy (BASIC)

### **Use Remotion `interpolate()` for ALL animations**

#### ✅ Use Remotion `interpolate()` For:
- **Entrances** (fade in, slide in)
- **Exits** (fade out, slide out)
- **Mid-scene moves** (repositioning, scaling)
- **Simple effects** (pulses, highlights)

#### Why Start with interpolate()?
- ✅ Frame-based = reliable, predictable
- ✅ No element existence issues
- ✅ Works with conditional rendering
- ✅ Easy to debug (check frame number)
- ✅ Declarative = clean code

#### When to Enhance?
Once the basic pattern works, see **TEMPLATE_ENHANCEMENT_BLUEPRINT.md** for:
- Smoother mid-scene moves (GSAP)
- Polished exits (GSAP)
- Complex choreography

---

## 2. The Core Pattern

### **A. Calculate Animations with interpolate()**

```javascript
const BEAT = 30; // 1 second at 30fps

const beats = {
  entrance: BEAT * 1.0,
  action: BEAT * 2.5,
  exit: BEAT * 4.0,
};

// Opacity
const elementOpacity = frame < beats.entrance ? 0 :
  frame < beats.exit ? interpolate(
    frame,
    [beats.entrance, beats.entrance + 27], // 0.9s entrance
    [0, 1],
    { extrapolateRight: 'clamp' }
  ) :
  interpolate(
    frame,
    [beats.exit, beats.exit + 30], // 1s exit
    [1, 0],
    { extrapolateRight: 'clamp' }
  );

// Position
const elementY = frame < beats.entrance ? 30 :
  frame < beats.action ? interpolate(
    frame,
    [beats.entrance, beats.entrance + 27],
    [30, 0],
    { extrapolateRight: 'clamp' }
  ) :
  interpolate(
    frame,
    [beats.action, beats.action + 24], // 0.8s move
    [0, -60],
    { extrapolateRight: 'clamp' }
  );

// Scale
const elementScale = frame < beats.action ? 1 :
  frame < beats.action + 12 ? interpolate(
    frame,
    [beats.action, beats.action + 12], // 0.4s pulse
    [1, 1.05],
    { extrapolateRight: 'clamp' }
  ) :
  frame < beats.action + 24 ? interpolate(
    frame,
    [beats.action + 12, beats.action + 24],
    [1.05, 1],
    { extrapolateRight: 'clamp' }
  ) : 1;
```

### **B. Apply as SVG Attributes**

```javascript
useEffect(() => {
  if (!svgRef.current) return;
  const svg = svgRef.current;
  
  // Clear previous
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  
  // Render only when visible (with exit buffer)
  if (frame >= beats.entrance && frame < beats.exit + 35) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', 'element-group');
    group.setAttribute('opacity', String(elementOpacity));
    group.setAttribute('transform', `translate(0, ${elementY}) scale(${elementScale})`);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '960');
    text.setAttribute('y', '540');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', "'Cabin Sketch', cursive");
    text.setAttribute('font-size', '72');
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', colors.accent);
    text.textContent = 'Your Text';
    
    group.appendChild(text);
    svg.appendChild(group);
  }
}, [frame, beats, elementOpacity, elementY, elementScale]); // Include interpolated values!
```

### **C. For HTML Elements**

```javascript
{frame >= beats.subtitle && (
  <div
    style={{
      opacity: subtitleOpacity,
      transform: `translateY(${subtitleY}px)`,
      transition: 'none', // NO CSS transitions, use interpolate
    }}
  >
    <p style={{ fontFamily: fonts.secondary }}>
      Your subtitle text
    </p>
  </div>
)}
```

---

## 3. Typography (BASIC)

### **Font Hierarchy:**
- **Headers**: Cabin Sketch (SVG text for sketchy style)
- **Body/Secondary**: Permanent Marker (HTML for personality)
- **Supporting**: Inter/DM Sans (HTML for clean readability)

### **Header Rendering:**

```javascript
const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
textElement.setAttribute('font-size', '72');
textElement.setAttribute('font-weight', '700');
textElement.setAttribute('fill', colors.accent);
textElement.textContent = 'Your Header';
```

### **Body/Secondary Text:**

```javascript
<p style={{
  fontFamily: THEME.fonts.marker.primary, // Permanent Marker
  fontSize: 32,
  color: colors.ink,
}}>
  Your body text
</p>
```

---

## 4. Rough.js Usage (STRICT)

### **✅ USE Rough.js For:**
1. **Hand-drawn maps/illustrations** (ZERO wobble)
2. **SVG text rendering** (Cabin Sketch font)

### **❌ NEVER Use Rough.js For:**
1. Boxes around text
2. Underlines beneath text
3. Decorative frames
4. Any wobble/roughness effects

### **ZERO Wobble Always:**

```javascript
const element = rc.path(pathData, {
  stroke: colors.accent,
  strokeWidth: 6,
  roughness: 0,  // ALWAYS ZERO
  bowing: 0,     // ALWAYS ZERO
  fill: `${colors.accent}15`,
  fillStyle: 'hachure',
  hachureGap: 8,
});
```

---

## 5. Timing & Pacing (BASIC)

### **Beat Standards:**

```javascript
const BEAT = 30; // 1 second at 30fps

const beats = {
  prelude: 0,
  action1: BEAT * 0.6,           // 0.6s
  action2: BEAT * 2.0,           // 2.0s (includes breathing room)
  action3: BEAT * 3.5,           // 3.5s (includes breathing room)
};
```

### **Breathing Room:**
- **After entrance**: 0.8-1.2s (24-36 frames)
- **After exit**: 0.8-1.0s (24-30 frames)
- **After move**: 1.0-1.5s (30-45 frames)
- **Between pulses**: 0.3-0.5s (9-15 frames)

### **Animation Durations:**
- **Quick entrance**: 21-27 frames (0.7-0.9s)
- **Standard move**: 24-39 frames (0.8-1.3s)
- **Slow transform**: 45-60 frames (1.5-2.0s)

---

## 6. Conversational Flow

### **The Pattern:**

```
ENTRANCE → SERVE → EXIT
```

Every element follows this lifecycle:
1. **Entrance**: Element appears with purpose
2. **Serve**: Element fulfills its role (teach, emphasize, connect)
3. **Exit**: Element gracefully leaves to clear the stage

### **Example Timeline:**

```
0.6s  → Header appears (entrance)
2.0s  → Header moves up (make room)
2.8s  → Body text appears (entrance)
4.2s  → Both pulse (emphasize)
5.5s  → Both exit left (clear stage)
6.5s  → New content appears (entrance)
```

---

## 7. Color Usage

### **Brand Palette:**
```javascript
const colors = {
  bg: '#FFF9F0',       // Warm cream
  accent: '#FF6B35',   // Bold orange
  accent2: '#9B59B6',  // Bold purple
  success: '#27AE60',  // Green
  info: '#2E7FE4',     // Blue
  ink: '#1A1A1A',      // Text
};
```

### **Usage by Template Type:**
- **Hook**: Orange + Purple
- **Explain**: Blue + Green/Purple
- **Apply**: Green + Orange
- **Reflect**: Purple + Blue

---

## 8. Quality Checklist (BASIC)

Before marking complete, verify:

#### ✅ Animation
- [ ] Uses Remotion interpolate() for all motion
- [ ] Interpolated values in useEffect dependencies
- [ ] Conditional rendering with exit buffer (+ 30-35 frames)
- [ ] Breathing room between beats (24-45 frames)
- [ ] `extrapolateRight: 'clamp'` on all interpolate calls

#### ✅ Typography
- [ ] Headers use Cabin Sketch (SVG text)
- [ ] Body uses Permanent Marker (HTML)
- [ ] Supporting uses Inter/DM Sans (HTML)
- [ ] Unique ID for each SVG group
- [ ] Transforms applied as SVG attributes

#### ✅ Zero Wobble
- [ ] NO roughness on any element (`roughness: 0`)
- [ ] NO bowing on any element (`bowing: 0`)
- [ ] NO boxes or underlines around text
- [ ] Rough.js ONLY for maps and text

#### ✅ Flow
- [ ] Entrance → Serve → Exit pattern
- [ ] Stage clears between acts
- [ ] Only relevant content visible
- [ ] Smooth transitions throughout

---

## 9. Anti-Patterns (AVOID)

### **❌ The Premature Enhancement Trap**
**Problem**: Adding GSAP before basic pattern works  
**Fix**: Start with interpolate(), enhance later if needed

### **❌ The Missing Deps Trap**
**Problem**: Forgetting interpolated values in useEffect dependencies  
**Fix**: Always include calculated values (opacity, translateY, scale)

### **❌ The Wobble Trap**
**Problem**: Adding roughness/bowing for "hand-drawn" feel  
**Fix**: ZERO wobble always. Font provides sketchy look.

### **❌ The Rushed Transition Trap**
**Problem**: Next element appears before previous completes  
**Fix**: Add 24-45 frames breathing room between beats

### **❌ The No Buffer Trap**
**Problem**: Exit animation cuts off abruptly  
**Fix**: Keep element rendered for exit duration (+ 30-35 frames)

---

## 10. Template Structure

### **Standard File Structure:**

```javascript
import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

const YourTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  // Refs
  const svgRef = useRef(null);
  const roughTextSvgRef = useRef(null);
  
  // Data
  const style = scene.style_tokens || {};
  const colors = style.colors || { /* defaults */ };
  const fonts = style.fonts || { /* defaults */ };
  const texts = scene.fill?.texts || {};
  
  // Beat timing
  const BEAT = 30;
  const beats = {
    // Define your timeline
  };
  
  // Calculate interpolations
  const element1Opacity = /* ... */;
  const element1Y = /* ... */;
  const element1Scale = /* ... */;
  
  // Render SVG text
  useEffect(() => {
    // SVG rendering logic
  }, [frame, beats, /* interpolated values */]);
  
  // Render rough.js elements
  useEffect(() => {
    // Rough.js rendering logic
  }, [frame, beats]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* SVG layers */}
      {/* HTML content */}
    </AbsoluteFill>
  );
};

export { YourTemplate };
export const YOUR_TEMPLATE_DURATION_MIN = 10 * 30;
export const YOUR_TEMPLATE_DURATION_MAX = 15 * 30;
```

---

## 11. Quick Reference Card

```
BASIC PATTERN:
  ✅ Remotion interpolate() for ALL animations
  ✅ Transforms as SVG attributes or inline styles
  ✅ Include interpolated values in useEffect deps
  ✅ Conditional rendering with exit buffer
  ✅ 24-45 frames breathing room between beats
  ✅ extrapolateRight: 'clamp' always

TYPOGRAPHY:
  ✅ Headers: Cabin Sketch (SVG text)
  ✅ Body: Permanent Marker (HTML)
  ✅ Supporting: Inter/DM Sans (HTML)

ROUGH.JS:
  ✅ ONLY for maps (zero wobble) and text rendering
  ❌ NEVER for boxes, underlines, decorations
  ❌ ALWAYS roughness: 0, bowing: 0

FLOW:
  ✅ Entrance → Serve → Exit
  ✅ Clear stage between acts
  ✅ Breathing room always
```

---

## 12. Next Steps

Once the **BASIC** pattern works:

1. ✅ Verify all animations smooth
2. ✅ Check timing and pacing
3. ✅ Test with different content
4. ✅ Validate checklist complete

Then consider enhancements:
- See **TEMPLATE_ENHANCEMENT_BLUEPRINT.md** for:
  - GSAP for smoother mid-scene moves
  - GSAP for polished exits
  - Complex choreography patterns
  - Advanced timing techniques

---

## Validation

Ask yourself:
1. **Does everything use interpolate()?** ✅
2. **Are interpolated values in deps?** ✅
3. **Is there zero wobble everywhere?** ✅
4. **Is there breathing room between beats?** ✅
5. **Does flow feel conversational?** ✅

If YES to all → **BASIC pattern complete!** 

Consider enhancements if needed.

---

**This is the foundation. Build on it intentionally.** 🎯
