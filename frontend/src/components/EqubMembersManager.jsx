import React, { useState, useEffect } from "react";
import { UserPlus, Search, Phone, Trash2, Edit3, UserCheck, Eye, EyeOff, Building2, CreditCard } from "lucide-react";

export default function EqubMembersManager({ equbId, slots = [], isAdmin = false, onAddNewSlot }) {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [form, setForm] = useState({
    slotId: slots[0]?.id || "",
    full_name: "",
    nickname: "",
    phone_number: "",
    bankName: "ፀደይ ባንክ",
    accountNumber: "",
    contribution_share: 50,
    phone_is_public: true,
  });

  // Local Storage ላይ የተመዘገቡ አባላትን ማምጣት
  useEffect(() => {
    const savedMembers = JSON.parse(localStorage.getItem(`all_members_${equbId}`) || "[]");
    setMembers(savedMembers);
  }, [equbId]);

  // መረጃን Local Storage ላይ ማስቀመጥ
  const saveMembersToStorage = (updatedList) => {
    setMembers(updatedList);
    localStorage.setItem(`all_members_${equbId}`, JSON.stringify(updatedList));
  };

  // አባል መመዝገብ ወይም ማስተካከል
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone_number.trim() || !form.accountNumber.trim()) {
      alert("እባክዎን ሁሉንም አስፈላጊ መረጃዎች (ስም፣ ስልክ እና አካውንት ቁጥር) ይሙሉ!");
      return;
    }

    if (editingMember) {
      // Edit mode
      const updatedList = members.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              slotId: form.slotId,
              full_name: form.full_name.trim(),
              nickname: form.nickname.trim() || form.full_name.trim(),
              phone_number: form.phone_number.trim(),
              bankName: form.bankName,
              accountNumber: form.accountNumber.trim(),
              contribution_share: Number(form.contribution_share),
              phone_is_public: form.phone_is_public,
            }
          : m
      );
      saveMembersToStorage(updatedList);
      setEditingMember(null);
      alert("✅ የአባሉ መረጃ በተሳካ ሁኔታ ተስተካክሏል!");
    } else {
      // Add new member mode
      const newMember = {
        id: "mem_" + Date.now(),
        slotId: form.slotId || (slots[0]?.id || "slot_default"),
        full_name: form.full_name.trim(),
        nickname: form.nickname.trim() || form.full_name.trim(),
        phone_number: form.phone_number.trim(),
        bankName: form.bankName,
        accountNumber: form.accountNumber.trim(),
        contribution_share: Number(form.contribution_share),
        phone_is_public: form.phone_is_public,
      };
      saveMembersToStorage([...members, newMember]);
      alert("✅ አዲስ አባል በተሳካ ሁኔታ ተመዝግቧል!");
    }

    // Form Reset (ምንም ቋሚ ናሙና ሳይኖር ባዶ ማድረግ)
    setForm({
      slotId: slots[0]?.id || "",
      full_name: "",
      nickname: "",
      phone_number: "",
      bankName: "ፀደይ ባንክ",
      accountNumber: "",
      contribution_share: 50,
      phone_is_public: true,
    });
    setShowAddForm(false);
  };

  // Edit Trigger
  const handleEditClick = (member) => {
    setEditingMember(member);
    setForm({
      slotId: member.slotId || "",
      full_name: member.full_name,
      nickname: member.nickname,
      phone_number: member.phone_number,
      bankName: member.bankName || "ፀደይ ባንክ",
      accountNumber: member.accountNumber || "",
      contribution_share: member.contribution_share || 50,
      phone_is_public: member.phone_is_public ?? true,
    });
    setShowAddForm(true);
  };

  // Delete Member
  const handleDelete = (memberId) => {
    if (!window.confirm("እርግጠኛ ነዎት ይህንን አባል ማጥፋት ይፈልጋሉ?")) return;
    const updatedList = members.filter((m) => m.id !== memberId);
    saveMembersToStorage(updatedList);
  };

  // Search Filter
  const filteredMembers = members.filter(
    (m) =>
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone_number.includes(searchQuery) ||
      (m.accountNumber && m.accountNumber.includes(searchQuery))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-[#113828]/80 border border-emerald-700/50 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <UserCheck className="text-amber-400" size={20} />
            የዕቁብ አባላት ማኔጀር ({members.length})
          </h2>
          <p className="text-xs text-emerald-300/80 mt-0.5">
            የአባላትን የግል መረጃ፣ የባንክ ሂሳብ እና የመዋጮ መጠን ማስተዳደሪያ ማዕከል።
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onAddNewSlot && isAdmin && (
            <button
              type="button"
              onClick={onAddNewSlot}
              className="bg-[#0f291e] hover:bg-emerald-900 text-amber-400 border border-amber-500/40 font-bold px-3.5 py-2 rounded-2xl text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              ➕ አዲስ ስሎት ጨምር
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => {
                setEditingMember(null);
                setForm({
                  slotId: slots[0]?.id || "",
                  full_name: "",
                  nickname: "",
                  phone_number: "",
                  bankName: "ፀደይ ባንክ",
                  accountNumber: "",
                  contribution_share: 50,
                  phone_is_public: true,
                });
                setShowAddForm((prev) => !prev);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <UserPlus size={16} /> {showAddForm ? "ቅጹን ዝጋ" : "+ አዲስ አባል መዝግብ"}
            </button>
          )}
        </div>
      </div>

      {/* Add / Edit Member Form */}
      {showAddForm && isAdmin && (
        <form onSubmit={handleSubmit} className="bg-emerald-950/90 border border-amber-500/50 p-5 rounded-3xl shadow-2xl space-y-4">
          <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
            {editingMember ? "✏️ የአባል መረጃ ማስተካከያ" : "➕ አዲስ አባል መመዝገቢያ ቅጽ"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Slot Select */}
            <div>
              <label className="block text-[11px] text-emerald-300/80 mb-1">ስሎት ምረጥ (Slot)</label>
              <select
                value={form.slotId}
                onChange={(e) => setForm({ ...form, slotId: e.target.value })}
                className="w-full bg-slate-950 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {slots.length === 0 ? (
                  <option value="">ምንም ስሎት የለም</option>
                ) : (
                  slots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.slot_name || s.name || `ስሎት #${s.id}`}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[11px] text-emerald-300/80 mb-1">የአባል ሙሉ ስም *</label>
              <input
                type="text"
                required
                placeholder="ምሳሌ፡ አበበ በቀለ"
                className="w-full bg-slate-950 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>

            {/* Alias Name */}
            <div>
              <label className="block text-[11px] text-emerald-300/80 mb-1">ቅጽል ስም (በህዝብ የሚታይ)</label>
              <input
                type="text"
                placeholder="ለዕጣ ውድድር የሚሆን ቅጽል ስም"
                className="w-full bg-slate-950 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] text-emerald-300/80 mb-1">ስልክ ቁጥር *</label>
              <input
                type="tel"
                required
                placeholder="0911......"
                className="w-full bg-slate-950 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-[11px] text-emerald-300/80 mb-1">የባንክ ስም</label>
              <select
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full bg-slate-950 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ፀደይ ባንክ">ፀደይ ባንክ (Tsedey Bank)</option>
                <option value="የኢትዮጵያ ንግድ ባንክ">የኢትዮጵያ ንግድ ባንክ (CBE)</option>
                <option value="አዋሽ ባንክ">አዋሽ ባንክ (Awash Bank)</option>
                <option value="አቢሲንያ ባንክ">አቢሲንያ ባንክ (Abyssinia Bank)</option>
                <option value="ቴሌብር">telebirr</option>
                <option value="CBE Birr">CBE Birr</option>
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-[11px] text-emerald-300/80 mb-1">የባንክ ሂሳብ ቁጥር (Account No) *</label>
              <input
                type="text"
                required
                placeholder="1121......"
                className="w-full bg-slate-950 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              />
            </div>

            {/* Contribution Amount */}
            <div>
              <label className="block text-[11px] text-emerald-300/80 mb-1">የመዋጮ ብር (በየ 50 ብር ልዩነት)</label>
              <input
                type="number"
                step="50"
                min="50"
                required
                className="w-full bg-slate-950 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                value={form.contribution_share}
                onChange={(e) => setForm({ ...form, contribution_share: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-emerald-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.phone_is_public}
                onChange={(e) => setForm({ ...form, phone_is_public: e.target.checked })}
                className="rounded border-emerald-700 text-amber-500 focus:ring-amber-500"
              />
              <span>ስልክ ቁጥር ለሌሎች አባላት ይታይ (Public View)</span>
            </label>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition w-full sm:w-auto"
              >
                ሰርዝ
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition w-full sm:w-auto shadow-md"
              >
                {editingMember ? "✓ መረጃውን አዘምን" : "💾 አባል መዝግብ (Save Member)"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 text-emerald-500" size={16} />
        <input
          type="text"
          placeholder="አባል በስም፣ በቅጽል ስም፣ በስልክ ወይም በአካውንት ቁጥር ይፈልጉ..."
          className="w-full bg-[#113828]/60 border border-emerald-700/50 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition shadow-inner"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto bg-[#113828]/70 border border-emerald-700/50 rounded-3xl shadow-xl">
        <table className="w-full text-left text-xs text-white">
          <thead>
            <tr className="border-b border-emerald-800 text-amber-400 font-extrabold bg-emerald-950/40">
              <th className="p-4">ተ.ቁ</th>
              <th className="p-4">የአባሉ ሙሉ ስም</th>
              <th className="p-4">ቅጽል ስም</th>
              <th className="p-4">ስልክ ቁጥር</th>
              <th className="p-4">የባንክ መረጃ</th>
              <th className="p-4">መዋጮ</th>
              {isAdmin && <th className="p-4 text-center">እርምጃዎች</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/40">
            {filteredMembers.map((m, index) => (
              <tr key={m.id} className="hover:bg-emerald-900/30 transition">
                <td className="p-4 font-mono text-emerald-400/80">{index + 1}</td>
                <td className="p-4 font-bold text-white">{m.full_name}</td>
                <td className="p-4 text-emerald-300 font-medium">@{m.nickname}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-emerald-200">
                    <Phone size={12} className="text-amber-400" />
                    <span>{m.phone_is_public || isAdmin ? m.phone_number : "09****** (የተሰወረ)"}</span>
                    {m.phone_is_public ? (
                      <Eye size={12} className="text-emerald-400 ml-1" title="ለሁሉም ይታያል" />
                    ) : (
                      <EyeOff size={12} className="text-amber-400/70 ml-1" title="ምስጢራዊ ነው" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-emerald-200 space-y-0.5">
                    <p className="font-semibold text-amber-300/90 flex items-center gap-1">
                      <Building2 size={12} /> {m.bankName || "ፀደይ ባንክ"}
                    </p>
                    <p className="font-mono text-[11px] text-emerald-300 flex items-center gap-1">
                      <CreditCard size={12} /> {m.accountNumber || "N/A"}
                    </p>
                  </div>
                </td>
                <td className="p-4 font-extrabold text-amber-400 font-mono">
                  {Number(m.contribution_share).toLocaleString()} ብር
                </td>
                {isAdmin && (
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(m)}
                        className="p-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-amber-400 rounded-lg transition cursor-pointer"
                        title="መረጃ አስተካክል"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 bg-red-950/80 hover:bg-red-900 text-red-400 rounded-lg transition cursor-pointer"
                        title="አባሉን ሰርዝ"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="p-8 text-center text-emerald-400/60 italic">
                  ምንም የተመዘገበ አባል አልተገኘም።
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}