import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { 
  fadeSlide, 
  springAnimation, 
  pulse, 
  staggerIn
} from '../sdk/animations';
import { 
  IconCircle, 
  NumberBadge
} from '../sdk/components.jsx';

/**
 * Enhanced Whiteboard TED-style Template
 * Clean, professional TED-talk explainer with smooth block animations
 * No shimmering effects - solid, easy on the eyes
 */
export const WhiteboardTEDEnhanced = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Extract scene data
  const colors = scene.style_tokens?.colors || {
    bg: '#fafafa',
    board: '#ffffff',
    ink: '#2d3436',
    accent: '#4a9c3b',
    support: '#8bc34a',
    highlight: '#ffd93d'
  };

  const fonts = scene.style_tokens?.fonts || {
    title: { family: 'Cabin Sketch, cursive', size: 72, weight: 700 },
    subtitle: { family: 'Cabin Sketch, cursive', size: 42, weight: 400 },
    body: { family: 'Patrick Hand, cursive', size: 32, weight: 400 },
    label: { family: 'Patrick Hand, cursive', size: 24, weight: 400 }
  };

  // Extended animation timings (covering full 20 seconds)
  const timing = {
    title: 0,
    subtitle: 15,
    mainIcon: 30,
    boxes: [60, 90, 120, 150],
    connectors: [85, 115, 145],
    icons: [75, 105, 135, 165],
    highlights: [240, 300, 360, 420],
    conclusion: 480,
    conclusionScale: 510
  };

  // Calculate progress for each element using spring animations
  const titleProgress = spring({
    frame: frame - timing.title,
    fps,
    config: { damping: 15, mass: 1, stiffness: 100 }
  });

  const subtitleProgress = spring({
    frame: frame - timing.subtitle,
    fps,
    config: { damping: 15, mass: 1, stiffness: 100 }
  });

  const mainIconProgress = spring({
    frame: frame - timing.mainIcon,
    fps,
    config: { damping: 12, mass: 1, stiffness: 120 }
  });

  const boxProgresses = timing.boxes.map(t => 
    spring({
      frame: frame - t,
      fps,
      config: { damping: 12, mass: 1, stiffness: 120 }
    })
  );

  const iconProgresses = timing.icons.map(t => 
    spring({
      frame: frame - t,
      fps,
      config: { damping: 15, mass: 1, stiffness: 100 }
    })
  );

  const connectorProgresses = timing.connectors.map(t => 
    interpolate(
      frame,
      [t, t + 20],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  );

  const highlightProgresses = timing.highlights.map(t => 
    interpolate(
      frame,
      [t, t + 30, t + 60],
      [0, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  );

  const conclusionProgress = spring({
    frame: frame - timing.conclusion,
    fps,
    config: { damping: 15, mass: 1, stiffness: 100 }
  });

  const conclusionScale = spring({
    frame: frame - timing.conclusionScale,
    fps,
    config: { damping: 10, mass: 1, stiffness: 150 }
  });

  // Continuous subtle pulse for main icon (after it appears)
  const iconPulse = mainIconProgress > 0 ? 1 + Math.sin(frame * 0.05) * 0.05 : 1;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: colors.bg,
      position: 'relative',
      fontFamily: fonts.body.family,
      overflow: 'hidden'
    }}>
      {/* Main Content Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '60px 80px'
      }}>
        
        {/* Title Section */}
        {titleProgress > 0 && (
          <div style={{
            textAlign: 'center',
            marginBottom: 20,
            opacity: titleProgress,
            transform: `translateY(${(1 - titleProgress) * -20}px)`
          }}>
            <h1 style={{
              fontFamily: fonts.title.family,
              fontSize: fonts.title.size,
              fontWeight: fonts.title.weight,
              color: colors.ink,
              margin: 0,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              {scene.fill.texts.title}
            </h1>
          </div>
        )}

        {/* Subtitle */}
        {subtitleProgress > 0 && (
          <div style={{
            textAlign: 'center',
            marginBottom: 60,
            opacity: subtitleProgress,
            transform: `translateY(${(1 - subtitleProgress) * -20}px)`
          }}>
            <h2 style={{
              fontFamily: fonts.subtitle.family,
              fontSize: fonts.subtitle.size,
              fontWeight: fonts.subtitle.weight,
              color: colors.accent,
              margin: 0
            }}>
              {scene.fill.texts.subtitle}
            </h2>
          </div>
        )}

        {/* Main Icon/Visual */}
        {mainIconProgress > 0 && (
          <div style={{
            position: 'absolute',
            top: 240,
            left: '50%',
            transform: `translateX(-50%) scale(${mainIconProgress * iconPulse})`,
            opacity: Math.min(mainIconProgress, 1),
            transition: 'transform 0.1s ease-out'
          }}>
            <div style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: colors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 50,
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}>
              💡
            </div>
          </div>
        )}

        {/* Content Boxes Section */}
        <div style={{
          position: 'absolute',
          top: 400,
          left: 100,
          right: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 30
        }}>
          {['point1', 'point2', 'point3', 'point4'].map((key, i) => (
            <div
              key={key}
              style={{
                flex: 1,
                position: 'relative'
              }}
            >
              {/* Box */}
              {boxProgresses[i] > 0 && (
                <div style={{
                  backgroundColor: colors.board,
                  border: `3px solid ${colors.ink}`,
                  borderRadius: 12,
                  padding: '30px 20px',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  opacity: boxProgresses[i],
                  transform: `translateY(${(1 - boxProgresses[i]) * 30}px)`,
                  position: 'relative'
                }}>
                  {/* Number Badge */}
                  <div style={{
                    position: 'absolute',
                    top: -25,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10
                  }}>
                    <NumberBadge
                      number={i + 1}
                      size={50}
                      backgroundColor={colors.accent}
                      color="#ffffff"
                    />
                  </div>

                  {/* Icon */}
                  {iconProgresses[i] > 0 && scene.fill.images?.[`icon${i + 1}`] && (
                    <img
                      src={scene.fill.images[`icon${i + 1}`]}
                      alt={`Icon ${i + 1}`}
                      style={{
                        width: 60,
                        height: 60,
                        opacity: iconProgresses[i],
                        transform: `scale(${iconProgresses[i]})`
                      }}
                    />
                  )}
                  
                  {/* Text */}
                  <p style={{
                    fontFamily: fonts.body.family,
                    fontSize: fonts.body.size,
                    color: colors.ink,
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.4,
                    wordWrap: 'break-word',
                    maxWidth: '100%'
                  }}>
                    {scene.fill.texts[key]}
                  </p>

                  {/* Highlight Effect */}
                  {highlightProgresses[i] > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: -6,
                      left: -6,
                      right: -6,
                      bottom: -6,
                      border: `6px solid ${colors.highlight}`,
                      borderRadius: 16,
                      pointerEvents: 'none',
                      opacity: highlightProgresses[i],
                      boxShadow: `0 0 20px ${colors.highlight}`
                    }} />
                  )}
                </div>
              )}

              {/* Connector Arrow */}
              {i < 3 && connectorProgresses[i] > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 120,
                  right: -40,
                  width: 50,
                  height: 4,
                  backgroundColor: colors.accent,
                  transformOrigin: 'left center',
                  transform: `scaleX(${connectorProgresses[i]})`,
                  zIndex: 5
                }}>
                  {/* Arrow head */}
                  {connectorProgresses[i] > 0.8 && (
                    <div style={{
                      position: 'absolute',
                      right: -8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: `12px solid ${colors.accent}`,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent'
                    }} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Conclusion/Key Takeaway */}
        {conclusionProgress > 0 && (
          <div style={{
            position: 'absolute',
            bottom: 100,
            left: '50%',
            transform: `translateX(-50%) scale(${Math.min(conclusionScale, 1)})`,
            opacity: conclusionProgress
          }}>
            <div style={{
              backgroundColor: colors.support,
              color: '#ffffff',
              padding: '25px 60px',
              borderRadius: 50,
              fontFamily: fonts.subtitle.family,
              fontSize: 42,
              fontWeight: 600,
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: `4px solid ${colors.accent}`
            }}>
              {scene.fill.texts.conclusion || '✨ Key Insight ✨'}
            </div>
          </div>
        )}

        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          right: 60,
          fontSize: 16,
          color: colors.ink,
          opacity: 0.5,
          fontFamily: fonts.label.family
        }}>
          {scene.meta?.title || 'TED-style Explainer'}
        </div>
      </div>
    </div>
  );
};
