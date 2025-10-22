import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import {
  GlassmorphicPane,
  NoiseTexture,
  SpotlightEffect,
  TEDCard,
  GradientBackground,
} from '../sdk/broadcastEffects';
import { sceneExitProgress } from '../sdk/broadcastAnimations';

/**
 * EXPLAIN Template - OPTIMIZED BROADCAST
 * Clean, smooth, no browser crashes
 */
export const ExplainTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const defaultColors = {
    bg: '#0a0a1e',
    accent: '#4A90E2',
    support: '#00D4FF',
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

  // SIMPLIFIED TIMELINE
  const timeline = {
    title: { start: 10, end: 850 },
    concept: { start: 40, end: 850 },
    steps: [
      { start: 100, end: 850 },
      { start: 160, end: 850 },
      { start: 220, end: 850 },
      { start: 280, end: 850 },
    ],
    summary: { start: 680, end: 900 },
  };

  // Simple camera movement
  const cameraScale = interpolate(
    frame,
    [0, 50, durationInFrames - 50, durationInFrames],
    [1.1, 1, 1, 1.2],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const exitProgress = sceneExitProgress(frame, fps, durationInFrames, 30);

  // Gentle float effect
  const floatY = Math.sin(frame * 0.04) * 3;

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
        <GradientBackground gradient="cool-ocean" opacity={0.18} rotate={225} />
        <NoiseTexture opacity={0.05} scale={1.3} />
        <SpotlightEffect x={70} y={30} size={1100} color={colors.accent} opacity={0.1} />

        {/* Content with simple zoom */}
        <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              padding: '60px 90px',
            }}
          >
            {/* Title */}
            {frame >= timeline.title.start && (
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: 25,
                  opacity: interpolate(
                    frame,
                    [timeline.title.start, timeline.title.start + 30],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  ),
                  transform: `
                    translateY(${interpolate(
                      frame,
                      [timeline.title.start, timeline.title.start + 30],
                      [-40, 0],
                      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                    )}px)
                    scale(${interpolate(
                      frame,
                      [timeline.title.start, timeline.title.start + 30],
                      [0.9, 1],
                      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                    )})
                  `,
                }}
              >
                <TEDCard accentColor={colors.accent}>
                  <div
                    style={{
                      fontFamily: fonts.title.family,
                      fontSize: fonts.title.size,
                      fontWeight: fonts.title.weight,
                      color: colors.ink,
                      textShadow: `0 3px 20px ${colors.accent}50`,
                      padding: '10px 0',
                    }}
                  >
                    {scene.fill?.texts?.title || '📚 Understanding the Concept'}
                  </div>
                </TEDCard>
              </div>
            )}

            {/* Concept */}
            {frame >= timeline.concept.start && scene.fill?.texts?.concept && (
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: 40,
                  opacity: interpolate(
                    frame,
                    [timeline.concept.start, timeline.concept.start + 25],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  ),
                  transform: `scale(${interpolate(
                    frame,
                    [timeline.concept.start, timeline.concept.start + 25],
                    [0.95, 1],
                    { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                  )})`,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.subtitle.family,
                    fontSize: fonts.subtitle.size,
                    fontWeight: fonts.subtitle.weight,
                    color: colors.highlight,
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
                gap: 30,
                height: '55%',
              }}
            >
              {[1, 2, 3, 4].map((num, index) => {
                const stepKey = `step${num}`;
                const stepText = scene.fill?.texts?.[stepKey];
                const stepTimeline = timeline.steps[index];
                
                if (!stepText || frame < stepTimeline.start) return null;

                const stepProgress = interpolate(
                  frame,
                  [stepTimeline.start, stepTimeline.start + 30],
                  [0, 1],
                  { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                );

                const slideDistance = index % 2 === 0 ? -60 : 60;

                return (
                  <div
                    key={num}
                    style={{
                      opacity: stepProgress,
                      transform: `
                        translateX(${(1 - stepProgress) * slideDistance}px)
                        translateY(${floatY}px)
                        scale(${0.95 + stepProgress * 0.05})
                      `,
                    }}
                  >
                    <TEDCard accentColor={colors.accent}>
                      <div
                        style={{
                          width: 65,
                          height: 65,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${colors.accent}, ${colors.support})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 20px',
                          boxShadow: `0 0 35px ${colors.accent}60`,
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
                      {images?.[`icon${num}`] && (
                        <img
                          src={images[`icon${num}`]}
                          alt={`Step ${num}`}
                          style={{
                            width: 50,
                            height: 50,
                            display: 'block',
                            margin: '0 auto 15px',
                            opacity: 0.85,
                          }}
                        />
                      )}
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
                        {stepText}
                      </div>
                    </TEDCard>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            {frame >= timeline.summary.start && scene.fill?.texts?.summary && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 50,
                  left: '50%',
                  transform: `
                    translateX(-50%)
                    scale(${interpolate(
                      frame,
                      [timeline.summary.start, timeline.summary.start + 30],
                      [0.9, 1],
                      { easing: Easing.elastic(1.2), extrapolateRight: 'clamp' }
                    )})
                  `,
                  opacity: interpolate(
                    frame,
                    [timeline.summary.start, timeline.summary.start + 30],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  ),
                  maxWidth: '82%',
                }}
              >
                <GlassmorphicPane
                  padding={38}
                  borderOpacity={0.6}
                  glowOpacity={0.3}
                  backgroundColor="rgba(255, 255, 255, 0.15)"
                >
                  <div
                    style={{
                      fontFamily: fonts.subtitle.family,
                      fontSize: fonts.subtitle.size * 1.15,
                      fontWeight: 700,
                      color: colors.highlight,
                      textAlign: 'center',
                      lineHeight: 1.4,
                      textShadow: `0 3px 30px ${colors.highlight}70`,
                    }}
                  >
                    💡 {scene.fill.texts.summary}
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

export const EXPLAIN_DURATION = 30 * 30;
export const EXPLAIN_EXIT_TRANSITION = 10;
