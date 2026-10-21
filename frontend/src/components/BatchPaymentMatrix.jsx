import React, { useState, useEffect } from "react";
import { Check, X, AlertCircle, ShieldCheck } from "lucide-react";
// ✅ ትክክለኛው የ Import መስመር (ከ pages/Payments.jsx Named Export የተደረገውን PaymentApprovalCenter ያመጣል)
import { PaymentApprovalCenter } from "../pages/Payments";

export default function BatchPaymentMatrix({ equbId, isAdmin = false }) {
  const [rounds, setRounds] = useState([1, 2, 3, 4, 5]);
  const [members, setMembers] = useState([
    { id: "S1", name: "አበበ ከበደ", payments: { 1: true, 2: true, 3: false, 4: false, 5: false } },
    { id: "S2", name: "ጫላ ደመቀ", payments: { 1: true, 2: false, 3: false, 4: false, 5: false } },
    { id: "S3", name: "እሌኒ ተስፋዬ", payments: { 1: true, 2: true, 3: true, 4: false, 5: false } },
  ]);

  const togglePayment = (memberId, roundNum) => {
    if (!isAdmin) return; // አባል ከሆነ ክፍያ መቀየር አይችልም (Read-only)

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            payments: {
              ...m.payments,
              [roundNum]: !m.payments[roundNum],
            },
          };
        }
        return m;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* የክፍያ ሰንጠረዥ (Payment Matrix) */}
      <div className="overflow-x-auto bg-[#0d2319] border border-emerald-800/60 rounded-2xl p-4 shadow-xl">
        <table className="w-full text-left text-xs text-white">
          <thead>
            <tr className="border-b border-emerald-800 text-amber-400 font-extrabold">
              <th className="p-3">ተወዳዳሪ/አባል</th>
              {rounds.map((r) => (
                <th key={r} className="p-3 text-center">
                  ዙር {r}
                </th>
              ))}
              <th className="p-3 text-center">ሁኔታ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/50">
            {members.map((m) => {
              // ህግ: ያለፈውን ዙር ሳይከፍል ያረፈደ አባል በዕጣ አይሳተፍም
              const unpaidPastRound = rounds.some((r) => !m.payments[r] && r < 3); // ዙር 3 እንደ አሁኑ ዙር ቢቆጠር

              return (
                <tr key={m.id} className="hover:bg-emerald-900/30 transition">
                  <td className="p-3 font-bold text-slate-200">{m.name}</td>
                  {rounds.map((r) => (
                    <td key={r} className="p-3 text-center">
                      <button
                        disabled={!isAdmin}
                        onClick={() => togglePayment(m.id, r)}
                        className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center transition ${
                          m.payments[r]
                            ? "bg-emerald-500 text-slate-950 shadow-md"
                            : "bg-emerald-950 border border-emerald-800 text-slate-500 hover:border-amber-400"
                        } ${!isAdmin ? "cursor-default" : "cursor-pointer"}`}
                      >
                        {m.payments[r] ? <Check size={14} className="stroke-[3]" /> : <X size={12} />}
                      </button>
                    </td>
                  ))}
                  <td className="p-3 text-center">
                    {unpaidPastRound ? (
                      <span className="inline-flex items-center gap-1 bg-red-950/80 text-red-400 border border-red-900 px-2 py-0.5 rounded text-[10px] font-bold">
                        <AlertCircle size={10} /> እጣ አይሳተፍም (ቅጣት)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-900/80 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        <ShieldCheck size={10} /> ብቁ
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* የአድሚን ክፍያ ማረጋገጫ ማዕከል */}
      {isAdmin && (
        <div className="pt-4 border-t border-emerald-800/60">
          <PaymentApprovalCenter />
        </div>
      )}
    </div>
  );
}