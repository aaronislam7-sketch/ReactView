import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import {
  HandDrawnArrow,
  HandDrawnUnderline,
  HandDrawnCircle,
  WhiteboardTexture,
  ChalkSmudge,
  HandDrawnBox,
} from '../sdk/whiteboardEffects';

/**
 * APPLY Template - WHITEBOARD PROBLEM-SOLVING
 * Like working through a problem on a board
 * Scenario → Steps → Result (fixed positions)
 */
export const ApplyTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const defaultColors = {
    bg: '#1a3a2e',
    chalk: '#f5f5dc',
    accent: '#ff6b6b',
    yellow: '#ffd93d',
    green: '#95e1d3',
  };

  const colors = scene.style_tokens?.colors || defaultColors;
  const chalkColor = colors.chalk || '#f5f5dc';

  const images = resolveSceneImages(scene.fill?.images);

  // FIXED TIMELINE
  const timeline = {
    scenario: { start: 10, writeEnd: 50 },
    scenarioBox: { start: 55, end: 70 },
    
    // 3 actions in vertical flow
    action1: { start: 100, writeEnd: 130 },
    action2: { start: 180, writeEnd: 210 },
    action3: { start: 260, writeEnd: 290 },
    
    // Arrows showing flow
    arrow1: { start: 135, end: 155 },
    arrow2: { start: 215, end: 235 },
    arrow3: { start: 295, end: 315 },
    
    // Checkmarks as completed
    check1: { start: 140, end: 150 },
    check2: { start: 220, end: 230 },
    check3: { start: 300, end: 310 },
    
    result: { start: 650, writeEnd: 680 },
    resultCircle: { start: 685, end: 705 },
  };

  const getWriteProgress = (start, end) => {
    return interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <WhiteboardTexture opacity={0.3} />
      <ChalkSmudge x={150} y={200} width={350} height={180} opacity={0.1} />
      <ChalkSmudge x={1500} y={800} width={300} height={150} opacity={0.12} />

      <div style={{ position: 'absolute', inset: 0, padding: '60px 120px' }}>
        
        {/* SCENARIO BOX - Top (FIXED) */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 120,
            right: 120,
            opacity: frame >= timeline.scenario.start ? 1 : 0,
          }}
        >
          {frame >= timeline.scenario.start && scene.fill?.texts?.scenario && (
            <>
              <HandDrawnBox
                progress={getWriteProgress(timeline.scenario.start, timeline.scenario.writeEnd)}
                color={chalkColor}
                backgroundColor="rgba(0,0,0,0.35)"
              >
                <div
                  style={{
                    fontFamily: 'Caveat, cursive',
                    fontSize: 28,
                    fontWeight: 700,
                    color: colors.yellow,
                    marginBottom: 15,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                  }}
                >
                  📋 The Situation:
                </div>
                <div
                  style={{
                    fontFamily: 'Patrick Hand, cursive',
                    fontSize: 30,
                    color: chalkColor,
                    lineHeight: 1.5,
                  }}
                >
                  {scene.fill.texts.scenario}
                </div>
              </HandDrawnBox>
              
              {frame >= timeline.scenarioBox.start && (
                <HandDrawnCircle
                  x={960}
                  y={150}
                  radius={180}
                  progress={getWriteProgress(timeline.scenarioBox.start, timeline.scenarioBox.end)}
                  color={colors.yellow}
                />
              )}
            </>
          )}
        </div>

        {/* VERTICAL ACTION FLOW - FIXED POSITIONS */}
        <div
          style={{
            position: 'absolute',
            top: 340,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 900,
          }}
        >
          {/* ACTION 1 - FIXED */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              opacity: frame >= timeline.action1.start ? 1 : 0,
            }}
          >
            {frame >= timeline.action1.start && scene.fill?.texts?.action1 && (
              <HandDrawnBox
                progress={getWriteProgress(timeline.action1.start, timeline.action1.writeEnd)}
                color={chalkColor}
                backgroundColor="rgba(0,0,0,0.25)"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
                  <div
                    style={{
                      fontFamily: 'Caveat, cursive',
                      fontSize: 46,
                      fontWeight: 700,
                      color: colors.green,
                      flexShrink: 0,
                      filter: `drop-shadow(0 0 8px ${colors.green})`,
                    }}
                  >
                    →
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontFamily: 'Patrick Hand, cursive',
                      fontSize: 28,
                      color: chalkColor,
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: colors.green, fontWeight: 700 }}>STEP 1: </span>
                    {scene.fill.texts.action1}
                  </div>
                  {/* Checkmark when complete */}
                  {frame >= timeline.check1.start && (
                    <div
                      style={{
                        fontFamily: 'Caveat, cursive',
                        fontSize: 46,
                        color: colors.green,
                        opacity: getWriteProgress(timeline.check1.start, timeline.check1.end),
                        filter: `drop-shadow(0 0 10px ${colors.green})`,
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              </HandDrawnBox>
            )}
          </div>

          {/* Arrow 1 → 2 */}
          {frame >= timeline.arrow1.start && (
            <HandDrawnArrow
              startX={450}
              startY={120}
              endX={450}
              endY={180}
              progress={getWriteProgress(timeline.arrow1.start, timeline.arrow1.end)}
              color={colors.green}
            />
          )}

          {/* ACTION 2 - FIXED */}
          <div
            style={{
              position: 'absolute',
              top: 180,
              left: 0,
              right: 0,
              opacity: frame >= timeline.action2.start ? 1 : 0,
            }}
          >
            {frame >= timeline.action2.start && scene.fill?.texts?.action2 && (
              <HandDrawnBox
                progress={getWriteProgress(timeline.action2.start, timeline.action2.writeEnd)}
                color={chalkColor}
                backgroundColor="rgba(0,0,0,0.25)"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
                  <div
                    style={{
                      fontFamily: 'Caveat, cursive',
                      fontSize: 46,
                      fontWeight: 700,
                      color: colors.yellow,
                      flexShrink: 0,
                      filter: `drop-shadow(0 0 8px ${colors.yellow})`,
                    }}
                  >
                    →
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontFamily: 'Patrick Hand, cursive',
                      fontSize: 28,
                      color: chalkColor,
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: colors.yellow, fontWeight: 700 }}>STEP 2: </span>
                    {scene.fill.texts.action2}
                  </div>
                  {frame >= timeline.check2.start && (
                    <div
                      style={{
                        fontFamily: 'Caveat, cursive',
                        fontSize: 46,
                        color: colors.yellow,
                        opacity: getWriteProgress(timeline.check2.start, timeline.check2.end),
                        filter: `drop-shadow(0 0 10px ${colors.yellow})`,
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              </HandDrawnBox>
            )}
          </div>

          {/* Arrow 2 → 3 */}
          {frame >= timeline.arrow2.start && (
            <HandDrawnArrow
              startX={450}
              startY={300}
              endX={450}
              endY={360}
              progress={getWriteProgress(timeline.arrow2.start, timeline.arrow2.end)}
              color={colors.yellow}
            />
          )}

          {/* ACTION 3 - FIXED */}
          <div
            style={{
              position: 'absolute',
              top: 360,
              left: 0,
              right: 0,
              opacity: frame >= timeline.action3.start ? 1 : 0,
            }}
          >
            {frame >= timeline.action3.start && scene.fill?.texts?.action3 && (
              <HandDrawnBox
                progress={getWriteProgress(timeline.action3.start, timeline.action3.writeEnd)}
                color={chalkColor}
                backgroundColor="rgba(0,0,0,0.25)"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
                  <div
                    style={{
                      fontFamily: 'Caveat, cursive',
                      fontSize: 46,
                      fontWeight: 700,
                      color: colors.accent,
                      flexShrink: 0,
                      filter: `drop-shadow(0 0 8px ${colors.accent})`,
                    }}
                  >
                    →
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontFamily: 'Patrick Hand, cursive',
                      fontSize: 28,
                      color: chalkColor,
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: colors.accent, fontWeight: 700 }}>STEP 3: </span>
                    {scene.fill.texts.action3}
                  </div>
                  {frame >= timeline.check3.start && (
                    <div
                      style={{
                        fontFamily: 'Caveat, cursive',
                        fontSize: 46,
                        color: colors.accent,
                        opacity: getWriteProgress(timeline.check3.start, timeline.check3.end),
                        filter: `drop-shadow(0 0 10px ${colors.accent})`,
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              </HandDrawnBox>
            )}
          </div>

          {/* Arrow 3 → Result */}
          {frame >= timeline.arrow3.start && (
            <HandDrawnArrow
              startX={450}
              startY={480}
              endX={450}
              endY={540}
              progress={getWriteProgress(timeline.arrow3.start, timeline.arrow3.end)}
              color={colors.accent}
            />
          )}
        </div>

        {/* RESULT - Bottom (FIXED) */}
        {frame >= timeline.result.start && scene.fill?.texts?.result && (
          <div
            style={{
              position: 'absolute',
              bottom: 50,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70%',
            }}
          >
            <div
              style={{
                padding: 35,
                backgroundColor: 'rgba(0,0,0,0.4)',
                border: `4px solid ${colors.green}`,
                borderRadius: 16,
                opacity: getWriteProgress(timeline.result.start, timeline.result.writeEnd),
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 32,
                  fontWeight: 700,
                  color: colors.green,
                  marginBottom: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  textAlign: 'center',
                }}
              >
                ★ THE RESULT ★
              </div>
              <div
                style={{
                  fontFamily: 'Patrick Hand, cursive',
                  fontSize: 34,
                  fontWeight: 700,
                  color: chalkColor,
                  textAlign: 'center',
                  lineHeight: 1.4,
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
                }}
              >
                {scene.fill.texts.result}
              </div>
              
              {frame >= timeline.resultCircle.start && (
                <HandDrawnCircle
                  x={960}
                  y={960}
                  radius={260}
                  progress={getWriteProgress(timeline.resultCircle.start, timeline.resultCircle.end)}
                  color={colors.green}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const APPLY_DURATION = 30 * 30;
export const APPLY_EXIT_TRANSITION = 10;
