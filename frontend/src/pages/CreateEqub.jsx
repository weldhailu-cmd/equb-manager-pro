import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, Calculator, Award, Loader2, Globe, Clock } from 'lucide-react';

export default function CreateEqub({ lang = 'am', onNavigate, onBack }) {
  const [equbName, setEqubName] = useState(lang === 'am' ? 'የዕለታዊ 200 ብር እቁብ' : 'Daily 200 ETB Equb');
  const [amount, setAmount] = useState('200');
  const [membersCount, setMembersCount] = useState('20');
  const [adminPassword, setAdminPassword] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [frequency, setFrequency] = useState('daily');
  
  // 🌟 የዕጣ ማውጫ ሰዓት ሰሌዳ እና መስኮት (Draw Time Windows)
  const [drawStartTime, setDrawStartTime] = useState('17:00'); // በነባሪ ከሰዓት 11:00 (17:00)
  const [drawWindowHours, setDrawWindowHours] = useState('4');   // የ4 ሰዓት መስኮት
  const [weeklyDay, setWeeklyDay] = useState('Sunday');         // ለሳምንታዊ
  const [monthlyEthiopicDay, setMonthlyEthiopicDay] = useState('1'); // ለወርሃዊ (ከ1 እስከ 30)

  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState('standard');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const getFeeRate = (tier) => {
    switch (tier) {
      case 'advanced': return 0.0025; // 0.25%
      case 'vip': return 0.005;      // 0.50%
      case 'standard':
      default: return 0.0012;      // 0.12%
    }
  };

  const serviceFeePercent = getFeeRate(selectedTier);
  const numericAmount = parseFloat(amount) || 0;
  const numericMembers = parseInt(membersCount, 10) || 0;
  const totalPool = numericAmount * numericMembers;
  const serviceFeeAmount = totalPool * serviceFeePercent;
  const netPoolForWinner = totalPool - serviceFeeAmount;

  const handleBack = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate('dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert(lang === 'am' ? 'እባክዎ ውል እና ደንብ ይስማሙ' : 'Please agree to terms and conditions');
      return;
    }

    setLoading(true);

    const newEqubPayload = {
      name: equbName,
      address: 'Yop Platform',
      contributionAmount: numericAmount,
      totalMembers: numericMembers,
      frequency: frequency,
      serviceFee: (serviceFeePercent * 100).toFixed(2),
      adminPassword: adminPassword,
      memberPassword: memberPassword,
      // 🌟 የጊዜ ሰሌዳ ውሂቦች
      drawStartTime: drawStartTime,
      drawWindowHours: parseInt(drawWindowHours, 10),
      weeklyDay: frequency === 'weekly' ? weeklyDay : null,
      monthlyEthiopicDay: frequency === 'monthly' ? parseInt(monthlyEthiopicDay, 10) : null,
      startDate: new Date().toISOString(),
      members: [],
      pastWinners: []
    };

    try {
      // 🚀 ወደ FastAPI Backend የሚደረግ API ጥሪ
      const response = await fetch('http://localhost:8000/api/equbs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEqubPayload),
      });

      if (response.ok) {
        const savedEqub = await response.json();
        
        // 💾 ለአካባቢያዊ ብራውዘር እና ለቴሌግራም ሚኒ አፕ የጋራ ማህደር (localStorage) ማስቀመጥ
        const storedEqubs = JSON.parse(localStorage.getItem('yop_saved_equbs') || localStorage.getItem('all_equbs') || '[]');
        const updatedEqubs = [...storedEqubs, savedEqub];
        localStorage.setItem('yop_saved_equbs', JSON.stringify(updatedEqubs));
        localStorage.setItem('all_equbs', JSON.stringify(updatedEqubs));

        alert(lang === 'am' ? 'እቁቡ በተሳካ ሁኔታ ተፈጠረ!' : 'Equb created successfully!');
        if (onNavigate) onNavigate('dashboard');
        else if (onBack) onBack();
      } else {
        alert(lang === 'am' ? 'እቁብ ለመፍጠር ሲሞከር ስህተት ተፈጥሯል' : 'Failed to create Equb on server');
      }
    } catch (error) {
      console.error("FastAPI Backend Connection Error:", error);
      
      // ከሰርቨር ጋር መገናኘት ካልተቻለ በ offline mode በ localStorage ብቻ መያዝ
      const offlineEqub = { id: Date.now().toString(), ...newEqubPayload };
      const storedEqubs = JSON.parse(localStorage.getItem('yop_saved_equbs') || localStorage.getItem('all_equbs') || '[]');
      const updatedEqubs = [...storedEqubs, offlineEqub];
      localStorage.setItem('yop_saved_equbs', JSON.stringify(updatedEqubs));
      localStorage.setItem('all_equbs', JSON.stringify(updatedEqubs));

      alert(lang === 'am' ? 'እቁቡ በአካባቢያዊ ማህደር (Offline) ተመዝግቧል!' : 'Equb saved locally (Offline mode)!');
      if (onNavigate) onNavigate('dashboard');
      else if (onBack) onBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'am' ? 'ወደ ዋና ገጽ' : 'Back'}
        </button>

        <span className="text-xs text-amber-400 font-bold bg-emerald-950 px-3.5 py-2 rounded-xl border border-emerald-800 flex items-center gap-2 shadow-md">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>ዮጵ (Yop.com) — ዲጂታል ፕላትፎርም</span>
        </span>
      </div>

      {/* Main Form Box */}
      <div className="bg-[#113828]/95 border border-emerald-700/60 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-white">
        
        <div className="border-b border-emerald-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'am' ? 'አዲስ የእቁብ ማቋቋሚያ ቅጽ' : 'New Equb Setup Form'}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            {lang === 'am' ? 'ዮጵ (Yop.com) ዲጂታል እቁብ አስተዳደር ስርዓት' : 'Yop.com Digital Equb Management System'}
          </h2>
          <p className="text-xs text-emerald-300 mt-1">
            Yop.com — የቢጫ ወርቅ ዲጂታል ማዕከል
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-emerald-200 mb-1">
              {lang === 'am' ? 'የእቁብ ስም (Equb Name) *' : 'Equb Name *'}
            </label>
            <input
              type="text"
              required
              value={equbName}
              onChange={(e) => setEqubName(e.target.value)}
              className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-bold text-amber-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                {lang === 'am' ? 'የመዋጮ መጠን (Contribution Amount) *' : 'Contribution Amount *'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-black text-amber-400"
                />
                <div className="flex gap-1">
                  <button type="button" onClick={() => setAmount('100')} className="bg-emerald-900 hover:bg-emerald-800 text-xs px-2.5 py-3 rounded-xl text-emerald-200 font-bold border border-emerald-700 cursor-pointer">100</button>
                  <button type="button" onClick={() => setAmount('200')} className="bg-emerald-900 hover:bg-emerald-800 text-xs px-2.5 py-3 rounded-xl text-emerald-200 font-bold border border-emerald-700 cursor-pointer">200</button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                {lang === 'am' ? 'የአባላት ብዛት (Members Count) *' : 'Members Count *'}
              </label>
              <input
                type="number"
                required
                value={membersCount}
                onChange={(e) => setMembersCount(e.target.value)}
                placeholder="20"
                className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 🔄 የክፍያ ድግግሞሽ እና የዕጣ ማውጫ ሰዓት ሰሌዳ */}
          <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-2xl space-y-4">
            <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {lang === 'am' ? 'የዕጣ ማውጫ ጊዜና ሰዓት ሰሌዳ' : 'Draw Schedule & Time Window'}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">የሰብስ ጊዜ ድግግሞሽ (Frequency) *</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-emerald-900 border border-emerald-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="daily">{lang === 'am' ? 'ዕለታዊ (Daily)' : 'Daily'}</option>
                  <option value="weekly">{lang === 'am' ? 'ሳምንታዊ (Weekly)' : 'Weekly'}</option>
                  <option value="monthly">{lang === 'am' ? 'ወርሃዊ - በኢትዮጵያ አቆጣጠር (Monthly)' : 'Monthly (Ethiopic)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">የዕጣ ማውጫ መነሻ ሰዓት (Start Time) *</label>
                <input
                  type="time"
                  required
                  value={drawStartTime}
                  onChange={(e) => setDrawStartTime(e.target.value)}
                  className="w-full bg-emerald-900 border border-emerald-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>
            </div>

            {frequency === 'weekly' && (
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">የዕጣ ማውጫ ሳምንታዊ ቀን (Weekly Day) *</label>
                <select
                  value={weeklyDay}
                  onChange={(e) => setWeeklyDay(e.target.value)}
                  className="w-full bg-emerald-900 border border-emerald-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Sunday">እሁድ (Sunday)</option>
                  <option value="Monday">ሰኞ (Monday)</option>
                  <option value="Tuesday">ማክሰኞ (Tuesday)</option>
                  <option value="Wednesday">ረቡዕ (Wednesday)</option>
                  <option value="Thursday">ሐሙስ (Thursday)</option>
                  <option value="Friday">አርብ (Friday)</option>
                  <option value="Saturday">ቅዳሜ (Saturday)</option>
                </select>
              </div>
            )}

            {frequency === 'monthly' && (
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">የዕጣ ማውጫ ወርሃዊ ቀን - በኢትዮጵያ አቆጣጠር (ከ1 እስከ 30) *</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={monthlyEthiopicDay}
                  onChange={(e) => setMonthlyEthiopicDay(e.target.value)}
                  placeholder="ምሳሌ፦ 1 ወይም 27"
                  className="w-full bg-emerald-900 border border-emerald-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>
            )}

            <div className="text-[11px] text-emerald-300 bg-emerald-900/60 p-3 rounded-xl border border-emerald-800">
              💡 <b>የ4 ሰዓት የዕጣ መስኮት፡</b> ዕጣው ከጀመረበት ሰዓት ጀምሮ ለ{drawWindowHours} ሰዓት ክፍያዎች ይጣራሉ፤ ያልከፈሉ ይነገራቸዋል፤ መስኮቱ ሲዘጋ ዕጣው ይወጣል!
            </div>
          </div>

          {/* 3 Tier Service Fee Selection */}
          <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              {lang === 'am' ? 'የሲስተም እና ደህንነት ክፍያ ደረጃዎች (System Fee Tiers)' : 'System Fee Options'}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div 
                onClick={() => setSelectedTier('standard')}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedTier === 'standard' ? 'bg-emerald-900 border-amber-400 shadow-md' : 'bg-emerald-950/60 border-emerald-800 opacity-70 hover:opacity-100'
                }`}
              >
                <p className="text-xs font-bold text-amber-300">መሠረታዊ (Standard)</p>
                <p className="text-sm font-black text-white mt-1">0.12%</p>
                <p className="text-[10px] text-emerald-200 mt-1">የሲስተም ማስተዳደሪያ</p>
              </div>

              <div 
                onClick={() => setSelectedTier('advanced')}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedTier === 'advanced' ? 'bg-emerald-900 border-amber-400 shadow-md' : 'bg-emerald-950/60 border-emerald-800 opacity-70 hover:opacity-100'
                }`}
              >
                <p className="text-xs font-bold text-amber-300">ፕሪሚየም (Advanced)</p>
                <p className="text-sm font-black text-white mt-1">0.25%</p>
                <p className="text-[10px] text-emerald-200 mt-1">የላቀ የደህንነት ዋስትና</p>
              </div>

              <div 
                onClick={() => setSelectedTier('vip')}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedTier === 'vip' ? 'bg-emerald-900 border-amber-400 shadow-md' : 'bg-emerald-950/60 border-emerald-800 opacity-70 hover:opacity-100'
                }`}
              >
                <p className="text-xs font-bold text-amber-300">ቪአይፒ / ድርጅታዊ (VIP)</p>
                <p className="text-sm font-black text-white mt-1">0.50%</p>
                <p className="text-[10px] text-emerald-200 mt-1">ልዩ ቅድሚያ ድጋፍ</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                {lang === 'am' ? 'የአስተዳዳሪ የይለፍ ቃል *' : 'Admin Password *'}
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                {lang === 'am' ? 'የአባል የይለፍ ቃል' : 'Member Password'}
              </label>
              <input
                type="password"
                value={memberPassword}
                onChange={(e) => setMemberPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {numericAmount > 0 && numericMembers > 0 && (
            <div className="bg-emerald-900/40 border border-emerald-700/60 p-4 rounded-2xl space-y-1.5 text-xs">
              <p className="font-bold text-amber-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" /> 
                {lang === 'am' ? `የእቁብ ስሌት ማጠቃለያ (${(serviceFeePercent * 100).toFixed(2)}% የሲስተም ክፍያ ተካትቷል)` : 'Calculation Summary'}
              </p>
              <div className="text-emerald-200 space-y-1 pt-1">
                <p>{lang === 'am' ? 'ጠቅላላ የገንዘብ መጠን (Total Pool):' : 'Total Pool:'} <b>{totalPool.toLocaleString()} ብር</b></p>
                <p>{lang === 'am' ? 'የሲስተም አገልግሎት ክፍያ:' : 'System Fee:'} <b className="text-amber-300">{serviceFeeAmount.toFixed(2)} ብር</b></p>
                <p>{lang === 'am' ? 'ለዕጣ አሸናፊ የሚደርሰው ንጹህ ገንዘብ:' : 'Net Pool for Winner:'} <b className="text-emerald-400">{netPoolForWinner.toLocaleString()} ብር</b></p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded bg-emerald-950 border-emerald-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-emerald-200 cursor-pointer">
              {lang === 'am' 
                ? 'የ Yop.com አገልግሎት ውል እና ደንብ እስማማለሁ።' 
                : 'I agree to the terms and conditions of Yop.com.'}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl transition text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            <span>{lang === 'am' ? 'የእቁብ ስርዓት ማቋቋም (Initialize Hub)' : 'Initialize Equb Hub'}</span>
          </button>
        </form>

        <div className="text-center pt-4 border-t border-emerald-800 text-[11px] text-emerald-300">
          © <b>Yop.com</b> — ሁሉም መብቶች የተጠበቁ ናቸው።
        </div>

      </div>
    </div>
  );
}