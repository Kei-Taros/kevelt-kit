import { expect, test, type Page } from '@playwright/test';
import { SESSION_STORAGE_KEY } from '../../src/lib/ketria/game/battleSession';
import { PROGRESS_STORAGE_KEY } from '../../src/lib/ketria/game/stageProgress';
import type { BattleSession } from '../../src/lib/ketria/types/battleSession.types';
import type { StageId } from '../../src/lib/ketria/types/stage.types';

const turnTimeout = 10000;

const battleLog = (page: Page) =>
  page.getByRole('complementary', { name: 'Battle Log' }).getByRole('listitem');

const chooseMove = (page: Page, move: 'FIRE' | 'STONE') =>
  page
    .getByRole('group', { name: 'Element selection' })
    .getByRole('button', { name: move, exact: true })
    .click();

const restoreBattleNearVictory = async (
  page: Page,
  stage: '01' | '04',
  clearedStages: readonly StageId[]
) => {
  const session: BattleSession = {
    version: 1,
    screen: 'battle',
    selectedStage: stage,
    battle: {
      stage,
      player: { hp: 200, levels: { fire: 1, mist: 1, stone: 1 } },
      enemy: { hp: 10, levels: { fire: 1, mist: 1, stone: 1 } },
      nextEnemyMove: 'fire',
      battleLogs: [],
      messageLines: [],
      consecutiveDraws: 0,
      messageSelection: { usedHpMessages: [], nextIndex: [] }
    }
  };

  await page.getByRole('button', { name: 'START', exact: true }).waitFor();
  await page.evaluate(
    ({ sessionKey, progressKey, session, clearedStages }) => {
      sessionStorage.setItem(sessionKey, JSON.stringify(session));
      localStorage.setItem(progressKey, JSON.stringify(clearedStages));
    },
    { sessionKey: SESSION_STORAGE_KEY, progressKey: PROGRESS_STORAGE_KEY, session, clearedStages }
  );
  await page.reload();
};

test.describe('A Break  page', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/a-break');
  });

  test('初回にSTARTを押してSTONEを出した場合、STAGE 01の敵HPが150から140に減り勝利のログを表示する', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'START', exact: true }).click();

    await expect(page.getByText('150 / 150', { exact: true })).toBeVisible();
    await expect(battleLog(page)).toHaveCount(0);

    await chooseMove(page, 'STONE');

    await expect(page.getByText('140 / 150', { exact: true })).toBeVisible({
      timeout: turnTimeout
    });
    const rows = battleLog(page);
    await expect(rows).toHaveCount(1);
    await expect(rows.getByRole('img', { name: 'STONE vs FIRE' })).toBeVisible();
    await expect(rows.getByText('WIN', { exact: true })).toBeVisible();
  });

  test('STAGE 01に勝利してNEXT STAGEを押した場合、STAGE 02へ進み再読み込み後も対戦を続けられる', async ({
    page
  }) => {
    await restoreBattleNearVictory(page, '01', []);
    await chooseMove(page, 'STONE');
    await page.getByRole('button', { name: 'NEXT STAGE', exact: true }).click();

    const stageEnemy = page.getByRole('img', { name: 'Mist-warden', exact: true });
    await expect(stageEnemy).toBeVisible({ timeout: 10000 });
    await chooseMove(page, 'FIRE');
    await expect(battleLog(page)).toHaveCount(1, { timeout: turnTimeout });
    await expect(page.getByText('190 / 200', { exact: true })).toBeVisible({
      timeout: turnTimeout
    });

    await page.reload();

    await expect(stageEnemy).toBeVisible();
    await expect(page.getByText('190 / 200', { exact: true })).toBeVisible();
    await expect(battleLog(page)).toHaveCount(1);
    await chooseMove(page, 'FIRE');
    await expect(battleLog(page)).toHaveCount(2, { timeout: turnTimeout });
  });

  test('STAGE 04に勝利してENDを押した場合、エンディングを表示しTITLEでタイトル画面へ戻る', async ({
    page
  }) => {
    await restoreBattleNearVictory(page, '04', ['01', '02', '03']);
    await chooseMove(page, 'STONE');
    await page.getByRole('button', { name: 'END', exact: true }).click();

    await expect(page.getByText('Thank you for playing!', { exact: true })).toBeVisible({
      timeout: 10000
    });
    await page.getByRole('button', { name: 'TITLE', exact: true }).click();

    await expect(page.getByRole('button', { name: 'START', exact: true })).toBeVisible();
  });
});
