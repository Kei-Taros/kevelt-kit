import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  fontVariantNumeric: 'tabular-nums',
  transition: 'color 200ms ease-out, text-shadow 200ms ease-out',
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' }
  }
});

export const flashing = style({
  color: '#ff7775',
  textShadow: '0 0 10px #ff7775aa'
});
