import { keyframes, style } from '@vanilla-extract/css';

const stageBoltInset =
  'calc(8px + (var(--stage-bolt-side-width) - var(--stage-bolt-width)) * var(--stage-bolt-position))';

const stageLightningFlash = keyframes({
  '0%, 21%': { opacity: 0, maskSize: '100% 0%' },
  '22%': { opacity: 1 },
  '24%': { opacity: 0.4 },
  '25%': { opacity: 0.9, maskSize: '100% 112%' },
  '29%, 100%': { opacity: 0, maskSize: '100% 112%' }
});

export const stageLightning = style({
  vars: {
    '--stage-bolt-side-width':
      'max(0px, calc((100cqw - var(--stage-lightning-enemy-width)) / 2 - 16px))',
    '--stage-bolt-width': 'min(clamp(48px, 16vw, 220px), var(--stage-bolt-side-width))'
  },
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  filter: 'drop-shadow(0 0 5px #ffe4aa99)',
  '@media': {
    '(prefers-reduced-motion: reduce)': { display: 'none' }
  }
});

export const stageBolt = style({
  position: 'absolute',
  top: 0,
  left: stageBoltInset,
  width: 'var(--stage-bolt-width)',
  height: '64%',
  transformOrigin: 'top center',
  background: 'linear-gradient(#fefefc, #fffdd1 35%, #ffe4aacc 72%, #ffe4aa33)',
  clipPath:
    'polygon(49.95% 0%, 49.56% 20.05%, 37.96% 30.05%, 50.03% 47%, 33.44% 57.05%, 46.56% 74%, 32.01% 84%, 50.00% 100%, 29.31% 84%, 42.96% 74%, 29.16% 57.95%, 45.53% 47%, 33.68% 30.95%, 45.28% 20.95%, 49.05% 0%)',
  maskImage: 'linear-gradient(to bottom, #000 89%, transparent)',
  maskRepeat: 'no-repeat',
  opacity: 0
});

export const stageBoltOnRight = style({
  left: 'auto',
  right: stageBoltInset
});

export const stageBoltFirst = style({
  animation: `${stageLightningFlash} 5.8s linear -0.4s infinite`
});

export const stageBoltSecond = style({
  height: '72%',
  animation: `${stageLightningFlash} 8.1s linear -4s infinite`
});

export const stageBoltThird = style({
  transform: 'scaleX(-1)',
  animation: `${stageLightningFlash} 6.7s linear -2.8s infinite`
});

export const stageBoltFourth = style({
  height: '56%',
  animation: `${stageLightningFlash} 4.6s linear -2.75s infinite`
});

export const stageBoltFifth = style({
  height: '76%',
  transform: 'scaleX(-1)',
  animation: `${stageLightningFlash} 7.4s linear -6.25s infinite`
});

export const stageBoltSixth = style({
  height: '68%',
  animation: `${stageLightningFlash} 9.3s linear -8.625s infinite`
});
