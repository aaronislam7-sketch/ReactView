import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';

/**
 * HOOK TEMPLATE - Cinematic Write-On Flow v2
 * 
 * Fixed:
 * - Proper spacing and alignment (no overlaps)
 * - Full frame real estate usage
 * - Visible pen tips (20px, animated trails)
 * - Pulse/focus during pauses
 * - Visuals draw on (not just appear)
 * - Sequential timing (no overlaps)
 * - Connecting lines guide attention
 * - Motion carryover between beats
 */

const HookTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.primary,
    accent: THEME.colors.markers.red,
    ink: THEME.colors.text.primary,
  };

  const texts = scene.fill?.texts || {};

  // BEAT GRID: 1.2s intervals with proper spacing
  const BEAT = 36;
  const beats = {
    prelude: 0,
    question1: BEAT * 1,
    question2: BEAT * 2.2,
    pause1: BEAT * 3.4,        // Pause with pulse
    visual1: BEAT * 4.2,
    spark1: BEAT * 5.4,
    spark2: BEAT * 6.8,
    spark3: BEAT * 8.2,
    pause2: BEAT * 9.6,        // Pause with pulse
    challenge: BEAT * 10.4,
    settle: BEAT * 12,
  };

  // Micro-camera motion
  const cameraZoom = interpolate(
    frame,
    [0, beats.visual1, beats.challenge, beats.settle + 20],
    [1.0, 1.02, 1.04, 1.01],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const cameraDriftX = Math.sin(frame * 0.008) * 2;
  const cameraDriftY = Math.cos(frame * 0.006) * 1.5;

  // Pulse effect during pauses
  const getPulse = (pauseFrame, duration = 60) => {
    if (frame < pauseFrame || frame > pauseFrame + duration) return 1;
    const progress = (frame - pauseFrame) / duration;
    return 1 + Math.sin(progress * Math.PI * 3) * 0.04;
  };

  // Write-on with visible pen trail
  const writeOnReveal = (startFrame, duration = 20, direction = 'left') => {
    if (frame < startFrame) return { opacity: 0, clipPath: 'inset(0 100% 0 0)' };
    if (frame >= startFrame + duration) return { opacity: 1, clipPath: 'inset(0 0 0 0)' };

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { 
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp' 
      }
    );

    const clips = {
      left: `inset(0 ${(1 - progress) * 100}% 0 0)`,
      right: `inset(0 0 0 ${(1 - progress) * 100}%)`,
      center: `polygon(
        ${50 - progress * 50}% 0%, 
        ${50 + progress * 50}% 0%, 
        ${50 + progress * 50}% 100%, 
        ${50 - progress * 50}% 100%
      )`,
    };

    return {
      opacity: interpolate(progress, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' }),
      clipPath: clips[direction] || clips.left,
      progress, // Return progress for pen tip
    };
  };

  // Build-in animation (for visuals)
  const buildIn = (startFrame, duration = 25) => {
    if (frame < startFrame) return { opacity: 0, strokeDashoffset: 1, scale: 0 };
    if (frame >= startFrame + duration) return { opacity: 1, strokeDashoffset: 0, scale: 1 };

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
    );

    return {
      opacity: progress,
      strokeDashoffset: 1 - progress,
      scale: progress,
    };
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
          padding: '60px 80px',
        }}
      >
        {/* QUESTION - Top section, properly spaced */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 80,
            right: 80,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Question Part 1 */}
          {frame >= beats.question1 && (
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  ...writeOnReveal(beats.question1, 24, 'left'),
                }}
              >
                <span
                  style={{
                    fontFamily: THEME.fonts.marker.secondary,
                    fontSize: 64,
                    fontWeight: 700,
                    color: colors.accent,
                    lineHeight: 1.2,
                    textShadow: depthShadow,
                  }}
                >
                  {texts.questionPart1 || 'What if losing consciousness'}
                </span>
              </div>
              
              {/* Visible pen tip - 20px, bright */}
              {(() => {
                const reveal = writeOnReveal(beats.question1, 24, 'left');
                if (reveal.progress !== undefined && reveal.progress < 1) {
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
                        zIndex: 10,
                      }}
                    />
                  );
                }
              })()}
            </div>
          )}

          {/* Question Part 2 with indent */}
          {frame >= beats.question2 && (
            <div style={{ position: 'relative', paddingLeft: 60 }}>
              <div
                style={{
                  ...writeOnReveal(beats.question2, 24, 'left'),
                }}
              >
                <span
                  style={{
                    fontFamily: THEME.fonts.marker.secondary,
                    fontSize: 64,
                    fontWeight: 700,
                    color: colors.accent,
                    lineHeight: 1.2,
                    textShadow: depthShadow,
                  }}
                >
                  {texts.questionPart2 || 'made you smarter?'}
                </span>
              </div>
              
              {/* Pen tip */}
              {(() => {
                const reveal = writeOnReveal(beats.question2, 24, 'left');
                if (reveal.progress !== undefined && reveal.progress < 1) {
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
          )}

          {/* Underline draws on */}
          {frame >= beats.question2 + 20 && (
            <svg
              width="600"
              height="8"
              viewBox="0 0 600 8"
              style={{ marginLeft: 60, marginTop: 8 }}
            >
              <line
                x1="0"
                y1="4"
                x2="600"
                y2="4"
                stroke={colors.accent}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="600"
                strokeDashoffset={interpolate(
                  frame,
                  [beats.question2 + 20, beats.question2 + 45],
                  [600, 0],
                  { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
                )}
              />
            </svg>
          )}
        </div>

        {/* PAUSE 1 - Pulse on question */}
        {frame >= beats.pause1 && frame < beats.visual1 && (
          <div
            style={{
              position: 'absolute',
              top: 80,
              left: 80,
              right: 80,
              transform: `scale(${getPulse(beats.pause1)})`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* CENTRAL VISUAL - Middle section, draws on */}
        {frame >= beats.visual1 && (
          <div
            style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              {/* Circle builds on (draws) */}
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                style={{ position: 'absolute', inset: 0 }}
              >
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={colors.accent}
                  strokeWidth="5"
                  strokeDasharray="565"
                  strokeDashoffset={buildIn(beats.visual1, 30).strokeDashoffset * 565}
                  opacity={buildIn(beats.visual1, 30).opacity}
                />
              </svg>

              {/* Icon builds in after circle */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 110,
                  opacity: buildIn(beats.visual1 + 15, 15).opacity,
                  transform: `scale(${buildIn(beats.visual1 + 15, 15).scale})`,
                }}
              >
                {texts.icon || '🧠'}
              </div>
            </div>
          </div>
        )}

        {/* SPARKS - Bottom third, no overlaps, proper spacing */}
        <div
          style={{
            position: 'absolute',
            bottom: 180,
            left: 80,
            right: 80,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 40,
          }}
        >
          {/* Spark 1 */}
          {frame >= beats.spark1 && (
            <div
              style={{
                opacity: buildIn(beats.spark1, 20).opacity,
                transform: `translateY(${(1 - buildIn(beats.spark1, 20).scale) * 30}px)`,
              }}
            >
              <div
                style={{
                  padding: 20,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderLeft: `5px solid ${colors.accent}`,
                  borderRadius: 6,
                  boxShadow: depthShadow,
                  minHeight: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Badge builds on */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#fff',
                    transform: `scale(${buildIn(beats.spark1 + 8, 12).scale})`,
                    opacity: buildIn(beats.spark1 + 8, 12).opacity,
                  }}
                >
                  1
                </div>
                
                {/* Text writes on */}
                <div style={{ position: 'relative' }}>
                  <div style={writeOnReveal(beats.spark1 + 12, 20, 'left')}>
                    <span
                      style={{
                        fontFamily: THEME.fonts.marker.handwritten,
                        fontSize: 26,
                        color: colors.ink,
                        lineHeight: 1.4,
                      }}
                    >
                      {texts.spark1 || 'brain clears toxins'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Spark 2 */}
          {frame >= beats.spark2 && (
            <div
              style={{
                opacity: buildIn(beats.spark2, 20).opacity,
                transform: `translateY(${(1 - buildIn(beats.spark2, 20).scale) * 30}px)`,
              }}
            >
              <div
                style={{
                  padding: 20,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderLeft: `5px solid ${colors.accent}`,
                  borderRadius: 6,
                  boxShadow: depthShadow,
                  minHeight: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#fff',
                    transform: `scale(${buildIn(beats.spark2 + 8, 12).scale})`,
                    opacity: buildIn(beats.spark2 + 8, 12).opacity,
                  }}
                >
                  2
                </div>
                
                <div style={{ position: 'relative' }}>
                  <div style={writeOnReveal(beats.spark2 + 12, 20, 'left')}>
                    <span
                      style={{
                        fontFamily: THEME.fonts.marker.handwritten,
                        fontSize: 26,
                        color: colors.ink,
                        lineHeight: 1.4,
                      }}
                    >
                      {texts.spark2 || 'memories consolidate'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Spark 3 */}
          {frame >= beats.spark3 && (
            <div
              style={{
                opacity: buildIn(beats.spark3, 20).opacity,
                transform: `translateY(${(1 - buildIn(beats.spark3, 20).scale) * 30}px)`,
              }}
            >
              <div
                style={{
                  padding: 20,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderLeft: `5px solid ${colors.accent}`,
                  borderRadius: 6,
                  boxShadow: depthShadow,
                  minHeight: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#fff',
                    transform: `scale(${buildIn(beats.spark3 + 8, 12).scale})`,
                    opacity: buildIn(beats.spark3 + 8, 12).opacity,
                  }}
                >
                  3
                </div>
                
                <div style={{ position: 'relative' }}>
                  <div style={writeOnReveal(beats.spark3 + 12, 20, 'left')}>
                    <span
                      style={{
                        fontFamily: THEME.fonts.marker.handwritten,
                        fontSize: 26,
                        color: colors.ink,
                        lineHeight: 1.4,
                      }}
                    >
                      {texts.spark3 || 'neurons rewire'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connecting lines - guide attention from center to sparks */}
        {frame >= beats.spark1 + 30 && (
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
            viewBox="0 0 1920 1080"
          >
            {/* Line to spark 1 */}
            <path
              d="M 960 480 Q 800 600, 300 800"
              fill="none"
              stroke={colors.accent}
              strokeWidth="3"
              strokeDasharray="800"
              strokeDashoffset={interpolate(
                frame,
                [beats.spark1 + 30, beats.spark1 + 55],
                [800, 0],
                { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
              )}
              opacity="0.3"
            />
            
            {/* Line to spark 2 */}
            {frame >= beats.spark2 + 30 && (
              <path
                d="M 960 480 L 960 800"
                fill="none"
                stroke={colors.accent}
                strokeWidth="3"
                strokeDasharray="320"
                strokeDashoffset={interpolate(
                  frame,
                  [beats.spark2 + 30, beats.spark2 + 50],
                  [320, 0],
                  { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
                )}
                opacity="0.3"
              />
            )}
            
            {/* Line to spark 3 */}
            {frame >= beats.spark3 + 30 && (
              <path
                d="M 960 480 Q 1120 600, 1620 800"
                fill="none"
                stroke={colors.accent}
                strokeWidth="3"
                strokeDasharray="800"
                strokeDashoffset={interpolate(
                  frame,
                  [beats.spark3 + 30, beats.spark3 + 55],
                  [800, 0],
                  { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
                )}
                opacity="0.3"
              />
            )}
          </svg>
        )}

        {/* PAUSE 2 - Pulse on sparks */}
        {frame >= beats.pause2 && frame < beats.challenge && (
          <div
            style={{
              position: 'absolute',
              bottom: 180,
              left: 80,
              right: 80,
              transform: `scale(${getPulse(beats.pause2, 40)})`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* CHALLENGE - Top overlay, no overlap with question */}
        {frame >= beats.challenge && (
          <div
            style={{
              position: 'absolute',
              top: 280,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '80%',
              zIndex: 10,
            }}
          >
            <div
              style={{
                opacity: buildIn(beats.challenge, 25).opacity,
                transform: `scale(${buildIn(beats.challenge, 25).scale}) rotate(-0.5deg)`,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  padding: '28px 50px',
                  backgroundColor: colors.accent,
                  borderRadius: 10,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                }}
              >
                {/* Sketch bracket builds on */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{
                    position: 'absolute',
                    inset: -6,
                    pointerEvents: 'none',
                  }}
                >
                  <rect
                    x="3"
                    y="3"
                    width="94"
                    height="94"
                    fill="none"
                    stroke={colors.ink}
                    strokeWidth="2"
                    strokeDasharray="376"
                    strokeDashoffset={interpolate(
                      frame,
                      [beats.challenge + 12, beats.challenge + 37],
                      [376, 0],
                      { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
                    )}
                    opacity="0.15"
                  />
                </svg>

                <div style={writeOnReveal(beats.challenge + 8, 28, 'center')}>
                  <span
                    style={{
                      fontFamily: THEME.fonts.marker.secondary,
                      fontSize: 48,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.3,
                      textAlign: 'center',
                      display: 'block',
                    }}
                  >
                    {texts.challenge || "Sleep isn't rest. It's renovation."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Soft settle fade */}
        {frame >= beats.settle && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: colors.bg,
              opacity: interpolate(
                frame,
                [beats.settle, beats.settle + 40],
                [0, 0.25],
                { extrapolateRight: 'clamp' }
              ),
              pointerEvents: 'none',
            }}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { HookTemplate };
export const HOOK_DURATION = 14 * 30; // 14 seconds
export const HOOK_EXIT_TRANSITION = 15;
