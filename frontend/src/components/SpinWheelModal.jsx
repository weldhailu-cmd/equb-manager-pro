import React, { useState } from "react";

export default function SpinWheelModal({ isOpen, onClose, members, netPayout }) {
  const [spinning, setSpinning] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);

  if (!isOpen) return null;

  const handleSpinClick = () => {
    if (!members || members.length === 0) return;
    setSpinning(true);
    setSelectedWinner(null);

    // የማሽከርከር መምሰያ (Simulated spinning effect)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * members.length);
      setSelectedWinner(members[randomIndex]);
      setSpinning(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#111827] border border-slate-700 rounded-3xl p-6 max-w-md w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold px-3 py-1 rounded-full">
            🎰 የዕድል ሩጫ (Spin Wheel)
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
        </div>

        {/* Wheel Graphic Box */}
        <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-amber-500/50 bg-gradient-to-tr from-slate-900 to-purple-950 flex items-center justify-center shadow-inner overflow-hidden">
          <div className={`text-center transition-all duration-700 ${spinning ? "animate-spin scale-110" : ""}`}>
            <span className="text-4xl">🎯</span>
          </div>
          {spinning && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-xs font-bold text-amber-400">
              እየተሽከረከረ ነው...
            </div>
          )}
        </div>

        {selectedWinner ? (
          <div className="bg-[#0b0f17] border border-emerald-500/50 p-4 rounded-2xl space-y-2 animate-bounce">
            <p className="text-xs text-slate-400">🎉 እንኳን ደስ አሎት! አሸናፊው አባል፦</p>
            <p className="text-xl font-black text-amber-400">{selectedWinner.ownerName} ({selectedWinner.alias})</p>
            <p className="text-xs text-emerald-400 font-mono">የሚወስደው ንጹህ ክፍያ፦ {netPayout.toFixed(2)} ETB</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400">አሸናፊውን ለመምረጥ ከታች ያለውን ቁልፍ ይጫኑ!</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSpinClick}
            disabled={spinning || members.length === 0}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-3 rounded-xl text-xs transition disabled:opacity-50 shadow-lg"
          >
            {spinning ? "እየመረጠ ነው..." : "አሽከርክር (Spin)"}
          </button>
          <button
            onClick={onClose}
            className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition"
          >
            ዝጋ
          </button>
        </div>
      </div>
    </div>
  );
}