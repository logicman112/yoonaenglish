
import React, { useState, useEffect } from 'react';
import { AppView, LessonScenario, TranscriptEntry, FeedbackData, GrammarPoint } from './types';
import Dashboard from './components/Dashboard';
import LiveSession from './components/LiveSession';
import FeedbackReport from './components/FeedbackReport';
import GrammarLab from './components/GrammarLab';
import GrammarQuiz from './components/GrammarQuiz';
import YoonaNote from './components/YoonaNote';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedLesson, setSelectedLesson] = useState<LessonScenario | null>(null);
  const [transcriptHistory, setTranscriptHistory] = useState<TranscriptEntry[]>([]);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [savedPoints, setSavedPoints] = useState<GrammarPoint[]>([]);

  // 로컬 스토리지에서 저장된 문법 포인트 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('yoona_notes');
    if (saved) {
      try {
        setSavedPoints(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load notes", e);
      }
    }
  }, []);

  // 저장된 포인트가 변경될 때마다 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem('yoona_notes', JSON.stringify(savedPoints));
  }, [savedPoints]);

  const toggleSavePoint = (point: GrammarPoint) => {
    setSavedPoints(prev => {
      const isAlreadySaved = prev.some(p => p.id === point.id || p.title === point.title);
      if (isAlreadySaved) {
        return prev.filter(p => p.id !== point.id && p.title !== point.title);
      } else {
        return [...prev, { ...point, isSaved: true }];
      }
    });
  };

  const startLesson = (lesson: LessonScenario) => {
    setSelectedLesson(lesson);
    setTranscriptHistory([]);
    setFeedback(null);
    setView(AppView.LIVE_SESSION);
  };

  const handleSessionEnd = (history: TranscriptEntry[], feedbackData: FeedbackData | null) => {
    setTranscriptHistory(history);
    setFeedback(feedbackData);
    setView(AppView.FEEDBACK);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-md z-50 border-b border-slate-100 px-6">
        <div className="max-w-6xl mx-auto h-full flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setView(AppView.DASHBOARD)}
          >
            <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-pink-200 group-hover:scale-105 transition-transform">A</div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-800 leading-none">윤A의 영어</h1>
              <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">Premium Tutor</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: AppView.DASHBOARD, label: '학습 홈' },
              { id: AppView.QUIZ, label: '무한 퀴즈' },
              { id: AppView.GRAMMAR_LAB, label: '문법 랩' },
              { id: AppView.YOONA_NOTE, label: '윤아노트 📝' }
            ].map((nav) => (
              <button 
                key={nav.id}
                onClick={() => setView(nav.id)}
                className={`text-sm font-bold relative py-2 transition-all ${view === nav.id ? 'text-pink-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {nav.label}
                {view === nav.id && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-pink-500 rounded-full"></span>}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-slate-800">정윤아 님</span>
              <span className="text-[10px] text-pink-500 font-bold">노트 {savedPoints.length}개 저장됨</span>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-500 p-0.5 shadow-md">
               <img className="w-full h-full rounded-[14px] object-cover border-2 border-white" src="https://picsum.photos/seed/yoona/100/100" alt="Profile" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mt-24 mb-10 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {view === AppView.DASHBOARD && <Dashboard onStartLesson={startLesson} onSetView={setView} />}
        {view === AppView.GRAMMAR_LAB && (
          <GrammarLab 
            savedPoints={savedPoints} 
            onSave={toggleSavePoint} 
          />
        )}
        {view === AppView.QUIZ && <GrammarQuiz />}
        {view === AppView.YOONA_NOTE && (
          <YoonaNote 
            savedPoints={savedPoints} 
            onRemove={toggleSavePoint} 
            onGoToLab={() => setView(AppView.GRAMMAR_LAB)}
          />
        )}
        {view === AppView.LIVE_SESSION && selectedLesson && (
          <LiveSession 
            lesson={selectedLesson} 
            onEnd={handleSessionEnd}
            onCancel={() => setView(AppView.DASHBOARD)}
          />
        )}
        {view === AppView.FEEDBACK && feedback && (
          <FeedbackReport 
            feedback={feedback} 
            history={transcriptHistory}
            onRetry={() => selectedLesson && startLesson(selectedLesson)}
            onClose={() => setView(AppView.DASHBOARD)}
          />
        )}
      </main>

      <footer className="bg-white/50 border-t border-slate-100 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="text-sm font-bold text-slate-800">윤A의 영어</span>
          </div>
          <p className="text-slate-400 text-xs font-medium tracking-wide">
            © 2024 윤A의 영어. AI-Powered Grammar Perfection.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
