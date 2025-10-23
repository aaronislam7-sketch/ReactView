import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

/**
 * EXPLAIN 2A: CONCEPT BREAKDOWN
 * 
 * Intent: Break complex concept into clear, digestible parts
 * Pattern: "X is made of Y, Z, A..."
 * Visual: Branching structure, labeled nodes, connecting paths
 * Tone: Clear, Structured
 * Duration: 20-40s
 * 
 * NO BOXES - Rough sketched frames + organic connector lines
 */

const Explain2AConceptBreakdown = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.cream,
    accent: THEME.colors.markers.blue,
    accent2: THEME.colors.markers.green,
    accent3: THEME.colors.markers.purple,
    ink: THEME.colors.text.primary,
  };

  const data = scene.fill?.concept || {};
  const parts = data.parts || [];

  // Beat timing - methodical reveal
  const BEAT = 36; // 1.2s
  const beats = {
    prelude: 0,
    title: BEAT * 0.8,
    centerConcept: BEAT * 2,
    parts: BEAT * 3.5,
    connections: BEAT * (3.5 + parts.length * 0.8),
    settle: BEAT * (5 + parts.length),
  };

  // Camera - gentle focus
  const cameraZoom = interpolate(
    frame,
    [0, beats.centerConcept, beats.settle],
    [1.05, 1.0, 1.02],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateRight: 'clamp' }
  );

  // Generate rough.js breakdown structure
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    // Clear previous
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Center concept frame (main node)
    if (frame >= beats.centerConcept) {
      const progress = Math.min((frame - beats.centerConcept) / 35, 1);
      
      const centerFrame = rc.rectangle(760, 420, 400, 140, {
        stroke: colors.accent,
        strokeWidth: 5,
        roughness: 0.9,
        bowing: 2,
        fill: `${colors.accent}10`,
        fillStyle: 'hachure',
        hachureGap: 10,
      });

      // Animate stroke drawing
      const paths = centerFrame.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });

      svg.appendChild(centerFrame);
    }

    // Part frames (breakdown nodes)
    if (frame >= beats.parts) {
      const positions = parts.length === 3 
        ? [{ x: 260, y: 720 }, { x: 760, y: 720 }, { x: 1260, y: 720 }]
        : parts.length === 4
        ? [{ x: 160, y: 720 }, { x: 560, y: 720 }, { x: 960, y: 720 }, { x: 1360, y: 720 }]
        : [{ x: 460, y: 720 }, { x: 1060, y: 720 }]; // fallback for 2

      parts.forEach((part, i) => {
        const startFrame = beats.parts + i * BEAT * 0.8;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 30, 1);
        const pos = positions[i] || positions[0];

        const partFrame = rc.rectangle(pos.x, pos.y, 380, 180, {
          stroke: i === 0 ? colors.accent2 : i === 1 ? colors.accent3 : colors.accent,
          strokeWidth: 4,
          roughness: 0.8,
          bowing: 2,
          fill: `${i === 0 ? colors.accent2 : i === 1 ? colors.accent3 : colors.accent}08`,
          fillStyle: 'hachure',
          hachureGap: 12,
        });

        // Animate stroke
        const paths = partFrame.querySelectorAll('path');
        paths.forEach(path => {
          const length = path.getTotalLength();
          path.style.strokeDasharray = length;
          path.style.strokeDashoffset = length * (1 - progress);
        });

        svg.appendChild(partFrame);
      });
    }

    // Connecting lines (center to parts)
    if (frame >= beats.connections) {
      const centerX = 960;
      const centerY = 560; // Bottom of center frame

      parts.forEach((part, i) => {
        const startFrame = beats.connections + i * 10;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 25, 1);

        // Calculate target position
        const positions = parts.length === 3 
          ? [{ x: 450, y: 720 }, { x: 950, y: 720 }, { x: 1450, y: 720 }]
          : parts.length === 4
          ? [{ x: 350, y: 720 }, { x: 750, y: 720 }, { x: 1150, y: 720 }, { x: 1550, y: 720 }]
          : [{ x: 650, y: 720 }, { x: 1250, y: 720 }];

        const target = positions[i] || positions[0];

        // Bezier curve path
        const midY = centerY + (target.y - centerY) * 0.5;
        const pathData = `M ${centerX} ${centerY} Q ${centerX} ${midY} ${centerX + (target.x - centerX) * progress} ${centerY + (target.y - centerY) * progress}`;

        const connector = rc.path(pathData, {
          stroke: `${colors.ink}40`,
          strokeWidth: 3,
          roughness: 0.7,
          bowing: 2,
        });

        svg.appendChild(connector);
      });
    }

  }, [frame, beats, colors, parts]);

  // Build-in animation
  const buildIn = (startFrame, duration = 30) => {
    if (frame < startFrame) {
      return {
        opacity: 0,
        transform: 'translateY(-20px) scale(0.92)',
      };
    }
    if (frame >= startFrame + duration) {
      return {
        opacity: 1,
        transform: 'translateY(0) scale(1)',
      };
    }

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.back(1.5)), extrapolateRight: 'clamp' }
    );

    return {
      opacity: progress,
      transform: `translateY(${-20 * (1 - progress)}px) scale(${0.92 + progress * 0.08})`,
    };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 30% 40%, ${colors.accent}04 0%, transparent 60%),
          url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulance baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")
        `,
      }}
    >
      {/* Rough.js sketch layer */}
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
      <AbsoluteFill style={{ transform: `scale(${cameraZoom})` }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '80px 120px',
          }}
        >
          {/* Title */}
          {frame >= beats.title && (
            <div style={{ ...buildIn(beats.title, 28) }}>
              <h2
                style={{
                  fontFamily: THEME.fonts.marker.secondary,
                  fontSize: 52,
                  fontWeight: 700,
                  color: colors.ink,
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                {data.title || 'Breaking It Down'}
              </h2>
            </div>
          )}

          {/* Center concept */}
          {frame >= beats.centerConcept + 10 && (
            <div
              style={{
                position: 'absolute',
                top: 440,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 380,
                textAlign: 'center',
                ...buildIn(beats.centerConcept + 10, 35),
              }}
            >
              <h3
                style={{
                  fontFamily: THEME.fonts.structure.primary,
                  fontSize: 46,
                  fontWeight: 600,
                  color: colors.accent,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {data.concept || 'Main Concept'}
              </h3>
            </div>
          )}

          {/* Part cards */}
          {parts.map((part, i) => {
            const startFrame = beats.parts + i * BEAT * 0.8 + 10;
            if (frame < startFrame) return null;

            const positions = parts.length === 3 
              ? [{ x: 270, y: 740 }, { x: 770, y: 740 }, { x: 1270, y: 740 }]
              : parts.length === 4
              ? [{ x: 170, y: 740 }, { x: 570, y: 740 }, { x: 970, y: 740 }, { x: 1370, y: 740 }]
              : [{ x: 470, y: 740 }, { x: 1070, y: 740 }];

            const pos = positions[i] || positions[0];
            const partColor = i === 0 ? colors.accent2 : i === 1 ? colors.accent3 : colors.accent;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: pos.y,
                  left: pos.x,
                  width: 360,
                  padding: '20px',
                  ...buildIn(startFrame, 35),
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <h4
                    style={{
                      fontFamily: THEME.fonts.structure.primary,
                      fontSize: 28,
                      fontWeight: 700,
                      color: partColor,
                      margin: 0,
                    }}
                  >
                    {part.label || `Part ${i + 1}`}
                  </h4>
                  <p
                    style={{
                      fontFamily: THEME.fonts.structure.secondary,
                      fontSize: 20,
                      color: colors.ink,
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {part.description || '...'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Explain2AConceptBreakdown };
export const EXPLAIN_2A_DURATION_MIN = 20 * 30;
export const EXPLAIN_2A_DURATION_MAX = 40 * 30;
export const EXPLAIN_2A_EXIT_TRANSITION = 18;
