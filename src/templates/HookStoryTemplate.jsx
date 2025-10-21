import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import { fadeInUp, bounceIn, pulse, handDrawnWobble, paperTexture } from '../sdk/motion';
import { useStyleTokens } from '../sdk/StyleTokensProvider';

/**
 * HOOK STORY Template
 * Purpose: Narrative-driven hook using storytelling to engage
 * Style: Story arc with characters/scenarios, visual journey
 * Pedagogy: Emotional connection through narrative, relatable scenarios
 * Differentiation: Story-based vs question-driven (original Hook)
 */
export const HookStoryTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const styleTokens = useStyleTokens();

  // Use CSS variables where possible, fallback to scene tokens
  const colors = scene.style_tokens?.colors || {
    bg: 'var(--kn-bg, #fafafa)',
    accent: 'var(--kn-accent, #e74c3c)',
    support: 'var(--kn-accent-support, #f39c12)',
    ink: 'var(--kn-ink, #2d3436)',
    highlight: 'var(--kn-highlight, #ff6b6b)'
  };

  const defaultFonts = {
    title: { family: 'var(--kn-font-title, "Cabin Sketch")', size: 72, weight: 700 },
    body: { family: 'var(--kn-font-body, "Patrick Hand")', size: 34, weight: 400 },
    story: { family: 'var(--kn-font-body, "Patrick Hand")', size: 38, weight: 400 }
  };
  
  const fonts = {
    title: scene.style_tokens?.fonts?.title || defaultFonts.title,
    body: scene.style_tokens?.fonts?.body || defaultFonts.body,
    story: scene.style_tokens?.fonts?.story || defaultFonts.story
  };

  const images = resolveSceneImages(scene.fill?.images);

  // Story arc timing - like a mini movie
  const openingStart = 0;
  const characterStart = 45;
  const conflictStart = 120;
  const twistStart = 240;
  const hookStart = 360;

  // Opening scene text
  const openingStyle = fadeInUp(frame, fps, openingStart);
  
  // Character introduction
  const characterStyle = bounceIn(frame, fps, characterStart);
  
  // Conflict/problem appears
  const conflictStyle = fadeInUp(frame, fps, conflictStart);
  
  // Plot twist moment
  const twistStyle = bounceIn(frame, fps, twistStart);
  
  // Final hook question
  const hookStyle = fadeInUp(frame, fps, hookStart);

  // Continuous subtle wobble for hand-drawn feel
  const wobbleStyle = frame > openingStart ? handDrawnWobble(frame, 0) : {};

  return (
    <div className="kn-bg-default" style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Paper texture */}
      <div style={paperTexture(0.3)} />

      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '80px 120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40
      }}>
        
        {/* Act 1: Opening Scene */}
        {frame >= openingStart && (
          <div style={{
            ...openingStyle,
            textAlign: 'center',
            maxWidth: '85%'
          }}>
            <div className="kn-text-h2" style={{
              color: colors.accent,
              marginBottom: 20,
              ...wobbleStyle
            }}>
              {scene.fill.texts.opening || '📖 Once upon a time...'}
            </div>
          </div>
        )}

        {/* Act 2: Character/Scenario */}
        {frame >= characterStart && (
          <div style={{
            ...characterStyle,
            display: 'flex',
            alignItems: 'center',
            gap: 30,
            backgroundColor: colors.bg === 'var(--kn-bg, #fafafa)' ? '#ffffff' : 'rgba(255, 255, 255, 0.95)',
            padding: '40px 60px',
            borderRadius: 'var(--kn-radius-lg, 24px)',
            boxShadow: 'var(--kn-shadow-md)',
            border: `4px solid ${colors.support}`,
            maxWidth: '90%'
          }}>
            {images.character && (
              <img
                src={images.character}
                alt="Character"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  border: `4px solid ${colors.accent}`,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  ...pulse(frame, 0.06, 0.04)
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <p className="kn-text-body" style={{
                color: colors.ink,
                margin: 0,
                lineHeight: 1.5
              }}>
                {scene.fill.texts.character || 'Meet our hero facing a challenge...'}
              </p>
            </div>
          </div>
        )}

        {/* Act 3: Conflict/Problem */}
        {frame >= conflictStart && (
          <div style={{
            ...conflictStyle,
            backgroundColor: colors.highlight,
            color: '#ffffff',
            padding: '30px 70px',
            borderRadius: 'var(--kn-radius-full, 9999px)',
            fontFamily: fonts.story.family,
            fontSize: fonts.story.size,
            fontWeight: 700,
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            border: `5px solid ${colors.accent}`,
            maxWidth: '85%',
            transform: `${conflictStyle.transform} rotate(-1deg)`,
            ...wobbleStyle
          }}>
            ⚡ {scene.fill.texts.conflict || 'But then... something unexpected happened!'}
          </div>
        )}

        {/* Act 4: The Twist */}
        {frame >= twistStart && (
          <div style={{
            ...twistStyle,
            position: 'relative',
            display: 'flex',
            gap: 25,
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '90%'
          }}>
            {['moment1', 'moment2', 'moment3'].map((key, i) => (
              scene.fill.texts[key] && (
                <div
                  key={key}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: `3px solid ${colors.ink}`,
                    borderRadius: 'var(--kn-radius-md, 16px)',
                    padding: '25px 30px',
                    minWidth: 220,
                    textAlign: 'center',
                    boxShadow: 'var(--kn-shadow-md)',
                    transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
                    ...handDrawnWobble(frame, i * 100)
                  }}
                >
                  {images[`icon${i + 1}`] && (
                    <img
                      src={images[`icon${i + 1}`]}
                      alt={`Moment ${i + 1}`}
                      style={{
                        width: 50,
                        height: 50,
                        marginBottom: 12
                      }}
                    />
                  )}
                  <p className="kn-text-small" style={{
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
        )}

        {/* Act 5: The Hook Question */}
        {frame >= hookStart && scene.fill.texts.hook && (
          <div style={{
            ...hookStyle,
            position: 'absolute',
            bottom: 70,
            left: '50%',
            transform: `translateX(-50%) scale(${Math.min(hookStyle.opacity, 1)})`,
            textAlign: 'center',
            maxWidth: '85%'
          }}>
            <div style={{
              fontFamily: fonts.title.family,
              fontSize: 56,
              fontWeight: fonts.title.weight,
              color: colors.accent,
              textShadow: '3px 3px 6px rgba(0,0,0,0.2)',
              lineHeight: 1.2,
              padding: '25px 50px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 'var(--kn-radius-lg, 24px)',
              border: `5px solid ${colors.accent}`,
              boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
              ...wobbleStyle
            }}>
              {scene.fill.texts.hook}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
