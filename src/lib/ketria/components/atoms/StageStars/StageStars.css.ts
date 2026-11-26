import { keyframes, style } from '@vanilla-extract/css';

const twinkle = keyframes({
  '0%, 19%, 55%, 100%': { opacity: 0, scale: 0.65 },
  '33%': { opacity: 0.95, scale: 1.25 }
});

export const layer = style({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none'
});

export const star = style({
  position: 'absolute',
  aspectRatio: '1 / 1',
  translate: '-50% -50%',
  opacity: 0.28,
  filter: 'drop-shadow(0 0 3px #b9dfffcc)',
  animationName: twinkle,
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  '::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle, #fff 18%, #def1ff 50%, #9ed0ff)',
    clipPath: 'polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%)'
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { animationName: 'none' }
  }
});
