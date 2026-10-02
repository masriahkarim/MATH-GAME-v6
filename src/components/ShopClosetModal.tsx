import React from 'react';
import { X, Sparkles, Check, Lock, ShoppingBag } from 'lucide-react';
import { PlayerProfile, CosmeticItem } from '../types/game';
import { COSMETIC_ITEMS, CHARACTERS } from '../utils/characters';
import { sound } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import { CharacterAvatar } from './CharacterAvatar';

interface ShopClosetModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onUpdateProfile: (updates: Partial<PlayerProfile>) => void;
}

export const ShopClosetModal: React.FC<ShopClosetModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const currentCharacter = CHARACTERS[profile.selectedCharacterId];

  const handleBuy = (item: CosmeticItem) => {
    if (profile.totalStars < item.cost) {
      sound.playWrong();
      return;
    }

    sound.playCorrect();
    fireConfetti();

    const newUnlocked = [...profile.unlockedItemIds, item.id];
    onUpdateProfile({
      totalStars: profile.totalStars - item.cost,
      unlockedItemIds: newUnlocked,
      equippedItemId: item.id,
    });
  };

  const handleEquipToggle = (item: CosmeticItem) => {
    sound.playClick();
    if (profile.equippedItemId === item.id) {
      onUpdateProfile({ equippedItemId: null });
    } else {
      onUpdateProfile({ equippedItemId: item.id });
    }
  };

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
          <span className="text-2xl">🛍️</span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            Almari Aksesori Math Hero
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mb-4">
          Kumpul Stars semasa bermain matematik untuk membuka topi dan aksesori comel!
        </p>

        {/* Mascot Preview with Stars Badge */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CharacterAvatar
              characterId={profile.selectedCharacterId}
              equippedItemId={profile.equippedItemId}
              size="md"
              expression="happy"
            />
            <div>
              <span className="text-[11px] text-slate-400 font-bold block">Model Hero:</span>
              <h4 className="text-base font-black text-white font-heading">
                {currentCharacter.name}
              </h4>
              <span className="text-xs text-amber-300 font-bold block mt-0.5">
                {profile.equippedItemId
                  ? `Dipasang: ${COSMETIC_ITEMS.find((i) => i.id === profile.equippedItemId)?.name}`
                  : 'Tiada aksesori dipasang'}
              </span>
            </div>
          </div>

          <div className="bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3 py-1.5 rounded-xl text-sm font-black flex items-center gap-1.5 shrink-0 shadow-inner">
            <span className="text-base">⭐</span>
            <span className="tabular-nums font-black">{profile.totalStars} Stars</span>
          </div>
        </div>

        {/* Item List */}
        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
          {COSMETIC_ITEMS.map((item) => {
            const isUnlocked = profile.unlockedItemIds.includes(item.id);
            const isEquipped = profile.equippedItemId === item.id;
            const canAfford = profile.totalStars >= item.cost;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border-2 transition flex items-center justify-between gap-3 ${
                  isEquipped
                    ? 'bg-amber-500/15 border-amber-400'
                    : isUnlocked
                    ? 'bg-slate-800/80 border-slate-700'
                    : 'bg-slate-800/40 border-slate-800 opacity-90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                    {item.emoji}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white font-heading flex items-center gap-1.5">
                      {item.name}
                      {isEquipped && (
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full">
                          Dipasang
                        </span>
                      )}
                    </h5>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => handleEquipToggle(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                        isEquipped
                          ? 'bg-slate-700 hover:bg-slate-600 text-white'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      }`}
                    >
                      {isEquipped ? 'Tanggalkan' : 'Pasang'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleBuy(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                        canAfford
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <span>Buka ⭐ {item.cost}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>⭐ {item.cost}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            ✨ Aksesori adalah ganjaran kosmetik percuma yang diperoleh melalui kepintaran matematik anda!
          </p>
        </div>
      </div>
    </div>
  );
};
