import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import {
  HandDrawnArrow,
  HandDrawnUnderline,
  WhiteboardTexture,
  ChalkSmudge,
  HandDrawnBox,
  AnimatedNumber,
} from '../sdk/whiteboardEffects';

/**
 * EXPLAIN Template - WHITEBOARD LECTURE STYLE
 * Like a professor explaining step-by-step on a board
 * Fixed layout - 2x2 grid that doesn't shift
 */
export const ExplainTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const defaultColors = {
    bg: '#1a3a2e',
    chalk: '#f5f5dc',
    accent: '#ff6b6b',
    yellow: '#ffd93d',
    blue: '#4ecdc4',
    green: '#95e1d3',
  };

  const colors = scene.style_tokens?.colors || defaultColors;
  const chalkColor = colors.chalk || '#f5f5dc';

  const images = resolveSceneImages(scene.fill?.images);

  // FIXED TIMELINE
  const timeline = {
    title: { start: 5, writeEnd: 35 },
    titleUnderline: { start: 40, end: 55 },
    concept: { start: 40, writeEnd: 70 },
    
    // All 4 steps in fixed positions
    step1: { start: 90, writeEnd: 120 },
    step2: { start: 150, writeEnd: 180 },
    step3: { start: 210, writeEnd: 240 },
    step4: { start: 270, writeEnd: 300 },
    
    // Connecting arrows
    arrows: [
      { start: 125, end: 145 }, // 1 → 2
      { start: 185, end: 205 }, // 2 → 3
      { start: 245, end: 265 }, // 3 → 4
    ],
    
    summary: { start: 650, writeEnd: 680 },
    summaryBox: { start: 685, end: 700 },
  };

  const getWriteProgress = (start, end) => {
    return interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  };

  // Define FIXED positions for 2x2 grid
  const gridPositions = [
    { x: 150, y: 380 },  // Top left
    { x: 1050, y: 380 }, // Top right
    { x: 150, y: 680 },  // Bottom left
    { x: 1050, y: 680 }, // Bottom right
  ];

  const stepColors = [colors.yellow, colors.blue, colors.green, colors.accent];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <WhiteboardTexture opacity={0.25} />
      <ChalkSmudge x={200} y={150} width={400} height={150} opacity={0.12} />
      <ChalkSmudge x={1400} y={700} width={300} height={200} opacity={0.1} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 100px' }}>
        
        {/* TITLE - Top center (FIXED) */}
        <div
          style={{
            position: 'absolute',
            top: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          {frame >= timeline.title.start && (
            <>
              <div
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 68,
                  fontWeight: 700,
                  color: chalkColor,
                  opacity: getWriteProgress(timeline.title.start, timeline.title.writeEnd),
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))',
                }}
              >
                {scene.fill?.texts?.title || '📚 How It Works'}
              </div>
              
              {frame >= timeline.titleUnderline.start && (
                <HandDrawnUnderline
                  x={660}
                  y={150}
                  width={600}
                  progress={getWriteProgress(timeline.titleUnderline.start, timeline.titleUnderline.end)}
                  color={colors.accent}
                />
              )}
            </>
          )}
        </div>

        {/* CONCEPT - Below title (FIXED) */}
        {frame >= timeline.concept.start && scene.fill?.texts?.concept && (
          <div
            style={{
              position: 'absolute',
              top: 190,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '75%',
              textAlign: 'center',
              fontFamily: 'Patrick Hand, cursive',
              fontSize: 32,
              color: colors.yellow,
              lineHeight: 1.5,
              opacity: getWriteProgress(timeline.concept.start, timeline.concept.writeEnd),
            }}
          >
            💡 {scene.fill.texts.concept}
          </div>
        )}

        {/* 4 STEPS IN 2x2 GRID - FIXED POSITIONS (NO SHIFTING!) */}
        {[1, 2, 3, 4].map((num, index) => {
          const stepKey = `step${num}`;
          const stepText = scene.fill?.texts?.[stepKey];
          const stepTimeline = timeline[`step${num}`];
          const pos = gridPositions[index];
          const stepColor = stepColors[index];
          
          if (!stepText) return null;

          return (
            <div
              key={num}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                width: 700,
                opacity: frame >= stepTimeline.start ? 1 : 0,
              }}
            >
              {frame >= stepTimeline.start && (
                <HandDrawnBox
                  progress={getWriteProgress(stepTimeline.start, stepTimeline.writeEnd)}
                  color={chalkColor}
                  backgroundColor="rgba(0,0,0,0.3)"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {/* Step number in circle */}
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        border: `3px solid ${stepColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <AnimatedNumber
                        value={num}
                        progress={getWriteProgress(stepTimeline.start, stepTimeline.writeEnd)}
                        style={{
                          fontFamily: 'Caveat, cursive',
                          fontSize: 40,
                          fontWeight: 700,
                          color: stepColor,
                          filter: `drop-shadow(0 0 6px ${stepColor})`,
                        }}
                      />
                    </div>
                    
                    {/* Step text */}
                    <div
                      style={{
                        flex: 1,
                        fontFamily: 'Patrick Hand, cursive',
                        fontSize: 26,
                        color: chalkColor,
                        lineHeight: 1.4,
                      }}
                    >
                      {stepText}
                    </div>
                  </div>
                </HandDrawnBox>
              )}
            </div>
          );
        })}

        {/* CONNECTING ARROWS - Show flow between steps */}
        {/* Arrow 1 → 2 */}
        {frame >= timeline.arrows[0].start && (
          <HandDrawnArrow
            startX={850}
            startY={450}
            endX={1050}
            endY={450}
            progress={getWriteProgress(timeline.arrows[0].start, timeline.arrows[0].end)}
            color={colors.blue}
          />
        )}
        
        {/* Arrow 2 → 3 */}
        {frame >= timeline.arrows[1].start && (
          <HandDrawnArrow
            startX={1400}
            startY={530}
            endX={850}
            endY={680}
            progress={getWriteProgress(timeline.arrows[1].start, timeline.arrows[1].end)}
            color={colors.green}
          />
        )}
        
        {/* Arrow 3 → 4 */}
        {frame >= timeline.arrows[2].start && (
          <HandDrawnArrow
            startX={850}
            startY={750}
            endX={1050}
            endY={750}
            progress={getWriteProgress(timeline.arrows[2].start, timeline.arrows[2].end)}
            color={colors.accent}
          />
        )}

        {/* SUMMARY - Bottom center (FIXED) */}
        {frame >= timeline.summary.start && scene.fill?.texts?.summary && (
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '75%',
            }}
          >
            <div
              style={{
                padding: 30,
                backgroundColor: 'rgba(0,0,0,0.4)',
                border: `3px dashed ${colors.yellow}`,
                borderRadius: 12,
                opacity: getWriteProgress(timeline.summary.start, timeline.summary.writeEnd),
              }}
            >
              <div
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 42,
                  fontWeight: 700,
                  color: colors.yellow,
                  textAlign: 'center',
                  lineHeight: 1.4,
                  filter: 'drop-shadow(0 0 10px rgba(255,217,61,0.7))',
                }}
              >
                ✓ {scene.fill.texts.summary}
              </div>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const EXPLAIN_DURATION = 30 * 30;
export const EXPLAIN_EXIT_TRANSITION = 10;
