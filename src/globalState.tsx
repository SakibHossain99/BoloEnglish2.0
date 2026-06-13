import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { Flashcard } from "./types";

// Firebase error diagnostics
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Global user profile state representation
export interface GlobalProfile {
  xp: number;
  currentDay: number;
  streak: number;
  flashcards: any[];
  unlockedBadges: string[];
  isGuest: boolean;
  name: string;
  activeTheme: string;
  currency: number;
  inventory: string[];
  weak_points: {
    literal_immunity: number;
    tense_accuracy: number;
    phonetic_fluency: number;
  };
  level: number;
  lessonsCompleted: number[];
  completedArenaModules: Record<
    string,
    { status: "Completed" | "Active"; timesCleared: number }
  >;
  metrics: {
    literalAttempts: number;
    literalMistakes: number;
    tenseAttempts: number;
    tenseMistakes: number;
    phoneticAttempts: number;
    phoneticSuccesses: number;
    advancedMediaAttempts?: number;
    advancedMediaMistakes?: number;
    advancedCompositionAttempts?: number;
    advancedCompositionMistakes?: number;
  };
}

interface GlobalStateContextType {
  // STRICT REQUIREMENTS (1 & 2)
  xp: number;
  currentDay: number;
  streak: number;
  flashcards: any[];
  currency: number;
  inventory: string[];
  availableChests: number;
  consecutivePerfectLessons: number;
  addXp: (amount: number) => void;
  addFlashcard: (bengaliText: string, englishText: string) => void;
  completeLesson: (earnedXp: number, wrongAttemptsCount: number) => void;
  updateFlashcardSrs: (
    id: number,
    isMastered: boolean,
    nextReviewDate: number,
  ) => void;
  rateCard: (cardId: number, performanceRating: number) => void;
  activeReviewDeck: any[];
  setActiveReviewDeck: React.Dispatch<React.SetStateAction<any[]>>;
  initReviewSession: () => void;
  awardArenaXP: (moduleId: string) => number;
  adjustWeakPoints?: (
    key: "literal_immunity" | "tense_accuracy" | "phonetic_fluency",
    amount: number,
  ) => void;

  openChest: () => string | null;
  buyShopItem: (item: string, cost: number) => boolean;
  consumeItem: (item: string) => boolean;
  evaluateBadges: () => void;
  metrics: {
    literalAttempts: number;
    literalMistakes: number;
    tenseAttempts: number;
    tenseMistakes: number;
    phoneticAttempts: number;
    phoneticSuccesses: number;
    advancedMediaAttempts?: number;
    advancedMediaMistakes?: number;
    advancedCompositionAttempts?: number;
    advancedCompositionMistakes?: number;
  };
  recordMetric: (
    discipline: "literal" | "tense" | "phonetic" | "adv_media" | "adv_composition",
    isSuccess: boolean,
  ) => void;

  // Compatibility properties
  user: any;
  profile: GlobalProfile;
  userProfile?: any;
  loading: boolean;
  isLoading: boolean;
  isGuestMode: boolean;
  isGuestSession: boolean;
  setGuestProfile: (name: string) => void;
  updateUserXp: (amount: number) => Promise<void>;
  addUnlockedFlashcard: (card: Omit<Flashcard, "id">) => Promise<void>;
  advanceDay: (nextDay: number) => Promise<void>;
  updateTheme: (theme: string) => Promise<void>;
  resetAllProgress: () => Promise<void>;
  logoutUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined,
);


export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // STRICT REQUIREMENT 1: Initialize values completely empty
  const [xp, setXp] = useState<number>(0);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [streak, setStreak] = useState<number>(0);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [activeReviewDeck, setActiveReviewDeck] = useState<any[]>([]);

  // GAME ECONOMY STATES
  const [currency, setCurrency] = useState<number>(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [availableChests, setAvailableChests] = useState<number>(0);
  const [consecutivePerfectLessons, setConsecutivePerfectLessons] =
    useState<number>(0);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  // Other compatibility states
  const [activeTheme, setActiveTheme] = useState<string>("default");
  const [name, setName] = useState<string>("Learner");
  const [user, setUser] = useState<any>(null);
  const [isGuestSession, setIsGuestSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const [completedArenaModules, setCompletedArenaModules] = useState<
    Record<string, { status: "Completed" | "Active"; timesCleared: number }>
  >({});
  const [weakPoints, setWeakPoints] = useState({
    literal_immunity: 80,
    tense_accuracy: 85,
    phonetic_fluency: 88,
  });
  const [metrics, setMetrics] = useState({
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
  });

  // Centralized Firestore syncing helpers to push updates securely to live cloud database
  const syncField = (fieldName: string, value: any) => {
    if (auth.currentUser) {
      updateDoc(doc(db, "users", auth.currentUser.uid), { [fieldName]: value }).catch(e => {
        handleFirestoreError(e, OperationType.WRITE, `users/${auth.currentUser?.uid}`);
      });
    }
  };

  const syncFields = (fields: Record<string, any>) => {
    if (auth.currentUser) {
      updateDoc(doc(db, "users", auth.currentUser.uid), fields).catch(e => {
        handleFirestoreError(e, OperationType.WRITE, `users/${auth.currentUser?.uid}`);
      });
    }
  };

  // onAuthStateChanged hook connected directly to standard Firebase Auth lifecycle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsGuestSession(false);

        const userDocRef = doc(db, "users", firebaseUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            // EXPLICIT OVERWRITE BLOCK SHIELD: DO NOT call setDoc or write any starting values
            const existingData = userDocSnap.data();
            setUserProfile(existingData);

            // Fetch and hydrate individual states for comprehensive compliance
            setXp(existingData.xp ?? 0);
            setCurrentDay(existingData.currentDay ?? 1);
            setStreak(existingData.streak ?? 0);
            setCurrency(existingData.currency ?? 0);
            setInventory(existingData.inventory ?? []);
            setUnlockedBadges(existingData.unlockedBadges ?? []);
            setFlashcards(existingData.flashcards ?? []);
            setActiveTheme(existingData.activeTheme ?? "default");
            setName(existingData.name ?? "Learner");
            if (existingData.metrics) {
              const m = existingData.metrics;
              setMetrics({
                literalAttempts: m.literalAttempts ?? 0,
                literalMistakes: m.literalMistakes ?? 0,
                tenseAttempts: m.tenseAttempts ?? 0,
                tenseMistakes: m.tenseMistakes ?? 0,
                phoneticAttempts: m.phoneticAttempts ?? 0,
                phoneticSuccesses: m.phoneticSuccesses ?? 0,
                advancedMediaAttempts: m.advancedMediaAttempts ?? 0,
                advancedMediaMistakes: m.advancedMediaMistakes ?? 0,
                advancedCompositionAttempts: m.advancedCompositionAttempts ?? 0,
                advancedCompositionMistakes: m.advancedCompositionMistakes ?? 0,
              });
            }
            if (existingData.completedArenaModules) {
              setCompletedArenaModules(existingData.completedArenaModules);
            }
          } else {
            // Absolute First-Time Registration Only
            const initialProfile = {
              name: firebaseUser.displayName || "Learner",
              email: firebaseUser.email,
              xp: 0,
              currentDay: 1,
              streak: 0,
              currency: 0,
              inventory: [],
              unlockedBadges: [],
              flashcards: [],
              activeTheme: "default",
              completedArenaModules: {},
              metrics: {
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
              }
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);

            // Hydrate individual states for first-time profile creation
            setXp(0);
            setCurrentDay(1);
            setStreak(0);
            setCurrency(0);
            setInventory([]);
            setUnlockedBadges([]);
            setFlashcards([]);
            setActiveTheme("default");
            setName(firebaseUser.displayName || "Learner");
            setCompletedArenaModules({});
            setMetrics(initialProfile.metrics);
          }
          setIsHydrated(true);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setIsHydrated(false);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Automatic data synchronization engine to push local state modifications directly to the cloud
  useEffect(() => {
    if (!isHydrated || !auth.currentUser) return;

    syncFields({
      xp,
      currentDay,
      streak,
      flashcards,
      currency,
      inventory,
      unlockedBadges,
      completedArenaModules,
      metrics,
      activeTheme,
    });
  }, [
    xp,
    currentDay,
    streak,
    flashcards,
    currency,
    inventory,
    unlockedBadges,
    completedArenaModules,
    metrics,
    activeTheme,
    isHydrated
  ]);


  const recordMetric = (
    discipline: "literal" | "tense" | "phonetic" | "adv_media" | "adv_composition",
    isSuccess: boolean,
  ) => {
    setMetrics((prev) => {
      const copy = { ...prev };
      if (discipline === "literal") {
        copy.literalAttempts += 1;
        if (!isSuccess) {
          copy.literalMistakes += 1;
        }
      } else if (discipline === "tense") {
        copy.tenseAttempts += 1;
        if (!isSuccess) {
          copy.tenseMistakes += 1;
        }
      } else if (discipline === "phonetic") {
        copy.phoneticAttempts += 1;
        if (isSuccess) {
          copy.phoneticSuccesses += 1;
        }
      } else if (discipline === "adv_media") {
        copy.advancedMediaAttempts = (copy.advancedMediaAttempts ?? 0) + 1;
        if (!isSuccess) {
          copy.advancedMediaMistakes = (copy.advancedMediaMistakes ?? 0) + 1;
        }
      } else if (discipline === "adv_composition") {
        copy.advancedCompositionAttempts = (copy.advancedCompositionAttempts ?? 0) + 1;
        if (!isSuccess) {
          copy.advancedCompositionMistakes = (copy.advancedCompositionMistakes ?? 0) + 1;
        }
      }
      return copy;
    });
  };

  const adjustWeakPoints = (
    key: "literal_immunity" | "tense_accuracy" | "phonetic_fluency",
    amount: number,
  ) => {
    setWeakPoints((prev) => ({
      ...prev,
      [key]: Math.min(100, Math.max(0, prev[key] + (Number(amount) || 0))),
    }));
  };

  // STRICT REQUIREMENT 2: State Modifiers (Actions)

  // addXp(amount): Safely adds the passed integer to the current XP.
  const addXp = (amount: number) => {
    setXp((prev) => prev + (Number(amount) || 0));
  };

  // addFlashcard(bengaliText, englishText): Takes two strings and pushes a new object
  // with exact default tracking fields in SM-2 format
  const addFlashcard = (bengaliText: string, englishText: string) => {
    const newCard = {
      id: Date.now() + Math.floor(Math.random() * 1000), // safe offset for rapid sequences
      bengali: bengaliText,
      english: englishText,
      repetitions: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReviewDate: Date.now(),
      isMastered: false,

      // Extended keys for backward compatibility with SRS card view components
      hint: "Practice this natural English equivalent phrase frequently.",
      phonetic: englishText,
      phase: 1,
      familiarity: "new",
    };

    setFlashcards((prev) => {
      // Avoid adding exactly duplicate bengali words card
      if (prev.some((c) => c.bengali.trim() === bengaliText.trim())) {
        return prev;
      }
      return [...prev, newCard];
    });
  };

  const handleDeckCompletionRewards = () => {
    addXp(15);
    setCurrency((prev) => prev + 10);
  };

  const initReviewSession = () => {
    const due = flashcards.filter((card: any) => {
      return !card.nextReviewDate || new Date(card.nextReviewDate) <= new Date();
    });
    setActiveReviewDeck(due);
  };

  // rateCard(cardId, performanceRating): updates card parameters using the strict SM-2 algorithm
  const rateCard = (cardId: number, performanceRating: number) => {
    // 1. Calculate and update the calibrated XP points (+0, +2, +5)
    let rateXp = 0;
    if (performanceRating === 1) rateXp = 0;
    else if (performanceRating === 2) rateXp = 2;
    else if (performanceRating === 3) rateXp = 4;
    else if (performanceRating === 4) rateXp = 5;

    addXp(rateXp);

    // 2. Increment target analytical metrics safely
    setMetrics((prev) => ({
      ...prev,
      literalAttempts: (prev.literalAttempts || 0) + 1,
      literalMistakes: (prev.literalMistakes || 0) + (performanceRating === 1 ? 1 : 0),
    }));

    setFlashcards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          let rep = typeof c.repetitions === "number" ? c.repetitions : 0;
          let ef = typeof c.easeFactor === "number" ? c.easeFactor : 2.5;
          let inter = typeof c.interval === "number" ? c.interval : 1;

          if (performanceRating === 1) {
            rep = 0;
            inter = 1;
            ef = Math.max(1.3, ef - 0.2);
          } else if (performanceRating === 2) {
            rep = rep + 1;
            inter = inter * 1.2;
            ef = Math.max(1.3, ef - 0.15);
          } else if (performanceRating === 3) {
            rep = rep + 1;
            inter = rep === 1 ? 1 : rep === 2 ? 6 : Math.round(inter * ef);
          } else if (performanceRating === 4) {
            rep = rep + 1;
            inter =
              rep === 1 ? 3 : rep === 2 ? 8 : Math.round(inter * ef * 1.3);
            ef = ef + 0.15;
          }

          const nextReviewDateCalculated =
            Date.now() + inter * 24 * 60 * 60 * 1000;
          const isMastered = performanceRating === 4;

          return {
            ...c,
            repetitions: rep,
            easeFactor: ef,
            interval: inter,
            nextReviewDate: nextReviewDateCalculated,
            isMastered,
          };
        }
        return c;
      }),
    );

    // 3. CRITICAL ENGINE PROGRESSION: Update the active local session deck array
    setActiveReviewDeck((prevDeck) => {
      // Filter out the card that was just rated by its unique ID
      const updatedDeck = prevDeck.filter((card) => card.id !== cardId);

      // If the deck length reaches 0, trigger the milestone callback container
      if (updatedDeck.length === 0) {
        handleDeckCompletionRewards();
      }

      return updatedDeck;
    });
  };

  // updateFlashcardSrs (id, isMastered, nextReviewDate): Updates a flashcard based on user reviews
  const updateFlashcardSrs = (
    id: number,
    isMastered: boolean,
    nextReviewDate: number,
  ) => {
    setFlashcards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            isMastered,
            nextReviewDate,
            masteryLevel: isMastered ? 3 : Number(c.masteryLevel || 0) + 1,
            familiarity: isMastered ? "mastered" : "review",
          };
        }
        return c;
      }),
    );
  };

  // completeLesson(): Handle daily gauntlet rewards, dynamic xp, currency, and chests.
  const completeLesson = (earnedXp: number, wrongAttemptsCount: number) => {
    setCurrentDay((prev) => prev + 1);
    setStreak((prev) => prev + 1);

    // Add XP mathematically
    addXp(earnedXp);

    // 10 Bolo Coins & 1 Mystery Chest on every 8-Step Gauntlet clear
    setCurrency((prev) => prev + 10);
    setAvailableChests((prev) => prev + 1);

    // Perfect lesson tracker
    if (wrongAttemptsCount === 0) {
      setConsecutivePerfectLessons((prev) => {
        const next = prev + 1;
        if (next >= 5) {
          evaluateBadges(next, xp + earnedXp, currentDay);
        }
        return next;
      });
    } else {
      setConsecutivePerfectLessons(0);
      evaluateBadges(0, xp + earnedXp, currentDay);
    }
  };

  // Loot box logic
  const openChest = (): string | null => {
    if (availableChests <= 0) return null;

    setAvailableChests((prev) => prev - 1);

    const rand = Math.random();
    let drop = "";

    // Probability Matrix
    // COMMON DROPS (70%)
    if (rand < 0.7) {
      drop = Math.random() < 0.5 ? "streak_freeze" : "mistake_shield";
    }
    // RARE COSMETICS (25%)
    else if (rand < 0.95) {
      drop =
        Math.random() < 0.5 ? "neon_brutalist_theme" : "cyberpunk_dhaka_theme";
    }
    // ULTRA-RARE SOUND PACKS (5%)
    else {
      drop =
        Math.random() < 0.5 ? "ai_mentor_retro_voice" : "ai_mentor_radio_voice";
    }

    setInventory((prev) => [...prev, drop]);
    return drop;
  };

  const buyShopItem = (item: string, cost: number): boolean => {
    if (currency >= cost) {
      setCurrency((prev) => prev - cost);
      setInventory((prev) => [...prev, item]);
      return true;
    }
    return false;
  };

  const consumeItem = (item: string): boolean => {
    const idx = inventory.indexOf(item);
    if (idx !== -1) {
      setInventory((prev) => {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      });
      return true;
    }
    return false;
  };

  const evaluateBadges = (
    perfectCount: number = consecutivePerfectLessons,
    currentXp: number = xp,
    currentRound: number = currentDay,
  ) => {
    setUnlockedBadges((prev) => {
      const copy = [...prev];
      if (perfectCount >= 5 && !copy.includes("SVO Marksman")) {
        copy.push("SVO Marksman");
      }
      if (currentRound >= 7 && !copy.includes("Bonglish Exorcist")) {
        copy.push("Bonglish Exorcist"); // Approximating Phase 1 logic
      }
      if (currentXp >= 500 && !copy.includes("Fluent Overlord")) {
        copy.push("Fluent Overlord");
      }
      return copy;
    });
  };

  const awardArenaXP = (moduleId: string) => {
    const moduleState = completedArenaModules[moduleId] || {
      status: "Active",
      timesCleared: 0,
    };
    let xpToAward = 0;

    if (moduleState.timesCleared === 0) {
      // First-time completion: Award full baseline points
      xpToAward = 50;
      setCompletedArenaModules((prev) => ({
        ...prev,
        [moduleId]: { status: "Completed", timesCleared: 1 },
      }));
    } else {
      // Exploit mitigation: Subsequent attempts yield a negligible review bonus
      xpToAward = 5;
      setCompletedArenaModules((prev) => ({
        ...prev,
        [moduleId]: {
          ...moduleState,
          timesCleared: moduleState.timesCleared + 1,
        },
      }));
    }

    addXp(xpToAward);
    return xpToAward;
  };

  // --- EXTRA COMPATIBILITY BRIDGE MAPPINGS ---
  const profile: GlobalProfile = {
    xp,
    currentDay,
    streak,
    flashcards,
    unlockedBadges,
    currency,
    inventory,
    isGuest: true,
    name,
    activeTheme,
    weak_points: {
      literal_immunity: weakPoints.literal_immunity,
      tense_accuracy: weakPoints.tense_accuracy,
      phonetic_fluency: weakPoints.phonetic_fluency,
    },
    level: xp >= 300 ? 3 : xp >= 100 ? 2 : 1,
    lessonsCompleted: Array.from({ length: currentDay - 1 }, (_, i) => i + 1),
    completedArenaModules,
    metrics,
  };

  const setGuestProfile = (guestName: string) => {
    setName(guestName || "Guest Learner");
    setIsGuestSession(true);
    setUser("Guest");
  };

  const updateUserXp = async (amount: number) => {
    addXp(amount);
  };

  const addUnlockedFlashcard = async (card: Omit<Flashcard, "id">) => {
    const nextFlashcards = [...flashcards, { id: Date.now(), ...card }];
    setFlashcards(nextFlashcards);
    syncField("flashcards", nextFlashcards);
  };

  const advanceDay = async (nextDay: number) => {
    completeLesson(20, 0);
  };

  const updateTheme = async (theme: string) => {
    setActiveTheme(theme);
    syncField("activeTheme", theme);
  };

  const resetAllProgress = async () => {
    setXp(0);
    setCurrentDay(1);
    setStreak(0);
    setFlashcards([]);
    setCompletedArenaModules({});
    setCurrency(0);
    setInventory([]);
    setAvailableChests(0);
    setConsecutivePerfectLessons(0);
    setUnlockedBadges([]);
    setWeakPoints({
      literal_immunity: 80,
      tense_accuracy: 85,
      phonetic_fluency: 88,
    });
    setMetrics({
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
    });
    setActiveTheme("default");
    setName("Learner");

    if (auth.currentUser) {
      const initialProfile = {
        xp: 0,
        currentDay: 1,
        streak: 0,
        currency: 0,
        inventory: [],
        unlockedBadges: [],
        flashcards: [],
        activeTheme: "default",
        name: auth.currentUser?.displayName || "Learner",
        completedArenaModules: {},
        metrics: {
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
        }
      };
      await setDoc(doc(db, "users", auth.currentUser.uid), initialProfile).catch(e => {
        handleFirestoreError(e, OperationType.WRITE, `users/${auth.currentUser?.uid}`);
      });
    }
  };

  const logoutUser = async () => {
    setIsHydrated(false);
    await signOut(auth);
    setIsGuestSession(false);
    setUser(null);
    setUserProfile(null);
    setXp(0);
    setCurrentDay(1);
    setStreak(0);
    setFlashcards([]);
    setCompletedArenaModules({});
    setCurrency(0);
    setInventory([]);
    setAvailableChests(0);
    setConsecutivePerfectLessons(0);
    setUnlockedBadges([]);
    setWeakPoints({
      literal_immunity: 80,
      tense_accuracy: 85,
      phonetic_fluency: 88,
    });
    setMetrics({
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
    });
    setActiveTheme("default");
    setName("Learner");
  };

  const deleteAccount = async () => {
    setIsHydrated(false);
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const currentUser = auth.currentUser;
      try {
        await deleteDoc(doc(db, "users", uid));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${uid}`);
      }
      try {
        await deleteUser(currentUser);
      } catch (err) {
        console.error("Auth deleteUser failed or reauth required:", err);
      }
    }
    setIsGuestSession(false);
    setUser(null);
    setUserProfile(null);
    setXp(0);
    setCurrentDay(1);
    setStreak(0);
    setFlashcards([]);
    setCompletedArenaModules({});
    setCurrency(0);
    setInventory([]);
    setAvailableChests(0);
    setConsecutivePerfectLessons(0);
    setUnlockedBadges([]);
    setWeakPoints({
      literal_immunity: 80,
      tense_accuracy: 85,
      phonetic_fluency: 88,
    });
    setMetrics({
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
    });
    setActiveTheme("default");
    setName("Learner");
  };

  // Combine userProfile state with react state variables for live updating and reactive data synchronization
  const mergedUserProfile = userProfile
    ? {
        ...userProfile,
        name,
        xp,
        currentDay,
        streak,
        currency,
        inventory,
        unlockedBadges,
        metrics,
        completedArenaModules,
        activeTheme,
      }
    : profile;

  const contextValue: GlobalStateContextType = {
    xp,
    currentDay,
    streak,
    flashcards,
    currency,
    inventory,
    availableChests,
    consecutivePerfectLessons,
    addXp,
    addFlashcard,
    completeLesson,
    updateFlashcardSrs,
    rateCard,
    activeReviewDeck,
    setActiveReviewDeck,
    initReviewSession,
    awardArenaXP,
    adjustWeakPoints,
    openChest,
    buyShopItem,
    consumeItem,
    evaluateBadges,
    metrics,
    recordMetric,

    // Compatibility fields
    user,
    profile: mergedUserProfile,
    userProfile: mergedUserProfile,
    loading: isLoading,
    isLoading,
    isGuestMode: isGuestSession,
    isGuestSession,
    setGuestProfile,
    updateUserXp,
    addUnlockedFlashcard,
    advanceDay,
    updateTheme,
    resetAllProgress,
    logoutUser,
    deleteAccount,
  };


  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// STRICT REQUIREMENT 3: Provide a GlobalProvider component
export const GlobalProvider = GlobalStateProvider;

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalState must be used within a GlobalStateProvider or GlobalProvider",
    );
  }
  return context;
};
