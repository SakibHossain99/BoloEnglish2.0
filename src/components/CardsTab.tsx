import React, { useState } from "react";
import { playSound } from "./AudioPlayer";
import { useGlobalState } from "../globalState";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Award,
  Eye,
  Sparkles,
  BookOpen,
} from "lucide-react";

export const CardsTab: React.FC = () => {
  const {
    profile,
    rateCard,
    activeReviewDeck,
    setActiveReviewDeck,
    initReviewSession,
  } = useGlobalState();
  const flashcards = profile?.flashcards ?? [];

  const [flipped, setFlipped] = useState(false);
  const [xpEarnedThisSession, setXpEarnedThisSession] = useState(0);

  // Derive "Today's Deck" isolation using real-time dynamic activeReviewDeck
  const totalDue = activeReviewDeck.length;
  const isDeckFinished = totalDue === 0;
  const activeCard = activeReviewDeck[0] || null;

  // Initialize session on mount
  React.useEffect(() => {
    initReviewSession();
    setFlipped(false);
    setXpEarnedThisSession(0);
  }, []);

  const handleFlip = () => {
    playSound("click");
    setFlipped(!flipped);
  };

  const handleGradeSM2 = async (rating: number) => {
    if (!activeCard) return;

    // Performance based XP reward mapping calibrated to balanced memory metrics
    let xpReward = 0;
    if (rating === 1) xpReward = 0;
    else if (rating === 2) xpReward = 2;
    else if (rating === 3) xpReward = 4;
    else if (rating === 4) xpReward = 5;

    if (rating === 1) {
      playSound("click");
    } else {
      playSound("success");
    }

    // Execute SM-2 state update (automatically awards precise XP internally)
    rateCard(activeCard.id, rating);

    // Update session metrics
    setXpEarnedThisSession((prev) => prev + xpReward);

    // Reset card turn over
    setFlipped(false);
  };

  const restartReviewSession = () => {
    playSound("unlock");
    initReviewSession();
    setXpEarnedThisSession(0);
    setFlipped(false);
  };

  return (
    <div className="space-y-6">
      {/* Tab Descriptive Banner */}
      <div className="space-y-1">
        <h2 className="font-display font-black text-2xl tracking-tight uppercase text-[#0F172A] flex items-center animate-fadeIn">
          <Sparkles className="mr-2 text-[#7C3AED]" />
          ACTIVE DECK REVIEW
        </h2>
        <p className="text-xs text-[#4A4455] font-semibold leading-relaxed">
          Master new phrase structures using the SuperMemo SM-2 Spaced
          Repetition Algorithm.
        </p>
      </div>

      {/* 2. Today's Review Load Metric Frame */}
      {flashcards.length > 0 && (
        <div className="bg-[#EDE9FE] neo-border rounded-xl p-4 neo-shadow-sm flex items-center justify-between border-3 border-[#0F172A]">
          <div className="flex items-center space-x-2">
            <span className="text-lg">⚡</span>
            <span className="font-display font-black text-sm text-[#0F172A] uppercase tracking-wide">
              Remaining Cards: {activeReviewDeck.length}{" "}
              {activeReviewDeck.length === 1 ? "Card" : "Cards"}
            </span>
          </div>
          <span className="bg-[#7C3AED] text-white text-[9px] font-mono font-black px-2.5 py-0.5 rounded-full neo-border-sm uppercase border border-black animate-pulse">
            SM-2 DUE
          </span>
        </div>
      )}

      {/* 3. Screen Body State Conditionals */}
      {flashcards.length === 0 ? (
        /* Empty Global State */
        <div className="bg-white neo-border p-10 rounded-2xl text-center neo-shadow border-4 border-[#0F172A] my-6">
          <Award
            size={48}
            className="mx-auto text-[#7C3AED] mb-4 animate-bounce"
          />
          <h3 className="font-display font-black text-xl text-[#0F172A] uppercase">
            Your deck is empty!
          </h3>
          <p className="text-xs text-stone-600 mt-2 font-medium leading-relaxed max-w-sm mx-auto">
            You don't have any unlocked vocabulary cards yet. Complete your Day
            1 Lesson to automatically add vital word groups!
          </p>
          <button
            onClick={() => {
              playSound("click");
              const homeTab = document.getElementById("nav-tab-home");
              if (homeTab) homeTab.click();
            }}
            className="mt-5 px-6 py-2.5 bg-[#7C3AED] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl neo-border-sm neo-shadow-sm neo-button-push cursor-pointer"
          >
            Go to Today's Lesson
          </button>
        </div>
      ) : isDeckFinished ? (
        /* beautiful, high-dopamine Deck Cleared State */
        <div className="bg-white neo-border p-8 rounded-2xl text-center neo-shadow border-4 border-[#0F172A] my-6 space-y-6 relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-20">
            <Sparkles size={100} className="text-[#F59E0B] fill-[#F59E0B]" />
          </div>

          <div className="w-20 h-20 bg-[#D1FAE5] rounded-full border-4 border-[#0F172A] flex items-center justify-center mx-auto">
            <span className="text-4xl animate-pulse">🔥</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-black text-2xl text-[#0F172A] uppercase tracking-tight">
              Deck Cleared!
            </h3>
            <p className="text-xs text-stone-700 font-semibold max-w-sm mx-auto leading-relaxed">
              Excellent job! You have fully reviewed all available words for
              today. Check back after your next lesson!
            </p>
          </div>

          {/* Points/XP Earned Summary Details */}
          <div className="bg-[#FEF3C7] p-4 rounded-xl border-2 border-[#D97706] inline-block space-y-1">
            <span className="text-[10px] font-mono font-black text-[#D97706] uppercase tracking-wider block">
              SESSION PERFORMANCE REWARDS
            </span>
            <p className="font-display font-black text-xl text-[#B45309]">
              🎖️ Earned +{xpEarnedThisSession} XP
            </p>
          </div>

          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={() => {
                playSound("click");
                const homeTab = document.getElementById("nav-tab-home");
                if (homeTab) homeTab.click();
              }}
              className="px-5 py-3 bg-stone-900 text-white font-display font-black text-xs uppercase rounded-xl neo-border-sm hover:opacity-90 neo-button-push cursor-pointer"
            >
              Back to Home
            </button>
            <button
              onClick={restartReviewSession}
              className="px-5 py-3 bg-[#7C3AED] text-white font-display font-black text-xs uppercase rounded-xl neo-border-sm hover:bg-[#6D28D9] neo-button-push cursor-pointer"
            >
              Restart Session
            </button>
          </div>
        </div>
      ) : activeCard ? (
        /* Active Cards review session screen */
        <div className="space-y-5">
          {/* Main Flashcard Card Component with dynamic flip effects */}
          <div
            id="flashcard-box"
            onClick={handleFlip}
            className="cursor-pointer transition-all duration-300 transform relative select-none"
          >
            <div
              className={`w-full min-h-[310px] bg-[#FAFAF9] neo-border rounded-2xl p-6 neo-shadow flex flex-col justify-between items-center text-center transition-all duration-200 border-4 border-[#0F172A] ${
                flipped
                  ? "bg-[#EDE9FE] border-[#7C3AED]"
                  : "hover:border-[#F59E0B]"
              }`}
            >
              {/* Top tag */}
              <div className="w-full flex justify-between items-center text-[10px] font-mono text-stone-500 font-black uppercase pb-3 border-b-2 border-stone-200 border-dashed">
                <span>Card ID: {activeCard.id % 10000}</span>
                <span className="bg-[#FEF3C7] text-[#D97706] px-2.5 py-0.5 rounded border border-[#D97706] font-display font-black text-[9px] uppercase tracking-wide">
                  {flipped ? "NATIVE ENGLISH" : "BENGALI WORD"}
                </span>
              </div>

              {/* Center Card Phrase */}
              <div className="my-6 space-y-3">
                {!flipped ? (
                  <>
                    <h3 className="font-display font-black text-3xl text-[#0F172A] leading-tight px-4 Bangla-Text">
                      {activeCard.bengali}
                    </h3>
                    <p className="text-stone-500 text-xs flex items-center justify-center space-x-1.5 font-bold">
                      <RefreshCw
                        size={12}
                        className="text-[#7C3AED] animate-spin-slow"
                      />
                      <span>Click to flip card</span>
                    </p>
                  </>
                ) : (
                  <div className="space-y-3 animate-fadeIn">
                    <span className="text-[9px] uppercase font-mono font-black text-rose-500 tracking-wider block">
                      Correct equivalence phrasing:
                    </span>
                    <h3 className="font-display font-black text-2xl text-[#7C3AED] leading-none px-4 uppercase">
                      "{activeCard.english}"
                    </h3>

                    <div className="bg-white neo-border-sm rounded-lg p-2.5 mt-2 max-w-sm mx-auto">
                      <span className="text-[9px] uppercase font-mono font-bold text-stone-500 block">
                        Spelling & Phonetics:
                      </span>
                      <p className="font-mono text-xs text-stone-700 font-bold bg-amber-50 p-1 rounded border border-amber-200 mt-0.5 inline-block">
                        🗣️ / {activeCard.phonetic || activeCard.english} /
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom hint frame */}
              <div className="w-full pt-3 border-t-2 border-stone-200 border-dashed text-xs text-stone-500">
                {flipped ? (
                  <span className="font-bold text-stone-605 block text-[11px] leading-tight max-w-[90%] mx-auto">
                    Context:{" "}
                    {activeCard.hint ||
                      "Practice this phrase elements in active conversations."}
                  </span>
                ) : (
                  <span className="flex items-center justify-center text-[9px] uppercase tracking-widest font-black text-[#7C3AED]">
                    <Eye size={12} className="mr-1" /> Tap cardboard to flip
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4. Spaced Repetition Grading Actions Bottom Bar */}
          {flipped ? (
            <div className="space-y-2">
              <p className="text-center text-[10px] text-stone-500 uppercase font-black tracking-widest block animate-fadeIn">
                How accurately did you recall this native equivalence?
              </p>

              <div className="grid grid-cols-4 gap-2">
                <button
                  id="again-btn"
                  onClick={() => handleGradeSM2(1)}
                  className="bg-[#FEE2E2] hover:bg-[#FEE2E2]/90 neo-border p-3 rounded-xl flex flex-col items-center justify-center neo-shadow-sm transition-transform neo-button-push cursor-pointer border-red-500 border-2"
                >
                  <span className="font-display font-black text-[10px] text-red-800 uppercase">
                    Again (আবার)
                  </span>
                  <span className="font-mono text-[9px] font-black text-[#991B1B] bg-white rounded-md px-1.5 py-0.5 mt-1 border border-red-200">
                    +0 XP
                  </span>
                </button>

                <button
                  id="hard-btn"
                  onClick={() => handleGradeSM2(2)}
                  className="bg-[#FFE4E6] hover:bg-[#FFE4E6]/90 neo-border p-3 rounded-xl flex flex-col items-center justify-center neo-shadow-sm transition-transform neo-button-push cursor-pointer border-pink-500 border-2"
                >
                  <span className="font-display font-black text-[10px] text-pink-800 uppercase">
                    Hard (কঠিন)
                  </span>
                  <span className="font-mono text-[9px] font-black text-[#9D174D] bg-white rounded-md px-1.5 py-0.5 mt-1 border border-pink-200">
                    +2 XP
                  </span>
                </button>

                <button
                  id="good-btn"
                  onClick={() => handleGradeSM2(3)}
                  className="bg-[#FEF3C7] hover:bg-[#FEF3C7]/90 neo-border p-3 rounded-xl flex flex-col items-center justify-center neo-shadow-sm transition-transform neo-button-push cursor-pointer border-[#D97706] border-2"
                >
                  <span className="font-display font-black text-[10px] text-amber-800 uppercase">
                    Good (ঠিক আছে)
                  </span>
                  <span className="font-mono text-[9px] font-black text-[#D97706] bg-white rounded-md px-1.5 py-0.5 mt-1 border border-amber-200">
                    +4 XP
                  </span>
                </button>

                <button
                  id="mastered-btn"
                  onClick={() => handleGradeSM2(4)}
                  className="bg-[#D1FAE5] hover:bg-[#D1FAE5]/90 neo-border p-3 rounded-xl flex flex-col items-center justify-center neo-shadow-sm transition-transform neo-button-push cursor-pointer border-emerald-500 border-2"
                >
                  <span className="font-display font-black text-[10px] text-emerald-800 uppercase">
                    Mastered (সহজ)
                  </span>
                  <span className="font-mono text-[9px] font-black text-[#03543F] bg-white rounded-md px-1.5 py-0.5 mt-1 border border-emerald-200">
                    +5 XP
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                id="tap-reveal-btn"
                onClick={handleFlip}
                className="w-full py-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-display font-black text-xs uppercase tracking-wider neo-border neo-shadow-sm transition-all neo-button-push flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RefreshCw size={14} className="animate-spin-slow" />
                <span>Reveal English translation</span>
              </button>
            </div>
          )}

          {/* Browse Navigation Controls */}
          <div className="flex justify-between items-center py-2 bg-stone-50 px-3 rounded-xl border border-stone-200 text-xs font-bold text-[#0F172A]">
            <button
              id="prev-card-btn"
              disabled={activeReviewDeck.length <= 1}
              onClick={() => {
                playSound("click");
                setFlipped(false);
                setActiveReviewDeck((prevDeck) => {
                  if (prevDeck.length <= 1) return prevDeck;
                  const last = prevDeck[prevDeck.length - 1];
                  const rest = prevDeck.slice(0, prevDeck.length - 1);
                  return [last, ...rest];
                });
              }}
              className={`flex items-center space-x-1 ${
                activeReviewDeck.length <= 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:opacity-80 cursor-pointer"
              }`}
            >
              <ChevronLeft size={16} /> <span>Previous</span>
            </button>

            <span className="text-[10px] font-mono text-stone-500 font-bold">
              Remaining Cards: {activeReviewDeck.length}
            </span>

            <button
              id="next-card-btn"
              disabled={activeReviewDeck.length <= 1}
              onClick={() => {
                playSound("beep");
                setFlipped(false);
                setActiveReviewDeck((prevDeck) => {
                  if (prevDeck.length <= 1) return prevDeck;
                  const [first, ...rest] = prevDeck;
                  return [...rest, first];
                });
              }}
              className={`flex items-center space-x-1 ${
                activeReviewDeck.length <= 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:opacity-80 cursor-pointer"
              }`}
            >
              <span>Skip Card</span> <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : null}

      {/* 4. WORD ARCHIVE LIST (My Unlocked Vocabulary Bank) */}
      <div className="bg-white neo-border rounded-2xl p-5 neo-shadow-sm border-3 border-[#0F172A] mt-6">
        <div className="border-b-2 border-stone-100 pb-3 mb-4">
          <h3 className="font-display font-black text-xs text-[#0F172A] uppercase tracking-wider flex items-center">
            <BookOpen className="mr-1.5 text-[#7C3AED]" size={15} />
            My Unlocked Vocabulary Bank ({flashcards.length})
          </h3>
          <p className="text-[10px] text-stone-500 font-semibold leading-relaxed">
            All vocabulary phrases unlocked through your successful daily
            curriculum progress.
          </p>
        </div>

        {flashcards.length === 0 ? (
          <p className="text-xs text-stone-400 italic text-center py-5">
            Vocabulary bank empty. Complete lessons on the Home tab to discover
            and archive new phrases!
          </p>
        ) : (
          <div className="divide-y-2 divide-stone-100 border-2 border-[#0F172A] rounded-xl overflow-hidden max-h-[290px] overflow-y-auto">
            {flashcards.map((card: any) => (
              <div
                key={card.id || card.bengali}
                className="p-3 bg-white flex items-center justify-between text-xs hover:bg-[#FAFAF9] transition-colors"
              >
                <div className="space-y-0.5 text-left">
                  <span className="font-display font-black text-xs text-[#0F172A] Bangla-Text">
                    {card.bengali}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-stone-500 block">
                    Interval: {card.interval || 1} days | Reps:{" "}
                    {card.repetitions || 0} | Ease: {card.easeFactor || "2.5"}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-display font-black text-[#7C3AED] block text-xs">
                    "{card.english}"
                  </span>
                  <span
                    className={`inline-block text-[8px] font-mono font-black px-1.5 py-0.5 rounded-full neo-border-sm uppercase border ${
                      card.isMastered
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    {card.isMastered ? "MASTERED ✅" : "IN REVIEW ⚡"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
