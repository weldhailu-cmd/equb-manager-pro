import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Plus, Trash2, Users, Search, 
  CheckCircle2, Clock, AlertCircle 
} from "lucide-react";

export default function EqubDetail({ equbId, role = 'admin', onBack, lang = 'am' }) {
  const [equbData, setEqubData] = useState(null);
  const [slots, setSlots] = useState([]);
  const [membersList, setMembersList] = useState([]);

  // 🌟 1. የስሎት ስም ብቻ (ቅጽል ስም እና የብር መጠን ሙሉ በሙሉ ተወግደዋል!)
  const [slotName, setSlotName] = useState('');
  
  // 🌟 2. አባል ፈልጎ ለማስገባት (Autocomplete Search)
  const [activeSlotForSearch, setActiveSlotForSearch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // የዕቁቡ ኢላማ መጠን (Target Amount) - ለምሳሌ 1000 ETB
  const targetAmount = equbData?.contributionAmount || equbData?.contribution_amount || 1000;

  useEffect(() => {
    // 1. የዕቁቡን መረጃ መጫን
    const storedEqubs = localStorage.getItem('yop_saved_equbs') || localStorage.getItem('all_equbs');
    if (storedEqubs) {
      try {
        const parsed = JSON.parse(storedEqubs);
        const current = parsed.find(item => String(item.id) === String(equbId));
        if (current) {
          setEqubData(current);
          setSlots(current.slots || []);
        }
      } catch (e) {}
    }

    // 2. የተመዘገቡ አባላትን መጫን (ለ Autocomplete Search)
    const storedMembers = localStorage.getItem('yop_members');
    if (storedMembers) {
      try {
        setMembersList(JSON.parse(storedMembers));
      } catch (e) {}
    } else {
      // ነባሪ ምሳሌ አባላት (የተመዘገቡ አባላት ከሌሉ)
      setMembersList([
        { id: 1, name: 'በረከት አበበ', phone: '0911223344', contribution: 500 },
        { id: 2, name: 'ሰላም ታደሰ', phone: '0922334455', contribution: 500 },
        { id: 3, name: 'ኤፍሬም መኮንን', phone: '0933445566', contribution: 1000 }
      ]);
    }
  }, [equbId]);

  // Storage ማዘመኛ ተግባር
  const updateLocalStorageSlots = (updatedSlots) => {
    setSlots(updatedSlots);
    const storedEqubs = localStorage.getItem('yop_saved_equbs') || localStorage.getItem('all_equbs');
    if (storedEqubs) {
      try {
        let parsed = JSON.parse(storedEqubs);
        parsed = parsed.map(item => String(item.id) === String(equbId) ? { ...item, slots: updatedSlots } : item);
        localStorage.setItem('yop_saved_equbs', JSON.stringify(parsed));
        localStorage.setItem('all_equbs', JSON.stringify(parsed));
      } catch (e) {}
    }
  };

  // ➕ አዲስ ስሎት መፍጠር (የስሎት ስም ብቻ!)
  const handleCreateSlot = (e) => {
    e.preventDefault();
    if (!slotName.trim()) {
      setErrorMsg(lang === 'am' ? 'እባክዎ የስሎቱን ስም ያስገቡ!' : 'Enter slot name!');
      return;
    }

    const newSlot = {
      id: Date.now(),
      name: slotName.trim(),
      assignedMembers: [] // የተመደቡ አባላት ዝርዝር
    };

    const updated = [...slots, newSlot];
    updateLocalStorageSlots(updated);
    setSlotName('');
    setErrorMsg('');
  };

  // 🔍 አባልን ፈልጎ ወደ ስሎት ማያያዝ + Capacity/Pooling Logic
  const handleAssignMember = (slotId, member) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    const currentSum = slot.assignedMembers.reduce((sum, m) => sum + Number(m.amount || 0), 0);
    const memberContribution = Number(member.contribution || member.amount || 500);

    // 🛑 የአንድ ሺህ ብር ገደብ ማረጋገጫ (Limit Validation)
    if (currentSum + memberContribution > targetAmount) {
      setErrorMsg(`⚠️ ይቅርታ! የዚህ ስሎት ገደብ (${targetAmount} ETB) ይሞላል። ከዚህ በላይ መጨመር አይቻልም።`);
      return;
    }

    const updatedMembers = [
      ...slot.assignedMembers, 
      { id: member.id, name: member.name, phone: member.phone, amount: memberContribution }
    ];

    const updatedSlots = slots.map(s => s.id === slotId ? { ...s, assignedMembers: updatedMembers } : s);
    updateLocalStorageSlots(updatedSlots);

    setSearchTerm('');
    setActiveSlotForSearch(null);
    setErrorMsg('');
  };

  // 🗑️ ስሎት መሰረዝ
  const handleDeleteSlot = (slotId) => {
    const updated = slots.filter(s => s.id !== slotId);
    updateLocalStorageSlots(updated);
  };

  // Autocomplete Filter
  const filteredMembers = membersList.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.phone && m.phone.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-[#071f15] text-white p-4 md:p-8 font-sans space-y-6">
      
      {/* 🔙 Header Navigation */}
      <div className="max-w-4xl mx-auto flex items-center justify-between border-b border-emerald-800/80 pb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-400 border border-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'am' ? 'ተመለስ' : 'Back'}</span>
        </button>

        <h2 className="text-sm md:text-base font-black text-amber-400">
          {equbData?.name || 'የዕቁብ ስሎቶች ማስተዳደሪያ'} ({targetAmount} ETB)
        </h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* ➕ አዲስ ስሎት መፍጠሪያ ቅጽ (የስሎቱ ስም ብቻ!) */}
        {role === 'admin' && (
          <div className="bg-[#0c2b1e] border border-emerald-700/60 p-5 rounded-2xl shadow-xl space-y-3">
            <h3 className="text-xs font-black text-amber-400 flex items-center gap-2">
              <Plus className="w-4 h-4" /> 
              {lang === 'am' ? 'አዲስ ስሎት መፍጠሪያ (የስሎት ስም ብቻ)' : 'Add New Slot'}
            </h3>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-700 rounded-xl text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateSlot} className="flex gap-3">
              <input
                type="text"
                value={slotName}
                onChange={(e) => setSlotName(e.target.value)}
                placeholder="ምሳሌ፦ ቦስ 1 ወይም ስሎት #1..."
                className="w-full bg-[#05170f] border border-emerald-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>ስሎት መዝግብ</span>
              </button>
            </form>
          </div>
        )}

        {/* 📋 የነባር ስሎቶች እና የአባላት መመደቢያ ዝርዝር */}
        <div className="bg-[#0c2b1e] border border-emerald-700/60 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
            <h3 className="text-xs font-black text-amber-400 flex items-center gap-2">
              <Users className="w-4 h-4" /> 
              {lang === 'am' ? 'የስሎቶች እና አባላት ማከፋፈያ' : 'Slots & Assigned Members'}
            </h3>
            <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-amber-300 px-2.5 py-1 rounded-lg">
              ድምር ስሎቶች፡ {slots.length}
            </span>
          </div>

          {slots.length === 0 ? (
            <p className="text-center text-emerald-300/60 text-xs py-8">እስካሁን የተመዘገበ ስሎት የለም።</p>
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => {
                const assigned = slot.assignedMembers || [];
                const currentTotal = assigned.reduce((sum, m) => sum + Number(m.amount || 0), 0);
                const isReady = currentTotal >= targetAmount;

                return (
                  <div key={slot.id} className="p-4 bg-[#05170f] border border-emerald-800/80 rounded-xl space-y-3">
                    
                    {/* Slot Title & Status */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black text-white flex items-center gap-2">
                          🎯 {slot.name}
                        </h4>
                        <p className="text-[11px] text-emerald-300 mt-0.5">
                          የተሰበሰበ፦ <strong className="text-amber-400">{currentTotal} / {targetAmount} ETB</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isReady ? (
                          <span className="text-[10px] bg-green-950 text-green-300 border border-green-600 px-3 py-1 rounded-xl font-bold flex items-center gap-1 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> ለዕጣ ዝግጁ ነው (Ready)
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-600 px-3 py-1 rounded-xl font-bold flex items-center gap-1 shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-amber-400" /> ገና አልሞላም (Pending)
                          </span>
                        )}

                        {role === 'admin' && (
                          <button 
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="p-1.5 text-red-400 hover:bg-red-950/80 rounded-lg transition"
                            title="ስሎቱን ሰርዝ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* የተመደቡ አባላት ዝርዝር */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-900/60">
                      {assigned.length === 0 ? (
                        <span className="text-[11px] text-emerald-400/50 italic">ምንም አባል አልተመደበም</span>
                      ) : (
                        assigned.map((m, idx) => (
                          <span key={idx} className="text-[11px] bg-emerald-950 border border-emerald-700/80 px-2.5 py-1 rounded-lg text-white font-medium flex items-center gap-1">
                            👤 {m.name} <strong className="text-amber-400">({m.amount} ETB)</strong>
                          </span>
                        ))
                      )}
                    </div>

                    {/* 🔍 አባል ፈልጎ ማስገቢያ (Autocomplete Search) */}
                    {role === 'admin' && !isReady && (
                      <div className="pt-2">
                        {activeSlotForSearch === slot.id ? (
                          <div className="space-y-2 bg-[#020b07] p-3 rounded-xl border border-emerald-700">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-2.5" />
                              <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="አባል በስም ወይም በስልክ ቁጥር ፈልግ (ምሳሌ፦ በረከት)..."
                                className="w-full bg-[#05170f] border border-emerald-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                autoFocus
                              />
                            </div>

                            <div className="max-h-36 overflow-y-auto space-y-1">
                              {filteredMembers.length === 0 ? (
                                <p className="text-[11px] text-emerald-400/60 text-center py-2">ምንም አባል አልተገኘም።</p>
                              ) : (
                                filteredMembers.map((member) => (
                                  <div
                                    key={member.id}
                                    onClick={() => handleAssignMember(slot.id, member)}
                                    className="flex justify-between items-center p-2 hover:bg-emerald-900/80 rounded-lg cursor-pointer text-xs transition"
                                  >
                                    <span>{member.name} ({member.phone || 'ስልክ የለውም'})</span>
                                    <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">+ አስገባ</span>
                                  </div>
                                ))
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => { setActiveSlotForSearch(null); setSearchTerm(''); }}
                              className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                            >
                              ዝጋ (Close)
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveSlotForSearch(slot.id)}
                            className="text-[11px] text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            + አባል ፈልጎ አስገባ (Search & Assign Member)
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
    </div>
  );
}