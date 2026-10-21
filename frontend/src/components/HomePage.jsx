import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Users, Sparkles, ChevronDown, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage({ onNavigate }) {
  const { t } = useLanguage();
  const [showEqubMenu, setShowEqubMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b291d] text-white font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
      
      {/* 🧭 Top Header / Navigation Bar */}
      <header className="max-w-4xl mx-auto w-full px-6 py-6 flex justify-between items-center relative">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate("home")}>
          <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-slate-950 text-xl shadow-lg">
            ዮ
          </div>
          <div>
            <h1 className="text-base font-black text-white tracking-wide">{t("title") || "ዮጵ"}</h1>
            <p className="text-[11px] text-amber-400 font-bold">{t("slogan") || "ቢጫ ወርቅ"}</p>
          </div>
        </div>

        {/* 🔗 Navigation Links */}
        <div className="flex items-center space-x-2">
          
          {/* 🎯 ዕቁብ Dropdown Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowEqubMenu(!showEqubMenu)}
              className="text-xs bg-emerald-900/80 hover:bg-emerald-800 text-amber-400 px-3.5 py-2 rounded-xl border border-amber-500/30 font-bold transition cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <span>{t("nav_equb") || "ዕቁብ"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showEqubMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Sub-menu options */}
            {showEqubMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0e3526] border border-emerald-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => { setShowEqubMenu(false); onNavigate("dashboard"); }}
                  className="w-full text-left text-xs font-bold text-emerald-200 hover:bg-emerald-800/60 hover:text-amber-400 p-2.5 rounded-xl transition flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>{t("sub_active_equbs") || "ንቁ ዕቁቦች"}</span>
                </button>
                <button
                  onClick={() => { setShowEqubMenu(false); onNavigate("create"); }}
                  className="w-full text-left text-xs font-bold text-emerald-200 hover:bg-emerald-800/60 hover:text-amber-400 p-2.5 rounded-xl transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t("sub_create_equb") || "አዲስ ዕቁብ ፍጠር"}</span>
                </button>
              </div>
            )}
          </div>

          {/* 🛒 ማርኬትፕሌስ */}
          <button 
            onClick={() => onNavigate("market")}
            className="text-xs bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 px-3.5 py-2 rounded-xl border border-emerald-700/60 transition cursor-pointer font-medium"
          >
            {t("nav_market") || "ማርኬትፕሌስ"}
          </button>

          {/* 💡 እንዴት ይሰራል (How it works) */}
          <button 
            onClick={() => onNavigate("how-it-works")}
            className="text-xs bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 px-3.5 py-2 rounded-xl border border-emerald-700/60 transition cursor-pointer font-medium hidden sm:inline-block"
          >
            {t("nav_how_it_works") || "እንዴት ይሰራል"}
          </button>

          {/* ⏳ Coming Soon Buttons */}
          <button 
            disabled 
            className="text-xs bg-emerald-950/40 text-emerald-500/60 px-3 py-2 rounded-xl border border-emerald-900/40 cursor-not-allowed hidden md:flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            <span>Coming Soon</span>
          </button>

        </div>
      </header>

      {/* 🌟 Main Hero Section */}
      <main className="max-w-3xl mx-auto px-6 py-8 w-full text-left my-auto">
        
        {/* Tsedey Bank & Molale Community Tag */}
        <div className="inline-flex items-center gap-2 bg-emerald-800/40 border border-emerald-600/40 text-emerald-300 text-xs px-3.5 py-1.5 rounded-full mb-6 font-medium shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>ለ ፀደይ ባንክ (Tsedey Bank) ማማ ቅርንጫፍ እና ለሞላሌ ማህበረሰብ የተዘጋጀ</span>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          ዮጵ — <span className="text-amber-400">ቢጫ ወርቅ</span>
        </h2>

        {/* 📜 የቃሉ ታሪካዊና መንፈሳዊ ትርጉም (የዲያቆን ዳንኤል ክብረት፣ የሳባውያን እና የኢትዮጵስ ትንተና) */}
        <div className="bg-[#113828]/80 p-6 rounded-3xl border border-emerald-700/50 shadow-xl backdrop-blur-sm mb-8 space-y-3">
          <h3 className="text-amber-400 font-extrabold text-sm md:text-base flex items-center gap-2">
            ✨ የ«ዮጵ» (Yop) ብራንድ ታሪካዊ እና መንፈሳዊ አመጣጥ፦
          </h3>
          <p className="text-xs md:text-sm text-emerald-100 leading-relaxed">
            ከጥንታዊው የሳባውያን፣ የአጋዚያን እና የኢትዮጵስ ታሪክ አውድ አንፃር፦ 
            <strong className="text-amber-300"> «ኢት»</strong> ማለት አምላክ/ፈጣሪ ሲሆን፣ 
            <strong className="text-amber-300"> «ዮጵ»</strong> ደግሞ <strong className="text-amber-400">«ቢጫ ወርቅ»</strong> (የወርቅ ስጦታ/ብልጽግና) ማለት ነው። 
            ሁለቱ ሲጣመሩ <strong className="text-white font-bold">«ኢትዮጵያ» — ለአምላክ የሚሰጥ የወርቅ ስጦታ</strong> የሚል ታላቅ ትርጉም ይይዛል። 
            ዮጵ — የሀብት፣ የዕቁብ እና የቁጠባዎ መገኛ ማዕከል!
          </p>
        </div>

        {/* 🚀 Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate("create")}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 px-6 rounded-2xl text-sm transition shadow-xl cursor-pointer flex items-center justify-center space-x-2 group"
          >
            <span>{t("sub_create_equb") || "አዲስ ዕቁብ ፍጠር"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => onNavigate("dashboard")}
            className="w-full bg-[#164230] hover:bg-[#1b4e3a] text-emerald-300 font-bold py-4 px-6 rounded-2xl text-sm transition border border-emerald-700/60 cursor-pointer flex items-center justify-center space-x-2"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>{t("sub_active_equbs") || "ንቁ ዕቁቦች (Active Equbs)"}</span>
          </button>
        </div>

        {/* 🔐 Trust & Security Badge */}
        <div className="mt-8 flex items-center gap-3 text-xs text-emerald-300/90 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-900/60">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <span>እያንዳንዱ ዕቁብ በምስጢራዊ የይለፍ ቃል የተጠበቀ ነው — አባላት ብቻ መረጃውን ማየት ይችላሉ።</span>
        </div>
      </main>

      {/* 🦶 Footer */}
      <footer className="max-w-3xl mx-auto w-full text-center text-xs text-emerald-400/60 py-6 border-t border-emerald-900/40 px-6">
        ዮጵ (ቢጫ ወርቅ) — ሃይላት © {new Date().getFullYear()} | መብቱ በሕግ የተጠበቀ ነው።
      </footer>

    </div>
  );
}