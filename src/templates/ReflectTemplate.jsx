import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';

/**
 * REFLECT TEMPLATE - Cinematic Write-On Flow
 */

const ReflectTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.cream,
    accent: THEME.colors.markers.purple,
    ink: THEME.colors.text.primary,
  };

  const texts = scene.fill?.texts || {};

  const BEAT = 36;
  const beats = {
    prelude: 0,
    title: BEAT * 1,
    insight1: BEAT * 2.4,
    insight2: BEAT * 4,
    insight3: BEAT * 5.6,
    pause1: BEAT * 7.2,
    question: BEAT * 8,
    pause2: BEAT * 10,
    nextSteps: BEAT * 10.8,
    settle: BEAT * 13,
  };

  const cameraZoom = interpolate(
    frame,
    [0, beats.insight1, beats.nextSteps, beats.settle],
    [1.0, 1.02, 1.04, 1.01],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cameraDriftX = Math.sin(frame * 0.008) * 2;
  const cameraDriftY = Math.cos(frame * 0.006) * 1.5;

  const getPulse = (pauseFrame, duration = 50) => {
    if (frame < pauseFrame || frame > pauseFrame + duration) return 1;
    const progress = (frame - pauseFrame) / duration;
    return 1 + Math.sin(progress * Math.PI * 2) * 0.04;
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
    if (frame < startFrame) return { opacity: 0, scale: 0 };
    if (frame >= startFrame + duration) return { opacity: 1, scale: 1 };

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
    );

    return { opacity: progress, scale: progress };
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
          padding: '70px 100px',
        }}
      >
        {/* TITLE with icon */}
        {frame >= beats.title && (
          <div
            style={{
              position: 'absolute',
              top: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
            }}
          >
            {/* Thought bubble icon builds */}
            <div
              style={{
                display: 'inline-flex',
                marginBottom: 20,
                transform: `scale(${buildIn(beats.title, 20).scale})`,
                opacity: buildIn(beats.title, 20).opacity,
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  backgroundColor: `${colors.accent}20`,
                  border: `5px solid ${colors.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 52,
                  boxShadow: `0 4px 16px ${colors.accent}30`,
                }}
              >
                💭
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={writeOnReveal(beats.title + 16, 26)}>
                <span
                  style={{
                    fontFamily: THEME.fonts.marker.secondary,
                    fontSize: 58,
                    fontWeight: 700,
                    color: colors.accent,
                    lineHeight: 1.2,
                    textShadow: depthShadow,
                  }}
                >
                  {texts.title || '🤔 Time to Reflect'}
                </span>
              </div>

              {/* Pen tip */}
              {(() => {
                const reveal = writeOnReveal(beats.title + 16, 26);
                if (reveal.progress > 0 && reveal.progress < 1) {
                  return (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${50 + reveal.progress * 25}%`,
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
          </div>
        )}

        {/* INSIGHTS - vertical stack */}
        <div
          style={{
            position: 'absolute',
            top: 260,
            left: 100,
            right: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {[1, 2, 3].map((num) => {
            const insightText = texts[`insight${num}`];
            if (!insightText || frame < beats[`insight${num}`]) return null;

            return (
              <div
                key={num}
                style={{
                  opacity: buildIn(beats[`insight${num}`], 22).opacity,
                  transform: `translateY(${(1 - buildIn(beats[`insight${num}`], 22).scale) * 25}px)`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 20,
                    alignItems: 'flex-start',
                    padding: '22px 30px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: `3px solid ${colors.accent}60`,
                    borderLeft: `10px solid ${colors.accent}`,
                    borderRadius: 8,
                    boxShadow: depthShadow,
                  }}
                >
                  {/* Badge builds */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: colors.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 26,
                      fontWeight: 700,
                      color: '#fff',
                      fontFamily: THEME.fonts.marker.secondary,
                      transform: `scale(${buildIn(beats[`insight${num}`] + 8, 12).scale})`,
                      opacity: buildIn(beats[`insight${num}`] + 8, 12).opacity,
                      boxShadow: `0 3px 10px ${colors.accent}50`,
                    }}
                  >
                    {num}
                  </div>

                  {/* Text writes */}
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div style={writeOnReveal(beats[`insight${num}`] + 12, 24)}>
                      <span
                        style={{
                          fontFamily: THEME.fonts.marker.handwritten,
                          fontSize: 27,
                          color: colors.ink,
                          lineHeight: 1.5,
                        }}
                      >
                        {insightText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAUSE 1 */}
        {frame >= beats.pause1 && frame < beats.question && (
          <div style={{ transform: `scale(${getPulse(beats.pause1)})` }} />
        )}

        {/* QUESTION - dashed box */}
        {frame >= beats.question && texts.question && (
          <div
            style={{
              position: 'absolute',
              top: 600,
              left: 100,
              right: 100,
            }}
          >
            <div
              style={{
                opacity: buildIn(beats.question, 26).opacity,
                transform: `scale(${buildIn(beats.question, 26).scale})`,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  padding: '28px 40px',
                  backgroundColor: `${colors.accent}10`,
                  border: `4px dashed ${colors.accent}`,
                  borderRadius: 12,
                  boxShadow: depthShadow,
                }}
              >
                {/* Question mark badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: -22,
                    left: 40,
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 34,
                    fontWeight: 700,
                    border: `4px solid ${colors.bg}`,
                    boxShadow: `0 4px 14px ${colors.accent}50`,
                    transform: `scale(${buildIn(beats.question + 10, 14).scale})`,
                  }}
                >
                  ?
                </div>

                <div style={{ paddingTop: 8, position: 'relative' }}>
                  <div style={writeOnReveal(beats.question + 12, 28)}>
                    <span
                      style={{
                        fontFamily: THEME.fonts.structure.primary,
                        fontSize: 26,
                        fontWeight: 600,
                        color: colors.accent,
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                        textAlign: 'center',
                        display: 'block',
                      }}
                    >
                      {texts.question}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAUSE 2 */}
        {frame >= beats.pause2 && frame < beats.nextSteps && (
          <div style={{ transform: `scale(${getPulse(beats.pause2, 40)})` }} />
        )}

        {/* NEXT STEPS */}
        {frame >= beats.nextSteps && texts.nextSteps && (
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
                opacity: buildIn(beats.nextSteps, 26).opacity,
                transform: `scale(${buildIn(beats.nextSteps, 26).scale})`,
              }}
            >
              <div
                style={{
                  padding: '26px 55px',
                  backgroundColor: colors.accent,
                  borderRadius: 50,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  border: `5px solid ${colors.bg}`,
                }}
              >
                <div style={writeOnReveal(beats.nextSteps + 10, 26)}>
                  <span
                    style={{
                      fontFamily: THEME.fonts.structure.primary,
                      fontSize: 30,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 14,
                    }}
                  >
                    <span style={{ fontSize: 38 }}>🚀</span>
                    {texts.nextSteps}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sparkles decoration */}
        {frame >= beats.title + 20 && (
          <>
            <div
              style={{
                position: 'absolute',
                top: 70,
                right: 120,
                fontSize: 36,
                opacity: 0.25,
                transform: `scale(${getPulse(beats.title + 20, 100)})`,
              }}
            >
              ✨
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 65,
                left: 100,
                fontSize: 32,
                opacity: 0.25,
                transform: `scale(${getPulse(beats.title + 50, 100)})`,
              }}
            >
              ✨
            </div>
          </>
        )}

        {/* Settle */}
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

export { ReflectTemplate };
export const REFLECT_DURATION = 14 * 30;
export const REFLECT_EXIT_TRANSITION = 15;
