/**
 * GSAP Animation Utilities for Knode Scene Builder
 * 
 * Modular, production-ready GSAP animations for world-class aesthetics.
 * Designed for mid-scene transitions and organic animation flows.
 * 
 * Key Features:
 * - DrawSVG for natural text/line writing
 * - Shape Morphing for analogies and transformations
 * - Flip for content swaps and reveals
 * - Staggered reveals for bullet points
 * - Emphasis animations (underline, pulse, highlight)
 * - Scramble text for hook moments
 * 
 * Usage: Import individual functions or use presets
 */

import gsap from 'gsap';

/**
 * ========================================
 * 1. DRAW SVG - Natural Writing Effect
 * ========================================
 * Simulates hand-drawn text/lines appearing on screen
 */

/**
 * Animate SVG path to draw itself (like handwriting)
 * @param {string|Element} target - SVG path element or selector
 * @param {object} options - Animation options
 */
export const drawSVGPath = (target, options = {}) => {
  const {
    duration = 1.5,
    ease = "power2.inOut",
    delay = 0,
    onComplete = null,
    stagger = 0,
  } = options;

  const elements = gsap.utils.toArray(target);
  
  // Setup: Make paths invisible initially
  elements.forEach(el => {
    const length = el.getTotalLength?.() || 0;
    if (length > 0) {
      gsap.set(el, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    }
  });

  // Animate: Draw the paths
  return gsap.to(elements, {
    strokeDashoffset: 0,
    duration,
    ease,
    delay,
    stagger,
    onComplete,
  });
};

/**
 * Write text on screen character by character
 * Best used with SVG text or split text
 */
export const writeOnText = (target, options = {}) => {
  const {
    duration = 0.03,
    ease = "none",
    stagger = 0.03,
    delay = 0,
    onComplete = null,
  } = options;

  const elements = gsap.utils.toArray(target);
  
  return gsap.fromTo(
    elements,
    { 
      opacity: 0,
      y: -10,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger,
      delay,
      onComplete,
    }
  );
};

/**
 * ========================================
 * 2. SHAPE MORPH - Organic Transformations
 * ========================================
 * Transform one shape into another (for analogies)
 */

/**
 * Morph one SVG path into another
 * Note: For complex morphing, consider using MorphSVGPlugin (GSAP premium)
 * This is a basic implementation using scale/rotate/position
 */
export const morphShape = (target, options = {}) => {
  const {
    scale = 1,
    rotation = 0,
    x = 0,
    y = 0,
    duration = 1.2,
    ease = "power2.inOut",
    delay = 0,
    onComplete = null,
  } = options;

  return gsap.to(target, {
    scale,
    rotation,
    x,
    y,
    duration,
    ease,
    delay,
    onComplete,
  });
};

/**
 * Organic shape transformation with breathing effect
 * Perfect for analogies (circle → square, etc.)
 */
export const breatheShape = (target, options = {}) => {
  const {
    scaleAmount = 1.1,
    duration = 2,
    ease = "sine.inOut",
    repeat = -1,
    yoyo = true,
  } = options;

  return gsap.to(target, {
    scale: scaleAmount,
    duration,
    ease,
    repeat,
    yoyo,
  });
};

/**
 * ========================================
 * 3. FLIP SWAP - Content Replacement
 * ========================================
 * Smoothly swap content or reveal quiz answers
 */

/**
 * Flip card effect - reveal answer/different content
 */
export const flipReveal = (target, options = {}) => {
  const {
    duration = 0.6,
    ease = "power2.inOut",
    delay = 0,
    rotationY = 180,
    onComplete = null,
  } = options;

  return gsap.to(target, {
    rotationY,
    duration,
    ease,
    delay,
    transformOrigin: "center center",
    transformStyle: "preserve-3d",
    onComplete,
  });
};

/**
 * Swap content with smooth crossfade
 */
export const crossfadeSwap = (exitTarget, enterTarget, options = {}) => {
  const {
    duration = 0.5,
    ease = "power2.inOut",
    stagger = 0.1,
    delay = 0,
  } = options;

  const tl = gsap.timeline({ delay });
  
  tl.to(exitTarget, {
    opacity: 0,
    y: -20,
    duration: duration / 2,
    ease,
  });
  
  tl.to(enterTarget, {
    opacity: 1,
    y: 0,
    duration: duration / 2,
    ease,
  }, `-=${duration / 4}`);

  return tl;
};

/**
 * Scale swap - shrink old content, grow new content
 */
export const scaleSwap = (exitTarget, enterTarget, options = {}) => {
  const {
    duration = 0.6,
    ease = "back.inOut",
    delay = 0,
  } = options;

  const tl = gsap.timeline({ delay });
  
  tl.to(exitTarget, {
    scale: 0,
    opacity: 0,
    duration: duration / 2,
    ease,
  });
  
  tl.fromTo(enterTarget, 
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: duration / 2,
      ease,
    }, `-=${duration / 4}`
  );

  return tl;
};

/**
 * ========================================
 * 4. STAGGERED REVEALS - Bullet Points
 * ========================================
 * Reveal multiple items with timing offset
 */

/**
 * Staggered fade + slide in (perfect for bullet points)
 */
export const staggeredBullets = (targets, options = {}) => {
  const {
    duration = 0.5,
    ease = "power2.out",
    stagger = 0.15,
    delay = 0,
    direction = "up", // up, down, left, right
    distance = 30,
    onComplete = null,
  } = options;

  const fromVars = {
    opacity: 0,
  };

  // Set initial position based on direction
  switch (direction) {
    case "up":
      fromVars.y = distance;
      break;
    case "down":
      fromVars.y = -distance;
      break;
    case "left":
      fromVars.x = distance;
      break;
    case "right":
      fromVars.x = -distance;
      break;
  }

  return gsap.fromTo(
    targets,
    fromVars,
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      ease,
      stagger,
      delay,
      onComplete,
    }
  );
};

/**
 * Cascade reveal with scale
 */
export const cascadeReveal = (targets, options = {}) => {
  const {
    duration = 0.6,
    ease = "back.out(1.7)",
    stagger = 0.12,
    delay = 0,
    onComplete = null,
  } = options;

  return gsap.fromTo(
    targets,
    {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration,
      ease,
      stagger,
      delay,
      onComplete,
    }
  );
};

/**
 * ========================================
 * 5. EMPHASIS - Underline/Pulse/Highlight
 * ========================================
 * Draw attention to specific elements
 */

/**
 * Pulse animation - draws attention
 */
export const pulseEmphasis = (target, options = {}) => {
  const {
    scale = 1.08,
    duration = 0.4,
    ease = "power2.inOut",
    repeat = 2,
    yoyo = true,
    delay = 0,
  } = options;

  return gsap.to(target, {
    scale,
    duration,
    ease,
    repeat,
    yoyo,
    delay,
  });
};

/**
 * Underline draw effect
 */
export const drawUnderline = (lineTarget, options = {}) => {
  const {
    duration = 0.8,
    ease = "power2.out",
    delay = 0,
    onComplete = null,
  } = options;

  return gsap.fromTo(
    lineTarget,
    {
      scaleX: 0,
      transformOrigin: "left center",
    },
    {
      scaleX: 1,
      duration,
      ease,
      delay,
      onComplete,
    }
  );
};

/**
 * Highlight background reveal
 */
export const highlightReveal = (target, options = {}) => {
  const {
    color = "#FFEB3B",
    duration = 0.6,
    ease = "power2.inOut",
    delay = 0,
  } = options;

  return gsap.fromTo(
    target,
    {
      backgroundSize: "0% 100%",
      backgroundImage: `linear-gradient(120deg, ${color}80 0%, ${color}80 100%)`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left center",
    },
    {
      backgroundSize: "100% 100%",
      duration,
      ease,
      delay,
    }
  );
};

/**
 * Glow emphasis effect
 */
export const glowPulse = (target, options = {}) => {
  const {
    color = "#FFD700",
    intensity = 20,
    duration = 0.8,
    repeat = 2,
    yoyo = true,
    delay = 0,
  } = options;

  return gsap.to(target, {
    filter: `drop-shadow(0 0 ${intensity}px ${color})`,
    duration,
    repeat,
    yoyo,
    delay,
  });
};

/**
 * ========================================
 * 6. SCRAMBLE TEXT - Hook Effect
 * ========================================
 * Text scrambles then reveals (perfect for hooks)
 */

/**
 * Scramble text effect (simulated)
 * Note: For full ScrambleTextPlugin, use GSAP premium
 */
export const scrambleText = (target, finalText, options = {}) => {
  const {
    duration = 1.2,
    delay = 0,
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    onComplete = null,
  } = options;

  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  const originalText = finalText;
  const length = originalText.length;
  let frame = 0;
  const totalFrames = duration * 60; // Assuming 60fps

  const tl = gsap.timeline({ delay, onComplete });

  tl.to({}, {
    duration,
    onUpdate: function() {
      frame++;
      const progress = frame / totalFrames;
      
      let newText = '';
      for (let i = 0; i < length; i++) {
        if (progress * length > i) {
          newText += originalText[i];
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      element.textContent = newText;
    }
  });

  return tl;
};

/**
 * ========================================
 * 7. MID-SCENE TRANSITIONS
 * ========================================
 * Graceful mid-scene movements and transitions
 */

/**
 * Move element to new position gracefully (mid-scene repositioning)
 */
export const gracefulMove = (target, options = {}) => {
  const {
    x = 0,
    y = 0,
    scale = 1,
    rotation = 0,
    duration = 1.2,
    ease = "power3.inOut",
    delay = 0,
    onComplete = null,
  } = options;

  return gsap.to(target, {
    x,
    y,
    scale,
    rotation,
    duration,
    ease,
    delay,
    onComplete,
  });
};

/**
 * Shrink and move to corner (making room for new content)
 */
export const shrinkToCorner = (target, options = {}) => {
  const {
    corner = "topRight", // topLeft, topRight, bottomLeft, bottomRight
    scale = 0.3,
    duration = 1,
    ease = "power2.inOut",
    delay = 0,
    onComplete = null,
  } = options;

  const positions = {
    topLeft: { x: -700, y: -400 },
    topRight: { x: 700, y: -400 },
    bottomLeft: { x: -700, y: 400 },
    bottomRight: { x: 700, y: 400 },
  };

  return gsap.to(target, {
    ...positions[corner],
    scale,
    duration,
    ease,
    delay,
    onComplete,
  });
};

/**
 * Expand to center (bring content to focus)
 */
export const expandToCenter = (target, options = {}) => {
  const {
    scale = 1.5,
    duration = 1.2,
    ease = "back.out(1.2)",
    delay = 0,
    onComplete = null,
  } = options;

  return gsap.to(target, {
    x: 0,
    y: 0,
    scale,
    duration,
    ease,
    delay,
    onComplete,
  });
};

/**
 * ========================================
 * 8. PRESETS & COMBINATIONS
 * ========================================
 * Common animation sequences
 */

/**
 * Question reveal sequence (for Hook template)
 */
export const questionRevealSequence = (questionEl, underlineEl, options = {}) => {
  const { delay = 0 } = options;
  
  const tl = gsap.timeline({ delay });
  
  // Question appears with bounce
  tl.fromTo(questionEl,
    { opacity: 0, y: -50, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
  );
  
  // Underline draws
  tl.fromTo(underlineEl,
    { scaleX: 0 },
    { scaleX: 1, duration: 0.6, ease: "power2.out", transformOrigin: "left center" },
    "-=0.2"
  );
  
  // Pulse emphasis
  tl.to(questionEl,
    { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.inOut" }
  );
  
  return tl;
};

/**
 * Content swap sequence (for mid-scene transitions)
 */
export const contentSwapSequence = (oldContent, newContent, options = {}) => {
  const { delay = 0, method = "fade" } = options;
  
  const tl = gsap.timeline({ delay });
  
  if (method === "fade") {
    tl.to(oldContent, { opacity: 0, duration: 0.4 });
    tl.to(newContent, { opacity: 1, duration: 0.4 }, "-=0.2");
  } else if (method === "scale") {
    tl.to(oldContent, { scale: 0, opacity: 0, duration: 0.5 });
    tl.fromTo(newContent, 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5 },
      "-=0.2"
    );
  }
  
  return tl;
};

/**
 * ========================================
 * 9. UTILITY FUNCTIONS
 * ========================================
 */

/**
 * Create a master timeline for complex sequences
 */
export const createTimeline = (options = {}) => {
  return gsap.timeline(options);
};

/**
 * Kill all animations on target
 */
export const killAnimations = (target) => {
  gsap.killTweensOf(target);
};

/**
 * Pause/Resume helpers
 */
export const pauseAnimation = (animation) => {
  if (animation) animation.pause();
};

export const resumeAnimation = (animation) => {
  if (animation) animation.resume();
};

/**
 * ========================================
 * EXPORTS
 * ========================================
 */

export default {
  // Drawing
  drawSVGPath,
  writeOnText,
  
  // Morphing
  morphShape,
  breatheShape,
  
  // Flipping/Swapping
  flipReveal,
  crossfadeSwap,
  scaleSwap,
  
  // Staggered
  staggeredBullets,
  cascadeReveal,
  
  // Emphasis
  pulseEmphasis,
  drawUnderline,
  highlightReveal,
  glowPulse,
  
  // Scramble
  scrambleText,
  
  // Mid-scene
  gracefulMove,
  shrinkToCorner,
  expandToCenter,
  
  // Sequences
  questionRevealSequence,
  contentSwapSequence,
  
  // Utilities
  createTimeline,
  killAnimations,
  pauseAnimation,
  resumeAnimation,
};
