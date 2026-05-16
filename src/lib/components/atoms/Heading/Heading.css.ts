import { style } from '@vanilla-extract/css';
import { colors } from '$lib/styles/theme/colors.css';

export const h1 = style({
  position: 'relative',
  zIndex: 0,
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
      width: '160%',
      height: '13px',
      zIndex: -1,

      background: `linear-gradient(
        90deg,
        ${colors.brand[600]} 0%,
        ${colors.brand[600]} 20%,
        transparent 100%
      )`
    }
  }
});

export const h2 = style({
  position: 'relative',
  display: 'inline-block',
  padding: '12px',
  fontSize: '28px',
  textAlign: 'center',

  selectors: {
    '&::before, &::after': {
      content: '',
      position: 'absolute',
      left: 0,
      width: '100%',
      height: '3px',
      background: `linear-gradient(
        90deg,
        transparent,
        ${colors.brand[600]} 30%,
        ${colors.brand[600]} 70%,
        transparent
      )`
    },

    '&::before': {
      top: 0
    },

    '&::after': {
      bottom: 0
    }
  }
});

export const h2News = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '38px',

  padding: 0,
  fontSize: '28px',
  textAlign: 'center',

  selectors: {
    '&::before': {
      content: '""',
      position: 'static',
      width: '200px',
      height: '3px',
      flexShrink: 0,

      background: `linear-gradient(
        90deg,
        transparent,
        ${colors.brand[600]} 40%,
        ${colors.brand[600]} 0%
      )`
    },

    '&::after': {
      content: '""',
      position: 'static',
      width: '200px',
      height: '3px',
      flexShrink: 0,

      background: `linear-gradient(
        90deg,
        ${colors.brand[600]} 0%,
        ${colors.brand[600]} 40%,
        transparent
      )`
    }
  }
});

export const h2NewsSlug = style({
  color: colors.text.primary,
  fontSize: '26px',
  padding: '20px 30px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  textAlign: 'center',

  selectors: {
    '&::before, &::after': {
      content: "''",
      width: '12px',
      height: 'calc(100% - 6px)',
      position: 'absolute',
      top: 0
    },

    '&::before': {
      borderLeft: `2px solid ${colors.brand[600]}`,
      borderTop: `2px solid ${colors.brand[600]}`,
      borderBottom: `2px solid ${colors.brand[600]}`,
      left: 0
    },

    '&::after': {
      borderRight: `2px solid ${colors.brand[600]}`,
      borderTop: `2px solid ${colors.brand[600]}`,
      borderBottom: `2px solid ${colors.brand[600]}`,
      right: 0
    }
  }
});

export const h2PrivacyPolicy = style({
  paddingBottom: '8px',
  fontSize: '22px',
  color: colors.text.primary,
  borderBottom: `1px solid ${colors.brand[600]}`
});

export const date = style({
  color: colors.text.muted,
  fontSize: '16px',
  opacity: 0.8,
  marginTop: '6px'
});

export const h3 = style({
  position: 'relative',
  padding: '0.2em 1.0em 0.2em 1.4em',
  background: 'transparent',
  borderLeft: `3px solid ${colors.brand[600]}`,
  fontSize: '22px',

  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      left: '3px',
      top: 0,
      height: '100%',
      width: '3px',
      background: colors.brand[600]
    },

    '&::after': {
      content: '',
      position: 'absolute',
      left: '9px',
      top: 0,
      height: '100%',
      width: '3px',
      background: colors.brand[600]
    }
  }
});

export const number = style({
  color: colors.brand[500],
  letterSpacing: '0.05em',
  marginRight: '14px'
});

export const h4 = style({
  margin: 0,
  position: 'relative',
  display: 'inline-block',
  paddingBottom: '6px',
  fontSize: '20px',

  selectors: {
    '&::after': {
      content: "''",
      position: 'absolute',
      left: 0,
      bottom: 0,

      width: '140px',
      height: '7px',

      background: `repeating-linear-gradient(
        -45deg,
        ${colors.brand[600]},
        ${colors.brand[600]} 4px,
        transparent 4px,
        transparent 8px
      )`
    }
  }
});
