
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { TranscriptEntry, FeedbackData, QuizQuestion } from '../types';

class GeminiService {
  private modelName = 'gemini-3-flash-preview';

  // API 인스턴스를 필요할 때마다 생성하여 환경 변수 주입 시점 문제를 해결합니다.
  private get ai() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API_KEY가 아직 설정되지 않았습니다. 환경 변수를 확인해주세요.");
    }
    return new GoogleGenAI({ apiKey: apiKey || "" });
  }

  // 채팅 세션 생성
  createChatSession(systemInstruction: string): Chat {
    return this.ai.chats.create({
      model: this.modelName,
      config: {
        systemInstruction,
      },
    });
  }

  // 퀴즈 생성 (중복 방지 및 다변화 대폭 강화)
  async generateQuizQuestion(): Promise<QuizQuestion> {
    const categories = [
      "Conditional Sentences (Type 0, 1, 2, 3)", "Subjunctive Mood", "Passive Voice in all tenses", 
      "Relative Clauses (Defining/Non-defining/Contact clauses)", "Phrasal Verbs (Mixed usage)", "Gerunds vs Infinitives",
      "Perfect Tenses (Present, Past, Future, Continuous versions)", "Modals of Deduction and Possibility",
      "Participle Phrases (Present/Past)", "Inversion after negative/restrictive adverbs", "Causative Verbs (have, get, make, let)",
      "Comparison (Double comparatives, as...as, etc.)", "Complex Articles and Determiners", "Advanced Prepositions",
      "Reported Speech (Tense shifts)", "Wishes and Regrets (I wish, If only)", "Linking Words and Conjunctions",
      "Noun Clauses", "Adverbial Clauses of Time, Reason, and Contrast", "Parallel Structure"
    ];
    
    const contexts = [
      "Business meeting", "Academic research paper", "Casual street conversation", "Romantic novel", 
      "Scientific discovery", "Travel blog", "Political debate", "Technology review", "Family dinner", "Space exploration"
    ];
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
    
    const response = await this.ai.models.generateContent({
      model: this.modelName,
      contents: `Generate a professional 4-option multiple-choice English grammar quiz question.
      Theme: [${randomCategory}]
      Context: [${randomContext}]
      
      Requirements:
      1. Include a sentence with a blank marked as [___].
      2. The sentence must be unique, high-quality, and natural for the given context.
      3. Provide 4 distinct options and the index of the correct answer (0-3).
      4. Crucial: Provide a natural Korean translation for the entire sentence in the 'translation' field.
      5. Provide a clear, educational explanation in Korean in the 'explanation' field.
      6. Crucial: Avoid simple or repetitive sentences. Make it diverse and challenging every time.`,
      config: {
        responseMimeType: "application/json",
        seed: Math.floor(Math.random() * 9999999),
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentence: { type: Type.STRING },
            translation: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answerIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["sentence", "translation", "options", "answerIndex", "explanation"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as QuizQuestion;
  }

  // 피드백 리포트 생성
  async generateFeedback(transcripts: TranscriptEntry[]): Promise<FeedbackData> {
    const conversationText = transcripts
      .map(t => `${t.role.toUpperCase()}: ${t.text}`)
      .join('\n');

    const response = await this.ai.models.generateContent({
      model: this.modelName,
      contents: `Analyze the following conversation and provide feedback:\n${conversationText}`,
      config: {
        systemInstruction: "You are an English feedback expert. Analyze the conversation to evaluate 'Yoona Jung's' English skills and provide feedback in JSON format. Provide all summary and explanations in Korean.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            grammarCorrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["original", "corrected", "explanation"]
              }
            },
            overallSummary: { type: Type.STRING }
          },
          required: ["score", "strengths", "improvements", "grammarCorrections", "overallSummary"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as FeedbackData;
  }
}

export const geminiService = new GeminiService();
