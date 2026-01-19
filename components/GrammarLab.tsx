
import React, { useState, useEffect, useMemo } from 'react';
import { GrammarPoint } from '../types';
import { GRAMMAR_DATA } from '../constants';

interface GrammarLabProps {
  savedPoints: GrammarPoint[];
  onSave: (point: GrammarPoint) => void;
}

const GrammarLab: React.FC<GrammarLabProps> = ({ savedPoints, onSave }) => {
  const [level, setLevel] = useState<'초급' | '중급' | '상급'>('초급');
  
  // GRAMMAR_DATA에서 해당 레벨의 데이터 20개를 즉시 가져옵니다.
  const points = useMemo(() => GRAMMAR_DATA[level], [level]);

  const isSaved = (point: GrammarPoint) => savedPoints.some(p => p.id === point.id || p.title === point.title);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Grammar Lab 🧪</h2>
          <p className="text-slate-500 font-medium">{level}을 위해 엄선한 핵심 문법 20가지</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          {(['초급', '중급', '상급'] as const).map((l) => (
            <button
              key={l}
              onClick={() => { setLevel(l); }}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                level === l ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {points.map((point) => (
          <div key={point.id} className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-pink-500/5 relative overflow-hidden group hover:border-pink-200 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">Topic: {point.title}</span>
                <button 
                  onClick={() => onSave(point)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isSaved(point) ? 'bg-pink-500 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-300 hover:text-pink-500 hover:bg-pink-50'
                  }`}
                  title={isSaved(point) ? "노트에서 제거" : "윤아노트에 저장"}
                >
                  <svg className="w-6 h-6" fill={isSaved(point) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </button>
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-6">{point.title} 정복하기</h3>
              <div className="bg-slate-50 p-6 rounded-2xl mb-8 border-l-4 border-pink-500 text-slate-700 text-base leading-relaxed font-medium">
                <strong className="block text-pink-600 mb-1 text-sm uppercase tracking-wider">핵심 규칙</strong>
                {point.rule}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {point.examples.map((ex, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-[10px] font-black">✕</span>
                        <span className="text-rose-400 line-through text-sm font-semibold">{ex.wrong}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black">✓</span>
                        <span className="text-emerald-600 text-lg font-bold">{ex.right}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl leading-relaxed italic border border-slate-50 shadow-inner">
                      💡 {ex.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-slate-400 font-bold mb-4">학습할 수 있는 모든 문법을 보여드렸어요!</p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-pink-500 font-black hover:underline underline-offset-4"
        >
          맨 위로 돌아가기 ↑
        </button>
      </div>
    </div>
  );
};

export default GrammarLab;
