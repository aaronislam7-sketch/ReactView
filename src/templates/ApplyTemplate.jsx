import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import {
  GlassmorphicPane,
  NoiseTexture,
  SpotlightEffect,
  GradientBackground,
} from '../sdk/broadcastEffects';
import { sceneExitProgress } from '../sdk/broadcastAnimations';

/**
 * APPLY Template - OPTIMIZED PROGRESSIVE
 * Smooth progression without browser crashes
 */
export const ApplyTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const defaultColors = {
    bg: '#0f0f1e',
    accent: '#27AE60',
    support: '#2ECC71',
    ink: '#ffffff',
    highlight: '#FFE66D',
  };

  const colors = scene.style_tokens?.colors || defaultColors;

  const defaultFonts = {
    title: { family: 'Cabin Sketch, cursive', size: 68, weight: 700 },
    subtitle: { family: 'Patrick Hand, cursive', size: 32, weight: 600 },
    body: { family: 'Patrick Hand, cursive', size: 30, weight: 400 },
  };

  const fonts = {
    title: scene.style_tokens?.fonts?.title || defaultFonts.title,
    subtitle: scene.style_tokens?.fonts?.subtitle || defaultFonts.subtitle,
    body: scene.style_tokens?.fonts?.body || defaultFonts.body,
  };

  const images = resolveSceneImages(scene.fill?.images);

  // SIMPLIFIED TIMELINE
  const timeline = {
    scenario: { start: 15, end: 850 },
    actions: [
      { start: 120, complete: 400, end: 850 },
      { start: 240, complete: 520, end: 850 },
      { start: 360, complete: 640, end: 850 },
    ],
    result: { start: 680, end: 900 },
  };

  // Simple camera movement
  const cameraScale = interpolate(
    frame,
    [0, 60, durationInFrames - 60, durationInFrames],
    [1.15, 1, 1, 1.25],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const exitProgress = sceneExitProgress(frame, fps, durationInFrames, 30);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: colors.bg,
          transform: `scale(${1 + exitProgress * 2})`,
          opacity: 1 - exitProgress * 0.8,
        }}
      >
        {/* Background */}
        <GradientBackground gradient="emerald-forest" opacity={0.18} rotate={180} />
        <NoiseTexture opacity={0.06} scale={1.4} />
        <SpotlightEffect x={50} y={50} size={1200} color={colors.support} opacity={0.12} />

        {/* Content with simple zoom */}
        <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              padding: '60px 95px',
            }}
          >
            {/* Progress indicator */}
            <div
              style={{
                position: 'absolute',
                top: 30,
                right: 95,
                display: 'flex',
                gap: 12,
                opacity: frame >= timeline.scenario.start ? 1 : 0,
                transition: 'opacity 0.5s',
              }}
            >
              {[1, 2, 3].map((i) => {
                const actionTimeline = timeline.actions[i - 1];
                const isComplete = frame >= actionTimeline.complete;
                const isActive = frame >= actionTimeline.start && frame < actionTimeline.complete;
                
                return (
                  <div
                    key={i}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: '50%',
                      border: `3px solid ${isComplete ? colors.accent : colors.ink}30`,
                      backgroundColor: isComplete ? colors.accent : isActive ? `${colors.accent}30` : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isComplete ? `0 0 25px ${colors.accent}` : 'none',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isComplete && <span style={{ fontSize: 18 }}>✓</span>}
                  </div>
                );
              })}
            </div>

            {/* Scenario */}
            {frame >= timeline.scenario.start && scene.fill?.texts?.scenario && (
              <div
                style={{
                  marginTop: 20,
                  opacity: interpolate(
                    frame,
                    [timeline.scenario.start, timeline.scenario.start + 30],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  ),
                  transform: `
                    translateY(${interpolate(
                      frame,
                      [timeline.scenario.start, timeline.scenario.start + 35],
                      [-40, 0],
                      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                    )}px)
                    scale(${interpolate(
                      frame,
                      [timeline.scenario.start, timeline.scenario.start + 30],
                      [0.95, 1],
                      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                    )})
                  `,
                }}
              >
                <GlassmorphicPane padding={40} borderOpacity={0.5} glowOpacity={0.22}>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 18,
                      color: colors.support,
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginBottom: 15,
                    }}
                  >
                    📋 SITUATION
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.body.family,
                      fontSize: fonts.body.size,
                      fontWeight: fonts.body.weight,
                      color: colors.ink,
                      lineHeight: 1.6,
                    }}
                  >
                    {scene.fill.texts.scenario}
                  </div>
                </GlassmorphicPane>
              </div>
            )}

            {/* Actions - progressive reveal */}
            <div
              style={{
                marginTop: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
              }}
            >
              {[1, 2, 3].map((num, index) => {
                const actionKey = `action${num}`;
                const actionText = scene.fill?.texts?.[actionKey];
                const actionTimeline = timeline.actions[index];
                
                if (!actionText || frame < actionTimeline.start) return null;

                const isActive = frame >= actionTimeline.start && frame < actionTimeline.complete;
                const isComplete = frame >= actionTimeline.complete;

                const actionProgress = interpolate(
                  frame,
                  [actionTimeline.start, actionTimeline.start + 30],
                  [0, 1],
                  { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                );

                // Progress bar for active action
                const progress = isActive
                  ? interpolate(
                      frame,
                      [actionTimeline.start, actionTimeline.complete],
                      [0, 100],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    )
                  : isComplete
                  ? 100
                  : 0;

                return (
                  <div
                    key={num}
                    style={{
                      opacity: actionProgress,
                      transform: `
                        translateX(${(1 - actionProgress) * 60}px)
                        scale(${0.98 + actionProgress * 0.02})
                      `,
                    }}
                  >
                    <GlassmorphicPane
                      padding={32}
                      borderOpacity={isComplete ? 0.55 : 0.35}
                      glowOpacity={isActive ? 0.28 : 0.15}
                      backgroundColor={isComplete ? 'rgba(39, 174, 96, 0.12)' : 'rgba(255, 255, 255, 0.08)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
                        {/* Action indicator */}
                        <div
                          style={{
                            width: 65,
                            height: 65,
                            borderRadius: '50%',
                            background: isComplete
                              ? `linear-gradient(135deg, ${colors.accent}, ${colors.support})`
                              : `linear-gradient(135deg, ${colors.accent}60, ${colors.support}60)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: isComplete ? `0 0 35px ${colors.accent}` : isActive ? `0 0 25px ${colors.accent}50` : 'none',
                            transform: isActive ? 'scale(1.08)' : 'scale(1)',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <span style={{ fontSize: 30 }}>
                            {isComplete ? '✓' : '→'}
                          </span>
                        </div>

                        {/* Action content */}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontFamily: 'monospace',
                              fontSize: 16,
                              color: isComplete ? colors.accent : colors.support,
                              textTransform: 'uppercase',
                              letterSpacing: '2px',
                              marginBottom: 10,
                            }}
                          >
                            ACTION {num} {isComplete ? '- COMPLETE' : isActive ? '- IN PROGRESS' : ''}
                          </div>
                          <div
                            style={{
                              fontFamily: fonts.body.family,
                              fontSize: fonts.body.size * 0.95,
                              fontWeight: fonts.body.weight,
                              color: colors.ink,
                              lineHeight: 1.5,
                            }}
                          >
                            {actionText}
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {isActive && (
                        <div
                          style={{
                            marginTop: 18,
                            height: 6,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 3,
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${progress}%`,
                              background: `linear-gradient(90deg, ${colors.accent}, ${colors.support})`,
                              boxShadow: `0 0 15px ${colors.accent}`,
                              transition: 'width 0.1s linear',
                            }}
                          />
                        </div>
                      )}
                    </GlassmorphicPane>
                  </div>
                );
              })}
            </div>

            {/* Result */}
            {frame >= timeline.result.start && scene.fill?.texts?.result && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 55,
                  left: 95,
                  right: 95,
                  opacity: interpolate(
                    frame,
                    [timeline.result.start, timeline.result.start + 35],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  ),
                  transform: `scale(${interpolate(
                    frame,
                    [timeline.result.start, timeline.result.start + 35],
                    [0.9, 1],
                    { easing: Easing.elastic(1.2), extrapolateRight: 'clamp' }
                  )})`,
                }}
              >
                <GlassmorphicPane
                  padding={42}
                  borderOpacity={0.65}
                  glowOpacity={0.35}
                  backgroundColor="rgba(39, 174, 96, 0.18)"
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 24,
                        color: colors.accent,
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        marginBottom: 18,
                        textShadow: `0 0 25px ${colors.accent}`,
                      }}
                    >
                      ★ COMPLETE ★
                    </div>
                    <div
                      style={{
                        fontFamily: fonts.body.family,
                        fontSize: fonts.body.size * 1.1,
                        fontWeight: 700,
                        color: colors.highlight,
                        lineHeight: 1.4,
                        textShadow: `0 3px 35px ${colors.highlight}80`,
                      }}
                    >
                      {scene.fill.texts.result}
                    </div>
                  </div>
                </GlassmorphicPane>
              </div>
            )}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const APPLY_DURATION = 30 * 30;
export const APPLY_EXIT_TRANSITION = 10;
