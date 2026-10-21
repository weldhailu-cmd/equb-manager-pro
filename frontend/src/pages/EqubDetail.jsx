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
  AlertCircle 
} from 'lucide-react';

export default function EqubDetail({ equbId, role, onBack, lang = 'am' }) {
  const [equbData, setEqubData] = useState(null);
  const [slots, setSlots] = useState([]);
  const [membersList, setMembersList] = useState([]);
  
  // Slot creation state (only slot name required - price is strictly automated)
  const [slotName, setSlotName] = useState('');
  
  // Autocomplete & Search States
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Automated Pricing Derived Directly From Main Equb Configuration
  const mainEqubAmount = equbData?.contributionAmount || equbData?.contribution_amount || 200;

  useEffect(() => {
    // Load Parent Equb Details
    const storedEqubs = localStorage.getItem('yop_saved_equbs') || localStorage.getItem('all_equbs');
    if (storedEqubs) {
      try {
        const parsed = JSON.parse(storedEqubs);
        const current = parsed.find(item => String(item.id) === String(equbId));
        if (current) {
          setEqubData(current);
          
          // Inherit main contribution amount for initial slots
          const targetPrice = current.contributionAmount || current.contribution_amount || 200;
          const initialSlots = (current.slots || []).map(s => ({
            ...s,
            amount: targetPrice // Enforce parent amount
          }));
          
          setSlots(initialSlots);
        }
      } catch (e) {
        console.error("Error parsing saved equbs:", e);
      }
    }

    // Load Global Member Registry
    const storedMembers = localStorage.getItem('yop_members') || localStorage.getItem('yop_registered_members');
    if (storedMembers) {
      try {
        setMembersList(JSON.parse(storedMembers));
      } catch (e) {
        console.error("Error parsing member registry:", e);
      }
    } else {
      // Fallback Registry for initial testing
      setMembersList([
        { id: 1, name: 'በረከት አበበ', phone: '0911223344', shares: 1 },
        { id: 2, name: 'ሰላም ታደሰ', phone: '0922334455', shares: 1 },
        { id: 3, name: 'ኤፍሬም መኮንን', phone: '0933445566', shares: 2 } // Multi-share support
      ]);
    }
  }, [equbId]);

  // Save changes back to LocalStorage
  const saveSlotsToStorage = (updatedSlots) => {
    const stored = localStorage.getItem('yop_saved_equbs');
    if (stored) {
      try {
        let parsed = JSON.parse(stored);
        parsed = parsed.map(item => 
          String(item.id) === String(equbId) ? { ...item, slots: updatedSlots } : item
        );
        localStorage.setItem('yop_saved_equbs', JSON.stringify(parsed));
        localStorage.setItem('all_equbs', JSON.stringify(parsed));
      } catch (e) {
        console.error("Failed to save slots:", e);
      }
    }
  };

  // 2. Automated Slot Creation (No manual price input, no nicknames)
  const handleCreateSlot = (e) => {
    e.preventDefault();
    if (!slotName.trim()) {
      setErrorMsg(lang === 'am' ? 'እባክዎ የስሎቱን ስም ያስገቡ!' : 'Please enter slot name!');
      return;
    }

    const newSlot = {
      id: Date.now(),
      name: slotName.trim(),
      amount: mainEqubAmount, // AUTOMATICALLY DERIVED FROM MAIN EQUB
      assignedMember: null,
      paidAmount: 0 // Default starting payment
    };

    const updatedSlots = [...slots, newSlot];
    setSlots(updatedSlots);
    setSlotName('');
    setErrorMsg('');
    saveSlotsToStorage(updatedSlots);
  };

  // 3. Strict Member Assignment & Single-Slot Validation Rule
  const handleAssignMember = (slotId, member) => {
    // Count current occurrences of this member in all active slots
    const currentAssignments = slots.filter(
      slot => slot.assignedMember && (slot.assignedMember.phone === member.phone || slot.assignedMember.id === member.id)
    ).length;

    const allowedShares = member.shares || 1;

    // Reject if member exceeds allowed contribution shares
    if (currentAssignments >= allowedShares) {
      setErrorMsg(
        lang === 'am'
          ? `⚠️ ይቅርታ! ${member.name} ከዚህ በፊት በሌላ ስሎት ተመድቧል። ተጨማሪ ድርሻ/መዋጮ ከሌለው በአንድ ስሎት ብቻ ይገደባል።`
          : `⚠️ Restricted! ${member.name} is already assigned to a slot. Single assignment rule enforced.`
      );
      return;
    }

    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return { 
          ...slot, 
          assignedMember: member,
          paidAmount: mainEqubAmount // Mark as fully paid upon complete assignment or manage via receipt
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

  // Unassign member from slot
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

  // Delete entire slot
  const handleDeleteSlot = (id) => {
    const updatedSlots = slots.filter(s => s.id !== id);
    setSlots(updatedSlots);
    saveSlotsToStorage(updatedSlots);
  };

  // Search filter for Member Registry dropdown
  const filteredMembers = membersList.filter(m => 
    (m.name && m.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (m.phone && m.phone.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-[#113828] text-white p-4 md:p-8 space-y-6 font-sans">
      
      {/* Navigation Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between border-b border-emerald-800 pb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-400 border border-emerald-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'am' ? 'ወደ ዋናው ገጽ ተመለስ' : 'Back to Dashboard'}</span>
        </button>
        <span className="text-xs text-amber-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800 font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          {equbData?.name || 'ዕቁብ ማስተዳደሪያ'} | {lang === 'am' ? 'የዕቁብ መጠን' : 'Amount'}: <strong className="text-white">{mainEqubAmount} ETB</strong>
        </span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Global Validation Alert Banner */}
        {errorMsg && (
          <div className="p-4 bg-red-950/90 border border-red-600 rounded-2xl text-red-200 text-xs font-bold flex items-center gap-3 shadow-2xl animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* ➕ Automated Slot Creation Card (Admin Only) */}
        {role === 'admin' && (
          <div className="bg-[#0e2d21] border border-emerald-700/80 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-emerald-800/80 pb-3">
              <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                <Plus className="w-4 h-4" /> 
                {lang === 'am' ? 'አዲስ ስሎት መፍጠሪያ' : 'Create New Slot'}
              </h3>
              <span className="text-[11px] text-emerald-300/80 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                ⚡ {lang === 'am' ? `ዋጋው በራስ-ሰር ${mainEqubAmount} ETB ይሆናል` : `Auto-priced at ${mainEqubAmount} ETB`}
              </span>
            </div>

            <form onSubmit={handleCreateSlot} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={slotName}
                onChange={(e) => setSlotName(e.target.value)}
                placeholder={lang === 'am' ? "የስሎት ስም (ምሳሌ፦ ስሎት #1, ዙር #1)..." : "Slot identifier (e.g. Slot #1)..."}
                className="w-full bg-emerald-950 border border-emerald-700 rounded-xl px-4 py-3 text-xs text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shrink-0 shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'am' ? 'ስሎት ፍጠር' : 'Add Slot'}</span>
              </button>
            </form>
          </div>
        )}

        {/* 📋 Registered Slots & Payment Validation Panel */}
        <div className="bg-[#113828]/90 border border-emerald-700/60 p-6 rounded-3xl shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
            <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
              <Users className="w-4 h-4" /> 
              {lang === 'am' ? 'የስሎቶች እና የክፍያ ማረጋገጫ ዝርዝር' : 'Slots & Payment Status'}
            </h3>
            <span className="text-[10px] bg-emerald-900 border border-emerald-700 text-emerald-300 px-3 py-1 rounded-lg font-bold">
              {slots.length} {lang === 'am' ? 'ስሎቶች' : 'Slots'}
            </span>
          </div>

          {slots.length === 0 ? (
            <div className="text-center py-10 text-emerald-300/60 text-xs space-y-2">
              <p>{lang === 'am' ? 'እስካሁን የተፈጠረ ስሎት የለም።' : 'No slots created yet.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => {
                // Incomplete Payment Validation: Target vs Paid Amount
                const isPaidFull = slot.assignedMember && (slot.paidAmount >= slot.amount);

                return (
                  <div key={slot.id} className="p-4 bg-emerald-950/70 border border-emerald-800/80 rounded-2xl space-y-3 hover:border-emerald-700 transition">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4 className="text-xs font-black text-white flex items-center gap-2">
                          🎯 {slot.name} 
                          <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono text-[11px]">
                            {slot.amount} ETB
                          </span>
                        </h4>
                        <p className="text-[11px] text-emerald-300/80 mt-1">
                          {slot.assignedMember ? (
                            <span className="text-emerald-200 font-bold flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-amber-400" /> 
                              {lang === 'am' ? 'የተመደበ አባል' : 'Assigned'}: <strong className="text-white">{slot.assignedMember.name}</strong> ({slot.assignedMember.phone})
                            </span>
                          ) : (
                            <span className="text-emerald-400/60 italic">{lang === 'am' ? 'አባል አልተመደበለትም (ክፍት)' : 'Unassigned (Open)'}</span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {/* Waiting State vs Ready Indicator */}
                        {slot.assignedMember && (
                          isPaidFull ? (
                            <span className="text-[10px] bg-green-950 text-green-300 border border-green-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> 
                              {lang === 'am' ? 'ለዕጣ ዝግጁ ነው' : 'Ready for Draw'}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-950/90 text-amber-300 border border-amber-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
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

                    {/* Member Search & Autocomplete Selection */}
                    {role === 'admin' && !slot.assignedMember && (
                      <div className="pt-2 border-t border-emerald-900/80">
                        {activeSlotId === slot.id ? (
                          <div className="space-y-2 bg-[#061c14] p-3 rounded-xl border border-emerald-700 shadow-inner">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-3" />
                              <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={lang === 'am' ? "የአባል ስም ወይም ስልክ ቁጥር ጻፍ..." : "Search member by name or phone..."}
                                className="w-full bg-emerald-950 border border-emerald-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                                autoFocus
                              />
                            </div>

                            <div className="max-h-36 overflow-y-auto space-y-1">
                              {filteredMembers.length === 0 ? (
                                <p className="text-[11px] text-emerald-400/60 text-center py-2">
                                  {lang === 'am' ? 'ምንም የተገኘ አባል የለም።' : 'No matching members found.'}
                                </p>
                              ) : (
                                filteredMembers.map((member) => (
                                  <div
                                    key={member.id || member.phone}
                                    onClick={() => handleAssignMember(slot.id, member)}
                                    className="flex justify-between items-center p-2 bg-emerald-950/60 hover:bg-emerald-900 rounded-lg cursor-pointer text-xs transition"
                                  >
                                    <div>
                                      <strong className="text-white">{member.name}</strong>
                                      <span className="text-emerald-300 ml-2 text-[10px]">({member.phone})</span>
                                    </div>
                                    <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">
                                      + {lang === 'am' ? 'አስገባ' : 'Assign'}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>

                            <button
                              onClick={() => { setActiveSlotId(null); setSearchTerm(''); }}
                              className="text-[10px] text-gray-400 hover:text-white underline pt-1 block text-right w-full cursor-pointer"
                            >
                              {lang === 'am' ? 'ዝጋ' : 'Close'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveSlotId(slot.id)}
                            className="text-[11px] text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1.5 bg-emerald-950 px-3 py-2 rounded-xl border border-emerald-800 hover:border-amber-500/50 transition"
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