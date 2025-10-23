import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

/**
 * HOOK 1A: QUESTION BURST
 * 
 * Intent: Pose provocative question to focus attention and frame the lesson
 * Pattern: "Ever wondered why...?" / "What if...?"
 * Visual: Write-on headline, kinetic type, soft background texture
 * Tone: Neutral, Thoughtful
 * Duration: 10-20s
 * 
 * NO BOXES - Pure hand-drawn sketch aesthetic with rough.js!
 * Kinetic, dynamic type with anime.js feel (via Remotion)
 */

const Hook1AQuestionBurst = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const [roughElements, setRoughElements] = useState([]);

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.primary,
    accent: THEME.colors.markers.red,
    accent2: THEME.colors.markers.orange,
    ink: THEME.colors.text.primary,
  };

  const texts = scene.fill?.texts || {};

  // Beat timing - thoughtful rhythm
  const BEAT = 36; // 1.2s
  const beats = {
    prelude: 0,
    questionPart1: BEAT * 0.8,
    underline1: BEAT * 2,
    questionPart2: BEAT * 2.4,
    underline2: BEAT * 3.6,
    accentCircle: BEAT * 4.2,
    sparkBurst: BEAT * 5,
    subtitle: BEAT * 6,
    settle: BEAT * 7.5,
  };

  // Camera - gentle zoom and drift
  const cameraZoom = interpolate(
    frame,
    [0, beats.questionPart1, beats.sparkBurst, beats.settle],
    [1.05, 1.0, 1.03, 1.0],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cameraDrift = {
    x: Math.sin(frame * 0.006) * 4,
    y: Math.cos(frame * 0.005) * 3,
  };

  // Generate rough.js sketches
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);
    const elements = [];

    // Clear previous sketches
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Sketch underline 1 (under first question part)
    if (frame >= beats.underline1) {
      const progress = Math.min((frame - beats.underline1) / 28, 1);
      const underline1 = rc.line(220, 310, 220 + 700 * progress, 315, {
        stroke: colors.accent,
        strokeWidth: 6,
        roughness: 0.8,
        bowing: 2,
      });
      svg.appendChild(underline1);
    }

    // Sketch underline 2 (under second part)
    if (frame >= beats.underline2) {
      const progress = Math.min((frame - beats.underline2) / 28, 1);
      const underline2 = rc.line(280, 430, 280 + 820 * progress, 438, {
        stroke: colors.accent,
        strokeWidth: 7,
        roughness: 1.0,
        bowing: 2,
      });
      svg.appendChild(underline2);
    }

    // Sketch accent circle (organic, not perfect)
    if (frame >= beats.accentCircle) {
      const progress = Math.min((frame - beats.accentCircle) / 35, 1);
      const circumference = 2 * Math.PI * 180;
      
      const circle = rc.circle(960, 540, 360, {
        stroke: `${colors.accent}60`,
        strokeWidth: 5,
        roughness: 0.6,
        bowing: 1,
        fill: 'none',
      });
      
      // Animate via stroke-dashoffset
      const paths = circle.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });
      
      svg.appendChild(circle);
    }

    // Sketch spark bursts (hand-drawn stars)
    if (frame >= beats.sparkBurst) {
      const sparkData = [
        { x: 340, y: 220, size: 35, rotation: 15 },
        { x: 1580, y: 260, size: 40, rotation: -20 },
        { x: 480, y: 820, size: 38, rotation: 25 },
        { x: 1440, y: 850, size: 42, rotation: -15 },
      ];

      sparkData.forEach((spark, i) => {
        const delay = i * 6;
        if (frame < beats.sparkBurst + delay) return;
        
        const progress = Math.min((frame - beats.sparkBurst - delay) / 22, 1);
        const scale = progress;
        
        // Create star path
        const points = 5;
        const outer = spark.size;
        const inner = spark.size * 0.4;
        let pathData = '';
        
        for (let p = 0; p < points * 2; p++) {
          const radius = p % 2 === 0 ? outer : inner;
          const angle = (p * Math.PI) / points - Math.PI / 2 + (spark.rotation * Math.PI / 180);
          const px = spark.x + radius * Math.cos(angle) * scale;
          const py = spark.y + radius * Math.sin(angle) * scale;
          pathData += (p === 0 ? 'M' : ' L') + ` ${px} ${py}`;
        }
        pathData += ' Z';
        
        const star = rc.path(pathData, {
          stroke: colors.accent,
          strokeWidth: 3,
          roughness: 0.8,
          fill: `${colors.accent2}40`,
          fillStyle: 'hachure',
          hachureGap: 8,
          hachureAngle: spark.rotation,
        });
        
        star.style.opacity = progress;
        svg.appendChild(star);
      });
    }

    // Sketch decorative scribbles (organic accents)
    if (frame >= beats.subtitle) {
      // Small sketch accent marks
      const scribbles = [
        { x1: 180, y1: 520, x2: 220, y2: 540 },
        { x1: 1700, y1: 480, x2: 1740, y2: 460 },
      ];

      scribbles.forEach((scrib, i) => {
        const progress = Math.min((frame - beats.subtitle - i * 10) / 20, 1);
        if (progress <= 0) return;

        const scribble = rc.line(
          scrib.x1,
          scrib.y1,
          scrib.x1 + (scrib.x2 - scrib.x1) * progress,
          scrib.y1 + (scrib.y2 - scrib.y1) * progress,
          {
            stroke: `${colors.accent}50`,
            strokeWidth: 4,
            roughness: 1.0,
            bowing: 2,
          }
        );
        svg.appendChild(scribble);
      });
    }

  }, [frame, beats, colors, texts]);

  // Kinetic text reveals
  const kineticReveal = (startFrame, duration = 25, rotation = 0) => {
    if (frame < startFrame) {
      return {
        opacity: 0,
        transform: `translateY(-50px) rotate(${rotation * 3}deg) scale(0.85)`,
      };
    }
    if (frame >= startFrame + duration) {
      return {
        opacity: 1,
        transform: `translateY(0) rotate(${rotation}deg) scale(1)`,
      };
    }

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.back(1.7)), extrapolateRight: 'clamp' }
    );

    return {
      opacity: progress,
      transform: `
        translateY(${-50 * (1 - progress)}px) 
        rotate(${rotation * (3 - progress * 2)}deg) 
        scale(${0.85 + progress * 0.15})
      `,
    };
  };

  // Pen tip following text
  const penTip = (startFrame, duration, xProgress) => {
    if (frame < startFrame || frame >= startFrame + duration) return null;
    
    const progress = (frame - startFrame) / duration;
    
    return {
      left: `${xProgress * 100}%`,
      opacity: 1,
      animation: 'pen-pulse 0.3s ease-in-out infinite',
    };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 25% 35%, ${colors.accent}06 0%, transparent 60%),
          radial-gradient(circle at 75% 70%, ${colors.accent2}05 0%, transparent 55%),
          url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulance baseFrequency='0.65' numOctaves='4'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")
        `,
      }}
    >
      <style>
        {`
          @keyframes pen-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}
      </style>

      {/* Rough.js sketch layer - ALL shapes here */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          transform: `scale(${cameraZoom}) translate(${cameraDrift.x}px, ${cameraDrift.y}px)`,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Content layer with camera motion */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom}) translate(${cameraDrift.x}px, ${cameraDrift.y}px)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '140px 200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Asymmetric!
            justifyContent: 'center',
          }}
        >
          {/* QUESTION PART 1 - Kinetic entrance */}
          {frame >= beats.questionPart1 && (
            <div
              style={{
                position: 'relative',
                marginBottom: 40,
                ...kineticReveal(beats.questionPart1, 28, -2),
              }}
            >
              <h1
                style={{
                  fontFamily: THEME.fonts.marker.secondary,
                  fontSize: 84,
                  fontWeight: 700,
                  color: colors.ink,
                  lineHeight: 1.1,
                  margin: 0,
                  letterSpacing: '-1px',
                  textShadow: `4px 4px 0px ${colors.accent}15`,
                }}
              >
                {texts.questionPart1 || 'What if geography'}
              </h1>

              {/* Pen tip following (only during write-on) */}
              {frame >= beats.questionPart1 && frame < beats.questionPart1 + 28 && (
                <div
                  style={{
                    position: 'absolute',
                    right: -30,
                    top: '50%',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                    transform: 'translateY(-50%)',
                    boxShadow: `0 0 25px ${colors.accent}, 0 0 40px ${colors.accent}60`,
                    animation: 'pen-pulse 0.3s ease-in-out infinite',
                  }}
                />
              )}
            </div>
          )}

          {/* QUESTION PART 2 - Offset, dynamic */}
          {frame >= beats.questionPart2 && (
            <div
              style={{
                position: 'relative',
                marginLeft: 60, // Asymmetric indent
                ...kineticReveal(beats.questionPart2, 28, 1.5),
              }}
            >
              <h1
                style={{
                  fontFamily: THEME.fonts.marker.secondary,
                  fontSize: 92,
                  fontWeight: 700,
                  color: colors.accent,
                  lineHeight: 1.1,
                  margin: 0,
                  letterSpacing: '-2px',
                  textShadow: `5px 5px 0px ${colors.ink}10`,
                }}
              >
                {texts.questionPart2 || 'was measured in mindsets?'}
              </h1>

              {/* Pen tip */}
              {frame >= beats.questionPart2 && frame < beats.questionPart2 + 28 && (
                <div
                  style={{
                    position: 'absolute',
                    right: -30,
                    top: '50%',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                    transform: 'translateY(-50%)',
                    boxShadow: `0 0 25px ${colors.accent}`,
                    animation: 'pen-pulse 0.3s ease-in-out infinite',
                  }}
                />
              )}
            </div>
          )}

          {/* Floating ambient particles - organic movement */}
          {frame >= beats.prelude && (
            <>
              {[...Array(16)].map((_, i) => {
                const seed = i * 137.5; // Golden angle
                const baseY = 150 + (i % 5) * 180;
                const baseX = 180 + (i % 4) * 440;
                const phase = (frame + seed) * 0.015;
                const driftY = Math.sin(phase) * 20;
                const driftX = Math.cos(phase * 0.8) * 15;
                const driftRotate = Math.sin(phase * 1.2) * 10;
                const size = 8 + (i % 4) * 3;
                
                const opacity = interpolate(
                  frame,
                  [beats.prelude + i * 4, beats.prelude + i * 4 + 40],
                  [0, 0.35],
                  { extrapolateRight: 'clamp' }
                );

                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: baseX + driftX,
                      top: baseY + driftY,
                      width: size,
                      height: size,
                      borderRadius: i % 3 === 0 ? '50%' : '20%',
                      backgroundColor: i % 2 === 0 ? colors.accent : colors.accent2,
                      opacity,
                      transform: `rotate(${driftRotate}deg)`,
                    }}
                  />
                );
              })}
            </>
          )}

          {/* Subtle subtitle hint - fades in late */}
          {frame >= beats.subtitle && texts.subtitle && (
            <div
              style={{
                position: 'absolute',
                bottom: 120,
                left: 200,
                opacity: interpolate(
                  frame,
                  [beats.subtitle, beats.subtitle + 30],
                  [0, 1],
                  { extrapolateRight: 'clamp' }
                ),
                transform: `translateY(${interpolate(
                  frame,
                  [beats.subtitle, beats.subtitle + 30],
                  [20, 0],
                  { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
                )}px)`,
              }}
            >
              <p
                style={{
                  fontFamily: THEME.fonts.marker.handwritten,
                  fontSize: 36,
                  color: `${colors.ink}70`,
                  margin: 0,
                  fontStyle: 'italic',
                  transform: 'rotate(-1deg)',
                }}
              >
                {texts.subtitle}
              </p>
            </div>
          )}

          {/* Breathing focus - pulse effect during pauses */}
          {frame >= beats.underline2 + 30 && frame < beats.accentCircle && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `scale(${1 + Math.sin((frame - beats.underline2) * 0.08) * 0.015})`,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
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
              [beats.settle, beats.settle + 35],
              [0, 0.2],
              { extrapolateRight: 'clamp' }
            ),
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export { Hook1AQuestionBurst };
export const HOOK_1A_DURATION_MIN = 10 * 30; // 10s
export const HOOK_1A_DURATION_MAX = 20 * 30; // 20s
export const HOOK_1A_EXIT_TRANSITION = 15;
