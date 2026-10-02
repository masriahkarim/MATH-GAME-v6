import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Flame, Star, Sparkles, Zap, Gift, ArrowRight } from 'lucide-react';
import { AgeGroup, Question, CharacterId, CharacterExpression } from '../types/game';
import { CHARACTERS } from '../utils/characters';
import { generateQuestion } from '../utils/questionGenerator';
import { sound } from '../utils/sound';
import { fireConfetti, fireStarBurst } from '../utils/confetti';
import { CharacterAvatar } from './CharacterAvatar';

interface GameScreenProps {
  ageGroup: AgeGroup;
  characterId: CharacterId;
  onTriggerBoss: () => void;
  onFinishSession: (stats: {
    questionsAnswered: number;
    correctAnswers: number;
    highestCombo: number;
    starsEarned: number;
    xpEarned: number;
    bossDefeated: boolean;
    timeSpentSeconds: number;
  }) => void;
  onQuit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  ageGroup,
  characterId,
  onTriggerBoss,
  onFinishSession,
  onQuit,
}) => {
  const TOTAL_GAME_TIME = 300; // 5 minutes in seconds
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_GAME_TIME);
  const [difficultyTier, setDifficultyTier] = useState<1 | 2 | 3>(1);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  // Scores
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);

  // Question & Answers
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() =>
    generateQuestion(ageGroup, 1, 1)
  );
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);

  // Animations & Expressions
  const [characterMood, setCharacterMood] = useState<CharacterExpression>('idle');
  const [characterSpeech, setCharacterSpeech] = useState<string>('');
  const [flyingStarActive, setFlyingStarActive] = useState(false);

  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    title: string;
    message: string;
    hint?: string;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const bossTriggeredRef = useRef(false);

  // Transition to Boss
  const handleTriggerBoss = useCallback(() => {
    if (bossTriggeredRef.current) return;
    bossTriggeredRef.current = true;
    sound.playBossIntro();
    onTriggerBoss();
  }, [onTriggerBoss]);

  // Main 5-minute countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTriggerBoss();
          return 0;
        }
        if (prev === 45 && !bossTriggeredRef.current) {
          handleTriggerBoss();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleTriggerBoss]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Next question loader
  const loadNextQuestion = (nextDiff: 1 | 2 | 3, nextQNumber: number) => {
    setSelectedOptionIndex(null);
    setFeedback(null);
    setIsAnswerLocked(false);
    setCharacterMood('idle');
    setCharacterSpeech('');
    setFlyingStarActive(false);

    const nextQ = generateQuestion(ageGroup, nextDiff, nextQNumber);
    setCurrentQuestion(nextQ);

    if (nextQ.specialMoment && nextQ.specialMoment !== 'none') {
      sound.playSpecialAlert();
    }
  };

  // Answer handler
  const handleSelectAnswer = (optionIdx: number) => {
    if (isAnswerLocked) return;
    setIsAnswerLocked(true);
    setSelectedOptionIndex(optionIdx);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    const newTotalAnswered = questionsAnswered + 1;
    setQuestionsAnswered(newTotalAnswered);

    if (isCorrect) {
      const nextCombo = currentCombo + 1;
      setCurrentCombo(nextCombo);
      if (nextCombo > highestCombo) {
        setHighestCombo(nextCombo);
      }

      // Calculate Stars with combo and Special Moment multipliers
      let baseStars = 10;
      let comboBonus = Math.min(nextCombo * 2, 20);

      if (currentQuestion.specialMoment === 'bonus_2x') {
        baseStars *= 2;
        comboBonus *= 2;
      } else if (currentQuestion.specialMoment === 'star_bonus') {
        baseStars += 20;
      }

      const totalStarsGained = baseStars + comboBonus;
      const xpGained = 15 + nextCombo * 3;

      setSessionStars((prev) => prev + totalStarsGained);
      setSessionXp((prev) => prev + xpGained);
      setCorrectAnswers((prev) => prev + 1);

      // Trigger flying star effect
      setFlyingStarActive(true);

      // Audio & Expression Feedback
      if (nextCombo >= 10) {
        sound.playSuperCombo();
        fireStarBurst();
        setCharacterMood('combo');
        setCharacterSpeech('👑 MATH HERO!');
      } else if (nextCombo >= 5) {
        sound.playCombo(nextCombo);
        fireConfetti();
        setCharacterMood('combo');
        setCharacterSpeech('⚡ SUPER COMBO!');
      } else if (nextCombo >= 2) {
        sound.playCombo(nextCombo);
        setCharacterMood('happy');
        setCharacterSpeech(`🔥 COMBO x${nextCombo}!`);
      } else {
        sound.playCorrect();
        setCharacterMood('happy');
        setCharacterSpeech('HEBAT! 🎉');
      }

      // Adaptive difficulty
      const nextConsecCorrect = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextConsecCorrect);
      setConsecutiveWrong(0);

      let nextDiff = difficultyTier;
      if (nextConsecCorrect >= 3 && difficultyTier < 3) {
        nextDiff = (difficultyTier + 1) as 1 | 2 | 3;
        setDifficultyTier(nextDiff);
        setConsecutiveCorrect(0);
      }

      setFeedback({
        isCorrect: true,
        title: '🎉 BETUL!',
        message: `+${totalStarsGained} Stars! ${currentQuestion.explanation}`,
      });

      // Quick snappy transition (0.75s) so child doesn't wait!
      setTimeout(() => {
        loadNextQuestion(nextDiff, newTotalAnswered + 1);
      }, 750);
    } else {
      // Gentle, encouraging wrong answer feedback
      sound.playWrong();
      setCharacterMood('oops');
      setCharacterSpeech('Cuba lagi! 💡');
      setCurrentCombo(0);

      const nextConsecWrong = consecutiveWrong + 1;
      setConsecutiveWrong(nextConsecWrong);
      setConsecutiveCorrect(0);

      let nextDiff = difficultyTier;
      if (nextConsecWrong >= 2 && difficultyTier > 1) {
        nextDiff = (difficultyTier - 1) as 1 | 2 | 3;
        setDifficultyTier(nextDiff);
        setConsecutiveWrong(0);
      }

      setFeedback({
        isCorrect: false,
        title: '💡 Hampir Tepat!',
        message: `Jawapan yang betul ialah ${currentQuestion.correctAnswer}.`,
        hint: currentQuestion.hint,
      });

      // Allow 1.6s for child to see the tip, or click to proceed
      setTimeout(() => {
        loadNextQuestion(nextDiff, newTotalAnswered + 1);
      }, 1600);
    }
  };

  // Timer excitement label
  const getTimerExcitement = () => {
    if (secondsLeft <= 30) return { label: '🚀 FINAL PUSH!', color: 'text-rose-400 animate-pulse' };
    if (secondsLeft <= 60) return { label: '🔥 LAST MINUTE!', color: 'text-amber-400 animate-pulse' };
    return null;
  };

  const timerAlert = getTimerExcitement();

  // Combo badge style
  const getComboBadge = () => {
    if (currentCombo >= 10) return { label: '👑 MATH HERO x10', bg: 'bg-yellow-400 text-slate-950 ring-yellow-300' };
    if (currentCombo >= 5) return { label: '⚡ SUPER COMBO x5', bg: 'bg-amber-400 text-slate-950 ring-amber-300' };
    if (currentCombo >= 2) return { label: `🔥 COMBO x${currentCombo}`, bg: 'bg-orange-500 text-white ring-orange-400' };
    return null;
  };

  const comboBadge = getComboBadge();

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2 sm:py-4 flex flex-col items-center select-none relative z-10">
      {/* ================= TOP ZONE: HUD ================= */}
      <div className="w-full bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 mb-3 shadow-xl flex items-center justify-between gap-2">
        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Timer className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-base sm:text-xl font-black tabular-nums tracking-tight text-white font-mono leading-none">
              ⏱️ {formatTime(secondsLeft)}
            </div>
            {timerAlert && (
              <span className={`text-[10px] font-black uppercase tracking-wider block mt-0.5 ${timerAlert.color}`}>
                {timerAlert.label}
              </span>
            )}
          </div>
        </div>

        {/* Combo Badge */}
        <div>
          {comboBadge ? (
            <div
              className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm shadow-md animate-bounce-slight ring-2 ${comboBadge.bg}`}
            >
              {comboBadge.label}
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 font-bold px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80">
              🔥 Combo sedia
            </div>
          )}
        </div>

        {/* Stars counter with Flying Star target */}
        <div className="flex items-center gap-2 relative">
          <div className="flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3 py-1.5 rounded-xl text-sm font-black shadow-inner">
            <span className="text-base">⭐</span>
            <span className="tabular-nums font-black">+{sessionStars}</span>
          </div>

          {/* Flying star particle on correct answer */}
          {flyingStarActive && (
            <span 
              className="absolute -top-4 right-2 text-2xl pointer-events-none animate-bounce"
              style={{ animation: 'flyToScore 0.6s ease-out forwards' }}
            >
              ⭐
            </span>
          )}

          {/* Quick jump to Boss for test/skip */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              handleTriggerBoss();
            }}
            className="px-2 py-1 bg-purple-500/25 hover:bg-purple-500/45 border border-purple-500/40 text-purple-300 hover:text-white rounded-xl text-[11px] font-black transition cursor-pointer"
            title="Lompat ke Final Boss sekarang"
          >
            🐲 Boss
          </button>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full bg-slate-900/60 h-2 rounded-full overflow-hidden mb-3 border border-slate-800">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            secondsLeft < 45
              ? 'bg-rose-500'
              : secondsLeft < 120
              ? 'bg-amber-400'
              : 'bg-emerald-400'
          }`}
          style={{ width: `${(secondsLeft / TOTAL_GAME_TIME) * 100}%` }}
        />
      </div>

      {/* ================= MIDDLE ZONE: CHARACTER & QUESTION CARD ================= */}
      {/* Reactive Character Stage */}
      <div className="mb-2">
        <CharacterAvatar
          characterId={characterId}
          expression={characterMood}
          size="md"
          showSpeechBubble={Boolean(characterSpeech)}
          speechText={characterSpeech}
        />
      </div>

      {/* Special Moment Banner (if active) */}
      {currentQuestion.specialMoment === 'bonus_2x' && (
        <div className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm py-1.5 px-3 rounded-2xl mb-2 text-center shadow-lg animate-bounce-slight flex items-center justify-center gap-1.5 font-heading">
          <Gift className="w-4 h-4" />
          <span>🎁 BONUS ROUND! Jawapan betul dapat 2x Stars!</span>
        </div>
      )}
      {currentQuestion.specialMoment === 'star_bonus' && (
        <div className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-950 font-black text-xs sm:text-sm py-1.5 px-3 rounded-2xl mb-2 text-center shadow-lg animate-bounce-slight flex items-center justify-center gap-1.5 font-heading">
          <Star className="w-4 h-4 fill-slate-950" />
          <span>💎 STAR BONUS! Selesaikan soalan ini untuk +20 Stars!</span>
        </div>
      )}
      {currentQuestion.specialMoment === 'speed_rush' && (
        <div className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs sm:text-sm py-1.5 px-3 rounded-2xl mb-2 text-center shadow-lg animate-bounce-slight flex items-center justify-center gap-1.5 font-heading">
          <Zap className="w-4 h-4 fill-slate-950" />
          <span>⚡ SPEED ROUND! Buktikan kepantasan kamu!</span>
        </div>
      )}

      {/* Question Card */}
      <div className="w-full bg-slate-800/90 border-2 border-amber-400/50 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden mb-3">
        {/* Category Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-3">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <span>{currentQuestion.visualEmoji}</span>
            <span>{currentQuestion.category}</span>
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            Soalan #{questionsAnswered + 1}
          </span>
        </div>

        {/* Big Bold Math Question */}
        <div className="py-2 text-center">
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow font-heading leading-tight">
            {currentQuestion.prompt}
          </h3>
        </div>

        {/* Feedback Alert Overlay Toast */}
        {feedback && (
          <div
            className={`mt-3 p-3 rounded-2xl border-2 flex items-center justify-between gap-2 animate-pop-in ${
              feedback.isCorrect
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                : 'bg-amber-500/25 border-amber-400 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{feedback.isCorrect ? '🎉' : '💡'}</span>
              <div>
                <h4 className="text-sm sm:text-base font-black font-heading leading-tight">
                  {feedback.title}
                </h4>
                <p className="text-xs font-bold leading-tight">{feedback.message}</p>
                {feedback.hint && (
                  <p className="text-[11px] font-bold text-amber-300 italic mt-0.5">
                    {feedback.hint}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => loadNextQuestion(difficultyTier, questionsAnswered + 2)}
              className="p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl border border-white/20 text-xs font-black shrink-0 flex items-center gap-1 cursor-pointer"
              title="Terus ke soalan seterusnya"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ================= BOTTOM ZONE: 4 LARGE ANSWER BUTTONS ================= */}
      <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isCorrect = idx === currentQuestion.correctIndex;

          let btnStyle = 'bg-slate-900/85 border-slate-700 hover:border-amber-400 hover:bg-slate-900 text-white';

          if (isAnswerLocked) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-600 border-emerald-400 text-white ring-4 ring-emerald-400/60 shadow-lg shadow-emerald-500/50 scale-105';
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
              disabled={isAnswerLocked}
              onClick={() => handleSelectAnswer(idx)}
              className={`arcade-btn py-3.5 sm:py-5 px-3 rounded-2xl border-3 text-2xl sm:text-3xl font-black transition-all cursor-pointer flex items-center justify-center min-h-[64px] sm:min-h-[78px] font-heading select-none ${btnStyle}`}
            >
              <span className="tabular-nums tracking-tight">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Quit / Back to Menu Footnote */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400 mt-3 px-2">
        <button
          type="button"
          onClick={() => {
            if (confirm('Kembali ke menu utama? Kemajuan sesi ini akan disimpan.')) {
              onFinishSession({
                questionsAnswered,
                correctAnswers,
                highestCombo,
                starsEarned: sessionStars,
                xpEarned: sessionXp,
                bossDefeated: false,
                timeSpentSeconds: TOTAL_GAME_TIME - secondsLeft,
              });
            }
          }}
          className="hover:text-slate-200 underline font-bold transition cursor-pointer"
        >
          ← Berhenti & Simpan
        </button>

        <span className="text-[11px] text-emerald-400 font-bold">
          ⭐ {correctAnswers}/{questionsAnswered} Betul
        </span>
      </div>
    </div>
  );
};
