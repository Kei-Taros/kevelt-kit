import { menuBack } from '$lib/ketria/styles/menuBack.css';
import { style } from '@vanilla-extract/css';

export const stageSelect = style({
  position: 'absolute',
  inset: 0,
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '13dvh'
});

export const stageWordmark = style({
  display: 'block',
  width: 'min(42vw, 30dvh)',
  filter: 'brightness(0) invert(1) drop-shadow(0 3px 5px #0008)',
  opacity: 0.9
});

export const stageHeading = style({
  margin: '5dvh 0 4dvh',
  paddingLeft: '0.3em',
  fontFamily: 'Arial, sans-serif',
  fontSize: 'clamp(19px, 3dvh, 32px)',
  fontWeight: 400,
  letterSpacing: '0.3em',
  color: '#f6f7fa',
  textShadow: '0 2px 12px #000'
});

export const stageList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(10px, 1.8dvh, 20px)',
  width: 'min(82vw, 64dvh)'
});

export const stageBack = style([menuBack, { marginTop: '5dvh' }]);
