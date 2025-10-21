/**
 * Image Library
 * 
 * Centralized repository of images used across scenes.
 * Each image has:
 * - imageId: Unique identifier
 * - description: What the image represents
 * - url: Source URL for the image
 * 
 * Usage in JSON:
 * Instead of: "images": { "icon1": "https://..." }
 * Use: "images": { "icon1": "img_lightbulb" }
 */

export const IMAGE_LIBRARY = {
  // Icons - Ideas & Learning
  img_lightbulb: {
    imageId: 'img_lightbulb',
    description: 'Light bulb icon representing ideas and innovation',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=lightbulb&backgroundColor=4a9c3b'
  },
  img_brain: {
    imageId: 'img_brain',
    description: 'Brain icon representing thinking and cognition',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=brain&backgroundColor=9b59b6'
  },
  img_book: {
    imageId: 'img_book',
    description: 'Book icon representing knowledge and learning',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=book&backgroundColor=3498db'
  },
  img_question: {
    imageId: 'img_question',
    description: 'Question mark icon for curiosity and inquiry',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=question&backgroundColor=e74c3c'
  },

  // Icons - Emotions & Connections
  img_heart: {
    imageId: 'img_heart',
    description: 'Heart icon representing emotion and connection',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=heart&backgroundColor=e74c3c'
  },
  img_star: {
    imageId: 'img_star',
    description: 'Star icon for achievement and excellence',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=star&backgroundColor=f39c12'
  },
  img_smile: {
    imageId: 'img_smile',
    description: 'Smile icon for positivity and happiness',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=smile&backgroundColor=86BC25'
  },
  img_network: {
    imageId: 'img_network',
    description: 'Network icon representing connections and sharing',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=network&backgroundColor=3498db'
  },

  // Icons - Time & Process
  img_clock: {
    imageId: 'img_clock',
    description: 'Clock icon representing time and timing',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=clock&backgroundColor=f39c12'
  },
  img_calendar: {
    imageId: 'img_calendar',
    description: 'Calendar icon for scheduling and planning',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=calendar&backgroundColor=16a085'
  },
  img_rocket: {
    imageId: 'img_rocket',
    description: 'Rocket icon for launch and progress',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=rocket&backgroundColor=e67e22'
  },
  img_target: {
    imageId: 'img_target',
    description: 'Target icon for goals and objectives',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=target&backgroundColor=c0392b'
  },

  // Icons - Tools & Actions
  img_tool: {
    imageId: 'img_tool',
    description: 'Tool icon representing implementation and doing',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=tool&backgroundColor=7f8c8d'
  },
  img_pencil: {
    imageId: 'img_pencil',
    description: 'Pencil icon for writing and creating',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=pencil&backgroundColor=34495e'
  },
  img_checkmark: {
    imageId: 'img_checkmark',
    description: 'Checkmark icon for completion and success',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=check&backgroundColor=27ae60'
  },
  img_puzzle: {
    imageId: 'img_puzzle',
    description: 'Puzzle piece for problem-solving',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=puzzle&backgroundColor=8e44ad'
  },

  // Icons - Reflection & Growth
  img_mirror: {
    imageId: 'img_mirror',
    description: 'Mirror icon for reflection and self-awareness',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=mirror&backgroundColor=95a5a6'
  },
  img_plant: {
    imageId: 'img_plant',
    description: 'Plant icon representing growth and development',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=plant&backgroundColor=86BC25'
  },
  img_medal: {
    imageId: 'img_medal',
    description: 'Medal icon for achievement and recognition',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=medal&backgroundColor=f1c40f'
  },
  img_trophy: {
    imageId: 'img_trophy',
    description: 'Trophy for accomplishment and mastery',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=trophy&backgroundColor=f39c12'
  },

  // Emojis & Symbols
  img_sparkle: {
    imageId: 'img_sparkle',
    description: 'Sparkle/magic effect',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=sparkle&backgroundColor=732282'
  },
  img_arrow: {
    imageId: 'img_arrow',
    description: 'Arrow for direction and flow',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=arrow&backgroundColor=2c3e50'
  }
};

/**
 * Get image URL by imageId
 * @param {string} imageId - The image identifier
 * @returns {string} The image URL or a placeholder if not found
 */
export const getImageUrl = (imageId) => {
  const image = IMAGE_LIBRARY[imageId];
  if (!image) {
    console.warn(`Image not found in library: ${imageId}`);
    return `https://via.placeholder.com/100?text=${imageId}`;
  }
  return image.url;
};

/**
 * Resolve all images in a scene's fill object
 * Converts imageIds to URLs
 * @param {object} fillImages - The fill.images object from scene JSON
 * @returns {object} Object with resolved URLs
 */
export const resolveSceneImages = (fillImages = {}) => {
  const resolved = {};
  Object.entries(fillImages).forEach(([key, value]) => {
    // If value is an imageId (no protocol), resolve it
    if (typeof value === 'string' && !value.startsWith('http')) {
      resolved[key] = getImageUrl(value);
    } else {
      // Already a URL, use as-is
      resolved[key] = value;
    }
  });
  return resolved;
};

export default IMAGE_LIBRARY;
