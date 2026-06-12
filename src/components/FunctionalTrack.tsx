import React, { useState, useRef } from "react";
import { playSound } from "./AudioPlayer";
import { useGlobalState } from "../globalState";
import { 
  CheckCircle2, 
  ChevronRight, 
  Lock,
  ArrowLeft
} from "lucide-react";

interface FunctionalTrackProps {
  onModuleComplete: (xpEarned: number, weakPointKey: "phonetic_fluency" | "literal_immunity") => void;
}

export const FunctionalTrack: React.FC<FunctionalTrackProps> = ({ onModuleComplete }) => {
  const { profile, awardArenaXP, recordMetric } = useGlobalState();
  const [activeModule, setActiveModule] = useState<any | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  
  const [gauntletIndex, setGauntletIndex] = useState<number>(0);
  const [multipleChoiceSelection, setMultipleChoiceSelection] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ status: "idle" | "error" | "success"; message: string }>({
    status: "idle",
    message: ""
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const functionalModules = [
    {
      id: "f1",
      title: "Module F.1: The Bonglish Syntax Filter",
      weakPointKey: "literal_immunity" as const,
      tag: "LITERAL TO NATURAL",
      goal: "Deconstruct direct word-to-word translation habits.",
      explainerBg: "বাংলা থেকে সরাসরি মনের ভেতর ইংরেজি অনুবাদ করার প্রবণতাই হল 'Bonglish'। যেমন- 'আমার মাথা ঘুরছে' শব্দে শব্দে মেলালে হয় 'My head is spinning', অথচ প্রফেশনাল ও ন্যাচারাল ফ্রেজ হল 'I feel dizzy!'",
      explainerEn: "Isolate word-for-word translation habits. Adopt authentic English expressions based on conversational contexts, not literal lexical pairs.",
      formula: "বাংলা আক্ষরিক অনুবাদ (X) ❌ ➔ ন্যাচারাল ইংলিশ এক্সপ্রেশন (O) ✅",
      gauntletPool: [
        {
          type: "mcq",
          prompt: "Translate to natural English: 'আমার ঠান্ডা লাগছে' (Literal Bonglish translation: 'My cold is catching')",
          mcqOptions: [
            "My cold is catching.",
            "I feel cold / I am catching a cold.",
            "Cold is attacking me."
          ],
          correctIndex: 1,
          explanation: "'I am catching a cold' maps the actual English idiom, completely escaping literal translate trends."
        },
        {
          type: "mcq",
          prompt: "Translate 'আমার মাথা ঘুরছে':",
          mcqOptions: [
            "My head is spinning.",
            "I am rotating my head.",
            "I feel dizzy."
          ],
          correctIndex: 2,
          explanation: "Natural English expresses this state as 'feeling dizzy'."
        },
        {
          type: "mcq",
          prompt: "Translate 'আমি তোমায় মিস করি':",
          mcqOptions: [
            "I am missing you.",
            "I miss you.",
            "My miss you."
          ],
          correctIndex: 1,
          explanation: "State verbs like 'miss' represent a constant state, natural expression is simple present."
        }
      ]
    },
    {
      id: "f2",
      title: "Module F.2: Phonetic Calibrator & Accent Lab",
      weakPointKey: "phonetic_fluency" as const,
      tag: "REGIONAL SOUND ACCENTS",
      goal: "Correct regional phonological shifts: soft 'F/P' or 'S' prefixes.",
      explainerBg: "বাংলাদেশি স্পিকাররা প্রায়শই 'S' দিয়ে শুরু হওয়া শব্দের আগে অপ্রয়োজনীয় 'ই/E' সাউন্ড যোগ করেন (যেমন- 'School' কে 'ইস্কুল' or 'Station' কে 'ইস্টেশন' বলা)। এছাড়া উপরের দাঁত নিচের ঠোঁটের সাথে স্পর্শ না করিয়ে বৃত্তাকার ঠোঁটে 'F' উচ্চারণ ভুল (যেমন- ফ্যান)।",
      explainerEn: "Avoid preceding vowels on 'S' prefixes. Sound 'S' with a pure dry air-hiss (ssss) without starting with 'i/e'. Pronounce 'F' by touching upper teeth to your lower lip.",
      formula: "Soft Air Hiss [sss...] + clean consonant (No Pre-E Sound)",
      gauntletPool: [
        {
          type: "mcq",
          prompt: "Select the most accurate phonetic trick to pronounce 'Student' properly:",
          mcqOptions: [
            "Start with an 'ee' sound: 'Eee-student'.",
            "Start with a continuous air hiss: 'Sssss-tudent' with zero initial vowel.",
            "Soften the 'S' so it sounds like 'Shudent'."
          ],
          correctIndex: 1,
          explanation: "Perfect phonetic analysis! Emitting a pure air-hiss avoids the 'E-student' regional accent shift."
        },
        {
          type: "mcq",
          prompt: "How should you correctly articulate 'Fan'?",
          mcqOptions: [
            "Round both lips and push air.",
            "Touch upper teeth to the inside of lower lip and push air.",
            "Form a 'P' sound with both lips."
          ],
          correctIndex: 1,
          explanation: "This creates the correct labiodental friction for authentic 'F' sounds."
        },
        {
          type: "mcq",
          prompt: "Select the proper pronunciation start for 'School':",
          mcqOptions: [
            "I-school",
            "Ssss-kool",
            "Is-kool"
          ],
          correctIndex: 1,
          explanation: "Always emit pure S-hisses without any preceding vowel."
        }
      ]
    },
    {
      id: "f3",
      title: "Module F.3: Digital Communication & Interview Blueprint",
      weakPointKey: "phonetic_fluency" as const,
      tag: "DIGITAL CHAT & VOICENOTES",
      goal: "Formulate crisp, confident frameworks for interviews and corporate chats.",
      explainerBg: "চাকরির ইন্টারভিউ বা হোয়াটসঅ্যাপের মেসেজে অতিরিক্ত আক্ষরিক সৌজন্য দেখানোর চেয়ে সুনির্দিষ্ট আবেদন পেশ করা বেশি কার্যকরী। যেমন- 'আই উইল গিভ ফাইল' বলার থেকে 'Please find attached the file for your review' অনেক বেশি পেশাদার দেখায়।",
      explainerEn: "Modern digital etiquette rule: combine warm polite beginnings with clear structural value triggers and action calls.",
      formula: "Polite Greeting + Current Action Update + Call to Action for Review",
      gauntletPool: [
        {
          type: "mcq",
          prompt: "You completed a tasks workflow spreadsheet. Choose the perfect email update for your manager:",
          mcqOptions: [
            "Sir, check file report check.",
            "I have completed the tasks worksheet. Please find it attached for your review.",
            "I gave report, tell me if happy."
          ],
          correctIndex: 1,
          explanation: "Impeccable! Delivering structural value trigger and a clean action call."
        },
        {
          type: "mcq",
          prompt: "What is an ideal opening for a WhatsApp corporate message?",
          mcqOptions: [
            "Hello sir. Did you eat?",
            "Hi [Name], I hope you're having a great day.",
            "Look at my message now."
          ],
          correctIndex: 1,
          explanation: "Professional, polite, without crossing into excessive personal spaces."
        },
        {
          type: "mcq",
          prompt: "To apologize for a slight delay in joining a Meet call:",
          mcqOptions: [
            "Sorry I am very late.",
            "My net problem.",
            "I apologize for the delay. Just resolving a minor technical issue, I'll be online momentarily."
          ],
          correctIndex: 2,
          explanation: "Maintains professional dignity without over-justifying."
        }
      ]
    }
  ];

  const getModuleState = (modId: string, index: number) => {
    if (index === 0) return "Active";
    const isCompleted = profile?.completedArenaModules?.[modId]?.timesCleared > 0;
    if (isCompleted) return "Completed";

    const prevMod = functionalModules[index - 1];
    const prevCompleted = profile?.completedArenaModules?.[prevMod.id]?.timesCleared > 0;
    return prevCompleted ? "Active" : "Locked";
  };

  const startModule = (mod: any) => {
    playSound("click");
    setActiveModule(mod);
    setActiveStep(1);
    setGauntletIndex(0);
    setMultipleChoiceSelection(null);
    setFeedback({ status: "idle", message: "" });
  };

  const checkGauntletDrill = () => {
    if (!activeModule) return;
    const currentDrill = activeModule.gauntletPool[gauntletIndex];

    const match = multipleChoiceSelection === currentDrill.correctIndex;

    if (match) {
      if (recordMetric) recordMetric("literal", true);
      playSound("success");
      setFeedback({ status: "success", message: currentDrill.explanation });
      setTimeout(() => {
        if (gauntletIndex < activeModule.gauntletPool.length - 1) {
          setGauntletIndex(prev => prev + 1);
          setMultipleChoiceSelection(null);
          setFeedback({ status: "idle", message: "" });
        } else {
          finishModule();
        }
      }, 2500);
    } else {
      if (recordMetric) recordMetric("literal", false);
      playSound("error");
      setFeedback({ status: "error", message: "Incorrect! Please analyze the structural rule again." });
      setTimeout(() => setFeedback({ status: "idle", message: "" }), 2500);
    }
  };

  const finishModule = () => {
    playSound("unlock");
    if (activeModule) {
      const xpEarned = awardArenaXP(activeModule.id);
      onModuleComplete(xpEarned, activeModule.weakPointKey as any);
      setActiveModule(null);
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" ref={containerRef}>
      {!activeModule ? (
        <div className="space-y-5">
          <div className="bg-[#FEF3C7] border-2 border-[#0F172A] rounded-2xl p-4 neo-shadow-sm space-y-1">
            <span className="font-display font-black text-xs text-[#B45309]">🔊 REAL-WORLD FLUENCY LABORATORY</span>
            <p className="text-[10px] text-stone-700 font-semibold leading-relaxed">
              Target active daily speaking elements, regional phonetic habit blockers, and corporate digital layouts.
            </p>
          </div>

          <div className="space-y-3">
            {functionalModules.map((mod, index) => {
              const status = getModuleState(mod.id, index);
              const isLocked = status === "Locked";
              const isCompleted = status === "Completed";
              const timesCleared = profile?.completedArenaModules?.[mod.id]?.timesCleared || 0;

              return (
                <button
                  key={mod.id}
                  disabled={isLocked}
                  onClick={() => startModule(mod)}
                  className={`w-full text-left p-4 rounded-xl border-3 transition-all flex items-center justify-between group cursor-pointer ${
                    isLocked 
                      ? "bg-stone-50 border-stone-200 cursor-not-allowed opacity-70"
                      : isCompleted
                        ? "bg-[#D1FAE5] border-[#10B981] hover:bg-[#A7F3D0] cursor-pointer"
                        : "bg-white border-[#0F172A] hover:bg-[#FEF3C7] cursor-pointer"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono font-black text-[#7C3AED] bg-[#EDE9FE] border border-[#7C3AED] px-1.5 py-0.5 rounded uppercase flex w-fit items-center">
                      {isLocked && <Lock size={10} className="mr-1" />}
                      {mod.tag}
                    </span>
                    <h3 className={`font-display font-black text-xs mt-1 block flex items-center ${
                          isLocked ? "text-stone-400" : isCompleted ? "text-[#065F46]" : "text-[#0F172A]"
                        }`}>
                      {isCompleted && <CheckCircle2 size={12} className="mr-1" />}
                      {mod.title}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-semibold italic">
                      🎯 {mod.goal}
                    </p>
                    <span className="text-[9px] font-mono font-bold text-stone-500 block pt-1 border-t border-stone-100/50">
                      {isLocked ? "Locked - Complete prior module" : isCompleted ? `Cleared (${timesCleared} times)` : "Active - Tap to Begin"}
                    </span>
                  </div>
                  {!isLocked && <ChevronRight size={18} className={`transition-transform group-hover:translate-x-1 ${isCompleted ? 'text-[#065F46]' : 'text-[#0F172A]'}`} />}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white neo-border rounded-2xl p-5 border-4 border-[#0F172A] neo-shadow space-y-5 animate-fadeIn">
          {/* Active Title bar */}
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
            <span className="font-display font-black text-xs text-[#F59E0B] uppercase">
              {activeModule.title}
            </span>
            <button 
              onClick={() => {
                playSound("click");
                setActiveModule(null);
              }}
              className="text-[9px] font-mono font-black uppercase text-stone-500 hover:text-red-500 cursor-pointer flex items-center"
            >
              <ArrowLeft size={10} className="mr-1"/> QUIT
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 select-none">
            <div className={`p-2 rounded-lg text-center border-2 font-display font-black text-[10px] transition-all ${
              activeStep === 1 
                ? "bg-[#F59E0B] text-black border-[#0F172A] neo-shadow-sm" 
                : "bg-white text-stone-400 border-stone-200"
            }`}>
              1. Theory
            </div>
            <div className={`p-2 rounded-lg text-center border-2 font-display font-black text-[10px] transition-all ${
              activeStep === 2 
                ? "bg-[#F59E0B] text-black border-[#0F172A] neo-shadow-sm" 
                : "bg-white text-stone-400 border-stone-200"
            }`}>
              2. Scheme
            </div>
            <div className={`p-2 rounded-lg text-center border-2 font-display font-black text-[10px] transition-all ${
              activeStep === 3 
                ? "bg-[#F59E0B] text-black border-[#0F172A] neo-shadow-sm" 
                : "bg-white text-stone-400 border-stone-200"
            }`}>
              3. Gauntlet
            </div>
          </div>

          {/* STEP 1 */}
          {activeStep === 1 && (
            <div className="space-y-4 py-2 animate-fadeIn">
              <div className="bg-[#FAFAF9] border-2 border-[#0F172A] rounded-xl p-4 space-y-3">
                <span className="inline-block bg-[#FEF3C7] text-[#D97706] font-mono font-black text-[9px] px-2 py-0.5 rounded border border-[#D97706] uppercase">
                  ফ্লুয়েন্সি তত্ত্ব ব্যাখ্যা (SPEECH LABORATORY)
                </span>
                <p className="font-display font-bold text-xs text-[#0F172A] leading-relaxed Bangla-Text">
                  {activeModule.explainerBg}
                </p>
              </div>

              <div className="bg-amber-50 border-2 border-[#0F172A] rounded-xl p-4 space-y-2">
                <span className="inline-block bg-[#F59E0B] text-black font-mono font-black text-[9px] px-2 py-0.5 rounded uppercase">
                  Natural Adjustment
                </span>
                <p className="font-sans font-medium text-xs leading-relaxed italic text-[#0F172A]">
                  "{activeModule.explainerEn}"
                </p>
              </div>

              <button
                onClick={() => {
                  playSound("beep");
                  setActiveStep(2);
                }}
                className="w-full py-3 bg-[#F59E0B] text-black font-display font-black text-xs uppercase tracking-wider rounded-xl neo-border-sm neo-shadow-sm neo-button-push flex items-center justify-center cursor-pointer"
              >
                <span>Navigate to Scheme</span>
                <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {activeStep === 2 && (
            <div className="space-y-4 py-2 animate-fadeIn">
              <div className="bg-[#FEF3C7] border-3 border-[#0F172A] rounded-xl p-6 text-center space-y-3">
                <span className="text-[9px] font-mono font-black text-[#B45309] uppercase tracking-wider block">
                  ACTIONABLE COMM SCHEME
                </span>
                <div className="bg-[#FAFAF9] border-2 border-[#0F172A] p-4 rounded-xl shadow-[3px_3px_0px_0px_#0F172A] font-mono text-xs font-black text-stone-900 tracking-wide mx-auto w-fit">
                  {activeModule.formula}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    playSound("click");
                    setActiveStep(1);
                  }}
                  className="px-4 py-3 bg-stone-100 text-[#0F172A] font-display font-black text-xs uppercase rounded-xl neo-border-sm hover:opacity-90 neo-button-push cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    playSound("beep");
                    setActiveStep(3);
                  }}
                  className="flex-1 py-3 bg-[#F59E0B] text-black font-display font-black text-xs uppercase tracking-wider rounded-xl neo-border-sm neo-shadow-sm neo-button-push flex items-center justify-center cursor-pointer"
                >
                  <span>Begin Gauntlet Session</span>
                  <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: GAUNTLET SESSION */}
          {activeStep === 3 && (
            <div className="space-y-4 py-2 animate-fadeIn">
              <div className="text-center font-mono font-bold text-[10px] text-stone-500 uppercase tracking-widest border-b-2 border-stone-100 pb-2 mb-4">
                Challenge {gauntletIndex + 1} of {activeModule.gauntletPool.length}
              </div>

              <div className="bg-white border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rounded-2xl p-5 space-y-4">
                <span className="text-[9px] font-mono font-black text-[#F59E0B] uppercase tracking-wider block">
                  FLUENCY GAUNTLET
                </span>
                <h3 className="font-display font-black text-base text-[#0F172A] leading-tight">
                  {activeModule.gauntletPool[gauntletIndex].prompt}
                </h3>
              </div>

              <div className="space-y-2">
                {activeModule.gauntletPool[gauntletIndex].mcqOptions.map((opt: string, idx: number) => {
                  const isSelected = multipleChoiceSelection === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        playSound("click");
                        setMultipleChoiceSelection(idx);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-[#FEF3C7] text-[#B45309] border-[#F59E0B] shadow-[2px_2px_0px_0px_#F59E0B]"
                          : "bg-white text-[#0F172A] border-stone-300 hover:border-[#0F172A]"
                      }`}
                    >
                      <span className="inline-block mr-2 text-stone-400">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {feedback.status !== "idle" && (
                <div className={`p-4 rounded-xl border-2 text-xs font-semibold animate-fadeIn ${
                  feedback.status === "success" 
                    ? "bg-[#D1FAE5] text-[#065F46] border-[#10B981]" 
                    : "bg-[#FEE2E2] text-[#991B1B] border-red-500"
                }`}>
                  <div className="flex items-center space-x-2">
                    {feedback.status === "success" && <CheckCircle2 size={16}/>}
                    <span className="font-display font-black text-xs uppercase">{feedback.message}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => {
                    playSound("click");
                    setActiveStep(2);
                  }}
                  className="px-4 py-3 bg-stone-100 text-[#0F172A] font-display font-black text-xs uppercase rounded-xl neo-border-sm hover:bg-stone-200 cursor-pointer"
                >
                  Back
                </button>
                <button
                  disabled={multipleChoiceSelection === null || feedback.status !== "idle"}
                  onClick={checkGauntletDrill}
                  className={`flex-1 py-3.5 rounded-xl font-display font-black text-xs uppercase tracking-wider neo-border-sm neo-shadow-sm transition-transform cursor-pointer ${
                    (multipleChoiceSelection === null || feedback.status !== "idle")
                      ? "bg-stone-200 text-stone-400 cursor-not-allowed opacity-80 border-stone-300"
                      : "bg-[#10B981] text-white hover:bg-emerald-400 neo-button-push"
                  }`}
                >
                  Confirm Answer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
