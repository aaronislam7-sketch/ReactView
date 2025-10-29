# 🚀 Quick Start: Rough.js Templates

**All 8 templates are ready to use!** Here's how to get started.

---

## ⚡ 3-Minute Start

### 1. **Preview Templates**

Server is running at: `http://localhost:3000/`

**Select:** "🎨 NEW: Rough.js Templates (9+/10)" from the dropdown

**Try these first:**
- 🔥 **Hook 1A** - Kinetic question with underlines and stars
- ✅ **Apply 3A** - Quick quiz with celebration burst
- 💡 **Reflect 4A** - Clean takeaway list with check marks

### 2. **Customize a Scene**

Edit any scene file in `/src/scenes/`:

```bash
# Example: Customize the Question Burst hook
nano src/scenes/hook_1a_knodovia_map.json
```

**Change the text:**
```json
{
  "fill": {
    "texts": {
      "questionPart1": "What if learning",
      "questionPart2": "was an adventure?",
      "subtitle": "Let's explore together..."
    }
  }
}
```

**Save and refresh** - your changes appear instantly!

### 3. **Adjust Colors**

```json
{
  "style_tokens": {
    "colors": {
      "bg": "#FFF9F0",      // Background
      "accent": "#E74C3C",   // Primary accent (red)
      "accent2": "#E67E22",  // Secondary (orange)
      "ink": "#1A1A1A"       // Text color
    }
  }
}
```

**Pro tip:** Use warm colors (red, orange, yellow) for energy, cool colors (blue, purple) for calm.

---

## 🎨 Template Picker

### Need to Hook Attention? (Start a lesson)

**Use Hook 1A (Question Burst)** when you want:
- Bold, provocative question
- High energy entrance
- Kinetic, dynamic feel
- **Duration:** 10-20s

**Use Hook 1E (Ambient Mystery)** when you want:
- Mysterious, intriguing atmosphere
- Slow, thoughtful build
- Fog and whispers
- **Duration:** 12-18s

---

### Need to Explain a Concept?

**Use Explain 2A (Concept Breakdown)** when you have:
- 1 main concept → 2-4 parts
- Hierarchical structure
- "X is made of Y, Z, A..."
- **Duration:** 20-40s

**Use Explain 2B (Analogy)** when you want:
- Side-by-side comparison
- "X is like Y because..."
- Bridge familiar → new
- **Duration:** 18-35s

---

### Need to Apply Knowledge?

**Use Apply 3A (Micro Quiz)** when you want:
- Quick knowledge check
- 2-4 multiple choice options
- Instant feedback + celebration
- **Duration:** 12-25s

**Use Apply 3B (Scenario Choice)** when you want:
- Decision point with paths
- "What would you do?"
- Show consequences
- **Duration:** 20-35s

---

### Need to Reflect & Wrap Up?

**Use Reflect 4A (Key Takeaways)** when you want:
- Summarize 2-4 key points
- Clean, numbered list
- Affirming, clear tone
- **Duration:** 18-30s

**Use Reflect 4D (Forward Link)** when you want:
- Connect to next lesson
- Show journey progression
- "Now that X... next Y..."
- **Duration:** 15-25s

---

## 🎯 Common Use Cases

### Use Case 1: "Quick Lesson Intro"
```
Hook 1A (15s) → Explain 2A (25s) → Apply 3A (15s)
Total: ~55 seconds
```

### Use Case 2: "Deep Dive Explanation"
```
Hook 1E (15s) → Explain 2B (30s) → Apply 3B (25s) → Reflect 4A (20s)
Total: ~90 seconds
```

### Use Case 3: "Mini Module with Forward Link"
```
Hook 1A (15s) → Explain 2A (30s) → Apply 3A (15s) → Reflect 4D (20s)
Total: ~80 seconds (sets up next module)
```

---

## 🔧 Customization Quick Reference

### Text Content

Each template has specific text fields. Check the structure:

```bash
# See what text fields are available
cat src/scenes/hook_1a_knodovia_map.json | grep -A 10 '"fill"'
```

**Common fields:**
- `texts.questionPart1`, `texts.questionPart2` (Hook 1A)
- `texts.whisper`, `texts.question`, `texts.hint` (Hook 1E)
- `concept.title`, `concept.concept`, `concept.parts[]` (Explain 2A)
- `analogy.familiar`, `analogy.newConcept`, `analogy.connection` (Explain 2B)
- `quiz.question`, `quiz.options[]`, `quiz.correctIndex` (Apply 3A)
- `scenario.scenario`, `scenario.choices[]` (Apply 3B)
- `reflection.takeaways[]` (Reflect 4A)
- `forward.current`, `forward.next`, `forward.cta` (Reflect 4D)

### Duration

```json
{
  "duration_s": 20,  // Adjust between min/max for template
  "fps": 30          // Keep at 30 for smooth motion
}
```

**Template ranges:**
- Hook 1A: 10-20s
- Hook 1E: 12-18s
- Explain 2A: 20-40s
- Explain 2B: 18-35s
- Apply 3A: 12-25s
- Apply 3B: 20-35s
- Reflect 4A: 18-30s
- Reflect 4D: 15-25s

### Colors

**Light backgrounds (default):**
```json
"bg": "#FFF9F0"   // Warm cream
"bg": "#FAFBFC"   // Cool white
```

**Dark backgrounds (mystery):**
```json
"bg": "#1A1F2E"   // Dark blue
"bg": "#1A1A1A"   // Pure black
```

**Accent colors:**
```json
"accent": "#E74C3C"   // Red (energy, alert)
"accent": "#2E7FE4"   // Blue (trust, calm)
"accent": "#27AE60"   // Green (success, growth)
"accent": "#8E44AD"   // Purple (mystery, reflect)
"accent": "#E67E22"   // Orange (warmth, transition)
```

---

## 💡 Pro Tips

### 1. **Match Tone to Content**

**High energy content?** → Use warm colors (red, orange, yellow)
**Calm, thoughtful?** → Use cool colors (blue, purple)
**Success/growth?** → Use green

### 2. **Duration = Pacing**

**Fast-paced lesson?** → Use minimum durations (10s hook, 12s quiz)
**Deep dive?** → Use maximum durations (20s hook, 40s explain)

### 3. **Combine Templates**

Create a full lesson by sequencing:
1. **Hook** - Grab attention (10-20s)
2. **Explain** - Teach concept (20-40s)
3. **Apply** - Test knowledge (12-35s)
4. **Reflect** - Solidify learning (15-30s)

**Total:** 60-120 seconds per mini-module

### 4. **Roughness is Subtle**

All templates use roughness 0.6-1.0 for subtle sketch feel.
**Don't increase it!** Higher values = jittery chaos.

### 5. **Preview Before Committing**

Always preview in the dev server before recording/exporting.
Motion can look different from static previews!

---

## 🐛 Troubleshooting

### "Template not showing up"

**Check:**
1. Is the scene file in `/src/scenes/`?
2. Is it imported in `/src/App.jsx`?
3. Is the `template_id` correct?

### "Lines are too jittery"

**Don't increase roughness!** Use these approved ranges:
- Lines: 0.6-1.0
- Circles: 0.5-0.8
- Rectangles: 0.7-1.0

### "Text is cut off"

**Adjust padding or fontSize:**
```json
// In the template component, or adjust text length
"questionPart1": "Shorter text works better"
```

### "Colors don't match my brand"

**Override in scene JSON:**
```json
{
  "style_tokens": {
    "colors": {
      "bg": "#YOUR_BG",
      "accent": "#YOUR_ACCENT",
      "ink": "#YOUR_TEXT"
    }
  }
}
```

---

## 📚 Next Steps

1. **Preview all 8 templates** - Get familiar with each style
2. **Clone a scene JSON** - Copy `hook_1a_knodovia_map.json` → `my_hook.json`
3. **Customize content** - Edit text, colors, duration
4. **Test in preview** - See it live before recording
5. **Build a sequence** - Combine 3-4 templates for a full lesson

---

## 🎉 You're Ready!

All 8 templates are production-ready with:
- ✅ Hand-drawn sketch aesthetic (rough.js)
- ✅ Subtle roughness (no jitter)
- ✅ Kinetic, varied motion
- ✅ Full customization via JSON
- ✅ 9+/10 quality (user-approved)

**Start creating!** 🚀

---

**Questions?** Check `/workspace/ALL_8_TEMPLATES_COMPLETE.md` for full technical details.
