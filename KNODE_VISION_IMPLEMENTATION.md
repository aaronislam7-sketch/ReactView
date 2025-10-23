# Knode Vision Implementation

## Overview

This document describes how the Knode Scene Vision has been implemented across all scene templates and supporting utilities. The implementation transforms the video aesthetic from dark, cinematic broadcast style to a light, hand-drawn whiteboard experience that feels like a brilliant teacher sketching ideas.

## Vision Principles

### Core Aesthetic
- **Hand-drawn clarity, not chaos**: Clean marker lines and purposeful sketches
- **Flat, minimal, energetic**: Light canvas with color pops where needed
- **Motion that breathes**: Alive but effortless, never jittery
- **70% indie charm / 30% studio polish**: Crafted imperfection with precision timing

### Pedagogical Structure
Each 30-40 second scene follows one of four pillars:
1. **Hook** - Grabs attention, poses questions, creates curiosity
2. **Explain** - Builds understanding step by step
3. **Apply** - Shows how ideas work in context
4. **Reflect** - Recaps, reinforces, challenges

## Implementation Details

### 1. Visual Constants (`/src/utils/theme.js`)

Redesigned to support the hand-drawn whiteboard aesthetic:

**Colors:**
- Light canvas backgrounds (`#FAFBFC`, `#F5F6F8`, `#FFF9F0`)
- Marker colors: Black ink, Blue emphasis, Red alert, Green success, Purple reflect, Orange/Yellow accents
- Subtle accent backgrounds for highlights

**Typography:**
- Marker fonts for emphasis: 'Permanent Marker', 'Cabin Sketch'
- Clean structure fonts: 'Inter', 'DM Sans', 'Work Sans'
- Handwritten warmth: 'Patrick Hand'

**Motion:**
- Breathing speed: 0.04 (gentle micro-drift)
- Breathing amount: 0.012 (subtle scale variation)
- Draw speed: 30 frames for line drawing
- Transition speed: 20 frames for smooth changes

### 2. Animation Utilities (`/src/utils/knodeAnimations.js`)

New animation library focused on natural, intentional motion:

**Breathing & Life:**
- `breathe()` - Gentle scale pulsing (never jittery)
- `microDrift()` - Subtle position variation
- `handDrawnLife()` - Combined breathing + drift

**Draw-On Animations:**
- `drawOn()` - Fast, confident marker drawing
- `strokeReveal()` - SVG path animation
- `writeOn()` - Character-by-character text reveal

**Confident Entrances:**
- `popIn()` - Quick, assertive appearance
- `sketchIn()` - Draws from a point like marker on paper
- `slideSettle()` - Enters with slight overshoot

**Emphasis:**
- `punch()` - Quick emphasis for "aha" moments
- `emphasize()` - Marker underline/circle effect
- `wipeClean()` - Eraser transition

**Visual Helpers:**
- `paperBackground()` - Subtle paper texture
- `sketchBox()` - Hand-drawn container style
- `markerHighlight()` - Colored highlight effect
- `markerStroke()` - Clean line styling

### 3. Template Redesign

#### Hook Template (`/src/templates/HookTemplate.jsx`)
**Purpose:** Grabs attention, poses question, creates curiosity

**Structure (35s):**
1. Question appears (confident pop-in) - frames 10-30
2. Central icon/emoji - frames 40-55
3. 3 curiosity sparkers stagger in - frames 70-135
4. Challenge/"what if" moment - frames 160-180

**Visual Style:**
- Light canvas background with breathing
- Question in marker font with accent color
- Central circular icon with border
- Facts in hand-drawn boxes with numbered badges
- Challenge in highlighted box with marker emphasis
- Decorative dots for personality

#### Explain Template (`/src/templates/ExplainTemplate.jsx`)
**Purpose:** Builds understanding step by step

**Structure (35s):**
1. Title with underline emphasis - frames 5-23
2. Core concept in highlighted bar - frames 30-48
3. 4 steps in 2x2 grid, progressive reveal - frames 60-150
4. Summary insight at bottom - frames 170-190

**Visual Style:**
- Title with marker underline
- Core concept in colored bar
- Steps in boxes with circular badges
- Numbered indicators show progression
- Connector arrows suggest flow
- Summary in pill-shaped container

#### Apply Template (`/src/templates/ApplyTemplate.jsx`)
**Purpose:** Shows idea in context with practical application

**Structure (35s):**
1. Scenario setup with label - frames 10-30
2. 3 actions progressively complete - frames 50-165
3. Result celebration - frames 180-205

**Visual Style:**
- Progress dots indicator at top
- Scenario in bordered box with label tag
- Actions with circular indicators (number → checkmark)
- Active action highlighted and scaled
- Completion state shows green highlight
- Result in bold colored banner

#### Reflect Template (`/src/templates/ReflectTemplate.jsx`)
**Purpose:** Recaps, reinforces, prompts deeper thinking

**Structure (35s):**
1. Title with thought bubble icon - frames 10-30
2. 3 key insights stagger in - frames 45-110
3. Reflection question in dashed box - frames 130-155
4. Next steps call-to-action - frames 170-195

**Visual Style:**
- Thought bubble icon with breathing
- Insights with numbered badges and side border
- Question in dashed-border box with question mark
- Next steps in pill-shaped CTA
- Calmer, more meditative pace
- Thoughtful decorative elements

### 4. Scene Configurations

Updated all example scenes with:
- Better pedagogical content aligned to pillar purpose
- Appropriate color schemes (Hook: red, Explain: blue, Apply: green, Reflect: purple)
- Clear 35-second duration
- Content that demonstrates the template structure

**Examples:**
- `hook_growth_mindset.json` - Intriguing question about intelligence
- `explain_growth_mindset.json` - 4-step breakdown of concept
- `apply_growth_mindset.json` - Real scenario with progressive actions
- `reflect_growth_mindset.json` - Key takeaways + reflection prompt

## Design Patterns

### Consistent Visual Language
1. **Breathing motion** on all major elements (subtle, never distracting)
2. **Marker aesthetics** - rounded corners, clean borders, simple shapes
3. **Progressive reveal** - elements appear in logical sequence
4. **Numbered indicators** - circular badges for steps/insights
5. **Color coding** - each pillar has signature color
6. **Paper texture** - subtle background pattern on all canvases
7. **Decorative restraint** - personality without clutter

### Animation Timing
- **Fast entrances** (15-20 frames) - confident, not slow
- **Breathing** (0.04 frequency) - gentle constant motion
- **Stagger delays** (8-15 frames) - natural teaching rhythm
- **Hold times** - elements stay visible for comprehension
- **Exit transitions** (10 frames) - clean scene endings

### Typography Hierarchy
1. **Titles** - Large marker fonts (58-72px)
2. **Questions** - Marker fonts with emphasis (64px)
3. **Body text** - Handwritten font (32-38px)
4. **Labels** - Clean sans-serif, uppercase (18-20px)
5. **Emphasis** - Size, color, and position create hierarchy

## Usage Guidelines

### Creating New Scenes

1. **Choose appropriate pillar/template:**
   - Hook: Questions, surprises, provocations
   - Explain: Concepts, processes, breakdowns
   - Apply: Scenarios, demonstrations, practice
   - Reflect: Insights, questions, next steps

2. **Structure content for timing:**
   - Title/opening: frames 5-30
   - Main content: frames 40-170
   - Summary/closing: frames 170-210
   - Total duration: 900-1050 frames (30-35s at 30fps)

3. **Follow visual patterns:**
   - Use theme colors consistently
   - Apply breathing to major elements
   - Stagger entrances naturally
   - Add personality with restraint

4. **Content guidelines:**
   - One clear idea per scene
   - 3-4 supporting points maximum
   - Active voice, conversational tone
   - End with insight or action

## Technical Notes

### Performance
- Breathing animations use simple sin() calculations
- No complex filters or heavy blur effects
- Minimal particle systems
- Smooth 30fps rendering

### Browser Compatibility
- Standard CSS transforms
- No experimental features
- Fallback fonts specified
- SVG for simple icons only

### Accessibility
- High contrast text (ink on light canvas)
- Clear visual hierarchy
- Readable font sizes (32px minimum for body)
- Color is enhancement, not requirement

## Future Enhancements

Potential additions while maintaining vision:
- Hand-drawn arrow/line components
- SVG sketch animations for diagrams
- Subtle pen sound effects (when audio added)
- More marker highlight styles
- Additional pedagogical templates (Challenge, Compare, etc.)

## Philosophy

Every visual serves the narrative. Motion supports understanding. One idea at a time. Space is clarity. Playfulness from timing and metaphor, not gimmicks.

The goal: Make learning feel alive. Each scene should be an animated "aha" moment — quick, witty, visually satisfying burst of clarity.

---

**Implementation Complete:** All core templates redesigned to match Knode Scene Vision
**Status:** Ready for content creation and pedagogical storytelling
