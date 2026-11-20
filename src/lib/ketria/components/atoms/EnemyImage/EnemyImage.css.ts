import { keyframes, style } from '@vanilla-extract/css';

const mistFloat = keyframes({
  from: { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-10px)' },
  to: { transform: 'translateY(0)' }
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

export const ultimatePosition = style({
  transform: 'translateY(-20px) scale(1.2)'
});
