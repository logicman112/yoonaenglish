
import React, { useState, useEffect } from 'react';
import { AppView, LessonScenario, TranscriptEntry, FeedbackData, GrammarPoint } from './types';
import Dashboard from './components/Dashboard';
import LiveSession from './components/LiveSession';
import FeedbackReport from './components/FeedbackReport';
import GrammarLab from './components/GrammarLab';
import GrammarQuiz from './components/GrammarQuiz';
import YoonaNote from './components/YoonaNote';

// 글로벌 윈도우 타입 확장
// AIStudio 타입을 명시적으로 선언하여 Window 인터페이스 확장 시 발생하는 타입 불일치 오류를 해결합니다.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedLesson, setSelectedLesson] = useState<LessonScenario | null>(null);
  const [transcriptHistory, setTranscriptHistory] = useState<TranscriptEntry[]>([]);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [savedPoints, setSavedPoints] = useState<GrammarPoint[]>([]);
  const [isApiKeyReady, setIsApiKeyReady] = useState(!!process.env.API_KEY);

  // API 키 상태 확인
  useEffect(() => {
    const checkApiKey = async () => {
      if (process.env.API_KEY) {
        setIsApiKeyReady(true);
        return;
      }
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeyReady(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setIsApiKeyReady(true); // 선택 후 즉시 앱 진입 허용
    } else {
      alert("API 키가 설정되어 있지 않습니다. 프로젝트 설정을 확인해주세요.");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('yoona_notes');
    if (saved) {
      try { setSavedPoints(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('yoona_notes', JSON.stringify(savedPoints));
  }, [savedPoints]);

  const toggleSavePoint = (point: GrammarPoint) => {
    setSavedPoints(prev => {
      const isAlreadySaved = prev.some(p => p.id === point.id || p.title === point.title);
      if (isAlreadySaved) return prev.filter(p => p.id !== point.id && p.title !== point.title);
      return [...prev, { ...point, isSaved: true }];
    });
  };

  const startLesson = (lesson: LessonScenario) => {
    setSelectedLesson(lesson);
    setTranscriptHistory([]);
    setFeedback(null);
    setView(AppView.LIVE_SESSION);
  };

  // API 키가 없을 때 보여줄 예쁜 화면
  if (!isApiKeyReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-indigo-50">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl text-center border-2 border-indigo-100">
          <div className="text-6xl mb-8">🔑</div>
          <h1 className="text-2xl font-black text-slate-800 mb-4">API 키가 필요해요!</h1>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
            윤A의 영어 서비스를 이용하려면<br/>
            안전한 API 연결이 필요합니다.
          </p>
          <button 
            onClick={handleOpenKeySelector}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:scale-105 transition-all active:scale-95"
          >
            API 키 설정하기
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            className="block mt-6 text-xs font-bold text-slate-400 hover:text-indigo-500 underline underline-offset-4"
          >
            결제 및 키 발급 안내 보기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-md z-50 border-b border-slate-100 px-6">
        <div className="max-w-6xl mx-auto h-full flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView(AppView.DASHBOARD)}>
            <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-pink-200">A</div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-800">윤A의 영어</h1>
              <span className="text-[10px] font-bold text-pink-500 uppercase">Premium Tutor</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {[{ id: AppView.DASHBOARD, label: '학습 홈' }, { id: AppView.QUIZ, label: '무한 퀴즈' }, { id: AppView.GRAMMAR_LAB, label: '문법 랩' }, { id: AppView.YOONA_NOTE, label: '윤아노트 📝' }].map((nav) => (
              <button key={nav.id} onClick={() => setView(nav.id)} className={`text-sm font-bold relative py-2 transition-all ${view === nav.id ? 'text-pink-600' : 'text-slate-400 hover:text-slate-600'}`}>
                {nav.label}
                {view === nav.id && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-pink-500 rounded-full"></span>}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-500 p-0.5 shadow-md">
               <img className="w-full h-full rounded-[14px] object-cover border-2 border-white" src="https://picsum.photos/seed/yoona/100/100" alt="Profile" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mt-24 mb-10 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {view === AppView.DASHBOARD && <Dashboard onStartLesson={startLesson} onSetView={setView} />}
        {view === AppView.GRAMMAR_LAB && <GrammarLab savedPoints={savedPoints} onSave={toggleSavePoint} />}
        {view === AppView.QUIZ && <GrammarQuiz />}
        {view === AppView.YOONA_NOTE && <YoonaNote savedPoints={savedPoints} onRemove={toggleSavePoint} onGoToLab={() => setView(AppView.GRAMMAR_LAB)} />}
        {view === AppView.LIVE_SESSION && selectedLesson && <LiveSession lesson={selectedLesson} onEnd={(h, f) => { setTranscriptHistory(h); setFeedback(f); setView(AppView.FEEDBACK); }} onCancel={() => setView(AppView.DASHBOARD)} />}
        {view === AppView.FEEDBACK && feedback && <FeedbackReport feedback={feedback} history={transcriptHistory} onRetry={() => selectedLesson && startLesson(selectedLesson)} onClose={() => setView(AppView.DASHBOARD)} />}
      </main>
    </div>
  );
};

export default App;
