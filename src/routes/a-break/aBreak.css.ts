import { style } from '@vanilla-extract/css';

export const vignette = style({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background: 'radial-gradient(ellipse at 50% 45%, transparent 30%, #0008 100%)'
});
