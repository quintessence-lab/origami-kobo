import fs from 'fs';
import path from 'path';

// ── 色定義 ──
const BG = '#FFF8F0';
const PAPER = '#F4A460';
const PAPER_DARK = '#D4884A';
const PAPER_WHITE = '#FEFEFE';
const FOLD = '#CC8855';
const ARROW_COLOR = '#E07B54';
const CREASE = '#DDCCBB';
const ACCENT = '#3D2B1F';

// ── SVGヘルパー ──
function svg(content: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
<rect width="200" height="200" rx="12" fill="${BG}"/>
<defs>
  <marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
    <path d="M0,0 L8,3 L0,6" fill="${ARROW_COLOR}"/>
  </marker>
</defs>
${content}
</svg>`;
}

function poly(pts: string, fill: string, opacity = 0.9): string {
  return `<polygon points="${pts}" fill="${fill}" opacity="${opacity}"/>`;
}

function dash(x1: number, y1: number, x2: number, y2: number): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${FOLD}" stroke-width="1.5" stroke-dasharray="5,3"/>`;
}

function arrow(x1: number, y1: number, x2: number, y2: number): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ARROW_COLOR}" stroke-width="2" marker-end="url(#ah)"/>`;
}

function curveArrow(x1: number, y1: number, cx: number, cy: number, x2: number, y2: number): string {
  return `<path d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}" stroke="${ARROW_COLOR}" stroke-width="2" fill="none" marker-end="url(#ah)"/>`;
}

function text(x: number, y: number, t: string, size = 11): string {
  return `<text x="${x}" y="${y}" font-family="sans-serif" font-size="${size}" fill="${ACCENT}" text-anchor="middle">${t}</text>`;
}

function circle(cx: number, cy: number, r: number, fill: string): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

// ── ステップ定義 ──
interface StepSet {
  slug: string;
  steps: string[];
}

const allSteps: StepSet[] = [
  // ════════════════════════════════════════
  // CRANE (13 steps)
  // ════════════════════════════════════════
  {
    slug: 'crane',
    steps: [
      // Step 1: 正方形を対角線で折る
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        dash(30, 30, 170, 170),
        curveArrow(150, 50, 130, 80, 70, 130),
      ].join('\n'),

      // Step 2: もう一方の対角線で折り目
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        `<line x1="30" y1="30" x2="170" y2="170" stroke="${CREASE}" stroke-width="1"/>`,
        dash(170, 30, 30, 170),
        curveArrow(50, 50, 80, 80, 130, 130),
      ].join('\n'),

      // Step 3: 縦横にも折り目
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        `<line x1="30" y1="30" x2="170" y2="170" stroke="${CREASE}" stroke-width="1"/>`,
        `<line x1="170" y1="30" x2="30" y2="170" stroke="${CREASE}" stroke-width="1"/>`,
        dash(100, 30, 100, 170),
        dash(30, 100, 170, 100),
      ].join('\n'),

      // Step 4: 正方形ベースに折りたたむ
      [
        poly('100,40 60,100 100,160 140,100', PAPER),
        poly('100,40 140,100 100,100', PAPER_DARK, 0.7),
        `<line x1="100" y1="40" x2="100" y2="160" stroke="${CREASE}" stroke-width="1"/>`,
        `<line x1="60" y1="100" x2="140" y2="100" stroke="${CREASE}" stroke-width="1"/>`,
        text(100, 185, '正方基本形'),
      ].join('\n'),

      // Step 5: 上の2枚を中央に折る
      [
        poly('100,40 60,100 100,160 140,100', PAPER),
        dash(100, 40, 100, 160),
        poly('100,40 80,70 100,100', PAPER_DARK, 0.5),
        poly('100,40 120,70 100,100', PAPER_DARK, 0.5),
        curveArrow(65, 80, 80, 85, 95, 75),
        curveArrow(135, 80, 120, 85, 105, 75),
      ].join('\n'),

      // Step 6: 上の三角を折り下げて折り目
      [
        poly('100,40 80,70 100,100 120,70', PAPER),
        poly('80,70 100,100 60,100', PAPER, 0.6),
        poly('120,70 100,100 140,100', PAPER, 0.6),
        poly('100,100 60,100 100,160 140,100', PAPER),
        dash(80, 70, 120, 70),
        curveArrow(100, 50, 110, 65, 110, 80),
      ].join('\n'),

      // Step 7: 花弁折り（下の角を引き上げ）
      [
        poly('100,40 80,70 90,55 100,45 110,55 120,70', PAPER_DARK, 0.7),
        poly('100,45 80,70 60,100 100,160 140,100 120,70', PAPER),
        curveArrow(100, 155, 90, 120, 100, 50),
        text(100, 185, '花弁折り'),
      ].join('\n'),

      // Step 8: 裏返して同様に
      [
        poly('100,40 75,80 100,160 125,80', PAPER),
        poly('100,40 75,80 100,80', PAPER_DARK, 0.5),
        poly('100,40 125,80 100,80', PAPER_DARK, 0.5),
        curveArrow(30, 100, 20, 60, 50, 40),
        text(25, 110, '↺'),
        text(100, 185, '裏返す'),
      ].join('\n'),

      // Step 9: 左右を中央に折る（前後両面）
      [
        poly('100,40 80,65 100,160 120,65', PAPER),
        dash(100, 40, 100, 160),
        curveArrow(78, 90, 85, 95, 95, 85),
        curveArrow(122, 90, 115, 95, 105, 85),
      ].join('\n'),

      // Step 10: 首を引き出す
      [
        poly('100,45 90,80 100,160 110,80', PAPER),
        poly('100,45 70,35 85,55 90,80', PAPER_DARK, 0.8),
        curveArrow(100, 48, 80, 30, 65, 35),
        text(55, 30, '首'),
      ].join('\n'),

      // Step 11: 尾を引き出す
      [
        poly('100,45 90,80 100,160 110,80', PAPER),
        poly('70,35 85,55 90,80', PAPER_DARK, 0.8),
        poly('100,45 115,55 130,35 110,80', PAPER_DARK, 0.8),
        curveArrow(100, 48, 120, 30, 132, 35),
        text(140, 30, '尾'),
      ].join('\n'),

      // Step 12: 頭を折り曲げる
      [
        poly('90,80 100,160 110,80', PAPER),
        poly('70,35 85,55 90,80', PAPER_DARK, 0.8),
        poly('130,35 115,55 110,80', PAPER_DARK, 0.8),
        poly('70,35 60,45 65,35', PAPER_DARK),
        curveArrow(70, 33, 60, 30, 58, 42),
        text(50, 55, '頭'),
      ].join('\n'),

      // Step 13: 羽を広げて完成
      [
        poly('60,45 65,35 70,35 85,55 90,80 100,160 110,80 115,55 130,35 135,35', PAPER),
        poly('90,80 55,95 65,80 85,55', PAPER_DARK, 0.6),
        poly('110,80 145,95 135,80 115,55', PAPER_DARK, 0.6),
        curveArrow(85, 85, 65, 80, 55, 90),
        curveArrow(115, 85, 135, 80, 145, 90),
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // CAT (8 steps)
  // ════════════════════════════════════════
  {
    slug: 'cat',
    steps: [
      // Step 1: 三角形に折る
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        dash(30, 170, 170, 30),
        curveArrow(50, 150, 60, 120, 120, 60),
      ].join('\n'),

      // Step 2: 三角形（頂点が上）
      [
        poly('30,170 100,30 170,170', PAPER),
        text(100, 185, '頂点を上に'),
      ].join('\n'),

      // Step 3: 底辺を折り上げ
      [
        poly('30,170 100,30 170,170', PAPER),
        dash(45, 140, 155, 140),
        poly('30,170 45,140 155,140 170,170', PAPER_DARK, 0.5),
        curveArrow(100, 168, 105, 155, 100, 142),
      ].join('\n'),

      // Step 4: 左の角を折り上げ（耳）
      [
        poly('45,140 100,30 155,140', PAPER),
        poly('30,170 45,140 60,170', PAPER_WHITE, 0.5),
        poly('45,140 55,90 70,120', PAPER_DARK, 0.8),
        curveArrow(42, 138, 35, 110, 52, 88),
        text(45, 80, '耳'),
      ].join('\n'),

      // Step 5: 右の角も折り上げ（耳）
      [
        poly('45,140 100,30 155,140', PAPER),
        poly('45,140 55,90 70,120', PAPER_DARK, 0.8),
        poly('155,140 145,90 130,120', PAPER_DARK, 0.8),
        curveArrow(158, 138, 165, 110, 148, 88),
        text(155, 80, '耳'),
      ].join('\n'),

      // Step 6: 裏返す
      [
        poly('45,140 55,90 100,30 145,90 155,140', PAPER),
        curveArrow(170, 100, 180, 60, 170, 40),
        text(175, 110, '↺'),
        text(100, 185, '裏返す'),
      ].join('\n'),

      // Step 7: 上の角を少し下に折る
      [
        poly('55,90 100,30 145,90', PAPER),
        poly('55,90 145,90 155,140 45,140', PAPER),
        dash(70, 60, 130, 60),
        poly('70,60 100,30 130,60', PAPER_DARK, 0.5),
        curveArrow(100, 35, 105, 50, 100, 58),
      ].join('\n'),

      // Step 8: 顔を描いて完成
      [
        poly('55,90 70,60 130,60 145,90 155,140 45,140', PAPER),
        poly('55,90 45,65 65,75', PAPER_DARK, 0.8),
        poly('145,90 155,65 135,75', PAPER_DARK, 0.8),
        circle(80, 105, 4, ACCENT),
        circle(120, 105, 4, ACCENT),
        `<polygon points="100,115 96,122 104,122" fill="${ACCENT}"/>`,
        `<line x1="75" y1="118" x2="50" y2="115" stroke="${ACCENT}" stroke-width="1.5"/>`,
        `<line x1="75" y1="122" x2="50" y2="125" stroke="${ACCENT}" stroke-width="1.5"/>`,
        `<line x1="125" y1="118" x2="150" y2="115" stroke="${ACCENT}" stroke-width="1.5"/>`,
        `<line x1="125" y1="122" x2="150" y2="125" stroke="${ACCENT}" stroke-width="1.5"/>`,
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // DOG (8 steps)
  // ════════════════════════════════════════
  {
    slug: 'dog',
    steps: [
      // Step 1: 三角形に折る
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        dash(30, 170, 170, 30),
        curveArrow(50, 150, 60, 120, 120, 60),
      ].join('\n'),

      // Step 2: 三角形（底辺が上）
      [
        poly('30,30 170,30 100,170', PAPER),
        text(100, 185, '底辺を上に'),
      ].join('\n'),

      // Step 3: 左右の角を折り下げる（耳）
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('30,30 50,80 65,55', PAPER_DARK, 0.7),
        poly('170,30 150,80 135,55', PAPER_DARK, 0.7),
        curveArrow(35, 35, 30, 55, 48, 75),
        curveArrow(165, 35, 170, 55, 152, 75),
        text(35, 90, '耳'),
        text(165, 90, '耳'),
      ].join('\n'),

      // Step 4: 下の角を折り上げる（あご）
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('30,30 50,80 65,55', PAPER_DARK, 0.7),
        poly('170,30 150,80 135,55', PAPER_DARK, 0.7),
        poly('80,140 100,170 120,140', PAPER_WHITE, 0.7),
        curveArrow(100, 165, 105, 150, 100, 142),
        text(100, 185, 'あご'),
      ].join('\n'),

      // Step 5: あごを少し折り返す（鼻）
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('30,30 50,80 65,55', PAPER_DARK, 0.7),
        poly('170,30 150,80 135,55', PAPER_DARK, 0.7),
        poly('80,140 100,170 120,140', PAPER_WHITE, 0.7),
        poly('90,150 100,170 110,150', PAPER, 0.6),
        curveArrow(100, 143, 105, 148, 102, 155),
      ].join('\n'),

      // Step 6: 裏返す
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('30,30 50,80 65,55', PAPER_DARK, 0.7),
        poly('170,30 150,80 135,55', PAPER_DARK, 0.7),
        curveArrow(170, 100, 180, 60, 170, 40),
        text(175, 110, '↺'),
        text(100, 185, '裏返す'),
      ].join('\n'),

      // Step 7: 上の角を折り下げる（おでこ）
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('30,30 50,80 65,55', PAPER_DARK, 0.7),
        poly('170,30 150,80 135,55', PAPER_DARK, 0.7),
        dash(55, 50, 145, 50),
        poly('55,50 100,30 145,50', PAPER_DARK, 0.5),
        curveArrow(100, 32, 105, 42, 100, 48),
      ].join('\n'),

      // Step 8: 顔を描いて完成
      [
        poly('55,50 145,50 100,170', PAPER),
        poly('55,50 35,80 55,70', PAPER_DARK, 0.7),
        poly('145,50 165,80 145,70', PAPER_DARK, 0.7),
        poly('80,140 100,155 120,140', PAPER_WHITE, 0.7),
        circle(80, 90, 5, ACCENT),
        circle(120, 90, 5, ACCENT),
        `<ellipse cx="100" cy="115" rx="10" ry="7" fill="${PAPER_DARK}"/>`,
        circle(100, 112, 4, ACCENT),
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // BUTTERFLY (11 steps)
  // ════════════════════════════════════════
  {
    slug: 'butterfly',
    steps: [
      // Step 1: 三角形に折る
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        dash(30, 170, 170, 30),
        curveArrow(50, 150, 60, 120, 120, 60),
      ].join('\n'),

      // Step 2: もう一度三角形に折る
      [
        poly('30,170 100,30 170,170', PAPER),
        dash(100, 170, 100, 30),
        curveArrow(150, 155, 130, 130, 105, 120),
      ].join('\n'),

      // Step 3: 上の1枚を開いて四角形につぶす
      [
        poly('30,170 100,30 170,170', PAPER),
        poly('100,30 170,170 100,170', PAPER_DARK, 0.5),
        curveArrow(155, 140, 160, 110, 135, 100),
        text(100, 185, '開いてつぶす'),
      ].join('\n'),

      // Step 4: 正方基本形
      [
        poly('50,50 100,30 150,50 150,150 100,170 50,150', PAPER),
        poly('100,30 150,50 150,150 100,170', PAPER_DARK, 0.6),
        `<line x1="50" y1="50" x2="150" y2="150" stroke="${CREASE}" stroke-width="1"/>`,
        `<line x1="150" y1="50" x2="50" y2="150" stroke="${CREASE}" stroke-width="1"/>`,
        text(100, 185, '正方基本形'),
      ].join('\n'),

      // Step 5: 左右を中央に折る
      [
        poly('100,30 60,100 100,170 140,100', PAPER),
        dash(100, 30, 100, 170),
        poly('60,100 80,60 100,30 100,100', PAPER_DARK, 0.4),
        poly('140,100 120,60 100,30 100,100', PAPER_DARK, 0.4),
        curveArrow(62, 85, 72, 80, 88, 65),
        curveArrow(138, 85, 128, 80, 112, 65),
      ].join('\n'),

      // Step 6: 上の三角を折り下げる
      [
        poly('100,30 80,60 100,100 120,60', PAPER_DARK, 0.7),
        poly('80,60 60,100 100,170 140,100 120,60 100,100', PAPER),
        dash(80, 60, 120, 60),
        curveArrow(100, 38, 108, 52, 105, 62),
      ].join('\n'),

      // Step 7: 花弁折り
      [
        poly('100,30 80,50 90,40 100,32 110,40 120,50', PAPER_DARK, 0.6),
        poly('80,50 60,100 100,170 140,100 120,50 100,32', PAPER),
        curveArrow(100, 165, 95, 120, 100, 38),
        text(100, 185, '花弁折り'),
      ].join('\n'),

      // Step 8: 裏返して同様に
      [
        poly('100,30 75,80 100,170 125,80', PAPER),
        curveArrow(170, 100, 180, 60, 170, 40),
        text(175, 110, '↺'),
        text(100, 185, '裏返して繰り返す'),
      ].join('\n'),

      // Step 9: 下の角を上に折り上げ（はみ出す）
      [
        poly('100,30 85,70 100,160 115,70', PAPER),
        dash(85, 70, 115, 70),
        curveArrow(100, 155, 95, 100, 100, 25),
        text(100, 185, '先端がはみ出す'),
      ].join('\n'),

      // Step 10: 中央で谷折り
      [
        poly('100,30 85,70 100,160 115,70', PAPER),
        dash(100, 30, 100, 160),
        curveArrow(88, 100, 80, 95, 75, 100),
        text(100, 185, '中央で谷折り'),
      ].join('\n'),

      // Step 11: 翼を広げて完成
      [
        poly('100,95 60,50 40,70 70,100 45,140 100,115', PAPER),
        poly('100,95 140,50 160,70 130,100 155,140 100,115', PAPER_DARK, 0.8),
        `<line x1="100" y1="40" x2="100" y2="160" stroke="${ACCENT}" stroke-width="2"/>`,
        circle(90, 58, 5, `${PAPER}80`),
        circle(110, 58, 5, `${PAPER_DARK}80`),
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // ELEPHANT (11 steps)
  // ════════════════════════════════════════
  {
    slug: 'elephant',
    steps: [
      // Step 1: 対角線で折り目
      [
        poly('100,30 170,100 100,170 30,100', PAPER_WHITE),
        dash(30, 100, 170, 100),
        text(100, 185, 'ダイヤ形に置く'),
      ].join('\n'),

      // Step 2: 凧の形（左右を中央に）
      [
        poly('100,30 170,100 100,170 30,100', PAPER_WHITE),
        poly('100,30 30,100 65,65 100,50', PAPER, 0.7),
        poly('100,30 170,100 135,65 100,50', PAPER, 0.7),
        curveArrow(35, 95, 50, 75, 63, 63),
        curveArrow(165, 95, 150, 75, 137, 63),
        text(100, 185, '凧の形'),
      ].join('\n'),

      // Step 3: 裏返す
      [
        poly('100,30 135,65 100,50 65,65 30,100 100,170 170,100', PAPER),
        curveArrow(170, 100, 180, 60, 170, 40),
        text(175, 110, '↺'),
        text(100, 185, '裏返す'),
      ].join('\n'),

      // Step 4: もう一度左右を中央に折る
      [
        poly('100,30 130,65 100,170 70,65', PAPER),
        dash(100, 30, 100, 170),
        curveArrow(72, 100, 80, 95, 95, 90),
        curveArrow(128, 100, 120, 95, 105, 90),
      ].join('\n'),

      // Step 5: 上下に半分に折る
      [
        poly('100,30 130,65 100,170 70,65', PAPER),
        dash(70, 100, 130, 100),
        curveArrow(100, 35, 110, 70, 110, 95),
      ].join('\n'),

      // Step 6: 先端（鼻）を折り返す
      [
        poly('70,65 130,65 130,100 100,170 70,100', PAPER),
        poly('70,100 100,170 130,100', PAPER_DARK, 0.6),
        dash(80, 130, 120, 130),
        curveArrow(100, 165, 105, 150, 105, 132),
        text(100, 185, '鼻の先端'),
      ].join('\n'),

      // Step 7: 鼻を段折り（ジグザグ）
      [
        poly('70,60 130,60 130,100 70,100', PAPER),
        poly('70,100 100,140 130,100', PAPER_DARK, 0.5),
        `<path d="M85,130 L85,140 L85,135 L85,145" stroke="${FOLD}" stroke-width="1.5" stroke-dasharray="3,2"/>`,
        poly('85,130 100,150 115,130 105,135 100,145 95,135', PAPER_DARK, 0.7),
        text(100, 185, '段折り（鼻）'),
      ].join('\n'),

      // Step 8: 縦に半分に折る
      [
        poly('70,60 130,60 130,100 70,100', PAPER),
        poly('85,100 100,140 115,100', PAPER_DARK, 0.6),
        dash(100, 50, 100, 150),
        curveArrow(72, 80, 75, 70, 95, 70),
      ].join('\n'),

      // Step 9: 耳を引き出す
      [
        poly('80,55 120,55 120,130 80,130', PAPER),
        poly('80,55 55,75 65,100 80,90', PAPER_DARK, 0.7),
        poly('120,55 145,75 135,100 120,90', PAPER_DARK, 0.7),
        curveArrow(82, 70, 68, 65, 57, 73),
        curveArrow(118, 70, 132, 65, 143, 73),
        text(55, 110, '耳'),
        text(145, 110, '耳'),
      ].join('\n'),

      // Step 10: 尾を内側に折る
      [
        poly('80,55 120,55 120,130 80,130', PAPER),
        poly('80,55 55,75 65,100 80,90', PAPER_DARK, 0.7),
        poly('120,55 145,75 135,100 120,90', PAPER_DARK, 0.7),
        poly('90,130 100,150 110,130', PAPER_DARK, 0.4),
        curveArrow(100, 148, 95, 140, 100, 132),
        text(100, 160, '尾'),
      ].join('\n'),

      // Step 11: 完成（自立するように底を開く）
      [
        poly('60,50 140,50 150,120 130,140 70,140 50,120', PAPER),
        poly('60,50 40,75 45,105 50,120 55,85', PAPER_DARK, 0.7),
        poly('140,50 160,75 155,105 150,120 145,85', PAPER_DARK, 0.7),
        `<path d="M70,105 Q60,130 55,155 Q65,150 70,140" fill="${PAPER_DARK}"/>`,
        circle(78, 80, 4, ACCENT),
        circle(122, 80, 4, ACCENT),
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // FISH (6 steps)
  // ════════════════════════════════════════
  {
    slug: 'fish',
    steps: [
      // Step 1: 三角形に折る
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        dash(30, 170, 170, 30),
        curveArrow(50, 150, 60, 120, 120, 60),
      ].join('\n'),

      // Step 2: 三角形（底辺が上）
      [
        poly('30,30 170,30 100,170', PAPER),
        text(100, 185, '底辺を上に'),
      ].join('\n'),

      // Step 3: 右角を左へ折る（尾びれ）
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('170,30 130,100 140,60', PAPER_DARK, 0.7),
        curveArrow(165, 40, 155, 65, 135, 90),
        text(120, 110, '尾びれ'),
      ].join('\n'),

      // Step 4: 尾びれを半分折り返す
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('170,30 130,100 140,60', PAPER_DARK, 0.5),
        poly('140,60 155,40 160,75', PAPER, 0.8),
        curveArrow(132, 85, 142, 70, 153, 48),
        text(160, 90, '二股'),
      ].join('\n'),

      // Step 5: 全体を横に半分に折る
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('170,30 130,100 155,40 160,75', PAPER_DARK, 0.6),
        dash(30, 30, 140, 100),
        curveArrow(80, 150, 75, 120, 70, 95),
      ].join('\n'),

      // Step 6: 完成（目を描く）
      [
        poly('40,80 160,50 140,90 100,110', PAPER),
        poly('140,80 165,60 160,90', PAPER_DARK, 0.7),
        poly('155,65 165,50 163,78', PAPER, 0.8),
        circle(70, 78, 5, ACCENT),
        `<ellipse cx="70" cy="77" rx="2" ry="3" fill="${PAPER_WHITE}"/>`,
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // FROG (7 steps)
  // ════════════════════════════════════════
  {
    slug: 'frog',
    steps: [
      // Step 1: 縦半分に折って広げる
      [
        poly('40,30 160,30 160,170 40,170', PAPER_WHITE),
        dash(100, 30, 100, 170),
        curveArrow(150, 60, 130, 80, 105, 70),
      ].join('\n'),

      // Step 2: 上を三角にたたむ
      [
        poly('40,30 160,30 160,170 40,170', PAPER_WHITE),
        `<line x1="100" y1="30" x2="100" y2="170" stroke="${CREASE}" stroke-width="1"/>`,
        poly('40,30 100,80 160,30', PAPER, 0.7),
        poly('40,30 40,80 100,80', PAPER_DARK, 0.5),
        poly('160,30 160,80 100,80', PAPER_DARK, 0.5),
        text(100, 185, '三角に折りたたむ'),
      ].join('\n'),

      // Step 3: 左右の角を上に折る
      [
        poly('40,80 100,30 160,80', PAPER),
        poly('40,80 160,80 160,170 40,170', PAPER_WHITE),
        curveArrow(45, 78, 55, 55, 85, 38),
        curveArrow(155, 78, 145, 55, 115, 38),
        poly('40,80 70,45 80,70', PAPER_DARK, 0.5),
        poly('160,80 130,45 120,70', PAPER_DARK, 0.5),
      ].join('\n'),

      // Step 4: 前足を外側に折り返す
      [
        poly('40,80 70,30 100,30 130,30 160,80', PAPER),
        poly('40,80 160,80 160,170 40,170', PAPER_WHITE),
        poly('70,30 50,55 65,50', PAPER_DARK, 0.7),
        poly('130,30 150,55 135,50', PAPER_DARK, 0.7),
        curveArrow(68, 35, 55, 35, 48, 52),
        curveArrow(132, 35, 145, 35, 152, 52),
        text(35, 65, '前足'),
        text(165, 65, '前足'),
      ].join('\n'),

      // Step 5: 下半分を上に折る
      [
        poly('40,80 70,30 100,30 130,30 160,80', PAPER),
        poly('50,55 65,50 70,30', PAPER_DARK, 0.6),
        poly('150,55 135,50 130,30', PAPER_DARK, 0.6),
        poly('40,80 160,80 160,170 40,170', PAPER_WHITE),
        dash(40, 80, 160, 80),
        curveArrow(100, 165, 95, 130, 100, 85),
      ].join('\n'),

      // Step 6: ジャバラ折り（後ろ足+バネ）
      [
        poly('40,50 70,30 100,30 130,30 160,50', PAPER),
        poly('50,55 65,50 70,30', PAPER_DARK, 0.6),
        poly('150,55 135,50 130,30', PAPER_DARK, 0.6),
        poly('40,50 160,50 160,80 40,80', PAPER_WHITE),
        poly('40,80 160,80 160,110 40,110', PAPER_WHITE, 0.7),
        dash(40, 80, 160, 80),
        curveArrow(100, 55, 105, 70, 100, 78),
        curveArrow(100, 108, 105, 95, 100, 82),
        text(100, 185, 'ジャバラ折り'),
      ].join('\n'),

      // Step 7: 裏返して完成
      [
        poly('40,80 70,50 100,50 130,50 160,80 160,150 40,150', PAPER),
        poly('40,80 35,60 55,65 70,50', PAPER_DARK, 0.7),
        poly('160,80 165,60 145,65 130,50', PAPER_DARK, 0.7),
        poly('40,120 160,120 160,150 40,150', PAPER_DARK, 0.4),
        circle(80, 75, 4, ACCENT),
        circle(120, 75, 4, ACCENT),
        `<path d="M90,92 Q100,100 110,92" stroke="${ACCENT}" stroke-width="2" fill="none"/>`,
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // PENGUIN (10 steps)
  // ════════════════════════════════════════
  {
    slug: 'penguin',
    steps: [
      // Step 1: ダイヤ形に置き、対角線で折り目
      [
        poly('100,25 175,100 100,175 25,100', PAPER_WHITE),
        dash(100, 25, 100, 175),
        text(100, 185, 'ダイヤ形'),
      ].join('\n'),

      // Step 2: 左辺を中央に折る
      [
        poly('100,25 175,100 100,175 25,100', PAPER_WHITE),
        `<line x1="100" y1="25" x2="100" y2="175" stroke="${CREASE}" stroke-width="1"/>`,
        poly('100,25 25,100 62,62 100,45', PAPER, 0.6),
        curveArrow(30, 95, 50, 70, 60, 60),
      ].join('\n'),

      // Step 3: 右辺も中央に折る（凧の形）
      [
        poly('100,25 175,100 100,175 25,100', PAPER_WHITE),
        poly('100,25 25,100 62,62 100,45', PAPER, 0.7),
        poly('100,25 175,100 138,62 100,45', PAPER, 0.7),
        curveArrow(170, 95, 150, 70, 140, 60),
        text(100, 185, '凧の形'),
      ].join('\n'),

      // Step 4: 裏返す
      [
        poly('100,25 138,62 100,175 62,62', PAPER),
        curveArrow(170, 100, 180, 60, 170, 40),
        text(175, 110, '↺'),
        text(100, 185, '裏返す'),
      ].join('\n'),

      // Step 5: 上の角を下に折る
      [
        poly('100,25 138,62 100,175 62,62', PAPER),
        dash(70, 80, 130, 80),
        poly('62,62 100,25 138,62 130,80 70,80', PAPER_DARK, 0.5),
        curveArrow(100, 30, 110, 55, 105, 78),
      ].join('\n'),

      // Step 6: 上を折り返す（頭を作る）
      [
        poly('62,62 70,80 130,80 138,62 100,175', PAPER),
        poly('70,80 130,80 125,60 75,60', PAPER_DARK, 0.5),
        dash(75, 60, 125, 60),
        curveArrow(100, 78, 105, 68, 100, 62),
        text(100, 185, '頭部を作る'),
      ].join('\n'),

      // Step 7: 全体を縦に半分に折る
      [
        poly('62,62 75,60 100,175 70,80', PAPER),
        poly('138,62 125,60 100,175 130,80', PAPER_DARK, 0.8),
        dash(100, 40, 100, 175),
        curveArrow(135, 100, 125, 95, 105, 100),
      ].join('\n'),

      // Step 8: 頭を引き出す
      [
        poly('70,60 130,60 100,170', PAPER),
        poly('70,60 90,45 95,60', PAPER_DARK, 0.8),
        curveArrow(82, 58, 80, 45, 88, 42),
        text(80, 35, '頭'),
      ].join('\n'),

      // Step 9: 足を折る
      [
        poly('70,60 130,60 100,170', PAPER),
        poly('70,60 90,45 95,60', PAPER_DARK, 0.8),
        poly('75,155 100,170 125,155 120,165 80,165', PAPER_DARK, 0.5),
        curveArrow(100, 168, 105, 162, 100, 157),
        text(100, 185, '足を折る'),
      ].join('\n'),

      // Step 10: 完成
      [
        poly('70,50 130,50 140,140 100,160 60,140', PAPER),
        poly('80,65 120,65 125,130 100,145 75,130', PAPER_WHITE),
        poly('70,50 88,40 92,50', PAPER_DARK),
        circle(85, 55, 3, PAPER_WHITE),
        circle(115, 55, 3, PAPER_WHITE),
        circle(86, 54, 1.5, ACCENT),
        circle(116, 54, 1.5, ACCENT),
        `<polygon points="100,65 96,72 104,72" fill="${ARROW_COLOR}"/>`,
        poly('60,85 42,108 60,105', PAPER, 0.7),
        poly('140,85 158,108 140,105', PAPER, 0.7),
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // RABBIT (10 steps)
  // ════════════════════════════════════════
  {
    slug: 'rabbit',
    steps: [
      // Step 1: 三角形に折る
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        dash(30, 170, 170, 30),
        curveArrow(50, 150, 60, 120, 120, 60),
      ].join('\n'),

      // Step 2: 三角形（底辺が下）
      [
        poly('30,170 100,30 170,170', PAPER),
        text(100, 185, '底辺を下に'),
      ].join('\n'),

      // Step 3: 底辺を少し折り上げ
      [
        poly('30,170 100,30 170,170', PAPER),
        dash(35, 160, 165, 160),
        poly('30,170 35,160 165,160 170,170', PAPER_DARK, 0.5),
        curveArrow(100, 168, 105, 164, 100, 162),
      ].join('\n'),

      // Step 4: 左の角を上に折る（耳）
      [
        poly('35,160 100,30 165,160', PAPER),
        poly('35,160 65,70 75,120', PAPER_DARK, 0.6),
        curveArrow(38, 155, 40, 110, 62, 72),
        text(55, 60, '耳'),
      ].join('\n'),

      // Step 5: 右の角も上に折る（耳）
      [
        poly('35,160 100,30 165,160', PAPER),
        poly('35,160 65,70 75,120', PAPER_DARK, 0.7),
        poly('165,160 135,70 125,120', PAPER_DARK, 0.7),
        curveArrow(162, 155, 160, 110, 138, 72),
        text(145, 60, '耳'),
      ].join('\n'),

      // Step 6: 裏返す
      [
        poly('35,160 65,70 100,30 135,70 165,160', PAPER),
        curveArrow(170, 100, 180, 60, 170, 40),
        text(175, 110, '↺'),
        text(100, 185, '裏返す'),
      ].join('\n'),

      // Step 7: 下の角を上に折る（あご）
      [
        poly('35,160 65,70 100,30 135,70 165,160', PAPER),
        poly('65,155 100,170 135,155 100,140', PAPER_DARK, 0.5),
        curveArrow(100, 165, 105, 155, 100, 142),
        text(100, 185, 'あご'),
      ].join('\n'),

      // Step 8: 左右の角を内側に折る（丸い顔）
      [
        poly('35,160 65,70 100,30 135,70 165,160', PAPER),
        poly('35,160 50,140 55,155', PAPER_DARK, 0.5),
        poly('165,160 150,140 145,155', PAPER_DARK, 0.5),
        curveArrow(38, 158, 42, 148, 48, 142),
        curveArrow(162, 158, 158, 148, 152, 142),
      ].join('\n'),

      // Step 9: 裏返す
      [
        poly('50,155 65,70 100,30 135,70 150,155', PAPER),
        curveArrow(170, 100, 180, 60, 170, 40),
        text(175, 110, '↺'),
        text(100, 185, '裏返す'),
      ].join('\n'),

      // Step 10: 顔を描いて完成
      [
        poly('55,155 70,85 100,30 130,85 145,155', PAPER),
        `<rect x="78" y="32" width="12" height="55" rx="6" fill="${PAPER}" opacity="0.9"/>`,
        `<rect x="110" y="32" width="12" height="55" rx="6" fill="${PAPER}" opacity="0.9"/>`,
        `<rect x="80" y="36" width="8" height="35" rx="4" fill="#FDE7F0"/>`,
        `<rect x="112" y="36" width="8" height="35" rx="4" fill="#FDE7F0"/>`,
        circle(85, 110, 4, ACCENT),
        circle(115, 110, 4, ACCENT),
        `<polygon points="100,120 96,126 104,126" fill="${PAPER_DARK}"/>`,
        circle(82, 130, 5, '#FDE7F080'),
        circle(118, 130, 5, '#FDE7F080'),
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // SWAN (11 steps)
  // ════════════════════════════════════════
  {
    slug: 'swan',
    steps: [
      // Step 1: ダイヤ形に置き、対角線で折り目
      [
        poly('100,25 175,100 100,175 25,100', PAPER_WHITE),
        dash(100, 25, 100, 175),
        text(100, 185, 'ダイヤ形'),
      ].join('\n'),

      // Step 2: 凧の形（左右を中央に）
      [
        poly('100,25 175,100 100,175 25,100', PAPER_WHITE),
        poly('100,25 25,100 62,62 100,50', PAPER, 0.7),
        poly('100,25 175,100 138,62 100,50', PAPER, 0.7),
        curveArrow(30, 95, 50, 70, 60, 60),
        curveArrow(170, 95, 150, 70, 140, 60),
        text(100, 185, '凧の形'),
      ].join('\n'),

      // Step 3: 裏返してもう一度
      [
        poly('100,25 138,62 100,175 62,62', PAPER),
        curveArrow(170, 100, 180, 60, 170, 40),
        text(175, 110, '↺'),
        text(100, 185, '裏返す'),
      ].join('\n'),

      // Step 4: 再度左右を中央に折る
      [
        poly('100,25 138,62 100,175 62,62', PAPER),
        poly('100,25 62,62 81,44 100,35', PAPER_DARK, 0.5),
        poly('100,25 138,62 119,44 100,35', PAPER_DARK, 0.5),
        curveArrow(65, 58, 72, 50, 80, 43),
        curveArrow(135, 58, 128, 50, 120, 43),
      ].join('\n'),

      // Step 5: 下の角を上の角に合わせて折る
      [
        poly('100,25 120,50 100,175 80,50', PAPER),
        dash(80, 100, 120, 100),
        curveArrow(100, 170, 95, 130, 100, 102),
      ].join('\n'),

      // Step 6: 細い先端を斜め上に折り上げ（首）
      [
        poly('80,50 120,50 120,100 80,100', PAPER),
        poly('80,100 100,175 120,100', PAPER, 0.7),
        poly('80,100 90,60 95,90', PAPER_DARK, 0.6),
        curveArrow(95, 140, 85, 100, 88, 65),
        text(78, 55, '首'),
      ].join('\n'),

      // Step 7: 首の先端を折り曲げる（頭）
      [
        poly('80,50 120,50 120,100 80,100', PAPER),
        poly('80,100 100,140 120,100', PAPER, 0.7),
        `<line x1="80" y1="100" x2="90" y2="60" stroke="${PAPER_DARK}" stroke-width="3"/>`,
        poly('90,60 82,48 88,50', PAPER_DARK),
        curveArrow(88, 58, 80, 48, 82, 42),
        text(72, 40, '頭'),
      ].join('\n'),

      // Step 8: 全体を縦に半分に折る
      [
        poly('80,50 120,50 120,100 80,100', PAPER),
        poly('80,100 100,140 120,100', PAPER, 0.7),
        `<line x1="80" y1="100" x2="90" y2="60" stroke="${PAPER_DARK}" stroke-width="3"/>`,
        poly('90,60 82,48 88,50', PAPER_DARK),
        dash(100, 40, 100, 150),
        curveArrow(82, 85, 88, 80, 95, 82),
      ].join('\n'),

      // Step 9: 首を引き出す
      [
        poly('60,80 140,80 140,140 100,155 60,140', PAPER),
        `<line x1="70" y1="80" x2="60" y2="50" stroke="${PAPER_DARK}" stroke-width="4"/>`,
        poly('60,50 52,38 58,42', PAPER_DARK),
        curveArrow(68, 78, 60, 60, 58, 45),
        text(45, 35, '首'),
      ].join('\n'),

      // Step 10: 頭を固定
      [
        poly('60,80 140,80 140,140 100,155 60,140', PAPER),
        `<path d="M70,80 Q60,55 65,35 Q72,40 68,55" fill="${PAPER_DARK}"/>`,
        poly('65,35 55,30 60,40', PAPER_DARK),
        circle(63, 33, 2, ACCENT),
        curveArrow(65, 33, 55, 28, 52, 30),
      ].join('\n'),

      // Step 11: 体を広げて自立させて完成
      [
        `<path d="M70,60 Q60,40 65,25 Q75,30 70,50" fill="${PAPER}"/>`,
        poly('65,25 55,22 60,30', PAPER_DARK),
        poly('70,55 140,80 160,95 140,125 70,135 50,110', PAPER_WHITE, 0.95),
        `<line x1="70" y1="55" x2="70" y2="135" stroke="${CREASE}" stroke-width="0.5"/>`,
        poly('140,95 168,88 164,115 150,112', PAPER_WHITE, 0.9),
        circle(68, 38, 2.5, ACCENT),
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // CARP-STREAMER (6 steps)
  // ════════════════════════════════════════
  {
    slug: 'carp-streamer',
    steps: [
      // Step 1: 横に半分に折って折り目
      [
        poly('30,40 170,40 170,160 30,160', PAPER_WHITE),
        dash(30, 100, 170, 100),
        curveArrow(100, 155, 105, 130, 100, 105),
      ].join('\n'),
      // Step 2: 左辺を中央手前に折る
      [
        poly('30,40 170,40 170,160 30,160', PAPER_WHITE),
        `<line x1="30" y1="100" x2="170" y2="100" stroke="${CREASE}" stroke-width="1"/>`,
        poly('30,40 30,160 55,145 55,55', PAPER, 0.6),
        curveArrow(32, 100, 38, 90, 53, 90),
      ].join('\n'),
      // Step 3: 右の上下を三角に折る（尾びれ）
      [
        poly('55,40 170,40 170,160 55,160', PAPER),
        poly('170,40 140,70 170,100', PAPER_DARK, 0.6),
        poly('170,160 140,130 170,100', PAPER_DARK, 0.6),
        curveArrow(168, 50, 155, 65, 142, 72),
        curveArrow(168, 150, 155, 135, 142, 128),
        text(155, 100, '尾びれ'),
      ].join('\n'),
      // Step 4: 上下を中央に折る
      [
        poly('55,40 140,40 140,160 55,160', PAPER),
        poly('140,40 140,100 170,100', PAPER_DARK, 0.5),
        poly('140,160 140,100 170,100', PAPER_DARK, 0.5),
        dash(55, 100, 170, 100),
        curveArrow(100, 45, 105, 65, 100, 95),
        curveArrow(100, 155, 105, 135, 100, 105),
      ].join('\n'),
      // Step 5: 左端を折り返す（口）
      [
        poly('55,70 140,70 140,130 55,130', PAPER),
        poly('140,70 155,85 155,115 140,130', PAPER_DARK, 0.5),
        poly('55,70 65,70 65,130 55,130', PAPER_WHITE, 0.7),
        curveArrow(57, 100, 58, 90, 63, 90),
        text(60, 65, '口'),
      ].join('\n'),
      // Step 6: 完成（目とウロコを描く）
      [
        poly('55,70 140,70 155,85 155,115 140,130 55,130', PAPER),
        poly('55,70 65,70 65,130 55,130', PAPER_WHITE, 0.7),
        circle(78, 95, 8, PAPER_WHITE),
        circle(80, 94, 4, ACCENT),
        `<path d="M95,85 Q105,80 110,88" stroke="${PAPER_DARK}" stroke-width="1" fill="none"/>`,
        `<path d="M95,98 Q105,93 110,101" stroke="${PAPER_DARK}" stroke-width="1" fill="none"/>`,
        `<path d="M95,111 Q105,106 110,114" stroke="${PAPER_DARK}" stroke-width="1" fill="none"/>`,
        `<path d="M110,91 Q120,86 125,94" stroke="${PAPER_DARK}" stroke-width="1" fill="none"/>`,
        `<path d="M110,104 Q120,99 125,107" stroke="${PAPER_DARK}" stroke-width="1" fill="none"/>`,
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // CHRISTMAS-TREE (15 steps)
  // ════════════════════════════════════════
  {
    slug: 'christmas-tree',
    steps: [
      // -- Tree Layers (8 steps) --
      // Step 1: 三角に折る
      [
        poly('30,30 170,30 170,170 30,170', '#2E7D32'),
        dash(30, 170, 170, 30),
        curveArrow(50, 150, 60, 120, 120, 60),
        text(100, 185, '大きい緑の紙'),
      ].join('\n'),
      // Step 2: 対角線X字の折り目
      [
        poly('30,30 170,30 170,170 30,170', '#2E7D32'),
        `<line x1="30" y1="30" x2="170" y2="170" stroke="${CREASE}" stroke-width="1"/>`,
        `<line x1="170" y1="30" x2="30" y2="170" stroke="${CREASE}" stroke-width="1"/>`,
        dash(30, 170, 170, 30),
      ].join('\n'),
      // Step 3: 縦横の折り目
      [
        poly('30,30 170,30 170,170 30,170', '#2E7D32'),
        `<line x1="30" y1="30" x2="170" y2="170" stroke="${CREASE}" stroke-width="1"/>`,
        `<line x1="170" y1="30" x2="30" y2="170" stroke="${CREASE}" stroke-width="1"/>`,
        dash(100, 30, 100, 170),
        dash(30, 100, 170, 100),
      ].join('\n'),
      // Step 4: 正方基本形に折りたたむ
      [
        poly('100,40 60,100 100,160 140,100', '#2E7D32'),
        poly('100,40 140,100 100,100', '#1B5E20', 0.6),
        text(100, 185, '正方基本形'),
      ].join('\n'),
      // Step 5: 左右を中央に折る（前面）
      [
        poly('100,40 60,100 100,160 140,100', '#2E7D32'),
        poly('60,100 80,70 100,40 100,100', '#1B5E20', 0.5),
        poly('140,100 120,70 100,40 100,100', '#1B5E20', 0.5),
        curveArrow(62, 85, 72, 75, 90, 65),
        curveArrow(138, 85, 128, 75, 110, 65),
      ].join('\n'),
      // Step 6: 裏面も同様に
      [
        poly('100,40 80,70 100,100 120,70', '#1B5E20', 0.7),
        poly('80,70 60,100 100,160 140,100 120,70 100,100', '#2E7D32'),
        curveArrow(30, 100, 20, 60, 50, 40),
        text(25, 110, '↺'),
        text(100, 185, '裏面も同様に'),
      ].join('\n'),
      // Step 7: 底を平らにして自立させる
      [
        poly('100,35 75,75 100,160 125,75', '#2E7D32'),
        dash(75, 145, 125, 145),
        poly('75,145 100,160 125,145', '#1B5E20', 0.5),
        curveArrow(100, 158, 105, 152, 100, 147),
        text(100, 185, '底を平らに'),
      ].join('\n'),
      // Step 8: 3サイズで繰り返す
      [
        poly('100,30 70,80 130,80', '#2E7D32', 0.9),
        poly('100,55 75,95 125,95', '#388E3C', 0.8),
        poly('100,75 80,110 120,110', '#43A047', 0.7),
        text(145, 55, '大'),
        text(140, 80, '中'),
        text(135, 100, '小'),
        text(100, 185, '各サイズで繰り返す'),
      ].join('\n'),
      // -- Assembly (3 steps) --
      // Step 9: 重ねる
      [
        poly('100,40 65,100 135,100', '#43A047', 0.7),
        poly('100,60 72,100 128,100', '#388E3C', 0.8),
        poly('100,80 80,100 120,100', '#2E7D32', 0.9),
        `<rect x="95" y="100" width="10" height="25" rx="2" fill="#795548"/>`,
        curveArrow(60, 50, 55, 65, 63, 80),
        text(100, 185, '大中小を重ねる'),
      ].join('\n'),
      // Step 10: 串で固定
      [
        poly('100,30 60,100 140,100', '#2E7D32'),
        poly('100,50 68,100 132,100', '#388E3C', 0.8),
        poly('100,70 78,100 122,100', '#43A047', 0.7),
        `<rect x="95" y="100" width="10" height="25" rx="2" fill="#795548"/>`,
        `<line x1="100" y1="25" x2="100" y2="125" stroke="${ACCENT}" stroke-width="1.5" stroke-dasharray="4,3"/>`,
        text(115, 75, '串'),
        text(100, 185, '中心に串を通す'),
      ].join('\n'),
      // Step 11: 星を乗せる
      [
        poly('100,40 60,110 140,110', '#2E7D32'),
        poly('100,55 68,110 132,110', '#388E3C', 0.8),
        poly('100,70 78,110 122,110', '#43A047', 0.7),
        `<rect x="95" y="110" width="10" height="25" rx="2" fill="#795548"/>`,
        `<polygon points="100,22 104,32 114,33 106,39 108,50 100,44 92,50 94,39 86,33 96,32" fill="#F5C518"/>`,
        text(100, 185, '星を飾る'),
      ].join('\n'),
      // -- Star (4 steps) --
      // Step 12: 星用の紙を半分に折る
      [
        poly('60,60 140,60 140,140 60,140', '#F5C518'),
        dash(60, 100, 140, 100),
        curveArrow(100, 135, 105, 120, 100, 105),
        text(100, 185, '星: 黄色い紙'),
      ].join('\n'),
      // Step 13: 3等分に折る
      [
        poly('60,80 140,80 140,140 60,140', '#F5C518'),
        dash(87, 80, 87, 140),
        dash(113, 80, 113, 140),
        curveArrow(70, 85, 78, 88, 85, 85),
        curveArrow(130, 85, 122, 88, 115, 85),
        text(100, 185, '3等分に折る'),
      ].join('\n'),
      // Step 14: ジグザグに切る
      [
        poly('80,70 120,70 120,140 80,140', '#F5C518'),
        `<line x1="70" y1="100" x2="80" y2="90" stroke="${ARROW_COLOR}" stroke-width="2"/>`,
        `<line x1="80" y1="90" x2="90" y2="110" stroke="${ARROW_COLOR}" stroke-width="2"/>`,
        `<line x1="90" y1="110" x2="100" y2="90" stroke="${ARROW_COLOR}" stroke-width="2"/>`,
        `<line x1="100" y1="90" x2="110" y2="110" stroke="${ARROW_COLOR}" stroke-width="2"/>`,
        `<line x1="110" y1="110" x2="120" y2="90" stroke="${ARROW_COLOR}" stroke-width="2"/>`,
        `<line x1="120" y1="90" x2="130" y2="100" stroke="${ARROW_COLOR}" stroke-width="2"/>`,
        text(100, 185, 'ジグザグに切る'),
      ].join('\n'),
      // Step 15: 星の完成
      [
        `<polygon points="100,35 108,60 135,60 113,77 120,102 100,87 80,102 87,77 65,60 92,60" fill="#F5C518" opacity="0.9"/>`,
        `<polygon points="100,42 105,58 92,58" fill="#FFF" opacity="0.2"/>`,
        text(100, 185, '星の完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // JACK-O-LANTERN (9 steps)
  // ════════════════════════════════════════
  {
    slug: 'jack-o-lantern',
    steps: [
      // Step 1: 三角に折る
      [
        poly('30,30 170,30 170,170 30,170', ARROW_COLOR),
        dash(30, 170, 170, 30),
        curveArrow(50, 150, 60, 120, 120, 60),
      ].join('\n'),
      // Step 2: もう一度三角→広げる
      [
        poly('30,170 100,30 170,170', ARROW_COLOR),
        dash(100, 170, 100, 30),
        curveArrow(150, 155, 130, 120, 105, 110),
        text(100, 185, '折り目をつけて広げる'),
      ].join('\n'),
      // Step 3: 左右を上に折り上げ
      [
        poly('30,170 100,30 170,170', ARROW_COLOR),
        `<line x1="100" y1="30" x2="100" y2="170" stroke="${CREASE}" stroke-width="1"/>`,
        poly('30,170 70,80 80,130', ARROW_COLOR, 0.6),
        poly('170,170 130,80 120,130', ARROW_COLOR, 0.6),
        curveArrow(35, 165, 45, 120, 68, 85),
        curveArrow(165, 165, 155, 120, 132, 85),
      ].join('\n'),
      // Step 4: 折り上げた角を外側に折り返す
      [
        poly('30,170 70,80 100,30 130,80 170,170', ARROW_COLOR),
        poly('70,80 55,100 62,85', ARROW_COLOR, 0.5),
        poly('130,80 145,100 138,85', ARROW_COLOR, 0.5),
        curveArrow(68, 82, 58, 85, 53, 98),
        curveArrow(132, 82, 142, 85, 147, 98),
      ].join('\n'),
      // Step 5: 裏返す
      [
        poly('30,170 55,100 70,80 100,30 130,80 145,100 170,170', ARROW_COLOR),
        curveArrow(170, 100, 180, 60, 170, 40),
        text(175, 110, '↺'),
        text(100, 185, '裏返す'),
      ].join('\n'),
      // Step 6: 上の角を下に折る
      [
        poly('30,170 55,100 70,80 100,30 130,80 145,100 170,170', ARROW_COLOR),
        dash(65, 55, 135, 55),
        poly('70,80 100,30 130,80 135,55 65,55', PAPER_DARK, 0.4),
        curveArrow(100, 33, 108, 45, 105, 53),
        text(100, 185, '上部の凹み'),
      ].join('\n'),
      // Step 7: 下の角を上に折る
      [
        poly('55,100 65,55 135,55 145,100 170,170 30,170', ARROW_COLOR),
        poly('65,155 100,170 135,155 100,140', PAPER_WHITE, 0.5),
        curveArrow(100, 168, 105, 155, 100, 142),
      ].join('\n'),
      // Step 8: 左右を裏側に折る（丸い形）
      [
        poly('55,100 65,55 135,55 145,100 135,155 65,155', ARROW_COLOR),
        poly('55,100 65,55 60,75', ARROW_COLOR, 0.4),
        poly('145,100 135,55 140,75', ARROW_COLOR, 0.4),
        curveArrow(57, 90, 60, 80, 63, 70),
        curveArrow(143, 90, 140, 80, 137, 70),
        text(100, 185, '丸く整える'),
      ].join('\n'),
      // Step 9: 裏返して顔を描いて完成
      [
        `<ellipse cx="100" cy="100" rx="50" ry="45" fill="${ARROW_COLOR}" opacity="0.9"/>`,
        `<polygon points="100,55 95,45 105,42 108,52" fill="#2E7D32"/>`,
        `<polygon points="82,82 88,75 94,82" fill="${ACCENT}"/>`,
        `<polygon points="106,82 112,75 118,82" fill="${ACCENT}"/>`,
        `<polygon points="98,95 95,100 105,100" fill="${ACCENT}"/>`,
        `<path d="M75,110 Q85,125 95,110 Q105,125 115,110 Q125,125 130,115" stroke="${ACCENT}" stroke-width="2.5" fill="none"/>`,
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // KABUTO (8 steps)
  // ════════════════════════════════════════
  {
    slug: 'kabuto',
    steps: [
      // Step 1: 三角に折る
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        dash(30, 30, 170, 170),
        curveArrow(150, 50, 130, 80, 70, 130),
      ].join('\n'),
      // Step 2: 頂点を下に
      [
        poly('30,30 170,30 100,170', PAPER),
        text(100, 185, '頂点を下に'),
      ].join('\n'),
      // Step 3: 左右を下の頂点に折り下げ
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('30,30 60,90 100,100', PAPER_DARK, 0.6),
        poly('170,30 140,90 100,100', PAPER_DARK, 0.6),
        curveArrow(35, 35, 50, 65, 58, 88),
        curveArrow(165, 35, 150, 65, 142, 88),
      ].join('\n'),
      // Step 4: 折り返して角飾りに
      [
        poly('100,30 100,170', PAPER, 0),
        poly('30,30 100,100 170,30', PAPER),
        poly('60,90 100,100 100,170', PAPER_DARK, 0.6),
        poly('140,90 100,100 100,170', PAPER_DARK, 0.6),
        poly('60,90 35,55 55,75', PAPER_DARK, 0.8),
        poly('140,90 165,55 145,75', PAPER_DARK, 0.8),
        curveArrow(58, 88, 42, 70, 37, 57),
        curveArrow(142, 88, 158, 70, 163, 57),
        text(28, 50, '角'),
        text(172, 50, '角'),
      ].join('\n'),
      // Step 5: 角の角度を調整
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('30,30 35,55 55,75 60,90 100,100', PAPER_DARK, 0.7),
        poly('170,30 165,55 145,75 140,90 100,100', PAPER_DARK, 0.7),
        poly('100,100 100,170', PAPER, 0),
        dash(35, 55, 165, 55),
        text(100, 185, '左右対称に'),
      ].join('\n'),
      // Step 6: 下の1枚を上に折り上げ
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('35,55 165,55 100,100', PAPER_DARK, 0.5),
        poly('60,130 140,130 100,170', PAPER_DARK, 0.4),
        poly('60,130 140,130 140,100 60,100', PAPER_WHITE, 0.6),
        curveArrow(100, 165, 105, 145, 100, 132),
      ].join('\n'),
      // Step 7: もう一度少し折る（前立て）
      [
        poly('30,30 170,30 100,170', PAPER),
        poly('35,55 165,55 100,100', PAPER_DARK, 0.5),
        poly('60,100 140,100 140,130 60,130', PAPER_WHITE, 0.6),
        poly('60,100 140,100 140,90 60,90', PAPER, 0.5),
        curveArrow(100, 128, 105, 115, 100, 102),
        text(100, 185, '前立て'),
      ].join('\n'),
      // Step 8: 裏側に折り込んで完成
      [
        poly('30,30 170,30 170,90 30,90', PAPER),
        poly('30,30 35,55 55,75 60,90 30,90', PAPER_DARK, 0.7),
        poly('170,30 165,55 145,75 140,90 170,90', PAPER_DARK, 0.7),
        poly('30,90 170,90 165,100 35,100', PAPER_WHITE, 0.6),
        poly('35,100 165,100 160,110 40,110', PAPER, 0.5),
        circle(100, 70, 8, '#D4A843'),
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // SANTA (9 steps)
  // ════════════════════════════════════════
  {
    slug: 'santa',
    steps: [
      // Step 1: 三角に折る
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        dash(30, 170, 170, 30),
        curveArrow(50, 150, 60, 120, 120, 60),
      ].join('\n'),
      // Step 2: もう一方の対角線→広げる
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        `<line x1="30" y1="170" x2="170" y2="30" stroke="${CREASE}" stroke-width="1"/>`,
        dash(30, 30, 170, 170),
        curveArrow(150, 50, 130, 80, 70, 130),
        text(100, 185, '折り目をつけて広げる'),
      ].join('\n'),
      // Step 3: 1角を中央に折る（帽子の縁）
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        `<line x1="30" y1="170" x2="170" y2="30" stroke="${CREASE}" stroke-width="1"/>`,
        `<line x1="30" y1="30" x2="170" y2="170" stroke="${CREASE}" stroke-width="1"/>`,
        poly('30,30 70,70 130,70 170,30', '#E05050', 0.5),
        curveArrow(100, 32, 105, 50, 100, 68),
        text(100, 185, '帽子の縁'),
      ].join('\n'),
      // Step 4: 折り返す（白い縁取り）
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        poly('30,30 70,70 130,70 170,30', '#E05050', 0.5),
        poly('70,70 130,70 120,55 80,55', PAPER_WHITE, 0.7),
        curveArrow(100, 68, 105, 62, 100, 57),
        text(100, 185, '白い縁取り'),
      ].join('\n'),
      // Step 5: 裏返す
      [
        poly('30,30 170,30 170,170 30,170', '#E05050'),
        poly('80,55 120,55 130,70 70,70', PAPER_WHITE, 0.7),
        curveArrow(170, 100, 180, 60, 170, 40),
        text(175, 110, '↺'),
        text(100, 185, '裏返す'),
      ].join('\n'),
      // Step 6: 左右を中央で合わせる
      [
        poly('30,30 170,30 170,170 30,170', '#E05050'),
        poly('30,30 30,170 85,100', '#C04040', 0.5),
        poly('170,30 170,170 115,100', '#C04040', 0.5),
        curveArrow(35, 100, 50, 95, 80, 98),
        curveArrow(165, 100, 150, 95, 120, 98),
      ].join('\n'),
      // Step 7: 下の角を上に折る（ひげ）
      [
        poly('85,30 115,30 170,170 30,170', '#E05050'),
        poly('60,145 100,170 140,145 100,120', PAPER_WHITE, 0.8),
        curveArrow(100, 168, 105, 150, 100, 125),
        text(100, 185, 'ひげ'),
      ].join('\n'),
      // Step 8: 先端を少し折り返す
      [
        poly('85,30 115,30 140,145 60,145', '#E05050'),
        poly('60,145 140,145 135,125 65,125', PAPER_WHITE, 0.8),
        poly('80,130 100,145 120,130', '#E05050', 0.4),
        curveArrow(100, 123, 105, 130, 102, 140),
      ].join('\n'),
      // Step 9: 形を整えて顔を描いて完成
      [
        poly('70,40 130,40 140,130 100,150 60,130', '#E05050'),
        poly('70,40 100,25 130,40', '#E05050', 0.9),
        circle(100, 20, 8, PAPER_WHITE),
        `<rect x="60" y="38" width="80" height="8" rx="4" fill="${PAPER_WHITE}"/>`,
        poly('65,125 135,125 130,140 100,150 70,140', PAPER_WHITE, 0.85),
        circle(85, 80, 4, ACCENT),
        circle(115, 80, 4, ACCENT),
        circle(100, 100, 5, '#E05050'),
        `<path d="M85,112 Q100,122 115,112" stroke="${ACCENT}" stroke-width="1.5" fill="none"/>`,
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // SNOWFLAKE (10 steps)
  // ════════════════════════════════════════
  {
    slug: 'snowflake',
    steps: [
      // Step 1: 半分に折る（長方形）
      [
        poly('30,30 170,30 170,170 30,170', PAPER_WHITE),
        dash(30, 100, 170, 100),
        curveArrow(100, 165, 105, 140, 100, 105),
      ].join('\n'),
      // Step 2: さらに半分→広げる（中心マーク）
      [
        poly('30,30 170,30 170,100 30,100', PAPER_WHITE),
        dash(100, 30, 100, 100),
        curveArrow(155, 40, 135, 55, 105, 50),
        text(100, 185, '中心に折り目'),
      ].join('\n'),
      // Step 3: 右下を左斜め上に折る（60度）
      [
        poly('30,30 170,30 170,100 30,100', PAPER_WHITE),
        `<line x1="100" y1="30" x2="100" y2="100" stroke="${CREASE}" stroke-width="1"/>`,
        poly('170,100 100,55 140,30 170,30', '#B3E5FC', 0.5),
        curveArrow(165, 95, 145, 75, 110, 58),
        text(100, 185, '60度の角度'),
      ].join('\n'),
      // Step 4: 左を右に折り重ねる
      [
        poly('30,30 170,30 170,100 30,100', PAPER_WHITE),
        poly('30,30 30,100 80,55 60,30', '#B3E5FC', 0.5),
        poly('170,100 100,55 140,30 170,30', '#B3E5FC', 0.5),
        curveArrow(35, 55, 55, 50, 75, 55),
        text(100, 185, '左を折り重ねる'),
      ].join('\n'),
      // Step 5: くさび形になる
      [
        poly('80,30 140,30 110,100', '#B3E5FC'),
        poly('80,30 110,100 95,65', PAPER_WHITE, 0.3),
        text(100, 185, 'くさび形'),
      ].join('\n'),
      // Step 6: さらに半分に折る
      [
        poly('80,30 140,30 110,100', '#B3E5FC'),
        dash(110, 30, 95, 100),
        curveArrow(130, 50, 120, 55, 108, 60),
        text(100, 185, 'さらに半分'),
      ].join('\n'),
      // Step 7: 上の不揃いな部分を切り落とす
      [
        poly('90,40 120,40 105,110', '#B3E5FC'),
        `<line x1="80" y1="55" x2="130" y2="45" stroke="${ARROW_COLOR}" stroke-width="2" stroke-dasharray="4,3"/>`,
        text(140, 50, '切る'),
        text(100, 185, '先端を切り揃える'),
      ].join('\n'),
      // Step 8: 両辺に模様を切る
      [
        poly('90,35 120,35 105,120', '#B3E5FC'),
        `<path d="M92,55 L98,50 L92,65" stroke="${ARROW_COLOR}" stroke-width="1.5" fill="none"/>`,
        `<path d="M94,80 L100,75 L94,90" stroke="${ARROW_COLOR}" stroke-width="1.5" fill="none"/>`,
        `<path d="M118,50 L112,45 L118,60" stroke="${ARROW_COLOR}" stroke-width="1.5" fill="none"/>`,
        `<path d="M116,72 L110,67 L116,82" stroke="${ARROW_COLOR}" stroke-width="1.5" fill="none"/>`,
        text(100, 185, '模様を切り抜く'),
      ].join('\n'),
      // Step 9: 切り方は自由
      [
        poly('90,35 120,35 105,120', '#B3E5FC'),
        `<path d="M93,50 L100,45 L93,58 L99,55 L93,68" stroke="${ARROW_COLOR}" stroke-width="1.5" fill="none"/>`,
        `<path d="M117,48 L110,43 L117,56 L111,53 L117,66" stroke="${ARROW_COLOR}" stroke-width="1.5" fill="none"/>`,
        circle(105, 85, 4, `${BG}`),
        circle(100, 100, 3, `${BG}`),
        text(100, 185, '自由にデザイン'),
      ].join('\n'),
      // Step 10: 広げて完成
      [
        `<line x1="100" y1="30" x2="100" y2="170" stroke="#5B8DB8" stroke-width="3" opacity="0.8"/>`,
        `<line x1="40" y1="65" x2="160" y2="135" stroke="#5B8DB8" stroke-width="3" opacity="0.8"/>`,
        `<line x1="40" y1="135" x2="160" y2="65" stroke="#5B8DB8" stroke-width="3" opacity="0.8"/>`,
        `<line x1="100" y1="50" x2="90" y2="42" stroke="#5B8DB8" stroke-width="2" opacity="0.6"/>`,
        `<line x1="100" y1="50" x2="110" y2="42" stroke="#5B8DB8" stroke-width="2" opacity="0.6"/>`,
        `<line x1="100" y1="150" x2="90" y2="158" stroke="#5B8DB8" stroke-width="2" opacity="0.6"/>`,
        `<line x1="100" y1="150" x2="110" y2="158" stroke="#5B8DB8" stroke-width="2" opacity="0.6"/>`,
        circle(100, 100, 6, '#5B8DB840'),
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },

  // ════════════════════════════════════════
  // TANABATA (10 steps)
  // ════════════════════════════════════════
  {
    slug: 'tanabata',
    steps: [
      // -- Star (6 steps) --
      // Step 1: 半分に折る（長方形）
      [
        poly('40,40 160,40 160,160 40,160', '#F5C518'),
        dash(40, 100, 160, 100),
        curveArrow(100, 155, 105, 130, 100, 105),
        text(100, 185, '小さい色紙'),
      ].join('\n'),
      // Step 2: 右半分を斜め上に折る
      [
        poly('40,60 160,60 160,140 40,140', '#F5C518'),
        poly('100,60 160,60 160,140 130,100', '#D4A843', 0.5),
        curveArrow(155, 130, 145, 100, 135, 75),
        text(100, 185, '斜めに折る'),
      ].join('\n'),
      // Step 3: 左を後ろに折る
      [
        poly('40,60 160,60 130,100 160,140 40,140', '#F5C518'),
        poly('40,60 40,140 70,100', '#D4A843', 0.5),
        curveArrow(42, 100, 50, 95, 68, 98),
        text(100, 185, '左を後ろへ'),
      ].join('\n'),
      // Step 4: 斜めに切る
      [
        poly('65,55 135,55 105,130', '#F5C518'),
        `<line x1="55" y1="100" x2="145" y2="70" stroke="${ARROW_COLOR}" stroke-width="2" stroke-dasharray="5,3"/>`,
        text(150, 75, '切る'),
        text(100, 185, '斜めにカット'),
      ].join('\n'),
      // Step 5: 開くと星形
      [
        `<polygon points="100,30 112,70 155,70 120,95 132,135 100,112 68,135 80,95 45,70 88,70" fill="#F5C518" opacity="0.85"/>`,
        `<polygon points="100,38 107,68 100,65 93,68" fill="#FFF" opacity="0.2"/>`,
        curveArrow(55, 55, 50, 45, 60, 38),
        text(45, 42, '開く'),
      ].join('\n'),
      // Step 6: 折り目を整える
      [
        `<polygon points="100,30 112,70 155,70 120,95 132,135 100,112 68,135 80,95 45,70 88,70" fill="#F5C518" opacity="0.9"/>`,
        text(100, 185, '星1個の完成！'),
      ].join('\n'),
      // -- Garland (4 steps) --
      // Step 7: 複数の星を作る
      [
        `<polygon points="50,55 56,70 72,70 59,80 64,95 50,85 36,95 41,80 28,70 44,70" fill="#F5C518" opacity="0.9"/>`,
        `<polygon points="100,45 106,60 122,60 109,70 114,85 100,75 86,85 91,70 78,60 94,60" fill="#E05050" opacity="0.9"/>`,
        `<polygon points="150,55 156,70 172,70 159,80 164,95 150,85 136,95 141,80 128,70 144,70" fill="#5B8DB8" opacity="0.9"/>`,
        `<polygon points="75,110 81,125 97,125 84,135 89,150 75,140 61,150 66,135 53,125 69,125" fill="#9C6BAE" opacity="0.9"/>`,
        `<polygon points="125,110 131,125 147,125 134,135 139,150 125,140 111,150 116,135 103,125 119,125" fill="#7B9E6B" opacity="0.9"/>`,
        text(100, 185, '5-6個作る'),
      ].join('\n'),
      // Step 8: 糸を用意する
      [
        `<line x1="20" y1="100" x2="180" y2="100" stroke="${ACCENT}" stroke-width="1.5"/>`,
        text(100, 85, '60-80cm の糸'),
        text(100, 185, '糸を準備'),
      ].join('\n'),
      // Step 9: 星を糸に貼る
      [
        `<line x1="20" y1="100" x2="180" y2="100" stroke="${ACCENT}" stroke-width="1.5"/>`,
        `<polygon points="40,85 44,93 52,93 46,99 48,107 40,102 32,107 34,99 28,93 36,93" fill="#F5C518" opacity="0.9"/>`,
        `<polygon points="75,85 79,93 87,93 81,99 83,107 75,102 67,107 69,99 63,93 71,93" fill="#E05050" opacity="0.9"/>`,
        `<polygon points="110,85 114,93 122,93 116,99 118,107 110,102 102,107 104,99 98,93 106,93" fill="#5B8DB8" opacity="0.9"/>`,
        `<polygon points="145,85 149,93 157,93 151,99 153,107 145,102 137,107 139,99 133,93 141,93" fill="#9C6BAE" opacity="0.9"/>`,
        text(100, 185, '等間隔に貼る'),
      ].join('\n'),
      // Step 10: 完成（笹に飾る）
      [
        `<rect x="95" y="20" width="10" height="160" rx="2" fill="#7B9E6B" opacity="0.6"/>`,
        `<polygon points="80,40 70,65 85,60" fill="#7B9E6B" opacity="0.7"/>`,
        `<polygon points="120,55 130,80 115,75" fill="#7B9E6B" opacity="0.7"/>`,
        `<line x1="60" y1="90" x2="140" y2="90" stroke="${ACCENT}" stroke-width="1"/>`,
        `<polygon points="70,78 74,86 82,86 76,92 78,100 70,95 62,100 64,92 58,86 66,86" fill="#F5C518" opacity="0.9"/>`,
        `<polygon points="100,78 104,86 112,86 106,92 108,100 100,95 92,100 94,92 88,86 96,86" fill="#E05050" opacity="0.9"/>`,
        `<polygon points="130,78 134,86 142,86 136,92 138,100 130,95 122,100 124,92 118,86 126,86" fill="#5B8DB8" opacity="0.9"/>`,
        `<rect x="85" y="110" width="30" height="20" rx="2" fill="${PAPER_WHITE}" opacity="0.6"/>`,
        text(100, 185, '完成！'),
      ].join('\n'),
    ],
  },
];

// ── メイン処理 ──
const baseDir = path.join(process.cwd(), 'public', 'images', 'origami', 'steps');

let totalCount = 0;

for (const { slug, steps } of allSteps) {
  const dir = path.join(baseDir, slug);
  fs.mkdirSync(dir, { recursive: true });

  for (let i = 0; i < steps.length; i++) {
    const filePath = path.join(dir, `step-${i + 1}.svg`);
    fs.writeFileSync(filePath, svg(steps[i]), 'utf8');
    totalCount++;
  }
  console.log(`  ✓ ${slug}: ${steps.length} steps`);
}

console.log(`\n✓ Generated ${totalCount} step SVG files in ${baseDir}`);
