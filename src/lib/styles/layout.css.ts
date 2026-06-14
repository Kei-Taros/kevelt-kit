import { style } from '@vanilla-extract/css';

export const contentInner = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '1220px',
  padding: '0 clamp(20px, 5vw, 60px)',
  margin: '0 auto',
  color: 'white',
  marginBottom: '100px'
});
