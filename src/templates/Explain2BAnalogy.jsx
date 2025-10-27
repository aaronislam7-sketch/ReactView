import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import gsap from 'gsap';
import { Player } from '@lottiefiles/react-lottie-player';
import {
  gracefulMove,
  pulseEmphasis,
  cascadeReveal,
} from '../utils/gsapAnimations';

/**
 * EXPLAIN 2B: ANALOGY (TED-ED Style V4)
 * 
 * Intent: Explain concept through relatable comparison
 * Pattern: "X is like Y because..."
 * Visual: Side-by-side frames, then GRACEFUL MOVE to reveal connection
 * Tone: Relatable, Clear
 * Duration: 20-35s
 * 
 * NEW FEATURES:
 * - ✅ Lottie animation support for both sides
 * - ✅ Image fallback support
 * - ✅ GSAP graceful moves: sides move out/shrink, text reveals
 * - ✅ Permanent Marker font
 * - ✅ Bold accent colors
 * - ✅ Zero wobble
 * - ✅ Money shot moment: connection reveal
 * 
 * Animation Flow:
 * 1. Title appears
 * 2. Familiar side (left) - Lottie or image
 * 3. New concept side (right) - Lottie or image
 * 4. Mid-scene: Both sides shrink & move to top corners
 * 5. Connection text reveals in center (THE MONEY SHOT)
 * 6. Detailed explanation cascades in
 */

const Explain2BAnalogy = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const titleRef = useRef(null);
  const leftSideRef = useRef(null);
  const rightSideRef = useRef(null);
  const connectionRef = useRef(null);
  const explanationRef = useRef(null);

  const [triggeredAnimations, setTriggeredAnimations] = useState({
    title: false,
    familiar: false,
    newConcept: false,
    moveAway: false,
    connectionReveal: false,
    explanationReveal: false,
  });

  const colors = scene.style_tokens?.colors || {
    bg: '#FFF9F0',
    accent: '#FF6B35',     // Bold orange
    accent2: '#2E7FE4',
    ink: '#1A1A1A',
  };

  const fonts = scene.style_tokens?.fonts || {
    primary: THEME.fonts.marker.primary,  // Permanent Marker
    secondary: THEME.fonts.structure.primary,
    size_title: 52,
    size_label: 36,
    size_connection: 56,
    size_explanation: 28,
  };

  const data = scene.fill?.analogy || {};

  // Beat timing - TED-ED style pacing
  const BEAT = 30;
  const beats = {
    prelude: 0,
    title: BEAT * 0.8,
    familiar: BEAT * 2,
    newConcept: BEAT * 4,
    pause: BEAT * 6,
    moveAway: BEAT * 6.5,         // NEW: Sides move to corners
    connectionReveal: BEAT * 8,   // NEW: Money shot
    explanationReveal: BEAT * 9.5,
    settle: BEAT * 11,
  };

  // Subtle camera drift
  const cameraDrift = {
    x: Math.sin(frame * 0.007) * 2,
    y: Math.cos(frame * 0.006) * 1.5,
  };

  // ========================================
  // GSAP ANIMATION TRIGGERS
  // ========================================
  
  // Title
  useEffect(() => {
    if (frame >= beats.title && !triggeredAnimations.title && titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: -20, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.5)" }
      );
      setTriggeredAnimations(prev => ({ ...prev, title: true }));
    }
  }, [frame, beats.title, triggeredAnimations.title]);

  // Familiar side appears
  useEffect(() => {
    if (frame >= beats.familiar && !triggeredAnimations.familiar && leftSideRef.current) {
      gsap.fromTo(leftSideRef.current,
        { opacity: 0, x: -50, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 1.0, ease: "back.out(1.5)" }
      );
      setTriggeredAnimations(prev => ({ ...prev, familiar: true }));
    }
  }, [frame, beats.familiar, triggeredAnimations.familiar]);

  // New concept side appears
  useEffect(() => {
    if (frame >= beats.newConcept && !triggeredAnimations.newConcept && rightSideRef.current) {
      gsap.fromTo(rightSideRef.current,
        { opacity: 0, x: 50, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 1.0, ease: "back.out(1.5)" }
      );
      setTriggeredAnimations(prev => ({ ...prev, newConcept: true }));
    }
  }, [frame, beats.newConcept, triggeredAnimations.newConcept]);

  // MID-SCENE: Sides move to corners (graceful)
  useEffect(() => {
    if (frame >= beats.moveAway && !triggeredAnimations.moveAway) {
      if (leftSideRef.current) {
        gsap.to(leftSideRef.current, {
          x: -300,
          y: -150,
          scale: 0.5,
          duration: 1.2,
          ease: "power3.inOut",
        });
      }
      if (rightSideRef.current) {
        gsap.to(rightSideRef.current, {
          x: 300,
          y: -150,
          scale: 0.5,
          duration: 1.2,
          ease: "power3.inOut",
        });
      }
      setTriggeredAnimations(prev => ({ ...prev, moveAway: true }));
    }
  }, [frame, beats.moveAway, triggeredAnimations.moveAway]);

  // Connection reveal - THE MONEY SHOT
  useEffect(() => {
    if (frame >= beats.connectionReveal && !triggeredAnimations.connectionReveal && connectionRef.current) {
      gsap.fromTo(connectionRef.current,
        { opacity: 0, scale: 0.85, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "back.out(1.5)" }
      );
      
      // Pulse emphasis
      setTimeout(() => {
        if (connectionRef.current) {
          pulseEmphasis(connectionRef.current, {
            scale: 1.05,
            duration: 0.5,
            repeat: 1,
            yoyo: true,
          });
        }
      }, 600);
      
      setTriggeredAnimations(prev => ({ ...prev, connectionReveal: true }));
    }
  }, [frame, beats.connectionReveal, triggeredAnimations.connectionReveal]);

  // Explanation reveal
  useEffect(() => {
    if (frame >= beats.explanationReveal && !triggeredAnimations.explanationReveal && explanationRef.current) {
      gsap.fromTo(explanationRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }
      );
      setTriggeredAnimations(prev => ({ ...prev, explanationReveal: true }));
    }
  }, [frame, beats.explanationReveal, triggeredAnimations.explanationReveal]);

  // rough.js decorative elements - ZERO WOBBLE
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Connection arrow/bridge (appears after move)
    if (frame >= beats.connectionReveal) {
      const progress = Math.min((frame - beats.connectionReveal) / 40, 1);
      
      // Curved connecting line from left to right
      const bridgePath = `M 480 420 Q 960 ${420 - 50 * Math.sin(progress * Math.PI)} 1440 420`;
      const bridge = rc.path(bridgePath, {
        stroke: colors.accent,
        strokeWidth: 6,
        roughness: 0,
        bowing: 0,
      });
      
      // Animate stroke
      const paths = bridge.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });
      
      svg.appendChild(bridge);
    }

    // Decorative emphasis circles (around connection text)
    if (frame >= beats.connectionReveal + 20) {
      const circleProgress = Math.min((frame - beats.connectionReveal - 20) / 30, 1);
      
      const emphasisCircle = rc.circle(960, 540, 320 * circleProgress, {
        stroke: `${colors.accent2}40`,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
        fill: 'none',
      });
      
      svg.appendChild(emphasisCircle);
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
          transform: `translate(${cameraDrift.x}px, ${cameraDrift.y}px)`,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      />

      <AbsoluteFill style={{ transform: `translate(${cameraDrift.x}px, ${cameraDrift.y}px)` }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', padding: '80px 100px' }}>
          {/* Title */}
          {frame >= beats.title && (
            <div ref={titleRef} style={{ textAlign: 'center', opacity: 0 }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_title,
                  fontWeight: 400,
                  color: colors.ink,
                  margin: 0,
                }}
              >
                {data.title || 'Think of it like this...'}
              </h2>
            </div>
          )}

          {/* Familiar concept (left) */}
          {frame >= beats.familiar && (
            <div
              ref={leftSideRef}
              style={{
                position: 'absolute',
                top: 360,
                left: 200,
                width: 520,
                opacity: 0,
              }}
            >
              {/* Lottie or Image */}
              {data.familiar?.lottie && (
                <div style={{ marginBottom: 20 }}>
                  <Player
                    autoplay
                    loop
                    src={data.familiar.lottie}
                    style={{ height: 280, width: '100%' }}
                  />
                </div>
              )}
              {!data.familiar?.lottie && data.familiar?.image && (
                <div style={{ marginBottom: 20 }}>
                  <img
                    src={data.familiar.image}
                    alt=""
                    style={{
                      width: '100%',
                      height: 280,
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}
              
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_label,
                  fontWeight: 400,
                  color: colors.accent,
                  margin: '0 0 12px 0',
                }}
              >
                {data.familiar?.label || 'Familiar Thing'}
              </h3>
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: 22,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {data.familiar?.description || 'Description of familiar concept...'}
              </p>
            </div>
          )}

          {/* New concept (right) */}
          {frame >= beats.newConcept && (
            <div
              ref={rightSideRef}
              style={{
                position: 'absolute',
                top: 360,
                right: 200,
                width: 520,
                opacity: 0,
              }}
            >
              {/* Lottie or Image */}
              {data.newConcept?.lottie && (
                <div style={{ marginBottom: 20 }}>
                  <Player
                    autoplay
                    loop
                    src={data.newConcept.lottie}
                    style={{ height: 280, width: '100%' }}
                  />
                </div>
              )}
              {!data.newConcept?.lottie && data.newConcept?.image && (
                <div style={{ marginBottom: 20 }}>
                  <img
                    src={data.newConcept.image}
                    alt=""
                    style={{
                      width: '100%',
                      height: 280,
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}
              
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_label,
                  fontWeight: 400,
                  color: colors.accent2,
                  margin: '0 0 12px 0',
                }}
              >
                {data.newConcept?.label || 'New Concept'}
              </h3>
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: 22,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {data.newConcept?.description || 'Description of new concept...'}
              </p>
            </div>
          )}

          {/* Connection - THE MONEY SHOT */}
          {frame >= beats.connectionReveal && (
            <div
              ref={connectionRef}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                opacity: 0,
                maxWidth: 800,
              }}
            >
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_connection,
                  fontWeight: 400,
                  color: colors.accent,
                  margin: '0 0 20px 0',
                  lineHeight: 1.3,
                }}
              >
                {data.connection || 'They work the same way!'}
              </h2>
            </div>
          )}

          {/* Explanation */}
          {frame >= beats.explanationReveal && (
            <div
              ref={explanationRef}
              style={{
                position: 'absolute',
                bottom: 120,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                maxWidth: 900,
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
                {data.explanation || 'Both follow the same core principle...'}
              </p>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Explain2BAnalogy };
export const EXPLAIN_2B_DURATION_MIN = 20 * 30;
export const EXPLAIN_2B_DURATION_MAX = 35 * 30;
export const EXPLAIN_2B_EXIT_TRANSITION = 15;
