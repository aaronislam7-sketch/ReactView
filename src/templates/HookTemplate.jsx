import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing, Sequence } from 'remotion';
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
  springConfigs,
} from '../sdk/broadcastAnimations';
import { RemotionLottie, lottieAnimations } from '../sdk/lottieIntegration';

/**
 * HOOK Template - CINEMATIC BROADCAST GRADE
 * 
 * Bold, dynamic, with actual Lottie animations and particle effects
 * Camera movements, perspective shifts, cinematic timing
 */
export const HookTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Colors with cinematic defaults
  const defaultColors = {
    bg: '#0a0a1e',
    accent: '#E62B1E',
    support: '#FF6B6B',
    ink: '#ffffff',
    highlight: '#FFE66D',
  };

  const colors = scene.style_tokens?.colors || defaultColors;

  const defaultFonts = {
    title: { family: 'Cabin Sketch, cursive', size: 90, weight: 700 },
    body: { family: 'Patrick Hand, cursive', size: 38, weight: 400 },
    question: { family: 'Cabin Sketch, cursive', size: 72, weight: 700 },
  };

  const fonts = {
    title: scene.style_tokens?.fonts?.title || defaultFonts.title,
    body: scene.style_tokens?.fonts?.body || defaultFonts.body,
    question: scene.style_tokens?.fonts?.question || defaultFonts.question,
  };

  const images = resolveSceneImages(scene.fill?.images);

  // CINEMATIC TIMELINE - each element has specific entry/exit
  const timeline = {
    // Phase 1: Opening burst (0-90 frames)
    openingBurst: { start: 0, end: 90 },
    question: { start: 20, end: 850 },
    questionLottie: { start: 15, peak: 60, end: 850 },
    
    // Phase 2: Visual reveal (90-300 frames)
    mainVisual: { start: 80, end: 850 },
    visualLottie: { start: 75, end: 850 },
    
    // Phase 3: Facts cascade (300-650 frames)
    facts: [
      { start: 150, end: 850 },
      { start: 180, end: 850 },
      { start: 210, end: 850 },
    ],
    factLotties: [
      { start: 145, end: 850 },
      { start: 175, end: 850 },
      { start: 205, end: 850 },
    ],
    
    // Phase 4: Challenge moment (650-850 frames)
    challenge: { start: 680, end: 870 },
    challengeLottie: { start: 675, end: 870 },
    
    // Phase 5: Exit sequence (850-900 frames)
    exit: { start: 850, end: 900 },
  };

  // CAMERA MOVEMENT - cinematic zoom and pan
  const cameraZoom = interpolate(
    frame,
    [0, 60, durationInFrames - 60, durationInFrames],
    [1.2, 1, 1, 1.5],
    {
      easing: Easing.bezier(0.33, 1, 0.68, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const cameraPan = interpolate(
    frame,
    [0, 90, durationInFrames - 30],
    [50, 0, -30],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Exit zoom out effect
  const exitProgress = sceneExitProgress(frame, fps, durationInFrames, 30);

  // Question animation with dramatic entrance
  const questionProgress = interpolate(
    frame,
    [timeline.question.start, timeline.question.start + 40],
    [0, 1],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const questionScale = interpolate(
    frame,
    [timeline.question.start, timeline.question.start + 30],
    [0.3, 1],
    {
      easing: Easing.elastic(1.5),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const questionRotate = interpolate(
    frame,
    [timeline.question.start, timeline.question.start + 30],
    [45, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Pulse effect for question
  const pulse = Math.sin(frame * 0.06) * 0.02 + 1;

  return (
    <AbsoluteFill>
      {/* BACKGROUND LAYERS */}
      <AbsoluteFill
        style={{
          backgroundColor: colors.bg,
          transform: `scale(${1 + exitProgress * 3})`,
          opacity: 1 - exitProgress * 0.7,
        }}
      >
        {/* Animated gradient background */}
        <GradientBackground
          gradient="ted-red"
          opacity={0.2}
          rotate={45 + frame * 0.1}
        />
        
        {/* Noise texture */}
        <NoiseTexture opacity={0.05} scale={1.3} />
        
        {/* Dynamic spotlight that follows the action */}
        <SpotlightEffect
          x={50 + Math.sin(frame * 0.02) * 10}
          y={30 + Math.cos(frame * 0.03) * 10}
          size={1400}
          color={colors.accent}
          opacity={0.15}
        />
        
        {/* Particle system - actually rendering */}
        <FloatingParticles
          count={30}
          color={colors.support}
          size={8}
          speed={0.5}
          frame={frame}
        />

        {/* CAMERA CONTAINER - adds cinematic movement */}
        <AbsoluteFill
          style={{
            transform: `scale(${cameraZoom}) translateX(${cameraPan}px)`,
            transformOrigin: 'center center',
          }}
        >
          {/* MAIN CONTENT */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              padding: '60px 100px',
            }}
          >
            {/* PHASE 1: QUESTION WITH LOTTIE */}
            {frame >= timeline.question.start && (
              <AbsoluteFill
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    opacity: questionProgress,
                    transform: `scale(${questionScale * pulse}) rotate(${questionRotate}deg)`,
                    position: 'relative',
                  }}
                >
                  {/* LOTTIE ANIMATION - Question mark rotating */}
                  {frame >= timeline.questionLottie.start && (
                    <AbsoluteFill
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: interpolate(
                          frame,
                          [timeline.questionLottie.start, timeline.questionLottie.peak],
                          [0, 0.3],
                          { extrapolateRight: 'clamp' }
                        ),
                        transform: `scale(3) rotate(${frame * 2}deg)`,
                      }}
                    >
                      <div style={{ width: 300, height: 300 }}>
                        <RemotionLottie
                          animation={lottieAnimations.question}
                          loop
                          autoplay
                        />
                      </div>
                    </AbsoluteFill>
                  )}

                  {/* Question text with glassmorphic card */}
                  <GlassmorphicPane
                    padding={50}
                    borderOpacity={0.5}
                    glowOpacity={0.3}
                    style={{ maxWidth: 900 }}
                  >
                    <div
                      style={{
                        fontFamily: fonts.question.family,
                        fontSize: fonts.question.size,
                        fontWeight: fonts.question.weight,
                        color: colors.ink,
                        textAlign: 'center',
                        lineHeight: 1.3,
                        textShadow: `0 4px 30px ${colors.accent}80`,
                      }}
                    >
                      {scene.fill?.texts?.question || '❓ What if everything you knew was wrong?'}
                    </div>
                  </GlassmorphicPane>
                </div>
              </AbsoluteFill>
            )}

            {/* PHASE 2: MAIN VISUAL WITH EXPLODING LOTTIE */}
            {frame >= timeline.mainVisual.start && (
              <AbsoluteFill
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: '20%',
                  opacity: interpolate(
                    frame,
                    [timeline.mainVisual.start, timeline.mainVisual.start + 40],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  ),
                  transform: `scale(${interpolate(
                    frame,
                    [timeline.mainVisual.start, timeline.mainVisual.start + 40],
                    [0.5, 1],
                    { easing: Easing.elastic(1.2), extrapolateRight: 'clamp' }
                  )})`,
                }}
              >
                {/* LOTTIE - Lightbulb or relevant icon */}
                <div
                  style={{
                    position: 'absolute',
                    width: 200,
                    height: 200,
                    opacity: 0.4,
                    transform: `scale(${1.5 + Math.sin(frame * 0.05) * 0.2}) rotate(${Math.sin(frame * 0.03) * 15}deg)`,
                  }}
                >
                  <RemotionLottie
                    animation={lottieAnimations.lightbulb}
                    loop
                    autoplay
                  />
                </div>

                {/* Image or icon */}
                {images?.mainImage && (
                  <img
                    src={images.mainImage}
                    alt="Main visual"
                    style={{
                      width: 180,
                      height: 180,
                      borderRadius: '50%',
                      border: `6px solid ${colors.accent}`,
                      boxShadow: `0 0 60px ${colors.accent}80`,
                    }}
                  />
                )}
              </AbsoluteFill>
            )}

            {/* PHASE 3: FACTS CASCADE WITH LOTTIES */}
            <AbsoluteFill
              style={{
                top: '50%',
                padding: '0 100px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 40,
                }}
              >
                {[1, 2, 3].map((num, index) => {
                  const fact = scene.fill?.texts?.[`fact${num}`];
                  const factTimeline = timeline.facts[index];
                  const lottieTimeline = timeline.factLotties[index];
                  
                  if (!fact || frame < factTimeline.start) return null;

                  const factProgress = interpolate(
                    frame,
                    [factTimeline.start, factTimeline.start + 30],
                    [0, 1],
                    {
                      easing: Easing.elastic(1.3),
                      extrapolateRight: 'clamp',
                    }
                  );

                  const factY = interpolate(
                    frame,
                    [factTimeline.start, factTimeline.start + 30],
                    [100, 0],
                    {
                      easing: Easing.out(Easing.cubic),
                      extrapolateRight: 'clamp',
                    }
                  );

                  const factRotate = interpolate(
                    frame,
                    [factTimeline.start, factTimeline.start + 20],
                    [(index % 2 === 0 ? -1 : 1) * 45, 0],
                    {
                      easing: Easing.out(Easing.cubic),
                      extrapolateRight: 'clamp',
                    }
                  );

                  return (
                    <div
                      key={num}
                      style={{
                        flex: 1,
                        opacity: factProgress,
                        transform: `translateY(${factY}px) rotate(${factRotate}deg) scale(${factProgress})`,
                        perspective: '1000px',
                      }}
                    >
                      <GlassmorphicPane
                        padding={35}
                        borderOpacity={0.4}
                        glowOpacity={0.2}
                      >
                        {/* LOTTIE above each fact */}
                        {frame >= lottieTimeline.start && (
                          <div
                            style={{
                              width: 80,
                              height: 80,
                              margin: '0 auto 20px',
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
                                { easing: Easing.elastic(1.5), extrapolateRight: 'clamp' }
                              )})`,
                            }}
                          >
                            <RemotionLottie
                              animation={
                                index === 0
                                  ? lottieAnimations.star
                                  : index === 1
                                  ? lottieAnimations.sparkle
                                  : lottieAnimations.rocket
                              }
                              loop
                              autoplay
                            />
                          </div>
                        )}

                        {/* Number badge with glow */}
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
                            boxShadow: `0 0 40px ${colors.accent}`,
                            animation: `pulse 2s ease-in-out infinite ${index * 0.3}s`,
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

                        {/* Fact text */}
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
            </AbsoluteFill>

            {/* PHASE 4: CHALLENGE WITH CELEBRATION LOTTIE */}
            {frame >= timeline.challenge.start && (
              <AbsoluteFill
                style={{
                  bottom: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    opacity: interpolate(
                      frame,
                      [timeline.challenge.start, timeline.challenge.start + 30],
                      [0, 1],
                      { extrapolateRight: 'clamp' }
                    ),
                    transform: `scale(${interpolate(
                      frame,
                      [timeline.challenge.start, timeline.challenge.start + 30],
                      [0.7, 1],
                      { easing: Easing.elastic(1.2), extrapolateRight: 'clamp' }
                    )})`,
                    position: 'relative',
                  }}
                >
                  {/* LOTTIE - Celebration burst */}
                  {frame >= timeline.challengeLottie.start && (
                    <AbsoluteFill
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0.5,
                        transform: 'scale(2)',
                      }}
                    >
                      <div style={{ width: 400, height: 400 }}>
                        <RemotionLottie
                          animation={lottieAnimations.confetti}
                          loop={false}
                          autoplay
                        />
                      </div>
                    </AbsoluteFill>
                  )}

                  <GlassmorphicPane
                    padding={45}
                    borderOpacity={0.6}
                    glowOpacity={0.35}
                    backgroundColor="rgba(255, 255, 255, 0.15)"
                    style={{ maxWidth: 900 }}
                  >
                    <div
                      style={{
                        fontFamily: fonts.title.family,
                        fontSize: fonts.title.size * 0.65,
                        fontWeight: fonts.title.weight,
                        color: colors.highlight,
                        textAlign: 'center',
                        lineHeight: 1.4,
                        textShadow: `0 4px 40px ${colors.highlight}90`,
                      }}
                    >
                      {scene.fill?.texts?.challenge || "🚀 Let's dive deeper!"}
                    </div>
                  </GlassmorphicPane>
                </div>
              </AbsoluteFill>
            )}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* CSS animations for pulse effect */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </AbsoluteFill>
  );
};

export const HOOK_DURATION = 30 * 30;
export const HOOK_EXIT_TRANSITION = 10;
