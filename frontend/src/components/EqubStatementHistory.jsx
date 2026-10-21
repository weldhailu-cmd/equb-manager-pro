import React, { useState, useEffect } from "react";
import { 
  Search, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  CreditCard, 
  User, 
  Phone, 
  Calendar, 
  ShieldCheck,
  Download
} from "lucide-react";

export default function EqubStatementHistory({ equbId, isAdmin = false }) {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  // Local Storage ላይ ያሉ አባላትን ማምጣት
  useEffect(() => {
    const savedMembers = JSON.parse(localStorage.getItem(`all_members_${equbId}`) || "[]");
    setMembers(savedMembers);
    if (savedMembers.length > 0) {
      setSelectedMember(savedMembers[0]); // በነባሪ የመጀመሪያውን አባል መምረጥ
    }
  }, [equbId]);

  // የፍለጋ ማጣሪያ
  const filteredMembers = members.filter(
    (m) =>
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone_number.includes(searchQuery) ||
      (m.accountNumber && m.accountNumber.includes(searchQuery))
  );

  // ለናሙና የክፍያ ታሪክ ማነጻጸሪያ ዳታዎች (Sample Transaction Rounds)
  const generateStatementRows = (member) => {
    if (!member) return [];
    
    // የ 5 ዙሮች የናሙና ክፍያ ታሪክ
    const share = Number(member.contribution_share || 1000);
    return [
      { round: 1, date: "2026-01-05", amount: share, status: "PAID", fine: 0, refNo: "TXN-882101", note: "በፀደይ ባንክ የተከፈለ" },
      { round: 2, date: "2026-01-12", amount: share, status: "PAID", fine: 0, refNo: "TXN-882390", note: "በካሽ የተከፈለ" },
      { round: 3, date: "2026-01-19", amount: share, status: "PAID", fine: 50, refNo: "TXN-882944", note: "የ 1 ቀን ዘግይቶ የተከፈለ (ከቅጣት ጋር)" },
      { round: 4, date: "2026-01-26", amount: share, status: "PENDING", fine: 0, refNo: "—", note: "ክፍያ በማረጋገጥ ላይ" },
      { round: 5, date: "2026-02-02", amount: share, status: "UNPAID", fine: 100, refNo: "—", note: "ገና አልተከፈለም" },
    ];
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="bg-[#113828]/80 border border-emerald-700/50 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <FileText className="text-amber-400" size={20} />
            የአባላት የሂሳብ መግለጫ (Statement History Lookup)
          </h2>
          <p className="text-xs text-emerald-300/80 mt-0.5">
            የአንድን አባል የክፍያ ታሪክ፣ የዘገዩ ዙሮች፣ እና የቅጣት መዝገብ በባንክ ስታይል መመልከቻ።
          </p>
        </div>

        {selectedMember && (
          <button
            onClick={handlePrint}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-lg w-fit"
          >
            <Printer size={16} /> መግለጫውን ህትመት (Print Statement)
          </button>
        )}
      </div>

      {/* Search Bar & Member Quick Select */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 relative">
          <Search className="absolute left-3.5 top-3 text-emerald-500" size={16} />
          <input
            type="text"
            placeholder="አባል በስም፣ በስልክ ወይም በአካውንት ይፈልጉ..."
            className="w-full bg-[#113828]/60 border border-emerald-700/50 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Search Dropdown Results */}
          {searchQuery && (
            <div className="absolute left-0 right-0 top-12 bg-emerald-950 border border-emerald-700 rounded-2xl shadow-2xl max-h-48 overflow-y-auto z-50 divide-y divide-emerald-900">
              {filteredMembers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMember(m);
                    setSearchQuery("");
                  }}
                  className="w-full p-3 text-left hover:bg-emerald-900/60 transition text-xs flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-white">{m.full_name}</p>
                    <p className="text-[10px] text-emerald-300/70">@{m.nickname} | {m.phone_number}</p>
                  </div>
                  <span className="text-amber-400 font-mono font-bold">{m.contribution_share} ብር</span>
                </button>
              ))}
              {filteredMembers.length === 0 && (
                <div className="p-3 text-xs text-emerald-400/60 italic text-center">ምንም አባል አልተገኘም</div>
              )}
            </div>
          )}
        </div>

        {/* Members Pills Selector */}
        <div className="md:col-span-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-emerald-300 font-bold whitespace-nowrap">ተመራጭ አባላት፦</span>
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMember(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedMember?.id === m.id
                  ? "bg-amber-500 text-slate-950 shadow-md font-black"
                  : "bg-[#113828]/80 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/50"
              }`}
            >
              {m.full_name} (@{m.nickname})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Member Statement View Sheet */}
      {selectedMember ? (
        <div className="bg-[#113828]/70 border border-emerald-700/60 rounded-3xl p-6 shadow-2xl space-y-6">
          
          {/* Member Summary Header Card */}
          <div className="bg-emerald-950/80 border border-amber-500/30 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">የአባሉ መለያ</span>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <User size={18} className="text-amber-400" />
                {selectedMember.full_name}
              </h3>
              <p className="text-xs text-amber-300/90 font-medium">ቅጽል ስም፦ @{selectedMember.nickname}</p>
              <p className="text-xs text-emerald-200/80 flex items-center gap-1 mt-1">
                <Phone size={12} className="text-emerald-400" /> {selectedMember.phone_number}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">የባንክ መረጃ</span>
              <p className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                <Building2 size={14} /> {selectedMember.bankName || "ፀደይ ባንክ"}
              </p>
              <p className="text-xs font-mono text-white flex items-center gap-1.5">
                <CreditCard size={14} className="text-emerald-400" /> {selectedMember.accountNumber || "N/A"}
              </p>
            </div>

            <div className="space-y-1 bg-slate-950/50 p-3 rounded-xl border border-emerald-800/60">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">የፋይናንስ ማጠቃለያ</span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-300">የአንድ ዙር መዋጮ፦</span>
                <span className="font-extrabold text-amber-400 font-mono">{Number(selectedMember.contribution_share || 0).toLocaleString()} ብር</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-300">የዕቁብ ሁኔታ፦</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck size={12} /> ንቁ ተሳታፊ
                </span>
              </div>
            </div>
          </div>

          {/* Statement Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} /> የክፍያዎች ዝርዝር መግለጫ (Detailed Payment History Ledger)
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-emerald-700/50">
              <table className="w-full text-left text-xs text-white">
                <thead>
                  <tr className="border-b border-emerald-800 text-amber-400 font-extrabold bg-emerald-950/60">
                    <th className="p-3.5">ዙር (Round)</th>
                    <th className="p-3.5">የክፍያ ቀን</th>
                    <th className="p-3.5">የመዋጮ መጠን</th>
                    <th className="p-3.5">የቅጣት መጠን</th>
                    <th className="p-3.5">የክፍያ ሁኔታ</th>
                    <th className="p-3.5">የደረሰኝ ቁጥር (Ref)</th>
                    <th className="p-3.5">ማስታወሻ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40 bg-emerald-950/30">
                  {generateStatementRows(selectedMember).map((row) => (
                    <tr key={row.round} className="hover:bg-emerald-900/40 transition">
                      <td className="p-3.5 font-bold font-mono text-amber-300">ዙር #{row.round}</td>
                      <td className="p-3.5 text-emerald-200 font-mono">{row.date}</td>
                      <td className="p-3.5 font-extrabold text-white font-mono">{row.amount.toLocaleString()} ብር</td>
                      <td className="p-3.5 font-mono text-red-400 font-bold">
                        {row.fine > 0 ? `${row.fine} ብር` : "—"}
                      </td>
                      <td className="p-3.5">
                        {row.status === "PAID" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 size={12} /> ተከፍሏል
                          </span>
                        )}
                        {row.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Clock size={12} /> በማረጋገጥ ላይ
                          </span>
                        )}
                        {row.status === "UNPAID" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">
                            <AlertCircle size={12} /> አልተከፈለንም
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-emerald-300/80">{row.refNo}</td>
                      <td className="p-3.5 text-emerald-200/70 italic text-[11px]">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-12 bg-[#113828]/40 border border-emerald-800/40 rounded-3xl space-y-2">
          <FileText className="mx-auto text-emerald-500/60" size={36} />
          <p className="text-xs text-emerald-300/80">እባክዎ መግለጫውን ለማየት ከላይ አባል ይምረጡ ወይም በስም ይፈልጉ።</p>
        </div>
      )}
    </div>
  );
}