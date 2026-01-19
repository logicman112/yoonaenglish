
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { TranscriptEntry, FeedbackData, QuizQuestion } from '../types';

class GeminiService {
  private modelName = 'gemini-3-flash-preview';

  // 인스턴스를 미리 만들지 않고 호출 시점에 생성하여 환경 변수 누락 문제를 방지합니다.
  private getAIInstance() {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "undefined") {
      throw new Error("API_KEY_MISSING");
    }
    return new GoogleGenAI({ apiKey });
  }

  createChatSession(systemInstruction: string): Chat {
    return this.getAIInstance().chats.create({
      model: this.modelName,
      config: {
        systemInstruction,
      },
    });
  }

  async generateQuizQuestion(): Promise<QuizQuestion> {
    const categories = [
      "Conditional Sentences", "Subjunctive Mood", "Passive Voice", "Relative Clauses", 
      "Phrasal Verbs", "Gerunds vs Infinitives", "Perfect Tenses", "Modals", "Participle Phrases"
    ];
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const response = await this.getAIInstance().models.generateContent({
      model: this.modelName,
      contents: `Generate a professional 4-option English grammar quiz. Category: ${randomCategory}. Context: Daily Life. Provide Korean translation and explanation.`,
      config: {
        responseMimeType: "application/json",
        seed: Math.floor(Math.random() * 999999),
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

  async generateFeedback(transcripts: TranscriptEntry[]): Promise<FeedbackData> {
    const conversationText = transcripts.map(t => `${t.role}: ${t.text}`).join('\n');
    const response = await this.getAIInstance().models.generateContent({
      model: this.modelName,
      contents: `Analyze English conversation and provide feedback in Korean JSON: ${conversationText}`,
      config: {
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
                }
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
