
import React, { useEffect, useRef, useState } from 'react';
import { LessonScenario, TranscriptEntry, FeedbackData, Correction } from '../types';
import { geminiService } from '../services/geminiService';

interface LiveSessionProps {
  lesson: LessonScenario;
  onEnd: (history: TranscriptEntry[], feedback: FeedbackData | null) => void;
  onCancel: () => void;
  onApiError?: (error: any) => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({ lesson, onEnd, onCancel, onApiError }) => {
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      try {
        chatRef.current = geminiService.createChatSession(lesson.systemInstruction);
        const firstMsg = await chatRef.current.sendMessage({ message: "여보, 나 왔어! 페르소나에 맞춰서 첫 인사 건네줘." });
        const rawText = firstMsg.text || "";
        const parts = rawText.split('###');
        let text = parts[parts.length - 1].trim();
        setTranscripts([{ role: 'model', text: text, timestamp: Date.now() }]);
      } catch (e: any) {
        console.error("초기 대화 실패", e);
        onApiError?.(e);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, [lesson, onApiError]);

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
    setTranscripts(prev => [...prev, { role: 'user', text: userText, timestamp: Date.now() }]);
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
            const parsed = JSON.parse(jsonStr.substring(firstBrace, lastBrace + 1));
            if (parsed.corrected && parsed.corrected !== parsed.original && parsed.original !== "") {
              correction = { original: parsed.original, corrected: parsed.corrected, explanation: parsed.explanation };
            }
          }
        } catch (e) {}
      } else {
        finalChatText = rawResponse.trim();
      }

      setTranscripts(prev => [...prev, { 
        role: 'model', 
        text: finalChatText || "여보, 방금 한 말 다시 한 번만 말해줄래?", 
        timestamp: Date.now(),
        correction: correction 
      }]);
    } catch (err: any) {
      console.error("메시지 전송 실패", err);
      onApiError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    setIsEnding(true);
    try {
      const feedbackData = await geminiService.generateFeedback(transcripts);
      onEnd(transcripts, feedbackData);
    } catch (error) {
      onEnd(transcripts, null);
    } finally {
      setIsEnding(false);
    }
  };

  const isGrumpy = lesson.id.includes('grumpy');

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-14rem)] md:h-[850px] animate-in zoom-in-95 duration-700">
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-4">
           <button onClick={onCancel} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all">←</button>
           <div>
             <h2 className="text-xl font-black text-slate-900 tracking-tight">{lesson.title}</h2>
             <p className={`${isGrumpy ? 'text-orange-500' : 'text-pink-500'} text-[10px] font-black uppercase tracking-[0.2em]`}>
               {isGrumpy ? '츤데레 명오와 텍스트 대화 중 🤨' : '로직명오와 달달한 텍스트 대화 중 💕'}
             </p>
           </div>
        </div>
        <button 
          onClick={handleEndSession} 
          disabled={isEnding || transcripts.length < 2} 
          className={`px-6 py-3 ${isGrumpy ? 'bg-slate-700' : 'bg-rose-500'} text-white rounded-2xl font-black text-sm shadow-xl disabled:opacity-50`}
        >
          {isEnding ? '분석 중...' : '대화 마칠래'}
        </button>
      </div>

      <div className="flex-1 bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar bg-slate-50/20">
          {transcripts.map((entry, idx) => (
            <div key={idx} className={`flex flex-col ${entry.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4 duration-500`}>
              {entry.role === 'model' && entry.correction && (
                <div className={`mb-6 w-full max-w-[95%] bg-white border-2 ${isGrumpy ? 'border-orange-200' : 'border-pink-100'} rounded-[2.5rem] p-8 shadow-xl`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{isGrumpy ? '🤨' : '💝'}</span>
                    <span className={`text-sm font-black ${isGrumpy ? 'text-orange-600' : 'text-pink-500'} uppercase tracking-widest`}>
                      {isGrumpy ? '야, 문법 틀렸어!' : '여보, 이렇게 말하면 더 좋아!'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">윤아가 쓴 말</span>
                      <p className="text-sm text-rose-400 line-through font-bold bg-slate-50 p-4 rounded-2xl">"{entry.correction.original}"</p>
                    </div>
                    <div>
                      <span className={`text-[10px] font-black ${isGrumpy ? 'text-orange-500' : 'text-indigo-500'} uppercase tracking-wider ml-1`}>
                        {isGrumpy ? '이게 맞는 표현이야' : '명오의 추천 표현'}
                      </span>
                      <p className={`text-base ${isGrumpy ? 'text-orange-700' : 'text-pink-600'} font-black bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 shadow-sm`}>"{entry.correction.corrected}"</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl font-bold">
                    💡 <span className="text-indigo-600 underline underline-offset-4">{entry.correction.explanation}</span>
                  </div>
                </div>
              )}
              <div className="flex items-end gap-3 max-w-[85%]">
                {entry.role === 'model' && <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><span className="text-3xl">👨🏻‍💼</span></div>}
                <div className={`px-8 py-5 rounded-[2.2rem] font-bold shadow-md ${entry.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border'}`}>{entry.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
               <div className={`bg-white border-2 ${isGrumpy ? 'border-orange-100 text-orange-400' : 'border-pink-100 text-pink-400'} px-8 py-5 rounded-[2.2rem] rounded-tl-none text-sm font-black shadow-sm`}>
                 {isGrumpy ? '명오가 툴툴거리며 입력 중...' : '명오가 예쁘게 답장 쓰는 중... ❤️'}
               </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSend} className="p-8 bg-white border-t flex gap-4 items-center">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isGrumpy ? "할 말 있으면 영어로 써봐..." : "여보, 명오에게 영어로 톡 보내주세요!"}
            className="flex-1 bg-slate-50 border-2 rounded-[1.8rem] px-8 py-5 text-lg font-bold focus:outline-none transition-all"
          />
          <button type="submit" disabled={!inputValue.trim() || isLoading} className={`w-16 h-16 bg-gradient-to-tr ${isGrumpy ? 'from-slate-700 to-slate-900 shadow-slate-200' : 'from-pink-500 to-rose-600 shadow-pink-200'} text-white rounded-3xl shadow-2xl flex items-center justify-center active:scale-95`}><svg className="w-8 h-8 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></button>
        </form>
      </div>
    </div>
  );
};

export default LiveSession;
