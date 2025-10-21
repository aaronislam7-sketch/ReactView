/**
 * Visual Effects Library
 * 
 * Provides enhanced visual effects like paper textures,
 * hand-drawn animations, and whiteboard aesthetics
 */

/**
 * Generate SVG paper texture background
 * Creates a realistic paper grain effect
 * 
 * @param {number} opacity - Texture opacity (0-1)
 * @param {string} color - Base color for texture
 * @returns {string} Data URL for background image
 */
export const generatePaperTexture = (opacity = 0.3, color = '#fafafa') => {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="noise">
          <feTurbulence baseFrequency="0.9" numOctaves="4" seed="1234"/>
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${opacity} 0"/>
        </filter>
      </defs>
      <rect width="200" height="200" fill="${color}" filter="url(#noise)"/>
    </svg>
  `;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/**
 * Get paper texture style object
 * Ready to apply to any div
 * 
 * @param {number} opacity - Texture opacity
 * @returns {object} Style object
 */
export const getPaperTextureStyle = (opacity = 0.3) => ({
  backgroundImage: `url("${generatePaperTexture(opacity)}")`,
  backgroundSize: '200px 200px',
  backgroundRepeat: 'repeat'
});

/**
 * Generate subtle vignette effect
 * Adds depth to the scene
 * 
 * @param {string} color - Vignette color
 * @param {number} intensity - How strong the vignette is (0-1)
 * @returns {object} Style object
 */
export const getVignetteStyle = (color = '#000000', intensity = 0.15) => ({
  background: `radial-gradient(ellipse at center, transparent 0%, ${color} 100%)`,
  opacity: intensity
});

/**
 * Hand-drawn underline SVG path
 * Creates a slightly wobbly underline effect
 * 
 * @param {number} width - Line width in pixels
 * @param {string} color - Line color
 * @returns {string} SVG path data
 */
export const createHandDrawnUnderline = (width, color = '#000000') => {
  // Generate slightly wavy path for hand-drawn feel
  const segments = 20;
  const waveAmplitude = 2;
  let path = `M 0 ${waveAmplitude}`;
  
  for (let i = 1; i <= segments; i++) {
    const x = (i / segments) * width;
    const y = waveAmplitude + Math.sin(i * 0.5) * waveAmplitude;
    path += ` L ${x} ${y}`;
  }
  
  return path;
};

/**
 * Sketch circle effect
 * Multiple overlapping circles for hand-drawn look
 * 
 * @param {number} cx - Center X
 * @param {number} cy - Center Y
 * @param {number} radius - Circle radius
 * @param {string} color - Stroke color
 * @returns {array} Array of circle configs for rendering
 */
export const createSketchCircle = (cx, cy, radius, color = '#000000') => {
  const circles = [];
  const variations = 3;
  
  for (let i = 0; i < variations; i++) {
    circles.push({
      cx: cx + (Math.random() - 0.5) * 2,
      cy: cy + (Math.random() - 0.5) * 2,
      radius: radius + (Math.random() - 0.5) * 3,
      color,
      strokeWidth: 2 + Math.random(),
      opacity: 0.3 + (i / variations) * 0.4
    });
  }
  
  return circles;
};

/**
 * Whiteboard marker color palette
 * Authentic whiteboard marker colors
 */
export const MARKER_COLORS = {
  black: '#1a1a1a',
  blue: '#2E5EAA',
  red: '#D62828',
  green: '#2D6A4F',
  orange: '#FB8500',
  purple: '#6A4C93',
  brown: '#8B4513'
};

/**
 * Get random hand-drawn offset
 * Adds slight imperfection to positions
 * 
 * @param {number} maxOffset - Maximum pixel offset
 * @returns {object} {x, y} offset
 */
export const getHandDrawnOffset = (maxOffset = 2) => ({
  x: (Math.random() - 0.5) * maxOffset,
  y: (Math.random() - 0.5) * maxOffset
});

/**
 * Animated drawing path calculator
 * For SVG path animations
 * 
 * @param {number} progress - Animation progress (0-1)
 * @param {number} totalLength - Total path length
 * @returns {object} strokeDasharray and strokeDashoffset
 */
export const getDrawingProgress = (progress, totalLength) => ({
  strokeDasharray: totalLength,
  strokeDashoffset: totalLength * (1 - progress)
});

export default {
  generatePaperTexture,
  getPaperTextureStyle,
  getVignetteStyle,
  createHandDrawnUnderline,
  createSketchCircle,
  MARKER_COLORS,
  getHandDrawnOffset,
  getDrawingProgress
};
