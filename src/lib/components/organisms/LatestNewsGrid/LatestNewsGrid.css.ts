import { style } from '@vanilla-extract/css';

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '22px',
  width: '100%',
  alignItems: 'start',
  '@media': {
    '(max-width: 1023px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
    },
    '(max-width: 767px)': {
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
    '(max-width: 767px)': {
      marginBottom: '28px'
    }
  }
});
