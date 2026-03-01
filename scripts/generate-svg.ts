import fs from 'fs';
import path from 'path';

// カテゴリ別背景色
const categoryColors: Record<string, { bg: string; accent: string }> = {
  animals: { bg: '#FFF3E0', accent: '#E07B54' },
  flowers: { bg: '#FDE7F0', accent: '#D4618C' },
  food: { bg: '#E8F5E9', accent: '#7B9E6B' },
  vehicles: { bg: '#E3F2FD', accent: '#5B8DB8' },
  items: { bg: '#F3E5F5', accent: '#9C6BAE' },
  geometric: { bg: '#E0F7FA', accent: '#4DAAAF' },
  seasonal: { bg: '#FFF8E1', accent: '#D4A843' },
};

interface SvgDef {
  slug: string;
  category: string;
  shapes: string;
}

function wrap(shapes: string, bg: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
<rect width="200" height="200" rx="16" fill="${bg}"/>
${shapes}
</svg>`;
}

// 折り紙風SVG定義
const defs: SvgDef[] = [
  // === ANIMALS ===
  {
    slug: 'crane',
    category: 'animals',
    shapes: `<polygon points="100,30 60,100 100,85 140,100" fill="#E07B54" opacity="0.9"/>
<polygon points="100,85 60,100 80,150 100,130 120,150 140,100" fill="#D06A44" opacity="0.9"/>
<line x1="100" y1="30" x2="45" y2="55" stroke="#E07B54" stroke-width="3"/>
<polygon points="45,55 35,50 40,60" fill="#E07B54"/>
<line x1="60" y1="100" x2="30" y2="160" stroke="#D06A44" stroke-width="2"/>
<line x1="140" y1="100" x2="170" y2="160" stroke="#D06A44" stroke-width="2"/>`,
  },
  {
    slug: 'cat',
    category: 'animals',
    shapes: `<polygon points="60,60 100,45 140,60 140,130 100,145 60,130" fill="#E07B54" opacity="0.9"/>
<polygon points="60,60 40,35 70,70" fill="#D06A44"/>
<polygon points="140,60 160,35 130,70" fill="#D06A44"/>
<circle cx="82" cy="90" r="5" fill="#3D2B1F"/>
<circle cx="118" cy="90" r="5" fill="#3D2B1F"/>
<polygon points="100,102 95,108 105,108" fill="#D06A44"/>
<line x1="70" y1="105" x2="45" y2="100" stroke="#3D2B1F" stroke-width="1.5"/>
<line x1="70" y1="108" x2="45" y2="112" stroke="#3D2B1F" stroke-width="1.5"/>
<line x1="130" y1="105" x2="155" y2="100" stroke="#3D2B1F" stroke-width="1.5"/>
<line x1="130" y1="108" x2="155" y2="112" stroke="#3D2B1F" stroke-width="1.5"/>`,
  },
  {
    slug: 'dog',
    category: 'animals',
    shapes: `<polygon points="65,55 135,55 145,130 100,150 55,130" fill="#E07B54" opacity="0.9"/>
<polygon points="65,55 40,80 55,95 65,75" fill="#D06A44"/>
<polygon points="135,55 160,80 145,95 135,75" fill="#D06A44"/>
<circle cx="82" cy="90" r="5" fill="#3D2B1F"/>
<circle cx="118" cy="90" r="5" fill="#3D2B1F"/>
<ellipse cx="100" cy="110" rx="12" ry="8" fill="#D06A44"/>
<circle cx="100" cy="108" r="4" fill="#3D2B1F"/>`,
  },
  {
    slug: 'butterfly',
    category: 'animals',
    shapes: `<polygon points="100,50 60,70 50,120 100,100" fill="#E07B54" opacity="0.8"/>
<polygon points="100,50 140,70 150,120 100,100" fill="#D06A44" opacity="0.8"/>
<polygon points="100,100 70,130 60,160 100,140" fill="#E07B54" opacity="0.6"/>
<polygon points="100,100 130,130 140,160 100,140" fill="#D06A44" opacity="0.6"/>
<line x1="100" y1="50" x2="100" y2="150" stroke="#3D2B1F" stroke-width="2"/>
<circle cx="85" cy="85" r="6" fill="#FFF3E0" opacity="0.6"/>
<circle cx="115" cy="85" r="6" fill="#FFF3E0" opacity="0.6"/>`,
  },
  {
    slug: 'elephant',
    category: 'animals',
    shapes: `<polygon points="60,60 140,60 150,120 130,140 70,140 50,120" fill="#E07B54" opacity="0.9"/>
<polygon points="60,60 40,85 45,110 50,120 55,90" fill="#D06A44"/>
<polygon points="140,60 160,85 155,110 150,120 145,90" fill="#D06A44"/>
<path d="M70,100 Q60,130 55,160 Q65,155 70,140" fill="#D06A44"/>
<circle cx="80" cy="85" r="5" fill="#3D2B1F"/>
<circle cx="120" cy="85" r="5" fill="#3D2B1F"/>`,
  },
  {
    slug: 'fish',
    category: 'animals',
    shapes: `<polygon points="40,100 100,60 160,100 100,140" fill="#E07B54" opacity="0.9"/>
<polygon points="40,100 25,75 25,125" fill="#D06A44"/>
<circle cx="125" cy="95" r="5" fill="#3D2B1F"/>
<line x1="80" y1="85" x2="80" y2="115" stroke="#D06A44" stroke-width="1.5" opacity="0.5"/>
<line x1="95" y1="80" x2="95" y2="120" stroke="#D06A44" stroke-width="1.5" opacity="0.5"/>`,
  },
  {
    slug: 'frog',
    category: 'animals',
    shapes: `<polygon points="55,70 145,70 155,120 100,150 45,120" fill="#7B9E6B" opacity="0.9"/>
<circle cx="70" cy="60" r="14" fill="#7B9E6B"/>
<circle cx="130" cy="60" r="14" fill="#7B9E6B"/>
<circle cx="70" cy="58" r="6" fill="#FFF"/>
<circle cx="130" cy="58" r="6" fill="#FFF"/>
<circle cx="72" cy="57" r="3" fill="#3D2B1F"/>
<circle cx="132" cy="57" r="3" fill="#3D2B1F"/>
<path d="M85,105 Q100,115 115,105" stroke="#3D2B1F" stroke-width="2" fill="none"/>
<polygon points="45,120 25,145 50,140" fill="#7B9E6B" opacity="0.7"/>
<polygon points="155,120 175,145 150,140" fill="#7B9E6B" opacity="0.7"/>`,
  },
  {
    slug: 'penguin',
    category: 'animals',
    shapes: `<polygon points="70,50 130,50 140,140 100,160 60,140" fill="#3D2B1F" opacity="0.9"/>
<polygon points="80,70 120,70 125,130 100,145 75,130" fill="#FFF" opacity="0.9"/>
<circle cx="85" cy="65" r="4" fill="#FFF"/>
<circle cx="115" cy="65" r="4" fill="#FFF"/>
<circle cx="86" cy="64" r="2" fill="#3D2B1F"/>
<circle cx="116" cy="64" r="2" fill="#3D2B1F"/>
<polygon points="100,75 95,83 105,83" fill="#E07B54"/>
<polygon points="60,90 40,115 60,110" fill="#3D2B1F" opacity="0.8"/>
<polygon points="140,90 160,115 140,110" fill="#3D2B1F" opacity="0.8"/>`,
  },
  {
    slug: 'rabbit',
    category: 'animals',
    shapes: `<polygon points="70,80 130,80 135,140 100,155 65,140" fill="#E07B54" opacity="0.9"/>
<rect x="75" y="35" width="15" height="48" rx="7" fill="#E07B54" opacity="0.9"/>
<rect x="110" y="35" width="15" height="48" rx="7" fill="#E07B54" opacity="0.9"/>
<rect x="78" y="40" width="9" height="30" rx="4" fill="#FDE7F0"/>
<rect x="113" y="40" width="9" height="30" rx="4" fill="#FDE7F0"/>
<circle cx="85" cy="100" r="4" fill="#3D2B1F"/>
<circle cx="115" cy="100" r="4" fill="#3D2B1F"/>
<polygon points="100,112 96,118 104,118" fill="#D06A44"/>
<circle cx="78" cy="118" r="6" fill="#FDE7F0" opacity="0.5"/>
<circle cx="122" cy="118" r="6" fill="#FDE7F0" opacity="0.5"/>`,
  },
  {
    slug: 'swan',
    category: 'animals',
    shapes: `<path d="M70,60 Q60,40 65,25 Q75,30 70,50" fill="#E07B54"/>
<polygon points="65,25 55,22 60,30" fill="#D06A44"/>
<polygon points="70,55 140,80 160,100 140,130 70,140 50,110" fill="#FFF" stroke="#E8D5C4" stroke-width="1"/>
<polygon points="140,100 170,90 165,120 150,115" fill="#FFF" stroke="#E8D5C4" stroke-width="1"/>
<circle cx="68" cy="38" r="2.5" fill="#3D2B1F"/>`,
  },

  // === FLOWERS ===
  {
    slug: 'cherry-blossom',
    category: 'flowers',
    shapes: `<circle cx="100" cy="85" r="10" fill="#D4618C" opacity="0.3"/>
<polygon points="100,45 93,70 107,70" fill="#D4618C" opacity="0.85"/>
<polygon points="130,65 110,78 115,92" fill="#D4618C" opacity="0.85"/>
<polygon points="120,100 108,88 102,102" fill="#D4618C" opacity="0.85"/>
<polygon points="80,100 92,88 98,102" fill="#D4618C" opacity="0.85"/>
<polygon points="70,65 90,78 85,92" fill="#D4618C" opacity="0.85"/>
<circle cx="100" cy="85" r="6" fill="#F5C518" opacity="0.8"/>
<line x1="100" y1="110" x2="100" y2="165" stroke="#7B9E6B" stroke-width="2.5"/>
<polygon points="102,135 115,125 110,140" fill="#7B9E6B" opacity="0.7"/>`,
  },
  {
    slug: 'lily',
    category: 'flowers',
    shapes: `<polygon points="100,40 80,90 100,80 120,90" fill="#D4618C" opacity="0.85"/>
<polygon points="100,40 120,85 115,95 100,80" fill="#C05078" opacity="0.7"/>
<polygon points="80,90 60,120 100,105 100,80" fill="#D4618C" opacity="0.75"/>
<polygon points="120,90 140,120 100,105 100,80" fill="#C05078" opacity="0.65"/>
<line x1="100" y1="105" x2="100" y2="165" stroke="#7B9E6B" stroke-width="3"/>
<polygon points="98,130 80,140 85,128" fill="#7B9E6B" opacity="0.7"/>
<polygon points="102,145 120,150 115,140" fill="#7B9E6B" opacity="0.7"/>`,
  },
  {
    slug: 'lotus',
    category: 'flowers',
    shapes: `<ellipse cx="100" cy="100" rx="45" ry="15" fill="#7B9E6B" opacity="0.3"/>
<polygon points="100,55 85,90 100,85 115,90" fill="#FDE7F0" opacity="0.9"/>
<polygon points="75,70 65,95 80,90 85,90" fill="#D4618C" opacity="0.7"/>
<polygon points="125,70 135,95 120,90 115,90" fill="#D4618C" opacity="0.7"/>
<polygon points="60,85 55,105 75,95" fill="#D4618C" opacity="0.5"/>
<polygon points="140,85 145,105 125,95" fill="#D4618C" opacity="0.5"/>
<circle cx="100" cy="82" r="5" fill="#F5C518" opacity="0.6"/>`,
  },
  {
    slug: 'morning-glory',
    category: 'flowers',
    shapes: `<polygon points="100,50 70,80 65,110 100,120 135,110 130,80" fill="#7B68D4" opacity="0.8"/>
<polygon points="100,50 80,70 85,100 100,105 115,100 120,70" fill="#9B88E8" opacity="0.6"/>
<circle cx="100" cy="88" r="8" fill="#FFF" opacity="0.7"/>
<circle cx="100" cy="88" r="4" fill="#F5C518" opacity="0.8"/>
<line x1="100" y1="120" x2="100" y2="165" stroke="#7B9E6B" stroke-width="2"/>
<path d="M100,140 Q120,135 130,145" stroke="#7B9E6B" stroke-width="2" fill="none"/>
<polygon points="130,145 140,140 135,150" fill="#7B9E6B" opacity="0.7"/>`,
  },
  {
    slug: 'rose',
    category: 'flowers',
    shapes: `<circle cx="100" cy="85" r="30" fill="#D4618C" opacity="0.3"/>
<path d="M100,60 Q115,65 110,80 Q120,75 115,90 Q125,88 118,100 Q110,95 100,100 Q90,95 82,100 Q75,88 85,90 Q80,75 90,80 Q85,65 100,60Z" fill="#D4618C" opacity="0.85"/>
<path d="M100,70 Q108,75 105,85 Q100,80 95,85 Q92,75 100,70Z" fill="#C05078" opacity="0.7"/>
<line x1="100" y1="105" x2="100" y2="165" stroke="#7B9E6B" stroke-width="3"/>
<polygon points="98,125 78,118 82,130" fill="#7B9E6B" opacity="0.7"/>
<polygon points="102,140 122,135 118,145" fill="#7B9E6B" opacity="0.7"/>`,
  },
  {
    slug: 'sunflower',
    category: 'flowers',
    shapes: `<polygon points="100,40 92,60 108,60" fill="#F5C518" opacity="0.9"/>
<polygon points="130,50 118,68 130,75" fill="#F5C518" opacity="0.9"/>
<polygon points="145,80 128,82 130,98" fill="#F5C518" opacity="0.9"/>
<polygon points="140,110 125,100 120,115" fill="#F5C518" opacity="0.9"/>
<polygon points="60,50 82,68 70,75" fill="#F5C518" opacity="0.9"/>
<polygon points="55,80 72,82 70,98" fill="#F5C518" opacity="0.9"/>
<polygon points="60,110 75,100 80,115" fill="#F5C518" opacity="0.9"/>
<polygon points="100,130 92,112 108,112" fill="#F5C518" opacity="0.9"/>
<circle cx="100" cy="88" r="18" fill="#8B5E3C"/>
<circle cx="100" cy="88" r="12" fill="#6B4226" opacity="0.6"/>
<line x1="100" y1="130" x2="100" y2="170" stroke="#7B9E6B" stroke-width="3"/>`,
  },
  {
    slug: 'tulip',
    category: 'flowers',
    shapes: `<polygon points="100,45 75,90 100,80 125,90" fill="#D4618C" opacity="0.9"/>
<polygon points="75,90 65,100 85,105 100,80" fill="#C05078" opacity="0.8"/>
<polygon points="125,90 135,100 115,105 100,80" fill="#C05078" opacity="0.8"/>
<line x1="100" y1="100" x2="100" y2="165" stroke="#7B9E6B" stroke-width="3"/>
<polygon points="98,130 75,125 80,138" fill="#7B9E6B" opacity="0.7"/>
<polygon points="102,145 125,140 120,153" fill="#7B9E6B" opacity="0.7"/>`,
  },

  // === FOOD ===
  {
    slug: 'apple',
    category: 'food',
    shapes: `<circle cx="100" cy="105" r="38" fill="#E05050" opacity="0.85"/>
<ellipse cx="88" cy="105" rx="18" ry="35" fill="#D04040" opacity="0.4"/>
<path d="M100,67 Q105,50 110,55" stroke="#7B9E6B" stroke-width="2.5" fill="none"/>
<polygon points="110,55 118,45 112,60" fill="#7B9E6B"/>
<ellipse cx="110" cy="90" rx="5" ry="8" fill="#FFF" opacity="0.2"/>`,
  },
  {
    slug: 'cake',
    category: 'food',
    shapes: `<rect x="55" y="90" width="90" height="55" rx="5" fill="#F5D6B8" opacity="0.9"/>
<rect x="55" y="82" width="90" height="15" rx="5" fill="#FFF" opacity="0.9"/>
<rect x="60" y="78" width="80" height="5" rx="2" fill="#D4618C" opacity="0.7"/>
<rect x="97" y="55" width="6" height="30" rx="2" fill="#F5C518"/>
<ellipse cx="100" cy="52" rx="5" ry="6" fill="#E07B54" opacity="0.8"/>
<line x1="70" y1="105" x2="70" y2="130" stroke="#E8D5C4" stroke-width="1" opacity="0.5"/>
<line x1="100" y1="95" x2="100" y2="140" stroke="#E8D5C4" stroke-width="1" opacity="0.5"/>
<line x1="130" y1="105" x2="130" y2="130" stroke="#E8D5C4" stroke-width="1" opacity="0.5"/>`,
  },
  {
    slug: 'candy',
    category: 'food',
    shapes: `<circle cx="100" cy="100" r="28" fill="#E07B54" opacity="0.85"/>
<path d="M80,80 Q100,95 80,120" stroke="#FFF" stroke-width="4" fill="none" opacity="0.3"/>
<path d="M95,75 Q115,95 95,125" stroke="#FFF" stroke-width="4" fill="none" opacity="0.3"/>
<polygon points="72,82 55,60 65,58 78,78" fill="#E07B54" opacity="0.7"/>
<polygon points="128,118 145,140 135,142 122,122" fill="#E07B54" opacity="0.7"/>
<line x1="55,60" y1="55,60" x2="50" y2="55" stroke="#D06A44" stroke-width="2"/>`,
  },
  {
    slug: 'ice-cream',
    category: 'food',
    shapes: `<polygon points="80,100 120,100 100,160" fill="#F5D6B8" opacity="0.9"/>
<line x1="85" y1="108" x2="100" y2="155" stroke="#E8C5A0" stroke-width="1"/>
<line x1="115" y1="108" x2="100" y2="155" stroke="#E8C5A0" stroke-width="1"/>
<circle cx="100" cy="80" r="25" fill="#FDE7F0" opacity="0.9"/>
<circle cx="85" cy="75" r="18" fill="#D4618C" opacity="0.7"/>
<circle cx="115" cy="75" r="18" fill="#F5C518" opacity="0.7"/>
<circle cx="100" cy="65" r="5" fill="#E05050" opacity="0.8"/>`,
  },
  {
    slug: 'mushroom',
    category: 'food',
    shapes: `<rect x="88" y="105" width="24" height="45" rx="5" fill="#F5D6B8" opacity="0.9"/>
<ellipse cx="100" cy="105" rx="42" ry="30" fill="#E05050" opacity="0.8"/>
<circle cx="85" cy="90" r="6" fill="#FFF" opacity="0.6"/>
<circle cx="110" cy="85" r="8" fill="#FFF" opacity="0.6"/>
<circle cx="95" cy="105" r="5" fill="#FFF" opacity="0.6"/>
<circle cx="120" cy="100" r="4" fill="#FFF" opacity="0.6"/>`,
  },
  {
    slug: 'strawberry',
    category: 'food',
    shapes: `<polygon points="100,45 65,85 70,130 100,150 130,130 135,85" fill="#E05050" opacity="0.85"/>
<polygon points="80,48 100,45 100,55 85,55" fill="#7B9E6B"/>
<polygon points="100,45 120,48 115,55 100,55" fill="#7B9E6B"/>
<circle cx="88" cy="80" r="2" fill="#F5C518" opacity="0.7"/>
<circle cx="112" cy="85" r="2" fill="#F5C518" opacity="0.7"/>
<circle cx="95" cy="100" r="2" fill="#F5C518" opacity="0.7"/>
<circle cx="108" cy="105" r="2" fill="#F5C518" opacity="0.7"/>
<circle cx="100" cy="120" r="2" fill="#F5C518" opacity="0.7"/>
<circle cx="88" cy="115" r="2" fill="#F5C518" opacity="0.7"/>
<circle cx="115" cy="118" r="2" fill="#F5C518" opacity="0.7"/>`,
  },
  {
    slug: 'watermelon',
    category: 'food',
    shapes: `<path d="M45,120 Q100,30 155,120 Z" fill="#7B9E6B" opacity="0.9"/>
<path d="M50,120 Q100,38 150,120 Z" fill="#E05050" opacity="0.85"/>
<path d="M55,120 Q100,118 145,120 Z" fill="#FFF" opacity="0.3"/>
<circle cx="85" cy="95" r="3" fill="#3D2B1F" opacity="0.7"/>
<circle cx="100" cy="85" r="3" fill="#3D2B1F" opacity="0.7"/>
<circle cx="115" cy="95" r="3" fill="#3D2B1F" opacity="0.7"/>
<circle cx="92" cy="108" r="3" fill="#3D2B1F" opacity="0.7"/>
<circle cx="108" cy="108" r="3" fill="#3D2B1F" opacity="0.7"/>`,
  },

  // === VEHICLES ===
  {
    slug: 'airplane',
    category: 'vehicles',
    shapes: `<polygon points="100,35 90,90 100,85 110,90" fill="#5B8DB8" opacity="0.9"/>
<polygon points="90,90 40,110 60,90 85,85" fill="#5B8DB8" opacity="0.7"/>
<polygon points="110,90 160,110 140,90 115,85" fill="#5B8DB8" opacity="0.7"/>
<polygon points="100,85 95,140 100,135 105,140" fill="#5B8DB8" opacity="0.9"/>
<polygon points="95,135 75,145 85,135" fill="#5B8DB8" opacity="0.6"/>
<polygon points="105,135 125,145 115,135" fill="#5B8DB8" opacity="0.6"/>`,
  },
  {
    slug: 'boat',
    category: 'vehicles',
    shapes: `<polygon points="40,110 100,130 160,110 150,140 50,140" fill="#5B8DB8" opacity="0.85"/>
<rect x="90" y="65" width="5" height="48" fill="#8B5E3C"/>
<polygon points="95,65 95,95 140,90" fill="#FFF" opacity="0.85" stroke="#E8D5C4" stroke-width="1"/>
<path d="M35,150 Q65,160 100,150 Q135,140 165,150" stroke="#5B8DB8" stroke-width="2" fill="none" opacity="0.4"/>`,
  },
  {
    slug: 'car',
    category: 'vehicles',
    shapes: `<rect x="45" y="90" width="110" height="40" rx="8" fill="#5B8DB8" opacity="0.9"/>
<polygon points="65,90 80,60 130,60 145,90" fill="#5B8DB8" opacity="0.75"/>
<rect x="83" y="65" width="20" height="22" rx="2" fill="#C5DFF0" opacity="0.8"/>
<rect x="110" y="65" width="20" height="22" rx="2" fill="#C5DFF0" opacity="0.6"/>
<circle cx="75" cy="133" r="12" fill="#3D2B1F" opacity="0.8"/>
<circle cx="75" cy="133" r="6" fill="#888"/>
<circle cx="135" cy="133" r="12" fill="#3D2B1F" opacity="0.8"/>
<circle cx="135" cy="133" r="6" fill="#888"/>`,
  },
  {
    slug: 'helicopter',
    category: 'vehicles',
    shapes: `<ellipse cx="100" cy="105" rx="40" ry="22" fill="#5B8DB8" opacity="0.85"/>
<circle cx="110" cy="100" r="10" fill="#C5DFF0" opacity="0.7"/>
<rect x="135" y="98" width="35" height="6" rx="2" fill="#5B8DB8" opacity="0.7"/>
<polygon points="170,98 175,85 170,104" fill="#5B8DB8" opacity="0.6"/>
<line x1="60" y1="75" x2="140" y2="75" stroke="#3D2B1F" stroke-width="2"/>
<ellipse cx="100" cy="75" rx="50" ry="3" fill="#3D2B1F" opacity="0.3"/>
<line x1="100" y1="83" x2="100" y2="75" stroke="#3D2B1F" stroke-width="2"/>
<circle cx="90" cy="130" r="5" fill="#3D2B1F" opacity="0.5"/>`,
  },
  {
    slug: 'hot-air-balloon',
    category: 'vehicles',
    shapes: `<ellipse cx="100" cy="80" rx="38" ry="45" fill="#E07B54" opacity="0.85"/>
<path d="M62,80 Q100,90 138,80" stroke="#F5C518" stroke-width="3" fill="none" opacity="0.6"/>
<path d="M68,65 Q100,55 132,65" stroke="#5B8DB8" stroke-width="3" fill="none" opacity="0.6"/>
<line x1="75" y1="120" x2="85" y2="145" stroke="#8B5E3C" stroke-width="1.5"/>
<line x1="125" y1="120" x2="115" y2="145" stroke="#8B5E3C" stroke-width="1.5"/>
<rect x="82" y="145" width="36" height="18" rx="3" fill="#8B5E3C" opacity="0.8"/>`,
  },
  {
    slug: 'rocket',
    category: 'vehicles',
    shapes: `<polygon points="100,30 85,80 100,75 115,80" fill="#5B8DB8" opacity="0.9"/>
<rect x="85" y="75" width="30" height="55" rx="3" fill="#5B8DB8" opacity="0.85"/>
<circle cx="100" cy="95" r="8" fill="#C5DFF0" opacity="0.7"/>
<polygon points="85,115 70,140 85,130" fill="#E07B54" opacity="0.8"/>
<polygon points="115,115 130,140 115,130" fill="#E07B54" opacity="0.8"/>
<polygon points="90,130 100,155 110,130" fill="#F5C518" opacity="0.8"/>
<polygon points="95,130 100,148 105,130" fill="#E07B54" opacity="0.7"/>`,
  },
  {
    slug: 'train',
    category: 'vehicles',
    shapes: `<rect x="45" y="70" width="110" height="55" rx="10" fill="#5B8DB8" opacity="0.9"/>
<rect x="45" y="70" width="35" height="55" rx="10" fill="#4A7DA8" opacity="0.5"/>
<rect x="55" y="80" width="20" height="18" rx="3" fill="#C5DFF0" opacity="0.8"/>
<rect x="90" y="80" width="20" height="18" rx="3" fill="#C5DFF0" opacity="0.8"/>
<rect x="120" y="80" width="20" height="18" rx="3" fill="#C5DFF0" opacity="0.8"/>
<circle cx="65" cy="130" r="8" fill="#3D2B1F" opacity="0.8"/>
<circle cx="100" cy="130" r="8" fill="#3D2B1F" opacity="0.8"/>
<circle cx="135" cy="130" r="8" fill="#3D2B1F" opacity="0.8"/>
<rect x="40" y="125" width="120" height="3" fill="#3D2B1F" opacity="0.4"/>`,
  },

  // === ITEMS ===
  {
    slug: 'box',
    category: 'items',
    shapes: `<polygon points="100,50 160,80 160,130 100,160 40,130 40,80" fill="#9C6BAE" opacity="0.15"/>
<polygon points="100,50 160,80 160,130 100,160" fill="#9C6BAE" opacity="0.7"/>
<polygon points="100,50 40,80 40,130 100,160" fill="#B07DC0" opacity="0.8"/>
<polygon points="100,50 160,80 40,80" fill="#C490D2" opacity="0.6"/>
<line x1="100" y1="50" x2="100" y2="160" stroke="#9C6BAE" stroke-width="1" opacity="0.5"/>`,
  },
  {
    slug: 'crown',
    category: 'items',
    shapes: `<polygon points="45,130 55,70 80,100 100,55 120,100 145,70 155,130" fill="#F5C518" opacity="0.85"/>
<rect x="45" y="125" width="110" height="15" rx="3" fill="#D4A843" opacity="0.8"/>
<circle cx="100" cy="55" r="5" fill="#E05050" opacity="0.7"/>
<circle cx="55" cy="72" r="4" fill="#5B8DB8" opacity="0.7"/>
<circle cx="145" cy="72" r="4" fill="#5B8DB8" opacity="0.7"/>
<circle cx="100" cy="132" r="4" fill="#E05050" opacity="0.6"/>`,
  },
  {
    slug: 'heart',
    category: 'items',
    shapes: `<path d="M100,70 Q100,40 75,40 Q50,40 50,70 Q50,100 100,140 Q150,100 150,70 Q150,40 125,40 Q100,40 100,70Z" fill="#D4618C" opacity="0.85"/>
<path d="M100,75 Q100,50 80,48 Q65,48 60,65" fill="#E078A0" opacity="0.3"/>`,
  },
  {
    slug: 'ribbon',
    category: 'items',
    shapes: `<polygon points="100,80 70,60 50,40 75,65 100,55 125,65 150,40 130,60" fill="#D4618C" opacity="0.85"/>
<polygon points="100,80 70,60 55,100 100,85 145,100 130,60" fill="#C05078" opacity="0.7"/>
<polygon points="100,85 80,130 100,120 120,130" fill="#D4618C" opacity="0.8"/>
<ellipse cx="100" cy="80" rx="10" ry="8" fill="#9C6BAE" opacity="0.8"/>`,
  },
  {
    slug: 'shirt',
    category: 'items',
    shapes: `<polygon points="70,50 85,50 85,65 100,55 115,65 115,50 130,50 145,70 130,80 130,150 70,150 70,80 55,70" fill="#5B8DB8" opacity="0.85"/>
<polygon points="85,50 85,65 100,55 115,65 115,50" fill="#C5DFF0" opacity="0.6"/>
<line x1="100" y1="55" x2="100" y2="150" stroke="#4A7DA8" stroke-width="1" opacity="0.3"/>
<circle cx="100" cy="90" r="3" fill="#4A7DA8" opacity="0.5"/>
<circle cx="100" cy="110" r="3" fill="#4A7DA8" opacity="0.5"/>
<circle cx="100" cy="130" r="3" fill="#4A7DA8" opacity="0.5"/>`,
  },
  {
    slug: 'shuriken',
    category: 'items',
    shapes: `<polygon points="100,30 110,85 100,80 90,85" fill="#9C6BAE" opacity="0.85"/>
<polygon points="170,100 115,110 120,100 115,90" fill="#7B5A8E" opacity="0.85"/>
<polygon points="100,170 90,115 100,120 110,115" fill="#9C6BAE" opacity="0.85"/>
<polygon points="30,100 85,90 80,100 85,110" fill="#7B5A8E" opacity="0.85"/>
<circle cx="100" cy="100" r="8" fill="#B07DC0" opacity="0.6"/>`,
  },
  {
    slug: 'star',
    category: 'items',
    shapes: `<polygon points="100,30 112,75 160,75 120,105 135,150 100,122 65,150 80,105 40,75 88,75" fill="#F5C518" opacity="0.85"/>
<polygon points="100,40 108,75 100,70 92,75" fill="#FFF" opacity="0.2"/>`,
  },

  // === GEOMETRIC ===
  {
    slug: 'ball',
    category: 'geometric',
    shapes: `<circle cx="100" cy="100" r="42" fill="#4DAAAF" opacity="0.8"/>
<path d="M60,85 Q100,70 140,85" stroke="#FFF" stroke-width="2" fill="none" opacity="0.4"/>
<path d="M60,105 Q100,120 140,105" stroke="#FFF" stroke-width="2" fill="none" opacity="0.4"/>
<ellipse cx="100" cy="100" rx="42" ry="20" stroke="#FFF" stroke-width="1.5" fill="none" opacity="0.3" transform="rotate(90,100,100)"/>
<circle cx="85" cy="85" r="10" fill="#FFF" opacity="0.15"/>`,
  },
  {
    slug: 'cube',
    category: 'geometric',
    shapes: `<polygon points="100,40 155,70 155,130 100,160 45,130 45,70" fill="#4DAAAF" opacity="0.15"/>
<polygon points="100,40 155,70 155,130 100,160" fill="#4DAAAF" opacity="0.6"/>
<polygon points="100,40 45,70 45,130 100,160" fill="#5DBBBC" opacity="0.75"/>
<polygon points="100,40 155,70 45,70" fill="#6DCCCF" opacity="0.5"/>
<line x1="100" y1="100" x2="100" y2="160" stroke="#4DAAAF" stroke-width="1" opacity="0.6"/>
<line x1="100" y1="100" x2="155" y2="70" stroke="#4DAAAF" stroke-width="1" opacity="0.4"/>
<line x1="100" y1="100" x2="45" y2="70" stroke="#4DAAAF" stroke-width="1" opacity="0.4"/>`,
  },
  {
    slug: 'diamond',
    category: 'geometric',
    shapes: `<polygon points="100,30 145,100 100,170 55,100" fill="#4DAAAF" opacity="0.8"/>
<polygon points="100,30 120,100 100,170" fill="#3D9999" opacity="0.4"/>
<polygon points="100,30 80,100 100,100 120,100" fill="#6DCCCF" opacity="0.3"/>
<line x1="55" y1="100" x2="145" y2="100" stroke="#FFF" stroke-width="1" opacity="0.4"/>
<line x1="100" y1="30" x2="80" y2="100" stroke="#FFF" stroke-width="1" opacity="0.3"/>
<line x1="100" y1="30" x2="120" y2="100" stroke="#FFF" stroke-width="1" opacity="0.3"/>`,
  },
  {
    slug: 'hexagon',
    category: 'geometric',
    shapes: `<polygon points="100,35 150,60 150,115 100,140 50,115 50,60" fill="#4DAAAF" opacity="0.8"/>
<polygon points="100,35 150,60 100,88" fill="#5DBBBC" opacity="0.4"/>
<polygon points="150,60 150,115 100,88" fill="#3D9999" opacity="0.3"/>
<polygon points="50,60 100,35 100,88" fill="#6DCCCF" opacity="0.3"/>
<polygon points="100,155 120,162 100,170 80,162" fill="#4DAAAF" opacity="0.6"/>`,
  },
  {
    slug: 'pinwheel',
    category: 'geometric',
    shapes: `<polygon points="100,100 100,40 140,70" fill="#E07B54" opacity="0.8"/>
<polygon points="100,100 160,100 130,140" fill="#5B8DB8" opacity="0.8"/>
<polygon points="100,100 100,160 60,130" fill="#7B9E6B" opacity="0.8"/>
<polygon points="100,100 40,100 70,60" fill="#F5C518" opacity="0.8"/>
<circle cx="100" cy="100" r="6" fill="#3D2B1F" opacity="0.6"/>`,
  },
  {
    slug: 'spiral',
    category: 'geometric',
    shapes: `<path d="M100,60 Q130,60 130,90 Q130,120 100,120 Q75,120 75,95 Q75,75 100,75 Q118,75 118,95 Q118,110 100,110 Q88,110 88,95 Q88,85 100,85" stroke="#4DAAAF" stroke-width="4" fill="none" opacity="0.8"/>
<circle cx="100" cy="92" r="5" fill="#4DAAAF" opacity="0.6"/>`,
  },

  // === SEASONAL ===
  {
    slug: 'carp-streamer',
    category: 'seasonal',
    shapes: `<line x1="60" y1="25" x2="60" y2="170" stroke="#8B5E3C" stroke-width="3"/>
<circle cx="60" cy="25" r="5" fill="#F5C518"/>
<polygon points="60,40 60,70 140,55" fill="#E05050" opacity="0.8"/>
<circle cx="125" cy="55" r="4" fill="#FFF"/>
<circle cx="126" cy="54" r="2" fill="#3D2B1F"/>
<polygon points="60,80 60,105 135,92" fill="#5B8DB8" opacity="0.8"/>
<circle cx="120" cy="92" r="3.5" fill="#FFF"/>
<circle cx="121" cy="91" r="1.8" fill="#3D2B1F"/>
<polygon points="60,115 60,135 130,125" fill="#7B9E6B" opacity="0.8"/>
<circle cx="116" cy="125" r="3" fill="#FFF"/>
<circle cx="117" cy="124" r="1.5" fill="#3D2B1F"/>`,
  },
  {
    slug: 'christmas-tree',
    category: 'seasonal',
    shapes: `<polygon points="100,30 65,80 135,80" fill="#7B9E6B" opacity="0.85"/>
<polygon points="100,55 55,110 145,110" fill="#7B9E6B" opacity="0.8"/>
<polygon points="100,85 48,140 152,140" fill="#7B9E6B" opacity="0.75"/>
<rect x="90" y="140" width="20" height="18" rx="2" fill="#8B5E3C"/>
<circle cx="90" cy="70" r="4" fill="#E05050" opacity="0.7"/>
<circle cx="110" cy="95" r="4" fill="#F5C518" opacity="0.7"/>
<circle cx="85" cy="120" r="4" fill="#5B8DB8" opacity="0.7"/>
<circle cx="120" cy="125" r="4" fill="#E05050" opacity="0.7"/>
<polygon points="100,25 103,32 97,32" fill="#F5C518"/>`,
  },
  {
    slug: 'jack-o-lantern',
    category: 'seasonal',
    shapes: `<ellipse cx="100" cy="105" rx="42" ry="38" fill="#E07B54" opacity="0.9"/>
<ellipse cx="80" cy="105" rx="18" ry="35" fill="#D06A44" opacity="0.3"/>
<ellipse cx="120" cy="105" rx="18" ry="35" fill="#D06A44" opacity="0.3"/>
<polygon points="100,68 95,50 105,45 108,65" fill="#7B9E6B"/>
<polygon points="85,92 90,85 95,92" fill="#3D2B1F"/>
<polygon points="105,92 110,85 115,92" fill="#3D2B1F"/>
<path d="M78,115 Q90,130 100,115 Q110,130 122,115" stroke="#3D2B1F" stroke-width="2.5" fill="none"/>`,
  },
  {
    slug: 'kabuto',
    category: 'seasonal',
    shapes: `<polygon points="100,35 40,100 160,100" fill="#3D2B1F" opacity="0.85"/>
<polygon points="100,35 55,90 145,90" fill="#4A3728" opacity="0.5"/>
<polygon points="40,100 30,85 60,90" fill="#D4A843" opacity="0.8"/>
<polygon points="160,100 170,85 140,90" fill="#D4A843" opacity="0.8"/>
<polygon points="55,100 145,100 150,115 140,130 60,130 50,115" fill="#3D2B1F" opacity="0.7"/>
<circle cx="100" cy="80" r="8" fill="#D4A843" opacity="0.7"/>`,
  },
  {
    slug: 'santa',
    category: 'seasonal',
    shapes: `<polygon points="70,80 130,80 140,140 100,155 60,140" fill="#E05050" opacity="0.85"/>
<polygon points="100,35 70,80 130,80" fill="#E05050" opacity="0.85"/>
<circle cx="100" cy="30" r="10" fill="#FFF"/>
<circle cx="85" cy="100" r="4" fill="#3D2B1F"/>
<circle cx="115" cy="100" r="4" fill="#3D2B1F"/>
<circle cx="100" cy="115" r="5" fill="#E05050" opacity="0.6"/>
<rect x="60" y="75" width="80" height="10" rx="5" fill="#FFF" opacity="0.85"/>
<path d="M80,128 Q100,140 120,128" stroke="#3D2B1F" stroke-width="1.5" fill="none"/>`,
  },
  {
    slug: 'snowflake',
    category: 'seasonal',
    shapes: `<line x1="100" y1="35" x2="100" y2="165" stroke="#5B8DB8" stroke-width="3" opacity="0.8"/>
<line x1="44" y1="67" x2="156" y2="133" stroke="#5B8DB8" stroke-width="3" opacity="0.8"/>
<line x1="44" y1="133" x2="156" y2="67" stroke="#5B8DB8" stroke-width="3" opacity="0.8"/>
<line x1="100" y1="55" x2="88" y2="48" stroke="#5B8DB8" stroke-width="2" opacity="0.6"/>
<line x1="100" y1="55" x2="112" y2="48" stroke="#5B8DB8" stroke-width="2" opacity="0.6"/>
<line x1="100" y1="145" x2="88" y2="152" stroke="#5B8DB8" stroke-width="2" opacity="0.6"/>
<line x1="100" y1="145" x2="112" y2="152" stroke="#5B8DB8" stroke-width="2" opacity="0.6"/>
<circle cx="100" cy="100" r="6" fill="#5B8DB8" opacity="0.4"/>`,
  },
  {
    slug: 'tanabata',
    category: 'seasonal',
    shapes: `<rect x="95" y="25" width="10" height="150" rx="2" fill="#7B9E6B" opacity="0.6"/>
<polygon points="80,45 70,70 85,65" fill="#E05050" opacity="0.7"/>
<polygon points="120,55 130,80 115,75" fill="#5B8DB8" opacity="0.7"/>
<polygon points="75,90 65,115 80,110" fill="#F5C518" opacity="0.7"/>
<polygon points="125,100 135,125 120,120" fill="#D4618C" opacity="0.7"/>
<polygon points="80,130 70,155 85,150" fill="#9C6BAE" opacity="0.7"/>
<rect x="85" y="50" width="30" height="20" rx="2" fill="#FFF" opacity="0.6"/>
<line x1="90" y1="55" x2="110" y2="55" stroke="#3D2B1F" stroke-width="0.5" opacity="0.5"/>
<line x1="90" y1="60" x2="108" y2="60" stroke="#3D2B1F" stroke-width="0.5" opacity="0.5"/>
<line x1="90" y1="65" x2="105" y2="65" stroke="#3D2B1F" stroke-width="0.5" opacity="0.5"/>`,
  },
];

// --- メイン処理 ---
const outDir = path.join(process.cwd(), 'public', 'images', 'origami');
fs.mkdirSync(outDir, { recursive: true });

let count = 0;
for (const def of defs) {
  const colors = categoryColors[def.category] ?? categoryColors.items;
  const svg = wrap(def.shapes, colors.bg);
  const filePath = path.join(outDir, `${def.slug}.svg`);
  fs.writeFileSync(filePath, svg, 'utf8');
  count++;
}

console.log(`✓ Generated ${count} SVG files in ${outDir}`);

// 存在しないスラッグ用のフォールバック確認
const allSlugs = [
  'airplane','apple','ball','boat','box','butterfly','cake','candy','car',
  'carp-streamer','cat','cherry-blossom','christmas-tree','crane','crown',
  'cube','diamond','dog','elephant','fish','frog','heart','helicopter',
  'hexagon','hot-air-balloon','ice-cream','jack-o-lantern','kabuto','lily',
  'lotus','morning-glory','mushroom','penguin','pinwheel','rabbit','ribbon',
  'rocket','rose','santa','shirt','shuriken','snowflake','spiral','star',
  'strawberry','sunflower','swan','tanabata','train','tulip','watermelon',
];

const generated = new Set(defs.map((d) => d.slug));
const missing = allSlugs.filter((s) => !generated.has(s));
if (missing.length > 0) {
  console.warn(`⚠ Missing SVGs for: ${missing.join(', ')}`);
} else {
  console.log('✓ All 51 slugs covered');
}
