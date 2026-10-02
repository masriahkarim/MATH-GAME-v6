/**
 * Types for MATH RUSH
 */

export type AgeGroup = '7-8' | '9-10' | '11-12';

export type CharacterId = 'panda' | 'robot' | 'cat' | 'dino';

export type CharacterExpression = 'idle' | 'happy' | 'combo' | 'oops' | 'victory';

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  emoji: string;
  image: string;
  personality: string;
  tagline: string;
  greeting: string;
  color: string;
  accentBg: string;
  badgeBg: string;
}

export type SpecialMomentType = 'none' | 'bonus_2x' | 'speed_rush' | 'star_bonus';

export interface Question {
  id: string;
  prompt: string;
  options: (number | string)[];
  correctIndex: number;
  correctAnswer: number | string;
  explanation: string;
  hint?: string;
  visualEmoji: string;
  category: string;
  difficulty: 1 | 2 | 3;
  specialMoment?: SpecialMomentType;
}

export interface BossQuestion extends Question {
  storyText: string;
  hpDamage: number;
}

export type GameScreenState = 
  | 'HOME'
  | 'PLAYING'
  | 'BOSS_TRANSITION'
  | 'BOSS_BATTLE'
  | 'REWARD';

export interface CosmeticItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  type: 'hat' | 'glasses' | 'backpack' | 'rocket' | 'badge';
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
}

export interface PlayerProfile {
  totalStars: number;
  totalXp: number;
  streakDays: number;
  lastPlayedDate: string;
  unlockedItemIds: string[];
  equippedItemId: string | null;
  selectedCharacterId: CharacterId;
  selectedAgeGroup: AgeGroup;
  soundEnabled: boolean;
  unlockedBadges: string[];
  totalGamesPlayed: number;
}

export interface SessionResult {
  questionsAnswered: number;
  correctAnswers: number;
  highestCombo: number;
  starsEarned: number;
  xpEarned: number;
  bossDefeated: boolean;
  timeSpentSeconds: number;
  unlockedItem?: CosmeticItem;
  newBadgesEarned: Badge[];
  leveledUp?: boolean;
  newLevelTitle?: string;
  newLevelNumber?: number;
}

