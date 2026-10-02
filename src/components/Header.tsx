import React from 'react';
import { Volume2, VolumeX, Sparkles, Award, ShoppingBag } from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { getLevelFromXp } from '../utils/characters';
import { sound } from '../utils/sound';

interface HeaderProps {
  profile: PlayerProfile;
  onToggleSound: () => void;
  onOpenCloset: () => void;
  onOpenBadges: () => void;
  inGame?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onToggleSound,
  onOpenCloset,
  onOpenBadges,
  inGame = false,
}) => {
  const levelInfo = getLevelFromXp(profile.totalXp);

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-6 py-2.5 transition-all select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent font-heading">
            MATH RUSH
          </span>
          <span className="text-lg">🚀</span>
        </div>

        {/* Zone 2: Kid's HUD Stats */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
          {/* Stars */}
          <div 
            title="Bintang Terkumpul"
            className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full text-amber-300"
          >
            <span className="text-sm">⭐</span>
            <span className="tabular-nums font-black">{profile.totalStars}</span>
          </div>

          {/* Daily Streak */}
          <div 
            title="Daily Streak Bermain"
            className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 px-2.5 py-1 rounded-full text-orange-400"
          >
            <span className="text-sm">🔥</span>
            <span className="tabular-nums font-black">{profile.streakDays} Hari</span>
          </div>

          {/* Level / Title */}
          {!inGame && (
            <div 
              title={`Level ${levelInfo.level}: ${levelInfo.title}`}
              className="hidden md:flex items-center gap-1.5 bg-purple-500/15 border border-purple-500/30 px-2.5 py-1 rounded-full text-purple-300"
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span className="font-extrabold truncate max-w-[120px]">
                Lv.{levelInfo.level} {levelInfo.title}
              </span>
            </div>
          )}
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!inGame && (
            <>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenCloset();
                }}
                className="p-2 sm:px-3 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                aria-label="Buka Almari Aksesori"
                title="Almari Aksesori"
              >
                <ShoppingBag className="w-4 h-4 text-pink-400" />
                <span className="hidden sm:inline">Aksesori</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenBadges();
                }}
                className="p-2 sm:px-3 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                aria-label="Buka Lencana Pencapaian"
                title="Lencana Pencapaian"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Lencana</span>
              </button>
            </>
          )}

          {/* Sound FX Mute Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
            aria-label={profile.soundEnabled ? 'Mute Bunyi FX' : 'Buka Bunyi FX'}
            title={profile.soundEnabled ? 'Bunyi FX: ON' : 'Bunyi FX: OFF'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
