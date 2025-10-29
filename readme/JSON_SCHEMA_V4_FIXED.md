# JSON Schema v4.0 - Fixed Structure

## Issue
Timeline changed from array to object, but validation expects array.

## Solution
Keep `timeline` as array (backward compatible), add new `timing` field for detailed beat info.

---

## ✅ Correct JSON v4.0 Structure

```json
{
  "schema_version": "4.0",
  "template_id": "hook_1a",
  "pillar": "hook",
  "variant": "1A",
  "duration_s": 20,
  "fps": 30,
  
  "meta": {
    "title": "Scene Title",
    "description": "...",
    "tags": ["tag1", "tag2"]
  },
  
  "style_tokens": {
    "colors": {
      "bg": "#FFF9F0",
      "accent": "#E74C3C",
      "ink": "#1A1A1A"
    },
    "fonts": {
      "primary": "'Cabin Sketch', cursive",
      "size_title": 84,
      "size_subtitle": 36
    },
    "motion": {
      "timing": "fast",
      "easing": "elastic",
      "stagger_delay": 150
    },
    "spacing": {
      "padding": 140,
      "gap": 40
    }
  },
  
  "layout": {
    "canvas": { "w": 1920, "h": 1080 },
    "alignment": "left",
    "safe_area": {
      "top": 80,
      "right": 100,
      "bottom": 80,
      "left": 100
    }
  },
  
  "fill": {
    "texts": { ... },
    "images": [ ... ],
    "lottie": { ... },
    "icons": [ ... ]
  },
  
  "timeline": [],
  
  "timing": {
    "beats": [
      { "name": "intro", "frame": 0, "duration": 30 },
      { "name": "reveal", "frame": 30, "duration": 40 }
    ],
    "transitions": {
      "enter": "fade",
      "exit": "fade",
      "duration": 15
    }
  }
}
```

---

## Key Changes

### Keep Backward Compatible
- `timeline`: [] (array, required for validation)
- `timing`: {...} (new field for detailed beat info)

### User Control Fields (All Optional)

**Colors:**
```json
"colors": {
  "bg": "#HEX",
  "accent": "#HEX",
  "accent2": "#HEX",
  "ink": "#HEX"
}
```

**Fonts:**
```json
"fonts": {
  "primary": "font-family",
  "size_title": 84,
  "size_subtitle": 36
}
```

**Motion:**
```json
"motion": {
  "timing": "fast | medium | slow",
  "easing": "elastic | smooth | linear",
  "stagger_delay": 150
}
```

**Spacing:**
```json
"spacing": {
  "padding": 140,
  "gap": 40
}
```

**Images:**
```json
"images": [
  {
    "src": "URL or path",
    "x": 100,
    "y": 100,
    "width": 80,
    "height": 80,
    "fadeIn": 20
  }
]
```

**Lottie:**
```json
"lottie": {
  "name": "animation name",
  "x": 960,
  "y": 540,
  "width": 200,
  "height": 200
}
```

**Icons (Emoji):**
```json
"icons": [
  {
    "emoji": "🚀",
    "x": 200,
    "y": 200,
    "size": 64,
    "fadeIn": 15
  }
]
```

---

## Validation Requirements

### Required Fields
- `schema_version`
- `template_id`
- `duration_s`
- `fps`
- `timeline` (array, can be empty)

### Optional Fields
- `meta`
- `style_tokens`
- `layout`
- `fill`
- `timing`

---

## Quick Customization Examples

### Change Colors
```json
{
  "style_tokens": {
    "colors": {
      "bg": "#1A1F2E",
      "accent": "#8E44AD",
      "ink": "#ECF0F1"
    }
  }
}
```

### Make Motion Slower
```json
{
  "style_tokens": {
    "motion": {
      "timing": "slow"
    }
  }
}
```

### Add Icon
```json
{
  "fill": {
    "icons": [
      {
        "emoji": "✨",
        "x": 1700,
        "y": 900,
        "size": 64
      }
    ]
  }
}
```

### Change Font Size
```json
{
  "style_tokens": {
    "fonts": {
      "size_title": 100
    }
  }
}
```

---

**Updated:** Hook 1A now validates correctly!
**Status:** Ready to test JSON customization
