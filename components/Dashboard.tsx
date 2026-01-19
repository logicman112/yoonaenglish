
import React from 'react';
import { LESSON_SCENARIOS } from '../constants';
import { LessonScenario, AppView } from '../types';

interface DashboardProps {
  onStartLesson: (lesson: LessonScenario) => void;
  onSetView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartLesson, onSetView }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 relative pb-20">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="z-10 text-center md:text-left w-full">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Happy Learning, <span className="text-pink-600">정윤아 님!</span> 👋
          </h2>
          <p className="text-lg text-slate-500 font-medium">듬직한 명오와 귀여운 단이, 서로가 기다리고 있어요! 💕</p>
        </div>
      </div>

      {/* 중앙 캐릭터 섹션 */}
      <div className="flex flex-col items-center justify-center mb-24 relative h-96">
        <div 
          className="character-float relative group cursor-pointer flex flex-col items-center justify-center" 
          onClick={() => onStartLesson(LESSON_SCENARIOS[0])}
        >
          <span className="heart-effect text-3xl" style={{ left: '20%', animationDelay: '0s' }}>💕</span>
          <span className="heart-effect text-2xl" style={{ left: '80%', animationDelay: '0.4s' }}>❤️</span>
          <span className="heart-effect text-3xl" style={{ left: '40%', animationDelay: '0.9s' }}>💖</span>
          <span className="heart-effect text-2xl" style={{ left: '60%', animationDelay: '1.5s' }}>💕</span>

          <div className="flex items-end justify-center gap-6 md:gap-12">
            <div className="flex flex-col items-center group-hover:scale-110 transition-transform duration-500 mb-2">
              <span className="text-5xl md:text-7xl drop-shadow-lg">👶🏻</span>
              <div className="mt-2 flex flex-col items-center">
                <span className="text-[12px] font-black text-pink-500">단 (Dan)</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">6 months</span>
              </div>
            </div>

            <div className="flex flex-col items-center relative group-hover:scale-105 transition-transform duration-700">
              <div className="relative flex flex-col items-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-indigo-500/10 blur-[50px] rounded-full -z-10"></div>
                <span className="text-8xl md:text-[11rem] drop-shadow-2xl">👨🏻‍💼</span>
                <span className="absolute -bottom-4 -right-6 text-5xl md:text-7xl animate-bounce">🫰</span>
              </div>
              <div className="mt-8 bg-white px-10 py-4 rounded-[2rem] shadow-2xl border-2 border-pink-200 flex flex-col items-center">
                 <span className="text-xs font-black text-pink-400 uppercase tracking-widest mb-1">듬직한 내 남편</span>
                 <span className="text-2xl font-black bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                  로직명오
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center group-hover:scale-110 transition-transform duration-500 mb-4">
              <span className="text-6xl md:text-8xl drop-shadow-lg transform -scale-x-100">🧒🏻</span>
              <div className="mt-2 flex flex-col items-center">
                <span className="text-[12px] font-black text-indigo-500">서로 (Seoro)</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">5 years old</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-lg">💬</span>
              실시간 영어 대화
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {LESSON_SCENARIOS.map((lesson) => (
              <div 
                key={lesson.id}
                className={`group glass-card rounded-[3rem] p-8 md:p-10 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-8 relative overflow-hidden border-2 ${lesson.id.includes('grumpy') ? 'border-orange-50 hover:border-orange-200' : 'border-transparent hover:border-pink-200'}`}
                onClick={() => onStartLesson(lesson)}
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-inner group-hover:rotate-12 transition-transform ${lesson.id.includes('grumpy') ? 'bg-orange-100' : 'bg-pink-100'}`}>
                  {lesson.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{lesson.title}</h3>
                  <p className="text-slate-500 font-medium">{lesson.description}</p>
                </div>
                <div className="ml-auto w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-lg">⚡</span>
            집중 학습
          </h3>
          <div 
            onClick={() => onSetView(AppView.QUIZ)}
            className="group bg-slate-900 rounded-[3rem] p-10 text-white h-[420px] flex flex-col justify-between shadow-2xl shadow-slate-300 relative overflow-hidden cursor-pointer active:scale-95 transition-all border-2 border-transparent hover:border-indigo-500/30"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-1/4 -right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 -left-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl mb-6 border border-white/10 group-hover:scale-110 transition-transform text-pink-400">
                ⚡
              </div>
              <h4 className="text-2xl font-black mb-3 leading-tight">무한 문법<br/>스피드 퀴즈</h4>
              <p className="text-slate-400 font-medium leading-relaxed">AI가 생성하는 실시간 퀴즈로<br/>문법 실력을 쑥쑥 키워보세요.</p>
            </div>

            <div className="relative z-10">
               <div className="w-full py-5 bg-indigo-600 group-hover:bg-indigo-500 text-white rounded-[1.5rem] font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-colors">
                도전하기
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
