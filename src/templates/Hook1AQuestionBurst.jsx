import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import anime from 'animejs/lib/anime.es.js';
import rough from 'roughjs/bundled/rough.esm.js';

/**
 * HOOK 1A: QUESTION BURST
 * 
 * Intent: Pose provocative question to focus attention
 * Pattern: "Ever wondered why...?" / "What if...?"
 * Visual: Write-on headline, kinetic type, soft texture
 * 
 * NO BOXES - pure hand-drawn sketch aesthetic!
 */

const Hook1AQuestionBurst = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const svgRef = useRef(null);
  const hasAnimated = useRef(false);

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.primary,
    accent: THEME.colors.markers.red,
    ink: THEME.colors.text.primary,
  };

  const texts = scene.fill?.texts || {};

  // Beat timing
  const BEAT = 36;
  const beats = {
    intro: 0,
    questionPart1: BEAT * 0.8,
    questionPart2: BEAT * 2.2,
    underlineSketch: BEAT * 3.5,
    accentCircle: BEAT * 4,
    sparkBurst: BEAT * 4.5,
    settle: BEAT * 6,
  };

  // Camera motion
  const cameraZoom = interpolate(
    frame,
    [0, beats.questionPart1, beats.sparkBurst, beats.settle],
    [1.05, 1.0, 1.02, 1.0],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Sketch rough.js elements on SVG
  useEffect(() => {
    if (!svgRef.current || hasAnimated.current) return;
    
    const svg = svgRef.current;
    const rc = rough.svg(svg);

    // Sketch underline (wobbly)
    if (frame >= beats.underlineSketch) {
      const underline = rc.line(100, 350, 900, 360, {
        stroke: colors.accent,
        strokeWidth: 6,
        roughness: 2.5,
        bowing: 8,
      });
      underline.id = 'sketch-underline';
      svg.appendChild(underline);

      // Animate stroke
      anime({
        targets: '#sketch-underline path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeOutCubic',
        duration: 800,
        delay: 0,
      });
    }

    // Sketch accent circle (hand-drawn)
    if (frame >= beats.accentCircle) {
      const circle = rc.circle(960, 540, 300, {
        stroke: colors.accent,
        strokeWidth: 4,
        roughness: 2,
        bowing: 3,
        fill: 'none',
      });
      circle.id = 'sketch-circle';
      svg.appendChild(circle);

      anime({
        targets: '#sketch-circle path',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutQuad',
        duration: 1200,
        delay: 0,
      });
    }

    // Spark burst - hand-drawn stars
    if (frame >= beats.sparkBurst) {
      const sparkPositions = [
        { x: 300, y: 200, size: 40, delay: 0 },
        { x: 1600, y: 250, size: 35, delay: 100 },
        { x: 500, y: 850, size: 45, delay: 200 },
        { x: 1400, y: 820, size: 38, delay: 150 },
      ];

      sparkPositions.forEach((spark, i) => {
        const star = rc.path(
          `M ${spark.x} ${spark.y - spark.size} 
           L ${spark.x + spark.size * 0.25} ${spark.y - spark.size * 0.3}
           L ${spark.x + spark.size} ${spark.y}
           L ${spark.x + spark.size * 0.25} ${spark.y + spark.size * 0.3}
           L ${spark.x} ${spark.y + spark.size}
           L ${spark.x - spark.size * 0.25} ${spark.y + spark.size * 0.3}
           L ${spark.x - spark.size} ${spark.y}
           L ${spark.x - spark.size * 0.25} ${spark.y - spark.size * 0.3}
           Z`,
          {
            stroke: colors.accent,
            strokeWidth: 3,
            roughness: 1.8,
            fill: `${colors.accent}40`,
            fillStyle: 'hachure',
            hachureGap: 8,
          }
        );
        star.classList.add('spark');
        star.id = `spark-${i}`;
        svg.appendChild(star);

        anime({
          targets: `#spark-${i}`,
          scale: [0, 1],
          rotate: [0, 180],
          opacity: [0, 1],
          easing: 'easeOutElastic(1, .8)',
          duration: 800,
          delay: spark.delay,
        });
      });
    }

    hasAnimated.current = true;
  }, [frame, beats, colors]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, ${colors.accent}08 0%, transparent 50%),
          url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")
        `,
      }}
    >
      {/* SVG layer for rough.js sketches */}
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

      {/* Content layer with camera motion */}
      <AbsoluteFill style={{ transform: `scale(${cameraZoom})` }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '100px 120px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Question Part 1 - Kinetic type */}
          {frame >= beats.questionPart1 && (
            <div
              style={{
                marginBottom: 30,
                opacity: interpolate(
                  frame,
                  [beats.questionPart1, beats.questionPart1 + 20],
                  [0, 1],
                  { extrapolateRight: 'clamp' }
                ),
                transform: `translateY(${interpolate(
                  frame,
                  [beats.questionPart1, beats.questionPart1 + 25],
                  [-40, 0],
                  { easing: Easing.out(Easing.back(1.5)), extrapolateRight: 'clamp' }
                )}px) rotate(${interpolate(
                  frame,
                  [beats.questionPart1, beats.questionPart1 + 25],
                  [-3, 0],
                  { extrapolateRight: 'clamp' }
                )}deg)`,
              }}
            >
              <h1
                style={{
                  fontFamily: THEME.fonts.marker.secondary,
                  fontSize: 76,
                  fontWeight: 700,
                  color: colors.ink,
                  lineHeight: 1.2,
                  margin: 0,
                  textAlign: 'center',
                  textShadow: `3px 3px 0px ${colors.accent}20`,
                  letterSpacing: '-1px',
                }}
              >
                {texts.questionPart1 || 'Ever wondered why'}
              </h1>
            </div>
          )}

          {/* Question Part 2 - Offset, dynamic */}
          {frame >= beats.questionPart2 && (
            <div
              style={{
                opacity: interpolate(
                  frame,
                  [beats.questionPart2, beats.questionPart2 + 20],
                  [0, 1],
                  { extrapolateRight: 'clamp' }
                ),
                transform: `translateY(${interpolate(
                  frame,
                  [beats.questionPart2, beats.questionPart2 + 25],
                  [40, 0],
                  { easing: Easing.out(Easing.back(1.5)), extrapolateRight: 'clamp' }
                )}px) rotate(${interpolate(
                  frame,
                  [beats.questionPart2, beats.questionPart2 + 25],
                  [2, 0],
                  { extrapolateRight: 'clamp' }
                )}deg)`,
              }}
            >
              <h1
                style={{
                  fontFamily: THEME.fonts.marker.secondary,
                  fontSize: 82,
                  fontWeight: 700,
                  color: colors.accent,
                  lineHeight: 1.2,
                  margin: 0,
                  textAlign: 'center',
                  textShadow: `4px 4px 0px ${colors.ink}15`,
                  transform: 'translateX(40px)', // Slight offset for asymmetry
                }}
              >
                {texts.questionPart2 || 'learning feels hard?'}
              </h1>
            </div>
          )}

          {/* Floating particles - ambient */}
          {frame >= beats.intro && (
            <>
              {[...Array(12)].map((_, i) => {
                const baseY = 200 + (i % 4) * 200;
                const baseX = 200 + (i % 3) * 600;
                const driftY = Math.sin((frame + i * 20) * 0.02) * 15;
                const driftX = Math.cos((frame + i * 30) * 0.015) * 10;
                
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: baseX + driftX,
                      top: baseY + driftY,
                      width: 6 + (i % 3) * 2,
                      height: 6 + (i % 3) * 2,
                      borderRadius: '50%',
                      backgroundColor: `${colors.accent}30`,
                      opacity: interpolate(
                        frame,
                        [beats.intro + i * 5, beats.intro + i * 5 + 30],
                        [0, 0.6],
                        { extrapolateRight: 'clamp' }
                      ),
                    }}
                  />
                );
              })}
            </>
          )}

          {/* Subtle subtitle hint */}
          {frame >= beats.sparkBurst + 20 && (
            <div
              style={{
                position: 'absolute',
                bottom: 120,
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: interpolate(
                  frame,
                  [beats.sparkBurst + 20, beats.sparkBurst + 40],
                  [0, 1],
                  { extrapolateRight: 'clamp' }
                ),
              }}
            >
              <p
                style={{
                  fontFamily: THEME.fonts.marker.handwritten,
                  fontSize: 32,
                  color: `${colors.ink}80`,
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                {texts.subtitle || "Let's find out..."}
              </p>
            </div>
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
              [beats.settle, beats.settle + 30],
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
