import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { THEME } from '../utils/theme';
import {
  breathe,
  popIn,
  slideSettle,
  waveReveal,
  paperBackground,
  sketchBox,
} from '../utils/knodeAnimations';

/**
 * REFLECT Template - Knode Vision
 * 
 * Purpose: Recaps, reinforces, and challenges learners
 * Feel: Thoughtful and calm, with space for metacognition
 * Timing: 30-40 seconds
 * 
 * Beats:
 * 1. Title - what we're reflecting on
 * 2. Key insights - 2-3 main takeaways
 * 3. Reflection question - prompts deeper thinking
 * 4. Next steps - call to action or challenge
 */
export const ReflectTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Extract scene data with Knode defaults
  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.cream,
    accent: THEME.colors.markers.purple,
    support: THEME.colors.markers.blue,
    ink: THEME.colors.text.primary,
    highlight: THEME.colors.accents.lightPurple,
  };

  const fonts = scene.style_tokens?.fonts || {
    title: { family: THEME.fonts.marker.secondary, size: 64, weight: 700 },
    subtitle: { family: THEME.fonts.structure.primary, size: 30, weight: 600 },
    body: { family: THEME.fonts.marker.handwritten, size: 32, weight: 400 },
  };

  // Pedagogical timing - calm, thoughtful pace
  const timeline = {
    title: { start: 10, duration: 20 },
    insights: [
      { start: 45, duration: 15 },
      { start: 70, duration: 15 },
      { start: 95, duration: 15 },
    ],
    question: { start: 130, duration: 25 },
    nextSteps: { start: 170, duration: 25 },
  };

  // Gentle breathing - more meditative
  const canvasBreath = breathe(frame, 0, 0.006);

  return (
    <AbsoluteFill style={paperBackground(colors.bg)}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          padding: '70px 100px',
          ...canvasBreath,
        }}
      >
        {/* BEAT 1: TITLE - Reflection Header */}
        {frame >= timeline.title.start && (
          <div
            style={{
              textAlign: 'center',
              marginBottom: 50,
              ...popIn(frame, fps, timeline.title.start),
            }}
          >
            {/* Mirror/thought bubble icon */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: colors.highlight,
                  border: `5px solid ${colors.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 48,
                  boxShadow: '0 4px 16px rgba(142, 68, 173, 0.2)',
                  ...breathe(frame, 67, 0.02),
                }}
              >
                💭
              </div>
            </div>

            <h1
              style={{
                fontFamily: fonts.title.family,
                fontSize: fonts.title.size,
                fontWeight: fonts.title.weight,
                color: colors.accent,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {scene.fill?.texts?.title || '🤔 Time to Reflect'}
            </h1>
          </div>
        )}

        {/* BEAT 2: KEY INSIGHTS - Main Takeaways */}
        <div
          style={{
            marginBottom: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: 25,
            maxWidth: '900px',
            margin: '0 auto 50px',
          }}
        >
          {['insight1', 'insight2', 'insight3'].map((key, index) => {
            const insightText = scene.fill?.texts?.[key];
            if (!insightText) return null;

            const insightTimeline = timeline.insights[index];
            if (frame < insightTimeline.start) return null;

            return (
              <div
                key={key}
                style={{
                  ...waveReveal(frame, fps, index, insightTimeline.start, 0),
                  ...breathe(frame, index * 91, 0.01),
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 20,
                    alignItems: 'flex-start',
                    padding: '25px 35px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: `3px solid ${colors.support}`,
                    borderLeft: `10px solid ${colors.accent}`,
                    borderRadius: '10px',
                    boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
                  }}
                >
                  {/* Insight number badge */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 45,
                      height: 45,
                      borderRadius: '50%',
                      backgroundColor: colors.accent,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: fonts.title.family,
                      fontSize: 28,
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(142, 68, 173, 0.3)',
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Insight text */}
                  <p
                    style={{
                      fontFamily: fonts.body.family,
                      fontSize: fonts.body.size,
                      color: colors.ink,
                      margin: 0,
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {insightText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* BEAT 3: REFLECTION QUESTION - Deeper Thinking */}
        {frame >= timeline.question.start && scene.fill?.texts?.question && (
          <div
            style={{
              marginBottom: 40,
              ...slideSettle(frame, fps, timeline.question.start, 'up'),
            }}
          >
            <div
              style={{
                padding: '35px 50px',
                backgroundColor: colors.highlight,
                border: `4px dashed ${colors.accent}`,
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(142, 68, 173, 0.15)',
                position: 'relative',
                maxWidth: '850px',
                margin: '0 auto',
                ...breathe(frame, 234, 0.015),
              }}
            >
              {/* Question mark icon */}
              <div
                style={{
                  position: 'absolute',
                  top: -25,
                  left: 40,
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: colors.accent,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  fontWeight: 700,
                  border: `4px solid ${colors.bg}`,
                  boxShadow: '0 3px 12px rgba(0,0,0,0.2)',
                  ...breathe(frame, 345, 0.025),
                }}
              >
                ?
              </div>

              <p
                style={{
                  fontFamily: fonts.subtitle.family,
                  fontSize: fonts.subtitle.size,
                  fontWeight: fonts.subtitle.weight,
                  color: colors.accent,
                  margin: 0,
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                  textAlign: 'center',
                }}
              >
                {scene.fill.texts.question}
              </p>
            </div>
          </div>
        )}

        {/* BEAT 4: NEXT STEPS - Call to Action */}
        {frame >= timeline.nextSteps.start && scene.fill?.texts?.nextSteps && (
          <div
            style={{
              position: 'absolute',
              bottom: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '80%',
              ...popIn(frame, fps, timeline.nextSteps.start),
            }}
          >
            <div
              style={{
                padding: '30px 60px',
                backgroundColor: colors.accent,
                borderRadius: '50px',
                boxShadow: '0 8px 24px rgba(142, 68, 173, 0.35)',
                border: `5px solid ${colors.bg}`,
                ...breathe(frame, 567, 0.018),
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
                  gap: 15,
                }}
              >
                <span style={{ fontSize: 42 }}>🚀</span>
                {scene.fill.texts.nextSteps}
              </p>
            </div>
          </div>
        )}

        {/* Decorative thoughtful elements */}
        {frame >= 20 && (
          <>
            <div
              style={{
                position: 'absolute',
                top: 60,
                right: 100,
                fontSize: 32,
                opacity: 0.3,
                ...breathe(frame, 678, 0.03),
              }}
            >
              ✨
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 55,
                left: 80,
                fontSize: 28,
                opacity: 0.3,
                ...breathe(frame, 789, 0.025),
              }}
            >
              ✨
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Knode standard: 30-40 second scenes
export const REFLECT_DURATION = 35 * 30; // 35 seconds at 30fps
export const REFLECT_EXIT_TRANSITION = 10;
