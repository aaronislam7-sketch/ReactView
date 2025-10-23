# Library Rebuild Plan - 9+/10 Target

## 🎯 Goal
Break free from boxes! Use rough.js for ALL shapes + anime.js for dynamic motion.

## 📚 8 Templates to Build (2 per pillar)

### HOOK Templates

**1A: Question Burst** ✅ (Started)
- Intent: Provocative question to focus attention  
- Visual: Kinetic type, hand-drawn underlines, floating particles
- Pattern: "Ever wondered...?" / "What if...?"
- Duration: 10-20s
- **Rough.js elements:** Wobbly underlines, sketch circles, hand-drawn stars
- **Anime.js:** Kinetic text (rotate in), stroke drawing, particle burst

**1E: Ambient Mystery**
- Intent: Set mood with minimal narration
- Visual: Slow zoom on map, drifting particles, reveal question at end
- Pattern: Ambient visuals → single guiding line
- Duration: 10-18s
- **Rough.js elements:** Sketchy map outline, organic shapes, soft clouds
- **Anime.js:** Slow float, parallax layers, gentle fade-ins

---

### EXPLAIN Templates

**2A: Concept Breakdown**
- Intent: Clarify via 3 key points
- Visual: Hand-drawn cards/panels with connecting sketches
- Pattern: "Let's break it down" → 1-2-3
- Duration: 25-45s
- **Rough.js elements:** Wobbly cards, sketch arrows, organic borders
- **Anime.js:** Stagger-in cards, path following, morph transitions

**2B: Analogy**
- Intent: Teach via strong metaphor
- Visual: Object morph, comparison frames
- Pattern: "Think of it like..."
- Duration: 25-45s
- **Rough.js elements:** Shape morphing outlines, sketch comparisons
- **Anime.js:** Morph paths, split-screen reveals, elastic transforms

---

### APPLY Templates

**3A: Micro-Quiz**
- Intent: Check recall with MCQ
- Visual: Sketchy pill buttons, hand-drawn tick/cross, confetti
- Pattern: Question → Options → Feedback
- Duration: 12-25s
- **Rough.js elements:** Organic button shapes, sketch checkmarks, bursts
- **Anime.js:** Pop-in buttons, pulse on hover, confetti explosion

**3B: Scenario Choice**
- Intent: Test application in context
- Visual: Scenario card + sketchy choice pills
- Pattern: "You're faced with..." → choose action
- Duration: 15-30s
- **Rough.js elements:** Story frame, wobbly choices, result badges
- **Anime.js:** Reveal scenario, choice highlights, outcome animation

---

### REFLECT Templates

**4A: Key Takeaways**
- Intent: Consolidate via top 3 insights
- Visual: Text cascade with hand-drawn highlights
- Pattern: "So what?" → 3 bullets → closure
- Duration: 12-25s
- **Rough.js elements:** Sketch bullets, underline emphasis, frame
- **Anime.js:** Cascade timing, highlight draws, settle motion

**4D: Forward Link**
- Intent: Bridge to next topic
- Visual: Map path highlight, arrow to next module
- Pattern: "Next, we'll..." → path reveal
- Duration: 8-12s
- **Rough.js elements:** Sketch path, organic arrow, next marker
- **Anime.js:** Path trace, arrow flight, anticipatory pulse

---

## 🎨 Visual Principles

### NO MORE BOXES!
- ❌ No `border`, `borderRadius`, `background` CSS
- ✅ All shapes via rough.js SVG
- ✅ Wobbly, hand-drawn, organic
- ✅ Hachure fills, variable strokes

### Rough.js Settings
```javascript
const sketchStyle = {
  roughness: 1.5-2.5,    // Wobble amount
  bowing: 2-8,           // Line curve
  strokeWidth: 3-6,      // Marker weight
  fillStyle: 'hachure',  // Crosshatch fills
  hachureGap: 6-10,      // Fill spacing
};
```

### Anime.js Patterns
```javascript
// Sketch-in (stroke drawing)
anime({
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeOutCubic',
  duration: 800,
});

// Pop-in (bouncy)
anime({
  scale: [0, 1],
  opacity: [0, 1],
  easing: 'easeOutElastic(1, .8)',
  duration: 1000,
});

// Stagger (cascade)
anime({
  translateY: [20, 0],
  opacity: [0, 1],
  delay: anime.stagger(100),
});
```

---

## 🔧 Technical Architecture

### Component Structure
```jsx
const Template = ({ scene }) => {
  const svgRef = useRef(null);
  const frame = useCurrentFrame();
  
  // Sketch rough.js elements
  useEffect(() => {
    const rc = rough.svg(svgRef.current);
    // Draw shapes...
    
    // Animate with anime.js
    anime({ /* ... */ });
  }, [frame]);
  
  return (
    <AbsoluteFill>
      <svg ref={svgRef} />
      <div>{/* Text content */}</div>
    </AbsoluteFill>
  );
};
```

### Layering
1. **Background** - Texture, subtle gradients
2. **SVG Layer** - All rough.js sketches
3. **Content Layer** - Text, icons (minimal CSS)
4. **Particle Layer** - Floating ambient elements

---

## 📊 Quality Targets

### From 6/10 to 9+/10

**Current Issues (6/10):**
- ❌ Too constrained to boxes
- ❌ CSS borders feel digital
- ❌ Motion too uniform
- ❌ Lacks hand-drawn charm

**Target Qualities (9+/10):**
- ✅ Every shape hand-sketched
- ✅ Organic, wobbly, alive
- ✅ Anime.js creates dynamic, varied motion
- ✅ Feels like watching someone sketch
- ✅ No template "smell" - each unique
- ✅ Asymmetric, intentional layouts
- ✅ Motion carryover between elements

---

## 🚀 Implementation Order

1. ✅ Install anime.js + rough.js
2. ✅ Create rough + anime helper utilities
3. 🔄 Build Hook1A (in progress)
4. Build Hook1E
5. Build Explain2A
6. Build Explain2B
7. Build Apply3A
8. Build Apply3B
9. Build Reflect4A
10. Build Reflect4D
11. Create scene JSON examples
12. Test all 8 templates
13. Document usage patterns

---

## 💡 Creative Freedom

**Remember:**
- Rough.js shapes can be ANYWHERE, any size
- Anime.js can animate ANYTHING
- No grids required
- Asymmetry is good
- Imperfection is the goal
- Hand-drawn > perfect

**Each template should feel like:**
- Someone is sketching it live
- Motion has personality
- Nothing is "templated"
- Every detail has intention

---

**Status:** Libraries installed, helpers ready, Hook1A started.
**Next:** Complete all 8 templates with full rough.js + anime.js integration!
