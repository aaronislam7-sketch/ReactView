# 🏗️ Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.jsx (Main UI)                        │
│  - Template Selector Dropdown                                    │
│  - JSON Editor (Left Panel)                                      │
│  - Remotion Player (Right Panel)                                 │
│  - Validation System                                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ├──► Loads Scenes (JSON)
                     │    └── scenes/
                     │        ├── ideas_spread.json ✨ NEW
                     │        ├── whiteboard_ted_v2.json
                     │        ├── economy_currency.json
                     │        └── ...
                     │
                     └──► Renders Templates (React Components)
                          └── templates/
                              ├── WhiteboardTEDEnhanced.jsx ✨ NEW
                              │   │
                              │   └──► Uses SDK ──┐
                              │                   │
                              ├── WhiteboardTEDv2.jsx
                              ├── TimelineSteps.jsx
                              └── TwoColumnCompare.jsx
                                                  │
                                                  ▼
                          ┌──────────────────────────────────────┐
                          │      Template SDK (src/sdk/)         │
                          ├──────────────────────────────────────┤
                          │                                      │
                          │  ┌─────────────────────────────┐    │
                          │  │ animations.js               │    │
                          │  │  • fadeIn, slideIn, etc.    │    │
                          │  │  • springAnimation          │    │
                          │  │  • pulse, wave, stagger     │    │
                          │  └─────────────────────────────┘    │
                          │                                      │
                          │  ┌─────────────────────────────┐    │
                          │  │ rough-utils.js              │    │
                          │  │  • drawSketchRect           │    │
                          │  │  • drawArrow, drawCircle    │    │
                          │  │  • Preset sketch styles     │    │
                          │  └─────────────────────────────┘    │
                          │                                      │
                          │  ┌─────────────────────────────┐    │
                          │  │ components.jsx              │    │
                          │  │  • IconCircle, Badge        │    │
                          │  │  • NumberBadge, Checkmark   │    │
                          │  │  • ConnectorLine            │    │
                          │  └─────────────────────────────┘    │
                          │                                      │
                          │  ┌─────────────────────────────┐    │
                          │  │ lottie-helpers.js           │    │
                          │  │  • Lottie configs           │    │
                          │  │  • Inline animations        │    │
                          │  └─────────────────────────────┘    │
                          │                                      │
                          └──────────────────────────────────────┘
```

---

## Data Flow

```
User Action (Select Template)
      │
      ▼
Load Corresponding Scene JSON
      │
      ▼
Parse & Validate JSON
      │
      ├──► Validation Errors? ──► Display in UI
      │
      └──► Valid? ──► Continue
                        │
                        ▼
              Map template_id to Component
                        │
                        ▼
              Render in Remotion Player
                        │
                        ▼
              Component reads scene data:
               • fill.texts
               • fill.images
               • style_tokens
               • timeline
                        │
                        ▼
              Calls SDK utilities for:
               • Animation calculations
               • Sketch drawing (canvas)
               • Reusable components
                        │
                        ▼
              Renders 20s video at 30 FPS
```

---

## Template SDK Architecture

### Layer 1: Core Utilities (Pure Functions)
```javascript
animations.js
├── Easing functions (no dependencies)
├── Spring configs (no dependencies)
└── Animation calculators (depends on Remotion)

rough-utils.js
├── Drawing functions (depends on Rough.js)
└── Canvas utilities (depends on Canvas API)

lottie-helpers.js
└── Animation helpers (depends on Lottie)
```

### Layer 2: React Components
```javascript
components.jsx
├── AnimatedText (uses animations.js)
├── IconCircle (uses animations.js)
├── NumberBadge (pure React)
└── ... (mix of pure and animated)
```

### Layer 3: Template Integration
```javascript
WhiteboardTEDEnhanced.jsx
├── Imports SDK utilities
├── Uses Remotion hooks (useCurrentFrame, etc.)
├── Renders canvas for sketches
├── Composes SDK components
└── Reads scene JSON for data
```

---

## Scene JSON Structure

```json
{
  "schema_version": "2.0",
  "template_id": "whiteboard_ted_enhanced",
  "duration_s": 20,
  "fps": 30,
  
  "meta": {
    "title": "...",
    "description": "...",
    "tags": [...]
  },
  
  "style_tokens": {
    "colors": { ... },
    "fonts": { ... }
  },
  
  "layout": {
    "canvas": { "w": 1920, "h": 1080 }
  },
  
  "fill": {
    "texts": { 
      "title": "...",
      "point1": "...",
      ...
    },
    "images": {
      "icon1": "url",
      ...
    }
  },
  
  "timeline": [
    { "t": 0, "action": "fadeIn", "target": "title", "duration": 1.0 },
    ...
  ]
}
```

---

## Animation Pipeline

```
Frame Calculation
      │
      ▼
Timeline Lookup
 (What should animate at this frame?)
      │
      ▼
SDK Animation Function
 (Calculate opacity, position, etc.)
      │
      ▼
Apply to React Component
 (via style prop)
      │
      ▼
Render Frame
      │
      ▼
Repeat for next frame (600 total for 20s @ 30fps)
```

---

## Validation Pipeline

```
User Edits JSON
      │
      ▼
Click "Apply Changes"
      │
      ▼
Parse JSON
      │
      ├──► Syntax Error? ──► Show JSON Error
      │
      └──► Valid JSON ──► Continue
                           │
                           ▼
                  Run validateScene()
                           │
                           ├──► Check required fields
                           ├──► Check template_id exists
                           ├──► Check timeline targets
                           └──► Check text lengths
                                    │
                                    ├──► Errors? ──► Display Warnings
                                    │
                                    └──► Success ──► Apply & Render
```

---

## File Dependencies

```
App.jsx
├── React
├── @remotion/player
├── Templates
│   ├── WhiteboardTEDEnhanced
│   ├── WhiteboardTEDv2
│   ├── TimelineSteps
│   └── TwoColumnCompare
└── Scenes (JSON files)

WhiteboardTEDEnhanced.jsx
├── React
├── Remotion (useCurrentFrame, useVideoConfig)
├── @lottiefiles/react-lottie-player
└── SDK
    ├── animations
    ├── rough-utils
    ├── components
    └── lottie-helpers

SDK Files
├── animations.js
│   └── Remotion (interpolate, spring)
├── rough-utils.js
│   └── roughjs
├── components.jsx
│   ├── React
│   └── animations.js
└── lottie-helpers.js
    └── (no external deps)
```

---

## Rendering Process (Detailed)

### 1. Initial Load
```
index.html
 └─► main.jsx
      └─► App.jsx
           ├─► Load default template
           ├─► Load default scene
           └─► Initialize Player
```

### 2. Frame Render (happens 30 times per second)
```
Player advances frame
      │
      ▼
WhiteboardTEDEnhanced receives new frame prop
      │
      ├──► Calculate animation progress for each element
      │     └─► SDK.animations.fadeSlide(frame, ...)
      │          returns { opacity, transform }
      │
      ├──► Update canvas (Rough.js drawings)
      │     └─► SDK.rough.drawSketchRect(...)
      │
      ├──► Render React components
      │     └─► SDK.components.IconCircle(...)
      │
      └──► Output final frame
```

### 3. User Interaction
```
User edits JSON
      │
      ▼
State updates (sceneJSON)
      │
      ▼
Click "Apply Changes"
      │
      ▼
Validate & update currentScene
      │
      ▼
Player re-renders with new scene
      │
      ▼
All animations recalculate
```

---

## SDK Extension Points

### Adding New Animations
```javascript
// 1. Add to src/sdk/animations.js
export const myNewAnimation = (frame, startFrame, duration) => {
  // Your animation logic
  return { opacity: ..., transform: ... };
};

// 2. Use in template
import { myNewAnimation } from '../sdk';
const style = myNewAnimation(frame, 0, 30);
```

### Adding New Components
```javascript
// 1. Add to src/sdk/components.jsx
export const MyComponent = ({ ... }) => {
  return <div>...</div>;
};

// 2. Use in template
import { MyComponent } from '../sdk';
<MyComponent prop={value} />
```

### Adding New Sketch Styles
```javascript
// 1. Add to src/sdk/rough-utils.js
export const SKETCH_STYLES = {
  ...existing,
  myStyle: {
    roughness: 2,
    strokeWidth: 3,
    ...
  }
};

// 2. Use in template
drawSketchRect(rc, x, y, w, h, { style: 'myStyle' });
```

---

## Performance Considerations

### Canvas Rendering
- **Strategy**: Clear and redraw each frame
- **Optimization**: Only draw visible elements
- **Impact**: Minimal (~1-2ms per frame)

### React Re-renders
- **Strategy**: Use memo for expensive calculations
- **Optimization**: Keep state minimal
- **Impact**: Negligible with current structure

### Animation Calculations
- **Strategy**: Use Remotion's interpolate (optimized)
- **Optimization**: Cache spring calculations
- **Impact**: ~0.5ms per animation

### Overall
- **Target**: 60 FPS capable (16.67ms per frame)
- **Current**: ~30 FPS default (33.33ms per frame)
- **Headroom**: Plenty for additional complexity

---

## Testing Strategy

### Manual Testing
1. ✅ Template loads without errors
2. ✅ All animations play smoothly
3. ✅ Icons load correctly
4. ✅ JSON validation works
5. ✅ Build succeeds

### Automated Testing (Future)
- [ ] Unit tests for SDK functions
- [ ] Integration tests for templates
- [ ] Visual regression tests

---

## Deployment

### Build Process
```bash
npm run build
# Generates dist/ folder with:
# - index.html
# - assets/index-[hash].js (bundled JS)
```

### Production Checklist
- ✅ All assets accessible
- ✅ Google Fonts loaded
- ✅ Icons using stable URLs
- ✅ No console errors
- ✅ Smooth playback

---

**This architecture is designed to be:**
- 🔧 **Extensible**: Easy to add new templates/utilities
- 📦 **Modular**: SDK can be used independently
- 🎨 **Maintainable**: Clear separation of concerns
- ⚡ **Performant**: Optimized rendering pipeline
