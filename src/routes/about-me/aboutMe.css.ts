import { style, keyframes, globalStyle } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';
import { media } from '$lib/styles/breakpoints';

export const aboutProfile = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '32px',
  '@media': {
    [media.pcs]: {
      gap: '28px'
    },
    [media.sp]: {
      flexDirection: 'column',
      gap: '32px'
    }
  }
});

export const aboutProfileDetails = style({
  flex: 1,
  lineHeight: 1.5,
  '@media': {
    [media.pcs]: {
      minWidth: 0
    },
    [media.tb]: {
      minWidth: 0
    },
    [media.sp]: {
      width: '100%'
    }
  }
});

export const profileData = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '20px',
  '@media': {
    [media.pcs]: {
      flexWrap: 'nowrap',
      gap: '14px'
    },
    [media.tb]: {
      flexWrap: 'nowrap',
      gap: '12px'
    },
    [media.sp]: {
      gap: '12px'
    }
  }
});

export const profileLabel = style({
  color: colors.brand[600],
  letterSpacing: '1px',
  fontWeight: 500,
  '@media': {
    [media.pcs]: {
      flexShrink: 0,
      fontSize: '16px',
      whiteSpace: 'nowrap'
    },
    [media.tb]: {
      flexShrink: 0,
      fontSize: '16px',
      whiteSpace: 'nowrap'
    }
  }
});

export const profileValue = style({
  fontSize: '28px',
  fontWeight: 700,
  margin: '5px',
  '@media': {
    [media.pcs]: {
      fontSize: 'clamp(22px, 2.2vw, 26px)',
      margin: '4px 0',
      whiteSpace: 'nowrap'
    },
    [media.tb]: {
      fontSize: 'clamp(20px, 2.5vw, 24px)',
      margin: '4px 0',
      whiteSpace: 'nowrap'
    },
    [media.sp]: {
      fontSize: '22px'
    }
  }
});

export const aboutProfileImg = style({
  flex: '0 0 60%',
  position: 'relative',
  '@media': {
    [media.pcs]: {
      flex: '0 0 56%'
    },
    [media.tb]: {
      flex: '0 0 56%'
    },
    [media.sp]: {
      width: '100%',
      flex: 'none'
    }
  }
});

export const iconList = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '20px',
  marginTop: '16px',
  '@media': {
    [media.pcs]: {
      marginTop: '72px'
    },
    [media.tb]: {
      marginTop: '120px'
    },
    [media.sp]: {
      justifyContent: 'flex-start'
    }
  }
});

export const profileImg = style({
  width: '100%',
  height: 'auto',
  borderRadius: '12px',
  aspectRatio: '4 / 3',
  objectFit: 'cover',

  maskImage: 'linear-gradient(to right, transparent 0%, black 15%)',
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%)',
  '@media': {
    [media.pcs]: {
      aspectRatio: '16 / 11'
    },
    [media.sp]: {
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%)'
    }
  }
});

export const aboutText = style({
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  padding: '24px',
  borderRadius: '16px',
  '@media': {
    [media.pcs]: {
      padding: '22px'
    }
  }
});

export const warningText = style({
  color: 'red',
  lineHeight: 1.2,
  fontWeight: 800,
  padding: '10px 0',
  fontSize: '24px',
  '@media': {
    [media.pcs]: {
      fontSize: '22px'
    }
  }
});

export const profileText = style({
  lineHeight: 1.6,
  padding: '10px 0'
});

globalStyle(`${profileText} a`, {
  color: colors.brand[600],
  fontWeight: 500,
  letterSpacing: '0.4px',
  textDecoration: 'none',
  transition: '0.3s'
});

globalStyle(`${profileText} a:hover`, {
  color: colors.brand[700],
  textDecoration: 'underline'
});

/* 松明用エフェクチE*/
const torchFlicker = keyframes({
  '0%': {
    opacity: 0.5,
    transform: 'scale(1)'
  },
  '50%': {
    opacity: 1,
    transform: 'scale(1.2)'
  },
  '100%': {
    opacity: 0.5,
    transform: 'scale(0.95)'
  }
});

export const torchGlow = style({
  position: 'absolute',
  top: '18%',
  left: '34%',
  zIndex: 2,

  width: '85px',
  height: '95px',

  borderRadius: '50%',
  pointerEvents: 'none',
  background:
    'radial-gradient(circle, rgba(255,180,80,0.6) 0%, rgba(255,140,40,0.35) 40%, rgba(255,120,20,0.1) 70%, transparent 80%)',
  filter: 'blur(12px)',
  animation: `${torchFlicker} 2s ease-in-out infinite`,
  '@media': {
    [media.pcs]: {
      top: '18%',
      left: '34%',
      width: '72px',
      height: '80px',
      filter: 'blur(11px)'
    },
    [media.tb]: {
      top: '18%',
      left: '34%',
      width: '64px',
      height: '72px',
      filter: 'blur(10px)'
    },
    [media.sp]: {
      top: '17%',
      left: '33%',
      width: '55px',
      height: '60px',
      filter: 'blur(9px)'
    }
  }
});

export const skillIconList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '18px',
  '@media': {
    [media.pcs]: {
      display: 'grid',
      width: 'fit-content',
      maxWidth: '100%',
      margin: '0 auto',
      gridTemplateColumns: 'repeat(6, max-content)',
      gap: '14px 12px',
      justifyContent: 'center',
      justifyItems: 'center'
    },
    [media.sp]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '12px',
      justifyItems: 'center'
    }
  }
});

globalStyle(`${skillIconList} i`, {
  '@media': {
    [media.pcs]: {
      fontSize: '128px !important',
      padding: '7px'
    },
    [media.sp]: {
      fontSize: 'clamp(78px, 22vw, 92px) !important',
      padding: '8px'
    }
  }
});
