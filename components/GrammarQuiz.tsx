
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { QuizQuestion } from '../types';

const GrammarQuiz: React.FC = () => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const generateQuestion = useCallback(async () => {
    setLoading(true);
    setSelectedIdx(null);
    setShowFeedback(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "영문법 실력을 테스트할 수 있는 4지선다형 퀴즈를 하나 생성해줘. 문장 안에 빈칸 [___]이 있어야 하며, 옵션 4개와 정답 인덱스(0-3)를 포함해줘. 해설(explanation)은 초등학생도 이해할 수 있을 만큼 아주 쉽게 '딱 한 문장'으로만 작성해줘.",
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

      const data = JSON.parse(response.text || '{}');
      setQuestion(data);
      setQuestionCount(p => p + 1);
    } catch (error) {
      console.error("퀴즈 생성 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedIdx(idx);
    setShowFeedback(true);
    if (idx === question?.answerIndex) {
      setScore(prev => prev + 10);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
            <span className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Speed Quiz Mode</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 text-center md:text-left">Infinite Master ⚡</h2>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-slate-100 px-6 py-3 rounded-2xl shadow-sm">
             <span className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Problem</span>
             <span className="text-xl font-black text-slate-800">#{questionCount}</span>
          </div>
          <div className="bg-indigo-600 px-6 py-3 rounded-2xl shadow-lg shadow-indigo-100 text-white">
             <span className="block text-[10px] font-bold text-indigo-200 uppercase mb-0.5">Total Points</span>
             <span className="text-xl font-black">{score}</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[3.5rem] shadow-2xl shadow-indigo-500/5 overflow-hidden flex flex-col min-h-[550px]">
        <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" 
            style={{ width: `${(questionCount % 10) * 10}%` }}
          ></div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🧩</div>
            </div>
            <p className="mt-10 text-xl font-bold text-slate-800 animate-pulse text-center">
              윤A를 위한 새로운 문제를<br/>가져오고 있어요...
            </p>
          </div>
        ) : question ? (
          <div className="p-10 md:p-16 flex-1 flex flex-col">
            <div className="mb-14 text-center">
              <h3 className="text-2xl md:text-4xl font-extrabold text-slate-800 leading-[1.6] tracking-tight">
                {question.sentence.split('[___]').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i !== arr.length - 1 && (
                      <span className={`inline-block min-w-[140px] border-b-[6px] transition-colors mx-3 text-center ${
                        showFeedback 
                          ? (selectedIdx === question.answerIndex ? 'border-emerald-500 text-emerald-600' : 'border-rose-500 text-rose-600') 
                          : 'border-indigo-100 text-transparent bg-indigo-50/50 rounded-lg'
                      }`}>
                        {showFeedback ? question.options[question.answerIndex] : " "}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {question.options.map((opt, i) => {
                let statusClass = "border-slate-100 hover:border-indigo-300 bg-white hover:bg-slate-50 shadow-sm";
                if (showFeedback) {
                  if (i === question.answerIndex) statusClass = "border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-50";
                  else if (i === selectedIdx) statusClass = "border-rose-500 bg-rose-50 text-rose-700";
                  else statusClass = "opacity-40 border-slate-50";
                }

                return (
                  <button
                    key={i}
                    disabled={showFeedback}
                    onClick={() => handleSelect(i)}
                    className={`group p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-5 ${statusClass} active:scale-95`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm transition-colors ${
                      showFeedback && i === question.answerIndex ? 'bg-emerald-500 text-white' :
                      showFeedback && i === selectedIdx ? 'bg-rose-500 text-white' :
                      'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-xl font-bold">{opt}</span>
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div className="animate-in slide-in-from-top-6 duration-500 mt-auto">
                <div className={`p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-start mb-10 ${
                  selectedIdx === question.answerIndex ? 'bg-emerald-50/50 border border-emerald-100' : 'bg-rose-50/50 border border-rose-100'
                }`}>
                  <div className="text-4xl">{selectedIdx === question.answerIndex ? '🎊' : '💡'}</div>
                  <div>
                    <h4 className={`text-lg font-black mb-2 ${selectedIdx === question.answerIndex ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {selectedIdx === question.answerIndex ? '정답입니다!' : '아쉬워요! 정답은 ' + question.options[question.answerIndex] + ' 예요.'}
                    </h4>
                    <p className="text-slate-600 font-medium leading-relaxed italic">
                      {question.explanation}
                    </p>
                  </div>
                </div>
                <button
                  onClick={generateQuestion}
                  className="w-full py-6 bg-slate-900 hover:bg-black text-white rounded-3xl font-black text-xl shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1"
                >
                  다음 문제 도전하기 →
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GrammarQuiz;
