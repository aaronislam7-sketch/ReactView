# Template Enhancement Blueprint (Advanced)
## Sophisticated Animations for Polished Knode Video Templates

**Status**: Production-Ready Enhancement  
**Version**: Enhancement v1.0  
**Prerequisite**: Complete **TEMPLATE_BASIC_BLUEPRINT.md** first

---

## Philosophy

> **"Entrances inform, exits impress, mid-scene moves delight."**

This is the **ENHANCEMENT** pattern - for adding polish and sophistication to working templates.

**Start with BASIC, enhance intentionally.**

---

## 1. The Enhancement Strategy

### **When to Use What**

#### ✅ Use Remotion `interpolate()` For:
- **Entrances** (reliable, predictable)
- **Simple effects** (basic pulses, highlights)

#### ✅ Use GSAP For:
- **Mid-scene moves** (smoother, more fluid)
- **Exits** (polished, professional)
- **Complex choreography** (staggers, sequences)

### **Why This Mix?**

**Entrances via interpolate():**
- Simple, reliable, no timing issues
- Element appears = user focuses on content
- Predictable = easier to debug

**Mid-scene moves via GSAP:**
- Smoother easing (back, elastic, custom)
- Better feel (inertia, momentum)
- More polished (professional quality)

**Exits via GSAP:**
- Last impression = most important
- Smooth departure = professional
- Complex exit choreography possible

---

## 2. The Safe GSAP Pattern

### **The Problem:**
GSAP animates DOM elements, but our SVG text is conditionally rendered. If we're not careful, GSAP tries to animate an element that doesn't exist yet → breaks.

### **The Solution:**
Use GSAP **ONLY after element is guaranteed to exist** for a stable period.

### **Safe GSAP Pattern:**

```javascript
// STEP 1: Track triggers
const [triggeredAnimations, setTriggeredAnimations] = useState({
  midSceneMove: false,
  exit: false,
});

// STEP 2: Render element BEFORE GSAP beat
useEffect(() => {
  if (!roughTextSvgRef.current) return;
  const svg = roughTextSvgRef.current;
  
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  
  // Render element for its entire lifecycle (entrance through exit)
  if (frame >= beats.entrance && frame < beats.exit + 50) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', 'element-group'); // Unique ID for GSAP
    
    // Initial state via interpolate (entrance)
    if (frame < beats.midSceneMove) {
      const entranceOpacity = interpolate(
        frame,
        [beats.entrance, beats.entrance + 27],
        [0, 1],
        { extrapolateRight: 'clamp' }
      );
      group.setAttribute('opacity', String(entranceOpacity));
    }
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '960');
    text.setAttribute('y', '540');
    text.setAttribute('font-family', "'Cabin Sketch', cursive");
    text.setAttribute('font-size', '72');
    text.setAttribute('fill', colors.accent);
    text.textContent = 'Your Text';
    
    group.appendChild(text);
    svg.appendChild(group);
  }
}, [frame, beats, colors]);

// STEP 3: GSAP for mid-scene move (AFTER element rendered for stable period)
useEffect(() => {
  if (frame >= beats.midSceneMove && !triggeredAnimations.midSceneMove && roughTextSvgRef.current) {
    // Element has been rendered since beats.entrance
    // Now it's safe to animate
    const element = roughTextSvgRef.current.querySelector('#element-group');
    
    if (element) {
      gsap.to(element, {
        attr: { transform: 'translate(0, -60) scale(1)' },
        duration: 0.8,
        ease: 'power3.inOut', // Smoother than interpolate
      });
    }
    setTriggeredAnimations(prev => ({ ...prev, midSceneMove: true }));
  }
}, [frame, beats.midSceneMove, triggeredAnimations.midSceneMove]);

// STEP 4: GSAP for exit (AFTER element stable)
useEffect(() => {
  if (frame >= beats.exit && !triggeredAnimations.exit && roughTextSvgRef.current) {
    const element = roughTextSvgRef.current.querySelector('#element-group');
    
    if (element) {
      gsap.to(element, {
        attr: { 
          transform: 'translate(-1200, 0) scale(1)',
          opacity: '0'
        },
        duration: 1.0,
        ease: 'power3.in', // Smooth, professional exit
      });
    }
    setTriggeredAnimations(prev => ({ ...prev, exit: true }));
  }
}, [frame, beats.exit, triggeredAnimations.exit]);
```

### **Key Rules for Safe GSAP:**

1. ✅ **Element rendered BEFORE GSAP beat** (stable period)
2. ✅ **Use unique ID** for querySelector targeting
3. ✅ **Check element exists** with `if (element)` guard
4. ✅ **Trigger once** with state tracking
5. ✅ **Keep element rendered** through exit duration

---

## 3. Enhanced Patterns

### **A. Smooth Mid-Scene Move (GSAP)**

```javascript
// Timeline:
// 0.6s  → Entrance (interpolate)
// 2.0s  → Mid-scene move (GSAP) ← Enhancement!
// 4.0s  → Exit (GSAP) ← Enhancement!

const beats = {
  entrance: BEAT * 0.6,
  midSceneMove: BEAT * 2.0,  // After entrance completes + breathing room
  exit: BEAT * 4.0,
};

// Entrance via interpolate (basic)
const entranceOpacity = frame < beats.entrance ? 0 :
  frame < beats.midSceneMove ? interpolate(
    frame,
    [beats.entrance, beats.entrance + 27],
    [0, 1],
    { extrapolateRight: 'clamp' }
  ) : 1;

// Mid-scene move via GSAP (enhanced)
useEffect(() => {
  if (frame >= beats.midSceneMove && !triggered && svgRef.current) {
    const element = svgRef.current.querySelector('#my-element');
    if (element) {
      gsap.to(element, {
        attr: { transform: 'translate(600, -300) scale(0.4)' },
        duration: 1.2,
        ease: 'power3.inOut', // Smoother than interpolate
      });
    }
    setTriggered(true);
  }
}, [frame, beats.midSceneMove, triggered]);

// Exit via GSAP (enhanced)
useEffect(() => {
  if (frame >= beats.exit && !triggeredExit && svgRef.current) {
    const element = svgRef.current.querySelector('#my-element');
    if (element) {
      gsap.to(element, {
        attr: { 
          transform: 'translate(-1200, 0)',
          opacity: '0'
        },
        duration: 1.0,
        ease: 'power3.in', // Professional exit
      });
    }
    setTriggeredExit(true);
  }
}, [frame, beats.exit, triggeredExit]);
```

### **B. Polished Exit Choreography (GSAP)**

```javascript
// Multiple elements exiting in sequence
useEffect(() => {
  if (frame >= beats.exitAll && !triggered && svgRef.current) {
    const element1 = svgRef.current.querySelector('#element-1');
    const element2 = svgRef.current.querySelector('#element-2');
    const element3 = svgRef.current.querySelector('#element-3');
    
    if (element1 && element2 && element3) {
      // Staggered exit - smooth and professional
      gsap.to(element1, {
        attr: { transform: 'translate(-1200, 0)', opacity: '0' },
        duration: 0.8,
        ease: 'power3.in',
      });
      
      gsap.to(element2, {
        attr: { transform: 'translate(-1200, 0)', opacity: '0' },
        duration: 0.8,
        delay: 0.1, // Slight delay for cascade effect
        ease: 'power3.in',
      });
      
      gsap.to(element3, {
        attr: { transform: 'translate(-1200, 0)', opacity: '0' },
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.in',
      });
    }
    setTriggered(true);
  }
}, [frame, beats.exitAll, triggered]);
```

### **C. Complex Mid-Scene Transformation (GSAP)**

```javascript
// Transform element to corner while revealing new content
useEffect(() => {
  if (frame >= beats.transform && !triggered && svgRef.current) {
    const element = svgRef.current.querySelector('#main-visual');
    
    if (element) {
      // Smooth, complex transformation
      gsap.to(element, {
        attr: { transform: 'translate(600, -300) scale(0.4)' },
        duration: 1.2,
        ease: 'power3.inOut',
        onComplete: () => {
          // Could trigger another animation here
        }
      });
    }
    setTriggered(true);
  }
}, [frame, beats.transform, triggered]);
```

---

## 4. Enhanced Easing Options

### **GSAP Easing for Different Feels:**

```javascript
// Smooth, professional
ease: 'power3.inOut'   // Mid-scene moves
ease: 'power3.in'      // Exits
ease: 'power2.out'     // Secondary actions

// Energetic, playful
ease: 'back.out(1.4)'  // Bouncy entrances (if GSAP used)
ease: 'elastic.out(1, 0.5)'  // Spring effects

// Custom bezier
ease: 'cubic-bezier(0.4, 0, 0.2, 1)'  // Material design
```

### **When to Use Each:**

- **power3.inOut**: Professional mid-scene moves
- **power3.in**: Clean, smooth exits
- **power2.out**: Subtle secondary effects
- **back.out**: Energetic entrances (if needed)
- **elastic**: Special emphasis moments

---

## 5. Timing Refinements

### **Enhanced Beat Timing:**

```javascript
const BEAT = 30;

const beats = {
  // Entrance via interpolate (basic)
  entrance: BEAT * 0.6,
  
  // GSAP animations require stable element period
  midSceneMove: BEAT * 2.0,    // After entrance + breathing room
  transform: BEAT * 4.0,       // After previous move + breathing
  exit: BEAT * 6.0,            // After all actions + breathing
};

// Rule: GSAP beat = previous beat + previous animation duration + breathing room
```

### **GSAP Duration Standards:**

```javascript
// Mid-scene moves
duration: 0.8  // Quick reposition
duration: 1.2  // Standard transformation
duration: 1.5  // Slow, dramatic change

// Exits
duration: 0.8  // Quick departure
duration: 1.0  // Standard exit
duration: 1.3  // Emphasized exit

// Staggers
delay: 0.1     // Subtle cascade
delay: 0.15    // Noticeable sequence
delay: 0.2     // Clear progression
```

---

## 6. HTML Element Enhancement

### **For HTML Elements with GSAP:**

```javascript
// STEP 1: Create ref
const subtitleRef = useRef(null);

// STEP 2: Render HTML element
{frame >= beats.subtitle && (
  <div
    ref={subtitleRef}
    style={{
      position: 'absolute',
      bottom: '30%',
      left: '50%',
      transform: 'translateX(-50%)',
      opacity: 0, // Initial state
    }}
  >
    <p style={{ fontFamily: fonts.secondary }}>
      Your subtitle
    </p>
  </div>
)}

// STEP 3: GSAP animation
useEffect(() => {
  if (frame >= beats.subtitle && !triggered && subtitleRef.current) {
    gsap.fromTo(subtitleRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
      }
    );
    setTriggered(true);
  }
}, [frame, beats.subtitle, triggered]);

// STEP 4: GSAP exit
useEffect(() => {
  if (frame >= beats.exitSubtitle && !triggeredExit && subtitleRef.current) {
    gsap.to(subtitleRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power3.in', // Smooth exit
    });
    setTriggeredExit(true);
  }
}, [frame, beats.exitSubtitle, triggeredExit]);
```

---

## 7. Complex Choreography Patterns

### **A. Sequential Reveal (Stagger)**

```javascript
useEffect(() => {
  if (frame >= beats.revealAll && !triggered && containerRef.current) {
    const items = containerRef.current.querySelectorAll('.item');
    
    gsap.fromTo(items,
      {
        opacity: 0,
        scale: 0.8,
        y: 30,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15, // 0.15s between each item
        ease: 'back.out(1.4)',
      }
    );
    setTriggered(true);
  }
}, [frame, beats.revealAll, triggered]);
```

### **B. Coordinated Exit**

```javascript
useEffect(() => {
  if (frame >= beats.clearStage && !triggered && svgRef.current) {
    const elements = [
      svgRef.current.querySelector('#element-1'),
      svgRef.current.querySelector('#element-2'),
      svgRef.current.querySelector('#element-3'),
    ];
    
    elements.forEach((el, i) => {
      if (el) {
        gsap.to(el, {
          attr: { 
            transform: `translate(${-1200 - i * 50}, ${-100 * i})`,
            opacity: '0'
          },
          duration: 1.0,
          delay: i * 0.1,
          ease: 'power3.in',
        });
      }
    });
    setTriggered(true);
  }
}, [frame, beats.clearStage, triggered]);
```

### **C. Transform + Reveal Pattern**

```javascript
useEffect(() => {
  if (frame >= beats.transformAndReveal && !triggered && svgRef.current) {
    const oldElement = svgRef.current.querySelector('#old-content');
    const newElement = svgRef.current.querySelector('#new-content');
    
    if (oldElement && newElement) {
      // Old content shrinks to corner
      gsap.to(oldElement, {
        attr: { transform: 'translate(600, -300) scale(0.4)' },
        duration: 1.2,
        ease: 'power3.inOut',
      });
      
      // New content appears center (slight delay)
      gsap.fromTo(newElement,
        {
          attr: { opacity: '0' },
        },
        {
          attr: { opacity: '1' },
          duration: 1.0,
          delay: 0.3, // Overlap for smooth transition
          ease: 'power2.out',
        }
      );
    }
    setTriggered(true);
  }
}, [frame, beats.transformAndReveal, triggered]);
```

---

## 8. Performance Considerations

### **GSAP Best Practices:**

```javascript
// ✅ DO: Animate SVG attributes
gsap.to(element, {
  attr: { transform: 'translate(100, 50)', opacity: '0.8' },
  duration: 1.0,
});

// ❌ AVOID: Animating CSS transforms on SVG (slower)
gsap.to(element, {
  x: 100,
  y: 50,
  opacity: 0.8,
});

// ✅ DO: Set initial state explicitly
gsap.fromTo(element,
  { attr: { opacity: '0' } },
  { attr: { opacity: '1' }, duration: 1.0 }
);

// ✅ DO: Clean up if needed (usually not required)
useEffect(() => {
  const animation = gsap.to(...);
  return () => animation.kill(); // Only if necessary
}, []);
```

---

## 9. When NOT to Enhance

### **Stick with BASIC (interpolate) if:**

- ❌ Template is working fine with interpolate
- ❌ Motion is simple entrance/exit
- ❌ No complex mid-scene choreography
- ❌ Timeline is straightforward
- ❌ Adding GSAP would complicate unnecessarily

### **Enhance with GSAP if:**

- ✅ Mid-scene moves feel stiff with interpolate
- ✅ Exits need professional polish
- ✅ Complex choreography required
- ✅ Staggered sequences needed
- ✅ Client/stakeholder requests smoother motion

---

## 10. Migration from BASIC to ENHANCED

### **Step-by-Step Enhancement:**

```javascript
// BEFORE (BASIC - all interpolate)
const elementX = frame < beats.move ? 0 :
  interpolate(
    frame,
    [beats.move, beats.move + 24],
    [0, -1200],
    { extrapolateRight: 'clamp' }
  );

// Render with transform
group.setAttribute('transform', `translate(${elementX}, 0)`);

// AFTER (ENHANCED - GSAP for exit)
// Keep interpolate for entrance (not shown)

// Add GSAP for exit
const [triggeredExit, setTriggeredExit] = useState(false);

useEffect(() => {
  if (frame >= beats.exit && !triggeredExit && svgRef.current) {
    const element = svgRef.current.querySelector('#element-group');
    if (element) {
      gsap.to(element, {
        attr: { transform: 'translate(-1200, 0)', opacity: '0' },
        duration: 1.0,
        ease: 'power3.in', // Smoother!
      });
    }
    setTriggeredExit(true);
  }
}, [frame, beats.exit, triggeredExit]);

// Update rendering to keep element during exit
if (frame >= beats.entrance && frame < beats.exit + 35) {
  // Render element
}
```

---

## 11. Enhanced Quality Checklist

In addition to BASIC checklist:

#### ✅ GSAP Usage
- [ ] GSAP only for mid-scene moves and exits
- [ ] Entrances still use interpolate()
- [ ] Elements rendered BEFORE GSAP beat
- [ ] Unique IDs for all GSAP-targeted elements
- [ ] Element existence checks (`if (element)`)
- [ ] Trigger tracking with state
- [ ] Smooth easing (power3.inOut, power3.in)

#### ✅ Timing
- [ ] GSAP beat after stable element period
- [ ] Breathing room before GSAP animation
- [ ] Exit duration considered in render condition
- [ ] No animation conflicts

#### ✅ Polish
- [ ] Mid-scene moves feel smooth
- [ ] Exits feel professional
- [ ] No jarring transitions
- [ ] Choreography feels intentional

---

## 12. Reference Examples

### **Entrance (BASIC):**
```javascript
// Use interpolate - reliable, predictable
const opacity = interpolate(frame, [start, start + 27], [0, 1]);
```

### **Mid-Scene Move (ENHANCED):**
```javascript
// Use GSAP - smoother, more polished
gsap.to(element, {
  attr: { transform: 'translate(600, -300) scale(0.4)' },
  duration: 1.2,
  ease: 'power3.inOut',
});
```

### **Exit (ENHANCED):**
```javascript
// Use GSAP - professional last impression
gsap.to(element, {
  attr: { transform: 'translate(-1200, 0)', opacity: '0' },
  duration: 1.0,
  ease: 'power3.in',
});
```

---

## Quick Reference Card

```
ENHANCEMENT PATTERN:
  ✅ Entrances: interpolate() (reliable)
  ✅ Mid-scene moves: GSAP (smoother)
  ✅ Exits: GSAP (polished)
  ✅ Complex choreography: GSAP

SAFE GSAP USAGE:
  ✅ Element rendered BEFORE GSAP beat
  ✅ Unique ID for querySelector
  ✅ if (element) guard check
  ✅ State tracking (trigger once)
  ✅ Keep rendered through exit

EASING:
  ✅ power3.inOut for moves
  ✅ power3.in for exits
  ✅ power2.out for secondary

WHEN TO ENHANCE:
  ✅ Mid-scene moves feel stiff
  ✅ Exits need polish
  ✅ Complex choreography needed
  ❌ NOT if BASIC works fine
```

---

## Validation

Before marking enhanced:

1. **Does entrance use interpolate?** ✅
2. **Do mid-scene moves use GSAP?** ✅
3. **Do exits use GSAP?** ✅
4. **Are elements stable before GSAP?** ✅
5. **Is motion noticeably smoother?** ✅

If YES to all → **Enhancement complete!**

---

**Enhance intentionally. Every GSAP animation should have a reason.** ✨
