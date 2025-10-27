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
 * HOOK 1A: QUESTION BURST (CONVERSATIONAL V8 - FINAL)
 * 
 * CONVERSATIONAL FEATURES:
 * - ✅ Bold mid-scene GSAP transitions - things MOVE!
 * - ✅ Conversational flow - elements exit when done
 * - ✅ Headers in Cabin Sketch font (hand-drawn/sketchy look)
 * - ✅ Permanent Marker for body/secondary text
 * - ✅ Clean stage - only show what's needed NOW
 * - ✅ Graceful wipes/exits via GSAP
 * - ✅ Animated map (NO emojis)
 * - ✅ ZERO WOBBLE everywhere (no roughness/bowing)
 * 
 * Typography Hierarchy:
 * - Headers: SVG text with Cabin Sketch font (sketchy style, NO wobble)
 * - Body/Secondary: Permanent Marker - energy and personality
 * - Supporting: Inter - clean readability
 * 
 * How Headers Work (THE KEY):
 * - SVG text elements with Cabin Sketch font (sketchy look)
 * - Each text group has unique ID (#question1-group, #question2-group, #welcome-group)
 * - GSAP animates INDIVIDUAL TEXT GROUPS by ID
 * - NO boxes, NO underlines, NO wobble effects
 * - ONLY text with sketchy font style
 * 
 * Conversational Flow:
 * 1. "What if geography" appears (Cabin Sketch SVG text)
 * 2. Question 1 group moves up, making room
 * 3. "was measured in mindsets?" appears (Cabin Sketch SVG text)
 * 4. Both question groups pulse
 * 5. WIPE: Both question groups exit stage left
 * 6. Map draws in center with energy
 * 7. TRANSFORM: Map shrinks to corner
 * 8. "Welcome to Knodovia" appears (Cabin Sketch SVG text - THE HOOK)
 * 9. Subtitle fades in below (Permanent Marker)
 * 10. Breathe animation on welcome group
 * 
 * Intent: Conversational, dynamic, TED-ED quality with sketchy text, ZERO wobble
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
  
  // Question Part 1 - Bold entrance (animate specific group)
  useEffect(() => {
    if (frame >= beats.questionPart1 && !triggeredAnimations.questionPart1 && roughTextSvgRef.current) {
      const question1Group = roughTextSvgRef.current.querySelector('#question1-group');
      if (question1Group) {
        gsap.fromTo(question1Group,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "back.out(1.7)",
          }
        );
      }
      setTriggeredAnimations(prev => ({ ...prev, questionPart1: true }));
    }
  }, [frame, beats.questionPart1, triggeredAnimations.questionPart1]);

  // Move up to make room (animate question1 group)
  useEffect(() => {
    if (frame >= beats.moveUp && !triggeredAnimations.moveUp && roughTextSvgRef.current) {
      const question1Group = roughTextSvgRef.current.querySelector('#question1-group');
      if (question1Group) {
        gsap.to(question1Group, {
          y: -60,
          duration: 0.8,
          ease: "power2.inOut",
        });
      }
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

  // Pulse both for emphasis (animate question container)
  useEffect(() => {
    if (frame >= beats.pulse && !triggeredAnimations.pulse && roughTextSvgRef.current) {
      const question1Group = roughTextSvgRef.current.querySelector('#question1-group');
      const question2Group = roughTextSvgRef.current.querySelector('#question2-group');
      if (question1Group) {
        pulseEmphasis(question1Group, {
          scale: 1.05,
          duration: 0.4,
          repeat: 1,
          yoyo: true,
        });
      }
      if (question2Group) {
        pulseEmphasis(question2Group, {
          scale: 1.05,
          duration: 0.4,
          repeat: 1,
          yoyo: true,
        });
      }
      setTriggeredAnimations(prev => ({ ...prev, pulse: true }));
    }
  }, [frame, beats.pulse, triggeredAnimations.pulse]);

  // WIPE: Exit questions stage left (animate both question groups)
  useEffect(() => {
    if (frame >= beats.wipeQuestions && !triggeredAnimations.wipeQuestions && roughTextSvgRef.current) {
      const question1Group = roughTextSvgRef.current.querySelector('#question1-group');
      const question2Group = roughTextSvgRef.current.querySelector('#question2-group');
      if (question1Group) {
        gsap.to(question1Group, {
          x: -1200,
          opacity: 0,
          duration: 1.0,
          ease: "power3.in",
        });
      }
      if (question2Group) {
        gsap.to(question2Group, {
          x: -1200,
          opacity: 0,
          duration: 1.0,
          ease: "power3.in",
        });
      }
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

  // Welcome - THE HOOK (animate welcome group)
  useEffect(() => {
    if (frame >= beats.welcome && !triggeredAnimations.welcome && roughTextSvgRef.current) {
      const welcomeGroup = roughTextSvgRef.current.querySelector('#welcome-group');
      if (welcomeGroup) {
        gsap.fromTo(welcomeGroup,
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
      }
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

  // Breathe animation - Subtle on welcome (welcome group)
  useEffect(() => {
    if (frame >= beats.breathe && !triggeredAnimations.breathe && roughTextSvgRef.current) {
      const welcomeGroup = roughTextSvgRef.current.querySelector('#welcome-group');
      if (welcomeGroup) {
        gsap.to(welcomeGroup, {
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

  // ========================================
  // ROUGH.JS - Headers & Map
  // ========================================

  // Render headers with rough.js TEXT ONLY (NO boxes, NO wobble)
  useEffect(() => {
    if (!roughTextSvgRef.current) return;

    const svg = roughTextSvgRef.current;

    // Clear previous
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Question Part 1 - SVG text with Cabin Sketch (sketchy font style)
    if (frame >= beats.questionPart1 && frame < beats.wipeQuestions) {
      const text1 = texts.questionPart1 || 'What if geography';
      
      const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      textGroup.setAttribute('id', 'question1-group');
      
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', '960');
      textElement.setAttribute('y', '480');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
      textElement.setAttribute('font-size', fonts.size_title);
      textElement.setAttribute('font-weight', '700');
      textElement.setAttribute('fill', colors.ink);
      textElement.textContent = text1;
      
      textGroup.appendChild(textElement);
      svg.appendChild(textGroup);
    }

    // Question Part 2 - SVG text with Cabin Sketch (sketchy font style)
    if (frame >= beats.questionPart2 && frame < beats.wipeQuestions) {
      const text2 = texts.questionPart2 || 'was measured in mindsets?';
      
      const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      textGroup.setAttribute('id', 'question2-group');
      
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', '960');
      textElement.setAttribute('y', '600');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
      textElement.setAttribute('font-size', fonts.size_question);
      textElement.setAttribute('font-weight', '700');
      textElement.setAttribute('fill', colors.accent);
      textElement.textContent = text2;
      
      textGroup.appendChild(textElement);
      svg.appendChild(textGroup);
    }

    // "Welcome to Knodovia" - SVG text with Cabin Sketch (THE HOOK)
    if (frame >= beats.welcome) {
      const welcomeText = texts.welcome || 'Welcome to Knodovia';
      
      const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      textGroup.setAttribute('id', 'welcome-group');
      
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', '960');
      textElement.setAttribute('y', '560');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
      textElement.setAttribute('font-size', fonts.size_welcome);
      textElement.setAttribute('font-weight', '700');
      textElement.setAttribute('fill', colors.accent2);
      textElement.textContent = welcomeText;
      
      textGroup.appendChild(textElement);
      svg.appendChild(textGroup);
    }

  }, [frame, beats, colors, texts, fonts]);

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
        {/* Question Container - GSAP animates the container, rough.js SVG inside */}
        {frame >= beats.questionPart1 && frame < beats.wipeQuestions + 50 && (
          <div
            ref={questionContainerRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            {/* Hidden refs for GSAP to animate */}
            <div ref={textRef1} style={{ opacity: 0, width: 0, height: 0 }} />
            <div ref={textRef2} style={{ opacity: 0, width: 0, height: 0 }} />
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

        {/* Welcome - Hidden ref for GSAP (rough.js SVG renders the text) */}
        {frame >= beats.welcome && (
          <div
            ref={welcomeRef}
            style={{
              opacity: 0,
              width: 0,
              height: 0,
              pointerEvents: 'none',
            }}
          />
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
