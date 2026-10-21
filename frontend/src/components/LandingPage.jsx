import React from "react";

export default function LandingPage({ onCreateClick, onExploreClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500 text-emerald-950 rounded-xl flex items-center justify-center font-extrabold text-lg shadow-lg">
            ዮ
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">Yop Digital Equb</h1>
            <p className="text-xs text-amber-300 font-medium">የልብ አድርስ አንጀት አርስ</p>
          </div>
        </div>

        <button
          onClick={onCreateClick}
          className="bg-amber-500 hover:bg-amber-400 text-emerald-950 px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-md"
        >
          Create Equb / እቁብ ፈጥር
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 text-center my-auto">
        <div className="inline-block bg-emerald-800/80 border border-emerald-600/50 px-4 py-1.5 rounded-full text-xs font-medium text-emerald-200 mb-6 shadow-inner backdrop-blur-sm">
          ✨ የልብ አድርስ አንጀት አርስ — Build your group from main slots
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          Run your Equb digitally — <br />
          <span className="text-amber-400">እቁብዎን በዲጂታል ያስተዳድሩ</span>
        </h1>

        <p className="text-base md:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed mb-10 opacity-90">
          Yop Digital Equb keeps every main slot, sub-member, and automated draw secure. Protected by strict password rules and transparent service fee options.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onCreateClick}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-emerald-950 px-8 py-3.5 rounded-xl font-bold text-base transition shadow-xl"
          >
            Create your Equb / እቁብ ይፍጠሩ
          </button>
          
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto bg-emerald-800/60 hover:bg-emerald-700/80 border border-emerald-600/60 text-white px-8 py-3.5 rounded-xl font-medium text-base transition backdrop-blur-sm"
          >
            Explore Equbs / እቁቦችን ይመልከቱ
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-emerald-400/70 border-t border-emerald-800/40">
        © 2026 Yop Digital Equb (Equb Manager Pro). All rights reserved.
      </footer>
    </div>
  );
}