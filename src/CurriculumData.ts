export interface DeconstructionStep {
  type: "deconstruction";
  title: string;
  explanation: string;
  vocab: Array<{
    bengali: string;
    english: string;
    phonetic: string;
    description: string;
  }>;
}

export interface ContrastiveStep {
  type: "contrastive";
  title: string;
  instruction: string;
  sentenceBengali: string;
  sentenceEnglish: string;
  phonetic: string;
  audioSimulationText: string;
}

export interface CognitiveStep {
  type: "cognitive";
  title: string;
  prompt: string;
  bengaliPrompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MasteryStep {
  type: "mastery";
  title: string;
  prompt: string;
  scrambledOptions: string[];
  correctSequence: string[];
  explanation: string;
}

export type LessonStep = DeconstructionStep | ContrastiveStep | CognitiveStep | MasteryStep;

export interface CurriculumDay {
  day: number;
  title: string;
  phaseTitle: string;
  steps: LessonStep[];
}

export const CurriculumData: CurriculumDay[] = [
  {
    day: 1,
    title: "SVO Word Order Shockwave (বাক্য গঠনের আসল নিয়ম)",
    phaseTitle: "Day 1: Subject + Verb + Object Rule",
    steps: [
      {
        type: "deconstruction",
        title: "Stage 1: Concept Deconstruction",
        explanation: "আজকে আপনার মনের বাংলা চিন্তাকে ইংরেজিতে রূপান্তরের প্রথম বৈপ্লবিক ধাক্কাটি লাগবে! বাংলায় আমরা বলি: 'গরু ঘাস খায়' (Subject = গরু, Object = ঘাস, Action = খায়)। এটি হল SOV নিয়ম।\n\nকিন্তু ইংরেজিতে নিয়মটি একেবারে উল্টো! ইংরেজিতে Action শব্দটি বাক্যকে মাঝখান দিয়ে দুইভাগে কেটে ফেলে। এটি হল SVO নিয়ম: Subject (কর্তা) + Action (ক্রিয়া) + Object (কর্ম)। অর্থাৎ আপনাকে চিন্তা করতে হবে: 'গরু খায় ঘাস' (Cow eats grass)।\nআসুন আজকে এই ৩টি প্রধান শব্দ ভালো করে স্পেলিং ও উচ্চারণ সহ আত্মস্থ করি:",
        vocab: [
          { bengali: "গরু", english: "Cow", phonetic: "কাউ", description: "একটি গৃহপালিত চতুস্পদ প্রাণী।" },
          { bengali: "ঘাস", english: "Grass", phonetic: "গ্রাস", description: "মাটির সবুজ ঘাস।" },
          { bengali: "খায়", english: "Eats", phonetic: "ইটস", description: "কোনো খাবার গ্রহণ করার কাজ।" }
        ]
      },
      {
        type: "contrastive",
        title: "Stage 2: High-Context Contrastive Learning",
        instruction: "নিচের বাক্যটি উচ্চারণ করুন এবং খেয়াল করুন কীভাবে বাংলায় ক্রিয়াশেষে বসে কিন্তু ইংরেজিতে মাঝখানে split তৈরি করে:",
        sentenceBengali: "গরু ঘাস খায়।",
        sentenceEnglish: "Cow eats grass.",
        phonetic: "কাউ ইটস গ্রাস",
        audioSimulationText: "Cow eats grass"
      },
      {
        type: "mastery",
        title: "Stage 3: Word Sorting Drill",
        prompt: "Assemble the basic SVO phrase for: 'গরু ঘাস খায়।'",
        scrambledOptions: ["grass.", "eats", "Cow"],
        correctSequence: ["Cow", "eats", "grass."],
        explanation: "চমত্কার! Subject (Cow) + Action (eats) + Object (grass) অনুযায়ী সাজিয়েছেন।"
      },
      {
        type: "cognitive",
        title: "Stage 4: Auditory Structure Verification",
        prompt: "Choose the correct option representing the spoken English structure for 'গরু ঘাস খায়':",
        bengaliPrompt: "নিচের কোন গঠনটি সঠিক SVO প্যাটার্ন অনুসরণ করছে?",
        options: [
          "Cow eats grass.",
          "Cow grass eats.",
          "Grass eats cow.",
          "Eats cow grass."
        ],
        correctIndex: 0,
        explanation: "নির্ভুল! 'Cow grass eats' আক্ষরিক বাংলা অনুবাদ (Bonglish) যা সম্পূর্ণ ভুল। ইংরেজিতে অ্যাকশনটি অবশ্যই মাঝখানে বসবে।"
      },
      {
        type: "cognitive",
        title: "Stage 5: Contextual Action Insertion",
        prompt: "Fill in the blank: 'The animal ___ (খায়) the plants.'",
        bengaliPrompt: "সঠিক স্থানে সঠিক ক্রিয়াপদ যুক্ত করুন:",
        options: [
          "grass",
          "eats",
          "cow",
          "eating"
        ],
        correctIndex: 1,
        explanation: "সঠিক! Subject-এর পরে ক্রিয়া (eats) বসেছে।"
      },
      {
        type: "cognitive",
        title: "Stage 6: Error Correction Challenge",
        prompt: "Identify and correct the deep structural error in: 'The cow green grass eats.'",
        bengaliPrompt: "ভুলটি চিহ্নিত করুন এবং সংশোধন করুন:",
        options: [
          "It is completely correct.",
          "The adjective 'green' belongs after grass.",
          "The verb 'eats' must be shifted to the middle, before the object 'green grass'.",
          "The sentence needs no correction."
        ],
        correctIndex: 2,
        explanation: "চমত্কার দূরদর্শিতা! আক্ষরিক অনুবাদের টানে ক্রিয়াপদ 'eats' শেষে পাঠানো যাবে না। মাঝখানেই বসাতে হবে।"
      },
      {
        type: "cognitive",
        title: "Stage 7: SVO Mental Parser Test",
        prompt: "Now translate: 'আমি ঘাস খাই' (I = আমি, eat = খাই, grass = ঘাস):",
        bengaliPrompt: "SVO নিয়মে সঠিক অনুবাদটি বেছে নিন:",
        options: [
          "I grass eat.",
          "Grass I eat.",
          "I eat grass.",
          "Eat I grass."
        ],
        correctIndex: 2,
        explanation: "চমত্কার! আমি (Subject: I) + খাই (Action: eat) + ঘাস (Object: grass)।"
      },
      {
        type: "mastery",
        title: "Stage 8: The Mastery Lock - Logic Variation",
        prompt: "Assemble the variation to prove your mastery: 'আমি ঘাস খাই'",
        scrambledOptions: ["grass.", "eat", "I"],
        correctSequence: ["I", "eat", "grass."],
        explanation: "অভিনন্দন! আপনি প্রথম দিনের SVO ওয়ার্ড অর্ডার চ্যালেঞ্জ পুরোপুরি জয় করেছেন!"
      }
    ]
  },
  {
    day: 2,
    title: "Singular Modifier Shockwave (কাজের রূপ পরিবর্তন)",
    phaseTitle: "Day 2: Subject-Verb Singular Customization",
    steps: [
      {
        type: "deconstruction",
        title: "Stage 1: Concept Deconstruction",
        explanation: "আজকে আমরা ইংরেজি ব্যাকরণের সবচেয়ে বড় বিভ্রান্তি দূর করব—একক সাবজেক্টের সাথে ভার্বের রূপ পরিবর্তন!\n\nবাংলায় আমরা বলি: 'ছেলেটি দৌড়ায়' এবং 'ছেলেরা দৌড়ায়'। লক্ষ্য করুন, দুই জায়গাতেই 'দৌড়ায়' শব্দটি অপরিবর্তিত।\nকিন্তু ইংরেজিতে single (একক) ব্যক্তি বা বস্তুর ক্ষেত্রে ক্রিয়ার শেষে একটি অতিরিক্ত 's' অথবা 'es' যুক্ত করতে হয় (যেমন- 'The boy runs')। কিন্তু বহুবচনের ক্ষেত্রে ভার্বের কোনো প্রকার পরিবর্তন হয় না! (যেমন- 'They run')। একেই বলে থার্ড পারসন সিঙ্গুলার অ্যাঙ্কর।",
        vocab: [
          { bengali: "ছেলেটি", english: "The boy", phonetic: "দ্য বয়", description: "একক বালক।" },
          { bengali: "তারা / ছেলেরা", english: "They / The boys", phonetic: "দেই / দ্য বয়েজ", description: "বহুবচন।" },
          { bengali: "দৌড়ানো", english: "Run / Runs", phonetic: "রান / রানস", description: "পায়ে হেঁটে দ্রুত যাওয়া।" }
        ]
      },
      {
        type: "contrastive",
        title: "Stage 2: High-Context Contrastive Learning",
        instruction: "নিচের বাক্যজোড়াটি মনোযোগ দিয়ে পড়ুন। খেয়াল করুন কীভাবে একক ছেলের ক্ষেত্রে 'runs' এবং একের অধিক ছেলের ক্ষেত্রে 'run' বসেছে:",
        sentenceBengali: "ছেলেটি দৌড়ায় এবং তারা দৌড়ায়।",
        sentenceEnglish: "The boy runs and they run.",
        phonetic: "দ্য বয় রানস অ্যান্ড দেই রান",
        audioSimulationText: "The boy runs and they run"
      },
      {
        type: "mastery",
        title: "Stage 3: Word Sorting Drill",
        prompt: "Assemble: 'ছেলেটি দৌড়ায়' (The boy runs)",
        scrambledOptions: ["runs.", "boy", "The"],
        correctSequence: ["The", "boy", "runs."],
        explanation: "চমত্কার! 'The boy' একক সাবজেক্ট হওয়ায় আপনি 'runs' ব্যবহার করেছেন।"
      },
      {
        type: "cognitive",
        title: "Stage 4: Auditory Structure Verification",
        prompt: "Select the correct expression for 'তারা দৌড়ায়':",
        bengaliPrompt: "বহুবচনের সঠিক ভার্ব ফরমটি নির্বাচন করুন:",
        options: [
          "They runs.",
          "They run.",
          "They running.",
          "They are runs."
        ],
        correctIndex: 1,
        explanation: "অনবদ্য! 'They' বহুবচন হওয়ায় যুক্ত হয়েছে সাধারণ ভার্ব 'run'।"
      },
      {
        type: "cognitive",
        title: "Stage 5: Contextual Action Insertion",
        prompt: "Fill in the blank: 'My father ___ (পছন্দ করে) coffee.' (like = পছন্দ করা)",
        bengaliPrompt: "বাবা একক ব্যক্তি, তাই সঠিক ভার্ব ফর্মটি বসান:",
        options: [
          "like",
          "likes",
          "liking",
          "to like"
        ],
        correctIndex: 1,
        explanation: "খুব ভালো! বাবা (My father) একক ব্যক্তি হওয়ায় 'likes' বসেছে।"
      },
      {
        type: "cognitive",
        title: "Stage 6: Error Correction Challenge",
        prompt: "Correct this sentence: 'The teachers runs to the class.'",
        bengaliPrompt: "শিক্ষকগণ বহুবচন, ভুলটি কোথায় নির্ণয় করুন:",
        options: [
          "The sentence is completely correct.",
          "It should be 'The teachers run to the class.' (No s/es for plural).",
          "It should be 'The teacher run.'",
          "Teachers does run."
        ],
        correctIndex: 1,
        explanation: "দারুণ! বহুবচন (The teachers) সাবজেক্ট হলে মূল ভার্ব 'run' হবে, 'runs' নয়।"
      },
      {
        type: "cognitive",
        title: "Stage 7: SVO Mental Parser Test",
        prompt: "Translate 'সে বই পড়ে' (He = সে, read/reads = পড়ে, a book = একটি বই):",
        bengaliPrompt: "সিঙ্গুলার মডিফায়ার ও SVO একযোগে পরীক্ষা করুন:",
        options: [
          "He read a book.",
          "He book reads.",
          "He reads a book.",
          "He reading book."
        ],
        correctIndex: 2,
        explanation: "চমত্কার! 'He' একক হওয়ায় 'reads' বসেছে এবং তা সাবজেক্টের পরেই বসেছে।"
      },
      {
        type: "mastery",
        title: "Stage 8: The Mastery Lock - Logic Variation",
        prompt: "Assemble the plural variation: 'তারা বই পড়ে' (They read books)",
        scrambledOptions: ["books.", "read", "They"],
        correctSequence: ["They", "read", "books."],
        explanation: "অসাধারণ! আপনি সিঙ্গুলার মডিফায়ার শক পুরোদমে শুষে নিয়েছেন!"
      }
    ]
  },
  {
    day: 3,
    title: "Anti-Literal Ownership Trap (মালিকানা প্রকাশের আসল ভঙ্গি)",
    phaseTitle: "Day 3: I have vs My have",
    steps: [
      {
        type: "deconstruction",
        title: "Stage 1: Concept Deconstruction",
        explanation: "আজকে আমরা সবচেয়ে বড় ও ভয়াবহ 'Bonglish' ভুলটি দূর করব—মালিকানা প্রকাশ বা Ownership Trap!\n\nবাংলায় আমরা বলি: 'আমার একটি গরু আছে'। এখন আপনি যদি শব্দে শব্দে আক্ষরিক অনুবাদ করেন: 'আমার' = 'My', 'আছে' = 'have'। তাহলে বাক্যটি হবে: 'My have a cow.' যা সম্পূর্ণ ভুল ইংরেজি!\nইংরেজিতে অধিকার বুঝাতে 'আমার' শব্দটির জায়গায় সাবজেক্টিভ প্রোনাউন 'I' ব্যবহার করতে হয়: 'I have a cow' (আমি অধিকার করি একটি গরু)। মনে রাখবেন, 'My' শব্দটি একা বসতে পারে না, তার সাথে কোনো নাউন থাকতে হয় (যেমন: My sister)।",
        vocab: [
          { bengali: "আমার আছে", english: "I have", phonetic: "আই হ্যাভ", description: "নিজের অধিকারে কোনো কিছু থাকা।" },
          { bengali: "তার আছে", english: "He has / She has", phonetic: "হি হ্যাজ / শি হ্যাজ", description: "একক অন্য কারও অধিকারে থাকা।" },
          { bengali: "আমাদের আছে", english: "We have", phonetic: "উই হ্যাভ", description: "নিজেদের অধিকারে থাকা।" }
        ]
      },
      {
        type: "contrastive",
        title: "Stage 2: High-Context Contrastive Learning",
        instruction: "নিচের বাক্যজোড়াটি পড়ুন এবং বুঝুন কেন সাবজেক্টে 'My' না হয়ে 'I' ব্যবহৃত হয়েছে:",
        sentenceBengali: "আমার একটি ক্যাট আছে এবং তার একটি ক্যাট আছে।",
        sentenceEnglish: "I have a cat and he has a cat.",
        phonetic: "আই হ্যাভ আ ক্যাট অ্যান্ড হি হ্যাজ আ ক্যাট",
        audioSimulationText: "I have a cat and he has a cat"
      },
      {
        type: "mastery",
        title: "Stage 3: Word Sorting Drill",
        prompt: "Assemble correctly: 'আমার একটি গরু আছে' (I have a cow.)",
        scrambledOptions: ["have", "cow.", "I", "a"],
        correctSequence: ["I", "have", "a", "cow."],
        explanation: "দুর্দান্ত! 'My' বাদ দিয়ে 'I have' ব্যবহার করে আক্ষরিক অনুবাদের ফাঁদ এড়িয়েছেন।"
      },
      {
        type: "cognitive",
        title: "Stage 4: Auditory Structure Verification",
        prompt: "Select the correct transition for 'আমার একটি কলম আছে' (pen = কলম):",
        bengaliPrompt: "সঠিক ইংরেজি মালিকানা বাক্যটি বেছে নিন:",
        options: [
          "My have a pen.",
          "I have a pen.",
          "My pen has.",
          "I having a pen."
        ],
        correctIndex: 1,
        explanation: "উৎকৃষ্ট! 'I have a pen' হল একমাত্র ব্যাকরণসম্মত রূপ।"
      },
      {
        type: "cognitive",
        title: "Stage 5: Contextual Action Insertion",
        prompt: "Fill in the blank: 'Rahim ___ (আছে) a gold medallion.'",
        bengaliPrompt: "করিম/রহিম একক ব্যক্তি, তাই Singular ownership modifier (has/have) দিন:",
        options: [
          "have",
          "has",
          "is have",
          "having"
        ],
        correctIndex: 1,
        explanation: "চমত্কার! Third Person Singular থাকার কারণে 'has' যুক্ত হয়েছে।"
      },
      {
        type: "cognitive",
        title: "Stage 6: Error Correction Challenge",
        prompt: "Correct this literal translation: 'My have a big house in Dhaka.'",
        bengaliPrompt: "'My have' সংশোধন করে প্রফেশনাল বাক্য তৈরি করুন:",
        options: [
          "My has a big house in Dhaka.",
          "Mine have a big house in Dhaka.",
          "I have a big house in Dhaka.",
          "I having a big house in Dhaka."
        ],
        correctIndex: 2,
        explanation: "অনবদ্য! 'My have' সম্পূর্ণ ভুল, সঠিক হল 'I have'।"
      },
      {
        type: "cognitive",
        title: "Stage 7: SVO Mental Parser Test",
        prompt: "Translate 'আমাদের একটি বাগান আছে' (We = আমরা/আমাদের, have = আছে, a garden = একটি বাগান):",
        bengaliPrompt: "আমাদের আছে এর জন্য 'Our have' নাকি 'We have' বসবে??",
        options: [
          "Our have a garden.",
          "Our has a garden.",
          "We have a garden.",
          "Garden we have."
        ],
        correctIndex: 2,
        explanation: "একেবারে নিখুঁত! 'Our have' ভুল, সঠিক হল 'We have a garden'।"
      },
      {
        type: "mastery",
        title: "Stage 8: The Mastery Lock - Logic Variation",
        prompt: "Assemble: 'আমাদের একটি বাগান আছে'",
        scrambledOptions: ["garden.", "We", "a", "have"],
        correctSequence: ["We", "have", "a", "garden."],
        explanation: "প্রশংসনীয়! আপনি মালিকানার আক্ষরিক অনুবাদের ফাঁদ সম্পূর্ণ চূর্ণ করেছেন!"
      }
    ]
  },
  {
    day: 4,
    title: "The Question Inversion Puzzle (প্রশ্ন করার চমৎকার নিয়ম)",
    phaseTitle: "Day 4: Questions using Do & Does Rule",
    steps: [
      {
        type: "deconstruction",
        title: "Stage 1: Concept Deconstruction",
        explanation: "ইংরেজিতে প্রশ্ন করার চমৎকার কৌশলটি আজ আমরা আয়ত্ত করব—Inversion বা বাক্যের শুরুতে সাহায্যকারী শব্দ বসানো!\n\nবাংলায় আমরা কেবল গলার সুর উঁচিয়ে বা বাক্যের মাঝে 'কি' দিয়ে প্রশ্ন করি: 'তুমি ভাত খাও?' বা 'তুমি কি ভাত খাও?'।\nকিন্তু ইংরেজিতে সাধারণ বাক্যের আগে 'Do' অথবা 'Does' বসাতে হয়। যেমন- 'You eat rice' (তুমি ভাত খাও) এর আগে 'Do' বসিয়ে করলেই প্রশ্ন তৈরি হয়ে যায়: 'Do you eat rice?'। আর সাবজেক্ট সিঙ্গুলার (He, She) হলে 'Does' বসে এবং মূল ভার্বের শেষের 's/es' বিলুপ্ত হয়ে যায়! যেমন: 'Does he run?'",
        vocab: [
          { bengali: "তুমি কি করছো", english: "Do you", phonetic: "ডু ইউ", description: "কাউকে কোনো প্রশ্ন করা।" },
          { bengali: "সে কি করছে", english: "Does he / Does she", phonetic: "ডাজ হি / ডাজ শি", description: "একক অন্য কাউকেও প্রশ্ন করা।" },
          { bengali: "পছন্দ করা", english: "Like", phonetic: "লাইк", description: "কোনো কিছু ভালো লাগা।" }
        ]
      },
      {
        type: "contrastive",
        title: "Stage 2: High-Context Contrastive Learning",
        instruction: "মনোযোগ দিয়ে লক্ষ্য করুন কীভাবে প্রশ্ন তৈরিতে 'Do' ও 'Does' ব্যবহৃত হয়েছে এবং 'Does'-এর কারণে ভার্বের 's' বিলুপ্ত হয়েছে:",
        sentenceBengali: "তুমি কি গরুটি পছন্দ করো এবং সে কি গরুটি পছন্দ করে?",
        sentenceEnglish: "Do you like the cow and does he like the cow?",
        phonetic: "ডু ইউ লাইক দ্য কাউ অ্যান্ড ডাজ হি লাইক দ্য কাউ",
        audioSimulationText: "Do you like the cow and does he like the cow"
      },
      {
        type: "mastery",
        title: "Stage 3: Word Sorting Drill",
        prompt: "Construct the question phrase: 'তুমি কি গরুটি পছন্দ করো?'",
        scrambledOptions: ["cow?", "like", "Do", "the", "you"],
        correctSequence: ["Do", "you", "like", "the", "cow?"],
        explanation: "অভিনন্দন! প্রশ্ন তৈরির SVO প্রশ্নের রূপটি সঠিকভাবে সাজিয়েছেন।"
      },
      {
        type: "cognitive",
        title: "Stage 4: Auditory Structure Verification",
        prompt: "Select the correct transition for 'তুমি কি আমাকে পছন্দ করো?':",
        bengaliPrompt: "নিচের সঠিক প্রশ্নের রূপটি চিহ্নিত করুন:",
        options: [
          "You like me do?",
          "Do you like me?",
          "Like you me do?",
          "Do you me like?"
        ],
        correctIndex: 1,
        explanation: "অনবদ্য! প্রশ্ন করার জন্য বাক্যের শুরুতে 'Do you' আবশ্যক।"
      },
      {
        type: "cognitive",
        title: "Stage 5: Contextual Action Insertion",
        prompt: "Fill in the blank: '___ he play football?'",
        bengaliPrompt: "সাবজেক্ট 'he' সিঙ্গুলার হওয়ায় সঠিক সাহায্যকারী ভার্বটি দিন:",
        options: [
          "Do",
          "Does",
          "Is",
          "Doing"
        ],
        correctIndex: 1,
        explanation: "অসাধারণ! 'He' একক হওয়ায় প্রশ্নের শুরুতে 'Does' বসবে।"
      },
      {
        type: "cognitive",
        title: "Stage 6: Error Correction Challenge",
        prompt: "Spot the error in this question: 'Does he likes the book?'",
        bengaliPrompt: "সাহায্যকারী 'Does' থাকলে মূল ভার্বে 's' থাকবে কি?",
        options: [
          "The sentence is completely correct.",
          "It should be 'Does he like the book?' (Drop 's' from likes when 'Does' is present).",
          "It should be 'Do he likes...'",
          "Like does he book."
        ],
        correctIndex: 1,
        explanation: "চমত্কার দূরদর্শিতা! 'Does'-এর ভেতর অলরেডি 's/es' থাকায় মূল ভার্ব 'like' হবে, 'likes' নয়।"
      },
      {
        type: "cognitive",
        title: "Stage 7: SVO Mental Parser Test",
        prompt: "Identify the correct question structure for 'তারা কি দৌড়ায়?':",
        bengaliPrompt: "তারা (They) বহুবচন, প্রশ্ন কীভাবে করবেন?",
        options: [
          "Does they run?",
          "Do they runs?",
          "Do they run?",
          "They run do?"
        ],
        correctIndex: 2,
        explanation: "খুব ভালো! বহুবচন হওয়ায় 'Do they run?' হবে।"
      },
      {
        type: "mastery",
        title: "Stage 8: The Mastery Lock - Logic Variation",
        prompt: "Assemble: 'সে কি দৌড়ায়?' (Does he run?)",
        scrambledOptions: ["run?", "Does", "he"],
        correctSequence: ["Does", "he", "run?"],
        explanation: "অসামান্য পারফরম্যান্স! আপনি সাহায্যকারী ইনভার্সন মেকানিজম সফলভাবে আয়ত্ত করেছেন!"
      }
    ]
  },
  {
    day: 5,
    title: "My and Your Possessives (আমার এবং তোমার বিশেষণ)",
    phaseTitle: "Day 5: Adjective Possessives (My & Your)",
    steps: [
      {
        type: "deconstruction",
        title: "Stage 1: Concept Deconstruction",
        explanation: "আজকে আমরা শিখব কীভাবে কোনো ব্যক্তি বা বস্তুর ওপর আমাদের বা অন্যের অধিকার বোঝানো যায় বিশেষণ রূপে—মডিফায়ার পজিশন!\n\nবাংলায় আমরা বলি: 'আমার বন্ধু' বা 'তোমার ভাই'। ইংরেজিতে 'আমার' = 'My' এবং 'তোমার' = 'Your'। এই শব্দ দুটিকে পজেসিভ অ্যাডজেক্টিভ বা মডিফায়ার বলা হয়। এগুলো সবসময় নাউনের ঠিক আগে বসে তাকে মডিফাই করে (যেমন: My friend, Your brother)। এগুলো কখনও সেন্টেন্সে একা একা ভার্ব ছাড়া বা অবজেক্ট ছাড়া দাঁড়াতে পারে না।",
        vocab: [
          { bengali: "আমার", english: "My", phonetic: "মাই", description: "নিজের অধিকারে থাকা কিছু।" },
          { bengali: "তোমার", english: "Your", phonetic: "ইউর", description: "অন্য কারো অধিকারে থাকা কিছু।" },
          { bengali: "বন্ধু / ভাই", english: "Friend / Brother", phonetic: "ফ্রেন্ড / ব্রাদার", description: "কাছের মানুষ বা আত্মীয়।" }
        ]
      },
      {
        type: "contrastive",
        title: "Stage 2: High-Context Contrastive Learning",
        instruction: "বাক্যটি খুব মনোযোগ দিয়ে রিডিং করুন এবং বুঝুন কীভাবে ‘my’ ও ‘your’ যথাক্রমে ‘friend’ ও ‘brother’-কে মডিফাই করছে:",
        sentenceBengali: "আমার বন্ধু তোমার বড় ভাই।",
        sentenceEnglish: "My friend is your big brother.",
        phonetic: "মাই ফ্রেন্ড ইজ ইউর বিগ ব্রাদার",
        audioSimulationText: "My friend is your big brother"
      },
      {
        type: "mastery",
        title: "Stage 3: Word Sorting Drill",
        prompt: "Form: 'আমার বন্ধু তোমার বড় ভাই।' (My friend is your big brother.)",
        scrambledOptions: ["your", "is", "My", "brother.", "friend", "big"],
        correctSequence: ["My", "friend", "is", "your", "big", "brother."],
        explanation: "দুর্দান্ত অ্যাসেম্বলি! মডিফায়ার ও নাউন পাশাপাশি নিখুঁতভাবে অববস্থান করছে।"
      },
      {
        type: "cognitive",
        title: "Stage 4: Auditory Structure Verification",
        prompt: "Select the correct sentence for 'তোমার বাড়িটি অনেক বড়' (house = বাড়ি, very big = অনেক বড়):",
        bengaliPrompt: "তোমার (Your) এর সঠিক অবস্থান এবং বাক্যটির গঠন নির্বাচন করুন:",
        options: [
          "Your house is very big.",
          "You house is very big.",
          "Is very big your house.",
          "Your big very house is."
        ],
        correctIndex: 0,
        explanation: "চমত্কার! 'Your house' (তোমার বাড়ি) এখানে সাবজেক্ট ফ্রেজ হিসেবে এসেছে।"
      },
      {
        type: "cognitive",
        title: "Stage 5: Contextual Action Insertion",
        prompt: "Fill in the blank: 'I see ___ sister.' (আমি তোমার বোনকে দেখি)",
        bengaliPrompt: "তোমার বোন বুঝাতে শূন্যস্থানে কী বসবে?",
        options: [
          "you",
          "your",
          "yours",
          "you are"
        ],
        correctIndex: 1,
        explanation: "নিখুঁত! বোন (sister) নাউনের আগে পজেসিভ মডিফায়ার হিসেবে 'your' বসেছে।"
      },
      {
        type: "cognitive",
        title: "Stage 6: Error Correction Challenge",
        prompt: "Identify the mistake in this sentence: 'Me brother like your cow.'",
        bengaliPrompt: "আমার বড় ভাই বুঝাতে 'Me brother' বসালে কি সঠিক হবে?",
        options: [
          "Me brother should be My brother.",
          "your cow should be you cow.",
          "like should be liking.",
          "No mistake."
        ],
        correctIndex: 0,
        explanation: "চমত্কার! 'আমার ভাই' বুঝাতে পজেসিভ অ্যাডজেক্টিভ 'My brother' হবে, অবজেক্ট প্রোনাউন 'Me' এর ব্যবহার অসম্ভব।"
      },
      {
        type: "cognitive",
        title: "Stage 7: SVO Mental Parser Test",
        prompt: "Choose the proper translation for 'তোমার বন্ধু আমার গরু দেখে।':",
        bengaliPrompt: "SVO এবং মডিফায়ার একসাথে লক্ষ্য করুন:",
        options: [
          "Your friend see my cow.",
          "Your friend sees my cow.",
          "You friend sees my cow.",
          "My cow sees your friend."
        ],
        correctIndex: 1,
        explanation: "চমত্কার! 'Your friend' থার্ড পারসন সিঙ্গুলার হওয়ায় ভার্বের শেষে 'sees' বসেছে।"
      },
      {
        type: "mastery",
        title: "Stage 8: The Mastery Lock - Logic Variation",
        prompt: "Assemble: 'তোমার বন্ধু আমার বোনকে দেখে' (Your friend sees my sister.)",
        scrambledOptions: ["sister.", "Your", "my", "friend", "sees"],
        correctSequence: ["Your", "friend", "sees", "my", "sister."],
        explanation: "অসামান্য! আপনি পজেসিভ ওয়ার্ড রিড এবং অ্যালাইনমেন্ট অত্যন্ত সফলভাবে আয়ত্ত করেছেন!"
      }
    ]
  }
];

// Fallback search
export function getCurriculumForDay(day: number): CurriculumDay {
  const normalizedDay = day > 5 ? ((day - 1) % 5) + 1 : day;
  const match = CurriculumData.find(c => c.day === normalizedDay);
  let baseLesson: CurriculumDay;
  
  if (match) {
    baseLesson = {
      ...match,
      day: day,
      phaseTitle: day >= 61
        ? `Phase 3: Academic Expression & Conjunctions (Day ${day})`
        : day >= 31
          ? `Phase 2: Conversational Media Catalyst (Day ${day})`
          : `Phase 1: Foundations & Habit Busting (Day ${day})`,
      steps: JSON.parse(JSON.stringify(match.steps)) // deep copy to prevent mutations of primary template dataset
    };
  } else {
    baseLesson = {
      ...CurriculumData[0],
      day: day,
      phaseTitle: `Phase 1: Foundations (Day ${day})`,
      steps: JSON.parse(JSON.stringify(CurriculumData[0].steps))
    };
  }

  // 1. COMPREHENSION LEVEL ENHANCEMENTS from Phase 2 onward (Day >= 31)
  if (day >= 31) {
    // Find Stage 2 / "contrastive" (Listen) step and inject elisions/contractions typical of movies/YT
    const listenIndex = baseLesson.steps.findIndex(s => s.type === "contrastive");
    if (listenIndex !== -1) {
      const step = baseLesson.steps[listenIndex] as ContrastiveStep;
      
      const elisionSet = [
        {
          bengali: "আমি এখনই চলে যাচ্ছি। (সরাসরি নেটিভ সংকোচন: I'm gonna go right now)",
          english: "I'm gonna go right now.",
          audio: "I'm gonna go right now. Standard native pacing elides going to into gonna.",
          phonetic: "আইম গনা গো রাইট নাও (pacing: prompt contraction)",
          instruction: "LISTEN closely to the standard native pacing. Phase 2 trains your ears on natural conversational rhythm by introducing structural elision (going to -> gonna) instead of slow, robotic textbook models!"
        },
        {
          bengali: "তোমার কী করার ইচ্ছে আছে? (নেটিভ সংকোচন: Whatcha wanna do?)",
          english: "Whatcha wanna do?",
          audio: "Whatcha wanna do about it? Real conversational media patterns compress what are you want to.",
          phonetic: "ওয়াচ্চা ওয়ানা ডু (pacing: natural movie pacing)",
          instruction: "DECODE conversational media rhythms. Notice how 'What do you want to' or 'What are you going to' collapses to 'Whatcha wanna' or 'Whatcha gonna'. Listen to the natural pace!"
        },
        {
          bengali: "আমার এখনই কাজ শেষ করতে হবে। (নেটিভ সংকোচন: I gotta wrap this up right now)",
          english: "I gotta wrap this up right now.",
          audio: "I gotta wrap this up right now. Native speakers reduce have got to into gotta.",
          phonetic: "আই গটা র‍্যাপ দিস আপ রাইট নাও (pacing: rapid movie stream)",
          instruction: "TRAIN your hearing on standard media contractions. 'I have got to' becomes 'I gotta' with a rapid flap-T sound. Play the audio to capture the high-context dialect pacing!"
        },
        {
          bengali: "তুমি কি আমাকে সাহায্য করবে? (নেটিভ সংকোচন: D'ya wanna help out?)",
          english: "D'ya wanna help out?",
          audio: "D'ya wanna help out? Conversational speech blends do you want to into dya wanna.",
          phonetic: "ড্য ওয়ানা হেল্প আউট (pacing: movies standard)",
          instruction: "MASTER movie pacing. Subconscious listening demands recognizing 'Do you want to' as the micro-blend 'D'ya wanna'. This is essential for 80%+ YouTube/dialogue decoding success!"
        },
        {
          bengali: "আমি তোমাকে আগেই বলতাম। (নেটিভ গতি সংকোচন: I would've told ya.)",
          english: "I would've told ya.",
          audio: "I would've told ya if you had asked. Reduced conditional structures are key for native fluency.",
          phonetic: "আই উডা টোল্ড ইয়ার (pacing: conversational standard)",
          instruction: "ELIMINATE robotic listening habits. In films, 'would have told you' shrinks to 'would've told ya' or 'woulda told ya'. Standard textbook phrasing won't prepare you for real-world TV!"
        }
      ];

      const chosen = elisionSet[(day - 31) % elisionSet.length];
      step.sentenceBengali = chosen.bengali;
      step.sentenceEnglish = chosen.english;
      step.audioSimulationText = chosen.audio;
      step.phonetic = chosen.phonetic;
      step.instruction = chosen.instruction;
    }
  }

  // 1a. Inject media comprehension checkpoint at the end of every 10-day block (day % 10 === 0)
  if (day % 10 === 0) {
    const checkIdx = Math.max(0, Math.floor((day / 10) - 1)); // 0 to 8
    const mediaCheckpoints = [
      {
        title: "Stage 7: Film & YouTube Media Decode Checkpoint",
        prompt: "In a Hollywood action scene, a character yells: 'Whatcha gonna do when the heat comes?!'. What is the formal grammatical translation of this rapid colloquial stream?",
        bengaliPrompt: "সিনেমাটির দ্রুত স্ল্যাং ডায়লগ 'Whatcha gonna do' এর প্রকৃত অর্থ কী?",
        options: [
          "What are you going to do",
          "What can you watch",
          "What game are you playing",
          "Where are you going run to"
        ],
        correctIndex: 0,
        explanation: "Brilliant decoding! 'Whatcha gonna' is the conversational compression of 'What are you going to'. Film tracking models actively require this ear training."
      },
      {
        title: "Stage 7: Conversational Media Decode Checkpoint",
        prompt: "A YouTuber states: 'I gotta hit the road, guys.' Decode the real-world standard conversational pacing of 'gotta' used in modern social media:",
        bengaliPrompt: "'I gotta' এর ব্যাকরণগত মূলরূপ নিচের কোনটি?",
        options: [
          "I have got to",
          "I went to",
          "I am going to get",
          "I forgot to"
        ],
        correctIndex: 0,
        explanation: "Excellent! 'gotta' translates to 'have got to/must' in native conversational media."
      },
      {
        title: "Stage 7: Netflix Dialogue Decode Checkpoint",
        prompt: "While watching a series, you hear: 'Wouldja mind handin' me that tablet?'. What is the full, non-reduced expression?",
        bengaliPrompt: "'Wouldja mind handin'' এর সঠিক ব্যাকরণ সংস্করণ নির্বাচন করুন:",
        options: [
          "Would you mind handing",
          "Should you hand",
          "Will you hand over",
          "Could you have handed"
        ],
        correctIndex: 0,
        explanation: "Perfect! 'Wouldja' is the classic conversational palatization of 'Would you', and 'handin'' represents suffix-G elision ('handing')."
      },
      {
        title: "Stage 7: Vlog Stream Decode Checkpoint",
        prompt: "In a standard YouTube podcast, the speaker says: 'We dunno how they pulled it off.' What did the creator mean by 'dunno'?",
        bengaliPrompt: "'dunno' দ্বারা পডকাস্টের বক্তা কী বুঝিয়েছেন?",
        options: [
          "do not know",
          "did know",
          "done knowing",
          "do a new"
        ],
        correctIndex: 0,
        explanation: "Correct! 'dunno' is the standard phonetic representation of the low-stress contraction 'don't know'."
      },
      {
        title: "Stage 7: Dialogue Auditory Inversion Checkpoint",
        prompt: "In conversational media: 'Didja see 'em at the match?'. Convert this back to the textbook formal language structure:",
        bengaliPrompt: "'Didja see 'em' এর আক্ষরিক আনুষ্ঠানিক রূপ কোনটি?",
        options: [
          "Did you see them",
          "Do you see him",
          "Does he see them",
          "Did you see her"
        ],
        correctIndex: 0,
        explanation: "Superb! 'Didja' is 'Did you' and ''em' represents 'them' in colloquial movie dialogue patterns."
      },
      {
        title: "Stage 7: Film Subtitle Interpretation Checkpoint",
        prompt: "In a suspense drama film: 'I'm outta here, it's too dangerous!'. What is the structural layout of the contraction 'outta'?",
        bengaliPrompt: "চলচ্চিত্রে ব্যবহৃত 'outta' এর প্রকৃত রূপ কোনটি?",
        options: [
          "out of",
          "out on",
          "outside of",
          "about to go"
        ],
        correctIndex: 0,
        explanation: "Top-tier! 'outta' is the high-context reduction of 'out of'."
      },
      {
        title: "Stage 7: Quick Native Tempo Checkpoint",
        prompt: "In a technical YouTube log: 'You shoulda compiled the backend before deploying.' What structure is represented by 'shoulda'?",
        bengaliPrompt: "টেলিভিশন/ভিডিওর দ্রুতগতির 'shoulda' আসলে কী?",
        options: [
          "should have",
          "should of",
          "shall have",
          "should do"
        ],
        correctIndex: 0,
        explanation: "Magnificent! 'shoulda' is the quick conversational compression of 'should have'."
      },
      {
        title: "Stage 7: Conversational Rhythm Audit",
        prompt: "In standard native street speak: 'C'mere, I gotta let ya in on a secret!'. Decode the words 'C'mere' and 'ya' perfectly:",
        bengaliPrompt: "পডকাস্টের সাধারণ প্রকাশ 'C'mere' ও 'ya' এর মূল রূপ কী?",
        options: [
          "Come here and you",
          "Call me here and you",
          "Come here and your",
          "Go near and him"
        ],
        correctIndex: 0,
        explanation: "Flawless! 'C'mere' is the blended form of 'Come here', and 'ya' is the unstressed object form of 'you'."
      },
      {
        title: "Stage 7: Conversational Greeting Checkpoint",
        prompt: "In movie greetings: 'How's it goin' guys?'. What are the formal words compressed here?",
        bengaliPrompt: "'How's it goin'' এর সঠিক প্রাতিষ্ঠানিক রূপ কোনটি?",
        options: [
          "How is it going",
          "How has it gone",
          "Who is going",
          "How was it gone"
        ],
        correctIndex: 0,
        explanation: "Outstanding! You are mathematically guaranteed to comprehend conversational media with this level of auditory parsing!"
      }
    ];

    const checkpointData = mediaCheckpoints[checkIdx % mediaCheckpoints.length];
    baseLesson.steps[6] = {
      type: "cognitive",
      title: checkpointData.title,
      prompt: checkpointData.prompt,
      bengaliPrompt: checkpointData.bengaliPrompt,
      options: checkpointData.options,
      correctIndex: checkpointData.correctIndex,
      explanation: checkpointData.explanation,
      isMediaCheckpoint: true
    } as any;
  }

  // 2. WRITING AND EXPRESSION RIGOR: Chapter 3 (Days 61–90) academic syntax layout
  if (day >= 61) {
    const academicBridges = [
      {
        prompt: "Assemble the dynamic academic syntax: 'Although he studies grammar hard, furthermore he practices in order to speak like a native.'",
        scrambled: ["Although", "hard,", "furthermore", "studied", "practices", "he", "studies", "grammar", "he", "in", "order", "to", "speak", "like", "a", "native."],
        sequence: ["Although", "he", "studies", "grammar", "hard,", "furthermore", "he", "practices", "in", "order", "to", "speak", "like", "a", "native."],
        explanation: "Astonishing! You transitioned a simple SVO structure into a highly polished, multi-clause academic syntax layout utilizing conjunction bridges: 'Although', 'Furthermore', and 'In order to'."
      },
      {
        prompt: "Assemble the advanced academic syntax: 'Although we learn simple rules, furthermore we analyze conversational media in order to achieve 80% listening fluency.'",
        scrambled: ["Although", "we", "learn", "simple", "rules,", "furthermore", "we", "analyze", "conversational", "media", "in", "order", "to", "achieve", "80%", "listening", "fluency."],
        sequence: ["Although", "we", "learn", "simple", "rules,", "furthermore", "we", "analyze", "conversational", "media", "in", "order", "to", "achieve", "80%", "listening", "fluency."],
        explanation: "Magnificent! You successfully utilized multiple clauses with conjunction connections to formulate advanced academic proof logic!"
      },
      {
        prompt: "Assemble the scholarly expression layout: 'Although pronunciation is complex, furthermore he practices phonetics daily in order to communicate professionally.'",
        scrambled: ["Although", "complex,", "furthermore", "practices", "pronunciation", "he", "is", "phonetics", "daily", "in", "order", "to", "communicate", "professionally."],
        sequence: ["Although", "pronunciation", "is", "complex,", "furthermore", "he", "practices", "phonetics", "daily", "in", "order", "to", "communicate", "professionally."],
        explanation: "Excellent command over elite sentence connectors! This satisfies the strict Chapter 3 writing validation rigor perfectly!"
      }
    ];

    const academicSelection = academicBridges[(day - 61) % academicBridges.length];
    baseLesson.steps[7] = {
      type: "mastery",
      title: "Stage 8: The Mastery Lock - Elite Academic Composition Challenge",
      prompt: academicSelection.prompt,
      scrambledOptions: academicSelection.scrambled,
      correctSequence: academicSelection.sequence,
      explanation: academicSelection.explanation,
      isAcademicComposition: true
    } as any;
  }

  return baseLesson;
}
