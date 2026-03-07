import fs from 'fs';
import path from 'path';

const ANIMALS = [
  'crane', 'cat', 'dog', 'butterfly', 'elephant',
  'fish', 'frog', 'penguin', 'rabbit', 'swan',
];

const SEASONAL = [
  'carp-streamer', 'christmas-tree', 'jack-o-lantern',
  'kabuto', 'santa', 'snowflake', 'tanabata',
];

const FLOWERS = [
  'cherry-blossom', 'lily', 'lotus', 'morning-glory',
  'rose', 'sunflower', 'tulip',
];

const FOOD = [
  'apple', 'cake', 'candy', 'ice-cream',
  'mushroom', 'strawberry', 'watermelon',
];

const VEHICLES = [
  'airplane', 'boat', 'car', 'helicopter',
  'hot-air-balloon', 'rocket', 'train',
];

const ALL_SLUGS = [...ANIMALS, ...SEASONAL, ...FLOWERS, ...FOOD, ...VEHICLES];

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts');
const STEPS_DIR = path.join(process.cwd(), 'public', 'images', 'origami', 'steps');

// 折り方/Instructions セクション内の番号付きリスト行の直後にステップ画像を挿入
function insertStepImages(filePath: string, lang: 'ja' | 'en', slug: string): number {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // 折り方セクションのヘッダーを検出（複数セクション対応）
  const sectionStarters = lang === 'ja'
    ? ['## 折り方', '## つなげ方', '## 組み立て']
    : ['## Instructions', '## Assembly', '## Making the Garland', '## Star', '## Adding'];

  function isSectionHeader(trimmed: string): boolean {
    return sectionStarters.some(s => trimmed.startsWith(s));
  }

  let inSection = false;
  let stepNum = 0;
  let insertedCount = 0;
  const newLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // セクション開始を検出（startsWith で部分一致）
    if (isSectionHeader(line.trim())) {
      inSection = true;
      newLines.push(line);
      continue;
    }

    // 別の非対象セクション(##)に入ったらセクション終了
    if (inSection && line.startsWith('## ') && !isSectionHeader(line.trim())) {
      inSection = false;
    }

    newLines.push(line);

    // セクション内の番号付きリスト行を検出
    if (inSection && /^\d+\.\s/.test(line.trim())) {
      stepNum++;

      // SVGファイルが存在するか確認
      const svgPath = path.join(STEPS_DIR, slug, `step-${stepNum}.svg`);
      if (fs.existsSync(svgPath)) {
        // 次の行（空行をスキップ）が既に画像行でないか確認（重複挿入防止）
        let lookAhead = i + 1;
        while (lookAhead < lines.length && lines[lookAhead].trim() === '') lookAhead++;
        const nextNonEmpty = lines[lookAhead]?.trim() ?? '';
        if (!nextNonEmpty.startsWith('![')) {
          const altText = lang === 'ja' ? `ステップ${stepNum}` : `Step ${stepNum}`;
          newLines.push('');
          newLines.push(`![${altText}](/images/origami/steps/${slug}/step-${stepNum}.svg)`);
          newLines.push('');
          insertedCount++;
        }
      }
    }
  }

  if (insertedCount > 0) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
  }

  return insertedCount;
}

// ── メイン処理 ──
let totalInserted = 0;

for (const slug of ALL_SLUGS) {
  // 日本語版
  const jaPath = path.join(CONTENT_DIR, 'ja', `${slug}.md`);
  if (fs.existsSync(jaPath)) {
    const count = insertStepImages(jaPath, 'ja', slug);
    console.log(`  ✓ ja/${slug}.md: ${count} images inserted`);
    totalInserted += count;
  }

  // 英語版
  const enPath = path.join(CONTENT_DIR, 'en', `${slug}.md`);
  if (fs.existsSync(enPath)) {
    const count = insertStepImages(enPath, 'en', slug);
    console.log(`  ✓ en/${slug}.md: ${count} images inserted`);
    totalInserted += count;
  }
}

console.log(`\n✓ Total: ${totalInserted} step images inserted`);
