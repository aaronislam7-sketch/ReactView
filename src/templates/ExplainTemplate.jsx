import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';

/**
 * EXPLAIN TEMPLATE - Cinematic Write-On Flow
 * 
 * Same system as Hook:
 * - Proper spacing (no overlaps)
 * - Visible pen tips (20px)
 * - Pulse during pauses
 * - Visuals build on
 * - Sequential timing
 * - Connecting lines guide attention
 */

const ExplainTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.primary,
    accent: THEME.colors.markers.blue,
    ink: THEME.colors.text.primary,
  };

  const texts = scene.fill?.texts || {};

  const BEAT = 36;
  const beats = {
    prelude: 0,
    title: BEAT * 1,
    concept: BEAT * 2.4,
    pause1: BEAT * 3.8,
    step1: BEAT * 4.6,
    step2: BEAT * 6,
    step3: BEAT * 7.4,
    step4: BEAT * 8.8,
    pause2: BEAT * 10.2,
    summary: BEAT * 11,
    settle: BEAT * 13,
  };

  const cameraZoom = interpolate(
    frame,
    [0, beats.step1, beats.summary, beats.settle],
    [1.0, 1.02, 1.04, 1.01],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cameraDriftX = Math.sin(frame * 0.008) * 2;
  const cameraDriftY = Math.cos(frame * 0.006) * 1.5;

  const getPulse = (pauseFrame, duration = 50) => {
    if (frame < pauseFrame || frame > pauseFrame + duration) return 1;
    const progress = (frame - pauseFrame) / duration;
    return 1 + Math.sin(progress * Math.PI * 2.5) * 0.04;
  };

  const writeOnReveal = (startFrame, duration = 20) => {
    if (frame < startFrame) return { opacity: 0, clipPath: 'inset(0 100% 0 0)', progress: 0 };
    if (frame >= startFrame + duration) return { opacity: 1, clipPath: 'inset(0 0 0 0)', progress: 1 };

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
    );

    return {
      opacity: interpolate(progress, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' }),
      clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
      progress,
    };
  };

  const buildIn = (startFrame, duration = 22) => {
    if (frame < startFrame) return { opacity: 0, strokeDashoffset: 1, scale: 0 };
    if (frame >= startFrame + duration) return { opacity: 1, strokeDashoffset: 0, scale: 1 };

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
    );

    return { opacity: progress, strokeDashoffset: 1 - progress, scale: progress };
  };

  const depthShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
      }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom}) translate(${cameraDriftX}px, ${cameraDriftY}px)`,
          padding: '70px 90px',
        }}
      >
        {/* TITLE - Top, with underline */}
        {frame >= beats.title && (
          <div style={{ position: 'absolute', top: 70, left: 90, right: 90 }}>
            <div style={{ position: 'relative' }}>
              <div style={writeOnReveal(beats.title, 26)}>
                <span
                  style={{
                    fontFamily: THEME.fonts.marker.secondary,
                    fontSize: 58,
                    fontWeight: 700,
                    color: colors.ink,
                    lineHeight: 1.2,
                    textShadow: depthShadow,
                  }}
                >
                  {texts.title || '📚 Understanding the Concept'}
                </span>
              </div>

              {/* Pen tip */}
              {(() => {
                const reveal = writeOnReveal(beats.title, 26);
                if (reveal.progress > 0 && reveal.progress < 1) {
                  return (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${reveal.progress * 100}%`,
                        top: '50%',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: colors.accent,
                        transform: 'translateY(-50%)',
                        boxShadow: `0 0 20px ${colors.accent}`,
                      }}
                    />
                  );
                }
              })()}
            </div>

            {/* Underline draws */}
            {frame >= beats.title + 22 && (
              <svg width="500" height="6" viewBox="0 0 500 6" style={{ marginTop: 12 }}>
                <line
                  x1="0"
                  y1="3"
                  x2="500"
                  y2="3"
                  stroke={colors.accent}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="500"
                  strokeDashoffset={interpolate(
                    frame,
                    [beats.title + 22, beats.title + 44],
                    [500, 0],
                    { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
                  )}
                />
              </svg>
            )}
          </div>
        )}

        {/* CONCEPT - Key idea bar */}
        {frame >= beats.concept && texts.concept && (
          <div
            style={{
              position: 'absolute',
              top: 180,
              left: 90,
              right: 90,
            }}
          >
            <div
              style={{
                opacity: buildIn(beats.concept, 24).opacity,
                transform: `scale(${buildIn(beats.concept, 24).scale})`,
              }}
            >
              <div
                style={{
                  padding: '20px 35px',
                  backgroundColor: `${colors.accent}15`,
                  border: `3px solid ${colors.accent}`,
                  borderRadius: 8,
                  boxShadow: depthShadow,
                }}
              >
                <div style={writeOnReveal(beats.concept + 12, 24)}>
                  <span
                    style={{
                      fontFamily: THEME.fonts.structure.primary,
                      fontSize: 28,
                      fontWeight: 600,
                      color: colors.accent,
                      lineHeight: 1.5,
                    }}
                  >
                    {texts.concept}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAUSE 1 */}
        {frame >= beats.pause1 && frame < beats.step1 && (
          <div style={{ transform: `scale(${getPulse(beats.pause1)})` }} />
        )}

        {/* 4 STEPS - 2x2 grid, no overlaps */}
        <div
          style={{
            position: 'absolute',
            top: 320,
            left: 90,
            right: 90,
            bottom: 180,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 30,
          }}
        >
          {[
            { key: 'step1', beat: beats.step1, num: 1 },
            { key: 'step2', beat: beats.step2, num: 2 },
            { key: 'step3', beat: beats.step3, num: 3 },
            { key: 'step4', beat: beats.step4, num: 4 },
          ].map(({ key, beat, num }) => {
            const stepText = texts[key];
            if (!stepText || frame < beat) return null;

            return (
              <div
                key={key}
                style={{
                  opacity: buildIn(beat, 22).opacity,
                  transform: `translateY(${(1 - buildIn(beat, 22).scale) * 25}px)`,
                }}
              >
                <div
                  style={{
                    padding: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: `3px solid ${colors.accent}`,
                    borderRadius: 8,
                    boxShadow: depthShadow,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                >
                  {/* Badge builds */}
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: colors.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                      fontWeight: 700,
                      color: '#fff',
                      transform: `scale(${buildIn(beat + 10, 12).scale})`,
                      opacity: buildIn(beat + 10, 12).opacity,
                      boxShadow: `0 4px 12px ${colors.accent}50`,
                    }}
                  >
                    {num}
                  </div>

                  {/* Text writes on */}
                  <div style={{ position: 'relative', flex: 1 }}>
                    <div style={writeOnReveal(beat + 14, 22)}>
                      <span
                        style={{
                          fontFamily: THEME.fonts.marker.handwritten,
                          fontSize: 26,
                          color: colors.ink,
                          lineHeight: 1.5,
                        }}
                      >
                        {stepText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Connecting lines - flow between steps */}
        {frame >= beats.step1 + 35 && (
          <svg
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            viewBox="0 0 1920 1080"
          >
            {/* 1 to 2 */}
            <path
              d="M 850 600 L 1070 600"
              stroke={colors.accent}
              strokeWidth="3"
              strokeDasharray="220"
              strokeDashoffset={interpolate(
                frame,
                [beats.step2 + 20, beats.step2 + 38],
                [220, 0],
                { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
              )}
              opacity="0.25"
              fill="none"
            />
            
            {/* 2 to 3 (diagonal) */}
            {frame >= beats.step3 + 20 && (
              <path
                d="M 1300 700 L 650 850"
                stroke={colors.accent}
                strokeWidth="3"
                strokeDasharray="680"
                strokeDashoffset={interpolate(
                  frame,
                  [beats.step3 + 20, beats.step3 + 42],
                  [680, 0],
                  { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
                )}
                opacity="0.25"
                fill="none"
              />
            )}
            
            {/* 3 to 4 */}
            {frame >= beats.step4 + 20 && (
              <path
                d="M 850 900 L 1070 900"
                stroke={colors.accent}
                strokeWidth="3"
                strokeDasharray="220"
                strokeDashoffset={interpolate(
                  frame,
                  [beats.step4 + 20, beats.step4 + 38],
                  [220, 0],
                  { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
                )}
                opacity="0.25"
                fill="none"
              />
            )}
          </svg>
        )}

        {/* PAUSE 2 */}
        {frame >= beats.pause2 && frame < beats.summary && (
          <div style={{ transform: `scale(${getPulse(beats.pause2, 40)})` }} />
        )}

        {/* SUMMARY - Bottom */}
        {frame >= beats.summary && texts.summary && (
          <div
            style={{
              position: 'absolute',
              bottom: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '75%',
            }}
          >
            <div
              style={{
                opacity: buildIn(beats.summary, 26).opacity,
                transform: `scale(${buildIn(beats.summary, 26).scale})`,
              }}
            >
              <div
                style={{
                  padding: '24px 45px',
                  backgroundColor: colors.accent,
                  borderRadius: 50,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
                }}
              >
                <div style={writeOnReveal(beats.summary + 10, 24)}>
                  <span
                    style={{
                      fontFamily: THEME.fonts.structure.primary,
                      fontSize: 32,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 38 }}>💡</span>
                    {texts.summary}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settle fade */}
        {frame >= beats.settle && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: colors.bg,
              opacity: interpolate(frame, [beats.settle, beats.settle + 40], [0, 0.25], {
                extrapolateRight: 'clamp',
              }),
            }}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { ExplainTemplate };
export const EXPLAIN_DURATION = 14 * 30;
export const EXPLAIN_EXIT_TRANSITION = 15;
