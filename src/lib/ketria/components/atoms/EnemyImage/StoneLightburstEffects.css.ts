import { keyframes, style } from '@vanilla-extract/css';

const lightburstRadiate = keyframes({
  from: { opacity: 0, backgroundPosition: '50% 50%, 50% 50%, center, center' },
  '22%': { opacity: 0.92 },
  '65%': { opacity: 0.7 },
  to: { opacity: 0, backgroundPosition: '100% 50%, 0% 50%, center, center' }
});

const lightburstSpark =
  'radial-gradient(ellipse, #fff9e6 5%, #ffe8ae 20%, #ffd17f99 38%, #ffbc6426 58%, transparent 74%) no-repeat';

const lightburstWave = {
  content: '""',
  position: 'absolute',
  inset: '0 -90%',
  background: [
    lightburstSpark,
    lightburstSpark,
    'radial-gradient(ellipse 48% 1.7% at center, #fff3ceaa, #ffd58a55 38%, transparent)',
    'radial-gradient(ellipse 42% 7% at center, #ffe1a344, #ffbe6330 36%, transparent)'
  ].join(', '),
  backgroundSize: '18% 9%, 18% 9%, 100% 100%, 100% 100%',
  animation: `${lightburstRadiate} 1.4s linear infinite`
} as const;

export const lightburstChestGlow = style({
  vars: { '--lightburst-image-width': 'min(100cqw, 177.69cqh)' },
  position: 'absolute',
  left: '50%',
  top: 'calc(50% - var(--lightburst-image-width) * 0.144)',
  width: 'calc(var(--lightburst-image-width) * 0.1)',
  aspectRatio: '1',
  translate: '-50% -50%',
  pointerEvents: 'none',
  background:
    'radial-gradient(ellipse at center, #fffdf1 0%, #fff2be 12%, #ffce72aa 28%, #ffac4844 47%, transparent 72%)',
  opacity: 0.8,
  mixBlendMode: 'screen',
  '::before': { ...lightburstWave, rotate: 'var(--lightburst-angle)' },
  '::after': { ...lightburstWave, rotate: 'var(--lightburst-offset-angle)', animationDelay: '-0.7s' },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      '::before': { display: 'none' },
      '::after': { display: 'none' }
    }
  }
});

const lightburstFootStrike = keyframes({
  '0%, 4%': { opacity: 0, strokeDashoffset: 1 },
  '5%': { opacity: 1, strokeDashoffset: 0.85 },
  '15%': { opacity: 1, strokeDashoffset: 0 },
  '19%': { opacity: 0.28 },
  '22%': { opacity: 0.85 },
  '31%, 100%': { opacity: 0, strokeDashoffset: 0 }
});

export const lightburstFootLightning = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  fill: 'none',
  stroke: '#fff5d7',
  strokeLinejoin: 'bevel',
  filter: 'drop-shadow(0 0 3px #ffe092) drop-shadow(0 0 9px #ffad42)',
  pointerEvents: 'none',
  '@media': {
    '(prefers-reduced-motion: reduce)': { display: 'none' }
  }
});

export const lightburstFootBolt = style({
  transformBox: 'fill-box',
  transformOrigin: 'center bottom',
  transform: 'scaleY(1.1)',
  strokeDasharray: 1,
  animation: `${lightburstFootStrike} 2.5s linear infinite`
});
