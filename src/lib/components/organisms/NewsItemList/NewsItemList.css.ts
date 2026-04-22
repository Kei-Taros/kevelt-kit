import { style } from '@vanilla-extract/css';

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
});

export const headingContainer = style({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginBottom: '32px'
});

export const heading = style({
  width: '70%',
  textAlign: 'center'
});

export const divider = style({
  width: '80%',
  border: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
  margin: '28px auto'
});

export const buttonContainer = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '40px'
});
