/**
 * Anime.js Helpers
 * 
 * Cool animation utilities for Knode scenes
 * Break free from linear motion!
 */

import anime from 'animejs/lib/anime.es.js';

/**
 * Sketch-in animation - element draws itself onto canvas
 */
export const sketchIn = (targets, options = {}) => {
  const defaults = {
    targets,
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeOutCubic',
    duration: 800,
    delay: (el, i) => i * 50,
  };

  return anime({ ...defaults, ...options });
};

/**
 * Pop-in animation - element bounces into view
 */
export const popIn = (targets, options = {}) => {
  const defaults = {
    targets,
    scale: [0, 1],
    opacity: [0, 1],
    easing: 'easeOutElastic(1, .8)',
    duration: 1000,
  };

  return anime({ ...defaults, ...options });
};

/**
 * Float animation - organic drifting
 */
export const float = (targets, options = {}) => {
  const defaults = {
    targets,
    translateY: [
      { value: -10, duration: 1500, easing: 'easeInOutSine' },
      { value: 0, duration: 1500, easing: 'easeInOutSine' },
    ],
    loop: true,
  };

  return anime({ ...defaults, ...options });
};

/**
 * Morph path animation - shape transforms
 */
export const morphPath = (targets, toPath, options = {}) => {
  const defaults = {
    targets,
    d: toPath,
    easing: 'easeInOutQuad',
    duration: 600,
  };

  return anime({ ...defaults, ...options });
};

/**
 * Write-on text - characters appear sequentially
 */
export const writeOnText = (targets, options = {}) => {
  const defaults = {
    targets,
    opacity: [0, 1],
    translateX: [-20, 0],
    easing: 'easeOutCubic',
    duration: 400,
    delay: anime.stagger(30), // 30ms between each character
  };

  return anime({ ...defaults, ...options });
};

/**
 * Stagger-in - elements appear in waves
 */
export const staggerIn = (targets, options = {}) => {
  const defaults = {
    targets,
    opacity: [0, 1],
    translateY: [20, 0],
    scale: [0.95, 1],
    easing: 'easeOutCubic',
    duration: 500,
    delay: anime.stagger(100), // 100ms between each element
  };

  return anime({ ...defaults, ...options });
};

/**
 * Pulse - attention grabber
 */
export const pulse = (targets, options = {}) => {
  const defaults = {
    targets,
    scale: [1, 1.05, 1],
    easing: 'easeInOutQuad',
    duration: 600,
  };

  return anime({ ...defaults, ...options });
};

/**
 * Shake - emphasis or error
 */
export const shake = (targets, options = {}) => {
  const defaults = {
    targets,
    translateX: [
      { value: -10, duration: 100 },
      { value: 10, duration: 100 },
      { value: -8, duration: 100 },
      { value: 8, duration: 100 },
      { value: 0, duration: 100 },
    ],
    easing: 'easeInOutSine',
  };

  return anime({ ...defaults, ...options });
};

/**
 * Reveal - mask uncovers content
 */
export const reveal = (targets, direction = 'left', options = {}) => {
  const transforms = {
    left: { translateX: ['100%', '0%'] },
    right: { translateX: ['-100%', '0%'] },
    up: { translateY: ['100%', '0%'] },
    down: { translateY: ['-100%', '0%'] },
  };

  const defaults = {
    targets,
    ...transforms[direction],
    easing: 'easeOutExpo',
    duration: 800,
  };

  return anime({ ...defaults, ...options });
};

/**
 * Confetti burst - celebration
 */
export const confettiBurst = (containerSelector, options = {}) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const colors = options.colors || ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'];
  const count = options.count || 30;
  const particles = [];

  // Create confetti elements
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.left = '50%';
    particle.style.top = '50%';
    container.appendChild(particle);
    particles.push(particle);
  }

  // Animate particles
  anime({
    targets: particles,
    translateX: () => anime.random(-300, 300),
    translateY: () => anime.random(-300, 300),
    scale: [1, 0],
    opacity: [1, 0],
    easing: 'easeOutExpo',
    duration: 1500,
    complete: () => {
      particles.forEach(p => p.remove());
    },
  });
};

/**
 * Trail effect - elements follow path
 */
export const trail = (targets, path, options = {}) => {
  const defaults = {
    targets,
    translateX: anime.path(path).x,
    translateY: anime.path(path).y,
    easing: 'easeOutCubic',
    duration: 1000,
    delay: anime.stagger(50),
  };

  return anime({ ...defaults, ...options });
};

/**
 * Rotate-in - element spins into view
 */
export const rotateIn = (targets, options = {}) => {
  const defaults = {
    targets,
    rotate: [180, 0],
    scale: [0, 1],
    opacity: [0, 1],
    easing: 'easeOutBack',
    duration: 800,
  };

  return anime({ ...defaults, ...options });
};

/**
 * Timeline helper - sequence multiple animations
 */
export const createTimeline = (options = {}) => {
  return anime.timeline({
    easing: 'easeOutExpo',
    duration: 750,
    ...options,
  });
};

/**
 * Preset animation combinations
 */
export const ANIME_PRESETS = {
  quickPop: {
    scale: [0, 1],
    opacity: [0, 1],
    easing: 'easeOutBack',
    duration: 400,
  },
  smoothSlide: {
    translateX: [-50, 0],
    opacity: [0, 1],
    easing: 'easeOutCubic',
    duration: 600,
  },
  energeticBounce: {
    translateY: [-30, 0],
    scale: [0.8, 1],
    opacity: [0, 1],
    easing: 'easeOutElastic(1, .6)',
    duration: 900,
  },
  gentleFade: {
    opacity: [0, 1],
    easing: 'easeInOutQuad',
    duration: 500,
  },
};

export default {
  sketchIn,
  popIn,
  float,
  morphPath,
  writeOnText,
  staggerIn,
  pulse,
  shake,
  reveal,
  confettiBurst,
  trail,
  rotateIn,
  createTimeline,
  ANIME_PRESETS,
};
