import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { THEME } from '../utils/theme';
import {
  breathe,
  popIn,
  slideSettle,
  drawOn,
  staggerDelay,
  paperBackground,
  sketchBox,
  markerStroke,
} from '../utils/knodeAnimations';

/**
 * EXPLAIN Template - Knode Vision
 * 
 * Purpose: Builds understanding step by step
 * Feel: Like a teacher sketching out a concept progressively
 * Timing: 30-40 seconds
 * 
 * Beats:
 * 1. Title - what we're explaining
 * 2. Core concept - the main idea in one line
 * 3. Visual build - 3-4 steps appear progressively
 * 4. Insight/summary - the "aha" recap
 */
export const ExplainTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Extract scene data with Knode defaults
  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.primary,
    accent: THEME.colors.markers.blue,
    support: THEME.colors.markers.green,
    ink: THEME.colors.text.primary,
    highlight: THEME.colors.accents.lightBlue,
  };

  const fonts = scene.style_tokens?.fonts || {
    title: { family: THEME.fonts.marker.secondary, size: 64, weight: 700 },
    subtitle: { family: THEME.fonts.structure.primary, size: 32, weight: 500 },
    body: { family: THEME.fonts.marker.handwritten, size: 32, weight: 400 },
  };

  // Pedagogical timing - clear progressive reveal
  const timeline = {
    title: { start: 5, duration: 18 },
    concept: { start: 30, duration: 18 },
    steps: [
      { start: 60, duration: 15 },
      { start: 85, duration: 15 },
      { start: 110, duration: 15 },
      { start: 135, duration: 15 },
    ],
    summary: { start: 170, duration: 20 },
  };

  // Canvas breathing
  const canvasBreath = breathe(frame, 0, 0.005);

  return (
    <AbsoluteFill style={paperBackground(colors.bg)}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          padding: '70px 90px',
          ...canvasBreath,
        }}
      >
        {/* BEAT 1: TITLE */}
        {frame >= timeline.title.start && (
          <div
            style={{
              textAlign: 'center',
              marginBottom: 40,
              ...popIn(frame, fps, timeline.title.start),
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '15px 40px',
                borderBottom: `5px solid ${colors.accent}`,
                ...breathe(frame, 15, 0.012),
              }}
            >
              <h1
                style={{
                  fontFamily: fonts.title.family,
                  fontSize: fonts.title.size,
                  fontWeight: fonts.title.weight,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {scene.fill?.texts?.title || '📚 Understanding the Concept'}
              </h1>
            </div>
          </div>
        )}

        {/* BEAT 2: CORE CONCEPT */}
        {frame >= timeline.concept.start && scene.fill?.texts?.concept && (
          <div
            style={{
              textAlign: 'center',
              marginBottom: 50,
              padding: '0 120px',
              ...slideSettle(frame, fps, timeline.concept.start, 'down'),
            }}
          >
            <p
              style={{
                fontFamily: fonts.subtitle.family,
                fontSize: fonts.subtitle.size,
                fontWeight: fonts.subtitle.weight,
                color: colors.accent,
                margin: 0,
                lineHeight: 1.5,
                padding: '20px 30px',
                backgroundColor: colors.highlight,
                borderRadius: '8px',
                border: `2px solid ${colors.accent}`,
              }}
            >
              {scene.fill.texts.concept}
            </p>
          </div>
        )}

        {/* BEAT 3: VISUAL BUILD - Progressive Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 35,
            marginBottom: 40,
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {['step1', 'step2', 'step3', 'step4'].map((key, index) => {
            const stepText = scene.fill?.texts?.[key];
            if (!stepText) return null;

            const stepTimeline = timeline.steps[index];
            if (frame < stepTimeline.start) return null;

            return (
              <div
                key={key}
                style={{
                  ...slideSettle(
                    frame,
                    fps,
                    stepTimeline.start,
                    index % 2 === 0 ? 'left' : 'right'
                  ),
                  ...breathe(frame, index * 50, 0.01),
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    ...sketchBox(colors.accent, frame + index * 100),
                    minHeight: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 15,
                  }}
                >
                  {/* Step number circle */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      width: 55,
                      height: 55,
                      borderRadius: '50%',
                      backgroundColor: colors.accent,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: fonts.title.family,
                      fontSize: 32,
                      fontWeight: 700,
                      border: `4px solid ${colors.bg}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      ...breathe(frame, index * 73, 0.02),
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Step content */}
                  <div style={{ paddingTop: 20 }}>
                    <p
                      style={{
                        fontFamily: fonts.body.family,
                        fontSize: fonts.body.size,
                        color: colors.ink,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {stepText}
                    </p>
                  </div>

                  {/* Visual connector arrow for progression */}
                  {index < 3 && (
                    <svg
                      style={{
                        position: 'absolute',
                        [index % 2 === 0 ? 'right' : 'left']: -25,
                        bottom: '50%',
                        width: 30,
                        height: 30,
                        opacity: 0.4,
                        transform: index % 2 === 0 ? 'rotate(-90deg)' : 'rotate(90deg)',
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 12h14m-7-7l7 7-7 7"
                        {...markerStroke(colors.accent, 2)}
                      />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* BEAT 4: SUMMARY - The "Aha" Moment */}
        {frame >= timeline.summary.start && scene.fill?.texts?.summary && (
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '80%',
              ...popIn(frame, fps, timeline.summary.start),
            }}
          >
            <div
              style={{
                position: 'relative',
                padding: '25px 50px',
                backgroundColor: colors.support,
                borderRadius: '50px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                border: `4px solid ${colors.bg}`,
                ...breathe(frame, 283, 0.018),
              }}
            >
              <p
                style={{
                  fontFamily: fonts.subtitle.family,
                  fontSize: fonts.subtitle.size * 1.15,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 40 }}>💡</span>
                {scene.fill.texts.summary}
              </p>
            </div>
          </div>
        )}

        {/* Central flow arrow - subtle visual guide */}
        {frame >= timeline.steps[1]?.start && (
          <svg
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 60,
              height: 60,
              opacity: 0.15,
              pointerEvents: 'none',
              ...breathe(frame, 456, 0.03),
            }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              {...markerStroke(colors.accent, 3)}
            />
            <path
              d="M12 8v8m-4-4l4 4 4-4"
              {...markerStroke(colors.accent, 2)}
            />
          </svg>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Knode standard: 30-40 second scenes
export const EXPLAIN_DURATION = 35 * 30; // 35 seconds at 30fps
export const EXPLAIN_EXIT_TRANSITION = 10;
