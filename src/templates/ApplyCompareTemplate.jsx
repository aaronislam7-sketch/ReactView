import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import { fadeInUp, slideIn, handDrawnWobble, paperTexture } from '../sdk/motion';

/**
 * APPLY COMPARE Template
 * Purpose: Before/After comparison showing transformation through application
 * Style: Side-by-side contrast with visual transformation
 * Pedagogy: Comparative analysis, concrete outcomes, transformation visibility
 * Differentiation: Before/After contrast vs scenario walkthrough (original Apply)
 */
export const ApplyCompareTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = scene.style_tokens?.colors || {
    bg: 'var(--kn-bg, #fafafa)',
    before: '#e74c3c',
    after: '#27ae60',
    ink: 'var(--kn-ink, #2d3436)',
    divider: '#95a5a6'
  };

  const fonts = scene.style_tokens?.fonts || {
    title: { family: 'var(--kn-font-title)', size: 64, weight: 700 },
    label: { family: 'var(--kn-font-title)', size: 48, weight: 700 },
    body: { family: 'var(--kn-font-body)', size: 28, weight: 400 }
  };

  const images = resolveSceneImages(scene.fill?.images);

  // Animation timing
  const titleStart = 0;
  const beforeStart = 60;
  const dividerStart = 150;
  const afterStart = 180;
  const transformStart = 300;
  const resultStart = 420;

  const titleStyle = fadeInUp(frame, fps, titleStart);
  const beforeStyle = slideIn(frame, fps, beforeStart, 'left');
  const afterStyle = slideIn(frame, fps, afterStart, 'right');
  
  // Divider arrow animation
  const dividerProgress = interpolate(
    frame,
    [dividerStart, dividerStart + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const transformStyle = fadeInUp(frame, fps, transformStart);
  const resultStyle = fadeInUp(frame, fps, resultStart);

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
        padding: '60px 80px'
      }}>
        
        {/* Title */}
        {frame >= titleStart && (
          <div style={{
            ...titleStyle,
            textAlign: 'center',
            marginBottom: 40
          }}>
            <h1 className="kn-text-title" style={{
              color: colors.ink,
              margin: 0
            }}>
              {scene.fill.texts.title || '🔄 The Transformation'}
            </h1>
          </div>
        )}

        {/* Before & After Comparison */}
        <div style={{
          display: 'flex',
          gap: 40,
          alignItems: 'stretch',
          justifyContent: 'center',
          marginTop: 50,
          position: 'relative'
        }}>
          
          {/* BEFORE Column */}
          {frame >= beforeStart && (
            <div style={{
              ...beforeStyle,
              flex: 1,
              maxWidth: 550,
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}>
              {/* Before Label */}
              <div style={{
                backgroundColor: colors.before,
                color: '#ffffff',
                padding: '20px 40px',
                borderRadius: 'var(--kn-radius-lg, 24px)',
                textAlign: 'center',
                boxShadow: 'var(--kn-shadow-md)',
                border: '4px solid #c0392b'
              }}>
                <div style={{
                  fontFamily: fonts.label.family,
                  fontSize: fonts.label.size,
                  fontWeight: fonts.label.weight
                }}>
                  ❌ {scene.fill.texts.beforeLabel || 'Before'}
                </div>
              </div>

              {/* Before Image */}
              {images.beforeImage && (
                <img
                  src={images.beforeImage}
                  alt="Before"
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 'var(--kn-radius-md, 16px)',
                    border: `4px solid ${colors.before}`,
                    boxShadow: 'var(--kn-shadow-md)',
                    ...handDrawnWobble(frame, 0)
                  }}
                />
              )}

              {/* Before Points */}
              <div style={{
                backgroundColor: '#ffffff',
                border: `3px solid ${colors.before}`,
                borderRadius: 'var(--kn-radius-md, 16px)',
                padding: '30px 25px',
                boxShadow: 'var(--kn-shadow-sm)',
                flex: 1
              }}>
                {['before1', 'before2', 'before3'].map((key, i) => (
                  scene.fill.texts[key] && (
                    <div key={key} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      marginBottom: i < 2 ? 18 : 0,
                      opacity: interpolate(frame, [beforeStart + 20 + i * 10, beforeStart + 30 + i * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                    }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: colors.before,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: 18,
                        fontWeight: 700,
                        flexShrink: 0
                      }}>✗</div>
                      <p style={{
                        fontFamily: fonts.body.family,
                        fontSize: fonts.body.size,
                        color: colors.ink,
                        margin: 0,
                        lineHeight: 1.4
                      }}>
                        {scene.fill.texts[key]}
                      </p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* DIVIDER Arrow */}
          {frame >= dividerStart && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 15,
              opacity: dividerProgress,
              transform: `scale(${dividerProgress})`
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: colors.divider,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 50,
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                border: '5px solid #7f8c8d'
              }}>
                →
              </div>
              {scene.fill.texts.action && (
                <div style={{
                  fontFamily: fonts.body.family,
                  fontSize: 24,
                  fontWeight: 700,
                  color: colors.ink,
                  textAlign: 'center',
                  maxWidth: 120,
                  lineHeight: 1.2
                }}>
                  {scene.fill.texts.action}
                </div>
              )}
            </div>
          )}

          {/* AFTER Column */}
          {frame >= afterStart && (
            <div style={{
              ...afterStyle,
              flex: 1,
              maxWidth: 550,
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}>
              {/* After Label */}
              <div style={{
                backgroundColor: colors.after,
                color: '#ffffff',
                padding: '20px 40px',
                borderRadius: 'var(--kn-radius-lg, 24px)',
                textAlign: 'center',
                boxShadow: 'var(--kn-shadow-md)',
                border: '4px solid #1e8449'
              }}>
                <div style={{
                  fontFamily: fonts.label.family,
                  fontSize: fonts.label.size,
                  fontWeight: fonts.label.weight
                }}>
                  ✅ {scene.fill.texts.afterLabel || 'After'}
                </div>
              </div>

              {/* After Image */}
              {images.afterImage && (
                <img
                  src={images.afterImage}
                  alt="After"
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 'var(--kn-radius-md, 16px)',
                    border: `4px solid ${colors.after}`,
                    boxShadow: 'var(--kn-shadow-md)',
                    ...handDrawnWobble(frame, 100)
                  }}
                />
              )}

              {/* After Points */}
              <div style={{
                backgroundColor: '#ffffff',
                border: `3px solid ${colors.after}`,
                borderRadius: 'var(--kn-radius-md, 16px)',
                padding: '30px 25px',
                boxShadow: 'var(--kn-shadow-sm)',
                flex: 1
              }}>
                {['after1', 'after2', 'after3'].map((key, i) => (
                  scene.fill.texts[key] && (
                    <div key={key} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      marginBottom: i < 2 ? 18 : 0,
                      opacity: interpolate(frame, [afterStart + 20 + i * 10, afterStart + 30 + i * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                    }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: colors.after,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: 18,
                        fontWeight: 700,
                        flexShrink: 0
                      }}>✓</div>
                      <p style={{
                        fontFamily: fonts.body.family,
                        fontSize: fonts.body.size,
                        color: colors.ink,
                        margin: 0,
                        lineHeight: 1.4
                      }}>
                        {scene.fill.texts[key]}
                      </p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Result/CTA */}
        {frame >= resultStart && scene.fill.texts.result && (
          <div style={{
            ...resultStyle,
            position: 'absolute',
            bottom: 50,
            left: '50%',
            transform: `translateX(-50%)`,
            maxWidth: '85%',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: colors.after,
              color: '#ffffff',
              padding: '25px 70px',
              borderRadius: 'var(--kn-radius-full, 9999px)',
              fontFamily: fonts.body.family,
              fontSize: 36,
              fontWeight: 700,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              border: '5px solid #1e8449',
              ...handDrawnWobble(frame, 200)
            }}>
              🎯 {scene.fill.texts.result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
