import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { NumberBadge } from '../sdk/components.jsx';
import { resolveSceneImages } from '../utils/imageLibrary';
import {
  GlassmorphicPane,
  NoiseTexture,
  SpotlightEffect,
  FloatingParticles,
  GradientBackground,
} from '../sdk/broadcastEffects';
import {
  fadeInScale,
  slideInWithOvershoot,
  staggeredEntrance,
  gentlePulse,
  sceneExitProgress,
} from '../sdk/broadcastAnimations';

/**
 * HOOK Template - Broadcast Grade
 * Purpose: Grab attention, create curiosity, pose a compelling question
 * Style: Bold, dynamic, question-driven with cinematic impact
 * Pedagogy: Engage learners, activate prior knowledge, set context
 * 
 * Features:
 * - Glassmorphic cards with depth
 * - Spring-based animations for broadcast quality
 * - Modular design for seamless transitions
 * - TED talk aesthetic with modern polish
 */
export const HookTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Extract scene data with safe defaults
  const defaultColors = {
    bg: '#1a1a2e',
    accent: '#E62B1E',
    support: '#FF6B6B',
    ink: '#ffffff',
    highlight: '#FFE66D',
  };

  const colors = scene.style_tokens?.colors || defaultColors;

  const defaultFonts = {
    title: { family: 'Cabin Sketch, cursive', size: 80, weight: 700 },
    body: { family: 'Patrick Hand, cursive', size: 36, weight: 400 },
    question: { family: 'Cabin Sketch, cursive', size: 64, weight: 700 },
  };

  const fonts = {
    title: scene.style_tokens?.fonts?.title || defaultFonts.title,
    body: scene.style_tokens?.fonts?.body || defaultFonts.body,
    question: scene.style_tokens?.fonts?.question || defaultFonts.question,
  };

  // Resolve images from library
  const images = resolveSceneImages(scene.fill?.images);

  // Animation timing - choreographed for broadcast quality
  const questionStart = 15;
  const imageStart = 50;
  const factsStart = 100;
  const challengeStart = 680;
  const exitStart = durationInFrames - 30;

  // Scene exit progress for smooth transitions
  const exitProgress = sceneExitProgress(frame, fps, durationInFrames, 30);

  // Question entrance - hero moment
  const questionStyle = fadeInScale(frame, fps, questionStart, { damping: 12, stiffness: 100 });
  const questionPulse = gentlePulse(frame - questionStart, 0.02, 0.06);

  // Main image - zoom in with impact
  const imageStyle = slideInWithOvershoot(frame, fps, 'bottom', imageStart, 50);

  // Facts appear sequentially with stagger
  const factStyles = [0, 1, 2].map((i) =>
    staggeredEntrance(frame, fps, i, 10, factsStart)
  );

  // Challenge/Hook statement - final punch
  const challengeStyle = fadeInScale(frame, fps, challengeStart, { damping: 15, stiffness: 120 });

  // Determine gradient type based on accent color
  const getGradientType = (accentColor) => {
    if (accentColor.includes('E6') || accentColor.includes('e6')) return 'ted-red';
    if (accentColor.includes('67') || accentColor.includes('76')) return 'vibrant-purple';
    if (accentColor.includes('00')) return 'cool-ocean';
    if (accentColor.includes('27')) return 'emerald-forest';
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
      {/* Background gradient */}
      <GradientBackground
        gradient={getGradientType(colors.accent)}
        opacity={0.15}
        rotate={135}
      />

      {/* Noise texture for depth */}
      <NoiseTexture opacity={0.03} scale={1.2} />

      {/* Spotlight effect */}
      <SpotlightEffect x={50} y={30} size={1000} color={colors.accent} opacity={0.1} />

      {/* Floating particles for atmosphere */}
      <FloatingParticles count={15} color={colors.support} size={6} speed={0.3} frame={frame} />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          padding: '80px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: 50,
        }}
      >
        {/* Main Question - Hero moment */}
        {frame >= questionStart && (
          <div
            style={{
              ...questionStyle,
              ...questionPulse,
              textAlign: 'center',
              marginBottom: 30,
            }}
          >
            <GlassmorphicPane
              padding={40}
              borderOpacity={0.4}
              glowOpacity={0.2}
              style={{ display: 'inline-block' }}
            >
              <div
                style={{
                  fontFamily: fonts.question.family,
                  fontSize: fonts.question.size,
                  fontWeight: fonts.question.weight,
                  color: colors.ink,
                  lineHeight: 1.2,
                  textShadow: `0 2px 20px ${colors.accent}40`,
                }}
              >
                {scene.fill?.texts?.question || 'What if...?'}
              </div>
            </GlassmorphicPane>
          </div>
        )}

        {/* Content area - Image and Facts */}
        <div
          style={{
            display: 'flex',
            gap: 60,
            alignItems: 'center',
            flex: 1,
          }}
        >
          {/* Main Image - Left side */}
          {frame >= imageStart && images?.mainImage && (
            <div
              style={{
                ...imageStyle,
                flex: '0 0 400px',
              }}
            >
              <GlassmorphicPane padding={20} borderOpacity={0.3}>
                <img
                  src={images.mainImage}
                  alt="Main visual"
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: 12,
                  }}
                />
              </GlassmorphicPane>
            </div>
          )}

          {/* Facts - Right side */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 30,
            }}
          >
            {[1, 2, 3].map((num, index) => {
              const fact = scene.fill?.texts?.[`fact${num}`];
              if (!fact || frame < factsStart + index * 10) return null;

              return (
                <div key={num} style={factStyles[index]}>
                  <GlassmorphicPane
                    padding={30}
                    borderOpacity={0.3}
                    glowOpacity={0.15}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      {/* Number badge */}
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${colors.accent}, ${colors.support})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: `0 4px 20px ${colors.accent}40`,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: fonts.title.family,
                            fontSize: 32,
                            fontWeight: 700,
                            color: '#ffffff',
                          }}
                        >
                          {num}
                        </span>
                      </div>

                      {/* Fact text */}
                      <div
                        style={{
                          fontFamily: fonts.body.family,
                          fontSize: fonts.body.size,
                          fontWeight: fonts.body.weight,
                          color: colors.ink,
                          lineHeight: 1.4,
                        }}
                      >
                        {fact}
                      </div>
                    </div>
                  </GlassmorphicPane>
                </div>
              );
            })}
          </div>
        </div>

        {/* Challenge statement - Final hook */}
        {frame >= challengeStart && (
          <div
            style={{
              ...challengeStyle,
              textAlign: 'center',
            }}
          >
            <GlassmorphicPane
              padding={40}
              borderOpacity={0.4}
              glowOpacity={0.25}
              backgroundColor="rgba(255, 255, 255, 0.12)"
            >
              <div
                style={{
                  fontFamily: fonts.title.family,
                  fontSize: fonts.title.size * 0.7,
                  fontWeight: fonts.title.weight,
                  color: colors.highlight,
                  lineHeight: 1.3,
                  textShadow: `0 2px 30px ${colors.highlight}60`,
                }}
              >
                {scene.fill?.texts?.challenge || "Let's find out!"}
              </div>
            </GlassmorphicPane>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Export scene metadata for duration calculation
export const HOOK_DURATION = 30 * 30; // 30 seconds at 30fps
export const HOOK_EXIT_TRANSITION = 10;
