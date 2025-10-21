import React from 'react';

import {AbsoluteFill, useCurrentFrame} from 'remotion';



/**

 * 6–10 frame wipe you can place between scenes for a consistent authored feel.

 * Usage: render for a short composition or include at the end/beginning of scenes.

 */

export const WhiteboardWipe: React.FC<{accent?: string}> = ({accent = 'var(--kn-accent)'}) => {

  const f = useCurrentFrame();

  const pct = Math.min(1, f / 8); // 8 frames

  return (

    <AbsoluteFill style={{background: 'var(--kn-bg)'}}>

      <div

        style={{

          position: 'absolute',

          left: `${(pct - 1) * 100}%`,

          top: 0,

          width: '100%',

          height: '100%',

          background: accent,

          opacity: 0.12

        }}

      />

      <div

        style={{

          position: 'absolute',

          left: `${(pct - 1) * 100 + 98}%`,

          top: 0,

          width: '6px',

          height: '100%',

          background: accent,

        }}

      />

    </AbsoluteFill>

  );

};

