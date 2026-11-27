import { style } from '@vanilla-extract/css';
import { media } from '$lib/styles/breakpoints';

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

export const option = style({
  display: 'block',
  boxSizing: 'border-box',
  width: '100%',
  padding: '14px 16px',
  border: 0,
  borderRadius: 4,
  background: 'transparent',
  color: '#f5f5f2',
  fontFamily: 'inherit',
  fontSize: 14,
  lineHeight: '1.25',
  textDecoration: 'none',
  textAlign: 'center',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': { outline: '2px solid #e6f5ff', outlineOffset: -2 }
  },
  '@media': { [media.nonSpHover]: { selectors: { '&:hover': { background: '#28313a' } } } }
});

export const backdrop = style({
  position: 'absolute',
  inset: 0,
  zIndex: 3,
  border: 0,
  padding: 0,
  background: 'rgba(0, 0, 0, 0.6)'
});
