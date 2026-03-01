'use client';

import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const t = useTranslations('share');

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: t('twitter'),
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      emoji: '𝕏',
      color: '#1DA1F2',
    },
    {
      name: t('facebook'),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      emoji: 'f',
      color: '#1877F2',
    },
    {
      name: t('line'),
      href: `https://line.me/R/msg/text/?${encodedTitle}%0A${encodedUrl}`,
      emoji: 'L',
      color: '#06C755',
    },
  ];

  return (
    <div className="my-8">
      <p className="text-sm font-semibold mb-3" style={{ color: '#7A5C4E' }}>
        {t('title')}
      </p>
      <div className="flex gap-3 flex-wrap">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-80 hover:shadow-md"
            style={{ backgroundColor: link.color }}
          >
            <span className="font-bold">{link.emoji}</span>
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}
