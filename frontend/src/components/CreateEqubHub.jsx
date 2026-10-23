import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, 
  ArrowLeft, Percent, Calculator, CheckSquare, Square, MapPin, KeyRound, Eye, EyeOff, HelpCircle 
} from 'lucide-react';

export default function CreateEqubHub({ lang = 'am', onNavigate, onBack }) {
  const [equbName, setEqubName] = useState(lang === 'am' ? 'የዕለታዊ 200 ብር እቁብ' : 'Daily 200 ETB Equb');
  const [cityAddress, setCityAddress] = useState('ሞላሌ');
  const [amount, setAmount] = useState('200');
  
  // Passwords, Eye Toggles & Security Recovery States
  const [adminPassword, setAdminPassword] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showMemberPass, setShowMemberPass] = useState(false);
  
  // Security Questions Dropdown & Answer
  const [securityQuestion, setSecurityQuestion] = useState(lang === 'am' ? 'የመጀመሪያ ትምህርት ቤትዎ ስም ማን ነው?' : 'What was the name of your first school?');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [showSecurityAnswer, setShowSecurityAnswer] = useState(false);

  const [frequency, setFrequency] = useState(lang === 'am' ? 'ዕለታዊ (Daily - 24 ሰዓት)' : 'Daily (24 Hours)');
  
  // System Service Fee Percentage Checkbox (0.06%, 0.12%, 0.24%)
  const [selectedFeePercent, setSelectedFeePercent] = useState(0.12);

  const numericAmount = parseFloat(amount) || 0;
  const estimatedMembers = 20; 
  const totalPool = numericAmount * estimatedMembers;
  const serviceFeeAmount = (totalPool * selectedFeePercent) / 100;
  const netPoolForWinner = totalPool - serviceFeeAmount;

  const handleBack = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate('home');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!securityAnswer.trim()) {
      alert(lang === 'am' ? 'እባክዎ አድሚን ፓስወርድ ሲረሳ የሚሆን የሚስጥር መልስ ያስገቡ!' : 'Please provide a security answer for password recovery.');
      return;
    }

    const newEqubObj = {
      id: "equb_" + Date.now(),
      name: equbName,
      contributionAmount: numericAmount,
      frequency,
      feePercent: selectedFeePercent,
      adminPassword,
      memberPassword,
      securityQuestion,
      securityAnswer: securityAnswer.trim().toLowerCase(),
      address: cityAddress,
      createdAt: new Date().toISOString()
    };

    // 1. በብራውዘር localStorage ማስቀመጥ
    const existing = JSON.parse(localStorage.getItem('yop_saved_equbs') || '[]');
    const updated = [newEqubObj, ...existing];
    localStorage.setItem('yop_saved_equbs', JSON.stringify(updated));
    localStorage.setItem('all_equbs', JSON.stringify(updated));

    // 2. ለቴሌግራም ቦት እንዲደርስ (በ Backend API በኩል ወደ equbs.json መላክ)
    try {
      await fetch("http://127.0.0.1:5000/api/equbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newEqubObj.id,
          name: newEqubObj.name,
          amount: `${numericAmount} ETB`,
          cycle: frequency,
          address: cityAddress
        })
      });
    } catch (err) {
      console.log("Backend API sync warning (Local storage used):", err);
    }

    alert(lang === 'am' ? 'እቁቡ በተሳካ ሁኔታ ተፈጠረ! ከቴሌግራም ቦት ጋር ተመሳስሏል።' : 'Equb created successfully!');
    if (onNavigate) onNavigate('home');
    else if (onBack) onBack();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Top Navigation Only */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-amber-500/30 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'am' ? 'ወደ ዋና ገጽ' : 'Back'}
        </button>

        <span className="text-xs text-amber-400 font-bold bg-[#0d1322] px-3.5 py-2 rounded-xl border border-amber-500/30 flex items-center gap-2 shadow-md">
          <span>ዮጵ ዲጂታል እቁብ ስርዓት</span>
        </span>
      </div>

      {/* Main Container - Dark Luxury Styling */}
      <div className="bg-[#0d1322]/95 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-white backdrop-blur">
        
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'am' ? 'ፕሮፌሽናል የእቁብ ማቋቋሚያ ቅጽ' : 'Professional Equb Setup Form'}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            {lang === 'am' ? 'ዮጵ ዲጂታል እቁብ አስተዳደር ስርዓት' : 'Yop Digital Equb Management System'}
          </h2>
          <p className="text-xs text-amber-300/80 mt-1 font-serif">
            Yop — Yellow Gold (ቢጫ ወርቅ)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Equb Name & Address */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'am' ? 'የእቁብ ስም (Equb Name) *' : 'Equb Name *'}
              </label>
              <input
                type="text"
                required
                value={equbName}
                onChange={(e) => setEqubName(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'am' ? 'አድራሻ / ከተማ *' : 'City / Address *'}
              </label>
              <input
                type="text"
                required
                value={cityAddress}
                onChange={(e) => setCityAddress(e.target.value)}
                placeholder="ሞላሌ"
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-slate-200 font-bold focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          {/* Contribution Amount & Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'am' ? 'የዋና መጠን (በ 100 ወይም 200 ብር እጥፍ) *' : 'Contribution Amount *'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-amber-400 font-black focus:outline-none focus:border-amber-400 transition"
                />
                <div className="flex gap-1">
                  <button type="button" onClick={() => setAmount('100')} className="bg-slate-900 hover:bg-slate-800 text-xs px-2.5 py-3 rounded-xl text-amber-400 font-bold border border-amber-500/30 cursor-pointer">100</button>
                  <button type="button" onClick={() => setAmount('200')} className="bg-slate-900 hover:bg-slate-800 text-xs px-2.5 py-3 rounded-xl text-amber-400 font-bold border border-amber-500/30 cursor-pointer">200</button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'am' ? 'የሰብስ ጊዜ ድግግሞሽ (Frequency) *' : 'Frequency *'}
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400 transition"
              >
                <option value="ዕለታዊ (Daily - 24 ሰዓት)">{lang === 'am' ? 'ዕለታዊ (Daily - 24 ሰዓት)' : 'Daily (24 Hours)'}</option>
                <option value="ሳምንታዊ (Weekly)">{lang === 'am' ? 'ሳምንታዊ (Weekly)' : 'Weekly'}</option>
                <option value="ወርሃዊ (Monthly)">{lang === 'am' ? 'ወርሃዊ (Monthly)' : 'Monthly'}</option>
              </select>
            </div>
          </div>

          {/* Service Fee Percentage Options */}
          <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Percent className="w-4 h-4" />
              {lang === 'am' ? 'የአገልግሎት ክፍያ ፐርሰንት (System Service Fee %)' : 'System Service Fee Percentage'}
            </label>
            <p className="text-[11px] text-slate-400">
              {lang === 'am' ? 'ከሚከተሉት የፐርሰንት አማራጮች አንዱን በቼክቦክስ ይምረጡ፡' : 'Select fee percentage option:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div 
                onClick={() => setSelectedFeePercent(0.06)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  selectedFeePercent === 0.06 ? 'bg-amber-500/20 border-amber-400 shadow-md' : 'bg-slate-900 border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-amber-300">መሠረታዊ (Basic)</p>
                  <p className="text-sm font-black text-white mt-0.5">0.06%</p>
                </div>
                {selectedFeePercent === 0.06 ? <CheckSquare className="w-5 h-5 text-amber-400" /> : <Square className="w-5 h-5 text-slate-600" />}
              </div>

              <div 
                onClick={() => setSelectedFeePercent(0.12)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  selectedFeePercent === 0.12 ? 'bg-amber-500/20 border-amber-400 shadow-md' : 'bg-slate-900 border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-amber-300">ስታንዳርድ (Standard)</p>
                  <p className="text-sm font-black text-white mt-0.5">0.12%</p>
                </div>
                {selectedFeePercent === 0.12 ? <CheckSquare className="w-5 h-5 text-amber-400" /> : <Square className="w-5 h-5 text-slate-600" />}
              </div>

              <div 
                onClick={() => setSelectedFeePercent(0.24)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  selectedFeePercent === 0.24 ? 'bg-amber-500/20 border-amber-400 shadow-md' : 'bg-slate-900 border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-amber-300">አድቫንስድ (Advanced)</p>
                  <p className="text-sm font-black text-white mt-0.5">0.24%</p>
                </div>
                {selectedFeePercent === 0.24 ? <CheckSquare className="w-5 h-5 text-amber-400" /> : <Square className="w-5 h-5 text-slate-600" />}
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'am' ? 'የአስተዳዳሪ የይለፍ ቃል (Admin Password) *' : 'Admin Password *'}
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? "text" : "password"}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 pr-10 text-xs text-amber-400 focus:outline-none focus:border-amber-400 font-mono transition"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-amber-400 cursor-pointer"
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'am' ? 'የአባል የይለፍ ቃል (Member Password) *' : 'Member Password *'}
              </label>
              <div className="relative">
                <input
                  type={showMemberPass ? "text" : "password"}
                  required
                  value={memberPassword}
                  onChange={(e) => setMemberPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 pr-10 text-xs text-amber-400 focus:outline-none focus:border-amber-400 font-mono transition"
                />
                <button
                  type="button"
                  onClick={() => setShowMemberPass(!showMemberPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-amber-400 cursor-pointer"
                >
                  {showMemberPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Security Question Section */}
          <div className="bg-slate-950/60 border border-amber-500/30 p-4 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              {lang === 'am' ? 'የአስተዳዳሪ ፓስወርድ ማገገሚያ (Admin Password Recovery Question)' : 'Admin Password Recovery'}
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {lang === 'am' ? 'ሚስጥራዊ ጥያቄ ይምረጡ' : 'Select Question'}
                </label>
                <select
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 transition"
                >
                  <option value="የመጀመሪያ ትምህርት ቤትዎ ስም ማን ነው?">{lang === 'am' ? 'የመጀመሪያ ትምህርት ቤትዎ ስም ማን ነው?' : 'First school name?'}</option>
                  <option value="የምትወደው ወይም የፍቅር ስምህ (Love Name) ማን ነው?">{lang === 'am' ? 'የምትወደው ወይም የፍቅር ስምህ (Love Name) ማን ነው?' : 'Favorite / Love Name?'}</option>
                  <option value="የምትወደው ቁጥር ስንት ነው?">{lang === 'am' ? 'የምትወደው ቁጥር ስንት ነው?' : 'Favorite number?'}</option>
                  <option value="የተወለዱበት ከተማ የቱ ነው?">{lang === 'am' ? 'የተወለዱበት ከተማ የቱ ነው?' : 'Birth city?'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {lang === 'am' ? 'ሚስጥራዊ መልስ (Security Answer) *' : 'Security Answer *'}
                </label>
                <div className="relative">
                  <input
                    type={showSecurityAnswer ? "text" : "password"}
                    required
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder={lang === 'am' ? 'መልስ ያስገቡ...' : 'Enter answer...'}
                    className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3 py-2.5 pr-10 text-xs text-slate-200 focus:outline-none focus:border-amber-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecurityAnswer(!showSecurityAnswer)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-amber-400 cursor-pointer"
                  >
                    {showSecurityAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Calculation Preview */}
          {numericAmount > 0 && (
            <div className="bg-slate-950/90 border border-amber-500/30 p-4 rounded-2xl space-y-1.5 text-xs">
              <p className="font-bold text-amber-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" /> {lang === 'am' ? `የእቁብ ስሌት ማጠቃለያ (${selectedFeePercent}% የሲስተም ክፍያ)` : 'Calculation Summary'}
              </p>
              <div className="text-slate-300 space-y-1 pt-1 font-mono">
                <p>{lang === 'am' ? 'ግምታዊ ጠቅላላ መጠን (በ 20 አባላት):' : 'Estimated Total Pool:'} <b className="text-white">{totalPool.toLocaleString()} ብር</b></p>
                <p>{lang === 'am' ? 'የሲስተም አገልግሎት ክፍያ (' + selectedFeePercent + '%):' : 'System Fee:'} <b className="text-amber-400">{serviceFeeAmount.toFixed(2)} ብር</b></p>
                <p>{lang === 'am' ? 'ለዕጣ አሸናፊ የሚደርሰው ንጹህ ገንዘብ:' : 'Net Pool for Winner:'} <b className="text-emerald-400">{netPoolForWinner.toLocaleString()} ብር</b></p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 rounded-xl transition text-xs shadow-xl cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{lang === 'am' ? 'የእቁብ ስርዓት ማቋቋም (Save Equb System)' : 'Initialize Equb Hub'}</span>
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800 text-[11px] text-slate-500">
          Yop (Yellow Gold / ቢጫ ወርቅ) © {new Date().getFullYear()} | All Rights Reserved.
        </div>

      </div>
    </div>
  );
}