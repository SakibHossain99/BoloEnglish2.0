import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useGlobalState } from "../globalState";
import { Sparkles, User, ShieldAlert, CheckCircle, ArrowRight, Compass } from "lucide-react";
import { motion } from "motion/react";

export const LoginScreen: React.FC = () => {
  const { setGuestProfile } = useGlobalState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Guest inputs state
  const [guestName, setGuestName] = useState("");
  const [showGuestForm, setShowGuestForm] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      
      const userCredential = await signInWithPopup(auth, provider);
      setSuccessMsg(`স্বাগতম ${userCredential.user.displayName || "Learner"}! আপনি সফলভাবে প্রবেশ করেছেন।`);
    } catch (err: any) {
      console.error("Google Auth error:", err);
      let userFriendlyErr = err.message || "Google sign in failed.";
      if (err.code === "auth/popup-blocked") {
        userFriendlyErr = "পপআপ উইন্ডোটি ব্লক করা হয়েছে। অনুগ্রহ করে আমাদের সাইটের জন্য পপআপ অনুমতি দিন। (Popup blocked. Please allow popups for this site.)";
      } else if (err.code === "auth/popup-closed-by-user") {
        userFriendlyErr = "পপআপ বন্ধ করা হয়েছে। (Google Login popup was closed before completion.)";
      }
      setErrorMsg(userFriendlyErr);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate entries
    if (!email.includes("@")) {
      setErrorMsg("অনুগ্রহ করে একটি বৈধ ইমেল ঠিকানা লিখুন (Please enter a valid email)");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে (Password must be at least 6 characters)");
      return;
    }

    setAuthLoading(true);
    try {
      if (isRegistering) {
        if (!displayName.trim()) {
          setErrorMsg("অনুগ্রহ করে আপনার নাম দিন (Please enter your name)");
          setAuthLoading(false);
          return;
        }

        // Create fresh Firebase auth account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: displayName.trim()
        });
        setSuccessMsg("অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে! (Account created successfully!)");
      } else {
        // Dynamic Fallthrough: attempt sign-in, if user does not exist, run registration automatically
        try {
          await signInWithEmailAndPassword(auth, email, password);
          setSuccessMsg("স্বাগতম! আপনি সফলভাবে লগইন করেছেন। (Welcome back!)");
        } catch (signInErr: any) {
          // If user does not exist or invalid credentials, fallback to create user
          if (signInErr.code === "auth/user-not-found" || signInErr.code === "auth/invalid-credential") {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const fallbackName = displayName.trim() || email.split("@")[0] || "Learner";
            await updateProfile(userCredential.user, {
              displayName: fallbackName
            });
            setSuccessMsg("অ্যাকাউন্টটি স্বয়ংক্রিয়ভাবে তৈরি হয়েছে! (Account auto-created successfully!)");
          } else {
            throw signInErr;
          }
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Clean up common Firebase error strings
      let userFriendlyErr = err.message || "An authentication error occurred.";
      if (err.code === "auth/email-already-in-use") {
        userFriendlyErr = "এই ইমেলটি ইতিপূর্বে ব্যবহার করা হয়েছে। (This email is already registered.)";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        userFriendlyErr = "ভুল ইমেল বা পাসওয়ার্ড। (Incorrect credentials. Check input spelling.)";
      } else if (err.code === "auth/user-not-found") {
        userFriendlyErr = "এই ঠিকানায় কোনো অ্যাকাউন্ট নেই। (No account found for this email.)";
      }
      setErrorMsg(userFriendlyErr);
    } finally {
      setAuthLoading(false);
    }
  };


  const startGuestSession = (e: React.FormEvent) => {
    e.preventDefault();
    const finalGuestName = guestName.trim() || "Guest Learner";
    setGuestProfile(finalGuestName);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#0F172A] relative overflow-hidden">
      
      {/* Decorative Neo-Brutalist Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#F59E0B] border-4 border-[#0F172A] -z-10 shadow-[4px_4px_0px_#0F172A] rotate-3 hidden md:block" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#7C3AED] border-4 border-[#0F172A] -z-10 shadow-[6px_6px_0px_#0F172A] -rotate-6 hidden md:block animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border-4 border-[#0F172A] p-8 shadow-[8px_8px_0px_#0F172A] relative"
      >
        {/* Banner header badge */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white border-2 border-[#0F172A] px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest shadow-[2px_2px_0px_#0F172A]">
          Bolo English! 🇧🇩 ➜ 🇬🇧
        </div>

        {/* Branding header */}
        <div className="text-center mt-4 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight select-none">
            বলো <span className="bg-[#F59E0B] px-1.5 py-0.5 border-2 border-[#0F172A] inline-block shadow-[2px_2px_0px_#0F172A] rotate-1">English</span>
          </h1>
          <p className="mt-4 text-sm text-[#0F172A] font-medium opacity-80 leading-relaxed">
            Transitioning Bengali speakers to fluent English. Out of the blue, say goodbye to translations in your head!
          </p>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="mb-6 bg-[#FEF2F2] border-2 border-[#EF4444] p-3 text-xs text-[#991B1B] flex items-start gap-2.5 shadow-[2px_2px_0px_#EF4444] font-mono animate-shake">
            <ShieldAlert className="w-5 h-5 text-[#EF4444] shrink-0" />
            <div>{errorMsg}</div>
          </div>
        )}

        {/* Success notification banner */}
        {successMsg && (
          <div className="mb-6 bg-[#F0FDF4] border-2 border-[#22C55E] p-3 text-xs text-[#166534] flex items-start gap-2.5 shadow-[2px_2px_0px_#22C55E] font-mono">
            <CheckCircle className="w-5 h-5 text-[#22C55E] shrink-0" />
            <div>{successMsg}</div>
          </div>
        )}

        {!showGuestForm ? (
          /* FORM AUTHENTICATION */
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {isRegistering && (
              <div>
                <label className="block text-xs font-mono font-bold uppercase mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> নাম (Your Name)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sohel Rana"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#FAFAF9] border-2 border-[#0F172A] px-3.5 py-2.5 text-sm outline-none focus:bg-amber-50 focus:ring-2 focus:ring-[#7C3AED] transition-all font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1">
                ইমেল ঠিকানা (Email Address)
              </label>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAFAF9] border-2 border-[#0F172A] px-3.5 py-2.5 text-sm outline-none focus:bg-amber-50 focus:ring-2 focus:ring-[#7C3AED] transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1">
                পাসওয়ার্ড (Password)
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="•••••• (At least 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAFAF9] border-2 border-[#0F172A] px-3.5 py-2.5 text-sm outline-none focus:bg-amber-50 focus:ring-2 focus:ring-[#7C3AED] transition-all font-mono"
              />
            </div>

            {/* BUTTON TRIGGERS */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#7C3AED] text-white border-2 border-[#0F172A] py-3.5 font-bold uppercase text-sm tracking-wide shadow-[4px_4px_0px_#0F172A] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-100 cursor-pointer flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>প্রক্রিয়াকরণ হচ্ছে... (Please Wait)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>{isRegistering ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "অ্যাকাউন্টে প্রবেশ করুন"}</span>
                </>
              )}
            </button>

            {/* GOOGLE SIGN IN OPTION */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="flex-grow border-t-2 border-dashed border-[#0F172A] opacity-40"></div>
              <span className="flex-shrink mx-4 text-xs font-mono font-bold uppercase text-[#0F172A] opacity-60">অথবা (Or)</span>
              <div className="flex-grow border-t-2 border-dashed border-[#0F172A] opacity-40"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full bg-white text-[#0F172A] border-2 border-[#0F172A] py-3 font-bold uppercase text-xs tracking-wide shadow-[4px_4px_0px_#0F172A] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-100 cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.61a5.66 5.66 0 0 1-2.45 3.71v3.08h3.95c2.31-2.13 3.63-5.27 3.63-8.62z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.95-3.08c-1.1.74-2.51 1.18-3.98 1.18-3.07 0-5.67-2.08-6.6-4.88H1.35v3.18A11.99 11.99 0 0 0 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.4 14.31a7.16 7.16 0 0 1 0-2.62V8.51H1.35a11.99 11.99 0 0 0 0 6.98l4.05-3.18z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.93 11.93 0 0 0 12 0c-4.41 0-8.24 2.42-10.22 5.96l4.05 3.18c.93-2.8 3.53-4.88 6.6-4.88z"
                />
              </svg>
              <span>গুগল দিয়ে প্রবেশ করুন (Sign in with Google)</span>
            </button>

            {/* TOGGLE REGISTRATION VIEW */}
            <div className="pt-2 text-center text-xs">
              <span className="opacity-70">
                {isRegistering ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "কোনো অ্যাকাউন্ট নেই?"}
              </span>{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setErrorMsg(null);
                }}
                className="underline font-bold text-[#7C3AED] hover:text-[#0F172A] transition-colors"
              >
                {isRegistering ? "এখানে লগইন করুন (Login Here)" : "এখানে অ্যাকাউন্ট খুলুন (Register Here)"}
              </button>
            </div>
          </form>
        ) : (
          /* CONTINUE AS GUEST GATEGAY */
          <form onSubmit={startGuestSession} className="space-y-4">
            <div className="bg-[#FEFCE8] border-2 border-[#F59E0B] p-3 text-xs mb-4 text-[#78350F] leading-normal font-mono rounded">
              ⚠️ গেস্ট মোডে আপনার প্রোগ্রেস ব্রাউজার ক্যাশে থাকবে। ক্যাশ পরিষ্কার করলে ডেটা হারিয়ে যাবে।
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#F59E0B]" /> আপনার নাম দিন (Guest Nickname)
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Guest Learner"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-[#FAFAF9] border-2 border-[#0F172A] px-3.5 py-2.5 text-sm outline-none focus:bg-amber-50 focus:ring-2 focus:ring-[#7C3AED] transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F59E0B] text-[#0F172A] border-2 border-[#0F172A] py-3.5 font-bold uppercase text-sm tracking-wide shadow-[4px_4px_0px_#0F172A] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-100 cursor-pointer flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>গেস্ট হিসেবে প্রবেশ করুন</span>
            </button>

            <div className="pt-2 text-center text-xs">
              <button
                type="button"
                onClick={() => setShowGuestForm(false)}
                className="underline font-bold text-[#7C3AED]"
              >
                ইমেল দিয়ে লগইন-এ ফিরে যান (Back to Email Login)
              </button>
            </div>
          </form>
        )}

        {/* SECONDARY GUEST SELECTION */}
        {!showGuestForm && (
          <div className="mt-6 border-t-2 border-dashed border-[#0F172A] pt-4">
            <button
              type="button"
              onClick={() => {
                setShowGuestForm(true);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="w-full bg-white text-[#0F172A] border-2 border-[#0F172A] py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#FAFAF9] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>গেস্ট হিসেবে চালিয়ে যান (Continue as Guest)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
