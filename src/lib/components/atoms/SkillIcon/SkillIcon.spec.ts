import { render, screen } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import SkillIcon from './SkillIcon.svelte';
import * as styles from './SkillIcon.css';

describe('SkillIcon', () => {
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
});
