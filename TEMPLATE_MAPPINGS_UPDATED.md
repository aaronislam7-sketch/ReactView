# Template Mappings Updated ✅

**Date:** 2025-10-29  
**Status:** All 8 Blueprint v5 templates now appear in dropdown

---

## What Was Updated

### 1. App.jsx - Import Statements
Added imports for the 4 new v5 scene JSON files:
```javascript
import hook1EV5Scene from './scenes/hook_1e_mystery_v5.json';
import explain2AV5Scene from './scenes/explain_2a_breakdown_v5.json';
import apply3BV5Scene from './scenes/apply_3b_scenario_v5.json';
import reflect4DV5Scene from './scenes/reflect_4d_forward_v5.json';
```

Added imports for the 4 new v5 template components:
```javascript
import { Hook1EAmbientMystery as Hook1EV5 } from './templates/Hook1EAmbientMystery_V5';
import { Explain2AConceptBreakdown as Explain2AV5 } from './templates/Explain2AConceptBreakdown_V5';
import { Apply3BScenarioChoice as Apply3BV5 } from './templates/Apply3BScenarioChoice_V5';
import { Reflect4DForwardLink as Reflect4DV5 } from './templates/Reflect4DForwardLink_V5';
```

### 2. App.jsx - templateMap Object
Added mappings for both legacy keys and v5 template_id values:

```javascript
// Blueprint v5.0 templates (use TemplateRouter for context wrapping)
'hook_1a_v5': TemplateRouter,
'hook_1e_v5': TemplateRouter,          // ⬅️ NEW
'explain_2a_v5': TemplateRouter,       // ⬅️ NEW
'explain_2b_v5': TemplateRouter,
'apply_3a_v5': TemplateRouter,
'apply_3b_v5': TemplateRouter,         // ⬅️ NEW
'reflect_4a_v5': TemplateRouter,
'reflect_4d_v5': TemplateRouter,       // ⬅️ NEW

// Map v5.0 template_id values from JSON to TemplateRouter
'Hook1AQuestionBurst': TemplateRouter,
'Hook1EAmbientMystery': TemplateRouter,         // ⬅️ NEW
'Explain2AConceptBreakdown': TemplateRouter,    // ⬅️ NEW
'Explain2BAnalogy': TemplateRouter,
'Apply3AMicroQuiz': TemplateRouter,
'Apply3BScenarioChoice': TemplateRouter,        // ⬅️ NEW
'Reflect4AKeyTakeaways': TemplateRouter,
'Reflect4DForwardLink': TemplateRouter,         // ⬅️ NEW
```

### 3. App.jsx - sampleScenes Object
Added scene JSON mappings:

```javascript
// Blueprint v5.0 scenes
'hook_1a_v5': hook1AV5Scene,
'hook_1e_v5': hook1EV5Scene,           // ⬅️ NEW
'explain_2a_v5': explain2AV5Scene,     // ⬅️ NEW
'explain_2b_v5': explain2BV5Scene,
'apply_3a_v5': apply3AV5Scene,
'apply_3b_v5': apply3BV5Scene,         // ⬅️ NEW
'reflect_4a_v5': reflect4AV5Scene,
'reflect_4d_v5': reflect4DV5Scene      // ⬅️ NEW
```

### 4. App.jsx - Template Dropdown
Updated the v5.0 optgroup with all 8 templates:

```html
<optgroup label="🌟 Blueprint v5.0 Templates (NEW!)">
  <option value="hook_1a_v5">🚀 Hook 1A: Question Burst v5 (15s)</option>
  <option value="hook_1e_v5">🚀 Hook 1E: Ambient Mystery v5 (12s)</option>       ⬅️ NEW
  <option value="explain_2a_v5">🚀 Explain 2A: Concept Breakdown v5 (10s)</option> ⬅️ NEW
  <option value="explain_2b_v5">🚀 Explain 2B: Analogy v5 (12s)</option>
  <option value="apply_3a_v5">🚀 Apply 3A: Micro Quiz v5 (12s)</option>
  <option value="apply_3b_v5">🚀 Apply 3B: Scenario Choice v5 (11s)</option>    ⬅️ NEW
  <option value="reflect_4a_v5">🚀 Reflect 4A: Key Takeaways v5 (8s)</option>
  <option value="reflect_4d_v5">🚀 Reflect 4D: Forward Link v5 (10s)</option>   ⬅️ NEW
</optgroup>
```

---

## Complete Blueprint v5.0 Template List

All 8 templates are now available in the dropdown:

### Hook Templates
1. ✅ **Hook 1A: Question Burst v5** - Provocative question with kinetic type (15s)
2. ✅ **Hook 1E: Ambient Mystery v5** - Atmospheric mystery with fog (12s)

### Explain Templates
3. ✅ **Explain 2A: Concept Breakdown v5** - Complex concept broken into parts (10s)
4. ✅ **Explain 2B: Analogy v5** - Visual analogy comparison (12s)

### Apply Templates
5. ✅ **Apply 3A: Micro Quiz v5** - Quick knowledge check (12s)
6. ✅ **Apply 3B: Scenario Choice v5** - Real-world scenario paths (11s)

### Reflect Templates
7. ✅ **Reflect 4A: Key Takeaways v5** - Summary with key points (8s)
8. ✅ **Reflect 4D: Forward Link v5** - Learning anchor → next journey (10s)

---

## How to Use

### In Legacy Mode (App.jsx dropdown):
1. Switch to "Legacy Mode" using the button
2. Open the "Template" dropdown
3. Select any template from "🌟 Blueprint v5.0 Templates (NEW!)" group
4. The scene JSON will load automatically
5. Edit JSON or click "Apply Changes" to preview

### In Wizard Mode:
The wizard mode currently uses default scenes. To use v5 templates:
1. Navigate to the appropriate pillar step
2. Edit the JSON to use a v5 template_id:
   - `"template_id": "Hook1EAmbientMystery"`
   - `"template_id": "Explain2AConceptBreakdown"`
   - `"template_id": "Apply3BScenarioChoice"`
   - `"template_id": "Reflect4DForwardLink"`
3. Add beats instead of timeline
4. Click "Apply Changes"

---

## Template ID Reference

### Legacy Keys (for dropdown selection):
- `hook_1a_v5`, `hook_1e_v5`
- `explain_2a_v5`, `explain_2b_v5`
- `apply_3a_v5`, `apply_3b_v5`
- `reflect_4a_v5`, `reflect_4d_v5`

### v5 Template IDs (for JSON template_id field):
- `Hook1AQuestionBurst`, `Hook1EAmbientMystery`
- `Explain2AConceptBreakdown`, `Explain2BAnalogy`
- `Apply3AMicroQuiz`, `Apply3BScenarioChoice`
- `Reflect4AKeyTakeaways`, `Reflect4DForwardLink`

---

## No Errors Expected ✅

All mappings are now complete:
- ✅ Imports present for all 8 v5 templates
- ✅ Template map includes both legacy keys and v5 template_ids
- ✅ Sample scenes mapped for all 8 templates
- ✅ Dropdown shows all 8 templates in v5.0 optgroup
- ✅ TemplateRouter properly wraps v5 templates with SceneIdContext
- ✅ Validation function recognizes v5.0 schema

The templates should now appear in the dropdown and work without errors!
