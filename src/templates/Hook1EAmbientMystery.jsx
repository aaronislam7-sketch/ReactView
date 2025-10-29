import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import rough from 'roughjs/bundled/rough.esm.js';
// import gsap from 'gsap';
import {
  scrambleText,
  glowPulse,
  gracefulMove,
  cascadeReveal,
} from '../utils/gsapAnimations';

/**
 * HOOK 1E: AMBIENT MYSTERY (GSAP V2)
 * 
 * Intent: Build intrigue through subtle atmospheric question
 * Pattern: "In the shadows of..." / "Hidden beneath..."
 * Visual: Fog particles, whisper text, dim spotlight, mysterious
 * Tone: Mysterious, Intriguing
 * Duration: 12-18s
 * 
 * GSAP Features:
 * - Scramble text reveal for question
 * - Glow pulse on mysterious elements
 * - Mid-scene: Whisper text moves to corner
 * - Hint cascades in late
 * 
 * NO BOXES - Fog layers, wispy sketches, atmospheric depth
 */

const Hook1EAmbientMystery = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const whisperRef = useRef(null);
  const questionRef = useRef(null);
  const hintRef = useRef(null);
  const glowRef1 = useRef(null);
  const glowRef2 = useRef(null);
  
  const [triggeredAnimations, setTriggeredAnimations] = useState({
    whisper: false,
    question: false,
    glow1: false,
    glow2: false,
    moveWhisper: false,
    hintCascade: false,
  });

  const colors = scene.style_tokens?.colors || {
    bg: '#1A1F2E',
    fog: '#4A5568',
    accent: '#8E44AD',
    accent2: '#6C7A89',
    ink: '#E8F4FD',
    spotlight: '#F39C12',
  };
  
  const fonts = scene.style_tokens?.fonts || {
    primary: "'Cabin Sketch', cursive",
    secondary: "'Patrick Hand', cursive",
    size_whisper: 42,
    size_question: 78,
    size_hint: 32,
  };

  const texts = scene.fill?.texts || {};

  // Beat timing - slow, mysterious reveal
  const BEAT = 42; // 1.4s - slower for mystery
  const beats = {
    prelude: 0,
    fogIn: BEAT * 0.5,
    spotlight: BEAT * 1.5,
    whisperText: BEAT * 2.5,
    questionReveal: BEAT * 4,
    glow1: BEAT * 5,
    glow2: BEAT * 5.5,
    wisps: BEAT * 5.5,
    moveWhisper: BEAT * 7,      // NEW: Mid-scene
    hintCascade: BEAT * 8,       // NEW: Late reveal
    accentGlow: BEAT * 7,
    settle: BEAT * 9,
  };

  // Camera - slow push in
  const cameraZoom = interpolate(
    frame,
    [0, beats.spotlight, beats.settle],
    [1.08, 1.0, 1.02],
    { easing: Easing.bezier(0.3, 0, 0.2, 1), extrapolateRight: 'clamp' }
  );

  // Vignette intensity
  const vignetteOpacity = interpolate(
    frame,
    [0, beats.fogIn, beats.spotlight, beats.settle],
    [0.9, 0.7, 0.5, 0.6],
    { extrapolateRight: 'clamp' }
  );

  // ========================================
  // GSAP ANIMATION TRIGGERS
  // ========================================
  
  // Whisper text - fade in
  useEffect(() => {
    if (frame >= beats.whisperText && !triggeredAnimations.whisper && whisperRef.current) {
      gsap.fromTo(whisperRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 0.95, y: 0, scale: 1, duration: 1.4, ease: "power2.out" }
      );
      setTriggeredAnimations(prev => ({ ...prev, whisper: true }));
    }
  }, [frame, beats.whisperText, triggeredAnimations.whisper]);

  // Question scramble reveal
  useEffect(() => {
    if (frame >= beats.questionReveal && !triggeredAnimations.question && questionRef.current) {
      // First fade in container
      gsap.fromTo(questionRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power2.out" }
      );
      
      // Then scramble the text
      const h1 = questionRef.current.querySelector('h1');
      if (h1) {
        const finalText = texts.question || 'What lies beneath the surface?';
        h1.textContent = finalText.split('').map(() => '?').join('');
        
        setTimeout(() => {
          scrambleText(h1, finalText, {
            duration: 1.5,
            chars: "?!@#$%&*~",
          });
        }, 400);
      }
      
      setTriggeredAnimations(prev => ({ ...prev, question: true }));
    }
  }, [frame, beats.questionReveal, triggeredAnimations.question, texts.question]);

  // Glow pulse 1
  useEffect(() => {
    if (frame >= beats.glow1 && !triggeredAnimations.glow1 && glowRef1.current) {
      glowPulse(glowRef1.current, {
        color: colors.accent,
        intensity: 30,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
      });
      setTriggeredAnimations(prev => ({ ...prev, glow1: true }));
    }
  }, [frame, beats.glow1, triggeredAnimations.glow1, colors.accent]);

  // Glow pulse 2
  useEffect(() => {
    if (frame >= beats.glow2 && !triggeredAnimations.glow2 && glowRef2.current) {
      glowPulse(glowRef2.current, {
        color: colors.spotlight,
        intensity: 25,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
      });
      setTriggeredAnimations(prev => ({ ...prev, glow2: true }));
    }
  }, [frame, beats.glow2, triggeredAnimations.glow2, colors.spotlight]);

  // MID-SCENE: Move whisper to corner
  useEffect(() => {
    if (frame >= beats.moveWhisper && !triggeredAnimations.moveWhisper && whisperRef.current) {
      gracefulMove(whisperRef.current, {
        y: -180,
        scale: 0.6,
        duration: 1.5,
        ease: "power3.inOut",
      });
      setTriggeredAnimations(prev => ({ ...prev, moveWhisper: true }));
    }
  }, [frame, beats.moveWhisper, triggeredAnimations.moveWhisper]);

  // Hint cascade
  useEffect(() => {
    if (frame >= beats.hintCascade && !triggeredAnimations.hintCascade && hintRef.current) {
      cascadeReveal([hintRef.current], {
        duration: 0.8,
        ease: "power2.out",
      });
      setTriggeredAnimations(prev => ({ ...prev, hintCascade: true }));
    }
  }, [frame, beats.hintCascade, triggeredAnimations.hintCascade]);

  // Generate rough.js fog wisps and mysterious elements
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    // Clear previous sketches
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Wispy fog clouds (sketchy, organic) - ZERO WOBBLE
    if (frame >= beats.fogIn) {
      const fogClouds = [
        { x: 300, y: 200, w: 400, h: 180, delay: 0, opacity: 0.15 },
        { x: 1400, y: 300, w: 350, h: 160, delay: 20, opacity: 0.12 },
        { x: 200, y: 700, w: 450, h: 200, delay: 15, opacity: 0.18 },
        { x: 1300, y: 750, w: 380, h: 170, delay: 25, opacity: 0.14 },
      ];

      fogClouds.forEach((cloud) => {
        if (frame < beats.fogIn + cloud.delay) return;
        
        const progress = Math.min((frame - beats.fogIn - cloud.delay) / 80, 1);
        const drift = Math.sin((frame - cloud.delay) * 0.008) * 30;

        const cloudShape = rc.ellipse(
          cloud.x + drift,
          cloud.y + Math.cos((frame - cloud.delay) * 0.006) * 20,
          cloud.w * progress,
          cloud.h * progress,
          {
            stroke: 'none',
            fill: `${colors.fog}`,
            fillStyle: 'solid',
            roughness: 0,  // ZERO WOBBLE
            bowing: 0,     // ZERO WOBBLE
          }
        );
        
        cloudShape.style.opacity = cloud.opacity * progress;
        cloudShape.style.filter = 'blur(40px)';
        svg.appendChild(cloudShape);
      });
    }

    // Spotlight circle (rough sketch, subtle) - ZERO WOBBLE
    if (frame >= beats.spotlight) {
      const progress = Math.min((frame - beats.spotlight) / 60, 1);
      
      const spotlight = rc.circle(960, 540, 650 * progress, {
        stroke: `${colors.spotlight}40`,
        strokeWidth: 4,
        roughness: 0,  // ZERO WOBBLE
        bowing: 0,     // ZERO WOBBLE
        fill: 'none',
      });
      
      spotlight.style.filter = 'blur(8px)';
      spotlight.style.opacity = 0.4 * progress;
      svg.appendChild(spotlight);
    }

    // Mysterious wispy lines (floating) - ZERO WOBBLE
    if (frame >= beats.wisps) {
      const wisps = [
        { x1: 400, y1: 350, x2: 550, y2: 320, delay: 0 },
        { x1: 1400, y1: 600, x2: 1520, y2: 650, delay: 10 },
        { x1: 600, y1: 750, x2: 480, y2: 800, delay: 15 },
      ];

      wisps.forEach((wisp, i) => {
        if (frame < beats.wisps + wisp.delay) return;
        
        const progress = Math.min((frame - beats.wisps - wisp.delay) / 35, 1);
        const phase = (frame + i * 50) * 0.01;
        const drift = Math.sin(phase) * 15;

        const line = rc.line(
          wisp.x1 + drift,
          wisp.y1,
          wisp.x1 + (wisp.x2 - wisp.x1) * progress + drift,
          wisp.y1 + (wisp.y2 - wisp.y1) * progress,
          {
            stroke: `${colors.accent}60`,
            strokeWidth: 3,
            roughness: 0,  // ZERO WOBBLE
            bowing: 0,     // ZERO WOBBLE
          }
        );
        
        line.style.opacity = 0.5 * progress;
        svg.appendChild(line);
      });
    }

    // Accent glow circles (mysterious depth) - ZERO WOBBLE
    if (frame >= beats.accentGlow) {
      const glows = [
        { x: 480, y: 540, r: 120, delay: 0 },
        { x: 1440, y: 540, r: 100, delay: 12 },
      ];

      glows.forEach((glow, i) => {
        if (frame < beats.accentGlow + glow.delay) return;
        
        const progress = Math.min((frame - beats.accentGlow - glow.delay) / 50, 1);
        const pulse = 1 + Math.sin((frame - glow.delay) * 0.06) * 0.08;

        const glowCircle = rc.circle(glow.x, glow.y, glow.r * pulse * progress, {
          stroke: 'none',
          fill: `${colors.accent}`,
          fillStyle: 'solid',
          roughness: 0,  // ZERO WOBBLE
          bowing: 0,     // ZERO WOBBLE
        });
        
        glowCircle.style.opacity = 0.15 * progress;
        glowCircle.style.filter = 'blur(50px)';
        svg.appendChild(glowCircle);
      });
    }

  }, [frame, beats, colors]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 50% 50%, ${colors.spotlight}08 0%, transparent 50%)
        `,
      }}
    >
      {/* Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 30%, ${colors.bg} 100%)`,
          opacity: vignetteOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Rough.js sketch layer - fog, wisps, glows */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          transform: `scale(${cameraZoom})`,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Content layer */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom})`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '140px 200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Whisper text (above question) */}
          {frame >= beats.whisperText && texts.whisper && (
            <div
              ref={whisperRef}
              style={{
                marginBottom: 60,
                opacity: 0, // Will be animated by GSAP
              }}
            >
              <p
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_whisper,
                  color: `${colors.ink}50`,
                  margin: 0,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  letterSpacing: '2px',
                }}
              >
                {texts.whisper}
              </p>
            </div>
          )}

          {/* Main question - mysterious scramble reveal */}
          {frame >= beats.questionReveal && (
            <div
              ref={questionRef}
              style={{
                position: 'relative',
                textAlign: 'center',
                opacity: 0, // Will be animated by GSAP
              }}
            >
              <h1
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_question,
                  fontWeight: 700,
                  color: colors.ink,
                  lineHeight: 1.2,
                  margin: 0,
                  letterSpacing: '1px',
                  textShadow: `0 0 40px ${colors.accent}40, 0 0 80px ${colors.accent}20`,
                }}
              >
                {texts.question || 'What lies beneath the surface?'}
              </h1>

              {/* Subtle underline glow (rough sketch) */}
              {frame >= beats.questionReveal + 40 && (
                <div
                  style={{
                    marginTop: 30,
                    opacity: interpolate(
                      frame,
                      [beats.questionReveal + 40, beats.questionReveal + 80],
                      [0, 0.6],
                      { extrapolateRight: 'clamp' }
                    ),
                  }}
                >
                  <div
                    style={{
                      width: 380,
                      height: 4,
                      margin: '0 auto',
                      background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
                      borderRadius: 2,
                      filter: 'blur(3px)',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Floating mystery particles with glow */}
          {frame >= beats.prelude && (
            <>
              {[...Array(24)].map((_, i) => {
                const seed = i * 151;
                const baseY = 100 + (i % 6) * 160;
                const baseX = 150 + (i % 4) * 520;
                const phase = (frame + seed) * 0.008;
                const driftY = Math.sin(phase) * 40;
                const driftX = Math.cos(phase * 0.6) * 30;
                const size = 6 + (i % 3) * 4;
                
                const opacity = interpolate(
                  frame,
                  [beats.prelude + i * 6, beats.prelude + i * 6 + 60],
                  [0, 0.25],
                  { extrapolateRight: 'clamp' }
                );
                
                const isGlowParticle = (i === 8 || i === 15);

                return (
                  <div
                    key={i}
                    ref={i === 8 ? glowRef1 : i === 15 ? glowRef2 : null}
                    style={{
                      position: 'absolute',
                      left: baseX + driftX,
                      top: baseY + driftY,
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      backgroundColor: i % 3 === 0 ? colors.spotlight : colors.accent,
                      opacity,
                      filter: 'blur(2px)',
                      boxShadow: `0 0 20px ${i % 3 === 0 ? colors.spotlight : colors.accent}60`,
                    }}
                  />
                );
              })}
            </>
          )}

          {/* Hint text - late cascade reveal */}
          {frame >= beats.hintCascade && texts.hint && (
            <div
              ref={hintRef}
              style={{
                position: 'absolute',
                bottom: 120,
                opacity: 0, // Will be animated by GSAP
              }}
            >
              <p
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_hint,
                  color: `${colors.ink}60`,
                  margin: 0,
                  fontStyle: 'italic',
                  textAlign: 'center',
                }}
              >
                {texts.hint}
              </p>
            </div>
          )}

          {/* Breathing atmosphere - slow pulse */}
          {frame >= beats.spotlight && frame < beats.settle && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `scale(${1 + Math.sin(frame * 0.04) * 0.008})`,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </AbsoluteFill>

      {/* Final settle fade */}
      {frame >= beats.settle && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: colors.bg,
            opacity: interpolate(
              frame,
              [beats.settle, beats.settle + 50],
              [0, 0.15],
              { extrapolateRight: 'clamp' }
            ),
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export { Hook1EAmbientMystery };
export const HOOK_1E_DURATION_MIN = 12 * 30; // 12s
export const HOOK_1E_DURATION_MAX = 18 * 30; // 18s
export const HOOK_1E_EXIT_TRANSITION = 15;
