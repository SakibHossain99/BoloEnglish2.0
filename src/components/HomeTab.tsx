import React, { useState } from "react";
import { useGlobalState } from "../globalState";
import { getCurriculumForDay } from "../CurriculumData";
import { LessonEngine } from "./LessonEngine";
import { playSound } from "./AudioPlayer";
import { 
  Flame, 
  Lock, 
  Unlock, 
  Zap, 
  ChevronRight, 
  Sparkles, 
  Gift, 
  GraduationCap, 
  Calendar, 
  Trophy 
} from "lucide-react";

export const HomeTab: React.FC = () => {
  const { currentDay, streak, xp, addXp } = useGlobalState();
  const [lessonInProgress, setLessonInProgress] = useState<boolean>(false);
  
  // Mystery Chest lock status tracking
  const [lastUnlockedDay, setLastUnlockedDay] = useState<number>(0);
  const [lootChestOpen, setLootChestOpen] = useState<boolean>(false);
  const [lootItem, setLootItem] = useState<string | null>(null);

  // Load curriculum details for active day
  const activeDayCurriculum = getCurriculumForDay(currentDay);

  const startLesson = () => {
    playSound("unlock");
    setLessonInProgress(true);
  };

  const handleCloseLesson = () => {
    setLessonInProgress(false);
    // If currentDay increased, we can set that they unlocked the chest for the previous day
    if (currentDay > lastUnlockedDay) {
      setLastUnlockedDay(currentDay - 1);
    }
  };

  const isChestUnlockable = currentDay > 1 || lastUnlockedDay > 0;

  const unlockMysteryChest = () => {
    if (!isChestUnlockable) {
      playSound("error");
      return;
    }
    
    playSound("unlock");
    const lootItems = [
      "Streak Protection Shield 🛡️",
      "Double XP Boost (2 Hours) ⚡",
      "Bilingual Presenter Accent Guide 🎙️",
      "Syllable Timing Accent Filter 🎚️",
      "Duolingo-Proof Confidence Aura ✨",
      "Software Interview Q&A Booklet 📑"
    ];
    const item = lootItems[Math.floor(Math.random() * lootItems.length)];
    setLootItem(item);
    setLootChestOpen(true);
  };

  // If active lesson is open, mount the pipeline engine solely
  if (lessonInProgress) {
    return <LessonEngine onClose={handleCloseLesson} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Dynamic Streak & Gamification Header */}
      <div className="bg-[#FEF3C7] neo-border rounded-2xl p-5 neo-shadow relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-15">
          <Flame size={100} className="text-[#F59E0B]" />
        </div>

        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-[#F59E0B] p-2.5 rounded-xl neo-border-sm text-white">
            <Flame size={24} fill="white" className="animate-bounce" />
          </div>
          <div>
            <span className="font-display font-black text-xl tracking-wide uppercase text-[#B45309] block leading-none">
              {streak} DAY STREAK!
            </span>
            <p className="text-xs text-[#92400E] font-semibold mt-1">
              Complete today's lesson to advance your streak and claim mystery chests!
            </p>
          </div>
        </div>

        {/* Dynamic Streak Progress Indicators */}
        <div className="mt-4 relative">
          <div className="h-6 bg-white rounded-lg neo-border-sm overflow-hidden flex relative">
            <div 
              className="bg-[#F59E0B] h-full transition-all duration-500 ease-out" 
              style={{ width: `${Math.min((streak % 7) * 14.2 + 10, 100)}%` }} 
            />
            
            <div className="absolute inset-0 flex justify-between px-4 items-center pointer-events-none">
              <span className="text-[9px] uppercase font-bold text-[#0F172A] opacity-75">Mon</span>
              <span className="text-[9px] uppercase font-bold text-[#0F172A] opacity-75">Wed ⭐</span>
              <span className="text-[9px] uppercase font-bold text-[#0F172A] opacity-75">Fri ⭐</span>
              <span className="text-[9px] uppercase font-bold text-[#0F172A] opacity-75">Sunday 🎁</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Sequential Daily Lesson Billboard Card */}
      <div className="bg-white neo-border rounded-2xl p-6 neo-shadow relative border-4 border-[#0F172A]">
        <div className="absolute right-4 top-4">
          <span className="bg-[#7C3AED] text-white text-[9px] font-mono font-black px-2.5 py-0.5 rounded-full neo-border-sm uppercase tracking-wide">
            Day {currentDay} Target
          </span>
        </div>

        <div className="space-y-1 mb-4">
          <span className="text-[#7C3AED] font-display font-black text-xs uppercase tracking-widest block">
            Current Lesson Goal
          </span>
          <h2 className="font-display font-black text-2xl text-[#0F172A] leading-tight">
            {activeDayCurriculum.title}
          </h2>
          <span className="text-stone-500 text-[11px] font-mono font-bold block">
            {activeDayCurriculum.phaseTitle}
          </span>
        </div>

        {/* Simple Course Summary description */}
        <p className="text-xs text-stone-600 font-semibold leading-relaxed mb-5 bg-[#FAFAF9] p-3 rounded-xl border border-stone-100">
          🔓 Complete this 3-step pipeline (Teach vocab fundamentals, practice native pronunciations, and pass the translation challenge) to boost your English fluency.
        </p>

        {/* Primary Call To Action block */}
        <button
          id="start-day-lesson-btn"
          onClick={startLesson}
          className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-display font-black text-sm uppercase tracking-wider rounded-xl neo-border neo-shadow transition-transform neo-button-push flex items-center justify-center space-x-2 cursor-pointer"
        >
          <GraduationCap size={18} />
          <span>Start Today's Lesson (Day {currentDay})</span>
        </button>
      </div>

      {/* 3. Action Drills Panel */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#ECFDF5] neo-border rounded-xl p-4 neo-shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase font-black text-[#059669]">Accent Tune</span>
            <h4 className="font-display font-extrabold text-xs text-[#0F172A] mt-1 uppercase">Pronunciation Drill</h4>
            <p className="text-[10px] text-stone-600 font-medium leading-relaxed mt-1">
              Read 5 native phrases aloud to tone phonetic accuracy values.
            </p>
          </div>
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-emerald-100">
            <span className="font-mono text-[9px] font-black text-[#059669] bg-white rounded-md px-1.5 py-0.5 border border-emerald-200">+15 XP</span>
            <button 
              onClick={() => {
                playSound("click");
                // Navigate to busters tab or trigger sound
                const bustersTab = document.getElementById("nav-tab-busters");
                if (bustersTab) bustersTab.click();
              }}
              className="text-[10px] text-[#059669] font-black flex items-center cursor-pointer hover:underline"
            >
              Go <ChevronRight size={12} />
            </button>
          </div>
        </div>

        <div className="bg-[#EFF6FF] neo-border rounded-xl p-4 neo-shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase font-black text-blue-600">Vocabulary deck</span>
            <h4 className="font-display font-extrabold text-xs text-[#0F172A] mt-1 uppercase">Vocab Cards</h4>
            <p className="text-[10px] text-stone-600 font-medium leading-relaxed mt-1">
              Test your memory of unlocked words using clean flashcard triggers.
            </p>
          </div>
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-blue-100">
            <span className="font-mono text-[9px] font-black text-blue-650 bg-white rounded-md px-1.5 py-0.5 border border-blue-200">+35 XP</span>
            <button 
              onClick={() => {
                playSound("click");
                const cardsTab = document.getElementById("nav-tab-cards");
                if (cardsTab) cardsTab.click();
              }}
              className="text-[10px] text-blue-600 font-black flex items-center cursor-pointer hover:underline"
            >
              Cards <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Gamified Chest - unlocked on completing lesson */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 neo-border neo-shadow relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#7C3AED] opacity-25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#F59E0B] opacity-25 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="space-y-1 max-w-[70%]">
            <div className="flex items-center space-x-2">
              <span className="bg-[#F59E0B] text-black text-[9px] font-display font-black px-2 py-0.5 rounded uppercase tracking-wide">
                EXCLUSIVE LOOT
              </span>
              {isChestUnlockable && (
                <span className="bg-emerald-500 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded animate-pulse">
                  UNLOCKED
                </span>
              )}
            </div>
            <h3 className="font-display font-black text-base text-white">
              Mystery Reward Chest
            </h3>
            <p className="text-[10px] text-stone-400 font-medium">
              {!isChestUnlockable 
                ? "Locked. Fill today's sequential lesson pipeline to release exclusive items!" 
                : "Unlocked! Tap the chest icon to discover your exclusive reward!"}
            </p>
          </div>

          <button
            id="mystery-chest-claim-btn"
            onClick={unlockMysteryChest}
            className={`p-4 rounded-xl neo-border transition-all flex items-center justify-center ${
              !isChestUnlockable
                ? "bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed"
                : "bg-[#7C3AED] text-white hover:bg-[#6D28D9] animate-bounce-slow cursor-pointer"
            }`}
          >
            {!isChestUnlockable ? <Lock size={22} /> : <Unlock size={22} className="text-[#F59E0B]" />}
          </button>
        </div>

        {/* Chest Looting Reward Modal drawer inside interface */}
        {lootChestOpen && (
          <div className="mt-4 bg-stone-800 p-4 rounded-xl border border-stone-705 space-y-3 relative text-stone-200">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-[#F59E0B] uppercase tracking-widest flex items-center">
                <Gift size={12} className="mr-1" /> Loot Item Discovered!
              </span>
              <button 
                onClick={() => setLootChestOpen(false)} 
                className="text-stone-400 hover:text-white font-bold text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            
            <div className="bg-[#0F172A] p-3 rounded-lg border-2 border-[#7C3AED] text-center">
              <p className="text-xs font-display font-black text-white uppercase">
                {lootItem}
              </p>
              <p className="text-[9px] text-[#A78BFA] mt-1 font-semibold">
                Successfully claimed! This will boost your confidence during active practice drills.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
