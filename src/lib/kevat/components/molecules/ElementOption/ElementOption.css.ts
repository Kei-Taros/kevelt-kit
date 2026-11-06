import { style, styleVariants } from '@vanilla-extract/css';

export const option = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

export const button = style({
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  width: 'min(15.6cqw, 27dvh)',
  aspectRatio: '1',
  padding: 0,
  overflow: 'hidden',
  border: '2px solid #e6f5ff',
  borderRadius: '50%',
  background: 'radial-gradient(circle, #0a1119b3 30%, #03070bef 75%)',
  boxShadow: '0 0 12px #bce3ff80, inset 0 0 12px #bce3ff40',
  selectors: {
    '&:focus-visible': {
      outline: '3px solid white',
      outlineOffset: 7
    }
  }
});

export const elementVariants = styleVariants({
  fire: {
    borderColor: '#fff0d6',
    boxShadow: '0 0 5px #fff0d6, 0 0 20px #ff7b20, inset 0 0 16px #ff7b2066'
  },
  stone: {
    borderColor: '#d4b5ff',
    boxShadow: '0 0 5px #d4b5ffb3, 0 0 18px #9966ee99, inset 0 0 14px #9966ee4d'
  },
  mist: {
    borderColor: '#b5eeff',
    boxShadow: '0 0 5px #b5eeffb3, 0 0 20px #65cfff99, inset 0 0 16px #65cfff4d'
  }
});

export const icon = style({
  display: 'block',
  width: '94%',
  height: '94%'
});

export const fireIcon = style({
  height: '100%'
});

export const level = style({
  position: 'absolute',
  right: -8,
  bottom: -8,
  zIndex: 1
});
