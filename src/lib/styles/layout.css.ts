import { style } from '@vanilla-extract/css';

export const contentInner = style({
  width: '100%',
  maxWidth: '1100px',
  padding: '0 clamp(20px, 5vw, 60px)',
  margin: '0 auto',
  color: 'white',
  marginBottom: '280px'
});
