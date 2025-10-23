# "Mapping the Land" - Production Guide

## Video Overview

**Module:** Welcome to Knodovia  
**Total Duration:** 160 seconds (2 min 40s)  
**Pillar Sequence:** Hook → Explain → Apply → Reflect  

**Objective:** Teach learners about Knodovia's four regions and introduce the logic of learning pillars.

---

## 🎬 Scene Breakdown

### Scene 1: HOOK (0-25s)
**File:** `hook_knodovia_map.json`  
**Template:** `HookTemplate`  
**Duration:** 25 seconds

**Content:**
- Question: "What if geography was measured in mindsets, not miles?"
- Icon: 🗺️ (map)
- 3 Sparks:
  - "Every hill represents curiosity"
  - "Rivers flow with reflection"
  - "Skylines built on mastery"
- Challenge: "Welcome to Knodovia — where learning becomes a landscape."

**Visual Notes:**
- Parchment/map aesthetic (warm cream background #FFF9F0)
- Brown/earth tones for cartography feel (#8B7355)
- Central glowing map icon
- Sparks reveal sequentially
- Challenge overlays at end

---

### Scene 2: EXPLAIN (25-95s / 70 seconds)
**File:** `explain_four_regions.json`  
**Template:** `ExplainSequentialTemplate` (NEW)  
**Duration:** 70 seconds

**Content - The Four Regions:**

1. **Learnville** (💡 Orange #FF8C42)
   - "The city of sparks. Streets hum with curiosity, every building asks 'what if?'"
   - Annotation: "where ideas are born"

2. **Reviseton** (📝 Teal #4ECDC4)
   - "Home of reflection. Learning sticks when you sketch it, explain it, teach it back."
   - Annotation: "notebooks for memory, not neatness"

3. **Evalua City** (✅ Green #86BC25)
   - "The proving ground. Test what you know and celebrate the gaps you uncover."
   - Annotation: "every answer earns XP, every mistake earns insight"

4. **Playport** (🎮 Purple #9B59B6)
   - "The coastal playground. Experimentation isn't optional — it's currency."
   - Annotation: "joyful trial-and-error"

**Summary:** "Four regions. One journey. Endless pathways."

**Visual Notes:**
- Sequential vertical reveals (NOT grid)
- Each region gets ~15-17 seconds
- Color-coded borders and badges
- Icons build on, text writes on
- Connecting lines draw between regions
- Annotations appear after main text

---

### Scene 3: APPLY (95-125s / 30 seconds)
**File:** `apply_region_quiz.json`  
**Template:** `ApplyQuizTemplate` (NEW)  
**Duration:** 30 seconds

**Content:**
- Context: "All four regions glow on the map, connected by neural pathways."
- Question: "If a Knodovian wants to reinforce what they've learned, which region should they visit?"
- Options:
  - A: Learnville
  - B: Reviseton ✓ (CORRECT)
  - C: Evalua City
  - D: Playport
- Explanation: "Exactly. Reflection turns information into understanding. That's why Knodovians never finish a journey without looking back."

**Visual Notes:**
- Question card with prominent display
- 4 options in 2x2 grid, appear sequentially
- Pause with pulse effect
- Correct answer highlights green with checkmark
- Incorrect options fade slightly
- Confetti burst on reveal
- Explanation appears at bottom

---

### Scene 4: REFLECT (125-160s / 35 seconds)
**File:** `reflect_knodovia_journey.json`  
**Template:** `ReflectTemplate`  
**Duration:** 35 seconds

**Content:**
- Title: "Your Learning Journey"
- 3 Key Insights:
  - "Every explorer travels Knodovia in their own order"
  - "Some crave the spark of Learnville, others the calm of Reviseton"
  - "What matters isn't where you start — it's that you keep moving"
- Reflection Question: "Which region calls to you first? Where does your learning journey begin?"
- Next Steps: "The map of learning is never finished. Keep exploring! 🗺️"

**Visual Notes:**
- Thought bubble icon (💭)
- Insights in vertical cards with left accent border
- Dashed-border question box
- Next steps in colored pill
- Sparkles ✨ decoration
- Soft, contemplative pacing

---

## 🎨 Visual Style Guide

### Color Palette
- **Canvas:** #FFF9F0 (warm parchment)
- **Primary Ink:** #1A1A1A (dark text)
- **Map/Cartography:** #8B7355 (earthy brown)
- **Region Colors:**
  - Learnville: #FF8C42 (orange)
  - Reviseton: #4ECDC4 (teal)
  - Evalua City: #86BC25 (green)
  - Playport: #9B59B6 (purple)

### Typography
- **Titles:** Cabin Sketch (marker font), 54-64px
- **Body:** Patrick Hand (handwritten), 24-28px
- **Labels:** Inter (clean sans-serif), 16-20px

### Animation Style
- **Write-on reveals** with 20px pen tips
- **Build-in animations** for visuals (circles, badges)
- **Sequential timing** (no overlaps)
- **Connecting lines** guide attention
- **Pulse effects** during pauses
- **Smooth camera** zoom and drift

---

## 📁 File Structure

```
/src/
  /templates/
    HookTemplate.jsx
    ExplainSequentialTemplate.jsx (NEW)
    ApplyQuizTemplate.jsx (NEW)
    ReflectTemplate.jsx
  
  /scenes/
    hook_knodovia_map.json
    explain_four_regions.json
    apply_region_quiz.json
    reflect_knodovia_journey.json
```

---

## 🚀 How to Preview

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open:** http://localhost:3000/

3. **Select from dropdown:**
   - "Hook: A Map Unlike Any Other (25s)"
   - "Explain: Four Regions Sequential (70s)"
   - "Apply: Region Quiz (30s)"
   - "Reflect: Your Journey (35s)"

4. **Or use Video Wizard** to sequence all 4 scenes together

---

## 🎯 Template Features

### ExplainSequentialTemplate
- **Purpose:** Sequential reveals (not grid)
- **Use case:** Multi-part explanations that build
- **Data structure:**
  ```json
  "regions": [
    {
      "name": "Region Name",
      "icon": "🔷",
      "color": "#FF8C42",
      "description": "Main description",
      "annotation": "optional note"
    }
  ]
  ```
- **Timing:** Auto-calculated based on number of regions
- **Supports:** 2-6 regions dynamically

### ApplyQuizTemplate
- **Purpose:** Multiple choice questions
- **Use case:** Knowledge checks, interactive quizzes
- **Data structure:**
  ```json
  "quiz": {
    "question": "Your question?",
    "optionA": "First option",
    "optionB": "Second option",
    "optionC": "Third option",
    "optionD": "Fourth option",
    "correctAnswer": "B"
  }
  ```
- **Features:** 
  - Sequential option reveals
  - Pause before answer
  - Correct answer highlights
  - Confetti effect
  - Explanation text

---

## 🎬 Voiceover Script

See original script in prompt for full narration.

**Key Timing Notes:**
- Allow 1-2 seconds for write-on animations
- Regions narration: ~15-17s each
- Quiz pause: 3-4 seconds for thinking
- Reflection: Slower, contemplative pace

---

## 🔧 Customization Options

### Adjust Duration
Change `duration_s` in scene JSON:
```json
"duration_s": 70,  // seconds
```

Template will auto-calculate beat timing.

### Change Colors
Update `style_tokens`:
```json
"style_tokens": {
  "colors": {
    "bg": "#FFF9F0",
    "accent": "#8B7355"
  }
}
```

### Modify Text Chunks
Keep phrases to 3-8 words for optimal write-on pacing.

---

## ✅ Production Checklist

- [ ] Review all 4 scenes in sequence
- [ ] Check color consistency (parchment theme)
- [ ] Verify icon display (emoji rendering)
- [ ] Test timing with voiceover script
- [ ] Confirm connecting lines draw correctly
- [ ] Validate quiz answer highlight
- [ ] Check pulse effects during pauses
- [ ] Test on different screen sizes
- [ ] Export at 1920x1080, 30fps
- [ ] Add voiceover audio track
- [ ] Include subtle sound effects (pen sounds, clicks)

---

## 🎓 What Makes This Video Work

1. **Consistent Aesthetic:** Parchment/map theme throughout
2. **Color Coding:** Each region has distinct, memorable color
3. **Sequential Build:** Information layers logically
4. **Interactive Moment:** Quiz engages viewer
5. **Personal Connection:** Reflection asks "which region calls to you?"
6. **Cinematic Flow:** Write-on animations feel hand-crafted
7. **Clear Structure:** Hook → Explain → Apply → Reflect is obvious

---

## 🚀 Next Steps

1. **Preview all scenes** individually
2. **Use Video Wizard** to sequence them
3. **Record voiceover** matching script timing
4. **Add sound effects** (optional):
   - Pen scratch sounds
   - Soft clicks for options
   - Gentle chime for correct answer
5. **Export final video**
6. **Test with learners**

---

**Video Ready!** You now have a complete, production-ready scene system for "Mapping the Land." 🗺️✨
