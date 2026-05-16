import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Icon from './Icon.svelte';
import * as styles from './Icon.css';

describe('Icon', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn()
      }
    });
  });

  test('nameが渡された場合、aria-labelにnameが設定される', () => {
    render(Icon, { props: { name: 'typescript', iconType: 'devicon' } });

    expect(screen.getByRole('img', { name: 'typescript' })).toBeInTheDocument();
  });

  test('nameが渡された場合、titleにnameが設定されてdefaultIconのクラスが適用される', () => {
    render(Icon, { props: { name: 'react', iconType: 'devicon' } });

    const icon = screen.getByRole('img', { name: 'react' });

    expect(icon).toHaveAttribute('title', 'react');
    expect(icon).toHaveClass(styles.defaultIcon);
  });

  test.each([
    {
      title: 'variantを指定しない場合、plainのクラスが適用される',
      props: { name: 'typescript', iconType: 'devicon' as const },
      expectedClass: 'devicon-typescript-plain'
    },
    {
      title: 'variantがplainの場合、plainのクラスが適用される',
      props: { name: 'react', iconType: 'devicon' as const, variant: 'plain' as const },
      expectedClass: 'devicon-react-plain'
    },
    {
      title: 'variantがoriginalの場合、originalのクラスが適用される',
      props: { name: 'nestjs', iconType: 'devicon' as const, variant: 'original' as const },
      expectedClass: 'devicon-nestjs-original'
    }
  ])('$title', ({ props, expectedClass }) => {
    render(Icon, { props });

    expect(screen.getByRole('img', { name: props.name })).toHaveClass(expectedClass);
  });

  test('coloredを指定しない場合、coloredのクラスが適用される', () => {
    render(Icon, { props: { name: 'docker', iconType: 'devicon' } });

    expect(screen.getByRole('img', { name: 'docker' })).toHaveClass('colored');
  });

  test('coloredがtrueの場合、coloredのクラスが適用される', () => {
    render(Icon, { props: { name: 'svelte', iconType: 'devicon', colored: true } });

    expect(screen.getByRole('img', { name: 'svelte' })).toHaveClass('colored');
  });

  test('coloredがfalseの場合、coloredのクラスが適用されない', () => {
    render(Icon, { props: { name: 'github', iconType: 'devicon', colored: false } });

    expect(screen.getByRole('img', { name: 'github' })).not.toHaveClass('colored');
  });

  test('iconTypeがfontawesomeの場合、Font Awesomeのクラスが適用される', () => {
    render(Icon, {
      props: {
        name: 'envelope',
        iconType: 'fontawesome'
      }
    });

    const icon = screen.getByRole('img', { name: 'envelope' });

    expect(icon).toHaveClass('fa-regular');
    expect(icon).toHaveClass('fa-envelope');
    expect(icon).not.toHaveClass('colored');
  });

  test('faVariantがsolidの場合、fa-solidのクラスが適用される', () => {
    render(Icon, {
      props: {
        name: 'envelope',
        iconType: 'fontawesome',
        faVariant: 'solid'
      }
    });

    expect(screen.getByRole('img', { name: 'envelope' })).toHaveClass('fa-solid');
  });

  test('hrefが渡された場合、外部リンクとして表示される', () => {
    render(Icon, {
      props: {
        name: 'github',
        iconType: 'devicon',
        href: 'https://github.com/Kei-Taros'
      }
    });

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', 'https://github.com/Kei-Taros');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('copyTextが渡された場合、クリックでテキストがコピーされる', async () => {
    render(Icon, {
      props: {
        name: 'envelope',
        iconType: 'fontawesome',
        copyText: 'keveltkit@gmail.com'
      }
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Copy keveltkit@gmail.com' }));

    expect(vi.mocked(navigator.clipboard.writeText)).toHaveBeenCalledWith('keveltkit@gmail.com');
  });

  test('copyTextが渡された場合、コピー後にCopiedが表示される', async () => {
    render(Icon, {
      props: {
        name: 'envelope',
        iconType: 'fontawesome',
        copyText: 'keveltkit@gmail.com'
      }
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Copy keveltkit@gmail.com' }));

    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });
});
