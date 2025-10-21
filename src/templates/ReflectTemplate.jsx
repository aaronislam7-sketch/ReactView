import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';

/**
 * REFLECT Template
 * Purpose: Consolidate learning, metacognition, personal connection
 * Style: Thoughtful, calm, introspective with space for thinking
 * Pedagogy: Self-assessment, synthesis, future application
 */
export const ReflectTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Extract scene data
  const colors = scene.style_tokens?.colors || {
    bg: '#f8f9fa',
    accent: '#732282',
    support: '#9b59b6',
    ink: '#2d3436',
    highlight: '#e8daef'
  };

  const fonts = scene.style_tokens?.fonts || {
    title: { family: 'Cabin Sketch, cursive', size: 70, weight: 700 },
    body: { family: 'Patrick Hand, cursive', size: 32, weight: 400 },
    emphasis: { family: 'Cabin Sketch, cursive', size: 42, weight: 600 }
  };

  // Resolve images from library
  const images = resolveSceneImages(scene.fill?.images);

  // Animation timing - gentle, contemplative pace
  const titleStart = 0;
  const mirrorStart = 60;
  const questionsStart = 120;
  const insightStart = 360;
  const nextStepsStart = 450;

  // Title animation
  const titleProgress = spring({
    frame: frame - titleStart,
    fps,
    config: { damping: 20, mass: 1, stiffness: 80 }
  });

  // Mirror/reflection icon
  const mirrorProgress = spring({
    frame: frame - mirrorStart,
    fps,
    config: { damping: 15, mass: 1, stiffness: 90 }
  });

  // Reflection questions (up to 3)
  const questionProgresses = [0, 1, 2].map(i => 
    spring({
      frame: frame - (questionsStart + i * 75),
      fps,
      config: { damping: 18, mass: 1, stiffness: 85 }
    })
  );

  // Key insight
  const insightProgress = spring({
    frame: frame - insightStart,
    fps,
    config: { damping: 15, mass: 1, stiffness: 100 }
  });

  // Next steps/call to action
  const nextStepsProgress = spring({
    frame: frame - nextStepsStart,
    fps,
    config: { damping: 12, mass: 1, stiffness: 100 }
  });

  // Gentle breathing animation for mirror icon
  const breathe = mirrorProgress > 0 ? 1 + Math.sin(frame * 0.04) * 0.04 : 1;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: colors.bg,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Soft paper texture */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
        opacity: 0.2,
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '60px 100px'
      }}>
        
        {/* Title */}
        {titleProgress > 0 && (
          <div style={{
            textAlign: 'center',
            marginBottom: 40,
            opacity: titleProgress,
            transform: `translateY(${(1 - titleProgress) * -20}px)`
          }}>
            <h1 style={{
              fontFamily: fonts.title.family,
              fontSize: fonts.title.size,
              fontWeight: fonts.title.weight,
              color: colors.accent,
              margin: 0,
              textShadow: '2px 2px 4px rgba(0,0,0,0.08)'
            }}>
              {scene.fill.texts.title || '🤔 Time to Reflect'}
            </h1>
          </div>
        )}

        {/* Central Mirror/Reflection Symbol */}
        {mirrorProgress > 0 && (
          <div style={{
            position: 'absolute',
            top: 180,
            left: '50%',
            transform: `translateX(-50%) scale(${mirrorProgress * breathe})`,
            opacity: Math.min(mirrorProgress, 0.9)
          }}>
            {images.reflectionIcon ? (
              <img
                src={images.reflectionIcon}
                alt="Reflection"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  boxShadow: '0 8px 24px rgba(115, 34, 130, 0.2)'
                }}
              />
            ) : (
              <div style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: colors.highlight,
                border: `4px solid ${colors.accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 60,
                boxShadow: '0 8px 24px rgba(115, 34, 130, 0.2)'
              }}>
                💭
              </div>
            )}
          </div>
        )}

        {/* Reflection Questions */}
        <div style={{
          position: 'absolute',
          top: 340,
          left: 100,
          right: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 30
        }}>
          {['question1', 'question2', 'question3'].map((key, i) => (
            scene.fill.texts[key] && questionProgresses[i] > 0 && (
              <div
                key={key}
                style={{
                  opacity: questionProgresses[i],
                  transform: `translateX(${(1 - questionProgresses[i]) * (i % 2 === 0 ? -40 : 40)}px)`
                }}
              >
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: `3px solid ${colors.support}`,
                  borderLeft: `12px solid ${colors.accent}`,
                  borderRadius: 12,
                  padding: '25px 40px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                  position: 'relative'
                }}>
                  {/* Question mark icon */}
                  <div style={{
                    position: 'absolute',
                    left: -35,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    ?
                  </div>

                  <p style={{
                    fontFamily: fonts.body.family,
                    fontSize: fonts.body.size,
                    color: colors.ink,
                    margin: 0,
                    lineHeight: 1.5,
                    fontStyle: 'italic'
                  }}>
                    {scene.fill.texts[key]}
                  </p>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Key Insight */}
        {insightProgress > 0 && scene.fill.texts.insight && (
          <div style={{
            position: 'absolute',
            bottom: 160,
            left: '50%',
            transform: `translateX(-50%)`,
            opacity: insightProgress,
            maxWidth: '75%'
          }}>
            <div style={{
              backgroundColor: colors.highlight,
              border: `4px solid ${colors.accent}`,
              borderRadius: 20,
              padding: '25px 50px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(115, 34, 130, 0.15)'
            }}>
              <p style={{
                fontFamily: fonts.emphasis.family,
                fontSize: fonts.emphasis.size,
                color: colors.accent,
                margin: 0,
                fontWeight: 600
              }}>
                💡 {scene.fill.texts.insight}
              </p>
            </div>
          </div>
        )}

        {/* Next Steps */}
        {nextStepsProgress > 0 && scene.fill.texts.nextSteps && (
          <div style={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: `translateX(-50%) scale(${Math.min(nextStepsProgress, 1)})`,
            opacity: nextStepsProgress,
            maxWidth: '80%'
          }}>
            <div style={{
              backgroundColor: colors.accent,
              color: '#ffffff',
              padding: '25px 60px',
              borderRadius: 50,
              fontFamily: fonts.body.family,
              fontSize: 36,
              fontWeight: 600,
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(115, 34, 130, 0.3)',
              border: '4px solid #ffffff'
            }}>
              🚀 {scene.fill.texts.nextSteps}
            </div>
          </div>
        )}

        {/* Decorative corner elements */}
        <div style={{
          position: 'absolute',
          top: 20,
          right: 40,
          fontSize: 40,
          opacity: titleProgress * 0.4
        }}>
          ✨
        </div>
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 40,
          fontSize: 40,
          opacity: titleProgress * 0.4
        }}>
          ✨
        </div>
      </div>
    </div>
  );
};
