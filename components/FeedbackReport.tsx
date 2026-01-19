
import React from 'react';
import { FeedbackData, TranscriptEntry } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface FeedbackReportProps {
  feedback: FeedbackData;
  history: TranscriptEntry[];
  onRetry: () => void;
  onClose: () => void;
}

const FeedbackReport: React.FC<FeedbackReportProps> = ({ feedback, history, onRetry, onClose }) => {
  // Mock radar data based on general score for visualization
  const radarData = [
    { subject: 'Grammar', A: feedback.score - 5, fullMark: 100 },
    { subject: 'Fluency', A: feedback.score + 2, fullMark: 100 },
    { subject: 'Vocabulary', A: feedback.score - 2, fullMark: 100 },
    { subject: 'Pronunciation', A: feedback.score, fullMark: 100 },
    { subject: 'Cohesion', A: feedback.score + 5, fullMark: 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Session Report</h2>
        <div className="flex gap-3">
          <button onClick={onRetry} className="px-5 py-2 text-indigo-600 font-semibold border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors">Try Again</button>
          <button onClick={onClose} className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors">Done</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Overall Score</span>
          <div className="relative w-32 h-32 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                <circle 
                  cx="64" cy="64" r="58" fill="transparent" 
                  stroke="#4f46e5" strokeWidth="10" 
                  strokeDasharray={364.4} 
                  strokeDashoffset={364.4 - (364.4 * feedback.score / 100)}
                  strokeLinecap="round"
                />
             </svg>
             <span className="absolute text-3xl font-black text-indigo-600">{feedback.score}</span>
          </div>
          <p className="mt-4 text-slate-600 font-medium leading-relaxed">{feedback.overallSummary}</p>
        </div>

        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-64 md:h-auto">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Proficiency" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
           <h3 className="text-green-800 font-bold mb-4 flex items-center gap-2">
             <span className="p-1 bg-green-200 rounded-full">✨</span> Your Strengths
           </h3>
           <ul className="space-y-3">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-green-700 text-sm">
                   <span className="text-green-500">•</span> {s}
                </li>
              ))}
           </ul>
        </div>
        {/* Areas for Improvement */}
        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
           <h3 className="text-orange-800 font-bold mb-4 flex items-center gap-2">
             <span className="p-1 bg-orange-200 rounded-full">🎯</span> Focus Areas
           </h3>
           <ul className="space-y-3">
              {feedback.improvements.map((s, i) => (
                <li key={i} className="flex gap-2 text-orange-700 text-sm">
                   <span className="text-orange-500">•</span> {s}
                </li>
              ))}
           </ul>
        </div>
      </div>

      {/* Grammar Corrections */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
         <h3 className="text-slate-900 font-bold mb-6 text-xl">Grammar & Phrasing Corrections</h3>
         <div className="space-y-6">
            {feedback.grammarCorrections.map((corr, i) => (
              <div key={i} className="border-l-4 border-indigo-500 pl-4 py-1">
                 <div className="flex flex-col md:flex-row gap-4 mb-2">
                    <div className="flex-1">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">What you said</p>
                       <p className="text-slate-500 italic">"{corr.original}"</p>
                    </div>
                    <div className="flex-1">
                       <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Better alternative</p>
                       <p className="text-indigo-600 font-semibold">{corr.corrected}</p>
                    </div>
                 </div>
                 <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded">{corr.explanation}</p>
              </div>
            ))}
            {feedback.grammarCorrections.length === 0 && (
              <p className="text-slate-400 text-center py-4">Excellent! No major grammar errors detected.</p>
            )}
         </div>
      </div>

      {/* Transcript Review */}
      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 mb-12">
         <h3 className="text-slate-900 font-bold mb-6 text-xl">Full Conversation Transcript</h3>
         <div className="space-y-4 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
            {history.map((entry, idx) => (
              <div key={idx} className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${entry.role === 'user' ? 'text-indigo-500' : 'text-slate-400'}`}>
                  {entry.role === 'user' ? 'You' : 'AI Tutor'}
                </span>
                <p className={`text-sm ${entry.role === 'user' ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                   {entry.text}
                </p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default FeedbackReport;
