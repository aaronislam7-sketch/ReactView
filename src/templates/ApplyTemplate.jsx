import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { NumberBadge } from '../sdk/components.jsx';
import { resolveSceneImages } from '../utils/imageLibrary';

/**
 * APPLY Template
 * Purpose: Practice, hands-on application, real-world examples
 * Style: Interactive, practical, action-oriented with clear steps
 * Pedagogy: Active learning, transfer of knowledge, skill building
 */
export const ApplyTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Extract scene data
  const colors = scene.style_tokens?.colors || {
    bg: '#fafafa',
    accent: '#86BC25',
    support: '#f39c12',
    ink: '#2d3436',
    action: '#27ae60'
  };

  const fonts = scene.style_tokens?.fonts || {
    title: { family: 'Cabin Sketch, cursive', size: 72, weight: 700 },
    subtitle: { family: 'Patrick Hand, cursive', size: 36, weight: 600 },
    body: { family: 'Patrick Hand, cursive', size: 28, weight: 400 }
  };

  // Resolve images from library
  const images = resolveSceneImages(scene.fill?.images);

  // Animation timing
  const titleStart = 0;
  const scenarioStart = 45;
  const actionsStart = 120;
  const outcomeStart = 420;

  // Title animation
  const titleProgress = spring({
    frame: frame - titleStart,
    fps,
    config: { damping: 15, mass: 1, stiffness: 100 }
  });

  // Scenario/Context box
  const scenarioProgress = spring({
    frame: frame - scenarioStart,
    fps,
    config: { damping: 12, mass: 1, stiffness: 110 }
  });

  // Action steps (up to 3 main actions)
  const actionProgresses = [0, 1, 2].map(i => 
    spring({
      frame: frame - (actionsStart + i * 90),
      fps,
      config: { damping: 10, mass: 1, stiffness: 120 }
    })
  );

  // Checkmarks for completed actions
  const checkProgresses = [0, 1, 2].map(i => 
    spring({
      frame: frame - (actionsStart + i * 90 + 60),
      fps,
      config: { damping: 8, mass: 0.8, stiffness: 150 }
    })
  );

  // Expected outcome
  const outcomeProgress = spring({
    frame: frame - outcomeStart,
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
        padding: '50px 90px'
      }}>
        
        {/* Title */}
        {titleProgress > 0 && (
          <div style={{
            textAlign: 'center',
            marginBottom: 30,
            opacity: titleProgress,
            transform: `scale(${titleProgress})`
          }}>
            <h1 style={{
              fontFamily: fonts.title.family,
              fontSize: fonts.title.size,
              fontWeight: fonts.title.weight,
              color: colors.accent,
              margin: 0,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              {scene.fill.texts.title || '🛠️ Let\'s Apply It!'}
            </h1>
          </div>
        )}

        {/* Scenario/Context Box */}
        {scenarioProgress > 0 && scene.fill.texts.scenario && (
          <div style={{
            marginBottom: 40,
            opacity: scenarioProgress,
            transform: `translateY(${(1 - scenarioProgress) * -20}px)`
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: `4px dashed ${colors.support}`,
              borderRadius: 16,
              padding: '30px 40px',
              textAlign: 'center',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
            }}>
              <p style={{
                fontFamily: fonts.subtitle.family,
                fontSize: fonts.subtitle.size,
                color: colors.ink,
                margin: 0,
                fontWeight: 600
              }}>
                📋 Scenario: {scene.fill.texts.scenario}
              </p>
            </div>
          </div>
        )}

        {/* Action Steps */}
        <div style={{
          position: 'absolute',
          top: 320,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '85%',
          display: 'flex',
          flexDirection: 'column',
          gap: 35
        }}>
          {['action1', 'action2', 'action3'].map((key, i) => (
            scene.fill.texts[key] && actionProgresses[i] > 0 && (
              <div
                key={key}
                style={{
                  position: 'relative',
                  opacity: actionProgresses[i],
                  transform: `translateX(${(1 - actionProgresses[i]) * -50}px)`
                }}
              >
                <div style={{
                  backgroundColor: '#ffffff',
                  border: `4px solid ${colors.accent}`,
                  borderRadius: 20,
                  padding: '30px 40px 30px 120px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  position: 'relative',
                  minHeight: 100,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {/* Step Number */}
                  <div style={{
                    position: 'absolute',
                    left: 30,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>
                    <NumberBadge
                      number={i + 1}
                      size={65}
                      backgroundColor={colors.action}
                      color="#ffffff"
                    />
                  </div>

                  {/* Action Text */}
                  <p style={{
                    fontFamily: fonts.body.family,
                    fontSize: fonts.body.size,
                    color: colors.ink,
                    margin: 0,
                    lineHeight: 1.5,
                    flex: 1
                  }}>
                    {scene.fill.texts[key]}
                  </p>

                  {/* Checkmark */}
                  {checkProgresses[i] > 0 && (
                    <div style={{
                      position: 'absolute',
                      right: 30,
                      top: '50%',
                      transform: `translateY(-50%) scale(${checkProgresses[i]})`,
                      fontSize: 50,
                      color: colors.action
                    }}>
                      ✓
                    </div>
                  )}

                  {/* Tool Icon */}
                  {images[`tool${i + 1}`] && actionProgresses[i] > 0.5 && (
                    <img
                      src={images[`tool${i + 1}`]}
                      alt={`Tool ${i + 1}`}
                      style={{
                        position: 'absolute',
                        right: 100,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 50,
                        height: 50,
                        opacity: (actionProgresses[i] - 0.5) * 2
                      }}
                    />
                  )}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Expected Outcome */}
        {outcomeProgress > 0 && scene.fill.texts.outcome && (
          <div style={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: `translateX(-50%) scale(${Math.min(outcomeProgress, 1)})`,
            opacity: outcomeProgress,
            maxWidth: '80%'
          }}>
            <div style={{
              backgroundColor: colors.action,
              color: '#ffffff',
              padding: '30px 70px',
              borderRadius: 60,
              fontFamily: fonts.subtitle.family,
              fontSize: 38,
              fontWeight: 700,
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              border: '5px solid #ffffff'
            }}>
              🎯 Result: {scene.fill.texts.outcome}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
