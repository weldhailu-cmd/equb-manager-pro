import React, { useState } from 'react';
import HomePage from './components/HomePage';
import EqubDetail from './pages/EqubDetail';
import CreateEqubHub from './components/CreateEqubHub';
import Marketplace from './pages/Marketplace';
import { Globe, ArrowLeft, BookOpen, ShieldCheck } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext.jsx';

function MainApp() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'equb-detail', 'create', 'marketplace', 'how-it-works'
  const [routeParams, setRouteParams] = useState(null);
  const { lang, setLang, t } = useLanguage();

  const handleNavigate = (view, params = null) => {
    setRouteParams(params);
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between relative overflow-x-hidden">
      
      {/* 🌟 Banknote-Style Guilloché Line Grid Background Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.07] z-0 flex items-center justify-center">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="guilloche" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 0 60 C 30 10, 90 110, 120 60 C 90 10, 30 110, 0 60 Z" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
              <circle cx="60" cy="60" r="45" fill="none" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2 2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#guilloche)" />
        </svg>
      </div>

      {/* 🌟 Global Header (Yop — Yellow Gold Branding) */}
      <header className="border-b border-amber-500/20 bg-[#0d131f]/95 backdrop-blur sticky top-0 z-50 px-4 md:px-8 py-3.5 flex justify-between items-center shadow-2xl relative">
        
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavigate('home')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition transform">
            Y
          </div>

          <div>
            <h1 className="text-sm md:text-base font-black tracking-wide text-white flex items-center gap-1.5">
              <span className="text-amber-400 font-extrabold text-lg">Yop</span>
              <span className="text-xs text-amber-300/90 font-serif font-bold">
                (Yellow Gold / ቢጫ ወርቅ)
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              {lang === 'am' ? 'የብልጽግና እና የቁጠባ ማዕከል' : 'Hub of Prosperity and Savings'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {currentView !== 'home' && (
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-xs px-3.5 py-2 rounded-xl border border-amber-500/30 text-amber-400 font-bold transition cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'am' ? '← መነሻ ገጽ' : '← Home'}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'am' ? 'en' : 'am')}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-xs px-3.5 py-2 rounded-xl border border-slate-700/80 transition cursor-pointer font-bold text-amber-400 shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'am' ? 'English' : 'አማርኛ'}</span>
          </button>
        </div>
      </header>

      {/* 🌟 Main Content Area */}
      <main className="p-3 md:p-6 max-w-6xl mx-auto w-full flex-grow relative z-10">
        
        {/* መነሻ ገጽ (Home) */}
        {currentView === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {/* የዕቁብ ዝርዝር መረጃ (Equb Detail) */}
        {currentView === 'equb-detail' && (
          <EqubDetail key={routeParams?.equbId || 'detail'} routeParams={routeParams} onNavigate={handleNavigate} />
        )}

        {/* አዲስ ዕቁብ መፍጠሪያ (Create Equb) */}
        {(currentView === 'create' || currentView === 'create-full' || currentView === 'create-form') && (
          <CreateEqubHub lang={lang} onNavigate={handleNavigate} />
        )}

        {/* ማርኬትፕሌስ (Marketplace) */}
        {(currentView === 'marketplace' || currentView === 'market') && (
          <Marketplace lang={lang} onNavigate={handleNavigate} />
        )}

        {/* እንዴት ይሰራል (How it Works) */}
        {(currentView === 'how-it-works' || currentView === 'rules') && (
          <div className="bg-[#0f172a]/90 p-6 md:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 text-slate-200 max-w-3xl mx-auto my-6 backdrop-blur">
            <div className="flex items-center gap-3 text-amber-400 border-b border-slate-800 pb-4">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-xl font-black">{lang === 'am' ? 'እንዴት ይሰራል?' : 'How It Works'}</h2>
            </div>
            
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/20">
                <strong className="text-amber-400 block mb-1">
                  1. {lang === 'am' ? 'ዕቁብ መፍጠር' : 'Create Equb'}:
                </strong>
                {lang === 'am' 
                  ? 'የዕቁቡን ስም፣ አዋጭ መጠን እና የአባላት ብዛት በመወሰን ዲጂታል ዕቁብ ያዘጋጁ።'
                  : 'Define the equb name, share contribution amount, and participant structure.'}
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/20">
                <strong className="text-amber-400 block mb-1">
                  2. {lang === 'am' ? 'አባላትን መመዝገብ' : 'Register Members'}:
                </strong>
                {lang === 'am' 
                  ? 'አባላትን በየስሎቱ በመመደብ ክፍያዎችን በግልጽነት ይከታተሉ።'
                  : 'Assign members into slots and track payments seamlessly.'}
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/20">
                <strong className="text-amber-400 block mb-1">
                  3. {lang === 'am' ? 'የዕጣ መንኰራኩር' : 'Lottery Spin Wheel'}:
                </strong>
                {lang === 'am' 
                  ? 'በዕጣ ቀን በሲስተሙ ግልጽነት ባለው መንኰራኩር አሸናፊውን ይለዩ።'
                  : 'Spin the dynamic wheel to select random winners transparently.'}
              </div>
            </div>

            <button
              onClick={() => handleNavigate('home')}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-2xl transition text-sm cursor-pointer shadow-lg shadow-amber-500/20"
            >
              {lang === 'am' ? 'ወደ መነሻ ገጽ ተመለስ' : 'Back to Home'}
            </button>
          </div>
        )}

      </main>

      {/* 🦶 Footer */}
      <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-800/80 relative z-10 bg-[#070a0f]">
        Yop (Yellow Gold / ቢጫ ወርቅ) © {new Date().getFullYear()} | All Rights Reserved.
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}