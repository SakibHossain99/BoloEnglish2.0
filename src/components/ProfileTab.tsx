import React, { useState } from "react";
import { playSound } from "./AudioPlayer";
import { useGlobalState } from "../globalState";
import {
  User,
  ShieldAlert,
  Check,
  Palette,
  Star,
  Coins,
  PackageOpen,
  Award,
  Lock,
  Shield,
  Zap,
} from "lucide-react";

export const ProfileTab: React.FC = () => {
  const {
    profile,
    userProfile,
    isGuestMode,
    updateTheme,
    resetAllProgress,
    logoutUser,
    openChest,
    buyShopItem,
    availableChests,
  } = useGlobalState();
  const [resetDoubleChecked, setResetDoubleChecked] = useState(false);

  // Defensive fallback tracking guards to guarantee zero runtime crashes
  const xp = userProfile?.xp ?? 0;
  const streak = userProfile?.streak ?? 0;
  const currency = userProfile?.currency ?? 0;
  const inventory = userProfile?.inventory ?? [];
  const currentDay = userProfile?.currentDay ?? 1;

  // Custom themes list
  const themeOptions = [
    { id: "default", label: "Neo-Brutalist Light 🍦", bg: "bg-[#FAFAF9]" },
    {
      id: "neon_brutalist_theme",
      label: "Neon Brutalist 🟢",
      bg: "bg-stone-900",
      text: "text-stone-300",
    },
    {
      id: "cyberpunk_dhaka_theme",
      label: "Cyberpunk Dhaka 🌆",
      bg: "bg-[#2D0B44]",
      text: "text-[#F59E0B]",
    },
  ];

  const BADGE_DEFS = [
    {
      id: "SVO Marksman",
      desc: "Perfectly complete 5 lessons consecutively.",
      icon: "🎯",
    },
    {
      id: "Bonglish Exorcist",
      desc: "Reach Day 7 or perfect Phase 1 Habit Buster.",
      icon: "⚔️",
    },
    {
      id: "Fluent Overlord",
      desc: "Accumulate 500+ XP dynamically.",
      icon: "👑",
    },
  ];

  const handleBuy = (item: string, cost: number) => {
    playSound("click");
    if (buyShopItem(item, cost)) {
      playSound("success");
    } else {
      playSound("error");
    }
  };

  const handleOpenChest = () => {
    playSound("beep");
    const drop = openChest();
    if (drop) {
      playSound("unlock");
      alert(`Chest Opened! You found: ${drop}`);
    } else {
      playSound("error");
    }
  };

  const handleToggleTheme = async (themeId: string) => {
    playSound("beep");
    // Ensure they own the theme (or it's default)
    if (themeId !== "default" && !inventory.includes(themeId)) {
      playSound("error");
      return;
    }
    await updateTheme(themeId);
  };

  const triggerReset = async () => {
    if (!resetDoubleChecked) {
      playSound("error");
      setResetDoubleChecked(true);
    } else {
      playSound("unlock");
      await resetAllProgress();
      setResetDoubleChecked(false);
    }
  };

  // Helper function to count item frequencies dynamically within inventory array dataset
  const countItem = (item: string) =>
    (inventory || []).filter((i) => i === item).length;

  // Badge rendering component helper
  const renderBadgeComponent = (badgeId: string) => {
    const badge = BADGE_DEFS.find((b) => b.id === badgeId);
    if (!badge) return null;
    return (
      <div
        key={badge.id}
        className="flex gap-3 p-3 rounded-xl border-2 transition-all bg-[#D1FAE5] border-[#10B981] text-[#065F46] border-b-4"
      >
        <div className="text-2xl flex items-center justify-center w-10">
          {badge.icon}
        </div>
        <div>
          <h5 className="font-display font-black text-xs uppercase">
            {badge.id}
          </h5>
          <p className="text-[9px] font-semibold mt-0.5">{badge.desc}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Box */}
      <div className="bg-white p-5 rounded-2xl neo-border border-4 border-[#0F172A] neo-shadow flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full neo-border border-4 border-[#0F172A] flex items-center justify-center text-stone-500 mb-3 relative overflow-hidden">
          <User size={40} className="text-stone-400" />
          <span className="absolute bottom-0 inset-x-0 bg-[#0F172A] text-white text-[8px] font-mono font-black uppercase py-0.5 tracking-wider">
            {isGuestMode ? "GUEST USER" : "PREMIUM"}
          </span>
        </div>

        <h3 className="font-display font-black text-xl text-[#0F172A] uppercase tracking-tight">
          {userProfile?.name ?? "Learner"}
        </h3>
        <p className="text-xs text-stone-600 font-bold mb-1 font-mono uppercase tracking-wide">
          XP: {xp} • Streak: {streak} Day{streak === 1 ? "" : "s"}
        </p>
        <p className="text-[10px] text-stone-400 font-bold leading-relaxed">
          {isGuestMode
            ? "Status: Offline Guest Mode. Data lives in safety local keys."
            : "Google Verified. Cloud backups active."}
        </p>
      </div>

      {/* 2. Economy & Chest Loot Panel Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#FEF3C7] p-4 rounded-2xl neo-border border-4 border-[#0F172A] flex flex-col items-center justify-center neo-shadow text-center relative">
          <div className="absolute top-2 right-2 opacity-20">
            <Coins size={28} className="text-[#D97706]" />
          </div>
          <span className="text-[9px] text-[#0F172A] font-mono font-black uppercase tracking-wider block">
            Bolo Coins
          </span>
          <h3 className="font-display font-black text-xl text-[#D97706] mt-1 flex items-center">
            {currency} <sub className="text-[9px] ml-1 font-mono">BC</sub>
          </h3>
        </div>

        <button
          onClick={handleOpenChest}
          disabled={availableChests <= 0}
          className={`p-4 rounded-2xl neo-border border-4 flex flex-col items-center justify-center transition-all neo-button-push text-center cursor-pointer relative ${
            availableChests > 0
              ? "bg-[#D1FAE5] border-[#10B981] neo-shadow hover:bg-[#A7F3D0]"
              : "bg-stone-100 border-stone-300 opacity-60 cursor-not-allowed"
          }`}
        >
          <div className="absolute top-2 right-2 opacity-20">
            <PackageOpen
              size={28}
              className={
                availableChests > 0 ? "text-[#059669]" : "text-stone-400"
              }
            />
          </div>
          <span className="text-[9px] text-[#0F172A] font-mono font-black uppercase tracking-wider block">
            {availableChests > 0 ? "Open Chest" : "No Chests"}
          </span>
          <h3
            className={`font-display font-black text-xl mt-1 ${
              availableChests > 0 ? "text-[#059669]" : "text-stone-500"
            }`}
          >
            {availableChests}{" "}
            <sub className="text-[9px] ml-1 font-mono">READY</sub>
          </h3>
        </button>
      </div>

      {/* 3. Utility Shop */}
      <div className="bg-white p-5 rounded-2xl neo-border border-4 border-[#0F172A] neo-shadow-sm space-y-3">
        <h4 className="font-display font-black text-xs text-[#0F172A] uppercase tracking-wide flex items-center">
          <Star size={16} className="text-[#F59E0B] mr-1.5" />
          UTILITY SHOP
        </h4>

        <div className="space-y-2">
          {/* Streak Freeze item */}
          <div className="bg-stone-50 p-3 rounded-xl border-2 border-stone-800 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-[#DBEAFE] p-2 rounded border border-[#1E3A8A]">
                <Zap size={16} className="text-[#1E3A8A]" />
              </div>
              <div>
                <p className="font-mono font-black text-xs text-[#0F172A]">
                  Streak Freeze
                </p>
                <p className="text-[9px] text-stone-500 font-bold">
                  Shields your day streak.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleBuy("streak_freeze", 50)}
              disabled={currency < 50}
              className={`px-3 py-1.5 rounded text-xs font-black font-mono neo-border-sm cursor-pointer ${
                currency >= 50
                  ? "bg-[#F59E0B] text-black hover:bg-amber-400 border border-black"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300"
              }`}
            >
              50 BC
            </button>
          </div>

          {/* Mistake Shield item */}
          <div className="bg-stone-50 p-3 rounded-xl border-2 border-stone-800 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-[#FEE2E2] p-2 rounded border border-[#991B1B]">
                <Shield size={16} className="text-[#991B1B]" />
              </div>
              <div>
                <p className="font-mono font-black text-xs text-[#0F172A]">
                  Mistake Shield
                </p>
                <p className="text-[9px] text-stone-500 font-bold">
                  Forgives one wrong answer.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleBuy("mistake_shield", 30)}
              disabled={currency < 30}
              className={`px-3 py-1.5 rounded text-xs font-black font-mono neo-border-sm cursor-pointer ${
                currency >= 30
                  ? "bg-[#F59E0B] text-black hover:bg-amber-400 border border-black"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300"
              }`}
            >
              30 BC
            </button>
          </div>
        </div>
      </div>

      {/* 4. Inventory List & Themes */}
      <div className="bg-white p-5 rounded-2xl neo-border border-4 border-[#0F172A] neo-shadow-sm space-y-3">
        <h4 className="font-display font-black text-xs text-[#0F172A] uppercase tracking-wide flex items-center">
          <Lock size={16} className="text-[#0F172A] mr-1.5" />
          YOUR INVENTORY & ACTIVE THEMES
        </h4>

        {/* Quantified items row */}
        <div className="flex flex-wrap gap-2 text-[10px] font-mono font-black">
          <div className="px-2.5 py-1 bg-[#DBEAFE] text-[#1E3A8A] neo-border-sm border border-black">
            Streak Freeze: {countItem("streak_freeze")}
          </div>
          <div className="px-2.5 py-1 bg-[#FEE2E2] text-[#991B1B] neo-border-sm border border-black">
            Mistake Shield: {countItem("mistake_shield")}
          </div>
          {countItem("ai_mentor_retro_voice") > 0 && (
            <div className="px-2.5 py-1 bg-purple-100 text-purple-800 neo-border-sm border border-black">
              RT Voice Pack
            </div>
          )}
          {countItem("ai_mentor_radio_voice") > 0 && (
            <div className="px-2.5 py-1 bg-yellow-100 text-yellow-800 neo-border-sm border border-black">
              RD Voice Pack
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 pt-2">
          {themeOptions.map((opt) => {
            const isSelected = profile?.activeTheme === opt.id;
            const isOwned =
              opt.id === "default" || (inventory || []).includes(opt.id);

            return (
              <button
                key={opt.id}
                onClick={() => handleToggleTheme(opt.id)}
                disabled={!isOwned}
                className={`neo-border-sm p-3 rounded-lg text-xs font-bold font-mono transition-transform neo-button-push text-left flex items-center justify-between cursor-pointer border border-black ${opt.bg} ${
                  opt.text || "text-[#0F172A]"
                } ${
                  isSelected ? "border-[#7C3AED] border-2" : "border-stone-300"
                } ${!isOwned ? "opacity-45 cursor-not-allowed grayscale" : ""}`}
              >
                <span className="flex items-center space-x-2">
                  <span>{opt.label}</span>
                  {!isOwned && <Lock size={12} className="ml-2" />}
                </span>
                {isSelected && <Check size={14} className="stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Achievement Milestone Badges */}
      <div className="bg-white p-5 rounded-2xl neo-border border-4 border-[#0F172A] neo-shadow-sm space-y-3">
        <h4 className="font-display font-black text-xs text-[#0F172A] uppercase tracking-wide flex items-center">
          <Award size={16} className="text-[#0F172A] mr-1.5" />
          ACHIEVEMENT ENGINE
        </h4>

        <div className="space-y-2">
          {userProfile?.unlockedBadges &&
          userProfile.unlockedBadges.length > 0 ? (
            userProfile.unlockedBadges.map((badgeId: string) =>
              renderBadgeComponent(badgeId),
            )
          ) : (
            <p className="text-stone-500 font-semibold text-xs py-4 px-2 text-center bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl">
              No achievements unlocked yet. Clear your first lesson milestone!
            </p>
          )}
        </div>
      </div>

      {/* 6. Danger Area Reset Box */}
      <div className="bg-[#FFEBEB] rounded-2xl p-5 neo-border border-4 border-[#FFEBEB] neo-shadow-sm space-y-3">
        <h4 className="font-display font-black text-xs text-[#E11D48] uppercase tracking-wide flex items-center">
          <ShieldAlert size={16} className="mr-1.5" />
          PERMANENT RESET DANGER ZONE
        </h4>
        <p className="text-[10px] text-red-700 font-bold leading-relaxed">
          This operation permanently erases all gathered XP, custom chest loot
          items, calendar checkmarks, and learned flashcard histories. This is
          irreversible!
        </p>

        <button
          onClick={triggerReset}
          className={`w-full py-3 font-display font-black text-xs uppercase rounded-xl neo-border-sm border border-black neo-shadow-sm transition-all neo-button-push flex items-center justify-center space-x-1.5 cursor-pointer ${
            resetDoubleChecked
              ? "bg-[#E11D48] text-white hover:bg-red-700 border-red-800"
              : "bg-white text-red-600 hover:bg-red-50"
          }`}
        >
          {resetDoubleChecked
            ? "⚠️ CONFIRM WIPE OUT EVERYTHING?"
            : "Reset All Progress Data"}
        </button>
        {resetDoubleChecked && (
          <button
            onClick={() => setResetDoubleChecked(false)}
            className="w-full text-center text-[10px] text-stone-500 font-bold hover:underline cursor-pointer"
          >
            Cancel Reset
          </button>
        )}
      </div>
    </div>
  );
};
