import { style } from '@vanilla-extract/css';

export const picture = style({
  position: 'absolute',
  inset: 0,
  display: 'block',
  width: '100%',
  height: '100%'
});

export const image = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center'
});
