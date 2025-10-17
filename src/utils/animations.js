export const EASING = {
  SMOOTH: [0.4, 0.0, 0.2, 1],
  BOUNCE: [0.68, -0.55, 0.265, 1.55],
  SPRING: [0.43, 0.13, 0.23, 0.96],
  ELASTIC: [0.68, -0.55, 0.265, 1.55],
  SHARP: [0.4, 0, 0.6, 1]
};

export const fadeIn = (delay = 0, duration = 1000) => ({
  from: { opacity: 0, transform: 'scale(0.95)' },
  to: { opacity: 1, transform: 'scale(1)' },
  config: { duration, easing: EASING.SMOOTH },
  delay
});

export const slideIn = (direction = 'left', delay = 0, duration = 800) => ({
  from: {
    opacity: 0,
    transform: direction === 'up' ? 'translateY(30px)' : 
               direction === 'down' ? 'translateY(-30px)' :
               direction === 'right' ? 'translateX(-30px)' : 'translateX(30px)'
  },
  to: { opacity: 1, transform: 'translate(0)' },
  config: { duration, easing: EASING.SPRING },
  delay
});

export const scaleIn = (delay = 0, duration = 600) => ({
  from: { opacity: 0, transform: 'scale(0.85)' },
  to: { opacity: 1, transform: 'scale(1)' },
  config: { duration, easing: EASING.ELASTIC },
  delay
});

export const typewriter = (delay = 0, duration = 1500) => ({
  from: { clipPath: 'inset(0 100% 0 0)' },
  to: { clipPath: 'inset(0 0 0 0)' },
  config: { duration, easing: EASING.SHARP },
  delay
});