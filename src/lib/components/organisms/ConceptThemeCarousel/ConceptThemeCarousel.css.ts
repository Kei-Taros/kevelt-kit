import { style } from '@vanilla-extract/css';

export const embla = style({
  width: '100%',
  overflow: 'hidden'
});

export const viewport = style({
  overflow: 'hidden',
  width: '100%'
});

export const container = style({
  display: 'flex',
  marginLeft: '-24px',
  touchAction: 'pan-y pinch-zoom'
});

export const slide = style({
  flex: '0 0 calc(100% / 3)',
  minWidth: 0,
  paddingLeft: '24px'
});

export const image = style({
  display: 'block',
  width: '100%',
  aspectRatio: '1/1',
  objectFit: 'cover',
  borderRadius: '20px'
});
