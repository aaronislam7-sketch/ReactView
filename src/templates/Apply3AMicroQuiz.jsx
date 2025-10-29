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
 * APPLY 3A: MICRO QUIZ (TED-ED Style V4)
 * 
 * Intent: Quick knowledge check with countdown and automatic reveal
 * Pattern: "Which one...?" with 2-4 options, 5-second countdown
 * Visual: Question + option circles, countdown timer, correct answer highlight
 * Tone: Energetic, Engaging
 * Duration: 15-25s
 * 
 * NEW FEATURES:
 * - ✅ 5-second countdown timer (animated circle)
 * - ✅ Max 4 options with dynamic layout (2/3/4)
 * - ✅ Improved pacing (question → options → countdown → reveal)
 * - ✅ Permanent Marker font
 * - ✅ Bold accent colors
 * - ✅ Zero wobble
 * - ✅ No wrong feedback (automatic reveal)
 * 
 * Animation Flow:
 * 1. Question appears
 * 2. Options stagger in
 * 3. Countdown timer appears (5s circle animation)
 * 4. Timer counts down with visual feedback
 * 5. Correct answer revealed with emphasis
 * 6. Celebration burst
 * 7. Explanation appears
 */

const Apply3AMicroQuiz = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const questionRef = useRef(null);
  const optionRefs = useRef([]);
  const timerRef = useRef(null);
  const explanationRef = useRef(null);

  const [triggeredAnimations, setTriggeredAnimations] = useState({
    question: false,
    options: false,
    timer: false,
    reveal: false,
    celebration: false,
    explanation: false,
  });

  const colors = scene.style_tokens?.colors || {
    bg: '#FAFBFC',
    accent: '#27AE60',    // Green for correct
    accent2: '#FF6B35',   // Bold orange
    ink: '#1A1A1A',
  };

  const fonts = scene.style_tokens?.fonts || {
    primary: THEME.fonts.marker.primary,  // Permanent Marker
    secondary: THEME.fonts.structure.primary,
    size_question: 52,
    size_option: 26,
    size_timer: 64,
    size_explanation: 24,
  };

  const data = scene.fill?.quiz || {};
  const options = (data.options || []).slice(0, 4); // Max 4 options
  const correctIndex = data.correctIndex || 0;

  // Beat timing - TED-ED style with countdown
  const BEAT = 30; // 1 second
  const COUNTDOWN_DURATION = 5 * BEAT; // 5 seconds
  
  const beats = {
    prelude: 0,
    question: BEAT * 0.5,
    options: BEAT * 2,
    timer: BEAT * (2 + options.length * 0.4),
    countdown: BEAT * (2.5 + options.length * 0.4),
    reveal: BEAT * (2.5 + options.length * 0.4) + COUNTDOWN_DURATION,
    celebration: BEAT * (3 + options.length * 0.4) + COUNTDOWN_DURATION,
    explanation: BEAT * (4 + options.length * 0.4) + COUNTDOWN_DURATION,
    settle: BEAT * (6 + options.length * 0.4) + COUNTDOWN_DURATION,
  };

  // Subtle camera drift
  const cameraDrift = {
    x: Math.sin(frame * 0.008) * 2,
    y: Math.cos(frame * 0.007) * 1.5,
  };

  // Countdown progress (5 seconds)
  const countdownProgress = frame >= beats.countdown && frame < beats.reveal
    ? Math.min((frame - beats.countdown) / COUNTDOWN_DURATION, 1)
    : frame >= beats.reveal ? 1 : 0;
  
  const secondsLeft = Math.max(0, Math.ceil(5 * (1 - countdownProgress)));

  // ========================================
  // GSAP ANIMATION TRIGGERS
  // ========================================
  
  // Question
  useEffect(() => {
    if (frame >= beats.question && !triggeredAnimations.question && questionRef.current) {
      gsap.fromTo(questionRef.current,
        { opacity: 0, y: -30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "back.out(1.5)" }
      );
      setTriggeredAnimations(prev => ({ ...prev, question: true }));
    }
  }, [frame, beats.question, triggeredAnimations.question]);

  // Options stagger in
  useEffect(() => {
    if (frame >= beats.options && !triggeredAnimations.options) {
      const validRefs = optionRefs.current.filter(Boolean);
      if (validRefs.length > 0) {
        validRefs.forEach((ref, i) => {
          setTimeout(() => {
            gsap.fromTo(ref,
              { opacity: 0, y: 30, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.5)" }
            );
          }, i * 200);
        });
        setTriggeredAnimations(prev => ({ ...prev, options: true }));
      }
    }
  }, [frame, beats.options, triggeredAnimations.options]);

  // Timer appears
  useEffect(() => {
    if (frame >= beats.timer && !triggeredAnimations.timer && timerRef.current) {
      gsap.fromTo(timerRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
      setTriggeredAnimations(prev => ({ ...prev, timer: true }));
    }
  }, [frame, beats.timer, triggeredAnimations.timer]);

  // Reveal correct answer
  useEffect(() => {
    if (frame >= beats.reveal && !triggeredAnimations.reveal) {
      const correctRef = optionRefs.current[correctIndex];
      if (correctRef) {
        pulseEmphasis(correctRef, {
          scale: 1.1,
          duration: 0.5,
          repeat: 2,
          yoyo: true,
        });
      }
      setTriggeredAnimations(prev => ({ ...prev, reveal: true }));
    }
  }, [frame, beats.reveal, triggeredAnimations.reveal, correctIndex]);

  // Celebration
  useEffect(() => {
    if (frame >= beats.celebration && !triggeredAnimations.celebration) {
      setTriggeredAnimations(prev => ({ ...prev, celebration: true }));
    }
  }, [frame, beats.celebration, triggeredAnimations.celebration]);

  // Explanation
  useEffect(() => {
    if (frame >= beats.explanation && !triggeredAnimations.explanation && explanationRef.current) {
      gsap.fromTo(explanationRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }
      );
      setTriggeredAnimations(prev => ({ ...prev, explanation: true }));
    }
  }, [frame, beats.explanation, triggeredAnimations.explanation]);

  // rough.js elements - ZERO WOBBLE
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Option circles
    if (frame >= beats.options) {
      const positions = options.length === 2
        ? [{ x: 640, y: 600 }, { x: 1280, y: 600 }]
        : options.length === 3
        ? [{ x: 480, y: 600 }, { x: 960, y: 600 }, { x: 1440, y: 600 }]
        : [{ x: 380, y: 600 }, { x: 760, y: 600 }, { x: 1140, y: 600 }, { x: 1540, y: 600 }];

      options.forEach((option, i) => {
        const startFrame = beats.options + i * 6;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 25, 1);
        const pos = positions[i] || positions[0];

        const isCorrect = i === correctIndex;
        const isRevealing = frame >= beats.reveal;

        const circleColor = isRevealing 
          ? (isCorrect ? colors.accent : `${colors.ink}20`)
          : `${colors.ink}40`;

        const strokeWidth = isRevealing && isCorrect ? 7 : 4;

        const circle = rc.circle(pos.x, pos.y, 100 * progress, {
          stroke: circleColor,
          strokeWidth: strokeWidth,
          roughness: 0,
          bowing: 0,
          fill: isRevealing && isCorrect ? `${colors.accent}15` : 'none',
          fillStyle: 'hachure',
          hachureGap: 10,
        });

        svg.appendChild(circle);

        // Check mark for correct answer
        if (isRevealing && isCorrect && frame >= beats.celebration) {
          const checkProgress = Math.min((frame - beats.celebration) / 20, 1);
          const checkPath = `M ${pos.x - 25} ${pos.y} L ${pos.x - 8} ${pos.y + 20 * checkProgress} L ${pos.x + 30 * checkProgress} ${pos.y - 25}`;
          
          const check = rc.path(checkPath, {
            stroke: colors.accent,
            strokeWidth: 8,
            roughness: 0,
            bowing: 0,
          });

          svg.appendChild(check);
        }
      });
    }

    // Countdown timer circle
    if (frame >= beats.timer && frame < beats.reveal) {
      const timerProgress = countdownProgress;
      
      // Background circle
      const bgCircle = rc.circle(960, 280, 100, {
        stroke: `${colors.ink}20`,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
        fill: 'none',
      });
      svg.appendChild(bgCircle);
      
      // Progress circle (counts down)
      const circumference = 2 * Math.PI * 50;
      const progressCircle = rc.circle(960, 280, 100, {
        stroke: timerProgress > 0.7 ? colors.accent2 : colors.accent,
        strokeWidth: 6,
        roughness: 0,
        bowing: 0,
        fill: 'none',
      });
      
      const paths = progressCircle.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * timerProgress;
      });
      
      svg.appendChild(progressCircle);
    }

    // Celebration burst (stars around correct answer)
    if (frame >= beats.celebration + 5) {
      const positions = options.length === 2
        ? [{ x: 640, y: 600 }, { x: 1280, y: 600 }]
        : options.length === 3
        ? [{ x: 480, y: 600 }, { x: 960, y: 600 }, { x: 1440, y: 600 }]
        : [{ x: 380, y: 600 }, { x: 760, y: 600 }, { x: 1140, y: 600 }, { x: 1540, y: 600 }];

      const pos = positions[correctIndex];

      if (pos) {
        const burstProgress = Math.min((frame - beats.celebration - 5) / 20, 1);

        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const distance = 120 * burstProgress;
          const starX = pos.x + Math.cos(angle) * distance;
          const starY = pos.y + Math.sin(angle) * distance;

          const starSize = 18;
          const starPath = `M ${starX} ${starY - starSize} L ${starX + 5} ${starY - 5} L ${starX + starSize} ${starY} L ${starX + 5} ${starY + 5} L ${starX} ${starY + starSize} L ${starX - 5} ${starY + 5} L ${starX - starSize} ${starY} L ${starX - 5} ${starY - 5} Z`;

          const star = rc.path(starPath, {
            stroke: colors.accent,
            strokeWidth: 2,
            roughness: 0,
            bowing: 0,
            fill: `${colors.accent}40`,
            fillStyle: 'solid',
          });

          star.style.opacity = 1 - burstProgress * 0.6;
          svg.appendChild(star);
        }
      }
    }

  }, [frame, beats, colors, options, correctIndex, countdownProgress]);

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
          {/* Question */}
          {frame >= beats.question && (
            <div ref={questionRef} style={{ textAlign: 'center', opacity: 0 }}>
              <h2
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_question,
                  fontWeight: 400,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {data.question || 'Quick check!'}
              </h2>
            </div>
          )}

          {/* Countdown Timer */}
          {frame >= beats.timer && frame < beats.reveal && (
            <div
              ref={timerRef}
              style={{
                position: 'absolute',
                top: 220,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                opacity: 0,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_timer,
                  fontWeight: 400,
                  color: countdownProgress > 0.7 ? colors.accent2 : colors.accent,
                }}
              >
                {secondsLeft}
              </div>
            </div>
          )}

          {/* Options - DYNAMIC LAYOUT (2-4 options) */}
          {options.map((option, i) => {
            const startFrame = beats.options + i * 6 + 8;
            if (frame < startFrame) return null;

            const positions = options.length === 2
              ? [{ x: 640, y: 680 }, { x: 1280, y: 680 }]
              : options.length === 3
              ? [{ x: 480, y: 680 }, { x: 960, y: 680 }, { x: 1440, y: 680 }]
              : [{ x: 380, y: 680 }, { x: 760, y: 680 }, { x: 1140, y: 680 }, { x: 1540, y: 680 }];

            const pos = positions[i] || positions[0];
            const isCorrect = i === correctIndex;
            const isRevealing = frame >= beats.reveal;

            return (
              <div
                key={i}
                ref={el => optionRefs.current[i] = el}
                style={{
                  position: 'absolute',
                  top: pos.y,
                  left: pos.x,
                  transform: 'translate(-50%, -50%)',
                  width: 260,
                  textAlign: 'center',
                  opacity: 0,
                }}
              >
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: fonts.size_option,
                    fontWeight: isRevealing && isCorrect ? 700 : 500,
                    color: isRevealing && isCorrect ? colors.accent : colors.ink,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {option}
                </p>
              </div>
            );
          })}

          {/* Explanation */}
          {frame >= beats.explanation && (
            <div
              ref={explanationRef}
              style={{
                position: 'absolute',
                bottom: 100,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                maxWidth: 900,
                opacity: 0,
              }}
            >
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: fonts.size_explanation,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {data.explanation || 'Here\'s why...'}
              </p>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Apply3AMicroQuiz };
export const APPLY_3A_DURATION_MIN = 15 * 30;
export const APPLY_3A_DURATION_MAX = 25 * 30;
export const APPLY_3A_EXIT_TRANSITION = 12;
