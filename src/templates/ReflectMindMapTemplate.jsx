import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { resolveSceneImages } from '../utils/imageLibrary';
import { fadeInUp, bounceIn, pulse, handDrawnWobble, paperTexture, drawPath } from '../sdk/motion';
import { useWriteOn } from '../sdk/useWriteOn';

/**
 * REFLECT MIND MAP Template
 * Purpose: Visual synthesis using mind map for reflection
 * Style: Central idea with branching connections, web of understanding
 * Pedagogy: Connecting concepts, synthesis, metacognition through visual mapping
 * Differentiation: Mind map/network vs linear questions (original Reflect)
 */
export const ReflectMindMapTemplate = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = scene.style_tokens?.colors || {
    bg: 'var(--kn-bg, #fafafa)',
    center: '#9b59b6',
    branch1: '#3498db',
    branch2: '#27ae60',
    branch3: '#e74c3c',
    branch4: '#f39c12',
    ink: 'var(--kn-ink, #2d3436)',
    line: '#95a5a6'
  };

  const fonts = scene.style_tokens?.fonts || {
    title: { family: 'var(--kn-font-title)', size: 56, weight: 700 },
    center: { family: 'var(--kn-font-title)', size: 48, weight: 700 },
    branch: { family: 'var(--kn-font-body)', size: 26, weight: 600 },
    insight: { family: 'var(--kn-font-body)', size: 32, weight: 600 }
  };

  const images = resolveSceneImages(scene.fill?.images);

  // Mind map animation sequence
  const titleStart = 0;
  const centerStart = 45;
  const branch1Start = 90;
  const branch2Start = 150;
  const branch3Start = 210;
  const branch4Start = 270;
  const insightStart = 390;

  const titleStyle = fadeInUp(frame, fps, titleStart);
  const centerStyle = bounceIn(frame, fps, centerStart);

  // Branch animations
  const branches = [
    { start: branch1Start, color: colors.branch1, position: { top: 150, left: 150 } },
    { start: branch2Start, color: colors.branch2, position: { top: 150, right: 150 } },
    { start: branch3Start, color: colors.branch3, position: { bottom: 200, left: 200 } },
    { start: branch4Start, color: colors.branch4, position: { bottom: 200, right: 200 } }
  ].map((branch, i) => ({
    ...branch,
    progress: interpolate(
      frame,
      [branch.start, branch.start + 30],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    ),
    lineProgress: interpolate(
      frame,
      [branch.start - 10, branch.start + 20],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  }));

  const insightStyle = fadeInUp(frame, fps, insightStart);

  // SVG for connecting lines
  const renderConnectingLine = (fromX, fromY, toX, toY, progress, color) => {
    return (
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        <path
          d={`M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${(fromY + toY) / 2 - 50} ${toX} ${toY}`}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray="1"
          strokeDashoffset={1 - progress}
          opacity={progress}
          strokeLinecap="round"
        />
      </svg>
    );
  };

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
        padding: '50px 80px'
      }}>
        
        {/* Title */}
        {frame >= titleStart && (
          <div style={{
            ...titleStyle,
            textAlign: 'center',
            marginBottom: 30
          }}>
            <h1 className="kn-text-title" style={{
              color: colors.ink,
              margin: 0
            }}>
              {scene.fill.texts.title || '🧠 Connecting the Dots'}
            </h1>
          </div>
        )}

        {/* Mind Map Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: 650,
          marginTop: 40
        }}>
          
          {/* Central Concept */}
          {frame >= centerStart && (
            <div style={{
              ...centerStyle,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${centerStyle.opacity})`,
              zIndex: 10
            }}>
              <div style={{
                backgroundColor: colors.center,
                color: '#ffffff',
                padding: '35px 50px',
                borderRadius: '50%',
                minWidth: 240,
                minHeight: 240,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
                border: '6px solid #8e44ad',
                textAlign: 'center',
                ...pulse(frame, 0.05, 0.03)
              }}>
                {images.centralIcon && (
                  <img
                    src={images.centralIcon}
                    alt="Central concept"
                    style={{
                      width: 60,
                      height: 60,
                      marginBottom: 8
                    }}
                  />
                )}
                <div style={{
                  fontFamily: fonts.center.family,
                  fontSize: fonts.center.size,
                  fontWeight: fonts.center.weight,
                  lineHeight: 1.2
                }}>
                  {scene.fill.texts.central || 'Main Insight'}
                </div>
              </div>
            </div>
          )}

          {/* Branch Nodes */}
          {['branch1', 'branch2', 'branch3', 'branch4'].map((key, i) => (
            scene.fill.texts[key] && branches[i].progress > 0 && (
              <React.Fragment key={key}>
                {/* Connecting Line */}
                {branches[i].lineProgress > 0 && renderConnectingLine(
                  960, 410, // Center position (approximate)
                  branches[i].position.left ? branches[i].position.left + 130 : 1920 - branches[i].position.right - 130,
                  branches[i].position.top ? branches[i].position.top + 80 : 1080 - branches[i].position.bottom - 80,
                  branches[i].lineProgress,
                  branches[i].color
                )}

                {/* Branch Node */}
                <div style={{
                  position: 'absolute',
                  ...branches[i].position,
                  opacity: branches[i].progress,
                  transform: `scale(${branches[i].progress})`,
                  zIndex: 5
                }}>
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: `4px solid ${branches[i].color}`,
                    borderRadius: 'var(--kn-radius-lg, 24px)',
                    padding: '25px 30px',
                    minWidth: 260,
                    maxWidth: 320,
                    boxShadow: 'var(--kn-shadow-lg)',
                    textAlign: 'center',
                    ...handDrawnWobble(frame, i * 100)
                  }}>
                    {/* Branch Icon */}
                    {images[`icon${i + 1}`] && (
                      <img
                        src={images[`icon${i + 1}`]}
                        alt={`Branch ${i + 1}`}
                        style={{
                          width: 50,
                          height: 50,
                          marginBottom: 12,
                          border: `2px solid ${branches[i].color}`,
                          borderRadius: '50%'
                        }}
                      />
                    )}

                    {/* Branch Title */}
                    <div style={{
                      fontFamily: fonts.branch.family,
                      fontSize: fonts.branch.size,
                      fontWeight: fonts.branch.weight,
                      color: branches[i].color,
                      marginBottom: 10,
                      lineHeight: 1.3
                    }}>
                      {scene.fill.texts[key]}
                    </div>

                    {/* Branch Description */}
                    {scene.fill.texts[`desc${i + 1}`] && (
                      <div style={{
                        fontFamily: fonts.branch.family,
                        fontSize: 20,
                        color: colors.ink,
                        opacity: 0.8,
                        lineHeight: 1.4
                      }}>
                        {scene.fill.texts[`desc${i + 1}`]}
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            )
          ))}
        </div>

        {/* Key Insight */}
        {frame >= insightStart && scene.fill.texts.insight && (
          <div style={{
            ...insightStyle,
            position: 'absolute',
            bottom: 50,
            left: '50%',
            transform: `translateX(-50%)`,
            maxWidth: '90%',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: colors.center,
              color: '#ffffff',
              padding: '30px 70px',
              borderRadius: 'var(--kn-radius-full, 9999px)',
              fontFamily: fonts.insight.family,
              fontSize: fonts.insight.size,
              fontWeight: fonts.insight.weight,
              boxShadow: '0 10px 35px rgba(0,0,0,0.3)',
              border: '5px solid #8e44ad',
              ...handDrawnWobble(frame, 500)
            }}>
              💡 {scene.fill.texts.insight}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
