import type { StageId } from '../types/stage.types';

export const STAGE_IDS = ['01', '02', '03', '04'] as const;

export const ENEMY_MAX_HP: Record<StageId, number> = {
  '01': 150,
  '02': 200,
  '03': 300,
  '04': 500
};
