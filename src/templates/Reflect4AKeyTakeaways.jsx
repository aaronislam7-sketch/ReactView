import React, { useEffect, useRef, useState } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';
import gsap from 'gsap';
import { cascadeReveal, gracefulMove, highlightReveal } from '../utils/gsapAnimations';

/**
 * REFLECT 4A: KEY TAKEAWAYS
 * 
 * Intent: Summarize core lessons in memorable list
 * Pattern: "Remember these X things..."
 * Visual: Numbered list, checkmarks, emphasis boxes
 * Tone: Clear, Affirming
 * Duration: 18-30s
 * 
 * NO BOXES - Rough sketched frames + organic bullets
 */

const Reflect4AKeyTakeaways = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const svgRef = useRef(null);
  const titleRef = useRef(null);
  const takeawayRefs = useRef([]);
  const [triggered, setTriggered] = useState({ titleIn: false, moveTitle: false, takeawaysIn: false });

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.primary,
    accent: THEME.colors.markers.green,
    accent2: THEME.colors.markers.blue,
    ink: THEME.colors.text.primary,
  };

  const data = scene.fill?.reflection || {};
  const takeaways = data.takeaways || [];

  // Beat timing
  const BEAT = 36;
  const beats = {
    prelude: 0,
    title: BEAT * 0.8,
    takeaways: BEAT * 2.2,
    checkmarks: BEAT * (2.2 + takeaways.length * 1.2),
    settle: BEAT * (4 + takeaways.length * 1.2),
  };

  const cameraZoom = interpolate(
    frame,
    [0, beats.title, beats.settle],
    [1.03, 1.0, 1.01],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateRight: 'clamp' }
  );

  // GSAP entrances + mid-scene title shrink
  useEffect(() => {
    if (frame >= beats.title && !triggered.titleIn && titleRef.current) {
      gsap.fromTo(titleRef.current, { opacity: 0, y: -18, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.5)' });
      setTriggered(p => ({ ...p, titleIn: true }));
    }

    // Mid-scene: title shrinks to top to make space
    if (frame >= beats.takeaways && !triggered.moveTitle && titleRef.current) {
      gracefulMove(titleRef.current, { y: -120, scale: 0.8, duration: 1.0, ease: 'power3.inOut' });
      setTriggered(p => ({ ...p, moveTitle: true }));
    }

    // Cascade reveal of takeaways
    if (frame >= beats.takeaways + 10 && !triggered.takeawaysIn) {
      const refs = takeawayRefs.current.filter(Boolean);
      if (refs.length) {
        cascadeReveal(refs, { duration: 0.6, stagger: 0.18, ease: 'back.out(1.5)' });
        // Highlight sweep on each item
        setTimeout(() => {
          refs.forEach((el, i) => setTimeout(() => highlightReveal(el, { color: '#FFF59D', duration: 0.5 }), i * 80));
        }, 600);
        setTriggered(p => ({ ...p, takeawaysIn: true }));
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

    // Takeaway boxes
    if (frame >= beats.takeaways) {
      takeaways.forEach((takeaway, i) => {
        const startFrame = beats.takeaways + i * BEAT * 1.2;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 32, 1);
        const yPos = 300 + i * 180;

        const takeawayBox = rc.rectangle(180, yPos, 1560 * progress, 140, {
          stroke: i % 2 === 0 ? colors.accent : colors.accent2,
          strokeWidth: 4,
          roughness: 0,
          bowing: 0,
          fill: `${i % 2 === 0 ? colors.accent : colors.accent2}06`,
          fillStyle: 'hachure',
          hachureGap: 14,
        });

        const paths = takeawayBox.querySelectorAll('path');
        paths.forEach(path => {
          const length = path.getTotalLength();
          path.style.strokeDasharray = length;
          path.style.strokeDashoffset = length * (1 - progress);
        });

        svg.appendChild(takeawayBox);
      });
    }

    // Checkmarks
    if (frame >= beats.checkmarks) {
      takeaways.forEach((takeaway, i) => {
        const startFrame = beats.checkmarks + i * 12;
        if (frame < startFrame) return;

        const progress = Math.min((frame - startFrame) / 18, 1);
        const yPos = 370 + i * 180;

        const checkPath = `M 220 ${yPos} L 240 ${yPos + 20 * progress} L 280 ${yPos - 25}`;
        const check = rc.path(checkPath, {
          stroke: i % 2 === 0 ? colors.accent : colors.accent2,
          strokeWidth: 6,
          roughness: 0,
          bowing: 0,
        });

        svg.appendChild(check);
      });
    }

    // Emphasis underlines (for title)
    if (frame >= beats.title + 30) {
      const progress = Math.min((frame - beats.title - 30) / 28, 1);
      
      const underline = rc.line(600, 200, 600 + 720 * progress, 205, {
        stroke: colors.accent,
        strokeWidth: 5,
        roughness: 0,
        bowing: 0,
      });

      svg.appendChild(underline);
    }

  }, [frame, beats, colors, takeaways]);

  const buildIn = (startFrame, duration = 28) => {
    if (frame < startFrame) {
      return { opacity: 0, transform: 'translateY(-15px) scale(0.95)' };
    }
    if (frame >= startFrame + duration) {
      return { opacity: 1, transform: 'translateY(0) scale(1)' };
    }

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.back(1.4)), extrapolateRight: 'clamp' }
    );

    return {
      opacity: progress,
      transform: `translateY(${-15 * (1 - progress)}px) scale(${0.95 + progress * 0.05})`,
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
          {/* Title */}
          {frame >= beats.title && (
            <div style={{ ...buildIn(beats.title, 30), textAlign: 'center' }}>
              <h2
                style={{
                  fontFamily: THEME.fonts.marker.secondary,
                  fontSize: 54,
                  fontWeight: 700,
                  color: colors.ink,
                  margin: 0,
                }}
              >
                {data.title || 'Key Takeaways'}
              </h2>
            </div>
          )}

          {/* Takeaways */}
          {takeaways.map((takeaway, i) => {
            const startFrame = beats.takeaways + i * BEAT * 1.2 + 12;
            if (frame < startFrame) return null;

            const yPos = 340 + i * 180;
            const takeawayColor = i % 2 === 0 ? colors.accent : colors.accent2;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: yPos,
                  left: 320,
                  width: 1380,
                  ...buildIn(startFrame, 35),
                }}
              >
                <h3
                  style={{
                    fontFamily: THEME.fonts.structure.primary,
                    fontSize: 32,
                    fontWeight: 600,
                    color: colors.ink,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: THEME.fonts.marker.primary,
                      color: takeawayColor,
                      marginRight: 16,
                      fontSize: 36,
                    }}
                  >
                    {i + 1}.
                  </span>
                  {takeaway}
                </h3>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { Reflect4AKeyTakeaways };
export const REFLECT_4A_DURATION_MIN = 18 * 30;
export const REFLECT_4A_DURATION_MAX = 30 * 30;
export const REFLECT_4A_EXIT_TRANSITION = 15;
