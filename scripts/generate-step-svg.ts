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
