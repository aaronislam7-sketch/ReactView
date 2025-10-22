/**
 * Whiteboard Effects - True hand-drawn aesthetic
 * Like someone explaining on a whiteboard
 */

import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';

// ==================== CHALK DUST PARTICLES ====================

export const ChalkDust: React.FC<{
  x: number;
  y: number;
  frame: number;
  trigger: boolean;
}> = ({ x, y, frame, trigger }) => {
  if (!trigger) return null;

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i / 8) * Math.PI * 2,
    speed: 30 + Math.random() * 20,
  }));

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {particles.map((p) => {
        const life = Math.min((frame % 20) / 20, 1);
        const px = x + Math.cos(p.angle) * p.speed * life;
        const py = y + Math.sin(p.angle) * p.speed * life;
        
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              opacity: 1 - life,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ==================== HAND-DRAWN ARROW ====================

export const HandDrawnArrow: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  color?: string;
}> = ({ startX, startY, endX, endY, progress, color = '#ffffff' }) => {
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const angle = Math.atan2(endY - startY, endX - startX);
  
  const currentLength = length * progress;
  
  // Hand-drawn path with wobble
  const wobble = (t: number) => Math.sin(t * 10) * 2;
  
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter id="chalk">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
          <feDisplacementMap in="SourceGraphic" scale="2" />
        </filter>
      </defs>
      
      {/* Arrow line */}
      <line
        x1={startX}
        y1={startY}
        x2={startX + Math.cos(angle) * currentLength}
        y2={startY + Math.sin(angle) * currentLength}
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#chalk)"
        opacity="0.9"
      />
      
      {/* Arrow head */}
      {progress > 0.9 && (
        <g transform={`translate(${endX}, ${endY}) rotate(${angle * 180 / Math.PI})`}>
          <line x1="0" y1="0" x2="-12" y2="-8" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.9" />
          <line x1="0" y1="0" x2="-12" y2="8" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        </g>
      )}
    </svg>
  );
};

// ==================== HAND-DRAWN CIRCLE ====================

export const HandDrawnCircle: React.FC<{
  x: number;
  y: number;
  radius: number;
  progress: number;
  color?: string;
}> = ({ x, y, radius, progress, color = '#ffffff' }) => {
  const circumference = 2 * Math.PI * radius;
  
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
        strokeLinecap="round"
        opacity="0.85"
        style={{
          filter: 'url(#chalk)',
        }}
      />
    </svg>
  );
};

// ==================== HAND-DRAWN UNDERLINE ====================

export const HandDrawnUnderline: React.FC<{
  x: number;
  y: number;
  width: number;
  progress: number;
  color?: string;
}> = ({ x, y, width, progress, color = '#ffffff' }) => {
  const currentWidth = width * progress;
  
  // Create wobbly path
  const points = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = x + t * currentWidth;
    const py = y + Math.sin(t * 15) * 2; // Wobble
    points.push(`${px},${py}`);
  }
  
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
};

// ==================== WHITEBOARD TEXTURE ====================

export const WhiteboardTexture: React.FC<{
  opacity?: number;
}> = ({ opacity = 0.4 }) => {
  return (
    <AbsoluteFill
      style={{
        background: `
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

// ==================== CHALK SMUDGE ====================

export const ChalkSmudge: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
}> = ({ x, y, width, height, opacity = 0.15 }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
        opacity,
        filter: 'blur(8px)',
        pointerEvents: 'none',
      }}
    />
  );
};

// ==================== ANIMATED NUMBER COUNTER ====================

export const AnimatedNumber: React.FC<{
  value: number;
  progress: number;
  style?: React.CSSProperties;
}> = ({ value, progress, style = {} }) => {
  const currentValue = Math.floor(value * progress);
  
  return (
    <span style={style}>
      {currentValue}
    </span>
  );
};

// ==================== HAND-DRAWN BOX ====================

export const HandDrawnBox: React.FC<{
  children: React.ReactNode;
  progress: number;
  color?: string;
  backgroundColor?: string;
}> = ({ children, progress, color = '#ffffff', backgroundColor = 'rgba(0,0,0,0.3)' }) => {
  return (
    <div
      style={{
        position: 'relative',
        opacity: progress,
        transform: `scale(${0.95 + progress * 0.05})`,
      }}
    >
      {/* Chalk border effect */}
      <svg
        style={{
          position: 'absolute',
          inset: -3,
          width: 'calc(100% + 6px)',
          height: 'calc(100% + 6px)',
          pointerEvents: 'none',
        }}
      >
        <rect
          x="3"
          y="3"
          width="100%"
          height="100%"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="5,3"
          opacity="0.6"
          rx="8"
        />
      </svg>
      
      <div
        style={{
          backgroundColor,
          padding: '25px',
          borderRadius: 8,
          border: `2px solid ${color}40`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
