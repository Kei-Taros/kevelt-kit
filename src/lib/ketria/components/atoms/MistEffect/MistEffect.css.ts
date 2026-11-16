import { style } from '@vanilla-extract/css';

export const picture = style({
  display: 'block',
  pointerEvents: 'none'
});

export const image = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'contain'
});
