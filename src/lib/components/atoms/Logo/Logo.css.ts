import { style } from '@vanilla-extract/css';

export const logo = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none'
});

export const image = style({
  display: 'block',
  width: 'auto',
  flexShrink: 0
});

export const label = style({
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#fff',
  textDecoration: 'none'
});

export const small = style({
  height: '24px'
});

export const medium = style({
  height: '32px'
});

export const large = style({
  height: '48px'
});
