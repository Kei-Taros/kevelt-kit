import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const item = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '24px',
  width: '100%',
  textDecoration: 'none',
  transition: 'opacity 180ms ease, transform 180ms ease',
  '@media': {
    '(max-width: 767px)': {
      flexDirection: 'column',
      gap: '12px'
    },
    '(hover: none), (pointer: coarse)': {
      transition: 'none'
    }
  },

  selectors: {
    '&:focus-visible': {
      outline: '1px solid #ffffff',
      outlineOffset: '4px'
    }
  }
});

export const imageContainer = style({
  flexShrink: 0,
  width: '240px',
  aspectRatio: '16 / 9',
  overflow: 'hidden',
  borderRadius: '12px',
  '@media': {
    '(max-width: 767px)': {
      width: '100%',
      borderRadius: '10px'
    }
  }
});

export const image = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'filter 300ms ease',

  selectors: {
    [`${item}:hover &`]: {
      filter: 'brightness(1.25)'
    }
  },

  '@media': {
    '(hover: none), (pointer: coarse)': {
      selectors: {
        [`${item}:hover &`]: {
          filter: 'none'
        }
      }
    }
  }
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  minWidth: 0,
  width: '100%',
  '@media': {
    '(max-width: 767px)': {
      gap: '8px'
    }
  }
});

export const date = style({
  margin: 0,
  marginBottom: '6px',
  color: colors.text.muted,
  fontSize: '14px',
  fontWeight: 500,
  '@media': {
    '(max-width: 767px)': {
      marginBottom: 0,
      fontSize: '13px'
    }
  }
});

export const title = style({
  margin: 0,
  color: colors.text.primary,
  fontSize: '28px',
  fontWeight: 700,
  transition: 'color 300ms ease, text-shadow 240ms ease',
  '@media': {
    '(max-width: 767px)': {
      fontSize: 'clamp(18px, 5vw, 22px)',
      lineHeight: 1.4
    },
    '(hover: none), (pointer: coarse)': {
      selectors: {
        [`${item}:hover &`]: {
          color: colors.text.primary
        }
      }
    }
  },

  selectors: {
    [`${item}:hover &`]: {
      color: colors.brand[400]
    }
  }
});
