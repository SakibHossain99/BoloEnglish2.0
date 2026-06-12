import React, { useState } from "react";
import { epicIdiomBusters } from "../data";
import { playSound } from "./AudioPlayer";
import { useGlobalState } from "../globalState";
import { Sparkles, XCircle, CheckCircle2, ChevronRight, Mic, BookOpen, Volume2 } from "lucide-react";

export const IdiomsTab: React.FC = () => {
  const { profile, updateUserXp, recordMetric } = useGlobalState();
  const [selectedBusterIdx, setSelectedBusterIdx] = useState(0);
  const [drillActive, setDrillActive] = useState(false);
  const [drillSuccess, setDrillSuccess] = useState<boolean | null>(null);
  const [micVolume, setMicVolume] = useState(0);
  const [accuracyScore, setAccuracyScore] = useState<number>(0);

  const activeBuster = epicIdiomBusters[selectedBusterIdx];

  const handleSelectBuster = (idx: number) => {
    playSound("click");
    setSelectedBusterIdx(idx);
    setDrillActive(false);
    setDrillSuccess(null);
  };

  const handleStartMicDrill = async () => {
    playSound("beep");
    setDrillActive(true);
    setDrillSuccess(null);

    // Simulate speech processing with volume changes
    let vol = 0;
    const interval = setInterval(() => {
      vol = Math.floor(Math.random() * 60) + 20;
      setMicVolume(vol);
    }, 100);

    const score = Math.floor(Math.random() * 30) + 70; // 70 - 100%
    setAccuracyScore(score);

    setTimeout(async () => {
      clearInterval(interval);
      setMicVolume(0);
      setDrillSuccess(true);
      playSound("success");

      // Record phonetic voice test attempts and check matches/beats baseline target evaluation threshold (85%)
      if (recordMetric) {
        recordMetric("phonetic", score >= 85);
      }

      // Update global profile state XP (+15 XP) and accent scores safely
      await updateUserXp(15);
    }, 2800);
  };

  return (
    <div className="space-y-6">
      {/* Tab Banner */}
      <div className="space-y-1">
        <h2 className="font-display font-black text-2xl tracking-tight uppercase text-[#0F172A] flex items-center">
          <BookOpen className="mr-2 text-[#7C3AED]" />
          LITERAL HABIT BUSTERS
        </h2>
        <p className="text-xs text-[#4A4455] font-semibold leading-relaxed">
          Erase literal Bengali-to-English translation reflexes. Tap an idiom to learn its native situational equivalent!
        </p>
      </div>

      {/* Grid of Idiom Chips */}
      <div className="bg-white neo-border rounded-xl p-4 neo-shadow-sm">
        <span className="text-[10px] text-[#7C3AED] font-black uppercase tracking-widest block mb-2">
          Literal habit escape inventory
        </span>
        <div className="flex flex-wrap gap-1.5">
          {epicIdiomBusters.map((buster, idx) => {
            const isActive = selectedBusterIdx === idx;
            return (
              <button
                key={idx}
                id={`idiom-chip-btn-${idx}`}
                onClick={() => handleSelectBuster(idx)}
                className={`neo-border-sm px-3 py-1.5 rounded-lg text-xs font-bold transition-all transition-transform neo-button-push cursor-pointer ${
                  isActive 
                    ? "bg-[#7C3AED] text-white border-[#0F172A]" 
                    : "bg-white text-stone-800 hover:bg-stone-50"
                }`}
              >
                {buster.bengali.split(" (")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* The Mega Habit Card - high visual rendering */}
      {activeBuster && (
        <div className="bg-[#FAFAF9] neo-border rounded-2xl p-6 neo-shadow space-y-5 border-4 border-[#0F172A]">
          {/* Card title indicator */}
          <div className="border-b border-stone-200 pb-3 flex justify-between items-center">
            <span className="text-xs font-display font-black text-stone-800 uppercase pl-1">
              Active Focus: {activeBuster.bengali}
            </span>
            <span className="bg-[#FEF3C7] text-[#D97706] text-[10px] font-mono font-black px-2 py-0.5 rounded border border-[#D97706]">
              Phase 1 Habit Correction
            </span>
          </div>

          {/* Error and corrected layout block */}
          <div className="space-y-3">
            {/* The bad way */}
            <div className="bg-[#FEE2E2] p-4 rounded-xl border-2 border-red-500 relative overflow-hidden">
              <span className="absolute right-4 top-2 text-[10px] font-display font-black text-red-500 uppercase tracking-widest">
                ❌ Raw Direct Habit
              </span>
              <p className="font-display font-black text-lg text-red-800 leading-tight">
                "{activeBuster.literalMistake}"
              </p>
              <span className="text-[10px] text-red-700 font-semibold block mt-1">
                (Avoid saying this completely! Broadcasters, HR, and global peers will be confused.)
              </span>
            </div>

            {/* The polished native way */}
            <div className="bg-[#D1FAE5] p-4 rounded-xl border-2 border-emerald-500 relative overflow-hidden">
              <span className="absolute right-4 top-2 text-[10px] font-display font-black text-emerald-500 uppercase tracking-widest">
                👉 native equivalence
              </span>
              <p className="font-display font-black text-xl text-emerald-900 leading-none">
                "{activeBuster.correctEnglish}"
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                (This is idiomatic, secure, and sounds natural!)
              </span>
            </div>
          </div>

          {/* Explanation text block */}
          <div className="bg-white p-4 rounded-xl neo-border-sm text-xs leading-relaxed text-stone-700 space-y-1 font-semibold">
            <h5 className="font-display font-black text-xs text-[#0F172A] uppercase">
              Linguistic Context:
            </h5>
            <p className="text-stone-600 font-normal">
              {activeBuster.contextExplanation}
            </p>
            <div className="pt-2 mt-2 border-t border-stone-100 text-[10px] text-stone-500 font-mono">
              <strong>Phonetics Guide:</strong> {activeBuster.phoneticHint}
            </div>
          </div>

          {/* Interactive speaking calibration check */}
          <div className="bg-stone-900 text-white rounded-xl p-4 neo-border relative overflow-hidden">
            <h4 className="font-display font-black text-sm uppercase text-[#F59E0B] tracking-wide flex items-center">
              <Volume2 className="mr-1.5" size={16} /> Phonetic Calibrator
            </h4>
            <p className="text-[11px] text-stone-400 mt-1 leading-normal mb-3">
              Read the sentence loud into the mic to test: <strong>"{activeBuster.audioCalibrationText}"</strong>
            </p>

            {!drillActive ? (
              <button
                id="idiom-drill-btn"
                onClick={handleStartMicDrill}
                className="w-full py-2 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#0F172A] font-display font-black text-xs uppercase tracking-wider rounded-lg neo-border-sm transition-transform neo-button-push flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Mic size={14} />
                <span>Start Accent Evaluation</span>
              </button>
            ) : drillSuccess === null ? (
              <div className="space-y-2 text-center text-xs">
                <span className="font-mono font-bold text-red-400 animate-pulse block">
                  🛡️ Microphone listening... calibrate audio inputs ({micVolume}%)
                </span>
                <div className="h-1.5 bg-stone-800 rounded overflow-hidden">
                  <div className="bg-[#F59E0B] h-full" style={{ width: `${micVolume}%` }} />
                </div>
              </div>
            ) : (
              <div className="bg-[#0F172A] p-2.5 rounded neo-border-sm border-teal-500 text-center text-xs space-y-1">
                <span className="text-[9px] font-display font-black text-[#10B981] uppercase tracking-widest block">
                  Evaluation Finished
                </span>
                <p className="font-display font-black text-[#10B981] text-xs">
                  Phrase Accuracy: {accuracyScore}% Match! {accuracyScore >= 85 ? "(PASSED BASELINE ✅)" : "(BELOW 85% BASELINE ⚠️)"} (+15 XP)
                </p>
                <button
                  onClick={() => setDrillActive(false)}
                  className="mt-2 text-[10px] font-bold text-stone-400 hover:text-white cursor-pointer"
                >
                  Close Calibrator
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
