import React from 'react';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { ALL_BADGES } from '../utils/characters';
import { sound } from '../utils/sound';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🏆</span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            Lencana Pencapaian Math Hero
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mb-4">
          Buktikan kehebatan matematik anda dan kumpul kesemua 6 lencana wira!
        </p>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = profile.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border-2 transition flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-purple-500/15 border-purple-400/50 shadow-md shadow-purple-500/10'
                    : 'bg-slate-800/40 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                    isUnlocked
                      ? 'bg-purple-900/60 border-purple-400 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {isUnlocked ? badge.emoji : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-black text-white font-heading">
                      {badge.name}
                    </h5>
                    {isUnlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                  <span
                    className={`text-[10px] font-bold mt-1.5 inline-block px-2 py-0.5 rounded-md ${
                      isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? 'Telah Dicapai ✅' : 'Belum Dicapai 🔒'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Jumlah Lencana Dicapai:</span>
          <span className="font-black text-purple-400 tabular-nums text-sm">
            {profile.unlockedBadges.length} / {ALL_BADGES.length}
          </span>
        </div>
      </div>
    </div>
  );
};
