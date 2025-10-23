import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';

/**
 * APPLY TEMPLATE - Cinematic Write-On Flow
 */

const ApplyTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.cream,
    accent: THEME.colors.markers.green,
    ink: THEME.colors.text.primary,
  };

  const texts = scene.fill?.texts || {};

  const BEAT = 36;
  const beats = {
    prelude: 0,
    scenario: BEAT * 1,
    pause1: BEAT * 2.6,
    action1: BEAT * 3.4,
    action1Complete: BEAT * 5,
    action2: BEAT * 5.8,
    action2Complete: BEAT * 7.4,
    action3: BEAT * 8.2,
    action3Complete: BEAT * 9.8,
    pause2: BEAT * 10.6,
    result: BEAT * 11.4,
    settle: BEAT * 13,
  };

  const cameraZoom = interpolate(
    frame,
    [0, beats.action1, beats.result, beats.settle],
    [1.0, 1.02, 1.04, 1.01],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cameraDriftX = Math.sin(frame * 0.008) * 2;
  const cameraDriftY = Math.cos(frame * 0.006) * 1.5;

  const getPulse = (pauseFrame, duration = 45) => {
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
        {/* Progress dots - top right */}
        {frame >= beats.scenario && (
          <div style={{ position: 'absolute', top: 60, right: 100, display: 'flex', gap: 14 }}>
            {[1, 2, 3].map((i) => {
              const actionComplete = frame >= beats[`action${i}Complete`];
              const actionActive =
                frame >= beats[`action${i}`] && frame < beats[`action${i}Complete`];

              return (
                <div
                  key={i}
                  style={{
                    width: actionActive ? 36 : 30,
                    height: actionActive ? 36 : 30,
                    borderRadius: '50%',
                    backgroundColor: actionComplete ? colors.accent : actionActive ? `${colors.accent}60` : '#ddd',
                    border: `3px solid ${actionComplete || actionActive ? '#fff' : 'transparent'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: actionComplete ? `0 4px 14px ${colors.accent}70` : 'none',
                    transform: `scale(${getPulse(beats[`action${i}`], 30)})`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {actionComplete && <span style={{ fontSize: 18, color: '#fff' }}>✓</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* SCENARIO */}
        {frame >= beats.scenario && texts.scenario && (
          <div style={{ position: 'absolute', top: 140, left: 100, right: 100 }}>
            <div
              style={{
                opacity: buildIn(beats.scenario, 24).opacity,
                transform: `scale(${buildIn(beats.scenario, 24).scale})`,
              }}
            >
              <div
                style={{
                  padding: '24px 35px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: `4px solid ${colors.accent}80`,
                  borderRadius: 10,
                  boxShadow: depthShadow,
                  position: 'relative',
                }}
              >
                {/* Label */}
                <div
                  style={{
                    position: 'absolute',
                    top: -16,
                    left: 30,
                    padding: '6px 18px',
                    backgroundColor: colors.accent,
                    color: '#fff',
                    fontFamily: THEME.fonts.structure.primary,
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '1px',
                    borderRadius: 6,
                    textTransform: 'uppercase',
                  }}
                >
                  📋 Scenario
                </div>

                <div style={{ paddingTop: 8, position: 'relative' }}>
                  <div style={writeOnReveal(beats.scenario + 12, 26)}>
                    <span
                      style={{
                        fontFamily: THEME.fonts.marker.handwritten,
                        fontSize: 28,
                        color: colors.ink,
                        lineHeight: 1.6,
                      }}
                    >
                      {texts.scenario}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIONS - vertical stack, no overlaps */}
        <div
          style={{
            position: 'absolute',
            top: 320,
            left: 100,
            right: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
          }}
        >
          {[1, 2, 3].map((num) => {
            const actionText = texts[`action${num}`];
            if (!actionText || frame < beats[`action${num}`]) return null;

            const isActive = frame >= beats[`action${num}`] && frame < beats[`action${num}Complete`];
            const isComplete = frame >= beats[`action${num}Complete`];

            return (
              <div
                key={num}
                style={{
                  opacity: buildIn(beats[`action${num}`], 22).opacity,
                  transform: `translateY(${(1 - buildIn(beats[`action${num}`], 22).scale) * 30}px)`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 22,
                    alignItems: 'center',
                    padding: '22px 30px',
                    backgroundColor: isComplete ? `${colors.accent}15` : 'rgba(255, 255, 255, 0.95)',
                    border: `3px solid ${isComplete ? colors.accent : `${colors.accent}60`}`,
                    borderRadius: 8,
                    boxShadow: isActive ? '0 6px 20px rgba(0, 0, 0, 0.12)' : depthShadow,
                    transform: isActive ? `scale(${getPulse(beats[`action${num}`])})` : 'scale(1)',
                  }}
                >
                  {/* Indicator */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: isComplete ? colors.accent : isActive ? `${colors.accent}80` : '#ddd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 32,
                      fontWeight: 700,
                      color: '#fff',
                      boxShadow: isComplete ? `0 4px 16px ${colors.accent}60` : 'none',
                      fontFamily: THEME.fonts.marker.secondary,
                      transform: `scale(${buildIn(beats[`action${num}`] + 8, 14).scale})`,
                    }}
                  >
                    {isComplete ? '✓' : num}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: THEME.fonts.structure.primary,
                        fontSize: 18,
                        fontWeight: 700,
                        color: isComplete ? colors.accent : `${colors.accent}`,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: 8,
                      }}
                    >
                      Action {num} {isComplete && '✓ Complete'} {isActive && '→ In Progress'}
                    </div>

                    <div style={{ position: 'relative' }}>
                      <div style={writeOnReveal(beats[`action${num}`] + 12, 24)}>
                        <span
                          style={{
                            fontFamily: THEME.fonts.marker.handwritten,
                            fontSize: 26,
                            color: colors.ink,
                            lineHeight: 1.5,
                          }}
                        >
                          {actionText}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow to next */}
                {num < 3 && (
                  <div
                    style={{
                      marginLeft: 70,
                      marginTop: 8,
                      fontSize: 32,
                      color: `${colors.accent}40`,
                    }}
                  >
                    ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Connecting flow line */}
        {frame >= beats.action1 + 35 && (
          <svg
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            viewBox="0 0 1920 1080"
          >
            <path
              d="M 170 450 L 170 850"
              stroke={colors.accent}
              strokeWidth="4"
              strokeDasharray="400"
              strokeDashoffset={interpolate(
                frame,
                [beats.action1 + 35, beats.action3],
                [400, 0],
                { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
              )}
              opacity="0.2"
              fill="none"
            />
          </svg>
        )}

        {/* PAUSE 2 */}
        {frame >= beats.pause2 && frame < beats.result && (
          <div style={{ transform: `scale(${getPulse(beats.pause2)})` }} />
        )}

        {/* RESULT */}
        {frame >= beats.result && texts.result && (
          <div
            style={{
              position: 'absolute',
              bottom: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '80%',
            }}
          >
            <div
              style={{
                opacity: buildIn(beats.result, 28).opacity,
                transform: `scale(${buildIn(beats.result, 28).scale})`,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  padding: '28px 50px',
                  backgroundColor: colors.accent,
                  borderRadius: 12,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '6px 24px',
                    backgroundColor: colors.bg,
                    border: `4px solid ${colors.accent}`,
                    borderRadius: 30,
                    fontFamily: THEME.fonts.structure.primary,
                    fontSize: 18,
                    fontWeight: 700,
                    color: colors.accent,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                  }}
                >
                  ★ Result ★
                </div>

                <div style={{ paddingTop: 12, position: 'relative' }}>
                  <div style={writeOnReveal(beats.result + 10, 26)}>
                    <span
                      style={{
                        fontFamily: THEME.fonts.structure.primary,
                        fontSize: 30,
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.4,
                        textAlign: 'center',
                        display: 'block',
                      }}
                    >
                      {texts.result}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export { ApplyTemplate };
export const APPLY_DURATION = 14 * 30;
export const APPLY_EXIT_TRANSITION = 15;
