import { style } from '@vanilla-extract/css';

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '22px',
  width: '100%',
  alignItems: 'start'
});

export const headingContainer = style({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginBottom: '12px'
});

export const heading = style({
  width: '70%',
  textAlign: 'center'
});
