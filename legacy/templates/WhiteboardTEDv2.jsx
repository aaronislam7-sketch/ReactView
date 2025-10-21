import React, { useEffect, useRef } from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import rough from 'roughjs';

const SKETCH_STYLE = {
  roughness: 2,
  strokeWidth: 2,
  fillWeight: 0.5,
  hachureGap: 4
};

export const WhiteboardTEDv2 = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);

  const progress = {
    title: spring({ frame, fps, config: { damping: 12 } }),
    subtitle: spring({ frame: frame - 15, fps, config: { damping: 12 } }),
    boxes: Array(4).fill(0).map((_, i) => 
      spring({ frame: frame - (30 + i * 20), fps, config: { damping: 12 } })
    ),
    circles: Array(2).fill(0).map((_, i) => 
      spring({ frame: frame - (45 + i * 20), fps, config: { damping: 12 } })
    )
  };

  const colors = scene.style_tokens?.colors || {
    bg: '#fafafa',
    ink: '#2d3436',
    accent: '#4a9c3b',
    support: '#8bc34a'
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const rc = rough.canvas(canvasRef.current);
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw boxes
    const boxes = [
      { x: 200, y: 200, w: 400, h: 100 },
      { x: 200, y: 320, w: 400, h: 100 },
      { x: 200, y: 440, w: 400, h: 100 },
      { x: 200, y: 560, w: 400, h: 100 }
    ];

    boxes.forEach((box, i) => {
      if (progress.boxes[i] > 0) {
        rc.rectangle(box.x, box.y, box.w, box.h, {
          ...SKETCH_STYLE,
          fill: colors.bg,
          fillStyle: 'solid',
          stroke: colors.ink,
          opacity: progress.boxes[i]
        });
      }
    });

    // Draw circles with pulse animation
    const circles = [
      { x: 120, y: 250, r: 30 },
      { x: 120, y: 370, r: 30 }
    ];

    circles.forEach((circle, i) => {
      if (progress.circles[i] > 0) {
        const pulse = 1 + Math.sin(frame * 0.1) * 0.1;
        rc.circle(circle.x, circle.y, circle.r * 2 * pulse, {
          ...SKETCH_STYLE,
          fill: colors.support + '20',
          stroke: colors.accent,
          opacity: progress.circles[i]
        });
      }
    });
  }, [frame, progress, colors]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: colors.bg,
      position: 'relative',
      fontFamily: 'Permanent Marker, cursive'
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

      {/* Title */}
      <div style={{
        position: 'relative',
        padding: '40px 60px',
        opacity: progress.title
      }}>
        <h1 style={{
          fontSize: '72px',
          color: colors.ink,
          margin: 0,
          marginBottom: '16px'
        }}>
          {scene.fill.texts.title}
        </h1>
        <h2 style={{
          fontSize: '36px',
          color: colors.accent,
          margin: 0,
          opacity: progress.subtitle
        }}>
          {scene.fill.texts.subtitle}
        </h2>
      </div>

      {/* Content */}
      {['b1', 'b2', 'b3', 'b4'].map((key, i) => (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: '220px',
            top: `${220 + i * 120}px`,
            opacity: progress.boxes[i],
            transform: `translateX(${(1 - progress.boxes[i]) * 50}px)`
          }}
        >
          <p style={{
            fontSize: '32px',
            color: colors.ink,
            margin: 0
          }}>
            {scene.fill.texts[key]}
          </p>
        </div>
      ))}
    </div>
  );
};