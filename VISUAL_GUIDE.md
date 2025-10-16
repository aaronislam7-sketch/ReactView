# 🎨 Visual Guide - Remotion Scene Previewer

## 📺 What You'll See

### Application Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Remotion Scene Previewer                                       │
│  JSON-driven content factory for Knodovia                       │
├─────────────────────────────────────────────────────────────────┤
│  Template: [Whiteboard TED (Economy) ▼]      30s • 30fps • 1920×1080│
├──────────────────────────────┬──────────────────────────────────┤
│                              │                                  │
│  📝 Scene JSON               │  🎬 Live Preview                 │
│                              │                                  │
│  {                           │  ┌─────────────────────────┐    │
│    "template_id": "...",     │  │                         │    │
│    "duration_s": 30,         │  │    [Video Player]       │    │
│    "fill": {                 │  │                         │    │
│      "texts": {              │  │   ▶  ═══○═════  0:15    │    │
│        "title": "..."        │  │                         │    │
│      }                       │  └─────────────────────────┘    │
│    },                        │                                  │
│    "timeline": [...]         │  Currency Moves Like Tides       │
│  }                           │  module:economy • pedagogy:analogy│
│                              │                                  │
│  [Apply Changes]             │                                  │
│                              │                                  │
│  ✓ Scene validated           │                                  │
│    successfully              │                                  │
└──────────────────────────────┴──────────────────────────────────┘
```

---

## 🎬 Template 1: Whiteboard TED

### Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│             Currency Moves Like Tides                       │
│             Knodovia Whiteboard — Lesson 01                 │
│                                                             │
│  • Full moon doubles value           ┌─────────────┐       │
│                                       │             │       │
│  • Compliment triggers a              │ Moon Chart  │       │
│    short spike                        │             │       │
│                                       └─────────────┘       │
│  • Check the lunar calendar                                 │
│    first                              ┌─────────┐           │
│                                       │  Wave   │           │
│                  ↗                    └─────────┘           │
│    👤 ───────────                                           │
│  Teacher                                                    │
└─────────────────────────────────────────────────────────────┘
```

### Animation Sequence
1. **0.0s** - Board slides in
2. **0.4s** - Title draws in
3. **0.8s** - Subtitle appears
4. **1.0s** - Character enters from bottom
5. **1.0s** - First bullet slides in → Arrow points to it
6. **2.0s** - Large image (moon chart) scales in
7. **2.8s** - Small image (wave) scales in
8. **6.5s** - Second bullet slides in
9. **11.0s** - Arrow points to moon chart
10. **14.0s** - Third bullet slides in → Arrow points to it

### Use Cases
- Core concept explanations
- Bullet-point pedagogy
- Visual reinforcement with images
- Teacher-led walkthroughs

---

## 🎬 Template 2: Two-Column Compare

### Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         Compliment Tax vs Insult Discount                   │
│                                                             │
│  ┌─────────────────────────┬─────────────────────────┐    │
│  │   Compliment Tax        │   Insult Discount       │    │
│  │                         │                         │    │
│  │     😊                  │     😠                  │    │
│  │                         │                         │    │
│  │  2% surcharge if        │  1% off per mild        │    │
│  │  praise is given ✓      │  insult (cap 5%) ✗      │    │
│  │                         │                         │    │
│  │  [HIGHLIGHTED]          │                         │    │
│  └─────────────────────────┴─────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Animation Sequence
1. **0.3s** - Title appears
2. **1.0s** - Left heading "Compliment Tax"
3. **1.2s** - Left description
4. **1.6s** - Left image (smile)
5. **3.2s** - Right heading "Insult Discount"
6. **3.4s** - Right description
7. **3.8s** - Right image (grimace)
8. **5.5s** - Focus highlight on left column
9. **7.0s** - Focus swaps to right column
10. **9.0s** - Tick mark on left description
11. **9.6s** - Cross mark on right description

### Use Cases
- Compare/contrast learning
- Law vs consequence
- Custom vs faux pas
- Pro/con analysis
- Side-by-side evaluation

---

## 🎬 Template 3: Timeline / Process Steps

### Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                5-Step Greeting Ritual                       │
│                                                             │
│   ●────→●────→●────→●────→●⭐                              │
│   │     │     │     │     │                                │
│   1     2     3     4     5                                │
│                                                             │
│  Step 1:    Step 2:    Step 3:    Step 4:    Step 5:      │
│  Brow Nod   Moon Hand  Compliment Two Paces  Return &      │
│                                    Back       Smile        │
│                                                             │
│             ○ ○ ○ ○ ●  (Progress dots)                     │
└─────────────────────────────────────────────────────────────┘
```

### Animation Sequence
1. **0.4s** - Title appears
2. **1.0s** - Step 1 circle scales in
3. **2.0s** - Connector arrow 1→2 reveals
4. **2.2s** - Step 2 circle scales in
5. **3.2s** - Connector arrow 2→3 reveals
6. **3.4s** - Step 3 circle scales in
7. **4.4s** - Connector arrow 3→4 reveals
8. **4.6s** - Step 4 circle scales in
9. **5.6s** - Connector arrow 4→5 reveals
10. **5.8s** - Step 5 circle scales in
11. **7.0s** - Badge (star) spins onto Step 5

### Use Cases
- Sequential processes
- Step-by-step rituals
- Workflow visualization
- Causality chains
- Tutorial sequences

---

## 🎨 Color Palette (Knodovia Brand)

```
Background:     #fafafa  ░░░░░░░░░░  (Off-white)
Board:          #fff     ██████████  (Pure white)
Board Stroke:   #e8e8e8  ▒▒▒▒▒▒▒▒▒▒  (Light gray)
Ink:            #0e0e0e  ██████████  (Near-black)
Accent:         #732282  ██████████  (Purple)
Support:        #86BC25  ██████████  (Green)
```

---

## 📝 JSON Editor Features

### Syntax Highlighting
- Monospace font (Monaco/Consolas)
- Line numbers visible
- JSON-friendly spacing

### Validation Indicators

**✅ Success State:**
```
┌─────────────────────────────┐
│ ✓ Scene validated           │
│   successfully              │
└─────────────────────────────┘
```

**⚠️ Warning State:**
```
┌─────────────────────────────┐
│ ⚠ Text field "title" may    │
│   be too long (127 chars).  │
│   Consider shortening.      │
└─────────────────────────────┘
```

**❌ Error State:**
```
┌─────────────────────────────┐
│ JSON Error:                 │
│ Unexpected token } at       │
│ line 15                     │
│                             │
│ ⚠ Timeline action 3         │
│   references missing        │
│   target: "b4"              │
└─────────────────────────────┘
```

---

## 🎮 Player Controls

### Control Bar
```
┌─────────────────────────────────┐
│  ▶  ⏸  ⏮  ⏭  🔊  ═══○═══  0:15 │
└─────────────────────────────────┘

▶  = Play
⏸  = Pause
⏮  = Previous frame
⏭  = Next frame
🔊 = Volume
═══○═══ = Scrub timeline
0:15 = Current time
```

### Keyboard Shortcuts
- `Space` - Play/Pause
- `←` / `→` - Previous/Next frame
- Click timeline to jump to position

---

## 📊 Responsive Preview

### Desktop View (Optimal)
```
Browser: ████████████████████████████████████
         ┌──────────┬──────────────────┐
         │  Editor  │   Preview        │
         │   45%    │     55%          │
         └──────────┴──────────────────┘
```

### Preview Scaling
- Player maintains 16:9 aspect ratio
- Scales to fit container
- Max width: 960px (for 1920×1080 content)
- Responsive on smaller screens

---

## 🔄 Workflow

### 1. Select Template
```
[Whiteboard TED ▼]
  ├─ Whiteboard TED (Economy)
  ├─ Two-Column Compare (Laws)
  └─ Timeline Steps (Culture)
```

### 2. Edit JSON
- Modify text content
- Change timings (`t` values)
- Swap image URLs
- Add/remove actions

### 3. Apply Changes
```
[Apply Changes] → Validates → Updates Preview
```

### 4. Preview & Iterate
- Play animation
- Scrub timeline
- Check timing
- Repeat edit cycle

---

## 🎯 Quick Edits Examples

### Change Title
```json
"texts": {
  "title": "Your New Title Here"
}
```

### Adjust Timing
```json
{ "t": 3.5, "action": "drawText", "target": "title" }
      ↑
  Delay by 3.5 seconds
```

### Swap Image
```json
"images": {
  "image_right_large": "https://new-image-url.svg"
}
```

### Add Action
```json
"timeline": [
  { "t": 8.0, "action": "drawText", "target": "b4", "duration": 0.8 }
]
```

---

## 📐 Canvas Dimensions

All templates render at:
- **Width:** 1920px
- **Height:** 1080px
- **Aspect Ratio:** 16:9
- **Frame Rate:** 30 fps
- **Default Duration:** 30 seconds (900 frames)

---

## 🎨 Font Rendering

### Syncopate (Titles)
```
CURRENCY MOVES LIKE TIDES
━━━━━━━━━━━━━━━━━━━━━━━━━
Weight: 700 (Bold)
Size: 54px
```

### Syncopate (Subtitles)
```
Knodovia Whiteboard — Lesson 01
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Weight: 400 (Regular)
Size: 28px
```

### Permanent Marker (Body)
```
• Full moon doubles value
  ─────────────────────────
  Weight: 400
  Size: 34px
  Style: Handwritten
```

---

## 🚀 Performance

- **Initial Load:** < 2s
- **Template Switch:** Instant
- **JSON Apply:** < 100ms
- **Validation:** < 50ms
- **Preview Update:** < 200ms
- **Scrubbing:** 60fps smooth

---

## ✨ Polish Details

### Animations
- Spring-based entrance (bouncy feel)
- Smooth interpolations
- Consistent easing
- No jank or stuttering

### Text Rendering
- Crisp at all sizes
- No overflow (max 100 chars warning)
- Proper wrapping
- Anti-aliased

### Image Handling
- Scale animations preserve aspect ratio
- Center-aligned in containers
- Fallback for missing images
- SVG support

### Arrow Alignment
- Dynamically calculated positions
- Smooth arrowhead rendering
- Accurate target pointing
- Animated reveal

---

This visual guide helps you understand the layout, structure, and behavior of each template in the Remotion Scene Previewer! 🎬
