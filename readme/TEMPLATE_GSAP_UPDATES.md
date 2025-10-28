# Template GSAP Updates - Implementation Guide

## Overview
Updating all 6 remaining templates with GSAP animations and rough.js font styles.

---

## Templates to Update

### ✅ COMPLETED
1. **Hook1AQuestionBurst** - Full GSAP with mid-scene transitions
2. **Hook1EAmbientMystery** - Scramble text, glow pulse, mid-scene move

### ⏳ IN PROGRESS
3. **Explain2AConceptBreakdown** - Staggered bullets, mid-scene repositioning
4. **Explain2BAnalogy** - Shape morphing, breathe effects
5. **Apply3AMicroQuiz** - Flip reveals, pulse emphasis
6. **Apply3BScenarioChoice** - Content swaps, graceful moves
7. **Reflect4AKeyTakeaways** - Cascade reveals, highlights
8. **Reflect4DForwardLink** - Shrink to corner, expand to center

---

## Standard Updates for Each Template

### 1. **Imports**
```javascript
import gsap from 'gsap';
import {
  // Choose based on template needs
  staggeredBullets,
  cascadeReveal,
  gracefulMove,
  pulseEmphasis,
  drawUnderline,
  flipReveal,
  // etc...
} from '../utils/gsapAnimations';
```

### 2. **Refs & State**
```javascript
const elementRef = useRef(null);
const [triggeredAnimations, setTriggeredAnimations] = useState({
  anim1: false,
  anim2: false,
  // etc...
});
```

### 3. **Font Styles** (Rough.js everywhere)
```javascript
const fonts = scene.style_tokens?.fonts || {
  primary: "'Cabin Sketch', cursive",
  secondary: "'Patrick Hand', cursive",
  size_title: 72,
  size_body: 36,
};

// Then in JSX:
style={{ fontFamily: fonts.primary, fontSize: fonts.size_title }}
```

### 4. **GSAP Animation Triggers**
```javascript
useEffect(() => {
  if (frame >= beats.animStart && !triggeredAnimations.anim && ref.current) {
    // Call GSAP animation
    cascadeReveal([ref.current], { duration: 0.6, stagger: 0.15 });
    setTriggeredAnimations(prev => ({ ...prev, anim: true }));
  }
}, [frame, beats.animStart, triggeredAnimations.anim]);
```

### 5. **Zero Wobble** (rough.js)
```javascript
// All rough.js calls:
roughness: 0,
bowing: 0,
```

### 6. **At Least 1 Mid-Scene Transition**
```javascript
// Example: Move title to corner
useEffect(() => {
  if (frame >= beats.midScene && !triggeredAnimations.move && titleRef.current) {
    gracefulMove(titleRef.current, {
      y: -200,
      scale: 0.6,
      duration: 1.2,
      ease: "power3.inOut",
    });
    setTriggeredAnimations(prev => ({ ...prev, move: true }));
  }
}, [frame, beats.midScene, triggeredAnimations.move]);
```

---

## Template-Specific Animations

### Explain2A - Concept Breakdown
**Key Animations:**
- Staggered bullet reveals for concept parts
- Mid-scene: Title moves to top, parts expand
- Pulse emphasis on connections

**GSAP Functions:**
```javascript
import { staggeredBullets, gracefulMove, pulseEmphasis } from '../utils/gsapAnimations';

// Stagger parts
staggeredBullets(partsRefs, { stagger: 0.2, direction: "up" });

// Move title mid-scene
gracefulMove(titleRef.current, { y: -180, scale: 0.7 });

// Pulse connections
pulseEmphasis(connectionRef.current, { scale: 1.05, repeat: 1 });
```

---

### Explain2B - Analogy
**Key Animations:**
- Shape morphing for analogy visualization
- Breathe effect on shapes
- Mid-scene: Analogy sides swap positions

**GSAP Functions:**
```javascript
import { morphShape, breatheShape, gracefulMove } from '../utils/gsapAnimations';

// Morph shape
morphShape(shapeRef.current, { scale: 1.3, rotation: 45, duration: 1.2 });

// Breathe
breatheShape(conceptRef.current, { scaleAmount: 1.08, duration: 2.5 });

// Mid-scene swap
gracefulMove(leftSideRef.current, { x: 400, duration: 1.0 });
gracefulMove(rightSideRef.current, { x: -400, duration: 1.0 });
```

---

### Apply3A - Micro Quiz
**Key Animations:**
- Options cascade in
- Flip reveal for answer
- Pulse on correct answer

**GSAP Functions:**
```javascript
import { cascadeReveal, flipReveal, pulseEmphasis } from '../utils/gsapAnimations';

// Options appear
cascadeReveal([optionA, optionB, optionC], { stagger: 0.15 });

// Answer flip
flipReveal(answerCardRef.current, { rotationY: 180, duration: 0.6 });

// Correct answer pulse
pulseEmphasis(correctRef.current, { scale: 1.12, repeat: 2 });
```

---

### Apply3B - Scenario Choice
**Key Animations:**
- Scenarios stagger in
- Content swap on selection
- Mid-scene: Chosen scenario expands

**GSAP Functions:**
```javascript
import { staggeredBullets, scaleSwap, gracefulMove } from '../utils/gsapAnimations';

// Scenarios appear
staggeredBullets([scenario1, scenario2], { stagger: 0.25, direction: "left" });

// Swap to chosen
scaleSwap(allScenariosRef.current, chosenRef.current, { duration: 0.8 });

// Expand chosen
gracefulMove(chosenRef.current, { scale: 1.3, duration: 1.0 });
```

---

### Reflect4A - Key Takeaways
**Key Animations:**
- Takeaways cascade in
- Highlight reveal on important points
- Mid-scene: Title shrinks, takeaways expand

**GSAP Functions:**
```javascript
import { cascadeReveal, highlightReveal, gracefulMove } from '../utils/gsapAnimations';

// Takeaways cascade
cascadeReveal([t1, t2, t3], { stagger: 0.18 });

// Highlight important
highlightReveal(importantRef.current, { color: "#FFEB3B", duration: 0.8 });

// Mid-scene reposition
gracefulMove(titleRef.current, { y: -150, scale: 0.6 });
```

---

### Reflect4D - Forward Link
**Key Animations:**
- Shrink current topic to corner
- Expand next topic to center
- Draw connection line

**GSAP Functions:**
```javascript
import { shrinkToCorner, expandToCenter, drawSVGPath } from '../utils/gsapAnimations';

// Shrink current
shrinkToCorner(currentRef.current, { corner: "topLeft", scale: 0.4 });

// Expand next
expandToCenter(nextRef.current, { scale: 1.3, duration: 1.2 });

// Draw connection
drawSVGPath(connectionLineRef.current, { duration: 1.0 });
```

---

## Checklist per Template

- [ ] Import GSAP and utilities
- [ ] Add refs for animated elements
- [ ] Add state tracking
- [ ] Update fonts to rough.js styles (`fontFamily: fonts.primary`)
- [ ] Replace interpolate animations with GSAP
- [ ] Add **at least 1 mid-scene transition**
- [ ] Update rough.js to `roughness: 0, bowing: 0`
- [ ] Set initial styles (opacity: 0 for animated elements)
- [ ] Test in player
- [ ] Verify with reload button

---

## Implementation Status

| Template | GSAP | Mid-Scene | Fonts | Zero Wobble | Status |
|----------|------|-----------|-------|-------------|--------|
| Hook1A | ✅ | ✅ | ✅ | ✅ | DONE |
| Hook1E | ✅ | ✅ | ✅ | ✅ | DONE |
| Explain2A | ⏳ | ⏳ | ⏳ | ⏳ | IN PROGRESS |
| Explain2B | ⏳ | ⏳ | ⏳ | ⏳ | IN PROGRESS |
| Apply3A | ⏳ | ⏳ | ⏳ | ⏳ | IN PROGRESS |
| Apply3B | ⏳ | ⏳ | ⏳ | ⏳ | IN PROGRESS |
| Reflect4A | ⏳ | ⏳ | ⏳ | ⏳ | IN PROGRESS |
| Reflect4D | ⏳ | ⏳ | ⏳ | ⏳ | IN PROGRESS |

---

## Timeline

- **Hook1A & Hook1E:** ✅ Complete
- **Explain2A & Explain2B:** 🔄 Current batch
- **Apply3A & Apply3B:** Next
- **Reflect4A & Reflect4D:** Final

**Estimated completion:** All templates GSAP-enabled within this session
