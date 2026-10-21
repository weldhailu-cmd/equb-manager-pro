import React, { useState } from 'react';
import { Lock, Trash2, ShieldCheck, Users, ArrowRight, X } from 'lucide-react';

export default function SavedEqubsList({ savedEqubs = [], onDeleteEqub, onEnterEqub }) {
  const [selectedEqub, setSelectedEqub] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [actionType, setActionType] = useState('view'); // 'view' ወይም 'delete'

  // የይለፍ ቃል አረጋግጦ ወደ ዕቁብ ማስገባት ወይም መሰረዝ
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!selectedEqub) return;

    if (actionType === 'delete') {
      // የአድሚን ፓስወርድ ማረጋገጫ ለዲሌት
      if (enteredPassword === selectedEqub.adminPassword) {
        onDeleteEqub(selectedEqub.id);
        closeModal();
      } else {
        setPasswordError('የሰጡት የአስተዳዳሪ የይለፍ ቃል ልክ አይደለም!');
      }
    } else {
      // የሜምበር ወይም አድሚን ፓስወርድ ማረጋገጫ ለመግባት
      if (enteredPassword === selectedEqub.memberPassword || enteredPassword === selectedEqub.adminPassword) {
        const role = enteredPassword === selectedEqub.adminPassword ? 'admin' : 'member';
        onEnterEqub(selectedEqub.id, role);
        closeModal();
      } else {
        setPasswordError('የentered password ልክ አይደለም። እባክዎ እንደገና ይሞክሩ!');
      }
    }
  };

  const closeModal = () => {
    setSelectedEqub(null);
    setEnteredPassword('');
    setPasswordError('');
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-white">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" /> የተመዘገቡ ዕቁቦች (Saved Equbs / የቁብ ማዕከል)
        </h3>
        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">
          ለደህንነት ሲባል የይለፍ ቃል ይጠይቃል
        </span>
      </div>

      <div className="space-y-3">
        {savedEqubs.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-8 text-center">ገና ምንም ዕቁብ አልተመዘገበም።</p>
        ) : (
          savedEqubs.map((equb) => (
            <div key={equb.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-2xl gap-4 hover:border-slate-700 transition">
              <div>
                <h5 className="text-xs font-bold text-white flex items-center gap-2">
                  {equb.name} <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">({equb.address || 'ሞላሌ'})</span>
                </h5>
                <p className="text-[11px] text-slate-400 mt-1">
                  መጠን: <span className="text-slate-200 font-bold">{equb.contributionAmount} ብር</span> | ቀን: {equb.startDate} | ዋና ስሎቶች: {equb.slots?.length || 0}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => {
                    setSelectedEqub(equb);
                    setActionType('view');
                  }}
                  className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>ስሎቶች እና ክፍያ ቼክ አድርግ</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => {
                    setSelectedEqub(equb);
                    setActionType('delete');
                  }}
                  className="p-2 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-900/50 rounded-xl transition cursor-pointer"
                  title="ዕቁቡን ሰርዝ (Admin Password Required)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PASSWORD GATE MODAL */}
      {selectedEqub && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> 
                {actionType === 'delete' ? 'ዕቁቡን ለመሰረዝ የአድሚን ፓስወርድ ያስገቡ' : 'ወደ ዕቁብ ለመግባት የይለፍ ቃል ያስገቡ'}
              </h4>
              <button onClick={closeModal} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <p className="text-[11px] text-slate-400">
                የመረጡት ዕቁብ: <strong className="text-white">{selectedEqub.name}</strong>
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {actionType === 'delete' ? 'የአስተዳዳሪ (Admin) ፓስወርድ' : 'የአድሚን ወይም የአባል (Member) ፓስወርድ'}
                </label>
                <input
                  type="password"
                  placeholder="የይለፍ ቃል ያስገቡ..."
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                  autoFocus
                />
              </div>

              {passwordError && (
                <p className="text-xs text-red-400 font-bold bg-red-950/40 p-2 rounded-xl border border-red-900/50">
                  {passwordError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl cursor-pointer"
                >
                  ሰርዝ (Cancel)
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-black text-xs rounded-xl cursor-pointer transition ${
                    actionType === 'delete' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {actionType === 'delete' ? 'አረጋግጥ እና ሰርዝ (Delete)' : 'ግባ (Login & View)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}