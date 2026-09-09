import { createVar, keyframes, style } from '@vanilla-extract/css';
import { media } from '$lib/styles/breakpoints';
import { colors } from '$lib/styles/theme/colors.css';

const cellSize = createVar();
const travel = createVar();
const flowX = createVar();
const flowY = createVar();

const drift = keyframes({
  from: { transform: 'translate3d(0, 0, 0)' },
  to: { transform: `translate3d(${cellSize}, ${cellSize}, 0)` }
});

const highlightDrift = keyframes({
  '0%': { transform: 'translate3d(0, 0, 0)', opacity: 0 },
  '12%, 82%': { opacity: 1 },
  '100%': { transform: `translate3d(${travel}, ${travel}, 0)`, opacity: 0 }
});

const flow = keyframes({
  '0%': {
    transform: `translate3d(calc(-1 * ${flowX}), calc(-1 * ${flowY}), 0)`,
    opacity: 0
  },
  '18%, 72%': { opacity: 1 },
  '100%': {
    transform: `translate3d(${flowX}, ${flowY}, 0)`,
    opacity: 0
  }
});

export const background = style({
  vars: { [cellSize]: '64px' },
  position: 'fixed',
  inset: 0,
  zIndex: -1,
  overflow: 'hidden',
  pointerEvents: 'none',
  backgroundColor: colors.background.primary,
  backgroundImage: 'radial-gradient(ellipse at 85% 20%, rgba(255, 128, 0, 0.05), transparent 65%)',
  '@media': {
    [media.sp]: {
      vars: { [cellSize]: '48px' }
    }
  }
});

export const grid = style({
  position: 'absolute',
  inset: `calc(-1 * ${cellSize})`,
  backgroundImage: [
    'linear-gradient(to right, rgba(218, 181, 140, 0.07) 1px, transparent 1px)',
    'linear-gradient(to bottom, rgba(218, 181, 140, 0.07) 1px, transparent 1px)'
  ].join(', '),
  backgroundSize: `${cellSize} ${cellSize}`,
  animation: `${drift} 16s linear infinite`,
  willChange: 'transform',
  '@media': {
    [media.sp]: {
      animationDuration: '20s',
      opacity: 0.75
    },
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      transform: 'none',
      willChange: 'auto'
    }
  }
});

const highlight = style({
  position: 'absolute',
  opacity: 0,
  animation: `${highlightDrift} linear infinite`,
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 0,
      animation: `${flow} linear infinite`,
      '@media': {
        '(prefers-reduced-motion: reduce)': {
          animation: 'none',
          transform: 'none',
          opacity: 0.65
        }
      }
    }
  },
  '@media': {
    [media.sp]: { display: 'none' },
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      transform: 'none',
      opacity: 0.75
    }
  }
});

const placements = [
  {
    x: 1,
    y: 1,
    mobileX: 0,
    mobileY: 1,
    length: 1.3,
    vertical: false,
    cells: 3,
    phase: 1
  },
  {
    x: 5,
    y: 2,
    mobileX: 3,
    mobileY: 0,
    length: 0.8,
    vertical: true,
    cells: 4,
    phase: 2
  },
  {
    x: 9,
    y: 0,
    mobileX: 2,
    mobileY: 4,
    length: 1.9,
    vertical: false,
    cells: 2,
    phase: 1
  },
  {
    x: 14,
    y: 4,
    mobileX: 0,
    mobileY: 8,
    length: 1.1,
    vertical: true,
    cells: 5,
    phase: 1
  },
  {
    x: 19,
    y: 1,
    mobileX: 4,
    mobileY: 6,
    length: 2.2,
    vertical: false,
    cells: 3,
    phase: 2
  },
  {
    x: 2,
    y: 6,
    mobileX: 1,
    mobileY: 11,
    length: 0.7,
    vertical: true,
    cells: 4,
    phase: 1
  },
  {
    x: 7,
    y: 8,
    mobileX: 3,
    mobileY: 13,
    length: 1.6,
    vertical: false,
    cells: 5,
    phase: 3
  },
  {
    x: 12,
    y: 6,
    mobileX: 0,
    mobileY: 15,
    length: 1.4,
    vertical: true,
    cells: 3,
    phase: 1
  },
  { x: 17, y: 10, length: 0.9, vertical: false, cells: 4, phase: 3 },
  { x: 0, y: 12, length: 1.8, vertical: false, cells: 2, phase: 1 },
  { x: 22, y: 7, length: 1.2, vertical: true, cells: 5, phase: 2 },
  { x: 10, y: 13, length: 2.1, vertical: true, cells: 3, phase: 2 }
];

export const highlights = placements.map((line, index) =>
  style([
    highlight,
    {
      vars: {
        [travel]: `calc(${cellSize} * ${line.cells})`,
        [flowX]: line.vertical ? '0px' : `calc(${cellSize} * 2)`,
        [flowY]: line.vertical ? `calc(${cellSize} * 2)` : '0px'
      },
      left: `calc(${cellSize} * ${line.x} - ${line.vertical ? 3 : 0}px)`,
      top: `calc(${cellSize} * ${line.y} - ${line.vertical ? 0 : 3}px)`,
      width: line.vertical ? '7px' : `calc(${cellSize} * ${line.length})`,
      height: line.vertical ? `calc(${cellSize} * ${line.length})` : '7px',
      animationDuration: `${line.cells * 16}s`,
      animationDelay: `${-line.phase * 16}s`,
      selectors: {
        '&::after': {
          backgroundImage: [
            `radial-gradient(ellipse ${line.vertical ? '0.7px 50%' : '50% 0.7px'} at center, rgba(255, 149, 0, 0.5), rgba(255, 128, 0, 0.22) 45%, transparent 100%)`,
            'radial-gradient(ellipse at center, rgba(255, 128, 0, 0.12), transparent 100%)'
          ].join(', '),
          animationDuration: '10s',
          animationDelay: `${-(index * 2.7 + 1.3)}s`,
          animationDirection: index % 4 < 2 ? 'normal' : 'reverse'
        }
      },
      '@media': {
        [media.sp]: {
          ...(line.mobileX !== undefined && line.mobileY !== undefined
            ? {
                display: 'block',
                left: `calc(${cellSize} * ${line.mobileX} - ${line.vertical ? 3 : 0}px)`,
                top: `calc(${cellSize} * ${line.mobileY} - ${line.vertical ? 0 : 3}px)`
              }
            : {}),
          animationDuration: `${line.cells * 20}s`,
          animationDelay: `${-line.phase * 20}s`
        },
        '(prefers-reduced-motion: reduce)': { animationDuration: '0s', animationDelay: '0s' }
      }
    }
  ])
);
