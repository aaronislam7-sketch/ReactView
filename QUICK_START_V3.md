# 🚀 Quick Start Guide - v3.0

## Get Running in 60 Seconds

### 1. Install & Run
```bash
npm install
npm run dev
```

### 2. Open Browser
Navigate to: **http://localhost:3000**

You'll see the **Video Creation Wizard** automatically! 🎉

---

## 🎬 Create Your First Video (5 Minutes)

### The Wizard Has 5 Steps:

#### Step 1: Hook (30s) 🎯
- **Pre-loaded**: Growth Mindset hook scene
- **Click**: "✓ Approve & Continue" to move forward
- **Or Edit**: Modify JSON to customize

#### Step 2: Explain (30s) 📚
- **Pre-loaded**: Growth Mindset explanation
- **Click**: "✓ Approve & Continue"

#### Step 3: Apply (30s) 🛠️
- **Pre-loaded**: Growth Mindset application
- **Click**: "✓ Approve & Continue"

#### Step 4: Reflect (30s) 🤔
- **Pre-loaded**: Growth Mindset reflection
- **Click**: "✓ Approve & Finish"

#### Step 5: Final Video 🎥
- **Watch**: Your complete 2-minute video!
- **Edit**: Click any "Edit Scene" button to revise
- **Enjoy**: Smooth transitions, cohesive flow

---

## ✏️ Customize Content (2 Minutes)

### Edit Any Scene:

1. **In the wizard step**, edit the JSON on the left
2. **Key fields to change**:
   ```json
   "texts": {
     "question": "Your custom question?",
     "fact1": "Your custom fact"
   }
   ```
3. **Click "Apply Changes"**
4. **Preview updates** in real-time
5. **Approve when satisfied**

---

## 🎨 Use the Image Library

### Instead of URLs:
```json
// ❌ Old way
"images": {
  "icon1": "https://very-long-url.com/image.svg"
}

// ✅ New way
"images": {
  "icon1": "img_brain"
}
```

### Available Images:
- `img_brain` - Brain icon
- `img_lightbulb` - Light bulb
- `img_rocket` - Rocket
- `img_heart` - Heart
- `img_target` - Target
- `img_plant` - Plant
- `img_puzzle` - Puzzle piece
- ...and 15+ more!

See full list in `src/utils/imageLibrary.js`

---

## 🔄 Switch Modes

### Wizard Mode (Default)
- Complete video creation
- Multi-step workflow
- Scene approval process

### Legacy Mode
- Single-scene editing
- JSON editor + preview
- Original functionality

**Switch**: Click button in bottom-right corner

---

## 📁 What's Where

### Templates
- `src/templates/HookTemplate.jsx` - Attention-grabbing
- `src/templates/ExplainTemplate.jsx` - Instructional
- `src/templates/ApplyTemplate.jsx` - Practical
- `src/templates/ReflectTemplate.jsx` - Thoughtful

### Scenes
- `src/scenes/hook_growth_mindset.json`
- `src/scenes/explain_growth_mindset.json`
- `src/scenes/apply_growth_mindset.json`
- `src/scenes/reflect_growth_mindset.json`

### Components
- `src/components/VideoWizard.jsx` - Main wizard
- `src/components/MultiSceneVideo.jsx` - Video stitching
- `src/components/SceneTransition.jsx` - Eraser effect

### Utils
- `src/utils/imageLibrary.js` - Image management
- `src/utils/visualEffects.js` - Paper texture, etc.
- `src/utils/audioEffects.js` - Sound library (future)

---

## 🎯 Common Tasks

### Change Colors
Edit in scene JSON:
```json
"style_tokens": {
  "colors": {
    "accent": "#YOUR_COLOR",
    "bg": "#BACKGROUND"
  }
}
```

### Change Text
Edit in scene JSON:
```json
"fill": {
  "texts": {
    "title": "Your Custom Title",
    "point1": "Your first point"
  }
}
```

### Add New Image to Library
Edit `src/utils/imageLibrary.js`:
```javascript
img_your_image: {
  imageId: 'img_your_image',
  description: 'What it shows',
  url: 'https://your-url.com/image.svg'
}
```

---

## 🐛 Troubleshooting

### Wizard doesn't load
- Check console for errors
- Run `npm install` again
- Clear cache, restart server

### Changes not showing
- Click "Apply Changes" button
- Check JSON is valid (no syntax errors)
- Refresh browser

### Build errors
```bash
npm run build
```
Check output for specific errors

---

## 📚 Full Documentation

- **README_v3.md** - Complete feature guide
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **ARCHITECTURE.md** - System design

---

## 🎉 You're Ready!

1. ✅ Wizard is running
2. ✅ You've seen the 4 pillars
3. ✅ You know how to edit JSONs
4. ✅ You can use the image library

**Now create amazing educational videos!** 🚀

---

## 💡 Pro Tips

1. **Start with defaults** - The Growth Mindset scenes are ready to go
2. **Edit incrementally** - Change one thing at a time, preview, approve
3. **Use imageIds** - Easier than managing URLs
4. **Watch transitions** - The eraser wipe makes it feel professional
5. **Test in legacy mode** - For quick single-scene edits

---

## 🆘 Need Help?

1. Check **README_v3.md** for detailed info
2. Review code comments in templates
3. Look at example scenes in `src/scenes/`
4. Build completes? You're good! ✅

---

**Happy Creating! 🎬✨**

*Built for Knodovia's educational mission*
