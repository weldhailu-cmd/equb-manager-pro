import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, RefreshCw, CheckCircle2, Clock, ShieldAlert, ArrowLeft, Users, Award } from "lucide-react";

export default function Lottery() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [animationName, setAnimationName] = useState("እየተሽከረከረ ነው...");

  // የናሙና አባላት (በእውነተኛ ዳታቤዝ ወይም localStorage ሊተካ የሚችል)
  const [eligibleParticipants, setEligibleParticipants] = useState([
    { id: 1, name: "አበበ ከበደ", phone: "+251911223344", status: "eligible" },
    { id: 2, name: "መከተ አሰፋ", phone: "+251922334455", status: "eligible" },
    { id: 3, name: "ሰላማዊት ታደሰ", phone: "+251933445566", status: "eligible" },
    { id: 4, name: "ዮናስ አለሙ", phone: "+251944556677", status: "eligible" },
  ]);

  const [pastWinners, setPastWinners] = useState([
    { id: 101, name: "ከበደ መኮንን", phone: "+251912345678", wonDate: "መስከረም 10, 2019" },
    { id: 102, name: "ዘላለም ታደሰ", phone: "+251918765432", wonDate: "መስከረም 11, 2019" },
  ]);

  const [unpaidMembers, setUnpaidMembers] = useState([
    { id: 201, name: "ዳዊት መለሰ", phone: "+251915554433", reason: "የሰዓት ገደብ አልፋል (ውዝፍ)" },
  ]);

  // የዕጣ ማውጫ ሎጂክ እና የአኒሜሽን ማቀናበሪያ
  const handleRunLottery = () => {
    if (eligibleParticipants.length === 0) {
      alert("ለዕጣ ብቁ የሆነ ተወዳዳሪ የለም!");
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    // ስሞች በሳጥኑ ውስጥ ሲሽከረከሩ የሚያሳይ አኒሜሽን
    let counter = 0;
    const interval = setInterval(() => {
      const randomTempIndex = Math.floor(Math.random() * eligibleParticipants.length);
      setAnimationName(eligibleParticipants[randomTempIndex].name);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
      const selectedWinner = eligibleParticipants[randomIndex];

      setWinner(selectedWinner);
      setIsSpinning(false);

      // አሸናፊውን ከብቁዎች ወደ ባለፈው አሸናፊዎች ማዛወር
      setPastWinners((prev) => [
        { id: selectedWinner.id, name: selectedWinner.name, phone: selectedWinner.phone, wonDate: "ዛሬ" },
        ...prev,
      ]);
      setEligibleParticipants((prev) => prev.filter((p) => p.id !== selectedWinner.id));
    }, 2500);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#090D16] text-gray-100" : "bg-gray-50 text-gray-900"} font-sans transition-colors duration-300 flex flex-col justify-between`}>
      
      {/* Header */}
      <header className={`w-full px-6 py-4 border-b ${darkMode ? "border-gray-800 bg-[#090D16]/95" : "border-gray-200 bg-white/95"} sticky top-0 z-50 backdrop-blur-md flex justify-between items-center shadow-lg`}>
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center font-bold shadow-md text-white text-lg">
            🌿
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wide text-emerald-400">Yop.com Digital Equb</h1>
            <p className="text-[11px] text-amber-400 font-medium tracking-wide">አውቶማቲክ ዕጣ ማውጫ እና የደህንነት ማዕከል</p>
          </div>
        </div>

        {/* Dual Date Display (Ethiopic & Gregorian) */}
        <div className="hidden md:flex items-center gap-4 bg-emerald-950/60 border border-emerald-800/60 px-4 py-1.5 rounded-xl text-xs text-emerald-200 font-bold">
          <span>🇪🇹 ጳጉሜ 5, 2018 ዓ.ም.</span>
          <span className="text-amber-400">|</span>
          <span>📅 Sep 10, 2026</span>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-xl font-bold text-xs transition border border-gray-700 cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ወደ ዳሽቦርድ</span>
        </button>
      </header>

      {/* Main Content: 3-Column Layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-grow w-full space-y-6">
        
        {/* Top Warning / Unpaid Members Bar */}
        {unpaidMembers.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>የእለቱ ውዝፍ / በሰዓቱ ያልከፈሉ አባላት ({unpaidMembers.length})፦</span>
            </div>
            <div className="flex gap-2">
              {unpaidMembers.map((m) => (
                <span key={m.id} className="bg-amber-950/80 text-amber-200 px-2.5 py-1 rounded-lg border border-amber-700">
                  {m.name} ({m.reason})
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column: Eligible Participants (ግራ በኩል - ተወዳዳሪዎች) */}
          <div className={`border rounded-3xl p-5 shadow-xl space-y-4 ${darkMode ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>ለዕጣ ብቁ የሆኑ ({eligibleParticipants.length})</span>
              </h3>
            </div>
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {eligibleParticipants.length === 0 ? (
                <p className="text-xs text-gray-500 italic text-center py-4">ብቁ ተወዳዳሪ የለም</p>
              ) : (
                eligibleParticipants.map((p) => (
                  <div key={p.id} className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-emerald-300">{p.phone}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">
                      ዝግጁ
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Center Column: The Mystery Box & Spinning Area (መሃል - ሚስጥራዊው ሳጥን) */}
          <div className={`lg:col-span-2 border rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 ${darkMode ? "bg-gray-900/90 border-emerald-700/50" : "bg-white border-gray-200"}`}>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-emerald-400 mb-1">🎲 ሚስጥራዊው የዕጣ ሳጥን (Mystery Box)</h2>
              <p className="text-xs text-gray-400">ስሞቹ እየገቡ በዘፈቀደ አሸናፊውን የሚመርጥ ፍትሃዊ አሰራር።</p>
            </div>

            {/* Mystery Box Container */}
            <div className="w-full max-w-md h-44 bg-gradient-to-b from-emerald-950 to-gray-950 border-2 border-amber-400/80 rounded-3xl flex flex-col items-center justify-center p-6 shadow-[0_0_30px_rgba(251,191,36,0.15)] relative overflow-hidden">
              <div className="absolute top-2 left-3 text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                🔒 Yop Secure Draw Box
              </div>

              {isSpinning ? (
                <div className="space-y-2 animate-pulse">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <p className="text-lg font-black text-amber-300">{animationName}</p>
                  <p className="text-[10px] text-gray-400">ዕጣው በሳጥኑ ውስጥ እየተዘዋወረ ነው...</p>
                </div>
              ) : winner ? (
                <div className="space-y-1 animate-bounce">
                  <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                  <h3 className="text-lg font-black text-white">🎉 አሸናፊ፦ {winner.name}</h3>
                  <p className="text-xs text-emerald-300">ስልክ፦ {winner.phone}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-3xl">📥</div>
                  <p className="text-xs text-gray-300 font-bold">ተወዳዳሪዎች ወደ ሳጥኑ ገብተዋል — ዕጣ ለማውጣት ዝግጁ ነው!</p>
                </div>
              )}
            </div>

            <button
              onClick={handleRunLottery}
              disabled={isSpinning || eligibleParticipants.length === 0}
              className="w-full max-w-xs bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-2xl font-black text-xs shadow-xl transition hover:scale-105 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>{isSpinning ? "እየተመረጠ ነው..." : "ዕጣ አውጣ (Draw Winner)"}</span>
            </button>
          </div>

          {/* Right Column: Past Winners (ቀኝ በኩል - ዕጣ የወጣላቸው አሸናፊዎች) */}
          <div className={`border rounded-3xl p-5 shadow-xl space-y-4 ${darkMode ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>ቀደም ሲል አሸናፊዎች ({pastWinners.length})</span>
              </h3>
            </div>
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {pastWinners.length === 0 ? (
                <p className="text-xs text-gray-500 italic text-center py-4">አሸናፊ የለም</p>
              ) : (
                pastWinners.map((w) => (
                  <div key={w.id} className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-amber-200">{w.name}</p>
                      <p className="text-[10px] text-gray-400">{w.wonDate}</p>
                    </div>
                    <span className="text-[10px] bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded border border-amber-700">
                      ተቀብሏል
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 px-6 text-center text-xs text-gray-400 ${darkMode ? "border-gray-800 bg-[#06080E]" : "border-gray-200 bg-white"}`}>
        <p>© 2026 Yop.com Digital Equb — ሁሉም መብቶች የተጠበቁ ናቸው።</p>
      </footer>
    </div>
  );
}