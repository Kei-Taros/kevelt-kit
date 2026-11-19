import { describe, expect, test } from 'vitest';
import { getAvailableStages, getDisabledStages, parseClearedStages } from './stageProgress';

describe('stageProgress', () => {
  test.each([
    { cleared: [], disabled: ['02', '03'] },
    { cleared: ['01'], disabled: ['03'] },
    { cleared: ['01', '02'], disabled: [] },
    { cleared: ['01', '02', '03'], disabled: [] }
  ] as const)(
    'クリア状況が$clearedの場合、未解放の$disabledを無効にする',
    ({ cleared, disabled }) => {
      expect(getDisabledStages(cleared)).toEqual(disabled);
    }
  );

  test.each([null, '', '{', '{}', 'null'])(
    '保存値が%sの場合、クリア済みステージは空になる',
    (value) => {
      expect(parseClearedStages(value)).toEqual([]);
    }
  );
  test('保存値に重複や不正な番号がある場合、有効なステージだけを復元する', () => {
    expect(parseClearedStages('["01","01","02","05",1]')).toEqual(['01', '02']);
  });
  test('01〜03のいずれかが未クリアの場合、04を表示しない', () => {
    expect(getAvailableStages(['01', '03'])).toEqual(['01', '02', '03']);
  });
  test('01〜03をすべてクリアした場合、04を表示する', () => {
    expect(getAvailableStages(['03', '01', '02'])).toEqual(['01', '02', '03', '04']);
  });
});
