import { DailyLesson, Flashcard, IdiomBuster } from "./types";

// Curated 90-Day Plan Highlights and Dynamic generator for other days
export const phaseData = [
  { id: 1, title: "Phase 1: Breaking Literal Habit & Phonetic Tuning", days: "Days 1-30" },
  { id: 2, title: "Phase 2: Contextual Survival & Socializing", days: "Days 31-60" },
  { id: 3, title: "Phase 3: Career and Professional Fluency", days: "Days 61-90" }
];

export const staticLessons: DailyLesson[] = [
  {
    day: 1,
    phase: 1,
    phaseTitle: "Breaking Literal Habits & Phonetic Tuning",
    title: "Say Goodbye to 'My Cold is Looking'",
    explanation: "In Bengali, we say 'আমার ঠান্ডা লেগেছে' (Amar thhonda legeche). If you translate this literally, you get 'My cold is looking' or 'cold has caught'. It confuses native speakers!",
    nativeTranslationMistake: "My cold is looking",
    bengaliTranslation: "আমার ঠান্ডা লেগেছে",
    correctSituationUsage: "I have a cold / I've caught a cold",
    phoneticTip: "Say 'cold' with a clear 'ld' end consonant. Don't omit the 'd'!",
    interactiveChallenge: {
      prompt: "You notice someone sneezing and want to say you caught a cold. Select the correct phrase:",
      bengaliPrompt: "আপনি হাঁচি দিচ্ছেন এবং বলতে চান আপনার ঠান্ডা লেগেছে। সঠিক বাক্যটি নির্বাচন করুন:",
      options: [
        "My cold is looking since morning.",
        "I have a cold and coughing.",
        "I have caught a cold.",
        "Cold has caught me today."
      ],
      correctIndex: 2,
      explanation: "'I have caught a cold' or 'I have a cold' is the natural, idiomatic way to express this."
    },
    wordsUnlocked: [
      { bengali: "ঠান্ডা লেগেছে", english: "Caught a cold", hint: "I caught a cold last night.", phonetic: "kaat-uh-kold" },
      { bengali: "হাঁচি দেওয়া", english: "Sneeze", hint: "Cover your mouth when you sneeze.", phonetic: "sneez" }
    ]
  },
  {
    day: 2,
    phase: 1,
    phaseTitle: "Breaking Literal Habits & Phonetic Tuning",
    title: "Quit 'Eating' Blows and Cigarettes!",
    explanation: "In Bengali, we 'eat' almost everything! We eat water (জল খাওয়া), eat cigarettes (সিগারেট খাওয়া), and eat beats/blows (মার খাওয়া). In English, 'eat' is strictly for solid foods!",
    nativeTranslationMistake: "Eat a cigarette / Eat a beating",
    bengaliTranslation: "সিগারেট খাওয়া / মার খাওয়া",
    correctSituationUsage: "Smoke a cigarette / Get beaten up (or get a scolding)",
    phoneticTip: "The 'S-M' sound in 'Smoke' starts as a soft hiss. Don't add an extra 'i' vowel initially (say 'smoke', not 'is-moke').",
    interactiveChallenge: {
      prompt: "Your colleague is heading outside. Identify the grammatically correct intention:",
      bengaliPrompt: "আপনার সহকর্মী বাইরে যাচ্ছেন। ব্যাকরণগতভাবে সঠিক বাক্যটি নির্বাচন করুন:",
      options: [
        "He is going to eat a water.",
        "He is going to drink some water.",
        "He is going to eat a cigarette.",
        "He is going to eat a fresh air."
      ],
      correctIndex: 1,
      explanation: "Liquids are 'drunk', cigarettes are 'smoked', and fresh air is 'taken/enjoyed' in English!"
    },
    wordsUnlocked: [
      { bengali: "ধূমপান করা", english: "Smoke a cigarette", hint: "Would you like to smoke?", phonetic: "smowk-uh-si-guh-ret" },
      { bengali: "জল পান করা", english: "Drink water", hint: "Always drink water from clean cups.", phonetic: "drink-wah-ter" }
    ]
  },
  {
    day: 5,
    phase: 1,
    phaseTitle: "Breaking Literal Habits & Phonetic Tuning",
    title: "Conquering 'Head Spinning' & Vertigo",
    explanation: "When you feel dizzy, saying 'My head is turning' (মাথা ঘুরছে) is technically understandable, but saying 'I feel dizzy' is far more native and polished.",
    nativeTranslationMistake: "My head is turning/rotating",
    bengaliTranslation: "আমার মাথা ঘুরছে",
    correctSituationUsage: "I feel dizzy / I'm feeling lightheaded",
    phoneticTip: "The word 'dizzy' uses a soft 'z' sound. Avoid pronouncing it with a 'j' sound like 'dig-gy'.",
    interactiveChallenge: {
      prompt: "You stood up too quickly and feel weak. How do you tell your doctor?",
      bengaliPrompt: "আপনি খুব দ্রুত উঠে দাঁড়িয়ে পড়েছেন এবং শরীর খারাপ লাগছে। ডাক্তারকে কীভাবে বলবেন?",
      options: [
        "My head is rotating very fast.",
        "I am feeling dizzy.",
        "My brain is turning around.",
        "I am dizzying my head."
      ],
      correctIndex: 1,
      explanation: "'I am feeling dizzy' is safe and grammatically correct."
    },
    wordsUnlocked: [
      { bengali: "মাথা ঘুরছে / মাথা ঝিমঝিম", english: "Dizzy / Lightheaded", hint: "I felt dizzy after the ride.", phonetic: "diz-ee / lyte-hed-ed" }
    ]
  },
  // Phase 2 Days
  {
    day: 31,
    phase: 2,
    phaseTitle: "Contextual Survival & Socializing",
    title: "The IT Interview: Introducing Yourself",
    explanation: "When recruiters ask you to introduce yourself, avoid launching with 'I am passed from Y college' or 'Myself Rohit'. Use polished passive verbs indicating graduate completion.",
    nativeTranslationMistake: "I am passed from Y college / Myself...",
    bengaliTranslation: "আমি ওয়াই কলেজ থেকে পাশ করেছি",
    correctSituationUsage: "I graduated from Y College / Rohit here, representing...",
    phoneticTip: "Focus on the end sound 'ted' in 'graduated'. Let your vocal cords vibrate slightly.",
    interactiveChallenge: {
      prompt: "Complete this introduction to an interviewer: 'Good morning, my name is Anis, and I...'",
      bengaliPrompt: "সাক্ষাৎকারগ্রহীতার কাছে বর্ণনাটি পূরণ করুন: 'Good morning, my name is Anis, and I...'",
      options: [
        "...was passed out from Dhaka University inside 2024.",
        "...graduated from Dhaka University in 2024.",
        "...am passed candidate of Dhaka University in 2024.",
        "...myself passed Dhaka University."
      ],
      correctIndex: 1,
      explanation: "Combining 'graduated' with the year of completion is clean, native, and industry standard."
    },
    wordsUnlocked: [
      { bengali: "স্নাতক সম্পন্ন করা", english: "Graduated", hint: "I graduated with a computer systems degree.", phonetic: "grad-yoo-ay-ted" },
      { bengali: "ডিগ্রি অর্জন করা", english: "Hold a degree", hint: "I hold a degree in engineering.", phonetic: "howld-uh-di-gree" }
    ]
  },
  {
    day: 35,
    phase: 2,
    phaseTitle: "Contextual Survival & Socializing",
    title: "Polite Reminders on WhatsApp",
    explanation: "Texting client partners 'Give me reply now' or 'Do it fast' sounds aggressive in English culture. Soften your demands using polite, modal auxiliary verbs.",
    nativeTranslationMistake: "Do it now / Send update fast",
    bengaliTranslation: "এখনই কাজটা করে দিন",
    correctSituationUsage: "Could you please update me? / When can I expect a response?",
    phoneticTip: "The words 'could' and 'would' contain a silent 'l'. Say 'kood' and 'wood'.",
    interactiveChallenge: {
      prompt: "You need a status response update from an outsourced designer. Draft a modern, polite slack text:",
      bengaliPrompt: "আউটসোর্স করা ডিজাইনারের কাছে কাজের অগ্রগতি জানতে চান। একটি আধুনিক ও বিনয়ী মেসেজ বাছুন:",
      options: [
        "Send design update fastly, I am waiting.",
        "Give me status of illustration immediately.",
        "Could you please share a quick update when you have a moment?",
        "Why you are not replying?"
      ],
      correctIndex: 2,
      explanation: "'Could you please share...' is gentle, professional, and gets faster responses in global workplaces."
    },
    wordsUnlocked: [
      { bengali: "অগ্রগতি / আপডেট", english: "Share a quick update", hint: "Could you share a quick update?", phonetic: "sheyr-uh-kwik-ap-deyt" }
    ]
  },
  // Phase 3 Days
  {
    day: 61,
    phase: 3,
    phaseTitle: "Career and Professional Fluency",
    title: "Salary Negotiation: Know Your Worth",
    explanation: "Avoid asking 'How much money will you give me?' or saying 'My salary request is 50,000 taka'. Elevate your professional standing with strategic business vocabulary.",
    nativeTranslationMistake: "What money will you give me? / I want Y salary",
    bengaliTranslation: "আমাকে কত বেতন দিবেন? / আমার ওয়াই বেতন লাগবে",
    correctSituationUsage: "I am expecting a compensation package in the range of...",
    phoneticTip: "Say 'compensation' as 'com-pen-SA-shun' emphasizing the third syllable.",
    interactiveChallenge: {
      prompt: "An HR lead asks for your wage expectations. Say it with confidence and professional vocabulary:",
      bengaliPrompt: "এইচআর আপনার কাছে বেতনের প্রত্যাশা জানতে চাইল। কীভাবে পেশাদারভাবে উত্তর দেবেন?",
      options: [
        "Give me as much money as you give to seniors.",
        "I am looking for X salary, give me Y benefits also.",
        "My salary expectation is flexible but I want Y.",
        "Based on my skills, I am expecting a compensation package in the range of..."
      ],
      correctIndex: 3,
      explanation: "'compensation package in the range of' shifts focus from just cash bills to high-value skilled evaluation."
    },
    wordsUnlocked: [
      { bengali: "বেতন প্যাকেজ", english: "Compensation package", hint: "They offered a generous compensation package.", phonetic: "kom-pen-sey-shun" },
      { bengali: "যোগ্যতা / মূল্য", english: "Valued contribution", hint: "This reflects my valued contribution to the team.", phonetic: "val-yood-kon-tri-byoo-shun" }
    ]
  }
];

// Fallback dynamic lesson generator so user can click any day in 90-day map
export function getLessonForDay(day: number): DailyLesson {
  const match = staticLessons.find(l => l.day === day);
  if (match) return match;

  // Otherwise generate custom day content safely
  let phase = 1;
  let phaseTitle = "Breaking Literal Habits & Phonetic Tuning";
  if (day > 60) {
    phase = 3;
    phaseTitle = "Career and Professional Fluency";
  } else if (day > 30) {
    phase = 2;
    phaseTitle = "Contextual Survival & Socializing";
  }

  const generatedLessons: Record<number, Partial<DailyLesson>> = {
    3: {
      title: "Taking 'Gently' a Leave",
      explanation: "In Bengali, we say 'আমি আসি' (I am coming) when leaving a room. If you say 'I am coming' as you wave goodbye, English speakers will wait around, expecting you to return in seconds!",
      nativeTranslationMistake: "I am coming (when leaving)",
      correctSituationUsage: "I'll take my leave now / See you later / I'm heading out",
      phoneticTip: "Say 'leave' with a long 'ee' vowel sound, not like 'live'!",
      interactiveChallenge: {
        prompt: "You are leaving a dinner party at a friend's house. What should you say?",
        bengaliPrompt: "বন্ধুর বাড়ি থেকে বিদায় নিচ্ছেন। কী বলবেন?",
        options: [
          "I am coming, see you brother.",
          "I will eat and come back again.",
          "I'll take my leave now. Thanks for having me!",
          "I am going from here."
        ],
        correctIndex: 2,
        explanation: "'I'll take my leave' or 'I'm heading out' makes elegant work of farewell exits."
      }
    },
    10: {
      title: "The Mystery of 'Free' (No Cost vs IdleTime)",
      explanation: "Bengali speakers often say 'When will you be free?' to mean 'When are you unoccupied?'. Sometimes writing WhatsApp messages like 'Are you free today?' sounds like you are offering discount services. Alternatively, mixing 'empty' (খালি) to mean unoccupied is standard.",
      nativeTranslationMistake: "Are you empty right now?",
      correctSituationUsage: "Are you available? / Do you have a moment?",
      phoneticTip: "A clear double-vowel on 'free'. Let the air exit unobstructed.",
      interactiveChallenge: {
        prompt: "Schedule a chat with your manager politely. Choose the most effective subject opener:",
        bengaliPrompt: "ম্যানেজারকে কথোপকথনের অনুরোধ পাঠান:",
        options: [
          "When you will be empty today?",
          "Are you free or busy?",
          "Do you have a few minutes to connect today?",
          "Reply me when your time has space."
        ],
        correctIndex: 2,
        explanation: "'Do you have a few minutes to connect' is highly professional and respects executive calendars."
      }
    }
  };

  const override = generatedLessons[day] || {
    title: `Day ${day}: Mastering Conversational Confidence`,
    explanation: `Welcome to Day ${day}! Today we're refining key sentence layouts for active daily usage. Building on lessons from Phase ${phase}, you are training your internal ear to recognize Bengali translation slips naturally.`,
    nativeTranslationMistake: "Direct translation patterns",
    correctSituationUsage: "Clean English equivalents with situational focus",
    phoneticTip: "Speak slowly, separating syllables clearly. Keep pronunciation confident!",
    interactiveChallenge: {
      prompt: `Choose the correct, natural sentence for Phase ${phase} practice today:`,
      bengaliPrompt: "আজকের জন্য সঠিক বাক্যটি চিহ্নিত করুন:",
      options: [
        "I am doing my work very beautifully.",
        "I am executing this task diligently.",
        "My work is running perfectly.",
        "I am passing my hours doing work."
      ],
      correctIndex: 1,
      explanation: "The word 'diligent' represents professional work ethics, matching native speaking conventions."
    }
  };

  return {
    day,
    phase,
    phaseTitle,
    title: override.title || `Day ${day} Fluency Drill`,
    explanation: override.explanation || "",
    nativeTranslationMistake: override.nativeTranslationMistake || "Direct Bengali rendering",
    bengaliTranslation: override.bengaliTranslation || "বাংলা অনুবাদ",
    correctSituationUsage: override.correctSituationUsage || "Polite equivalent",
    phoneticTip: override.phoneticTip || "Focus on pronunciation dynamics.",
    interactiveChallenge: override.interactiveChallenge || {
      prompt: "Identify the correct native English variant:",
      bengaliPrompt: "সঠিক রূপটি চিহ্নিত করুন:",
      options: ["Incorrect 1", "Correct English option", "Incorrect 3", "Incorrect 4"],
      correctIndex: 1,
      explanation: "This displays superior sentence styling!"
    },
    wordsUnlocked: override.wordsUnlocked || [
      { bengali: "ধৈর্য", english: "Patience", hint: "Learning English takes patience.", phonetic: "pey-shuns" }
    ]
  };
}

// Initial default Flashcards deck loaded for first-time session (Anki-Style)
export const initialFlashcards: Flashcard[] = [
  {
    id: "fc1",
    bengali: "মাথা ঘুরছে",
    english: "I feel dizzy / lightheaded",
    hint: "Literal translation 'head turning' is rare or sounds odd.",
    phonetic: "I feel diz-ee",
    phase: 1,
    familiarity: "new"
  },
  {
    id: "fc2",
    bengali: "আমার ঠান্ডা লেগেছে",
    english: "I have a cold / I caught a cold",
    hint: "Literal translation 'my cold is looking' is wrong.",
    phonetic: "I catch uh kold",
    phase: 1,
    familiarity: "new"
  },
  {
    id: "fc3",
    bengali: "সিগারেট খাওয়া / মার খাওয়া",
    english: "Smoke a cigarette / Get beaten up",
    hint: "In English we NEVER 'eat' non-foods.",
    phonetic: "smoke uh si-guh-ret",
    phase: 1,
    familiarity: "new"
  },
  {
    id: "fc4",
    bengali: "আমি ঢাকা বিশ্ববিদ্যালয় থেকে পাশ করেছি",
    english: "I graduated from Dhaka University",
    hint: "Avoid writing 'I passed from Dhaka University'.",
    phonetic: "grad-yoo-ay-ted",
    phase: 2,
    familiarity: "review"
  },
  {
    id: "fc5",
    bengali: "অল্প জলের মাছ",
    english: "A small fry",
    hint: "Refers to an insignificant or low-capability figure.",
    phonetic: "uh smol fry",
    phase: 1,
    familiarity: "new"
  },
  {
    id: "fc6",
    bengali: "আমাকে একটু সাহায্য করুন",
    english: "Could you lend me a hand?",
    hint: "A polite native idiom, warmer than 'Help me now'.",
    phonetic: "lend mee a hand",
    phase: 2,
    familiarity: "new"
  },
  {
    id: "fc7",
    bengali: "আকাশ কুসুম কল্পনা",
    english: "Build castles in the air",
    hint: "An elegant proverb representing unreal daydreams.",
    phonetic: "bild kas-els in the ayr",
    phase: 3,
    familiarity: "new"
  }
];

// 12 Classic Bengali Idiom Busters representing Phase 1 habit corrections
export const epicIdiomBusters: IdiomBuster[] = [
  {
    bengali: "মাথা ঘুরছে (Matha ghurchhe)",
    literalMistake: "My head is rotating / My head is spinning around",
    correctEnglish: "I feel dizzy / I am feeling lightheaded",
    contextExplanation: "Saying 'My head is rotating' sounds like your physical neck is spinning 360 degrees like an owl! Say 'I feel dizzy' instead.",
    phoneticHint: "Say 'dizzy' with a buzzing 'zz' vibration, not 'dig-gy'.",
    audioCalibrationText: "I am feeling extremely dizzy today"
  },
  {
    bengali: "আমার জল তেষ্টা পেয়েছে (Amar jol testa peyeche)",
    literalMistake: "My water thirst is searching me",
    correctEnglish: "I am thirsty / I need some water",
    contextExplanation: "Water thirst isn't a person executing search queries. Simply declare 'I am thirsty' to sound native.",
    phoneticHint: "Thirsty features English soft 'th' (gently press tongue under teeth).",
    audioCalibrationText: "I am very thirsty could I get water"
  },
  {
    bengali: "অল্প জলের মাছ (Olpo joler mach)",
    literalMistake: "Fish of small/shallow water",
    correctEnglish: "A small fry",
    contextExplanation: "In English, a 'small fry' refers directly to minors, low-ranking officials, or small figures in business.",
    phoneticHint: "Say 'small' with soft 's', avoiding traditional Bengali 'sh-mall'.",
    audioCalibrationText: "He is just a small fry in our sector"
  },
  {
    bengali: "ভাত খাওয়া (Bhat khaowa)",
    literalMistake: "Eating rice",
    correctEnglish: "Having lunch / Having dinner",
    contextExplanation: "English speakers don't state the specific crop they are consuming. Say 'I am having lunch', even if that lunch is indeed rice and daal!",
    phoneticHint: "Having uses a clear breathed 'H' (expel air like fogging glass).",
    audioCalibrationText: "Let's meet up and have lunch together"
  },
  {
    bengali: "মার খাওয়া (Mar khaowa)",
    literalMistake: "Eating beating / Eating blows",
    correctEnglish: "Get beaten up / Get scolded / Face consequences",
    contextExplanation: "No one literally swallows or chews punches. 'To get a beating' or 'to get scolded' is the correct formulation.",
    phoneticHint: "Consequences reads as 'con-seh-kwen-sez'.",
    audioCalibrationText: "I will get scolded if I arrive late"
  },
  {
    bengali: "বিনা মেঘে বজ্রপাত (Bina meghe bojropat)",
    literalMistake: "Thunderbolt from non-cloud situations",
    correctEnglish: "A bolt from the blue / Out of the blue",
    contextExplanation: "Out of the blue refers to clean blue skies presenting sudden lightning. It matches perfectly!",
    phoneticHint: "Blue uses a round 'ooo' sound, not short clipped vowels.",
    audioCalibrationText: "This invitation arrived out of the blue"
  },
  {
    bengali: "গাছের গোড়ায় জল ঢালা (Gachher goray jol dhala)",
    literalMistake: "Pouring water on the tree roots",
    correctEnglish: "To secure the foundation / To waste energy trying to heal",
    contextExplanation: "Often refers idiomatic context to investing in relationships early. 'To strike at the root' or 'nourish the core'.",
    phoneticHint: "Foundation is pronounced 'fownd-ay-shun'.",
    audioCalibrationText: "We must secure the foundation of our company"
  }
];
