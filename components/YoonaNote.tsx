
import React from 'react';
import { GrammarPoint } from '../types';

interface YoonaNoteProps {
  savedPoints: GrammarPoint[];
  onRemove: (point: GrammarPoint) => void;
  onGoToLab: () => void;
}

const YoonaNote: React.FC<YoonaNoteProps> = ({ savedPoints, onRemove, onGoToLab }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📝</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">윤아노트</h2>
          </div>
          <p className="text-lg text-slate-500 font-medium">내가 소중하게 모은 문법 포인트들</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-slate-400 font-bold mr-2 uppercase text-xs tracking-widest">Total Notes</span>
          <span className="text-3xl font-black text-pink-600">{savedPoints.length}</span>
        </div>
      </div>

      {savedPoints.length === 0 ? (
        <div className="bg-white rounded-[3.5rem] border border-slate-100 p-20 flex flex-col items-center text-center shadow-xl shadow-pink-500/5">
          <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-6xl mb-8 grayscale opacity-50">
            📒
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-4">아직 저장된 노트가 없어요!</h3>
          <p className="text-slate-400 font-medium mb-10 max-w-sm leading-relaxed">
            문법 랩에서 공부하다가 기억하고 싶은 내용이 있으면 별 버튼을 눌러 저장해보세요.
          </p>
          <button 
            onClick={onGoToLab}
            className="px-10 py-5 bg-pink-500 hover:bg-pink-600 text-white rounded-[1.8rem] font-black text-lg shadow-xl shadow-pink-200 transition-all hover:-translate-y-1 active:scale-95"
          >
            문법 랩으로 이동하기 🚀
          </button>
        </div>
      ) : (
        <div className="space-y-10 mb-20">
          {savedPoints.map((point) => (
            <div key={point.id} className="bg-white rounded-[3rem] p-10 md:p-14 border-2 border-pink-100 shadow-2xl shadow-pink-500/5 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-pink-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-xs font-black text-pink-600 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-pink-100 shadow-sm inline-block">Saved Grammar Point</span>
                  <button 
                    onClick={() => onRemove(point)}
                    className="w-12 h-12 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all shadow-sm"
                    title="제거하기"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>

                <h3 className="text-3xl font-black text-slate-800 mb-8">{point.title}</h3>
                
                <div className="mb-12">
                   <div className="flex items-center gap-2 mb-3">
                     <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Rule & Definition</span>
                   </div>
                   <p className="text-xl text-slate-700 font-medium leading-relaxed bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                     {point.rule}
                   </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {point.examples.map((ex, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                      <div className="flex flex-col md:flex-row gap-6 md:items-center mb-6">
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-2">Wrong Example</span>
                          <p className="text-rose-500 font-bold line-through text-lg italic">"{ex.wrong}"</p>
                        </div>
                        <div className="hidden md:block text-slate-200">
                           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-2">Correct Way</span>
                          <p className="text-emerald-600 font-black text-2xl">"{ex.right}"</p>
                        </div>
                      </div>
                      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-50 text-sm text-slate-600 font-medium italic leading-relaxed">
                        💡 {ex.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-10 text-center">
            <p className="text-slate-400 font-bold mb-6">꾸준히 기록하다 보면 영어가 금방 늘 거예요!</p>
            <button 
              onClick={onGoToLab}
              className="text-pink-500 font-black text-lg hover:underline decoration-4 underline-offset-8"
            >
              새로운 문법 포인트 더 찾으러 가기 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YoonaNote;
