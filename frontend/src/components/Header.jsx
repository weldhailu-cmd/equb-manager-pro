import React from "react";

export default function Header({ currentView, setCurrentView, lang, setLang, t }) {
  return (
    <header className="border-b border-slate-800 bg-[#0d131f]/90 backdrop-blur px-6 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-40 font-sans">
      
      {/* 🌟 BRAND LOGO & NAME (Yop / ዮጵ) */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView("dashboard")}>
        <div className="bg-amber-400 text-slate-950 font-black text-xl w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
          Y
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight">Yop</h1>
            <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold">
              ዮጵ
            </span>
          </div>
          <span className="text-[11px] text-amber-400 font-bold tracking-wide">
            {lang === "am" ? "ቢጫ ወርቅ — ዲጂታል ዕቁብ ማኔጅመንት ሲስተም" : "Bicha Werk — Digital Equb Management System"}
          </span>
        </div>
      </div>

      {/* 🧭 NAVIGATION LINKS */}
      <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
        <button
          onClick={() => setCurrentView("dashboard")}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
            currentView === "dashboard" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          📊 {t?.navDashboard || (lang === "am" ? "ዳሽቦርድ" : "Dashboard")}
        </button>
        <button
          onClick={() => setCurrentView("draw")}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
            currentView === "draw" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          🎰 {t?.navDraw || (lang === "am" ? "ዕጣ ማውጫ" : "Draw")}
        </button>
        <button
          onClick={() => setCurrentView("market")}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
            currentView === "market" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          🛒 {t?.navMarket || (lang === "am" ? "ማርኬትፕሌስ" : "Marketplace")}
        </button>
        <button
          onClick={() => setCurrentView("rules")}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
            currentView === "rules" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          📜 {t?.navRules || (lang === "am" ? "ደንቦች" : "Rules")}
        </button>
      </nav>

      {/* 🌐 LANGUAGE SWITCHER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setLang(lang === "am" ? "en" : "am")}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl text-amber-400 transition cursor-pointer shadow-sm"
        >
          🌐 {lang === "am" ? "English" : "አማርኛ"}
        </button>
      </div>
    </header>
  );
}