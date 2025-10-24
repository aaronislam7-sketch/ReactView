import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import gsap from 'gsap';
import {
  cascadeReveal,
  gracefulMove,
  pulseEmphasis,
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
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const bridgeLabelRef = useRef(null);

  const [triggered, setTriggered] = useState({
    leftIn: false,
    rightIn: false,
    breathe: false,
    swapSides: false,
    bridgeLabel: false,
  });

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.cream,
    accent: THEME.colors.markers.orange,
    accent2: THEME.colors.markers.blue,
    ink: THEME.colors.text.primary,
  };

  const data = scene.fill?.analogy || {};

  // Beat timing
  const BEAT = 36;
  const beats = {
    prelude: 0,
    title: BEAT * 0.8,
    familiar: BEAT * 2,
    newConcept: BEAT * 3.5,
    bridge: BEAT * 5,
    explanation: BEAT * 6.5,
    settle: BEAT * 8,
  };

  const cameraZoom = interpolate(
    frame,
    [0, beats.familiar, beats.settle],
    [1.04, 1.0, 1.01],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateRight: 'clamp' }
  );

  // GSAP entrances and mid-scene transitions
  useEffect(() => {
    // Left content entrance + breathe
    if (frame >= beats.familiar + 10 && !triggered.leftIn && leftRef.current) {
      gsap.fromTo(leftRef.current,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.6)' }
      );
      setTriggered(prev => ({ ...prev, leftIn: true }));
    }

    // Right content entrance + breathe
    if (frame >= beats.newConcept + 10 && !triggered.rightIn && rightRef.current) {
      gsap.fromTo(rightRef.current,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.6)' }
      );
      setTriggered(prev => ({ ...prev, rightIn: true }));
    }

    // Gentle breathe on both sides (no jitter, pure scale)
    if (triggered.leftIn && triggered.rightIn && !triggered.breathe) {
      const targets = [leftRef.current, rightRef.current].filter(Boolean);
      if (targets.length) {
        gsap.to(targets, {
          scale: 1.03,
          duration: 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
      setTriggered(prev => ({ ...prev, breathe: true }));
    }

    // Mid-scene: swap sides gracefully
    if (frame >= beats.explanation && !triggered.swapSides) {
      if (leftRef.current && rightRef.current) {
        gracefulMove(leftRef.current, { x: 820, duration: 1.2, ease: 'power3.inOut' });
        gracefulMove(rightRef.current, { x: -820, duration: 1.2, ease: 'power3.inOut' });
        // Small emphasis after swap
        setTimeout(() => {
          pulseEmphasis([leftRef.current, rightRef.current], { scale: 1.05, duration: 0.3, repeat: 1, yoyo: true });
        }, 1200);
      }
      setTriggered(prev => ({ ...prev, swapSides: true }));
    }

    // Bridge label entrance (center caption)
    if (frame >= beats.bridge + 20 && !triggered.bridgeLabel && bridgeLabelRef.current) {
      cascadeReveal([bridgeLabelRef.current], { duration: 0.6 });
      setTriggered(prev => ({ ...prev, bridgeLabel: true }));
    }
  }, [frame, beats, triggered]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Familiar concept frame (left) - ZERO WOBBLE
    if (frame >= beats.familiar) {
      const progress = Math.min((frame - beats.familiar) / 32, 1);
      
      const leftFrame = rc.rectangle(180, 350, 680, 420, {
        stroke: colors.accent,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
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

    // New concept frame (right) - ZERO WOBBLE
    if (frame >= beats.newConcept) {
      const progress = Math.min((frame - beats.newConcept) / 32, 1);
      
      const rightFrame = rc.rectangle(1060, 350, 680, 420, {
        stroke: colors.accent2,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
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

    // Bridge arrow (connecting) - ZERO WOBBLE
    if (frame >= beats.bridge) {
      const progress = Math.min((frame - beats.bridge) / 35, 1);
      
      // Arrow shaft
      const arrowPath = `M 880 560 L ${880 + 160 * progress} 560`;
      const arrow = rc.path(arrowPath, {
        stroke: colors.ink,
        strokeWidth: 6,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(arrow);

      // Arrowhead
      if (progress > 0.7) {
        const headProgress = (progress - 0.7) / 0.3;
        const headPath = `M 1040 560 L ${1040 - 25 * headProgress} ${560 - 20 * headProgress} M 1040 560 L ${1040 - 25 * headProgress} ${560 + 20 * headProgress}`;
        const arrowhead = rc.path(headPath, {
          stroke: colors.ink,
          strokeWidth: 6,
          roughness: 0,
          bowing: 0,
        });
        svg.appendChild(arrowhead);
      }
    }

    // Decorative brackets - ZERO WOBBLE
    if (frame >= beats.explanation) {
      const progress = Math.min((frame - beats.explanation) / 28, 1);

      const leftBracket = rc.path(
        `M 200 ${320 + 15 * (1 - progress)} Q 190 560 200 ${800 - 15 * (1 - progress)}`,
        {
          stroke: `${colors.accent}60`,
          strokeWidth: 4,
          roughness: 0,
          bowing: 0,
        }
      );
      svg.appendChild(leftBracket);

      const rightBracket = rc.path(
        `M 1720 ${320 + 15 * (1 - progress)} Q 1730 560 1720 ${800 - 15 * (1 - progress)}`,
        {
          stroke: `${colors.accent2}60`,
          strokeWidth: 4,
          roughness: 0,
          bowing: 0,
        }
      );
      svg.appendChild(rightBracket);
    }

  }, [frame, beats, colors]);

  const buildIn = (startFrame, duration = 30) => {
    if (frame < startFrame) {
      return { opacity: 0, transform: 'translateY(-15px) scale(0.95)' };
    }
    if (frame >= startFrame + duration) {
      return { opacity: 1, transform: 'translateY(0) scale(1)' };
    }

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.back(1.4)), extrapolateRight: 'clamp' }
    );

    return {
      opacity: progress,
      transform: `translateY(${-15 * (1 - progress)}px) scale(${0.95 + progress * 0.05})`,
    };
  };

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
            <div style={{ ...buildIn(beats.title, 28), textAlign: 'center' }}>
              <h2
                style={{
                  fontFamily: THEME.fonts.marker.secondary,
                  fontSize: 52,
                  fontWeight: 700,
                  color: colors.ink,
                  margin: 0,
                }}
              >
                {data.title || 'Think of it like this...'}
              </h2>
            </div>
          )}

          {/* Familiar concept (GSAP-controlled) */}
          {frame >= beats.familiar + 10 && (
            <div
              style={{
                position: 'absolute',
                top: 400,
                left: 220,
                width: 600,
              }}
            >
              <div ref={leftRef} style={{ opacity: 0 }}>
                <h3
                  style={{
                    fontFamily: THEME.fonts.structure.primary,
                    fontSize: 38,
                    fontWeight: 700,
                    color: colors.accent,
                    margin: '0 0 20px 0',
                  }}
                >
                  {data.familiar?.label || 'Familiar Thing'}
                </h3>
                <p
                  style={{
                    fontFamily: THEME.fonts.structure.secondary,
                    fontSize: 24,
                    color: colors.ink,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {data.familiar?.description || 'Description of familiar concept...'}
                </p>
              </div>
            </div>
          )}

          {/* New concept (GSAP-controlled) */}
          {frame >= beats.newConcept + 10 && (
            <div
              style={{
                position: 'absolute',
                top: 400,
                left: 1100,
                width: 600,
              }}
            >
              <div ref={rightRef} style={{ opacity: 0 }}>
                <h3
                  style={{
                    fontFamily: THEME.fonts.structure.primary,
                    fontSize: 38,
                    fontWeight: 700,
                    color: colors.accent2,
                    margin: '0 0 20px 0',
                  }}
                >
                  {data.newConcept?.label || 'New Concept'}
                </h3>
                <p
                  style={{
                    fontFamily: THEME.fonts.structure.secondary,
                    fontSize: 24,
                    color: colors.ink,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {data.newConcept?.description || 'Description of new concept...'}
                </p>
              </div>
            </div>
          )}

          {/* Bridge label */}
          {frame >= beats.bridge + 20 && (
            <div
              style={{
                position: 'absolute',
                top: 500,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <p
                ref={bridgeLabelRef}
                style={{
                  fontFamily: THEME.fonts.marker.handwritten,
                  fontSize: 32,
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
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Explain2BAnalogy };
export const EXPLAIN_2B_DURATION_MIN = 18 * 30;
export const EXPLAIN_2B_DURATION_MAX = 35 * 30;
export const EXPLAIN_2B_EXIT_TRANSITION = 15;
