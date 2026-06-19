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
  marginBottom: '48px',
  '@media': {
    '(max-width: 767px)': {
      marginBottom: '28px'
    }
  }
});

export const divider = style({
  width: '80%',
  border: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
  margin: '28px auto',
  '@media': {
    '(max-width: 767px)': {
      width: '100%',
      margin: '22px auto'
    }
  }
});

export const buttonContainer = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '40px',
  '@media': {
    '(max-width: 767px)': {
      marginTop: '28px'
    }
  }
});
