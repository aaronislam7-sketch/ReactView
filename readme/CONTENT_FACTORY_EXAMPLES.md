# 🏭 Content Factory Examples

## The "Content Factory" Concept

**One template + Many JSON files = Unlimited content variations**

This document shows how to create multiple scenes from the same template by just swapping JSON.

---

## 📚 Template 1: Whiteboard TED

### ✅ Shipped Example: Currency & Tides
```json
{
  "template_id": "whiteboard_ted_v1",
  "meta": { "title": "Currency Moves Like Tides" },
  "fill": {
    "texts": {
      "title": "Currency Moves Like Tides",
      "b1": "Full moon doubles value",
      "b2": "Compliment triggers a short spike",
      "b3": "Check the lunar calendar first"
    }
  }
}
```

---

### 🆕 Variation 1: Weather & Mood

```json
{
  "template_id": "whiteboard_ted_v1",
  "meta": { "title": "Weather Controls Mood" },
  "fill": {
    "texts": {
      "title": "Weather Controls Mood",
      "subtitle": "Knodovia Whiteboard — Lesson 02",
      "b1": "Rain = Mandatory singing",
      "b2": "Snow = Group hugs required",
      "b3": "Sunshine = Quiet contemplation only"
    },
    "images": {
      "image_right_large": "https://api.dicebear.com/7.x/shapes/svg?seed=rain",
      "image_right_small": "https://api.dicebear.com/7.x/shapes/svg?seed=sun"
    }
  }
}
```
**Same template, different story!**

---

### 🆕 Variation 2: Food & Status

```json
{
  "template_id": "whiteboard_ted_v1",
  "meta": { "title": "Food Determines Status" },
  "fill": {
    "texts": {
      "title": "Food Determines Status",
      "subtitle": "Knodovia Whiteboard — Lesson 03",
      "b1": "Potatoes = commoner status",
      "b2": "Mushrooms = noble class",
      "b3": "Never mix on same plate"
    },
    "images": {
      "image_right_large": "https://api.dicebear.com/7.x/shapes/svg?seed=potato",
      "image_right_small": "https://api.dicebear.com/7.x/shapes/svg?seed=mushroom"
    }
  }
}
```
**Same template, new topic!**

---

### 🆕 Variation 3: Numbers & Luck

```json
{
  "template_id": "whiteboard_ted_v1",
  "meta": { "title": "Numbers Have Feelings" },
  "fill": {
    "texts": {
      "title": "Numbers Have Feelings",
      "subtitle": "Knodovia Whiteboard — Lesson 04",
      "b1": "Seven feels happy (use freely)",
      "b2": "Thirteen gets lonely (pair it)",
      "b3": "Nine is proud (bow before saying)"
    },
    "images": {
      "image_right_large": "https://api.dicebear.com/7.x/shapes/svg?seed=seven",
      "image_right_small": "https://api.dicebear.com/7.x/shapes/svg?seed=nine"
    }
  }
}
```
**Same template, wildly different content!**

---

## 🔀 Template 2: Two-Column Compare

### ✅ Shipped Example: Compliment Tax vs Insult Discount
```json
{
  "template_id": "two_column_v1",
  "meta": { "title": "Compliment Tax vs Insult Discount" },
  "fill": {
    "texts": {
      "title": "Compliment Tax vs Insult Discount",
      "left_h1": "Compliment Tax",
      "left_h2": "2% surcharge if praise is given",
      "right_h1": "Insult Discount",
      "right_h2": "1% off per mild insult (cap 5%)"
    }
  }
}
```

---

### 🆕 Variation 1: Eye Contact Rules

```json
{
  "template_id": "two_column_v1",
  "meta": { "title": "Eye Contact: Friend vs Stranger" },
  "fill": {
    "texts": {
      "title": "Eye Contact: Friend vs Stranger",
      "left_h1": "With Friends",
      "left_h2": "3 seconds max (or it's a duel challenge)",
      "right_h1": "With Strangers",
      "right_h2": "7 seconds minimum (or it's an insult)"
    },
    "images": {
      "image_left": "https://api.dicebear.com/7.x/shapes/svg?seed=friends",
      "image_right": "https://api.dicebear.com/7.x/shapes/svg?seed=stranger"
    }
  }
}
```
**Same template, different rule comparison!**

---

### 🆕 Variation 2: Left vs Right Hand

```json
{
  "template_id": "two_column_v1",
  "meta": { "title": "Left Hand vs Right Hand Etiquette" },
  "fill": {
    "texts": {
      "title": "Left Hand vs Right Hand Etiquette",
      "left_h1": "Left Hand",
      "left_h2": "For giving gifts (lucky hand)",
      "right_h1": "Right Hand",
      "right_h2": "For receiving gifts (grateful hand)"
    },
    "images": {
      "image_left": "https://api.dicebear.com/7.x/shapes/svg?seed=lefthand",
      "image_right": "https://api.dicebear.com/7.x/shapes/svg?seed=righthand"
    }
  }
}
```
**Same template, new etiquette rule!**

---

### 🆕 Variation 3: Loud vs Quiet Restaurants

```json
{
  "template_id": "two_column_v1",
  "meta": { "title": "Loud vs Quiet Restaurants" },
  "fill": {
    "texts": {
      "title": "Loud vs Quiet Restaurants",
      "left_h1": "Loud Restaurants",
      "left_h2": "For commoners & celebrations",
      "right_h1": "Quiet Restaurants",
      "right_h2": "For nobles & negotiations"
    },
    "images": {
      "image_left": "https://api.dicebear.com/7.x/shapes/svg?seed=loud",
      "image_right": "https://api.dicebear.com/7.x/shapes/svg?seed=quiet"
    }
  }
}
```
**Same template, different context!**

---

## 📅 Template 3: Timeline / Process Steps

### ✅ Shipped Example: 5-Step Greeting Ritual
```json
{
  "template_id": "timeline_v1",
  "meta": { "title": "5-Step Greeting Ritual" },
  "fill": {
    "texts": {
      "title": "5-Step Greeting Ritual",
      "s1": "Step 1: Brow Nod",
      "s2": "Step 2: Moon Hand",
      "s3": "Step 3: Compliment",
      "s4": "Step 4: Two Paces Back",
      "s5": "Step 5: Return & Smile"
    }
  }
}
```

---

### 🆕 Variation 1: Restaurant Ordering Process

```json
{
  "template_id": "timeline_v1",
  "meta": { "title": "How to Order Food in Knodovia" },
  "fill": {
    "texts": {
      "title": "How to Order Food in Knodovia",
      "s1": "Step 1: Bow to the chef's portrait",
      "s2": "Step 2: Whisper your order",
      "s3": "Step 3: Place 3 coins (exact change)",
      "s4": "Step 4: Wait in silence",
      "s5": "Step 5: Receive with both hands"
    },
    "images": {
      "i1": "https://api.dicebear.com/7.x/shapes/svg?seed=bow",
      "i2": "https://api.dicebear.com/7.x/shapes/svg?seed=whisper",
      "i3": "https://api.dicebear.com/7.x/shapes/svg?seed=coins",
      "i4": "https://api.dicebear.com/7.x/shapes/svg?seed=wait",
      "i5": "https://api.dicebear.com/7.x/shapes/svg?seed=receive"
    }
  }
}
```
**Same template, different process!**

---

### 🆕 Variation 2: Morning Ritual

```json
{
  "template_id": "timeline_v1",
  "meta": { "title": "Knodovian Morning Routine" },
  "fill": {
    "texts": {
      "title": "Knodovian Morning Routine",
      "s1": "Step 1: Face east (sun greeting)",
      "s2": "Step 2: Count to 7 (lucky number)",
      "s3": "Step 3: Water the moon plant",
      "s4": "Step 4: Read yesterday's news",
      "s5": "Step 5: Sing the weather song"
    },
    "images": {
      "i1": "https://api.dicebear.com/7.x/shapes/svg?seed=east",
      "i2": "https://api.dicebear.com/7.x/shapes/svg?seed=seven",
      "i3": "https://api.dicebear.com/7.x/shapes/svg?seed=plant",
      "i4": "https://api.dicebear.com/7.x/shapes/svg?seed=news",
      "i5": "https://api.dicebear.com/7.x/shapes/svg?seed=song"
    }
  }
}
```
**Same template, new ritual!**

---

### 🆕 Variation 3: Disagreement Resolution

```json
{
  "template_id": "timeline_v1",
  "meta": { "title": "How to Resolve Arguments" },
  "fill": {
    "texts": {
      "title": "How to Resolve Arguments",
      "s1": "Step 1: Both parties bow",
      "s2": "Step 2: Exchange compliments",
      "s3": "Step 3: Moon hand gesture",
      "s4": "Step 4: Silent minute",
      "s5": "Step 5: Laugh together (mandatory)"
    },
    "images": {
      "i1": "https://api.dicebear.com/7.x/shapes/svg?seed=bow2",
      "i2": "https://api.dicebear.com/7.x/shapes/svg?seed=compliment2",
      "i3": "https://api.dicebear.com/7.x/shapes/svg?seed=moonhand2",
      "i4": "https://api.dicebear.com/7.x/shapes/svg?seed=silent",
      "i5": "https://api.dicebear.com/7.x/shapes/svg?seed=laugh"
    }
  }
}
```
**Same template, different scenario!**

---

## 🎯 Content Factory Math

### From 3 Templates to 100+ Scenes

```
3 Templates × 10 Topics = 30 Base Scenes
30 Scenes × 3 Variations = 90 Total Scenes
90 Scenes × 2 Languages = 180 Localized Versions
```

### Production Efficiency

**Traditional Method:**
- 30 scenes × 2 hours each = **60 hours**

**Content Factory Method:**
- 3 templates × 4 hours = 12 hours (one-time)
- 30 JSON files × 10 minutes = 5 hours (reusable)
- **Total: 17 hours** (71% time savings!)

---

## 🔄 Mix & Match Strategy

### Topic Matrix

| Template | Economy | Laws | Culture | Food | Weather | Numbers |
|----------|---------|------|---------|------|---------|---------|
| Whiteboard TED | ✅ Currency | Tax rules | Greetings | Status food | Mood | Feelings |
| Two-Column | Trade-offs | Tax vs Discount | ✅ Eye contact | Left vs Right | Rain vs Sun | Odd vs Even |
| Timeline | ✅ Trade process | Court steps | ✅ Greeting ritual | Order food | Morning | Count ritual |

**Each cell = One unique scene**

---

## 📊 Variation Strategies

### 1. **Content Swap** (Easiest)
- Keep structure, change text/images
- Example: "Currency" → "Weather"

### 2. **Timing Shift** (Medium)
- Keep content, adjust action timings
- Slower = pedagogical, Faster = recap

### 3. **Action Remix** (Advanced)
- Reorder timeline actions
- Change animation patterns

### 4. **Style Override** (Expert)
- Change colors for different modules
- Adjust fonts for tone shifts

---

## 🎨 Batch Production Workflow

### Step 1: Topic List
```
1. Economy/Currency
2. Economy/Trade
3. Laws/Tax
4. Laws/Court
5. Culture/Greetings
6. Culture/Gestures
... (100 topics)
```

### Step 2: Template Assignment
```
Topics 1-30  → Whiteboard TED
Topics 31-60 → Two-Column Compare
Topics 61-90 → Timeline Steps
Topics 91-100 → Mix (best fit)
```

### Step 3: JSON Generation
```bash
# Programmatically generate from spreadsheet
python generate_scenes.py topics.csv → 100 JSON files
```

### Step 4: Batch Preview
```bash
# Preview all scenes
npm run preview-all
```

### Step 5: Render (Future)
```bash
# Render to MP4 (Remotion Lambda)
npm run render-batch
```

---

## 🚀 Scaling Examples

### Small Scale (MVP - Now)
- 3 templates
- 3 sample scenes
- Manual JSON editing
- Browser preview

### Medium Scale (Phase 2)
- 5 templates
- 30 scenes per template = 150 total
- CSV → JSON automation
- Batch validation

### Large Scale (Phase 3)
- 10 templates
- 1000+ scenes (10 languages × 100 topics)
- CMS integration
- Cloud rendering pipeline
- A/B testing variations

---

## 💡 Creative Variations

### Tone Shifts
**Same content, different tone:**

**Playful:**
```json
{ "title": "Currency Moves Like Tides (Fun Fact!)" }
```

**Serious:**
```json
{ "title": "Currency Dynamics: Lunar Influence" }
```

**Humorous:**
```json
{ "title": "Your Money Is Moody (Just Like You)" }
```

### Difficulty Levels

**Beginner (Simple):**
```json
{
  "b1": "Full moon = double money",
  "b2": "Be nice = money goes up",
  "b3": "Check moon first"
}
```

**Advanced (Complex):**
```json
{
  "b1": "Lunar apogee triggers 2x valuation multiplier",
  "b2": "Compliment-based micro-spikes (15-min duration)",
  "b3": "Pre-transaction lunar phase verification protocol"
}
```

---

## 📈 ROI Calculation

### Cost Per Scene

**Traditional Animation:**
- Storyboard: 2h × $50/h = $100
- Animation: 4h × $75/h = $300
- Review/Edits: 1h × $50/h = $50
- **Total: $450 per scene**

**Content Factory:**
- Template (one-time): 4h × $75/h = $300
- JSON creation: 15min × $50/h = $12.50
- **Total: $12.50 per scene** (after template amortized)

**Savings: 97% per additional scene**

---

## 🎯 Real-World Use Cases

### 1. **Language Learning App**
- 50 grammar rules
- 3 template types
- 150 scenes total
- 10 languages = **1,500 localized videos**

### 2. **Employee Training**
- 20 company policies
- Same visual style
- Multiple departments
- **Consistent, scalable training**

### 3. **Educational Platform**
- 100 math concepts
- Visual consistency
- Differentiated difficulty
- **Rapid curriculum expansion**

### 4. **Social Media Content**
- Daily tips (365 scenes/year)
- Same brand template
- Minimal production time
- **High-frequency posting**

---

## ✅ Content Factory Checklist

To create a new scene variation:

- [ ] Pick a template that fits the pedagogy
- [ ] Copy existing scene JSON as starting point
- [ ] Update `meta.title` and `meta.tags`
- [ ] Replace `fill.texts` with new content
- [ ] Swap `fill.images` URLs (if needed)
- [ ] Adjust `timeline` timings (if needed)
- [ ] Validate in the app
- [ ] Preview and iterate
- [ ] Export/Render (when ready)

**Time: 10-15 minutes per variation!**

---

## 🎉 The Power of Templates

**One template = Infinite possibilities**

By separating **structure** (template) from **content** (JSON), you unlock:

✅ **Speed** - 10 minutes vs 6 hours per scene  
✅ **Consistency** - Same brand/style across all content  
✅ **Scale** - 10 scenes or 1000 scenes, same effort  
✅ **Flexibility** - Easy A/B testing and iteration  
✅ **Cost** - 97% cheaper per additional scene  

**Welcome to the content factory! 🏭**

---

*This is how you scale educational content without scaling headcount.*
