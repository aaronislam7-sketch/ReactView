import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';

/**
 * HOOK TEMPLATE - Cinematic Write-On Flow
 * 
 * Design Principles:
 * - Write-on mechanics for all reveals (pen logic)
 * - Beat-based timing (1.2s intervals)
 * - Visual anchors (icons/sketches) for every concept
 * - Micro-camera motion (subtle zoom and parallax)
 * - 3-4 word text chunks, never paragraphs
 * - Breathing whitespace - negative space is depth
 * - Asymmetric layouts - directed, not templated
 * 
 * Mantra: "If it could exist as a static slide, it's not a Knode scene"
 */

const HookTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Extract scene data
  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.primary,
    accent: THEME.colors.markers.red,
    ink: THEME.colors.text.primary,
  };

  const texts = scene.fill?.texts || {};

  // BEAT GRID: 1.2s intervals (36 frames at 30fps)
  const BEAT = 36;
  const beats = {
    prelude: 0,           // Micro motion / canvas prep
    question1: BEAT * 1,  // First phrase of question
    question2: BEAT * 2,  // Second phrase
    visual1: BEAT * 3,    // Central visual anchor
    spark1: BEAT * 4,     // First curiosity spark
    spark2: BEAT * 5.2,   // Second spark
    spark3: BEAT * 6.4,   // Third spark
    pause: BEAT * 7.6,    // Breathing pause
    challenge: BEAT * 8.2, // Final provocation
    settle: BEAT * 9.5,   // Soft settle before exit
  };

  // Micro-camera motion: 1.02-1.05x zoom + drift
  const cameraZoom = interpolate(
    frame,
    [0, beats.visual1, beats.challenge, beats.settle + 20],
    [1.0, 1.03, 1.05, 1.02],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const cameraDriftX = Math.sin(frame * 0.008) * 3;
  const cameraDriftY = Math.cos(frame * 0.006) * 2;

  // Pen tip position for write-on (follows animation)
  const getPenPosition = (startFrame, duration = 20) => {
    if (frame < startFrame || frame > startFrame + duration) return null;
    const progress = (frame - startFrame) / duration;
    return progress;
  };

  // Write-on reveal with pen logic
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
      opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
      clipPath: clips[direction] || clips.left,
    };
  };

  // Fade-through with slight scale
  const fadeThrough = (startFrame, duration = 15) => {
    if (frame < startFrame) return { opacity: 0, transform: 'scale(0.95)' };
    if (frame >= startFrame + duration) return { opacity: 1, transform: 'scale(1)' };

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.back(1.3)), extrapolateRight: 'clamp' }
    );

    return {
      opacity: progress,
      transform: `scale(${0.95 + progress * 0.05})`,
    };
  };

  // Draw line SVG animation
  const drawLine = (startFrame, duration = 25) => {
    if (frame < startFrame) return { strokeDashoffset: 1 };
    if (frame >= startFrame + duration) return { strokeDashoffset: 0 };

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [1, 0],
      { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
    );

    return { strokeDashoffset: progress };
  };

  // Soft shadow for depth
  const depthShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Camera container with micro-motion */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom}) translate(${cameraDriftX}px, ${cameraDriftY}px)`,
        }}
      >
        {/* 8px grid snap container */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(24, 1fr)',
            gridTemplateRows: 'repeat(14, 1fr)',
            gap: 8,
            padding: 80,
          }}
        >
          {/* BEAT 1 & 2: Question (split into chunks) */}
          <div
            style={{
              gridColumn: '3 / 23',
              gridRow: '3 / 5',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignItems: 'flex-start', // Asymmetric: left-aligned
            }}
          >
            {/* First phrase - write-on */}
            {frame >= beats.question1 && (
              <div
                style={{
                  ...writeOnReveal(beats.question1, 20, 'left'),
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontFamily: THEME.fonts.marker.secondary,
                    fontSize: 56,
                    fontWeight: 700,
                    color: colors.accent,
                    lineHeight: 1.2,
                    textShadow: depthShadow,
                  }}
                >
                  {texts.questionPart1 || 'What if your brain'}
                </span>
                {/* Pen tip following write-on */}
                {getPenPosition(beats.question1, 20) !== null && (
                  <div
                    style={{
                      position: 'absolute',
                      right: -8,
                      top: '50%',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: colors.accent,
                      transform: 'translateY(-50%)',
                      opacity: 0.8,
                    }}
                  />
                )}
              </div>
            )}

            {/* Second phrase - write-on with delay */}
            {frame >= beats.question2 && (
              <div
                style={{
                  ...writeOnReveal(beats.question2, 20, 'left'),
                  position: 'relative',
                  paddingLeft: 40, // Slight indent for hierarchy
                }}
              >
                <span
                  style={{
                    fontFamily: THEME.fonts.marker.secondary,
                    fontSize: 56,
                    fontWeight: 700,
                    color: colors.accent,
                    lineHeight: 1.2,
                    textShadow: depthShadow,
                  }}
                >
                  {texts.questionPart2 || 'could change itself?'}
                </span>
                {getPenPosition(beats.question2, 20) !== null && (
                  <div
                    style={{
                      position: 'absolute',
                      right: -8,
                      top: '50%',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: colors.accent,
                      opacity: 0.8,
                    }}
                  />
                )}
              </div>
            )}

            {/* Underline - draws on after question */}
            {frame >= beats.question2 + 15 && (
              <svg
                width="500"
                height="6"
                viewBox="0 0 500 6"
                style={{
                  marginTop: 8,
                  marginLeft: 40,
                }}
              >
                <line
                  x1="0"
                  y1="3"
                  x2="500"
                  y2="3"
                  stroke={colors.accent}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="1"
                  strokeDashoffset={drawLine(beats.question2 + 15, 25).strokeDashoffset}
                  style={{
                    vectorEffect: 'non-scaling-stroke',
                  }}
                />
              </svg>
            )}
          </div>

          {/* BEAT 3: Central visual anchor - icon with sketch effect */}
          {frame >= beats.visual1 && (
            <div
              style={{
                gridColumn: '11 / 15',
                gridRow: '6 / 9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...fadeThrough(beats.visual1, 18),
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 180,
                  height: 180,
                }}
              >
                {/* Hand-drawn circle background */}
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 180 180"
                  style={{
                    position: 'absolute',
                    inset: 0,
                  }}
                >
                  <circle
                    cx="90"
                    cy="90"
                    r="80"
                    fill="none"
                    stroke={colors.accent}
                    strokeWidth="4"
                    strokeDasharray="1"
                    strokeDashoffset={drawLine(beats.visual1 + 5, 30).strokeDashoffset}
                    opacity="0.3"
                  />
                </svg>

                {/* Icon/Emoji */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 96,
                    ...fadeThrough(beats.visual1 + 10, 12),
                  }}
                >
                  {texts.icon || '🧠'}
                </div>
              </div>
            </div>
          )}

          {/* BEAT 4, 5, 6: Three curiosity sparks - staggered, asymmetric */}
          {/* Spark 1 - Left side */}
          {frame >= beats.spark1 && (
            <div
              style={{
                gridColumn: '2 / 9',
                gridRow: '10 / 12',
                ...fadeThrough(beats.spark1, 15),
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  padding: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderLeft: `4px solid ${colors.accent}`,
                  borderRadius: 4,
                  boxShadow: depthShadow,
                }}
              >
                {/* Icon anchor */}
                <div
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    backgroundColor: colors.accent,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  1
                </div>
                {/* Text chunk - write-on */}
                <div
                  style={{
                    ...writeOnReveal(beats.spark1 + 8, 18, 'left'),
                  }}
                >
                  <span
                    style={{
                      fontFamily: THEME.fonts.marker.handwritten,
                      fontSize: 28,
                      color: colors.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    {texts.spark1 || '86 billion neurons'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Spark 2 - Right side (asymmetry) */}
          {frame >= beats.spark2 && (
            <div
              style={{
                gridColumn: '16 / 23',
                gridRow: '10 / 12',
                ...fadeThrough(beats.spark2, 15),
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  padding: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderLeft: `4px solid ${colors.accent}`,
                  borderRadius: 4,
                  boxShadow: depthShadow,
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    backgroundColor: colors.accent,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  2
                </div>
                <div
                  style={{
                    ...writeOnReveal(beats.spark2 + 8, 18, 'left'),
                  }}
                >
                  <span
                    style={{
                      fontFamily: THEME.fonts.marker.handwritten,
                      fontSize: 28,
                      color: colors.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    {texts.spark2 || 'rewire every day'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Spark 3 - Bottom center */}
          {frame >= beats.spark3 && (
            <div
              style={{
                gridColumn: '8 / 17',
                gridRow: '12 / 14',
                ...fadeThrough(beats.spark3, 15),
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  padding: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderLeft: `4px solid ${colors.accent}`,
                  borderRadius: 4,
                  boxShadow: depthShadow,
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    backgroundColor: colors.accent,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  3
                </div>
                <div
                  style={{
                    ...writeOnReveal(beats.spark3 + 8, 18, 'left'),
                  }}
                >
                  <span
                    style={{
                      fontFamily: THEME.fonts.marker.handwritten,
                      fontSize: 28,
                      color: colors.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    {texts.spark3 || 'mistakes make you stronger'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* BEAT 8: Final challenge - center, after pause */}
          {frame >= beats.challenge && (
            <div
              style={{
                gridColumn: '5 / 21',
                gridRow: '4 / 6',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...fadeThrough(beats.challenge, 20),
                zIndex: 10,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  padding: '24px 40px',
                  backgroundColor: colors.accent,
                  borderRadius: 8,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  transform: `rotate(-1deg)`, // Slight asymmetry
                }}
              >
                {/* Sketch bracket */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{
                    position: 'absolute',
                    inset: -4,
                    pointerEvents: 'none',
                  }}
                >
                  <rect
                    x="2"
                    y="2"
                    width="96"
                    height="96"
                    fill="none"
                    stroke={colors.ink}
                    strokeWidth="2"
                    strokeDasharray="1"
                    strokeDashoffset={drawLine(beats.challenge + 10, 30).strokeDashoffset}
                    opacity="0.2"
                  />
                </svg>

                <div
                  style={{
                    ...writeOnReveal(beats.challenge + 5, 25, 'center'),
                  }}
                >
                  <span
                    style={{
                      fontFamily: THEME.fonts.marker.secondary,
                      fontSize: 42,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.3,
                      textAlign: 'center',
                      display: 'block',
                    }}
                  >
                    {texts.challenge || 'Your potential has no ceiling'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Connecting arrows/lines between sparks (pen logic) */}
          {frame >= beats.spark2 + 10 && (
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                opacity: 0.2,
              }}
              viewBox="0 0 1920 1080"
            >
              {/* Line from spark 1 to center */}
              <path
                d="M 400 800 Q 600 700, 960 600"
                fill="none"
                stroke={colors.accent}
                strokeWidth="2"
                strokeDasharray="5,5"
                strokeDashoffset={drawLine(beats.spark2 + 10, 25).strokeDashoffset}
              />
              {/* Line from spark 2 to center */}
              <path
                d="M 1520 800 Q 1320 700, 960 600"
                fill="none"
                stroke={colors.accent}
                strokeWidth="2"
                strokeDasharray="5,5"
                strokeDashoffset={drawLine(beats.spark3, 25).strokeDashoffset}
              />
            </svg>
          )}
        </div>

        {/* End frame drift - 3-5px camera drift + soft fade */}
        {frame >= beats.settle && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: colors.bg,
              opacity: interpolate(
                frame,
                [beats.settle, beats.settle + 30],
                [0, 0.3],
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
export const HOOK_DURATION = 12 * 30; // ~12 seconds for focused rhythm
export const HOOK_EXIT_TRANSITION = 15;
