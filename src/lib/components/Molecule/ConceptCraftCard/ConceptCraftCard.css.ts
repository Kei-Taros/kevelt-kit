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
  }
});

export const cardImage = style({
  alignSelf: 'center',
  width: '260px',
  aspectRatio: '16 / 9',
  objectFit: 'cover',
  flexShrink: 0
});

export const cardContent = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0
});

globalStyle(`${cardContent} p`, {
  margin: 0
});
