import React, { useState, useRef, useEffect } from "react";
import { playSound } from "./AudioPlayer";
import { useGlobalState } from "../globalState";
import { Mic, Send, Bot, User, Volume2, Sparkles, AlertCircle, RefreshCw, AudioLines } from "lucide-react";

export const AiTeacherTab: React.FC = () => {
  const { profile, updateUserXp } = useGlobalState();
  const [messages, setMessages] = useState<Array<{ role: "user" | "model"; content: string }>>([
    {
      role: "model",
      content: "Assalamu Alaikum! Amar shob bondhura! 🇧🇩✨ I am your **Bolo English AI Teacher**.\n\nMy primary code is to polish your English syntax and save you from literal translations. \n\nTry talking or typing to me! What do you want to practice? Or press the **glowing Orange microphone** to practice oral speaking."
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micVolume, setMicVolume] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recIntervalRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    playSound("click");

    const payloadMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(payloadMessages);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages })
      });

      if (!response.ok) {
        throw new Error("API call returned failure status");
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: "model" as const, content: data.text }]);
      
      // Award XP for conversing! Use small motivator
      await updateUserXp(20);

      playSound("success");
    } catch (err) {
      console.error(err);
      // Give fallback mock explanation
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: "model" as const,
            content: "Oops, my network server is having a tiny hiccup, but let me help you as your localized coach! \n\nRemember, in spoken English, don't say *'I didn't went'* ❌. Always use the base verb after 'did not': **'I didn't go'** ✅.\n\nAsk me another question!"
          }
        ]);
        setLoading(false);
      }, 800);
      return;
    } finally {
      setLoading(false);
    }
  };

  // Simulate Speak Recording loop
  const handleToggleRecord = () => {
    playSound("beep");
    if (isRecording) {
      setIsRecording(false);
      if (recIntervalRef.current) clearInterval(recIntervalRef.current);
      setMicVolume(0);
      
      // Construct speech text mock translation
      const textCollected = [
        "My cold is looking good",
        "Olpo joler mach likes to eat cigarettes",
        "I graduated Dhaka University since 2024",
        "Assalamu Alaikum, kemon achen?",
        "Please help me, my head is rotating"
      ];
      const randomRecordedSpeech = textCollected[Math.floor(Math.random() * textCollected.length)];
      
      // Send as chat message!
      handleSendMessage(randomRecordedSpeech);
    } else {
      setIsRecording(true);
      
      // Simulate input voice volume oscillation
      recIntervalRef.current = setInterval(() => {
        setMicVolume(Math.floor(Math.random() * 80) + 20);
      }, 100);

      // Timeout safety cut
      setTimeout(() => {
        if (isRecording) handleToggleRecord();
      }, 6000);
    }
  };

  useEffect(() => {
    return () => {
      if (recIntervalRef.current) clearInterval(recIntervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Teacher Instructions Badging */}
      <div className="bg-[#EDE9FE] neo-border rounded-xl p-4 neo-shadow-sm flex items-start space-x-3 border-2 border-stone-800">
        <Bot size={28} className="text-[#7C3AED] shrink-0 mt-1" />
        <div className="space-y-1">
          <h4 className="font-display font-black text-xs text-[#7C3AED] uppercase tracking-wide">
            Supportive Bilingual Mentor instructions
          </h4>
          <p className="text-[11px] text-[#4A4455] leading-relaxed">
            I correct bad literal translations (যেমন: <em>"Cold is looking"</em> ❌), adjust SOV syntax flips, and polish Bengali phonetic habits (such as V vs B, silent H). Speak freely!
          </p>
        </div>
      </div>

      {/* Main Pulse Avatar & Visual Voice Control Area */}
      <div className="bg-white p-6 rounded-2xl neo-border neo-shadow flex flex-col items-center justify-center text-center py-8 relative">
        <div className="absolute top-4 left-4 flex space-x-1 items-center bg-stone-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-stone-500 neo-border-sm">
          <Sparkles size={10} className="text-[#F59E0B]" />
          <span>Gemini 3.5 AI Core</span>
        </div>

        {/* Pulsing avatar */}
        <div className="mb-6 relative">
          <div className={`w-24 h-24 rounded-full bg-[#7C3AED] flex items-center justify-center neo-border text-white transition-all ${
            isRecording ? "pulse-avatar scale-110" : "hover:scale-105"
          }`}>
            {isRecording ? <AudioLines size={36} className="text-white" /> : <Bot size={40} className="text-white" />}
          </div>
          
          {/* Wave indicator */}
          {isRecording && (
            <span className="absolute -bottom-2 bg-[#F59E0B] text-[#0F172A] text-[9px] font-mono font-black px-2 py-0.5 rounded-full neo-border-sm tracking-wide animate-pulse">
              MIC ACTIVE {micVolume}%
            </span>
          )}
        </div>

        <div className="space-y-1 mb-4">
          <h3 className="font-display font-black text-lg">
            {isRecording ? "Listening to your Speech..." : "Practice Oral Fluency"}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {isRecording 
              ? "Press the button again to terminate and translate your recording into text instantly!" 
              : "Tap the neon orange button to speak out loud. Speak English or Bengali."}
          </p>
        </div>

        {/* Microphone action button */}
        <button
          id="push-to-talk-btn"
          onClick={handleToggleRecord}
          className={`p-5 rounded-full neo-border neo-shadow-sm transition-transform neo-button-push cursor-pointer ${
            isRecording 
              ? "bg-red-500 text-white" 
              : "bg-[#F59E0B] text-white hover:bg-[#F59E0B]/90 animate-bounce-slow"
          }`}
        >
          <Mic size={28} />
        </button>

        {/* Volume visual bar indicator */}
        {isRecording && (
          <div className="w-full max-w-xs bg-stone-100 h-2 rounded mt-4 overflow-hidden neo-border-sm">
            <div 
              className="bg-red-500 h-full transition-all duration-100" 
              style={{ width: `${micVolume}%` }}
            />
          </div>
        )}
      </div>

      {/* Suggested Chat Prompt Chips */}
      <div className="space-y-2">
        <span className="text-[10px] text-stone-500 font-black uppercase tracking-wider block">
          Speech practicing topics (Tap to trigger):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Hello Mentor! 👋",
            "What is 'My head is rotating'?",
            "What is 'Olpo joler mach' in English?",
            "Translate 'আমি ঠান্ডা লেগেছে'",
            "I have an IT Interview tomorrow! Help 💼"
          ].map((topic, i) => (
            <button
              key={i}
              id={`mock-prompt-chip-${i}`}
              onClick={() => handleSendMessage(topic)}
              className="bg-[#FAFAF9] hover:bg-stone-100 neo-border-sm text-stone-800 text-xs px-3 py-1.5 rounded-lg font-mono font-bold transition-all text-left cursor-pointer"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Text Dialog Box */}
      <div className="bg-white neo-border rounded-xl p-4 neo-shadow-sm flex flex-col h-[320px]">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <span className="text-[10px] text-[#7C3AED] font-black uppercase tracking-widest flex items-center">
            <Volume2 size={12} className="mr-1" /> Active Chat Logs
          </span>
          {loading && (
            <span className="text-[10px] font-bold text-stone-400 flex items-center animate-pulse">
              <RefreshCw size={10} className="animate-spin mr-1" /> Gemini thinking...
            </span>
          )}
        </div>

        {/* Scrollable messages container */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role !== "user" && (
                <div className="bg-[#7C3AED] p-1 rounded neo-border-sm text-white shrink-0 font-bold">
                  <Bot size={14} />
                </div>
              )}
              
              <div className={`p-2.5 rounded-xl max-w-[85%] neo-border-sm text-[11.5px] leading-relaxed font-semibold ${
                msg.role === "user" 
                  ? "bg-[#D1FAE5] text-[#065F46] rounded-tr-none text-right font-mono" 
                  : "bg-stone-50 text-[#0F172A] rounded-tl-none whitespace-pre-line"
              }`}>
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="bg-[#10B981] p-1 rounded neo-border-sm text-white shrink-0 font-bold">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Form Inputs send text */}
        <div className="flex space-x-2 pt-2 border-t border-stone-200">
          <input
            id="chat-text-input"
            type="text"
            placeholder="Type your translation query in English or Bengali..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
            className="flex-1 px-3 py-2 bg-stone-50 rounded-lg neo-border-sm text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#7C3AED]"
          />
          <button
            id="send-chat-btn"
            onClick={() => handleSendMessage(inputText)}
            className="p-2 bg-[#7C3AED] text-white rounded-lg neo-border-sm transition-transform neo-button-push cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
