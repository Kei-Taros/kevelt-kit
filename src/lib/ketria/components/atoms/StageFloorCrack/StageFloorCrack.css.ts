import { keyframes, style } from '@vanilla-extract/css';

const floorCrackDraw = keyframes({
  from: { strokeDashoffset: 1 },
  to: { strokeDashoffset: 0 }
});

const floorCrackFade = keyframes({
  '0%': { opacity: 0 },
  '15%, 48%': { opacity: 0.95 },
  '100%': { opacity: 0 }
});

export const floorCrack = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  filter: 'drop-shadow(0 0 4px #9deaff) drop-shadow(0 0 12px #3386ff)',
  '@media': {
    '(prefers-reduced-motion: reduce)': { display: 'none' }
  }
});

export const floorCrackDuration = 2100;

export const floorCrackBurst = style({
  animation: `${floorCrackFade} ${floorCrackDuration}ms ease-out both`
});

export const floorCrackLine = style({
  fill: 'none',
  stroke: '#e5faff',
  strokeWidth: 3,
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
  strokeDasharray: '1',
  animation: `${floorCrackDraw} 0.65s ease-out both`
});

export const floorCrackBranch = style({
  stroke: '#a7ddff',
  strokeWidth: 1.5,
  animationDuration: '0.55s',
  selectors: {
    '&:nth-child(2)': { animationDelay: '0.15s' },
    '&:nth-child(3)': { animationDelay: '0.23s' },
    '&:nth-child(4)': { animationDelay: '0.31s' },
    '&:nth-child(5)': { animationDelay: '0.39s' }
  }
});
