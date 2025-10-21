import React, { useEffect, useRef, useMemo } from 'react';
import { spring, useCurrentFrame, useVideoConfig, random } from 'remotion';
import rough from 'roughjs';
import { Player as LottiePlayer } from '@lottiefiles/react-lottie-player';
import writingAnimation from '../animations/writing.json';
import { THEME } from '../../src/utils/theme';

const SKETCH_STYLE = {
  roughness: 1.5,
  strokeWidth: 2,
  fillStyle: 'zigzag',
  fillWeight: 0.5,
  hachureGap: 8
};

// Continuous animation generators
const generatePulse = (frame, speed = 1) => {
  return Math.sin(frame * 0.1 * speed) * 0.2 + 1;
};

const generateFlash = (frame, speed = 1) => {
  return (Math.sin(frame * 0.15 * speed) * 0.5 + 0.5) * 0.3 + 0.7;
};

const generateSpiral = (frame, speed = 1) => {
  const angle = (frame * 0.1 * speed) % (Math.PI * 2);
  return {
    x: Math.cos(angle) * 10,
    y: Math.sin(angle) * 10
  };
};

export const WhiteboardTEDView = ({ normalized = {}, safeFrame = 0, safeFps = 30, progress = {} }) => {
  const { title, subtitle, content, images, style_tokens } = normalized;
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Add circle positions based on content boxes
  const circles = [
    { id: 'circle1', x: 120, y: 280, radius: 30 }, // Positioned near b1
    { id: 'circle2', x: 120, y: 440, radius: 30 }  // Positioned near b2
  ];

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const rc = rough.canvas(canvasRef.current);
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw background grid
    for (let i = 0; i < 8; i++) {
      rc.line(0, i * 80, canvasRef.current.width, i * 80, {
        roughness: 0.8,
        strokeWidth: 1,
        stroke: style_tokens?.colors?.boardStroke + '40' // Adding transparency
      });
    }

    // Draw circles with animations
    circles.forEach((circle, index) => {
      const circleProgress = progress[`circle${index + 1}`] || 0;
      if (circleProgress > 0) {
        // Animate circle size
        const animatedRadius = circle.radius * spring({
          frame: safeFrame,
          fps: safeFps,
          config: { damping: 12, mass: 0.5 }
        });

        // Draw circle using RoughJS
        rc.circle(circle.x, circle.y, animatedRadius * 2, {
          roughness: 2,
          strokeWidth: 2,
          stroke: style_tokens?.colors?.accent || '#4a9c3b',
          fill: style_tokens?.colors?.support || '#8bc34a',
          fillStyle: 'zigzag',
          fillWeight: 0.5,
          opacity: circleProgress
        });
      }
    });

    // Draw boxes with animations
    content.forEach((box, index) => {
      const boxProgress = progress[`box${index + 1}`] || 0;
      if (boxProgress > 0) {
        const animation = animations?.[`box${index + 1}`];
        let offsetX = 0;
        let offsetY = 0;
        let scale = 1;
        
        if (animation) {
          if (animation.type === 'pulse') {
            scale = generatePulse(safeFrame, animation.speed);
          } else if (animation.type === 'spiral') {
            const spiral = generateSpiral(safeFrame, animation.speed);
            offsetX = spiral.x;
            offsetY = spiral.y;
          }
        }

        rc.rectangle(
          box.x + offsetX,
          box.y + offsetY,
          box.width * scale,
          box.height * scale,
          {
            ...SKETCH_STYLE,
            fill: style_tokens?.colors?.board || '#fff',
            fillStyle: 'solid',
            stroke: style_tokens?.colors?.ink || '#0e0e0e',
            opacity: generateFlash(safeFrame)
          }
        );
      }
    });

    // Draw connections if defined
    if (progress.connections) {
      progress.connections.forEach(conn => {
        const from = content[conn.from];
        const to = content[conn.to];
        if (from && to) {
          rc.line(
            from.x + from.width,
            from.y + from.height / 2,
            to.x,
            to.y + to.height / 2,
            {
              roughness: 2,
              strokeWidth: 3,
              stroke: style_tokens?.colors?.accent || '#4a9c3b'
            }
          );
        }
      });
    }
  }, [circles, safeFrame, animations, progress, style_tokens]);

  return (
    <div ref={containerRef} style={{
      background: style_tokens?.colors?.bg || '#fafafa',
      width: '100%',
      height: '100%',
      position: 'relative',
      fontFamily: "'Permanent Marker', cursive"
    }}>
      <canvas 
        ref={canvasRef}
        width={1920}
        height={1080}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* Title Section */}
      <div style={{
        position: 'relative',
        padding: '40px 60px',
        opacity: progress.title || 0
      }}>
        <h1 style={{
          fontSize: '72px',
          color: style_tokens?.colors?.ink || '#0e0e0e',
          margin: 0,
          marginBottom: '16px'
        }}>
          {title}
        </h1>
        {subtitle && (
          <h2 style={{
            fontSize: '36px',
            color: style_tokens?.colors?.accent || '#4a9c3b',
            margin: 0
          }}>
            {subtitle}
          </h2>
        )}
      </div>

      {/* Content Boxes */}
      {content.map((box, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: box.x,
            top: box.y,
            width: box.width,
            height: box.height,
            padding: '20px',
            opacity: progress[`box${index + 1}`] || 0,
            transform: `scale(${generatePulse(safeFrame, 0.5)})`
          }}
        >
          <p style={{
            fontSize: '32px',
            color: style_tokens?.colors?.ink || '#0e0e0e',
            margin: 0,
            textAlign: 'center'
          }}>
            {box.title}
          </p>
        </div>
      ))}
    </div>
  );
};

// Wrapper component remains the same as before
export const WhiteboardTED = ({ scene } = {}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Calculate progress for circles based on timeline
  const getCircleProgress = (circleId) => {
    const circleAction = scene.timeline?.find(
      action => action.action === 'drawCircle' && action.target === circleId
    );
    
    if (!circleAction) return 0;

    const startFrame = circleAction.t * fps;
    const duration = circleAction.duration * fps;
    
    return spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 12 }
    });
  };

  const normalized = useMemo(() => {
    const sceneSafe = scene || {};
    
    // Handle legacy format (direct title/content)
    if (sceneSafe.title && Array.isArray(sceneSafe.content)) {
      return {
        title: sceneSafe.title,
        subtitle: sceneSafe.subtitle || '',
        content: sceneSafe.content.map(c => 
          typeof c === 'string' ? { title: c, description: '' } : c
        ),
        images: {},
        colors: DEFAULT_COLORS
      };
    }

    // Handle new format (fill/style_tokens)
    const fill = sceneSafe.fill || {};
    const texts = fill.texts || {};
    const style = sceneSafe.style_tokens || {};
    const meta = sceneSafe.meta || {};

    // Build content from b1..bn keys
    const content = Object.keys(texts)
      .filter(k => /^b\d+$/i.test(k))
      .sort((a, b) => {
        const aNum = parseInt(a.replace(/\D/g, ''), 10);
        const bNum = parseInt(b.replace(/\D/g, ''), 10);
        return aNum - bNum;
      })
      .map(k => ({
        title: texts[k],
        description: ''
      }));

    return {
      title: texts.title || meta.title || 'Untitled',
      subtitle: texts.subtitle || meta.subtitle || '',
      content,
      images: fill.images || {},
      colors: style.colors ? {
        primary: style.colors.accent || DEFAULT_COLORS.primary,
        accent: style.colors.support || DEFAULT_COLORS.accent,
        background: style.colors.bg || DEFAULT_COLORS.background,
        text: style.colors.ink || DEFAULT_COLORS.text,
        highlight: style.colors.support || DEFAULT_COLORS.highlight
      } : DEFAULT_COLORS
    };
  }, [scene]);

  // Calculate animation progress
  const safeFrame = frame || 0;
  const safeFps = fps || 30;

  const titleProgress = spring({
    frame: safeFrame,
    fps: safeFps,
    config: { damping: 12, mass: 0.5 }
  });

  const contentProgress = spring({
    frame: safeFrame - 15,
    fps: safeFps,
    config: { damping: 15, mass: 0.8 }
  });

  const itemProgress = normalized.content.map((_, index) => 
    spring({
      frame: safeFrame - 20 - (index * 6),
      fps: safeFps,
      config: { damping: 12 }
    })
  );

  return (
    <WhiteboardTEDView
      normalized={normalized}
      safeFrame={safeFrame}
      safeFps={safeFps}
      titleProgress={titleProgress}
      contentProgress={contentProgress}
      itemProgress={itemProgress}
      progress={{
        circle1: getCircleProgress('circle1'),
        circle2: getCircleProgress('circle2')
      }}
    />
  );
};
