import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import {
  GlassmorphicPane,
  NoiseTexture,
  SpotlightEffect,
  TEDCard,
  GradientBackground,
} from '../sdk/broadcastEffects';
import {
  fadeInScale,
  slideInWithOvershoot,
  staggeredEntrance,
  gentleFloat,
  sceneExitProgress,
} from '../sdk/broadcastAnimations';
import { LottieBackground } from '../sdk/lottieIntegration';

/**
 * EXPLAIN Template - Broadcast Grade
 * Purpose: Teach concepts clearly with 4-step breakdown
 * Style: Structured, systematic, visually clear
 * Pedagogy: Chunk information, scaffold learning, provide clear structure
 * 
 * Features:
 * - Step-by-step glassmorphic cards
 * - Floating animations for engagement
 * - Cohesive with any Hook or Apply template
 * - Professional broadcast transitions
 */
export const ExplainTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Safe defaults with TED aesthetic
  const defaultColors = {
    bg: '#0f0f23',
    accent: '#E62B1E',
    support: '#4A90E2',
    ink: '#ffffff',
    highlight: '#FFE66D',
  };

  const colors = scene.style_tokens?.colors || defaultColors;

  const defaultFonts = {
    title: { family: 'Cabin Sketch, cursive', size: 72, weight: 700 },
    subtitle: { family: 'Patrick Hand, cursive', size: 32, weight: 600 },
    body: { family: 'Patrick Hand, cursive', size: 28, weight: 400 },
  };

  const fonts = {
    title: scene.style_tokens?.fonts?.title || defaultFonts.title,
    subtitle: scene.style_tokens?.fonts?.subtitle || defaultFonts.subtitle,
    body: scene.style_tokens?.fonts?.body || defaultFonts.body,
  };

  const images = resolveSceneImages(scene.fill?.images);

  // Animation choreography
  const titleStart = 10;
  const conceptStart = 40;
  const stepsStart = 80;
  const summaryStart = 680;
  const exitStart = durationInFrames - 30;

  const exitProgress = sceneExitProgress(frame, fps, durationInFrames, 30);

  // Title animation
  const titleStyle = fadeInScale(frame, fps, titleStart);

  // Concept introduction
  const conceptStyle = slideInWithOvershoot(frame, fps, 'left', conceptStart, 80);

  // Steps stagger in
  const stepStyles = [0, 1, 2, 3].map((i) =>
    staggeredEntrance(frame, fps, i, 12, stepsStart)
  );

  // Floating effect for step cards
  const floatOffset = gentleFloat(frame, 8, 0.04);

  // Summary finale
  const summaryStyle = fadeInScale(frame, fps, summaryStart);

  // Determine gradient
  const getGradientType = (accent) => {
    if (accent.includes('E6')) return 'ted-red';
    if (accent.includes('4A')) return 'cool-ocean';
    return 'vibrant-purple';
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        transform: `scale(${1 + exitProgress * 3})`,
        opacity: 1 - exitProgress,
      }}
    >
      {/* Background elements */}
      <GradientBackground
        gradient={getGradientType(colors.accent)}
        opacity={0.12}
        rotate={225}
      />
      <NoiseTexture opacity={0.04} scale={1.5} />
      <SpotlightEffect x={80} y={20} size={1200} color={colors.accent} opacity={0.08} />
      
      {/* Subtle Lottie background */}
      <LottieBackground animation="dots" opacity={0.08} scale={2} position="bottom-right" />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          padding: '70px 100px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title */}
        {frame >= titleStart && (
          <div style={{...titleStyle, textAlign: 'center', marginBottom: 20}}>
            <TEDCard accentColor={colors.accent} scale={1}>
              <div
                style={{
                  fontFamily: fonts.title.family,
                  fontSize: fonts.title.size,
                  fontWeight: fonts.title.weight,
                  color: colors.ink,
                  textShadow: `0 2px 20px ${colors.accent}40`,
                  padding: '10px 0',
                }}
              >
                {scene.fill?.texts?.title || 'Understanding the Concept'}
              </div>
            </TEDCard>
          </div>
        )}

        {/* Concept introduction */}
        {frame >= conceptStart && scene.fill?.texts?.concept && (
          <div style={{...conceptStyle, marginBottom: 30, textAlign: 'center'}}>
            <div
              style={{
                fontFamily: fonts.subtitle.family,
                fontSize: fonts.subtitle.size,
                fontWeight: fonts.subtitle.weight,
                color: colors.highlight,
                lineHeight: 1.4,
                maxWidth: '80%',
                margin: '0 auto',
              }}
            >
              {scene.fill.texts.concept}
            </div>
          </div>
        )}

        {/* 4 Steps in 2x2 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 40,
            flex: 1,
          }}
        >
          {[1, 2, 3, 4].map((num, index) => {
            const stepKey = `step${num}`;
            const stepText = scene.fill?.texts?.[stepKey];
            if (!stepText || frame < stepsStart + index * 12) return null;

            return (
              <div key={num} style={{...stepStyles[index], ...floatOffset}}>
                <TEDCard accentColor={colors.accent}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                    {/* Step number circle */}
                    <div
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.support})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 20px ${colors.accent}50`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: fonts.title.family,
                          fontSize: 36,
                          fontWeight: 700,
                          color: '#ffffff',
                        }}
                      >
                        {num}
                      </span>
                    </div>

                    {/* Step content */}
                    <div style={{ flex: 1 }}>
                      {/* Icon if available */}
                      {images?.[`icon${num}`] && (
                        <img
                          src={images[`icon${num}`]}
                          alt={`Step ${num}`}
                          style={{
                            width: 50,
                            height: 50,
                            marginBottom: 15,
                            opacity: 0.9,
                          }}
                        />
                      )}

                      {/* Step text */}
                      <div
                        style={{
                          fontFamily: fonts.body.family,
                          fontSize: fonts.body.size,
                          fontWeight: fonts.body.weight,
                          color: colors.ink,
                          lineHeight: 1.5,
                        }}
                      >
                        {stepText}
                      </div>
                    </div>
                  </div>
                </TEDCard>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {frame >= summaryStart && scene.fill?.texts?.summary && (
          <div style={{...summaryStyle, marginTop: 30, textAlign: 'center'}}>
            <GlassmorphicPane
              padding={35}
              borderOpacity={0.5}
              glowOpacity={0.25}
              backgroundColor="rgba(255, 255, 255, 0.15)"
            >
              <div
                style={{
                  fontFamily: fonts.subtitle.family,
                  fontSize: fonts.subtitle.size * 1.1,
                  fontWeight: 700,
                  color: colors.highlight,
                  lineHeight: 1.4,
                  textShadow: `0 2px 25px ${colors.highlight}60`,
                }}
              >
                💡 {scene.fill.texts.summary}
              </div>
            </GlassmorphicPane>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const EXPLAIN_DURATION = 30 * 30;
export const EXPLAIN_EXIT_TRANSITION = 10;
