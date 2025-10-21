import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import { fadeInUp, slideIn, drawLine, handDrawnWobble, paperTexture } from '../sdk/motion';
import { useWriteOn } from '../sdk/useWriteOn';

/**
 * EXPLAIN TIMELINE Template
 * Purpose: Sequential process or historical timeline explanation
 * Style: Horizontal timeline with milestones and progression
 * Pedagogy: Linear progression, cause and effect, chronological understanding
 * Differentiation: Timeline/flow-based vs 4-box breakdown (original Explain)
 */
export const ExplainTimelineTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = scene.style_tokens?.colors || {
    bg: 'var(--kn-bg, #fafafa)',
    accent: 'var(--kn-accent, #3498db)',
    support: 'var(--kn-accent-support, #86BC25)',
    ink: 'var(--kn-ink, #2d3436)',
    line: '#95a5a6'
  };

  const defaultFonts = {
    title: { family: 'var(--kn-font-title)', size: 64, weight: 700 },
    milestone: { family: 'var(--kn-font-body)', size: 28, weight: 600 },
    body: { family: 'var(--kn-font-body)', size: 24, weight: 400 }
  };
  
  const fonts = {
    title: scene.style_tokens?.fonts?.title || defaultFonts.title,
    milestone: scene.style_tokens?.fonts?.milestone || defaultFonts.milestone,
    body: scene.style_tokens?.fonts?.body || defaultFonts.body
  };

  const images = resolveSceneImages(scene.fill?.images);

  // Timeline animation sequence
  const titleStart = 0;
  const lineStart = 45;
  const milestonesStart = 90;
  const summaryStart = 450;

  const titleStyle = fadeInUp(frame, fps, titleStart);
  
  // Timeline line drawing progress
  const lineProgress = interpolate(
    frame,
    [lineStart, lineStart + 60],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Milestones appear sequentially
  const milestones = [0, 1, 2, 3, 4].map(i => ({
    delay: milestonesStart + i * 60,
    progress: interpolate(
      frame,
      [milestonesStart + i * 60, milestonesStart + i * 60 + 30],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  }));

  const summaryStyle = fadeInUp(frame, fps, summaryStart);

  return (
    <div className="kn-bg-default" style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={paperTexture(0.3)} />

      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '60px 100px'
      }}>
        
        {/* Title */}
        {frame >= titleStart && (
          <div style={{
            ...titleStyle,
            textAlign: 'center',
            marginBottom: 50
          }}>
            <h1 className="kn-text-title" style={{
              color: colors.accent,
              margin: 0,
              padding: '15px 40px',
              borderBottom: `4px solid ${colors.accent}`,
              display: 'inline-block'
            }}>
              {scene.fill.texts.title || '⏱️ The Journey'}
            </h1>
            {scene.fill.texts.subtitle && (
              <p className="kn-text-body" style={{
                color: colors.ink,
                marginTop: 15,
                opacity: 0.8
              }}>
                {scene.fill.texts.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Timeline Container */}
        <div style={{
          position: 'relative',
          marginTop: 80,
          paddingBottom: 100
        }}>
          
          {/* Main Timeline Line */}
          {frame >= lineStart && (
            <div style={{
              position: 'absolute',
              top: 60,
              left: 100,
              right: 100,
              height: 6,
              backgroundColor: colors.line,
              borderRadius: 3,
              transformOrigin: 'left center',
              transform: `scaleX(${lineProgress})`,
              ...handDrawnWobble(frame, 100)
            }}>
              {/* Arrow at end */}
              {lineProgress > 0.95 && (
                <div style={{
                  position: 'absolute',
                  right: -10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: `20px solid ${colors.line}`,
                  borderTop: '12px solid transparent',
                  borderBottom: '12px solid transparent'
                }} />
              )}
            </div>
          )}

          {/* Timeline Milestones */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: 100,
            paddingRight: 100,
            marginTop: 30
          }}>
            {['phase1', 'phase2', 'phase3', 'phase4', 'phase5'].map((key, i) => (
              scene.fill.texts[key] && milestones[i].progress > 0 && (
                <div
                  key={key}
                  style={{
                    flex: 1,
                    maxWidth: 280,
                    position: 'relative',
                    opacity: milestones[i].progress,
                    transform: `translateY(${(1 - milestones[i].progress) * 40}px)`
                  }}
                >
                  {/* Milestone Dot */}
                  <div style={{
                    position: 'absolute',
                    top: -60,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                    border: `5px solid ${colors.bg === 'var(--kn-bg, #fafafa)' ? '#ffffff' : colors.bg}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#ffffff',
                    fontSize: 16
                  }}>
                    {i + 1}
                  </div>

                  {/* Milestone Card */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: `3px solid ${colors.ink}`,
                    borderRadius: 'var(--kn-radius-md, 16px)',
                    padding: '20px 15px',
                    minHeight: 180,
                    boxShadow: 'var(--kn-shadow-md)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    ...handDrawnWobble(frame, i * 50)
                  }}>
                    {/* Icon */}
                    {images[`icon${i + 1}`] && (
                      <img
                        src={images[`icon${i + 1}`]}
                        alt={`Phase ${i + 1}`}
                        style={{
                          width: 50,
                          height: 50,
                          margin: '0 auto',
                          borderRadius: '50%',
                          border: `2px solid ${colors.support}`
                        }}
                      />
                    )}

                    {/* Phase Label */}
                    <div style={{
                      fontFamily: fonts.milestone.family,
                      fontSize: fonts.milestone.size,
                      fontWeight: fonts.milestone.weight,
                      color: colors.accent,
                      lineHeight: 1.3
                    }}>
                      {scene.fill.texts[key]}
                    </div>

                    {/* Description */}
                    {scene.fill.texts[`desc${i + 1}`] && (
                      <div style={{
                        fontFamily: fonts.body.family,
                        fontSize: fonts.body.size,
                        color: colors.ink,
                        opacity: 0.8,
                        lineHeight: 1.4
                      }}>
                        {scene.fill.texts[`desc${i + 1}`]}
                      </div>
                    )}
                  </div>

                  {/* Connecting Line Segment */}
                  {i < 4 && (
                    <div style={{
                      position: 'absolute',
                      top: -54,
                      left: '65%',
                      width: '70%',
                      height: 6,
                      backgroundColor: colors.support,
                      opacity: milestones[i + 1]?.progress || 0,
                      transformOrigin: 'left center',
                      transform: `scaleX(${milestones[i + 1]?.progress || 0})`
                    }} />
                  )}
                </div>
              )
            ))}
          </div>
        </div>

        {/* Summary */}
        {frame >= summaryStart && scene.fill.texts.summary && (
          <div style={{
            ...summaryStyle,
            position: 'absolute',
            bottom: 50,
            left: '50%',
            transform: `translateX(-50%)`,
            maxWidth: '85%',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: colors.support,
              color: '#ffffff',
              padding: '25px 60px',
              borderRadius: 'var(--kn-radius-full, 9999px)',
              fontFamily: fonts.body.family,
              fontSize: 34,
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: `4px solid ${colors.accent}`
            }}>
              ✨ {scene.fill.texts.summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
