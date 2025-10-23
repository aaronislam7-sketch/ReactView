import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, Easing } from 'remotion';
import { THEME } from '../utils/theme';

/**
 * EXPLAIN SEQUENTIAL TEMPLATE
 * 
 * For sequential reveals (like Knodovia's 4 regions)
 * Not a grid - items appear one after another
 * Supports longer durations (configurable)
 */

const ExplainSequentialTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const colors = scene.style_tokens?.colors || {
    bg: THEME.colors.canvas.primary,
    accent: THEME.colors.markers.blue,
    ink: THEME.colors.text.primary,
  };

  const texts = scene.fill?.texts || {};
  const regions = scene.fill?.regions || []; // Array of region objects

  // Dynamic beat calculation based on duration
  const totalDuration = durationInFrames / fps; // seconds
  const BEAT = 36; // 1.2s base beat
  
  // Calculate beats based on number of regions
  const regionCount = regions.length || 4;
  const regionDuration = (totalDuration * 0.7) / regionCount; // 70% of time for regions
  const regionBeat = regionDuration * fps; // frames per region

  const beats = {
    prelude: 0,
    title: BEAT * 0.5,
    region1: BEAT * 2,
    region2: BEAT * 2 + regionBeat,
    region3: BEAT * 2 + regionBeat * 2,
    region4: BEAT * 2 + regionBeat * 3,
    summary: durationInFrames - (BEAT * 2),
    settle: durationInFrames - BEAT,
  };

  const cameraZoom = interpolate(
    frame,
    [0, beats.region1, beats.summary, beats.settle],
    [1.0, 1.02, 1.04, 1.01],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const cameraDriftX = Math.sin(frame * 0.008) * 2;
  const cameraDriftY = Math.cos(frame * 0.006) * 1.5;

  const writeOnReveal = (startFrame, duration = 24) => {
    if (frame < startFrame) return { opacity: 0, clipPath: 'inset(0 100% 0 0)', progress: 0 };
    if (frame >= startFrame + duration) return { opacity: 1, clipPath: 'inset(0 0 0 0)', progress: 1 };

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
    );

    return {
      opacity: interpolate(progress, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' }),
      clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
      progress,
    };
  };

  const buildIn = (startFrame, duration = 22) => {
    if (frame < startFrame) return { opacity: 0, scale: 0 };
    if (frame >= startFrame + duration) return { opacity: 1, scale: 1 };

    const progress = interpolate(
      frame,
      [startFrame, startFrame + duration],
      [0, 1],
      { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' }
    );

    return { opacity: progress, scale: progress };
  };

  const depthShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';

  // Get region beats dynamically
  const getRegionBeat = (index) => {
    return beats.region1 + (regionBeat * index);
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`,
      }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom}) translate(${cameraDriftX}px, ${cameraDriftY}px)`,
          padding: '60px 90px',
        }}
      >
        {/* TITLE */}
        {frame >= beats.title && texts.title && (
          <div style={{ position: 'absolute', top: 60, left: 90, right: 90 }}>
            <div style={{ position: 'relative' }}>
              <div style={writeOnReveal(beats.title, 28)}>
                <span
                  style={{
                    fontFamily: THEME.fonts.marker.secondary,
                    fontSize: 56,
                    fontWeight: 700,
                    color: colors.ink,
                    lineHeight: 1.2,
                    textShadow: depthShadow,
                  }}
                >
                  {texts.title}
                </span>
              </div>

              {/* Pen tip */}
              {(() => {
                const reveal = writeOnReveal(beats.title, 28);
                if (reveal.progress > 0 && reveal.progress < 1) {
                  return (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${reveal.progress * 100}%`,
                        top: '50%',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: colors.accent,
                        transform: 'translateY(-50%)',
                        boxShadow: `0 0 20px ${colors.accent}`,
                      }}
                    />
                  );
                }
              })()}
            </div>

            {/* Underline */}
            {frame >= beats.title + 24 && (
              <svg width="450" height="6" viewBox="0 0 450 6" style={{ marginTop: 14 }}>
                <line
                  x1="0"
                  y1="3"
                  x2="450"
                  y2="3"
                  stroke={colors.accent}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="450"
                  strokeDashoffset={interpolate(
                    frame,
                    [beats.title + 24, beats.title + 48],
                    [450, 0],
                    { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
                  )}
                />
              </svg>
            )}
          </div>
        )}

        {/* REGIONS - Sequential vertical reveals */}
        <div
          style={{
            position: 'absolute',
            top: 180,
            left: 90,
            right: 90,
            bottom: 160,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            justifyContent: 'space-around',
          }}
        >
          {regions.map((region, index) => {
            const regionBeatStart = getRegionBeat(index);
            if (frame < regionBeatStart) return null;

            return (
              <div
                key={index}
                style={{
                  opacity: buildIn(regionBeatStart, 24).opacity,
                  transform: `translateX(${(1 - buildIn(regionBeatStart, 24).scale) * 40}px)`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 24,
                    alignItems: 'center',
                    padding: '20px 28px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: `4px solid ${region.color || colors.accent}`,
                    borderRadius: 10,
                    boxShadow: depthShadow,
                  }}
                >
                  {/* Icon/Badge */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: 70,
                      height: 70,
                      borderRadius: '50%',
                      backgroundColor: region.color || colors.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 40,
                      transform: `scale(${buildIn(regionBeatStart + 10, 14).scale})`,
                      opacity: buildIn(regionBeatStart + 10, 14).opacity,
                      boxShadow: `0 4px 16px ${region.color || colors.accent}60`,
                    }}
                  >
                    {region.icon || '📍'}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    {/* Region name */}
                    <div style={{ position: 'relative', marginBottom: 8 }}>
                      <div style={writeOnReveal(regionBeatStart + 14, 20)}>
                        <span
                          style={{
                            fontFamily: THEME.fonts.marker.secondary,
                            fontSize: 32,
                            fontWeight: 700,
                            color: region.color || colors.accent,
                            lineHeight: 1.2,
                          }}
                        >
                          {region.name}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div style={{ position: 'relative' }}>
                      <div style={writeOnReveal(regionBeatStart + 20, 26)}>
                        <span
                          style={{
                            fontFamily: THEME.fonts.marker.handwritten,
                            fontSize: 24,
                            color: colors.ink,
                            lineHeight: 1.5,
                          }}
                        >
                          {region.description}
                        </span>
                      </div>
                    </div>

                    {/* Optional annotation */}
                    {region.annotation && frame >= regionBeatStart + 40 && (
                      <div
                        style={{
                          marginTop: 10,
                          opacity: buildIn(regionBeatStart + 40, 16).opacity,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: THEME.fonts.structure.primary,
                            fontSize: 18,
                            fontStyle: 'italic',
                            color: `${colors.ink}90`,
                            backgroundColor: `${region.color || colors.accent}20`,
                            padding: '4px 12px',
                            borderRadius: 4,
                          }}
                        >
                          {region.annotation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Connecting lines between regions */}
        {frame >= getRegionBeat(0) + 45 && regions.length > 1 && (
          <svg
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            viewBox="0 0 1920 1080"
          >
            {regions.slice(0, -1).map((_, index) => {
              const lineStart = getRegionBeat(index) + 45;
              if (frame < lineStart) return null;

              const y1 = 220 + (index * 180);
              const y2 = y1 + 180;

              return (
                <path
                  key={index}
                  d={`M 160 ${y1} L 160 ${y2}`}
                  stroke={colors.accent}
                  strokeWidth="3"
                  strokeDasharray="180"
                  strokeDashoffset={interpolate(
                    frame,
                    [lineStart, lineStart + 24],
                    [180, 0],
                    { easing: Easing.out(Easing.ease), extrapolateRight: 'clamp' }
                  )}
                  opacity="0.25"
                  fill="none"
                />
              );
            })}
          </svg>
        )}

        {/* SUMMARY */}
        {frame >= beats.summary && texts.summary && (
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '75%',
            }}
          >
            <div
              style={{
                opacity: buildIn(beats.summary, 28).opacity,
                transform: `scale(${buildIn(beats.summary, 28).scale})`,
              }}
            >
              <div
                style={{
                  padding: '24px 45px',
                  backgroundColor: colors.accent,
                  borderRadius: 50,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
                }}
              >
                <div style={writeOnReveal(beats.summary + 12, 26)}>
                  <span
                    style={{
                      fontFamily: THEME.fonts.structure.primary,
                      fontSize: 28,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.3,
                      textAlign: 'center',
                      display: 'block',
                    }}
                  >
                    {texts.summary}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settle */}
        {frame >= beats.settle && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: colors.bg,
              opacity: interpolate(frame, [beats.settle, beats.settle + 30], [0, 0.25], {
                extrapolateRight: 'clamp',
              }),
            }}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { ExplainSequentialTemplate };
