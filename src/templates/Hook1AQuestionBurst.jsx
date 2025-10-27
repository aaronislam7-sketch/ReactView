import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

/**
 * HOOK 1A: QUESTION BURST (CONVERSATIONAL V9 - REMOTION INTERPOLATE)
 * 
 * ANIMATION STRATEGY:
 * - ✅ Remotion interpolate() for BASIC animations (opacity, position, scale)
 * - ✅ NO GSAP for basic motion - frame-based = reliable
 * - ✅ GSAP ONLY for complex sequences (not needed here)
 * 
 * CONVERSATIONAL FEATURES:
 * - ✅ Bold mid-scene transitions - things MOVE!
 * - ✅ Conversational flow - elements exit when done
 * - ✅ Headers in Cabin Sketch font (hand-drawn/sketchy look)
 * - ✅ Permanent Marker for body/secondary text
 * - ✅ Clean stage - only show what's needed NOW
 * - ✅ Graceful wipes/exits via interpolate
 * - ✅ Animated map (NO emojis)
 * - ✅ ZERO WOBBLE everywhere (no roughness/bowing)
 * 
 * Typography Hierarchy:
 * - Headers: SVG text with Cabin Sketch font (sketchy style, NO wobble)
 * - Body/Secondary: Permanent Marker - energy and personality
 * - Supporting: Inter - clean readability
 * 
 * How Animations Work (THE KEY):
 * - SVG text rendered with transforms calculated via interpolate()
 * - Each animation (entrance, move, pulse, wipe) = interpolate() call
 * - Applied directly as SVG attributes (transform, opacity)
 * - Reliable frame-based rendering - NO timing issues!
 * 
 * Conversational Flow:
 * 1. "What if geography" appears (interpolate entrance)
 * 2. Question 1 moves up (interpolate y position)
 * 3. "was measured in mindsets?" appears (interpolate entrance)
 * 4. Both pulse (interpolate scale)
 * 5. Both wipe left (interpolate x + opacity)
 * 6. Map draws in center
 * 7. Map transforms to corner (interpolate)
 * 8. "Welcome to Knodovia" appears (interpolate entrance)
 * 9. Subtitle fades in (interpolate opacity)
 * 10. Breathe animation (interpolate scale)
 * 
 * Intent: Conversational, dynamic, TED-ED quality with sketchy text, ZERO wobble
 * Duration: 15-18s
 */

const Hook1AQuestionBurst = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const mapSvgRef = useRef(null);
  const roughTextSvgRef = useRef(null);

  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FFF9F0',
    accent: '#FF6B35',      // Bold orange
    accent2: '#9B59B6',     // Bold purple
    ink: '#1A1A1A',
  };
  
  const fonts = style.fonts || {
    header: "'Cabin Sketch', cursive",    // Sketchy headers
    secondary: THEME.fonts.marker.primary, // Permanent Marker
    body: THEME.fonts.structure.primary,   // Inter
    size_title: 76,
    size_question: 92,
    size_welcome: 72,
    size_subtitle: 32,
  };
  
  const spacing = style.spacing || {
    padding: 120,
    gap: 30,
  };

  const texts = scene.fill?.texts || {};

  // Beat timing - CONVERSATIONAL, DYNAMIC (with breathing room)
  const BEAT = 30;
  const beats = {
    prelude: 0,
    questionPart1: BEAT * 0.6,       // 0.6s
    moveUp: BEAT * 2.0,              // 2.0s
    questionPart2: BEAT * 2.8,       // 2.8s
    pulse: BEAT * 4.2,               // 4.2s
    wipeQuestions: BEAT * 5.5,       // 5.5s
    mapReveal: BEAT * 6.5,           // 6.5s
    transformMap: BEAT * 9.0,        // 9.0s
    welcome: BEAT * 10.0,            // 10.0s
    subtitle: BEAT * 12.0,           // 12s
    breathe: BEAT * 13.5,            // 13.5s
    settle: BEAT * 15,               // 15s
  };

  // Subtle camera drift
  const cameraDrift = {
    x: Math.sin(frame * 0.008) * 2,
    y: Math.cos(frame * 0.006) * 1.5,
  };

  // ========================================
  // REMOTION INTERPOLATE ANIMATIONS
  // ========================================
  
  // Question 1: Entrance → Move up → Pulse → Wipe
  const q1Opacity = frame < beats.questionPart1 ? 0 :
    frame < beats.wipeQuestions ? interpolate(
      frame,
      [beats.questionPart1, beats.questionPart1 + 27], // 0.9s
      [0, 1],
      { extrapolateRight: 'clamp' }
    ) :
    interpolate(
      frame,
      [beats.wipeQuestions, beats.wipeQuestions + 30], // 1s wipe
      [1, 0],
      { extrapolateRight: 'clamp' }
    );

  const q1TranslateY = frame < beats.questionPart1 ? 30 :
    frame < beats.moveUp ? interpolate(
      frame,
      [beats.questionPart1, beats.questionPart1 + 27],
      [30, 0],
      { extrapolateRight: 'clamp' }
    ) :
    interpolate(
      frame,
      [beats.moveUp, beats.moveUp + 24], // 0.8s move
      [0, -60],
      { extrapolateRight: 'clamp' }
    );

  const q1TranslateX = frame < beats.wipeQuestions ? 0 :
    interpolate(
      frame,
      [beats.wipeQuestions, beats.wipeQuestions + 30],
      [0, -1200],
      { extrapolateRight: 'clamp' }
    );

  const q1Scale = frame < beats.pulse ? 1 :
    frame < beats.pulse + 12 ? interpolate(
      frame,
      [beats.pulse, beats.pulse + 12], // 0.4s pulse out
      [1, 1.05],
      { extrapolateRight: 'clamp' }
    ) :
    frame < beats.pulse + 24 ? interpolate(
      frame,
      [beats.pulse + 12, beats.pulse + 24], // 0.4s pulse back
      [1.05, 1],
      { extrapolateRight: 'clamp' }
    ) : 1;

  // Question 2: Entrance → Pulse → Wipe
  const q2Opacity = frame < beats.questionPart2 ? 0 :
    frame < beats.wipeQuestions ? interpolate(
      frame,
      [beats.questionPart2, beats.questionPart2 + 30], // 1s
      [0, 1],
      { extrapolateRight: 'clamp' }
    ) :
    interpolate(
      frame,
      [beats.wipeQuestions, beats.wipeQuestions + 30],
      [1, 0],
      { extrapolateRight: 'clamp' }
    );

  const q2TranslateY = frame < beats.questionPart2 ? 40 :
    interpolate(
      frame,
      [beats.questionPart2, beats.questionPart2 + 30],
      [40, 0],
      { extrapolateRight: 'clamp' }
    );

  const q2TranslateX = frame < beats.wipeQuestions ? 0 :
    interpolate(
      frame,
      [beats.wipeQuestions, beats.wipeQuestions + 30],
      [0, -1200],
      { extrapolateRight: 'clamp' }
    );

  const q2Scale = frame < beats.questionPart2 ? 0.88 :
    frame < beats.questionPart2 + 30 ? interpolate(
      frame,
      [beats.questionPart2, beats.questionPart2 + 30],
      [0.88, 1],
      { extrapolateRight: 'clamp' }
    ) :
    frame < beats.pulse ? 1 :
    frame < beats.pulse + 12 ? interpolate(
      frame,
      [beats.pulse, beats.pulse + 12],
      [1, 1.05],
      { extrapolateRight: 'clamp' }
    ) :
    frame < beats.pulse + 24 ? interpolate(
      frame,
      [beats.pulse + 12, beats.pulse + 24],
      [1.05, 1],
      { extrapolateRight: 'clamp' }
    ) : 1;

  // Map: Entrance → Transform
  const mapOpacity = frame < beats.mapReveal ? 0 :
    interpolate(
      frame,
      [beats.mapReveal, beats.mapReveal + 39], // 1.3s
      [0, 1],
      { extrapolateRight: 'clamp' }
    );

  const mapScale = frame < beats.mapReveal ? 0.85 :
    frame < beats.transformMap ? interpolate(
      frame,
      [beats.mapReveal, beats.mapReveal + 39],
      [0.85, 1],
      { extrapolateRight: 'clamp' }
    ) :
    interpolate(
      frame,
      [beats.transformMap, beats.transformMap + 36], // 1.2s
      [1, 0.4],
      { extrapolateRight: 'clamp' }
    );

  const mapTranslateX = frame < beats.transformMap ? 0 :
    interpolate(
      frame,
      [beats.transformMap, beats.transformMap + 36],
      [0, 600],
      { extrapolateRight: 'clamp' }
    );

  const mapTranslateY = frame < beats.transformMap ? 0 :
    interpolate(
      frame,
      [beats.transformMap, beats.transformMap + 36],
      [0, -300],
      { extrapolateRight: 'clamp' }
    );

  // Welcome: Entrance → Breathe
  const welcomeOpacity = frame < beats.welcome ? 0 :
    interpolate(
      frame,
      [beats.welcome, beats.welcome + 45], // 1.5s
      [0, 1],
      { extrapolateRight: 'clamp' }
    );

  const welcomeTranslateY = frame < beats.welcome ? 40 :
    interpolate(
      frame,
      [beats.welcome, beats.welcome + 45],
      [40, 0],
      { extrapolateRight: 'clamp' }
    );

  const welcomeScale = frame < beats.welcome ? 0.88 :
    frame < beats.welcome + 45 ? interpolate(
      frame,
      [beats.welcome, beats.welcome + 45],
      [0.88, 1],
      { extrapolateRight: 'clamp' }
    ) :
    frame < beats.breathe ? 1 :
    1 + Math.sin((frame - beats.breathe) * 0.025) * 0.02; // Subtle breathe

  // Subtitle: Fade in
  const subtitleOpacity = frame < beats.subtitle ? 0 :
    interpolate(
      frame,
      [beats.subtitle, beats.subtitle + 36], // 1.2s
      [0, 1],
      { extrapolateRight: 'clamp' }
    );

  const subtitleTranslateY = frame < beats.subtitle ? 20 :
    interpolate(
      frame,
      [beats.subtitle, beats.subtitle + 36],
      [20, 0],
      { extrapolateRight: 'clamp' }
    );

  // ========================================
  // ROUGH.JS - Headers & Map
  // ========================================

  // Render headers with CABIN SKETCH SVG text (NO boxes, NO wobble)
  useEffect(() => {
    if (!roughTextSvgRef.current) return;

    const svg = roughTextSvgRef.current;

    // Clear previous
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Question Part 1 - Cabin Sketch SVG text
    if (frame >= beats.questionPart1 && frame < beats.wipeQuestions + 35) {
      const text1 = texts.questionPart1 || 'What if geography';
      
      const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      textGroup.setAttribute('id', 'question1-group');
      textGroup.setAttribute('opacity', String(q1Opacity));
      textGroup.setAttribute('transform', `translate(${q1TranslateX}, ${q1TranslateY}) scale(${q1Scale})`);
      
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', '960');
      textElement.setAttribute('y', '480');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
      textElement.setAttribute('font-size', fonts.size_title);
      textElement.setAttribute('font-weight', '700');
      textElement.setAttribute('fill', colors.ink);
      textElement.textContent = text1;
      
      textGroup.appendChild(textElement);
      svg.appendChild(textGroup);
    }

    // Question Part 2 - Cabin Sketch SVG text
    if (frame >= beats.questionPart2 && frame < beats.wipeQuestions + 35) {
      const text2 = texts.questionPart2 || 'was measured in mindsets?';
      
      const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      textGroup.setAttribute('id', 'question2-group');
      textGroup.setAttribute('opacity', String(q2Opacity));
      textGroup.setAttribute('transform', `translate(${q2TranslateX}, ${q2TranslateY}) scale(${q2Scale})`);
      
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', '960');
      textElement.setAttribute('y', '600');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
      textElement.setAttribute('font-size', fonts.size_question);
      textElement.setAttribute('font-weight', '700');
      textElement.setAttribute('fill', colors.accent);
      textElement.textContent = text2;
      
      textGroup.appendChild(textElement);
      svg.appendChild(textGroup);
    }

    // "Welcome to Knodovia" - Cabin Sketch SVG text (THE HOOK)
    if (frame >= beats.welcome) {
      const welcomeText = texts.welcome || 'Welcome to Knodovia';
      
      const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      textGroup.setAttribute('id', 'welcome-group');
      textGroup.setAttribute('opacity', String(welcomeOpacity));
      textGroup.setAttribute('transform', `translate(0, ${welcomeTranslateY}) scale(${welcomeScale})`);
      
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', '960');
      textElement.setAttribute('y', '560');
      textElement.setAttribute('text-anchor', 'middle');
      textElement.setAttribute('font-family', "'Cabin Sketch', cursive");
      textElement.setAttribute('font-size', fonts.size_welcome);
      textElement.setAttribute('font-weight', '700');
      textElement.setAttribute('fill', colors.accent2);
      textElement.textContent = welcomeText;
      
      textGroup.appendChild(textElement);
      svg.appendChild(textGroup);
    }

  }, [frame, beats, colors, texts, fonts, q1Opacity, q1TranslateX, q1TranslateY, q1Scale, q2Opacity, q2TranslateX, q2TranslateY, q2Scale, welcomeOpacity, welcomeTranslateY, welcomeScale]);

  // Animated Map SVG - ZERO WOBBLE
  useEffect(() => {
    if (!mapSvgRef.current || frame < beats.mapReveal) return;

    const svg = mapSvgRef.current;
    const rc = rough.svg(svg);

    // Clear previous
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const progress = Math.min((frame - beats.mapReveal) / 50, 1);

    // Stylized landmass
    const islandPath = `
      M 200 180 
      Q 180 120 220 100
      Q 270 80 320 100
      Q 360 90 380 120
      Q 420 110 440 140
      Q 460 170 440 210
      Q 430 250 400 270
      Q 360 290 320 280
      Q 280 290 240 270
      Q 200 250 190 220
      Q 180 200 200 180 Z
    `;

    const island = rc.path(islandPath, {
      stroke: colors.accent,
      strokeWidth: 6,
      roughness: 0,  // ZERO WOBBLE
      bowing: 0,     // ZERO WOBBLE
      fill: `${colors.accent}15`,
      fillStyle: 'hachure',
      hachureGap: 8,
      hachureAngle: 45,
    });

    const paths = island.querySelectorAll('path');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length * (1 - progress);
    });

    svg.appendChild(island);

    // Small islands/details
    if (progress > 0.5) {
      const detailProgress = (progress - 0.5) * 2;
      
      const small1 = rc.circle(150, 200, 40 * detailProgress, {
        stroke: colors.accent2,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent2}12`,
        fillStyle: 'solid',
      });
      svg.appendChild(small1);

      const small2 = rc.circle(480, 180, 30 * detailProgress, {
        stroke: colors.accent2,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent2}12`,
        fillStyle: 'solid',
      });
      svg.appendChild(small2);

      // Location markers
      if (detailProgress > 0.6) {
        const markerProgress = (detailProgress - 0.6) / 0.4;
        
        [[260, 160], [340, 200], [380, 240]].forEach(([x, y], i) => {
          const delay = i * 0.2;
          if (markerProgress > delay) {
            const locProgress = Math.min((markerProgress - delay) / 0.3, 1);
            
            const markerPath = `M ${x} ${y} L ${x} ${y + 20 * locProgress}`;
            const marker = rc.path(markerPath, {
              stroke: colors.ink,
              strokeWidth: 5,
              roughness: 0,
              bowing: 0,
            });
            svg.appendChild(marker);

            const pinHead = rc.circle(x, y, 12 * locProgress, {
              stroke: colors.accent,
              strokeWidth: 3,
              roughness: 0,
              bowing: 0,
              fill: colors.accent,
              fillStyle: 'solid',
            });
            svg.appendChild(pinHead);
          }
        });
      }
    }

  }, [frame, beats.mapReveal, colors]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, ${colors.accent}03 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, ${colors.accent2}03 0%, transparent 55%)
        `,
      }}
    >
      {/* Decorative layer */}
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

      {/* Rough text layer (Cabin Sketch headers) */}
      <svg
        ref={roughTextSvgRef}
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
      <AbsoluteFill
        style={{
          transform: `translate(${cameraDrift.x}px, ${cameraDrift.y}px)`,
        }}
      >
        {/* Animated Map Container */}
        {frame >= beats.mapReveal && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) translate(${mapTranslateX}px, ${mapTranslateY}px) scale(${mapScale})`,
              width: 640,
              height: 400,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: mapOpacity,
            }}
          >
            <svg
              ref={mapSvgRef}
              style={{
                width: '100%',
                height: '100%',
              }}
              viewBox="0 0 640 400"
              preserveAspectRatio="xMidYMid meet"
            />
          </div>
        )}

        {/* Subtitle - Permanent Marker (body text) */}
        {frame >= beats.subtitle && (
          <div
            style={{
              position: 'absolute',
              bottom: '30%',
              left: '50%',
              transform: `translateX(-50%) translateY(${subtitleTranslateY}px)`,
              maxWidth: 800,
              textAlign: 'center',
              opacity: subtitleOpacity,
            }}
          >
            <p
              style={{
                fontFamily: fonts.secondary, // Permanent Marker
                fontSize: fonts.size_subtitle,
                color: `${colors.ink}80`,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {texts.subtitle || 'A place where your perspective shapes the landscape...'}
            </p>
          </div>
        )}
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
              [0, 0.15],
              { extrapolateRight: 'clamp' }
            ),
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export { Hook1AQuestionBurst };
export const HOOK_1A_DURATION_MIN = 15 * 30;
export const HOOK_1A_DURATION_MAX = 18 * 30;
export const HOOK_1A_EXIT_TRANSITION = 15;
