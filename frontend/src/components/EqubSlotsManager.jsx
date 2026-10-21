import React, { useState, useEffect } from 'react';
import { Users, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SavedEqubsList({ onSelectEqub }) {
  const [savedEqubs, setSavedEqubs] = useState([]);

  useEffect(() => {
    const storedEqubs = localStorage.getItem('yop_saved_equbs');
    if (storedEqubs) {
      setSavedEqubs(JSON.parse(storedEqubs));
    }
  }, []);

  const handleDeleteEqub = (id, e) => {
    e.stopPropagation();
    if (!window.confirm('ይህንን ዕቁብ መሰረዝ ይፈልጋሉ?')) return;
    const updated = savedEqubs.filter((item) => item.id !== id);
    setSavedEqubs(updated);
    localStorage.setItem('yop_saved_equbs', JSON.stringify(updated));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl text-slate-800">
      <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Saved Equbs / የተመዘገቡ ዕቁቦች
      </h4>
      
      {savedEqubs.length > 0 ? (
        <div className="space-y-3">
          {savedEqubs.map((equb) => (
            <div 
              key={equb.id} 
              onClick={() => {
                if (onSelectEqub) onSelectEqub(equb);
              }}
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-300 rounded-2xl transition cursor-pointer group"
            >
              <div>
                <h5 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {equb.name} ({equb.address || 'አድራሻ የለም'})
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  መጠን: {equb.contributionAmount} ብር | ቀን: {equb.startDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Open Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectEqub) onSelectEqub(equb);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Open / ክፈት</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => handleDeleteEqub(equb.id, e)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer"
                  title="Delete Equb"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-6">እስካሁን የተመዘገበ ዕቁብ የለም።</p>
      )}
    </div>
  );
}