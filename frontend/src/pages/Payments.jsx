import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Wallet, CheckCircle, XCircle, Clock, ArrowLeft, ShieldCheck } from "lucide-react";
import BatchPaymentMatrix from "../components/BatchPaymentMatrix";
import { useLanguage } from "../context/LanguageContext";

/**
 * 1. Admin Payment Approval Center Component
 * (በ BatchPaymentMatrix.jsx ለይተው የሚጠሩት)
 */
export function PaymentApprovalCenter({ onBack }) {
  const [payments, setPayments] = useState([
    {
      id: "PAY-101",
      memberName: "አበበ ከበደ",
      amount: 1000,
      round: 1,
      date: "2026-10-10",
      status: "pending",
      method: "Tsedey Bank / ፀደይ ባንክ",
    },
    {
      id: "PAY-102",
      memberName: "ጫላ ደመቀ",
      amount: 1000,
      round: 1,
      date: "2026-10-11",
      status: "approved",
      method: "Cash / በካሽ",
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white p-4">
      <div className="flex items-center justify-between bg-[#113828] p-5 rounded-2xl border border-emerald-700/50 shadow-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-emerald-900/60 hover:bg-emerald-800 rounded-xl transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-300" />
            </button>
          )}
          <div>
            <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> የክፍያ ማረጋገጫ ማዕከል (Payment Approval Center)
            </h2>
            <p className="text-xs text-emerald-200/80">የአባላትን ክፍያ ማጽደቅ እና መቆጣጠሪያ</p>
          </div>
        </div>
      </div>

      <div className="bg-[#113828]/70 border border-emerald-700/50 rounded-2xl p-4 shadow-xl space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-emerald-950/60 border border-emerald-800/60 rounded-xl gap-4"
          >
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                {payment.memberName} <span className="text-[10px] text-amber-400">({payment.id})</span>
              </h4>
              <p className="text-[11px] text-emerald-200/80 mt-1">
                መጠን: <span className="font-bold text-white">{payment.amount} ብር</span> | ዙር: {payment.round} | መንገድ: {payment.method}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                  payment.status === "approved"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : payment.status === "rejected"
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {payment.status === "approved" && <CheckCircle className="w-3 h-3" />}
                {payment.status === "rejected" && <XCircle className="w-3 h-3" />}
                {payment.status === "pending" && <Clock className="w-3 h-3" />}
                {payment.status.toUpperCase()}
              </span>

              {payment.status === "pending" && (
                <>
                  <button
                    onClick={() => handleStatusChange(payment.id, "approved")}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    አጽድቅ
                  </button>
                  <button
                    onClick={() => handleStatusChange(payment.id, "rejected")}
                    className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-900/50 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    ሰርዝ
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 2. Main Payments Page Component (Default Export)
 */
export default function Payments() {
  const { equbId } = useParams();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wallet className="text-amber-400" size={22} />
        <h1 className="font-black text-2xl text-white">
          {t("payments_title") || "የክፍያዎች አስተዳደር (Payments)"}
        </h1>
      </div>

      <div className="bg-[#113828]/70 border border-emerald-700/50 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="font-bold text-lg text-amber-400 mb-1">
            {t("payments_ledger") || "የእቁብ ክፍያዎች መዝገብ (Payments Ledger)"}
          </h2>
          <p className="text-xs text-emerald-200/80">
            አባላት በክፍለ ዙር የፈጸሟቸውን ክፍያዎች በሳጥን (Checkbox) በመምረጥ በአንድ ጊዜ ይመዝግቡ እና ይቆጣጠሩ።
          </p>
        </div>

        {equbId ? (
          <BatchPaymentMatrix equbId={equbId} />
        ) : (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
            እባክዎ መጀመሪያ ትክክለኛውን የእቁብ ገጽ ይክፈቱ (Equb ID አልተገኘም)።
          </div>
        )}
      </div>

      <PaymentApprovalCenter />
    </div>
  );
}