import { STAGE_IDS } from '../constants/stages';
import type { StageId } from '../types/stage.types';

export const PROGRESS_STORAGE_KEY = 'ketria.clearedStages';

export const parseClearedStages = (value: string | null): StageId[] => {
  try {
    const parsed: unknown = JSON.parse(value ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return STAGE_IDS.filter((stage) => parsed.includes(stage));
  } catch {
    return [];
  }
};

export const getAvailableStages = (clearedStages: readonly StageId[]): readonly StageId[] =>
  (['01', '02', '03'] as const).every((stage) => clearedStages.includes(stage))
    ? STAGE_IDS
    : STAGE_IDS.slice(0, 3);
