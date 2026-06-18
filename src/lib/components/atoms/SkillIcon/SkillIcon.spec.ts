import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, test, expect, afterEach, vi } from 'vitest';
import SkillIcon from './SkillIcon.svelte';
import * as styles from './SkillIcon.css';

describe('SkillIcon', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('nameが渡された場合、aria-labelにnameが設定される', () => {
    render(SkillIcon, { props: { name: 'typescript' } });

    expect(screen.getByRole('img', { name: 'typescript' })).toBeInTheDocument();
  });

  test('nameが渡された場合、titleにnameが設定されてdefaultIconのクラスが適用される', () => {
    render(SkillIcon, { props: { name: 'react' } });

    expect(screen.getByRole('img', { name: 'react' })).toHaveAttribute('title', 'react');
    expect(screen.getByRole('img', { name: 'react' })).toHaveClass(styles.defaultIcon);
  });

  test.each([
    {
      title: 'variantを指定しない場合、plainのクラスが適用される',
      props: { name: 'typescript' },
      expectedClass: 'devicon-typescript-plain'
    },
    {
      title: 'variantがplainの場合、plainのクラスが適用される',
      props: { name: 'react', variant: 'plain' as const },
      expectedClass: 'devicon-react-plain'
    },
    {
      title: 'variantがoriginalの場合、originalのクラスが適用される',
      props: { name: 'nestjs', variant: 'original' as const },
      expectedClass: 'devicon-nestjs-original'
    }
  ])('$title', ({ props, expectedClass }) => {
    render(SkillIcon, { props });

    const icon = screen.getByRole('img', { name: props.name });
    expect(icon).toHaveClass(expectedClass);
  });

  test('coloredを指定しない場合、coloredのクラスが適用される', () => {
    render(SkillIcon, { props: { name: 'docker' } });

    expect(screen.getByRole('img', { name: 'docker' })).toHaveClass('colored');
  });

  test('coloredがtrueの場合、coloredのクラスが適用される', () => {
    render(SkillIcon, { props: { name: 'svelte', colored: true } });

    expect(screen.getByRole('img', { name: 'svelte' })).toHaveClass('colored');
  });

  test('coloredがfalseの場合、coloredのクラスが適用されない', () => {
    render(SkillIcon, { props: { name: 'github', colored: false } });

    expect(screen.getByRole('img', { name: 'github' })).not.toHaveClass('colored');
  });

  test('タッチ端末で連続タップした場合、光演出が再開始される', async () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: query.includes('hover: none') || query.includes('pointer: coarse'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn()
        }) as MediaQueryList
    );
    const offsetWidthSpy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1);

    render(SkillIcon, { props: { name: 'typescript' } });

    const icon = screen.getByRole('img', { name: 'typescript' });

    for (let i = 0; i < 5; i += 1) {
      await fireEvent.pointerDown(icon);
    }

    expect(offsetWidthSpy).toHaveBeenCalledTimes(5);
    expect(icon).toHaveClass(styles.touchShine);

    vi.advanceTimersByTime(650);

    expect(icon).not.toHaveClass(styles.touchShine);
  });

  test('タッチ端末で別のアイコンをタップした場合、新しくタップしたアイコンだけに光演出が表示される', async () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: query.includes('hover: none') || query.includes('pointer: coarse'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn()
        }) as MediaQueryList
    );
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1);

    render(SkillIcon, { props: { name: 'typescript' } });
    render(SkillIcon, { props: { name: 'react' } });

    const typescript = screen.getByRole('img', { name: 'typescript' });
    const react = screen.getByRole('img', { name: 'react' });

    await fireEvent.pointerDown(typescript);

    expect(typescript).toHaveClass(styles.touchShine);
    expect(react).not.toHaveClass(styles.touchShine);

    await fireEvent.pointerDown(react);

    expect(typescript).not.toHaveClass(styles.touchShine);
    expect(react).toHaveClass(styles.touchShine);
  });
});
