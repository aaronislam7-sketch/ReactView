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
 * APPLY Template - GAME-LIKE PROGRESSION
 * 
 * Visual style: Video game level progression
 * - Scenario appears as "mission briefing"
 * - Actions unlock sequentially with particle bursts
 * - Result appears as "level complete"
 * - Energy bars, progress indicators, achievement unlocks
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
    danger: '#E74C3C',
  };

  const colors = scene.style_tokens?.colors || defaultColors;

  const defaultFonts = {
    title: { family: 'Cabin Sketch, cursive', size: 72, weight: 700 },
    subtitle: { family: 'Patrick Hand, cursive', size: 34, weight: 600 },
    body: { family: 'Patrick Hand, cursive', size: 32, weight: 400 },
  };

  const fonts = {
    title: scene.style_tokens?.fonts?.title || defaultFonts.title,
    subtitle: scene.style_tokens?.fonts?.subtitle || defaultFonts.subtitle,
    body: scene.style_tokens?.fonts?.body || defaultFonts.body,
  };

  const images = resolveSceneImages(scene.fill?.images);

  // GAME-LIKE TIMELINE - Progression unlocks
  const timeline = {
    // Mission briefing (0-100)
    missionStart: { start: 0, end: 100 },
    missionLottie: { start: 0, end: 900 },
    
    // Scenario reveal (15-850)
    scenario: { start: 15, end: 850 },
    scenarioLottie: { start: 10, end: 850 },
    
    // Action unlocks - each triggered sequentially
    actions: [
      { 
        lockStart: 120, lockEnd: 160,
        unlockStart: 160, unlockEnd: 200,
        active: 200, complete: 450, end: 850,
        progressStart: 200, progressEnd: 450,
      },
      { 
        lockStart: 250, lockEnd: 290,
        unlockStart: 290, unlockEnd: 330,
        active: 330, complete: 550, end: 850,
        progressStart: 330, progressEnd: 550,
      },
      { 
        lockStart: 380, lockEnd: 420,
        unlockStart: 420, unlockEnd: 460,
        active: 460, complete: 650, end: 850,
        progressStart: 460, progressEnd: 650,
      },
    ],
    actionLotties: [
      { start: 155, burst: 200, end: 850 },
      { start: 285, burst: 330, end: 850 },
      { start: 415, burst: 460, end: 850 },
    ],
    
    // Level complete (680-900)
    result: { start: 680, end: 900 },
    resultLottie: { start: 675, end: 900 },
    achievement: { start: 710, end: 900 },
    
    // Exit
    exit: { start: 850, end: 900 },
  };

  // DYNAMIC CAMERA - Following the action
  const cameraY = interpolate(
    frame,
    [0, 150, 400, 680, durationInFrames],
    [0, -50, 50, 0, -100],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const cameraScale = interpolate(
    frame,
    [0, 60, durationInFrames - 100, durationInFrames],
    [1.3, 1, 1, 0.7],
    {
      easing: Easing.bezier(0.33, 1, 0.68, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const exitProgress = sceneExitProgress(frame, fps, durationInFrames, 30);

  // Energy/progress bar pulsing
  const energyPulse = 1 + Math.sin(frame * 0.12) * 0.08;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: colors.bg,
          transform: `scale(${1 + exitProgress * 3}) rotate(${exitProgress * -15}deg)`,
          opacity: 1 - exitProgress * 0.7,
        }}
      >
        {/* BACKGROUND - Game-like atmosphere */}
        <GradientBackground
          gradient="emerald-forest"
          opacity={0.2}
          rotate={90 + frame * 0.2}
        />
        <NoiseTexture opacity={0.07} scale={1.5} />
        
        {/* Grid overlay for game feel */}
        <AbsoluteFill
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .02) 25%, rgba(255, 255, 255, .02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .02) 75%, rgba(255, 255, 255, .02) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .02) 25%, rgba(255, 255, 255, .02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .02) 75%, rgba(255, 255, 255, .02) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.3,
          }}
        />
        
        {/* Spotlight follows action */}
        <SpotlightEffect
          x={50}
          y={interpolate(frame, [0, 400, 680], [20, 50, 80], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          size={1300}
          color={colors.accent}
          opacity={0.15}
        />
        
        {/* Particle burst on unlocks */}
        <FloatingParticles
          count={frame > 200 && frame < 250 ? 80 : frame > 330 && frame < 380 ? 80 : frame > 460 && frame < 510 ? 80 : 25}
          color={colors.support}
          size={frame > 200 && frame < 250 ? 12 : frame > 330 && frame < 380 ? 12 : frame > 460 && frame < 510 ? 12 : 6}
          speed={0.7}
          frame={frame}
        />

        {/* BACKGROUND LOTTIE - Rocket flying across */}
        {frame >= timeline.missionLottie.start && (
          <AbsoluteFill
            style={{
              opacity: 0.12,
              transform: `translateX(${interpolate(frame, [0, durationInFrames], [-100, 2100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px) scale(2) rotate(-15deg)`,
            }}
          >
            <div style={{ width: 300, height: 300 }}>
              <RemotionLottie
                animation={lottieAnimations.rocket}
                loop
                autoplay
              />
            </div>
          </AbsoluteFill>
        )}

        {/* CAMERA CONTAINER */}
        <AbsoluteFill
          style={{
            transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              padding: '50px 90px',
            }}
          >
            {/* HUD - Top status bar */}
            <div
              style={{
                position: 'absolute',
                top: 30,
                left: 90,
                right: 90,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: frame >= timeline.missionStart.start ? 1 : 0,
              }}
            >
              {/* Mission status */}
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: 24,
                  color: colors.accent,
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  textShadow: `0 0 20px ${colors.accent}`,
                }}
              >
                ► MISSION: APPLY KNOWLEDGE
              </div>
              
              {/* Progress indicator */}
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                }}
              >
                {[1, 2, 3].map((i) => {
                  const actionTimeline = timeline.actions[i - 1];
                  const isComplete = frame >= actionTimeline.complete;
                  const isActive = frame >= actionTimeline.active && frame < actionTimeline.complete;
                  
                  return (
                    <div
                      key={i}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: `3px solid ${isComplete ? colors.accent : colors.ink}40`,
                        backgroundColor: isComplete ? colors.accent : isActive ? `${colors.accent}40` : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: isActive ? `scale(${energyPulse})` : 'scale(1)',
                        boxShadow: isComplete ? `0 0 30px ${colors.accent}` : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isComplete && (
                        <span style={{ fontSize: 20 }}>✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SCENARIO - Mission briefing style */}
            {frame >= timeline.scenario.start && scene.fill?.texts?.scenario && (
              <div
                style={{
                  marginTop: 100,
                  opacity: interpolate(
                    frame,
                    [timeline.scenario.start, timeline.scenario.start + 30],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  ),
                  transform: `
                    translateY(${interpolate(
                      frame,
                      [timeline.scenario.start, timeline.scenario.start + 40],
                      [-50, 0],
                      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                    )}px)
                    scale(${interpolate(
                      frame,
                      [timeline.scenario.start, timeline.scenario.start + 30],
                      [0.9, 1],
                      { easing: Easing.elastic(1.1), extrapolateRight: 'clamp' }
                    )})
                  `,
                }}
              >
                <GlassmorphicPane
                  padding={45}
                  borderOpacity={0.5}
                  glowOpacity={0.25}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                    {/* LOTTIE - Target/mission icon */}
                    {frame >= timeline.scenarioLottie.start && (
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          flexShrink: 0,
                        }}
                      >
                        <RemotionLottie
                          animation={lottieAnimations.thinking}
                          loop
                          autoplay
                        />
                      </div>
                    )}

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 20,
                          color: colors.support,
                          textTransform: 'uppercase',
                          letterSpacing: '2px',
                          marginBottom: 15,
                        }}
                      >
                        📋 SITUATION ANALYSIS
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
                    </div>
                  </div>
                </GlassmorphicPane>
              </div>
            )}

            {/* ACTIONS - Sequential unlock mechanic */}
            <div
              style={{
                marginTop: 60,
                display: 'flex',
                flexDirection: 'column',
                gap: 30,
              }}
            >
              {[1, 2, 3].map((num, index) => {
                const actionKey = `action${num}`;
                const actionText = scene.fill?.texts?.[actionKey];
                const actionTimeline = timeline.actions[index];
                const lottieTimeline = timeline.actionLotties[index];
                
                if (!actionText || frame < actionTimeline.lockStart) return null;

                // Lock/unlock animation
                const isLocked = frame < actionTimeline.unlockStart;
                const isUnlocking = frame >= actionTimeline.unlockStart && frame < actionTimeline.unlockEnd;
                const isActive = frame >= actionTimeline.active && frame < actionTimeline.complete;
                const isComplete = frame >= actionTimeline.complete;

                const unlockProgress = interpolate(
                  frame,
                  [actionTimeline.unlockStart, actionTimeline.unlockEnd],
                  [0, 1],
                  { easing: Easing.elastic(1.5), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );

                // Progress bar for active action
                const progress = isActive
                  ? interpolate(
                      frame,
                      [actionTimeline.progressStart, actionTimeline.progressEnd],
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
                      opacity: isLocked ? 0.3 : 1,
                      transform: `
                        scale(${isUnlocking ? 0.95 + unlockProgress * 0.1 : 1})
                        translateX(${isLocked ? -20 : 0}px)
                      `,
                      filter: isLocked ? 'blur(2px)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <GlassmorphicPane
                      padding={35}
                      borderOpacity={isComplete ? 0.6 : 0.35}
                      glowOpacity={isActive ? 0.3 : 0.15}
                      backgroundColor={isComplete ? 'rgba(39, 174, 96, 0.15)' : 'rgba(255, 255, 255, 0.08)'}
                    >
                      <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
                          {/* Lock/unlock indicator with LOTTIE burst */}
                          <div
                            style={{
                              position: 'relative',
                              width: 70,
                              height: 70,
                              flexShrink: 0,
                            }}
                          >
                            {/* LOTTIE burst on unlock */}
                            {frame >= lottieTimeline.burst && frame < lottieTimeline.burst + 40 && (
                              <AbsoluteFill
                                style={{
                                  transform: 'scale(2)',
                                  opacity: interpolate(
                                    frame,
                                    [lottieTimeline.burst, lottieTimeline.burst + 40],
                                    [1, 0],
                                    { extrapolateRight: 'clamp' }
                                  ),
                                }}
                              >
                                <RemotionLottie
                                  animation={lottieAnimations.confetti}
                                  loop={false}
                                  autoplay
                                />
                              </AbsoluteFill>
                            )}

                            <div
                              style={{
                                width: 70,
                                height: 70,
                                borderRadius: '50%',
                                background: isComplete
                                  ? `linear-gradient(135deg, ${colors.accent}, ${colors.support})`
                                  : isLocked
                                  ? `linear-gradient(135deg, ${colors.ink}40, ${colors.ink}20)`
                                  : `linear-gradient(135deg, ${colors.accent}80, ${colors.support}80)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isComplete ? `0 0 40px ${colors.accent}` : isActive ? `0 0 30px ${colors.accent}60` : 'none',
                                transform: isActive ? `scale(${energyPulse})` : 'scale(1)',
                              }}
                            >
                              <span style={{ fontSize: 32 }}>
                                {isLocked ? '🔒' : isComplete ? '✓' : '→'}
                              </span>
                            </div>
                          </div>

                          {/* LOTTIE animation for action */}
                          {frame >= lottieTimeline.start && !isLocked && (
                            <div
                              style={{
                                width: 60,
                                height: 60,
                                flexShrink: 0,
                              }}
                            >
                              <RemotionLottie
                                animation={index === 0 ? lottieAnimations.rocket : index === 1 ? lottieAnimations.star : lottieAnimations.checkmark}
                                loop
                                autoplay
                              />
                            </div>
                          )}

                          {/* Action text */}
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontFamily: 'monospace',
                                fontSize: 18,
                                color: isComplete ? colors.accent : colors.support,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: 10,
                              }}
                            >
                              ACTION {num} {isComplete ? '- COMPLETE' : isActive ? '- IN PROGRESS' : isLocked ? '- LOCKED' : '- READY'}
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

                        {/* Progress bar for active action */}
                        {isActive && (
                          <div
                            style={{
                              marginTop: 20,
                              height: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: 4,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${colors.accent}, ${colors.support})`,
                                boxShadow: `0 0 20px ${colors.accent}`,
                                transition: 'width 0.1s linear',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </GlassmorphicPane>
                  </div>
                );
              })}
            </div>

            {/* RESULT - Level complete screen */}
            {frame >= timeline.result.start && scene.fill?.texts?.result && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 60,
                  left: 90,
                  right: 90,
                  opacity: interpolate(
                    frame,
                    [timeline.result.start, timeline.result.start + 40],
                    [0, 1],
                    { extrapolateRight: 'clamp' }
                  ),
                  transform: `
                    scale(${interpolate(
                      frame,
                      [timeline.result.start, timeline.result.start + 40],
                      [0.7, 1],
                      { easing: Easing.elastic(1.3), extrapolateRight: 'clamp' }
                    )})
                  `,
                }}
              >
                {/* LOTTIE - Achievement unlocked */}
                {frame >= timeline.resultLottie.start && (
                  <AbsoluteFill
                    style={{
                      opacity: 0.5,
                      transform: 'scale(3)',
                      pointerEvents: 'none',
                    }}
                  >
                    <div style={{ width: '100%', height: '100%' }}>
                      <RemotionLottie
                        animation={lottieAnimations.trophy}
                        loop={false}
                        autoplay
                      />
                    </div>
                  </AbsoluteFill>
                )}

                <GlassmorphicPane
                  padding={50}
                  borderOpacity={0.7}
                  glowOpacity={0.4}
                  backgroundColor="rgba(39, 174, 96, 0.2)"
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: 28,
                        color: colors.accent,
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        marginBottom: 20,
                        textShadow: `0 0 30px ${colors.accent}`,
                      }}
                    >
                      ★ MISSION COMPLETE ★
                    </div>
                    <div
                      style={{
                        fontFamily: fonts.body.family,
                        fontSize: fonts.body.size * 1.15,
                        fontWeight: 700,
                        color: colors.highlight,
                        lineHeight: 1.4,
                        textShadow: `0 4px 40px ${colors.highlight}90`,
                      }}
                    >
                      {scene.fill.texts.result}
                    </div>

                    {/* Achievement badges */}
                    {frame >= timeline.achievement.start && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 20,
                          marginTop: 30,
                          opacity: interpolate(
                            frame,
                            [timeline.achievement.start, timeline.achievement.start + 30],
                            [0, 1],
                            { extrapolateRight: 'clamp' }
                          ),
                        }}
                      >
                        {['🏆', '⭐', '🎯'].map((icon, i) => (
                          <div
                            key={i}
                            style={{
                              fontSize: 40,
                              transform: `scale(${interpolate(
                                frame,
                                [timeline.achievement.start + i * 5, timeline.achievement.start + i * 5 + 20],
                                [0, 1],
                                { easing: Easing.elastic(2), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                              )})`,
                            }}
                          >
                            {icon}
                          </div>
                        ))}
                      </div>
                    )}
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
