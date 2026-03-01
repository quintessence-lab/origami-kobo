'use client';

import { useTranslations } from 'next-intl';

interface AffiliateBoxProps {
  locale: string;
}

export default function AffiliateBox({ locale }: AffiliateBoxProps) {
  const t = useTranslations('affiliate');

  const products = [
    {
      title: locale === 'ja' ? '折り紙 100枚セット（15cm×15cm）' : 'Origami Paper 100 Sheets (15cm×15cm)',
      description: locale === 'ja'
        ? '鮮やかな20色入り。初心者から上級者まで使いやすい標準サイズ。'
        : '20 vivid colors. Standard size perfect for all skill levels.',
      url: 'https://www.amazon.co.jp/s?k=折り紙+15cm+100枚&tag=PLACEHOLDER-22',
    },
    {
      title: locale === 'ja' ? '折り紙の本 決定版（入門〜上級）' : 'Complete Origami Book (Beginner to Advanced)',
      description: locale === 'ja'
        ? '150種類以上の作品を収録。写真付きで分かりやすい解説。'
        : 'Over 150 designs with clear photo instructions.',
      url: 'https://www.amazon.co.jp/s?k=折り紙+本+決定版&tag=PLACEHOLDER-22',
    },
  ];

  return (
    <div
      className="rounded-2xl p-6 my-8"
      style={{ backgroundColor: '#FFF8E1', border: '2px solid #F5C518' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🛍</span>
        <h3 className="font-bold text-base" style={{ color: '#3D2B1F' }}>
          {t('title')}
        </h3>
      </div>
      <p className="text-sm mb-5" style={{ color: '#7A5C4E' }}>
        {t('description')}
      </p>

      <div className="space-y-3">
        {products.map((product, i) => (
          <a
            key={i}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center justify-between rounded-xl p-3 transition-all hover:shadow-md group"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8D5C4' }}
          >
            <div className="flex-1">
              <p className="text-sm font-semibold mb-0.5 group-hover:underline" style={{ color: '#3D2B1F' }}>
                {product.title}
              </p>
              <p className="text-xs" style={{ color: '#7A5C4E' }}>
                {product.description}
              </p>
            </div>
            <span
              className="ml-3 shrink-0 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: '#E07B54', color: '#FFFFFF' }}
            >
              {t('buyButton')}
            </span>
          </a>
        ))}
      </div>

      <p className="text-xs mt-4 opacity-60" style={{ color: '#7A5C4E' }}>
        {t('disclaimer')}
      </p>
    </div>
  );
}
