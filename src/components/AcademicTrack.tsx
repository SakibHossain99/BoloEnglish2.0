import React, { useState, useRef, useEffect } from "react";
import { playSound } from "./AudioPlayer";
import { useGlobalState } from "../globalState";
import { 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  Lock,
  ArrowLeft
} from "lucide-react";

interface AcademicTrackProps {
  onModuleComplete: (xpEarned: number, weakPointKey: "tense_accuracy" | "literal_immunity") => void;
}

export const AcademicTrack: React.FC<AcademicTrackProps> = ({ onModuleComplete }) => {
  const { profile, awardArenaXP, recordMetric } = useGlobalState();
  const [activeModule, setActiveModule] = useState<any | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1); // 1 = Explainer, 2 = Formula, 3 = Gauntlet Practice
  
  // Gauntlet state
  const [gauntletIndex, setGauntletIndex] = useState<number>(0);
  const [multipleChoiceSelection, setMultipleChoiceSelection] = useState<number | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ status: "idle" | "error" | "success"; message: string }>({
    status: "idle",
    message: ""
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const academicChapters = [
    {
      id: 1,
      title: "CHAPTER 1: FOUNDATIONAL SYNTAX & WORD ARCHITECTURE (PHASE 1)",
      goal: "Shift from subject-object-verb (SOV) to english subject-verb-object (SVO) logic.",
      weakPointKey: "literal_immunity",
      modules: [
        {
          id: "m1.1",
          title: "Module 1.1: The Core Sentence Pivot",
          explainerBg: "বাংলা বাক্য সাধারণতঃ কর্তা-কর্ম-ক্রিয়া (SOV) ধারা মেনে চলে (যেমন- 'গরু ঘাস খায়')। কিন্তু ইংরেজিতে ক্রিয়া বা Verb চলে আসে বাক্যের মাঝখানে (Subject-Verb-Object বা SVO)।",
          explainerEn: "Shift your mental parser: English pushes active verbs to the middle of the sentence! Cow (Subject) + eats (Verb) + grass (Object).",
          formula: "Subject [কর্তা] + Verb [ক্রিয়া] + Object [কর্ম]",
          gauntletPool: [
            {
               type: "scrambled",
               prompt: "Correct sequence for 'গরু ঘাস খায়':",
               scrambledOptions: ["grass", "eats", "Cow"],
               correctSequence: ["Cow", "eats", "grass"]
            },
            {
               type: "mcq",
               prompt: "Choose the correct phrase: 'আমি ভাত খাই'",
               mcqOptions: ["I eat rice.", "I rice eat.", "Eat I rice."],
               correctIndex: 0
            },
            {
               type: "scrambled",
               prompt: "Correct sequence for 'সে একটি বই পড়ে':",
               scrambledOptions: ["a", "reads", "He", "book"],
               correctSequence: ["He", "reads", "a", "book"]
            }
          ]
        },
        {
          id: "m1.2",
          title: "Module 1.2: The Third-Person Singular Anchor",
          explainerBg: "যখন Subject বা কর্তা Third-Person Singular (He, She, Karim, The Cat) হয়, তখন Present Simple টেন্সে মূল Verb-এর শেষে 's' বা 'es' যোগ করতে হয়। Plural Subject-এর ক্ষেত্রে এটি বসে না!",
          explainerEn: "Singular entities trigger verb markers. He/She 'writes' a letter, but They 'write' a letter.",
          formula: "Third-Person Singular (He/She) + Verb (+s/-es) + Object",
          gauntletPool: [
            {
               type: "mcq",
               prompt: "Select the correct expression for 'সে একটি বই লেখে':",
               mcqOptions: ["She write a book.", "She writes a book.", "She writing a book."],
               correctIndex: 1
            },
            {
               type: "mcq",
               prompt: "Select the correct expression for 'রহিম স্কুলে যায়':",
               mcqOptions: ["Rahim go to school.", "Rahim going to school.", "Rahim goes to school."],
               correctIndex: 2
            },
            {
               type: "scrambled",
               prompt: "Assemble 'বিড়াল দুধ পান করে':",
               scrambledOptions: ["milk", "drinks", "The", "cat"],
               correctSequence: ["The", "cat", "drinks", "milk"]
            }
          ]
        },
        {
          id: "m1.3",
          title: "Module 1.3: Identity & Being Verbs",
          explainerBg: "বাংলায় আমরা অনেক সময় 'আমি ক্লান্ত' বা 'সে ছাত্র' বলি (এখানে 'হয়' ক্রিয়াটি উহ্য থাকে)। কিন্তু ইংরেজিতে state-of-being verb (am, is, are) বাদ দেওয়া সম্পূর্ণ ভুল! বলতে হবে: 'I am tired' এবং 'He is a student'.",
          explainerEn: "State-of-being gaps closed! Never drop 'am/is/are' in identity statements.",
          formula: "Subject + am / is / are + Adjective / Noun",
          gauntletPool: [
            {
               type: "scrambled",
               prompt: "Assemble this sentence correctly: 'আমি ক্লান্ত'",
               scrambledOptions: ["tired", "am", "I"],
               correctSequence: ["I", "am", "tired"]
            },
            {
               type: "scrambled",
               prompt: "Assemble: 'তারা খুশি'",
               scrambledOptions: ["are", "happy", "They"],
               correctSequence: ["They", "are", "happy"]
            },
            {
               type: "mcq",
               prompt: "Choose the proper statement for 'সে একজন ডাক্তার':",
               mcqOptions: ["He a doctor.", "He is a doctor.", "He are a doctor."],
               correctIndex: 1
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "CHAPTER 2: FUNCTIONAL TENSE MASTERCLASS & QUESTION PLUGINS (PHASE 2)",
      goal: "Navigate temporal shifts confidently without dry academic conjugation matrices.",
      weakPointKey: "tense_accuracy",
      modules: [
        {
          id: "m2.1",
          title: "Module 2.1: The Continuous Time-Stream",
          explainerBg: "চলমান কর্মকাণ্ড বুঝাতে ('করছি', 'যাচ্ছি', 'খাচ্ছে') Present Continuous ব্যবহার করুন। Helping Verb (am/is/are) এর সাথে মূল Verb-এর শেষে '-ing' যুক্ত হবে।",
          explainerEn: "Continuous actions are temporal vectors: helping verb + main-verb-ING.",
          formula: "Subject + am / is / are + Verb-ING + Object",
          gauntletPool: [
            {
               type: "scrambled",
               prompt: "Assemble 'তারা বই পড়ছে':",
               scrambledOptions: ["books", "are", "They", "reading"],
               correctSequence: ["They", "are", "reading", "books"]
            },
            {
               type: "mcq",
               prompt: "Translate 'আমি কাজ করছি':",
               mcqOptions: ["I works.", "I am working.", "I working."],
               correctIndex: 1
            },
            {
               type: "scrambled",
               prompt: "Assemble 'সে ঘুমাচ্ছে':",
               scrambledOptions: ["sleeping", "is", "He"],
               correctSequence: ["He", "is", "sleeping"]
            }
          ]
        },
        {
          id: "m2.2",
          title: "Module 2.2: The Past-Time Anchor",
          explainerBg: "অতীতের সম্পূর্ণ কাজ বুঝাতে সাবজেক্টের পর সরাসরি Past Verb (V2) ফর্ম বসান (যেমন- 'করেছিলাম' = worked, 'গিয়েছিলাম' = went)। এখানে ভুলে present form ব্যবহার বা helping verb বসাবেন না।",
          explainerEn: "Simple past anchors strictly require verb conversion (e.g. went, ate, wrote) with no helper verb.",
          formula: "Subject + Verb-2 (Past State) + Object / Time Context",
          gauntletPool: [
            {
               type: "mcq",
               prompt: "Which is proper for 'আমি গতকাল ঢাকা গিয়েছিলাম'?",
               mcqOptions: ["I go to Dhaka yesterday.", "I did went to Dhaka yesterday.", "I went to Dhaka yesterday."],
               correctIndex: 2
            },
            {
               type: "mcq",
               prompt: "Translate 'তারা ফুটবল খেলেছিল':",
               mcqOptions: ["They are play football.", "They played football.", "They was play football."],
               correctIndex: 1
            },
            {
               type: "scrambled",
               prompt: "Assemble 'সে আমাকে দেখেছিল':",
               scrambledOptions: ["me", "He", "saw"],
               correctSequence: ["He", "saw", "me"]
            }
          ]
        }
      ]
    }
  ];

  // Flatten logic to find module progression
  const allModules = academicChapters.flatMap((chapter: any) => 
    chapter.modules.map((mod: any) => ({ ...mod, weakPointKey: chapter.weakPointKey }))
  );

  const getModuleState = (modId: string, index: number) => {
    if (index === 0) return "Active";
    const isCompleted = profile?.completedArenaModules?.[modId]?.timesCleared > 0;
    if (isCompleted) return "Completed";

    const prevMod = allModules[index - 1];
    const prevCompleted = profile?.completedArenaModules?.[prevMod.id]?.timesCleared > 0;
    return prevCompleted ? "Active" : "Locked";
  };

  const startModule = (mod: any) => {
    playSound("click");
    setActiveModule(mod);
    setActiveStep(1);
    setGauntletIndex(0);
    resetDrillState();
  };

  const resetDrillState = () => {
    setSelectedWords([]);
    setMultipleChoiceSelection(null);
    setFeedback({ status: "idle", message: "" });
  };

  const handleScrambledWordClick = (word: string, isFromSelected: boolean) => {
    playSound("click");
    if (isFromSelected) {
      setSelectedWords(prev => prev.filter(w => w !== word));
    } else {
      setSelectedWords(prev => [...prev, word]);
    }
  };

  const checkGauntletDrill = () => {
    if (!activeModule) return;
    const currentDrill = activeModule.gauntletPool[gauntletIndex];

    let match = false;
    if (currentDrill.type === "scrambled") {
      match = selectedWords.join(" ") === currentDrill.correctSequence.join(" ");
    } else {
      match = multipleChoiceSelection === currentDrill.correctIndex;
    }

    if (match) {
      if (recordMetric) recordMetric("tense", true);
      playSound("success");
      setFeedback({ status: "success", message: "Perfect! Correct application of the syntax." });
      setTimeout(() => {
        if (gauntletIndex < activeModule.gauntletPool.length - 1) {
          setGauntletIndex(prev => prev + 1);
          resetDrillState();
        } else {
          finishModule();
        }
      }, 1500);
    } else {
      if (recordMetric) recordMetric("tense", false);
      playSound("error");
      setFeedback({ status: "error", message: "Incorrect! Please check your formula rule." });
      setTimeout(() => setFeedback({ status: "idle", message: "" }), 2500);
    }
  };

  const finishModule = () => {
    playSound("unlock");
    if (activeModule) {
      const xpEarned = awardArenaXP(activeModule.id);
      onModuleComplete(xpEarned, activeModule.weakPointKey as any);
      setActiveModule(null);
      // Auto scroll to next module highlight map if needed, done cleanly via refs if necessary.
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      {!activeModule ? (
        <div className="space-y-6">
          {academicChapters.map((chapter) => (
            <div 
              key={chapter.id} 
              className="bg-white neo-border rounded-2xl p-4 border-3 border-[#0F172A] neo-shadow-sm space-y-3"
            >
              <div className="border-b-2 border-stone-100 pb-2">
                <span className="text-[9px] font-mono font-black text-[#7C3AED] uppercase bg-[#EDE9FE] px-2 py-0.5 rounded border border-[#7C3AED]">
                  PHASE {chapter.id}
                </span>
                <h3 className="font-display font-black text-xs text-[#0F172A] mt-1.5 uppercase leading-snug">
                  {chapter.title}
                </h3>
                <p className="text-[10px] text-stone-500 font-semibold mt-0.5 leading-relaxed">
                  🎯 {chapter.goal}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {chapter.modules.map((mod: any) => {
                  const modIndex = allModules.findIndex(m => m.id === mod.id);
                  const status = getModuleState(mod.id, modIndex);
                  const isLocked = status === "Locked";
                  const isCompleted = status === "Completed";
                  const timesCleared = profile?.completedArenaModules?.[mod.id]?.timesCleared || 0;

                  return (
                    <button
                      key={mod.id}
                      disabled={isLocked}
                      onClick={() => startModule(allModules[modIndex])}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center justify-between group ${
                        isLocked 
                          ? "bg-stone-50 border-stone-200 cursor-not-allowed opacity-70"
                          : isCompleted
                            ? "bg-[#D1FAE5] border-[#10B981] hover:bg-[#A7F3D0] cursor-pointer"
                            : "bg-[#FAFAF9] border-[#0F172A] hover:bg-[#EDE9FE] cursor-pointer"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className={`font-display font-black text-xs flex items-center space-x-1.5 ${
                          isLocked ? "text-stone-400" : isCompleted ? "text-[#065F46]" : "text-[#0F172A] group-hover:text-[#7C3AED]"
                        }`}>
                          {isLocked && <Lock size={12} className="mr-1" />}
                          {isCompleted && <CheckCircle2 size={12} className="mr-1" />}
                          {mod.title}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-stone-500 block">
                          {isLocked ? "Locked - Complete prior module" : isCompleted ? `Cleared (${timesCleared} times)` : "Active - Tap to Begin"}
                        </span>
                      </div>
                      {!isLocked && <ChevronRight size={16} className={`transition-transform group-hover:translate-x-1 ${isCompleted ? 'text-[#065F46]' : 'text-[#0F172A]'}`} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white neo-border rounded-2xl p-5 border-4 border-[#0F172A] neo-shadow space-y-5 animate-fadeIn">
          {/* Active Title */}
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
            <span className="font-display font-black text-xs text-[#7C3AED] uppercase">
              {activeModule.title}
            </span>
            <button 
              onClick={() => {
                playSound("click");
                setActiveModule(null);
              }}
              className="text-[9px] font-mono font-black uppercase flex items-center text-stone-500 hover:text-red-500 cursor-pointer"
            >
              <ArrowLeft size={10} className="mr-1"/> QUIT
            </button>
          </div>

          {/* Step Progress indicators */}
          <div className="grid grid-cols-3 gap-1.5 select-none">
            <div className={`p-2 rounded-lg text-center border-2 font-display font-black text-[10px] transition-all ${
              activeStep === 1 
                ? "bg-[#7C3AED] text-white border-[#0F172A] neo-shadow-sm" 
                : "bg-white text-stone-400 border-stone-200"
            }`}>
              1. Theory
            </div>
            <div className={`p-2 rounded-lg text-center border-2 font-display font-black text-[10px] transition-all ${
              activeStep === 2 
                ? "bg-[#7C3AED] text-white border-[#0F172A] neo-shadow-sm" 
                : "bg-white text-stone-400 border-stone-200"
            }`}>
              2. Formula
            </div>
            <div className={`p-2 rounded-lg text-center border-2 font-display font-black text-[10px] transition-all ${
              activeStep === 3 
                ? "bg-[#7C3AED] text-white border-[#0F172A] neo-shadow-sm" 
                : "bg-white text-stone-400 border-stone-200"
            }`}>
              3. Gauntlet
            </div>
          </div>

          {/* STEP 1: EXPLAINER CARD */}
          {activeStep === 1 && (
            <div className="space-y-4 py-2 animate-fadeIn">
              <div className="bg-[#FAFAF9] border-2 border-[#0F172A] rounded-xl p-4 space-y-3">
                <span className="inline-block bg-[#FEF3C7] text-[#D97706] font-mono font-black text-[9px] px-2 py-0.5 rounded border border-[#D97706] uppercase">
                  বাংলা তত্ত্ব விளக்கம் (BENGALI TUTORIAL)
                </span>
                <p className="font-display font-bold text-xs text-[#0F172A] leading-relaxed Bangla-Text">
                  {activeModule.explainerBg}
                </p>
              </div>

              <div className="bg-[#EDE9FE] border-2 border-[#0F172A] rounded-xl p-4 space-y-2">
                <span className="inline-block bg-[#7C3AED] text-white font-mono font-black text-[9px] px-2 py-0.5 rounded uppercase">
                  English Paradigm
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
                className="w-full py-3 bg-[#7C3AED] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl neo-border-sm neo-shadow-sm neo-button-push flex items-center justify-center cursor-pointer"
              >
                <span>Navigate to Formula Map</span>
                <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          )}

          {/* STEP 2: FORMULA CARD */}
          {activeStep === 2 && (
            <div className="space-y-4 py-2 animate-fadeIn">
              <div className="bg-[#FEF3C7] border-3 border-[#0F172A] rounded-xl p-6 text-center space-y-3 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <BookOpen size={48} />
                </div>
                
                <span className="text-[9px] font-mono font-black text-[#B45309] uppercase tracking-wider block">
                  SYNTAX EQUATION SCHEME
                </span>
                
                <div className="bg-[#FAFAF9] border-2 border-[#0F172A] p-4 rounded-xl shadow-[3px_3px_0px_0px_#0F172A] font-mono text-xs font-black text-stone-900 tracking-wide inline-block my-2">
                  {activeModule.formula}
                </div>

                <p className="text-[10px] text-[#D97706] font-bold leading-relaxed max-w-xs mx-auto">
                  Memorize this structure model to assemble natural phrases without thinking about dictionary translations.
                </p>
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
                  className="flex-1 py-3 bg-[#7C3AED] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl neo-border-sm neo-shadow-sm neo-button-push flex items-center justify-center cursor-pointer"
                >
                  <span>Begin Gauntlet Matrix</span>
                  <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: GAUNTLET PRACTICE */}
          {activeStep === 3 && (
            <div className="space-y-4 py-2 animate-fadeIn">
              <div className="text-center font-mono font-bold text-[10px] text-stone-500 uppercase tracking-widest border-b-2 border-stone-100 pb-2 mb-4">
                Challenge {gauntletIndex + 1} of {activeModule.gauntletPool.length}
              </div>
              
              <div className="bg-white border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rounded-2xl p-5 space-y-4">
                <span className="text-[9px] font-mono font-black text-[#7C3AED] uppercase tracking-wider block">
                  GAUNTLET PROTOCOL
                </span>
                <p className="font-display font-black text-base text-[#0F172A]">
                  {activeModule.gauntletPool[gauntletIndex].prompt}
                </p>
              </div>

              {activeModule.gauntletPool[gauntletIndex].type === "scrambled" && (
                <div className="space-y-4">
                  <div className="min-h-[60px] bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl p-3 flex flex-wrap gap-2 items-center shadow-inner">
                    {selectedWords.length === 0 ? (
                      <span className="text-[10px] font-bold text-stone-400 italic">Select blocks...</span>
                    ) : (
                      selectedWords.map((word) => (
                        <button
                          key={`selected-${word}`}
                          onClick={() => handleScrambledWordClick(word, true)}
                          className="px-2.5 py-1.5 bg-[#EDE9FE] font-mono text-xs font-black text-[#0F172A] rounded border-2 border-[#0F172A] hover:border-red-500 cursor-pointer"
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 py-2">
                    {activeModule.gauntletPool[gauntletIndex].scrambledOptions.map((word: string) => {
                      const isSelected = selectedWords.includes(word);
                      return (
                        <button
                          key={`scrambled-${word}`}
                          onClick={() => handleScrambledWordClick(word, false)}
                          disabled={isSelected}
                          className={`px-3 py-2 font-mono text-xs font-black rounded border-2 border-[#0F172A] transition-all cursor-pointer ${
                            isSelected 
                              ? "opacity-20 cursor-not-allowed bg-stone-100 text-transparent" 
                              : "bg-white text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] hover:bg-amber-100 hover:-translate-y-0.5"
                          }`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeModule.gauntletPool[gauntletIndex].type === "mcq" && (
                <div className="space-y-2">
                  {activeModule.gauntletPool[gauntletIndex].mcqOptions.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playSound("click");
                        setMultipleChoiceSelection(idx);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                        multipleChoiceSelection === idx 
                          ? "bg-[#EDE9FE] text-[#7C3AED] border-[#7C3AED] shadow-[2px_2px_0px_0px_#7C3AED]"
                          : "bg-white text-[#0F172A] border-stone-300 hover:border-[#0F172A]"
                      }`}
                    >
                      <span className="inline-block mr-2 text-stone-400">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Feedback UI */}
              {feedback.status !== "idle" && (
                <div className={`p-4 rounded-xl border-2 text-xs font-semibold animate-fadeIn ${
                  feedback.status === "success" 
                    ? "bg-[#D1FAE5] text-[#065F46] border-[#10B981]" 
                    : "bg-[#FEE2E2] text-[#991B1B] border-red-500"
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-display font-black text-xs uppercase flex items-center">
                      {feedback.status === "success" ? <CheckCircle2 className="mr-2" size={16}/> : null}
                      {feedback.message}
                    </span>
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
                  onClick={checkGauntletDrill}
                  disabled={feedback.status !== "idle" || (activeModule.gauntletPool[gauntletIndex].type === "mcq" ? multipleChoiceSelection === null : selectedWords.length === 0)}
                  className={`flex-1 py-3.5 rounded-xl font-display font-black text-xs uppercase tracking-wider neo-border-sm neo-shadow-sm transition-transform cursor-pointer ${
                    (feedback.status !== "idle" || (activeModule.gauntletPool[gauntletIndex].type === "mcq" ? multipleChoiceSelection === null : selectedWords.length === 0))
                      ? "bg-stone-200 text-stone-400 cursor-not-allowed opacity-80 border-stone-300" 
                      : "bg-[#10B981] text-white hover:bg-emerald-400 neo-button-push"
                  }`}
                >
                  Confirm Assembly
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
