import { style, globalStyle } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const contentInner = style({
  width: '100%',
  minHeight: '100svh',
  display: 'flex',
  color: colors.text.primary,
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      overflowX: 'hidden'
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      width: '36%',
      height: '100svh',
      paddingLeft: '28px',
      paddingRight: '8px',
      boxSizing: 'border-box'
    },
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

export const conceptHeadingWrapper = style({
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      marginTop: '48px',
      marginBottom: '24px'
    }
  }
});

globalStyle(`${conceptHeadingWrapper} h1`, {
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      fontSize: '34px',
      lineHeight: 1.3
    }
  }
});

globalStyle(`${conceptHeadingWrapper} h1::after`, {
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      width: '145%',
      height: '10px'
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
    '(min-width: 768px) and (max-width: 1023px)': {
      fontSize: '36px',
      lineHeight: 1.24,
      letterSpacing: '0.02em',
      marginBottom: '28px'
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      fontSize: '14px',
      lineHeight: 1.8,
      marginTop: '70px'
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      bottom: '55px',
      left: '-30%',
      width: '180%'
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      width: '64%',
      paddingLeft: '20px',
      paddingRight: '36px',
      boxSizing: 'border-box'
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      padding: '48px 0'
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      paddingBottom: '60px'
    },
    '(max-width: 767px)': {
      paddingBottom: '64px'
    }
  }
});

export const craftSectionBlock = style({
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      paddingTop: '28px',
      paddingBottom: '28px'
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      fontSize: 'clamp(36px, 5vw, 50px)',
      lineHeight: 1.2
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      display: 'block',
      marginLeft: 0,
      marginTop: '8px'
    },
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

export const whatScrollButton = style({
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      top: '50px'
    }
  }
});

export const craftScrollButton = style({
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      top: '32px'
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
    '(min-width: 768px) and (max-width: 1023px)': {
      gap: '12px'
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      fontSize: '15px',
      lineHeight: 1.8
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      right: 0,
      bottom: '165px',
      width: '220px',
      opacity: 0.22
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      gap: '16px'
    },
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
    '(min-width: 768px) and (max-width: 1023px)': {
      fontSize: '15px',
      lineHeight: 1.8
    },
    '(max-width: 767px)': {
      fontSize: '15px',
      lineHeight: 1.8,
      width: '100%'
    }
  }
});
