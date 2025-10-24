import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import gsap from 'gsap';
import { cascadeReveal, flipReveal, pulseEmphasis, createTimeline } from '../utils/gsapAnimations';

/**
 * APPLY 3A: MICRO QUIZ
 * 
 * Intent: Quick knowledge check with immediate feedback
 * Pattern: "Which one...?" with 2-4 options
 * Visual: Question + option circles, correct answer highlight
 * Tone: Energetic, Quick
 * Duration: 12-25s
 * 
 * NO BOXES - Rough sketched circles + check marks
 */

const Apply3AMicroQuiz = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const questionRef = useRef(null);
  const optionRefs = useRef([]);
  const [triggered, setTriggered] = useState({ questionIn: false, optionsIn: false, reveal: false, celebrate: false });

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.primary,
    accent: THEME.colors.markers.green,
    wrong: THEME.colors.markers.red,
    ink: THEME.colors.text.primary,
  };

  const data = scene.fill?.quiz || {};
  const options = data.options || [];
  const correctIndex = data.correctIndex || 0;

  // Beat timing
  const BEAT = 30; // 1s - quick!
  const beats = {
    prelude: 0,
    question: BEAT * 0.5,
    options: BEAT * 2,
    reveal: BEAT * (2 + options.length * 0.6),
    celebrate: BEAT * (3 + options.length * 0.6),
    settle: BEAT * (4.5 + options.length * 0.6),
  };

  const cameraZoom = interpolate(
    frame,
    [0, beats.question, beats.celebrate, beats.settle],
    [1.03, 1.0, 1.05, 1.0],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateRight: 'clamp' }
  );

  // GSAP entrances and interactions
  useEffect(() => {
    // Question entrance
    if (frame >= beats.question && !triggered.questionIn && questionRef.current) {
      gsap.fromTo(questionRef.current,
        { opacity: 0, y: -30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.6)' }
      );
      setTriggered(p => ({ ...p, questionIn: true }));
    }

    // Options cascade
    if (frame >= beats.options + 8 && !triggered.optionsIn) {
      const refs = optionRefs.current.filter(Boolean);
      if (refs.length) {
        cascadeReveal(refs, { duration: 0.6, stagger: 0.15, ease: 'back.out(1.5)' });
        setTriggered(p => ({ ...p, optionsIn: true }));
      }
    }

    // Reveal correct answer via flip
    if (frame >= beats.reveal && !triggered.reveal) {
      const refs = optionRefs.current.filter(Boolean);
      if (refs[correctIndex]) {
        flipReveal(refs[correctIndex], { duration: 0.6, rotationY: 180, ease: 'power2.inOut' });
        // Pulse emphasis after flip
        setTimeout(() => pulseEmphasis(refs[correctIndex], { scale: 1.12, duration: 0.4, repeat: 1, yoyo: true }), 620);
      }
      setTriggered(p => ({ ...p, reveal: true }));
    }

    // Celebration timeline (subtle, no jitter)
    if (frame >= beats.celebrate && !triggered.celebrate) {
      const tl = createTimeline();
      const refs = optionRefs.current.filter(Boolean);
      if (refs[correctIndex]) {
        tl.to(refs[correctIndex], { scale: 1.06, duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.inOut' });
      }
      setTriggered(p => ({ ...p, celebrate: true }));
    }
  }, [frame, beats, triggered, correctIndex]);

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
        ? [{ x: 580, y: 600 }, { x: 1340, y: 600 }]
        : options.length === 3
        ? [{ x: 420, y: 600 }, { x: 960, y: 600 }, { x: 1500, y: 600 }]
        : [{ x: 340, y: 600 }, { x: 780, y: 600 }, { x: 1140, y: 600 }, { x: 1580, y: 600 }];

      options.forEach((option, i) => {
        const startFrame = beats.options + i * BEAT * 0.6;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 25, 1);
        const pos = positions[i] || positions[0];

        // Is this the correct answer being revealed?
        const isCorrect = i === correctIndex;
        const isRevealing = frame >= beats.reveal;

        const circleColor = isRevealing 
          ? (isCorrect ? colors.accent : colors.wrong)
          : `${colors.ink}40`;

        const circle = rc.circle(pos.x, pos.y, 120 * progress, {
          stroke: circleColor,
          strokeWidth: isRevealing && isCorrect ? 7 : 5,
          roughness: 0,
          bowing: 0,
          fill: isRevealing && isCorrect ? `${colors.accent}15` : 'none',
          fillStyle: 'hachure',
          hachureGap: 10,
        });

        svg.appendChild(circle);

        // Check mark for correct answer
        if (isRevealing && isCorrect && frame >= beats.celebrate) {
          const checkProgress = Math.min((frame - beats.celebrate) / 20, 1);
          const checkPath = `M ${pos.x - 30} ${pos.y} L ${pos.x - 10} ${pos.y + 25 * checkProgress} L ${pos.x + 35 * checkProgress} ${pos.y - 30}`;
          
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

    // Celebration burst (stars around correct answer)
    if (frame >= beats.celebrate + 10) {
      const pos = options.length === 2
        ? [{ x: 580, y: 600 }, { x: 1340, y: 600 }][correctIndex]
        : options.length === 3
        ? [{ x: 420, y: 600 }, { x: 960, y: 600 }, { x: 1500, y: 600 }][correctIndex]
        : [{ x: 340, y: 600 }, { x: 780, y: 600 }, { x: 1140, y: 600 }, { x: 1580, y: 600 }][correctIndex];

      if (pos) {
        const burstProgress = Math.min((frame - beats.celebrate - 10) / 18, 1);

        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const distance = 100 * burstProgress;
          const starX = pos.x + Math.cos(angle) * distance;
          const starY = pos.y + Math.sin(angle) * distance;

          const starSize = 20;
          const starPath = `M ${starX} ${starY - starSize} L ${starX + 6} ${starY - 6} L ${starX + starSize} ${starY} L ${starX + 6} ${starY + 6} L ${starX} ${starY + starSize} L ${starX - 6} ${starY + 6} L ${starX - starSize} ${starY} L ${starX - 6} ${starY - 6} Z`;

          const star = rc.path(starPath, {
            stroke: colors.accent,
            strokeWidth: 2,
            roughness: 0,
            fill: `${colors.accent}40`,
            fillStyle: 'solid',
          });

          star.style.opacity = 1 - burstProgress * 0.7;
          svg.appendChild(star);
        }
      }
    }

  }, [frame, beats, colors, options, correctIndex]);

  const buildIn = (startFrame, duration = 25) => {
    if (frame < startFrame) {
      return { opacity: 0, transform: 'translateY(-20px) scale(0.9)' };
    }
    if (frame >= startFrame + duration) {
      return { opacity: 1, transform: 'translateY(0) scale(1)' };
    }

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.back(1.6)), extrapolateRight: 'clamp' }
    );

    return {
      opacity: progress,
      transform: `translateY(${-20 * (1 - progress)}px) scale(${0.9 + progress * 0.1})`,
    };
  };

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
          transform: `scale(${cameraZoom})`,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      />

      <AbsoluteFill style={{ transform: `scale(${cameraZoom})` }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', padding: '100px 150px' }}>
          {/* Question */}
          {frame >= beats.question && (
            <div style={{ ...buildIn(beats.question, 30), textAlign: 'center' }}>
              <h2
                style={{
                  fontFamily: THEME.fonts.marker.secondary,
                  fontSize: 56,
                  fontWeight: 700,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {data.question || 'Quick check!'}
              </h2>
            </div>
          )}

          {/* Options */}
          {options.map((option, i) => {
            const startFrame = beats.options + i * BEAT * 0.6 + 8;
            if (frame < startFrame) return null;

            const positions = options.length === 2
              ? [{ x: 580, y: 680 }, { x: 1340, y: 680 }]
              : options.length === 3
              ? [{ x: 420, y: 680 }, { x: 960, y: 680 }, { x: 1500, y: 680 }]
              : [{ x: 340, y: 680 }, { x: 780, y: 680 }, { x: 1140, y: 680 }, { x: 1580, y: 680 }];

            const pos = positions[i] || positions[0];
            const isCorrect = i === correctIndex;
            const isRevealing = frame >= beats.reveal;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: pos.y,
                  left: pos.x,
                  transform: 'translate(-50%, -50%)',
                  width: 280,
                  textAlign: 'center',
                  ...buildIn(startFrame, 28),
                }}
              >
                <p
                  style={{
                    fontFamily: THEME.fonts.structure.primary,
                    fontSize: 26,
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
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Apply3AMicroQuiz };
export const APPLY_3A_DURATION_MIN = 12 * 30;
export const APPLY_3A_DURATION_MAX = 25 * 30;
export const APPLY_3A_EXIT_TRANSITION = 12;
