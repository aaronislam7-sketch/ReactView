# Testing v5.0 Templates in Legacy Mode

## Overview
All Blueprint v5.0 templates are now available in the Legacy Mode dropdown for easy testing!

## How to Test

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Switch to Legacy Mode**:
   - Click "Switch to Legacy Mode" button (bottom-right corner)

3. **Select a v5.0 Template**:
   - Look for the **"🌟 Blueprint v5.0 Templates (NEW!)"** dropdown group
   - Select any of the 4 v5.0 templates:
     - 🚀 Hook 1A: Question Burst v5 (15s)
     - 🚀 Reflect 4A: Key Takeaways v5 (8s)
     - 🚀 Apply 3A: Micro Quiz v5 (12s)
     - 🚀 Explain 2B: Analogy v5 (12s)

4. **Verify v5.0 Features**:
   - ✅ No schema validation errors
   - ✅ Scene renders properly in player
   - ✅ Duration calculated from beats (shown in top-right corner)
   - ✅ All animations use SDK presets
   - ✅ Frame-driven (no GSAP)
   - ✅ Zero wobble in rough.js elements
   - ✅ Deterministic IDs (no random flashing)

## What's Different in v5.0

### JSON Structure
```json
{
  "schema_version": "5.0",
  "template_id": "hook_1a_v5",
  "beats": {
    "entry": 0,
    "questionReveal": 2,
    "exit": 14
  },
  "content": {
    "question": "Why does Knodovia's map look so different?"
  }
}
```

- **No `duration_s` or `fps`** at root level
- **No `timeline` array** - animations are frame-driven in component
- **Beats in seconds** - converted to frames internally
- **Content object** - structured data instead of `fill.texts`

### Template Features
- **SDK Presets**: `fadeUpIn`, `pulseEmphasis`, `shrinkToCorner`, etc.
- **EZ Easing**: `EZ.smooth`, `EZ.power2Out`, etc.
- **ID Factory**: `useSceneId()` for deterministic IDs
- **FPS Agnostic**: All timing in seconds, converted with `toFrames()`

## Schema Validation

The validation function now detects schema version and validates accordingly:

- **v5.0**: Checks for `beats`, `content`, `style_tokens`
- **v4.0**: Checks for `duration_s`, `fps`, `timeline`, `fill`

You should see **"Scene validated successfully"** with no errors for all v5.0 templates.

## Comparing v4 vs v5

Switch between old and new versions to see the difference:

| Template | v4.0 (Old) | v5.0 (New) |
|----------|------------|------------|
| Hook 1A | `hook_1a_knodovia` | `hook_1a_v5` |
| Reflect 4A | `reflect_4a_takeaways` | `reflect_4a_v5` |
| Apply 3A | `apply_3a_quiz` | `apply_3a_v5` |
| Explain 2B | `explain_2b_analogy` | `explain_2b_v5` |

## Known Issues
- None! Build passes, validation passes, all templates render properly ✨

## Next Steps
1. Test each v5.0 template in Legacy Mode
2. Verify animations are smooth and match Blueprint requirements
3. Check JSON structure matches schema v5.0
4. Confirm no console errors during playback
5. Ready to refactor more templates to v5.0!

---

**Note**: If you see any issues, check the browser console for detailed error messages.
