import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Lottery() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const participants = [
    { id: 1, name: "አበበ ከበደ", phone: "+251911223344", slots: 2 },
    { id: 2, name: "መከተ አሰፋ", phone: "+251922334455", slots: 1 },
    { id: 3, name: "ሰላማዊት ታደሰ", phone: "+251933445566", slots: 3 },
    { id: 4, name: "ዮናስ አለሙ", phone: "+251944556677", slots: 2 },
  ];

  const handleRunLottery = () => {
    setIsSpinning(true);
    setWinner(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setWinner(participants[randomIndex]);
      setIsSpinning(false);
    }, 2000);
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
            <h1 className="text-base font-extrabold tracking-wide text-emerald-400">Yop Digital Equb</h1>
            <p className="text-[11px] text-amber-400 font-medium tracking-wide">አውቶማቲክ ዕጣ ማውጫ (Lottery System)</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-xl font-bold text-xs transition border border-gray-700 cursor-pointer"
        >
          ← ወደ ዳሽቦርድ ተመለስ
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-grow w-full space-y-8 text-center">
        <div className={`border rounded-3xl p-8 shadow-2xl ${darkMode ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-2xl font-extrabold text-emerald-400 mb-2">🎲 ዲጂታል እቁብ ዕጣ ማውጣት</h2>
          <p className="text-sm text-gray-400 mb-8">ፍትሃዊ እና ግልጽ የሆነ የአሸናፊዎች መምረጫ ሲስተም።</p>

          <div className="my-8">
            {isSpinning ? (
              <div className="py-10 text-xl font-bold text-amber-400 animate-pulse">
                🔄 ዕጣ እየተሳለ ነው፣ እባክዎ ይጠብቁ...
              </div>
            ) : winner ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-200">
                <h3 className="text-xl font-bold mb-1">🎉 እንኳን ደስ አሎት! አሸናፊው፦</h3>
                <p className="text-2xl font-extrabold text-white mt-2">{winner.name}</p>
                <p className="text-sm text-gray-300 mt-1">ስልክ፦ {winner.phone} | የያዘው ስሎት፦ {winner.slots}</p>
              </div>
            ) : (
              <div className="py-6 text-gray-400 text-sm">
                አሸናፊውን ለመለየት ከታች ያለውን ღილክ ይጫኑ።
              </div>
            )}
          </div>

          <button
            onClick={handleRunLottery}
            disabled={isSpinning}
            className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl transition hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            {isSpinning ? "እየመረጠ ነው..." : "ዕጣ አውጣ (Draw Winner)"}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 px-6 text-center text-xs text-gray-400 ${darkMode ? "border-gray-800 bg-[#06080E]" : "border-gray-200 bg-white"}`}>
        <p>© 2026 Yop Digital Equb — የልብ አድርስ አንጀት አርስ. All rights reserved.</p>
      </footer>
    </div>
  );
}