/**
 * Knode Animation Library
 * 
 * Animations that bring the Knode vision to life:
 * - Hand-drawn clarity with purposeful motion
 * - Breathing effects (alive but never jittery)
 * - Draw-on reveals like a teacher sketching
 * - Natural rhythm and timing
 */

import { interpolate, Easing, spring } from 'remotion';

// ==================== BREATHING & LIFE ====================

/**
 * Gentle breathing effect - makes elements feel alive
 * Never jittery, always smooth and intentional
 */
export const breathe = (frame, seed = 0, amount = 0.012) => {
  const scale = 1 + Math.sin((frame + seed * 100) * 0.04) * amount;
  return {
    transform: `scale(${scale})`,
  };
};

/**
 * Micro-drift - subtle position variation
 * Like a hand-held sketch that's never quite still
 */
export const microDrift = (frame, seed = 0, distance = 2) => {
  const x = Math.sin((frame + seed * 73) * 0.03) * distance;
  const y = Math.cos((frame + seed * 137) * 0.025) * distance;
  return {
    transform: `translate(${x}px, ${y}px)`,
  };
};

/**
 * Combined breathing + drift for full "hand-drawn" feel
 */
export const handDrawnLife = (frame, seed = 0) => {
  const scale = 1 + Math.sin((frame + seed * 100) * 0.04) * 0.012;
  const x = Math.sin((frame + seed * 73) * 0.03) * 1.5;
  const y = Math.cos((frame + seed * 137) * 0.025) * 1.5;
  return {
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
  };
};

// ==================== DRAW-ON ANIMATIONS ====================

/**
 * Confident draw-on - like a marker drawing a line
 * Fast and purposeful, not slow and hesitant
 */
export const drawOn = (frame, fps, delay = 0, duration = 20) => {
  const progress = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic)
    }
  );

  return {
    opacity: progress,
    clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
  };
};

/**
 * Stroke reveal - SVG path drawing animation
 */
export const strokeReveal = (frame, delay = 0, duration = 30) => {
  const progress = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.ease)
    }
  );

  return {
    strokeDashoffset: 1 - progress,
    strokeDasharray: '1',
  };
};

/**
 * Write-on text - characters appear with marker-like speed
 */
export const writeOn = (frame, delay = 0, textLength, charsPerSecond = 15) => {
  const fps = 30; // standard fps
  const framesPerChar = fps / charsPerSecond;
  const elapsed = Math.max(0, frame - delay);
  const visibleChars = Math.min(
    Math.floor(elapsed / framesPerChar),
    textLength
  );

  return {
    visibleChars,
    progress: visibleChars / textLength,
  };
};

// ==================== CONFIDENT ENTRANCES ====================

/**
 * Quick pop-in - element appears with confidence
 * No slow fades, this is assertive teaching
 */
export const popIn = (frame, fps, delay = 0) => {
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {
      damping: 15,
      stiffness: 180,
      mass: 0.8
    }
  });

  return {
    opacity: Math.min(progress * 2, 1),
    transform: `scale(${progress})`,
  };
};

/**
 * Sketch in - draws in from a point like marker on paper
 */
export const sketchIn = (frame, fps, delay = 0, direction = 'center') => {
  const progress = interpolate(
    frame,
    [delay, delay + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic)
    }
  );

  const origins = {
    center: '50% 50%',
    left: '0% 50%',
    top: '50% 0%',
    topLeft: '0% 0%'
  };

  return {
    opacity: progress,
    transform: `scale(${progress})`,
    transformOrigin: origins[direction] || origins.center,
  };
};

/**
 * Slide and settle - enters with slight overshoot
 */
export const slideSettle = (frame, fps, delay = 0, direction = 'left') => {
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {
      damping: 12,
      stiffness: 120,
      mass: 0.6
    }
  });

  const distances = {
    left: [-50, 0],
    right: [50, 0],
    up: [0, -50],
    down: [0, 50]
  };

  const [xDist, yDist] = distances[direction] || distances.left;
  const x = xDist * (1 - progress);
  const y = yDist * (1 - progress);

  return {
    opacity: progress,
    transform: `translate(${x}px, ${y}px)`,
  };
};

// ==================== EMPHASIS & PUNCHLINES ====================

/**
 * Punch - quick emphasis for "aha" moments
 */
export const punch = (frame, fps, triggerFrame) => {
  if (frame < triggerFrame) return {};

  const progress = spring({
    frame: frame - triggerFrame,
    fps,
    config: {
      damping: 10,
      stiffness: 200,
      mass: 0.5
    }
  });

  const scale = 1 + interpolate(progress, [0, 1], [0.15, 0], {
    extrapolateRight: 'clamp'
  });

  return {
    transform: `scale(${scale})`,
  };
};

/**
 * Circle/underline reveal - marker emphasis effect
 */
export const emphasize = (frame, delay = 0, duration = 15) => {
  const progress = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad)
    }
  );

  return {
    strokeDashoffset: 1 - progress,
    opacity: progress,
  };
};

// ==================== TRANSITIONS & REVEALS ====================

/**
 * Morph - smooth shape/text transformation
 */
export const morph = (frame, startFrame, duration = 20) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic)
    }
  );

  return progress;
};

/**
 * Wipe clean - like erasing a whiteboard section
 */
export const wipeClean = (frame, startFrame, duration = 25, direction = 'right') => {
  if (frame < startFrame) return { opacity: 1 };
  
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.in(Easing.quad)
    }
  );

  const clips = {
    right: `inset(0 ${progress * 100}% 0 0)`,
    left: `inset(0 0 0 ${progress * 100}%)`,
    down: `inset(${progress * 100}% 0 0 0)`,
    up: `inset(0 0 ${progress * 100}% 0)`
  };

  return {
    clipPath: clips[direction] || clips.right,
    opacity: 1 - progress * 0.3,
  };
};

// ==================== STAGGER HELPERS ====================

/**
 * Staggered entrance for lists - natural teaching rhythm
 */
export const staggerDelay = (index, baseDelay = 0, stagger = 8) => {
  return baseDelay + index * stagger;
};

/**
 * Wave reveal - items appear in rhythm
 */
export const waveReveal = (frame, fps, index, baseDelay = 0, stagger = 10) => {
  return popIn(frame, fps, baseDelay + index * stagger);
};

// ==================== VISUAL HELPERS ====================

/**
 * Marker stroke style - clean hand-drawn lines
 */
export const markerStroke = (color = '#1A1A1A', width = 3) => ({
  stroke: color,
  strokeWidth: width,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
});

/**
 * Paper texture background
 */
export const paperBackground = (baseColor = '#FAFBFC') => ({
  backgroundColor: baseColor,
  backgroundImage: `
    url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='3' seed='1'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")
  `,
  backgroundBlendMode: 'multiply',
});

/**
 * Hand-drawn box/container
 */
export const sketchBox = (color = '#1A1A1A', frame = 0) => {
  const breatheScale = 1 + Math.sin(frame * 0.04) * 0.008;
  
  return {
    border: `3px solid ${color}`,
    borderRadius: '8px',
    padding: '20px 30px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transform: `scale(${breatheScale})`,
  };
};

/**
 * Marker highlight effect
 */
export const markerHighlight = (color = '#F39C12', opacity = 0.3) => ({
  backgroundColor: color,
  opacity,
  mixBlendMode: 'multiply',
  borderRadius: '4px',
  padding: '2px 8px',
});
