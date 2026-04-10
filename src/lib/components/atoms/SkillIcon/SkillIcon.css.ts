import { style } from '@vanilla-extract/css';

export const defaultIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  padding: '10px',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.2)',
  boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1)',
  filter: 'brightness(1.1) saturate(2)',
  transition: 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease',
  position: 'relative',
  overflow: 'hidden',

  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      top: 0,
      left: '-75%',
      width: '50%',
      height: '100%',
      background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent)',
      transform: 'skewX(-20deg)'
    },

    '&:hover': {
      transform: 'translateY(-2px) scale(1.1)',
      background: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6)',
      filter: 'brightness(1.15) saturate(3)'
    },

    '&:hover::after': {
      left: '125%',
      transition: 'left 0.6s ease'
    }
  }
});
