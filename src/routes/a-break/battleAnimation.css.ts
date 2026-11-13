import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { container, ring } from '$lib/kevat/components/molecules/EnemyMove/EnemyMove.css';

const moveVibration = keyframes({
  '0%, 100%': { transform: 'translate(0, 0)' },
  '25%': { transform: 'translate(3px, -2px)' },
  '50%': { transform: 'translate(-3px, 2px)' },
  '75%': { transform: 'translate(2px, 3px)' }
});

const moveVibrationThenSettle = keyframes({
  '0%, 10%, 20%, 30%, 40%, 50%, 60%, 82%, 100%': { transform: 'translate(0, 0)' },
  '5%, 25%, 45%': { transform: 'translate(3px, -2px)' },
  '15%, 35%, 55%': { transform: 'translate(-3px, 2px)' },
  '65%': { transform: 'translate(1px, -0.5px)' },
  '70%': { transform: 'translate(-0.7px, 0.35px)' },
  '75%': { transform: 'translate(0.4px, -0.2px)' },
  '80%': { transform: 'translate(-0.15px, 0.08px)' }
});

const moveEnterLeft = keyframes({
  from: { opacity: 0, transform: 'translateX(-120px)' },
  to: { opacity: 1, transform: 'translateX(0)' }
});

const moveEnterRight = keyframes({
  from: { opacity: 0, transform: 'translateX(120px)' },
  to: { opacity: 1, transform: 'translateX(0)' }
});

export const previewMove = style({
  width: 'min(36cqw, 42dvh)',
  aspectRatio: '1',
  flexShrink: 0,
  animation: `${moveEnterLeft} 800ms ease-out both`,
  selectors: {
    '&:last-child': {
      marginLeft: '-70px',
      animation: `${moveEnterRight} 800ms ease-out both`
    }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

export const movePreviewWin = style({});
export const movePreviewWinSequence = style({});
export const movePreviewEnemyWin = style({});
export const movePreviewDraw = style({});
export const movePreviewDrawResolve = style({});
const moveFadeOut = keyframes({ to: { opacity: 0 } });
export const movePreviewFadeOut = style({
  animation: `${moveFadeOut} 1000ms ease-in-out forwards`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0 }
  }
});

const playerWinMove = keyframes({
  to: { transform: 'translateX(calc((min(36cqw, 42dvh) - 70px) / 2)) scale(1.3)' }
});

const enemyLoseMove = keyframes({
  to: { transform: 'translate(170px, -140px) scale(0.25)', opacity: 0 }
});

const enemyWinMove = keyframes({
  to: { transform: 'translateX(calc((70px - min(36cqw, 42dvh)) / 2)) scale(1.3)' }
});

const playerLoseMove = keyframes({
  to: { transform: 'translate(-170px, -140px) scale(0.25)', opacity: 0 }
});

const drawLeaveLeft = keyframes({
  to: { transform: 'translateX(-120px)', opacity: 0 }
});

const drawLeaveRight = keyframes({
  to: { transform: 'translateX(120px)', opacity: 0 }
});

const sparksFade = keyframes({ to: { opacity: 0 } });

globalStyle(`.${movePreviewWin} .${previewMove}:first-child`, {
  position: 'relative',
  zIndex: 1,
  animation: `${playerWinMove} 700ms ease-out forwards`
});

globalStyle(`.${movePreviewWin} .${previewMove}:last-child`, {
  position: 'relative',
  zIndex: 0,
  animation: `${enemyLoseMove} 700ms ease-in forwards`
});

globalStyle(`.${movePreviewWin}.${movePreviewEnemyWin} .${previewMove}:first-child`, {
  zIndex: 0,
  animation: `${playerLoseMove} 700ms ease-in forwards`
});

globalStyle(`.${movePreviewWin}.${movePreviewEnemyWin} .${previewMove}:last-child`, {
  zIndex: 1,
  animation: `${enemyWinMove} 700ms ease-out forwards`
});

globalStyle(`.${movePreviewDrawResolve} .${previewMove}:first-child`, {
  animation: `${drawLeaveLeft} 500ms ease-in forwards`
});

globalStyle(`.${movePreviewDrawResolve} .${previewMove}:last-child`, {
  animation: `${drawLeaveRight} 500ms ease-in forwards`
});

globalStyle(`.${previewMove} .${container}`, {
  animation: `${moveVibration} 320ms linear infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

globalStyle(`.${movePreviewWinSequence} .${previewMove} .${container}`, {
  animation: `${moveVibrationThenSettle} 3300ms linear forwards`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

const ringSpin = keyframes({ to: { transform: 'rotate(360deg)' } });

globalStyle(`.${previewMove}:first-child .${ring}`, {
  animation: `${ringSpin} 8s linear infinite`
});

globalStyle(`.${previewMove}:last-child .${ring}`, {
  animation: `${ringSpin} 8s linear infinite reverse`
});

const sparksAppear = keyframes({
  from: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' },
  to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
});

export const previewSparks = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  zIndex: 2,
  width: 'min(36cqw, 100dvh)',
  aspectRatio: '1',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  animation: `${sparksAppear} 200ms ease-out 300ms both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' }
  }
});

globalStyle(`.${movePreviewWin} .${previewSparks}`, {
  animation: `${sparksFade} 250ms ease-out forwards`
});

globalStyle(`.${movePreviewDrawResolve} .${previewSparks}`, {
  animation: `${sparksFade} 250ms ease-out forwards`
});
