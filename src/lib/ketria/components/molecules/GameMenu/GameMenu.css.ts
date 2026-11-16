import { style } from '@vanilla-extract/css';

export const root = style({
  position: 'absolute',
  top: 'max(16px, env(safe-area-inset-top))',
  right: 'max(3.5%, env(safe-area-inset-right))',
  zIndex: 4
});

export const panel = style({
  position: 'absolute',
  top: 56,
  right: 0,
  width: 180,
  padding: 8,
  border: '1px solid #ffffff40',
  borderRadius: 6,
  background: '#080d10f5',
  boxShadow: '0 8px 24px #0008'
});

export const link = style({
  display: 'block',
  padding: '14px 16px',
  color: '#f5f5f2',
  textDecoration: 'none',
  fontSize: 14,
  selectors: {
    '&:hover': { background: '#28313a' },
    '&:focus-visible': { outline: '2px solid #e6f5ff', outlineOffset: 3 }
  }
});

export const backdrop = style({
  position: 'absolute',
  inset: 0,
  zIndex: 3,
  border: 0,
  padding: 0,
  background: 'rgba(0, 0, 0, 0.6)'
});

export const action = style([
  link,
  {
    width: '100%',
    border: 0,
    background: 'transparent',
    fontFamily: 'inherit',
    textAlign: 'left',
    cursor: 'pointer'
  }
]);
