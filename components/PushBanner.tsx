
import React from 'react';
import { DAILY_PUSHES } from '../constants';

interface PushBannerProps {
  onSelectTopic: (topic: string) => void;
}

const PushBanner: React.FC<PushBannerProps> = ({ onSelectTopic }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em]">Daily Smart Push</h3>
        </div>
        <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">하루 3회 추천</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DAILY_PUSHES.map((push, i) => (
          <div 
            key={i} 
            className="group glass-card p-6 rounded-[2rem] hover:shadow-xl transition-all cursor-pointer flex flex-col gap-5 border border-white relative overflow-hidden active:scale-95"
            onClick={() => onSelectTopic(push.topic)}
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                {push.icon}
              </div>
              <span className="text-[10px] font-black text-white bg-indigo-600 px-2.5 py-1 rounded-full shadow-md">
                {push.time}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{push.topic}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{push.description}</p>
            </div>
            {/* Background Accent */}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PushBanner;
