import { style } from '@vanilla-extract/css';

export const picture = style({
  display: 'block',
  width: '100%',
  height: '100%'
});

export const icon = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'contain'
});
