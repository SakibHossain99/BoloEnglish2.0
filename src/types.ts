export interface UserProfile {
  name: string;
  isGuest: boolean;
  xp: number;
  streak_count: number;
  level: number;
  weak_points: {
    literal_immunity: number; // percentage (0-100)
    tense_accuracy: number; // percentage (0-100)
    phonetic_fluency: number; // percentage (0-100)
  };
  badges: Array<{
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    icon: string;
  }>;
  unlockedThemes: string[];
  activeTheme: string;
  microphoneCalibration: number; // range (0-100)
  reminderTime: string; // HH:MM AM/PM
  streakFreezeActive: boolean;
  accentFilterEnabled: boolean;
  consecutiveDays: boolean[]; // last 7 days tracker
  lessonsCompleted: number[]; // Day numbers completed
}

export interface DailyLesson {
  day: number;
  phase: number; // 1, 2, or 3
  phaseTitle: string;
  title: string;
  explanation: string;
  nativeTranslationMistake: string; // The bad literal habit
  bengaliTranslation: string;
  correctSituationUsage: string; // Idiomatic fix
  phoneticTip: string;
  interactiveChallenge: {
    prompt: string;
    bengaliPrompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  wordsUnlocked: Array<{ bengali: string; english: string; hint: string; phonetic: string }>;
}

export interface Flashcard {
  id: string;
  bengali: string;
  english: string;
  hint: string;
  phonetic: string;
  phase: number;
  familiarity?: "new" | "review" | "mastered";
}

export interface IdiomBuster {
  bengali: string; // e.g. "মাথা ঘুরছে"
  literalMistake: string; // e.g. "My head is spinning/turning"
  correctEnglish: string; // e.g. "I feel dizzy"
  contextExplanation: string; // why it fails and how to say it
  phoneticHint: string;
  audioCalibrationText: string;
}
