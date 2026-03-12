import { style } from '@vanilla-extract/css';

export const h1 = style({
  position: 'relative',
  display: 'inline-block',
  lineHeight: 1.4,
  paddingBottom: '2px',
  fontSize: '42px',

  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '150%',
      height: '13px',
      background: '#ff9500',
      zIndex: -1
    }
  }
});

export const h2 = style({
  display: 'inline-block',
  padding: '0.3em 1.0em',
  borderTop: '3px solid #ff9500',
  borderBottom: '3px solid #ff9500',
  fontSize: '28px'
});

export const h3 = style({
  position: 'relative',
  padding: '0.2em 1.0em 0.2em 1.4em',
  background: 'transparent',
  borderLeft: 'solid 3px #ff9500',
  fontSize: '22px',

  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      left: '3px',
      top: 0,
      height: '100%',
      width: '3px',
      background: '#ff9500'
    },

    '&::after': {
      content: '',
      position: 'absolute',
      left: '9px',
      top: 0,
      height: '100%',
      width: '3px',
      background: '#ff9500'
    }
  }
});
