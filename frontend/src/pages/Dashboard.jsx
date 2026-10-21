import React, { useState, useEffect } from "react";
import SpinWheelModal from "../components/SpinWheelModal";

export default function Dashboard() {
  // --- Navigation & States ---
  const [activeTab, setActiveTab] = useState("equb"); // 'equb' | 'marketplace' | 'lottery'

  // --- 1. Equb & Main Slots States ---
  const [equbs, setEqubs] = useState([
    {
      id: "equb-1",
      equbName: "🌟 የገብርኤል መነሻ እቁብ (ሞላሌ ማማ ቅርንጫፍ)",
      equbType: "daily",
      city: "ሞላሌ (Molale)",
      shareAmount: 10000,
      slots: [
        {
          id: "slot-1",
          slotNumber: 1,
          slotAlias: "🐯 ስሎት 1 - ዋና አባላት",
          subSlots: [
            { id: "sub-1", memberName: "አበበ በቀለ", phone: "0911223344", telegramUsername: "@abebe_b", alias: "አቤ", accountNumber: "112141470001169", bankName: "ፀደይ ባንክ", shareAmount: 10000, isPaid: true },
            { id: "sub-2", memberName: "ኬሮን ተስፋዬ", phone: "0922334455", telegramUsername: "@keron_t", alias: "ኬሪ", accountNumber: "0917175800", bankName: "ፀደይ ባንክ", shareAmount: 10000, isPaid: false },
          ],
        },
      ],
    },
  ]);
  const [activeEqubId, setActiveEqubId] = useState("equb-1");
  const [newEqubName, setNewEqubName] = useState("");
  
  // New Main Slot Form State
  const [newSlotAlias, setNewSlotAlias] = useState("");

  // Member Form States
  const [selectedSlotIdForMember, setSelectedSlotIdForMember] = useState("");
  const [memberName, setMemberName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [alias, setAlias] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [memberShare, setMemberShare] = useState(10000);

  // --- Wheel Modal States ---
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [winnerSlot, setWinnerSlot] = useState(null);

  // --- 2. Marketplace States (እንደ ስልክ፣ ቴሌቪዥን እና የቤት ውስጥ ዕቃዎች) ---
  const [marketplaceItems] = useState([
    { id: "m-1", title: "ሳምሰንግ ስማርት ስልክ (Samsung Galaxy A12)", price: 8500, category: "ስልኮች", seller: "ያዕቆብ" },
    { id: "m-2", title: "ኤልጂ 32 ኢንች ቲቪ (LG 32\" TV)", price: 14000, category: "ቴሌቪዥን", seller: "ዳዊት" },
    { id: "m-3", title: "የቡና ማፍያ ኤሌክትሪክ ምድጃ (Electric Stove)", price: 1200, category: "የቤት ውስጥ ዕቃዎች", seller: "መዓዛ" },
    { id: "m-4", title: "ብረት (Iron box - Philips)", price: 1800, category: "የቤት ውስጥ ዕቃዎች", seller: "ናኦል" },
  ]);
  const [cart, setCart] = useState([]);

  const currentEqub = equbs.find((eq) => eq.id === activeEqubId) || equbs[0];

  useEffect(() => {
    if (currentEqub && currentEqub.slots.length > 0) {
      setSelectedSlotIdForMember(currentEqub.slots[0].id);
    }
  }, [activeEqubId, currentEqub]);

  // --- Handlers: Equb ---
  const handleCreateEqub = (e) => {
    e.preventDefault();
    if (!newEqubName.trim()) return;
    const newObj = {
      id: `equb-${Date.now()}`,
      equbName: newEqubName.trim(),
      equbType: "daily",
      city: "ሞላሌ (Molale)",
      shareAmount: 10000,
      slots: [{ id: `slot-${Date.now()}`, slotNumber: 1, slotAlias: "🌟 ስሎት 1 - ዋና", subSlots: [] }],
    };
    setEqubs((prev) => [...prev, newObj]);
    setActiveEqubId(newObj.id);
    setNewEqubName("");
  };

  // --- Handlers: Main Slots ---
  const handleAddMainSlot = (e) => {
    e.preventDefault();
    if (!newSlotAlias.trim()) return;

    const newSlotObj = {
      id: `slot-${Date.now()}`,
      slotNumber: currentEqub.slots.length + 1,
      slotAlias: newSlotAlias.trim(),
      subSlots: [],
    };

    setEqubs((prev) =>
      prev.map((eq) => {
        if (eq.id !== currentEqub.id) return eq;
        return {
          ...eq,
          slots: [...eq.slots, newSlotObj],
        };
      })
    );
    setNewSlotAlias("");
  };

  const handleDeleteMainSlot = (slotId) => {
    if (currentEqub.slots.length <= 1) {
      alert("ቢያንስ አንድ ዋና ስሎት መኖር አለበት!");
      return;
    }
    setEqubs((prev) =>
      prev.map((eq) => {
        if (eq.id !== currentEqub.id) return eq;
        return {
          ...eq,
          slots: eq.slots.filter((s) => s.id !== slotId),
        };
      })
    );
  };

  // --- Handlers: Members ---
  const handleAddMemberToSlot = (e) => {
    e.preventDefault();
    if (!memberName.trim() || !phone.trim() || !selectedSlotIdForMember) return;
    const newSub = {
      id: `sub-${Date.now()}`,
      memberName: memberName.trim(),
      phone: phone.trim(),
      telegramUsername: telegramUsername.trim() || "@user",
      alias: alias.trim() || memberName.trim().split(" ")[0],
      accountNumber: accountNumber.trim() || "112141470001169",
      bankName: "ፀደይ ባንክ",
      shareAmount: Number(memberShare) || 10000,
      isPaid: false,
    };

    setEqubs((prev) =>
      prev.map((eq) => {
        if (eq.id !== currentEqub.id) return eq;
        return {
          ...eq,
          slots: eq.slots.map((s) => {
            if (s.id !== selectedSlotIdForMember) return s;
            return { ...s, subSlots: [...s.subSlots, newSub] };
          }),
        };
      })
    );
    setMemberName("");
    setPhone("");
    setTelegramUsername("");
    setAlias("");
    setAccountNumber("");
  };

  // --- Spin Wheel Trigger Logic ---
  const handleStartSpin = () => {
    const allMembers = [];
    currentEqub.slots.forEach((slot) => {
      slot.subSlots.forEach((sub) => {
        allMembers.push({ ...sub, slotAlias: slot.slotAlias });
      });
    });

    if (allMembers.length === 0) {
      alert("እባክዎ በመጀመሪያ አባላትን ይመዝግቡ!");
      return;
    }

    setMustSpin(true);
    setIsWheelOpen(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * allMembers.length);
      setWinnerSlot(allMembers[randomIndex]);
      setMustSpin(false);
    }, 2000);
  };

  // Financial Calculations
  const grandTotalAmount = currentEqub
    ? currentEqub.slots.reduce((acc, slot) => acc + slot.subSlots.reduce((subAcc, sub) => subAcc + Number(sub.shareAmount), 0), 0)
    : 0;

  return (
    <div className="bg-[#0b0f17] min-h-screen text-slate-100 p-6 font-sans">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#111827] p-5 rounded-2xl border border-slate-800 mb-6 gap-4 shadow-xl">
        <div>
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
            🌟 ፀደይ ባንክ - ማማ ቅርንጫፍ (ሞላሌ)
          </span>
          <h1 className="text-xl font-black text-white mt-2">Yop Digital Equb & Marketplace</h1>
        </div>

        {/* 3 የተስተካከሉ ታቦች */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setActiveTab("equb")} className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === "equb" ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "bg-slate-800 text-slate-300 hover:text-white"}`}>
            📊 እቁብ & ዋና ስሎቶች
          </button>
          <button onClick={() => setActiveTab("marketplace")} className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === "marketplace" ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20" : "bg-slate-800 text-slate-300 hover:text-white"}`}>
            🛒 ማርኬትፕሌስ (ስልኮች/ዕቃዎች)
          </button>
          <button onClick={() => setActiveTab("lottery")} className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === "lottery" ? "bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20" : "bg-slate-800 text-slate-300 hover:text-white"}`}>
            🎯 የዕጣ ማውጫ
          </button>
        </div>
      </div>

      {/* 1. EQUB & MAIN SLOTS TAB */}
      {activeTab === "equb" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h2 className="text-xs font-black text-slate-400 uppercase mb-3">📁 ነባር እቁቦች</h2>
              <div className="space-y-2">
                {equbs.map((eq) => (
                  <button key={eq.id} onClick={() => setActiveEqubId(eq.id)} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${eq.id === activeEqubId ? "bg-emerald-500 text-slate-950" : "bg-[#0b0f17] text-slate-300 border border-slate-800 hover:bg-slate-800"}`}>
                    {eq.equbName}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h2 className="text-sm font-black text-amber-400 mb-3">✨ አዲስ እቁብ መፍጠሪያ</h2>
              <form onSubmit={handleCreateEqub} className="flex gap-3">
                <input type="text" placeholder="የእቁቡ ስም" value={newEqubName} onChange={(e) => setNewEqubName(e.target.value)} className="flex-1 bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" required />
                <button type="submit" className="bg-amber-500 text-slate-950 font-black px-5 py-2 rounded-xl text-xs cursor-pointer">+ ፍጠር</button>
              </form>
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-black text-emerald-400 uppercase mb-3">⚙️ ዋና ስሎቶች (Main Slots) ማስተዳደሪያ</h3>
            <form onSubmit={handleAddMainSlot} className="flex gap-3 mb-4">
              <input 
                type="text" 
                placeholder="የስሎቱ ስም (ለምሳሌ፦ ስሎት 2 - የንግድ ፉክክር)" 
                value={newSlotAlias} 
                onChange={(e) => setNewSlotAlias(e.target.value)} 
                className="flex-1 bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" 
                required 
              />
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2 rounded-xl text-xs cursor-pointer">
                + ዋና ስሎት ጨምር
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {currentEqub.slots.map((slot) => (
                <div key={slot.id} className="bg-[#0b0f17] border border-slate-800 px-3 py-2 rounded-xl flex items-center gap-3 text-xs">
                  <span className="font-bold text-slate-200">{slot.slotAlias}</span>
                  <span className="text-[10px] text-amber-400 font-mono">({slot.subSlots.length} አባላት)</span>
                  {currentEqub.slots.length > 1 && (
                    <button 
                      onClick={() => handleDeleteMainSlot(slot.id)}
                      className="text-rose-400 hover:text-rose-300 font-bold ml-2 cursor-pointer"
                      title="ስሎቱን ሰርዝ"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Members Table Grouped by Main Slots */}
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-black text-amber-400 uppercase">👥 በዋና ስሎቶች የተከፈሉ አባላት ዝርዝር</h3>
            {currentEqub.slots.map((slot) => (
              <div key={slot.id} className="bg-[#0b0f17] border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-emerald-400">{slot.slotAlias}</span>
                  <span className="text-[10px] text-slate-400">ጠቅላላ አባላት: {slot.subSlots.length}</span>
                </div>
                {slot.subSlots.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic py-1">ይህ ስሎት ውስጥ እስካሁን የተመዘገበ አባል የለም።</p>
                ) : (
                  <div className="space-y-2">
                    {slot.subSlots.map((sub) => (
                      <div key={sub.id} className="bg-[#111827] p-3 rounded-xl border border-slate-800/60 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-200">{sub.memberName}</span> ({sub.phone}) - <span className="text-emerald-400">{sub.accountNumber}</span>
                        </div>
                        <span className="text-amber-400 font-mono font-bold">{sub.shareAmount} ETB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Member Form */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-black text-amber-400 uppercase mb-3">➕ አባል መዝግብ (ወደ የተመረጠው ስሎት)</h3>
            <form onSubmit={handleAddMemberToSlot} className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <select 
                value={selectedSlotIdForMember} 
                onChange={(e) => setSelectedSlotIdForMember(e.target.value)} 
                className="bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 cursor-pointer"
              >
                {currentEqub.slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>{slot.slotAlias}</option>
                ))}
              </select>
              <input type="text" placeholder="ሙሉ ስም" value={memberName} onChange={(e) => setMemberName(e.target.value)} className="bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" required />
              <input type="text" placeholder="ስልክ (09...)" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" required />
              <input type="text" placeholder="የባንክ አካውንት (ፀደይ ባንክ)" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200" />
              <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs cursor-pointer">+ መዝግብ</button>
            </form>
          </div>
        </div>
      )}

      {/* 2. MARKETPLACE TAB (ስልኮች፣ ቴሌቪዥኖች እና የቤት ውስጥ ዕቃዎች) */}
      {activeTab === "marketplace" && (
        <div className="space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-black text-amber-400 uppercase">
                🛒 ማርኬትፕሌስ (ስልኮች፣ ቴሌቪዥን እና የቤት ውስጥ ዕቃዎች)
              </h2>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                P2P Marketplace
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketplaceItems.map((item) => (
                <div key={item.id} className="bg-[#0b0f17] border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold">{item.category}</span>
                    <div className="text-sm font-bold text-slate-200 mt-1">{item.title}</div>
                    <div className="text-xs text-slate-400 mt-1">ሻጭ: {item.seller}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-amber-400 font-mono">{item.price} ETB</div>
                    <button 
                      onClick={() => setCart([...cart, item])}
                      className="mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3 py-1 rounded-lg text-xs cursor-pointer"
                    >
                      + ውሰድ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* የተመረጡ ዕቃዎች (Cart Summary) */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-black text-slate-300 uppercase mb-3">🛍️ የግዢ ሰንጠረዥ (Cart Items) - {cart.length} ዕቃዎች</h3>
            {cart.length === 0 ? (
              <p className="text-xs text-slate-500">ገና ምንም ዕቃ አልተመረጠም።</p>
            ) : (
              <div className="space-y-2">
                {cart.map((cItem, index) => (
                  <div key={index} className="flex justify-between items-center bg-[#0b0f17] p-3 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-200 font-bold">{cItem.title}</span>
                    <span className="text-amber-400 font-mono">{cItem.price} ETB</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. LOTTERY TAB */}
      {activeTab === "lottery" && (
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase text-purple-400 font-bold tracking-wider">የዕጣ ማውጫ ክፍል</span>
              <h2 className="text-base font-black text-white mt-1">🎯 የዕጣ ማውጫ እና የድራው አስተዳደር</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">የእቁቡ ጠቅላላ ድርሻ መጠን</span>
              <span className="text-lg font-black text-amber-400 font-mono">{grandTotalAmount.toLocaleString()} ETB</span>
            </div>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl p-6 text-center space-y-4">
            <div className="max-w-md mx-auto">
              <h3 className="text-sm font-bold text-slate-200 mb-2">እጣ ማውጣት ለመጀመር ዝግጁ ነዎት?</h3>
              <p className="text-xs text-slate-400 mb-6">
                ይህ ቁልፍ በመጫን አባላትን በዘፈቀደ በመምረጥ አሸናፊውን መንኰራኩር (Spin Wheel) ማቀጣጠል ይችላሉ።
              </p>
              <button
                onClick={handleStartSpin}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-black px-6 py-4 rounded-xl text-sm shadow-xl transition cursor-pointer"
              >
                🎡 የዕጣ ማውጫ መንኰራኩር ክፈትና ጀምር
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spin Wheel Modal Integration */}
      <SpinWheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        equbName={currentEqub.equbName}
        slots={currentEqub.slots}
        mustSpin={mustSpin}
        winnerSlot={winnerSlot}
        winnerNetPayout={grandTotalAmount}
        onSpin={handleStartSpin}
      />
    </div>
  );
}