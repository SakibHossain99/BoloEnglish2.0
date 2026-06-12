import React, { useState } from "react";
import { useGlobalState } from "../globalState";
import { getCurriculumForDay } from "../CurriculumData";
import { playSound } from "./AudioPlayer";
import { 
  BookOpen, 
  Volume2, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  GraduationCap, 
  ArrowLeft
} from "lucide-react";

interface LessonEngineProps {
  onClose: () => void;
}

export const LessonEngine: React.FC<LessonEngineProps> = ({ onClose }) => {
  const { currentDay, completeLesson, addFlashcard, consumeItem, inventory, evaluateBadges, recordMetric } = useGlobalState();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [shieldTriggered, setShieldTriggered] = useState<boolean>(false);

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [practiceCompleted, setPracticeCompleted] = useState<boolean>(false);

  // Dynamic penalty variables
  const [wrongAttemptsCount, setWrongAttemptsCount] = useState<number>(0);
  const [shakeActive, setShakeActive] = useState<boolean>(false);

  // Load the curriculum for the dynamic continuous currentDay
  const activeDayCurriculum = getCurriculumForDay(currentDay);
  const steps = activeDayCurriculum.steps;
  const currentStep = steps[currentStepIndex];

  const handleNextStep = () => {
    playSound("beep");
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      // Reset local state for next step
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setSelectedWords([]);
      setPracticeCompleted(false);
      setShieldTriggered(false);
    }
  };

  const handlePrevStep = () => {
    playSound("click");
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      // Reset local state for previous step
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setSelectedWords([]);
      setPracticeCompleted(false);
      setShieldTriggered(false);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    playSound("click");
    setSelectedOption(idx);
  };

  const handleVerifyQuiz = () => {
    if (currentStep.type === "cognitive") {
      if (selectedOption === null || isAnswered) return;
      const correctIdx = currentStep.correctIndex;
      const correct = selectedOption === correctIdx;
      
      setIsAnswered(true);
      setIsCorrect(correct);

      // Call recordMetric to correlate weights correctly
      if ((currentStep as any).isMediaCheckpoint) {
        recordMetric("adv_media", correct);
      } else {
        recordMetric("tense", correct);
      }

      if (correct) {
        playSound("success");
      } else {
        playSound("error");
        
        let shouldPenalize = true;
        if (inventory.includes("mistake_shield")) {
          const used = consumeItem("mistake_shield");
          if (used) {
            shouldPenalize = false;
            setShieldTriggered(true);
          }
        }
        
        if (shouldPenalize) {
          setWrongAttemptsCount(prev => prev + 1);
        }

        setShakeActive(true);
        setTimeout(() => setShakeActive(false), 500);
      }
    } else if (currentStep.type === "mastery") {
      if (selectedWords.length === 0 || practiceCompleted) return;
      const match = selectedWords.join(" ") === currentStep.correctSequence.join(" ");
      setPracticeCompleted(true);
      setIsCorrect(match);

      // Call recordMetric to correlate weights correctly
      if ((currentStep as any).isAcademicComposition) {
        recordMetric("adv_composition", match);
      } else {
        recordMetric("tense", match);
      }
      
      if (match) {
        playSound("success");
      } else {
        playSound("error");
        
        let shouldPenalize = true;
        if (inventory.includes("mistake_shield")) {
          const used = consumeItem("mistake_shield");
          if (used) {
            shouldPenalize = false;
            setShieldTriggered(true);
          }
        }
        
        if (shouldPenalize) {
          setWrongAttemptsCount(prev => prev + 1);
        }

        setShakeActive(true);
        setTimeout(() => setShakeActive(false), 500);
      }
    }
  };

  const handleScrambledWordClick = (word: string, isFromSelected: boolean) => {
    playSound("click");
    if (isFromSelected) {
      setSelectedWords(prev => prev.filter(w => w !== word));
    } else {
      setSelectedWords(prev => [...prev, word]);
    }
  };

  const handleFinishLesson = () => {
    playSound("unlock");
    
    // Add all newly unlocked lesson vocab cards to the global dynamic SRS deck automatically
    steps.forEach(step => {
      if (step.type === "deconstruction") {
        step.vocab.forEach(item => {
          addFlashcard(item.bengali, item.english);
        });
      }
    });

    // Award dynamically computed XP and complete lesson (advances day and streak)
    const finalXp = wrongAttemptsCount >= 3 ? 2 : Math.max(2, 20 - (wrongAttemptsCount * 5));
    completeLesson(finalXp, wrongAttemptsCount);
    onClose();
  };

  const playSynthesizedAudio = (text: string) => {
    playSound("beep");
    setAudioPlaying(true);
    // Real native speech simulation
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      // Pace standard native: 1.15 for Phase 2 onward instead of slow 0.85
      utterance.rate = currentDay >= 31 ? 1.15 : 0.85;
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setAudioPlaying(false), 2000);
    }
  };

  // Progress percentage calculation
  const progressPercent = Math.round(((currentStepIndex + 0.5) / steps.length) * 100);

  return (
    <div className={`bg-[#FAFAF9] neo-border rounded-3xl p-6 border-4 border-[#0F172A] space-y-6 relative overflow-hidden transition-all duration-150 ${shakeActive ? "animate-shake border-red-500 shadow-none scale-98" : ""}`}>
      
      {/* Visual Shake Injector */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
      
      {/* 1. Header with dynamic navigation */}
      <div className="flex justify-between items-center border-b-4 border-[#0F172A] pb-4">
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer text-[#0F172A] flex items-center space-x-1 font-mono text-[10px] uppercase font-black"
        >
          <ArrowLeft size={16} />
          <span>Exit</span>
        </button>
        
        <div className="text-center">
          <span className="text-[10px] font-mono font-black text-[#7C3AED] uppercase tracking-wider block">
            {activeDayCurriculum.phaseTitle}
          </span>
          <h2 className="font-display font-black text-sm text-[#0F172A] tracking-tight uppercase leading-none">
            {activeDayCurriculum.title}
          </h2>
        </div>

        <div className="bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#0F172A] text-[10px] font-mono font-black text-[#0F172A]">
          Step {currentStepIndex + 1} / {steps.length}
        </div>
      </div>

      {/* Modern Brutalist Progress Bar */}
      <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden neo-border-sm relative">
        <div 
          className="bg-[#10B981] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
        <div className="absolute inset-0 flex justify-between items-center px-4 font-mono text-[8px] text-stone-600 font-bold pointer-events-none">
          <span>Deconstruct</span>
          <span>Contrastive</span>
          <span>Cognitive</span>
          <span>Mastery</span>
        </div>
      </div>

      {/* Dynamic Penalty/XP Math Dashboard */}
      <div className="grid grid-cols-2 gap-3 bg-stone-100 p-2.5 rounded-xl border-2 border-[#0F172A] text-center font-mono text-[10px]">
        <div className="flex items-center justify-center space-x-1.5">
          <span className="font-bold text-stone-500">ESTIMATED REWARD:</span>
          <span className={`font-black text-xs px-2 py-0.5 rounded border border-[#0F172A] ${
            wrongAttemptsCount === 0 ? "bg-[#D1FAE5] text-[#065F46]" : wrongAttemptsCount >= 3 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
          }`}>
            +{wrongAttemptsCount >= 3 ? 2 : Math.max(2, 20 - (wrongAttemptsCount * 5))} XP
          </span>
        </div>
        <div className="flex items-center justify-center space-x-1.5 border-l-2 border-[#0F172A]">
          <span className="font-bold text-stone-500">WRONG ATTEMPTS:</span>
          <span className={`font-black text-xs px-2 py-0.5 rounded border border-[#0F172A] ${
            wrongAttemptsCount > 0 ? "bg-red-100 text-red-600 font-bold" : "bg-white text-stone-800"
          }`}>
            {wrongAttemptsCount}
          </span>
        </div>
      </div>

      {/* 2. Step View Router */}

      {/* Step Type 1: Deconstruction step */}
      {currentStep.type === "deconstruction" && (
        <div className="space-y-5 animate-fadeIn">
          {/* Main rule block */}
          <div className="bg-[#EDE9FE] p-5 rounded-2xl neo-border-sm border-2 border-[#7C3AED] relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-15">
              <GraduationCap size={44} className="text-[#7C3AED]" />
            </div>
            
            <h3 className="font-display font-black text-base text-[#0F172A] uppercase flex items-center mb-2">
              <BookOpen className="mr-2 text-[#7C3AED]" size={18} />
              {currentStep.title}
            </h3>
            
            <p className="text-xs text-stone-800 font-medium whitespace-pre-line leading-relaxed">
              {currentStep.explanation}
            </p>
          </div>

          {/* Vocabulary Box */}
          <div className="bg-white rounded-2xl p-4 neo-border-sm space-y-3">
            <span className="text-[10px] text-stone-500 font-black uppercase tracking-wider block">
              💡 Essential word blocks for today:
            </span>
            
            <div className="grid grid-cols-2 gap-3">
              {currentStep.vocab.map((v, i) => (
                <div 
                  key={i}
                  className="bg-[#FAFAF9] p-3 rounded-xl border border-stone-200 relative flex flex-col justify-between"
                >
                  <div>
                    <span className="font-display font-black text-base text-[#7C3AED]">
                      {v.english}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono block mb-1">
                      (উচ্চারণ: {v.phonetic})
                    </span>
                  </div>
                  <div className="border-t border-stone-100 pt-1.5 mt-1">
                    <span className="text-xs font-black text-[#0F172A]">
                      {v.bengali}
                    </span>
                    <p className="text-[9px] text-stone-500 font-medium leading-tight">
                      {v.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom navigation */}
          <button
            onClick={handleNextStep}
            className="w-full py-3.5 bg-[#7C3AED] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl neo-border neo-shadow-sm transition-transform neo-button-push flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Next: Let's Practice</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step Type 2: Contrastive step */}
      {currentStep.type === "contrastive" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Context header */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <h4 className="font-display font-bold text-xs text-amber-800 uppercase">
              Auditory Practice & Structural Check
            </h4>
            <p className="text-xs text-stone-700 font-medium mt-1 leading-normal">
              {currentStep.instruction}
            </p>
          </div>

          {/* Sentence showcase card */}
          <div className="bg-white rounded-2xl p-6 neo-border border-3 border-[#0F172A] text-center space-y-4 relative">
            <span className="text-[10px] text-stone-400 font-mono font-black uppercase tracking-wider">
              NATIVE SENTENCE EQUALIZER
            </span>

            <div className="space-y-1">
              <p className="font-display font-black text-2xl text-[#7C3AED] uppercase tracking-dense leading-none">
                "{currentStep.sentenceEnglish}"
              </p>
              <p className="text-xs text-[#0F172A] font-bold">
                (বাংলা: {currentStep.sentenceBengali})
              </p>
            </div>

            <div className="bg-stone-50 py-2.5 px-4 rounded-xl border border-stone-200 inline-block text-xs font-mono font-semibold text-stone-700">
              Phonetic: <strong>{currentStep.phonetic}</strong>
            </div>

            {/* Simulated audio playback player button */}
            <div className="pt-2">
              <button
                onClick={() => playSynthesizedAudio(currentStep.audioSimulationText)}
                disabled={audioPlaying}
                className={`px-6 py-2.5 rounded-full font-display font-black text-xs uppercase tracking-wide neo-border-sm transition-all neo-button-push flex items-center space-x-2 mx-auto cursor-pointer ${
                  audioPlaying 
                    ? "bg-[#10B981] text-white animate-pulse" 
                    : "bg-stone-900 text-white hover:bg-stone-800"
                }`}
              >
                <Volume2 size={16} className={audioPlaying ? "animate-bounce" : ""} />
                <span>{audioPlaying ? "Speaking phrase..." : "Listen Native Audio"}</span>
              </button>
              <span className="text-[8px] text-stone-400 font-mono block mt-1">
                Reads sentence slowly in ultra-clear native accent
              </span>
            </div>
          </div>

          {/* Bottom navigation bar */}
          <div className="flex space-x-2">
            <button
              onClick={handlePrevStep}
              className="px-4 py-3.5 bg-stone-100 text-stone-700 font-display font-extrabold text-xs uppercase rounded-xl neo-border-sm transition-transform neo-button-push cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="flex-1 py-3.5 bg-[#F59E0B] text-[#0f172a] font-display font-black text-xs uppercase tracking-wider rounded-xl neo-border neo-shadow-sm transition-transform neo-button-push flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Next: Take the Quiz</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step Type 3: Cognitive step */}
      {currentStep.type === "cognitive" && (
        <div className="space-y-5 animate-fadeIn">
          {/* Question area */}
          <div className="bg-white rounded-2xl p-5 neo-border border-2 border-stone-800 space-y-2">
            <span className="text-[9px] text-[#F59E0B] font-mono font-black uppercase tracking-wider block">
              COGNITIVE GAUNTLET DRILL
            </span>
            
            <h3 className="font-display font-black text-base text-[#0F172A] leading-tight">
              {currentStep.prompt}
            </h3>
            
            <p className="text-xs text-stone-600 font-medium italic">
              {currentStep.bengaliPrompt}
            </p>
          </div>

          {/* Question layout choices */}
          <div className="space-y-2">
            {currentStep.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              
              let btnStyle = "bg-white text-[#0F172A] border-stone-300 hover:bg-stone-50";
              
              if (isAnswered) {
                if (idx === currentStep.correctIndex) {
                  btnStyle = "bg-[#D1FAE5] text-[#065F46] border-[#10B981] border-2";
                } else if (isSelected) {
                  btnStyle = "bg-[#FEE2E2] text-[#991B1B] border-red-500 border-2";
                } else {
                  btnStyle = "bg-stone-50 text-stone-400 opacity-60 pointer-events-none";
                }
              } else if (isSelected) {
                btnStyle = "bg-[#EDE9FE] text-[#7C3AED] border-[#7C3AED] border-2";
              }

              return (
                <button
                  key={idx}
                  id={`quiz-option-step-${idx}`}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left p-3.5 rounded-xl text-xs font-mono font-bold border-2 transition-all cursor-pointer ${btnStyle}`}
                >
                  <span className="inline-block mr-2 text-stone-400">{String.fromCharCode(65 + idx)})</span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Submission Feedback & explanation block */}
          {isAnswered && (
            <div className={`p-4 rounded-xl border-2 text-xs font-semibold space-y-1.5 ${
              isCorrect ? "bg-[#D1FAE5] text-[#065F46] border-[#10B981]" : "bg-[#FEE2E2] text-[#991B1B] border-red-500"
            }`}>
              <div className="flex items-center">
                {isCorrect ? (
                  <CheckCircle2 size={16} className="mr-1.5 shrink-0" />
                ) : (
                  <XCircle size={16} className="mr-1.5 shrink-0" />
                )}
                <span className="font-display font-black text-xs uppercase">
                  {isCorrect ? "Correct! Continue..." : "Incorrect! Penalty Applied (-5 XP)"}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed font-normal">
                {currentStep.explanation}
              </p>
            </div>
          )}

          {/* Bottom Verification buttons */}
          <div className="space-y-2">
            {!isAnswered ? (
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-3.5 bg-stone-100 text-stone-700 font-display font-extrabold text-xs uppercase rounded-xl neo-border-sm transition-transform neo-button-push cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyQuiz}
                  disabled={selectedOption === null}
                  className={`flex-1 py-3.5 rounded-xl font-display font-black text-xs uppercase tracking-wider neo-border neo-shadow-sm transition-transform neo-button-push ${
                    selectedOption === null 
                      ? "bg-stone-100 text-stone-400 cursor-not-allowed opacity-50"
                      : "bg-[#F59E0B] text-[#0f172a] cursor-pointer"
                  }`}
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                {!isCorrect && (
                  <button
                    onClick={() => {
                      setSelectedOption(null);
                      setIsAnswered(false);
                      setIsCorrect(false);
                    }}
                    className="flex-1 py-3 bg-stone-100 text-stone-800 font-display font-bold text-xs uppercase rounded-xl neo-border-sm transition-transform neo-button-push cursor-pointer"
                  >
                    Try Again
                  </button>
                )}

                {isCorrect && (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 py-3.5 bg-[#F59E0B] text-[#0f172a] font-display font-black text-xs uppercase tracking-wider rounded-xl neo-border neo-shadow-sm transition-transform neo-button-push flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Continue Gauntlet</span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step Type 4: Mastery Challenge */}
      {currentStep.type === "mastery" && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 neo-border border-2 border-stone-800 space-y-2">
            <span className="text-[9px] text-[#e11d48] font-mono font-black uppercase tracking-wider block">
              FINAL MASTERY CHALLENGE LOCK
            </span>
            <h3 className="font-display font-black text-base text-[#0F172A] leading-tight">
              {currentStep.prompt}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="min-h-[60px] bg-white border-2 border-[#0F172A] rounded-xl p-3 flex flex-wrap gap-2 items-center justify-center shadow-inner">
              {selectedWords.length === 0 ? (
                <span className="text-[10px] font-bold text-stone-400 italic">
                  Tap word tiles below in sequence to assemble...
                </span>
              ) : (
                selectedWords.map((word) => (
                  <button
                    key={`selected-${word}`}
                    onClick={() => handleScrambledWordClick(word, true)}
                    disabled={practiceCompleted}
                    className="px-2.5 py-1.5 bg-[#EDE9FE] hover:bg-rose-100 font-mono text-xs font-black text-[#0F172A] rounded border-2 border-[#0F172A] hover:border-red-500 cursor-pointer transition-colors"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center py-1">
              {currentStep.scrambledOptions.map((word: string) => {
                const isSelected = selectedWords.includes(word);
                return (
                  <button
                    key={`scrambled-${word}`}
                    onClick={() => handleScrambledWordClick(word, false)}
                    disabled={isSelected || practiceCompleted}
                    className={`px-3 py-2 font-mono text-xs font-black rounded border-2 border-[#0F172A] transition-all cursor-pointer ${
                      isSelected 
                        ? "opacity-20 bg-stone-100 text-stone-400 border-dashed cursor-not-allowed" 
                        : "bg-[#FAFAF9] text-[#0F172A] hover:bg-amber-100 shadow-[2px_2px_0px_0px_#0F172A] hover:-translate-y-0.5"
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-center flex-wrap gap-1.5">
              {selectedWords.length > 0 && !practiceCompleted && (
                <button
                  onClick={() => {
                    playSound("click");
                    setSelectedWords([]);
                  }}
                  className="text-[9px] font-mono font-black uppercase text-[#D97706] hover:underline cursor-pointer"
                >
                  [Clear Selection]
                </button>
              )}
            </div>
          </div>

          {practiceCompleted && (
            <div className={`p-4 rounded-xl border-2 text-xs font-semibold space-y-1.5 ${
              isCorrect ? "bg-[#D1FAE5] text-[#065F46] border-[#10B981]" : "bg-[#FEE2E2] text-[#991B1B] border-red-500"
            }`}>
              <div className="flex items-center">
                {isCorrect ? (
                  <CheckCircle2 size={16} className="mr-1.5 shrink-0" />
                ) : (
                  <XCircle size={16} className="mr-1.5 shrink-0" />
                )}
                <span className="font-display font-black text-xs uppercase">
                  {isCorrect ? "Mastery Achieved!" : "Incorrect Sequence! Penalty Applied (-5 XP)"}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed font-normal">
                {currentStep.explanation}
              </p>
            </div>
          )}

          <div className="space-y-2">
            {!practiceCompleted ? (
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-3.5 bg-stone-100 text-stone-700 font-display font-extrabold text-xs uppercase rounded-xl neo-border-sm transition-transform neo-button-push cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyQuiz}
                  disabled={selectedWords.length === 0}
                  className={`flex-1 py-3.5 rounded-xl font-display font-black text-xs uppercase tracking-wider neo-border neo-shadow-sm transition-transform neo-button-push ${
                    selectedWords.length === 0 
                      ? "bg-stone-100 text-stone-400 cursor-not-allowed opacity-50"
                      : "bg-[#F59E0B] text-[#0f172a] cursor-pointer"
                  }`}
                >
                  Verify Structure
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                {!isCorrect && (
                  <button
                    onClick={() => {
                      setSelectedWords([]);
                      setPracticeCompleted(false);
                      setIsCorrect(false);
                    }}
                    className="flex-1 py-3 bg-stone-100 text-stone-800 font-display font-bold text-xs uppercase rounded-xl neo-border-sm transition-transform neo-button-push cursor-pointer"
                  >
                    Try Again
                  </button>
                )}

                {isCorrect && currentStepIndex < steps.length - 1 && (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 py-3.5 bg-[#F59E0B] text-[#0f172a] font-display font-black text-xs uppercase tracking-wider rounded-xl neo-border neo-shadow-sm transition-transform neo-button-push flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Continue Gauntlet</span>
                    <ChevronRight size={16} />
                  </button>
                )}

                {isCorrect && currentStepIndex === steps.length - 1 && (
                  <button
                    onClick={handleFinishLesson}
                    className="flex-1 py-3.5 bg-[#10B981] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl neo-border neo-shadow-sm transition-transform neo-button-push flex items-center justify-center space-x-1.5 cursor-pointer animate-pulse"
                  >
                    <Sparkles size={14} className="animate-spin-slow" />
                    <span>CLAIM +{wrongAttemptsCount >= 3 ? 2 : Math.max(2, 20 - (wrongAttemptsCount * 5))} XP & FINISH</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decorative footer styling */}
      <div className="text-center font-mono text-[8px] text-stone-400 font-bold uppercase tracking-widest pt-2">
        Bolo English Native-Pedagogical Pipeline Built Verified
      </div>

    </div>
  );
};
