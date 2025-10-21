# Legacy Files

This folder contains files from the original single-scene renderer (v1/v2) that are **only used in Legacy Mode**.

## 📁 Contents

### `/legacy/templates/` - Old Templates (5 files)
These templates were part of the original implementation and are only accessible via **Legacy Mode**:

- **WhiteboardTED.jsx** - Original whiteboard template with Lottie animations
- **WhiteboardTEDv2.jsx** - Second iteration with rough.js sketches
- **WhiteboardTEDEnhanced.jsx** - Enhanced version used in v2
- **TwoColumnCompare.jsx** - Side-by-side comparison template
- **TimelineSteps.jsx** - Sequential process flow template

### `/legacy/scenes/` - Old Scene JSONs (6 files)
Sample scenes that work with the legacy templates:

- **economy_currency.json** - Currency tides explanation
- **laws_compare.json** - Tax vs discount comparison
- **culture_ritual.json** - 5-step greeting ritual
- **ideas_spread.json** - How ideas go viral
- **plant_communication.json** - Plant signaling
- **whiteboard_ted_v2.json** - Sample whiteboard scene

### `/legacy/animations/` - Animation Assets (1 file)
- **writing.json** - Lottie animation for writing effect (used in WhiteboardTED.jsx)

---

## 🔄 How to Use Legacy Mode

### Access Legacy Mode:
1. Open the app (`npm run dev` → `http://localhost:3000`)
2. Click **"Switch to Legacy Mode"** button (bottom-right corner)
3. You'll see the original single-scene editor

### In Legacy Mode:
- Select a template from the dropdown
- Edit JSON for that scene
- Preview changes in real-time
- Single scene only (no multi-scene wizard)

---

## 🆚 Legacy vs. Wizard Mode

| Feature | Legacy Mode | Wizard Mode (v3) |
|---------|-------------|------------------|
| **Templates** | 5 generic templates | 4 pillar-specific templates |
| **Scenes** | Single scene at a time | Multi-scene video (4 pillars) |
| **Workflow** | Direct JSON editing | Step-by-step wizard |
| **Output** | One 30s scene | Complete 2-min video |
| **Transitions** | N/A | Smooth eraser wipes |
| **Pedagogy** | Generic | Hook→Explain→Apply→Reflect |

---

## 🚫 Not Recommended for New Content

**These files are kept for backward compatibility only.**

For new content creation, use:
- **Wizard Mode** (default) with 4 pillar templates
- **New templates**: HookTemplate, ExplainTemplate, ApplyTemplate, ReflectTemplate
- **New scenes**: In `/src/scenes/` (4 Growth Mindset pillars)

---

## 🔧 Technical Notes

### Import Paths
Legacy templates import from:
- `../../src/sdk/` for shared utilities (animations, components)
- `../../src/utils/` for themes
- `../animations/` for local Lottie files

### Build Integration
Legacy files are included in the build and accessible via App.jsx's legacy mode toggle.

### Dependencies
- Uses same SDK as wizard mode
- Requires roughjs and lottie-player packages
- Compatible with Remotion 4.x

---

## 📚 Historical Context

**v1.0** (Original):
- Single WhiteboardTED template
- Basic JSON-driven scenes
- Lottie animations

**v2.0** (Enhanced):
- Added 4 more templates
- Improved SDK
- Better animations

**v3.0** (Current - Wizard):
- 4 pillar templates
- Multi-scene wizard
- Pedagogical alignment
- ✨ Legacy mode for backward compatibility

---

## 🗂️ File Organization

```
/legacy/
├── README.md                    ← You are here
├── templates/
│   ├── WhiteboardTED.jsx
│   ├── WhiteboardTEDv2.jsx
│   ├── WhiteboardTEDEnhanced.jsx
│   ├── TwoColumnCompare.jsx
│   └── TimelineSteps.jsx
├── scenes/
│   ├── economy_currency.json
│   ├── laws_compare.json
│   ├── culture_ritual.json
│   ├── ideas_spread.json
│   ├── plant_communication.json
│   └── whiteboard_ted_v2.json
└── animations/
    └── writing.json
```

---

**For current documentation, see**: `/readme/README_v3.md`
