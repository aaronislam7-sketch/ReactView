import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import {
  GlassmorphicPane,
  NoiseTexture,
  SpotlightEffect,
  TEDCard,
  GradientBackground,
  FloatingParticles,
} from '../sdk/broadcastEffects';
import {
  fadeInScale,
  slideInWithOvershoot,
  staggeredEntrance,
  sceneExitProgress,
} from '../sdk/broadcastAnimations';
import { AnimatedLottie } from '../sdk/lottieIntegration';

/**
 * APPLY Template - Broadcast Grade
 * Purpose: Demonstrate practical application with scenario and actions
 * Style: Action-oriented, clear steps, tangible outcomes
 * Pedagogy: Transfer knowledge to practice, show real-world use
 * 
 * Features:
 * - Scenario-based learning cards
 * - Progressive action reveals
 * - Result-oriented finale
 * - Modular and cohesive with all templates
 */
export const ApplyTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const defaultColors = {
    bg: '#1a1a2e',
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

  // Animation timing
  const scenarioStart = 15;
  const actionsStart = 90;
  const resultStart = 650;
  const exitStart = durationInFrames - 30;

  const exitProgress = sceneExitProgress(frame, fps, durationInFrames, 30);

  // Scenario entrance
  const scenarioStyle = fadeInScale(frame, fps, scenarioStart);

  // Actions stagger
  const actionStyles = [0, 1, 2].map((i) =>
    staggeredEntrance(frame, fps, i, 15, actionsStart)
  );

  // Result finale
  const resultStyle = slideInWithOvershoot(frame, fps, 'bottom', resultStart, 50);

  const getGradientType = (accent) => {
    if (accent.includes('27') || accent.includes('2E')) return 'emerald-forest';
    if (accent.includes('E6')) return 'ted-red';
    if (accent.includes('4A')) return 'cool-ocean';
    return 'warm-sunset';
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        transform: `scale(${1 + exitProgress * 3})`,
        opacity: 1 - exitProgress,
      }}
    >
      {/* Background */}
      <GradientBackground
        gradient={getGradientType(colors.accent)}
        opacity={0.15}
        rotate={180}
      />
      <NoiseTexture opacity={0.04} scale={1.3} />
      <SpotlightEffect x={50} y={50} size={1000} color={colors.support} opacity={0.12} />
      <FloatingParticles count={12} color={colors.accent} size={5} speed={0.4} frame={frame} />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          padding: '70px 110px',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
        }}
      >
        {/* Scenario - The situation */}
        {frame >= scenarioStart && scene.fill?.texts?.scenario && (
          <div style={scenarioStyle}>
            <TEDCard accentColor={colors.accent} scale={1}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                {/* Lottie icon */}
                <div style={{ flexShrink: 0 }}>
                  <AnimatedLottie
                    animation="thinking"
                    style={{ width: 100, height: 100 }}
                    entranceDelay={scenarioStart}
                    entranceDuration={20}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: fonts.subtitle.family,
                      fontSize: fonts.subtitle.size,
                      fontWeight: 700,
                      color: colors.accent,
                      marginBottom: 15,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    📋 Scenario
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.body.family,
                      fontSize: fonts.body.size,
                      fontWeight: fonts.body.weight,
                      color: colors.ink,
                      lineHeight: 1.5,
                    }}
                  >
                    {scene.fill.texts.scenario}
                  </div>
                </div>
              </div>
            </TEDCard>
          </div>
        )}

        {/* Actions - Steps to take */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 25 }}>
          {[1, 2, 3].map((num, index) => {
            const actionKey = `action${num}`;
            const actionText = scene.fill?.texts?.[actionKey];
            if (!actionText || frame < actionsStart + index * 15) return null;

            return (
              <div key={num} style={actionStyles[index]}>
                <GlassmorphicPane
                  padding={30}
                  borderOpacity={0.35}
                  glowOpacity={0.15}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
                    {/* Arrow indicator */}
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 12,
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.support})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 20px ${colors.accent}40`,
                      }}
                    >
                      <span style={{ fontSize: 36 }}>→</span>
                    </div>

                    {/* Icon if available */}
                    {images?.[`icon${num}`] && (
                      <img
                        src={images[`icon${num}`]}
                        alt={`Action ${num}`}
                        style={{
                          width: 50,
                          height: 50,
                          flexShrink: 0,
                        }}
                      />
                    )}

                    {/* Action text */}
                    <div
                      style={{
                        flex: 1,
                        fontFamily: fonts.body.family,
                        fontSize: fonts.body.size,
                        fontWeight: fonts.body.weight,
                        color: colors.ink,
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: colors.support, fontWeight: 700 }}>
                        Step {num}:{' '}
                      </span>
                      {actionText}
                    </div>
                  </div>
                </GlassmorphicPane>
              </div>
            );
          })}
        </div>

        {/* Result - The outcome */}
        {frame >= resultStart && scene.fill?.texts?.result && (
          <div style={resultStyle}>
            <GlassmorphicPane
              padding={40}
              borderOpacity={0.5}
              glowOpacity={0.3}
              backgroundColor="rgba(255, 255, 255, 0.15)"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                {/* Success Lottie */}
                <div style={{ flexShrink: 0 }}>
                  <AnimatedLottie
                    animation="checkmark"
                    style={{ width: 100, height: 100 }}
                    entranceDelay={resultStart}
                    entranceDuration={20}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: fonts.subtitle.family,
                      fontSize: fonts.subtitle.size,
                      fontWeight: 700,
                      color: colors.support,
                      marginBottom: 12,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    ✓ Result
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.body.family,
                      fontSize: fonts.body.size * 1.1,
                      fontWeight: 700,
                      color: colors.highlight,
                      lineHeight: 1.4,
                      textShadow: `0 2px 20px ${colors.highlight}50`,
                    }}
                  >
                    {scene.fill.texts.result}
                  </div>
                </div>
              </div>
            </GlassmorphicPane>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const APPLY_DURATION = 30 * 30;
export const APPLY_EXIT_TRANSITION = 10;
