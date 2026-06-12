import React from "react";
import { useGlobalState } from "../globalState";
import { Trophy, Award, Target, Milestone, Zap, Sparkles, CheckSquare, Calendar, ChevronRight } from "lucide-react";

export const ProgressTab: React.FC = () => {
  const { profile } = useGlobalState();

  // Safe fallbacks as instructed in Rule 3 of DEFENSIVE CODING
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

  // Dynamic percentages with clean division-by-zero math guards, default to 100 on zero-state
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

  const userXp = profile?.xp ?? 0;
  const userLevel = profile?.level ?? 1;
  const totalLessons = profile?.lessonsCompleted?.length ?? 0;

  // Level classification Title
  const getRankTitle = (lvl: number) => {
    if (lvl >= 5) return "DIPLOMATIC NATIVE SPEAKER (LEVEL 5)";
    if (lvl >= 3) return "LANGUAGE WARRIOR (LEVEL 3)";
    if (lvl >= 2) return "BILINGUAL SURVIVOR (LEVEL 2)";
    return "ROOKIE LEARNER (LEVEL 1)";
  };

  const getRankBadgeClass = (lvl: number) => {
    if (lvl >= 3) return "bg-[#F59E0B] text-[#0F172A] border-[#0F172A]";
    return "bg-[#7C3AED] text-white border-[#0F172A]";
  };

  const badges = [
    {
      id: "badge1",
      title: "ZERO-MISTAKE STREAK",
      description: "Completed 5 mock/daily sessions without a single grammatical slip-up.",
      unlocked: totalLessons >= 1,
      icon: "🎯"
    },
    {
      id: "badge2",
      title: "LITERAL HABITS ESCAPEE",
      description: "Achieved over 50% on Literal Translation Immunity score matrix.",
      unlocked: literalImmunity >= 50,
      icon: "⚡"
    },
    {
      id: "badge3",
      title: "NATIVE DIALECT SPEED",
      description: "Achieve 90% Phonetic Fluency calibration to speak like an elite presenter.",
      unlocked: phoneticFluency >= 90,
      icon: "🎙️"
    },
    {
      id: "badge4",
      title: "90-DAY FLIGHT DECK",
      description: "Complete all levels in Phase 3 networking fluency.",
      unlocked: totalLessons >= 15,
      icon: "🏆"
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="space-y-1">
        <h2 className="font-display font-black text-2xl tracking-tight uppercase text-[#0F172A]">
          YOUR PROGRESS HUB
        </h2>
        <p className="text-xs text-[#4A4455] font-semibold leading-relaxed">
          Track your real-time evolution from an anxious rookie to fluent native speaker.
        </p>
      </div>

      {/* 2. Current Rank Badge with heavy drop shadows */}
      <div className={`p-5 rounded-2xl neo-border neo-shadow-amber relative ${getRankBadgeClass(userLevel)}`}>
        <div className="absolute right-4 top-4 animate-pulse">
          <Sparkles size={24} className="text-white fill-white opacity-80" />
        </div>

        <span className="text-[9px] uppercase font-mono font-black border-b border-black border-dashed pb-1 tracking-wider block mb-1">
          CURRENT ACTIVE CORPS RANK
        </span>

        <h3 className="font-display font-black text-xl leading-none uppercase">
          {getRankTitle(userLevel)}
        </h3>
        
        <div className="mt-3 flex items-center space-x-4">
          <div className="bg-white px-3 py-1 rounded neo-border-sm text-[#0F172A] font-mono text-xs font-bold text-center">
            {userXp} Total XP
          </div>
          <p className="text-xs font-semibold max-w-xs leading-tight text-white drop-shadow">
            {500 - (userXp % 500)} XP remaining to achieve your next language promotion belt!
          </p>
        </div>
      </div>

      {/* 3. Skill matrix with custom thick columns */}
      <div className="bg-white neo-border rounded-2xl p-6 neo-shadow">
        <div className="flex items-center space-x-2 border-b border-stone-200 pb-3 mb-5">
          <Target size={20} className="text-[#7C3AED]" />
          <h3 className="font-display font-black text-sm text-[#0F172A] uppercase tracking-wider">
            SKILL GROWTH MATRIX
          </h3>
        </div>

        {/* Thick Neo-Brutalist Loading columns - similar to the layout in layout diagram */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* Col 1 */}
          <div className="flex flex-col items-center">
            <div className={`w-full bg-stone-50 rounded-xl h-44 overflow-hidden flex flex-col justify-end relative transition-all border-2 ${
              literalAttempts > 0 && literalImmunity < 60 
                ? "border-[#F59E0B] shadow-[4px_4px_0px_0px_#F59E0B]" 
                : "border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]"
            }`}>
              {literalAttempts === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-stone-100">
                  <span className="text-lg mb-1">💡</span>
                  <span className="text-[9px] font-mono leading-tight uppercase font-black text-stone-400">No Activity</span>
                </div>
              ) : (
                <>
                  <div 
                    className={`${literalImmunity < 60 ? "bg-[#F59E0B]" : "bg-[#7C3AED]"} w-full transition-all duration-700 ease-out`}
                    style={{ height: `${literalImmunity}%` }}
                  />
                  <span className={`absolute inset-x-0 bottom-4 text-center font-display font-black text-sm ${literalImmunity < 60 ? "text-[#0F172A]" : "text-white"} drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)]`}>
                    {literalImmunity}%
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] font-display font-black text-[#0F172A] text-center uppercase tracking-wide mt-3 leading-tight">
              Literal<br />Immunity
            </span>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col items-center">
            <div className={`w-full bg-stone-50 rounded-xl h-44 overflow-hidden flex flex-col justify-end relative transition-all border-2 ${
              tenseAttempts > 0 && tenseAccuracy < 60 
                ? "border-[#F59E0B] shadow-[4px_4px_0px_0px_#F59E0B]" 
                : "border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]"
            }`}>
              {tenseAttempts === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-stone-100">
                  <span className="text-lg mb-1">💡</span>
                  <span className="text-[9px] font-mono leading-tight uppercase font-black text-stone-400">No Activity</span>
                </div>
              ) : (
                <>
                  <div 
                    className="bg-[#F59E0B] w-full transition-all duration-700 ease-out"
                    style={{ height: `${tenseAccuracy}%` }}
                  />
                  <span className="absolute inset-x-0 bottom-4 text-center font-display font-black text-sm text-[#0F172A] drop-shadow-[1px_1px_0px_white]">
                    {tenseAccuracy}%
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] font-display font-black text-[#0F172A] text-center uppercase tracking-wide mt-3 leading-tight">
              Tense<br />Shield
            </span>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col items-center">
            <div className={`w-full bg-stone-50 rounded-xl h-44 overflow-hidden flex flex-col justify-end relative transition-all border-2 ${
              phoneticAttempts > 0 && phoneticFluency < 60 
                ? "border-[#F59E0B] shadow-[4px_4px_0px_0px_#F59E0B]" 
                : "border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A]"
            }`}>
              {phoneticAttempts === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-stone-100">
                  <span className="text-lg mb-1">💡</span>
                  <span className="text-[9px] font-mono leading-tight uppercase font-black text-stone-400">No Activity</span>
                </div>
              ) : (
                <>
                  <div 
                    className={`${phoneticFluency < 60 ? "bg-[#F59E0B]" : "bg-[#10B981]"} w-full transition-all duration-700 ease-out`}
                    style={{ height: `${phoneticFluency}%` }}
                  />
                  <span className={`absolute inset-x-0 bottom-4 text-center font-display font-black text-sm ${phoneticFluency < 60 ? "text-[#0F172A]" : "text-white"} drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)]`}>
                    {phoneticFluency}%
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] font-display font-black text-[#0F172A] text-center uppercase tracking-wide mt-3 leading-tight">
              Phonetic<br />Fluency
            </span>
          </div>
        </div>
      </div>

      {/* 4. Streaks Logger (Mon - Sun checksheets) */}
      <div className="bg-white neo-border rounded-2xl p-5 neo-shadow relative">
        <div className="flex items-center space-x-2 border-b border-stone-100 pb-3 mb-3">
          <Calendar size={18} className="text-[#F59E0B]" />
          <h4 className="font-display font-bold text-xs text-[#0F172A] uppercase">
            Consistency Streak log Calendar
          </h4>
        </div>

        <div className="flex justify-between items-center py-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
            const dayDone = idx < ((profile?.streak ?? 0) % 8);
            return (
              <div key={day} className="flex flex-col items-center space-y-1">
                <div className={`w-8 h-8 rounded-lg neo-border-sm flex items-center justify-center font-mono font-bold text-xs ${
                  dayDone 
                    ? "bg-[#7C3AED] text-white animate-bounce-slow" 
                    : "bg-stone-100 text-stone-400"
                }`}>
                  {dayDone ? "🔥" : day[0]}
                </div>
                <span className="text-[9px] font-bold text-stone-500 uppercase">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Interactive Badges list */}
      <div className="space-y-3">
        <h3 className="font-display font-black text-sm text-[#0F172A] uppercase tracking-wide">
          BOLO MEDALS & COMBAT SHIELDS ({badges.filter(b => b.unlocked).length} / {badges.length})
        </h3>

        <div className="space-y-3">
          {badges.map((badge) => {
            return (
              <div 
                key={badge.id} 
                className={`neo-border rounded-xl p-4 transition-all flex items-center justify-between ${
                  badge.unlocked 
                    ? "bg-white neo-shadow-sm text-[#0F172A]" 
                    : "bg-stone-50 opacity-60 text-stone-500"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl p-2 rounded-xl neo-border-sm ${
                    badge.unlocked ? "bg-[#EDE9FE]" : "bg-stone-200"
                  }`}>
                    {badge.unlocked ? badge.icon : "🔒"}
                  </div>
                  <div>
                    <h4 className="font-display font-black text-xs uppercase text-[#0F172A]">
                      {badge.title}
                    </h4>
                    <p className="text-[10px] text-stone-600 max-w-xs font-medium">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full neo-border-sm uppercase tracking-wider ${
                  badge.unlocked ? "bg-[#D1FAE5] text-[#065F46]" : "bg-stone-100 text-stone-400"
                }`}>
                  {badge.unlocked ? "UNLOCKED" : "LOCKED"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
