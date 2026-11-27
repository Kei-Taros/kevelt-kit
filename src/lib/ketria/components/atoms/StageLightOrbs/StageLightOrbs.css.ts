import { createVar, fallbackVar, keyframes, style } from '@vanilla-extract/css';

const riseDistance = createVar();

const fade = keyframes({
  '0%': { opacity: 0, translate: '0 0' },
  '45%': { opacity: 0.72 },
  '100%': { opacity: 0, translate: `0 ${fallbackVar(riseDistance, '0px')}` }
});

export const layer = style({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      display: 'none'
    }
  }
});

export const orb = style({
  position: 'absolute',
  aspectRatio: '1',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  background: 'radial-gradient(circle, #fff6cc 12%, #ffc568b0 33%, #e9973738 56%, transparent 72%)',
  filter: 'drop-shadow(0 0 5px #ffb64b99)',
  opacity: 0,
  animation: `${fade} 10s ease-in-out infinite`
});

export const rising = style({
  vars: { [riseDistance]: '-45dvh' }
});
