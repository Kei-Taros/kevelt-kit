import { keyframes, style } from '@vanilla-extract/css';

const mistDrift = keyframes({
  from: { transform: 'translate3d(-50%, 0, 0)' },
  to: { transform: 'translate3d(0, 0, 0)' }
});

// 左右端に同じ雲を配置し、各タイルの濃さと傾きを連続させる。
const mistNear = [
  'radial-gradient(ellipse 26.4% 50.4% at 0% 62%, #e8f3fa48, #e8f3fa18 45%, #e8f3fa00 100%)',
  'radial-gradient(ellipse 26.4% 50.4% at 100% 62%, #e8f3fa48, #e8f3fa18 45%, #e8f3fa00 100%)',
  'radial-gradient(ellipse 31.2% 39.6% at 42% 76%, #e8f3fa55, #e8f3fa18 45%, #e8f3fa00 100%)',
  'radial-gradient(ellipse 26.4% 33.6% at 72% 38%, #e8f3fa38, #e8f3fa10 45%, #e8f3fa00 100%)'
].join(', ');

const mistFar = [
  'radial-gradient(ellipse 38.4% 36% at 0% 36%, #edf6ff48, #edf6ff12 45%, #edf6ff00 100%)',
  'radial-gradient(ellipse 38.4% 36% at 100% 36%, #edf6ff48, #edf6ff12 45%, #edf6ff00 100%)',
  'radial-gradient(ellipse 40.8% 48% at 51% 60%, #edf6ff48, #edf6ff18 45%, #edf6ff00 100%)'
].join(', ');

export const driftingMist = style({
  position: 'absolute',
  overflow: 'hidden',
  pointerEvents: 'none',
  selectors: {
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      width: '200%',
      backgroundSize: '50% 100%',
      backgroundRepeat: 'repeat-x',
      animation: `${mistDrift} 60s linear infinite`
    },
    '&::before': {
      backgroundImage: mistNear,
      opacity: 0.85
    },
    '&::after': {
      backgroundImage: mistFar,
      opacity: 0.6,
      animationDuration: '80s',
      animationDelay: '-9s'
    }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      selectors: { '&::before, &::after': { animation: 'none' } }
    }
  }
});

export const titleMist = style({
  inset: '50% 0 0',
  zIndex: 1,
  maskImage: 'linear-gradient(to bottom, transparent, #000 30%)',
  background: 'linear-gradient(to bottom, #e8f3fa08, #e8f3fa18)'
});

const battleMistTexture = [
  'url("/images/ketria/effects/mist-effect.png")',
  'image-set(url("/images/ketria/effects/mist-effect.webp") type("image/webp"), url("/images/ketria/effects/mist-effect.png") type("image/png"))'
];

export const battleMist = style({
  inset: 0,
  zIndex: 0,
  '::before': {
    backgroundImage: battleMistTexture,
    backgroundSize: '50% 115%',
    backgroundPosition: '0 85%',
    opacity: 0.15
  },
  '::after': {
    animationDirection: 'reverse',
    backgroundImage: battleMistTexture,
    backgroundSize: '50% 82%',
    backgroundPosition: '0 -52%',
    opacity: 0.1
  }
});
