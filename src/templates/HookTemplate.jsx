import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import {
  HandDrawnArrow,
  HandDrawnCircle,
  HandDrawnUnderline,
  WhiteboardTexture,
  ChalkSmudge,
  HandDrawnBox,
} from '../sdk/whiteboardEffects';

/**
 * HOOK Template - WHITEBOARD STYLE
 * Like explaining on a whiteboard with chalk
 * Everything has its place, just revealed with chalk drawing
 */
export const HookTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const defaultColors = {
    bg: '#1a3a2e', // Dark green chalkboard
    chalk: '#f5f5dc', // Beige chalk
    accent: '#ff6b6b', // Red chalk
    yellow: '#ffd93d', // Yellow chalk
    blue: '#4ecdc4', // Blue chalk
  };

  const colors = scene.style_tokens?.colors || defaultColors;
  const chalkColor = colors.chalk || '#f5f5dc';
  const accentColor = colors.accent || '#ff6b6b';

  const images = resolveSceneImages(scene.fill?.images);

  // FIXED TIMELINE - Everything has its place
  const timeline = {
    question: { start: 10, writeEnd: 40 },
    questionCircle: { start: 45, end: 65 },
    mainVisual: { start: 50, end: 80 },
    fact1: { start: 100, writeEnd: 130 },
    fact2: { start: 150, writeEnd: 180 },
    fact3: { start: 200, writeEnd: 230 },
    arrows: [
      { start: 135, end: 155 },
      { start: 185, end: 205 },
      { start: 235, end: 255 },
    ],
    challenge: { start: 650, writeEnd: 680 },
    challengeUnderline: { start: 685, end: 705 },
  };

  // Calculate progress for each element
  const getWriteProgress = (start, end) => {
    return interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Whiteboard texture */}
      <WhiteboardTexture opacity={0.3} />
      
      {/* Chalk smudges for depth */}
      <ChalkSmudge x={100} y={100} width={300} height={200} opacity={0.1} />
      <ChalkSmudge x={1500} y={800} width={250} height={180} opacity={0.08} />

      {/* FIXED LAYOUT - Everything in its place */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '80px 100px',
        }}
      >
        {/* QUESTION - Top center (FIXED POSITION) */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            textAlign: 'center',
          }}
        >
          {frame >= timeline.question.start && (
            <>
              <div
                style={{
                  fontFamily: 'Caveat, Patrick Hand, cursive',
                  fontSize: 72,
                  fontWeight: 700,
                  color: chalkColor,
                  lineHeight: 1.3,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  opacity: getWriteProgress(timeline.question.start, timeline.question.writeEnd),
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))',
                }}
              >
                {scene.fill?.texts?.question || '❓ What if everything changed?'}
              </div>
              
              {/* Hand-drawn circle around question */}
              {frame >= timeline.questionCircle.start && (
                <HandDrawnCircle
                  x={960}
                  y={140}
                  radius={320}
                  progress={getWriteProgress(timeline.questionCircle.start, timeline.questionCircle.end)}
                  color={accentColor}
                />
              )}
            </>
          )}
        </div>

        {/* MAIN VISUAL - Center (FIXED POSITION) */}
        <div
          style={{
            position: 'absolute',
            top: 320,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {frame >= timeline.mainVisual.start && (
            <div
              style={{
                opacity: getWriteProgress(timeline.mainVisual.start, timeline.mainVisual.end),
                transform: `scale(${0.8 + getWriteProgress(timeline.mainVisual.start, timeline.mainVisual.end) * 0.2})`,
              }}
            >
              {images?.mainImage ? (
                <img
                  src={images.mainImage}
                  alt="Main visual"
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    border: `4px solid ${chalkColor}`,
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    backgroundColor: accentColor,
                    border: `4px solid ${chalkColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 70,
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
                  }}
                >
                  💡
                </div>
              )}
            </div>
          )}
        </div>

        {/* FACTS - Fixed grid positions (NO SHIFTING) */}
        <div
          style={{
            position: 'absolute',
            top: 550,
            left: 100,
            right: 100,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 40,
          }}
        >
          {/* FACT 1 - ALWAYS IN SAME PLACE */}
          <div style={{ opacity: frame >= timeline.fact1.start ? 1 : 0 }}>
            {frame >= timeline.fact1.start && (
              <HandDrawnBox
                progress={getWriteProgress(timeline.fact1.start, timeline.fact1.writeEnd)}
                color={chalkColor}
                backgroundColor="rgba(0,0,0,0.25)"
              >
                {/* Number badge */}
                <div
                  style={{
                    fontFamily: 'Caveat, cursive',
                    fontSize: 48,
                    fontWeight: 700,
                    color: colors.yellow || '#ffd93d',
                    textAlign: 'center',
                    marginBottom: 15,
                    filter: 'drop-shadow(0 0 8px rgba(255,217,61,0.6))',
                  }}
                >
                  1
                </div>
                
                {/* Fact text */}
                <div
                  style={{
                    fontFamily: 'Patrick Hand, cursive',
                    fontSize: 28,
                    color: chalkColor,
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  {scene.fill?.texts?.fact1 || 'First surprising fact'}
                </div>
              </HandDrawnBox>
            )}
            
            {/* Arrow pointing from visual to fact 1 */}
            {frame >= timeline.arrows[0].start && (
              <HandDrawnArrow
                startX={960}
                startY={420}
                endX={320}
                endY={600}
                progress={getWriteProgress(timeline.arrows[0].start, timeline.arrows[0].end)}
                color={colors.yellow || '#ffd93d'}
              />
            )}
          </div>

          {/* FACT 2 - ALWAYS IN SAME PLACE */}
          <div style={{ opacity: frame >= timeline.fact2.start ? 1 : 0 }}>
            {frame >= timeline.fact2.start && (
              <HandDrawnBox
                progress={getWriteProgress(timeline.fact2.start, timeline.fact2.writeEnd)}
                color={chalkColor}
                backgroundColor="rgba(0,0,0,0.25)"
              >
                <div
                  style={{
                    fontFamily: 'Caveat, cursive',
                    fontSize: 48,
                    fontWeight: 700,
                    color: colors.blue || '#4ecdc4',
                    textAlign: 'center',
                    marginBottom: 15,
                    filter: 'drop-shadow(0 0 8px rgba(78,205,196,0.6))',
                  }}
                >
                  2
                </div>
                
                <div
                  style={{
                    fontFamily: 'Patrick Hand, cursive',
                    fontSize: 28,
                    color: chalkColor,
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  {scene.fill?.texts?.fact2 || 'Second key insight'}
                </div>
              </HandDrawnBox>
            )}
            
            {frame >= timeline.arrows[1].start && (
              <HandDrawnArrow
                startX={960}
                startY={420}
                endX={960}
                endY={600}
                progress={getWriteProgress(timeline.arrows[1].start, timeline.arrows[1].end)}
                color={colors.blue || '#4ecdc4'}
              />
            )}
          </div>

          {/* FACT 3 - ALWAYS IN SAME PLACE */}
          <div style={{ opacity: frame >= timeline.fact3.start ? 1 : 0 }}>
            {frame >= timeline.fact3.start && (
              <HandDrawnBox
                progress={getWriteProgress(timeline.fact3.start, timeline.fact3.writeEnd)}
                color={chalkColor}
                backgroundColor="rgba(0,0,0,0.25)"
              >
                <div
                  style={{
                    fontFamily: 'Caveat, cursive',
                    fontSize: 48,
                    fontWeight: 700,
                    color: accentColor,
                    textAlign: 'center',
                    marginBottom: 15,
                    filter: `drop-shadow(0 0 8px ${accentColor}99)`,
                  }}
                >
                  3
                </div>
                
                <div
                  style={{
                    fontFamily: 'Patrick Hand, cursive',
                    fontSize: 28,
                    color: chalkColor,
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  {scene.fill?.texts?.fact3 || 'Third important point'}
                </div>
              </HandDrawnBox>
            )}
            
            {frame >= timeline.arrows[2].start && (
              <HandDrawnArrow
                startX={960}
                startY={420}
                endX={1600}
                endY={600}
                progress={getWriteProgress(timeline.arrows[2].start, timeline.arrows[2].end)}
                color={accentColor}
              />
            )}
          </div>
        </div>

        {/* CHALLENGE - Bottom center (FIXED POSITION) */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70%',
          }}
        >
          {frame >= timeline.challenge.start && scene.fill?.texts?.challenge && (
            <>
              <div
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 54,
                  fontWeight: 700,
                  color: colors.yellow || '#ffd93d',
                  textAlign: 'center',
                  lineHeight: 1.4,
                  filter: 'drop-shadow(0 0 12px rgba(255,217,61,0.7))',
                  opacity: getWriteProgress(timeline.challenge.start, timeline.challenge.writeEnd),
                }}
              >
                {scene.fill.texts.challenge}
              </div>
              
              {/* Hand-drawn underline */}
              {frame >= timeline.challengeUnderline.start && (
                <HandDrawnUnderline
                  x={380}
                  y={990}
                  width={1160}
                  progress={getWriteProgress(timeline.challengeUnderline.start, timeline.challengeUnderline.end)}
                  color={colors.yellow || '#ffd93d'}
                />
              )}
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const HOOK_DURATION = 30 * 30;
export const HOOK_EXIT_TRANSITION = 10;
