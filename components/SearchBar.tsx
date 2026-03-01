'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface SearchBarProps {
  locale: string;
  initialQuery?: string;
}

export default function SearchBar({ locale, initialQuery = '' }: SearchBarProps) {
  const t = useTranslations('search');
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('placeholder')}
        className="w-full px-4 py-2 pr-10 rounded-full text-sm outline-none transition-all"
        style={{
          backgroundColor: '#FFFBF0',
          border: '1.5px solid #E8D5C4',
          color: '#3D2B1F',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#E07B54';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(224,123,84,0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#E8D5C4';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
        aria-label={t('title')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7A5C4E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}
