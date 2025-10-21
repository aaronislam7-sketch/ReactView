/**
 * Audio Effects Library
 * 
 * Provides whiteboard marker sounds and paper texture effects
 * (Placeholders for future audio integration with TTS)
 * 
 * Note: These are ready for integration when audio sync is implemented
 */

export const SOUND_LIBRARY = {
  marker_write: {
    soundId: 'marker_write',
    description: 'Whiteboard marker writing sound',
    url: 'https://freesound.org/data/previews/marker_write.mp3', // Placeholder
    duration: 0.5
  },
  marker_squeak: {
    soundId: 'marker_squeak',
    description: 'Marker squeak on whiteboard',
    url: 'https://freesound.org/data/previews/marker_squeak.mp3', // Placeholder
    duration: 0.3
  },
  paper_flip: {
    soundId: 'paper_flip',
    description: 'Paper page flip sound',
    url: 'https://freesound.org/data/previews/paper_flip.mp3', // Placeholder
    duration: 0.4
  },
  eraser_wipe: {
    soundId: 'eraser_wipe',
    description: 'Eraser wiping sound',
    url: 'https://freesound.org/data/previews/eraser_wipe.mp3', // Placeholder
    duration: 0.8
  }
};

/**
 * Audio trigger helper (for future use with Remotion's Audio component)
 * 
 * @param {string} soundId - The sound identifier
 * @param {number} startFrame - When to play the sound
 * @returns {object} Audio configuration
 */
export const createAudioTrigger = (soundId, startFrame) => {
  const sound = SOUND_LIBRARY[soundId];
  if (!sound) {
    console.warn(`Sound not found: ${soundId}`);
    return null;
  }
  
  return {
    soundId,
    url: sound.url,
    startFrame,
    durationInFrames: Math.ceil(sound.duration * 30) // Assuming 30 fps
  };
};

/**
 * Generate audio cues for a timeline
 * Maps animation actions to appropriate sounds
 * 
 * @param {array} timeline - Scene timeline array
 * @param {number} fps - Frames per second
 * @returns {array} Audio cues
 */
export const generateAudioCues = (timeline, fps = 30) => {
  const audioCues = [];
  
  timeline.forEach(action => {
    const startFrame = Math.floor(action.t * fps);
    
    // Map actions to sounds
    if (action.action.includes('draw') || action.action.includes('write')) {
      audioCues.push(createAudioTrigger('marker_write', startFrame));
    } else if (action.action === 'erase') {
      audioCues.push(createAudioTrigger('eraser_wipe', startFrame));
    }
  });
  
  return audioCues.filter(Boolean);
};

export default SOUND_LIBRARY;
