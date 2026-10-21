import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, CheckCircle2, Clock, AlertCircle, Users } from 'lucide-react';

export default function MainSlots({ equbData, role = 'admin', lang = 'am' }) {
  const [slots, setSlots] = useState([]);
  const [membersList, setMembersList] = useState([]);

  // 🌟 የስሎት ስም ብቻ (ቅጽል ስም እና የብር መጠን ተወግደዋል)
  const [slotName, setSlotName] = useState('');
  const [activeSearchSlotId, setActiveSearchSlotId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // የዕቁቡ ኢላማ መጠን (Target Amount) - ምሳሌ፦ 1000 ETB
  const targetAmount = equbData?.contributionAmount || equbData?.contribution_amount || 1000;

  useEffect(() => {
    if (equbData && equbData.slots) {
      setSlots(equbData.slots);
    } else {
      const stored = localStorage.getItem('yop_saved_equbs');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const current = parsed.find(item => String(item.id) === String(equbData?.id));
          if (current && current.slots) setSlots(current.slots);
        } catch (e) {}
      }
    }

    const storedMembers = localStorage.getItem('yop_members');
    if (storedMembers) {
      try {
        setMembersList(JSON.parse(storedMembers));
      } catch (e) {}
    } else {
      setMembersList([
        { id: 1, name: 'በረከት አበበ', phone: '0911223344', contribution: 500 },
        { id: 2, name: 'ሰላም ታደሰ', phone: '0922334455', contribution: 500 },
        { id: 3, name: 'ኤፍሬም መኮንን', phone: '0933445566', contribution: 1000 }
      ]);
    }
  }, [equbData]);

  const saveSlots = (updatedSlots) => {
    setSlots(updatedSlots);
    const stored = localStorage.getItem('yop_saved_equbs') || localStorage.getItem('all_equbs');
    if (stored) {
      try {
        let parsed = JSON.parse(stored);
        parsed = parsed.map(item => String(item.id) === String(equbData?.id) ? { ...item, slots: updatedSlots } : item);
        localStorage.setItem('yop_saved_equbs', JSON.stringify(parsed));
        localStorage.setItem('all_equbs', JSON.stringify(parsed));
      } catch (e) {}
    }
  };

  const handleRegisterSlot = (e) => {
    e.preventDefault();
    if (!slotName.trim()) {
      setErrorMsg(lang === 'am' ? 'እባክዎ የስሎቱን ስም ያስገቡ!' : 'Enter slot name!');
      return;
    }

    const newSlot = {
      id: Date.now(),
      name: slotName.trim(),
      assignedMembers: []
    };

    const updated = [...slots, newSlot];
    saveSlots(updated);
    setSlotName('');
    setErrorMsg('');
  };

  const handleAssignMember = (slotId, member) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    const currentSum = (slot.assignedMembers || []).reduce((sum, m) => sum + Number(m.amount || 0), 0);
    const memberContribution = Number(member.contribution || member.amount || 500);

    if (currentSum + memberContribution > targetAmount) {
      setErrorMsg(`⚠️ ይቅርታ! የዚህ ስሎት ገደብ (${targetAmount} ETB) ይሞላል። ከዚህ በላይ መጨመር አይቻልም።`);
      return;
    }

    const updatedMembers = [
      ...(slot.assignedMembers || []), 
      { id: member.id, name: member.name, phone: member.phone, amount: memberContribution }
    ];

    const updatedSlots = slots.map(s => s.id === slotId ? { ...s, assignedMembers: updatedMembers } : s);
    saveSlots(updatedSlots);

    setSearchTerm('');
    setActiveSearchSlotId(null);
    setErrorMsg('');
  };

  const handleDeleteSlot = (slotId) => {
    const updated = slots.filter(s => s.id !== slotId);
    saveSlots(updated);
  };

  const filteredMembers = membersList.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.phone && m.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6 text-white font-sans p-4">
      
      {/* ➕ አዲስ ስሎት መፍጠሪያ (የስሎት ስም ብቻ) */}
      {role === 'admin' && (
        <div className="bg-[#041c12] border border-[#d4af37]/30 p-5 rounded-2xl shadow-xl space-y-3">
          <h3 className="text-xs font-black text-[#d4af37]">
            {lang === 'am' ? 'ቁጥሮች እና ስሎቶች (የስሎት ስም ብቻ)' : 'Slots Management'}
          </h3>

          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-700 rounded-xl text-red-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSlot} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={slotName}
                onChange={(e) => setSlotName(e.target.value)}
                placeholder="ምሳሌ፦ @MOLA1 ወይም ቦስ 1..."
                className="w-full bg-[#0a2e1d] border border-emerald-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#d4af37] hover:bg-[#e6c252] text-[#041c12] font-black text-xs rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>ስሎቱን መዝግብ</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📋 የተመዘገቡ ስሎቶች ዝርዝር */}
      <div className="bg-[#041c12] border border-emerald-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
          <h4 className="text-xs font-black text-[#d4af37] flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>ቁጥሮች እና ስሎቶች ({slots.length})</span>
          </h4>
        </div>

        {slots.length === 0 ? (
          <p className="text-center text-emerald-300/60 text-xs py-8">እስካሁን የተፈጠረ ስሎት የለም።</p>
        ) : (
          <div className="space-y-4">
            {slots.map((slot) => {
              const assigned = slot.assignedMembers || [];
              const currentTotal = assigned.reduce((sum, m) => sum + Number(m.amount || 0), 0);
              const isReady = currentTotal >= targetAmount;

              return (
                <div key={slot.id} className="p-4 bg-[#0a2e1d] border border-emerald-700/60 rounded-xl space-y-3">
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="text-xs font-black text-white flex items-center gap-2">
                        🎯 {slot.name}
                      </h5>
                      <p className="text-[11px] text-emerald-300 mt-0.5">
                        የተሰበሰበ፦ <strong className="text-[#d4af37]">{currentTotal} / {targetAmount} ETB</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isReady ? (
                        <span className="text-[10px] bg-green-950 text-green-300 border border-green-600 px-3 py-1 rounded-xl font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> ለዕጣ ዝግጁ ነው
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-600 px-3 py-1 rounded-xl font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" /> ገና አልሞላም
                        </span>
                      )}

                      {role === 'admin' && (
                        <button 
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-1.5 text-red-400 hover:bg-red-950/80 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* የተመደቡ አባላት */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-800">
                    {assigned.length === 0 ? (
                      <span className="text-[11px] text-emerald-400/50 italic">ምንም አባል አልተመደበም</span>
                    ) : (
                      assigned.map((m, idx) => (
                        <span key={idx} className="text-[11px] bg-[#041c12] border border-emerald-700 px-2.5 py-1 rounded-lg text-white flex items-center gap-1">
                          👤 {m.name} <strong className="text-[#d4af37]">({m.amount} ETB)</strong>
                        </span>
                      ))
                    )}
                  </div>

                  {/* 🔍 Autocomplete Search */}
                  {role === 'admin' && !isReady && (
                    <div className="pt-2">
                      {activeSearchSlotId === slot.id ? (
                        <div className="space-y-2 bg-[#041c12] p-3 rounded-xl border border-emerald-700">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="አባል በስም ወይም በስልክ ቁጥር ፈልግ..."
                              className="w-full bg-[#0a2e1d] border border-emerald-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                              autoFocus
                            />
                          </div>

                          <div className="max-h-36 overflow-y-auto space-y-1">
                            {filteredMembers.map((member) => (
                              <div
                                key={member.id}
                                onClick={() => handleAssignMember(slot.id, member)}
                                className="flex justify-between items-center p-2 hover:bg-emerald-800/60 rounded-lg cursor-pointer text-xs transition"
                              >
                                <span>{member.name} ({member.phone || 'ስልክ የለውም'})</span>
                                <span className="text-[#d4af37] font-bold bg-[#d4af37]/10 px-2 py-0.5 rounded">+ አስገባ</span>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => { setActiveSearchSlotId(null); setSearchTerm(''); }}
                            className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                          >
                            ዝጋ
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveSearchSlotId(slot.id)}
                          className="text-[11px] text-[#d4af37] font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          + አባል ፈልጎ አስገባ (Search & Assign)
                        </button>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}