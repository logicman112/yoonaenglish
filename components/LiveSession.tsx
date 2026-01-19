
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { LessonScenario, TranscriptEntry, FeedbackData, Correction } from '../types';

interface LiveSessionProps {
  lesson: LessonScenario;
  onEnd: (history: TranscriptEntry[], feedback: FeedbackData | null) => void;
  onCancel: () => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({ lesson, onEnd, onCancel }) => {
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const initChat = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: lesson.systemInstruction,
        },
      });
      chatRef.current = chat;

      setIsLoading(true);
      const firstMsg = await chat.sendMessage({ message: "여보, 나 왔어! 페르소나에 맞춰서 첫 인사 건네줘." });
      const rawText = firstMsg.text || "";
      
      const parts = rawText.split('###');
      let text = parts[parts.length - 1].trim();
      
      setTranscripts([{ role: 'model', text: text, timestamp: Date.now() }]);
      setIsLoading(false);
    };

    initChat();
  }, [lesson]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    const userEntry: TranscriptEntry = { role: 'user', text: userText, timestamp: Date.now() };
    setTranscripts(prev => [...prev, userEntry]);
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userText });
      const rawResponse = result.text || '';
      
      let correction: Correction | null = null;
      let finalChatText = "";

      const sections = rawResponse.split('###');
      
      if (sections.length >= 2) {
        const jsonStr = sections[0].trim();
        finalChatText = sections[1].trim();
        
        try {
          const firstBrace = jsonStr.indexOf('{');
          const lastBrace = jsonStr.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1) {
            const cleanJson = jsonStr.substring(firstBrace, lastBrace + 1);
            const parsed = JSON.parse(cleanJson);
            if (parsed.original && parsed.corrected && parsed.explanation) {
              correction = {
                original: parsed.original,
                corrected: parsed.corrected,
                explanation: parsed.explanation
              };
            }
          }
        } catch (e) {
          console.error("JSON 파싱 에러:", e);
        }
      } else {
        finalChatText = rawResponse.trim();
      }

      const modelEntry: TranscriptEntry = { 
        role: 'model', 
        text: finalChatText || "여보, 방금 한 말 다시 한 번만 말해줄래? (Could you say that again, honey?)", 
        timestamp: Date.now(),
        correction: correction 
      };

      setTranscripts(prev => [...prev, modelEntry]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    setIsEnding(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const conversationText = transcripts
        .map(t => `${t.role.toUpperCase()}: ${t.text}`)
        .join('\n');

      const feedbackResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `분석 대화:\n${conversationText}`,
        config: {
          systemInstruction: "영어 피드백 리포트 전문가입니다. 사용자의 영어 실력을 분석하여 JSON으로 결과를 리턴하세요.",
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

      const feedbackData = JSON.parse(feedbackResponse.text || '{}');
      onEnd(transcripts, feedbackData);
    } catch (error) {
      onEnd(transcripts, null);
    }
  };

  const isGrumpy = lesson.id.includes('grumpy');

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-14rem)] md:h-[850px] animate-in zoom-in-95 duration-700">
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-4">
           <button onClick={onCancel} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all">
             ←
           </button>
           <div>
             <h2 className="text-xl font-black text-slate-900 tracking-tight">{lesson.title}</h2>
             <p className={`${isGrumpy ? 'text-orange-500' : 'text-pink-500'} text-[10px] font-black uppercase tracking-[0.2em]`}>
               {isGrumpy ? '퉁명스런 명오가 지켜보는 중 🤨' : '로직명오와 꿀 떨어지는 대화 중 💕'}
             </p>
           </div>
        </div>
        <button 
          onClick={handleEndSession} 
          disabled={isEnding} 
          className={`px-6 py-3 ${isGrumpy ? 'bg-slate-700' : 'bg-rose-500'} text-white rounded-2xl font-black text-sm shadow-xl transition-all flex items-center gap-2`}
        >
          {isEnding ? '분석 중...' : '대화 마칠래'}
        </button>
      </div>

      <div className="flex-1 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar bg-slate-50/20">
          {transcripts.map((entry, idx) => (
            <div key={idx} className={`flex flex-col ${entry.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4 duration-500`}>
              
              {entry.role === 'model' && entry.correction && (
                <div className={`mb-6 w-full max-w-[95%] bg-white border-2 ${isGrumpy ? 'border-orange-200' : 'border-pink-100'} rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden`}>
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <span className="text-2xl">{isGrumpy ? '💢' : '💝'}</span>
                    <span className={`text-sm font-black ${isGrumpy ? 'text-orange-600' : 'text-pink-500'} uppercase tracking-widest`}>
                      {isGrumpy ? '명오의 깐깐한 문법 지적' : '명오의 달콤한 문법 교정'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">여보가 방금 한 말</span>
                      <p className="text-sm text-rose-400 line-through font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">"{entry.correction.original}"</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`text-[10px] font-black ${isGrumpy ? 'text-orange-500' : 'text-indigo-500'} uppercase tracking-wider ml-1`}>
                        {isGrumpy ? '제대로 말해!' : '이렇게 말하면 더 멋져!'}
                      </span>
                      <p className={`text-base ${isGrumpy ? 'text-orange-700' : 'text-pink-600'} font-black bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 shadow-sm`}>"{entry.correction.corrected}"</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl font-bold border border-slate-100 relative z-10">
                    💡 <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">{entry.correction.explanation}</span>
                  </div>
                </div>
              )}

              <div className="flex items-end gap-3 max-w-[85%]">
                {entry.role === 'model' && (
                  <div className="w-14 h-14 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center shrink-0 mb-1">
                    <span className="text-3xl">👨🏻‍💼</span>
                  </div>
                )}
                <div className={`px-8 py-5 rounded-[2.2rem] text-base leading-relaxed font-bold shadow-md ${
                  entry.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {entry.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
               <div className={`bg-white border-2 ${isGrumpy ? 'border-orange-100 text-orange-400' : 'border-pink-100 text-pink-400'} px-8 py-5 rounded-[2.2rem] rounded-tl-none text-sm font-black shadow-sm`}>
                 {isGrumpy ? '명오가 툴툴거리며 대답 생각 중...' : '명오가 예쁜 대답을 생각하고 있어요... ❤️'}
               </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-8 bg-white border-t border-slate-50 flex gap-4 items-center">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isGrumpy ? "빨리 영어로 말해봐... (공부 좀 하자)" : "여보, 영어로 편하게 말해줘요!"}
            className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-[1.8rem] px-8 py-5 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-slate-300"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`w-16 h-16 bg-gradient-to-tr ${isGrumpy ? 'from-slate-700 to-slate-900 shadow-slate-200' : 'from-pink-500 to-rose-600 shadow-pink-200'} hover:scale-105 disabled:bg-slate-200 text-white rounded-3xl shadow-2xl flex items-center justify-center transition-all active:scale-95`}
          >
            <svg className="w-8 h-8 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LiveSession;
