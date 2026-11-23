import { afterEach, describe, expect, test, vi } from 'vitest';
import { loadScreenAssets } from './loadScreenAssets';

describe('loadScreenAssets', () => {
  afterEach(() => vi.unstubAllGlobals());

  test('画像のデコードが未完了の場合、すべての画像が完了するまで待つ', async () => {
    const root = document.createElement('div');
    const first = document.createElement('img');
    const second = document.createElement('img');
    root.append(first, second);
    let finishFirst!: () => void;
    let finishSecond!: () => void;
    Object.defineProperty(first, 'decode', {
      value: () =>
        new Promise<void>((resolve) => {
          finishFirst = resolve;
        })
    });
    Object.defineProperty(second, 'decode', {
      value: () =>
        new Promise<void>((resolve) => {
          finishSecond = resolve;
        })
    });
    const finished = vi.fn();
    const loading = loadScreenAssets(root, false).then(finished);
    finishFirst();
    await Promise.resolve();
    expect(finished).not.toHaveBeenCalled();
    finishSecond();
    await loading;
    expect(finished).toHaveBeenCalledOnce();
  });

  test('画像の読み込みに失敗した場合、黒画面のまま停止せず処理を完了する', async () => {
    const root = document.createElement('div');
    const image = document.createElement('img');
    Object.defineProperty(image, 'decode', { value: () => Promise.reject(new Error('Failed')) });
    root.append(image);
    await expect(loadScreenAssets(root, false)).resolves.toBeUndefined();
  });

  test('対戦画面を読み込む場合、リングと特殊効果と火花も先に読み込む', async () => {
    const sources: string[] = [];
    vi.stubGlobal(
      'Image',
      class {
        src = '';
        decode() {
          sources.push(this.src);
          return Promise.resolve();
        }
      }
    );
    await loadScreenAssets(document.createElement('div'), true);
    expect(sources).toEqual(
      expect.arrayContaining([
        '/images/ketria/element-ring/fire-ring.webp',
        '/images/ketria/element-ring/stone-ring.webp',
        '/images/ketria/element-ring/mist-ring.webp',
        '/images/ketria/effects/mist-effect.webp',
        '/images/ketria/effects/stone-effect.webp',
        '/images/ketria/effects/sparks.svg'
      ])
    );
  });

  test('先読みするWebPが使えない場合、PNGを読み込む', async () => {
    const sources: string[] = [];
    vi.stubGlobal(
      'Image',
      class {
        src = '';
        decode() {
          sources.push(this.src);
          return this.src.endsWith('.webp')
            ? Promise.reject(new Error('Unsupported'))
            : Promise.resolve();
        }
      }
    );
    await loadScreenAssets(document.createElement('div'), true, true);
    expect(sources).toContain('/images/ketria/enemy/enemy-05.webp');
    expect(sources).toContain('/images/ketria/enemy/enemy-05.png');
    expect(sources).toContain('/images/ketria/backgrounds/background-05.webp');
    expect(sources).toContain('/images/ketria/backgrounds/background-05.png');
    expect(sources).toContain('/images/ketria/effects/mist-effect.png');
    expect(sources).toContain('/images/ketria/element-ring/fire-ring.png');
  });
});
