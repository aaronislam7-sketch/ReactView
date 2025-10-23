import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

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
        roughness: 0.8,
        bowing: 2,
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
        roughness: 0.8,
        bowing: 2,
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
        roughness: 0.9,
        bowing: 2,
      });
      svg.appendChild(arrow);

      // Arrowhead
      if (progress > 0.7) {
        const headProgress = (progress - 0.7) / 0.3;
        const headPath = `M 1040 560 L ${1040 - 25 * headProgress} ${560 - 20 * headProgress} M 1040 560 L ${1040 - 25 * headProgress} ${560 + 20 * headProgress}`;
        const arrowhead = rc.path(headPath, {
          stroke: colors.ink,
          strokeWidth: 6,
          roughness: 0.8,
          bowing: 1,
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
          roughness: 0.7,
          bowing: 2,
        }
      );
      svg.appendChild(leftBracket);

      const rightBracket = rc.path(
        `M 1720 ${320 + 15 * (1 - progress)} Q 1730 560 1720 ${800 - 15 * (1 - progress)}`,
        {
          stroke: `${colors.accent2}60`,
          strokeWidth: 4,
          roughness: 0.7,
          bowing: 2,
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

          {/* Familiar concept */}
          {frame >= beats.familiar + 10 && (
            <div
              style={{
                position: 'absolute',
                top: 400,
                left: 220,
                width: 600,
                ...buildIn(beats.familiar + 10, 35),
              }}
            >
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
          )}

          {/* New concept */}
          {frame >= beats.newConcept + 10 && (
            <div
              style={{
                position: 'absolute',
                top: 400,
                left: 1100,
                width: 600,
                ...buildIn(beats.newConcept + 10, 35),
              }}
            >
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
          )}

          {/* Bridge label */}
          {frame >= beats.bridge + 20 && (
            <div
              style={{
                position: 'absolute',
                top: 500,
                left: '50%',
                transform: 'translateX(-50%)',
                ...buildIn(beats.bridge + 20, 28),
              }}
            >
              <p
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
