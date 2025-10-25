import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import gsap from 'gsap';
import { gracefulMove, shrinkToCorner, expandToCenter, cascadeReveal } from '../utils/gsapAnimations';

/**
 * REFLECT 4D: FORWARD LINK
 * 
 * Intent: Connect current lesson to next learning step
 * Pattern: "Now that you know X, next we'll..."
 * Visual: Bridge/arrow from current to next, path forward
 * Tone: Encouraging, Forward-looking
 * Duration: 15-25s
 * 
 * NO BOXES - Rough sketched bridge + path arrows
 */

const Reflect4DForwardLink = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const titleRef = useRef(null);
  const currentRef = useRef(null);
  const nextRef = useRef(null);
  const ctaRef = useRef(null);
  const bridgeLabelRef = useRef(null);
  const [triggered, setTriggered] = useState({ titleIn: false, currentIn: false, nextIn: false, shrinkCurrent: false, expandNext: false, ctaIn: false, bridgeIn: false });

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.cream,
    accent: THEME.colors.markers.purple,
    accent2: THEME.colors.markers.orange,
    path: THEME.colors.markers.blue,
    ink: THEME.colors.text.primary,
  };

  const data = scene.fill?.forward || {};

  // Beat timing
  const BEAT = 36;
  const beats = {
    prelude: 0,
    currentSummary: BEAT * 0.8,
    bridge: BEAT * 2.5,
    nextTeaser: BEAT * 4.5,
    pathForward: BEAT * 6,
    settle: BEAT * 7.5,
  };

  const cameraZoom = interpolate(
    frame,
    [0, beats.currentSummary, beats.settle],
    [1.04, 1.0, 1.02],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateRight: 'clamp' }
  );

  // GSAP entrances + mid-scene link motion
  useEffect(() => {
    if (frame >= BEAT * 0.3 && !triggered.titleIn && titleRef.current) {
      gsap.fromTo(titleRef.current, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)' });
      setTriggered(p => ({ ...p, titleIn: true }));
    }

    if (frame >= beats.currentSummary + 10 && !triggered.currentIn && currentRef.current) {
      gsap.fromTo(currentRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
      setTriggered(p => ({ ...p, currentIn: true }));
    }

    if (frame >= beats.nextTeaser + 12 && !triggered.nextIn && nextRef.current) {
      gsap.fromTo(nextRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
      setTriggered(p => ({ ...p, nextIn: true }));
    }

    // Mid-scene: shrink current to corner, expand next to center
    if (frame >= beats.bridge && !triggered.shrinkCurrent) {
      if (currentRef.current) shrinkToCorner(currentRef.current, { corner: 'topLeft', scale: 0.6, duration: 1.0 });
      setTriggered(p => ({ ...p, shrinkCurrent: true }));
    }

    if (frame >= beats.nextTeaser && !triggered.expandNext) {
      if (nextRef.current) gracefulMove(nextRef.current, { x: -220, duration: 1.0, ease: 'power3.inOut' });
      setTimeout(() => nextRef.current && expandToCenter(nextRef.current, { scale: 1.1, duration: 0.9 }), 1000);
      setTriggered(p => ({ ...p, expandNext: true }));
    }

    if (frame >= beats.pathForward + 15 && !triggered.ctaIn && ctaRef.current) {
      cascadeReveal([ctaRef.current], { duration: 0.5 });
      setTriggered(p => ({ ...p, ctaIn: true }));
    }

    if (frame >= beats.bridge + 25 && !triggered.bridgeIn && bridgeLabelRef.current) {
      cascadeReveal([bridgeLabelRef.current], { duration: 0.4 });
      setTriggered(p => ({ ...p, bridgeIn: true }));
    }
  }, [frame, beats, triggered]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Current lesson frame (left)
    if (frame >= beats.currentSummary) {
      const progress = Math.min((frame - beats.currentSummary) / 32, 1);
      
      const currentFrame = rc.rectangle(180, 380, 620, 280, {
        stroke: colors.accent,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent}10`,
        fillStyle: 'hachure',
        hachureGap: 12,
      });

      const paths = currentFrame.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });

      svg.appendChild(currentFrame);
    }

    // Bridge path (connecting)
    if (frame >= beats.bridge) {
      const progress = Math.min((frame - beats.bridge) / 50, 1);
      
      // Curved bridge
      const bridgePath = `M 800 520 Q ${800 + 280 * progress} 480 ${800 + 560 * progress} 520`;
      const bridge = rc.path(bridgePath, {
        stroke: colors.path,
        strokeWidth: 7,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(bridge);

      // Arrow on bridge
      if (progress > 0.7) {
        const arrowProgress = (progress - 0.7) / 0.3;
        const arrowX = 1360;
        const arrowPath = `M ${arrowX} 520 L ${arrowX - 30 * arrowProgress} ${520 - 22 * arrowProgress} M ${arrowX} 520 L ${arrowX - 30 * arrowProgress} ${520 + 22 * arrowProgress}`;
        const arrow = rc.path(arrowPath, {
          stroke: colors.path,
          strokeWidth: 7,
          roughness: 0,
          bowing: 0,
        });
        svg.appendChild(arrow);
      }
    }

    // Next lesson frame (right)
    if (frame >= beats.nextTeaser) {
      const progress = Math.min((frame - beats.nextTeaser) / 35, 1);
      
      const nextFrame = rc.rectangle(1120, 380, 620, 280, {
        stroke: colors.accent2,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent2}10`,
        fillStyle: 'hachure',
        hachureGap: 12,
      });

      const paths = nextFrame.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });

      svg.appendChild(nextFrame);
    }

    // Path forward (bottom arrow)
    if (frame >= beats.pathForward) {
      const progress = Math.min((frame - beats.pathForward) / 40, 1);
      
      const pathArrow = rc.path(
        `M 960 740 L ${960 + 180 * progress} 740`,
        {
          stroke: colors.path,
          strokeWidth: 5,
          roughness: 0,
          bowing: 0,
        }
      );
      svg.appendChild(pathArrow);

      // Arrowhead
      if (progress > 0.6) {
        const headProgress = (progress - 0.6) / 0.4;
        const headPath = `M 1140 740 L ${1140 - 20 * headProgress} ${740 - 16 * headProgress} M 1140 740 L ${1140 - 20 * headProgress} ${740 + 16 * headProgress}`;
        const head = rc.path(headPath, {
          stroke: colors.path,
          strokeWidth: 5,
          roughness: 0,
          bowing: 0,
        });
        svg.appendChild(head);
      }
    }

    // Decorative journey dots
    if (frame >= beats.bridge + 20) {
      for (let i = 0; i < 5; i++) {
        const dotFrame = beats.bridge + 20 + i * 8;
        if (frame < dotFrame) continue;

        const dotProgress = Math.min((frame - dotFrame) / 15, 1);
        const dotX = 850 + i * 110;
        const dotY = 500 - 20 + Math.sin((i / 5) * Math.PI) * 20;

        const dot = rc.circle(dotX, dotY, 12 * dotProgress, {
          stroke: 'none',
          fill: colors.path,
          fillStyle: 'solid',
          roughness: 0,
        });

        dot.style.opacity = 0.5;
        svg.appendChild(dot);
      }
    }

  }, [frame, beats, colors]);

  const buildIn = (startFrame, duration = 28) => {
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
      { easing: Easing.out(Easing.back(1.5)), extrapolateRight: 'clamp' }
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
        <div style={{ position: 'relative', width: '100%', height: '100%', padding: '80px 120px' }}>
          {/* Title */}
          {frame >= BEAT * 0.3 && (
            <div style={{ ...buildIn(BEAT * 0.3, 28), textAlign: 'center' }}>
              <h2
                style={{
                  fontFamily: THEME.fonts.marker.secondary,
                  fontSize: 52,
                  fontWeight: 700,
                  color: colors.ink,
                  margin: 0,
                }}
              >
                {data.title || 'Your Journey Continues'}
              </h2>
            </div>
          )}

          {/* Current summary */}
          {frame >= beats.currentSummary + 10 && (
            <div
              style={{
                position: 'absolute',
                top: 440,
                left: 210,
                width: 560,
                ...buildIn(beats.currentSummary + 10, 32),
              }}
            >
              <h3
                style={{
                  fontFamily: THEME.fonts.structure.primary,
                  fontSize: 28,
                  fontWeight: 700,
                  color: colors.accent,
                  margin: '0 0 16px 0',
                }}
              >
                {data.current?.label || 'You learned:'}
              </h3>
              <p
                style={{
                  fontFamily: THEME.fonts.structure.secondary,
                  fontSize: 22,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {data.current?.summary || 'Key concepts from this lesson'}
              </p>
            </div>
          )}

          {/* Bridge label */}
          {frame >= beats.bridge + 25 && (
            <div
              style={{
                position: 'absolute',
                top: 450,
                left: '50%',
                transform: 'translateX(-50%)',
                ...buildIn(beats.bridge + 25, 25),
              }}
            >
              <p
                style={{
                  fontFamily: THEME.fonts.marker.handwritten,
                  fontSize: 30,
                  color: colors.path,
                  margin: 0,
                  fontStyle: 'italic',
                  whiteSpace: 'nowrap',
                }}
              >
                {data.connection || 'leads to'}
              </p>
            </div>
          )}

          {/* Next teaser */}
          {frame >= beats.nextTeaser + 12 && (
            <div
              style={{
                position: 'absolute',
                top: 440,
                left: 1150,
                width: 560,
                ...buildIn(beats.nextTeaser + 12, 35),
              }}
            >
              <h3
                style={{
                  fontFamily: THEME.fonts.structure.primary,
                  fontSize: 28,
                  fontWeight: 700,
                  color: colors.accent2,
                  margin: '0 0 16px 0',
                }}
              >
                {data.next?.label || 'Coming up:'}
              </h3>
              <p
                style={{
                  fontFamily: THEME.fonts.structure.secondary,
                  fontSize: 22,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {data.next?.teaser || 'Exciting new concepts ahead'}
              </p>
            </div>
          )}

          {/* Path forward CTA */}
          {frame >= beats.pathForward + 15 && (
            <div
              style={{
                position: 'absolute',
                bottom: 140,
                left: '50%',
                transform: 'translateX(-50%)',
                ...buildIn(beats.pathForward + 15, 28),
              }}
            >
              <p
                style={{
                  fontFamily: THEME.fonts.marker.primary,
                  fontSize: 34,
                  color: colors.path,
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                {data.cta || "Let's keep going!"}
              </p>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Reflect4DForwardLink };
export const REFLECT_4D_DURATION_MIN = 15 * 30;
export const REFLECT_4D_DURATION_MAX = 25 * 30;
export const REFLECT_4D_EXIT_TRANSITION = 15;
