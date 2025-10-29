# Template Design Blueprint V9 - FINAL ✅
## The Gold Standard for Knode Video Templates

**Status**: Production-Ready & Validated  
**Version**: 9.0 (Remotion Interpolate + Zero Wobble)

---

## Core Philosophy

> **"Conversational, not presentational. Dynamic, not static. Educational, not decorative."**

Every template should feel like a skilled teacher explaining a concept face-to-face - dynamic, responsive, and always moving the conversation forward.

---

## 1. Animation Strategy (THE DECISION)

### **Use Remotion `interpolate()` for BASIC animations**
### **Use GSAP ONLY for COMPLEX choreography**

#### ✅ Use Remotion `interpolate()` For:
- **Opacity** (fade in/out)
- **Position** (translate X, translate Y)
- **Scale** (grow/shrink)
- **Simple sequences** (entrance → move → exit)

#### ✅ Use GSAP For:
- **Complex staggers** (multiple elements with delays)
- **Morphs** (shape transformations)
- **Path animations** (complex curved motion)
- **Physics-based effects** (inertia, spring, bounce)
- **Coordinated sequences** (when multiple elements need precise timing)

#### ❌ DON'T Use GSAP For:
- Simple fade in/out
- Basic position changes
- Scale animations
- Basic entrance/exit animations

### **Why This Decision?**

**Remotion interpolate():**
- ✅ Frame-based = reliable, no timing issues
- ✅ No imperative code = cleaner, easier to debug
- ✅ Works perfectly with SVG attributes
- ✅ No "element doesn't exist yet" problems
- ✅ Simpler to reason about

**GSAP:**
- ⚠️ Imperative = requires element refs and existence checks
- ⚠️ Timing issues with conditionally rendered elements
- ⚠️ More complex to debug
- ✅ Powerful for complex sequences
- ✅ Great easing functions
- ✅ Excellent for staggers and coordinated motion

**VERDICT**: Use Remotion interpolate() by default. Add GSAP only when complexity requires it.

---

## 2. Motion Principles

### **A. Conversational Choreography**

Templates follow a **conversational flow** where elements enter, serve their purpose, then gracefully exit.

#### ✅ DO:
- **Enter → Serve → Exit**: Every element has a lifecycle
- **Clear the stage**: Remove elements when they're no longer needed
- **Make room**: Elements move to create space for what's next
- **Transform mid-scene**: Bold repositioning (shrink, move, scale)
- **Give breathing room**: 0.8-1.5s between major transitions

#### ❌ DON'T:
- Leave everything on screen at once
- Have static elements that just sit there
- Jump between states without transitions
- Rush transitions - let motion complete

**Example from Hook1A:**
```
Question 1 appears → moves up → Question 2 appears below →
both pulse → WIPE stage left → Map appears center →
Map transforms to corner → Welcome takes center stage
```

### **B. Remotion Interpolate Standards**

All basic motion uses `interpolate()` with frame ranges.

#### Duration Standards (in frames at 30fps):
- **Quick entrance**: 21-27 frames (0.7-0.9s)
- **Standard move**: 30-39 frames (1.0-1.3s)
- **Slow transformation**: 45-60 frames (1.5-2.0s)
- **Subtle breathe**: Sine wave, 0.025 frequency

#### Breathing Room (CRITICAL):
- **After entrance**: 24-36 frames (0.8-1.2s) before next action
- **After exit**: 24-30 frames (0.8-1.0s) before revealing next
- **After transformation**: 30-45 frames (1.0-1.5s) before new content
- **Between pulses**: 9-15 frames (0.3-0.5s)

### **C. ZERO Wobble on EVERYTHING**

**ABSOLUTE RULE**: NO wobble, NO roughness, NO bowing on ANY element.

#### Zero Wobble (EVERYTHING):
```javascript
// Maps, frames, decorative elements - ALL use zero wobble
{
  roughness: 0,
  bowing: 0,
  strokeWidth: 4-6,
}
```

**Why?**
- Clean, professional aesthetic
- Maintains brand quality
- Prevents visual noise

**Rough.js Purpose**: ONLY for:
1. Hand-drawn maps/illustrations (with ZERO wobble)
2. SVG text rendering (Cabin Sketch font, NO decorations)

---

## 3. Typography Principles

### **A. Typography Hierarchy**

#### Font Usage:
- **Headers**: Cabin Sketch (sketchy, hand-drawn font style)
- **Body/Secondary**: Permanent Marker (personality, energy)
- **Supporting**: Inter/DM Sans (clarity, readability)

#### Implementation:
```javascript
const fonts = {
  header: "'Cabin Sketch', cursive",      // Sketchy headers
  secondary: "'Permanent Marker', cursive", // Body text
  body: "'Inter', sans-serif",            // Supporting text
};
```

### **B. SVG Text Headers (Cabin Sketch)**

Headers use **Cabin Sketch font** to achieve sketchy, hand-drawn look.

**CRITICAL**: Render as **SVG text elements** and apply transforms via **SVG attributes**.

#### The Golden Pattern (Remotion Interpolate):

```javascript
// 1. Calculate animation values with interpolate()
const headerOpacity = frame < beats.headerStart ? 0 :
  interpolate(
    frame,
    [beats.headerStart, beats.headerStart + 27], // 0.9s entrance
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

const headerTranslateY = frame < beats.headerStart ? 30 :
  interpolate(
    frame,
    [beats.headerStart, beats.headerStart + 27],
    [30, 0],
    { extrapolateRight: 'clamp' }
  );

const headerScale = frame < beats.pulse ? 1 :
  frame < beats.pulse + 12 ? interpolate(
    frame,
    [beats.pulse, beats.pulse + 12],
    [1, 1.05],
    { extrapolateRight: 'clamp' }
  ) : 1;

// 2. Render SVG text with Cabin Sketch + apply transforms
useEffect(() => {
  if (!roughTextSvgRef.current) return;
  const svg = roughTextSvgRef.current;
  
  // Clear previous
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  
  // Render header text (when visible)
  if (frame >= beats.headerStart && frame < beats.headerExit) {
    const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    textGroup.setAttribute('id', 'header-group');
    textGroup.setAttribute('opacity', String(headerOpacity));
    textGroup.setAttribute('transform', `translate(0, ${headerTranslateY}) scale(${headerScale})`);
    
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('x', '960');
    textElement.setAttribute('y', '540');
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
    textElement.setAttribute('font-size', '72');
    textElement.setAttribute('font-weight', '700');
    textElement.setAttribute('fill', colors.accent);
    textElement.textContent = 'Your Header Text';
    
    textGroup.appendChild(textElement);
    svg.appendChild(textGroup);
  }
}, [frame, beats, texts, headerOpacity, headerTranslateY, headerScale]);
```

#### Why This Works:
- ✅ SVG text with Cabin Sketch = sketchy look
- ✅ Transforms applied as SVG attributes = reliable
- ✅ Frame-based via interpolate() = no timing issues
- ✅ All motion works perfectly

#### CRITICAL Rules:
- ✅ Each text group needs UNIQUE ID
- ✅ Apply opacity and transform as SVG attributes
- ✅ Text rendered conditionally (when visible)
- ✅ Include interpolated values in useEffect deps
- ✅ NO boxes, NO underlines, NO wobble effects

---

## 4. Rough.js Usage (STRICT RULES)

### **✅ USE Rough.js For:**
1. **Hand-drawn maps/illustrations** (with ZERO wobble)
2. **SVG text rendering** (Cabin Sketch font, NO decorations)

### **❌ NEVER Use Rough.js For:**
1. Boxes around text
2. Underlines beneath text
3. Decorative frames
4. Any wobble/roughness effects

### **Zero Wobble Example:**
```javascript
// Maps, illustrations - clean, precise
const island = rc.path(pathData, {
  stroke: colors.accent,
  strokeWidth: 6,
  roughness: 0,  // ZERO
  bowing: 0,     // ZERO
  fill: `${colors.accent}15`,
  fillStyle: 'hachure',
  hachureGap: 8,
});
```

**Rule**: If you're tempted to add `roughness: 1.2` or `bowing: 3`, **STOP**. We don't do that.

---

## 5. Technical Implementation

### **A. Remotion Interpolate Pattern (THE GOLDEN PATTERN)**

This pattern ensures reliable, frame-based animations:

```javascript
// STEP 1: Calculate animation values
const BEAT = 30; // 1 second at 30fps

const beats = {
  entrance: BEAT * 1.0,
  move: BEAT * 2.5,
  pulse: BEAT * 4.0,
  exit: BEAT * 5.5,
};

// Opacity animation
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

// Position animation
const elementY = frame < beats.entrance ? 30 :
  frame < beats.move ? interpolate(
    frame,
    [beats.entrance, beats.entrance + 27],
    [30, 0],
    { extrapolateRight: 'clamp' }
  ) :
  interpolate(
    frame,
    [beats.move, beats.move + 24], // 0.8s move
    [0, -60],
    { extrapolateRight: 'clamp' }
  );

// Scale animation (pulse)
const elementScale = frame < beats.pulse ? 1 :
  frame < beats.pulse + 12 ? interpolate(
    frame,
    [beats.pulse, beats.pulse + 12],
    [1, 1.05],
    { extrapolateRight: 'clamp' }
  ) :
  frame < beats.pulse + 24 ? interpolate(
    frame,
    [beats.pulse + 12, beats.pulse + 24],
    [1.05, 1],
    { extrapolateRight: 'clamp' }
  ) : 1;

// STEP 2: Render with transforms
useEffect(() => {
  if (!svgRef.current) return;
  const svg = svgRef.current;
  
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  
  if (frame >= beats.entrance && frame < beats.exit + 35) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('opacity', String(elementOpacity));
    group.setAttribute('transform', `translate(0, ${elementY}) scale(${elementScale})`);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '960');
    text.setAttribute('y', '540');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', "'Cabin Sketch', cursive");
    text.setAttribute('font-size', '72');
    text.setAttribute('fill', colors.accent);
    text.textContent = 'Your Text';
    
    group.appendChild(text);
    svg.appendChild(group);
  }
}, [frame, beats, elementOpacity, elementY, elementScale]);

// STEP 3: For HTML elements, use inline styles
{frame >= beats.subtitle && (
  <div
    style={{
      opacity: subtitleOpacity,
      transform: `translateY(${subtitleY}px)`,
    }}
  >
    <p>Your subtitle text</p>
  </div>
)}
```

#### Why This Pattern Works:
- ✅ Frame-based calculations = reliable
- ✅ No refs needed = cleaner code
- ✅ Works with conditionally rendered elements
- ✅ Easy to debug (just check frame number)
- ✅ Predictable timing

### **B. Beat Timing with Breathing Room**

```javascript
const BEAT = 30; // 1 second at 30fps

const beats = {
  prelude: 0,
  action1: BEAT * 0.6,           // 0.6s
  action2: BEAT * 2.0,           // 2.0s (0.6 + 0.9 anim + 0.5 gap)
  action3: BEAT * 3.5,           // 3.5s (2.0 + 1.0 anim + 0.5 gap)
  // Always calculate: previous + animation + 0.8-1.5s gap
};
```

**Gap Formula**: `nextBeat = previousBeat + animationDuration + breathingRoom`

### **C. Conditional Rendering**

Only render elements during their active period:

```javascript
// Render only when needed (includes exit animation buffer)
if (frame >= beats.appear && frame < beats.exit + 35) {
  // Render element
}
```

This keeps performance optimal and prevents conflicts.

---

## 6. Color Philosophy

### **Brand Palette:**
- **Background**: Warm cream `#FFF9F0` or clean white `#FAFBFC`
- **Primary accent**: Bold orange `#FF6B35`
- **Secondary accent**: Bold purple `#9B59B6`
- **Success**: Green `#27AE60`
- **Info**: Blue `#2E7FE4`
- **Ink**: `#1A1A1A`

### **Usage:**
- **Hook**: Orange + Purple
- **Explain**: Blue + Green/Purple
- **Apply**: Green + Orange
- **Reflect**: Purple + Blue

---

## 7. Quality Checklist

### **Before Marking Complete:**

#### ✅ Animation Quality
- [ ] Uses Remotion interpolate() for basic animations
- [ ] GSAP only if complexity requires it
- [ ] Opacity/position/scale = interpolate()
- [ ] All transforms applied via SVG attributes or inline styles
- [ ] Breathing room: 0.8-1.5s (24-45 frames) between actions
- [ ] Camera drift subtle (±2px max)

#### ✅ Typography Quality
- [ ] Headers use Cabin Sketch (SVG text)
- [ ] Body uses Permanent Marker (HTML)
- [ ] Supporting uses Inter/DM Sans (HTML)
- [ ] Each SVG text group has unique ID
- [ ] Text renders conditionally (visible period only)
- [ ] Interpolated values included in useEffect deps

#### ✅ Zero Wobble Compliance
- [ ] NO roughness on ANY element
- [ ] NO bowing on ANY element
- [ ] Maps use roughness: 0, bowing: 0
- [ ] Text is ONLY styled via font, not rough effects
- [ ] NO boxes, NO underlines, NO decorations

#### ✅ Conversational Flow
- [ ] Elements enter → serve → exit
- [ ] Stage cleared when done
- [ ] Only relevant content visible
- [ ] Transformations create space

#### ✅ Pedagogy
- [ ] Clear learning goal
- [ ] Appropriate pacing
- [ ] Emphasis on key moments
- [ ] User emotion aligns
- [ ] No cognitive overload

---

## 8. Hook1A Reference (THE GOLD STANDARD)

### **Remotion Interpolate Calculations:**

```javascript
// Question 1: Entrance → Move up → Pulse → Wipe
const q1Opacity = frame < beats.questionPart1 ? 0 :
  frame < beats.wipeQuestions ? interpolate(
    frame,
    [beats.questionPart1, beats.questionPart1 + 27],
    [0, 1],
    { extrapolateRight: 'clamp' }
  ) :
  interpolate(
    frame,
    [beats.wipeQuestions, beats.wipeQuestions + 30],
    [1, 0],
    { extrapolateRight: 'clamp' }
  );

const q1TranslateY = frame < beats.questionPart1 ? 30 :
  frame < beats.moveUp ? interpolate(
    frame,
    [beats.questionPart1, beats.questionPart1 + 27],
    [30, 0],
    { extrapolateRight: 'clamp' }
  ) :
  interpolate(
    frame,
    [beats.moveUp, beats.moveUp + 24],
    [0, -60],
    { extrapolateRight: 'clamp' }
  );

const q1Scale = frame < beats.pulse ? 1 :
  frame < beats.pulse + 12 ? interpolate(
    frame,
    [beats.pulse, beats.pulse + 12],
    [1, 1.05],
    { extrapolateRight: 'clamp' }
  ) :
  frame < beats.pulse + 24 ? interpolate(
    frame,
    [beats.pulse + 12, beats.pulse + 24],
    [1.05, 1],
    { extrapolateRight: 'clamp' }
  ) : 1;
```

### **SVG Rendering with Transforms:**

```javascript
// Apply transforms as SVG attributes
const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
textGroup.setAttribute('opacity', String(q1Opacity));
textGroup.setAttribute('transform', `translate(${q1TranslateX}, ${q1TranslateY}) scale(${q1Scale})`);

const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
textElement.setAttribute('x', '960');
textElement.setAttribute('y', '480');
textElement.setAttribute('text-anchor', 'middle');
textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
textElement.setAttribute('font-size', '76');
textElement.setAttribute('font-weight', '700');
textElement.setAttribute('fill', colors.ink);
textElement.textContent = 'What if geography';

textGroup.appendChild(textElement);
svg.appendChild(textGroup);

// NO boxes, NO underlines, JUST text!
```

### **Timeline:**

```
0.6s  → Question 1 appears (interpolate opacity + y)
2.0s  → Question 1 moves up (interpolate y)
2.8s  → Question 2 appears (interpolate opacity + y + scale)
4.2s  → Both pulse (interpolate scale)
5.5s  → Both wipe left (interpolate x + opacity)
6.5s  → Map reveals (interpolate opacity + scale)
9.0s  → Map transforms (interpolate x + y + scale)
10.0s → Welcome appears (interpolate opacity + y + scale)
12.0s → Subtitle (Permanent Marker, interpolate opacity + y)
13.5s → Breathe (Math.sin for continuous scale)
```

---

## 9. Pedagogy by Template Type

### **Hook (1A-1E):**
- **Goal**: Curiosity, "ooo what is this?"
- **Motion**: Fast start → dramatic reveal → intrigue
- **Headers**: Bold Cabin Sketch
- **Flow**: Clear stage between acts

### **Explain (2A-2E):**
- **Goal**: Clarity, "aha, I get it!"
- **Motion**: Methodical reveals → connections emphasized
- **Headers**: Clear Cabin Sketch
- **Emphasis**: Pulsing relationships

### **Apply (3A-3E):**
- **Goal**: Confidence, "I can do this!"
- **Motion**: Quick feedback → celebration
- **Headers**: Action-oriented Cabin Sketch
- **Energy**: Burst animations

### **Reflect (4A-4E):**
- **Goal**: Affirmation, "I learned this!"
- **Motion**: Affirming pulses → forward progression
- **Headers**: Celebratory Cabin Sketch
- **Transition**: Stepping stones to next

---

## 10. Anti-Patterns (MUST AVOID)

### **❌ The GSAP Trap**
**Problem**: Using GSAP for simple fade/move animations
**Fix**: Use Remotion interpolate(). Reserve GSAP for complex sequences.

### **❌ The Wobble Trap**
**Problem**: Adding roughness/bowing for "hand-drawn" feel
**Fix**: ZERO wobble on everything. Cabin Sketch font provides sketchy look.

### **❌ The Decoration Trap**
**Problem**: Adding boxes, underlines, circles around text
**Fix**: NO decorations. Let typography and motion do the work.

### **❌ The Rushed Transition**
**Problem**: Next element appears before previous motion completes
**Fix**: Add 0.8-1.5s (24-45 frames) breathing room between beats

### **❌ The Missing Deps**
**Problem**: Forgetting to include interpolated values in useEffect deps
**Fix**: Always include calculated values (opacity, translateY, scale) in deps array

### **❌ The Cluttered Stage**
**Problem**: Everything visible at once
**Fix**: Conditional rendering (only show during active period + exit buffer)

---

## 11. Migration Guide for Other Templates

### **Step 1: Setup SVG Layer**
```javascript
const roughTextSvgRef = useRef(null);

// In JSX:
<svg
  ref={roughTextSvgRef}
  style={{
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  }}
  viewBox="0 0 1920 1080"
/>
```

### **Step 2: Calculate Interpolations**
```javascript
const headerOpacity = frame < beats.headerStart ? 0 :
  interpolate(
    frame,
    [beats.headerStart, beats.headerStart + 27],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

const headerY = frame < beats.headerStart ? 30 :
  interpolate(
    frame,
    [beats.headerStart, beats.headerStart + 27],
    [30, 0],
    { extrapolateRight: 'clamp' }
  );
```

### **Step 3: Render SVG Text with Transforms**
```javascript
useEffect(() => {
  if (!roughTextSvgRef.current) return;
  const svg = roughTextSvgRef.current;
  
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  
  // Render header with transforms
  if (frame >= beats.headerStart && frame < beats.headerExit) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('opacity', String(headerOpacity));
    group.setAttribute('transform', `translate(0, ${headerY})`);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('font-family', "'Cabin Sketch', cursive");
    text.setAttribute('font-size', '72');
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', colors.accent);
    text.textContent = headerText;
    
    group.appendChild(text);
    svg.appendChild(group);
  }
}, [frame, beats, texts, headerOpacity, headerY]); // Include interpolated values!
```

### **Step 4: Update Fonts**
```javascript
const fonts = {
  header: "'Cabin Sketch', cursive",
  secondary: "'Permanent Marker', cursive",
  body: "'Inter', sans-serif",
};
```

---

## 12. Conclusion

**The V9 Pattern:**
- ✅ Remotion interpolate() for basic animations
- ✅ GSAP ONLY for complex choreography
- ✅ Cabin Sketch SVG text (sketchy font style)
- ✅ Transforms as SVG attributes
- ✅ ZERO wobble on everything
- ✅ NO boxes, NO underlines, NO decorations
- ✅ Conversational flow with breathing room
- ✅ Perfect pacing (24-45 frame gaps)

**This is production-ready and validated.**

Apply this exact pattern to all templates.

---

## Quick Reference Card

```
ANIMATION STRATEGY:
  ✅ Remotion interpolate() for: opacity, position, scale
  ✅ GSAP only for: complex staggers, morphs, paths
  ❌ NO GSAP for basic animations

HEADERS:
  ✅ SVG text with Cabin Sketch font
  ✅ Transforms as SVG attributes (opacity, transform)
  ✅ Include interpolated values in useEffect deps
  ❌ NO boxes, NO underlines
  ❌ ZERO wobble (roughness: 0, bowing: 0)

BODY:
  ✅ Permanent Marker (HTML)
  ✅ Inline styles with interpolated values

MOTION:
  ✅ 0.8-1.5s (24-45 frames) breathing room
  ✅ extrapolateRight: 'clamp' on all interpolate
  ✅ Conditional rendering with exit buffer

ROUGH.JS USAGE:
  ✅ ONLY for maps/illustrations (zero wobble)
  ✅ ONLY for SVG text rendering (Cabin Sketch)
  ❌ NEVER for boxes, underlines, decorations
  ❌ NEVER add wobble/roughness
```

---

## Validation Questions

Before marking template complete, ask:

1. **Are you using Remotion interpolate() for basic animations?** ✅
2. **Are interpolated values included in useEffect deps?** ✅
3. **Is there ZERO wobble on everything?** ✅
4. **Are there NO boxes or underlines?** ✅
5. **Is there 0.8-1.5s breathing room between beats?** ✅
6. **Does flow feel conversational (enter → serve → exit)?** ✅

If all YES → Production ready! 🎯

---

**V9 is the validated gold standard. Every template must follow this pattern.** 🏆
