# Template Design Blueprint
## The Gold Standard for Knode Video Templates

This document defines the principles, patterns, and quality standards that every template must meet. Use this as a validation checklist for all template creation and updates.

---

## Core Philosophy

> **"Conversational, not presentational. Dynamic, not static. Educational, not decorative."**

Every template should feel like a skilled teacher explaining a concept face-to-face - dynamic, responsive, and always moving the conversation forward.

---

## 1. Motion Principles

### **A. Conversational Choreography**

Templates should follow a **conversational flow** where elements enter, serve their purpose, then gracefully exit to make room for the next idea.

#### ✅ DO:
- **Enter → Serve → Exit**: Every element has a lifecycle
- **Clear the stage**: Remove elements when they're no longer needed
- **Make room**: Elements move to create space for what's next
- **Transform mid-scene**: Bold repositioning (shrink, move, scale)
- **Give breathing room**: Allow 0.8-1.5s between major transitions

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

All motion must use GSAP with proper easing and duration.

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
- **After entrance**: 0.8-1.2s before next action
- **After exit**: 0.8-1.0s before revealing next element
- **After transformation**: 1.0-1.5s before new content
- **Between pulses**: 0.3-0.5s

### **C. Zero Wobble + Strategic Rough**

Balance precision with personality.

#### Zero Wobble (Structure):
```javascript
// For structural elements, frames, grids
{
  roughness: 0,
  bowing: 0,
  strokeWidth: 4-6,
}
```

#### Strategic Rough (Emphasis):
```javascript
// For annotations, underlines, highlights
{
  roughness: 0.9-1.3,
  bowing: 3-6,
  strokeWidth: 4-7,
}
```

**Rule**: Structure is precise. Emphasis is rough.

### **D. Camera Motion**

Subtle, ambient drift - never distracting.

```javascript
const cameraDrift = {
  x: Math.sin(frame * 0.008) * 2,  // ±2px max
  y: Math.cos(frame * 0.006) * 1.5, // ±1.5px max
};
```

Never zoom or pan dramatically - let content do the moving.

---

## 2. Visual Principles

### **A. Typography Hierarchy**

#### Font Usage - THE CORRECT WAY:
- **Headers/Titles**: **Rough.js TEXT RENDERING** (Cabin Sketch) - sketchy, hand-drawn style
- **Body/Secondary**: **Permanent Marker** - energy, personality, brand voice
- **Supporting/Clean**: **Inter or DM Sans** - clarity, readability

#### Why This Matters:
- Rough.js creates **actual sketchy text** (like hand-drawn headers)
- Permanent Marker provides **personality** for body content
- Clean fonts provide **readability** where needed

#### Size Hierarchy:
- **Hero text**: 72-92px (main hook)
- **Section headers**: 48-64px
- **Body text**: 24-32px (Permanent Marker)
- **Supporting text**: 18-24px (Inter/DM Sans)

#### Implementation:
```javascript
// Fonts structure
const fonts = {
  header: "'Cabin Sketch', cursive",      // For rough.js rendering
  secondary: "'Permanent Marker', cursive", // For body/secondary
  body: "'Inter', sans-serif",             // For clean supporting text
};
```

### **B. Sketchy Headers (Cabin Sketch Font)**

Headers use **Cabin Sketch font on HTML elements** to achieve sketchy, hand-drawn look.

**IMPORTANT**: Use Cabin Sketch on regular HTML elements (not SVG), so GSAP can animate them!

#### Header Pattern:
```javascript
<h1
  style={{
    fontFamily: "'Cabin Sketch', cursive", // Sketchy style
    fontSize: 72,
    fontWeight: 700,
    color: colors.accent,
  }}
>
  Your Header Text
</h1>
```

#### Why This Works:
- ✅ HTML elements can be animated by GSAP
- ✅ Cabin Sketch provides sketchy, hand-drawn look
- ✅ No complex SVG rendering needed
- ✅ Maintains all motion capabilities

#### When to Use Cabin Sketch (Headers):
- ✅ Main headers
- ✅ Section titles
- ✅ Key hook phrases
- ✅ Anything that needs visual weight

#### When to Use Permanent Marker (Body):
- ✅ Body text
- ✅ Subtitles
- ✅ Supporting information
- ✅ Secondary emphasis

#### When to Use Clean Fonts (Inter/DM Sans):
- ✅ Long-form descriptions
- ✅ Data/numbers
- ✅ Fine print
- ✅ Where readability is paramount

### **C. Rough.js Annotations (When Needed)**

**IMPORTANT**: Not all templates need boxes/underlines!

For templates that DO need annotations (e.g., Reflect 4A with emphasis circles):

#### Annotation Types:
1. **Boxes**: Frame important content (needs proper sizing)
2. **Underlines**: Emphasis beneath text (needs alignment)
3. **Circles**: Around numbers or icons
4. **Arrows**: Show direction or flow

#### Due Diligence Required:
- ⚠️ **Measure text bounds** to avoid overlaps
- ⚠️ **Test with different text lengths**
- ⚠️ **Ensure decorations don't obscure content**
- ⚠️ **Time decorations to appear AFTER text lands** (0.5-1.0s delay)

#### Hook1A Approach:
- ✅ NO boxes or underlines
- ✅ Focus on clean motion and sequencing
- ✅ Let rough.js TEXT do the work

**Rule**: Only add annotations if they serve the pedagogy. Motion and typography should carry most templates.

### **C. Color Philosophy**

#### Brand Palette:
- **Background**: Warm cream `#FFF9F0` or clean white `#FAFBFC`
- **Primary accent**: Bold orange `#FF6B35` (energy, hooks)
- **Secondary accent**: Bold purple `#9B59B6` (depth, reflection)
- **Success**: Green `#27AE60` (correct, apply)
- **Info**: Blue `#2E7FE4` (explain, connection)
- **Ink**: `#1A1A1A` (text)

#### Usage Rules:
- **Hook templates**: Orange + Purple
- **Explain templates**: Blue + Green/Purple
- **Apply templates**: Green + Orange
- **Reflect templates**: Purple + Blue

### **D. Spacing & Composition**

- **Padding**: 80-120px from edges
- **Gap between elements**: 30-40px
- **Center stage**: 60-80% of screen width
- **Transformed elements**: 40-50% scale when moved aside

---

## 3. Pedagogy Principles

### **A. Hook Templates (1A-1E)**

**Goal**: Create curiosity, intrigue, "ooo what is this?" feeling

#### Structure:
1. **Provocative question/statement** (bold entrance)
2. **Visual metaphor/element** (creative, not emoji)
3. **The hook reveal** (THE moment - center stage)
4. **Teaser of journey ahead** (subtle, enticing)

#### User Feeling:
- 😮 "Wait, what?"
- 🤔 "I need to know more"
- ✨ "This is interesting!"

#### Motion Strategy:
- Fast-paced at start (grab attention)
- Build to hook reveal (dramatic)
- Settle with intrigue (leave them wanting more)

**Anti-patterns**:
- Don't give everything away
- Don't use emojis
- Don't feel like a title card

### **B. Explain Templates (2A-2E)**

**Goal**: Clarity through structure, "aha!" moments

#### Structure:
1. **Title/framing** (what are we explaining?)
2. **Core concept** (center focus)
3. **Breakdown/parts** (clear organization)
4. **Connections** (show relationships - PULSE/ANIMATE)
5. **Synthesis** (bring it together)

#### User Feeling:
- 💡 "Aha, I get it!"
- 🎯 "This makes sense"
- 🔗 "I see how these connect"

#### Motion Strategy:
- Methodical reveals (stagger parts)
- Emphasize connections (pulsing lines)
- Mid-scene: reorganize for new perspective

**Anti-patterns**:
- Don't show all parts at once
- Don't have static connections
- Don't overcrowd the screen

### **C. Apply Templates (3A-3E)**

**Goal**: Practice, engagement, confidence building

#### Structure:
1. **Context/scenario** (real-world situation)
2. **Challenge/question** (what to do?)
3. **Options/paths** (choices)
4. **Feedback** (automatic, educational)
5. **Explanation** (why this works)

#### User Feeling:
- 🎮 "I can try this"
- ✅ "I got it right!"
- 📚 "I understand why"

#### Motion Strategy:
- Quick, energetic (keep momentum)
- Clear feedback (visual emphasis)
- Celebration (burst, pulse)

**Anti-patterns**:
- Don't punish wrong answers
- Don't rush through explanation
- Don't make it feel like a test

### **D. Reflect Templates (4A-4E)**

**Goal**: Synthesis, confidence, forward momentum

#### Structure:
1. **Anchor learning** (celebrate achievement)
2. **Key points** (annotated, emphasized)
3. **Connection to journey** (where we've been)
4. **Forward link** (where we're going)

#### User Feeling:
- 🎉 "I learned this!"
- 💪 "I'm making progress"
- 🚀 "I'm ready for more"

#### Motion Strategy:
- Affirming (pulse, check marks)
- Organized (staggered reveals)
- Forward-looking (progression animation)

**Anti-patterns**:
- Don't feel like an ending
- Don't just list points
- Don't skip the "why this matters"

---

## 4. Technical Implementation

### **A. Animation Triggers**

Use state-based triggers to prevent re-firing:

```javascript
const [triggeredAnimations, setTriggeredAnimations] = useState({
  entrance: false,
  transform: false,
  exit: false,
});

useEffect(() => {
  if (frame >= beats.entrance && !triggeredAnimations.entrance && ref.current) {
    gsap.fromTo(ref.current, {...});
    setTriggeredAnimations(prev => ({ ...prev, entrance: true }));
  }
}, [frame, beats.entrance, triggeredAnimations.entrance]);
```

### **B. Beat Timing Structure**

```javascript
const BEAT = 30; // 1 second at 30fps
const beats = {
  prelude: 0,
  action1: BEAT * 0.6,           // Quick start
  action2: BEAT * 2.0,           // After action1 completes (0.6 + 1.4s gap)
  action3: BEAT * 3.5,           // After action2 completes (2.0 + 1.5s gap)
  // ... ensure 0.8-1.5s between major actions
};
```

**Gap Calculation**:
- `nextBeat = previousBeat + animationDuration + breathingRoom`
- Minimum breathing room: 0.8s (24 frames)
- Standard breathing room: 1.0-1.2s (30-36 frames)

### **C. Header Animation Pattern**

```javascript
// Header as HTML with Cabin Sketch font
// GSAP can animate HTML elements!
const headerRef = useRef(null);

useEffect(() => {
  if (frame >= beats.headerAppears && !triggered && headerRef.current) {
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.7)" }
    );
    setTriggered(true);
  }
}, [frame, beats.headerAppears, triggered]);

// In JSX:
<div ref={headerRef} style={{ opacity: 0 }}>
  <h1 style={{
    fontFamily: "'Cabin Sketch', cursive", // Sketchy look
    fontSize: 72,
    fontWeight: 700,
    color: colors.accent,
  }}>
    Your Header Text
  </h1>
</div>
```

**Key Point**: HTML + Cabin Sketch = Sketchy look + GSAP animations work!

### **D. Conditional Rendering**

Only render elements when they're needed:

```javascript
// Show during active period
{frame >= beats.enter && frame < beats.exit && (
  <div ref={ref} style={{ opacity: 0 }}>
    {/* Content */}
  </div>
)}
```

This keeps the DOM clean and improves performance.

---

## 5. Quality Checklist

### **Before Marking Template Complete:**

#### ✅ Motion Quality
- [ ] All entrances use GSAP with proper easing
- [ ] All exits are graceful (not just opacity fade)
- [ ] Mid-scene transformations are bold and purposeful
- [ ] Breathing room: 0.8-1.5s between major actions
- [ ] No elements "pop" into existence
- [ ] Camera drift is subtle (±2px max)

#### ✅ Visual Quality
- [ ] Headers use Cabin Sketch font on HTML elements (sketchy style)
- [ ] Body/secondary text uses Permanent Marker
- [ ] Supporting text uses Inter/DM Sans
- [ ] GSAP animations work on all text elements
- [ ] Annotations only if pedagogically necessary (with proper diligence)
- [ ] Zero wobble on structural elements (maps, frames)
- [ ] Color palette follows brand guidelines

#### ✅ Conversational Flow
- [ ] Elements enter → serve purpose → exit
- [ ] Stage is cleared when elements are done
- [ ] Only relevant content visible at any moment
- [ ] Transformations create space for new content
- [ ] Flow feels natural, not mechanical

#### ✅ Pedagogy
- [ ] Clear learning goal
- [ ] Appropriate pacing for content type
- [ ] Emphasis on key moments (pulse, annotate)
- [ ] User emotion aligns with template goal
- [ ] No cognitive overload

#### ✅ Technical
- [ ] Animation triggers use state (prevent re-firing)
- [ ] Beat timing has proper gaps
- [ ] Decorations appear after text lands
- [ ] Conditional rendering for performance
- [ ] No console errors or warnings

#### ✅ Must-Avoid
- [ ] No emojis (use creative animations)
- [ ] No PowerPoint feel (everything moves)
- [ ] No text overflow
- [ ] No wasted time (use full duration)
- [ ] No animations without purpose
- [ ] No cluttered screens

---

## 6. Example: Hook1A Breakdown

### **Timing Analysis** (15 seconds total)

```
0.6s  (18f)  → Question 1 entrance (rough.js text, 0.9s animation)
2.0s  (60f)  → Question 1 moves up (0.8s animation)
              [Gap: 0.6s breathing room]
2.8s  (84f)  → Question 2 appears (rough.js text, 1.0s animation)
              [Gap: 1.4s for both to land]
4.2s  (126f) → Pulse both (0.4s animation)
              [Gap: 1.3s breathing room]
5.5s  (165f) → Wipe questions exit (1.0s animation)
              [Gap: 1.0s clean stage]
6.5s  (195f) → Map reveals center (1.3s animation)
              [Gap: 2.5s for map to shine]
9.0s  (270f) → Map transforms to corner (1.2s animation)
              [Gap: 1.0s breathing room]
10.0s (300f) → Welcome center stage (rough.js text, 1.5s animation)
              [Gap: 2.0s for hook to land]
12.0s (360f) → Subtitle appears (Permanent Marker, 1.0s animation)
              [Gap: 1.5s breathing room]
13.5s (405f) → Breathe animation starts
15.0s (450f) → Settle/hold
```

**Key Observations**:
- Average gap between actions: 1.1s
- Longest gap: 2.5s (let map shine)
- Shortest gap: 0.6s (quick transition)
- Total motion time: ~8s
- Total breathing time: ~7s
- Ratio: ~50/50 motion/breathing

### **Typography Timeline**

```
Question 1 (Cabin Sketch): 0.6s - bold, sketchy header, GSAP animated
Question 2 (Cabin Sketch): 2.8s - bold, sketchy header, accent color, GSAP animated
Welcome (Cabin Sketch): 10.0s - THE HOOK, center stage, sketchy style, GSAP animated
Subtitle (Permanent Marker): 12.0s - personality, energy, GSAP animated
```

**Pattern**: 
- Headers = Cabin Sketch font on HTML (sketchy + animatable)
- Body = Permanent Marker (personality)
- NO boxes or underlines (clean motion focus)
- ALL text animated by GSAP

### **User Emotional Journey**

```
0-3s:   🤔 "Interesting question..."
3-5s:   💭 "These connect somehow..."
5-7s:   👀 "What's appearing?"
7-10s:  ✨ "Ooo, a map!"
10-12s: 🎯 "AHA - Knodovia! What is it?"
12-15s: 🧐 "I want to explore this..."
```

---

## 7. Template Validation Process

### **Step 1: Motion Test**
- Play template without audio
- Does every element have a clear entry/exit?
- Is there wasted time where nothing happens?
- Are transitions smooth or jarring?

### **Step 2: Pedagogy Test**
- What should the user feel?
- Does the motion support that feeling?
- Is the key learning moment emphasized?
- Would this work without voice-over?

### **Step 3: Cohesion Test**
- Does this feel like part of the Knode family?
- Are colors/fonts consistent?
- Does motion language match other templates?
- Could you identify this as Knode without branding?

### **Step 4: TED-ED Standard**
- Could this appear in a TED-ED video?
- Is every animation purposeful?
- Does it add micro-delights without fluff?
- Would an educator approve?

---

## 8. Anti-Patterns to Avoid

### **❌ The PowerPoint Trap**
**Problem**: Elements just fade in/out with no personality
**Fix**: Use GSAP with back.out easing, scale, rotation

### **❌ The Cluttered Screen**
**Problem**: Everything stays visible at once
**Fix**: Exit elements when done, clear the stage

### **❌ The Rushed Transition**
**Problem**: Next element appears before previous motion completes
**Fix**: Add 0.8-1.5s breathing room between beats

### **❌ The Static Decoration**
**Problem**: Rough.js elements just appear, don't draw
**Fix**: Animate with progress, show stroke-dashoffset

### **❌ The Emoji Shortcut**
**Problem**: Using 🗺️ instead of creating animation
**Fix**: Build creative SVG animations with rough.js

### **❌ The Wobble Overload**
**Problem**: Everything is rough/sketchy, loses impact
**Fix**: Zero wobble on structure, rough on emphasis only

### **❌ The Mechanical Feel**
**Problem**: Everything moves at same speed/easing
**Fix**: Vary duration (0.7-2.0s) and easing per context

### **❌ The Purposeless Animation**
**Problem**: Animation that doesn't serve learning
**Fix**: Ask "does this help understanding?" If no, remove it

---

## 9. Future Template Guidelines

### **When Creating New Templates:**

1. **Start with pedagogy**
   - What's the learning goal?
   - What should user feel?
   - What's the "aha moment"?

2. **Design the choreography**
   - Map out enter → serve → exit for each element
   - Identify transformation points
   - Plan breathing room

3. **Choose emphasis style**
   - What gets rough.js decoration?
   - When do pulses happen?
   - Where are connection animations?

4. **Prototype timing**
   - Build beat structure
   - Test without content
   - Adjust gaps as needed

5. **Validate against blueprint**
   - Run through quality checklist
   - Compare to reference templates
   - Get feedback

---

## 10. Reference Examples

### **Best Practices Reference:**
- **Hook1A**: Conversational flow, bold transformations
- **Explain2A**: Pulsing connections, dynamic layout
- **Apply3A**: Countdown timer, clear feedback
- **Reflect4A**: Rough annotations, affirmation

### **Key Innovation Examples:**
- **Wipe exit** (Hook1A): Questions exit stage left
- **Transform** (Hook1A): Map shrinks to corner
- **Pulsing lines** (Explain2A): Show relationships
- **Countdown** (Apply3A): Build tension
- **Stepping stones** (Reflect4D): Show progression

---

## Conclusion

This blueprint is living documentation. As we discover new patterns and techniques, update this document. Every template should:

1. ✅ Follow motion principles (conversational, GSAP-driven)
2. ✅ Support pedagogy (right feeling for learning goal)
3. ✅ Maintain brand cohesion (colors, fonts, rough.js)
4. ✅ Meet quality standards (checklist validated)
5. ✅ Avoid anti-patterns (no PowerPoint, no clutter)

**When in doubt, ask:**
> "Does this help the learner understand, or is it just decoration?"

If it's just decoration, remove it. If it helps understanding, make it **bold and beautiful**.

---

**Template Philosophy:**
> *Every frame is a conversation. Every motion has purpose. Every template tells a story.*

🎬 Now go create amazing educational videos! 🚀
