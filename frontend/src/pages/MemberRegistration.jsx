import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, CheckCircle2, ArrowLeft, X, Search, User } from 'lucide-react';

export default function MemberRegistration({ onNavigate }) {
  const [mainSlots, setMainSlots] = useState([
    {
      id: 'slot-1',
      slotName: 'Slot 1',
      slotNickname: 'Shown publicly in draws',
      totalAmount: 1000,
      subMembers: [
        { id: 'sub-1', name: 'አበበ በቀለ', phone: '0911223344', alias: 'አቤ', amount: 1000 }
      ]
    }
  ]);

  const [membersList, setMembersList] = useState([]);
  const [notification, setNotification] = useState(null);

  // Search & Select Modal State for Sub-Members
  const [selectingForSlotId, setSelectingForSlotId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit State Modal
  const [editingMember, setEditingMember] = useState(null); // { slotId, subId, name, phone, alias, amount }

  const showMsg = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // መጀመሪያ የተመዘገቡ አባላትን ከ LocalStorage መጫን (ለ Autocomplete ፍለጋ)
  useEffect(() => {
    const storedMembers = localStorage.getItem('yop_members');
    if (storedMembers) {
      try {
        setMembersList(JSON.parse(storedMembers));
      } catch (e) {
        setMembersList([]);
      }
    } else {
      // ለሙከራ የሚሆኑ ነባር አባላት
      setMembersList([
        { id: 'm1', name: 'ኤፍሬም መኮንን', phone: '0911111111', alias: 'ኤፍሬም', contribution: 1000 },
        { id: 'm2', name: 'አበባ ተስፋዬ', phone: '0922222222', alias: 'አቢ', contribution: 500 },
        { id: 'm3', name: 'በረከት አለሙ', phone: '0933333333', alias: 'ባሪ', contribution: 500 }
      ]);
    }

    const savedSlots = localStorage.getItem('yop_main_slots');
    if (savedSlots) {
      try {
        setMainSlots(JSON.parse(savedSlots));
      } catch (e) {}
    }
  }, []);

  const saveSlotsToStorage = (updatedSlots) => {
    setMainSlots(updatedSlots);
    localStorage.setItem('yop_main_slots', JSON.stringify(updatedSlots));
  };

  // Add New Main Slot
  const handleAddMainSlot = () => {
    const newSlot = {
      id: `slot-${Date.now()}`,
      slotName: `Slot ${mainSlots.length + 1}`,
      slotNickname: 'Shown publicly in draws',
      totalAmount: 1000,
      subMembers: []
    };
    const updated = [...mainSlots, newSlot];
    saveSlotsToStorage(updated);
    showMsg("አዲስ ዋና ስሎት ተጨምሯል!");
  };

  // Add Sub-Member from Registry (Autocomplete selection)
  const handleSelectMemberForSlot = (slotId, member) => {
    const slot = mainSlots.find(s => s.id === slotId);
    if (!slot) return;

    const currentSum = slot.subMembers.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const memberAmount = Number(member.contribution) || 500;

    if (currentSum + memberAmount > slot.totalAmount) {
      alert(`⚠️ ይቅርታ! የዚህ ስሎት መጠን (${slot.totalAmount} ብር) ይሞላል። ከዚህ በላይ መጨመር አይቻልም።`);
      return;
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      name: member.name,
      phone: member.phone,
      alias: member.alias || '',
      amount: memberAmount
    };

    const updated = mainSlots.map(s => {
      if (s.id === slotId) {
        return { ...s, subMembers: [...s.subMembers, newSub] };
      }
      return s;
    });

    saveSlotsToStorage(updated);
    setSelectingForSlotId(null);
    setSearchTerm('');
    showMsg("ንዑስ አባል ተመዝግቧል!");
  };

  // Update Main Slot Header Field
  const handleUpdateSlotField = (slotId, field, value) => {
    const updated = mainSlots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, [field]: field === 'totalAmount' ? Number(value) : value };
      }
      return slot;
    });
    saveSlotsToStorage(updated);
  };

  // Save Edit from Modal
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingMember) return;

    const updated = mainSlots.map(slot => {
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
    });

    saveSlotsToStorage(updated);
    showMsg("የአባል መረጃ ተስተካክሏል!");
    setEditingMember(null);
  };

  // Delete Sub-Member
  const handleDeleteSubMember = (slotId, subId) => {
    if (!window.confirm("ይህንን አባል መሰረዝ ትፈልጋለህ?")) return;
    const updated = mainSlots.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, subMembers: slot.subMembers.filter(sub => sub.id !== subId) };
      }
      return slot;
    });
    saveSlotsToStorage(updated);
    showMsg("አባሉ ተሰርዟል!");
  };

  // Delete Main Slot
  const handleDeleteMainSlot = (slotId) => {
    if (mainSlots.length <= 1) {
      alert("ቢያንስ አንድ ስሎት መኖር አለበት!");
      return;
    }
    const updated = mainSlots.filter(slot => slot.id !== slotId);
    saveSlotsToStorage(updated);
    showMsg("ስሎቱ ተሰርዟል!");
  };

  // Filtered members for Autocomplete
  const filteredMembers = membersList.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 p-4 md:p-8 font-sans relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 font-bold text-xs">
          <CheckCircle2 className="w-4 h-4" /> <span>{notification}</span>
        </div>
      )}

      {/* Select Sub-Member Modal (Autocomplete Search) */}
      {selectingForSlotId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-slate-600" /> አባል ፈልጎ መምረጥ (Search Member)
              </h3>
              <button onClick={() => { setSelectingForSlotId(null); setSearchTerm(''); }} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="ስም ወይም ስልክ ቁጥር ጻፍ (ምሳሌ፦ ኤፍሬም)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-slate-500"
                autoFocus
              />

              <div className="max-h-60 overflow-y-auto space-y-1.5 pt-1">
                {filteredMembers.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">ምንም የተገኘ አባል የለም። እባክዎ መጀመሪያ "አባላት" ገጽ ላይ ይመዝግቡ።</p>
                ) : (
                  filteredMembers.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleSelectMemberForSlot(selectingForSlotId, m)}
                      className="flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer text-xs border border-slate-200 transition"
                    >
                      <div>
                        <strong className="text-slate-900">{m.name}</strong>
                        <span className="text-slate-500 ml-2">({m.phone})</span>
                      </div>
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">+ አስገባ</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal Popup */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">✏️ አባል ማስተካከያ (Edit Member)</h3>
              <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Full name / ሙሉ ስም *</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone / ስልክ *</label>
                <input
                  type="text"
                  value={editingMember.phone}
                  onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nickname / ቅጽል ስም</label>
                <input
                  type="text"
                  value={editingMember.alias}
                  onChange={(e) => setEditingMember({ ...editingMember, alias: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Contribution / መዋጮ *</label>
                <input
                  type="number"
                  value={editingMember.amount}
                  onChange={(e) => setEditingMember({ ...editingMember, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none font-bold text-amber-600"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  ሰርዝ
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  ለውጦችን አስቀምጥ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Navigation Back to Dashboard */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
        <button 
          onClick={() => onNavigate && onNavigate("dashboard")}
          className="text-xs bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 transition cursor-pointer flex items-center gap-1.5 font-bold shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> ወደ ዳሽቦርድ ተመለስ
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Title & Add Slot Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-base font-black text-slate-900">Main slots & sub-members / ዋና ስሎቶችና ንዑስ አባላት</h1>
            <p className="text-xs text-slate-500 mt-1">
              ስሎቶቹን በመፍጠር ከአባላት መዝገብ ውስጥ አባላትን እየፈለጉ ማያያዝ እና መዋጮውን ማመጣጠን ይችላሉ።
            </p>
          </div>

          <button
            onClick={handleAddMainSlot}
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-slate-600" /> + Add slot / ስሎት ጨምር
          </button>
        </div>

        {/* Slots List */}
        <div className="space-y-6">
          {mainSlots.map((slot, index) => {
            const currentSum = slot.subMembers.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
            const isBalanced = currentSum === slot.totalAmount;

            return (
              <div key={slot.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                
                {/* Slot Accordion Header & Balance Status */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span>▼</span>
                    <span>Slot {index + 1}: {slot.slotName || 'Unnamed'} · {slot.subMembers.length} sub-members · {currentSum}/{slot.totalAmount} Birr</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${isBalanced ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {isBalanced ? 'Balanced' : 'Not balanced'}
                    </span>
                    {mainSlots.length > 1 && (
                      <button 
                        onClick={() => handleDeleteMainSlot(slot.id)}
                        className="text-slate-400 hover:text-rose-500 text-xs font-bold cursor-pointer ml-2"
                        title="ስሎቱን ሰርዝ"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Slot Input Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Slot name / የስሎት ስም *</label>
                    <input
                      type="text"
                      value={slot.slotName}
                      onChange={(e) => handleUpdateSlotField(slot.id, 'slotName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Slot nickname / ቅጽል ስም *</label>
                    <input
                      type="text"
                      value={slot.slotNickname}
                      onChange={(e) => handleUpdateSlotField(slot.id, 'slotNickname', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-400 outline-none focus:border-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Full slot amount / የስሎት መጠን (Birr) *</label>
                    <input
                      type="number"
                      value={slot.totalAmount}
                      onChange={(e) => handleUpdateSlotField(slot.id, 'totalAmount', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-slate-500 font-bold text-amber-600"
                    />
                  </div>
                </div>

                {/* Sub-Members List */}
                <div className="space-y-3 pt-2">
                  {slot.subMembers.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">— በዚህ ስሎት ስር ገና ምንም ንዑስ አባል አልተመዘገበም —</p>
                  ) : (
                    slot.subMembers.map((sub) => (
                      <div key={sub.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        
                        <div className="sm:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Full name / ሙሉ ስም</label>
                          <input
                            type="text"
                            value={sub.name}
                            readOnly
                            className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none cursor-not-allowed"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Phone / ስልክ</label>
                          <input
                            type="text"
                            value={sub.phone}
                            readOnly
                            className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none font-mono cursor-not-allowed"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Nickname / ቅጽል ስም</label>
                          <input
                            type="text"
                            value={sub.alias}
                            readOnly
                            className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none cursor-not-allowed"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Contribution / መዋጮ</label>
                          <input
                            type="number"
                            value={sub.amount}
                            readOnly
                            className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-amber-600 outline-none font-bold cursor-not-allowed"
                          />
                        </div>

                        {/* Action Buttons: Edit & Delete */}
                        <div className="sm:col-span-2 flex justify-end items-center gap-1.5 pt-4">
                          <button
                            onClick={() => setEditingMember({ slotId: slot.id, subId: sub.id, name: sub.name, phone: sub.phone, alias: sub.alias, amount: sub.amount })}
                            className="px-2.5 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition cursor-pointer text-xs font-bold flex items-center gap-1 border border-sky-200"
                            title="አስተካክል"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> አስተካክል
                          </button>
                          <button
                            onClick={() => handleDeleteSubMember(slot.id, sub.id)}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer border border-rose-200"
                            title="አባሉን ሰርዝ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    ))
                  )}
                </div>

                {/* Add Sub Member Button */}
                <div>
                  <button
                    onClick={() => {
                      setSelectingForSlotId(slot.id);
                      setSearchTerm('');
                    }}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500" /> + Add sub-member / ንዑስ አባል ጨምር
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}