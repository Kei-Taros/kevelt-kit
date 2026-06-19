import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  padding: 0,
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, rgba(26, 32, 50, 0.96) 0%, rgba(20, 25, 40, 0.98) 100%)',
  textAlign: 'left',
  cursor: 'pointer',
  transition:
    'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease',

  selectors: {
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 8px 7px rgba(100, 100, 100, 0.4)',
      borderColor: 'rgba(255, 255, 255, 0.14)'
    },
    '&:focus-visible': {
      outline: '2px solid #ffffff',
      outlineOffset: '2px'
    },
    '&:active': {
      transform: 'translateY(-1px) scale(0.995)'
    }
  },

  '@media': {
    '(hover: none), (pointer: coarse)': {
      selectors: {
        '&:hover': {
          transform: 'none',
          boxShadow: 'none',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }
      }
    }
  }
});

export const imageWrapper = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '5 / 4',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, rgba(62, 70, 96, 0.95) 0%, rgba(36, 44, 65, 1) 100%)',
  '@media': {
    '(max-width: 767px)': {
      aspectRatio: '16 / 10'
    }
  }
});

export const image = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 240ms ease',

  selectors: {
    [`${card}:hover &`]: {
      transform: 'scale(1.05)'
    }
  },

  '@media': {
    '(hover: none), (pointer: coarse)': {
      selectors: {
        [`${card}:hover &`]: {
          transform: 'none'
        }
      }
    }
  }
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '22px 20px 20px',
  background: 'linear-gradient(180deg, rgba(28, 34, 54, 0.92) 0%, rgba(21, 26, 42, 0.98) 100%)',
  '@media': {
    '(max-width: 767px)': {
      padding: '16px'
    }
  }
});

export const title = style({
  margin: 0,
  color: colors.text.primary,
  fontSize: '24px',
  fontWeight: 700,
  marginBottom: '12px',
  '@media': {
    '(max-width: 767px)': {
      fontSize: '20px',
      marginBottom: '8px'
    }
  }
});

export const period = style({
  margin: 0,
  color: colors.text.muted,
  fontSize: '16px',
  lineHeight: 1.4,
  fontWeight: 500,
  marginBottom: '12px',
  '@media': {
    '(max-width: 767px)': {
      fontSize: '14px',
      marginBottom: '10px'
    }
  }
});

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  '@media': {
    '(max-width: 767px)': {
      gap: '8px'
    }
  }
});
