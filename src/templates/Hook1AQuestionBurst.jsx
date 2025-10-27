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
 * HOOK 1A: QUESTION BURST (CONVERSATIONAL V6)
 * 
 * CONVERSATIONAL FEATURES:
 * - ✅ Bold mid-scene GSAP transitions - things MOVE!
 * - ✅ Conversational flow - elements exit when done
 * - ✅ Headers use Cabin Sketch font (sketchy, hand-drawn style)
 * - ✅ Permanent Marker for body/secondary text
 * - ✅ Clean stage - only show what's needed NOW
 * - ✅ Graceful wipes/exits via GSAP
 * - ✅ Animated map (NO emojis)
 * - ✅ Zero wobble on structure
 * - ✅ NO boxes/underlines (clean motion focus)
 * 
 * Typography Hierarchy:
 * - Headers: Cabin Sketch font on HTML (sketchy, hand-drawn)
 * - Body/Secondary: Permanent Marker - energy and personality
 * - Supporting: Inter - clean readability
 * 
 * How Headers Work:
 * - HTML elements with Cabin Sketch font (gives sketchy look)
 * - GSAP animates these HTML elements (not SVG)
 * - This keeps motion working while achieving sketchy style
 * 
 * Conversational Flow:
 * 1. "What if geography" appears (Cabin Sketch)
 * 2. It moves up slightly, making room
 * 3. "was measured in mindsets?" appears below (Cabin Sketch)
 * 4. Both pulse for emphasis
 * 5. WIPE: Questions gracefully exit stage left
 * 6. Map draws in center with energy
 * 7. TRANSFORM: Map shrinks to corner
 * 8. "Welcome to Knodovia" takes center stage (Cabin Sketch - THE HOOK)
 * 9. Subtitle fades in below (Permanent Marker)
 * 10. Breathe on welcome text
 * 
 * Intent: Conversational, dynamic, TED-ED quality
 * Duration: 15-18s
 */

const Hook1AQuestionBurst = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const mapSvgRef = useRef(null);
  const roughTextSvgRef = useRef(null);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const questionContainerRef = useRef(null);
  const welcomeRef = useRef(null);
  const subtitleRef = useRef(null);
  const mapContainerRef = useRef(null);
  
  // Track which animations have been triggered
  const [triggeredAnimations, setTriggeredAnimations] = useState({
    questionPart1: false,
    questionPart2: false,
    moveUp: false,
    pulse: false,
    wipeQuestions: false,
    mapReveal: false,
    transformMap: false,
    welcome: false,
    subtitle: false,
    breathe: false,
  });

  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FFF9F0',
    accent: '#FF6B35',      // Bold orange
    accent2: '#9B59B6',     // Bold purple
    ink: '#1A1A1A',
  };
  
  const fonts = style.fonts || {
    header: "'Cabin Sketch', cursive",    // Rough.js headers (sketchy style)
    secondary: THEME.fonts.marker.primary, // Permanent Marker for body/secondary
    body: THEME.fonts.structure.primary,   // Inter for clean body text
    size_title: 76,
    size_question: 92,
    size_welcome: 72,
    size_subtitle: 32,
  };
  
  const spacing = style.spacing || {
    padding: 120,
    gap: 30,
  };

  const texts = scene.fill?.texts || {};

  // Beat timing - CONVERSATIONAL, DYNAMIC (with breathing room for motion)
  const BEAT = 30;
  const beats = {
    prelude: 0,
    questionPart1: BEAT * 0.6,       // 0.6s - Quick entrance
    moveUp: BEAT * 2.0,              // 2.0s - Make room (give time to land)
    questionPart2: BEAT * 2.8,       // 2.8s - Second part appears (after move completes)
    pulse: BEAT * 4.2,               // 4.2s - Pulse both (let question 2 breathe)
    wipeQuestions: BEAT * 5.5,       // 5.5s - EXIT questions (after pulse completes)
    mapReveal: BEAT * 6.5,           // 6.5s - Map draws in (clean stage first)
    transformMap: BEAT * 9.0,        // 9.0s - Map shrinks to corner (let map reveal complete)
    welcome: BEAT * 10.0,            // 10.0s - THE HOOK (after transform completes)
    subtitle: BEAT * 12.0,           // 12s - Tease (let welcome land)
    breathe: BEAT * 13.5,            // 13.5s - Settle with breathe
    settle: BEAT * 15,               // 15s - Hold
  };

  // Subtle camera drift
  const cameraDrift = {
    x: Math.sin(frame * 0.008) * 2,
    y: Math.cos(frame * 0.006) * 1.5,
  };

  // ========================================
  // GSAP ANIMATION TRIGGERS - CONVERSATIONAL!
  // ========================================
  
  // Question Part 1 - Bold entrance
  useEffect(() => {
    if (frame >= beats.questionPart1 && !triggeredAnimations.questionPart1 && textRef1.current) {
      gsap.fromTo(textRef1.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.7)",
        }
      );
      setTriggeredAnimations(prev => ({ ...prev, questionPart1: true }));
    }
  }, [frame, beats.questionPart1, triggeredAnimations.questionPart1]);

  // Move up to make room
  useEffect(() => {
    if (frame >= beats.moveUp && !triggeredAnimations.moveUp && textRef1.current) {
      gsap.to(textRef1.current, {
        y: -60,
        duration: 0.8,
        ease: "power2.inOut",
      });
      setTriggeredAnimations(prev => ({ ...prev, moveUp: true }));
    }
  }, [frame, beats.moveUp, triggeredAnimations.moveUp]);

  // Question Part 2 - Appears below
  useEffect(() => {
    if (frame >= beats.questionPart2 && !triggeredAnimations.questionPart2 && textRef2.current) {
      gsap.fromTo(textRef2.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.88,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.0,
          ease: "back.out(1.8)",
        }
      );
      setTriggeredAnimations(prev => ({ ...prev, questionPart2: true }));
    }
  }, [frame, beats.questionPart2, triggeredAnimations.questionPart2]);

  // Pulse both for emphasis
  useEffect(() => {
    if (frame >= beats.pulse && !triggeredAnimations.pulse) {
      if (questionContainerRef.current) {
        pulseEmphasis(questionContainerRef.current, {
          scale: 1.05,
          duration: 0.4,
          repeat: 1,
          yoyo: true,
        });
      }
      setTriggeredAnimations(prev => ({ ...prev, pulse: true }));
    }
  }, [frame, beats.pulse, triggeredAnimations.pulse]);

  // WIPE: Exit questions stage left (CONVERSATIONAL - clear the stage!)
  useEffect(() => {
    if (frame >= beats.wipeQuestions && !triggeredAnimations.wipeQuestions && questionContainerRef.current) {
      gsap.to(questionContainerRef.current, {
        x: -1200,
        opacity: 0,
        duration: 1.0,
        ease: "power3.in",
      });
      setTriggeredAnimations(prev => ({ ...prev, wipeQuestions: true }));
    }
  }, [frame, beats.wipeQuestions, triggeredAnimations.wipeQuestions]);

  // Map reveal - Bold entrance
  useEffect(() => {
    if (frame >= beats.mapReveal && !triggeredAnimations.mapReveal && mapContainerRef.current) {
      gsap.fromTo(mapContainerRef.current,
        {
          opacity: 0,
          scale: 0.7,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.3,
          ease: "back.out(1.5)",
        }
      );
      setTriggeredAnimations(prev => ({ ...prev, mapReveal: true }));
    }
  }, [frame, beats.mapReveal, triggeredAnimations.mapReveal]);

  // TRANSFORM: Map shrinks to upper corner (make room for welcome!)
  useEffect(() => {
    if (frame >= beats.transformMap && !triggeredAnimations.transformMap && mapContainerRef.current) {
      gsap.to(mapContainerRef.current, {
        x: 500,
        y: -200,
        scale: 0.5,
        duration: 1.2,
        ease: "power3.inOut",
      });
      setTriggeredAnimations(prev => ({ ...prev, transformMap: true }));
    }
  }, [frame, beats.transformMap, triggeredAnimations.transformMap]);

  // Welcome - THE HOOK (center stage!)
  useEffect(() => {
    if (frame >= beats.welcome && !triggeredAnimations.welcome && welcomeRef.current) {
      gsap.fromTo(welcomeRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.88,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "back.out(1.4)",
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
          y: 20,
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

  // Breathe animation - Subtle on welcome
  useEffect(() => {
    if (frame >= beats.breathe && !triggeredAnimations.breathe && welcomeRef.current) {
      gsap.to(welcomeRef.current, {
        scale: 1.02,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      setTriggeredAnimations(prev => ({ ...prev, breathe: true }));
    }
  }, [frame, beats.breathe, triggeredAnimations.breathe]);

  // ========================================
  // ROUGH.JS - Headers & Map
  // ========================================

  // Decorative elements only (no text rendering here)
  useEffect(() => {
    if (!roughTextSvgRef.current) return;

    const svg = roughTextSvgRef.current;
    const rc = rough.svg(svg);

    // Clear previous
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // No decorations for Hook1A - clean motion focus
    // This layer reserved for future templates that need annotations

  }, [frame, beats, colors]);

  // Animated Map SVG - ZERO WOBBLE
  useEffect(() => {
    if (!mapSvgRef.current || frame < beats.mapReveal) return;

    const svg = mapSvgRef.current;
    const rc = rough.svg(svg);

    // Clear previous
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const progress = Math.min((frame - beats.mapReveal) / 50, 1);

    // Stylized landmass (creative, not emoji)
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
      roughness: 0,
      bowing: 0,
      fill: `${colors.accent}15`,
      fillStyle: 'hachure',
      hachureGap: 8,
      hachureAngle: 45,
    });

    const paths = island.querySelectorAll('path');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length * (1 - progress);
    });

    svg.appendChild(island);

    // Small islands/details
    if (progress > 0.5) {
      const detailProgress = (progress - 0.5) * 2;
      
      const small1 = rc.circle(150, 200, 40 * detailProgress, {
        stroke: colors.accent2,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent2}12`,
        fillStyle: 'solid',
      });
      svg.appendChild(small1);

      const small2 = rc.circle(480, 180, 30 * detailProgress, {
        stroke: colors.accent2,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent2}12`,
        fillStyle: 'solid',
      });
      svg.appendChild(small2);

      // Location markers
      if (detailProgress > 0.6) {
        const markerProgress = (detailProgress - 0.6) / 0.4;
        
        [[260, 160], [340, 200], [380, 240]].forEach(([x, y], i) => {
          const delay = i * 0.2;
          if (markerProgress > delay) {
            const locProgress = Math.min((markerProgress - delay) / 0.3, 1);
            
            const markerPath = `M ${x} ${y} L ${x} ${y + 20 * locProgress}`;
            const marker = rc.path(markerPath, {
              stroke: colors.ink,
              strokeWidth: 5,
              roughness: 0,
              bowing: 0,
            });
            svg.appendChild(marker);

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

  // Decorative elements
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Energy sparks around welcome text
    if (frame >= beats.welcome + 20 && frame < beats.settle) {
      const sparkProgress = Math.min((frame - beats.welcome - 20) / 25, 1);
      
      [[700, 500], [1220, 500], [960, 380], [960, 620]].forEach(([x, y], i) => {
        const delay = i * 0.2;
        if (sparkProgress > delay) {
          const sProgress = Math.min((sparkProgress - delay) / 0.3, 1);
          
          const spark = rc.circle(x, y, 18 * sProgress, {
            stroke: colors.accent2,
            strokeWidth: 3,
            roughness: 0.6,
            bowing: 1,
            fill: `${colors.accent2}30`,
            fillStyle: 'solid',
          });
          
          spark.style.opacity = sProgress * 0.8;
          svg.appendChild(spark);
        }
      });
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

      {/* Rough text layer (for underlines, emphasis) */}
      <svg
        ref={roughTextSvgRef}
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
        {/* Question Container - GSAP animates these HTML elements */}
        {frame >= beats.questionPart1 && frame < beats.wipeQuestions + 50 && (
          <div
            ref={questionContainerRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              textAlign: 'center',
            }}
          >
            {/* Question Part 1 - Cabin Sketch gives sketchy look */}
            <div
              ref={textRef1}
              style={{
                marginBottom: spacing.gap,
                opacity: 0, // GSAP will animate
              }}
            >
              <h1
                style={{
                  fontFamily: fonts.header, // Cabin Sketch (sketchy style)
                  fontSize: fonts.size_title,
                  fontWeight: 700,
                  color: colors.ink,
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {texts.questionPart1 || 'What if geography'}
              </h1>
            </div>

            {/* Question Part 2 - Cabin Sketch gives sketchy look */}
            {frame >= beats.questionPart2 && (
              <div
                ref={textRef2}
                style={{
                  opacity: 0, // GSAP will animate
                }}
              >
                <h1
                  style={{
                    fontFamily: fonts.header, // Cabin Sketch (sketchy style)
                    fontSize: fonts.size_question,
                    fontWeight: 700,
                    color: colors.accent,
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  {texts.questionPart2 || 'was measured in mindsets?'}
                </h1>
              </div>
            )}
          </div>
        )}

        {/* Animated Map Container - Appears center, then moves to corner */}
        {frame >= beats.mapReveal && (
          <div
            ref={mapContainerRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 640,
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0,
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

        {/* Welcome to Knodovia - CENTER STAGE (THE HOOK) */}
        {frame >= beats.welcome && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              textAlign: 'center',
            }}
          >
            <div
              ref={welcomeRef}
              style={{
                opacity: 0, // GSAP will animate
              }}
            >
              <h2
                style={{
                  fontFamily: fonts.header, // Cabin Sketch (sketchy style)
                  fontSize: fonts.size_welcome,
                  fontWeight: 700,
                  color: colors.accent2,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {texts.welcome || 'Welcome to Knodovia'}
              </h2>
            </div>
          </div>
        )}

        {/* Subtitle - Permanent Marker for body/secondary text */}
        {frame >= beats.subtitle && (
          <div
            ref={subtitleRef}
            style={{
              position: 'absolute',
              bottom: '30%',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: 800,
              textAlign: 'center',
              opacity: 0,
            }}
          >
            <p
              style={{
                fontFamily: fonts.secondary, // Permanent Marker
                fontSize: fonts.size_subtitle,
                color: `${colors.ink}80`,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {texts.subtitle || 'A place where your perspective shapes the landscape...'}
            </p>
          </div>
        )}
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
export const HOOK_1A_DURATION_MIN = 15 * 30;
export const HOOK_1A_DURATION_MAX = 18 * 30;
export const HOOK_1A_EXIT_TRANSITION = 15;
