# KnoMotion-Videos - Fresh Repo Migration Plan 🚀

**Date:** 2025-10-29  
**Status:** IN PROGRESS

---

## New Repository Structure

```
KnoMotion-Videos/
├── src/
│   ├── templates/          # 9 files - All v5 templates
│   ├── sdk/               # 18 files - Complete SDK
│   ├── utils/             # 3 files - Essential utils only
│   ├── components/        # 4 files - Core components
│   ├── scenes/           # 12 files - v5 scenes + examples
│   ├── App.jsx           # Cleaned version
│   ├── main.jsx
│   ├── MainComposition.jsx
│   └── global.css
├── docs/                  # Fresh documentation
│   ├── README.md
│   ├── GETTING_STARTED.md
│   ├── BLUEPRINT_V5.md
│   └── API_REFERENCE.md
├── public/               # Assets (if any)
├── package.json          # Clean dependencies
├── vite.config.js
├── .gitignore
└── README.md            # Main entry point
```

**Total Files:** ~60-70 files (lean & focused)

---

## Files to Copy

### src/templates/ (9 files)
✅ Hook1AQuestionBurst_V5.jsx
✅ Hook1EAmbientMystery_V5.jsx
✅ Explain2AConceptBreakdown_V5.jsx
✅ Explain2BAnalogy_V5.jsx
✅ Apply3AMicroQuiz_V5.jsx
✅ Apply3BScenarioChoice_V5.jsx
✅ Reflect4AKeyTakeaways_V5.jsx
✅ Reflect4DForwardLink_V5.jsx
✅ TemplateRouter.jsx (cleaned - v5 only)

### src/sdk/ (18 files - ALL)
✅ animations.js
✅ broadcastAnimations.ts
✅ broadcastEffects.tsx
✅ components.jsx
✅ easing.ts
✅ index.js
✅ lottie-helpers.js
✅ lottieIntegration.tsx
✅ motion.ts
✅ presets.jsx
✅ rough-utils.js
✅ scene.schema.ts
✅ SceneIdContext.jsx
✅ StyleTokensProvider.tsx
✅ time.ts
✅ typography.ts
✅ usePreloadAssets.ts
✅ useWriteOn.ts

### src/utils/ (3 files)
✅ theme.js
✅ roughHelpers.js
✅ imageLibrary.js

### src/components/ (4 files)
✅ VideoWizard.jsx (cleaned)
✅ MultiSceneVideo.jsx
✅ SceneTransition.jsx
✅ DebugOverlay.jsx

### src/scenes/ (12 files)
✅ hook_1a_knodovia_map_v5.json
✅ hook_1e_mystery_v5.json
✅ explain_2a_breakdown_v5.json
✅ explain_2b_analogy_v5.json
✅ apply_3a_quiz_v5.json
✅ apply_3b_scenario_v5.json
✅ reflect_4a_takeaways_v5.json
✅ reflect_4d_forward_v5.json
✅ hook_sleep_science.json (example)
✅ explain_growth_mindset.json (example)
✅ apply_growth_mindset.json (example)
✅ reflect_growth_mindset.json (example)

### src/root files (4 files)
✅ App.jsx (cleaned - v5 only)
✅ main.jsx
✅ MainComposition.jsx
✅ global.css

### Root files (3 files)
✅ package.json
✅ vite.config.js
✅ .gitignore (new)

---

## Files to Clean/Modify

### App.jsx
- Remove ALL legacy template imports
- Keep only v5 template imports
- Remove legacy templateMap entries
- Remove legacy sampleScenes entries
- Keep only v5 dropdown options

### TemplateRouter.jsx
- Remove ALL legacy template imports
- Keep only v5 templates in TEMPLATE_REGISTRY
- Simplify logic (no legacy fallbacks needed)

### VideoWizard.jsx
- Already clean, copy as-is

---

## New Documentation to Create

### README.md (main)
- Project overview
- Quick start
- Template showcase (with screenshots)
- Link to detailed docs

### docs/GETTING_STARTED.md
- Installation
- Running the dev server
- Creating your first scene
- Understanding the wizard

### docs/BLUEPRINT_V5.md
- Complete v5 specification
- Architecture overview
- Animation system
- JSON schema reference

### docs/API_REFERENCE.md
- SDK functions
- Animation presets
- Easing functions
- Template exports
- Helper utilities

---

## Migration Steps

1. ✅ Create migration plan (this file)
2. ⏳ Create new directory structure
3. ⏳ Copy v5 templates
4. ⏳ Copy complete SDK
5. ⏳ Copy essential utils
6. ⏳ Copy components
7. ⏳ Copy v5 scenes
8. ⏳ Clean and copy App.jsx
9. ⏳ Clean and copy TemplateRouter.jsx
10. ⏳ Copy root files
11. ⏳ Create fresh documentation
12. ⏳ Create .gitignore
13. ✅ Verify all imports work
14. ✅ Test build

---

## Archive Repo Naming

Current repo should be renamed to:
- **"KnoMotion-Videos-Archive"** or
- **"KnoMotion-Legacy"** or
- **"KnoMotion-Iteration-History"**

---

**Status: Ready to begin migration!** 🎬
