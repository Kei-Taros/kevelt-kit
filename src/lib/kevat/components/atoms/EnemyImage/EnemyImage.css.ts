import { style } from '@vanilla-extract/css';

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
