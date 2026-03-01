'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="mt-16 py-10" style={{ backgroundColor: '#3D2B1F', color: '#FFFBF0' }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* サイト情報 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🦢</span>
              <span className="font-bold text-lg" style={{ color: '#F5C518' }}>
                {locale === 'ja' ? '折り紙工房' : 'Origami Kobo'}
              </span>
            </div>
            <p className="text-sm opacity-80">{t('tagline')}</p>
          </div>

          {/* リンク */}
          <div>
            <h3 className="font-semibold mb-3" style={{ color: '#F5C518' }}>{t('links')}</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href={`/${locale}`} className="hover:opacity-100 transition-opacity">
                  {locale === 'ja' ? 'ホーム' : 'Home'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="hover:opacity-100 transition-opacity">
                  {locale === 'ja' ? '記事一覧' : 'Articles'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/search`} className="hover:opacity-100 transition-opacity">
                  {locale === 'ja' ? '検索' : 'Search'}
                </Link>
              </li>
            </ul>
          </div>

          {/* カテゴリ */}
          <div>
            <h3 className="font-semibold mb-3" style={{ color: '#F5C518' }}>
              {locale === 'ja' ? 'カテゴリ' : 'Categories'}
            </h3>
            <ul className="space-y-2 text-sm opacity-80">
              {['animals', 'flowers', 'food', 'vehicles', 'items', 'geometric', 'seasonal'].map((cat) => (
                <li key={cat}>
                  <Link href={`/${locale}/category/${cat}`} className="hover:opacity-100 transition-opacity">
                    {getCategoryLabel(cat, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-2 text-xs opacity-60" style={{ borderColor: '#7A5C4E' }}>
          <p>{t('copyright')}</p>
          <div className="flex gap-4">
            <Link href={`/${locale}/privacy`} className="hover:opacity-100">
              {t('privacy')}
            </Link>
            <span>|</span>
            <span>{t('affiliate_disclosure')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function getCategoryLabel(category: string, locale: string): string {
  const labels: Record<string, { ja: string; en: string }> = {
    animals: { ja: '動物', en: 'Animals' },
    flowers: { ja: '花・植物', en: 'Flowers & Plants' },
    food: { ja: '食べ物', en: 'Food' },
    vehicles: { ja: '乗り物', en: 'Vehicles' },
    items: { ja: '日用品・アイテム', en: 'Items' },
    geometric: { ja: '幾何学・アート', en: 'Geometric & Art' },
    seasonal: { ja: '季節・イベント', en: 'Seasonal' },
  };
  return labels[category]?.[locale as 'ja' | 'en'] ?? category;
}
