import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("am"); // am | en
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#121212] text-white" : "bg-gray-50 text-gray-900"} flex flex-col justify-between selection:bg-emerald-500 selection:text-white font-sans transition-colors duration-300`}>
      
      {/* Top Header / Navigation Bar */}
      <header className={`w-full px-6 py-4 border-b ${darkMode ? "border-zinc-800 bg-[#121212]/90" : "border-gray-200 bg-white/95"} sticky top-0 z-50 backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold shadow-md text-white">
              🌿
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-wide text-emerald-500">Yop Digital Equb</h1>
              <p className="text-[11px] text-amber-400 font-medium tracking-wide">የልብ አድርስ አንጀት አርስ</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#home" className="text-emerald-500 hover:text-emerald-400 transition">Home</a>
            <a href="#about" className="text-zinc-400 hover:text-emerald-400 transition">About</a>
            <a href="#services" className="text-zinc-400 hover:text-emerald-400 transition">Services</a>
            <a href="#how-to-start" className="text-zinc-400 hover:text-emerald-400 transition">How to Start</a>
            <a href="#blog" className="text-zinc-400 hover:text-emerald-400 transition">Blog</a>
            <a href="#contact" className="text-zinc-400 hover:text-emerald-400 transition">Contact</a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border text-sm transition ${darkMode ? "border-zinc-700 bg-zinc-900 text-amber-400 hover:bg-zinc-800" : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              title="Toggle Theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "am" ? "en" : "am")}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${darkMode ? "border-zinc-700 bg-zinc-900 text-emerald-300 hover:bg-zinc-800" : "border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            >
              🌐 {lang === "am" ? "EN" : "አማርኛ"}
            </button>

            {/* Join / Create CTA */}
            <button
              onClick={() => navigate("/create")}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-5 py-2 rounded-xl font-bold text-sm transition shadow-lg hover:scale-105"
            >
              {lang === "am" ? "Join Now / ጀምር" : "Join Now"}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="home" className="max-w-7xl mx-auto px-6 py-12 flex-grow">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-block bg-emerald-900/60 border border-emerald-600/50 px-4 py-1.5 rounded-full text-xs font-medium text-emerald-300 mb-6 shadow-inner backdrop-blur-sm">
            ✨ የልብ አድርስ አንጀት አርስ — Modern Digital Equb Platform in Ethiopia
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            {lang === "am" ? "እቁብዎን በዲጂታል ያስተዳድሩ" : "Run your Equb digitally"} — <br />
            <span className="text-emerald-500">Yop Digital Equb</span>
          </h1>

          <p className="text-base md:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10">
            {lang === "am"
              ? "እያንዳንዱ እቁብ በራሱ የይለፍ ቃል የተጠበቀ ነው — አባላት ብቻ መክፈት ይችላሉ። አስተማማኝ፣ ፈጣን እና ዘመናዊ።"
              : "Yop Digital Equb keeps every member, every share and every draw in one secure place protected by a password."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/create")}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-8 py-3.5 rounded-xl font-bold text-base transition shadow-xl hover:scale-105"
            >
              {lang === "am" ? "እቁብ ይፍጠሩ / Create Equb" : "Create your Equb"}
            </button>
            
            <button
              onClick={() => navigate("/dashboard")}
              className={`w-full sm:w-auto border px-8 py-3.5 rounded-xl font-medium text-base transition backdrop-blur-sm shadow-md ${darkMode ? "border-zinc-700 bg-zinc-900/60 text-white hover:bg-zinc-800" : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100"}`}
            >
              {lang === "am" ? "እቁቦችን ይመልከቱ / Explore" : "Explore Equbs"}
            </button>
          </div>
        </div>

        {/* How it Works / 4-Step Guide matching the exact layout */}
        <section id="how-to-start" className={`border rounded-3xl p-8 md:p-12 mb-16 backdrop-blur-sm shadow-2xl ${darkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-gray-200"}`}>
          <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center text-emerald-500">
            {lang === "am" ? "እንዴት እንደምንጀምር / How it Works" : "How it Works"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className={`border p-6 rounded-2xl relative shadow-lg ${darkMode ? "bg-zinc-900/80 border-zinc-700/60" : "bg-gray-50 border-gray-200"}`}>
              <div className="w-10 h-10 bg-emerald-950 border border-emerald-600/60 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg mb-4 shadow">
                👤+
              </div>
              <h4 className="font-bold text-lg mb-2 text-white">1. Become an Equbtegna</h4>
              <p className="text-sm text-zinc-300 leading-relaxed">Download our app and join digital equbs anytime, anywhere.</p>
            </div>

            {/* Step 2 */}
            <div className={`border p-6 rounded-2xl relative shadow-lg ${darkMode ? "bg-zinc-900/80 border-zinc-700/60" : "bg-gray-50 border-gray-200"}`}>
              <div className="w-10 h-10 bg-emerald-950 border border-emerald-600/60 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg mb-4 shadow">
                📋
              </div>
              <h4 className="font-bold text-lg mb-2 text-white">2. Choose Your Equb</h4>
              <p className="text-sm text-zinc-300 leading-relaxed">Find and join the equb that fits your goals and lifestyle.</p>
            </div>

            {/* Step 3 */}
            <div className={`border p-6 rounded-2xl relative shadow-lg ${darkMode ? "bg-zinc-900/80 border-zinc-700/60" : "bg-gray-50 border-gray-200"}`}>
              <div className="w-10 h-10 bg-emerald-950 border border-emerald-600/60 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg mb-4 shadow">
                🐖
              </div>
              <h4 className="font-bold text-lg mb-2 text-white">3. Contribute Easily</h4>
              <p className="text-sm text-zinc-300 leading-relaxed">Make your equb payments securely using your preferred payment method.</p>
            </div>

            {/* Step 4 */}
            <div className={`border p-6 rounded-2xl relative shadow-lg ${darkMode ? "bg-zinc-900/80 border-zinc-700/60" : "bg-gray-50 border-gray-200"}`}>
              <div className="w-10 h-10 bg-emerald-950 border border-emerald-600/60 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg mb-4 shadow">
                🏆
              </div>
              <h4 className="font-bold text-lg mb-2 text-white">4. Win with Equb</h4>
              <p className="text-sm text-zinc-300 leading-relaxed">Meet urgent needs without additional costs.</p>
            </div>

          </div>
        </section>

        {/* Bank Partners Section */}
        <section id="services" className="mb-16 text-center">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">የባንክ አጋሮቻችን / Our Banking Partners</h4>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-80">
            {["ፀደይ ባንክ (Tsedey Bank)", "CBE", "Awash Bank", "Abyssinia", "Telebirr", "Coop"].map((bank, i) => (
              <div key={i} className={`px-6 py-3 border rounded-xl font-bold text-sm shadow-sm ${darkMode ? "bg-zinc-900 border-zinc-800 text-emerald-300" : "bg-white border-gray-200 text-emerald-700"}`}>
                {bank}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className={`border-t py-8 px-6 text-center text-xs text-zinc-400 ${darkMode ? "border-zinc-800 bg-[#0d0d0d]" : "border-gray-200 bg-white"}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500 font-bold">Yop Digital Equb</span>
            <span>— የልብ አድርስ አንጀት አርስ</span>
          </div>
          <div>
            © 2026 All rights reserved. Built with precision for Ethiopian Communities.
          </div>
        </div>
      </footer>
    </div>
  );
}