import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { THEME } from '../utils/theme';
import {
  breathe,
  popIn,
  sketchIn,
  waveReveal,
  staggerDelay,
  paperBackground,
  sketchBox,
  markerHighlight,
} from '../utils/knodeAnimations';

/**
 * HOOK Template - Knode Vision
 * 
 * Purpose: Grabs attention, poses a question, sets up curiosity
 * Feel: Like a teacher quickly sketching an intriguing question on a whiteboard
 * Timing: 30-40 seconds
 * 
 * Beats:
 * 1. Strong opening - question appears with confidence
 * 2. Visual intrigue - icon/image pops in
 * 3. 2-3 curiosity sparkers (facts, stats, provocations)
 * 4. Challenge/cliffhanger - "what if..." moment
 */
export const HookTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Extract scene data with Knode defaults
  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.primary,
    accent: THEME.colors.markers.red,
    support: THEME.colors.markers.orange,
    ink: THEME.colors.text.primary,
    highlight: THEME.colors.markers.yellow,
  };

  const fonts = scene.style_tokens?.fonts || {
    title: { family: THEME.fonts.marker.secondary, size: 72, weight: 700 },
    body: { family: THEME.fonts.marker.handwritten, size: 38, weight: 400 },
    question: { family: THEME.fonts.marker.secondary, size: 64, weight: 700 },
  };

  // Pedagogical timing - clear beats
  const timeline = {
    question: { start: 10, duration: 20 },
    icon: { start: 40, duration: 15 },
    sparkers: [
      { start: 70, duration: 15 },
      { start: 95, duration: 15 },
      { start: 120, duration: 15 },
    ],
    challenge: { start: 160, duration: 20 },
  };

  // Breathing life into the canvas
  const canvasBreath = breathe(frame, 0, 0.005);

  return (
    <AbsoluteFill style={paperBackground(colors.bg)}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          padding: '80px 100px',
          ...canvasBreath,
        }}
      >
        {/* BEAT 1: QUESTION - Strong Opening */}
        {frame >= timeline.question.start && (
          <div
            style={{
              textAlign: 'center',
              marginBottom: 60,
              ...popIn(frame, fps, timeline.question.start),
            }}
          >
            <h1
              style={{
                fontFamily: fonts.question.family,
                fontSize: fonts.question.size,
                fontWeight: fonts.question.weight,
                color: colors.accent,
                margin: 0,
                lineHeight: 1.2,
                textShadow: '2px 2px 0px rgba(0,0,0,0.05)',
                ...breathe(frame, 42, 0.015),
              }}
            >
              {scene.fill?.texts?.question || '❓ What if...?'}
            </h1>
          </div>
        )}

        {/* BEAT 2: VISUAL INTRIGUE - Central Icon */}
        {frame >= timeline.icon.start && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 50,
              ...sketchIn(frame, fps, timeline.icon.start, 'center'),
            }}
          >
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                border: `5px solid ${colors.accent}`,
                backgroundColor: colors.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 72,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                ...breathe(frame, 73, 0.02),
              }}
            >
              {scene.fill?.texts?.emoji || '💡'}
            </div>
          </div>
        )}

        {/* BEAT 3: CURIOSITY SPARKERS - Facts/Provocations */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 30,
            marginBottom: 50,
            maxWidth: '1100px',
            margin: '0 auto 50px',
          }}
        >
          {['fact1', 'fact2', 'fact3'].map((key, index) => {
            const fact = scene.fill?.texts?.[key];
            if (!fact) return null;

            const sparkerTimeline = timeline.sparkers[index];
            if (frame < sparkerTimeline.start) return null;

            return (
              <div
                key={key}
                style={{
                  ...waveReveal(frame, fps, index, sparkerTimeline.start, 0),
                  ...breathe(frame, index * 37, 0.01),
                }}
              >
                <div
                  style={{
                    ...sketchBox(colors.support, frame + index * 100),
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 15,
                  }}
                >
                  {/* Marker number badge */}
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: colors.support,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: fonts.title.family,
                      fontSize: 28,
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Fact text */}
                  <p
                    style={{
                      fontFamily: fonts.body.family,
                      fontSize: fonts.body.size,
                      color: colors.ink,
                      margin: 0,
                      textAlign: 'center',
                      lineHeight: 1.4,
                    }}
                  >
                    {fact}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* BEAT 4: CHALLENGE - The "What if" Moment */}
        {frame >= timeline.challenge.start && scene.fill?.texts?.challenge && (
          <div
            style={{
              position: 'absolute',
              bottom: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '85%',
              ...popIn(frame, fps, timeline.challenge.start),
            }}
          >
            <div
              style={{
                position: 'relative',
                padding: '30px 50px',
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: `4px solid ${colors.highlight}`,
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                ...breathe(frame, 199, 0.018),
              }}
            >
              {/* Marker highlight behind text */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '95%',
                  height: '70%',
                  ...markerHighlight(colors.highlight, 0.25),
                  zIndex: 0,
                }}
              />

              <p
                style={{
                  position: 'relative',
                  fontFamily: fonts.question.family,
                  fontSize: fonts.question.size * 0.7,
                  fontWeight: 600,
                  color: colors.accent,
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.3,
                  zIndex: 1,
                }}
              >
                {scene.fill.texts.challenge}
              </p>
            </div>
          </div>
        )}

        {/* Decorative marker dots - adds personality */}
        {frame >= 20 && (
          <>
            <div
              style={{
                position: 'absolute',
                top: 40,
                right: 80,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: colors.support,
                opacity: 0.6,
                ...breathe(frame, 234, 0.025),
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 50,
                left: 90,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: colors.accent,
                opacity: 0.5,
                ...breathe(frame, 345, 0.02),
              }}
            />
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Knode standard: 30-40 second scenes
export const HOOK_DURATION = 35 * 30; // 35 seconds at 30fps
export const HOOK_EXIT_TRANSITION = 10;
