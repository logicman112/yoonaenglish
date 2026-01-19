
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  LIVE_SESSION = 'LIVE_SESSION',
  FEEDBACK = 'FEEDBACK',
  GRAMMAR_LAB = 'GRAMMAR_LAB',
  QUIZ = 'QUIZ',
  YOONA_NOTE = 'YOONA_NOTE'
}

export interface QuizQuestion {
  sentence: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface LessonScenario {
  id: string;
  title: string;
  description: string;
  level: '입문' | '초급' | '중급' | '고급';
  systemInstruction: string;
  icon: string;
  personaName: string;
}

export interface GrammarPoint {
  id: string;
  title: string;
  rule: string;
  examples: Array<{
    wrong: string;
    right: string;
    explanation: string;
  }>;
  isSaved?: boolean;
}

export interface DailyPush {
  time: string;
  topic: string;
  description: string;
  icon: string;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface TranscriptEntry {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  correction?: Correction | null;
}

export interface FeedbackData {
  score: number;
  strengths: string[];
  improvements: string[];
  grammarCorrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  overallSummary: string;
}
