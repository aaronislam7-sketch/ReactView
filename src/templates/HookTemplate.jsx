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
 * HOOK Template - OPTIMIZED CINEMATIC
 * Broadcast quality without browser crashes
 */
export const HookTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const defaultColors = {
    bg: '#0a0a1e',
    accent: '#E62B1E',
    support: '#FF6B6B',
    ink: '#ffffff',
    highlight: '#FFE66D',
  };

  const colors = scene.style_tokens?.colors || defaultColors;

  const defaultFonts = {
    title: { family: 'Cabin Sketch, cursive', size: 80, weight: 700 },
    body: { family: 'Patrick Hand, cursive', size: 36, weight: 400 },
    question: { family: 'Cabin Sketch, cursive', size: 68, weight: 700 },
  };

  const fonts = {
    title: scene.style_tokens?.fonts?.title || defaultFonts.title,
    body: scene.style_tokens?.fonts?.body || defaultFonts.body,
    question: scene.style_tokens?.fonts?.question || defaultFonts.question,
  };

  const images = resolveSceneImages(scene.fill?.images);

  // SIMPLIFIED TIMELINE
  const timeline = {
    question: { start: 15, end: 850 },
    mainVisual: { start: 60, end: 850 },
    facts: [
      { start: 120, end: 850 },
      { start: 180, end: 850 },
      { start: 240, end: 850 },
    ],
    challenge: { start: 680, end: 870 },
  };

  // Simple camera zoom - no complex transforms
  const cameraScale = interpolate(
    frame,
    [0, 40, durationInFrames - 40, durationInFrames],
    [1.1, 1, 1, 1.3],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const exitProgress = sceneExitProgress(frame, fps, durationInFrames, 30);

  // Gentle pulse
  const pulse = 1 + Math.sin(frame * 0.05) * 0.02;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: colors.bg,
          transform: `scale(${1 + exitProgress * 2})`,
          opacity: 1 - exitProgress * 0.8,
        }}
      >
        {/* Background - simplified */}
        <GradientBackground gradient="ted-red" opacity={0.15} rotate={135} />
        <NoiseTexture opacity={0.04} scale={1.2} />
        <SpotlightEffect x={50} y={30} size={1200} color={colors.accent} opacity={0.12} />

        {/* Content container with simple zoom */}
        <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              padding: '70px 100px',
            }}
          >
            {/* Question */}
            {frame >= timeline.question.start && (
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: 40,
                  opacity: interpolate(
                    frame,
                    [timeline.question.start, timeline.question.start + 30],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  ),
                  transform: `
                    scale(${interpolate(
                      frame,
                      [timeline.question.start, timeline.question.start + 30],
                      [0.8, 1],
                      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                    ) * pulse})
                    translateY(${interpolate(
                      frame,
                      [timeline.question.start, timeline.question.start + 30],
                      [-30, 0],
                      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                    )}px)
                  `,
                }}
              >
                <GlassmorphicPane padding={45} borderOpacity={0.5} glowOpacity={0.25}>
                  <div
                    style={{
                      fontFamily: fonts.question.family,
                      fontSize: fonts.question.size,
                      fontWeight: fonts.question.weight,
                      color: colors.ink,
                      lineHeight: 1.3,
                      textShadow: `0 3px 20px ${colors.accent}60`,
                    }}
                  >
                    {scene.fill?.texts?.question || '❓ What if...?'}
                  </div>
                </GlassmorphicPane>
              </div>
            )}

            {/* Main visual */}
            {frame >= timeline.mainVisual.start && (
              <div
                style={{
                  position: 'absolute',
                  top: '28%',
                  left: '50%',
                  transform: `
                    translateX(-50%)
                    scale(${interpolate(
                      frame,
                      [timeline.mainVisual.start, timeline.mainVisual.start + 40],
                      [0.5, 1],
                      { easing: Easing.elastic(1.2), extrapolateRight: 'clamp' }
                    )})
                  `,
                  opacity: interpolate(
                    frame,
                    [timeline.mainVisual.start, timeline.mainVisual.start + 30],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  ),
                }}
              >
                {images?.mainImage ? (
                  <img
                    src={images.mainImage}
                    alt="Main visual"
                    style={{
                      width: 180,
                      height: 180,
                      borderRadius: '50%',
                      border: `6px solid ${colors.accent}`,
                      boxShadow: `0 0 50px ${colors.accent}70`,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 180,
                      height: 180,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colors.accent}, ${colors.support})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 80,
                      boxShadow: `0 0 50px ${colors.accent}70`,
                    }}
                  >
                    💡
                  </div>
                )}
              </div>
            )}

            {/* Facts */}
            <div
              style={{
                position: 'absolute',
                top: '52%',
                left: 100,
                right: 100,
                display: 'flex',
                gap: 30,
              }}
            >
              {[1, 2, 3].map((num, index) => {
                const fact = scene.fill?.texts?.[`fact${num}`];
                const factTimeline = timeline.facts[index];
                
                if (!fact || frame < factTimeline.start) return null;

                const factProgress = interpolate(
                  frame,
                  [factTimeline.start, factTimeline.start + 30],
                  [0, 1],
                  { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                );

                return (
                  <div
                    key={num}
                    style={{
                      flex: 1,
                      opacity: factProgress,
                      transform: `
                        translateY(${(1 - factProgress) * 50}px)
                        scale(${0.9 + factProgress * 0.1})
                      `,
                    }}
                  >
                    <GlassmorphicPane padding={30} borderOpacity={0.4} glowOpacity={0.18}>
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${colors.accent}, ${colors.support})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 20px',
                          boxShadow: `0 0 30px ${colors.accent}50`,
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
                      <div
                        style={{
                          fontFamily: fonts.body.family,
                          fontSize: fonts.body.size,
                          fontWeight: fonts.body.weight,
                          color: colors.ink,
                          textAlign: 'center',
                          lineHeight: 1.5,
                        }}
                      >
                        {fact}
                      </div>
                    </GlassmorphicPane>
                  </div>
                );
              })}
            </div>

            {/* Challenge */}
            {frame >= timeline.challenge.start && scene.fill?.texts?.challenge && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 70,
                  left: '50%',
                  transform: `
                    translateX(-50%)
                    scale(${interpolate(
                      frame,
                      [timeline.challenge.start, timeline.challenge.start + 30],
                      [0.8, 1],
                      { easing: Easing.elastic(1.2), extrapolateRight: 'clamp' }
                    )})
                  `,
                  opacity: interpolate(
                    frame,
                    [timeline.challenge.start, timeline.challenge.start + 30],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  ),
                  maxWidth: '85%',
                }}
              >
                <GlassmorphicPane
                  padding={40}
                  borderOpacity={0.6}
                  glowOpacity={0.3}
                  backgroundColor="rgba(255, 255, 255, 0.12)"
                >
                  <div
                    style={{
                      fontFamily: fonts.title.family,
                      fontSize: fonts.title.size * 0.6,
                      fontWeight: fonts.title.weight,
                      color: colors.highlight,
                      textAlign: 'center',
                      lineHeight: 1.4,
                      textShadow: `0 3px 30px ${colors.highlight}70`,
                    }}
                  >
                    {scene.fill.texts.challenge}
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

export const HOOK_DURATION = 30 * 30;
export const HOOK_EXIT_TRANSITION = 10;
