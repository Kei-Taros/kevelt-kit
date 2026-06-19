import { style, globalStyle } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const card = style({
  display: 'flex',
  gap: '24px',

  padding: '16px 20px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.05)',

  transition: `
    transform 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease
  `,

  selectors: {
    '&:hover': {
      borderColor: colors.brand[600],
      background: 'rgba(255, 255, 255, 0.08)'
    }
  },

  '@media': {
    '(max-width: 767px)': {
      flexDirection: 'column',
      gap: '16px',
      padding: '16px'
    }
  }
});

export const cardImage = style({
  alignSelf: 'center',
  width: '260px',
  aspectRatio: '16 / 9',
  objectFit: 'cover',
  flexShrink: 0,
  '@media': {
    '(max-width: 767px)': {
      width: '100%',
      borderRadius: '8px'
    }
  }
});

export const cardContent = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  '@media': {
    '(max-width: 767px)': {
      gap: '8px'
    }
  }
});

globalStyle(`${cardContent} p`, {
  margin: 0
});

globalStyle(`${cardContent} p`, {
  '@media': {
    '(max-width: 767px)': {
      fontSize: '14px',
      lineHeight: 1.8
    }
  }
});
