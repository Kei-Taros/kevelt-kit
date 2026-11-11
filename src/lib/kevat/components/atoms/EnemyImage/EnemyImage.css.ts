import { keyframes, style } from '@vanilla-extract/css';

const mistFloat = keyframes({
  from: { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-10px)' },
  to: { transform: 'translateY(0)' }
});

const mistFade = keyframes({
  from: { opacity: 0.9 },
  '50%': { opacity: 0.6 },
  to: { opacity: 0.9 }
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
  opacity: 0.82,
  maskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)'
});

export const mistShroudedFloat = style({
  animation: `${mistFloat} 4s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

export const mistShroudedFade = style({
  animation: `${mistFade} 3s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0.85 }
  }
});
