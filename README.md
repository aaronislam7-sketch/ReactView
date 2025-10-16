# Remotion Scene Previewer - Knodovia MVP

A browser-based JSON-driven scene system for creating educational content variations using Remotion.

## 🎯 Goal

Showcase a content factory where you:
- Pick a template (React/Remotion composition)
- Feed a scene JSON (content + timings)
- Preview instantly in the browser with `@remotion/player`
- Swap JSON to create many variations

**No cloud rendering, no MP4s** — just a convincing preview that looks and feels like production.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
/
├── src/
│   ├── templates/
│   │   ├── WhiteboardTED.jsx          # Explainer with bullets & arrows
│   │   ├── TwoColumnCompare.jsx       # Side-by-side comparison
│   │   └── TimelineSteps.jsx          # Sequential process flow
│   ├── scenes/
│   │   ├── economy_currency.json      # Sample: Currency tides
│   │   ├── laws_compare.json          # Sample: Tax vs discount
│   │   └── culture_ritual.json        # Sample: Greeting ritual
│   ├── App.jsx                        # Main app with editor & player
│   └── main.jsx                       # Entry point
├── index.html                         # HTML with fonts
├── package.json
└── vite.config.js
```

## 🎨 Templates

### 1. Whiteboard TED
**Purpose:** Core explainer with concept + bullets + images + pointing arrows

**Actions:**
- `boardIn`, `drawText`, `drawImage`
- `characterEnter`, `arrowTo`, `underline`

**Use case:** Economy / Currency explanation

### 2. Two-Column Compare
**Purpose:** Contrast two ideas side-by-side

**Actions:**
- `drawTextL`, `drawTextR`
- `drawImageL`, `drawImageR`
- `arrowSwap`, `tick`, `cross`

**Use case:** Laws / Compliment Tax vs Insult Discount

### 3. Timeline / Process Steps
**Purpose:** Show sequence/causality

**Actions:**
- `stepIn(i)`, `connectorReveal(i→i+1)`
- `badge(i)`

**Use case:** Culture / 5-step greeting ritual

## 📋 Scene JSON Contract

All templates use the same JSON structure:

```json
{
  "schema_version": "1.0",
  "template_id": "whiteboard_ted_v1",
  "duration_s": 30,
  "fps": 30,
  "meta": {
    "title": "Scene Title",
    "tags": ["module:topic", "pedagogy:type"]
  },
  "style_tokens": {
    "colors": { "bg": "#fafafa", "accent": "#732282" },
    "fonts": { "title": { "family": "Syncopate", "size": 54 } }
  },
  "layout": { "canvas": { "w": 1920, "h": 1080 } },
  "fill": {
    "texts": { "title": "...", "b1": "..." },
    "images": { "image_right_large": "url" }
  },
  "timeline": [
    { "t": 0.5, "action": "drawText", "target": "title", "duration": 0.6 }
  ]
}
```

## ✅ Acceptance Criteria

- [x] Switch templates → preview updates immediately
- [x] Edit JSON → Apply → animation updates correctly
- [x] Validation: Missing targets show helpful errors
- [x] Baseline polish: crisp text, no overflow, arrows align
- [x] Three scenes shipped (< 30s each, cohesive brand)

## 🎬 How to Use

1. **Select a template** from the dropdown
2. **Edit the JSON** in the left panel
3. **Click "Apply Changes"** to update the preview
4. **Watch the animation** in the right panel

The player includes:
- Play/pause controls
- Timeline scrubbing
- Frame-by-frame navigation

## 🎨 Brand Style Tokens

- **Primary:** `#732282` (Knodovia purple)
- **Support:** `#86BC25` (Knodovia green)
- **Fonts:** Syncopate (headers), Permanent Marker (body)

## 🔧 Development

Built with:
- **React 18** - UI framework
- **Remotion 4** - Video rendering engine
- **Vite** - Build tool and dev server
- **@remotion/player** - Browser preview component

## 📝 License

MIT
