import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';



type Opts = { delay?: number; stiffness?: number; damping?: number };



/**

 * Returns a strokeDashoffset from 1 -> 0 for write-on animations.

 */

export const useWriteOn = (opts: Opts = {}) => {

  const {delay = 0, stiffness = 120, damping = 200} = opts;

  const frame = useCurrentFrame();

  const {fps} = useVideoConfig();

  const s = spring({

    frame: Math.max(0, frame - delay),

    fps,

    config: {stiffness, damping},

  });

  return interpolate(s, [0, 1], [1, 0]);

};



