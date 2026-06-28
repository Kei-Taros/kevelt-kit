import { style } from '@vanilla-extract/css';
import { media } from '$lib/styles/breakpoints';

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
    [media.sp]: {
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
    [media.sp]: {
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
    [media.sp]: {
      marginTop: '28px'
    }
  }
});
