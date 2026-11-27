import {
  button as menuOption,
  primary,
  touchPressFeedback
} from '$lib/ketria/components/molecules/MenuOption/MenuOption.css';
import { menuBack, menuBackTouchFeedback } from '$lib/ketria/styles/menuBack.css';
import { media } from '$lib/styles/breakpoints';
import { globalStyle, style } from '@vanilla-extract/css';

export const titleBrand = style({
  position: 'absolute',
  zIndex: 2,
  top: '15.5%',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 'min(68vw, 64dvh)',
  gap: 'clamp(18px, 2.5dvh, 30px)'
});

export const titleSymbol = style({
  width: 'min(38vw, 34dvh)',
  aspectRatio: '878 / 764',
  overflow: 'hidden'
});

export const titleSymbolImage = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  filter: 'drop-shadow(0 4px 6px #0007) drop-shadow(0 0 10px #b4ddff18)'
});

export const titleHeading = style({
  width: '100%',
  margin: 0,
  lineHeight: 0
});

export const titleWordmark = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  filter: 'brightness(0) invert(1) drop-shadow(0 3px 5px #0008) drop-shadow(0 0 8px #dcefff20)',
  opacity: 0.97
});

const titleMenuLayout = style({
  position: 'absolute',
  zIndex: 2,
  top: '65%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(76vw, 64dvh)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'clamp(8px, 1.1dvh, 14px)'
});

export const titleMenu = style([titleMenuLayout, touchPressFeedback]);

globalStyle(`.${titleMenuLayout} .${menuOption}:not(.${primary})`, {
  '@media': {
    [media.sp]: {
      whiteSpace: 'nowrap',
      gap: '12px',
      fontSize: 'clamp(15px, 2.8dvh, 20px)',
      letterSpacing: '0.25em',
      paddingLeft: '0.25em'
    }
  }
});

export const titleScreen = style({
  position: 'absolute',
  inset: 0,
  zIndex: 2
});

export const titleEnd = style([
  menuBack,
  menuBackTouchFeedback,
  {
    marginTop: '2dvh',
    display: 'block',
    textDecoration: 'none'
  }
]);
