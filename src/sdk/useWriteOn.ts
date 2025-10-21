import {useCurrentFrame, useVideoConfig, spring, interpolate, random} from 'remotion';
import {jitter, wobble} from './easing';

type Opts = { 
  delay?: number; 
  stiffness?: number; 
  damping?: number;
  imperfection?: number; // 0-1, adds hand-drawn feel
  jitter?: boolean;      // Add micro-jitter
  wobble?: boolean;      // Add rotation wobble
};

/**
 * Enhanced Write-On Hook with Human-Made Feel
 * 
 * Returns strokeDashoffset from 1 -> 0 for write-on animations,
 * with optional imperfections that mimic hand-drawing with
 * pencil, pen, or marker.
 * 
 * Features:
 * - Variable speed (mimics hand pressure)
 * - Micro-jitter (slight position variation)
 * - Rotation wobble (like drawing on uneven surface)
 * - Imperfect timing (not perfectly linear)
 */
export const useWriteOn = (opts: Opts = {}) => {
  const {
    delay = 0, 
    stiffness = 120, 
    damping = 200,
    imperfection = 0.12,
    jitter: enableJitter = false,
    wobble: enableWobble = false
  } = opts;
  
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  // Base spring animation
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {stiffness, damping},
  });
  
  // Add imperfection - variable speed like hand drawing
  const imperfectProgress = s + (
    Math.sin(frame * 0.3 + delay) * imperfection * 0.05 * s * (1 - s)
  );
  
  // Clamp to 0-1
  const clampedProgress = Math.max(0, Math.min(1, imperfectProgress));
  
  // Convert to dashoffset (1 -> 0)
  const dashOffset = interpolate(clampedProgress, [0, 1], [1, 0]);
  
  return dashOffset;
};

/**
 * Get jitter transform for hand-drawn elements - DISABLED
 * Jitter was causing rendering issues, now returns empty transform
 */
export const useJitter = (seed = 0, amount = 2) => {
  // Disabled - jitter caused poor rendering
  return `translate(0px, 0px)`;
};

/**
 * Get wobble rotation for hand-drawn elements  
 * Use with transform style for subtle rotation (reduced amount)
 */
export const useWobble = (seed = 0, degrees = 0.15) => {  // Reduced from 0.5 to 0.15
  const frame = useCurrentFrame();
  const w = wobble(frame + seed, degrees);
  return `rotate(${w}deg)`;
};

/**
 * Combined transform with jitter and wobble - Jitter disabled
 * Only uses very subtle wobble for hand-drawn feel
 */
export const useHandDrawn = (opts: {
  seed?: number;
  jitterAmount?: number;
  wobbleAmount?: number;
} = {}) => {
  const {seed = 0, wobbleAmount = 0.15} = opts;  // Reduced default wobble
  const frame = useCurrentFrame();
  
  // Jitter removed - was causing rendering issues
  const w = wobble(frame + seed, wobbleAmount);
  
  return {
    transform: `rotate(${w}deg)`,
  };
};

/**
 * Pencil/Pen/Marker simulation
 * Returns style object for SVG path elements
 */
export const usePenStroke = (opts: {
  delay?: number;
  tool?: 'pencil' | 'pen' | 'marker' | 'chalk';
  pressure?: number; // 0-1, affects width variation
} = {}) => {
  const {delay = 0, tool = 'pen', pressure = 0.5} = opts;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  // Different drawing speeds for different tools
  const speeds = {
    pencil: {stiffness: 100, damping: 180}, // Slower, more careful
    pen: {stiffness: 120, damping: 200},    // Medium speed
    marker: {stiffness: 140, damping: 220}, // Faster, more confident
    chalk: {stiffness: 80, damping: 160},   // Slowest, dusty trail
  };
  
  const {stiffness, damping} = speeds[tool];
  
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {stiffness, damping},
  });
  
  // Add pressure-based width variation
  const widthVariation = 1 + Math.sin(frame * 0.2) * pressure * 0.3;
  
  return {
    strokeDashoffset: interpolate(progress, [0, 1], [1, 0]),
    strokeWidth: widthVariation,
    opacity: progress,
  };
};

/**
 * Write-on effect with trailing particles (like chalk dust)
 * Returns progress value 0-1 and particle positions
 */
export const useChalkStroke = (opts: {
  delay?: number;
  particleCount?: number;
} = {}) => {
  const {delay = 0, particleCount = 5} = opts;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {stiffness: 80, damping: 160},
  });
  
  // Generate particle positions along the stroke
  const particles = Array.from({length: particleCount}, (_, i) => {
    const particleProgress = Math.max(0, progress - i * 0.05);
    const seed = delay + i * 100;
    const j = jitter(frame + seed, 5);
    
    return {
      progress: particleProgress,
      x: j.x,
      y: j.y,
      opacity: particleProgress * (1 - i / particleCount) * 0.6,
    };
  });
  
  return {
    strokeProgress: progress,
    dashOffset: interpolate(progress, [0, 1], [1, 0]),
    particles,
  };
};

