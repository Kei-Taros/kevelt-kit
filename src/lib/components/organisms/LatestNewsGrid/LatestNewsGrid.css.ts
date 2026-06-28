import { style } from '@vanilla-extract/css';
import { media } from '$lib/styles/breakpoints';

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '22px',
  width: '100%',
  alignItems: 'start',
  '@media': {
    [media.tb]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
    },
    [media.sp]: {
      gridTemplateColumns: '1fr',
      gap: '20px'
    }
  }
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
