import type { ConceptCraftData } from '$lib/types/concept.types';
import type { CarouselItem } from '$lib/types/carousel.types';

export const SECTION_COUNT = 4;
export const MSG_MAIN: string[] = ['シンプルの中に', 'こだわりを。'];
export const MSG_DESCRIPTION: string[] = [
  'デザインから設計まで一貫して "シンプル" を軸に開発しました。',
  'そんなシンプルに込めたこだわりを紹介します。'
];

export const WHATS_KEVELTKIT_TEXTS: string[] = [
  'まずは本題に入る前に、このサイトで使用しているフレームワークについて紹介します。',
  '当初、これまで使用経験のあるReactやNext.jsで開発を始めようと考えていました。',
  '人気の高いフレームワークなので、使い方に困ることもなさそうですからね。',
  'ですが。。。なんかつまらない。',
  'そんな時に目に留まったのが <a href="https://svelte.jp/" target="_blank" rel="noopener noreferrer" class="brand">SvelteKit</a> でした。',
  '一旦やってみる。難しいことはそれから考えよう。',
  '後先考えずに突き進んでしまう性分なので日本ではまだマイナーなフレームワークですが、<br>勢いで開発を始めていました🤔',
  'で、ここからが本題なのですが、そんなSvelteKitに無理やり私の名前を融合させて <span class="brand">KeveltKit</span> を爆誕させました！',
  'ちなみにキーカラーを<span class="brand">オレンジ色</span>にしているのも、ベースにSvelteKitがあるからです🍊',
  'ダークカラー x オレンジってこんなに合うんですね。'
];

export const CRAFT: ConceptCraftData[] = [
  {
    title: 'デザイン',
    descriptions: [
      'ノイズとなる過度なデザイン性を避け、わかりやすさをベースにデザインしています。',
      'また、ネイビー x ホワイト x オレンジの3色をベースカラーに設定することで、サイト全体の世界観を統一しました!',
      '目指したゴールは、ストレスなく閲覧できるサイトです🖌️'
    ],
    src: {
      webp: '/images/concept/craft/craft-01.webp',
      png: '/images/concept/craft/craft-01.png'
    }
  },

  {
    title: '設計',
    descriptions: [
      'Atomic Designを厳格に守った設計で開発を進めました!',
      'そのため、保守性は最強です⚔️',
      'また、すべてのコンポーネントに対して単体テストを実施し、最終的なページに対してはE2Eテストも行っています。なので、不具合はないはず。。。'
    ],
    src: {
      webp: '/images/concept/craft/craft-02.webp',
      png: '/images/concept/craft/craft-02.png'
    }
  },
  {
    title: '実装',
    descriptions: [
      'SvelteKit x TypeScriptをベースとして実装しています👾',
      '書き方にクセが少ないので、やはり開発体験はとても良きですね。',
      'そして実装の相棒としてChatGPTをフル活用しました!',
      '実はイラストも全てChatGPT産です💫'
    ],
    src: {
      webp: '/images/concept/craft/craft-03.webp',
      png: '/images/concept/craft/craft-03.png'
    }
  }
];

export const THEME_CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: 'About-Me',
    src: {
      webp: '/images/theme/about-me.webp',
      png: '/images/theme/about-me.png'
    }
  },
  {
    id: 2,
    title: 'Concept',
    src: {
      webp: '/images/theme/consept.webp',
      png: '/images/theme/consept.png'
    }
  },
  {
    id: 3,
    title: 'News',
    src: {
      webp: '/images/theme/news.webp',
      png: '/images/theme/news.png'
    }
  },
  {
    id: 4,
    title: 'A-Break',
    src: {
      webp: '/images/theme/a-break.webp',
      png: '/images/theme/a-break.png'
    }
  },
  {
    id: 5,
    title: 'Works',
    src: {
      webp: '/images/theme/works.webp',
      png: '/images/theme/works.png'
    }
  }
];

export const THEME_DESCRIPTION: string[] = [
  '無限のアイディアが広がる世界へ。',
  'たった一つの松明を手に、迷い込んでしまう。',
  '果てしなく続く世界を探索し、最後には無事脱出できるのか。。。!?',
  'そんな世界観をテーマにしています。',
  'なんだか人生みたいですね。'
];
