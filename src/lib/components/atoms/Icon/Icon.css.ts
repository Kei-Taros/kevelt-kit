import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const defaultIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1
});

export const iconWrapper = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1
});

export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.text.primary,
  textDecoration: 'none',
  transition: 'opacity 0.2s ease',

  selectors: {
    '&:hover': {
      opacity: 0.65
    }
  }
});

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: colors.text.primary,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',

  selectors: {
    '&:hover': {
      opacity: 0.65
    }
  }
});

export const copyWrapper = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export const copied = style({
  position: 'absolute',
  bottom: 'calc(100% + 8px)',
  left: '50%',
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  fontWeight: 600,
  color: colors.brand[600],
  pointerEvents: 'none',
  opacity: 0.9
});
