# Testing Blueprint v5.0 Templates

**How to test the refactored v5.0 templates in the scene viewer**

---

## 🎯 What Changed

We've added a **TemplateRouter** that automatically loads v5.0 templates based on the `template_id` in your JSON.

**Before:** Scene viewer only loaded legacy templates  
**After:** Scene viewer automatically routes to v5.0 templates when `template_id` matches

---

## 🚀 How to Test

### **Option 1: Edit JSON in Scene Viewer**

1. **Open your dev server** (should already be running)
2. **Navigate to the scene viewer**
3. **Edit the JSON** for any pillar and change the `template_id`:

**Example - Test Hook1A v5.0:**
```json
{
  "schema_version": "5.0",
  "scene_id": "hook1a",
  "template_id": "Hook1AQuestionBurst",
  "pillar": "hook",
  "beats": {
    "entrance": 0.6,
    "questionPart1": 0.6,
    "moveUp": 2.0,
    "questionPart2": 2.8,
    "emphasis": 4.2,
    "wipeQuestions": 5.5,
    "mapReveal": 6.5,
    "transformMap": 9.0,
    "welcome": 10.0,
    "subtitle": 12.0,
    "exit": 15.0
  },
  "style_tokens": {
    "mode": "notebook",
    "colors": {
      "bg": "#FFF9F0",
      "accent": "#E74C3C",
      "accent2": "#E67E22",
      "ink": "#1A1A1A"
    }
  },
  "fill": {
    "texts": {
      "questionPart1": "What if geography",
      "questionPart2": "was measured in mindsets?",
      "welcome": "Welcome to Knodovia",
      "subtitle": "A place where your perspective shapes the landscape..."
    }
  }
}
```

4. **Click "Update & Preview"**
5. **You should see the v5.0 template render!**

---

### **Option 2: Load v5.0 JSON Files Directly**

Use the JSON file selector in the scene viewer and load one of these files:

**Available v5.0 JSONs:**
- `src/scenes/hook_1a_knodovia_map_v5.json` → Hook1A (question burst + map)
- `src/scenes/reflect_4a_takeaways_v5.json` → Reflect4A (key takeaways list)
- `src/scenes/apply_3a_quiz_v5.json` → Apply3A (micro quiz with countdown)
- `src/scenes/explain_2b_analogy_v5.json` → Explain2B (side-by-side analogy)

---

## 📋 Template Registry

The **TemplateRouter** automatically loads these templates:

| template_id | Component | Schema | Status |
|-------------|-----------|--------|--------|
| `Hook1AQuestionBurst` | Hook1AQuestionBurst_V5.jsx | v5.0 | ✅ Ready |
| `Reflect4AKeyTakeaways` | Reflect4AKeyTakeaways_V5.jsx | v5.0 | ✅ Ready |
| `Apply3AMicroQuiz` | Apply3AMicroQuiz_V5.jsx | v5.0 | ✅ Ready |
| `Explain2BAnalogy` | Explain2BAnalogy_V5.jsx | v5.0 | ✅ Ready |
| `hook` | HookTemplate.jsx | v3/v4 | Legacy |
| `explain` | ExplainTemplate.jsx | v3/v4 | Legacy |
| `apply` | ApplyTemplate.jsx | v3/v4 | Legacy |
| `reflect` | ReflectTemplate.jsx | v3/v4 | Legacy |

---

## 🔍 How to Know It's Working

### **Visual Differences (v5.0 templates):**

**Hook1A:**
- Question parts animate with fadeUpIn preset
- Map shrinks to corner with shrinkToCorner preset
- "Welcome to Knodovia" pulses and breathes
- All rough.js has strict zero wobble

**Reflect4A:**
- Takeaways stagger in (1.2s intervals)
- Each takeaway pulses for emphasis
- Number circles draw around numbers
- Clean, professional appearance

**Apply3A:**
- Countdown timer with animated circle
- Options pop in with spring physics
- Correct answer reveals with pulse + celebration burst
- Frame-driven countdown (no state bugs)

**Explain2B:**
- Side-by-side frames appear
- Both sides shrink to corners simultaneously
- Connection text reveals in center
- Decorative emphasis circles

---

## 🧪 Testing Checklist

### **For Each v5.0 Template:**

1. **Load the template:**
   - [ ] Edit JSON with correct `template_id`
   - [ ] OR load the _v5.json file directly

2. **Verify Blueprint compliance:**
   - [ ] Animations are smooth (no jitter)
   - [ ] Timing is correct (beats from JSON)
   - [ ] Strict zero wobble (no randomness)
   - [ ] Mode switching works (notebook/whiteboard)

3. **Test FPS changes:**
   - [ ] Change fps from 30 to 60
   - [ ] Verify duration stays the same (frame count doubles)

4. **Check console:**
   - [ ] No errors about missing presets
   - [ ] No warnings about useEffect dependencies
   - [ ] TemplateRouter logs which template loaded

---

## 🐛 Troubleshooting

### **"Template not found" or using legacy template:**

**Problem:** JSON still has old `template_id` like `"hook_1a"` or `"apply_3a"`  
**Solution:** Update to v5.0 `template_id`:
- `"hook_1a"` → `"Hook1AQuestionBurst"`
- `"apply_3a"` → `"Apply3AMicroQuiz"`
- `"reflect_4a"` → `"Reflect4AKeyTakeaways"`
- `"explain_2b"` → `"Explain2BAnalogy"`

### **"duration_s is undefined" error:**

**Problem:** v5.0 schema removed `duration_s` field  
**Solution:** Two options:
1. **Quick fix:** Add `"duration_s": 15` to JSON temporarily
2. **Proper fix:** Update VideoWizard to calculate duration from `beats.exit`

### **Animations don't work:**

**Problem:** Missing SDK imports or preset errors  
**Solution:** Check console for specific error, likely:
- `toFrames is not defined` → Check SDK exports
- `fadeUpIn is not a function` → Check preset imports
- `useSceneId is not defined` → Check SceneIdContext import

---

## 📝 Quick Test Commands

```bash
# Ensure dev server is running
npm run dev

# Open browser
# Navigate to: http://localhost:3000

# In scene viewer:
# 1. Select a pillar (Hook, Explain, Apply, or Reflect)
# 2. Click "Edit JSON"
# 3. Paste a v5.0 JSON (see examples above)
# 4. Click "Update & Preview"
# 5. Watch the magic! ✨
```

---

## 🎉 Success Indicators

**You'll know v5.0 templates are working when:**

✅ Console shows: `"Loading Blueprint v5.0 template: Hook1AQuestionBurst"`  
✅ Animations use presets (smooth, professional motion)  
✅ No wobble in rough.js shapes  
✅ Countdown timer works smoothly (Apply3A)  
✅ Map shrinks to corner correctly (Hook1A)  
✅ Takeaways stagger beautifully (Reflect4A)  
✅ Sides shrink simultaneously (Explain2B)  

---

## 🔗 Related Files

- `src/templates/TemplateRouter.jsx` - Routing logic
- `src/sdk/SceneIdContext.jsx` - ID factory context
- `src/sdk/presets.js` - Animation presets
- `src/sdk/easing.ts` - EZ easing map
- `Template_blueprint_V5.md` - Full blueprint specification

---

**Need help?** Check the console logs - TemplateRouter will tell you which template it loaded!
