import { style } from '@vanilla-extract/css';
import { media } from '$lib/styles/breakpoints';

export const menuBack = style({
  padding: '12px 24px 12px calc(24px + 0.3em)',
  border: 0,
  background: 'transparent',
  color: '#d3dde5',
  fontFamily: 'Arial, sans-serif',
  fontSize: 'clamp(14px, 2dvh, 20px)',
  letterSpacing: '0.3em',
  cursor: 'pointer',
  textShadow: '0 2px 8px #000',
  selectors: {
    '&:focus-visible': { outline: '1px solid #ffb061', outlineOffset: 4 }
  },
  '@media': { [media.nonSpHover]: { selectors: { '&:hover': { color: '#ffb061' } } } }
});

export const menuBackTouchFeedback = style({
  '@media': {
    [media.sp]: {
      WebkitTapHighlightColor: 'transparent',
      selectors: {
        '&:active, &[data-touch-pressed]': { color: '#ffb061' }
      }
    }
  }
});
