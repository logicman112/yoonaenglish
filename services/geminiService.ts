
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { TranscriptEntry, FeedbackData, QuizQuestion } from '../types';

class GeminiService {
  private ai: GoogleGenAI;
  private modelName = 'gemini-3-flash-preview';

  constructor() {
   this.ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
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

  // 퀴즈 생성
  async generateQuizQuestion(): Promise<QuizQuestion> {
    const response = await this.ai.models.generateContent({
      model: this.modelName,
      contents: "영문법 실력을 테스트할 수 있는 4지선다형 퀴즈를 하나 생성해줘. 문장 안에 빈칸 [___]이 있어야 하며, 옵션 4개와 정답 인덱스(0-3)를 포함해줘. 해설(explanation)은 아주 짧고 쉽게 작성해줘.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentence: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answerIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["sentence", "options", "answerIndex", "explanation"]
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
      contents: `다음 대화를 분석하여 피드백을 주세요:\n${conversationText}`,
      config: {
        systemInstruction: "당신은 영어 피드백 전문가입니다. 대화를 분석하여 정윤아 님의 영어 실력을 평가하고 JSON 형식으로 피드백을 주세요.",
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
