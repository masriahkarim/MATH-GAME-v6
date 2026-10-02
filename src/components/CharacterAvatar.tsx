import React from 'react';
import { CharacterId, CharacterExpression } from '../types/game';
import { CHARACTERS, COSMETIC_ITEMS } from '../utils/characters';

interface CharacterAvatarProps {
  characterId: CharacterId;
  expression?: CharacterExpression;
  equippedItemId?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  speechText?: string;
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  expression = 'idle',
  equippedItemId,
  size = 'md',
  showSpeechBubble = false,
  speechText,
  className = '',
}) => {
  const char = CHARACTERS[characterId];
  const equippedItem = COSMETIC_ITEMS.find((item) => item.id === equippedItemId);

  // Expression emoji badge & mood glow
  const expressionDetails: Record<CharacterExpression, { emoji: string; glow: string; label: string; anim: string }> = {
    idle: {
      emoji: '🙂',
      glow: 'shadow-amber-500/20 border-amber-400/50',
      label: 'Sedia!',
      anim: 'animate-float',
    },
    happy: {
      emoji: '😄',
      glow: 'shadow-emerald-500/50 border-emerald-400 ring-4 ring-emerald-400/40',
      label: 'HEBAT!',
      anim: 'animate-bounce-slight',
    },
    combo: {
      emoji: '🤩',
      glow: 'shadow-yellow-500/70 border-yellow-300 ring-4 ring-yellow-400/60 animate-pulse-glow',
      label: 'SUPER COMBO!',
      anim: 'animate-bounce-slight scale-105',
    },
    oops: {
      emoji: '😮',
      glow: 'shadow-amber-600/30 border-amber-400/60',
      label: 'Cuba lagi!',
      anim: 'animate-shake',
    },
    victory: {
      emoji: '🎉',
      glow: 'shadow-purple-500/60 border-purple-300 ring-4 ring-purple-400/50',
      label: 'JUARA!',
      anim: 'animate-float scale-105',
    },
  };

  const currentExpr = expressionDetails[expression];

  // Size mappings
  const sizeClasses = {
    sm: 'w-12 h-12 rounded-xl text-base',
    md: 'w-20 h-20 sm:w-24 sm:h-24 rounded-2xl text-xl',
    lg: 'w-32 h-32 sm:w-40 sm:h-40 rounded-3xl text-2xl',
    xl: 'w-44 h-44 sm:w-52 sm:h-52 rounded-3xl text-3xl',
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble (Optional) */}
      {showSpeechBubble && speechText && (
        <div className="absolute -top-12 z-20 px-3 py-1.5 rounded-2xl bg-slate-800 border-2 border-amber-400/80 text-white shadow-xl text-xs sm:text-sm font-extrabold font-heading speech-bubble-bottom animate-pop-in max-w-[220px] text-center leading-tight">
          <span>{speechText}</span>
        </div>
      )}

      {/* Main Avatar Container */}
      <div
        className={`relative overflow-hidden border-4 bg-slate-900 shadow-2xl transition-all duration-300 flex items-center justify-center ${sizeClasses[size]} ${currentExpr.glow} ${currentExpr.anim}`}
      >
        {/* Mascot Image */}
        <img
          src={char.image}
          alt={char.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />

        {/* Expression Badge Sticker (Bottom Right corner) */}
        <div 
          className="absolute bottom-1 right-1 bg-slate-950/85 border border-white/30 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-base shadow-md transform hover:scale-110 transition"
          title={`Mood: ${currentExpr.label}`}
        >
          {currentExpr.emoji}
        </div>

        {/* Equipped Cosmetic Item Sticker (Top Left corner) */}
        {equippedItem && (
          <div
            className="absolute top-1 left-1 bg-slate-950/90 border border-amber-400 text-amber-300 text-xs sm:text-sm px-1.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 font-black"
            title={`Aksesori: ${equippedItem.name}`}
          >
            <span>{equippedItem.emoji}</span>
          </div>
        )}
      </div>
    </div>
  );
};
