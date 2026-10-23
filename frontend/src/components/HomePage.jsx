import React, { useState, useEffect } from 'react';
import { PlusCircle, Users, ShoppingBag, BookOpen, Sparkles, ShieldCheck, Megaphone, ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage({ onNavigate }) {
  const { lang } = useLanguage();
  const [savedEqubs, setSavedEqubs] = useState([]);

  useEffect(() => {
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
      
      {/* 🌟 Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-slate-900/60 p-2 rounded-2xl border border-amber-500/20 max-w-4xl mx-auto backdrop-blur">
        <button
          onClick={() => onNavigate('create')}
          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'am' ? 'ዕቁብ' : 'Equb'}</span>
        </button>

        <button
          onClick={() => onNavigate('marketplace')}
          className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>{lang === 'am' ? 'ማርኬትፕሌስ' : 'Marketplace'}</span>
        </button>

        <button
          className="bg-slate-950/80 border border-slate-800/80 text-slate-400 font-medium px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 opacity-80 cursor-not-allowed"
          title="Coming Soon"
        >
          <Megaphone className="w-3.5 h-3.5 text-amber-500/70" />
          <span>{lang === 'am' ? 'ቴሌግራም ፕሮሞሽን' : 'Telegram Ads'}</span>
          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">Soon</span>
        </button>

        <button
          className="bg-slate-950/80 border border-slate-800/80 text-slate-400 font-medium px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 opacity-80 cursor-not-allowed"
          title="Coming Soon"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500/70" />
          <span>{lang === 'am' ? 'ዲጂታል Escrow' : 'Digital Escrow'}</span>
          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">Soon</span>
        </button>

        <button
          onClick={() => onNavigate('how-it-works')}
          className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
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
      </div>

      {/* Cultural & Historical Etymology Section */}
      <div className="bg-[#0d1322]/90 border border-amber-500/30 p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur relative overflow-hidden max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-bold mb-3">
          <Sparkles className="w-5 h-5" />
          <h3>
            {lang === 'am' 
              ? 'የ«Yop» (Yellow Gold / ቢጫ ወርቅ) ታሪካዊ እና ስነ-ቃል አውድ፦' 
              : 'Historical & Cultural Etymology of Yop (Yellow Gold):'}
          </h3>
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
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

      {/* 🌟 Horizontal Swap / Carousel Swipe Feature Cards (ዩቲዩብ / ኢንስታግራም ስዋይፕ ስታይል) */}
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            {lang === 'am' ? 'የፕላትፎርሙ አገልግሎቶች (በጎን ስዋይፕ ያድርጉ ➔)' : 'Platform Services (Swipe Horizontal ➔)'}
          </span>
        </div>

        {/* Swipeable Scroll Container */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-amber-500/20 px-1">
          
          {/* Card 1: Equb Hub */}
          <div 
            onClick={() => onNavigate('create')}
            className="snap-center min-w-[280px] md:min-w-[320px] bg-gradient-to-br from-amber-500/20 to-slate-900 border border-amber-500/40 p-6 rounded-3xl shadow-xl hover:border-amber-400 transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex justify-between items-center">
              <span className="p-3 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-500/30">
                <PlusCircle className="w-6 h-6" />
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                {savedEqubs.length} {lang === 'am' ? 'ንቁ ዕቁቦች' : 'Active'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition">
                {lang === 'am' ? 'ዲጂታል ዕቁብ (Equb Hub)' : 'Digital Equb Hub'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {lang === 'am' ? 'አዲስ ዕቁብ ያቋቁሙ ወይም የተፈጠሩ ዕቁቦችን በምስጢራዊ ኮድ ይከታተሉ።' : 'Create or join secure digital equbs with encrypted slots.'}
              </p>
            </div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>{lang === 'am' ? 'ወደ ዕቁብ ግባ' : 'Enter Equb'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Marketplace */}
          <div 
            onClick={() => onNavigate('marketplace')}
            className="snap-center min-w-[280px] md:min-w-[320px] bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-amber-500/40 transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex justify-between items-center">
              <span className="p-3 bg-slate-950 rounded-2xl text-amber-400 border border-slate-800">
                <ShoppingBag className="w-6 h-6" />
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-full">
                Market
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition">
                {lang === 'am' ? 'ማርኬትፕሌስ (Marketplace)' : 'Marketplace'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {lang === 'am' ? 'የተለያዩ ምርቶች እና አገልግሎቶች የሚገበያዩበት ክፍት ገበያ።' : 'Explore products and services in a unified digital market.'}
              </p>
            </div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>{lang === 'am' ? 'ወደ ገበያ ግባ' : 'Visit Market'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Telegram Promotion Hub */}
          <div className="snap-center min-w-[280px] md:min-w-[320px] bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4 opacity-90">
            <div className="flex justify-between items-center">
              <span className="p-3 bg-slate-950 rounded-2xl text-amber-400 border border-slate-800">
                <Megaphone className="w-6 h-6" />
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Coming Soon
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {lang === 'am' ? 'የቴሌግራም ቻናል ማስተዋወቂያ' : 'Telegram Ad Hub'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {lang === 'am'
                  ? 'የቴሌግራም ቻናል ባለቤቶች ቻናላቸውን የሚያስተውቁበት በኮሚሽን የሚሰራ ፕላትፎርም።'
                  : 'Monetize and promote Telegram channels with commission tools.'}
              </p>
            </div>
            <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <span>Coming Soon</span>
            </div>
          </div>

          {/* Card 4: Digital Asset Escrow */}
          <div className="snap-center min-w-[280px] md:min-w-[320px] bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4 opacity-90">
            <div className="flex justify-between items-center">
              <span className="p-3 bg-slate-950 rounded-2xl text-amber-400 border border-slate-800">
                <ShieldAlert className="w-6 h-6" />
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Coming Soon
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {lang === 'am' ? 'የዲጂታል ንብረት Escrow' : 'Digital Asset Escrow'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {lang === 'am'
                  ? 'የቲክቶክ፣ ዩቲዩብ እና ቴሌግራም አካውንቶችን በመካከለኛ (Escrow) ጥበቃ የመግዣ ማዕከል ።'
                  : 'Buy & sell social accounts safely via escrow hold.'}
              </p>
            </div>
            <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <span>Coming Soon</span>
            </div>
          </div>

        </div>
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