import { style } from '@vanilla-extract/css';

export const picture = style({
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: 'clamp(6px, 1cqw, 14px)',
  opacity: 0.8,
  background:
    'radial-gradient(ellipse at center, #080d10e6 0%, #080d10b3 40%, #080d1059 60%, transparent 75%)'
});

export const icon = style({
  display: 'block',
  width: '100%',
  height: 'auto'
});
