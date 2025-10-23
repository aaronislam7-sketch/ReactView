# Knode Scene System - Quick Start Guide

## 🎨 The Knode Aesthetic

**Feel:** Like a brilliant teacher sketching ideas on a digital whiteboard
**Tone:** Smart, conversational, human
**Motion:** Alive but effortless — breathing, not jittery
**Style:** 70% indie charm, 30% studio polish

## 📚 Four Pedagogical Pillars

### 1. Hook (30-35s)
**Purpose:** Grab attention, pose questions, create curiosity

**Content Structure:**
```json
{
  "template_id": "hook",
  "fill": {
    "texts": {
      "question": "Your intriguing question here",
      "emoji": "🧠",
      "fact1": "First curiosity spark",
      "fact2": "Second curiosity spark", 
      "fact3": "Third curiosity spark",
      "challenge": "The 'what if' moment"
    }
  }
}
```

**Best for:** Opening questions, surprising facts, provocative statements

### 2. Explain (30-35s)
**Purpose:** Build understanding step by step

**Content Structure:**
```json
{
  "template_id": "explain",
  "fill": {
    "texts": {
      "title": "What you're explaining",
      "concept": "Core idea in one line",
      "step1": "First building block",
      "step2": "Second building block",
      "step3": "Third building block",
      "step4": "Fourth building block",
      "summary": "The 'aha' insight"
    }
  }
}
```

**Best for:** Concepts, processes, frameworks, breakdowns

### 3. Apply (30-35s)
**Purpose:** Show how the idea works in context

**Content Structure:**
```json
{
  "template_id": "apply",
  "fill": {
    "texts": {
      "scenario": "Here's the situation",
      "action1": "First step of application",
      "action2": "Second step of application",
      "action3": "Third step of application",
      "result": "What happens when you apply it"
    }
  }
}
```

**Best for:** Real scenarios, demonstrations, practical examples

### 4. Reflect (30-35s)
**Purpose:** Recap, reinforce, challenge learners

**Content Structure:**
```json
{
  "template_id": "reflect",
  "fill": {
    "texts": {
      "title": "What we're reflecting on",
      "insight1": "Key takeaway #1",
      "insight2": "Key takeaway #2",
      "insight3": "Key takeaway #3",
      "question": "Thought-provoking question",
      "nextSteps": "Call to action"
    }
  }
}
```

**Best for:** Consolidation, metacognition, next steps

## 🎨 Color Schemes by Pillar

```javascript
// Hook - Energetic, attention-grabbing
colors: {
  bg: "#FAFBFC",      // Light canvas
  accent: "#E74C3C",   // Red marker
  support: "#E67E22",  // Orange
  highlight: "#F39C12" // Yellow
}

// Explain - Clear, educational
colors: {
  bg: "#FAFBFC",
  accent: "#2E7FE4",   // Blue marker
  support: "#27AE60",  // Green
  highlight: "#E8F4FD" // Light blue
}

// Apply - Practical, action-oriented
colors: {
  bg: "#FFF9F0",       // Warm canvas
  accent: "#27AE60",   // Green marker
  support: "#2E7FE4",  // Blue
  highlight: "#E8F8F2" // Light green
}

// Reflect - Thoughtful, introspective
colors: {
  bg: "#FFF9F0",
  accent: "#8E44AD",   // Purple marker
  support: "#2E7FE4",  // Blue
  highlight: "#F3EBFA" // Light purple
}
```

## ✍️ Typography Patterns

```javascript
// For emphasis and personality
fonts: {
  marker: {
    primary: "'Permanent Marker', cursive",
    secondary: "'Cabin Sketch', cursive",
    handwritten: "'Patrick Hand', cursive"
  },
  // For structure and readability
  structure: {
    primary: "'Inter', sans-serif",
    secondary: "'DM Sans', sans-serif"
  }
}
```

**Usage:**
- **Titles/Questions:** Cabin Sketch (64-72px)
- **Body text:** Patrick Hand (32-38px)
- **Labels:** Inter (18-28px)

## 🎬 Content Guidelines

### Writing for Knode

**DO:**
- ✅ One clear idea per scene
- ✅ Active voice ("You discover" not "It is discovered")
- ✅ Conversational tone ("Let's explore" not "We shall examine")
- ✅ 3-4 supporting points maximum
- ✅ End with insight or action
- ✅ Use "you" to connect with learner

**DON'T:**
- ❌ Cram too many concepts
- ❌ Use jargon without explanation
- ❌ Write passive, academic prose
- ❌ Create long paragraphs (2-3 lines max)
- ❌ Forget the human on the other side

### Timing Guidelines

- **Total scene:** 30-35 seconds (900-1050 frames at 30fps)
- **Opening:** First 1-2 seconds (set context)
- **Build:** Next 3-4 seconds (progressive reveal)
- **Main content:** Middle 20-25 seconds (the meat)
- **Landing:** Final 3-5 seconds (insight/transition)

## 🚀 Quick Examples

### Hook Example: Growth Mindset
```
Question: "Can You Actually Get Smarter?"
Facts: 
  - Your brain has 86 billion neurons ready to connect
  - New neural pathways form every time you learn
  - Mistakes literally strengthen your brain
Challenge: "What if intelligence isn't fixed... but flexible?"
```

### Explain Example: Photosynthesis
```
Title: "How Plants Make Food"
Concept: "Plants turn sunlight into energy through photosynthesis"
Steps:
  1. Leaves absorb sunlight through chlorophyll
  2. Roots pull up water and nutrients
  3. CO2 enters through tiny leaf pores
  4. Plant creates glucose and releases oxygen
Summary: "Plants are basically solar-powered food factories!"
```

### Apply Example: Active Listening
```
Scenario: "Your friend is upset about failing a test"
Actions:
  1. Make eye contact and put phone away
  2. Let them finish without interrupting
  3. Reflect back: 'Sounds like you're frustrated'
Result: "Your friend feels heard and you've strengthened your relationship"
```

### Reflect Example: Memory Techniques
```
Insights:
  1. Your brain remembers stories better than facts
  2. Spacing out practice beats cramming
  3. Teaching others solidifies your own understanding
Question: "Which technique will you try first with your next study session?"
Next Steps: "Try one technique this week and notice the difference"
```

## 📁 File Organization

```
/src/
  /scenes/           # Your scene JSON configs
    hook_*.json
    explain_*.json
    apply_*.json
    reflect_*.json
  
  /templates/        # Core template components
    HookTemplate.jsx
    ExplainTemplate.jsx
    ApplyTemplate.jsx
    ReflectTemplate.jsx
  
  /utils/
    theme.js              # Visual constants
    knodeAnimations.js    # Animation library
```

## 🎯 Creating Your First Scene

1. **Choose your pillar** (Hook, Explain, Apply, or Reflect)
2. **Copy an example scene** from `/src/scenes/`
3. **Update the content** following the structure above
4. **Adjust colors** if needed (optional)
5. **Test the timing** (aim for 30-35 seconds)

## 💡 Pro Tips

- **Keep text short** - If it doesn't fit in 2 lines, simplify
- **One idea per beat** - Don't rush multiple concepts
- **Use emojis sparingly** - Personality, not decoration
- **Trust the breathing** - Motion is built in, don't add more
- **Test with voice-over** - Will you be able to narrate this?
- **Think whiteboard** - Would a teacher sketch this?

## 🔄 Common Patterns

**List of Items:** Use Explain template with 4 steps
**Before/After:** Use Apply template showing transformation  
**Question → Answer:** Use Hook then Explain
**Theory → Practice:** Use Explain then Apply
**Full Learning Arc:** Hook → Explain → Apply → Reflect

## 🎨 Design Philosophy

> "Every visual serves the narrative. Motion supports understanding. One idea at a time. Space is clarity. Playfulness from timing and metaphor, not gimmicks."

The goal: Make learning feel alive. Each scene should be an animated "aha" moment — quick, witty, visually satisfying burst of clarity.

---

**Questions?** Check `KNODE_VISION_IMPLEMENTATION.md` for technical details.
**Stuck?** Look at the example scenes in `/src/scenes/` for inspiration.
