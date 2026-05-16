import type { PrivacyPolicyData } from '$lib/types/privacyPolicy';

export const INTRODUCTION: string =
  'KeveltKit（以下、「当サイト」）では、利用者の個人情報を適切に取り扱います。';

export const PRIVACY_POLICY_LIST: PrivacyPolicyData[] = [
  {
    title: '個人情報の利用について',
    descriptions: [
      '当サイトでは、お問い合わせ等を通じて個人情報をご提供いただく場合があります。',
      '取得した情報は、お問い合わせへの対応以外の目的では利用いたしません。'
    ]
  },
  {
    title: '第三者提供について',
    descriptions: [
      '取得した個人情報を、法令に基づく場合を除き、本人の同意なく第三者へ提供することはありません。'
    ]
  },
  {
    title: 'ストレージの利用について',
    descriptions: [
      '当サイトでは、表示演出や利便性向上のため、ブラウザのセッションストレージを利用する場合があります。',
      '保存される情報には個人情報は含まれません。'
    ]
  },
  {
    title: '免責事項',
    descriptions: [
      '当サイトに掲載している情報については、可能な限り正確な内容を掲載するよう努めています。',
      'ただし、その正確性・安全性を保証するものではありません。',
      '当サイトの利用によって生じた損害等について、一切の責任を負いかねます。'
    ]
  },
  {
    title: '著作権について',
    descriptions: [
      '当サイトに掲載されている文章・画像・ソースコード等の無断転載・無断使用を禁止します。'
    ]
  },
  {
    title: 'プライバシーポリシーの変更',
    descriptions: ['本ポリシーは、必要に応じて予告なく変更する場合があります。']
  }
];

export const PRIVACY_POLICY_DATE = {
  established: {
    label: '制定日',
    value: '2026年7月01日'
  },
  updated: {
    label: '最終改定日',
    value: '2026年7月01日'
  }
} as const;
