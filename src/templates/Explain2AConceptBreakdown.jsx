import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
// import gsap from 'gsap';
// import {
//   staggeredBullets,
//   gracefulMove,
//   pulseEmphasis,
//   cascadeReveal,
// } from '../utils/gsapAnimations';

/**
 * EXPLAIN 2A: CONCEPT BREAKDOWN (TED-ED Style V4)
 * 
 * Intent: Break complex concept into clear, digestible parts
 * Pattern: "X is made of Y, Z, A..."
 * Visual: Branching structure, labeled nodes, PULSING connecting paths
 * Tone: Clear, Structured
 * Duration: 20-40s
 * 
 * NEW FEATURES:
 * - ✅ Fully dynamic layout (2-7+ parts, adapts intelligently)
 * - ✅ PULSING connection lines that emphasize relationships
 * - ✅ Permanent Marker font for brand energy
 * - ✅ Bold accent colors
 * - ✅ Zero wobble, subtle breathe animations
 * - ✅ Lines pulse/move to show connection emphasis
 * 
 * DYNAMIC RENDERING:
 * - 2-4 parts: Single row
 * - 5-6 parts: Two rows (3 + 2/3)
 * - 7+ parts: Two rows (4 + 3)
 */

const Explain2AConceptBreakdown = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const titleRef = useRef(null);
  const centerConceptRef = useRef(null);
  const partsRefs = useRef([]);
  const connectionRefs = useRef([]);
  
  const [triggeredAnimations, setTriggeredAnimations] = useState({
    title: false,
    centerConcept: false,
    parts: false,
    connections: false,
    moveTitle: false,
    expandParts: false,
    pulseConnections: false,
  });

  const colors = scene.style_tokens?.colors || {
    bg: '#FFF9F0',
    accent: '#FF6B35',     // Bold orange
    accent2: '#2ECC71',
    accent3: '#9B59B6',    // Bold purple
    ink: '#1A1A1A',
  };
  
  const fonts = scene.style_tokens?.fonts || {
    primary: THEME.fonts.marker.primary,  // Permanent Marker
    secondary: THEME.fonts.structure.primary,
    size_title: 56,
    size_concept: 48,
    size_part_label: 30,
    size_part_desc: 22,
  };

  const data = scene.fill?.concept || {};
  const parts = data.parts || [];
  
  // INTELLIGENT DYNAMIC LAYOUT - Works for 2-7+ parts
  const getAdaptiveLayout = (count) => {
    const boxWidth = 340;
    const boxHeight = 160;
    const totalWidth = 1920;
    const totalHeight = 1080;
    const margin = 80;
    
    // 2-4 parts: Single row
    if (count <= 4) {
      const availableWidth = totalWidth - (margin * 2);
      const spacing = (availableWidth - (boxWidth * count)) / Math.max(count - 1, 1);
      
      return Array.from({ length: count }, (_, i) => ({
        x: margin + (boxWidth + spacing) * i + boxWidth / 2,
        y: 750,
        row: 0,
      }));
    }
    
    // 5-6 parts: Two rows
    if (count <= 6) {
      const row1Count = Math.ceil(count / 2);
      const row2Count = count - row1Count;
      const positions = [];
      
      // Row 1
      const availableWidth1 = totalWidth - (margin * 2);
      const spacing1 = (availableWidth1 - (boxWidth * row1Count)) / Math.max(row1Count - 1, 1);
      for (let i = 0; i < row1Count; i++) {
        positions.push({
          x: margin + (boxWidth + spacing1) * i + boxWidth / 2,
          y: 650,
          row: 0,
        });
      }
      
      // Row 2 (centered)
      const availableWidth2 = totalWidth - (margin * 2);
      const spacing2 = (availableWidth2 - (boxWidth * row2Count)) / Math.max(row2Count - 1, 1);
      const offsetX = (totalWidth - (boxWidth * row2Count + spacing2 * (row2Count - 1))) / 2;
      for (let i = 0; i < row2Count; i++) {
        positions.push({
          x: offsetX + (boxWidth + spacing2) * i + boxWidth / 2,
          y: 850,
          row: 1,
        });
      }
      
      return positions;
    }
    
    // 7+ parts: Two rows (4 + remaining)
    const row1Count = 4;
    const row2Count = count - row1Count;
    const positions = [];
    
    // Row 1
    const availableWidth1 = totalWidth - (margin * 2);
    const spacing1 = (availableWidth1 - (boxWidth * row1Count)) / Math.max(row1Count - 1, 1);
    for (let i = 0; i < row1Count; i++) {
      positions.push({
        x: margin + (boxWidth + spacing1) * i + boxWidth / 2,
        y: 650,
        row: 0,
      });
    }
    
    // Row 2
    const availableWidth2 = totalWidth - (margin * 2);
    const spacing2 = (availableWidth2 - (boxWidth * row2Count)) / Math.max(row2Count - 1, 1);
    const offsetX = (totalWidth - (boxWidth * row2Count + spacing2 * (row2Count - 1))) / 2;
    for (let i = 0; i < row2Count; i++) {
      positions.push({
        x: offsetX + (boxWidth + spacing2) * i + boxWidth / 2,
        y: 850,
        row: 1,
      });
    }
    
    return positions;
  };

  // Beat timing - methodical reveal
  const BEAT = 30;
  const beats = {
    prelude: 0,
    title: BEAT * 0.8,
    centerConcept: BEAT * 2,
    parts: BEAT * 3.5,
    connections: BEAT * (3.5 + parts.length * 0.6),
    pulseConnections: BEAT * (4 + parts.length * 0.7),  // NEW: Pulse emphasis
    moveTitle: BEAT * (4.5 + parts.length * 0.8),
    expandParts: BEAT * (5 + parts.length * 0.9),
    settle: BEAT * (5.5 + parts.length),
  };

  // Subtle camera drift
  const cameraDrift = {
    x: Math.sin(frame * 0.007) * 2,
    y: Math.cos(frame * 0.006) * 1.5,
  };

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
          stagger: 0.15,
          direction: "up",
          distance: 40,
          ease: "back.out(1.5)",
        });
        setTriggeredAnimations(prev => ({ ...prev, parts: true }));
      }
    }
  }, [frame, beats.parts, triggeredAnimations.parts, parts.length]);

  // PULSE CONNECTIONS - Emphasize the relationships!
  useEffect(() => {
    if (frame >= beats.pulseConnections && !triggeredAnimations.pulseConnections) {
      // Pulse each connection line sequentially
      connectionRefs.current.forEach((ref, i) => {
        if (ref) {
          setTimeout(() => {
            gsap.to(ref, {
              strokeWidth: 5,
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
              yoyo: true,
              repeat: 2,
            });
          }, i * 150);
        }
      });
      setTriggeredAnimations(prev => ({ ...prev, pulseConnections: true }));
    }
  }, [frame, beats.pulseConnections, triggeredAnimations.pulseConnections]);

  // MID-SCENE: Move title to top
  useEffect(() => {
    if (frame >= beats.moveTitle && !triggeredAnimations.moveTitle && titleRef.current) {
      gracefulMove(titleRef.current, {
        y: -80,
        scale: 0.8,
        duration: 1.0,
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
              scale: 1.03,
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

    // Clear connection refs
    connectionRefs.current = [];

    // Center concept frame (main node) - ZERO WOBBLE
    if (frame >= beats.centerConcept) {
      const progress = Math.min((frame - beats.centerConcept) / 35, 1);
      
      const centerFrame = rc.rectangle(760, 380, 400, 160, {
        stroke: colors.accent,
        strokeWidth: 5,
        roughness: 0,  // ZERO WOBBLE
        bowing: 0,     // ZERO WOBBLE
        fill: `${colors.accent}12`,
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

    // Part frames (breakdown nodes) - ZERO WOBBLE - FULLY DYNAMIC LAYOUT
    if (frame >= beats.parts) {
      const positions = getAdaptiveLayout(parts.length);

      parts.forEach((part, i) => {
        const startFrame = beats.parts + i * BEAT * 0.6;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 30, 1);
        const pos = positions[i];

        // Cycle through colors
        const colorIndex = i % 3;
        const partColor = colorIndex === 0 ? colors.accent2 : colorIndex === 1 ? colors.accent3 : colors.accent;

        const partFrame = rc.rectangle(pos.x - 170, pos.y - 80, 340, 160, {
          stroke: partColor,
          strokeWidth: 4,
          roughness: 0,  // ZERO WOBBLE
          bowing: 0,     // ZERO WOBBLE
          fill: `${partColor}08`,
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

    // Connecting lines (center to parts) - ZERO WOBBLE - WITH PULSE ANIMATION
    if (frame >= beats.connections) {
      const centerX = 960;
      const centerY = 540;
      const positions = getAdaptiveLayout(parts.length);

      parts.forEach((part, i) => {
        const startFrame = beats.connections + i * 10;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 25, 1);
        const target = positions[i];

        // Pulse animation after initial draw
        const isPulsing = frame >= beats.pulseConnections;
        const pulseProgress = isPulsing ? (Math.sin((frame - beats.pulseConnections + i * 10) * 0.1) + 1) / 2 : 0;
        
        const midY = centerY + (target.y - centerY) * 0.5;
        const pathData = `M ${centerX} ${centerY} Q ${centerX} ${midY} ${centerX + (target.x - centerX) * progress} ${centerY + (target.y - centerY) * progress}`;

        const strokeWidth = isPulsing ? 3 + pulseProgress * 2 : 3;
        const opacity = isPulsing ? 0.4 + pulseProgress * 0.3 : 0.4;

        const connector = rc.path(pathData, {
          stroke: `${colors.ink}`,
          strokeWidth: strokeWidth,
          roughness: 0,  // ZERO WOBBLE
          bowing: 0,     // ZERO WOBBLE
        });

        connector.style.opacity = opacity;
        
        // Store reference for GSAP animations
        const connectorPaths = connector.querySelectorAll('path');
        connectorPaths.forEach(path => {
          connectionRefs.current.push(path);
        });

        svg.appendChild(connector);

        // Arrow indicator at end of connection
        if (progress > 0.8) {
          const arrowProgress = (progress - 0.8) / 0.2;
          const arrowX = target.x;
          const arrowY = target.y - 80;
          const arrowSize = 12 * arrowProgress;
          
          const arrowPath = `M ${arrowX} ${arrowY} L ${arrowX - arrowSize} ${arrowY - arrowSize * 1.5} L ${arrowX + arrowSize} ${arrowY - arrowSize * 1.5} Z`;
          const arrow = rc.path(arrowPath, {
            stroke: colors.ink,
            strokeWidth: 2,
            roughness: 0,
            bowing: 0,
            fill: `${colors.ink}60`,
            fillStyle: 'solid',
          });
          svg.appendChild(arrow);
        }
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
          transform: `translate(${cameraDrift.x}px, ${cameraDrift.y}px)`,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Content layer */}
      <AbsoluteFill style={{ transform: `translate(${cameraDrift.x}px, ${cameraDrift.y}px)` }}>
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
                  fontWeight: 400,
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
                top: 400,
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
                  fontWeight: 400,
                  color: colors.accent,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {data.concept || 'Main Concept'}
              </h3>
            </div>
          )}

          {/* Part cards - FULLY DYNAMIC LAYOUT (works for 2-7+ parts) */}
          {parts.map((part, i) => {
            const startFrame = beats.parts + i * BEAT * 0.6 + 10;
            if (frame < startFrame) return null;

            const positions = getAdaptiveLayout(parts.length);
            const pos = positions[i];
            
            // Cycle through colors for visual variety
            const colorIndex = i % 3;
            const partColor = colorIndex === 0 ? colors.accent2 : colorIndex === 1 ? colors.accent3 : colors.accent;

            return (
              <div
                key={i}
                ref={el => partsRefs.current[i] = el}
                style={{
                  position: 'absolute',
                  top: pos.y,
                  left: pos.x,
                  transform: 'translate(-50%, -50%)',
                  width: 320,
                  padding: '16px',
                  opacity: 0, // GSAP animates to 1
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
                      fontWeight: 400,
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
