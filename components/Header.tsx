'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import SearchBar from './SearchBar';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const switchLocale = () => {
    const newLocale = locale === 'ja' ? 'en' : 'ja';
    // パスのロケール部分を置換
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/search`, label: t('search') },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: '#FFFFFF', borderBottom: '2px solid #E8D5C4' }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <span className="text-2xl">🦢</span>
            <span
              className="font-bold text-xl tracking-wide"
              style={{ color: '#E07B54', fontFamily: locale === 'ja' ? 'var(--font-noto-sans-jp)' : 'var(--font-nunito)' }}
            >
              {locale === 'ja' ? '折り紙工房' : 'Origami Kobo'}
            </span>
          </Link>

          {/* デスクトップナビ */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: '#3D2B1F' }}
              >
                {link.label}
              </Link>
            ))}
            {/* 言語切替 */}
            <button
              onClick={switchLocale}
              className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all hover:opacity-80"
              style={{ backgroundColor: '#E07B54', color: '#FFFFFF' }}
            >
              {t('language')}
            </button>
          </nav>

          {/* モバイルメニューボタン */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            <div className="w-5 h-0.5 mb-1 transition-all" style={{ backgroundColor: '#3D2B1F' }} />
            <div className="w-5 h-0.5 mb-1 transition-all" style={{ backgroundColor: '#3D2B1F' }} />
            <div className="w-5 h-0.5 transition-all" style={{ backgroundColor: '#3D2B1F' }} />
          </button>
        </div>

        {/* モバイルメニュー */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: '#E8D5C4' }}>
            <div className="mb-3">
              <SearchBar locale={locale} />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-medium"
                style={{ color: '#3D2B1F' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={switchLocale}
              className="mt-2 px-3 py-1.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: '#E07B54', color: '#FFFFFF' }}
            >
              {t('language')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
