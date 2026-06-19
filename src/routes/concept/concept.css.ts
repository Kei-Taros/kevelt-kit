import { style, globalStyle } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const contentInner = style({
  width: '100%',
  minHeight: '100svh',
  display: 'flex',
  color: colors.text.primary,
  '@media': {
    '(max-width: 767px)': {
      display: 'block',
      minHeight: 'auto',
      overflowX: 'hidden'
    }
  }
});

export const leftArea = style({
  position: 'sticky',
  top: 0,
  width: '40%',
  height: '100dvh',
  flexShrink: 0,
  overflow: 'hidden',
  paddingLeft: '36px',
  '@media': {
    '(max-width: 767px)': {
      position: 'relative',
      width: '100%',
      height: 'auto',
      minHeight: '82svh',
      padding: '0 20px 340px',
      boxSizing: 'border-box'
    }
  }
});

export const msgMain = style({
  margin: '0',
  fontSize: '64px',
  fontWeight: 800,
  letterSpacing: '0.04em',
  zIndex: 1,
  marginBottom: '36px',
  position: 'relative',
  '@media': {
    '(max-width: 767px)': {
      fontSize: 'clamp(38px, 11vw, 48px)',
      marginBottom: '24px',
      lineHeight: 1.25
    }
  }
});

export const msgDescription = style({
  color: colors.text.muted,
  fontSize: '16px',
  zIndex: 1,
  lineHeight: 2,
  position: 'relative',
  '@media': {
    '(max-width: 767px)': {
      fontSize: '14px',
      lineHeight: 1.8
    }
  }
});

export const msgBackground = style({
  position: 'absolute',
  bottom: '-160px',
  left: 0,
  width: '100%',
  zIndex: 0,
  pointerEvents: 'none',
  '@media': {
    '(max-width: 767px)': {
      bottom: '-30px',
      left: '50%',
      width: '112%',
      transform: 'translateX(-50%)'
    }
  }
});

export const msgImg = style({
  width: '100%',
  height: 'auto',
  display: 'block',
  objectFit: 'cover',
  filter: 'brightness(0.9)'
});

export const rightArea = style({
  width: '55%',
  height: '100svh',
  paddingLeft: '28px',
  paddingRight: '48px',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  scrollSnapType: 'y mandatory',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none',
  '@media': {
    '(max-width: 767px)': {
      width: '100%',
      height: 'auto',
      padding: '0 20px',
      overflowY: 'visible',
      scrollSnapType: 'none',
      boxSizing: 'border-box'
    }
  }
});

export const sectionBlock = style({
  minHeight: '100svh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
  boxSizing: 'border-box',
  position: 'relative',
  '@media': {
    '(max-width: 767px)': {
      minHeight: 'auto',
      padding: '72px 0',
      justifyContent: 'flex-start',
      scrollSnapAlign: 'none',
      scrollSnapStop: 'normal'
    }
  }
});

export const whatSectionBlock = style({
  '@media': {
    '(max-width: 767px)': {
      paddingBottom: '64px'
    }
  }
});

export const craftSectionBlock = style({
  '@media': {
    '(max-width: 767px)': {
      paddingTop: '0px'
    }
  }
});

export const firstMsg = style({
  margin: 0,
  fontSize: '60px',
  fontWeight: 800,
  letterSpacing: '0.03em',
  textAlign: 'center',
  '@media': {
    '(max-width: 767px)': {
      fontSize: 'clamp(36px, 11vw, 48px)',
      lineHeight: 1.2
    }
  }
});

export const firstBrandMsg = style({
  color: colors.brand[600],
  marginLeft: '12px',
  '@media': {
    '(max-width: 767px)': {
      display: 'block',
      marginLeft: 0,
      marginTop: '8px'
    }
  }
});

export const arrow = style({
  fontSize: '22px',
  lineHeight: 1
});

export const mobileHiddenScrollButton = style({
  '@media': {
    '(max-width: 767px)': {
      display: 'none'
    }
  }
});

export const sectionText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  position: 'relative',
  zIndex: 2,
  '@media': {
    '(max-width: 767px)': {
      gap: '12px'
    }
  }
});

globalStyle(`${sectionText} p`, {
  margin: 0,
  color: colors.text.primary,
  fontSize: '18px',
  lineHeight: 2,
  zIndex: 2
});

globalStyle(`${sectionText} p`, {
  '@media': {
    '(max-width: 767px)': {
      fontSize: '15px',
      lineHeight: 1.85
    }
  }
});

globalStyle(`${sectionText} .brand`, {
  color: colors.brand[600],
  fontWeight: 700,
  textDecoration: 'none',
  display: 'inline-block',
  transition: 'text-shadow 0.3s ease'
});

globalStyle(`${sectionText} .brand:hover`, {
  textShadow: `0 0 5px ${colors.brand[600]}`
});

export const logoImage = style({
  position: 'absolute',
  right: '0',
  bottom: '210px',
  width: '400px',
  opacity: 0.4,
  pointerEvents: 'none',
  userSelect: 'none',
  zIndex: 1,
  '@media': {
    '(max-width: 767px)': {
      display: 'none'
    }
  }
});

export const themeText = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '24px',
  '@media': {
    '(max-width: 767px)': {
      alignItems: 'center',
      textAlign: 'center',
      gap: '14px'
    }
  }
});

globalStyle(`${themeText} p`, {
  margin: 0
});

globalStyle(`${themeText} p`, {
  '@media': {
    '(max-width: 767px)': {
      fontSize: '15px',
      lineHeight: 1.8,
      width: '100%'
    }
  }
});
