import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import gsap from 'gsap';
import { Player } from '@lottiefiles/react-lottie-player';
import {
  gracefulMove,
  pulseEmphasis,
  cascadeReveal,
} from '../utils/gsapAnimations';

/**
 * APPLY 3B: SCENARIO APPLICATION (TED-ED Style V4)
 * 
 * Intent: Apply learning to real-world scenario
 * Pattern: "Here's a situation... How would you apply what you learned?"
 * Visual: Scenario setup → choices appear → correct application revealed
 * Tone: Practical, Engaging
 * Duration: 22-35s
 * 
 * REDESIGNED FOR APPLY PEDAGOGY:
 * - ✅ Real-world scenario presentation
 * - ✅ Lottie or image support for scenario context
 * - ✅ Choice paths (2-3 approaches)
 * - ✅ Graceful reveal of best application
 * - ✅ Explanation of WHY it works
 * - ✅ Permanent Marker font
 * - ✅ Bold accent colors
 * - ✅ Zero wobble
 * 
 * Animation Flow:
 * 1. Scenario title appears
 * 2. Scenario context (Lottie/image + description)
 * 3. "How would you apply...?" question
 * 4. Choice paths appear (2-3 options)
 * 5. Correct choice emphasized & others fade
 * 6. Explanation reveals WHY this approach works
 */

const Apply3BScenarioChoice = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const titleRef = useRef(null);
  const scenarioRef = useRef(null);
  const questionRef = useRef(null);
  const choiceRefs = useRef([]);
  const explanationRef = useRef(null);

  const [triggeredAnimations, setTriggeredAnimations] = useState({
    title: false,
    scenario: false,
    question: false,
    choices: false,
    reveal: false,
    explanation: false,
  });

  const colors = scene.style_tokens?.colors || {
    bg: '#FFF9F0',
    accent: '#27AE60',    // Green for correct
    accent2: '#2E7FE4',   // Blue
    accent3: '#FF6B35',   // Bold orange
    wrong: '#E74C3C',     // Red for incorrect
    ink: '#1A1A1A',
  };

  const fonts = scene.style_tokens?.fonts || {
    primary: THEME.fonts.marker.primary,  // Permanent Marker
    secondary: THEME.fonts.structure.primary,
    size_title: 48,
    size_scenario: 28,
    size_question: 38,
    size_choice: 24,
    size_explanation: 26,
  };

  const data = scene.fill?.scenario || {};
  const choices = (data.choices || []).slice(0, 3); // Max 3 choices
  const correctIndex = data.correctIndex || 0;

  // Beat timing - TED-ED style
  const BEAT = 30;
  const beats = {
    prelude: 0,
    title: BEAT * 0.5,
    scenario: BEAT * 1.5,
    question: BEAT * 3.5,
    choices: BEAT * 5,
    reveal: BEAT * (6 + choices.length * 0.5),
    explanation: BEAT * (7.5 + choices.length * 0.5),
    settle: BEAT * (9 + choices.length * 0.5),
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

  // Scenario appears
  useEffect(() => {
    if (frame >= beats.scenario && !triggeredAnimations.scenario && scenarioRef.current) {
      gsap.fromTo(scenarioRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "back.out(1.5)" }
      );
      setTriggeredAnimations(prev => ({ ...prev, scenario: true }));
    }
  }, [frame, beats.scenario, triggeredAnimations.scenario]);

  // Question appears
  useEffect(() => {
    if (frame >= beats.question && !triggeredAnimations.question && questionRef.current) {
      gsap.fromTo(questionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.5)" }
      );
      setTriggeredAnimations(prev => ({ ...prev, question: true }));
    }
  }, [frame, beats.question, triggeredAnimations.question]);

  // Choices stagger in
  useEffect(() => {
    if (frame >= beats.choices && !triggeredAnimations.choices) {
      choiceRefs.current.forEach((ref, i) => {
        if (ref) {
          setTimeout(() => {
            gsap.fromTo(ref,
              { opacity: 0, x: -30, scale: 0.95 },
              { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: "back.out(1.5)" }
            );
          }, i * 250);
        }
      });
      setTriggeredAnimations(prev => ({ ...prev, choices: true }));
    }
  }, [frame, beats.choices, triggeredAnimations.choices]);

  // Reveal correct choice
  useEffect(() => {
    if (frame >= beats.reveal && !triggeredAnimations.reveal) {
      // Emphasize correct
      const correctRef = choiceRefs.current[correctIndex];
      if (correctRef) {
        pulseEmphasis(correctRef, {
          scale: 1.05,
          duration: 0.5,
          repeat: 2,
          yoyo: true,
        });
      }
      
      // Fade incorrect choices
      choiceRefs.current.forEach((ref, i) => {
        if (ref && i !== correctIndex) {
          gsap.to(ref, {
            opacity: 0.3,
            scale: 0.95,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      });
      
      setTriggeredAnimations(prev => ({ ...prev, reveal: true }));
    }
  }, [frame, beats.reveal, triggeredAnimations.reveal, correctIndex]);

  // Explanation reveals
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

    // Scenario frame
    if (frame >= beats.scenario) {
      const progress = Math.min((frame - beats.scenario) / 35, 1);
      
      const scenarioFrame = rc.rectangle(380, 260, 1160, 200, {
        stroke: colors.accent2,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent2}08`,
        fillStyle: 'hachure',
        hachureGap: 10,
      });

      const paths = scenarioFrame.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });

      svg.appendChild(scenarioFrame);
    }

    // Choice boxes
    if (frame >= beats.choices) {
      const positions = choices.length === 2
        ? [{ x: 480, y: 700 }, { x: 1440, y: 700 }]
        : [{ x: 360, y: 700 }, { x: 960, y: 700 }, { x: 1560, y: 700 }];

      choices.forEach((choice, i) => {
        const startFrame = beats.choices + i * 8;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 30, 1);
        const pos = positions[i];

        const isCorrect = i === correctIndex;
        const isRevealing = frame >= beats.reveal;

        const choiceColor = isRevealing 
          ? (isCorrect ? colors.accent : `${colors.wrong}40`)
          : colors.accent3;

        const strokeWidth = isRevealing && isCorrect ? 6 : 4;

        const choiceBox = rc.rectangle(pos.x - 200, pos.y - 100, 400, 200, {
          stroke: choiceColor,
          strokeWidth: strokeWidth,
          roughness: 0,
          bowing: 0,
          fill: isRevealing && isCorrect ? `${colors.accent}10` : `${choiceColor}08`,
          fillStyle: 'hachure',
          hachureGap: 12,
        });

        const paths = choiceBox.querySelectorAll('path');
        paths.forEach(path => {
          const length = path.getTotalLength();
          path.style.strokeDasharray = length;
          path.style.strokeDashoffset = length * (1 - progress);
        });

        svg.appendChild(choiceBox);

        // Check mark for correct
        if (isRevealing && isCorrect && frame >= beats.reveal + 15) {
          const checkProgress = Math.min((frame - beats.reveal - 15) / 20, 1);
          const checkPath = `M ${pos.x - 30} ${pos.y - 50} L ${pos.x - 10} ${pos.y - 30 + 20 * checkProgress} L ${pos.x + 30 * checkProgress} ${pos.y - 60}`;
          
          const check = rc.path(checkPath, {
            stroke: colors.accent,
            strokeWidth: 8,
            roughness: 0,
            bowing: 0,
          });
          svg.appendChild(check);
        }

        // X mark for incorrect (subtle)
        if (isRevealing && !isCorrect && frame >= beats.reveal + 15) {
          const xProgress = Math.min((frame - beats.reveal - 15) / 15, 1);
          const xSize = 20 * xProgress;
          const xPath1 = `M ${pos.x - xSize} ${pos.y - 50 - xSize} L ${pos.x + xSize} ${pos.y - 50 + xSize}`;
          const xPath2 = `M ${pos.x + xSize} ${pos.y - 50 - xSize} L ${pos.x - xSize} ${pos.y - 50 + xSize}`;
          
          const x1 = rc.path(xPath1, {
            stroke: `${colors.wrong}60`,
            strokeWidth: 4,
            roughness: 0,
            bowing: 0,
          });
          const x2 = rc.path(xPath2, {
            stroke: `${colors.wrong}60`,
            strokeWidth: 4,
            roughness: 0,
            bowing: 0,
          });
          svg.appendChild(x1);
          svg.appendChild(x2);
        }
      });
    }

    // Celebration burst around correct choice
    if (frame >= beats.reveal + 20) {
      const positions = choices.length === 2
        ? [{ x: 480, y: 700 }, { x: 1440, y: 700 }]
        : [{ x: 360, y: 700 }, { x: 960, y: 700 }, { x: 1560, y: 700 }];
      
      const pos = positions[correctIndex];
      const burstProgress = Math.min((frame - beats.reveal - 20) / 25, 1);

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 140 * burstProgress;
        const sparkX = pos.x + Math.cos(angle) * distance;
        const sparkY = pos.y + Math.sin(angle) * distance;

        const sparkSize = 16;
        const sparkCircle = rc.circle(sparkX, sparkY, sparkSize * burstProgress * 2, {
          stroke: colors.accent,
          strokeWidth: 2,
          roughness: 0,
          bowing: 0,
          fill: `${colors.accent}40`,
          fillStyle: 'solid',
        });
        sparkCircle.style.opacity = 1 - burstProgress * 0.6;
        svg.appendChild(sparkCircle);
      }
    }

  }, [frame, beats, colors, choices, correctIndex]);

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
        <div style={{ position: 'relative', width: '100%', height: '100%', padding: '80px 120px' }}>
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
                {data.title || 'Real-World Application'}
              </h2>
            </div>
          )}

          {/* Scenario */}
          {frame >= beats.scenario && (
            <div
              ref={scenarioRef}
              style={{
                position: 'absolute',
                top: 280,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 1100,
                textAlign: 'center',
                opacity: 0,
              }}
            >
              {/* Lottie or Image */}
              {data.lottie && (
                <div style={{ marginBottom: 16, height: 120 }}>
                  <Player
                    autoplay
                    loop
                    src={data.lottie}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
              )}
              {!data.lottie && data.image && (
                <div style={{ marginBottom: 16 }}>
                  <img
                    src={data.image}
                    alt=""
                    style={{
                      maxWidth: '100%',
                      height: 120,
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}
              
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: fonts.size_scenario,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {data.scenario || 'Imagine you\'re in this situation...'}
              </p>
            </div>
          )}

          {/* Question */}
          {frame >= beats.question && (
            <div
              ref={questionRef}
              style={{
                position: 'absolute',
                top: 510,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                maxWidth: 900,
                opacity: 0,
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_question,
                  fontWeight: 400,
                  color: colors.accent3,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {data.question || 'How would you apply what you learned?'}
              </h3>
            </div>
          )}

          {/* Choices */}
          {choices.map((choice, i) => {
            const startFrame = beats.choices + i * 8 + 10;
            if (frame < startFrame) return null;

            const positions = choices.length === 2
              ? [{ x: 480, y: 720 }, { x: 1440, y: 720 }]
              : [{ x: 360, y: 720 }, { x: 960, y: 720 }, { x: 1560, y: 720 }];

            const pos = positions[i];
            const isCorrect = i === correctIndex;
            const isRevealing = frame >= beats.reveal;

            return (
              <div
                key={i}
                ref={el => choiceRefs.current[i] = el}
                style={{
                  position: 'absolute',
                  top: pos.y,
                  left: pos.x,
                  transform: 'translate(-50%, -50%)',
                  width: 360,
                  textAlign: 'center',
                  opacity: 0,
                  padding: '20px',
                }}
              >
                <p
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: fonts.size_choice,
                    fontWeight: isRevealing && isCorrect ? 700 : 500,
                    color: isRevealing && isCorrect ? colors.accent : colors.ink,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {choice}
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
                bottom: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                maxWidth: 1000,
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
                {data.explanation || 'This approach works best because...'}
              </p>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Apply3BScenarioChoice };
export const APPLY_3B_DURATION_MIN = 22 * 30;
export const APPLY_3B_DURATION_MAX = 35 * 30;
export const APPLY_3B_EXIT_TRANSITION = 15;
