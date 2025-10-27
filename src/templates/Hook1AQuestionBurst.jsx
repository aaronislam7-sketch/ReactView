import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import gsap from 'gsap';
import {
  drawUnderline,
  pulseEmphasis,
  gracefulMove,
  cascadeReveal,
} from '../utils/gsapAnimations';

/**
 * HOOK 1A: QUESTION BURST (TED-ED Style V4)
 * 
 * PRODUCTION-READY FEATURES:
 * - ✅ Zero wobble (roughness/bowing = 0)
 * - ✅ GSAP animations for world-class aesthetics
 * - ✅ TED-ED style pacing and impact
 * - ✅ Animated map (NO emojis)
 * - ✅ Compelling hook that builds curiosity
 * - ✅ Permanent Marker font for brand energy
 * - ✅ Subtle breathe animations (1-3% scale)
 * - ✅ Bold accent colors (oranges/purples)
 * 
 * Animation Flow:
 * 1. Title fades in with dramatic pause
 * 2. Question Part 1 appears with emphasis
 * 3. Brief pause for impact
 * 4. Question Part 2 lands with weight
 * 5. Animated map draws in (stylized landmass)
 * 6. "Welcome to Knodovia" appears with intrigue
 * 7. Subtitle teases the journey ahead
 * 8. Gentle breathe animation on key elements
 * 
 * Intent: Create "ooo what is Knodovia?" feeling - pure curiosity
 * Duration: 12-18s (punchy, focused)
 */

const Hook1AQuestionBurst = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const mapSvgRef = useRef(null);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const welcomeRef = useRef(null);
  const subtitleRef = useRef(null);
  const mapContainerRef = useRef(null);
  
  // Track which animations have been triggered
  const [triggeredAnimations, setTriggeredAnimations] = useState({
    questionPart1: false,
    questionPart2: false,
    mapReveal: false,
    welcome: false,
    subtitle: false,
    breathe: false,
  });

  // Expanded style tokens with defaults
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FFF9F0',
    accent: '#FF6B35',      // Bold orange
    accent2: '#9B59B6',     // Bold purple
    ink: '#1A1A1A',
  };
  
  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary, // Permanent Marker
    secondary: THEME.fonts.structure.primary,
    size_title: 76,
    size_question: 92,
    size_welcome: 68,
    size_subtitle: 32,
  };
  
  const motion = style.motion || {
    timing: 'medium',
    easing: 'power3',
  };
  
  const spacing = style.spacing || {
    padding: 120,
    gap: 30,
  };

  const texts = scene.fill?.texts || {};

  // Beat timing - IMPROVED PACING (more dramatic, TED-ED style)
  const BEAT = 30; // 1 second at 30fps
  const beats = {
    prelude: 0,
    questionPart1: BEAT * 0.8,      // 0.8s - Quick intro
    pause1: BEAT * 2.2,              // 2.2s - Let it land
    questionPart2: BEAT * 2.5,       // 2.5s - Second part
    pause2: BEAT * 4.5,              // 4.5s - Build tension
    mapReveal: BEAT * 5,             // 5s - Map draws in
    welcome: BEAT * 7.5,             // 7.5s - THE HOOK
    subtitle: BEAT * 9.5,            // 9.5s - Tease the journey
    breathe: BEAT * 11,              // 11s - Settle with subtle movement
    settle: BEAT * 12,               // 12s - Hold
  };

  // Subtle camera breathe (no zoom, just gentle drift)
  const cameraDrift = {
    x: Math.sin(frame * 0.008) * 2,
    y: Math.cos(frame * 0.006) * 1.5,
  };

  // ========================================
  // GSAP ANIMATION TRIGGERS
  // ========================================
  
  // Question Part 1 - Strong entrance
  useEffect(() => {
    if (frame >= beats.questionPart1 && !triggeredAnimations.questionPart1 && textRef1.current) {
      gsap.fromTo(textRef1.current,
        {
          opacity: 0,
          y: -30,
          scale: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.0,
          ease: "power3.out",
        }
      );
      setTriggeredAnimations(prev => ({ ...prev, questionPart1: true }));
    }
  }, [frame, beats.questionPart1, triggeredAnimations.questionPart1]);

  // Question Part 2 - Lands with emphasis
  useEffect(() => {
    if (frame >= beats.questionPart2 && !triggeredAnimations.questionPart2 && textRef2.current) {
      gsap.fromTo(textRef2.current,
        {
          opacity: 0,
          y: -40,
          scale: 0.90,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
        }
      );
      setTriggeredAnimations(prev => ({ ...prev, questionPart2: true }));
    }
  }, [frame, beats.questionPart2, triggeredAnimations.questionPart2]);

  // Map reveal - Draw in animation
  useEffect(() => {
    if (frame >= beats.mapReveal && !triggeredAnimations.mapReveal && mapContainerRef.current) {
      gsap.fromTo(mapContainerRef.current,
        {
          opacity: 0,
          scale: 0.85,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
        }
      );
      setTriggeredAnimations(prev => ({ ...prev, mapReveal: true }));
    }
  }, [frame, beats.mapReveal, triggeredAnimations.mapReveal]);

  // Welcome - THE HOOK MOMENT
  useEffect(() => {
    if (frame >= beats.welcome && !triggeredAnimations.welcome && welcomeRef.current) {
      gsap.fromTo(welcomeRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.3,
          ease: "back.out(1.3)",
        }
      );
      setTriggeredAnimations(prev => ({ ...prev, welcome: true }));
    }
  }, [frame, beats.welcome, triggeredAnimations.welcome]);

  // Subtitle - Teaser
  useEffect(() => {
    if (frame >= beats.subtitle && !triggeredAnimations.subtitle && subtitleRef.current) {
      gsap.fromTo(subtitleRef.current,
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
        }
      );
      setTriggeredAnimations(prev => ({ ...prev, subtitle: true }));
    }
  }, [frame, beats.subtitle, triggeredAnimations.subtitle]);

  // Breathe animation - Subtle 1-3% scale on settle
  useEffect(() => {
    if (frame >= beats.breathe && !triggeredAnimations.breathe) {
      // Breathe on welcome text
      if (welcomeRef.current) {
        gsap.to(welcomeRef.current, {
          scale: 1.02,
          duration: 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
      setTriggeredAnimations(prev => ({ ...prev, breathe: true }));
    }
  }, [frame, beats.breathe, triggeredAnimations.breathe]);

  // Animated Map SVG using rough.js - ZERO WOBBLE
  useEffect(() => {
    if (!mapSvgRef.current || frame < beats.mapReveal) return;

    const svg = mapSvgRef.current;
    const rc = rough.svg(svg);

    // Clear previous
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const progress = Math.min((frame - beats.mapReveal) / 50, 1);

    // Stylized landmass/island shape (creative, not emoji)
    // Main island body
    const islandPath = `
      M 200 180 
      Q 180 120 220 100
      Q 270 80 320 100
      Q 360 90 380 120
      Q 420 110 440 140
      Q 460 170 440 210
      Q 430 250 400 270
      Q 360 290 320 280
      Q 280 290 240 270
      Q 200 250 190 220
      Q 180 200 200 180 Z
    `;

    const island = rc.path(islandPath, {
      stroke: colors.accent,
      strokeWidth: 6,
      roughness: 0,  // ZERO WOBBLE
      bowing: 0,     // ZERO WOBBLE
      fill: `${colors.accent}15`,
      fillStyle: 'hachure',
      hachureGap: 8,
      hachureAngle: 45,
    });

    // Animate stroke drawing
    const paths = island.querySelectorAll('path');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length * (1 - progress);
    });

    svg.appendChild(island);

    // Small islands/details (if progress is far enough)
    if (progress > 0.5) {
      const detailProgress = (progress - 0.5) * 2;
      
      // Small island 1
      const small1 = rc.circle(150, 200, 40 * detailProgress, {
        stroke: colors.accent2,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent2}12`,
        fillStyle: 'solid',
      });
      svg.appendChild(small1);

      // Small island 2
      const small2 = rc.circle(480, 180, 30 * detailProgress, {
        stroke: colors.accent2,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent2}12`,
        fillStyle: 'solid',
      });
      svg.appendChild(small2);

      // Location markers (stylized dots)
      if (detailProgress > 0.6) {
        const markerProgress = (detailProgress - 0.6) / 0.4;
        
        [[260, 160], [340, 200], [380, 240]].forEach(([x, y], i) => {
          const delay = i * 0.2;
          if (markerProgress > delay) {
            const locProgress = Math.min((markerProgress - delay) / 0.3, 1);
            
            // Pin-like marker
            const markerPath = `M ${x} ${y} L ${x} ${y + 20 * locProgress}`;
            const marker = rc.path(markerPath, {
              stroke: colors.ink,
              strokeWidth: 5,
              roughness: 0,
              bowing: 0,
            });
            svg.appendChild(marker);

            // Pin head
            const pinHead = rc.circle(x, y, 12 * locProgress, {
              stroke: colors.accent,
              strokeWidth: 3,
              roughness: 0,
              bowing: 0,
              fill: colors.accent,
              fillStyle: 'solid',
            });
            svg.appendChild(pinHead);
          }
        });
      }
    }

  }, [frame, beats.mapReveal, colors]);

  // Decorative elements - MINIMAL, purposeful
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    // Clear previous
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Subtle accent lines (only if needed for composition)
    if (frame >= beats.pause2 && frame < beats.mapReveal) {
      const progress = Math.min((frame - beats.pause2) / 15, 1);
      
      // Horizontal accent line under question
      const accentLine = rc.line(400, 500, 400 + 1120 * progress, 500, {
        stroke: `${colors.accent}30`,
        strokeWidth: 3,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(accentLine);
    }

  }, [frame, beats, colors]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, ${colors.accent}03 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, ${colors.accent2}03 0%, transparent 55%)
        `,
      }}
    >
      {/* Decorative layer */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          transform: `translate(${cameraDrift.x}px, ${cameraDrift.y}px)`,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Content layer */}
      <AbsoluteFill
        style={{
          transform: `translate(${cameraDrift.x}px, ${cameraDrift.y}px)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: `${spacing.padding}px`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Question Part 1 */}
          {frame >= beats.questionPart1 && (
            <div
              style={{
                textAlign: 'center',
                marginBottom: spacing.gap,
              }}
            >
              <h1
                ref={textRef1}
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_title,
                  fontWeight: 400,
                  color: colors.ink,
                  lineHeight: 1.1,
                  margin: 0,
                  opacity: 0, // Will be animated by GSAP
                }}
              >
                {texts.questionPart1 || 'What if geography'}
              </h1>
            </div>
          )}

          {/* Question Part 2 - THE KEY HOOK */}
          {frame >= beats.questionPart2 && (
            <div
              style={{
                textAlign: 'center',
                marginBottom: spacing.gap * 2,
              }}
            >
              <h1
                ref={textRef2}
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_question,
                  fontWeight: 400,
                  color: colors.accent,
                  lineHeight: 1.1,
                  margin: 0,
                  opacity: 0, // Will be animated by GSAP
                }}
              >
                {texts.questionPart2 || 'was measured in mindsets?'}
              </h1>
            </div>
          )}

          {/* Animated Map Container */}
          {frame >= beats.mapReveal && (
            <div
              ref={mapContainerRef}
              style={{
                position: 'relative',
                width: 640,
                height: 400,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0, // Will be animated by GSAP
              }}
            >
              <svg
                ref={mapSvgRef}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                viewBox="0 0 640 400"
                preserveAspectRatio="xMidYMid meet"
              />
            </div>
          )}

          {/* Welcome to Knodovia - THE HOOK */}
          {frame >= beats.welcome && (
            <div
              ref={welcomeRef}
              style={{
                textAlign: 'center',
                marginTop: spacing.gap * 2,
                opacity: 0, // Will be animated by GSAP
              }}
            >
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_welcome,
                  fontWeight: 400,
                  color: colors.accent2,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {texts.welcome || 'Welcome to Knodovia'}
              </h2>
            </div>
          )}

          {/* Subtitle - Teaser */}
          {frame >= beats.subtitle && (
            <div
              ref={subtitleRef}
              style={{
                textAlign: 'center',
                marginTop: spacing.gap,
                maxWidth: 800,
                opacity: 0, // Will be animated by GSAP
              }}
            >
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: fonts.size_subtitle,
                  color: `${colors.ink}80`,
                  margin: 0,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                {texts.subtitle || 'A place where your perspective shapes the landscape...'}
              </p>
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* Settle fade */}
      {frame >= beats.settle && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: colors.bg,
            opacity: interpolate(
              frame,
              [beats.settle, beats.settle + 30],
              [0, 0.15],
              { extrapolateRight: 'clamp' }
            ),
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export { Hook1AQuestionBurst };
export const HOOK_1A_DURATION_MIN = 12 * 30;
export const HOOK_1A_DURATION_MAX = 18 * 30;
export const HOOK_1A_EXIT_TRANSITION = 15;
