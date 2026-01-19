
import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion } from '../types';
import { geminiService } from '../services/geminiService';

interface GrammarQuizProps {
  onApiError?: (error: any) => void;
}

const GrammarQuiz: React.FC<GrammarQuizProps> = ({ onApiError }) => {
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
      const data = await geminiService.generateQuizQuestion();
      setQuestion(data);
      setQuestionCount(p => p + 1);
    } catch (error: any) {
      console.error("퀴즈 생성 실패:", error);
      onApiError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onApiError]);

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

      <div className="glass-card rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col min-h-[550px]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🧩</div>
            </div>
            <p className="mt-10 text-xl font-bold text-slate-800 animate-pulse text-center">윤A를 위한 문제를 가져오고 있어요...</p>
          </div>
        ) : question ? (
          <div className="p-10 md:p-16 flex-1 flex flex-col">
            <div className="mb-14 text-center">
              <h3 className="text-2xl md:text-4xl font-extrabold text-slate-800 leading-[1.6] tracking-tight mb-4">
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
              <div className="mt-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 inline-block animate-in fade-in duration-700">
                <p className="text-lg text-slate-500 font-bold italic">({question.translation})</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={showFeedback}
                  onClick={() => handleSelect(i)}
                  className={`group p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-5 active:scale-95 ${
                    showFeedback ? (i === question.answerIndex ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : i === selectedIdx ? 'border-rose-500 bg-rose-50 text-rose-700' : 'opacity-40') : 'border-slate-100 hover:border-indigo-300 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                    showFeedback && i === question.answerIndex ? 'bg-emerald-500 text-white' : showFeedback && i === selectedIdx ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>{String.fromCharCode(65 + i)}</div>
                  <span className="text-xl font-bold">{opt}</span>
                </button>
              ))}
            </div>
            {showFeedback && (
              <div className="animate-in slide-in-from-top-6 duration-500 mt-auto">
                <div className={`p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-start mb-10 ${selectedIdx === question.answerIndex ? 'bg-emerald-50/50' : 'bg-rose-50/50'}`}>
                  <div className="text-4xl">{selectedIdx === question.answerIndex ? '🎊' : '💡'}</div>
                  <div>
                    <h4 className="text-lg font-black mb-2">{selectedIdx === question.answerIndex ? '정답입니다!' : '아쉬워요!'}</h4>
                    <p className="text-slate-600 font-medium italic">{question.explanation}</p>
                  </div>
                </div>
                <button onClick={generateQuestion} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xl shadow-2xl transition-all">다음 문제 도전하기 →</button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GrammarQuiz;
