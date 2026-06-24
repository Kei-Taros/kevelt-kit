import { style, globalStyle } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

/* Common */
export const headerRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '32px'
});

export const headerActionButton = style({
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      padding: '12px 20px',
      fontSize: '15px',
      whiteSpace: 'nowrap'
    },
    '(max-width: 767px)': {
      padding: '12px 18px',
      fontSize: '15px',
      whiteSpace: 'nowrap'
    }
  }
});

/* intro */
export const openingOverlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  background: colors.background.secondary,
  opacity: 1,
  transition: 'opacity 1000ms ease',
  pointerEvents: 'auto',
  overflow: 'hidden',
  touchAction: 'none'
});

export const openingFadeOut = style({
  opacity: 0,
  pointerEvents: 'none'
});

export const openingVideo = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  display: 'block'
});

/* Hero View */
export const heroWrapper = style({
  position: 'relative',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      height: '100svh'
    },
    '(max-width: 767px)': {
      height: '100svh'
    }
  }
});

export const heroVideo = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 1
});

export const heroCover = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 2,
  pointerEvents: 'none',

  transform: 'scale(1)',
  transformOrigin: '48.5% 49%',
  transition: 'transform 0.3s ease-out',
  willChange: 'transform',
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      transformOrigin: '50% 47%'
    },
    '(max-width: 767px)': {
      transformOrigin: '50% 50%'
    }
  }
});

/* Msg */
export const msgWrapper = style({
  position: 'relative',
  minHeight: '50vh',
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      minHeight: '46svh'
    },
    '(max-width: 767px)': {
      display: 'flex',
      minHeight: '50svh',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }
});

export const fadeUpMsg = style({
  opacity: 0,
  transform: 'translateY(30px)',
  transition: 'opacity 700ms ease, transform 700ms ease'
});

export const msgTop = style([
  fadeUpMsg,
  {
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 700,
    margin: '0 0 24px 0',
    '@media': {
      '(min-width: 768px) and (max-width: 1023px)': {
        fontSize: 'clamp(38px, 5.6vw, 60px)',
        lineHeight: 1.3,
        marginBottom: '56px'
      },
      '(max-width: 767px)': {
        fontSize: 'clamp(28px, 10vw, 40px)',
        lineHeight: 1.35,
        marginBottom: '16px'
      }
    }
  }
]);

export const msgMiddle = style([
  fadeUpMsg,
  {
    display: 'flex',
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 800,
    margin: 0,
    lineHeight: 1.2,
    '@media': {
      '(min-width: 768px) and (max-width: 1023px)': {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        fontSize: 'clamp(34px, 5vw, 50px)',
        lineHeight: 1.3,
        whiteSpace: 'nowrap'
      },
      '(max-width: 767px)': {
        flexDirection: 'column',
        gap: '16px',
        fontSize: 'clamp(28px, 10vw, 40px)',
        lineHeight: 1.4
      }
    }
  }
]);

export const msgBottom = style([
  fadeUpMsg,
  {
    position: 'absolute',
    right: 0,
    bottom: 0,
    fontSize: 'clamp(16px, 2vw, 26px)',
    fontWeight: 600,
    '@media': {
      '(min-width: 768px) and (max-width: 1023px)': {
        fontSize: 'clamp(18px, 2.4vw, 24px)'
      },
      '(max-width: 767px)': {
        position: 'static',
        alignSelf: 'flex-end',
        marginTop: '48px',
        fontSize: '14px'
      }
    }
  }
]);

export const showMsg = style({
  opacity: 1,
  transform: 'translateY(0)'
});

/* grid img*/
export const grid = style({
  vars: {
    '--big': 'clamp(440px, 60vw, 540px)',
    '--rightCol': 'calc(var(--big) * 0.70)',
    '--gap': '20px',
    '--small': 'calc((var(--big) - var(--gap)) / 2)'
  },
  display: 'grid',
  gridTemplateColumns: 'var(--big) var(--rightCol)',
  gridTemplateRows: 'var(--big) var(--big)',
  columnGap: 'var(--gap)',
  rowGap: 'var(--gap)',
  justifyContent: 'center',
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      vars: {
        '--big': 'clamp(320px, 48vw, 420px)',
        '--rightCol': 'calc(var(--big) * 0.72)',
        '--gap': '16px'
      }
    },
    '(max-width: 767px)': {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      gap: '16px'
    }
  }
});

export const gridTileHidden = style({
  opacity: 0,
  transform: 'translateY(40px)',
  transition: 'opacity 1s ease, transform 1s ease, filter 0.3s ease'
});

export const gridTileShow = style({
  opacity: 1,
  transform: 'translateY(0)',
  transition: 'opacity 1s ease, transform 1s ease, filter 0.3s ease'
});

export const gridTile = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '12px',
  filter: 'brightness(0.8)',
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      filter: 'brightness(0.9)'
    },
    '(max-width: 767px)': {
      filter: 'brightness(0.9)'
    }
  }
});

globalStyle(`.${gridTile}:hover`, {
  transform: 'scale(1.04)',
  filter: 'brightness(1.1)'
});

export const gridImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block'
});

export const gridLabel = style({
  position: 'absolute',
  left: '16px',
  bottom: '16px',
  color: colors.text.primary,
  fontWeight: 700,
  fontSize: '22px',
  opacity: 0,
  transform: 'translateY(10px)',
  transition: 'opacity 0.5s ease, transform 0.3s ease',
  '@media': {
    '(min-width: 768px) and (max-width: 1023px)': {
      left: '14px',
      bottom: '14px',
      fontSize: '20px',
      opacity: 1,
      transform: 'translateY(0)'
    },
    '(max-width: 767px)': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
});

globalStyle(`.${gridTile}:hover .${gridLabel}`, {
  opacity: 1,
  transform: 'translateY(0)'
});

export const aboutMe = style({
  gridColumn: '1 / 2',
  gridRow: '1 / 2',
  width: '100%',
  height: '100%',
  '@media': {
    '(max-width: 767px)': {
      height: 'auto',
      aspectRatio: '1 / 1'
    }
  }
});

export const concept = style({
  gridColumn: '2 / 3',
  gridRow: '1 / 2',
  width: '100%',
  height: '100%',
  '@media': {
    '(max-width: 767px)': {
      height: 'auto',
      aspectRatio: '1 / 1'
    }
  }
});

export const gridBottomRow = style({
  gridColumn: '1 / -1',
  gridRow: '2 / 3',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: 'var(--small) 1fr',
  columnGap: 'var(--gap)',
  alignItems: 'stretch',
  '@media': {
    '(max-width: 767px)': {
      display: 'flex',
      width: '100%',
      height: 'auto',
      flexDirection: 'column',
      gap: '16px'
    }
  }
});

export const gridLeftBottom = style({
  gridColumn: '1 / 2',
  gridRow: '2 / 3',
  width: 'var(--small)',
  height: '100%',
  justifySelf: 'start',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--gap)',
  '@media': {
    '(max-width: 767px)': {
      display: 'grid',
      width: '100%',
      height: 'auto',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '16px'
    }
  }
});

export const gridHalfTile = style({
  width: '100%',
  aspectRatio: '1 / 1'
});

export const works = style({
  gridColumn: '2 / 3',
  gridRow: '2 / 3',
  width: '100%',
  height: '100%',
  justifySelf: 'end',
  alignSelf: 'start',
  '@media': {
    '(max-width: 767px)': {
      height: 'auto',
      aspectRatio: '1 / 1'
    }
  }
});
