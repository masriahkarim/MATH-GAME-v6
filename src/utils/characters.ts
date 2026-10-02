import { CharacterInfo, CharacterId, CosmeticItem, Badge } from '../types/game';

// Image assets generated for mascots and boss
import pandaImg from '../assets/images/mascot_panda_1790906858569.jpg';
import robotImg from '../assets/images/mascot_robot_1790906873222.jpg';
import catImg from '../assets/images/mascot_cat_1790906886442.jpg';
import dinoImg from '../assets/images/mascot_dino_1790906899360.jpg';
import dragonImg from '../assets/images/boss_dragon_1790906910887.jpg';

export const BOSS_DRAGON_IMG = dragonImg;

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  panda: {
    id: 'panda',
    name: 'Panda Hero',
    emoji: '🐼',
    image: pandaImg,
    personality: 'Tenang dan bijak',
    tagline: 'Kira perlahan, jawapan tepat!',
    greeting: 'Hai kawan! Jom kita pecahkan rekod matematik hari ini!',
    color: 'from-amber-400 via-yellow-400 to-orange-500',
    accentBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    badgeBg: 'bg-amber-400/20 border-amber-400/50 text-amber-200',
  },
  robot: {
    id: 'robot',
    name: 'Robo Bot',
    emoji: '🤖',
    image: robotImg,
    personality: 'Pantas dan suka nombor',
    tagline: 'Formula aktif sepantas kilat!',
    greeting: 'Bip-bip! Sistem aktif! Pengiraan sepantas kilat bersedia!',
    color: 'from-cyan-400 via-sky-400 to-blue-600',
    accentBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    badgeBg: 'bg-cyan-400/20 border-cyan-400/50 text-cyan-200',
  },
  cat: {
    id: 'cat',
    name: 'Kucing Oyen',
    emoji: '🐱',
    image: catImg,
    personality: 'Lincah dan ceria',
    tagline: 'Lompat combo sampai ke bintang!',
    greeting: 'Meow! Siap untuk misi paling ceria dan kumpul semua Stars!',
    color: 'from-orange-400 via-amber-400 to-rose-500',
    accentBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    badgeBg: 'bg-orange-400/20 border-orange-400/50 text-orange-200',
  },
  dino: {
    id: 'dino',
    name: 'Dino Boy',
    emoji: '🦖',
    image: dinoImg,
    personality: 'Berani dan kuat',
    tagline: 'Roar! Dragon pun kagum!',
    greeting: 'Roar! Tiada soalan terlalu sukar untuk wira matematik!',
    color: 'from-emerald-400 via-teal-400 to-green-600',
    accentBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    badgeBg: 'bg-emerald-400/20 border-emerald-400/50 text-emerald-200',
  },
};

export const COSMETIC_ITEMS: CosmeticItem[] = [
  {
    id: 'rocket_hat',
    name: 'Topi Rocket 🚀',
    emoji: '🚀',
    cost: 35,
    description: 'Topi roket berapi khas untuk Math Hero angkasa!',
    type: 'rocket',
  },
  {
    id: 'hero_cape',
    name: 'Topi Super Hero',
    emoji: '🦸‍♂️',
    cost: 30,
    description: 'Dipakai oleh Math Hero yang pantas mengira!',
    type: 'hat',
  },
  {
    id: 'star_glasses',
    name: 'Cermin Mata Bintang',
    emoji: '⭐',
    cost: 45,
    description: 'Mata bersinar penuh aura nombor bijak!',
    type: 'glasses',
  },
  {
    id: 'golden_crown',
    name: 'Mahkota Raja Math',
    emoji: '👑',
    cost: 75,
    description: 'Mahkota emas berkilau untuk jaguh kiraan!',
    type: 'hat',
  },
  {
    id: 'galaxy_backpack',
    name: 'Beg Angkasa Galaxy',
    emoji: '🎒',
    cost: 55,
    description: 'Menyimpan formula rahsia pengiraan pantas!',
    type: 'backpack',
  },
  {
    id: 'dragon_wings',
    name: 'Sayap Kilat Emas',
    emoji: '🪽',
    cost: 90,
    description: 'Terbang tinggi menewaskan Dragon Boss!',
    type: 'badge',
  },
  {
    id: 'champion_belt',
    name: 'Tali Pinggang Juara',
    emoji: '🥋',
    cost: 50,
    description: 'Tanda kecekalan menyelesaikan semua misi harian!',
    type: 'badge',
  },
];

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_win',
    name: 'Langkah Pertama 🌟',
    emoji: '🌟',
    description: 'Berjaya selesaikan sesi permainan pertama anda!',
    unlocked: false,
  },
  {
    id: 'combo_master',
    name: 'Api Combo 🔥',
    emoji: '🔥',
    description: 'Capai Combo 5 berturut-turut tanpa henti!',
    unlocked: false,
  },
  {
    id: 'super_hero',
    name: 'Math Hero Sebenar 👑',
    emoji: '👑',
    description: 'Capai Combo 10 jawapan betul berturut-turut!',
    unlocked: false,
  },
  {
    id: 'boss_slayer',
    name: 'Kalahkan Dragon 🐲',
    emoji: '🐲',
    description: 'Selesaikan soalan Final Boss Math Dragon!',
    unlocked: false,
  },
  {
    id: 'quick_thinker',
    name: 'Otak Kilat ⚡',
    emoji: '⚡',
    description: 'Jawab 12 atau lebih soalan betul dalam 1 sesi!',
    unlocked: false,
  },
  {
    id: 'star_collector',
    name: 'Kolektor Bintang ⭐',
    emoji: '⭐',
    description: 'Kumpul lebih daripada 100 Stars keseluruhan!',
    unlocked: false,
  },
];

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  nextXp: number;
}

export const LEVEL_TIERS: LevelInfo[] = [
  { level: 1, title: 'Math Rookie', minXp: 0, nextXp: 100 },
  { level: 2, title: 'Number Ninja', minXp: 100, nextXp: 250 },
  { level: 3, title: 'Math Explorer', minXp: 250, nextXp: 450 },
  { level: 4, title: 'Calculation Hero', minXp: 450, nextXp: 750 },
  { level: 5, title: 'Math Master', minXp: 750, nextXp: 1200 },
  { level: 6, title: 'Galaxy Legend', minXp: 1200, nextXp: 2000 },
];

export function getLevelFromXp(xp: number): LevelInfo {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      return LEVEL_TIERS[i];
    }
  }
  return LEVEL_TIERS[0];
}
