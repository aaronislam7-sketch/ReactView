import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
// import gsap from 'gsap';
import {
  pulseEmphasis,
  cascadeReveal,
} from '../utils/gsapAnimations';

/**
 * REFLECT 4A: KEY TAKEAWAYS (TED-ED Style V4)
 * 
 * Intent: Summarize core lessons in memorable list
 * Pattern: "Remember these X things..."
 * Visual: Numbered list with ROUGH ANNOTATE emphasis, 1-liners + subtext
 * Tone: Clear, Affirming
 * Duration: 20-35s
 * 
 * NEW FEATURES:
 * - ✅ Rough.js annotate emphasis (circles, underlines, boxes)
 * - ✅ Dynamic 1-liners with subtext structure
 * - ✅ Improved emphasis timing (stagger + annotate)
 * - ✅ Permanent Marker font
 * - ✅ Bold accent colors
 * - ✅ Zero wobble on structure, rough on annotations
 * - ✅ Soft exit to next module
 * 
 * Structure per takeaway:
 * - Number
 * - 1-liner (main point)
 * - Subtext (optional detail)
 * - Rough annotation (circle/underline/box)
 */

const Reflect4AKeyTakeaways = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const titleRef = useRef(null);
  const takeawayRefs = useRef([]);

  const [triggeredAnimations, setTriggeredAnimations] = useState({
    title: false,
    takeaways: false,
    annotations: false,
    softExit: false,
  });

  const colors = scene.style_tokens?.colors || {
    bg: '#FAFBFC',
    accent: '#27AE60',    // Green
    accent2: '#2E7FE4',   // Blue
    accent3: '#FF6B35',   // Bold orange
    ink: '#1A1A1A',
  };

  const fonts = scene.style_tokens?.fonts || {
    primary: THEME.fonts.marker.primary,  // Permanent Marker
    secondary: THEME.fonts.structure.primary,
    size_title: 54,
    size_number: 42,
    size_oneliner: 32,
    size_subtext: 22,
  };

  const data = scene.fill?.reflection || {};
  const takeaways = data.takeaways || [];

  // Beat timing - TED-ED style
  const BEAT = 30;
  const beats = {
    prelude: 0,
    title: BEAT * 0.8,
    takeaways: BEAT * 2.2,
    annotations: BEAT * (2.2 + takeaways.length * 1.0),  // Annotate after all appear
    softExit: BEAT * (4 + takeaways.length * 1.2),
    settle: BEAT * (5 + takeaways.length * 1.2),
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

  // Takeaways stagger in
  useEffect(() => {
    if (frame >= beats.takeaways && !triggeredAnimations.takeaways) {
      takeawayRefs.current.forEach((ref, i) => {
        if (ref) {
          setTimeout(() => {
            gsap.fromTo(ref,
              { opacity: 0, x: -40, scale: 0.95 },
              { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "back.out(1.5)" }
            );
          }, i * 300);
        }
      });
      setTriggeredAnimations(prev => ({ ...prev, takeaways: true }));
    }
  }, [frame, beats.takeaways, triggeredAnimations.takeaways]);

  // Annotations pulse in
  useEffect(() => {
    if (frame >= beats.annotations && !triggeredAnimations.annotations) {
      takeawayRefs.current.forEach((ref, i) => {
        if (ref) {
          setTimeout(() => {
            pulseEmphasis(ref, {
              scale: 1.02,
              duration: 0.4,
              repeat: 1,
              yoyo: true,
            });
          }, i * 200);
        }
      });
      setTriggeredAnimations(prev => ({ ...prev, annotations: true }));
    }
  }, [frame, beats.annotations, triggeredAnimations.annotations]);

  // rough.js elements - ZERO WOBBLE on structure, ROUGH on annotations
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Takeaway frames (clean structure)
    if (frame >= beats.takeaways) {
      takeaways.forEach((takeaway, i) => {
        const startFrame = beats.takeaways + i * BEAT * 1.0;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 30, 1);
        const yPos = 280 + i * 180;

        const colorIndex = i % 3;
        const takeawayColor = colorIndex === 0 ? colors.accent : colorIndex === 1 ? colors.accent2 : colors.accent3;

        // Background frame (subtle)
        const bgFrame = rc.rectangle(180, yPos, 1560 * progress, 150, {
          stroke: `${takeawayColor}30`,
          strokeWidth: 3,
          roughness: 0,  // ZERO WOBBLE on structure
          bowing: 0,
          fill: `${takeawayColor}05`,
          fillStyle: 'solid',
        });

        const paths = bgFrame.querySelectorAll('path');
        paths.forEach(path => {
          const length = path.getTotalLength();
          path.style.strokeDasharray = length;
          path.style.strokeDashoffset = length * (1 - progress);
        });

        svg.appendChild(bgFrame);
      });
    }

    // ROUGH ANNOTATIONS (circles, underlines, emphasis) - ROUGH STYLE
    if (frame >= beats.annotations) {
      takeaways.forEach((takeaway, i) => {
        const startFrame = beats.annotations + i * 15;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 25, 1);
        const yPos = 355 + i * 180;

        const colorIndex = i % 3;
        const annotColor = colorIndex === 0 ? colors.accent : colorIndex === 1 ? colors.accent2 : colors.accent3;

        // Annotation style varies by index
        const annotStyle = i % 3;

        if (annotStyle === 0) {
          // Circle annotation around number
          const circle = rc.circle(280, yPos - 45, 70 * progress, {
            stroke: annotColor,
            strokeWidth: 4,
            roughness: 1.2,  // ROUGH for annotation
            bowing: 3,
            fill: 'none',
          });
          svg.appendChild(circle);
        } else if (annotStyle === 1) {
          // Underline annotation under 1-liner
          const underlineWidth = 800 * progress;
          const underline = rc.line(350, yPos - 10, 350 + underlineWidth, yPos - 8, {
            stroke: annotColor,
            strokeWidth: 5,
            roughness: 1.0,  // ROUGH for annotation
            bowing: 2,
          });
          svg.appendChild(underline);
        } else {
          // Box annotation around entire takeaway
          const box = rc.rectangle(190, yPos - 70, 1540 * progress, 140, {
            stroke: annotColor,
            strokeWidth: 4,
            roughness: 1.3,  // ROUGH for annotation
            bowing: 4,
            fill: 'none',
          });
          svg.appendChild(box);
        }
      });
    }

    // Soft exit decoration
    if (frame >= beats.softExit) {
      const exitProgress = Math.min((frame - beats.softExit) / 30, 1);
      
      // Gentle arrow pointing forward
      const arrowPath = `M 860 ${950 - 20 * (1 - exitProgress)} L ${860 + 200 * exitProgress} ${950 - 20 * (1 - exitProgress)}`;
      const arrow = rc.path(arrowPath, {
        stroke: `${colors.accent2}60`,
        strokeWidth: 5,
        roughness: 0.8,
        bowing: 2,
      });
      svg.appendChild(arrow);

      // Arrowhead
      if (exitProgress > 0.6) {
        const headProgress = (exitProgress - 0.6) / 0.4;
        const headPath = `M 1060 930 L ${1060 - 20 * headProgress} ${930 - 15 * headProgress} M 1060 930 L ${1060 - 20 * headProgress} ${930 + 15 * headProgress}`;
        const head = rc.path(headPath, {
          stroke: `${colors.accent2}60`,
          strokeWidth: 5,
          roughness: 0.8,
          bowing: 1,
        });
        svg.appendChild(head);
      }
    }

  }, [frame, beats, colors, takeaways]);

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
        <div style={{ position: 'relative', width: '100%', height: '100%', padding: '100px 150px' }}>
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
                {data.title || 'Key Takeaways'}
              </h2>
            </div>
          )}

          {/* Takeaways - DYNAMIC 1-LINERS + SUBTEXT */}
          {takeaways.map((takeaway, i) => {
            const startFrame = beats.takeaways + i * BEAT * 1.0 + 12;
            if (frame < startFrame) return null;

            const yPos = 310 + i * 180;
            const colorIndex = i % 3;
            const takeawayColor = colorIndex === 0 ? colors.accent : colorIndex === 1 ? colors.accent2 : colors.accent3;

            // Support both string and object format
            const isObject = typeof takeaway === 'object';
            const mainText = isObject ? takeaway.main : takeaway;
            const subText = isObject ? takeaway.sub : null;

            return (
              <div
                key={i}
                ref={el => takeawayRefs.current[i] = el}
                style={{
                  position: 'absolute',
                  top: yPos,
                  left: 200,
                  width: 1520,
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                }}
              >
                {/* Number */}
                <div
                  style={{
                    fontFamily: fonts.primary,
                    fontSize: fonts.size_number,
                    fontWeight: 400,
                    color: takeawayColor,
                    minWidth: 60,
                  }}
                >
                  {i + 1}.
                </div>
                
                {/* Content */}
                <div style={{ flex: 1 }}>
                  {/* 1-liner */}
                  <h3
                    style={{
                      fontFamily: fonts.primary,
                      fontSize: fonts.size_oneliner,
                      fontWeight: 400,
                      color: colors.ink,
                      margin: '0 0 8px 0',
                      lineHeight: 1.3,
                    }}
                  >
                    {mainText}
                  </h3>
                  
                  {/* Subtext */}
                  {subText && (
                    <p
                      style={{
                        fontFamily: fonts.secondary,
                        fontSize: fonts.size_subtext,
                        color: `${colors.ink}70`,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {subText}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Soft exit message */}
          {frame >= beats.softExit + 10 && (
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                opacity: interpolate(
                  frame,
                  [beats.softExit + 10, beats.softExit + 35],
                  [0, 1],
                  { extrapolateRight: 'clamp' }
                ),
              }}
            >
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: 26,
                  color: `${colors.ink}70`,
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                {data.exitMessage || 'Ready to move forward...'}
              </p>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Reflect4AKeyTakeaways };
export const REFLECT_4A_DURATION_MIN = 20 * 30;
export const REFLECT_4A_DURATION_MAX = 35 * 30;
export const REFLECT_4A_EXIT_TRANSITION = 15;
