import { keyframes, style } from '@vanilla-extract/css';

const mistFloat = keyframes({
  from: { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-10px)' },
  to: { transform: 'translateY(0)' }
});

const torchPulse = keyframes({
  '0%, 100%': { opacity: 0.14 },
  '50%': { opacity: 0.42 }
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
  filter: 'drop-shadow(0 6px 10px rgb(0 0 0 / 65%))',
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
  animation: `${mistFloat} 4s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

export const ultimatePosition = style({
  transform: 'translateY(-20px) scale(1.2)'
});
