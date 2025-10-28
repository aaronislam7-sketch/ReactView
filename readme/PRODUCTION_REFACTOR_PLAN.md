# 🏗️ Production Refactor Plan

**Goal:** Make all 8 templates production-grade (9+/10)

**Current Issues (User Feedback):**
1. ❌ Wobbles still present (need to remove ALL roughness)
2. ❌ anime.js not actually used (only installed)
3. ❌ Text overlapping boxes (e.g. 3B at 2s)
4. ❌ No imagery/icons
5. ❌ No Lottie animations
6. ❌ Templates feel samey
7. ❌ Font inconsistency (should use rough.js font everywhere)
8. ❌ Transitions need work
9. ❌ Need more JSON control

---

## 🎯 Acceptance Criteria

Before marking any template as "complete", validate against:

### Production-Grade Quality
- [ ] No visual overlaps or collisions
- [ ] No text cutoff or overflow
- [ ] Clean animations (no jitter, stutter, or wobble)
- [ ] Consistent 30fps motion
- [ ] Proper z-index layering

### Animation Quality
- [ ] Lines draw on smoothly (not jittery)
- [ ] Transitions feel sleek
- [ ] anime.js used for complex motion
- [ ] Easing curves feel natural
- [ ] No sudden pops or jumps

### Visual Variety
- [ ] Each template feels visually distinct
- [ ] Imagery/icons where appropriate
- [ ] Lottie animations for key moments
- [ ] Color/layout variety across templates

### User Control (JSON)
- [ ] All key parameters in JSON
- [ ] Easy to customize without code changes
- [ ] Clear schema documentation
- [ ] Sensible defaults

### Scene Transitions
- [ ] Smooth enter/exit animations
- [ ] Optional transition styles in JSON
- [ ] No abrupt cuts
- [ ] Maintains user engagement

---

## 🔧 Technical Fixes Required

### 1. Remove ALL Wobbles/Roughness

**Current State:** rough.js with roughness: 0.6-1.0 still creates wobbles

**Fix:**
- Set ALL roughness to 0 (or close to 0, like 0.1)
- Use rough.js ONLY for shape rendering, not for wobble effect
- Preserve hand-drawn aesthetic through:
  - Slight random offsets in positioning
  - Varied stroke weights
  - Organic easing curves
  - Subtle imperfection in placement

**Files to update:**
- All 8 template files
- `roughHelpers.js` - update ROUGH_PRESETS

### 2. Actually Integrate anime.js

**Current State:** Installed but not used (we're using Remotion's interpolate)

**Fix:**
- Replace complex animations with anime.js
- Use anime.js for:
  - Stagger effects
  - Path morphing
  - Complex timeline sequences
  - Elastic/spring easings
- Keep Remotion's interpolate for simple frame-based animations

**Implementation:**
```javascript
import anime from 'animejs';

// Example: Stagger text reveal
useEffect(() => {
  if (frame === startFrame) {
    anime({
      targets: '.text-line',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(150),
      easing: 'easeOutElastic(1, .6)'
    });
  }
}, [frame]);
```

### 3. Fix Text/Box Overlaps

**Issue:** Template 3B at 2s has text overlapping box outline

**Root Causes:**
- Hardcoded positioning without accounting for text length
- Box drawn before text positioning is finalized
- No padding calculation

**Fix:**
- Add proper padding calculations
- Use text measurement API if needed
- Ensure boxes are sized to content
- Add debug outlines during development

**Specific Fix for 3B:**
- Move scenario text down by 20px
- Reduce scenario circle size slightly
- Add padding constant to JSON

### 4. Add Lottie Animation Support

**Implementation:**
```javascript
import { Lottie } from '@lottiefiles/react-lottie-player';

// In template
{scene.fill.lottie && (
  <Lottie
    src={scene.fill.lottie.src}
    style={{
      width: scene.fill.lottie.width || 200,
      height: scene.fill.lottie.height || 200,
    }}
    autoplay
    loop={scene.fill.lottie.loop || false}
  />
)}
```

**JSON Schema Addition:**
```json
{
  "fill": {
    "lottie": {
      "src": "/animations/rocket.json",
      "width": 200,
      "height": 200,
      "loop": true,
      "position": { "x": 960, "y": 540 }
    }
  }
}
```

### 5. Add Imagery/Icon Support

**Implementation:**
- Support for image URLs in JSON
- Support for emoji/unicode as simple icons
- Support for SVG icons
- Proper image loading and error handling

**JSON Schema Addition:**
```json
{
  "fill": {
    "images": [
      {
        "src": "https://example.com/icon.png",
        "x": 100,
        "y": 100,
        "width": 80,
        "height": 80,
        "fadeIn": 30
      }
    ],
    "icons": [
      {
        "emoji": "🚀",
        "x": 200,
        "y": 200,
        "size": 64,
        "fadeIn": 45
      }
    ]
  }
}
```

### 6. Standardize Fonts

**Decision:** Use rough.js aesthetic font everywhere

**Font Stack:**
```javascript
{
  primary: "'Cabin Sketch', 'Patrick Hand', cursive",
  fallback: "system-ui, -apple-system, sans-serif"
}
```

**Remove:**
- Inter
- DM Sans
- Work Sans

**Keep:**
- Cabin Sketch (primary)
- Patrick Hand (handwritten)
- Permanent Marker (emphasis)

### 7. Make Templates Visually Distinct

**Strategy:**

**Hook 1A:** Kinetic burst energy
- Rapid motion
- Star bursts
- High contrast colors
- Bouncy easing

**Hook 1E:** Mysterious fog
- Slow, gradual reveals
- Dark palette
- Particle drift
- Soft focus

**Explain 2A:** Structured breakdown
- Grid/hierarchy layout
- Clear connecting lines
- Methodical timing
- Organized feel

**Explain 2B:** Bridge analogy
- Side-by-side comparison
- Bridging animation
- Balanced symmetry
- Visual metaphor

**Apply 3A:** Quick quiz energy
- Fast-paced
- Celebration bursts
- Green/red contrast
- Immediate feedback

**Apply 3B:** Thoughtful choice
- Diverging paths
- Slower contemplative timing
- Purple/blue tones
- Decision weight

**Reflect 4A:** Clean summary
- Vertical list
- Check marks
- Affirming green
- Conclusive tone

**Reflect 4D:** Journey forward
- Left-to-right flow
- Bridge metaphor
- Optimistic orange/blue
- Forward momentum

### 8. Expand JSON Schema

**New Schema Structure:**
```json
{
  "schema_version": "4.0",
  "template_id": "hook_1a",
  "pillar": "hook",
  "variant": "1A",
  "duration_s": 20,
  "fps": 30,
  
  "meta": {
    "title": "Scene Title",
    "description": "...",
    "tags": []
  },
  
  "style_tokens": {
    "colors": {
      "bg": "#FFF9F0",
      "accent": "#E74C3C",
      "ink": "#1A1A1A"
    },
    "fonts": {
      "primary": "'Cabin Sketch', cursive",
      "size_title": 84,
      "size_body": 32
    },
    "motion": {
      "timing": "fast",  // "fast" | "medium" | "slow"
      "easing": "elastic",  // "elastic" | "smooth" | "linear"
      "stagger_delay": 150
    },
    "spacing": {
      "padding": 40,
      "gap": 20
    }
  },
  
  "layout": {
    "canvas": { "w": 1920, "h": 1080 },
    "alignment": "left",  // "left" | "center" | "right"
    "safe_area": {
      "top": 80,
      "right": 100,
      "bottom": 80,
      "left": 100
    }
  },
  
  "fill": {
    "texts": { ... },
    "images": [ ... ],
    "lottie": { ... },
    "icons": [ ... ]
  },
  
  "timeline": {
    "beats": [
      { "name": "intro", "frame": 0, "duration": 30 },
      { "name": "reveal", "frame": 30, "duration": 40 }
    ],
    "transitions": {
      "enter": "fade",  // "fade" | "slide" | "scale"
      "exit": "fade",
      "duration": 20
    }
  }
}
```

### 9. Improve Scene Transitions

**Current:** Abrupt cuts between scenes

**Fix:**
- Add transition duration to JSON
- Implement fade/slide/scale transitions
- Add transition overlap in MainComposition
- Remove eraser (or make it way better)

**Implementation:**
```javascript
// In MainComposition
{scenes.map((scene, i) => {
  const prevScene = scenes[i - 1];
  const overlap = scene.timeline?.transitions?.duration || 15;
  
  return (
    <Sequence
      key={i}
      from={startFrame - overlap}
      durationInFrames={scene.duration_s * fps + overlap}
    >
      {/* Exit transition for previous */}
      {prevScene && (
        <AbsoluteFill style={{
          opacity: interpolate(
            frame,
            [0, overlap],
            [1, 0],
            { extrapolateRight: 'clamp' }
          )
        }}>
          {/* Previous scene */}
        </AbsoluteFill>
      )}
      
      {/* Enter transition for current */}
      <AbsoluteFill style={{
        opacity: interpolate(
          frame,
          [0, overlap],
          [0, 1],
          { extrapolateRight: 'clamp' }
        )
      }}>
        {/* Current scene */}
      </AbsoluteFill>
    </Sequence>
  );
})}
```

---

## 📋 Execution Order

### Phase 1: Critical Fixes (High Priority)
1. ✅ Add debug overlay
2. ⏳ Remove ALL wobbles (roughness → 0)
3. ⏳ Fix text/box overlaps (especially 3B)
4. ⏳ Standardize fonts (rough.js aesthetic everywhere)

### Phase 2: Feature Additions (Medium Priority)
5. ⏳ Actually integrate anime.js
6. ⏳ Add Lottie support
7. ⏳ Add imagery/icon support
8. ⏳ Expand JSON schema (v4.0)

### Phase 3: Polish (Medium Priority)
9. ⏳ Make templates visually distinct
10. ⏳ Improve scene transitions
11. ⏳ Validate against acceptance criteria

### Phase 4: Documentation (Low Priority)
12. ⏳ Update all scene JSON files to v4.0 schema
13. ⏳ Create schema documentation
14. ⏳ Update QUICK_START guide

---

## 🧪 Testing Checklist

For each template, validate:

### Visual Quality
- [ ] No overlaps at ANY timestamp (test 0s, 25%, 50%, 75%, 100%)
- [ ] No text cutoff
- [ ] Proper padding/spacing
- [ ] Clean animations (no jitter)

### Animation Quality
- [ ] Lines draw smoothly
- [ ] Text fades/slides naturally
- [ ] Timing feels right (not too fast/slow)
- [ ] Easing curves appropriate

### JSON Control
- [ ] Can change all colors via JSON
- [ ] Can adjust timing via JSON
- [ ] Can modify content easily
- [ ] Defaults make sense

### Responsiveness
- [ ] Works at 1920x1080
- [ ] Elements stay within safe area
- [ ] Text doesn't overflow
- [ ] Images scale properly

---

## 🎯 Success Metrics

Template is PRODUCTION-READY when:

1. **Visual Quality: 10/10**
   - No overlaps, cutoffs, or collisions
   - Clean, smooth animations
   - Professional polish

2. **Animation Quality: 9+/10**
   - Sleek, engaging motion
   - anime.js integration working
   - Natural timing and easing

3. **User Control: 9+/10**
   - All key parameters in JSON
   - Easy customization
   - Clear documentation

4. **Visual Variety: 9+/10**
   - Each template feels distinct
   - Appropriate imagery/Lottie
   - Engaging variety

5. **Transitions: 9+/10**
   - Smooth scene-to-scene flow
   - No jarring cuts
   - Maintains engagement

---

**Status:** Plan created, ready for execution
**Next Step:** Start with Phase 1 (Critical Fixes)
