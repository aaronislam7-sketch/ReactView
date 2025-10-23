import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

/**
 * HOOK 1E: AMBIENT MYSTERY
 * 
 * Intent: Build intrigue through subtle atmospheric question
 * Pattern: "In the shadows of..." / "Hidden beneath..."
 * Visual: Fog particles, whisper text, dim spotlight, mysterious
 * Tone: Mysterious, Intriguing
 * Duration: 12-18s
 * 
 * NO BOXES - Fog layers, wispy sketches, atmospheric depth
 */

const Hook1EAmbientMystery = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);

  const colors = scene.style_tokens?.colors || {
    bg: '#1A1F2E',
    fog: '#4A5568',
    accent: '#8E44AD',
    accent2: '#6C7A89',
    ink: '#E8F4FD',
    spotlight: '#F39C12',
  };

  const texts = scene.fill?.texts || {};

  // Beat timing - slow, mysterious reveal
  const BEAT = 42; // 1.4s - slower for mystery
  const beats = {
    prelude: 0,
    fogIn: BEAT * 0.5,
    spotlight: BEAT * 1.5,
    whisperText: BEAT * 2.5,
    questionReveal: BEAT * 4,
    wisps: BEAT * 5.5,
    accentGlow: BEAT * 7,
    settle: BEAT * 9,
  };

  // Camera - slow push in
  const cameraZoom = interpolate(
    frame,
    [0, beats.spotlight, beats.settle],
    [1.08, 1.0, 1.02],
    { easing: Easing.bezier(0.3, 0, 0.2, 1), extrapolateRight: 'clamp' }
  );

  // Vignette intensity
  const vignetteOpacity = interpolate(
    frame,
    [0, beats.fogIn, beats.spotlight, beats.settle],
    [0.9, 0.7, 0.5, 0.6],
    { extrapolateRight: 'clamp' }
  );

  // Generate rough.js fog wisps and mysterious elements
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    // Clear previous sketches
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Wispy fog clouds (sketchy, organic)
    if (frame >= beats.fogIn) {
      const fogClouds = [
        { x: 300, y: 200, w: 400, h: 180, delay: 0, opacity: 0.15 },
        { x: 1400, y: 300, w: 350, h: 160, delay: 20, opacity: 0.12 },
        { x: 200, y: 700, w: 450, h: 200, delay: 15, opacity: 0.18 },
        { x: 1300, y: 750, w: 380, h: 170, delay: 25, opacity: 0.14 },
      ];

      fogClouds.forEach((cloud) => {
        if (frame < beats.fogIn + cloud.delay) return;
        
        const progress = Math.min((frame - beats.fogIn - cloud.delay) / 80, 1);
        const drift = Math.sin((frame - cloud.delay) * 0.008) * 30;

        const cloudShape = rc.ellipse(
          cloud.x + drift,
          cloud.y + Math.cos((frame - cloud.delay) * 0.006) * 20,
          cloud.w * progress,
          cloud.h * progress,
          {
            stroke: 'none',
            fill: `${colors.fog}`,
            fillStyle: 'solid',
            roughness: 0.7,
            bowing: 1,
          }
        );
        
        cloudShape.style.opacity = cloud.opacity * progress;
        cloudShape.style.filter = 'blur(40px)';
        svg.appendChild(cloudShape);
      });
    }

    // Spotlight circle (rough sketch, subtle)
    if (frame >= beats.spotlight) {
      const progress = Math.min((frame - beats.spotlight) / 60, 1);
      
      const spotlight = rc.circle(960, 540, 650 * progress, {
        stroke: `${colors.spotlight}40`,
        strokeWidth: 4,
        roughness: 0.6,
        bowing: 1,
        fill: 'none',
      });
      
      spotlight.style.filter = 'blur(8px)';
      spotlight.style.opacity = 0.4 * progress;
      svg.appendChild(spotlight);
    }

    // Mysterious wispy lines (floating)
    if (frame >= beats.wisps) {
      const wisps = [
        { x1: 400, y1: 350, x2: 550, y2: 320, delay: 0 },
        { x1: 1400, y1: 600, x2: 1520, y2: 650, delay: 10 },
        { x1: 600, y1: 750, x2: 480, y2: 800, delay: 15 },
      ];

      wisps.forEach((wisp, i) => {
        if (frame < beats.wisps + wisp.delay) return;
        
        const progress = Math.min((frame - beats.wisps - wisp.delay) / 35, 1);
        const phase = (frame + i * 50) * 0.01;
        const drift = Math.sin(phase) * 15;

        const line = rc.line(
          wisp.x1 + drift,
          wisp.y1,
          wisp.x1 + (wisp.x2 - wisp.x1) * progress + drift,
          wisp.y1 + (wisp.y2 - wisp.y1) * progress,
          {
            stroke: `${colors.accent}60`,
            strokeWidth: 3,
            roughness: 0.8,
            bowing: 2,
          }
        );
        
        line.style.opacity = 0.5 * progress;
        svg.appendChild(line);
      });
    }

    // Accent glow circles (mysterious depth)
    if (frame >= beats.accentGlow) {
      const glows = [
        { x: 480, y: 540, r: 120, delay: 0 },
        { x: 1440, y: 540, r: 100, delay: 12 },
      ];

      glows.forEach((glow, i) => {
        if (frame < beats.accentGlow + glow.delay) return;
        
        const progress = Math.min((frame - beats.accentGlow - glow.delay) / 50, 1);
        const pulse = 1 + Math.sin((frame - glow.delay) * 0.06) * 0.08;

        const glowCircle = rc.circle(glow.x, glow.y, glow.r * pulse * progress, {
          stroke: 'none',
          fill: `${colors.accent}`,
          fillStyle: 'solid',
          roughness: 0.6,
          bowing: 1,
        });
        
        glowCircle.style.opacity = 0.15 * progress;
        glowCircle.style.filter = 'blur(50px)';
        svg.appendChild(glowCircle);
      });
    }

  }, [frame, beats, colors]);

  // Text reveal - whisper-like, slow fade
  const whisperReveal = (startFrame, duration = 60) => {
    if (frame < startFrame) {
      return {
        opacity: 0,
        transform: 'translateY(30px) scale(0.95)',
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
      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
    );

    return {
      opacity: progress * 0.95,
      transform: `translateY(${30 * (1 - progress)}px) scale(${0.95 + progress * 0.05})`,
    };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 50% 50%, ${colors.spotlight}08 0%, transparent 50%)
        `,
      }}
    >
      {/* Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 30%, ${colors.bg} 100%)`,
          opacity: vignetteOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Rough.js sketch layer - fog, wisps, glows */}
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
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom})`,
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
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Whisper text (above question) */}
          {frame >= beats.whisperText && texts.whisper && (
            <div
              style={{
                marginBottom: 60,
                ...whisperReveal(beats.whisperText, 70),
              }}
            >
              <p
                style={{
                  fontFamily: THEME.fonts.marker.handwritten,
                  fontSize: 42,
                  color: `${colors.ink}50`,
                  margin: 0,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  letterSpacing: '2px',
                }}
              >
                {texts.whisper}
              </p>
            </div>
          )}

          {/* Main question - mysterious reveal */}
          {frame >= beats.questionReveal && (
            <div
              style={{
                position: 'relative',
                textAlign: 'center',
                ...whisperReveal(beats.questionReveal, 80),
              }}
            >
              <h1
                style={{
                  fontFamily: THEME.fonts.structure.primary,
                  fontSize: 78,
                  fontWeight: 600,
                  color: colors.ink,
                  lineHeight: 1.2,
                  margin: 0,
                  letterSpacing: '1px',
                  textShadow: `0 0 40px ${colors.accent}40, 0 0 80px ${colors.accent}20`,
                }}
              >
                {texts.question || 'What lies beneath the surface?'}
              </h1>

              {/* Subtle underline glow (rough sketch) */}
              {frame >= beats.questionReveal + 40 && (
                <div
                  style={{
                    marginTop: 30,
                    opacity: interpolate(
                      frame,
                      [beats.questionReveal + 40, beats.questionReveal + 80],
                      [0, 0.6],
                      { extrapolateRight: 'clamp' }
                    ),
                  }}
                >
                  <div
                    style={{
                      width: 380,
                      height: 4,
                      margin: '0 auto',
                      background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
                      borderRadius: 2,
                      filter: 'blur(3px)',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Floating mystery particles */}
          {frame >= beats.prelude && (
            <>
              {[...Array(24)].map((_, i) => {
                const seed = i * 151;
                const baseY = 100 + (i % 6) * 160;
                const baseX = 150 + (i % 4) * 520;
                const phase = (frame + seed) * 0.008;
                const driftY = Math.sin(phase) * 40;
                const driftX = Math.cos(phase * 0.6) * 30;
                const size = 6 + (i % 3) * 4;
                
                const opacity = interpolate(
                  frame,
                  [beats.prelude + i * 6, beats.prelude + i * 6 + 60],
                  [0, 0.25],
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
                      borderRadius: '50%',
                      backgroundColor: i % 3 === 0 ? colors.spotlight : colors.accent,
                      opacity,
                      filter: 'blur(2px)',
                      boxShadow: `0 0 20px ${i % 3 === 0 ? colors.spotlight : colors.accent}60`,
                    }}
                  />
                );
              })}
            </>
          )}

          {/* Hint text - late reveal */}
          {frame >= beats.accentGlow + 30 && texts.hint && (
            <div
              style={{
                position: 'absolute',
                bottom: 120,
                opacity: interpolate(
                  frame,
                  [beats.accentGlow + 30, beats.accentGlow + 70],
                  [0, 0.7],
                  { extrapolateRight: 'clamp' }
                ),
              }}
            >
              <p
                style={{
                  fontFamily: THEME.fonts.marker.handwritten,
                  fontSize: 32,
                  color: `${colors.ink}60`,
                  margin: 0,
                  fontStyle: 'italic',
                  textAlign: 'center',
                }}
              >
                {texts.hint}
              </p>
            </div>
          )}

          {/* Breathing atmosphere - slow pulse */}
          {frame >= beats.spotlight && frame < beats.settle && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `scale(${1 + Math.sin(frame * 0.04) * 0.008})`,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </AbsoluteFill>

      {/* Final settle fade */}
      {frame >= beats.settle && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: colors.bg,
            opacity: interpolate(
              frame,
              [beats.settle, beats.settle + 50],
              [0, 0.15],
              { extrapolateRight: 'clamp' }
            ),
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export { Hook1EAmbientMystery };
export const HOOK_1E_DURATION_MIN = 12 * 30; // 12s
export const HOOK_1E_DURATION_MAX = 18 * 30; // 18s
export const HOOK_1E_EXIT_TRANSITION = 15;
