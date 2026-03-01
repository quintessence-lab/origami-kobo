import Link from 'next/link';

interface CategoryBadgeProps {
  category: string;
  locale: string;
  linkable?: boolean;
}

const categoryConfig: Record<string, { label: { ja: string; en: string }; emoji: string; color: string }> = {
  animals:  { label: { ja: '動物',         en: 'Animals'         }, emoji: '🐾', color: '#E07B54' },
  flowers:  { label: { ja: '花・植物',     en: 'Flowers'         }, emoji: '🌸', color: '#F5A0C0' },
  food:     { label: { ja: '食べ物',       en: 'Food'            }, emoji: '🍓', color: '#F5C518' },
  vehicles: { label: { ja: '乗り物',       en: 'Vehicles'        }, emoji: '✈️', color: '#7B9E6B' },
  items:    { label: { ja: '日用品',       en: 'Items'           }, emoji: '⭐', color: '#9B8BC4' },
  geometric:{ label: { ja: '幾何学',       en: 'Geometric'       }, emoji: '💎', color: '#4AABDB' },
  seasonal: { label: { ja: '季節',         en: 'Seasonal'        }, emoji: '🎄', color: '#C0A060' },
};

export default function CategoryBadge({ category, locale, linkable = false }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  if (!config) return null;

  const label = config.label[locale as 'ja' | 'en'] ?? category;
  const badge = (
    <span
      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ backgroundColor: `${config.color}20`, color: config.color }}
    >
      {config.emoji} {label}
    </span>
  );

  if (linkable) {
    return (
      <Link href={`/${locale}/category/${category}`}>
        {badge}
      </Link>
    );
  }

  return badge;
}
