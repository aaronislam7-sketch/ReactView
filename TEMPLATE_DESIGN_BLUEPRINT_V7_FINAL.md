# Template Design Blueprint V7 - FINAL
## The Gold Standard for Knode Video Templates

**Status**: Production-Ready ✅  
**Version**: 7.0 (Rough.js Sketch Style + Full Motion)

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

### **B. GSAP Animation Standards**

All motion uses GSAP with proper easing and duration.

#### Easing Standards:
- **Entrances**: `back.out(1.5-1.8)` - Energetic, welcoming
- **Exits**: `power3.in` - Smooth departure
- **Mid-scene moves**: `power3.inOut` - Purposeful repositioning
- **Emphasis**: `sine.inOut` with yoyo - Subtle, natural

#### Duration Standards:
- **Quick entrance**: 0.7-0.9s
- **Standard move**: 1.0-1.3s
- **Slow transformation**: 1.5-2.0s
- **Subtle breathe**: 2.5-3.5s (infinite loop)

#### Breathing Room:
- **After entrance**: 0.8-1.2s
- **After exit**: 0.8-1.0s
- **After transformation**: 1.0-1.5s
- **Between pulses**: 0.3-0.5s

### **C. Zero Wobble + Strategic Rough**

Balance precision with personality.

#### Zero Wobble (Structure):
```javascript
// For maps, frames, structural elements
{
  roughness: 0,
  bowing: 0,
  strokeWidth: 4-6,
}
```

#### Strategic Rough (Text Effects):
```javascript
// For text boxes, underlines, emphasis
{
  roughness: 1.8-2.2,
  bowing: 3-6,
  strokeWidth: 4-7,
}
```

**Rule**: Structure is precise. Text effects are rough.

---

## 2. Typography & Rough.js Principles

### **A. Typography Hierarchy**

#### Font Usage:
- **Headers**: Cabin Sketch via rough.js SVG (sketchy, hand-drawn)
- **Body/Secondary**: Permanent Marker (personality, energy)
- **Supporting**: Inter/DM Sans (clarity, readability)

#### Size Hierarchy:
- **Hero text**: 72-92px
- **Section headers**: 48-64px
- **Body text**: 24-32px
- **Supporting text**: 18-24px

### **B. Rough.js Sketch Style Headers (THE KEY)**

Headers are rendered as **rough.js SVG text** with sketchy effects.

**CRITICAL PATTERN**: GSAP animates the ENTIRE SVG LAYER (not individual text elements).

#### Implementation Pattern:

```javascript
// 1. REF for SVG layer
const roughTextSvgRef = useRef(null);

// 2. GSAP animates the ENTIRE SVG LAYER
useEffect(() => {
  if (frame >= beats.entrance && !triggered && roughTextSvgRef.current) {
    gsap.fromTo(roughTextSvgRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.7)" }
    );
    setTriggered(true);
  }
}, [frame, beats.entrance, triggered]);

// 3. ROUGH.JS renders text inside SVG
useEffect(() => {
  if (!roughTextSvgRef.current) return;
  const svg = roughTextSvgRef.current;
  const rc = rough.svg(svg);
  
  // Clear previous
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  
  // Render text with Cabin Sketch
  const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textElement.setAttribute('x', '960');
  textElement.setAttribute('y', '540');
  textElement.setAttribute('text-anchor', 'middle');
  textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
  textElement.setAttribute('font-size', '72');
  textElement.setAttribute('font-weight', '700');
  textElement.setAttribute('fill', color);
  textElement.setAttribute('stroke', color);
  textElement.setAttribute('stroke-width', '0.8');
  textElement.setAttribute('paint-order', 'stroke fill');
  textElement.textContent = 'Your Header Text';
  
  svg.appendChild(textElement);
  
  // Add rough sketch effects (box, underline, etc.)
  const textWidth = text.length * 42;
  const roughBox = rc.rectangle(x, y, textWidth, height, {
    stroke: color,
    strokeWidth: 4,
    roughness: 2.2,
    bowing: 5,
    fill: `${color}08`,
    fillStyle: 'hachure',
    hachureGap: 15,
  });
  
  svg.appendChild(roughBox);
}, [frame, texts]);
```

#### Why This Works:
- ✅ Rough.js creates TRUE sketchy text style
- ✅ GSAP animates the ENTIRE SVG layer
- ✅ All motion works (entrance, move, pulse, wipe, exit)
- ✅ No individual element animation conflicts

#### Rough Sketch Effects:
1. **Boxes**: Frame text with rough edges
2. **Underlines**: Sketchy emphasis lines
3. **Hachure fills**: Hand-drawn texture
4. **Rough strokes**: Uneven, natural edges

### **C. When to Use Each Font**

#### Cabin Sketch (via Rough.js SVG):
- ✅ Main headers
- ✅ Section titles
- ✅ Key hook phrases
- ✅ Anything needing visual weight

#### Permanent Marker (HTML):
- ✅ Body text
- ✅ Subtitles
- ✅ Supporting information
- ✅ Secondary emphasis

#### Inter/DM Sans (HTML):
- ✅ Long descriptions
- ✅ Data/numbers
- ✅ Fine print
- ✅ Where readability paramount

---

## 3. Color Philosophy

### **Brand Palette:**
- **Background**: Warm cream `#FFF9F0` or clean white `#FAFBFC`
- **Primary accent**: Bold orange `#FF6B35` (energy, hooks)
- **Secondary accent**: Bold purple `#9B59B6` (depth, reflection)
- **Success**: Green `#27AE60` (correct, apply)
- **Info**: Blue `#2E7FE4` (explain, connection)
- **Ink**: `#1A1A1A` (text)

### **Usage Rules:**
- **Hook templates**: Orange + Purple
- **Explain templates**: Blue + Green/Purple
- **Apply templates**: Green + Orange
- **Reflect templates**: Purple + Blue

---

## 4. Technical Implementation

### **A. SVG Layer Animation Pattern**

```javascript
// THE GOLDEN PATTERN for rough.js headers

// State for tracking
const [triggered, setTriggered] = useState(false);
const roughTextSvgRef = useRef(null);

// GSAP animates ENTIRE SVG LAYER
useEffect(() => {
  if (frame >= beats.action && !triggered && roughTextSvgRef.current) {
    gsap.fromTo(roughTextSvgRef.current,
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.7)" }
    );
    setTriggered(true);
  }
}, [frame, beats.action, triggered]);

// For mid-scene moves (move up, wipe, etc.)
useEffect(() => {
  if (frame >= beats.move && !triggered && roughTextSvgRef.current) {
    gsap.to(roughTextSvgRef.current, {
      y: -60, // or x: -1200 for wipe
      duration: 0.8,
      ease: "power2.inOut",
    });
    setTriggered(true);
  }
}, [frame, beats.move, triggered]);

// For resets (after wipe, before new content)
useEffect(() => {
  if (frame >= beats.reset && !triggered && roughTextSvgRef.current) {
    gsap.set(roughTextSvgRef.current, { x: 0, y: 0, scale: 1 });
    // Then animate new content in
    gsap.fromTo(roughTextSvgRef.current, ...);
  }
}, [frame, beats.reset, triggered]);
```

### **B. Rough.js Text Rendering**

```javascript
useEffect(() => {
  if (!roughTextSvgRef.current) return;
  
  const svg = roughTextSvgRef.current;
  const rc = rough.svg(svg);
  
  // Clear previous
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  
  // Render text when it should be visible
  if (frame >= beats.textAppears && frame < beats.textExits) {
    const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // 1. Create text element
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '960');
    text.setAttribute('y', '540');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', "'Cabin Sketch', cursive");
    text.setAttribute('font-size', '72');
    text.setAttribute('font-weight', '700');
    text.setAttribute('fill', colors.accent);
    text.setAttribute('stroke', colors.accent);
    text.setAttribute('stroke-width', '0.8');
    text.setAttribute('paint-order', 'stroke fill');
    text.textContent = headerText;
    textGroup.appendChild(text);
    
    // 2. Add rough effects (box, underline, etc.)
    const width = headerText.length * 42;
    const box = rc.rectangle(960 - width/2 - 30, 490, width + 60, 100, {
      stroke: colors.accent,
      strokeWidth: 4,
      roughness: 2.2,
      bowing: 5,
      fill: `${colors.accent}08`,
      fillStyle: 'hachure',
      hachureGap: 15,
    });
    textGroup.appendChild(box);
    
    svg.appendChild(textGroup);
  }
}, [frame, beats, texts, colors]);
```

### **C. Beat Timing with Breathing Room**

```javascript
const BEAT = 30; // 1 second at 30fps
const beats = {
  prelude: 0,
  action1: BEAT * 0.6,
  action2: BEAT * 2.0,  // 0.6 + 0.9 animation + 0.5 breathing
  action3: BEAT * 3.5,  // 2.0 + 1.0 animation + 0.5 breathing
  // Ensure 0.8-1.5s gaps
};
```

---

## 5. Quality Checklist

### **Before Marking Complete:**

#### ✅ Motion Quality
- [ ] GSAP animates SVG layer (not individual elements)
- [ ] All entrances use proper easing
- [ ] All exits are graceful
- [ ] Mid-scene transformations are bold
- [ ] Breathing room: 0.8-1.5s between actions
- [ ] Camera drift subtle (±2px max)

#### ✅ Visual Quality
- [ ] Headers as rough.js SVG text (Cabin Sketch + effects)
- [ ] Body uses Permanent Marker
- [ ] Supporting uses Inter/DM Sans
- [ ] Rough effects on headers (boxes, underlines)
- [ ] Zero wobble on structure
- [ ] Colors follow brand palette

#### ✅ Conversational Flow
- [ ] Elements enter → serve → exit
- [ ] Stage cleared when done
- [ ] Only relevant content visible
- [ ] Transformations create space
- [ ] Natural, not mechanical

#### ✅ Pedagogy
- [ ] Clear learning goal
- [ ] Appropriate pacing
- [ ] Emphasis on key moments
- [ ] User emotion aligns
- [ ] No cognitive overload

#### ✅ Technical
- [ ] SVG layer ref exists
- [ ] GSAP targets SVG layer
- [ ] Rough.js renders conditionally
- [ ] Beat timing has gaps
- [ ] No console errors

---

## 6. Hook1A Reference Example

### **The Golden Standard**

Hook1A V7 demonstrates all principles perfectly:

#### **Rough.js Headers:**
- "What if geography" - SVG text + rough box
- "was measured in mindsets?" - SVG text + rough underline
- "Welcome to Knodovia" - SVG text + rough box

#### **GSAP Animations on SVG Layer:**
- Entrance (opacity + y)
- Move up (y: -60)
- Pulse (scale: 1.05)
- Wipe exit (x: -1200, opacity: 0)
- Reset (x: 0, y: 0)
- Welcome entrance (opacity + y + scale)
- Breathe (scale: 1.02, infinite)

#### **Conversational Flow:**
```
0.6s  → Question 1 appears (SVG layer)
2.0s  → SVG layer moves up
2.8s  → Question 2 appears (in SVG)
4.2s  → SVG layer pulses
5.5s  → SVG layer wipes left
6.5s  → Map reveals
9.0s  → Map transforms
10.0s → SVG layer resets, Welcome appears
12.0s → Subtitle (Permanent Marker)
13.5s → SVG breathe
```

---

## 7. Migration Guide

### **Converting Existing Templates:**

#### **Step 1: Setup SVG Layer**
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

#### **Step 2: GSAP Animations**
Replace HTML element animations with SVG layer animations:

**Before:**
```javascript
gsap.fromTo(headerRef.current, ...);
```

**After:**
```javascript
gsap.fromTo(roughTextSvgRef.current, ...);
```

#### **Step 3: Rough.js Rendering**
Add rough.js text rendering in useEffect:

```javascript
useEffect(() => {
  if (!roughTextSvgRef.current) return;
  const svg = roughTextSvgRef.current;
  const rc = rough.svg(svg);
  
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  
  // Render headers with rough effects
  // See Section 4B for full pattern
}, [frame, beats, texts]);
```

#### **Step 4: Update Fonts Object**
```javascript
const fonts = {
  header: "'Cabin Sketch', cursive",      // For rough.js
  secondary: "'Permanent Marker', cursive", // For body
  body: "'Inter', sans-serif",            // For supporting
};
```

---

## 8. Anti-Patterns

### **❌ DON'T animate individual SVG text elements**
- Breaks when text re-renders
- Conflicts with rough.js updates

### **✅ DO animate the entire SVG layer**
- Smooth, reliable motion
- Works with rough.js rendering

### **❌ DON'T use HTML text for headers**
- Lacks sketchy, hand-drawn feel
- Doesn't match brand aesthetic

### **✅ DO use rough.js SVG text**
- True sketchy style
- Brand-aligned aesthetic

### **❌ DON'T skip breathing room**
- Feels rushed, mechanical
- Motion doesn't complete

### **✅ DO add 0.8-1.5s gaps**
- Natural, conversational pacing
- Motion completes fully

---

## 9. Pedagogy by Template Type

### **Hook (1A-1E):**
- **Goal**: Curiosity, "ooo what is this?"
- **Motion**: Fast-paced start → dramatic reveal
- **Headers**: Bold, rough.js sketch style
- **Exit**: Clear stage for next act

### **Explain (2A-2E):**
- **Goal**: Clarity, "aha, I get it!"
- **Motion**: Methodical reveals → pulsing connections
- **Headers**: Clear, structured rough.js
- **Emphasis**: Animated relationships

### **Apply (3A-3E):**
- **Goal**: Confidence, "I can do this!"
- **Motion**: Quick, energetic feedback
- **Headers**: Action-oriented rough.js
- **Celebration**: Burst animations

### **Reflect (4A-4E):**
- **Goal**: Affirmation, "I learned this!"
- **Motion**: Affirming pulses → forward progression
- **Headers**: Celebratory rough.js
- **Transition**: Stepping stones to next

---

## 10. Conclusion

**The V7 Pattern** combines:
- ✅ True rough.js sketch style (brand aesthetic)
- ✅ Full GSAP motion (SVG layer animation)
- ✅ Conversational flow (enter → serve → exit)
- ✅ Perfect pacing (breathing room)
- ✅ Zero wobble structure + rough text

**This is production-ready and validated.** 

Apply this pattern to all templates going forward.

---

## Quick Reference Card

```
HEADERS:
  - Rough.js SVG text (Cabin Sketch + effects)
  - GSAP animates ENTIRE SVG layer
  - Boxes, underlines, rough strokes

BODY:
  - Permanent Marker (HTML)
  - GSAP animates HTML elements

MOTION:
  - 0.8-1.5s breathing room
  - back.out(1.7) entrances
  - power3.in exits
  - SVG layer for all header motion

STRUCTURE:
  - Zero wobble (maps, frames)
  - Rough text (headers)
  - Conversational flow
```

🎯 **V7 is the gold standard. Validate every template against this blueprint.**
