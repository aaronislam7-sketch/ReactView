# 🎥 How to View Your Videos

## Quick Answer

When you open the app (`npm run dev` → `http://localhost:3000`), you'll see video previews in **two places**:

---

## 📍 Location 1: Individual Scene Previews (Steps 1-4)

### In Each Wizard Step:

```
┌────────────────────────────────────────────────┐
│  Left Side: JSON Editor                        │
│  Right Side: VIDEO PREVIEW ← HERE!             │
│  ┌──────────────────────────────────────────┐  │
│  │                                          │  │
│  │         [▶ PLAY BUTTON]                  │  │
│  │                                          │  │
│  │      Your scene animates here!           │  │
│  │                                          │  │
│  │   (Click play or click anywhere)         │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  [✓ Approve & Continue Button]                 │
└────────────────────────────────────────────────┘
```

### What You'll See:
- **Step 1 (Hook)**: Growth Mindset question scene
- **Step 2 (Explain)**: Growth Mindset explanation scene
- **Step 3 (Apply)**: Growth Mindset practice scene
- **Step 4 (Reflect)**: Growth Mindset reflection scene

**Each preview**:
- ✅ Has play/pause controls
- ✅ Shows the full 30-second animation
- ✅ Loops automatically
- ✅ Can be scrubbed through timeline

---

## 📍 Location 2: Complete Video Preview (Step 5 - Final)

### After Approving All Scenes:

```
┌────────────────────────────────────────────────┐
│         🎉 Your Complete Video is Ready!       │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │                                          │  │
│  │         [▶ PLAY BUTTON]                  │  │
│  │                                          │  │
│  │    ALL 4 SCENES STITCHED TOGETHER        │  │
│  │    with smooth eraser transitions        │  │
│  │                                          │  │
│  │        Total: ~120 seconds               │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  Complete Video • 1920×1080 • 30 fps           │
└────────────────────────────────────────────────┘
```

**This preview shows**:
- ✅ All 4 scenes in sequence
- ✅ Smooth eraser wipe transitions
- ✅ Complete 2-minute video
- ✅ Professional, cohesive playback

---

## ⚡ Quick Shortcut

**Want to see the final video immediately?**

1. Open the wizard (it loads automatically)
2. Look for the **"⚡ Skip to Final Video"** button in the progress bar
3. Click it!
4. You'll jump straight to Step 5 with the complete video

---

## 🎬 How to Play Videos

### Method 1: Click the Play Button
- Look for the ▶ button at bottom-left of the video
- Click it to start playback

### Method 2: Click Anywhere on Video
- Click anywhere on the video player
- It will start playing automatically

### Method 3: Use Keyboard
- Click on the video first
- Press **Spacebar** to play/pause

---

## 🎮 Player Controls

Each video player has:

```
┌──────────────────────────────────────────────┐
│  [Video Preview Area]                        │
└──────────────────────────────────────────────┘
 ▶  ⏸  ⏮  ⏭  ─────●─────  🔊  ⚙  ⛶
 │   │   │   │      │       │   │  │
 Play│Restart│Timeline  Volume│Fullscreen
   Pause  Skip   Scrubber Settings
```

- **▶ Play/Pause** - Start/stop video
- **⏮ Restart** - Go back to beginning
- **Timeline** - Drag to scrub through video
- **🔊 Volume** - Adjust sound (when audio added)
- **⚙ Settings** - Playback speed options
- **⛶ Fullscreen** - Expand to full screen

---

## 🔍 What to Look For

### Individual Scenes (Steps 1-4)

**Hook Scene:**
- Big question appears
- 3 fact boxes animate in
- Challenge statement at bottom

**Explain Scene:**
- Title slides down
- Main concept box
- 4 step boxes appear sequentially
- Arrows connect them
- Summary appears

**Apply Scene:**
- Title scales in
- Scenario box appears
- 3 action steps slide in from left
- Checkmarks appear
- Outcome statement

**Reflect Scene:**
- Title fades in
- Mirror icon pulses
- 3 reflection questions appear
- Key insight box
- Next steps call-to-action

### Complete Video (Step 5)

You'll see all 4 scenes play in sequence with:
- **Eraser wipe** between Hook → Explain
- **Eraser wipe** between Explain → Apply
- **Eraser wipe** between Apply → Reflect

The eraser animation shows:
- Gray/pink eraser tool sweeping across
- Previous scene being "erased"
- Clean transition to next scene

---

## 🐛 Troubleshooting

### "I don't see any video preview"

**Check 1: Is the wizard loaded?**
- You should see "Video Creation Wizard" at the top
- Progress bar with 5 steps (Hook, Explain, Apply, Reflect, Final)

**Check 2: Look at the RIGHT side of screen**
- Left = JSON editor
- Right = Video preview

**Check 3: Browser console**
- Press F12 to open developer tools
- Check Console tab for errors
- Look for messages starting with "MultiSceneVideo rendering"

**Check 4: Try Legacy Mode**
- Click "Switch to Legacy Mode" button (bottom-right)
- This uses the simpler single-scene viewer

### "Video is black/blank"

**Solution 1: Wait a moment**
- First render can take 1-2 seconds
- Player needs to initialize

**Solution 2: Click the play button**
- Sometimes player needs manual start
- Click ▶ at bottom-left

**Solution 3: Refresh the page**
- Press F5 to reload
- Wizard will reset to Step 1

### "Player controls not showing"

**Solution: Hover over the video**
- Controls appear on hover
- They auto-hide when not in use

### "Video is too small"

**Solution 1: Use fullscreen**
- Click ⛶ button (bottom-right of player)
- Press Esc to exit

**Solution 2: Zoom browser**
- Press Ctrl + (or Cmd + on Mac)
- Increase browser zoom to 125% or 150%

---

## 📊 Expected Behavior

### When you first open the app:

1. **Wizard loads** (default mode)
2. **Step 1 is active** (Hook)
3. **Right side shows video preview** immediately
4. **Welcome banner appears** with instructions
5. **Video is ready to play** (click to start)

### As you go through steps:

1. **Each step shows its scene preview**
2. **Click "Approve & Continue"** to move forward
3. **Progress bar updates** to show completed steps
4. **Step 5 shows complete video** with all scenes

---

## ✅ Success Indicators

You'll know it's working when you see:

**Step 1-4 (Individual Scenes):**
- ✅ Video player visible on right side
- ✅ Play controls at bottom of player
- ✅ Timeline scrubber
- ✅ Scene title below player
- ✅ Duration info (e.g., "30s • 1920×1080 • 30 fps")

**Step 5 (Final Video):**
- ✅ Larger video player centered on screen
- ✅ "Your Complete Video is Ready!" message
- ✅ 4 colored boxes showing each scene
- ✅ "Edit Scene" buttons for each pillar
- ✅ Duration info showing ~120s total

---

## 🎯 Pro Tips

### Tip 1: Use the Skip Button
- Click "⚡ Skip to Final Video" to jump to Step 5
- Great for quick demos or testing

### Tip 2: Loop is Enabled
- Videos automatically loop
- Watch multiple times without replaying

### Tip 3: Scrub the Timeline
- Drag the timeline slider
- Jump to specific moments
- Preview animations at different points

### Tip 4: Edit and Preview
- Change JSON on left
- Click "Apply Changes"
- Preview updates immediately on right

### Tip 5: Go Back Anytime
- Click any step in progress bar
- Review or re-edit previous scenes
- Changes are preserved

---

## 📱 Browser Compatibility

**Recommended Browsers:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

**If video doesn't work:**
- Update your browser to latest version
- Try a different browser
- Clear cache and reload

---

## 🚀 Quick Start Reminder

```bash
# Terminal
npm install
npm run dev

# Browser
http://localhost:3000

# What you'll see:
1. Wizard interface loads
2. Right side = Video preview for Step 1 (Hook)
3. Click play button or anywhere on video
4. Watch 30-second Hook scene animate!
```

---

## 🎬 That's It!

You should now see beautiful, animated video previews for:
- ✅ Each individual scene (Steps 1-4)
- ✅ Complete stitched video (Step 5)

**Still stuck?** Check the browser console (F12) for error messages or try Legacy Mode.

**Working perfectly?** Start customizing the JSONs and creating your own content! 🎉

---

*Last updated: 2025-10-21*  
*For more help, see: README_v3.md*
