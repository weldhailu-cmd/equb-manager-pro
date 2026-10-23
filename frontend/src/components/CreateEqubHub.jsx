import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, 
  ArrowLeft, Percent, Calculator, CheckSquare, Square, MapPin, KeyRound, Eye, EyeOff, HelpCircle, Clock, Calendar, PlusCircle, Users 
} from 'lucide-react';

export default function CreateEqubHub({ lang = 'am', onNavigate, onBack }) {
  const [hubView, setHubView] = useState('select');

  const [equbName, setEqubName] = useState(lang === 'am' ? 'የወርሃዊ 200 ብር እቁብ' : 'Monthly 200 ETB Equb');
  const [cityAddress, setCityAddress] = useState('ሞላሌ');
  const [amount, setAmount] = useState('200');
  
  const [frequency, setFrequency] = useState('monthly');

  // Deposit & Draw Range States
  const [depositStart, setDepositStart] = useState('ቀን 1');
  const [depositEnd, setDepositEnd] = useState('ቀን 5');
  const [drawStart, setDrawStart] = useState('ቀን 6 (06:00 AM)');
  const [drawEnd, setDrawEnd] = useState('ቀን 6 (06:00 PM)');

  // Passwords & Recovery
  const [adminPassword, setAdminPassword] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showMemberPass, setShowMemberPass] = useState(false);
  
  const [securityQuestion, setSecurityQuestion] = useState(lang === 'am' ? 'የመጀመሪያ ትምህርት ቤትዎ ስም ማን ነው?' : 'First school name?');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [showSecurityAnswer, setShowSecurityAnswer] = useState(false);

  const [selectedFeePercent, setSelectedFeePercent] = useState(0.12);

  const numericAmount = parseFloat(amount) || 0;
  const estimatedMembers = 20; 
  const totalPool = numericAmount * estimatedMembers;
  const serviceFeeAmount = (totalPool * selectedFeePercent) / 100;
  const netPoolForWinner = totalPool - serviceFeeAmount;

  const handleFrequencyChange = (e) => {
    const val = e.target.value;
    setFrequency(val);
    if (val === 'daily') {
      setDepositStart('08:00 AM');
      setDepositEnd('06:00 PM');
      setDrawStart('07:00 PM');
      setDrawEnd('08:00 PM');
    } else if (val === 'weekly') {
      setDepositStart('ሰኞ');
      setDepositEnd('እሁድ');
      setDrawStart('እሁድ 06:00 AM');
      setDrawEnd('እሁድ 06:00 PM');
    } else if (val === 'monthly') {
      setDepositStart('ቀን 1');
      setDepositEnd('ቀን 5');
      setDrawStart('ቀን 6 (06:00 AM)');
      setDrawEnd('ቀን 6 (06:00 PM)');
    }
  };

  const handleBack = () => {
    if (hubView === 'form') {
      setHubView('select');
    } else if (onBack) {
      onBack();
    } else if (onNavigate) {
      onNavigate('home');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!securityAnswer.trim()) {
      alert(lang === 'am' ? 'እባክዎ አድሚን ፓስወርድ ሲረሳ የሚሆን የሚስጥር መልስ ያስገቡ!' : 'Please provide a security answer.');
      return;
    }

    const newEqubObj = {
      id: "equb_" + Date.now(),
      name: equbName,
      contributionAmount: numericAmount,
      frequency,
      scheduleConfig: {
        depositRange: `${depositStart} እስከ ${depositEnd}`,
        drawRange: `${drawStart} እስከ ${drawEnd}`
      },
      feePercent: selectedFeePercent,
      adminPassword,
      memberPassword,
      securityQuestion,
      securityAnswer: securityAnswer.trim().toLowerCase(),
      address: cityAddress,
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('yop_saved_equbs') || '[]');
    const updated = [newEqubObj, ...existing];
    localStorage.setItem('yop_saved_equbs', JSON.stringify(updated));
    localStorage.setItem('all_equbs', JSON.stringify(updated));

    try {
      await fetch("http://127.0.0.1:5000/api/equbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newEqubObj.id,
          name: newEqubObj.name,
          amount: `${numericAmount} ETB`,
          frequency,
          depositRange: newEqubObj.scheduleConfig.depositRange,
          drawRange: newEqubObj.scheduleConfig.drawRange,
          address: cityAddress
        })
      });
    } catch (err) {
      console.log("Backend API sync warning:", err);
    }

    alert(lang === 'am' ? 'እቁቡ በተሳካ ሁኔታ ተፈጠረ!' : 'Equb created successfully!');
    if (onNavigate) onNavigate('equb-detail');
  };

  if (hubView === 'select') {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-amber-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'am' ? 'ወደ መነሻ ገጽ' : 'Back to Home'}
          </button>
          <span className="text-xs text-amber-400 font-bold bg-[#0d1322] px-3.5 py-2 rounded-xl border border-amber-500/30">
            ዮጵ ዲጂታል እቁብ ማዕከል
          </span>
        </div>

        <div className="bg-[#0d1322]/95 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-white backdrop-blur">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white">
              {lang === 'am' ? 'ምን ማድረግ ይፈልጋሉ?' : 'Select Equb Service'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'am' ? 'አዲስ ዕቁብ ማቋቋም ወይም ነባር ዕቁቦችን ይመልከቱ' : 'Choose to create a new equb or access active ones'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => setHubView('form')}
              className="bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 p-6 rounded-2xl font-black text-sm flex flex-col justify-between h-44 shadow-xl cursor-pointer transition transform hover:-translate-y-1 text-left group"
            >
              <div className="p-3 bg-slate-950/20 rounded-xl w-fit">
                <PlusCircle className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <span className="block text-base font-black">{lang === 'am' ? 'አዲስ ዕቁብ ማቋቋም ➔' : 'Create New Equb ➔'}</span>
                <span className="text-xs text-slate-900/80 font-normal block mt-1">
                  {lang === 'am' ? 'አዲስ የዲጂታል ዕቁብ ማቋቋሚያ ቅጽ ይሙሉ' : 'Fill setup form for a new digital equb'}
                </span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('equb-detail')}
              className="bg-slate-950 hover:bg-slate-900 border border-amber-500/30 text-amber-400 p-6 rounded-2xl font-bold text-sm flex flex-col justify-between h-44 shadow-xl cursor-pointer transition transform hover:-translate-y-1 text-left group"
            >
              <div className="p-3 bg-amber-500/10 rounded-xl w-fit border border-amber-500/20">
                <Users className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <span className="block text-base font-black text-white">{lang === 'am' ? 'ነባር / ንቁ ዕቁቦች ➔' : 'Active / Existing Equbs ➔'}</span>
                <span className="text-xs text-slate-400 font-normal block mt-1">
                  {lang === 'am' ? 'የተፈጠሩ ዕቁቦችን እና የአባላት ዝርዝር ይመልከቱ' : 'Browse active equbs and slot activities'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-amber-500/30 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'am' ? 'ወደ ዕቁብ ምርጫ' : 'Back to Selection'}
        </button>

        <span className="text-xs text-amber-400 font-bold bg-[#0d1322] px-3.5 py-2 rounded-xl border border-amber-500/30 flex items-center gap-2 shadow-md">
          <span>ዮጵ ዲጂታል እቁብ ስርዓት</span>
        </span>
      </div>

      <div className="bg-[#0d1322]/95 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-white backdrop-blur">
        
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'am' ? 'የእቁብ ማቋቋሚያ ቅጽ' : 'Equb Setup Form'}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            {lang === 'am' ? 'ዮጵ ዲጂታል እቁብ አስተዳደር ስርዓት' : 'Yop Digital Equb Management System'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
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
                onChange={handleFrequencyChange}
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400 transition"
              >
                <option value="daily">{lang === 'am' ? 'ዕለታዊ (Daily - 24 ሰዓት)' : 'Daily (24 Hours)'}</option>
                <option value="weekly">{lang === 'am' ? 'ሳምንታዊ (Weekly)' : 'Weekly'}</option>
                <option value="monthly">{lang === 'am' ? 'ወርሃዊ (Monthly)' : 'Monthly'}</option>
              </select>
            </div>
          </div>

          {/* 🕒 Dynamic Schedule Range Inputs */}
          <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-4">
            <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5">
              {frequency === 'monthly' ? <Calendar className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {lang === 'am' 
                ? (frequency === 'monthly' ? 'የወር የክፍያ እና የዕጣ ማውጫ ቀናት እና ሰዓቶች ገደብ' : frequency === 'weekly' ? 'የሳምንት ቀናት የክፍያ እና የዕጣ ማውጫ ገደብ' : 'የክፍያ እና የዕጣ ማውጫ ሰዓት ገደቦች (ከ ... እስከ ...)')
                : 'Payment & Draw Schedule Ranges'}
            </label>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300 block">
                {lang === 'am' 
                  ? (frequency === 'monthly' ? '1. ብር ገቢ ማድረጊያ የቀናት ገደብ (ለምሳሌ፡ ከ ቀን 1 እስከ ቀን 5):' : frequency === 'weekly' ? '1. ብር ገቢ ማድረጊያ የቀናት ገደብ (ከሰኞ እስከ እሁድ):' : '1. የክፍያ ገቢ ማድረጊያ ሰዓት range (ከስንት ሰዓት እስከ ስንት ሰዓት):')
                  : '1. Deposit Range:'}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={depositStart}
                  onChange={(e) => setDepositStart(e.target.value)}
                  className="bg-slate-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  required
                  value={depositEnd}
                  onChange={(e) => setDepositEnd(e.target.value)}
                  className="bg-slate-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-300 block">
                {lang === 'am' 
                  ? (frequency === 'monthly' ? '2. የዕጣ ማውጫ ቀን እና ሰዓት range (ለምሳሌ፡ ከቀን 6 06:00 AM እስከ 06:00 PM):' : frequency === 'weekly' ? '2. የዕጣ ማውጫ ቀን/ሰዓት (ለምሳሌ፡ እሁድ ማታ):' : '2. የዕጣ ማውጫ ሰዓት range (ከስንት ሰዓት እስከ ስንት ሰዓት):')
                  : '2. Lottery Draw Range:'}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={drawStart}
                  onChange={(e) => setDrawStart(e.target.value)}
                  className="bg-slate-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  required
                  value={drawEnd}
                  onChange={(e) => setDrawEnd(e.target.value)}
                  className="bg-slate-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Percent className="w-4 h-4" />
              {lang === 'am' ? 'የአገልግሎት ክፍያ ፐርሰንት (System Service Fee %)' : 'System Service Fee Percentage'}
            </label>

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
                  className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 pr-10 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-400"
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
                  className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 pr-10 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-400"
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

          <div className="bg-slate-950/60 border border-amber-500/30 p-4 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              {lang === 'am' ? 'የአስተዳዳሪ ፓስወርድ ማገገሚያ (Admin Password Recovery Question)' : 'Admin Password Recovery'}
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <select
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="የመጀመሪያ ትምህርት ቤትዎ ስም ማን ነው?">{lang === 'am' ? 'የመጀመሪያ ትምህርት ቤትዎ ስም ማን ነው?' : 'First school name?'}</option>
                  <option value="የምትወደው ወይም የፍቅር ስምህ (Love Name) ማን ነው?">{lang === 'am' ? 'የምትወደው ወይም የፍቅር ስምህ (Love Name) ማን ነው?' : 'Favorite / Love Name?'}</option>
                  <option value="የምትወደው ቁጥር ስንት ነው?">{lang === 'am' ? 'የምትወደው ቁጥር ስንት ነው?' : 'Favorite number?'}</option>
                </select>
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showSecurityAnswer ? "text" : "password"}
                    required
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder={lang === 'am' ? 'መልስ ያስገቡ...' : 'Enter answer...'}
                    className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3 py-2.5 pr-10 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
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

          {numericAmount > 0 && (
            <div className="bg-slate-950/90 border border-amber-500/30 p-4 rounded-2xl space-y-1.5 text-xs">
              <p className="font-bold text-amber-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" /> {lang === 'am' ? `የእቁብ ስሌት ማጠቃለያ (${selectedFeePercent}% የሲስተም ክፍያ)` : 'Calculation Summary'}
              </p>
              <div className="text-slate-300 space-y-1 pt-1 font-mono">
                <p>{lang === 'am' ? 'ግምታዊ ጠቅላላ መጠን (በ 20 አባላት):' : 'Estimated Total Pool:'} <b className="text-white">{totalPool.toLocaleString()} ብር</b></p>
                <p>{lang === 'am' ? 'የሲስተም አገልግሎት ክፍያ (' + selectedFeePercent + '%):' : 'System Fee:'} <b className="text-amber-400">{serviceFeeAmount.toFixed(2)} ብር</b></p>
                <p>{lang === 'am' ? 'ለዕጣ አሸናፊ የሚደርሰው ንጹህ ገንዘብ:' : 'Net Pool for Winner:'} <b className="text-emerald-400">{netPoolForWinner.toLocaleString()} ብር</b></p>
                <p className="text-amber-300/80 pt-1 text-[11px]">
                  📅 {lang === 'am' 
                    ? `የክፍያ ገደብ፡ ከ ${depositStart} እስከ ${depositEnd} | የዕጣ ማውጫ፡ ከ ${drawStart} እስከ ${drawEnd}` 
                    : `Deposit Window: ${depositStart} - ${depositEnd} | Draw Window: ${drawStart} - ${drawEnd}`}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 rounded-xl transition text-xs shadow-xl cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{lang === 'am' ? 'የእቁብ ስርዓት ማቋቋም (Save Equb System)' : 'Initialize Equb Hub'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}