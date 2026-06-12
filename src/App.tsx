import { useState, useEffect } from "react";
import { playSound } from "./components/AudioPlayer";
import { HomeTab } from "./components/HomeTab";
import { CardsTab } from "./components/CardsTab";
import { AiTeacherTab } from "./components/AiTeacherTab";
import { ProgressTab } from "./components/ProgressTab";
import { SkillArenaTab } from "./components/SkillArenaTab";
import { ProfileTab } from "./components/ProfileTab";
import { LoginScreen } from "./components/LoginScreen";
import { GlobalStateProvider, useGlobalState } from "./globalState";
import { Home, ClipboardList, BookOpen, Bot, LineChart, User, Flame, Clock, Wifi, BatteryMedium, Sparkles, Gamepad2 } from "lucide-react";

function MainAppContent() {
  const { user, isGuestMode, profile, loading } = useGlobalState();
  const [activeTab, setActiveTab] = useState<string>("home");

  // UTC clock simulation
  const [utcTime, setUtcTime] = useState("");
  useEffect(() => {
    const updateClock = () => {
      const date = new Date();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dynamically computed container color classes depending on selected theme
  const getThemeBgStyle = () => {
    switch (profile?.activeTheme) {
      case "neon_brutalist_theme": return "bg-stone-900";
      case "cyberpunk_dhaka_theme": return "bg-[#2D0B44]";
      default: return "bg-[#FAFAF9]";
    }
  };

  const getThemeFrameStyle = () => {
    switch (profile?.activeTheme) {
      case "neon_brutalist_theme": return "bg-black border-[#4ADE80] shadow-[4px_4px_0px_0px_#4ADE80]";
      case "cyberpunk_dhaka_theme": return "bg-[#1A0629] border-[#F59E0B] shadow-[4px_4px_0px_0px_#F59E0B]";
      default: return "bg-white border-[#0F172A] neo-shadow";
    }
  };

  const getThemeDeviceHeaderStyle = () => {
    switch (profile?.activeTheme) {
      case "neon_brutalist_theme": return "bg-stone-900 text-[#4ADE80] border-b-4 border-[#4ADE80]";
      case "cyberpunk_dhaka_theme": return "bg-black text-[#F59E0B] border-b-4 border-[#F59E0B]";
      default: return "bg-[#0F172A] text-white";
    }
  };

  const getThemeHeaderStyle = () => {
    switch (profile?.activeTheme) {
      case "neon_brutalist_theme": return "bg-black border-b-4 border-[#4ADE80] text-white";
      case "cyberpunk_dhaka_theme": return "bg-[#1A0629] border-b-4 border-[#F59E0B] text-white";
      default: return "bg-white border-b-4 border-[#0F172A] text-[#0F172A]";
    }
  };

  const getThemeBodyStyle = () => {
    switch (profile?.activeTheme) {
      case "neon_brutalist_theme": return "bg-stone-900 text-stone-200";
      case "cyberpunk_dhaka_theme": return "bg-[#2D0B44] text-[#F3E8FF]";
      default: return "bg-[#FAFAF9]";
    }
  };

  const getThemeNavStyle = () => {
    switch (profile?.activeTheme) {
      case "neon_brutalist_theme": return "bg-black border-t-4 border-[#4ADE80]";
      case "cyberpunk_dhaka_theme": return "bg-[#1A0629] border-t-4 border-[#F59E0B]";
      default: return "bg-white border-t-4 border-[#0F172A]";
    }
  };

  const getThemeActiveTabClass = (tabId: string) => {
    if (activeTab === tabId) {
      switch (profile?.activeTheme) {
        case "neon_brutalist_theme": return "bg-[#4ADE80] text-black border-2 border-transparent shadow-[2px_2px_0px_0px_#22C55E]";
        case "cyberpunk_dhaka_theme": return "bg-[#F59E0B] text-black border-2 border-transparent shadow-[2px_2px_0px_0px_#B45309]";
        default: return "bg-[#7C3AED] text-white border-2 border-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A]";
      }
    }
    
    switch (profile?.activeTheme) {
      case "neon_brutalist_theme": return "text-stone-500 hover:text-[#4ADE80]";
      case "cyberpunk_dhaka_theme": return "text-[#9333EA] hover:text-[#F59E0B]";
      default: return "text-stone-500 hover:text-[#0F172A]";
    }
  };

  const handleTabChange = (tabId: string) => {
    playSound("beep");
    setActiveTab(tabId);
  };

  // 1. Render beautiful loading splash when restoring firebase auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] py-6 px-4 flex flex-col justify-center items-center">
        <div className="w-full max-w-[440px] bg-white neo-border rounded-[32px] neo-shadow overflow-hidden flex flex-col items-center justify-center h-[880px] p-10 border-4 border-[#0F172A] select-none">
          <div className="bg-[#7C3AED] p-4 rounded-2xl neo-border text-white animate-spin duration-3000">
            <Sparkles size={32} />
          </div>
          <h2 className="font-display font-black text-xl text-[#0F172A] mt-6 uppercase tracking-wider">
            Bolo English
          </h2>
          <p className="text-xs text-stone-500 font-semibold mt-2 animate-pulse text-center">
            Synchronizing data records with Cloud Firestore...
          </p>
        </div>
      </div>
    );
  }

  // 2. Auth checking gate - redirects to standard login layout before granting tab access
  if (!user && !isGuestMode) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] py-6 px-4 flex flex-col justify-center items-center">
        <div className="w-full max-w-[440px] bg-white neo-border rounded-[32px] neo-shadow overflow-hidden flex flex-col h-[880px] border-4 border-[#0F172A]">
          {/* Mobile top status bar */}
          <div className="bg-[#0F172A] text-white px-6 py-2.5 flex justify-between items-center text-[11px] font-mono select-none shrink-0">
            <div className="flex items-center space-x-1 font-bold">
              <Clock size={11} />
              <span>{utcTime || "09:06"}</span>
            </div>
            <div className="flex items-center space-x-2 font-bold">
              <Wifi size={11} />
              <span>5G</span>
              <BatteryMedium size={12} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6 bg-[#FAFAF9]">
            <LoginScreen />
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated App Space with correct theme styling
  return (
    <div className={`min-h-screen ${getThemeBgStyle()} py-6 px-4 flex flex-col justify-center items-center transition-colors duration-300`}>
      
      {/* High-Fidelity Mobile View Device Frame simulation */}
      <div className={`w-full max-w-[440px] neo-border rounded-[32px] overflow-hidden flex flex-col h-[880px] border-4 ${getThemeFrameStyle()}`}>
        
        {/* Mobile top status bar */}
        <div className={`px-6 py-2.5 flex justify-between items-center text-[11px] font-mono select-none shrink-0 border-b-4 ${getThemeDeviceHeaderStyle()}`}>
          <div className="flex items-center space-x-1 font-bold">
            <Clock size={11} />
            <span>{utcTime || "09:06"}</span>
          </div>

          <div className="flex items-center space-x-2 font-bold">
            <Wifi size={11} />
            <span>5G</span>
            <BatteryMedium size={12} />
          </div>
        </div>

        {/* Dynamic App Header */}
        <header className={`px-5 py-4 flex justify-between items-center select-none shrink-0 relative ${getThemeHeaderStyle()}`}>
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg neo-border-sm text-white ${profile?.activeTheme === "cyberpunk_dhaka_theme" ? "bg-[#9333EA]" : "bg-[#7C3AED]"}`}>
              <Sparkles size={16} fill="white" className="animate-spin-slow" />
            </div>
            <h1 className="font-display font-black text-lg tracking-tight uppercase">
              Bolo English
            </h1>
          </div>

          {/* XP Banner box */}
          <div className="bg-[#FEF3C7] px-3 py-1 rounded-lg neo-border-sm text-[#D97706] font-mono text-xs font-black flex items-center space-x-1 shadow-[2px_2px_0px_0px_#0F172A]">
            <Flame size={12} className="fill-[#F59E0B]" />
            <span>{profile?.xp ?? 0} XP</span>
          </div>
        </header>

        {/* Scrollable Body Content wrapper */}
        <main className={`flex-1 overflow-y-auto px-5 py-6 relative ${getThemeBodyStyle()}`}>
          
          {/* Active Tab Screen router */}
          {activeTab === "home" && <HomeTab />}

          {activeTab === "cards" && <CardsTab />}

          {activeTab === "busters" && <SkillArenaTab />}

          {activeTab === "teacher" && <AiTeacherTab />}

          {activeTab === "stats" && <ProgressTab />}

          {(activeTab === "shop" || activeTab === "profile") && <ProfileTab />}
        </main>

        {/* 6-Tab Navigation Bottom Bar */}
        <nav className={`px-2 py-3 shrink-0 select-none ${getThemeNavStyle()}`}>
          <div className="grid grid-cols-6 gap-0.5">
            
            {/* Tab 1: Home */}
            <button
               id="nav-tab-home"
               aria-label="Home Tab"
               onClick={() => handleTabChange("home")}
               className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-100 cursor-pointer ${getThemeActiveTabClass("home")}`}
            >
              <Home size={16} />
              <span className="text-[8px] font-bold font-mono tracking-tighter mt-0.5 uppercase">Home</span>
            </button>

            {/* Tab 2: Flashcards */}
            <button
               id="nav-tab-cards"
               aria-label="Flashcards Tab"
               onClick={() => handleTabChange("cards")}
               className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-100 cursor-pointer ${getThemeActiveTabClass("cards")}`}
            >
              <ClipboardList size={16} />
              <span className="text-[8px] font-bold font-mono tracking-tighter mt-0.5 uppercase">Cards</span>
            </button>

            {/* Tab 3: Skill Arena */}
            <button
               id="nav-tab-busters"
               aria-label="Arena Tab"
               onClick={() => handleTabChange("busters")}
               className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-100 cursor-pointer ${getThemeActiveTabClass("busters")}`}
            >
              <Gamepad2 size={16} />
              <span className="text-[8px] font-bold font-mono tracking-tighter mt-0.5 uppercase">Arena</span>
            </button>

            {/* Tab 4: AI Teacher */}
            <button
               id="nav-tab-teacher"
               aria-label="AI Coach Tab"
               onClick={() => handleTabChange("teacher")}
               className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-100 cursor-pointer ${getThemeActiveTabClass("teacher")}`}
            >
              <Bot size={16} />
              <span className="text-[8px] font-bold font-mono tracking-tighter mt-0.5 uppercase">AI coach</span>
            </button>

            {/* Tab 5: Progress stats */}
            <button
               id="nav-tab-stats"
               aria-label="Stats Tab"
               onClick={() => handleTabChange("stats")}
               className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-100 cursor-pointer ${getThemeActiveTabClass("stats")}`}
            >
              <LineChart size={16} />
              <span className="text-[8px] font-bold font-mono tracking-tighter mt-0.5 uppercase">Stats</span>
            </button>

            {/* Tab 6: settings & profile */}
            <button
               id="nav-tab-profile"
               aria-label="Profile Tab"
               onClick={() => handleTabChange("profile")}
               className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-100 cursor-pointer ${getThemeActiveTabClass("profile")}`}
            >
              <User size={16} />
              <span className="text-[8px] font-bold font-mono tracking-tighter mt-0.5 uppercase">Profile</span>
            </button>

          </div>
        </nav>

      </div>

      {/* Decorative desktop disclaimer footer */}
      <div className="mt-4 text-center text-[10px] text-stone-400 font-bold max-w-sm">
        <p>BOLO ENGLISH™ • NEO-BRUTALIST EDUCATIONAL PLATFORM</p>
        <p className="font-mono text-[9px] mt-0.5">Designed with absolute symmetry. Craft over Defaults.</p>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <GlobalStateProvider>
      <MainAppContent />
    </GlobalStateProvider>
  );
}
