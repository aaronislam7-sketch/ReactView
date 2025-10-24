import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import gsap from 'gsap';
import {
  morphShape,
  breatheShape,
  gracefulMove,
  cascadeReveal,
  pulseEmphasis,
  drawSVGPath,
} from '../utils/gsapAnimations';

/**
 * EXPLAIN 2B: ANALOGY
 * 
 * Intent: Explain concept through relatable comparison
 * Pattern: "X is like Y because..."
 * Visual: Side-by-side frames, comparison arrows, bridge
 * Tone: Relatable, Clear
 * Duration: 18-35s
 * 
 * NO BOXES - Rough sketched comparison frames + bridging arrows
 */

const Explain2BAnalogy = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const titleRef = useRef(null);
  const familiarRef = useRef(null);
  const newConceptRef = useRef(null);
  const bridgeRef = useRef(null);
  const explanationRef = useRef(null);
  
  const [triggeredAnimations, setTriggeredAnimations] = useState({
    title: false,
    familiar: false,
    newConcept: false,
    bridge: false,
    explanation: false,
    swapSides: false,
    breathe: false,
  });

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.cream,
    accent: THEME.colors.markers.orange,
    accent2: THEME.colors.markers.blue,
    ink: THEME.colors.text.primary,
  };
  
  const fonts = scene.style_tokens?.fonts || {
    primary: "'Cabin Sketch', cursive",
    secondary: "'Patrick Hand', cursive",
    size_title: 64,
    size_concept: 48,
    size_bridge: 36,
    size_explanation: 28,
  };

  const data = scene.fill?.analogy || {};

  // Beat timing - enhanced for GSAP
  const BEAT = 36;
  const beats = {
    prelude: 0,
    title: BEAT * 0.8,
    familiar: BEAT * 2,
    newConcept: BEAT * 3.5,
    bridge: BEAT * 5,
    explanation: BEAT * 6.5,
    swapSides: BEAT * 7.5,    // NEW: Mid-scene swap
    breathe: BEAT * 8.2,       // NEW: Breathe effect
    settle: BEAT * 9,
  };

  const cameraZoom = interpolate(
    frame,
    [0, beats.familiar, beats.settle],
    [1.04, 1.0, 1.01],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateRight: 'clamp' }
  );

  // ========================================
  // GSAP ANIMATION TRIGGERS
  // ========================================
  
  // Title appears with bounce
  useEffect(() => {
    if (frame >= beats.title && !triggeredAnimations.title && titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: -30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "back.out(1.7)" }
      );
      setTriggeredAnimations(prev => ({ ...prev, title: true }));
    }
  }, [frame, beats.title, triggeredAnimations.title]);

  // Familiar concept morphs in
  useEffect(() => {
    if (frame >= beats.familiar && !triggeredAnimations.familiar && familiarRef.current) {
      morphShape(familiarRef.current, {
        scale: 1.0,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.5)",
      });
      setTriggeredAnimations(prev => ({ ...prev, familiar: true }));
    }
  }, [frame, beats.familiar, triggeredAnimations.familiar]);

  // New concept morphs in
  useEffect(() => {
    if (frame >= beats.newConcept && !triggeredAnimations.newConcept && newConceptRef.current) {
      morphShape(newConceptRef.current, {
        scale: 1.0,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.5)",
      });
      setTriggeredAnimations(prev => ({ ...prev, newConcept: true }));
    }
  }, [frame, beats.newConcept, triggeredAnimations.newConcept]);

  // Bridge draws between concepts
  useEffect(() => {
    if (frame >= beats.bridge && !triggeredAnimations.bridge && bridgeRef.current) {
      drawSVGPath(bridgeRef.current, {
        duration: 1.5,
        ease: "power2.inOut",
      });
      setTriggeredAnimations(prev => ({ ...prev, bridge: true }));
    }
  }, [frame, beats.bridge, triggeredAnimations.bridge]);

  // Explanation cascades in
  useEffect(() => {
    if (frame >= beats.explanation && !triggeredAnimations.explanation && explanationRef.current) {
      cascadeReveal([explanationRef.current], {
        duration: 0.8,
        stagger: 0.1,
        direction: "up",
      });
      setTriggeredAnimations(prev => ({ ...prev, explanation: true }));
    }
  }, [frame, beats.explanation, triggeredAnimations.explanation]);

  // MID-SCENE: Swap sides for emphasis
  useEffect(() => {
    if (frame >= beats.swapSides && !triggeredAnimations.swapSides) {
      if (familiarRef.current && newConceptRef.current) {
        // Move familiar to right
        gracefulMove(familiarRef.current, {
          x: 400,
          duration: 1.0,
          ease: "power3.inOut",
        });
        // Move new concept to left
        gracefulMove(newConceptRef.current, {
          x: -400,
          duration: 1.0,
          ease: "power3.inOut",
        });
        setTriggeredAnimations(prev => ({ ...prev, swapSides: true }));
      }
    }
  }, [frame, beats.swapSides, triggeredAnimations.swapSides]);

  // Breathe effect on both concepts
  useEffect(() => {
    if (frame >= beats.breathe && !triggeredAnimations.breathe) {
      if (familiarRef.current && newConceptRef.current) {
        breatheShape(familiarRef.current, {
          scaleAmount: 1.05,
          duration: 2.0,
        });
        breatheShape(newConceptRef.current, {
          scaleAmount: 1.05,
          duration: 2.0,
        });
        setTriggeredAnimations(prev => ({ ...prev, breathe: true }));
      }
    }
  }, [frame, beats.breathe, triggeredAnimations.breathe]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Familiar concept frame (left)
    if (frame >= beats.familiar) {
      const progress = Math.min((frame - beats.familiar) / 32, 1);
      
      const leftFrame = rc.rectangle(180, 350, 680, 420, {
        stroke: colors.accent,
        strokeWidth: 5,
        roughness: 0,  // ZERO WOBBLE
        bowing: 0,     // ZERO WOBBLE
        fill: `${colors.accent}08`,
        fillStyle: 'hachure',
        hachureGap: 12,
      });

      const paths = leftFrame.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });

      svg.appendChild(leftFrame);
    }

    // New concept frame (right)
    if (frame >= beats.newConcept) {
      const progress = Math.min((frame - beats.newConcept) / 32, 1);
      
      const rightFrame = rc.rectangle(1060, 350, 680, 420, {
        stroke: colors.accent2,
        strokeWidth: 5,
        roughness: 0,  // ZERO WOBBLE
        bowing: 0,     // ZERO WOBBLE
        fill: `${colors.accent2}08`,
        fillStyle: 'hachure',
        hachureGap: 12,
      });

      const paths = rightFrame.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });

      svg.appendChild(rightFrame);
    }

    // Bridge arrow (connecting)
    if (frame >= beats.bridge) {
      const progress = Math.min((frame - beats.bridge) / 35, 1);
      
      // Arrow shaft
      const arrowPath = `M 880 560 L ${880 + 160 * progress} 560`;
      const arrow = rc.path(arrowPath, {
        stroke: colors.ink,
        strokeWidth: 6,
        roughness: 0,  // ZERO WOBBLE
        bowing: 0,     // ZERO WOBBLE
      });
      svg.appendChild(arrow);

      // Arrowhead
      if (progress > 0.7) {
        const headProgress = (progress - 0.7) / 0.3;
        const headPath = `M 1040 560 L ${1040 - 25 * headProgress} ${560 - 20 * headProgress} M 1040 560 L ${1040 - 25 * headProgress} ${560 + 20 * headProgress}`;
        const arrowhead = rc.path(headPath, {
          stroke: colors.ink,
          strokeWidth: 6,
          roughness: 0,  // ZERO WOBBLE
          bowing: 0,     // ZERO WOBBLE
        });
        svg.appendChild(arrowhead);
      }
    }

    // Decorative brackets
    if (frame >= beats.explanation) {
      const progress = Math.min((frame - beats.explanation) / 28, 1);

      const leftBracket = rc.path(
        `M 200 ${320 + 15 * (1 - progress)} Q 190 560 200 ${800 - 15 * (1 - progress)}`,
        {
          stroke: `${colors.accent}60`,
          strokeWidth: 4,
          roughness: 0,  // ZERO WOBBLE
          bowing: 0,     // ZERO WOBBLE
        }
      );
      svg.appendChild(leftBracket);

      const rightBracket = rc.path(
        `M 1720 ${320 + 15 * (1 - progress)} Q 1730 560 1720 ${800 - 15 * (1 - progress)}`,
        {
          stroke: `${colors.accent2}60`,
          strokeWidth: 4,
          roughness: 0,  // ZERO WOBBLE
          bowing: 0,     // ZERO WOBBLE
        }
      );
      svg.appendChild(rightBracket);
    }

  }, [frame, beats, colors]);


  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
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

      <AbsoluteFill style={{ transform: `scale(${cameraZoom})` }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', padding: '80px 100px' }}>
          {/* Title */}
          {frame >= beats.title && (
            <div ref={titleRef} style={{ opacity: 0, textAlign: 'center' }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_title,
                  fontWeight: 700,
                  color: colors.ink,
                  margin: 0,
                }}
              >
                {data.title || 'Think of it like this...'}
              </h2>
            </div>
          )}

          {/* Familiar concept */}
          {frame >= beats.familiar + 10 && (
            <div
              ref={familiarRef}
              style={{
                position: 'absolute',
                top: 400,
                left: 220,
                width: 600,
                opacity: 0,
                transform: 'scale(0.8)',
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_concept,
                  fontWeight: 700,
                  color: colors.accent,
                  margin: '0 0 20px 0',
                }}
              >
                {data.familiar?.label || 'Familiar Thing'}
              </h3>
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: 24,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {data.familiar?.description || 'Description of familiar concept...'}
              </p>
            </div>
          )}

          {/* New concept */}
          {frame >= beats.newConcept + 10 && (
            <div
              ref={newConceptRef}
              style={{
                position: 'absolute',
                top: 400,
                left: 1100,
                width: 600,
                opacity: 0,
                transform: 'scale(0.8)',
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_concept,
                  fontWeight: 700,
                  color: colors.accent2,
                  margin: '0 0 20px 0',
                }}
              >
                {data.newConcept?.label || 'New Concept'}
              </h3>
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: 24,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {data.newConcept?.description || 'Description of new concept...'}
              </p>
            </div>
          )}

          {/* Bridge label */}
          {frame >= beats.bridge + 20 && (
            <div
              ref={bridgeRef}
              style={{
                position: 'absolute',
                top: 500,
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: 0,
              }}
            >
              <p
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_bridge,
                  color: `${colors.ink}70`,
                  margin: 0,
                  fontStyle: 'italic',
                  whiteSpace: 'nowrap',
                }}
              >
                {data.connection || 'is like'}
              </p>
            </div>
          )}

          {/* Explanation */}
          {frame >= beats.explanation + 15 && (
            <div
              ref={explanationRef}
              style={{
                position: 'absolute',
                top: 850,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 1000,
                textAlign: 'center',
                opacity: 0,
              }}
            >
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: fonts.size_explanation,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {data.explanation || 'The key similarity is...'}
              </p>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Explain2BAnalogy };
export const EXPLAIN_2B_DURATION_MIN = 18 * 30;
export const EXPLAIN_2B_DURATION_MAX = 35 * 30;
export const EXPLAIN_2B_EXIT_TRANSITION = 15;
