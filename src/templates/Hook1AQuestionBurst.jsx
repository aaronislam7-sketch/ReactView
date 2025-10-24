import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import gsap from 'gsap';
import {
  drawUnderline,
  pulseEmphasis,
  gracefulMove,
  scrambleText,
  questionRevealSequence,
  cascadeReveal,
} from '../utils/gsapAnimations';

/**
 * HOOK 1A: QUESTION BURST (Production V3 - GSAP)
 * 
 * PRODUCTION-READY FEATURES:
 * - ✅ Zero wobble (roughness/bowing = 0)
 * - ✅ GSAP animations for world-class aesthetics
 * - ✅ Mid-scene transitions (question moves gracefully)
 * - ✅ Organic animation flows
 * - ✅ Emphasis animations (pulse, underline)
 * - ✅ Scramble text for hooks
 * - ✅ Staggered reveals
 * 
 * Animation Flow:
 * 1. Question Part 1 appears with bounce (GSAP)
 * 2. Underline draws underneath (GSAP drawUnderline)
 * 3. Question Part 2 appears
 * 4. Pulse emphasis on key words (GSAP)
 * 5. Mid-scene: Question gracefully moves to top (GSAP gracefulMove)
 * 6. New content (subtitle + icons) cascade in (GSAP)
 * 
 * Intent: Pose provocative question with kinetic energy + mid-scene repositioning
 * Duration: 10-20s
 */

const Hook1AQuestionBurst = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const underline1Ref = useRef(null);
  const underline2Ref = useRef(null);
  const questionContainerRef = useRef(null);
  const subtitleRef = useRef(null);
  const iconsContainerRef = useRef(null);
  
  // Track which animations have been triggered
  const [triggeredAnimations, setTriggeredAnimations] = useState({
    questionPart1: false,
    underline1: false,
    questionPart2: false,
    underline2: false,
    pulse1: false,
    pulse2: false,
    moveToTop: false,
    cascadeContent: false,
  });

  // Expanded style tokens with defaults
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FFF9F0',
    accent: '#E74C3C',
    accent2: '#E67E22',
    ink: '#1A1A1A',
  };
  
  const fonts = style.fonts || {
    primary: "'Cabin Sketch', cursive",
    size_title: 84,
    size_subtitle: 36,
  };
  
  const motion = style.motion || {
    timing: 'fast',
    easing: 'elastic',
    stagger_delay: 150,
  };
  
  const spacing = style.spacing || {
    padding: 140,
    gap: 40,
  };

  const texts = scene.fill?.texts || {};
  const images = scene.fill?.images || [];
  const lottie = scene.fill?.lottie || null;
  const icons = scene.fill?.icons || [];

  // Beat timing - frame-based
  const timingMultiplier = motion.timing === 'fast' ? 0.8 : motion.timing === 'slow' ? 1.2 : 1.0;
  const BEAT = 36 * timingMultiplier;
  
  const beats = {
    prelude: 0,
    questionPart1: BEAT * 0.8,
    underline1: BEAT * 2,
    questionPart2: BEAT * 2.4,
    pulse1: BEAT * 3,
    underline2: BEAT * 3.6,
    pulse2: BEAT * 4.5,
    accentCircle: BEAT * 4.2,
    sparkBurst: BEAT * 5,
    moveToTop: BEAT * 6,        // NEW: Mid-scene transition
    cascadeContent: BEAT * 7,   // NEW: New content appears
    lottieIcon: BEAT * 5.5,
    subtitle: BEAT * 6,
    settle: BEAT * 8.5,
  };

  // Camera motion (kept for background ambience)
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

  // ========================================
  // GSAP ANIMATION TRIGGERS
  // ========================================
  
  // Question Part 1 - Kinetic entrance with GSAP
  useEffect(() => {
    if (frame >= beats.questionPart1 && !triggeredAnimations.questionPart1 && textRef1.current) {
      gsap.fromTo(textRef1.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.85,
          rotation: -3,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        }
      );
      setTriggeredAnimations(prev => ({ ...prev, questionPart1: true }));
    }
  }, [frame, beats.questionPart1, triggeredAnimations.questionPart1]);

  // Underline 1 - Draw effect
  useEffect(() => {
    if (frame >= beats.underline1 && !triggeredAnimations.underline1 && underline1Ref.current) {
      drawUnderline(underline1Ref.current, {
        duration: 0.6,
        ease: "power2.out",
      });
      setTriggeredAnimations(prev => ({ ...prev, underline1: true }));
    }
  }, [frame, beats.underline1, triggeredAnimations.underline1]);

  // Question Part 2 - Kinetic entrance
  useEffect(() => {
    if (frame >= beats.questionPart2 && !triggeredAnimations.questionPart2 && textRef2.current) {
      gsap.fromTo(textRef2.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.85,
          rotation: 2,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        }
      );
      setTriggeredAnimations(prev => ({ ...prev, questionPart2: true }));
    }
  }, [frame, beats.questionPart2, triggeredAnimations.questionPart2]);

  // Pulse 1 - Emphasis on first part
  useEffect(() => {
    if (frame >= beats.pulse1 && !triggeredAnimations.pulse1 && textRef1.current) {
      pulseEmphasis(textRef1.current, {
        scale: 1.05,
        duration: 0.4,
        repeat: 1,
        yoyo: true,
      });
      setTriggeredAnimations(prev => ({ ...prev, pulse1: true }));
    }
  }, [frame, beats.pulse1, triggeredAnimations.pulse1]);

  // Underline 2 - Draw effect
  useEffect(() => {
    if (frame >= beats.underline2 && !triggeredAnimations.underline2 && underline2Ref.current) {
      drawUnderline(underline2Ref.current, {
        duration: 0.6,
        ease: "power2.out",
      });
      setTriggeredAnimations(prev => ({ ...prev, underline2: true }));
    }
  }, [frame, beats.underline2, triggeredAnimations.underline2]);

  // Pulse 2 - Emphasis on second part
  useEffect(() => {
    if (frame >= beats.pulse2 && !triggeredAnimations.pulse2 && textRef2.current) {
      pulseEmphasis(textRef2.current, {
        scale: 1.08,
        duration: 0.4,
        repeat: 2,
        yoyo: true,
      });
      setTriggeredAnimations(prev => ({ ...prev, pulse2: true }));
    }
  }, [frame, beats.pulse2, triggeredAnimations.pulse2]);

  // MID-SCENE TRANSITION - Move question to top
  useEffect(() => {
    if (frame >= beats.moveToTop && !triggeredAnimations.moveToTop && questionContainerRef.current) {
      gracefulMove(questionContainerRef.current, {
        y: -250,
        scale: 0.7,
        duration: 1.2,
        ease: "power3.inOut",
      });
      setTriggeredAnimations(prev => ({ ...prev, moveToTop: true }));
    }
  }, [frame, beats.moveToTop, triggeredAnimations.moveToTop]);

  // Cascade in new content
  useEffect(() => {
    if (frame >= beats.cascadeContent && !triggeredAnimations.cascadeContent) {
      const contentElements = [subtitleRef.current, iconsContainerRef.current].filter(Boolean);
      if (contentElements.length > 0) {
        cascadeReveal(contentElements, {
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: 0.2,
        });
        setTriggeredAnimations(prev => ({ ...prev, cascadeContent: true }));
      }
    }
  }, [frame, beats.cascadeContent, triggeredAnimations.cascadeContent]);

  // rough.js shapes - ZERO WOBBLE (kept for decorative elements)
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    // Clear previous
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Accent circle - ZERO WOBBLE, clean shape
    if (frame >= beats.accentCircle) {
      const progress = Math.min((frame - beats.accentCircle) / 35, 1);
      
      const circle = rc.circle(960, 540, 360, {
        stroke: `${colors.accent}60`,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
        fill: 'none',
      });
      
      // Animate stroke drawing
      const paths = circle.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });
      
      svg.appendChild(circle);
    }

    // Stars - ZERO WOBBLE, clean paths
    if (frame >= beats.sparkBurst && frame < beats.moveToTop) {
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
        
        // Star path
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
          roughness: 0,
          bowing: 0,
          fill: `${colors.accent2}40`,
          fillStyle: 'hachure',
          hachureGap: 8,
          hachureAngle: spark.rotation,
        });
        
        star.style.opacity = progress;
        svg.appendChild(star);
      });
    }

  }, [frame, beats, colors]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 25% 35%, ${colors.accent}06 0%, transparent 60%),
          radial-gradient(circle at 75% 70%, ${colors.accent2}05 0%, transparent 55%)
        `,
      }}
    >
      {/* rough.js sketch layer */}
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

      {/* Content layer */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom}) translate(${cameraDrift.x}px, ${cameraDrift.y}px)`,
        }}
      >
        {/* Question Container - animated as a group */}
        <div
          ref={questionContainerRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: spacing.padding + 60,
            transform: 'translateY(-50%)',
            width: `calc(100% - ${(spacing.padding + 60) * 2}px)`,
          }}
        >
          {/* Question Part 1 */}
          {frame >= beats.questionPart1 && (
            <div
              style={{
                position: 'relative',
                marginBottom: spacing.gap,
              }}
            >
              <h1
                ref={textRef1}
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_title,
                  fontWeight: 700,
                  color: colors.ink,
                  lineHeight: 1.1,
                  margin: 0,
                  letterSpacing: '-1px',
                  opacity: 0, // Will be animated by GSAP
                }}
              >
                {texts.questionPart1 || 'What if geography'}
              </h1>
              
              {/* Underline 1 */}
              {frame >= beats.underline1 && (
                <div
                  ref={underline1Ref}
                  style={{
                    position: 'absolute',
                    bottom: -10,
                    left: 0,
                    width: '100%',
                    height: 6,
                    backgroundColor: colors.accent,
                    transformOrigin: 'left center',
                    transform: 'scaleX(0)', // Will be animated by GSAP
                  }}
                />
              )}
            </div>
          )}

          {/* Question Part 2 */}
          {frame >= beats.questionPart2 && (
            <div
              style={{
                position: 'relative',
                marginLeft: 60,
              }}
            >
              <h1
                ref={textRef2}
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_title + 8,
                  fontWeight: 700,
                  color: colors.accent,
                  lineHeight: 1.1,
                  margin: 0,
                  letterSpacing: '-2px',
                  opacity: 0, // Will be animated by GSAP
                }}
              >
                {texts.questionPart2 || 'was measured in mindsets?'}
              </h1>
              
              {/* Underline 2 */}
              {frame >= beats.underline2 && (
                <div
                  ref={underline2Ref}
                  style={{
                    position: 'absolute',
                    bottom: -12,
                    left: 0,
                    width: '100%',
                    height: 7,
                    backgroundColor: colors.accent,
                    transformOrigin: 'left center',
                    transform: 'scaleX(0)', // Will be animated by GSAP
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* NEW CONTENT - Appears after mid-scene transition */}
        {frame >= beats.cascadeContent && (
          <>
            {/* Subtitle */}
            <div
              ref={subtitleRef}
              style={{
                position: 'absolute',
                bottom: 200,
                left: spacing.padding + 60,
                opacity: 0, // Will be animated by GSAP
              }}
            >
              <p
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_subtitle,
                  color: `${colors.ink}70`,
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                {texts.subtitle || 'Welcome to Knodovia...'}
              </p>
            </div>

            {/* Icons Container */}
            <div
              ref={iconsContainerRef}
              style={{
                position: 'absolute',
                bottom: 120,
                right: spacing.padding + 60,
                display: 'flex',
                gap: 30,
                opacity: 0, // Will be animated by GSAP
              }}
            >
              {icons.map((icon, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: icon.size || 64,
                  }}
                >
                  {icon.emoji}
                </div>
              ))}
              {/* Default icon if none provided */}
              {icons.length === 0 && <div style={{ fontSize: 64 }}>🗺️</div>}
            </div>
          </>
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
export const HOOK_1A_DURATION_MIN = 10 * 30;
export const HOOK_1A_DURATION_MAX = 20 * 30;
export const HOOK_1A_EXIT_TRANSITION = 15;
