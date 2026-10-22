import React, { useEffect, useState } from 'react';

function TelegramApp() {
  const [telegramUser, setTelegramUser] = useState(null);
  const [equbs, setEqubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ቴሌግራም WebApp SDK መኖሩን ማረጋገጥ
    const tg = window.Telegram?.WebApp;

    if (tg && tg.initDataUnsafe?.user) {
      const user = tg.initDataUnsafe.user;
      setTelegramUser(user);
      console.log("Telegram User Detected:", user);

      // በቴሌግራም initData አማካኝነት ወደ FastAPI Backend መግባት (Authentication)
      fetch('http://localhost:8000/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData: tg.initData }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Backend Auth Response:", data);
        })
        .catch((err) => console.error("Auth error:", err));
    } else {
      // ለምቾት ሲባል ከቴሌግራም ውጭ (Browser ላይ) ሲሞከር 
      setTelegramUser({ first_name: "እንግዳ (Web User)", id: "guest_123" });
    }

    // የዕቁብ ዝርዝሮችን ከ FastAPI Backend መጫን
    fetch('http://localhost:8000/api/equbs')
      .then((res) => res.json())
      .then((data) => {
        setEqubs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching equbs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-emerald-950 text-white p-6 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center bg-emerald-900 p-4 rounded-xl shadow-lg border border-amber-500/30">
        <div>
          <h1 className="text-2xl font-bold text-amber-400">ዮጵ — ቴሌግራም ሚኒ አፕ</h1>
          <p className="text-sm text-emerald-200">ዲጂታል ዕቁብ ማስተዳደሪያ ማዕከል</p>
        </div>
        {telegramUser && (
          <div className="bg-emerald-800 px-4 py-2 rounded-lg border border-emerald-700 text-sm">
            ሰላም፣ <span className="text-amber-300 font-semibold">{telegramUser.first_name}</span> 👋
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto mt-8">
        <div className="bg-emerald-900/50 p-6 rounded-2xl border border-emerald-800">
          <h2 className="text-xl font-bold text-amber-400 mb-4">የነቁ ዕቁቦች ዝርዝር</h2>
          {loading ? (
            <p className="text-emerald-300">እየጫነ ነው...</p>
          ) : equbs.length === 0 ? (
            <p className="text-emerald-300">ምንም የተፈጠረ ዕቁብ የለም።</p>
          ) : (
            <div className="grid gap-4">
              {equbs.map((eq) => (
                <div key={eq.id} className="bg-emerald-900 p-4 rounded-xl border border-emerald-700 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-amber-300">{eq.name}</h3>
                    <p className="text-xs text-emerald-300">መዋጮ መጠን: {eq.contributionAmount} ብር ({eq.frequency})</p>
                  </div>
                  <button className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-4 py-2 rounded-lg text-sm transition">
                    ተቀላቀል
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TelegramApp;