import Link from 'next/link';
import Image from 'next/image';
import CategoryBadge from './CategoryBadge';

interface PostCardProps {
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  time: string;
  excerpt?: string;
  image?: string;
  locale: string;
}

const difficultyColor: Record<string, string> = {
  beginner: '#7B9E6B',
  intermediate: '#F5C518',
  advanced: '#E07B54',
  初級: '#7B9E6B',
  中級: '#F5C518',
  上級: '#E07B54',
};

export default function PostCard({
  slug,
  title,
  category,
  difficulty,
  time,
  excerpt,
  image,
  locale,
}: PostCardProps) {
  const diffColor = difficultyColor[difficulty] ?? '#7B9E6B';
  const imgSrc = image ?? `/images/origami/${slug}.svg`;

  return (
    <Link href={`/${locale}/blog/${slug}`}>
      <article
        className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer h-full flex flex-col"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8D5C4',
          boxShadow: '0 2px 8px rgba(61,43,31,0.06)',
        }}
      >
        {/* サムネイル */}
        <div className="relative w-full aspect-square bg-[#FFFBF0] flex items-center justify-center">
          <Image
            src={imgSrc}
            alt={title}
            width={200}
            height={200}
            unoptimized
            className="w-3/4 h-3/4 object-contain"
          />
        </div>

        <div className="p-5 flex flex-col flex-1">
          {/* カテゴリ */}
          <div className="mb-3">
            <CategoryBadge category={category} locale={locale} />
          </div>

          {/* タイトル */}
          <h2
            className="font-bold text-base mb-2 leading-snug"
            style={{ color: '#3D2B1F' }}
          >
            {title}
          </h2>

          {/* エクサープト */}
          {excerpt && (
            <p className="text-sm mb-3 flex-1 leading-relaxed" style={{ color: '#7A5C4E' }}>
              {excerpt.length > 60 ? excerpt.slice(0, 60) + '…' : excerpt}
            </p>
          )}

          {/* メタ情報 */}
          <div className="flex items-center gap-3 mt-auto pt-3" style={{ borderTop: '1px solid #E8D5C4' }}>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: `${diffColor}20`, color: diffColor }}
            >
              {difficulty}
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: '#7A5C4E' }}>
              ⏱ {time}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
