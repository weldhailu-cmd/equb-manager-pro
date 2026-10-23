import React, { useState, useEffect } from 'react';
import { PlusCircle, Users, ShoppingBag, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage({ onNavigate }) {
  const { lang } = useLanguage();
  const [savedEqubs, setSavedEqubs] = useState([]);

  useEffect(() => {
    // Synchronize local storage state cleanly
    const storedEqubs = localStorage.getItem('yop_saved_equbs') || localStorage.getItem('all_equbs');
    if (storedEqubs) {
      try {
        const parsed = JSON.parse(storedEqubs);
        if (Array.isArray(parsed)) setSavedEqubs(parsed);
      } catch (e) {
        console.error("Error reading saved equbs", e);
      }
    }
  }, []);

  return (
    <div className="space-y-8 py-4">
      
      {/* Navigation Quick Links */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('create')}
          className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'am' ? 'ዕቁብ' : 'Equb'}</span>
        </button>

        <button
          onClick={() => onNavigate('marketplace')}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>{lang === 'am' ? 'ማርኬትፕሌስ' : 'Marketplace'}</span>
        </button>

        <button
          onClick={() => onNavigate('how-it-works')}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>{lang === 'am' ? 'እንዴት ይሰራል' : 'How it Works'}</span>
        </button>
      </div>

      {/* Hero Header Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Yop <span className="text-amber-400 font-serif font-normal">— Yellow Gold (ቢጫ ወርቅ)</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium">
          {lang === 'am' ? 'የብልጽግና እና የቁጠባ ማዕከል' : 'Hub of Prosperity and Savings'}
        </p>
      </div>

      {/* Cultural & Historical Etymology Section (በጥልቀት የተስተካከለ) */}
      <div className="bg-[#0d1322]/90 border border-amber-500/30 p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur relative overflow-hidden max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-bold mb-3">
          <Sparkles className="w-5 h-5" />
          <h3>
            {lang === 'am' 
              ? 'የ«Yop» (Yellow Gold / ቢጫ ወርቅ) ታሪካዊ እና ስነ-ቃል አውድ፦' 
              : 'Historical & Cultural Etymology of Yop (Yellow Gold):'}
          </h3>
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans space-y-2">
          {lang === 'am' ? (
            <>
              ከጥንታዊው የሳባውያን፣ የአግዓዚያን እና የኢትዮጵያ ታሪካዊ አውድ አንጻር፦ 
              <strong className="text-amber-400"> «ኢት»</strong> ማለት አምላክ/ፈጣሪ ሲሆን፤ 
              <strong className="text-amber-400"> «ዮጵ»</strong> ደግሞ 
              <span className="text-amber-300 font-bold"> «ቢጫ ወርቅ» (የወርቅ ስጦታ / ብልጽግና)</span> ማለት ነው። 
              ሁለቱ ሲጣመሩ <strong className="text-amber-400">«ኢትዮጵያ»</strong> — ለአምላክ የሚሰጥ የወርቅ ስጦታ የሚል ታላቅ ትርጉም ይይዛል። 
              <strong className="text-amber-400"> Yop</strong> — የሀብት፣ የዕቁብ እና የቁጠባ መገኛ ማዕከል!
            </>
          ) : (
            <>
              In ancient Sabaean and Ethiopian history, <strong className="text-amber-400">"Eth"</strong> signifies God/Creator, while <strong className="text-amber-400">"Yop"</strong> stands for <span className="text-amber-300 font-bold">"Yellow Gold" (Gift of Gold & Prosperity)</span>. Together, they form <strong className="text-amber-400">"Ethiopia"</strong> — A golden gift dedicated to God. <strong>Yop</strong> serves as your modern Hub of Prosperity and Savings!
            </>
          )}
        </p>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <button
          onClick={() => onNavigate('create')}
          className="bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 p-5 rounded-2xl font-black text-sm flex items-center justify-between shadow-xl shadow-amber-500/10 cursor-pointer transition transform hover:-translate-y-0.5"
        >
          <span>{lang === 'am' ? 'አዲስ ዕቁብ ፍጠር ➔' : 'Create New Equb ➔'}</span>
          <PlusCircle className="w-5 h-5 text-slate-950" />
        </button>

        <button
          onClick={() => onNavigate('equb-detail')}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 p-5 rounded-2xl font-bold text-sm flex items-center justify-between shadow-xl cursor-pointer transition transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>{lang === 'am' ? 'ንቁ ዕቁቦች' : 'Active Equbs'}</span>
          </div>
          <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full font-mono">
            {savedEqubs.length}
          </span>
        </button>
      </div>

      {/* Trust Notice */}
      <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-center max-w-xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>
          {lang === 'am' 
            ? 'እያንዳንዱ ዕቁብ በምስጢራዊ የይለፍ ቃል የተጠበቀ ነው — አባላት ብቻ መረጃውን ማየት ይችላሉ።' 
            : 'Protected by PIN security — accessible only by registered members.'}
        </span>
      </div>

    </div>
  );
}