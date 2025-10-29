# 🚀 GSAP Quick Start Guide

**For: Implementing GSAP animations in remaining templates**

---

## 📦 What's Available

All utilities are in `/src/utils/gsapAnimations.js` - just import what you need!

---

## 🎯 Quick Implementation Pattern

### 1. Import GSAP utilities

```javascript
import gsap from 'gsap';
import {
  drawUnderline,
  pulseEmphasis,
  gracefulMove,
  cascadeReveal,
  staggeredBullets,
  // ... add what you need
} from '../utils/gsapAnimations';
```

### 2. Create refs for elements you want to animate

```javascript
const titleRef = useRef(null);
const bulletRef1 = useRef(null);
const bulletRef2 = useRef(null);
```

### 3. Track animation triggers

```javascript
const [triggered, setTriggered] = useState({
  title: false,
  bullets: false,
  midScene: false,
});
```

### 4. Trigger animations on specific frames

```javascript
// Title appears
useEffect(() => {
  if (frame >= beats.title && !triggered.title && titleRef.current) {
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
    );
    setTriggered(prev => ({ ...prev, title: true }));
  }
}, [frame, beats.title, triggered.title]);

// Bullets cascade in
useEffect(() => {
  if (frame >= beats.bullets && !triggered.bullets) {
    const bullets = [bulletRef1.current, bulletRef2.current].filter(Boolean);
    cascadeReveal(bullets, { stagger: 0.15 });
    setTriggered(prev => ({ ...prev, bullets: true }));
  }
}, [frame, beats.bullets, triggered.bullets]);
```

### 5. Set initial styles (GSAP will animate from these)

```javascript
<h1 ref={titleRef} style={{ opacity: 0 }}>
  Your Title
</h1>

<div ref={bulletRef1} style={{ opacity: 0 }}>
  Bullet 1
</div>
```

---

## 🎨 Animation Cheat Sheet

### **Text Reveals**
```javascript
// Bounce in
gsap.fromTo(ref, 
  { opacity: 0, y: -30, scale: 0.9 },
  { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
);

// Fade in
gsap.to(ref, { opacity: 1, duration: 0.6, ease: "power2.out" });
```

### **Underlines**
```javascript
drawUnderline(underlineRef.current, {
  duration: 0.8,
  ease: "power2.out",
});
```

### **Pulse Emphasis**
```javascript
pulseEmphasis(elementRef.current, {
  scale: 1.08,
  duration: 0.4,
  repeat: 2,
  yoyo: true,
});
```

### **Staggered Bullets**
```javascript
cascadeReveal([bullet1, bullet2, bullet3], {
  duration: 0.6,
  stagger: 0.15,
  ease: "back.out(1.7)",
});
```

### **Mid-Scene Move**
```javascript
gracefulMove(containerRef.current, {
  y: -200,
  scale: 0.7,
  duration: 1.2,
  ease: "power3.inOut",
});
```

### **Content Swap**
```javascript
const tl = gsap.timeline();
tl.to(oldContentRef.current, { opacity: 0, scale: 0.8, duration: 0.4 });
tl.to(newContentRef.current, { opacity: 1, scale: 1, duration: 0.4 }, "-=0.2");
```

### **Flip Reveal (Quiz)**
```javascript
flipReveal(cardRef.current, {
  duration: 0.6,
  rotationY: 180,
  ease: "power2.inOut",
});
```

---

## 🎬 Template-Specific Recommendations

### **Hook1E - Ambient Mystery**
```javascript
// Scramble text for mystery
scrambleText(mysteryTextRef.current, "Final Revealed Text", {
  duration: 1.2,
  chars: "?!@#$%&*",
});

// Glow pulse for mysterious elements
glowPulse(elementRef.current, {
  color: "#9B59B6",
  intensity: 25,
  repeat: 3,
});
```

### **Explain2A - Concept Breakdown**
```javascript
// Staggered bullets for step-by-step
staggeredBullets([step1, step2, step3], {
  duration: 0.5,
  stagger: 0.2,
  direction: "up",
});

// Mid-scene: Move previous step to top
gracefulMove(previousStepRef.current, {
  y: -150,
  scale: 0.6,
  duration: 1.0,
});
```

### **Explain2B - Analogy**
```javascript
// Morph shape for analogy
morphShape(shapeRef.current, {
  scale: 1.5,
  rotation: 45,
  duration: 1.2,
});

// Breathe effect for living concepts
breatheShape(conceptRef.current, {
  scaleAmount: 1.08,
  duration: 2.5,
});
```

### **Apply3A - Micro Quiz**
```javascript
// Question appears
gsap.fromTo(questionRef.current,
  { opacity: 0, y: -40 },
  { opacity: 1, y: 0, duration: 0.8 }
);

// Options stagger in
cascadeReveal([optionA, optionB, optionC], { stagger: 0.12 });

// Answer flips
flipReveal(answerCardRef.current, { rotationY: 180 });

// Correct answer pulses
pulseEmphasis(correctAnswerRef.current, { scale: 1.1, repeat: 2 });
```

### **Apply3B - Scenario Choice**
```javascript
// Scenario options appear
staggeredBullets([scenario1, scenario2], {
  stagger: 0.25,
  direction: "left",
});

// Swap to chosen scenario
scaleSwap(allScenariosRef.current, chosenScenarioRef.current, {
  duration: 0.8,
});
```

### **Reflect4A - Key Takeaways**
```javascript
// Title writes on
gsap.fromTo(titleRef.current,
  { opacity: 0, x: -30 },
  { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
);

// Takeaways cascade
cascadeReveal([takeaway1, takeaway2, takeaway3], {
  stagger: 0.18,
});

// Emphasize most important
highlightReveal(importantRef.current, {
  color: "#FFEB3B",
  duration: 0.8,
});
```

### **Reflect4D - Forward Link**
```javascript
// Current topic shrinks to corner
shrinkToCorner(currentTopicRef.current, {
  corner: "topLeft",
  scale: 0.4,
  duration: 1.2,
});

// Next topic expands to center
expandToCenter(nextTopicRef.current, {
  scale: 1.3,
  duration: 1.2,
});

// Connection line draws
drawSVGPath(connectionLineRef.current, {
  duration: 1.0,
});
```

---

## ⚙️ Common Options

All animations accept these common options:

```javascript
{
  duration: 0.8,        // Animation length (seconds)
  delay: 0,             // Start delay (seconds)
  ease: "power2.out",   // Easing function
  stagger: 0.15,        // Delay between multiple elements
  onComplete: () => {}, // Callback when done
}
```

### Popular Ease Types
- `"power2.out"` - Smooth deceleration (default for most)
- `"back.out(1.7)"` - Overshoot and settle (entrances)
- `"elastic.out(1, 0.5)"` - Bouncy (playful moments)
- `"power3.inOut"` - Smooth acceleration + deceleration (moves)
- `"sine.inOut"` - Gentle, organic (breathing, floating)

---

## 🚫 Common Mistakes

### ❌ DON'T: Forget initial styles
```javascript
// Bad - GSAP won't know what to animate from
<div ref={myRef}>Content</div>

// Good - Set initial state
<div ref={myRef} style={{ opacity: 0 }}>Content</div>
```

### ❌ DON'T: Trigger animations multiple times
```javascript
// Bad - Will animate every frame
useEffect(() => {
  gsap.to(ref.current, { opacity: 1 });
}, [frame]); // ⚠️ No trigger tracking!

// Good - Track with state
useEffect(() => {
  if (frame >= startFrame && !triggered.anim && ref.current) {
    gsap.to(ref.current, { opacity: 1 });
    setTriggered(prev => ({ ...prev, anim: true }));
  }
}, [frame, startFrame, triggered.anim]);
```

### ❌ DON'T: Animate too much at once
```javascript
// Bad - Overwhelming
gsap.to(everything, { opacity: 1, duration: 0.1 });

// Good - Stagger for clarity
cascadeReveal(elements, { stagger: 0.15 });
```

---

## 📝 Template Checklist

For each template you update:

- [ ] Import necessary GSAP utilities
- [ ] Create refs for all animated elements
- [ ] Set up state tracking object
- [ ] Define beat timing for animations
- [ ] Add useEffect hooks with trigger logic
- [ ] Set initial styles on animated elements
- [ ] Test at multiple timestamps
- [ ] Include at least 1 mid-scene transition
- [ ] Verify build succeeds
- [ ] Check performance (no lag)

---

## 🎯 Animation Budget per Template

### Hook Templates (10-20s)
- 2-3 major text animations
- 1-2 emphasis moments (pulse/underline)
- 1 mid-scene transition
- 2-3 decorative elements

### Explain Templates (15-30s)
- 1 title animation
- 3-5 staggered reveals
- 2-3 mid-scene moves
- 1-2 emphasis highlights

### Apply Templates (10-20s)
- 1 question reveal
- 2-4 option reveals
- 1 answer reveal (flip/swap)
- 1 emphasis on correct answer

### Reflect Templates (10-20s)
- 1 title animation
- 3-5 cascade reveals
- 1-2 emphasis pulses
- 1 transition to next topic

---

## 🔍 Debug Tips

### Check if animation is triggering
```javascript
useEffect(() => {
  if (frame >= beats.anim && !triggered.anim && ref.current) {
    console.log('🎬 Animation triggering at frame:', frame);
    // ... animation code
  }
}, [frame, beats.anim, triggered.anim]);
```

### Check ref is connected
```javascript
useEffect(() => {
  console.log('Ref connected:', ref.current);
}, []);
```

### Check timing
```javascript
console.log('Current frame:', frame, 'Beat timing:', beats);
```

---

## 💡 Pro Tips

1. **Start Simple** - Get one animation working, then add more
2. **Use Timeline for Complex Sequences** - See `questionRevealSequence()`
3. **Stagger is Your Friend** - Makes everything feel more professional
4. **Mid-Scene = Magic** - This is what makes our animations world-class
5. **Test Multiple Times** - Scrub through the timeline in player
6. **Ease Variety** - Mix different eases for interest
7. **Don't Overdo It** - Less is often more

---

## 📚 Full API Reference

See `/src/utils/gsapAnimations.js` for:
- Complete function signatures
- All available options
- JSDoc documentation
- Implementation examples

---

## 🆘 Need Help?

1. Check `Hook1AQuestionBurst.jsx` - Complete working example
2. Read `GSAP_IMPLEMENTATION_COMPLETE.md` - Full documentation
3. Test in isolation - Create simple test cases
4. Check GSAP docs - https://gsap.com/docs/v3/

---

**You've got this! GSAP makes animations smooth and professional. 🚀**
