import React, { useState } from 'react';
import { Play, Sparkles, Flame, Award, ShoppingBag, Check } from 'lucide-react';
import { AgeGroup, CharacterId, PlayerProfile, CharacterExpression } from '../types/game';
import { CHARACTERS, getLevelFromXp } from '../utils/characters';
import { sound } from '../utils/sound';
import { CharacterAvatar } from './CharacterAvatar';

interface HomeScreenProps {
  profile: PlayerProfile;
  onUpdateProfile: (updates: Partial<PlayerProfile>) => void;
  onStartGame: () => void;
  onOpenCloset: () => void;
  onOpenBadges: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onUpdateProfile,
  onStartGame,
  onOpenCloset,
  onOpenBadges,
}) => {
  const [characterMood, setCharacterMood] = useState<CharacterExpression>('idle');
  const currentCharacter = CHARACTERS[profile.selectedCharacterId];
  const levelInfo = getLevelFromXp(profile.totalXp);

  const ageTiers: { id: AgeGroup; label: string; desc: string; color: string; border: string; activeBg: string }[] = [
    {
      id: '7-8',
      label: '7–8 Tahun',
      desc: 'Tambah, Tolak & Sifir Asas',
      color: 'text-emerald-300',
      border: 'border-emerald-400',
      activeBg: 'bg-emerald-500/25 ring-2 ring-emerald-400',
    },
    {
      id: '9-10',
      label: '9–10 Tahun',
      desc: 'Darab, Bahagi & Pecahan',
      color: 'text-sky-300',
      border: 'border-sky-400',
      activeBg: 'bg-sky-500/25 ring-2 ring-sky-400',
    },
    {
      id: '11-12',
      label: '11–12 Tahun',
      desc: 'Operasi Campuran & Peratus',
      color: 'text-purple-300',
      border: 'border-purple-400',
      activeBg: 'bg-purple-500/25 ring-2 ring-purple-400',
    },
  ];

  const handleCharacterSelect = (cId: CharacterId) => {
    sound.playClick();
    onUpdateProfile({ selectedCharacterId: cId });
    setCharacterMood('happy');
    setTimeout(() => setCharacterMood('idle'), 1200);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 sm:py-6 flex flex-col items-center select-none relative z-10">
      {/* Title & Tagline Banner */}
      <div className="text-center mb-3 sm:mb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black mb-1.5 shadow-sm">
          <span>🚀 MISI 5 MINIT</span>
          <span>·</span>
          <span>ARKED MATEMATIK</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-400 tracking-tight drop-shadow-md font-heading">
          MATH RUSH 🚀
        </h1>
        <p className="text-sm sm:text-lg font-extrabold text-amber-100/90 font-heading">
          “5 Minit. 1 Misi. Jadi Math Hero!”
        </p>
      </div>

      {/* Mini HUD Stats Strip (Clean, Uncluttered) */}
      <div className="w-full max-w-md flex items-center justify-around bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl py-2 px-4 mb-4 shadow-lg text-xs sm:text-sm font-black">
        <div className="flex items-center gap-1.5 text-amber-300" title="Bintang Terkumpul">
          <span className="text-base">⭐</span>
          <span className="tabular-nums font-black">{profile.totalStars} Stars</span>
        </div>
        <div className="w-px h-4 bg-slate-700" />
        <div className="flex items-center gap-1.5 text-orange-400" title="Daily Streak">
          <Flame className="w-4 h-4" />
          <span className="tabular-nums font-black">Hari Ke-{profile.streakDays}</span>
        </div>
        <div className="w-px h-4 bg-slate-700" />
        <div className="flex items-center gap-1.5 text-purple-300" title="Tahap Pemain">
          <Award className="w-4 h-4" />
          <span className="tabular-nums font-black">Lv.{levelInfo.level}</span>
        </div>
      </div>

      {/* Main Character Hero Stage in the Center */}
      <div className="w-full max-w-md bg-slate-800/85 border-2 border-amber-400/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col items-center mb-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot Center Stage with Speech Bubble */}
        <div className="mt-4 mb-2">
          <CharacterAvatar
            characterId={profile.selectedCharacterId}
            expression={characterMood}
            equippedItemId={profile.equippedItemId}
            size="lg"
            showSpeechBubble={true}
            speechText={`“${currentCharacter.tagline}”`}
          />
        </div>

        {/* Character Title & Personality Tag */}
        <div className="text-center mt-2 mb-3">
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            {currentCharacter.name}
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-amber-400/40 text-amber-300 inline-block mt-0.5">
            ✨ {currentCharacter.personality}
          </span>
        </div>

        {/* 4 Mascot Switcher Buttons */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-5">
          {(Object.keys(CHARACTERS) as CharacterId[]).map((cId) => {
            const char = CHARACTERS[cId];
            const isSelected = profile.selectedCharacterId === cId;
            return (
              <button
                key={cId}
                type="button"
                onClick={() => handleCharacterSelect(cId)}
                className={`p-2 sm:p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/25 scale-110 shadow-lg ring-2 ring-amber-400/50'
                    : 'border-slate-700 bg-slate-900/70 hover:border-slate-500 hover:scale-105'
                }`}
                title={`${char.name} (${char.personality})`}
              >
                <span className="text-2xl sm:text-3xl">{char.emoji}</span>
              </button>
            );
          })}
        </div>

        {/* Age Group Selector (3 Clean Buttons) */}
        <div className="w-full mb-5">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs font-black text-slate-300 uppercase tracking-wide">
              🎯 Umur Pemain:
            </span>
            <span className="text-[11px] text-amber-400 font-bold">
              Tahap soalan disesuaikan
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {ageTiers.map((tier) => {
              const isSelected = profile.selectedAgeGroup === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onUpdateProfile({ selectedAgeGroup: tier.id });
                  }}
                  className={`p-2 sm:p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? `${tier.activeBg} ${tier.border} shadow-md`
                      : 'border-slate-700/80 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  <span className={`text-xs sm:text-sm font-black ${tier.color}`}>
                    {tier.label}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {tier.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* THE BIGGEST BUTTON: ▶️ MULA MAIN (Main Focal Point) */}
        <div className="w-full">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="w-full arcade-btn group relative py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-2xl sm:text-3xl shadow-2xl flex items-center justify-center gap-3 transition-transform cursor-pointer font-heading tracking-wide border-b-4 border-amber-600 animate-pulse-glow"
          >
            <Play className="w-8 h-8 fill-slate-950 stroke-slate-950 transform group-hover:scale-125 transition-transform" />
            <span>▶️ MULA MAIN</span>
          </button>
          <p className="text-center text-[11px] sm:text-xs text-amber-200/80 font-bold mt-2">
            ⚡ 5 minit permainan arked · Kalahkan Math Dragon!
          </p>
        </div>
      </div>

      {/* Bottom Auxiliary Action Cards (Closet & Badges) */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3 text-center">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenCloset();
          }}
          className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-2xl transition flex items-center justify-center gap-2 group cursor-pointer shadow-md"
        >
          <span className="text-xl transform group-hover:scale-110 transition">🛍️</span>
          <div className="text-left">
            <span className="text-xs font-black text-white block">Kedai Aksesori</span>
            <span className="text-[10px] text-amber-300 font-bold">{profile.totalStars} Stars</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenBadges();
          }}
          className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-2xl transition flex items-center justify-center gap-2 group cursor-pointer shadow-md"
        >
          <span className="text-xl transform group-hover:scale-110 transition">🏆</span>
          <div className="text-left">
            <span className="text-xs font-black text-white block">Lencana Saya</span>
            <span className="text-[10px] text-purple-300 font-bold">{profile.unlockedBadges.length} Terbuka</span>
          </div>
        </button>
      </div>
    </div>
  );
};
