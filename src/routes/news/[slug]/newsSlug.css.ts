import { style, globalStyle } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const article = style({
  margin: '0 auto',
  marginBottom: '120px',
  '@media': {
    '(max-width: 767px)': {
      marginBottom: '72px'
    }
  }
});

export const thumbnail = style({
  display: 'block',
  width: '100%',
  aspectRatio: '16 / 7.5',
  objectFit: 'cover',
  borderRadius: '14px',
  '@media': {
    '(max-width: 767px)': {
      aspectRatio: '16 / 10',
      borderRadius: '10px'
    }
  }
});

export const contentWithToc = style({
  display: 'grid',
  gridTemplateColumns: '1fr 220px',
  gap: '48px',
  alignItems: 'start',
  '@media': {
    '(max-width: 767px)': {
      gridTemplateColumns: '1fr',
      gap: '28px'
    }
  }
});

export const tocArea = style({
  position: 'sticky',
  top: '100px',
  alignSelf: 'start',
  order: 2,
  '@media': {
    '(max-width: 767px)': {
      position: 'static',
      order: 1
    }
  }
});

export const toc = style({
  padding: '16px 0 16px 18px',
  borderLeft: `2px solid ${colors.brand[600]}`,
  background: 'transparent',
  '@media': {
    '(max-width: 767px)': {
      padding: '12px 0 12px 14px'
    }
  }
});

export const tocTitle = style({
  margin: '0 0 14px',
  color: colors.text.primary,
  fontSize: '18px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  '@media': {
    '(max-width: 767px)': {
      fontSize: '16px'
    }
  }
});

export const tocList = style({
  listStyle: 'none',
  padding: 0,
  margin: 0
});

export const tocItem = style({
  marginBottom: '10px'
});

export const tocLink = style({
  display: 'block',
  color: colors.text.muted,
  fontSize: '14px',
  lineHeight: 1.6,
  textDecoration: 'none',
  transition: 'color 0.2s ease, transform 0.2s ease',

  selectors: {
    '&:hover': {
      color: colors.brand[500],
      transform: 'translateX(4px)'
    }
  },
  '@media': {
    '(max-width: 767px)': {
      fontSize: '13px'
    },
    '(hover: none), (pointer: coarse)': {
      selectors: {
        '&:hover': {
          color: colors.text.muted,
          transform: 'none'
        }
      }
    }
  }
});

export const content = style({
  order: 1,
  minWidth: 0,
  '@media': {
    '(max-width: 767px)': {
      order: 2
    }
  }
});

globalStyle(`${content} h3`, {
  marginTop: '48px',
  position: 'relative',
  padding: '0.2em 1.0em 0.2em 1.4em',
  background: 'transparent',
  borderLeft: `3px solid ${colors.brand[600]}`,
  scrollMarginTop: '120px'
});

globalStyle(`${content} h3`, {
  '@media': {
    '(max-width: 767px)': {
      marginTop: '36px',
      fontSize: '20px',
      lineHeight: 1.4,
      scrollMarginTop: '88px'
    }
  }
});

globalStyle(`${content} p`, {
  '@media': {
    '(max-width: 767px)': {
      fontSize: '15px',
      lineHeight: 1.9
    }
  }
});

globalStyle(`${content} img`, {
  maxWidth: '100%',
  height: 'auto'
});

globalStyle(`${content} h3::before`, {
  content: '',
  position: 'absolute',
  left: '3px',
  top: 0,
  height: '100%',
  width: '3px',
  background: colors.brand[600]
});

globalStyle(`${content} h3::after`, {
  content: '',
  position: 'absolute',
  left: '9px',
  top: 0,
  height: '100%',
  width: '3px',
  background: colors.brand[600]
});

globalStyle(`${content} ul`, {
  margin: '16px 0'
});

globalStyle(`${content} li::marker`, {
  color: colors.brand[600]
});

export const navButtons = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  '@media': {
    '(max-width: 767px)': {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '18px'
    }
  }
});

export const left = style({
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-start',
  '@media': {
    '(max-width: 767px)': {
      justifyContent: 'center',
      order: 2
    }
  }
});

export const center = style({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  '@media': {
    '(max-width: 767px)': {
      order: 1
    }
  }
});

export const right = style({
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  '@media': {
    '(max-width: 767px)': {
      justifyContent: 'center',
      order: 3
    }
  }
});
