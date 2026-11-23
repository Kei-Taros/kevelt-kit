import { keyframes, style } from '@vanilla-extract/css';

const enemyDropShadow = 'drop-shadow(0 6px 10px rgb(0 0 0 / 65%))';

const mistFloat = keyframes({
  from: { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-10px)' },
  to: { transform: 'translateY(0)' }
});

const torchPulse = keyframes({
  '0%, 100%': { opacity: 0.14 },
  '50%': { opacity: 0.42 }
});

export const lightningFlashMs = 240;

const chestLightning = keyframes({
  '0%, 100%': { opacity: 0 },
  '22%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '68%': { opacity: 0.7 }
});

const chestLightPulse = keyframes({
  '0%, 100%': { transform: 'translate(-50%, -50%) scale(0.9)', opacity: 0.82 },
  '50%': { transform: 'translate(-48%, -55%) scale(1.08)', opacity: 1 }
});

const orbitRing = keyframes({
  from: { strokeDashoffset: 'calc(-1 * var(--segment-position))' },
  to: { strokeDashoffset: 'calc(-100px - var(--segment-position))' }
});

export const picture = style({
  display: 'block',
  width: '100%',
  height: '100%'
});

export const image = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  opacity: 0.95,
  maskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)'
});

export const fireWielder = style({
  position: 'relative',
  containerType: 'size',
  filter: enemyDropShadow,
  '::after': {
    // MEMO: object-fit: contain 後の画像幅を基準に松明へ重ねる
    vars: { '--torch-image-width': 'min(100cqw, 107.57cqh)' },
    content: '""',
    position: 'absolute',
    left: 'calc(50% - var(--torch-image-width) * 0.27)',
    top: 'calc(50% - var(--torch-image-width) * 0.16)',
    width: 'calc(var(--torch-image-width) * 0.32)',
    aspectRatio: '1',
    transform: 'translate(-50%, -50%)',
    background: 'radial-gradient(ellipse, #fff2c2 0%, #ffa6467c 32%, transparent 70%)',
    pointerEvents: 'none',
    opacity: 0.22,
    animation: `${torchPulse} 4s ease-in-out infinite`
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      '::after': { animation: 'none' }
    }
  }
});

export const mistWarden = style({
  filter: enemyDropShadow,
  animation: `${mistFloat} 4s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

export const stoneLightbringerFrame = style({
  position: 'relative',
  isolation: 'isolate',
  containerType: 'size',
  vars: {
    '--stone-image-width': 'min(100cqw, 107.57cqh)',
    '--chest-light-top': 'calc(50% - var(--stone-image-width) * 0.24)'
  },
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      zIndex: 1,
      left: '50%',
      top: 'var(--chest-light-top)',
      width: 'clamp(10px, calc(var(--stone-image-width) * 0.1), 36px)',
      aspectRatio: '1',
      background:
        'radial-gradient(circle, #fefefc 0%, #fffdd1e6 25%, #ffeac466 48%, #ffeac400 72%)',
      filter: 'blur(1.5px)',
      transform: 'translate(-50%, -50%)',
      opacity: 0.88,
      animation: `${chestLightPulse} 2.4s ease-in-out infinite`
    }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      selectors: { '&::before': { animation: 'none' } }
    }
  }
});

export const stoneLightbringer = style({
  filter: 'drop-shadow(0 3px 3px rgb(0 0 0 / 50%))'
});

export const lightning = style({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  filter: 'drop-shadow(0 1px 1px rgb(63 34 12 / 50%))',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '50%',
      top: 'var(--chest-light-top)',
      width: 'calc(var(--stone-image-width) * 0.29)',
      height: 'calc(var(--stone-image-width) * 0.19)',
      translate: '0 -50%',
      transformOrigin: 'left center',
      clipPath:
        'polygon(0 50%, 24% 40%, 38% 50%, 63% 34%, 74% 40%, 100% 29%, 74% 43%, 62% 38%, 38% 54%, 24% 44%)',
      background: 'linear-gradient(90deg, #fefefc, #fffdd1 32%, #ffe4aa 68%, #ffe4aa00)',
      rotate: 'var(--lightning-single-angle)',
      opacity: 0
    },
    '&[data-lightning-single]::after': {
      animation: `${chestLightning} ${lightningFlashMs}ms linear`
    }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      selectors: {
        '&[data-lightning-single]::after': { animation: 'none' }
      }
    }
  }
});

export const ultimatePosition = style({
  transform: 'translateY(-20px) scale(1.2)',
  vars: {
    '--trinity-image-aspect-ratio': '1.777',
    '--trinity-chest-offset': '0.096',
    '--trinity-chest-star-scale': '0.8'
  }
});

const ultimateHover = keyframes({
  '0%, 100%': { translate: '0 0' },
  '50%': { translate: '0 -12px' }
});

export const ultimateFloat = style({
  animation: `${ultimateHover} 4s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

export const trinity = style({
  position: 'relative',
  containerType: 'size'
});

export const trinityEnvoy = style({
  filter: enemyDropShadow
});

export const trinityUltimate = style({
  filter: 'drop-shadow(0 0 8px rgb(255 255 255 / 52%)) drop-shadow(0 0 24px rgb(255 255 255 / 55%))'
});

const chestStarHalo = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.75)' },
  '18%': { opacity: 0.78 },
  '65%, 100%': { opacity: 0, transform: 'scale(3.2)' }
});

export const trinityChestStar = style({
  vars: {
    '--trinity-image-width': 'min(100cqw, 100cqh * var(--trinity-image-aspect-ratio, 1.0757))'
  },
  position: 'absolute',
  left: '50%',
  top: 'calc(50% - var(--trinity-image-width) * var(--trinity-chest-offset, 0.168))',
  width:
    'calc(clamp(12px, var(--trinity-image-width) * 0.075, 44px) * var(--trinity-chest-star-scale, 1))',
  aspectRatio: '1 / 1',
  translate: '-50% -50%',
  pointerEvents: 'none',
  filter: 'drop-shadow(0 0 5px #79dfff) drop-shadow(0 0 11px #348cff)',
  '::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle, #fff 12%, #d7f8ff 37%, #64bdff)',
    clipPath: 'polygon(50% 0, 59% 41%, 100% 50%, 59% 59%, 50% 100%, 41% 59%, 0 50%, 41% 41%)'
  },
  '::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    borderRadius: '50%',
    background: 'radial-gradient(circle, #c2f2ff88, #52aaff55 35%, #348cff00 70%)',
    opacity: 0,
    animation: `${chestStarHalo} 3.2s ease-out infinite`
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      '::after': { animation: 'none' }
    }
  }
});

export const ringTrace = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  overflow: 'visible',
  pointerEvents: 'none',
  '@media': {
    '(prefers-reduced-motion: reduce)': { display: 'none' }
  }
});

export const ringTraceNear = style({
  stroke: '#89dcff',
  strokeWidth: 8,
  filter: 'drop-shadow(0 0 4px #51beff) drop-shadow(0 0 8px #237dff)'
});

export const ringTraceFar = style({
  stroke: '#a4e4ff',
  strokeWidth: 5,
  opacity: 0.72,
  filter: 'drop-shadow(0 0 3px #51beff)'
});

export const ringTraceSegment = style({
  fill: 'none',
  animation: `${orbitRing} 5.5s linear infinite`
});
