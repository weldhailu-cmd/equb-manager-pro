import React from "react";
import { 
  Users, 
  Wallet, 
  Calendar, 
  Trophy, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function EqubOverview({ equb, slots = [], onNavigateTab }) {
  // ጠቅላላ የገንዘብ ስሌት
  const totalSlotsCount = slots.length;
  const totalPayoutPool = slots.reduce((acc, curr) => acc + (Number(curr.full_payout_amount) || 0), 0);
  const wonSlotsCount = slots.filter((s) => s.has_won).length;
  const remainingSlotsCount = totalSlotsCount - wonSlotsCount;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. የዕቁብ ጊዜና ሁኔታ Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#113828] to-slate-900 border border-emerald-700/60 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">የዕቁቡ ወቅታዊ ሁኔታ (Active Equb Status)</span>
          </div>
          <h2 className="text-lg font-black text-white">{equb?.name || "ዮፕ ዲጂታል ዕቁብ"}</h2>
          <p className="text-xs text-emerald-200/70 mt-0.5">
            አድራሻ: <span className="text-amber-400 font-semibold">{equb?.address_city || equb?.address || "ሞላሌ"}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 border border-emerald-800/80 px-4 py-2.5 rounded-2xl text-xs">
          <Calendar className="text-amber-400 shrink-0" size={18} />
          <div>
            <p className="text-[10px] text-emerald-300/70 uppercase font-bold">የዕቁቡ የጊዜ ሰሌዳ</p>
            <p className="font-extrabold text-white">
              {equb?.start_date || "2026-01-01"} <span className="text-amber-400">እስከ</span> {equb?.end_date || "2026-12-31"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. ዋና ዋና የስታትስቲክስ ካርዶች (Overview Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Slots */}
        <div className="bg-[#113828]/80 border border-emerald-700/50 p-4 rounded-2xl shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-emerald-300/80 font-bold">ጠቅላላ ስሎቶች</p>
              <h3 className="text-2xl font-black text-white mt-1">{totalSlotsCount}</h3>
            </div>
            <div className="p-2.5 bg-emerald-900/60 border border-emerald-600/40 rounded-xl text-amber-400">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-300">
            <TrendingUp size={12} className="text-emerald-400" />
            <span>በተሳታፊዎች የተያዙ</span>
          </div>
        </div>

        {/* Total Money Pool */}
        <div className="bg-[#113828]/80 border border-emerald-700/50 p-4 rounded-2xl shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-emerald-300/80 font-bold">ጠቅላላ የዕቁብ መጠን</p>
              <h3 className="text-2xl font-black text-amber-400 mt-1">
                {totalPayoutPool.toLocaleString()} <span className="text-xs font-semibold text-white">ብር</span>
              </h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Wallet size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-amber-300/90">
            <span>በየዙሩ የሚሰበሰብ ጠቅላላ</span>
          </div>
        </div>

        {/* Won Slots */}
        <div className="bg-[#113828]/80 border border-emerald-700/50 p-4 rounded-2xl shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-emerald-300/80 font-bold">እጣ የደረሳቸው</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">{wonSlotsCount}</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Trophy size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-300">
            <CheckCircle2 size={12} className="text-emerald-400" />
            <span>ክፍያ የተቀበሉ ስሎቶች</span>
          </div>
        </div>

        {/* Remaining Slots */}
        <div className="bg-[#113828]/80 border border-emerald-700/50 p-4 rounded-2xl shadow-lg backdrop-blur-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-emerald-300/80 font-bold">እጣ የሚጠብቁ</p>
              <h3 className="text-2xl font-black text-amber-300 mt-1">{remainingSlotsCount}</h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-amber-300/80">
            <AlertCircle size={12} className="text-amber-400" />
            <span>ወደፊት እጣ የሚወጣላቸው</span>
          </div>
        </div>
      </div>

      {/* 3. ፈጣን እርምጃዎች (Quick Navigation Shortcuts) */}
      <div className="bg-[#113828]/60 border border-emerald-700/40 p-5 rounded-3xl space-y-3 backdrop-blur-sm">
        <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">ፈጣን አሰሳ እና ማስተዳደሪያ (Quick Navigation)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab("members")}
            className="flex items-center justify-between p-3.5 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/50 rounded-2xl transition cursor-pointer group text-left"
          >
            <span className="text-white group-hover:text-amber-400 transition">👥 አባላትን ይመልከቱ</span>
            <ArrowUpRight size={14} className="text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab("slots")}
            className="flex items-center justify-between p-3.5 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/50 rounded-2xl transition cursor-pointer group text-left"
          >
            <span className="text-white group-hover:text-amber-400 transition">🔢 ስሎቶችን ያስተዳድሩ</span>
            <ArrowUpRight size={14} className="text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab("payments")}
            className="flex items-center justify-between p-3.5 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/50 rounded-2xl transition cursor-pointer group text-left"
          >
            <span className="text-white group-hover:text-amber-400 transition">💳 ክፍያዎችን ያጽድቁ</span>
            <ArrowUpRight size={14} className="text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab("lottery")}
            className="flex items-center justify-between p-3.5 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/50 rounded-2xl transition cursor-pointer group text-left"
          >
            <span className="text-white group-hover:text-amber-400 transition">🎲 እጣ ያውጡ</span>
            <ArrowUpRight size={14} className="text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </button>
        </div>
      </div>
    </div>
  );
}