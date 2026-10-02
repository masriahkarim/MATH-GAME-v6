import React, { useEffect, useState } from 'react';
import { RotateCcw, Home, Sparkles, Star, Flame, Trophy, CheckCircle, Award } from 'lucide-react';
import { SessionResult, PlayerProfile } from '../types/game';
import { CHARACTERS, getLevelFromXp, COSMETIC_ITEMS } from '../utils/characters';
import { sound } from '../utils/sound';
import { fireVictoryCelebration, fireStarBurst } from '../utils/confetti';
import { CharacterAvatar } from './CharacterAvatar';

interface RewardScreenProps {
  session: SessionResult;
  profile: PlayerProfile;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const RewardScreen: React.FC<RewardScreenProps> = ({
  session,
  profile,
  onPlayAgain,
  onGoHome,
}) => {
  const currentCharacter = CHARACTERS[profile.selectedCharacterId];
  const levelInfo = getLevelFromXp(profile.totalXp);

  // Animated Count-Up Numbers
  const [animatedStars, setAnimatedStars] = useState(0);
  const [animatedXp, setAnimatedXp] = useState(0);
  const [showLevelUpModal, setShowLevelUpModal] = useState(Boolean(session.leveledUp));

  useEffect(() => {
    sound.playVictory();
    fireVictoryCelebration();

    if (session.leveledUp) {
      setTimeout(() => {
        sound.playLevelUp();
        fireStarBurst();
      }, 700);
    }

    // Smooth count-up animation for Stars & XP
    const starsTarget = session.starsEarned;
    const xpTarget = session.xpEarned;
    const steps = 20;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setAnimatedStars(Math.round((starsTarget * step) / steps));
      setAnimatedXp(Math.round((xpTarget * step) / steps));

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStars(starsTarget);
        setAnimatedXp(xpTarget);
      }
    }, 35);

    return () => clearInterval(timer);
  }, [session]);

  const accuracy =
    session.questionsAnswered > 0
      ? Math.round((session.correctAnswers / session.questionsAnswered) * 100)
      : 100;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 sm:py-5 flex flex-col items-center select-none relative z-10">
      {/* Level Up Celebration Popup Overlay (if leveled up) */}
      {showLevelUpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 border-4 border-yellow-400 rounded-3xl p-6 shadow-2xl text-center animate-pop-in relative">
            <div className="text-5xl mb-2 animate-bounce">👑</div>
            <h2 className="text-2xl sm:text-3xl font-black text-yellow-300 font-heading tracking-wide">
              ✨ LEVEL UP! ✨
            </h2>
            <div className="text-lg font-black text-white mt-1">
              TAHAP {session.newLevelNumber}: {session.newLevelTitle}
            </div>
            <p className="text-xs text-purple-200 mt-2">
              Kamu semakin mahir! Semua maskot bersorak meraikan pencapaian wira matematik ini!
            </p>

            <div className="my-4 flex justify-center">
              <CharacterAvatar
                characterId={profile.selectedCharacterId}
                expression="victory"
                size="lg"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowLevelUpModal(false);
              }}
              className="w-full arcade-btn py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-base shadow-lg cursor-pointer font-heading"
            >
              🎉 TERIMA KASIH!
            </button>
          </div>
        </div>
      )}

      {/* Victory Header */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-xs font-black mb-1 animate-bounce-slight">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>MISI SELESAI! TAHNIAH!</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 tracking-tight font-heading">
          🎉 MISI SELESAI!
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-300">
          Otak kamu semakin tajam dan pantas hari ini!
        </p>
      </div>

      {/* Main Reward Card */}
      <div className="w-full bg-slate-800/90 border-2 border-amber-400/60 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden mb-4">
        {/* Mascot Center Stage */}
        <div className="flex flex-col items-center text-center mb-4">
          <CharacterAvatar
            characterId={profile.selectedCharacterId}
            expression="victory"
            equippedItemId={profile.equippedItemId}
            size="lg"
            showSpeechBubble={true}
            speechText="“Aku bangga dengan kamu!”"
          />
          <h3 className="text-base font-black text-white font-heading mt-2">
            {currentCharacter.name}
          </h3>
          {session.bossDefeated && (
            <div className="mt-1 px-3 py-1 bg-rose-500/20 border border-rose-500/40 rounded-full text-[11px] font-black text-rose-300 flex items-center gap-1">
              <span>🐲</span>
              <span>Math Dragon Berjaya Ditewaskan!</span>
            </div>
          )}
        </div>

        {/* 4 Stats Grid with Count-Up */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          {/* Stars */}
          <div className="bg-slate-900/85 border border-amber-400/40 p-2.5 rounded-2xl flex flex-col items-center text-center shadow-md">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
              ⭐ Stars
            </span>
            <span className="text-2xl font-black text-amber-400 tabular-nums font-heading mt-0.5">
              +{animatedStars}
            </span>
            <span className="text-[9px] text-slate-400">Ganjaran Bintang</span>
          </div>

          {/* Highest Combo */}
          <div className="bg-slate-900/85 border border-orange-400/40 p-2.5 rounded-2xl flex flex-col items-center text-center shadow-md">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Combo
            </span>
            <span className="text-2xl font-black text-orange-400 tabular-nums font-heading mt-0.5">
              x{session.highestCombo}
            </span>
            <span className="text-[9px] text-slate-400">Terbaik Berturut</span>
          </div>

          {/* Correct / Answered */}
          <div className="bg-slate-900/85 border border-emerald-400/40 p-2.5 rounded-2xl flex flex-col items-center text-center shadow-md">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> Betul
            </span>
            <span className="text-2xl font-black text-emerald-400 tabular-nums font-heading mt-0.5">
              {session.correctAnswers}/{session.questionsAnswered}
            </span>
            <span className="text-[9px] text-slate-400">{accuracy}% Ketepatan</span>
          </div>

          {/* XP */}
          <div className="bg-slate-900/85 border border-purple-400/40 p-2.5 rounded-2xl flex flex-col items-center text-center shadow-md">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
              <Trophy className="w-3 h-3 text-purple-400" /> XP
            </span>
            <span className="text-2xl font-black text-purple-300 tabular-nums font-heading mt-0.5">
              +{animatedXp}
            </span>
            <span className="text-[9px] text-slate-400">Mata Pengalaman</span>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-700/80 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-black text-white font-heading">
                Tahap Pemain: Lv.{levelInfo.level} ({levelInfo.title})
              </span>
            </div>
            <span className="text-xs font-black text-purple-300 tabular-nums">
              {profile.totalXp} XP
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(
                  100,
                  ((profile.totalXp - levelInfo.minXp) /
                    Math.max(1, levelInfo.nextXp - levelInfo.minXp)) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* New Badges Announcement */}
        {session.newBadgesEarned.length > 0 && (
          <div className="bg-amber-400/15 border-2 border-amber-400/50 rounded-2xl p-3 mb-4 flex items-center gap-2.5 animate-bounce-slight">
            <span className="text-3xl">🎁</span>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                Lencana Baharu Dibuka!
              </span>
              <div className="text-xs sm:text-sm font-bold text-white">
                {session.newBadgesEarned.map((b) => b.name).join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Primary Action Button: 🔄 MAIN LAGI (1 Click to Replay!) */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="w-full arcade-btn py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xl sm:text-2xl shadow-xl flex items-center justify-center gap-2.5 cursor-pointer font-heading border-b-4 border-amber-600 animate-pulse-glow"
          >
            <RotateCcw className="w-6 h-6 stroke-[3]" />
            <span>🔄 MAIN LAGI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm shadow flex items-center justify-center gap-1.5 cursor-pointer transition border border-slate-700"
          >
            <Home className="w-4 h-4" />
            <span>Ke Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
