import { style } from '@vanilla-extract/css';
import { media } from '$lib/styles/breakpoints';

export const embla = style({
  width: '100%',
  overflow: 'hidden'
});

export const viewport = style({
  overflow: 'hidden',
  width: '100%'
});

export const container = style({
  display: 'flex',
  marginLeft: '-24px',
  touchAction: 'pan-y pinch-zoom',
  '@media': {
    [media.pcs]: {
      marginLeft: '-18px'
    },
    '(min-width: 768px) and (max-width: 1023px)': {
      marginLeft: '-18px'
    },
    '(max-width: 767px)': {
      marginLeft: '-14px'
    }
  }
});

export const slide = style({
  flex: '0 0 calc(100% / 3)',
  minWidth: 0,
  paddingLeft: '24px',
  '@media': {
    [media.pcs]: {
      flexBasis: 'calc(100% / 3)',
      paddingLeft: '18px'
    },
    '(min-width: 768px) and (max-width: 1023px)': {
      flexBasis: '50%',
      paddingLeft: '18px'
    },
    '(max-width: 767px)': {
      flexBasis: '82%',
      paddingLeft: '14px'
    }
  }
});

export const image = style({
  display: 'block',
  width: '100%',
  aspectRatio: '1/1',
  objectFit: 'cover',
  borderRadius: '20px',
  '@media': {
    [media.pcs]: {
      aspectRatio: '4 / 3',
      borderRadius: '18px'
    },
    '(min-width: 768px) and (max-width: 1023px)': {
      borderRadius: '16px'
    },
    '(max-width: 767px)': {
      borderRadius: '14px'
    }
  }
});
