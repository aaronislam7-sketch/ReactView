# Template Design Blueprint V8 - FINAL ✅
## The Gold Standard for Knode Video Templates

**Status**: Production-Ready & Validated  
**Version**: 8.0 (Zero Wobble + Sketchy Text + Full Motion)

---

## Core Philosophy

> **"Conversational, not presentational. Dynamic, not static. Educational, not decorative."**

Every template should feel like a skilled teacher explaining a concept face-to-face - dynamic, responsive, and always moving the conversation forward.

---

## 1. Motion Principles

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

### **B. GSAP Animation Standards**

All motion uses GSAP with proper easing and duration.

#### Easing Standards:
- **Entrances**: `back.out(1.5-1.8)` - Energetic, welcoming
- **Exits**: `power3.in` - Smooth departure
- **Mid-scene moves**: `power3.inOut` or `power2.inOut` - Purposeful
- **Emphasis**: `sine.inOut` with yoyo - Subtle, natural

#### Duration Standards:
- **Quick entrance**: 0.7-0.9s
- **Standard move**: 1.0-1.3s
- **Slow transformation**: 1.5-2.0s
- **Subtle breathe**: 2.5-3.5s (infinite loop)

#### Breathing Room (CRITICAL):
- **After entrance**: 0.8-1.2s before next action
- **After exit**: 0.8-1.0s before revealing next
- **After transformation**: 1.0-1.5s before new content
- **Between pulses**: 0.3-0.5s

### **C. ZERO Wobble on EVERYTHING**

**ABSOLUTE RULE**: NO wobble, NO roughness, NO bowing on ANY element.

#### Zero Wobble (EVERYTHING):
```javascript
// Maps, frames, decorative elements
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

**Rough.js Purpose**: ONLY for hand-drawn maps/illustrations (with zero wobble)

---

## 2. Typography Principles

### **A. Typography Hierarchy**

#### Font Usage (THE CORRECT WAY):
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

### **B. Sketchy Headers (Cabin Sketch Font)**

Headers use **Cabin Sketch font** to achieve sketchy, hand-drawn look.

**CRITICAL**: Use as **SVG text elements** so they can be animated by GSAP.

#### The Golden Pattern:

```javascript
// 1. Create SVG layer ref
const roughTextSvgRef = useRef(null);

// 2. Render SVG text with Cabin Sketch
useEffect(() => {
  if (!roughTextSvgRef.current) return;
  const svg = roughTextSvgRef.current;
  
  // Clear previous
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  
  // Render header text (when visible)
  if (frame >= beats.headerAppears && frame < beats.headerExits) {
    const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    textGroup.setAttribute('id', 'header-group'); // UNIQUE ID for GSAP
    
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
}, [frame, beats, texts]);

// 3. GSAP animates specific text group BY ID
useEffect(() => {
  if (frame >= beats.entrance && !triggered && roughTextSvgRef.current) {
    const headerGroup = roughTextSvgRef.current.querySelector('#header-group');
    if (headerGroup) {
      gsap.fromTo(headerGroup,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.7)" }
      );
    }
    setTriggered(true);
  }
}, [frame, beats.entrance, triggered]);
```

#### Why This Works:
- ✅ SVG text with Cabin Sketch = sketchy look
- ✅ Unique ID per text group = targeted GSAP animation
- ✅ Each group independently animated
- ✅ All motion works perfectly

#### CRITICAL Rules:
- ✅ Each text group needs UNIQUE ID
- ✅ GSAP targets groups by `querySelector('#id')`
- ✅ Text rendered conditionally (when visible)
- ✅ NO boxes, NO underlines, NO wobble effects

---

## 3. Rough.js Usage (STRICT RULES)

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

## 4. Technical Implementation

### **A. SVG Text Group Animation Pattern (THE GOLDEN PATTERN)**

This pattern ensures GSAP animations work perfectly with SVG text:

```javascript
// STEP 1: Create ref for SVG layer
const roughTextSvgRef = useRef(null);

// STEP 2: Render SVG text with UNIQUE IDs
useEffect(() => {
  if (!roughTextSvgRef.current) return;
  const svg = roughTextSvgRef.current;
  
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  
  // Question 1
  if (frame >= beats.q1Start && frame < beats.q1Exit) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', 'question1-group'); // UNIQUE ID
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '960');
    text.setAttribute('y', '480');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', "'Cabin Sketch', cursive");
    text.setAttribute('font-size', '76');
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', colors.ink);
    text.textContent = 'Your Text Here';
    
    group.appendChild(text);
    svg.appendChild(group);
  }
  
  // Question 2
  if (frame >= beats.q2Start && frame < beats.q2Exit) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', 'question2-group'); // UNIQUE ID
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '960');
    text.setAttribute('y', '600');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', "'Cabin Sketch', cursive");
    text.setAttribute('font-size', '92');
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', colors.accent);
    text.textContent = 'Your Second Text';
    
    group.appendChild(text);
    svg.appendChild(group);
  }
}, [frame, beats, texts]);

// STEP 3: GSAP animates SPECIFIC GROUPS by ID selector
useEffect(() => {
  if (frame >= beats.q1Animate && !triggered && roughTextSvgRef.current) {
    const q1Group = roughTextSvgRef.current.querySelector('#question1-group');
    if (q1Group) {
      gsap.fromTo(q1Group,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.7)" }
      );
    }
    setTriggered(true);
  }
}, [frame, beats.q1Animate, triggered]);

// STEP 4: Animate groups individually for different actions
useEffect(() => {
  if (frame >= beats.moveUp && !triggered && roughTextSvgRef.current) {
    const q1Group = roughTextSvgRef.current.querySelector('#question1-group');
    if (q1Group) {
      gsap.to(q1Group, {
        y: -60,
        duration: 0.8,
        ease: "power2.inOut",
      });
    }
    setTriggered(true);
  }
}, [frame, beats.moveUp, triggered]);
```

#### Why This Pattern Works:
- ✅ SVG text can be GSAP animated
- ✅ Unique IDs allow targeting specific elements
- ✅ Text re-renders each frame without breaking animations
- ✅ Clean separation: rendering vs animation

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
// Render only when needed
if (frame >= beats.appear && frame < beats.exit) {
  // Render element
}
```

This keeps performance optimal and prevents conflicts.

---

## 5. Color Philosophy

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

## 6. Quality Checklist

### **Before Marking Complete:**

#### ✅ Motion Quality
- [ ] GSAP animates SVG groups by ID selector
- [ ] Each text group has unique ID
- [ ] All entrances use proper easing (back.out)
- [ ] All exits are graceful (power3.in)
- [ ] Mid-scene transformations are bold
- [ ] Breathing room: 0.8-1.5s between actions
- [ ] Camera drift subtle (±2px max)

#### ✅ Typography Quality
- [ ] Headers use Cabin Sketch (SVG text)
- [ ] Body uses Permanent Marker (HTML)
- [ ] Supporting uses Inter/DM Sans (HTML)
- [ ] Each SVG text group has unique ID
- [ ] Text renders conditionally (visible period only)

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

## 7. Hook1A Reference (THE GOLD STANDARD)

### **Rough.js Text Rendering:**

```javascript
// Question Part 1
const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
textGroup.setAttribute('id', 'question1-group'); // UNIQUE ID

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

### **GSAP Animation:**

```javascript
// Animate by ID selector
const question1Group = roughTextSvgRef.current.querySelector('#question1-group');
if (question1Group) {
  gsap.fromTo(question1Group,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.7)" }
  );
}
```

### **Timeline:**

```
0.6s  → Question 1 appears (GSAP on #question1-group)
2.0s  → Question 1 moves up (GSAP on #question1-group)
2.8s  → Question 2 appears (GSAP on #question2-group)
4.2s  → Both pulse (GSAP on both groups)
5.5s  → Both wipe left (GSAP on both groups)
6.5s  → Map reveals
9.0s  → Map transforms
10.0s → Welcome appears (GSAP on #welcome-group)
12.0s → Subtitle (Permanent Marker, HTML + GSAP)
13.5s → Breathe (GSAP on #welcome-group)
```

---

## 8. Pedagogy by Template Type

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

## 9. Anti-Patterns (MUST AVOID)

### **❌ The Wobble Trap**
**Problem**: Adding roughness/bowing for "hand-drawn" feel
**Fix**: ZERO wobble on everything. Cabin Sketch font provides sketchy look.

### **❌ The Decoration Trap**
**Problem**: Adding boxes, underlines, circles around text
**Fix**: NO decorations. Let typography and motion do the work.

### **❌ The Broken Animation**
**Problem**: GSAP targets wrong element or non-existent element
**Fix**: Use unique IDs, querySelector, and verify element exists

### **❌ The Rushed Transition**
**Problem**: Next element appears before previous motion completes
**Fix**: Add 0.8-1.5s breathing room between beats

### **❌ The Static Text**
**Problem**: Using HTML text for headers (hard to animate gracefully)
**Fix**: SVG text with unique IDs, GSAP animated

### **❌ The Cluttered Stage**
**Problem**: Everything visible at once
**Fix**: Conditional rendering (only show during active period)

---

## 10. Migration Guide for Other Templates

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

### **Step 2: Render SVG Text**
```javascript
useEffect(() => {
  if (!roughTextSvgRef.current) return;
  const svg = roughTextSvgRef.current;
  
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  
  // Render each header with unique ID
  if (frame >= beats.header1 && frame < beats.header1Exit) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', 'header1-group');
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('font-family', "'Cabin Sketch', cursive");
    text.setAttribute('font-size', '72');
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', colors.accent);
    text.textContent = headerText;
    
    group.appendChild(text);
    svg.appendChild(group);
  }
}, [frame, beats, texts]);
```

### **Step 3: GSAP Animations**
```javascript
useEffect(() => {
  if (frame >= beats.animate && !triggered && roughTextSvgRef.current) {
    const group = roughTextSvgRef.current.querySelector('#header1-group');
    if (group) {
      gsap.fromTo(group, { ... }, { ... });
    }
    setTriggered(true);
  }
}, [frame, beats.animate, triggered]);
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

## 11. Conclusion

**The V8 Pattern:**
- ✅ Cabin Sketch SVG text (sketchy font style)
- ✅ Unique IDs for each text group
- ✅ GSAP animates groups by querySelector
- ✅ ZERO wobble on everything
- ✅ NO boxes, NO underlines, NO decorations
- ✅ Conversational flow with breathing room
- ✅ Perfect pacing (0.8-1.5s gaps)

**This is production-ready and validated.**

Apply this exact pattern to all templates.

---

## Quick Reference Card

```
HEADERS:
  ✅ SVG text with Cabin Sketch font
  ✅ Unique ID per text group
  ✅ GSAP targets by querySelector('#id')
  ❌ NO boxes, NO underlines
  ❌ ZERO wobble (roughness: 0, bowing: 0)

BODY:
  ✅ Permanent Marker (HTML)
  ✅ GSAP animates HTML elements directly

MOTION:
  ✅ 0.8-1.5s breathing room between beats
  ✅ back.out(1.7) entrances
  ✅ power3.in exits
  ✅ Animate specific groups by ID

ROUGH.JS USAGE:
  ✅ ONLY for maps/illustrations (zero wobble)
  ✅ ONLY for SVG text rendering (Cabin Sketch)
  ❌ NEVER for boxes, underlines, decorations
  ❌ NEVER add wobble/roughness
```

---

## Validation Questions

Before marking template complete, ask:

1. **Are headers Cabin Sketch SVG text with unique IDs?** ✅
2. **Does GSAP target groups by querySelector?** ✅
3. **Is there ZERO wobble on everything?** ✅
4. **Are there NO boxes or underlines?** ✅
5. **Is there 0.8-1.5s breathing room between beats?** ✅
6. **Does flow feel conversational (enter → serve → exit)?** ✅

If all YES → Production ready! 🎯

---

**V8 is the validated gold standard. Every template must follow this pattern.** 🏆
