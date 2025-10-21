import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { NumberBadge } from '../sdk/components.jsx';
import { resolveSceneImages } from '../utils/imageLibrary';

/**
 * EXPLAIN Template
 * Purpose: Teach core concepts, break down complex ideas, provide clarity
 * Style: Structured, clear, step-by-step with visual aids
 * Pedagogy: Direct instruction, scaffolding, building understanding
 */
export const ExplainTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Extract scene data
  const colors = scene.style_tokens?.colors || {
    bg: '#fafafa',
    accent: '#3498db',
    support: '#86BC25',
    ink: '#2d3436',
    board: '#ffffff'
  };

  const fonts = scene.style_tokens?.fonts || {
    title: { family: 'Cabin Sketch, cursive', size: 68, weight: 700 },
    subtitle: { family: 'Patrick Hand, cursive', size: 38, weight: 400 },
    body: { family: 'Patrick Hand, cursive', size: 30, weight: 400 }
  };

  // Resolve images from library
  const images = resolveSceneImages(scene.fill?.images);

  // Animation timing - systematic reveal
  const titleStart = 0;
  const conceptStart = 45;
  const stepsStart = 90;
  const summaryStart = 450;

  // Title animation
  const titleProgress = spring({
    frame: frame - titleStart,
    fps,
    config: { damping: 15, mass: 1, stiffness: 100 }
  });

  // Main concept reveal
  const conceptProgress = spring({
    frame: frame - conceptStart,
    fps,
    config: { damping: 12, mass: 1, stiffness: 110 }
  });

  // Step boxes (up to 4 steps)
  const stepProgresses = [0, 1, 2, 3].map(i => 
    spring({
      frame: frame - (stepsStart + i * 75),
      fps,
      config: { damping: 12, mass: 1, stiffness: 100 }
    })
  );

  // Connector lines between steps
  const connectorProgresses = [0, 1, 2].map(i => 
    interpolate(
      frame,
      [stepsStart + i * 75 + 60, stepsStart + i * 75 + 85],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  );

  // Summary/key takeaway
  const summaryProgress = spring({
    frame: frame - summaryStart,
    fps,
    config: { damping: 15, mass: 1, stiffness: 100 }
  });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: colors.bg,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Paper texture overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
        opacity: 0.3,
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '50px 80px'
      }}>
        
        {/* Title */}
        {titleProgress > 0 && (
          <div style={{
            textAlign: 'center',
            marginBottom: 25,
            opacity: titleProgress,
            transform: `translateY(${(1 - titleProgress) * -30}px)`
          }}>
            <h1 style={{
              fontFamily: fonts.title.family,
              fontSize: fonts.title.size,
              fontWeight: fonts.title.weight,
              color: colors.accent,
              margin: 0,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              borderBottom: `4px solid ${colors.accent}`,
              display: 'inline-block',
              padding: '10px 40px'
            }}>
              {scene.fill.texts.title || '📚 Understanding the Concept'}
            </h1>
          </div>
        )}

        {/* Main Concept/Diagram */}
        {conceptProgress > 0 && (
          <div style={{
            textAlign: 'center',
            marginBottom: 40,
            opacity: conceptProgress,
            transform: `scale(${conceptProgress})`
          }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: colors.board,
              border: `4px solid ${colors.accent}`,
              borderRadius: 20,
              padding: '25px 50px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
            }}>
              <p style={{
                fontFamily: fonts.subtitle.family,
                fontSize: fonts.subtitle.size,
                color: colors.ink,
                margin: 0,
                fontWeight: 600
              }}>
                {scene.fill.texts.concept || 'Core Concept Here'}
              </p>
            </div>
          </div>
        )}

        {/* Step-by-Step Breakdown */}
        <div style={{
          position: 'absolute',
          top: 300,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 20
        }}>
          {['step1', 'step2', 'step3', 'step4'].map((key, i) => (
            scene.fill.texts[key] && stepProgresses[i] > 0 && (
              <div
                key={key}
                style={{
                  flex: 1,
                  position: 'relative'
                }}
              >
                {/* Step Box */}
                <div style={{
                  backgroundColor: colors.board,
                  border: `3px solid ${colors.ink}`,
                  borderRadius: 12,
                  padding: '25px 15px',
                  minHeight: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 15,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  opacity: stepProgresses[i],
                  transform: `translateY(${(1 - stepProgresses[i]) * 30}px)`
                }}>
                  {/* Number Badge */}
                  <div style={{
                    position: 'absolute',
                    top: -25,
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}>
                    <NumberBadge
                      number={i + 1}
                      size={50}
                      backgroundColor={colors.accent}
                      color="#ffffff"
                    />
                  </div>

                  {/* Icon */}
                  {images[`icon${i + 1}`] && (
                    <img
                      src={images[`icon${i + 1}`]}
                      alt={`Step ${i + 1}`}
                      style={{
                        width: 60,
                        height: 60,
                        marginTop: 15
                      }}
                    />
                  )}

                  {/* Step Text */}
                  <p style={{
                    fontFamily: fonts.body.family,
                    fontSize: fonts.body.size,
                    color: colors.ink,
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.4,
                    padding: '0 5px'
                  }}>
                    {scene.fill.texts[key]}
                  </p>
                </div>

                {/* Connector Arrow */}
                {i < 3 && connectorProgresses[i] > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 110,
                    right: -30,
                    width: 40,
                    height: 4,
                    backgroundColor: colors.support,
                    transformOrigin: 'left center',
                    transform: `scaleX(${connectorProgresses[i]})`,
                    zIndex: 5
                  }}>
                    {connectorProgresses[i] > 0.8 && (
                      <div style={{
                        position: 'absolute',
                        right: -8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: `12px solid ${colors.support}`,
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent'
                      }} />
                    )}
                  </div>
                )}
              </div>
            )
          ))}
        </div>

        {/* Summary/Key Takeaway */}
        {summaryProgress > 0 && scene.fill.texts.summary && (
          <div style={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: `translateX(-50%)`,
            opacity: summaryProgress,
            maxWidth: '85%'
          }}>
            <div style={{
              backgroundColor: colors.support,
              color: '#ffffff',
              padding: '25px 60px',
              borderRadius: 50,
              fontFamily: fonts.body.family,
              fontSize: 36,
              fontWeight: 600,
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: `4px solid ${colors.accent}`
            }}>
              💡 {scene.fill.texts.summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
