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
  Edit3,
  RefreshCw,
  Sliders
} from 'lucide-react';

export default function EqubDetail({ equbId, role = 'admin', onBack, onNavigate, lang = 'am' }) {
  const [equbData, setEqubData] = useState(null);
  const [slots, setSlots] = useState([]);
  const [membersList, setMembersList] = useState([]);
  
  const [slotName, setSlotName] = useState('');
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editSlotName, setEditSlotName] = useState('');
  
  // Advanced Member & Contribution Edit State
  const [editingMemberSlotId, setEditingMemberSlotId] = useState(null);
  const [transferTargetPhone, setTransferTargetPhone] = useState('');
  const [customContributionAmount, setCustomContributionAmount] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Translations Dictionary for Dynamic Language Toggle
  const t = {
    am: {
      back: 'ወደ ዋናው ገጽ ተመለስ',
      amount: 'የዕቁብ መጠን',
      createSlotTitle: 'አዲስ ስሎት መፍጠሪያ',
      autoPriced: 'ዋጋው በራስ-ሰር',
      slotPlaceholder: 'የስሎት ስም (ምሳሌ፦ ስሎት #1, ዙር #1)...',
      addSlotBtn: 'ስሎት ፍጠር',
      slotsListTitle: 'የስሎቶች እና የክፍያ ማረጋገጫ ዝርዝር',
      slotsCount: 'ስሎቶች',
      noSlots: 'እስካሁን የተፈጠረ ስሎት የለም።',
      assignedMember: 'የተመደበ አባል',
      unassigned: 'አባል አልተመደበለትም (ክፍት)',
      readyForDraw: 'ለዕጣ ዝግጁ ነው',
      pendingPayment: 'ክፍያ ያልተሟላ (Pending)',
      unassignBtn: 'አንሳ',
      save: 'መዝግብ',
      cancel: 'ተው',
      searchPlaceholder: 'የአባል ስም ወይም ስልክ ቁጥር ጻፍ...',
      noMemberFound: 'ምንም የተገኘ አባል የለም።',
      assign: 'አስገባ',
      searchAssign: 'አባል ፈልጎ አስገባ (Search & Assign)',
      close: 'ዝጋ',
      editShare: 'አባል እና መዋጮ አስተካክል',
      transferShare: 'አባል መቀየር / ድርሻ ማስተላለፍ',
      customAmountLabel: 'የግለሰብ መዋጮ መጠን (ETB):',
      transferPlaceholder: 'ተቀባይ አባል ይምረጡ...',
      confirmUpdate: 'አዘምን'
    },
    en: {
      back: 'Back to Dashboard',
      amount: 'Equb Amount',
      createSlotTitle: 'Create New Slot',
      autoPriced: 'Auto-priced at',
      slotPlaceholder: 'Slot identifier (e.g. Slot #1)...',
      addSlotBtn: 'Add Slot',
      slotsListTitle: 'Slots & Payment Status Summary',
      slotsCount: 'Slots',
      noSlots: 'No slots created yet.',
      assignedMember: 'Assigned Member',
      unassigned: 'Unassigned (Open)',
      readyForDraw: 'Ready for Draw',
      pendingPayment: 'Payment Incomplete',
      unassignBtn: 'Unassign',
      save: 'Save',
      cancel: 'Cancel',
      searchPlaceholder: 'Search member by name or phone...',
      noMemberFound: 'No matching members found.',
      assign: 'Assign',
      searchAssign: 'Search & Assign Member',
      close: 'Close',
      editShare: 'Edit Member & Contribution',
      transferShare: 'Change Member / Transfer Share',
      customAmountLabel: 'Custom Contribution Amount (ETB):',
      transferPlaceholder: 'Select recipient member...',
      confirmUpdate: 'Update'
    }
  };

  const tr = t[lang] || t['am'];
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
            amount: s.amount || targetPrice
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
    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return { 
          ...slot, 
          assignedMember: member,
          amount: slot.amount || mainEqubAmount,
          paidAmount: slot.amount || mainEqubAmount 
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

  // Update Member, Transfer Share, or Custom Contribution Amount
  const handleUpdateSlotAssignment = (slotId) => {
    const targetMember = membersList.find(m => m.phone === transferTargetPhone);
    const newAmount = customContributionAmount ? parseFloat(customContributionAmount) : null;

    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return { 
          ...slot, 
          assignedMember: targetMember ? targetMember : slot.assignedMember,
          amount: newAmount !== null && !isNaN(newAmount) ? newAmount : slot.amount,
          paidAmount: newAmount !== null && !isNaN(newAmount) ? newAmount : slot.paidAmount
        };
      }
      return slot;
    });

    setSlots(updatedSlots);
    setEditingMemberSlotId(null);
    setTransferTargetPhone('');
    setCustomContributionAmount('');
    setErrorMsg('');
    saveSlotsToStorage(updatedSlots);
  };

  const handleRemoveMember = (slotId) => {
    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, assignedMember: null, paidAmount: 0, amount: mainEqubAmount };
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
          <span>{tr.back}</span>
        </button>
        <span className="text-xs text-amber-400 bg-[#0d1322] px-3.5 py-2 rounded-xl border border-amber-500/30 font-bold flex items-center gap-2 shadow-md">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          {equbData?.name || (lang === 'am' ? 'ዮጵ ዲጂታል እቁብ' : 'Yop Digital Equb')} | {tr.amount}: <strong className="text-white">{mainEqubAmount} ETB</strong>
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
                {tr.createSlotTitle}
              </h3>
              <span className="text-[11px] text-amber-300/80 bg-slate-950 px-3 py-1 rounded-lg border border-amber-500/20 font-mono">
                ⚡ {tr.autoPriced} {mainEqubAmount} ETB
              </span>
            </div>

            <form onSubmit={handleCreateSlot} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={slotName}
                onChange={(e) => setSlotName(e.target.value)}
                placeholder={tr.slotPlaceholder}
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shrink-0 shadow-lg flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{tr.addSlotBtn}</span>
              </button>
            </form>
          </div>
        )}

        {/* 📋 Registered Slots & Payment Validation Panel */}
        <div className="bg-[#0d1322]/95 border border-amber-500/30 p-6 rounded-3xl shadow-2xl space-y-4 backdrop-blur">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
              <Users className="w-4 h-4" /> 
              {tr.slotsListTitle}
            </h3>
            <span className="text-[10px] bg-slate-950 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-lg font-bold">
              {slots.length} {tr.slotsCount}
            </span>
          </div>

          {slots.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <p>{tr.noSlots}</p>
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
                              {tr.save}
                            </button>
                            <button 
                              onClick={() => setEditingSlotId(null)}
                              className="text-slate-400 text-[10px]"
                            >
                              {tr.cancel}
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

                        <div className="text-[11px] text-slate-300 mt-1 space-y-1">
                          {slot.assignedMember ? (
                            <div>
                              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                <UserCheck className="w-3.5 h-3.5 text-amber-400" /> 
                                {tr.assignedMember}: <strong className="text-white">{slot.assignedMember.name}</strong> ({slot.assignedMember.phone})
                                {role === 'admin' && (
                                  <button 
                                    onClick={() => {
                                      setEditingMemberSlotId(editingMemberSlotId === slot.id ? null : slot.id);
                                      setCustomContributionAmount(slot.amount);
                                      setTransferTargetPhone(slot.assignedMember?.phone || '');
                                    }}
                                    className="ml-2 text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1 cursor-pointer"
                                  >
                                    <RefreshCw className="w-3 h-3" /> {tr.editShare}
                                  </button>
                                )}
                              </div>

                              {/* Dropdown / Edit Panel for Member Transfer & Custom Contribution */}
                              {editingMemberSlotId === slot.id && (
                                <div className="mt-3 p-3 bg-slate-900 border border-amber-500/40 rounded-xl space-y-3 shadow-inner">
                                  <p className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                                    <Sliders className="w-3.5 h-3.5" /> {tr.transferShare}:
                                  </p>
                                  
                                  <div className="space-y-2">
                                    <div>
                                      <label className="text-[10px] text-slate-400 block mb-1">አባል መቀየሪያ (Dropdown):</label>
                                      <select
                                        value={transferTargetPhone}
                                        onChange={(e) => setTransferTargetPhone(e.target.value)}
                                        className="bg-slate-950 border border-amber-500/30 text-xs text-amber-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-amber-400"
                                      >
                                        <option value="">{tr.transferPlaceholder}</option>
                                        {membersList.map(m => (
                                          <option key={m.id || m.phone} value={m.phone}>{m.name} ({m.phone})</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label className="text-[10px] text-slate-400 block mb-1">{tr.customAmountLabel}</label>
                                      <input
                                        type="number"
                                        value={customContributionAmount}
                                        onChange={(e) => setCustomContributionAmount(e.target.value)}
                                        placeholder="1000"
                                        className="bg-slate-950 border border-amber-500/30 text-xs text-amber-400 font-bold rounded-lg px-3 py-2 w-full focus:outline-none focus:border-amber-400"
                                      />
                                    </div>

                                    <div className="flex gap-2 pt-1">
                                      <button
                                        onClick={() => handleUpdateSlotAssignment(slot.id)}
                                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-1.5 rounded-lg text-[11px] font-black cursor-pointer shadow-md"
                                      >
                                        {tr.confirmUpdate}
                                      </button>
                                      <button
                                        onClick={() => setEditingMemberSlotId(null)}
                                        className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer"
                                      >
                                        {tr.cancel}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">
                              {tr.unassigned}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {slot.assignedMember && (
                          isPaidFull ? (
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-md">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 
                              {tr.readyForDraw}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-950/90 text-amber-300 border border-amber-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-md">
                              <Clock className="w-3.5 h-3.5 text-amber-400" /> 
                              {tr.pendingPayment}
                            </span>
                          )
                        )}

                        {slot.assignedMember && role === 'admin' && (
                          <button
                            onClick={() => handleRemoveMember(slot.id)}
                            className="px-3 py-1.5 bg-red-950 text-red-300 border border-red-800 text-[10px] rounded-xl hover:bg-red-900 transition cursor-pointer font-bold"
                          >
                            {tr.unassignBtn}
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
                                placeholder={tr.searchPlaceholder}
                                className="w-full bg-slate-950 border border-amber-500/30 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                                autoFocus
                              />
                            </div>

                            <div className="max-h-36 overflow-y-auto space-y-1">
                              {filteredMembers.length === 0 ? (
                                <p className="text-[11px] text-slate-500 text-center py-2">
                                  {tr.noMemberFound}
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
                                      + {tr.assign}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>

                            <button
                              onClick={() => { setActiveSlotId(null); setSearchTerm(''); }}
                              className="text-[10px] text-slate-400 hover:text-white underline pt-1 block text-right w-full cursor-pointer"
                            >
                              {tr.close}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveSlotId(slot.id)}
                            className="text-[11px] text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-amber-500/30 hover:border-amber-400 transition shadow-sm"
                          >
                            + {tr.searchAssign}
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