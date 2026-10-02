import { PlayerProfile, SessionResult, Badge } from '../types/game';
import { ALL_BADGES, getLevelFromXp } from './characters';

const STORAGE_KEY = 'math_rush_player_profile_v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  totalStars: 25, // starting stars gift!
  totalXp: 0,
  streakDays: 1,
  lastPlayedDate: new Date().toISOString().split('T')[0],
  unlockedItemIds: [],
  equippedItemId: null,
  selectedCharacterId: 'panda',
  selectedAgeGroup: '7-8',
  soundEnabled: true,
  unlockedBadges: [],
  totalGamesPlayed: 0,
};

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };

    const parsed = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];

    // Check streak
    let streak = parsed.streakDays || 1;
    if (parsed.lastPlayedDate) {
      const last = new Date(parsed.lastPlayedDate);
      const cur = new Date(today);
      const diffTime = cur.getTime() - last.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // consecutive day
        streak += 1;
      } else if (diffDays > 1) {
        // missed days, restart friendly
        streak = 1;
      }
    }

    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      streakDays: streak,
      lastPlayedDate: today,
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Graceful fallback
  }
}

export function applySessionResult(
  current: PlayerProfile,
  result: SessionResult
): {
  updatedProfile: PlayerProfile;
  newBadges: Badge[];
  leveledUp: boolean;
  newLevelTitle: string;
  newLevelNumber: number;
} {
  const newTotalStars = current.totalStars + result.starsEarned;
  const newTotalXp = current.totalXp + result.xpEarned;
  const newGamesPlayed = current.totalGamesPlayed + 1;
  const unlockedBadgesSet = new Set(current.unlockedBadges);
  const newBadges: Badge[] = [];

  const oldLevel = getLevelFromXp(current.totalXp);
  const newLevel = getLevelFromXp(newTotalXp);
  const leveledUp = newLevel.level > oldLevel.level;

  // Check badges
  // 1. First win
  if (result.questionsAnswered > 0 && !unlockedBadgesSet.has('first_win')) {
    unlockedBadgesSet.add('first_win');
    const b = ALL_BADGES.find(x => x.id === 'first_win');
    if (b) newBadges.push(b);
  }

  // 2. Combo master (>= 5)
  if (result.highestCombo >= 5 && !unlockedBadgesSet.has('combo_master')) {
    unlockedBadgesSet.add('combo_master');
    const b = ALL_BADGES.find(x => x.id === 'combo_master');
    if (b) newBadges.push(b);
  }

  // 3. Super hero (>= 10)
  if (result.highestCombo >= 10 && !unlockedBadgesSet.has('super_hero')) {
    unlockedBadgesSet.add('super_hero');
    const b = ALL_BADGES.find(x => x.id === 'super_hero');
    if (b) newBadges.push(b);
  }

  // 4. Boss slayer
  if (result.bossDefeated && !unlockedBadgesSet.has('boss_slayer')) {
    unlockedBadgesSet.add('boss_slayer');
    const b = ALL_BADGES.find(x => x.id === 'boss_slayer');
    if (b) newBadges.push(b);
  }

  // 5. Quick thinker (>= 12 correct)
  if (result.correctAnswers >= 12 && !unlockedBadgesSet.has('quick_thinker')) {
    unlockedBadgesSet.add('quick_thinker');
    const b = ALL_BADGES.find(x => x.id === 'quick_thinker');
    if (b) newBadges.push(b);
  }

  // 6. Star collector (>= 100 stars)
  if (newTotalStars >= 100 && !unlockedBadgesSet.has('star_collector')) {
    unlockedBadgesSet.add('star_collector');
    const b = ALL_BADGES.find(x => x.id === 'star_collector');
    if (b) newBadges.push(b);
  }

  const updatedProfile: PlayerProfile = {
    ...current,
    totalStars: newTotalStars,
    totalXp: newTotalXp,
    totalGamesPlayed: newGamesPlayed,
    unlockedBadges: Array.from(unlockedBadgesSet),
  };

  saveProfile(updatedProfile);
  return {
    updatedProfile,
    newBadges,
    leveledUp,
    newLevelTitle: newLevel.title,
    newLevelNumber: newLevel.level,
  };
}
