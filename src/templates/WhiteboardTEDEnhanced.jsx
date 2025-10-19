import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Player as LottiePlayer } from '@lottiefiles/react-lottie-player';
import { 
  fadeSlide, 
  springAnimation, 
  pulse, 
  staggerIn,
  getActionProgress 
} from '../sdk/animations';
import { 
  initRoughCanvas, 
  clearCanvas, 
  drawSketchRect,
  drawSketchCircle,
  drawArrow,
  SKETCH_STYLES 
} from '../sdk/rough-utils';
import { 
  IconCircle, 
  AnimatedText,
  NumberBadge,
  ConnectorLine 
} from '../sdk/components.jsx';

/**
 * Enhanced Whiteboard TED-style Template
 * Professional, polished TED-talk explainer with continuous animations
 * Uses Template SDK for all animations and utilities
 */
export const WhiteboardTEDEnhanced = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);
  const lottieRef = useRef(null);

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

  // Animation timings (in frames)
  const timing = {
    title: 0,
    subtitle: 20,
    mainIcon: 40,
    boxes: [60, 80, 100, 120],
    connectors: [75, 95, 115],
    highlights: [140, 160, 180, 200],
    conclusion: 220
  };

  // Calculate progress for each element
  const progress = {
    title: fadeSlide(frame, timing.title, 30, 'up'),
    subtitle: fadeSlide(frame, timing.subtitle, 25, 'up'),
    mainIcon: springAnimation(frame, fps, timing.mainIcon, 'bouncy'),
    boxes: timing.boxes.map((t, i) => staggerIn(frame, t, 0, 0, 25)),
    connectors: timing.connectors.map(t => 
      getActionProgress(frame, fps, { t: t / fps, duration: 0.5 })
    ),
    highlights: timing.highlights.map(t => fadeSlide(frame, t, 20, 'up')),
    conclusion: fadeSlide(frame, timing.conclusion, 30, 'up')
  };

  // Continuous pulse for main icon
  const iconPulse = pulse(frame, 0.08, 0.06);

  // Draw sketch elements on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const rc = initRoughCanvas(canvasRef);
    clearCanvas(canvasRef);
    
    const ctx = canvasRef.current.getContext('2d');
    
    // Draw connecting arrows between boxes
    const boxPositions = [
      { x: 240, y: 400 },
      { x: 640, y: 400 },
      { x: 1040, y: 400 },
      { x: 1440, y: 400 }
    ];

    progress.connectors.forEach((prog, i) => {
      if (prog > 0 && i < 3) {
        const start = boxPositions[i];
        const end = boxPositions[i + 1];
        
        ctx.save();
        ctx.globalAlpha = prog;
        
        drawArrow(
          rc,
          start.x + 160,
          start.y + 60,
          end.x - 20,
          end.y + 60,
          {
            stroke: colors.accent,
            strokeWidth: 4,
            roughness: 1.5,
            arrowSize: 25
          }
        );
        
        ctx.restore();
      }
    });

    // Draw sketch boxes for each content item
    boxPositions.forEach((pos, i) => {
      if (progress.boxes[i] > 0) {
        ctx.save();
        ctx.globalAlpha = progress.boxes[i];
        
        drawSketchRect(
          rc,
          pos.x,
          pos.y,
          300,
          180,
          {
            fill: colors.board,
            stroke: colors.ink,
            strokeWidth: 3,
            roughness: 1.2,
            fillStyle: 'solid'
          }
        );
        
        ctx.restore();
      }
    });

    // Draw decorative circles for highlights
    const highlightPositions = [
      { x: 320, y: 350 },
      { x: 720, y: 350 },
      { x: 1120, y: 350 },
      { x: 1520, y: 350 }
    ];

    highlightPositions.forEach((pos, i) => {
      if (progress.highlights[i]?.opacity > 0) {
        ctx.save();
        ctx.globalAlpha = progress.highlights[i].opacity * 0.3;
        
        drawSketchCircle(
          rc,
          pos.x,
          pos.y,
          80,
          {
            fill: colors.highlight,
            stroke: 'none',
            fillStyle: 'solid',
            roughness: 2
          }
        );
        
        ctx.restore();
      }
    });

  }, [frame, progress, colors]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: colors.bg,
      position: 'relative',
      fontFamily: fonts.body.family,
      overflow: 'hidden'
    }}>
      {/* Canvas for sketch elements */}
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '60px 80px'
      }}>
        
        {/* Title Section */}
        <div style={{
          ...progress.title,
          textAlign: 'center',
          marginBottom: 20
        }}>
          <h1 style={{
            fontFamily: fonts.title.family,
            fontSize: fonts.title.size,
            fontWeight: fonts.title.weight,
            color: colors.ink,
            margin: 0,
            textShadow: '3px 3px 0px rgba(0,0,0,0.1)'
          }}>
            {scene.fill.texts.title}
          </h1>
        </div>

        {/* Subtitle */}
        <div style={{
          ...progress.subtitle,
          textAlign: 'center',
          marginBottom: 50
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

        {/* Main Icon/Visual */}
        {progress.mainIcon > 0 && (
          <div style={{
            position: 'absolute',
            top: 200,
            left: '50%',
            transform: `translateX(-50%) scale(${progress.mainIcon * iconPulse})`,
            opacity: Math.min(progress.mainIcon, 1)
          }}>
            <IconCircle
              icon="💡"
              size={100}
              backgroundColor={colors.accent}
              color="#ffffff"
              animated={true}
              frame={frame}
            />
          </div>
        )}

        {/* Content Boxes Section */}
        <div style={{
          position: 'absolute',
          top: 350,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          {['point1', 'point2', 'point3', 'point4'].map((key, i) => (
            <div
              key={key}
              style={{
                width: 300,
                position: 'relative',
                ...progress.boxes[i] && {
                  opacity: progress.boxes[i],
                  transform: `translateY(${(1 - progress.boxes[i]) * 30}px)`
                }
              }}
            >
              {/* Number Badge */}
              <div style={{
                position: 'absolute',
                top: -20,
                left: 20,
                zIndex: 10,
                transform: progress.boxes[i] > 0.5 ? 'scale(1)' : 'scale(0)'
              }}>
                <NumberBadge
                  number={i + 1}
                  size={50}
                  backgroundColor={colors.accent}
                  color="#ffffff"
                />
              </div>

              {/* Content */}
              <div style={{
                padding: '50px 30px 30px',
                height: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1
              }}>
                {/* Icon */}
                {scene.fill.images?.[`icon${i + 1}`] && (
                  <img
                    src={scene.fill.images[`icon${i + 1}`]}
                    alt={`Icon ${i + 1}`}
                    style={{
                      width: 60,
                      height: 60,
                      marginBottom: 15,
                      opacity: progress.boxes[i]
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
                  lineHeight: 1.4
                }}>
                  {scene.fill.texts[key]}
                </p>
              </div>

              {/* Highlight Effect */}
              {progress.highlights[i]?.opacity > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  border: `4px solid ${colors.highlight}`,
                  borderRadius: 8,
                  pointerEvents: 'none',
                  ...progress.highlights[i]
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Conclusion/Key Takeaway */}
        {progress.conclusion.opacity > 0 && (
          <div style={{
            position: 'absolute',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            ...progress.conclusion
          }}>
            <div style={{
              backgroundColor: colors.support,
              color: '#ffffff',
              padding: '25px 50px',
              borderRadius: 50,
              fontFamily: fonts.subtitle.family,
              fontSize: 38,
              fontWeight: 600,
              textAlign: 'center',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.15)',
              transform: `rotate(-2deg) scale(${pulse(frame, 0.03, 0.04)})`
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
          fontSize: 18,
          color: colors.ink,
          opacity: 0.6,
          fontFamily: fonts.label.family
        }}>
          {scene.meta?.title || 'TED-style Explainer'}
        </div>
      </div>
    </div>
  );
};
