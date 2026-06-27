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
    '(min-width: 768px) and (max-width: 1023px)': {
      alignItems: 'center',
      gap: '14px',
      padding: '12px 14px'
    },
    '(max-width: 767px)': {
      flexDirection: 'column',
      gap: '16px',
      padding: '16px'
    }
  }
});

export const cardImageFrame = style({
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      display: 'block',
      alignSelf: 'center',
      flexShrink: 0,
      overflow: 'hidden',
      lineHeight: 0
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
    '(min-width: 768px) and (max-width: 1023px)': {
      width: 'clamp(136px, 17vw, 170px)',
      display: 'block',
      transform: 'scale(1.2)',
      transformOrigin: 'center'
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      gap: '4px',
      minWidth: 0
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      fontSize: '12px',
      lineHeight: 1.55
    },
    '(max-width: 767px)': {
      fontSize: '14px',
      lineHeight: 1.8
    }
  }
});

globalStyle(`${cardContent} h4`, {
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      fontSize: '16px',
      paddingBottom: '4px'
    }
  }
});

globalStyle(`${cardContent} h4::after`, {
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      width: '96px',
      height: '5px'
    }
  }
});
