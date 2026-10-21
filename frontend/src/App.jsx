import React, { useState } from 'react';
import HomePage from './components/HomePage';
import EqubDetail from './pages/EqubDetail';
import CreateEqubHub from './components/CreateEqubHub';
import Marketplace from './pages/Marketplace';
import { Globe, ArrowLeft, BookOpen } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0b291d] text-white font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
      
      {/* 🌟 Global Header (ዮጵ — ቢጫ ወርቅ ብራንዲንግ) */}
      <header className="border-b border-emerald-800/80 bg-[#113828]/95 backdrop-blur sticky top-0 z-50 px-4 md:px-8 py-3 flex justify-between items-center shadow-xl">
        
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavigate('home')}
        >
          <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-slate-950 text-xl shadow-lg group-hover:scale-105 transition">
            ዮ
          </div>

          <div>
            <h1 className="text-sm md:text-base font-black tracking-wide text-white flex items-center gap-1.5">
              <span>{t("title") || "ዮጵ"}</span>
              <span className="text-xs text-amber-400 font-serif font-bold">({t("slogan") || "ቢጫ ወርቅ"})</span>
            </h1>
            <p className="text-[11px] text-amber-400/90 font-medium">
              {lang === 'am' ? 'የብልጽግና እና የቁጠባ ማዕከል' : 'Hub of Prosperity and Savings'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {currentView !== 'home' && (
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-xs px-3 py-2 rounded-xl border border-amber-400/40 text-amber-300 font-bold transition shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("back_home") || "← መነሻ ገጽ"}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'am' ? 'en' : 'am')}
            className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-800 text-xs px-3.5 py-2 rounded-xl border border-emerald-700/80 transition cursor-pointer font-bold text-emerald-200 shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'am' ? 'English' : 'አማርኛ'}</span>
          </button>
        </div>
      </header>

      {/* 🌟 View Container */}
      <main className="p-2 md:p-6 max-w-6xl mx-auto w-full flex-grow">
        
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
          <div className="bg-[#113828]/90 p-6 md:p-8 rounded-3xl border border-emerald-700/60 shadow-2xl space-y-6 text-emerald-100 max-w-3xl mx-auto my-6">
            <div className="flex items-center gap-3 text-amber-400 border-b border-emerald-800 pb-4">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-xl font-black">{t("nav_how_it_works") || "እንዴት ይሰራል?"}</h2>
            </div>
            
            <div className="space-y-4 text-sm leading-relaxed">
              <p className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80">
                <strong className="text-amber-300">1. ዕቁብ መፍጠር፦</strong> አስተዳዳሪው የዕቁቡን ስም፣ የክፍያ መጠን፣ የአባላት ብዛት እና ምስጢራዊ የይለፍ ቃል በመወሰን ዕቁብ ያዘጋጃል።
              </p>
              <p className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80">
                <strong className="text-amber-300">2. አባላትን ማቀላቀል፦</strong> አባላት በተሰጣቸው ምስጢራዊ የይለፍ ቃል በመጠቀም ብቻ ወደ ዕቁቡ በመግባት ክፍያቸውን በፀደይ ባንክ ወይም በጥሬ ገንዘብ መመዝገባቸውን ያረጋግጣሉ።
              </p>
              <p className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80">
                <strong className="text-amber-300">3. ዕጣ ማውጣት፦</strong> በዕጣ ቀኑ ሲስተሙ በግልጽነት እና በታማኝነት የዕድለኛውን አባል ስም ይለያል።
              </p>
            </div>

            <button
              onClick={() => handleNavigate('home')}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-2xl transition text-sm cursor-pointer shadow-lg"
            >
              {t("back_home") || "ወደ መነሻ ገጽ ተመለስ"}
            </button>
          </div>
        )}

      </main>

      {/* 🦶 Footer */}
      <footer className="text-center text-xs text-emerald-400/60 py-4 border-t border-emerald-900/40">
        ዮጵ (ቢጫ ወርቅ) © {new Date().getFullYear()} | መብቱ በሕግ የተጠበቀ ነው።
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