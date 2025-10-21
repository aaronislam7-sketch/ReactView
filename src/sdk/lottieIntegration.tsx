/**
 * Lottie Animation Integration
 * For dynamic, fresh animations that adapt to content
 */

import React from 'react';
import { Player as LottiePlayer } from '@lottiefiles/react-lottie-player';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// ==================== LOTTIE ANIMATION LIBRARY ====================

/**
 * Curated Lottie animations from public sources
 * These work well with educational content
 */
export const lottieAnimations = {
  // Celebration & Success
  celebration: 'https://assets2.lottiefiles.com/packages/lf20_touohxv0.json',
  confetti: 'https://assets9.lottiefiles.com/packages/lf20_rovf9gzu.json',
  success: 'https://assets4.lottiefiles.com/packages/lf20_ya4ycazp.json',
  trophy: 'https://assets10.lottiefiles.com/packages/lf20_ejszmgrm.json',
  
  // Learning & Education
  lightbulb: 'https://assets1.lottiefiles.com/packages/lf20_fqomgjwf.json',
  book: 'https://assets5.lottiefiles.com/packages/lf20_1a8dx7zj.json',
  brain: 'https://assets3.lottiefiles.com/packages/lf20_wdmpkzng.json',
  rocket: 'https://assets7.lottiefiles.com/packages/lf20_xd1rynho.json',
  
  // Emotions & Engagement
  thinking: 'https://assets6.lottiefiles.com/packages/lf20_vnikrcia.json',
  question: 'https://assets8.lottiefiles.com/packages/lf20_wcgnpyji.json',
  star: 'https://assets2.lottiefiles.com/packages/lf20_xqxngqb0.json',
  sparkle: 'https://assets9.lottiefiles.com/packages/lf20_yqzgzqua.json',
  
  // Abstract & Background
  particles: 'https://assets1.lottiefiles.com/packages/lf20_bno1uwfj.json',
  dots: 'https://assets4.lottiefiles.com/packages/lf20_vgumcjlt.json',
  wave: 'https://assets7.lottiefiles.com/packages/lf20_iyplycbj.json',
  
  // Actions & Transitions
  arrow: 'https://assets5.lottiefiles.com/packages/lf20_hwzozrk9.json',
  checkmark: 'https://assets3.lottiefiles.com/packages/lf20_mpvzuibh.json',
  loading: 'https://assets6.lottiefiles.com/packages/lf20_xlkxtmul.json',
};

export type LottieAnimationType = keyof typeof lottieAnimations;

// ==================== LOTTIE PLAYER COMPONENT ====================

interface RemotionLottieProps {
  animation: LottieAnimationType | string;
  style?: React.CSSProperties;
  startFrame?: number;
  endFrame?: number;
  speed?: number;
  loop?: boolean;
  autoplay?: boolean;
}

/**
 * Remotion-compatible Lottie player
 * Syncs animation to video timeline
 */
export const RemotionLottie: React.FC<RemotionLottieProps> = ({
  animation,
  style = {},
  startFrame = 0,
  endFrame,
  speed = 1,
  loop = true,
  autoplay = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const playerRef = React.useRef<any>(null);

  // Get animation source
  const animationSrc = animation in lottieAnimations
    ? lottieAnimations[animation as LottieAnimationType]
    : animation;

  // Calculate progress based on frame
  const adjustedFrame = Math.max(0, frame - startFrame);
  const progress = endFrame
    ? Math.min(1, adjustedFrame / (endFrame - startFrame))
    : (adjustedFrame * speed) / fps;

  React.useEffect(() => {
    if (playerRef.current && autoplay) {
      // Seek to the correct frame
      const totalFrames = playerRef.current.getTotalFrames?.();
      if (totalFrames) {
        const targetFrame = loop
          ? (progress * totalFrames) % totalFrames
          : Math.min(progress * totalFrames, totalFrames);
        playerRef.current.seek?.(targetFrame);
      }
    }
  }, [progress, autoplay, loop]);

  return (
    <LottiePlayer
      ref={playerRef}
      src={animationSrc}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
      autoplay={false} // We control playback via frame
      loop={false} // We handle looping manually
    />
  );
};

// ==================== ANIMATED LOTTIE WITH ENTRANCE ====================

/**
 * Lottie with entrance animation
 */
export const AnimatedLottie: React.FC<
  RemotionLottieProps & {
    entranceDelay?: number;
    entranceDuration?: number;
  }
> = ({
  animation,
  style = {},
  entranceDelay = 0,
  entranceDuration = 30,
  ...lottieProps
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const progress = Math.max(
    0,
    Math.min(1, (frame - entranceDelay) / entranceDuration)
  );

  const entranceStyle = {
    opacity: progress,
    transform: `scale(${0.5 + progress * 0.5})`,
  };

  return (
    <div style={{ ...entranceStyle, ...style }}>
      <RemotionLottie animation={animation} {...lottieProps} />
    </div>
  );
};

// ==================== LOTTIE BACKGROUND ELEMENT ====================

/**
 * Subtle background Lottie animation
 */
export const LottieBackground: React.FC<{
  animation: LottieAnimationType | string;
  opacity?: number;
  scale?: number;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ animation, opacity = 0.15, scale = 1.5, position = 'center' }) => {
  const positions = {
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    'top-left': { top: '10%', left: '10%' },
    'top-right': { top: '10%', right: '10%' },
    'bottom-left': { bottom: '10%', left: '10%' },
    'bottom-right': { bottom: '10%', right: '10%' },
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: '40%',
        height: '40%',
        ...positions[position],
        transform: `${positions[position].transform || ''} scale(${scale})`,
        opacity,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <RemotionLottie animation={animation} loop autoplay />
    </div>
  );
};

// ==================== LOTTIE ICON ====================

/**
 * Small inline Lottie icon
 */
export const LottieIcon: React.FC<{
  animation: LottieAnimationType | string;
  size?: number;
  delay?: number;
}> = ({ animation, size = 80, delay = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    >
      <RemotionLottie animation={animation} startFrame={delay} />
    </div>
  );
};

// ==================== LOTTIE OVERLAY ====================

/**
 * Full-screen Lottie overlay for dramatic moments
 */
export const LottieOverlay: React.FC<{
  animation: LottieAnimationType | string;
  startFrame: number;
  duration: number;
  opacity?: number;
}> = ({ animation, startFrame, duration, opacity = 0.8 }) => {
  const frame = useCurrentFrame();

  if (frame < startFrame || frame > startFrame + duration) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <RemotionLottie
        animation={animation}
        startFrame={startFrame}
        endFrame={startFrame + duration}
        loop={false}
      />
    </div>
  );
};
