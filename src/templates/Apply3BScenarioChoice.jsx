import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import gsap from 'gsap';
import { cascadeReveal, gracefulMove, pulseEmphasis } from '../utils/gsapAnimations';

/**
 * APPLY 3B: SCENARIO CHOICE
 * 
 * Intent: Present decision point with branching paths
 * Pattern: "You're in X situation, what do you do?"
 * Visual: Scenario center, choice paths diverging, outcomes
 * Tone: Interactive, Thoughtful
 * Duration: 20-35s
 * 
 * NO BOXES - Rough sketched paths + choice bubbles
 */

const Apply3BScenarioChoice = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const scenarioRef = useRef(null);
  const promptRef = useRef(null);
  const choiceRefs = useRef([]);
  const outcomeRefs = useRef([]);
  const [triggered, setTriggered] = useState({ scenarioIn: false, promptIn: false, choicesIn: false, expandChoice: false, outcomesIn: false });

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.cream,
    accent: THEME.colors.markers.purple,
    path1: THEME.colors.markers.blue,
    path2: THEME.colors.markers.orange,
    ink: THEME.colors.text.primary,
  };

  const data = scene.fill?.scenario || {};
  const choices = data.choices || [];

  // Beat timing
  const BEAT = 36;
  const beats = {
    prelude: 0,
    scenario: BEAT * 0.8,
    prompt: BEAT * 2.5,
    paths: BEAT * 4,
    choices: BEAT * 5,
    outcomes: BEAT * 7,
    settle: BEAT * 9,
  };

  const cameraZoom = interpolate(
    frame,
    [0, beats.scenario, beats.settle],
    [1.04, 1.0, 1.02],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateRight: 'clamp' }
  );

  // GSAP entrances and mid-scene spotlight
  useEffect(() => {
    if (frame >= beats.scenario + 10 && !triggered.scenarioIn && scenarioRef.current) {
      gsap.fromTo(scenarioRef.current, { opacity: 0, y: -24, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.5)' });
      setTriggered(p => ({ ...p, scenarioIn: true }));
    }

    if (frame >= beats.prompt && !triggered.promptIn && promptRef.current) {
      gsap.fromTo(promptRef.current, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
      setTriggered(p => ({ ...p, promptIn: true }));
    }

    if (frame >= beats.choices + 12 && !triggered.choicesIn) {
      const refs = choiceRefs.current.filter(Boolean);
      if (refs.length) {
        cascadeReveal(refs, { duration: 0.6, stagger: 0.18, ease: 'back.out(1.5)' });
        setTriggered(p => ({ ...p, choicesIn: true }));
      }
    }

    // Mid-scene: spotlight first choice by expanding slightly
    if (frame >= beats.outcomes - 10 && !triggered.expandChoice) {
      const first = choiceRefs.current[0];
      if (first) {
        gracefulMove(first, { scale: 1.08, duration: 0.8, ease: 'power2.inOut' });
        setTimeout(() => pulseEmphasis(first, { scale: 1.06, duration: 0.3, repeat: 1, yoyo: true }), 820);
      }
      setTriggered(p => ({ ...p, expandChoice: true }));
    }

    if (frame >= beats.outcomes && !triggered.outcomesIn) {
      const refs = outcomeRefs.current.filter(Boolean);
      if (refs.length) {
        cascadeReveal(refs, { duration: 0.5, stagger: 0.15 });
        setTriggered(p => ({ ...p, outcomesIn: true }));
      }
    }
  }, [frame, beats, triggered]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Scenario circle (center)
    if (frame >= beats.scenario) {
      const progress = Math.min((frame - beats.scenario) / 35, 1);
      
      const scenarioCircle = rc.circle(960, 380, 220 * progress, {
        stroke: colors.accent,
        strokeWidth: 6,
        roughness: 0,
        bowing: 0,
        fill: `${colors.accent}12`,
        fillStyle: 'hachure',
        hachureGap: 10,
      });

      const paths = scenarioCircle.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - progress);
      });

      svg.appendChild(scenarioCircle);
    }

    // Diverging paths
    if (frame >= beats.paths) {
      const progress = Math.min((frame - beats.paths) / 40, 1);

      // Left path
      const leftPath = `M 960 490 Q ${960 - 200 * progress} ${490 + 120 * progress} ${960 - 400 * progress} ${490 + 220 * progress}`;
      const leftLine = rc.path(leftPath, {
        stroke: colors.path1,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(leftLine);

      // Right path
      const rightPath = `M 960 490 Q ${960 + 200 * progress} ${490 + 120 * progress} ${960 + 400 * progress} ${490 + 220 * progress}`;
      const rightLine = rc.path(rightPath, {
        stroke: colors.path2,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(rightLine);
    }

    // Choice bubbles
    if (frame >= beats.choices) {
      const choicePositions = [
        { x: 560, y: 710, color: colors.path1 },
        { x: 1360, y: 710, color: colors.path2 },
      ];

      choices.forEach((choice, i) => {
        if (i >= choicePositions.length) return;
        
        const startFrame = beats.choices + i * 18;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 28, 1);
        const pos = choicePositions[i];

        const choiceBubble = rc.ellipse(pos.x, pos.y, 320 * progress, 160 * progress, {
          stroke: pos.color,
          strokeWidth: 5,
          roughness: 0,
          bowing: 0,
          fill: `${pos.color}10`,
          fillStyle: 'hachure',
          hachureGap: 12,
        });

        svg.appendChild(choiceBubble);
      });
    }

    // Decision marker (arrow pointing down from scenario)
    if (frame >= beats.prompt + 20) {
      const progress = Math.min((frame - beats.prompt - 20) / 20, 1);
      
      const markerPath = `M 960 ${430 + 30 * progress} L 960 490`;
      const marker = rc.path(markerPath, {
        stroke: colors.accent,
        strokeWidth: 4,
        roughness: 0,
        bowing: 0,
      });
      svg.appendChild(marker);
    }

  }, [frame, beats, colors, choices]);

  const buildIn = (startFrame, duration = 28) => {
    if (frame < startFrame) {
      return { opacity: 0, transform: 'translateY(-18px) scale(0.93)' };
    }
    if (frame >= startFrame + duration) {
      return { opacity: 1, transform: 'translateY(0) scale(1)' };
    }

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.back(1.5)), extrapolateRight: 'clamp' }
    );

    return {
      opacity: progress,
      transform: `translateY(${-18 * (1 - progress)}px) scale(${0.93 + progress * 0.07})`,
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
          {/* Scenario */}
          {frame >= beats.scenario + 10 && (
            <div
              style={{
                position: 'absolute',
                top: 360,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 400,
                textAlign: 'center',
                ...buildIn(beats.scenario + 10, 35),
              }}
            >
              <h3
                style={{
                  fontFamily: THEME.fonts.structure.primary,
                  fontSize: 28,
                  fontWeight: 600,
                  color: colors.accent,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {data.scenario || 'You face a choice...'}
              </h3>
            </div>
          )}

          {/* Prompt */}
          {frame >= beats.prompt && (
            <div
              style={{
                position: 'absolute',
                top: 520,
                left: '50%',
                transform: 'translateX(-50%)',
                ...buildIn(beats.prompt, 30),
              }}
            >
              <p
                style={{
                  fontFamily: THEME.fonts.marker.handwritten,
                  fontSize: 34,
                  color: `${colors.ink}70`,
                  margin: 0,
                  fontStyle: 'italic',
                  whiteSpace: 'nowrap',
                }}
              >
                {data.prompt || 'What would you do?'}
              </p>
            </div>
          )}

          {/* Choices */}
          {choices.map((choice, i) => {
            const startFrame = beats.choices + i * 18 + 12;
            if (frame < startFrame) return null;

            const positions = [
              { x: 560, y: 710 },
              { x: 1360, y: 710 },
            ];
            const pos = positions[i];
            const choiceColor = i === 0 ? colors.path1 : colors.path2;

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
                  ...buildIn(startFrame, 32),
                }}
              >
                <h4
                  style={{
                    fontFamily: THEME.fonts.structure.primary,
                    fontSize: 24,
                    fontWeight: 700,
                    color: choiceColor,
                    margin: '0 0 10px 0',
                  }}
                >
                  {choice.label || `Option ${i + 1}`}
                </h4>
                <p
                  style={{
                    fontFamily: THEME.fonts.structure.secondary,
                    fontSize: 18,
                    color: colors.ink,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {choice.description || '...'}
                </p>
              </div>
            );
          })}

          {/* Outcomes (brief hints) */}
          {frame >= beats.outcomes && choices.map((choice, i) => {
            const startFrame = beats.outcomes + i * 15;
            if (frame < startFrame || !choice.outcome) return null;

            const positions = [
              { x: 560, y: 860 },
              { x: 1360, y: 860 },
            ];
            const pos = positions[i];

            return (
              <div
                key={`outcome-${i}`}
                style={{
                  position: 'absolute',
                  top: pos.y,
                  left: pos.x,
                  transform: 'translateX(-50%)',
                  width: 240,
                  textAlign: 'center',
                  ...buildIn(startFrame, 25),
                }}
              >
                <p
                  style={{
                    fontFamily: THEME.fonts.marker.handwritten,
                    fontSize: 16,
                    color: `${colors.ink}50`,
                    margin: 0,
                    fontStyle: 'italic',
                  }}
                >
                  {choice.outcome}
                </p>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Apply3BScenarioChoice };
export const APPLY_3B_DURATION_MIN = 20 * 30;
export const APPLY_3B_DURATION_MAX = 35 * 30;
export const APPLY_3B_EXIT_TRANSITION = 15;
