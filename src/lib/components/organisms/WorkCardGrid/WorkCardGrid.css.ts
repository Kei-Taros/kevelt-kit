import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'grid',
  rowGap: '32px',
  '@media': {
    '(max-width: 767px)': {
      rowGap: '24px'
    }
  }
});

export const filterList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  '@media': {
    '(max-width: 767px)': {
      gap: '10px'
    }
  }
});

export const filterRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  '@media': {
    '(max-width: 767px)': {
      gap: '10px'
    }
  }
});

export const filterButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '40px',
  padding: '0 20px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '999px',
  background: 'rgba(255, 255, 255, 0.06)',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'background 180ms ease, border-color 180ms ease, transform 180ms ease',
  '@media': {
    '(max-width: 767px)': {
      minHeight: '34px',
      padding: '0 14px',
      fontSize: '13px'
    }
  },

  selectors: {
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.12)',
      borderColor: 'rgba(255, 255, 255, 0.18)'
    },
    '&:focus-visible': {
      outline: '2px solid #ffffff',
      outlineOffset: '2px'
    },
    '&:active': {
      transform: 'scale(0.98)'
    }
  }
});

export const activeFilterButton = style({
  background: 'rgba(255, 255, 255, 0.18)',
  borderColor: 'rgba(255, 255, 255, 0.28)'
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '44px 24px',
  alignItems: 'start',
  '@media': {
    '(max-width: 1023px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
    },
    '(max-width: 767px)': {
      gridTemplateColumns: '1fr',
      gap: '24px'
    }
  }
});
