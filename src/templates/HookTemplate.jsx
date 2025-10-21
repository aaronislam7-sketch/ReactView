import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { NumberBadge } from '../sdk/components.jsx';
import { resolveSceneImages } from '../utils/imageLibrary';

/**
 * HOOK Template
 * Purpose: Grab attention, create curiosity, pose a compelling question
 * Style: Bold, dynamic, question-driven with visual impact
 * Pedagogy: Engage learners, activate prior knowledge, set context
 */
export const HookTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Extract scene data
  const colors = scene.style_tokens?.colors || {
    bg: '#fafafa',
    accent: '#e74c3c',
    support: '#f39c12',
    ink: '#2d3436',
    highlight: '#ff6b6b'
  };

  const fonts = scene.style_tokens?.fonts || {
    title: { family: 'Cabin Sketch, cursive', size: 80, weight: 700 },
    body: { family: 'Patrick Hand, cursive', size: 36, weight: 400 },
    question: { family: 'Cabin Sketch, cursive', size: 64, weight: 700 }
  };

  // Resolve images from library
  const images = resolveSceneImages(scene.fill?.images);

  // Animation timing
  const questionStart = 0;
  const imageStart = 45;
  const factsStart = 90;
  const challengeStart = 360;

  // Question entrance - big and bold
  const questionProgress = spring({
    frame: frame - questionStart,
    fps,
    config: { damping: 10, mass: 1, stiffness: 120 }
  });

  // Main image zoom in
  const imageProgress = spring({
    frame: frame - imageStart,
    fps,
    config: { damping: 12, mass: 1, stiffness: 100 }
  });

  // Facts appear sequentially
  const factProgresses = [0, 1, 2].map(i => 
    spring({
      frame: frame - (factsStart + i * 60),
      fps,
      config: { damping: 15, mass: 1, stiffness: 100 }
    })
  );

  // Challenge/Hook statement
  const challengeProgress = spring({
    frame: frame - challengeStart,
    fps,
    config: { damping: 12, mass: 1, stiffness: 100 }
  });

  // Pulsing effect for question
  const pulse = questionProgress > 0 ? 1 + Math.sin(frame * 0.08) * 0.03 : 1;

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
        padding: '60px 100px'
      }}>
        
        {/* Main Question - Top Center */}
        {questionProgress > 0 && (
          <div style={{
            textAlign: 'center',
            marginBottom: 40,
            opacity: questionProgress,
            transform: `scale(${questionProgress * pulse})`
          }}>
            <div style={{
              fontFamily: fonts.question.family,
              fontSize: fonts.question.size,
              fontWeight: fonts.question.weight,
              color: colors.accent,
              textShadow: '3px 3px 6px rgba(0,0,0,0.15)',
              lineHeight: 1.3,
              padding: '20px 40px',
              borderBottom: `6px solid ${colors.accent}`,
              display: 'inline-block'
            }}>
              {scene.fill.texts.question || '❓ Big Question ❓'}
            </div>
          </div>
        )}

        {/* Central Visual */}
        {imageProgress > 0 && (
          <div style={{
            position: 'absolute',
            top: 250,
            left: '50%',
            transform: `translateX(-50%) scale(${imageProgress})`,
            opacity: imageProgress
          }}>
            {images.mainImage ? (
              <img
                src={images.mainImage}
                alt="Hook visual"
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                  border: `6px solid ${colors.accent}`
                }}
              />
            ) : (
              <div style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                backgroundColor: colors.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 100,
                boxShadow: '0 12px 30px rgba(0,0,0,0.25)'
              }}>
                🎯
              </div>
            )}
          </div>
        )}

        {/* Surprising Facts/Stats */}
        <div style={{
          position: 'absolute',
          top: 500,
          left: 100,
          right: 100,
          display: 'flex',
          justifyContent: 'space-around',
          gap: 40
        }}>
          {['fact1', 'fact2', 'fact3'].map((key, i) => (
            factProgresses[i] > 0 && scene.fill.texts[key] && (
              <div
                key={key}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: `4px solid ${colors.support}`,
                  borderRadius: 16,
                  padding: '30px 20px',
                  textAlign: 'center',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
                  opacity: factProgresses[i],
                  transform: `translateY(${(1 - factProgresses[i]) * 40}px) rotate(${(1 - factProgresses[i]) * (i % 2 === 0 ? -5 : 5)}deg)`
                }}
              >
                {images[`icon${i + 1}`] && (
                  <img
                    src={images[`icon${i + 1}`]}
                    alt={`Icon ${i + 1}`}
                    style={{
                      width: 50,
                      height: 50,
                      marginBottom: 15
                    }}
                  />
                )}
                <p style={{
                  fontFamily: fonts.body.family,
                  fontSize: 28,
                  color: colors.ink,
                  margin: 0,
                  fontWeight: 600
                }}>
                  {scene.fill.texts[key]}
                </p>
              </div>
            )
          ))}
        </div>

        {/* The Challenge/Hook Statement */}
        {challengeProgress > 0 && scene.fill.texts.challenge && (
          <div style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: `translateX(-50%) scale(${Math.min(challengeProgress, 1)})`,
            opacity: challengeProgress,
            maxWidth: '80%'
          }}>
            <div style={{
              backgroundColor: colors.highlight,
              color: '#ffffff',
              padding: '30px 70px',
              borderRadius: 60,
              fontFamily: fonts.body.family,
              fontSize: 40,
              fontWeight: 700,
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              border: `5px solid ${colors.accent}`,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
              {scene.fill.texts.challenge}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
