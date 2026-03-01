import fs from 'fs';
import path from 'path';

const ANIMALS = [
  'crane', 'cat', 'dog', 'butterfly', 'elephant',
  'fish', 'frog', 'penguin', 'rabbit', 'swan',
];

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts');
const STEPS_DIR = path.join(process.cwd(), 'public', 'images', 'origami', 'steps');

// 折り方/Instructions セクション内の番号付きリスト行の直後にステップ画像を挿入
function insertStepImages(filePath: string, lang: 'ja' | 'en', slug: string): number {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // 折り方セクションのヘッダーを検出
  const sectionHeader = lang === 'ja' ? '## 折り方' : '## Instructions';

  let inSection = false;
  let stepNum = 0;
  let insertedCount = 0;
  const newLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // セクション開始を検出
    if (line.trim() === sectionHeader) {
      inSection = true;
      newLines.push(line);
      continue;
    }

    // 別のセクション(##)に入ったらセクション終了
    if (inSection && line.startsWith('## ')) {
      inSection = false;
    }

    newLines.push(line);

    // セクション内の番号付きリスト行を検出
    if (inSection && /^\d+\.\s/.test(line.trim())) {
      stepNum++;

      // SVGファイルが存在するか確認
      const svgPath = path.join(STEPS_DIR, slug, `step-${stepNum}.svg`);
      if (fs.existsSync(svgPath)) {
        // 次の行が既に画像行でないか確認（重複挿入防止）
        const nextLine = lines[i + 1]?.trim() ?? '';
        if (!nextLine.startsWith('![')) {
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

for (const slug of ANIMALS) {
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
