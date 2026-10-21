import React, { useState } from "react";
import { Plus, Trash2, Edit3, X, CheckCircle2 } from "lucide-react";
import SpinWheelModal from "../components/SpinWheelModal";

export default function Dashboard() {
  // --- Navigation & States ---
  const [activeTab, setActiveTab] = useState("equb"); // 'equb' | 'marketplace' | 'lottery'

  // Main Slots and Sub-Members State
  const [mainSlots, setMainSlots] = useState([
    {
      id: 'slot-1',
      slotName: 'ስሎት 1 - ዋና አላማ',
      slotNickname: 'Shown publicly in draws',
      totalAmount: 20000,
      subMembers: [
        { id: 'sub-1', name: 'አበበ በቀለ', phone: '0911223344', alias: '112141470001169', amount: 10000 },
        { id: 'sub-2', name: 'ሀርን ተስፋዬ', phone: '0922334455', alias: '0917175800', amount: 10000 }
      ]
    }
  ]);

  // Quick Form State for Adding Sub-Member from Top Bar
  const [quickForm, setQuickForm] = useState({
    slotId: 'slot-1',
    name: '',
    phone: '',
    alias: '',
    amount: ''
  });

  const [notification, setNotification] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  const showMsg = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Handlers: Main Slots ---
  const handleAddMainSlot = () => {
    const newSlot = {
      id: `slot-${Date.now()}`,
      slotName: `ስሎት ${mainSlots.length + 1}`,
      slotNickname: 'Shown publicly in draws',
      totalAmount: 10000,
      subMembers: []
    };
    setMainSlots([...mainSlots, newSlot]);
    showMsg("አዲስ ዋና ስሎት ተጨምሯል!");
  };

  const handleUpdateSlotField = (slotId, field, value) => {
    setMainSlots(mainSlots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, [field]: field === 'totalAmount' ? Number(value) : value };
      }
      return slot;
    }));
  };

  // --- Handlers: Quick Add Sub-Member (from Top Bar) ---
  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (!quickForm.name || !quickForm.phone || !quickForm.amount) {
      alert("እባክዎ ሙሉውን መረጃ ይሙሉ!");
      return;
    }

    setMainSlots(mainSlots.map(slot => {
      if (slot.id === quickForm.slotId) {
        const newSub = {
          id: `sub-${Date.now()}`,
          name: quickForm.name,
          phone: quickForm.phone,
          alias: quickForm.alias,
          amount: Number(quickForm.amount)
        };
        return { ...slot, subMembers: [...slot.subMembers, newSub] };
      }
      return slot;
    }));

    // Reset Form
    setQuickForm({
      slotId: mainSlots[0]?.id || '',
      name: '',
      phone: '',
      alias: '',
      amount: ''
    });

    showMsg("አዲሱ አባል በተሳካ ሁኔታ ተመዝግቧል!");
  };

  // --- Handlers: Sub-Members Edit/Delete ---
  const handleDeleteSubMember = (slotId, subId) => {
    if (!window.confirm("ይህንን አባል መሰረዝ ትፈልጋለህ?")) return;
    setMainSlots(mainSlots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, subMembers: slot.subMembers.filter(sub => sub.id !== subId) };
      }
      return slot;
    }));
    showMsg("አባሉ ተሰርዟል!");
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingMember) return;

    setMainSlots(mainSlots.map(slot => {
      if (slot.id === editingMember.slotId) {
        const updatedSubs = slot.subMembers.map(sub => {
          if (sub.id === editingMember.subId) {
            return {
              ...sub,
              name: editingMember.name,
              phone: editingMember.phone,
              alias: editingMember.alias,
              amount: Number(editingMember.amount)
            };
          }
          return sub;
        });
        return { ...slot, subMembers: updatedSubs };
      }
      return slot;
    }));

    showMsg("የአባል መረጃ ተስተካክሏል!");
    setEditingMember(null);
  };

  // --- Wheel Modal States ---
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [winnerSlot, setWinnerSlot] = useState(null);

  const handleStartSpin = () => {
    const allMembers = [];
    mainSlots.forEach((slot) => {
      slot.subMembers.forEach((sub) => {
        allMembers.push({ ...sub, slotAlias: slot.slotName });
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

  const grandTotalAmount = mainSlots.reduce(
    (acc, slot) => acc + slot.subMembers.reduce((subAcc, sub) => subAcc + Number(sub.amount || 0), 0),
    0
  );

  return (
    <div className="bg-[#0b0f17] min-h-screen text-slate-100 p-6 font-sans relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 font-bold text-xs">
          <CheckCircle2 className="w-4 h-4" /> <span>{notification}</span>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-amber-400">✏️ አባል ማስተካከያ (Edit Member)</h3>
              <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">ሙሉ ስም *</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">ስልክ *</label>
                <input
                  type="text"
                  value={editingMember.phone}
                  onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                  className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">የባንክ ሂሳብ / ቅጽል ስም</label>
                <input
                  type="text"
                  value={editingMember.alias}
                  onChange={(e) => setEditingMember({ ...editingMember, alias: e.target.value })}
                  className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">መዋጮ መጠን (ETB) *</label>
                <input
                  type="number"
                  value={editingMember.amount}
                  onChange={(e) => setEditingMember({ ...editingMember, amount: e.target.value })}
                  className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-400 outline-none font-bold"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2 rounded-xl text-xs font-black cursor-pointer"
                >
                  ለውጦችን አስቀምጥ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header & Navigation Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[#111827] p-5 rounded-2xl border border-slate-800 mb-6 gap-4 shadow-xl">
        <div>
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
            🌟 ፀደይ ባንክ - ማማ ቅርንጫፍ (ሞላሌ)
          </span>
          <h1 className="text-xl font-black text-white mt-2">Yop Digital Equb & Marketplace</h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setActiveTab("equb")} className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === "equb" ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "bg-slate-800 text-slate-300 hover:text-white"}`}>
            📊 ዋና ስሎቶች & አባላት
          </button>
          <button onClick={() => setActiveTab("lottery")} className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === "lottery" ? "bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20" : "bg-slate-800 text-slate-300 hover:text-white"}`}>
            🎯 የዕጣ ማውጫ
          </button>
        </div>
      </div>

      {activeTab === "equb" && (
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* 1. Quick Add Sub-Member Bar (እንደ ምስል 1 ያለው) */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-1.5">
              <span>+</span> አባል መመዝገብ (ወደ የተመረጠው ስሎት)
            </h3>
            <form onSubmit={handleQuickAddSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
              
              {/* Slot Selector */}
              <div>
                <select
                  value={quickForm.slotId}
                  onChange={(e) => setQuickForm({ ...quickForm, slotId: e.target.value })}
                  className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  {mainSlots.map(slot => (
                    <option key={slot.id} value={slot.id}>🦊 {slot.slotName}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <input
                  type="text"
                  placeholder="ሙሉ ስም"
                  value={quickForm.name}
                  onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                  className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <input
                  type="text"
                  placeholder="ስልክ (09...)"
                  value={quickForm.phone}
                  onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                  className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-mono"
                  required
                />
              </div>

              {/* Bank Account / Alias */}
              <div>
                <input
                  type="text"
                  placeholder="የባንክ ሂሳብ (ወይንም ስልክ)"
                  value={quickForm.alias}
                  onChange={(e) => setQuickForm({ ...quickForm, alias: e.target.value })}
                  className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-mono"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> + መዝግብ
                </button>
              </div>

            </form>
          </div>

          {/* 2. Main Slots Management Header */}
          <div className="flex justify-between items-center bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-xl">
            <div>
              <h2 className="text-sm font-black text-white">⚙️ ዋና ስሎቶች (MAIN SLOTS) አስተዳደር</h2>
            </div>
            <button
              onClick={handleAddMainSlot}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> + ዋና ስሎት ጨምር
            </button>
          </div>

          {/* Slots Configuration List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mainSlots.map((slot, index) => (
              <div key={slot.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={slot.slotName}
                    onChange={(e) => handleUpdateSlotField(slot.id, 'slotName', e.target.value)}
                    className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold outline-none"
                  />
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">አባላት: {slot.subMembers.length}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Sub-Members Display Section (እንደ ምስል 2 ያለው) */}
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-sm font-black text-white">👥 በቀ ዋና ስሎቶች የተከፈሉ አባላት ዝርዝር</h2>
            </div>

            <div className="space-y-6">
              {mainSlots.map((slot) => {
                const currentSum = slot.subMembers.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

                return (
                  <div key={slot.id} className="bg-[#0b0f17] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                    
                    {/* Slot Title Banner */}
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                        <span>🦊</span>
                        <span>{slot.slotName}</span>
                      </div>
                      <div className="text-xs text-slate-400 font-bold">
                        ጠቅላላ አባላት: <span className="text-white">{slot.subMembers.length}</span>
                      </div>
                    </div>

                    {/* Sub-Members List */}
                    <div className="space-y-2.5">
                      {slot.subMembers.length === 0 ? (
                        <p className="text-xs text-slate-500 italic text-center py-3">ገና ምንም አባል አልተመዘገበም።</p>
                      ) : (
                        slot.subMembers.map((sub) => (
                          <div key={sub.id} className="bg-[#111827] border border-slate-800/60 rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="text-xs space-y-0.5">
                              <span className="font-bold text-white text-sm">{sub.name}</span>
                              <span className="text-slate-400 font-mono"> ({sub.phone})</span>
                              {sub.alias && <span className="text-emerald-400 font-mono"> - {sub.alias}</span>}
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                              <span className="text-amber-400 font-black text-xs font-mono">{sub.amount} ETB</span>
                              
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setEditingMember({ slotId: slot.id, subId: sub.id, name: sub.name, phone: sub.phone, alias: sub.alias, amount: sub.amount })}
                                  className="p-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg transition cursor-pointer border border-sky-500/20"
                                  title="አስተካክል"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubMember(slot.id, sub.id)}
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition cursor-pointer border border-rose-500/20"
                                  title="ሰርዝ"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* Lottery Tab */}
      {activeTab === "lottery" && (
        <div className="max-w-4xl mx-auto bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
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
            <button
              onClick={handleStartSpin}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-black px-6 py-4 rounded-xl text-sm shadow-xl transition cursor-pointer"
            >
              🎡 የዕጣ ማውጫ መንኰራኩር ክፈትና ጀምር
            </button>
          </div>
        </div>
      )}

      {/* Spin Wheel Modal */}
      <SpinWheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        equbName="የገብርኤል እቁብ"
        slots={mainSlots.map(s => ({ ...s, slotAlias: s.slotName, subSlots: s.subMembers }))}
        mustSpin={mustSpin}
        winnerSlot={winnerSlot}
        winnerNetPayout={grandTotalAmount}
        onSpin={handleStartSpin}
      />
    </div>
  );
}