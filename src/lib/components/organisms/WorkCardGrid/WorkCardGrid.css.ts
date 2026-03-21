import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'grid',
  rowGap: '32px'
});

export const filterList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px'
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
  alignItems: 'start'
});
