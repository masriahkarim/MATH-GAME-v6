import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Shield, Heart } from 'lucide-react';
import { AgeGroup, CharacterId, BossQuestion } from '../types/game';
import { BOSS_DRAGON_IMG } from '../utils/characters';
import { generateBossQuestion } from '../utils/questionGenerator';
import { sound } from '../utils/sound';
import { fireConfetti, fireStarBurst, fireVictoryCelebration } from '../utils/confetti';
import { CharacterAvatar } from './CharacterAvatar';

interface BossBattleScreenProps {
  ageGroup: AgeGroup;
  characterId: CharacterId;
  onBossDefeated: (bonusStars: number, bonusXp: number) => void;
  onSkipOrLose: () => void;
}

export const BossBattleScreen: React.FC<BossBattleScreenProps> = ({
  ageGroup,
  characterId,
  onBossDefeated,
  onSkipOrLose,
}) => {
  const [bossHp, setBossHp] = useState(100);
  const [currentStage, setCurrentStage] = useState(1);
  const [question, setQuestion] = useState<BossQuestion>(() =>
    generateBossQuestion(ageGroup, 1)
  );
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isHitAnim, setIsHitAnim] = useState(false);
  const [bossDefeatedAnim, setBossDefeatedAnim] = useState(false);
  const [characterMood, setCharacterMood] = useState<'idle' | 'happy' | 'oops' | 'victory'>('idle');
  const [dragonSpeech, setDragonSpeech] = useState<string>('“Buktikan kamu Math Hero sebenar!”');

  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    title: string;
    text: string;
  } | null>(null);

  useEffect(() => {
    sound.playBossIntro();
  }, []);

  const handleSelectAnswer = (idx: number) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelectedIdx(idx);

    const isCorrect = idx === question.correctIndex;

    if (isCorrect) {
      sound.playBossHit();
      setIsHitAnim(true);
      setCharacterMood('happy');
      fireStarBurst();

      const newHp = Math.max(0, bossHp - question.hpDamage);
      setBossHp(newHp);

      setTimeout(() => setIsHitAnim(false), 500);

      if (currentStage >= 3 || newHp <= 5) {
        // BOSS DEFEATED!
        setBossDefeatedAnim(true);
        setCharacterMood('victory');
        setDragonSpeech('“Hebat! Kamu wira matematik yang bijaksana!”');
        sound.playVictory();
        fireVictoryCelebration();

        setFeedback({
          isCorrect: true,
          title: '🎉 BOSS DEFEATED!',
          text: 'Tahniah! Naga menghadiahkan 💎 Crystal Ajaib, +40 Stars & +80 XP!',
        });

        setTimeout(() => {
          onBossDefeated(40, 80);
        }, 2200);
      } else {
        // Next Boss Stage
        setFeedback({
          isCorrect: true,
          title: '⚡ SERANGAN TEPAT!',
          text: `Perisai retak! ${question.explanation}`,
        });

        setTimeout(() => {
          const nextStage = currentStage + 1;
          setCurrentStage(nextStage);
          setQuestion(generateBossQuestion(ageGroup, nextStage));
          setSelectedIdx(null);
          setIsLocked(false);
          setFeedback(null);
          setCharacterMood('idle');
          if (nextStage === 2) setDragonSpeech('“Perisai kedua lebih kuat!”');
          if (nextStage === 3) setDragonSpeech('“Ini cabaran teka-teki terakhirku!”');
        }, 1200);
      }
    } else {
      // Gentle retry
      sound.playWrong();
      setCharacterMood('oops');
      setDragonSpeech('“Hampir tepat! Fikir lagi sekali!”');
      setFeedback({
        isCorrect: false,
        title: '💡 Hampir Berjaya!',
        text: `Jawapan yang betul ialah ${question.correctAnswer}. ${question.explanation} Cuba lagi!`,
      });

      setTimeout(() => {
        setQuestion(generateBossQuestion(ageGroup, currentStage));
        setSelectedIdx(null);
        setIsLocked(false);
        setFeedback(null);
        setCharacterMood('idle');
      }, 1800);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2 sm:py-4 flex flex-col items-center select-none relative z-10">
      {/* Boss Encounter Header */}
      <div className="text-center mb-2 sm:mb-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/25 border border-rose-500/50 text-rose-300 text-xs font-black mb-1 animate-pulse">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>🚨 FINAL BOSS ROUND 🚨</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-yellow-400 tracking-tight font-heading">
          MATH DRAGON
        </h2>
      </div>

      {/* Dragon HP & Shield Meter */}
      <div className="w-full bg-slate-900/85 backdrop-blur-md p-3 rounded-2xl border border-slate-700 mb-3 shadow-lg">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-black text-white font-heading flex items-center gap-1.5">
            <span>🐲</span>
            <span>Perisai Math Dragon (Peringkat {currentStage}/3)</span>
          </span>
          <span className="text-xs font-black text-rose-400 tabular-nums">
            HP {bossHp}%
          </span>
        </div>

        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 transition-all duration-500 rounded-full"
            style={{ width: `${bossHp}%` }}
          />
        </div>
      </div>

      {/* Arena Stage: Dragon and Player Mascot Face-Off */}
      <div className={`w-full bg-slate-800/90 border-2 border-rose-500/50 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md relative overflow-hidden mb-3 transition-all ${isHitAnim ? 'animate-shake ring-4 ring-rose-500' : ''}`}>
        <div className="flex items-center justify-around mb-3">
          {/* Dragon Boss Avatar with Speech Bubble */}
          <div className="flex flex-col items-center relative">
            <div className="absolute -top-9 z-20 px-2.5 py-1 rounded-xl bg-slate-900 border border-rose-400 text-white text-[11px] font-extrabold font-heading speech-bubble-bottom max-w-[160px] text-center leading-tight">
              {dragonSpeech}
            </div>

            <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-3 border-rose-500 shadow-xl bg-slate-950 ${bossDefeatedAnim ? 'opacity-80 scale-95' : 'animate-float'}`}>
              <img
                src={BOSS_DRAGON_IMG}
                alt="Math Dragon Boss"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {bossDefeatedAnim && (
                <div className="absolute inset-0 bg-emerald-950/80 flex flex-col items-center justify-center p-1 text-center">
                  <span className="text-2xl">💎</span>
                  <span className="text-[10px] font-black text-emerald-300 font-heading">
                    DIJINAKKAN!
                  </span>
                </div>
              )}
            </div>
            <span className="text-[11px] font-black text-rose-300 mt-1 font-heading">Math Dragon</span>
          </div>

          <div className="text-xl font-black text-rose-400 font-heading">VS</div>

          {/* Hero Mascot Avatar */}
          <div className="flex flex-col items-center">
            <CharacterAvatar
              characterId={characterId}
              expression={characterMood}
              size="md"
            />
            <span className="text-[11px] font-black text-amber-300 mt-1 font-heading">Hero Kamu</span>
          </div>
        </div>

        {/* Boss Story Question Box */}
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-3 sm:p-4 mb-3 text-center">
          <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider block">
            {question.storyText}
          </span>
          <p className="text-sm sm:text-base font-bold text-white mt-1 leading-relaxed">
            {question.prompt}
          </p>
        </div>

        {/* 4 Big Answer Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = idx === question.correctIndex;

            let btnStyle = 'bg-slate-900/90 border-slate-700 hover:border-amber-400 hover:bg-slate-900 text-white';

            if (isLocked) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-600 border-emerald-400 text-white ring-4 ring-emerald-400/50 shadow-emerald-500/50 scale-105';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-amber-700/80 border-amber-500 text-amber-100 animate-shake';
              } else {
                btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isLocked}
                onClick={() => handleSelectAnswer(idx)}
                className={`arcade-btn py-3 sm:py-4 px-2.5 rounded-2xl border-3 text-xl sm:text-2xl font-black transition-all cursor-pointer flex items-center justify-center min-h-[58px] sm:min-h-[68px] font-heading ${btnStyle}`}
              >
                <span className="tabular-nums">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mt-3 p-3 rounded-2xl border-2 flex items-center justify-between gap-2 animate-pop-in ${
              feedback.isCorrect
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                : 'bg-amber-500/25 border-amber-400 text-amber-200'
            }`}
          >
            <span className="text-2xl">{feedback.isCorrect ? '⚔️' : '💡'}</span>
            <div className="flex-1">
              <h4 className="text-sm font-black font-heading leading-tight">{feedback.title}</h4>
              <p className="text-xs font-bold leading-tight">{feedback.text}</p>
            </div>
          </div>
        )}
      </div>

      {/* Skip button */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onSkipOrLose();
          }}
          className="text-xs text-slate-400 hover:text-slate-200 underline font-bold transition cursor-pointer"
        >
          Lihat Keputusan Sesi Ini Sekarang →
        </button>
      </div>
    </div>
  );
};
