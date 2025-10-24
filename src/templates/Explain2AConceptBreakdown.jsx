import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import rough from 'roughjs/bundled/rough.esm.js';
import gsap from 'gsap';
import {
  staggeredBullets,
  gracefulMove,
  pulseEmphasis,
  cascadeReveal,
} from '../utils/gsapAnimations';

/**
 * EXPLAIN 2A: CONCEPT BREAKDOWN (GSAP V2)
 * 
 * Intent: Break complex concept into clear, digestible parts
 * Pattern: "X is made of Y, Z, A..."
 * Visual: Branching structure, labeled nodes, connecting paths
 * Tone: Clear, Structured
 * Duration: 20-40s
 * 
 * GSAP Features:
 * - Staggered bullet reveals for parts
 * - Mid-scene: Title moves to top, parts expand
 * - Pulse emphasis on connections
 * 
 * NO BOXES - Rough sketched frames + organic connector lines
 */

const Explain2AConceptBreakdown = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const titleRef = useRef(null);
  const centerConceptRef = useRef(null);
  const partsRefs = useRef([]);
  
  const [triggeredAnimations, setTriggeredAnimations] = useState({
    title: false,
    centerConcept: false,
    parts: false,
    connections: false,
    moveTitle: false,
    expandParts: false,
  });

  const colors = scene.style_tokens?.colors || {
    bg: '#FFF9F0',
    accent: '#3498DB',
    accent2: '#2ECC71',
    accent3: '#9B59B6',
    ink: '#1A1A1A',
  };
  
  const fonts = scene.style_tokens?.fonts || {
    primary: "'Cabin Sketch', cursive",
    secondary: "'Patrick Hand', cursive",
    size_title: 52,
    size_concept: 46,
    size_part_label: 28,
    size_part_desc: 20,
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
    moveTitle: BEAT * (4 + parts.length * 0.9),     // NEW: Mid-scene
    expandParts: BEAT * (4.5 + parts.length * 0.9), // NEW: Emphasis
    settle: BEAT * (5 + parts.length),
  };

  // Camera - gentle focus
  const cameraZoom = interpolate(
    frame,
    [0, beats.centerConcept, beats.settle],
    [1.05, 1.0, 1.02],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateRight: 'clamp' }
  );

  // ========================================
  // GSAP ANIMATION TRIGGERS
  // ========================================
  
  // Title appears
  useEffect(() => {
    if (frame >= beats.title && !triggeredAnimations.title && titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: -20, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.5)" }
      );
      setTriggeredAnimations(prev => ({ ...prev, title: true }));
    }
  }, [frame, beats.title, triggeredAnimations.title]);

  // Center concept appears
  useEffect(() => {
    if (frame >= beats.centerConcept + 10 && !triggeredAnimations.centerConcept && centerConceptRef.current) {
      gsap.fromTo(centerConceptRef.current,
        { opacity: 0, y: -30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "back.out(1.5)" }
      );
      setTriggeredAnimations(prev => ({ ...prev, centerConcept: true }));
    }
  }, [frame, beats.centerConcept, triggeredAnimations.centerConcept]);

  // Parts stagger in
  useEffect(() => {
    if (frame >= beats.parts + 10 && !triggeredAnimations.parts) {
      const validRefs = partsRefs.current.filter(Boolean);
      if (validRefs.length > 0) {
        staggeredBullets(validRefs, {
          duration: 0.7,
          stagger: 0.2,
          direction: "up",
          distance: 40,
          ease: "back.out(1.5)",
        });
        setTriggeredAnimations(prev => ({ ...prev, parts: true }));
      }
    }
  }, [frame, beats.parts, triggeredAnimations.parts]);

  // Pulse connections
  useEffect(() => {
    if (frame >= beats.connections + 15 && !triggeredAnimations.connections && svgRef.current) {
      pulseEmphasis(svgRef.current, {
        scale: 1.02,
        duration: 0.5,
        repeat: 1,
        yoyo: true,
      });
      setTriggeredAnimations(prev => ({ ...prev, connections: true }));
    }
  }, [frame, beats.connections, triggeredAnimations.connections]);

  // MID-SCENE: Move title to top
  useEffect(() => {
    if (frame >= beats.moveTitle && !triggeredAnimations.moveTitle && titleRef.current) {
      gracefulMove(titleRef.current, {
        y: -100,
        scale: 0.75,
        duration: 1.2,
        ease: "power3.inOut",
      });
      setTriggeredAnimations(prev => ({ ...prev, moveTitle: true }));
    }
  }, [frame, beats.moveTitle, triggeredAnimations.moveTitle]);

  // Expand parts slightly for emphasis
  useEffect(() => {
    if (frame >= beats.expandParts && !triggeredAnimations.expandParts) {
      const validRefs = partsRefs.current.filter(Boolean);
      if (validRefs.length > 0) {
        validRefs.forEach((ref, i) => {
          setTimeout(() => {
            pulseEmphasis(ref, {
              scale: 1.05,
              duration: 0.4,
              repeat: 1,
              yoyo: true,
            });
          }, i * 100);
        });
        setTriggeredAnimations(prev => ({ ...prev, expandParts: true }));
      }
    }
  }, [frame, beats.expandParts, triggeredAnimations.expandParts]);

  // Generate rough.js breakdown structure - ZERO WOBBLE
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    // Clear previous
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Center concept frame (main node) - ZERO WOBBLE
    if (frame >= beats.centerConcept) {
      const progress = Math.min((frame - beats.centerConcept) / 35, 1);
      
      const centerFrame = rc.rectangle(760, 420, 400, 140, {
        stroke: colors.accent,
        strokeWidth: 5,
        roughness: 0,  // ZERO WOBBLE
        bowing: 0,     // ZERO WOBBLE
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

    // Part frames (breakdown nodes) - ZERO WOBBLE
    if (frame >= beats.parts) {
      const positions = parts.length === 3 
        ? [{ x: 260, y: 720 }, { x: 760, y: 720 }, { x: 1260, y: 720 }]
        : parts.length === 4
        ? [{ x: 160, y: 720 }, { x: 560, y: 720 }, { x: 960, y: 720 }, { x: 1360, y: 720 }]
        : [{ x: 460, y: 720 }, { x: 1060, y: 720 }];

      parts.forEach((part, i) => {
        const startFrame = beats.parts + i * BEAT * 0.8;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 30, 1);
        const pos = positions[i] || positions[0];

        const partFrame = rc.rectangle(pos.x, pos.y, 380, 180, {
          stroke: i === 0 ? colors.accent2 : i === 1 ? colors.accent3 : colors.accent,
          strokeWidth: 4,
          roughness: 0,  // ZERO WOBBLE
          bowing: 0,     // ZERO WOBBLE
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

    // Connecting lines (center to parts) - ZERO WOBBLE
    if (frame >= beats.connections) {
      const centerX = 960;
      const centerY = 560;

      parts.forEach((part, i) => {
        const startFrame = beats.connections + i * 10;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 25, 1);

        const positions = parts.length === 3 
          ? [{ x: 450, y: 720 }, { x: 950, y: 720 }, { x: 1450, y: 720 }]
          : parts.length === 4
          ? [{ x: 350, y: 720 }, { x: 750, y: 720 }, { x: 1150, y: 720 }, { x: 1550, y: 720 }]
          : [{ x: 650, y: 720 }, { x: 1250, y: 720 }];

        const target = positions[i] || positions[0];

        const midY = centerY + (target.y - centerY) * 0.5;
        const pathData = `M ${centerX} ${centerY} Q ${centerX} ${midY} ${centerX + (target.x - centerX) * progress} ${centerY + (target.y - centerY) * progress}`;

        const connector = rc.path(pathData, {
          stroke: `${colors.ink}40`,
          strokeWidth: 3,
          roughness: 0,  // ZERO WOBBLE
          bowing: 0,     // ZERO WOBBLE
        });

        svg.appendChild(connector);
      });
    }

  }, [frame, beats, colors, parts]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 30% 40%, ${colors.accent}04 0%, transparent 60%)
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
            <div ref={titleRef} style={{ opacity: 0 }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_title,
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
              ref={centerConceptRef}
              style={{
                position: 'absolute',
                top: 440,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 380,
                textAlign: 'center',
                opacity: 0,
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_concept,
                  fontWeight: 700,
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
                ref={el => partsRefs.current[i] = el}
                style={{
                  position: 'absolute',
                  top: pos.y,
                  left: pos.x,
                  width: 360,
                  padding: '20px',
                  opacity: 0,
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
                      fontFamily: fonts.primary,
                      fontSize: fonts.size_part_label,
                      fontWeight: 700,
                      color: partColor,
                      margin: 0,
                    }}
                  >
                    {part.label || `Part ${i + 1}`}
                  </h4>
                  <p
                    style={{
                      fontFamily: fonts.secondary,
                      fontSize: fonts.size_part_desc,
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
