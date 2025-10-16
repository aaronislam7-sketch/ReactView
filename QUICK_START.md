# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd /workspace/remotion-scene-previewer
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: **http://localhost:3000**

---

## 🎯 What You'll See

### Template Switcher (Top)
Choose from 3 templates:
- **Whiteboard TED** - Explainer with bullets & arrows
- **Two-Column Compare** - Side-by-side comparison  
- **Timeline Steps** - Sequential process flow

### Left Panel: JSON Editor
- Edit scene content, timings, and actions
- Click **"Apply Changes"** to update preview
- Validation feedback shows errors/warnings

### Right Panel: Live Preview
- Real-time Remotion player
- Play/pause controls
- Scrub timeline
- Frame-by-frame navigation

---

## ✏️ Try Editing

### Change Text Content
In the JSON editor, modify any text field:
```json
"texts": {
  "title": "Your Custom Title Here",
  "b1": "Your first bullet point"
}
```

### Adjust Timing
Change when actions occur:
```json
{ "t": 2.5, "action": "drawText", "target": "title" }
```
*The `t` value is in seconds*

### Swap Images
Replace image URLs:
```json
"images": {
  "image_right_large": "https://your-image-url.svg"
}
```

---

## 🎬 Sample Scenes Included

1. **Economy/Currency** (Whiteboard TED)
   - "Currency Moves Like Tides"
   - Shows bullet points with arrows

2. **Laws/Compare** (Two-Column)
   - "Compliment Tax vs Insult Discount"
   - Side-by-side with tick/cross

3. **Culture/Ritual** (Timeline)
   - "5-Step Greeting Ritual"
   - Sequential steps with connectors

---

## ⚠️ Common Validation Errors

**"Timeline action references missing target"**
- Make sure timeline actions reference existing `fill.texts` or `fill.images` keys

**"Text field may be too long"**
- Keep text under 100 characters to prevent overflow

**"Unknown template_id"**
- Use: `whiteboard_ted_v1`, `two_column_v1`, or `timeline_v1`

---

## 🎨 Brand Colors (Knodovia)

- **Primary:** `#732282` (Purple)
- **Support:** `#86BC25` (Green)
- **Ink:** `#0e0e0e` (Near-black)
- **Background:** `#fafafa` (Off-white)

---

## 📦 Tech Stack

- React 18
- Remotion 4
- Vite (dev server)
- @remotion/player

---

**Ready to create content variations at scale! 🎉**
