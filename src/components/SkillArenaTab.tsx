import React, { useState } from "react";
import { playSound } from "./AudioPlayer";
import { useGlobalState } from "../globalState";
import { AcademicTrack } from "./AcademicTrack";
import { FunctionalTrack } from "./FunctionalTrack";
import { 
  Sparkles, 
  Gamepad2, 
  Award, 
  BookOpen, 
  Flame, 
  GraduationCap 
} from "lucide-react";

export const SkillArenaTab: React.FC = () => {
  const { profile, updateUserXp, adjustWeakPoints } = useGlobalState();
  const [activeTrack, setActiveTrack] = useState<"academic" | "functional">("academic");
  const [rewardsEarned, setRewardsEarned] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [completedModuleName, setCompletedModuleName] = useState<string>("");

  // Dynamic Triple-Core Analytics Engine calculation to coordinate states perfectly
  const metrics = profile?.metrics ?? {
    literalAttempts: 0,
    literalMistakes: 0,
    tenseAttempts: 0,
    tenseMistakes: 0,
    phoneticAttempts: 0,
    phoneticSuccesses: 0,
    advancedMediaAttempts: 0,
    advancedMediaMistakes: 0,
    advancedCompositionAttempts: 0,
    advancedCompositionMistakes: 0,
  };

  const literalAttempts = metrics.literalAttempts ?? 0;
  const literalMistakes = metrics.literalMistakes ?? 0;
  const tenseAttempts = metrics.tenseAttempts ?? 0;
  const tenseMistakes = metrics.tenseMistakes ?? 0;
  const phoneticAttempts = metrics.phoneticAttempts ?? 0;
  const phoneticSuccesses = metrics.phoneticSuccesses ?? 0;
  const advancedMediaAttempts = metrics.advancedMediaAttempts ?? 0;
  const advancedMediaMistakes = metrics.advancedMediaMistakes ?? 0;
  const advancedCompositionAttempts = metrics.advancedCompositionAttempts ?? 0;
  const advancedCompositionMistakes = metrics.advancedCompositionMistakes ?? 0;

  const literalImmunity = literalAttempts > 0 
    ? Math.round(((literalAttempts - literalMistakes) / literalAttempts) * 100) 
    : 100;

  const weightedTenseAttempts = tenseAttempts + (advancedCompositionAttempts * 3);
  const weightedTenseMistakes = tenseMistakes + (advancedCompositionMistakes * 3);
  const tenseAccuracy = weightedTenseAttempts > 0 
    ? Math.max(0, Math.min(100, Math.round(((weightedTenseAttempts - weightedTenseMistakes) / weightedTenseAttempts) * 100))) 
    : 100;

  const weightedPhoneticAttempts = phoneticAttempts + (advancedMediaAttempts * 3);
  const weightedPhoneticSuccesses = Math.max(0, phoneticSuccesses + ((advancedMediaAttempts - advancedMediaMistakes) * 3));
  const phoneticFluency = weightedPhoneticAttempts > 0 
    ? Math.max(0, Math.min(100, Math.round((weightedPhoneticSuccesses / weightedPhoneticAttempts) * 100))) 
    : 100;

  const handleModuleComplete = async (
    xpReward: number, 
    weakPointKey: "tense_accuracy" | "literal_immunity" | "phonetic_fluency"
  ) => {
    playSound("success");
    setRewardsEarned(prev => prev + xpReward);
    
    // 1. Double safe XP updates
    await updateUserXp(xpReward);

    // 2. Incremental weak points adjustments via null-guarded global state modifiers
    if (adjustWeakPoints) {
      adjustWeakPoints(weakPointKey, 4); // Increment target skill analytics metric by +4 percentage points
    }

    // Trigger local celebration popup
    const keyLabels: Record<string, string> = {
      tense_accuracy: "Tense Accuracy (কালগত শুদ্ধতা)",
      literal_immunity: "Literal Immunity (আক্ষরিক অনুবাদ বর্জন)",
      phonetic_fluency: "Phonetic Fluency (শুদ্ধ উচ্চারণ ও স্বরভঙ্গি)"
    };
    setCompletedModuleName(keyLabels[weakPointKey] || "Language Mastery Metric");
    setShowCelebration(true);
  };

  const closeCelebration = () => {
    playSound("click");
    setShowCelebration(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Skill Arena Banner Header */}
      <div className="space-y-1">
        <h2 className="font-display font-black text-2xl tracking-tight uppercase text-[#0F172A] flex items-center animate-fadeIn">
          <Gamepad2 className="mr-2 text-[#7C3AED]" />
          SKILL ARENA (দক্ষতা এরিনা)
        </h2>
        <p className="text-xs text-[#4A4455] font-semibold leading-relaxed">
          Balance academic grammar accuracy for tests with practical real-world speaking scripts.
        </p>
      </div>

      {/* 2. Micro Competency Metrics Dashboard */}
      <div className="bg-[#FAFAF9] border-3 border-[#0F172A] p-3.5 rounded-2xl neo-shadow-sm space-y-2">
        <span className="text-[9px] font-mono font-black text-[#7C3AED] uppercase tracking-wider block">
          🥋 ACTIVE LANGUAGE SKILL GAUGES
        </span>
        <div className="grid grid-cols-3 gap-2">
          {/* Gauge 1 */}
          <div className="bg-white border-2 border-[#0F172A] p-2 rounded-xl text-center shadow-[1.5px_1.5px_0px_0px_#0F172A]">
            <span className="text-[8px] font-mono font-bold text-stone-500 block leading-tight uppercase">SVO Immunity</span>
            <span className="font-display font-black text-[13px] text-[#0F172A] block my-0.5">
              {literalImmunity}%
            </span>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden border border-black/10">
              <div 
                className="bg-[#7C3AED] h-full rounded-full transition-all duration-500" 
                style={{ width: `${literalImmunity}%` }}
              />
            </div>
          </div>

          {/* Gauge 2 */}
          <div className="bg-white border-2 border-[#0F172A] p-2 rounded-xl text-center shadow-[1.5px_1.5px_0px_0px_#0F172A]">
            <span className="text-[8px] font-mono font-bold text-stone-500 block leading-tight uppercase">Tense Pivot</span>
            <span className="font-display font-black text-[13px] text-[#0F172A] block my-0.5">
              {tenseAccuracy}%
            </span>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden border border-black/10">
              <div 
                className="bg-[#F59E0B] h-full rounded-full transition-all duration-500" 
                style={{ width: `${tenseAccuracy}%` }}
              />
            </div>
          </div>

          {/* Gauge 3 */}
          <div className="bg-white border-2 border-[#0F172A] p-2 rounded-xl text-center shadow-[1.5px_1.5px_0px_0px_#0F172A]">
            <span className="text-[8px] font-mono font-bold text-stone-500 block leading-tight uppercase">Accent Flow</span>
            <span className="font-display font-black text-[13px] text-[#0F172A] block my-0.5">
              {phoneticFluency}%
            </span>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden border border-black/10">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${phoneticFluency}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. High-Contrast Dual Track Navigation Selector */}
      <div className="bg-[#FAFAF9] border-3 border-[#0F172A] rounded-2xl p-1.5 flex select-none shadow-[4px_4px_0px_0px_#0F172A]">
        <button
          onClick={() => {
            playSound("beep");
            setActiveTrack("academic");
          }}
          className={`flex-1 py-3 px-1 rounded-xl font-display font-black text-[11px] uppercase tracking-wide border-2 transition-all cursor-pointer ${
            activeTrack === "academic"
              ? "bg-[#7C3AED] text-white border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A]"
              : "bg-transparent text-stone-500 border-transparent hover:text-[#0F172A]"
          }`}
        >
          🎓 Academic Track (একাডেমিক)
        </button>

        <button
          onClick={() => {
            playSound("beep");
            setActiveTrack("functional");
          }}
          className={`flex-1 py-3 px-1 rounded-xl font-display font-black text-[11px] uppercase tracking-wide border-2 transition-all cursor-pointer ${
            activeTrack === "functional"
              ? "bg-[#F59E0B] text-black border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A]"
              : "bg-transparent text-stone-500 border-transparent hover:text-black"
          }`}
        >
          🔊 Functional Track (প্র্যাকটিক্যাল)
        </button>
      </div>

      {/* 4. Active Decoupled Sub-Components Switching */}
      <div className="min-h-[300px]">
        {activeTrack === "academic" ? (
          <AcademicTrack onModuleComplete={handleModuleComplete} />
        ) : (
          <FunctionalTrack onModuleComplete={handleModuleComplete} />
        )}
      </div>

      {/* 5. Custom High-Dopamine Graduation Alert Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border-4 border-[#0F172A] rounded-3xl p-6 max-w-[360px] text-center space-y-5 shadow-[8px_8px_0px_0px_#0F172A] animate-scaleUp">
            <div className="w-16 h-16 bg-[#EDE9FE] rounded-full border-3 border-[#0F172A] flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>
            
            <div className="space-y-1.5">
              <h4 className="font-display font-black text-lg text-[#0F172A] uppercase tracking-tight">
                Milestone Conquered!
              </h4>
              <p className="font-display font-bold text-xs text-[#7C3AED] Bangla-Text">
                আপনাকে অভিনন্দন!
              </p>
              <p className="text-[10px] text-[#4A4455] font-semibold leading-relaxed">
                You integrated proper sentence behaviors. Boosted <span className="font-bold text-stone-900">{completedModuleName}</span> gauge level!
              </p>
            </div>

            <div className="bg-[#FEF3C7] border-2 border-[#D97706] p-3 rounded-xl inline-block">
              <span className="text-[9px] font-mono font-black text-[#D97706] uppercase tracking-wider block">
                ARENA STAGE BOUNTY
              </span>
              <p className="font-display font-black text-sm text-[#B45309]">
                🎖️ Claimed +30 XP Points
              </p>
            </div>

            <button
              onClick={closeCelebration}
              className="w-full py-3 bg-stone-900 text-white font-display font-black text-xs uppercase tracking-wider rounded-xl neo-border-sm hover:opacity-90 neo-button-push cursor-pointer"
            >
              Continue Training
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
