import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { THEME } from '../utils/theme';
import {
  breathe,
  popIn,
  slideSettle,
  staggerDelay,
  paperBackground,
  sketchBox,
  markerHighlight,
} from '../utils/knodeAnimations';

/**
 * APPLY Template - Knode Vision
 * 
 * Purpose: Shows how the idea works in context
 * Feel: Like demonstrating a real scenario step-by-step
 * Timing: 30-40 seconds
 * 
 * Beats:
 * 1. Scenario setup - here's the situation
 * 2. Actions - 3 progressive steps showing application
 * 3. Result/outcome - what happens when you apply it
 */
export const ApplyTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Extract scene data with Knode defaults
  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.cream,
    accent: THEME.colors.markers.green,
    support: THEME.colors.markers.blue,
    ink: THEME.colors.text.primary,
    highlight: THEME.colors.accents.lightGreen,
  };

  const fonts = scene.style_tokens?.fonts || {
    title: { family: THEME.fonts.marker.secondary, size: 58, weight: 700 },
    subtitle: { family: THEME.fonts.structure.primary, size: 28, weight: 600 },
    body: { family: THEME.fonts.marker.handwritten, size: 32, weight: 400 },
  };

  // Pedagogical timing - scenario then progressive application
  const timeline = {
    scenario: { start: 10, duration: 20 },
    actions: [
      { start: 50, complete: 85, duration: 15 },
      { start: 90, complete: 125, duration: 15 },
      { start: 130, complete: 165, duration: 15 },
    ],
    result: { start: 180, duration: 25 },
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
        {/* Progress dots indicator */}
        {frame >= timeline.scenario.start && (
          <div
            style={{
              position: 'absolute',
              top: 40,
              right: 90,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            {[0, 1, 2].map((i) => {
              const actionTimeline = timeline.actions[i];
              const isComplete = frame >= actionTimeline.complete;
              const isActive =
                frame >= actionTimeline.start &&
                frame < actionTimeline.complete;

              return (
                <div
                  key={i}
                  style={{
                    width: isActive ? 40 : 30,
                    height: isActive ? 40 : 30,
                    borderRadius: '50%',
                    backgroundColor: isComplete
                      ? colors.accent
                      : isActive
                      ? colors.support
                      : 'rgba(0,0,0,0.1)',
                    border: `3px solid ${
                      isComplete || isActive ? colors.bg : 'transparent'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: isComplete
                      ? '0 4px 12px rgba(39, 174, 96, 0.3)'
                      : 'none',
                    ...breathe(frame, i * 67, isActive ? 0.025 : 0.01),
                  }}
                >
                  {isComplete && (
                    <span style={{ fontSize: 20, color: '#FFFFFF' }}>✓</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* BEAT 1: SCENARIO SETUP */}
        {frame >= timeline.scenario.start && scene.fill?.texts?.scenario && (
          <div
            style={{
              marginBottom: 50,
              ...popIn(frame, fps, timeline.scenario.start),
            }}
          >
            <div
              style={{
                padding: '30px 40px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: `4px solid ${colors.support}`,
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                position: 'relative',
                ...breathe(frame, 45, 0.012),
              }}
            >
              {/* Label tag */}
              <div
                style={{
                  position: 'absolute',
                  top: -18,
                  left: 30,
                  padding: '6px 20px',
                  backgroundColor: colors.support,
                  color: '#FFFFFF',
                  fontFamily: THEME.fonts.structure.primary,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: '1px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                📋 Scenario
              </div>

              <p
                style={{
                  fontFamily: fonts.body.family,
                  fontSize: fonts.body.size,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.6,
                  paddingTop: 10,
                }}
              >
                {scene.fill.texts.scenario}
              </p>
            </div>
          </div>
        )}

        {/* BEAT 2: ACTIONS - Progressive Application */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 30,
            marginBottom: 50,
          }}
        >
          {['action1', 'action2', 'action3'].map((key, index) => {
            const actionText = scene.fill?.texts?.[key];
            if (!actionText) return null;

            const actionTimeline = timeline.actions[index];
            if (frame < actionTimeline.start) return null;

            const isActive =
              frame >= actionTimeline.start &&
              frame < actionTimeline.complete;
            const isComplete = frame >= actionTimeline.complete;

            return (
              <div
                key={key}
                style={{
                  ...slideSettle(
                    frame,
                    fps,
                    actionTimeline.start,
                    index % 2 === 0 ? 'left' : 'right'
                  ),
                  ...breathe(frame, index * 89, isActive ? 0.015 : 0.008),
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 25,
                    alignItems: 'center',
                    padding: '25px 35px',
                    backgroundColor: isComplete
                      ? colors.highlight
                      : 'rgba(255, 255, 255, 0.9)',
                    border: `3px solid ${
                      isComplete ? colors.accent : colors.support
                    }`,
                    borderRadius: '10px',
                    boxShadow: isActive
                      ? '0 6px 20px rgba(0,0,0,0.12)'
                      : '0 3px 12px rgba(0,0,0,0.08)',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Action indicator */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 70,
                      height: 70,
                      borderRadius: '50%',
                      backgroundColor: isComplete
                        ? colors.accent
                        : isActive
                        ? colors.support
                        : 'rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 36,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      border: '4px solid rgba(255, 255, 255, 0.5)',
                      boxShadow: isComplete
                        ? '0 4px 16px rgba(39, 174, 96, 0.4)'
                        : isActive
                        ? '0 4px 16px rgba(46, 127, 228, 0.3)'
                        : 'none',
                      fontFamily: fonts.title.family,
                      ...breathe(frame, index * 123, 0.02),
                    }}
                  >
                    {isComplete ? '✓' : index + 1}
                  </div>

                  {/* Action content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: THEME.fonts.structure.primary,
                        fontSize: 20,
                        fontWeight: 700,
                        color: isComplete ? colors.accent : colors.support,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: 8,
                      }}
                    >
                      Action {index + 1}
                      {isComplete && ' ✓ Complete'}
                      {isActive && ' → In Progress'}
                    </div>

                    <p
                      style={{
                        fontFamily: fonts.body.family,
                        fontSize: fonts.body.size * 0.95,
                        color: colors.ink,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {actionText}
                    </p>
                  </div>

                  {/* Connector arrow */}
                  {index < 2 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 85,
                        bottom: -25,
                        fontSize: 28,
                        color: colors.support,
                        opacity: 0.5,
                      }}
                    >
                      ↓
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* BEAT 3: RESULT - The Outcome */}
        {frame >= timeline.result.start && scene.fill?.texts?.result && (
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '85%',
              ...popIn(frame, fps, timeline.result.start),
            }}
          >
            <div
              style={{
                position: 'relative',
                padding: '35px 60px',
                backgroundColor: colors.accent,
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(39, 174, 96, 0.35)',
                border: `5px solid ${colors.bg}`,
                ...breathe(frame, 456, 0.02),
              }}
            >
              {/* Success badge */}
              <div
                style={{
                  position: 'absolute',
                  top: -25,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '8px 30px',
                  backgroundColor: colors.bg,
                  border: `4px solid ${colors.accent}`,
                  borderRadius: '30px',
                  fontFamily: THEME.fonts.structure.primary,
                  fontSize: 20,
                  fontWeight: 700,
                  color: colors.accent,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                ★ Result ★
              </div>

              <p
                style={{
                  fontFamily: fonts.subtitle.family,
                  fontSize: fonts.subtitle.size * 1.25,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.4,
                  paddingTop: 15,
                }}
              >
                {scene.fill.texts.result}
              </p>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Knode standard: 30-40 second scenes
export const APPLY_DURATION = 35 * 30; // 35 seconds at 30fps
export const APPLY_EXIT_TRANSITION = 10;
