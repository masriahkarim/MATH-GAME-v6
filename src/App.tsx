/**
 * MATH RUSH 🚀
 * “5 Minit. 1 Misi. Jadi Math Hero!”
 */

import React, { useState, useEffect } from 'react';
import { GameScreenState, PlayerProfile, SessionResult } from './types/game';
import { loadProfile, saveProfile, applySessionResult } from './utils/storage';
import { sound } from './utils/sound';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { BossBattleScreen } from './components/BossBattleScreen';
import { RewardScreen } from './components/RewardScreen';
import { ShopClosetModal } from './components/ShopClosetModal';
import { BadgesModal } from './components/BadgesModal';
import { CartoonBackground } from './components/CartoonBackground';

export default function App() {
  const [screen, setScreen] = useState<GameScreenState>('HOME');
  const [profile, setProfile] = useState<PlayerProfile>(() => loadProfile());
  const [isClosetOpen, setIsClosetOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);

  // Active game session state
  const [currentSession, setCurrentSession] = useState<SessionResult>({
    questionsAnswered: 0,
    correctAnswers: 0,
    highestCombo: 0,
    starsEarned: 0,
    xpEarned: 0,
    bossDefeated: false,
    timeSpentSeconds: 0,
    newBadgesEarned: [],
  });

  // Keep sound FX mute state synced and unlock audio context on first interaction
  useEffect(() => {
    sound.setMuted(!profile.soundEnabled);

    const unlockAudio = () => {
      sound.initContext();
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, [profile.soundEnabled]);

  const updateProfile = (updates: Partial<PlayerProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      saveProfile(updated);
      return updated;
    });
  };

  const handleToggleSound = () => {
    const nextSound = !profile.soundEnabled;
    updateProfile({ soundEnabled: nextSound });
    sound.setMuted(!nextSound);
    if (nextSound) sound.playClick();
  };

  // Start a fresh 5-minute game with joyful power-up chime
  const handleStartGame = () => {
    sound.playGameStart();
    setCurrentSession({
      questionsAnswered: 0,
      correctAnswers: 0,
      highestCombo: 0,
      starsEarned: 0,
      xpEarned: 0,
      bossDefeated: false,
      timeSpentSeconds: 0,
      newBadgesEarned: [],
    });
    setScreen('PLAYING');
  };

  // Trigger Boss round
  const handleTriggerBoss = () => {
    setScreen('BOSS_BATTLE');
  };

  // Boss defeated with bonus rewards
  const handleBossDefeated = (bonusStars: number, bonusXp: number) => {
    const finalSession: SessionResult = {
      ...currentSession,
      starsEarned: currentSession.starsEarned + bonusStars,
      xpEarned: currentSession.xpEarned + bonusXp,
      bossDefeated: true,
    };

    const { updatedProfile, newBadges, leveledUp, newLevelTitle, newLevelNumber } =
      applySessionResult(profile, finalSession);
    setProfile(updatedProfile);
    setCurrentSession({
      ...finalSession,
      newBadgesEarned: newBadges,
      leveledUp,
      newLevelTitle,
      newLevelNumber,
    });
    setScreen('REWARD');
  };

  // Handle game session ending (normal timer end or skip boss)
  const handleFinishSession = (stats: {
    questionsAnswered: number;
    correctAnswers: number;
    highestCombo: number;
    starsEarned: number;
    xpEarned: number;
    bossDefeated: boolean;
    timeSpentSeconds: number;
  }) => {
    const finalSession: SessionResult = {
      ...stats,
      newBadgesEarned: [],
    };

    const { updatedProfile, newBadges, leveledUp, newLevelTitle, newLevelNumber } =
      applySessionResult(profile, finalSession);
    setProfile(updatedProfile);
    setCurrentSession({
      ...finalSession,
      newBadgesEarned: newBadges,
      leveledUp,
      newLevelTitle,
      newLevelNumber,
    });
    setScreen('REWARD');
  };

  // Replay immediately
  const handlePlayAgain = () => {
    handleStartGame();
  };

  const handleGoHome = () => {
    sound.playClick();
    setScreen('HOME');
  };

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* Cartoon World Background with clouds, hills and distant castle */}
      <CartoonBackground />

      {/* Top Navigation & Kid HUD */}
      <Header
        profile={profile}
        onToggleSound={handleToggleSound}
        onOpenCloset={() => setIsClosetOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        inGame={screen === 'PLAYING' || screen === 'BOSS_BATTLE'}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col justify-center py-2 sm:py-4 relative z-10">
        {screen === 'HOME' && (
          <HomeScreen
            profile={profile}
            onUpdateProfile={updateProfile}
            onStartGame={handleStartGame}
            onOpenCloset={() => setIsClosetOpen(true)}
            onOpenBadges={() => setIsBadgesOpen(true)}
          />
        )}

        {screen === 'PLAYING' && (
          <GameScreen
            ageGroup={profile.selectedAgeGroup}
            characterId={profile.selectedCharacterId}
            onTriggerBoss={handleTriggerBoss}
            onFinishSession={handleFinishSession}
            onQuit={handleGoHome}
          />
        )}

        {screen === 'BOSS_BATTLE' && (
          <BossBattleScreen
            ageGroup={profile.selectedAgeGroup}
            characterId={profile.selectedCharacterId}
            onBossDefeated={handleBossDefeated}
            onSkipOrLose={() => handleFinishSession(currentSession)}
          />
        )}

        {screen === 'REWARD' && (
          <RewardScreen
            session={currentSession}
            profile={profile}
            onPlayAgain={handlePlayAgain}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      {/* Footer Branding & Safety */}
      <footer className="w-full border-t border-slate-800/80 py-3 px-4 text-center text-xs text-slate-400 relative z-10 bg-slate-950/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <span className="font-extrabold text-amber-300">
            🚀 MATH RUSH — Permainan Pendidikan Matematik Kanak-Kanak Malaysia
          </span>
          <span className="text-[11px] text-slate-400">
            Aman & Mesra Kanak-Kanak · Tiada Iklan · Pembelajaran Seronok
          </span>
        </div>
      </footer>

      {/* Modals */}
      <ShopClosetModal
        isOpen={isClosetOpen}
        onClose={() => setIsClosetOpen(false)}
        profile={profile}
        onUpdateProfile={updateProfile}
      />

      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        profile={profile}
      />
    </div>
  );
}
