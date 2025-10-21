# 🔧 Video Preview Troubleshooting Guide

## Issue: "I Can't See the Video Previews"

### Quick Diagnostic

Run through this checklist:

```
□ Is npm run dev running?
□ Is browser open to http://localhost:3000?
□ Do you see "Video Creation Wizard" header?
□ Is there a white panel on the RIGHT side?
□ Do you see a play button (▶)?
```

If you answered **NO** to any:

---

## Problem 1: Dev Server Not Running

### Symptoms:
- Browser shows "Connection refused"
- Page won't load at all

### Solution:
```bash
# In terminal:
cd /workspace
npm run dev

# Wait for:
# ➜  Local:   http://localhost:3000/
```

---

## Problem 2: Wrong URL

### Symptoms:
- Page loads but looks wrong
- Shows file directory instead of app

### Solution:
- Make sure you're at: `http://localhost:3000`
- NOT: `http://localhost:3000/index.html`
- NOT: `file:///workspace/index.html`

---

## Problem 3: Video Player Not Visible

### Symptoms:
- Wizard loads
- Left side shows JSON editor
- Right side is blank or white

### Solution A: Wait for Loading
```
1. Give it 2-3 seconds
2. First render can be slow
3. Watch for player controls to appear
```

### Solution B: Check Browser Console
```
1. Press F12 (or Cmd+Option+I on Mac)
2. Click "Console" tab
3. Look for errors (red text)
4. Common errors:
   - "Failed to fetch" → Check dev server
   - "Component not found" → Refresh page
   - Network errors → Check internet (for images)
```

### Solution C: Force Refresh
```
1. Press Ctrl+Shift+R (Windows/Linux)
2. Press Cmd+Shift+R (Mac)
3. This clears cache and reloads
```

---

## Problem 4: Black Screen in Player

### Symptoms:
- Player controls visible
- Timeline shows
- But video area is black

### Solution A: Click Play
```
1. Click the ▶ button
2. Or click anywhere on black area
3. Video should start animating
```

### Solution B: Check Template Loading
```
1. Open browser console (F12)
2. Type: localStorage.clear()
3. Press Enter
4. Refresh page (F5)
```

### Solution C: Try Different Scene
```
1. Click "⚡ Skip to Final Video" button
2. If Step 5 works but Step 1-4 don't:
   → Individual template issue
3. If nothing works:
   → Try Legacy Mode (bottom-right button)
```

---

## Problem 5: Player Controls Missing

### Symptoms:
- Video area visible
- No play/pause buttons
- No timeline scrubber

### Solution:
```
1. Hover your mouse over the video
2. Controls appear at bottom
3. They auto-hide when mouse leaves
4. This is normal behavior
```

---

## Problem 6: Animations Not Playing

### Symptoms:
- Video loads
- Shows static image
- Nothing moves when playing

### Solution A: Check Frame Counter
```
1. Look at timeline (bottom of player)
2. Numbers should change when playing
3. If stuck at 0: Player issue
4. If moving: Animation timing issue
```

### Solution B: Verify Scene Data
```
1. Look at JSON on left side
2. Check duration_s value (should be 30)
3. Check fps value (should be 30)
4. If missing: Add them
```

### Solution C: Reset Scene
```
1. Click "Switch to Legacy Mode"
2. Select template from dropdown
3. If animations work there: Wizard issue
4. If animations don't work: Template issue
```

---

## Problem 7: Final Video Won't Load (Step 5)

### Symptoms:
- Steps 1-4 work fine
- Step 5 is blank or errors

### Solution A: Check All Scenes Loaded
```
1. Go back through Steps 1-4
2. Make sure each has valid JSON
3. Click "Apply Changes" on each
4. Return to Step 5
```

### Solution B: Check Console for Errors
```
1. Open console (F12)
2. Look for messages like:
   "MultiSceneVideo rendering with scenes"
3. Should show 4 scenes
4. If less than 4: Missing scene data
```

### Solution C: Simplify
```
1. Go to Step 1
2. Click "Approve & Continue" (don't edit)
3. Repeat for Steps 2, 3, 4
4. Use default scenes only
5. Check if Step 5 works now
```

---

## Problem 8: Eraser Transitions Not Showing

### Symptoms:
- Final video plays
- Scenes appear
- But transitions are instant cuts

### Expected Behavior:
```
You SHOULD see:
- Gray/pink eraser tool sweep across
- Previous scene being wiped away
- Smooth transition (not instant cut)

Duration: ~0.67 seconds per transition
```

### Solution:
```
This is likely working correctly!
Transitions are QUICK (20 frames = 0.67s)
Try:
1. Scrub timeline slowly
2. Look between scenes
3. You'll see brief eraser animation
```

---

## Problem 9: Images Not Loading

### Symptoms:
- Text appears
- Placeholders where icons should be
- Broken image icons

### Solution A: Check Internet
```
Images use external URLs from:
- api.dicebear.com

If offline or blocked:
- Images won't load
- Rest of video works fine
```

### Solution B: Update Image Library
```
1. Edit: src/utils/imageLibrary.js
2. Replace URLs with local images
3. Or use different CDN
```

---

## Problem 10: Performance Issues

### Symptoms:
- Video stutters
- Choppy playback
- Slow scrubbing

### Solution A: Check System Resources
```
1. Close other browser tabs
2. Close heavy applications
3. Video rendering is CPU-intensive
```

### Solution B: Reduce Quality
```
In browser console (F12):
1. Type: document.querySelector('video').playbackRate = 0.5
2. Plays at half speed (smoother)
```

### Solution C: Use Smaller Window
```
1. Reduce browser window size
2. Don't use fullscreen
3. Lower resolution = faster rendering
```

---

## Problem 11: JSON Changes Don't Apply

### Symptoms:
- Edit JSON
- Click "Apply Changes"
- Preview doesn't update

### Solution A: Check for JSON Errors
```
Look for validation messages:
- Red error box = JSON syntax error
- Yellow warning = Scene validation issue

Fix:
1. Check all brackets match { }
2. Check all quotes are paired " "
3. No trailing commas
4. Valid JSON structure
```

### Solution B: Manual Refresh
```
1. After clicking "Apply Changes"
2. Wait 1 second
3. Player should update automatically
4. If not: Refresh browser (F5)
```

---

## Emergency Fallbacks

### Fallback 1: Use Legacy Mode
```
1. Click "Switch to Legacy Mode" (bottom-right)
2. This uses simpler, more stable viewer
3. Preview individual scenes one at a time
4. Less features but more reliable
```

### Fallback 2: Direct Component Test
```
1. Go to Legacy Mode
2. Select "Whiteboard TED Enhanced"
3. If this works: Templates are fine
4. Issue is with Wizard component
```

### Fallback 3: Fresh Start
```
# Terminal:
Ctrl+C (stop dev server)
npm install
npm run dev

# Browser:
Clear cache (Ctrl+Shift+Delete)
Close all tabs
Open new tab → http://localhost:3000
```

---

## Still Not Working?

### Debug Information to Collect:

1. **Browser & Version**
   - Chrome 120? Firefox 119? Safari 17?

2. **Console Errors**
   - F12 → Console tab
   - Copy any red error messages

3. **What's Visible?**
   - Screenshot of what you see
   - Describe left vs right panels

4. **What Step?**
   - Step 1, 2, 3, 4, or 5?
   - Or Legacy Mode?

5. **Build Output**
   ```bash
   npm run build
   # Copy any errors
   ```

---

## Common Error Messages

### "Component is not defined"
```
Cause: Template not imported
Fix: Refresh page
```

### "Cannot read property 'duration_s'"
```
Cause: Scene JSON missing or malformed  
Fix: Check JSON structure, click "Apply Changes"
```

### "Failed to load module"
```
Cause: Build issue
Fix: 
  npm install
  Clear browser cache
  Restart dev server
```

### "AbsoluteFill is not defined"
```
Cause: Remotion not loaded
Fix:
  npm install remotion @remotion/player
  Restart dev server
```

---

## Working Configuration

If everything is working correctly, you should see:

```
✅ Terminal shows:
   ➜  Local:   http://localhost:3000/

✅ Browser shows:
   - "Video Creation Wizard" header
   - Progress bar with 5 steps
   - Left panel: JSON editor
   - Right panel: Video player
   - Play controls at bottom of player

✅ Console shows (F12):
   - "Remotion debug — currentScene: {...}"
   - "MultiSceneVideo rendering with scenes: {...}"
   - No red errors

✅ Video behavior:
   - Click play → Animations start
   - Smooth 30fps playback
   - Timeline scrubber works
   - Loop enabled
```

---

## Success!

Once working, you'll see beautiful animated videos at:
- **Steps 1-4**: Individual 30s scenes
- **Step 5**: Complete 120s stitched video

Enjoy creating! 🎬✨

---

*For more help: HOW_TO_VIEW_VIDEOS.md or README_v3.md*
