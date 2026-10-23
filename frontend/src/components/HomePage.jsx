import React, { useState, useEffect } from 'react';
import { PlusCircle, Users, ShoppingBag, BookOpen, Sparkles, ShieldCheck, Megaphone, ShieldAlert, Clock, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage({ onNavigate }) {
  const { lang } = useLanguage();
  const [savedEqubs, setSavedEqubs] = useState([]);
  const [showEqubOptions, setShowEqubOptions] = useState(false);

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
      
      {/* 🌟 Top Horizontal Navigation Bar (ሁሉም አገልግሎቶች በአግድም) */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-slate-900/60 p-2 rounded-2xl border border-amber-500/20 max-w-4xl mx-auto backdrop-blur">
        
        {/* Equb Nav Item */}
        <button
          onClick={() => setShowEqubOptions(!showEqubOptions)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
            showEqubOptions 
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20' 
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'am' ? 'ዕቁብ' : 'Equb'}</span>
        </button>

        {/* Marketplace Nav Item */}
        <button
          onClick={() => { setShowEqubOptions(false); onNavigate('marketplace'); }}
          className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>{lang === 'am' ? 'ማርኬትፕሌስ' : 'Marketplace'}</span>
        </button>

        {/* Telegram Ads Nav Item (Coming Soon) */}
        <button
          onClick={() => { setShowEqubOptions(false); }}
          className="bg-slate-950/80 border border-slate-800/80 text-slate-400 font-medium px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 opacity-80 cursor-not-allowed"
          title="Coming Soon"
        >
          <Megaphone className="w-3.5 h-3.5 text-amber-500/70" />
          <span>{lang === 'am' ? 'ቴሌግራም ፕሮሞሽን' : 'Telegram Ads'}</span>
          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">Soon</span>
        </button>

        {/* Escrow Nav Item (Coming Soon) */}
        <button
          onClick={() => { setShowEqubOptions(false); }}
          className="bg-slate-950/80 border border-slate-800/80 text-slate-400 font-medium px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 opacity-80 cursor-not-allowed"
          title="Coming Soon"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500/70" />
          <span>{lang === 'am' ? 'ዲጂታል Escrow' : 'Digital Escrow'}</span>
          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">Soon</span>
        </button>

        {/* How It Works Nav Item */}
        <button
          onClick={() => { setShowEqubOptions(false); onNavigate('how-it-works'); }}
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

      {/* 🌟 Equb Dual Options Area (ዕቁብ ሲጫን አዲስ ፍጠር ወይም ንቁ ዕቁቦች የሚመጣበት) */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>{lang === 'am' ? 'የዕቁብ አገልግሎቶች' : 'Equb Services'}</span>
          </h2>
          <span className="text-[11px] text-slate-500">
            {lang === 'am' ? 'አንዱን ይምረጡ' : 'Select Option'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Option 1: Create New Equb */}
          <button
            onClick={() => onNavigate('create')}
            className="bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 p-5 rounded-2xl font-black text-sm flex items-center justify-between shadow-xl shadow-amber-500/10 cursor-pointer transition transform hover:-translate-y-0.5 group"
          >
            <div className="text-left">
              <span className="block">{lang === 'am' ? 'አዲስ ዕቁብ ፍጠር ➔' : 'Create New Equb ➔'}</span>
              <span className="text-[11px] text-slate-900/80 font-normal block mt-0.5">
                {lang === 'am' ? 'አዲስ ዲጂታል ዕቁብ ማቋቋም' : 'Set up a new digital equb'}
              </span>
            </div>
            <PlusCircle className="w-6 h-6 text-slate-950 group-hover:scale-110 transition" />
          </button>

          {/* Option 2: Active / Existing Equbs */}
          <button
            onClick={() => onNavigate('equb-detail')}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 p-5 rounded-2xl font-bold text-sm flex items-center justify-between shadow-xl cursor-pointer transition transform hover:-translate-y-0.5 text-left group"
          >
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>{lang === 'am' ? 'ንቁ ዕቁቦች' : 'Active Equbs'}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal block mt-1">
                {lang === 'am' ? 'የተፈጠሩ ዕቁቦችን ይመልከቱ' : 'View existing active equbs'}
              </span>
            </div>
            <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full font-mono border border-amber-500/30">
              {savedEqubs.length}
            </span>
          </button>

        </div>
      </div>

      {/* Upcoming Services Cards (Telegram Ads & Escrow) */}
      <div className="max-w-3xl mx-auto pt-2 space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold text-center">
          {lang === 'am' ? 'በቅርብ ቀን የሚጠብቁ አዳዲስ አገልግሎቶች (COMING SOON)' : 'UPCOMING SERVICES'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Telegram Promotion Hub */}
          <div className="bg-slate-900/60 border border-amber-500/20 p-5 rounded-2xl relative overflow-hidden backdrop-blur flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Megaphone className="w-4 h-4" />
                <span>{lang === 'am' ? 'የቴሌግራም ቻናል ማስተዋወቂያ' : 'Telegram Ad Hub'}</span>
              </div>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Coming Soon
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'am'
                ? 'የቴሌግራም ቻናል ባለቤቶች ቻናላቸውን የሚያስተውቁበት እና ማስታወቂያ የሚያሰራጩበት በኮሚሽን የሚሰራ ዘመናዊ ፕላትፎርም።'
                : 'Monetize and promote Telegram channels seamlessly with automated commission management.'}
            </p>
          </div>

          {/* Digital Asset Escrow Marketplace */}
          <div className="bg-slate-900/60 border border-amber-500/20 p-5 rounded-2xl relative overflow-hidden backdrop-blur flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>{lang === 'am' ? 'የዲጂታል ንብረት Escrow ግብይት' : 'Digital Asset Escrow'}</span>
              </div>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Coming Soon
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'am'
                ? 'የቲክቶክ፣ ዩቲዩብ እና ቴሌግራም አካውንቶችን ያለ ምንም ማጭበርበር በመካከለኛ (Escrow) ጥበቃ የመግዣ እና መሸጫ ማዕከል ።'
                : 'Buy and sell TikTok, YouTube, and Telegram accounts securely via escrow hold protection.'}
            </p>
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