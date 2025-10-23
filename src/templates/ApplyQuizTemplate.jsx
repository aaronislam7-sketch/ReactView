import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';

/**
 * APPLY QUIZ TEMPLATE
 * 
 * For multiple choice questions with answer reveal
 * Shows question → options appear → pause → answer highlights → explanation
 */

const ApplyQuizTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.cream,
    accent: THEME.colors.markers.green,
    correct: THEME.colors.markers.green,
    incorrect: '#999',
    ink: THEME.colors.text.primary,
  };

  const texts = scene.fill?.texts || {};
  const quiz = scene.fill?.quiz || {};

  const BEAT = 36;
  const beats = {
    prelude: 0,
    context: BEAT * 0.5,
    question: BEAT * 2,
    optionA: BEAT * 3.5,
    optionB: BEAT * 4.2,
    optionC: BEAT * 4.9,
    optionD: BEAT * 5.6,
    pause: BEAT * 6.8,
    reveal: BEAT * 8,
    explanation: BEAT * 9.5,
    settle: durationInFrames - BEAT,
  };

  const cameraZoom = interpolate(
    frame,
    [0, beats.question, beats.reveal, beats.settle],
    [1.0, 1.02, 1.04, 1.01],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cameraDriftX = Math.sin(frame * 0.008) * 2;
  const cameraDriftY = Math.cos(frame * 0.006) * 1.5;

  const getPulse = (pauseFrame, duration = 60) => {
    if (frame < pauseFrame || frame > pauseFrame + duration) return 1;
    const progress = (frame - pauseFrame) / duration;
    return 1 + Math.sin(progress * Math.PI * 3) * 0.05;
  };

  const writeOnReveal = (startFrame, duration = 22) => {
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

  const buildIn = (startFrame, duration = 20) => {
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
  const correctAnswer = quiz.correctAnswer || 'B';

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
        {/* CONTEXT (optional scene setter) */}
        {frame >= beats.context && texts.context && (
          <div style={{ position: 'absolute', top: 60, left: 100, right: 100 }}>
            <div
              style={{
                opacity: buildIn(beats.context, 22).opacity,
                transform: `scale(${buildIn(beats.context, 22).scale})`,
              }}
            >
              <div
                style={{
                  padding: '18px 32px',
                  backgroundColor: `${colors.accent}15`,
                  border: `3px solid ${colors.accent}60`,
                  borderRadius: 8,
                  boxShadow: depthShadow,
                }}
              >
                <div style={writeOnReveal(beats.context + 10, 24)}>
                  <span
                    style={{
                      fontFamily: THEME.fonts.marker.handwritten,
                      fontSize: 26,
                      color: colors.ink,
                      lineHeight: 1.5,
                    }}
                  >
                    {texts.context}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QUESTION */}
        {frame >= beats.question && quiz.question && (
          <div
            style={{
              position: 'absolute',
              top: texts.context ? 180 : 140,
              left: 100,
              right: 100,
            }}
          >
            <div
              style={{
                opacity: buildIn(beats.question, 24).opacity,
                transform: `scale(${buildIn(beats.question, 24).scale})`,
              }}
            >
              <div
                style={{
                  padding: '28px 40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: `5px solid ${colors.accent}`,
                  borderRadius: 12,
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={writeOnReveal(beats.question + 10, 28)}>
                    <span
                      style={{
                        fontFamily: THEME.fonts.marker.secondary,
                        fontSize: 36,
                        fontWeight: 700,
                        color: colors.accent,
                        lineHeight: 1.4,
                      }}
                    >
                      {quiz.question}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OPTIONS - Pills that appear sequentially */}
        <div
          style={{
            position: 'absolute',
            top: texts.context ? 380 : 320,
            left: 100,
            right: 100,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
          }}
        >
          {['A', 'B', 'C', 'D'].map((letter, index) => {
            const optionBeat = beats[`option${letter}`];
            const optionText = quiz[`option${letter}`];
            
            if (!optionText || frame < optionBeat) return null;

            const isCorrect = letter === correctAnswer;
            const isRevealed = frame >= beats.reveal;
            const shouldHighlight = isRevealed && isCorrect;
            const shouldFade = isRevealed && !isCorrect;

            return (
              <div
                key={letter}
                style={{
                  opacity: buildIn(optionBeat, 18).opacity,
                  transform: `translateY(${(1 - buildIn(optionBeat, 18).scale) * 20}px) scale(${
                    shouldHighlight ? getPulse(beats.reveal, 40) : 1
                  })`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: '20px 28px',
                    backgroundColor: shouldHighlight
                      ? `${colors.correct}25`
                      : 'rgba(255, 255, 255, 0.95)',
                    border: `4px solid ${
                      shouldHighlight ? colors.correct : shouldFade ? colors.incorrect : colors.accent
                    }`,
                    borderRadius: 50,
                    boxShadow: shouldHighlight
                      ? `0 6px 24px ${colors.correct}40`
                      : depthShadow,
                    opacity: shouldFade ? 0.4 : 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Letter badge */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: shouldHighlight
                        ? colors.correct
                        : shouldFade
                        ? colors.incorrect
                        : colors.accent,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 26,
                      fontWeight: 700,
                      fontFamily: THEME.fonts.marker.secondary,
                    }}
                  >
                    {letter}
                  </div>

                  {/* Option text */}
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div style={writeOnReveal(optionBeat + 8, 20)}>
                      <span
                        style={{
                          fontFamily: THEME.fonts.marker.handwritten,
                          fontSize: 24,
                          color: colors.ink,
                          lineHeight: 1.4,
                        }}
                      >
                        {optionText}
                      </span>
                    </div>
                  </div>

                  {/* Checkmark for correct answer */}
                  {shouldHighlight && (
                    <div
                      style={{
                        fontSize: 36,
                        opacity: buildIn(beats.reveal + 15, 18).opacity,
                        transform: `scale(${buildIn(beats.reveal + 15, 18).scale})`,
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* PAUSE - Pulse on all options */}
        {frame >= beats.pause && frame < beats.reveal && (
          <div
            style={{
              position: 'absolute',
              top: texts.context ? 380 : 320,
              left: 100,
              right: 100,
              transform: `scale(${getPulse(beats.pause)})`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* EXPLANATION */}
        {frame >= beats.explanation && texts.explanation && (
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
                opacity: buildIn(beats.explanation, 26).opacity,
                transform: `scale(${buildIn(beats.explanation, 26).scale})`,
              }}
            >
              <div
                style={{
                  padding: '24px 42px',
                  backgroundColor: colors.accent,
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
                  border: `4px solid ${colors.bg}`,
                }}
              >
                <div style={writeOnReveal(beats.explanation + 10, 26)}>
                  <span
                    style={{
                      fontFamily: THEME.fonts.structure.primary,
                      fontSize: 26,
                      fontWeight: 600,
                      color: '#FFFFFF',
                      lineHeight: 1.4,
                      textAlign: 'center',
                      display: 'block',
                    }}
                  >
                    {texts.explanation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confetti effect on reveal */}
        {frame >= beats.reveal && frame < beats.reveal + 30 && (
          <>
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const distance = interpolate(
                frame,
                [beats.reveal, beats.reveal + 30],
                [0, 150],
                { easing: Easing.out(Easing.quad), extrapolateRight: 'clamp' }
              );
              const x = 960 + Math.cos(angle) * distance;
              const y = 540 + Math.sin(angle) * distance;

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: colors.correct,
                    opacity: interpolate(
                      frame,
                      [beats.reveal, beats.reveal + 30],
                      [1, 0],
                      { extrapolateRight: 'clamp' }
                    ),
                  }}
                />
              );
            })}
          </>
        )}

        {/* Settle */}
        {frame >= beats.settle && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: colors.bg,
              opacity: interpolate(frame, [beats.settle, beats.settle + 30], [0, 0.25], {
                extrapolateRight: 'clamp',
              }),
            }}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { ApplyQuizTemplate };
