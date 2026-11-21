import type { StageId } from '../types/stage.types';

export const STAGE_IDS = ['01', '02', '03', '04'] as const;
export const STAGE_04_ULTIMATE_HP = 150;
export const ULTIMATE_TRANSITION = { fadeIn: 1000, hold: 500, fadeOut: 500 } as const;
export const STAGE_04_LOW_HP = 50;

export const ENEMY_MAX_HP: Record<StageId, number> = {
  '01': 150,
  '02': 200,
  '03': 250,
  '04': 300
};
