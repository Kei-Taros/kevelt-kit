import type { WorkCardItem } from '$lib/components/Molecule/';
import type { WorkDetail } from '$lib/components/organisms';

export const WORK_DETAILS: WorkDetail[] = [
  {
    id: 6,
    title: 'ファッション向けECサイト開発',
    src: {
      webp: '/images/works/work-6.webp',
      png: '/images/works/work-6.png'
    },
    summary: `ファッション向けECサイトのバックエンドおよびフロントエンド開発を担当。
      既存システムのDB調査・分析を踏まえ、ヘキサゴナルアーキテクチャおよびDDDを用いたAPI設計・実装を実施。
      また、利用者へのヒアリングを基にした画面設計とUI実装も対応。`,
    period: '2025/04 - 2026/03',
    role: 'SE（メンバー）',
    scope: '設計 / 実装 / テスト / 技術選定',
    categories: ['Web', 'Frontend', 'Backend'],
    techStack: ['TypeScript', 'SvelteKit', 'NestJS', 'OpenAPI', 'Docker', 'Node.js', 'GitHub'],
    responsibilities: [
      '既存システムのDB調査・分析',
      'ヘキサゴナルアーキテクチャによるAPI設計',
      'OpenAPIを用いたAPI仕様策定',
      'DDDベースのAPI実装',
      'Vitestによる単体テスト',
      '利用者ヒアリングを踏まえた画面仕様検討',
      'Atomic Designを用いたUI実装',
      'Elmアーキテクチャによるステート管理'
    ],
    highlights: [
      'CSSおよびテーブルライブラリの技術選定・導入を実施し、開発効率を向上',
      'POCによる技術検証を行い、結果を資料化して提案',
      '新人エンジニアへの技術レクチャーおよびオンボーディング支援を実施'
    ]
  },
  {
    id: 5,
    title: '法務業務向けWebサービス開発',
    src: {
      webp: '/images/works/work-5.webp',
      png: '/images/works/work-5.png'
    },
    summary: `法務業務向けWebサービスのフロントエンド開発を担当。
      Atomic Designを用いたコンポーネント設計およびUI実装を行い、状態管理やテスト実装を含めたフロントエンド基盤の構築を実施。
      また、生成AIを活用した開発プロセスの改善にも対応。`,
    period: '2025/01 - 2025/03',
    role: 'PG（メンバー）',
    scope: '設計 / 実装 / テスト',
    categories: ['Web', 'Frontend'],
    techStack: ['TypeScript', 'React', 'Docker', 'Node.js', 'GitHub'],
    responsibilities: [
      'Atomic Designを用いたコンポーネント設計・UI実装',
      'Zustandによるステート管理の設計・実装',
      'Vitestを用いた単体テストおよび結合テストの実装',
      '既存機能の改善およびコードリファクタリング'
    ],
    highlights: [
      '生成AIを活用したコード生成により開発生産性を向上',
      'コードオーナーによるレビューと自動テストにより、生成コードの品質と安全性を担保'
    ]
  },
  {
    id: 4,
    title: '自販機向け電子決済システム開発',
    src: {
      webp: '/images/works/work-4.webp',
      png: '/images/works/work-4.png'
    },
    summary: `自販機向け電子決済システムのバックエンド開発を担当。
      OpenAPIを用いたAPI設計・実装およびテスト、既存機能の改修を実施。
      決済・ポイント事業者との連携を踏まえた仕様調整にも対応。`,
    period: '2023/08 - 2024/12',
    role: 'SE（メンバー）',
    scope: '設計 / 実装 / テスト / 改修',
    categories: ['Web', 'Backend'],
    techStack: ['Elixir', 'OpenAPI', 'Docker', 'GitHub'],
    responsibilities: [
      'OpenAPIを用いたAPI設計',
      'API実装',
      '単体・結合テストの実施',
      '既存機能の改修およびバグ修正',
      '決済・ポイント事業者との仕様調整'
    ],
    highlights: [
      '未経験領域からバックエンド開発を担当し、短期間でキャッチアップ',
      '外部事業者との仕様調整を通じて、要件整理および実装への落とし込みを実施'
    ]
  },
  {
    id: 3,
    title: '水道工事企業向けコーポレートサイト開発',
    src: {
      webp: '/images/works/work-3.webp',
      png: '/images/works/work-3.png'
    },
    summary: `水道工事を中心とした企業のコーポレートサイト開発を担当。
      エンドユーザーへのヒアリングを基にデザイン設計を行い、モック画面を用いた認識合わせを実施。
      また、競合調査を踏まえたフロントエンド実装、レスポンシブ対応、SEO対策、リリース対応にも対応。`,
    period: '2021/09 - 2023/07',
    role: 'デザイナー / PG / Webディレクター',
    scope: '要件定義 / デザイン設計 / 実装 / テスト / リリース',
    categories: ['Web', 'Frontend'],
    techStack: ['TypeScript', 'React', 'Node.js', 'GitHub'],
    responsibilities: [
      'エンドユーザーへのヒアリング',
      'モック画面を用いたデザイン設計および認識合わせ',
      '競合サイトの調査・分析',
      'フロントエンド実装',
      'レスポンシブWebデザイン対応',
      'セキュリティ強化対策の実施',
      'テストおよび動作検証',
      'SEO対策',
      'リリース対応'
    ],
    highlights: [
      'JavaScriptを用いたアニメーション実装により、視覚的訴求力のあるページを構築',
      '実装後、エンドユーザーから高い評価を獲得',
      'レスポンシブ対応により、スマートフォン利用時のUXを改善'
    ]
  },
  {
    id: 2,
    title: 'Bluetoothヘッドホン組込み開発',
    src: {
      webp: '/images/works/work-2.webp',
      png: '/images/works/work-2.png'
    },
    summary: `Bluetoothヘッドホンにおける店頭展示モードおよび解析ツール開発を担当。
      店頭展示モードの設計・実装に加え、テスト仕様書の作成や既存実装の改修を実施。
      また、テスト実施時に使用される解析ツールの開発にも対応。`,
    period: '2019/08 - 2020/08',
    role: 'PG（メンバー）',
    scope: '設計 / 実装 / テスト / ツール開発',
    categories: ['Embedded'],
    techStack: ['C', 'FreeRTOS'],
    responsibilities: [
      '店頭展示モードの設計・実装',
      'テスト仕様書の作成',
      '既存実装の改修',
      'テスト実施時に使用される解析ツールの開発'
    ],
    highlights: [
      '下流工程の一連の流れを経験し、工程全体を理解',
      'チーム内でのコードレビュー会を通じて、品質を重視した設計・実装を習得'
    ]
  },
  {
    id: 1,
    title: '動画制作',
    src: {
      webp: '/images/works/work-1.webp',
      png: '/images/works/work-1.png'
    },
    summary: `YouTube向けの動画撮影・編集およびチャンネル運営を担当。
      動画編集やサムネイル制作、ニーズ調査を通じて、視聴者ニーズを踏まえたコンテンツ改善を実施。
      また、視聴維持率やクリック率を意識した運用により、チャンネル登録者数3万人、最高再生回数200万再生を達成。`,
    period: '2020/07 - 2023/07',
    role: '動画編集 / チャンネル運営',
    scope: '企画 / 撮影 / 編集 / 調査 / 運用',
    categories: ['Other'],
    techStack: ['Premiere Pro', 'Photoshop', 'YMM4'],
    responsibilities: [
      'YouTube用動画の撮影・編集',
      'サムネイル画像の作成',
      '視聴者ニーズの調査',
      'YouTubeチャンネルの運営'
    ],
    highlights: [
      '視聴維持率を意識した動画制作により、チャンネル登録者数3万人、最高再生回数200万再生を達成',
      '作業の自動化により、動画編集業務の効率化を実施',
      '高クリック率を意識したサムネイル作成'
    ]
  }
];

export const WORK_CARD: WorkCardItem[] = [
  {
    id: 6,
    src: '/images/works/work-6.webp',
    alt: 'ファッション向けECサイト開発',
    title: 'ファッション向けECサイト開発',
    period: '2025 - 2026',
    tags: ['Web', 'Frontend', 'Backend', 'TypeScript', 'SvelteKit', 'NestJS']
  },
  {
    id: 5,
    src: '/images/works/work-5.webp',
    alt: '法務業務向けWebサービス開発',
    title: '法務業務向けWebサービス開発',
    period: '2025',
    tags: ['Web', 'Frontend', 'TypeScript', 'React']
  },
  {
    id: 4,
    src: '/images/works/work-4.webp',
    alt: '自販機向け電子決済システム開発',
    title: '自販機向け電子決済システム開発',
    period: '2023 - 2024',
    tags: ['Web', 'Backend', 'Elixir']
  },
  {
    id: 3,
    src: '/images/works/work-3.webp',
    alt: '水道事業者向けコーポレートサイト開発',
    title: '水道事業者向けコーポレートサイト開発',
    period: '2022 - 2023',
    tags: ['Web', 'Frontend', 'TypeScript', 'React']
  },
  {
    id: 2,
    src: '/images/works/work-2.webp',
    alt: 'Bluetoothヘッドホン組込み開発',
    title: 'Bluetoothヘッドホン組込み開発',
    period: '2019 - 2020',
    tags: ['Embedded', 'C', 'FreeRTOS']
  },
  {
    id: 1,
    src: '/images/works/work-1.webp',
    alt: '動画制作',
    title: '動画制作',
    period: '2020 - 2023',
    tags: ['Other', 'Premiere Pro', 'Photoshop']
  }
];
