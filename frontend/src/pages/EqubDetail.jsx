import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Users, 
  ArrowLeft, 
  Search, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Edit3
} from 'lucide-react';

export default function EqubDetail({ equbId, role = 'admin', onBack, onNavigate, lang = 'am' }) {
  const [equbData, setEqubData] = useState(null);
  const [slots, setSlots] = useState([]);
  const [membersList, setMembersList] = useState([]);
  
  const [slotName, setSlotName] = useState('');
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editSlotName, setEditSlotName] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const mainEqubAmount = equbData?.contributionAmount || equbData?.contribution_amount || equbData?.amount || 1000;

  useEffect(() => {
    const storedEqubs = 
      localStorage.getItem('yop_saved_equbs') || 
      localStorage.getItem('all_equbs') || 
      localStorage.getItem('yop_current_active_equb');

    if (storedEqubs) {
      try {
        const parsed = JSON.parse(storedEqubs);
        let current = null;

        if (Array.isArray(parsed)) {
          current = equbId ? parsed.find(item => String(item.id) === String(equbId)) : parsed[0];
        } else if (typeof parsed === 'object' && parsed !== null) {
          current = parsed;
        }

        if (current) {
          setEqubData(current);
          const targetPrice = current.contributionAmount || current.contribution_amount || 1000;
          const initialSlots = (current.slots || []).map(s => ({
            ...s,
            amount: targetPrice
          }));
          setSlots(initialSlots);
        }
      } catch (e) {
        console.error("Error parsing saved equbs:", e);
      }
    }

    const storedMembers = localStorage.getItem('yop_members') || localStorage.getItem('yop_registered_members');
    if (storedMembers) {
      try {
        setMembersList(JSON.parse(storedMembers));
      } catch (e) {
        console.error("Error parsing member registry:", e);
      }
    } else {
      setMembersList([
        { id: 1, name: 'በረከት አበበ', phone: '0911223344', shares: 1 },
        { id: 2, name: 'ሰላም ታደሰ', phone: '0922334455', shares: 1 },
        { id: 3, name: 'ኤፍሬም መኮንን', phone: '0933445566', shares: 2 }
      ]);
    }
  }, [equbId]);

  const saveSlotsToStorage = (updatedSlots, updatedEqubData = null) => {
    try {
      const targetData = updatedEqubData || equbData;
      if (!targetData) return;

      const dataToSave = { ...targetData, slots: updatedSlots };
      const stored = localStorage.getItem('yop_saved_equbs') || localStorage.getItem('all_equbs');
      let parsedList = stored ? JSON.parse(stored) : [];
      
      if (!Array.isArray(parsedList)) parsedList = [parsedList];

      const existingIndex = parsedList.findIndex(item => String(item.id) === String(targetData.id));
      if (existingIndex >= 0) {
        parsedList[existingIndex] = dataToSave;
      } else {
        parsedList.unshift(dataToSave);
      }

      localStorage.setItem('yop_saved_equbs', JSON.stringify(parsedList));
      localStorage.setItem('all_equbs', JSON.stringify(parsedList));
      localStorage.setItem('yop_current_active_equb', JSON.stringify(dataToSave));
      localStorage.setItem('current_equb', JSON.stringify(dataToSave));

      fetch("http://127.0.0.1:5000/api/equbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave)
      }).catch(err => console.log("Backend sync warning:", err));

    } catch (e) {
      console.error("Failed to save slots:", e);
    }
  };

  const handleCreateSlot = (e) => {
    e.preventDefault();
    if (!slotName.trim()) {
      setErrorMsg(lang === 'am' ? 'እባክዎ የስሎቱን ስም ያስገቡ!' : 'Please enter slot name!');
      return;
    }

    const newSlot = {
      id: Date.now(),
      name: slotName.trim(),
      amount: mainEqubAmount,
      assignedMember: null,
      paidAmount: 0
    };

    const updatedSlots = [...slots, newSlot];
    setSlots(updatedSlots);
    setSlotName('');
    setErrorMsg('');
    saveSlotsToStorage(updatedSlots);
  };

  const handleUpdateSlotName = (slotId) => {
    if (!editSlotName.trim()) return;
    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, name: editSlotName.trim() };
      }
      return slot;
    });
    setSlots(updatedSlots);
    setEditingSlotId(null);
    setEditSlotName('');
    saveSlotsToStorage(updatedSlots);
  };

  const handleAssignMember = (slotId, member) => {
    const currentAssignments = slots.filter(
      slot => slot.assignedMember && (slot.assignedMember.phone === member.phone || slot.assignedMember.id === member.id)
    ).length;

    const allowedShares = member.shares || 1;

    if (currentAssignments >= allowedShares) {
      setErrorMsg(
        lang === 'am'
          ? `⚠️ ይቅርታ! ${member.name} ከዚህ በፊት በሌላ ስሎት ተመድቧል።`
          : `⚠️ Restricted! ${member.name} is already assigned to a slot.`
      );
      return;
    }

    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return { 
          ...slot, 
          assignedMember: member,
          paidAmount: mainEqubAmount 
        };
      }
      return slot;
    });

    setSlots(updatedSlots);
    setActiveSlotId(null);
    setSearchTerm('');
    setErrorMsg('');
    saveSlotsToStorage(updatedSlots);
  };

  const handleRemoveMember = (slotId) => {
    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, assignedMember: null, paidAmount: 0 };
      }
      return slot;
    });
    setSlots(updatedSlots);
    saveSlotsToStorage(updatedSlots);
  };

  const handleDeleteSlot = (id) => {
    const updatedSlots = slots.filter(s => s.id !== id);
    setSlots(updatedSlots);
    saveSlotsToStorage(updatedSlots);
  };

  const handleReturnHome = () => {
    if (onNavigate) {
      onNavigate('home');
    } else if (onBack) {
      onBack();
    } else {
      window.location.reload();
    }
  };

  const filteredMembers = membersList.filter(m => 
    (m.name && m.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (m.phone && m.phone.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 md:p-8 space-y-6 font-sans">
      
      {/* Navigation Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between border-b border-amber-500/20 pb-4">
        <button
          onClick={handleReturnHome}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'am' ? 'ወደ ዋናው ገጽ ተመለስ' : 'Back to Dashboard'}</span>
        </button>
        <span className="text-xs text-amber-400 bg-[#0d1322] px-3.5 py-2 rounded-xl border border-amber-500/30 font-bold flex items-center gap-2 shadow-md">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          {equbData?.name || (lang === 'am' ? 'ዮጵ ዲጂታል እቁብ' : 'Yop Digital Equb')} | {lang === 'am' ? 'የዕቁብ መጠን' : 'Amount'}: <strong className="text-white">{mainEqubAmount} ETB</strong>
        </span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {errorMsg && (
          <div className="p-4 bg-red-950/90 border border-red-600 rounded-2xl text-red-200 text-xs font-bold flex items-center gap-3 shadow-2xl">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* ➕ Automated Slot Creation Card (Admin Only) */}
        {role === 'admin' && (
          <div className="bg-[#0d1322]/95 border border-amber-500/30 p-6 rounded-3xl shadow-2xl space-y-4 backdrop-blur">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                <Plus className="w-4 h-4" /> 
                {lang === 'am' ? 'አዲስ ስሎት መፍጠሪያ' : 'Create New Slot'}
              </h3>
              <span className="text-[11px] text-amber-300/80 bg-slate-950 px-3 py-1 rounded-lg border border-amber-500/20 font-mono">
                ⚡ {lang === 'am' ? `ዋጋው በራስ-ሰር ${mainEqubAmount} ETB ይሆናል` : `Auto-priced at ${mainEqubAmount} ETB`}
              </span>
            </div>

            <form onSubmit={handleCreateSlot} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={slotName}
                onChange={(e) => setSlotName(e.target.value)}
                placeholder={lang === 'am' ? "የስሎት ስም (ምሳሌ፦ ስሎት #1, ዙር #1)..." : "Slot identifier (e.g. Slot #1)..."}
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shrink-0 shadow-lg flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'am' ? 'ስሎት ፍጠር' : 'Add Slot'}</span>
              </button>
            </form>
          </div>
        )}

        {/* 📋 Registered Slots & Payment Validation Panel */}
        <div className="bg-[#0d1322]/95 border border-amber-500/30 p-6 rounded-3xl shadow-2xl space-y-4 backdrop-blur">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
              <Users className="w-4 h-4" /> 
              {lang === 'am' ? 'የስሎቶች እና የክፍያ ማረጋገጫ ዝርዝር' : 'Slots & Payment Status Summary'}
            </h3>
            <span className="text-[10px] bg-slate-950 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-lg font-bold">
              {slots.length} {lang === 'am' ? 'ስሎቶች' : 'Slots'}
            </span>
          </div>

          {slots.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <p>{lang === 'am' ? 'እስካሁን የተፈጠረ ስሎት የለም።' : 'No slots created yet.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => {
                const isPaidFull = slot.assignedMember && (slot.paidAmount >= slot.amount);

                return (
                  <div key={slot.id} className="p-4 bg-slate-950/80 border border-amber-500/20 rounded-2xl space-y-3 hover:border-amber-400/50 transition">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        {editingSlotId === slot.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={editSlotName} 
                              onChange={(e) => setEditSlotName(e.target.value)}
                              placeholder={slot.name}
                              className="bg-slate-900 border border-amber-400 rounded-lg px-2 py-1 text-xs text-white"
                            />
                            <button 
                              onClick={() => handleUpdateSlotName(slot.id)}
                              className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                            >
                              {lang === 'am' ? 'መዝግብ' : 'Save'}
                            </button>
                            <button 
                              onClick={() => setEditingSlotId(null)}
                              className="text-slate-400 text-[10px]"
                            >
                              {lang === 'am' ? 'ተው' : 'Cancel'}
                            </button>
                          </div>
                        ) : (
                          <h4 className="text-xs font-black text-white flex items-center gap-2">
                            🎯 {slot.name} 
                            <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono text-[11px] border border-amber-500/20">
                              {slot.amount} ETB
                            </span>
                            {role === 'admin' && (
                              <button 
                                onClick={() => { setEditingSlotId(slot.id); setEditSlotName(slot.name); }}
                                className="text-amber-400 hover:text-amber-300 p-1 cursor-pointer"
                                title="Edit Slot Name"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </h4>
                        )}

                        <p className="text-[11px] text-slate-300 mt-1">
                          {slot.assignedMember ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-amber-400" /> 
                              {lang === 'am' ? 'የተመደበ አባል' : 'Assigned Member'}: <strong className="text-white">{slot.assignedMember.name}</strong> ({slot.assignedMember.phone})
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">
                              {lang === 'am' ? 'አባል አልተመደበለትም (ክፍት)' : 'Unassigned (Open)'}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {slot.assignedMember && (
                          isPaidFull ? (
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-md">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 
                              {lang === 'am' ? 'ለዕጣ ዝግጁ ነው' : 'Ready for Draw'}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-950/90 text-amber-300 border border-amber-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-md">
                              <Clock className="w-3.5 h-3.5 text-amber-400" /> 
                              {lang === 'am' ? 'ክፍያ ያልተሟላ (Pending)' : 'Payment Incomplete'}
                            </span>
                          )
                        )}

                        {slot.assignedMember && role === 'admin' && (
                          <button
                            onClick={() => handleRemoveMember(slot.id)}
                            className="px-3 py-1.5 bg-red-950 text-red-300 border border-red-800 text-[10px] rounded-xl hover:bg-red-900 transition cursor-pointer font-bold"
                          >
                            {lang === 'am' ? 'አንሳ' : 'Unassign'}
                          </button>
                        )}

                        {role === 'admin' && (
                          <button 
                            onClick={() => handleDeleteSlot(slot.id)} 
                            className="p-2 text-red-400 hover:bg-red-950 border border-red-900/50 rounded-xl transition cursor-pointer"
                            title="Delete Slot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {role === 'admin' && !slot.assignedMember && (
                      <div className="pt-2 border-t border-slate-800">
                        {activeSlotId === slot.id ? (
                          <div className="space-y-2 bg-slate-900 p-3 rounded-xl border border-amber-500/30 shadow-inner">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-3" />
                              <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={lang === 'am' ? "የአባል ስም ወይም ስልክ ቁጥር ጻፍ..." : "Search member by name or phone..."}
                                className="w-full bg-slate-950 border border-amber-500/30 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                                autoFocus
                              />
                            </div>

                            <div className="max-h-36 overflow-y-auto space-y-1">
                              {filteredMembers.length === 0 ? (
                                <p className="text-[11px] text-slate-500 text-center py-2">
                                  {lang === 'am' ? 'ምንም የተገኘ አባል የለም።' : 'No matching members found.'}
                                </p>
                              ) : (
                                filteredMembers.map((member) => (
                                  <div
                                    key={member.id || member.phone}
                                    onClick={() => handleAssignMember(slot.id, member)}
                                    className="flex justify-between items-center p-2 bg-slate-950 hover:bg-slate-900 rounded-lg cursor-pointer text-xs transition border border-transparent hover:border-amber-500/30"
                                  >
                                    <div>
                                      <strong className="text-white">{member.name}</strong>
                                      <span className="text-amber-400/80 ml-2 text-[10px]">({member.phone})</span>
                                    </div>
                                    <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded text-[10px] border border-amber-500/20">
                                      + {lang === 'am' ? 'አስገባ' : 'Assign'}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>

                            <button
                              onClick={() => { setActiveSlotId(null); setSearchTerm(''); }}
                              className="text-[10px] text-slate-400 hover:text-white underline pt-1 block text-right w-full cursor-pointer"
                            >
                              {lang === 'am' ? 'ዝጋ' : 'Close'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveSlotId(slot.id)}
                            className="text-[11px] text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-amber-500/30 hover:border-amber-400 transition shadow-sm"
                          >
                            + {lang === 'am' ? 'አባል ፈልጎ አስገባ (Search & Assign)' : 'Search & Assign Member'}
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