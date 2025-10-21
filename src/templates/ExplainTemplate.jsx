import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import {
  GlassmorphicPane,
  NoiseTexture,
  SpotlightEffect,
  FloatingParticles,
  GradientBackground,
} from '../sdk/broadcastEffects';
import { sceneExitProgress } from '../sdk/broadcastAnimations';
import { RemotionLottie, lottieAnimations } from '../sdk/lottieIntegration';

/**
 * EXPLAIN Template - CINEMATIC 3D BROADCAST
 * 
 * Features:
 * - 3D perspective transforms
 * - Camera dolly and pan movements
 * - Each step has unique Lottie animation
 * - Particle systems that react to content
 * - Configurable timeline for every element
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
    title: { family: 'Cabin Sketch, cursive', size: 80, weight: 700 },
    subtitle: { family: 'Patrick Hand, cursive', size: 36, weight: 600 },
    body: { family: 'Patrick Hand, cursive', size: 30, weight: 400 },
  };

  const fonts = {
    title: scene.style_tokens?.fonts?.title || defaultFonts.title,
    subtitle: scene.style_tokens?.fonts?.subtitle || defaultFonts.subtitle,
    body: scene.style_tokens?.fonts?.body || defaultFonts.body,
  };

  const images = resolveSceneImages(scene.fill?.images);

  // CINEMATIC TIMELINE - Fully choreographed
  const timeline = {
    // Opening sequence (0-60)
    intro: { start: 0, end: 60 },
    introLottie: { start: 0, end: 900 },
    
    // Title reveal (10-80)
    title: { start: 10, end: 850 },
    titleLottie: { start: 5, end: 850 },
    
    // Concept explanation (40-120)
    concept: { start: 40, end: 850 },
    conceptLottie: { start: 35, end: 850 },
    
    // Steps cascade with 3D rotation (80-600)
    steps: [
      { start: 100, flipStart: 100, flipEnd: 130, end: 850 },
      { start: 180, flipStart: 180, flipEnd: 210, end: 850 },
      { start: 260, flipStart: 260, flipEnd: 290, end: 850 },
      { start: 340, flipStart: 340, flipEnd: 370, end: 850 },
    ],
    stepLotties: [
      { start: 95, end: 850 },
      { start: 175, end: 850 },
      { start: 255, end: 850 },
      { start: 335, end: 850 },
    ],
    
    // Summary with burst (680-850)
    summary: { start: 680, end: 900 },
    summaryLottie: { start: 675, end: 900 },
    
    // Exit (850-900)
    exit: { start: 850, end: 900 },
  };

  // CAMERA SYSTEM - Cinematic dolly movement
  const cameraZ = interpolate(
    frame,
    [0, 60, 600, durationInFrames - 60, durationInFrames],
    [1.5, 1, 1, 1, 0.5],
    {
      easing: Easing.bezier(0.33, 1, 0.68, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const cameraPan = interpolate(
    frame,
    [0, 300, durationInFrames],
    [0, 20, -50],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const cameraTilt = interpolate(
    frame,
    [0, 60, durationInFrames - 60, durationInFrames],
    [-2, 0, 0, 5],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const exitProgress = sceneExitProgress(frame, fps, durationInFrames, 30);

  // Dynamic particle count based on timeline phase
  const particleIntensity = interpolate(
    frame,
    [0, 60, 400, durationInFrames - 60],
    [50, 30, 40, 60],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: colors.bg,
          transform: `scale(${1 + exitProgress * 4}) rotate(${exitProgress * 10}deg)`,
          opacity: 1 - exitProgress * 0.8,
        }}
      >
        {/* DYNAMIC BACKGROUND */}
        <GradientBackground
          gradient="cool-ocean"
          opacity={0.25}
          rotate={135 + frame * 0.15}
        />
        <NoiseTexture opacity={0.06} scale={1.4 + Math.sin(frame * 0.02) * 0.1} />
        
        {/* Multiple moving spotlights */}
        <SpotlightEffect
          x={30 + Math.sin(frame * 0.03) * 20}
          y={50 + Math.cos(frame * 0.04) * 20}
          size={1200}
          color={colors.accent}
          opacity={0.12}
        />
        <SpotlightEffect
          x={70 + Math.cos(frame * 0.025) * 15}
          y={30 + Math.sin(frame * 0.035) * 15}
          size={1000}
          color={colors.support}
          opacity={0.08}
        />
        
        {/* Dynamic particles */}
        <FloatingParticles
          count={Math.floor(particleIntensity)}
          color={colors.support}
          size={6}
          speed={0.6}
          frame={frame}
        />

        {/* BACKGROUND LOTTIE - Brain thinking animation */}
        {frame >= timeline.introLottie.start && (
          <AbsoluteFill
            style={{
              opacity: 0.08,
              transform: `scale(3) rotate(${frame * 0.2}deg)`,
            }}
          >
            <div style={{ width: '100%', height: '100%' }}>
              <RemotionLottie
                animation={lottieAnimations.brain}
                loop
                autoplay
              />
            </div>
          </AbsoluteFill>
        )}

        {/* 3D PERSPECTIVE CONTAINER */}
        <AbsoluteFill
          style={{
            perspective: '1200px',
            perspectiveOrigin: '50% 50%',
          }}
        >
          {/* CAMERA CONTAINER */}
          <AbsoluteFill
            style={{
              transform: `
                scale(${cameraZ})
                translateX(${cameraPan}px)
                rotateX(${cameraTilt}deg)
              `,
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                padding: '60px 80px',
              }}
            >
              {/* TITLE WITH ROTATING LOTTIE */}
              {frame >= timeline.title.start && (
                <div
                  style={{
                    position: 'relative',
                    textAlign: 'center',
                    marginBottom: 30,
                    opacity: interpolate(
                      frame,
                      [timeline.title.start, timeline.title.start + 30],
                      [0, 1],
                      { extrapolateRight: 'clamp' }
                    ),
                    transform: `
                      translateY(${interpolate(
                        frame,
                        [timeline.title.start, timeline.title.start + 40],
                        [-100, 0],
                        { easing: Easing.elastic(1.2), extrapolateRight: 'clamp' }
                      )}px)
                      rotateX(${interpolate(
                        frame,
                        [timeline.title.start, timeline.title.start + 30],
                        [90, 0],
                        { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                      )}deg)
                    `,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* LOTTIE - Book opening animation */}
                  {frame >= timeline.titleLottie.start && (
                    <div
                      style={{
                        position: 'absolute',
                        width: 150,
                        height: 150,
                        left: '50%',
                        top: -80,
                        transform: `translateX(-50%) scale(${interpolate(
                          frame,
                          [timeline.titleLottie.start, timeline.titleLottie.start + 30],
                          [0, 1],
                          { easing: Easing.elastic(1.5), extrapolateRight: 'clamp' }
                        )})`,
                      }}
                    >
                      <RemotionLottie
                        animation={lottieAnimations.book}
                        loop
                        autoplay
                      />
                    </div>
                  )}

                  <GlassmorphicPane padding={40} borderOpacity={0.5}>
                    <div
                      style={{
                        fontFamily: fonts.title.family,
                        fontSize: fonts.title.size,
                        fontWeight: fonts.title.weight,
                        color: colors.ink,
                        textShadow: `0 4px 30px ${colors.accent}80`,
                      }}
                    >
                      {scene.fill?.texts?.title || '📚 Understanding the Concept'}
                    </div>
                  </GlassmorphicPane>
                </div>
              )}

              {/* CONCEPT EXPLANATION WITH LOTTIE */}
              {frame >= timeline.concept.start && scene.fill?.texts?.concept && (
                <div
                  style={{
                    textAlign: 'center',
                    marginBottom: 50,
                    opacity: interpolate(
                      frame,
                      [timeline.concept.start, timeline.concept.start + 30],
                      [0, 1],
                      { extrapolateRight: 'clamp' }
                    ),
                    transform: `scale(${interpolate(
                      frame,
                      [timeline.concept.start, timeline.concept.start + 30],
                      [0.8, 1],
                      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                    )})`,
                  }}
                >
                  {/* LOTTIE - Lightbulb thinking */}
                  {frame >= timeline.conceptLottie.start && (
                    <div
                      style={{
                        display: 'inline-block',
                        width: 60,
                        height: 60,
                        marginRight: 20,
                        verticalAlign: 'middle',
                      }}
                    >
                      <RemotionLottie
                        animation={lottieAnimations.lightbulb}
                        loop
                        autoplay
                      />
                    </div>
                  )}
                  <span
                    style={{
                      fontFamily: fonts.subtitle.family,
                      fontSize: fonts.subtitle.size,
                      fontWeight: fonts.subtitle.weight,
                      color: colors.highlight,
                      verticalAlign: 'middle',
                    }}
                  >
                    {scene.fill.texts.concept}
                  </span>
                </div>
              )}

              {/* 4 STEPS IN 2x2 GRID WITH 3D FLIP ANIMATIONS */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 35,
                  height: '55%',
                }}
              >
                {[1, 2, 3, 4].map((num, index) => {
                  const stepKey = `step${num}`;
                  const stepText = scene.fill?.texts?.[stepKey];
                  const stepTimeline = timeline.steps[index];
                  const lottieTimeline = timeline.stepLotties[index];
                  
                  if (!stepText || frame < stepTimeline.start) return null;

                  // 3D FLIP ANIMATION
                  const flipProgress = interpolate(
                    frame,
                    [stepTimeline.flipStart, stepTimeline.flipEnd],
                    [0, 1],
                    {
                      easing: Easing.inOut(Easing.cubic),
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }
                  );

                  const rotateY = interpolate(flipProgress, [0, 1], [90, 0]);
                  const opacity = interpolate(flipProgress, [0, 0.5, 1], [0, 0.5, 1]);
                  const scale = interpolate(flipProgress, [0, 0.5, 1], [0.5, 0.9, 1]);

                  // Floating effect after flip
                  const floatY = frame > stepTimeline.flipEnd 
                    ? Math.sin((frame - stepTimeline.flipEnd) * 0.05 + index) * 5
                    : 0;

                  // Lottie animations - different for each step
                  const lotties = [
                    lottieAnimations.rocket,
                    lottieAnimations.star,
                    lottieAnimations.checkmark,
                    lottieAnimations.trophy,
                  ];

                  return (
                    <div
                      key={num}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: `
                          rotateY(${rotateY}deg)
                          scale(${scale})
                          translateY(${floatY}px)
                          translateZ(${20 * (1 - flipProgress)}px)
                        `,
                        opacity,
                      }}
                    >
                      <GlassmorphicPane
                        padding={30}
                        borderOpacity={0.4}
                        glowOpacity={0.2}
                      >
                        <div style={{ position: 'relative' }}>
                          {/* LOTTIE for this step */}
                          {frame >= lottieTimeline.start && (
                            <div
                              style={{
                                width: 80,
                                height: 80,
                                margin: '0 auto 15px',
                                opacity: interpolate(
                                  frame,
                                  [lottieTimeline.start, lottieTimeline.start + 20],
                                  [0, 1],
                                  { extrapolateRight: 'clamp' }
                                ),
                                transform: `scale(${interpolate(
                                  frame,
                                  [lottieTimeline.start, lottieTimeline.start + 20],
                                  [0, 1],
                                  { easing: Easing.elastic(1.8), extrapolateRight: 'clamp' }
                                )}) rotate(${(frame - lottieTimeline.start) * 2}deg)`,
                              }}
                            >
                              <RemotionLottie
                                animation={lotties[index]}
                                loop
                                autoplay
                              />
                            </div>
                          )}

                          {/* Step number with glow */}
                          <div
                            style={{
                              width: 70,
                              height: 70,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${colors.accent}, ${colors.support})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 20px',
                              boxShadow: `0 0 50px ${colors.accent}90`,
                              transform: `scale(${1 + Math.sin((frame + index * 60) * 0.08) * 0.1})`,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: fonts.title.family,
                                fontSize: 40,
                                fontWeight: 700,
                                color: '#ffffff',
                              }}
                            >
                              {num}
                            </span>
                          </div>

                          {/* Step text */}
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
                        </div>
                      </GlassmorphicPane>
                    </div>
                  );
                })}
              </div>

              {/* SUMMARY WITH BURST LOTTIE */}
              {frame >= timeline.summary.start && scene.fill?.texts?.summary && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 60,
                    left: '50%',
                    transform: `
                      translateX(-50%)
                      scale(${interpolate(
                        frame,
                        [timeline.summary.start, timeline.summary.start + 40],
                        [0.5, 1],
                        { easing: Easing.elastic(1.3), extrapolateRight: 'clamp' }
                      )})
                      rotateX(${interpolate(
                        frame,
                        [timeline.summary.start, timeline.summary.start + 30],
                        [60, 0],
                        { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                      )}deg)
                    `,
                    opacity: interpolate(
                      frame,
                      [timeline.summary.start, timeline.summary.start + 30],
                      [0, 1],
                      { extrapolateRight: 'clamp' }
                    ),
                    maxWidth: '85%',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* LOTTIE - Success celebration */}
                  {frame >= timeline.summaryLottie.start && (
                    <AbsoluteFill
                      style={{
                        opacity: 0.4,
                        transform: 'scale(2)',
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{ width: '100%', height: '100%' }}>
                        <RemotionLottie
                          animation={lottieAnimations.success}
                          loop={false}
                          autoplay
                        />
                      </div>
                    </AbsoluteFill>
                  )}

                  <GlassmorphicPane
                    padding={40}
                    borderOpacity={0.6}
                    glowOpacity={0.35}
                    backgroundColor="rgba(255, 255, 255, 0.15)"
                  >
                    <div
                      style={{
                        fontFamily: fonts.subtitle.family,
                        fontSize: fonts.subtitle.size * 1.2,
                        fontWeight: 700,
                        color: colors.highlight,
                        textAlign: 'center',
                        lineHeight: 1.4,
                        textShadow: `0 4px 40px ${colors.highlight}90`,
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
    </AbsoluteFill>
  );
};

export const EXPLAIN_DURATION = 30 * 30;
export const EXPLAIN_EXIT_TRANSITION = 10;
