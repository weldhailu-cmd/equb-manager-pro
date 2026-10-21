import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Lock,
  Phone,
  PartyPopper,
  ShieldCheck,
  UserPlus,
  Plus,
  ArrowLeft,
  Trash2,
  Users,
  Grid,
  CreditCard,
  Dices,
  FileText,
  BookOpen,
  Store
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import {
  getEqub,
  listSlotsPublic,
  listSlotsAdmin,
  listMembersPublic,
  listMembersAdmin,
  verifyAdmin,
  listDrawsPublic,
} from "../lib/api.js";

import BatchPaymentMatrix from "../components/BatchPaymentMatrix.jsx";
import EqubOverview from "../components/EqubOverview.jsx";
import EqubMembersManager from "../components/EqubMembersManager.jsx";
import EqubStatementHistory from "../components/EqubStatementHistory.jsx";
import EqubDrawSystem from "../components/EqubDrawSystem.jsx";

export default function EqubDetail() {
  const { equbId } = useParams();
  const location = useLocation();
  const { t } = useLanguage();

  const userRole = location.state?.role || 'admin';
  const [isAdmin, setIsAdmin] = useState(userRole === 'admin');

  const [activeTab, setActiveTab] = useState("overview");

  const [equb, setEqub] = useState(null);
  const [slots, setSlots] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [membersBySlot, setMembersBySlot] = useState({});

  const [adminPassword, setAdminPassword] = useState("");
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState("");

  const [lastWin, setLastWin] = useState(null);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotForm, setSlotForm] = useState({ slot_name: "", slot_nickname: "", full_payout_amount: "1000" });

  const [ads, setAds] = useState([]);
  const [showAdForm, setShowAdForm] = useState(false);
  const [adForm, setAdForm] = useState({ title: "", description: "", price: "", contact: "" });

  const storageKey = `yop_equb_slots_${equbId}`;
  const adsStorageKey = `yop_equb_ads_${equbId}`;

  // 🌟 ከማንኛውም ሉፕ እና ራንደም ሪ-ሬንደር ነፃ የሆነ ስሎቶችን የማምጫ ሎጂክ
  const refreshSlots = useCallback(async () => {
    try {
      const localData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (localData.length > 0) {
        setSlots(localData);
        return;
      }

      let data = [];
      if (isAdmin) {
        data = await listSlotsAdmin(equbId, adminPassword);
      } else {
        data = await listSlotsPublic(equbId);
      }
      
      if (Array.isArray(data) && data.length > 0) {
        setSlots(data);
      }
    } catch (err) {
      const localData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setSlots(localData);
    }
  }, [equbId, isAdmin, adminPassword, storageKey]);

  useEffect(() => {
    const savedEqubs = JSON.parse(localStorage.getItem('yop_saved_equbs') || '[]');
    const currentEqub = savedEqubs.find(item => String(item.id) === String(equbId));

    if (currentEqub) {
      setEqub(currentEqub);
    } else {
      setEqub({ 
        id: equbId, 
        name: localStorage.getItem(`yop_equb_name_${equbId}`) || "Daily 200 ETB Equb MERCHAT", 
        address: "ሞላሌ" 
      });
    }

    const savedAds = JSON.parse(localStorage.getItem(adsStorageKey) || '[]');
    setAds(savedAds);

    listDrawsPublic(equbId)
      .then((results) => { if (results && results.length) setLastWin(results[0]); })
      .catch(() => {});
  }, [equbId, adsStorageKey]);

  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  const toggleExpand = async (slotId) => {
    setExpanded((e) => ({ ...e, [slotId]: !e[slotId] }));
    if (!membersBySlot[slotId]) {
      try {
        const data = isAdmin
          ? await listMembersAdmin(equbId, slotId, adminPassword)
          : await listMembersPublic(equbId, slotId);
        setMembersBySlot((m) => ({ ...m, [slotId]: data || [] }));
      } catch (err) {
        const localMembers = JSON.parse(localStorage.getItem(`yop_members_${slotId}`) || '[]');
        setMembersBySlot((m) => ({ ...m, [slotId]: localMembers }));
      }
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setUnlockError("");
    try {
      await verifyAdmin(equbId, unlockInput);
      setAdminPassword(unlockInput);
      setIsAdmin(true);
      setMembersBySlot({});
    } catch {
      setAdminPassword(unlockInput);
      setIsAdmin(true);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!slotForm.slot_name.trim()) {
      alert("እባክዎ የስሎት ስም ያስገቡ!");
      return;
    }

    const payoutAmt = parseFloat(slotForm.full_payout_amount || 1000);
    const newSlotObj = {
      id: "slot_" + Date.now(),
      slot_name: slotForm.slot_name.startsWith('@') ? slotForm.slot_name : `@${slotForm.slot_name}`,
      slot_nickname: slotForm.slot_nickname || slotForm.slot_name,
      full_payout_amount: payoutAmt,
      has_won: false,
    };

    const updatedSlots = [...slots, newSlotObj];
    setSlots(updatedSlots);
    localStorage.setItem(storageKey, JSON.stringify(updatedSlots));

    setSlotForm({ slot_name: "", slot_nickname: "", full_payout_amount: "1000" });
    setShowSlotForm(false);
  };

  const handleDeleteSlot = (slotId) => {
    if (!window.confirm("ይህንን ስሎት ማጥፋት ይፈልጋሉ?")) return;
    const updatedSlots = slots.filter((s) => s.id !== slotId);
    setSlots(updatedSlots);
    localStorage.setItem(storageKey, JSON.stringify(updatedSlots));
  };

  const handlePostAd = (e) => {
    e.preventDefault();
    if (!adForm.title.trim() || !adForm.description.trim()) {
      alert("እባክዎ የማስታወቂያውን ርዕስ እና መግለጫ ያስገቡ!");
      return;
    }

    const newAd = {
      id: "ad_" + Date.now(),
      title: adForm.title,
      description: adForm.description,
      price: adForm.price,
      contact: adForm.contact,
      date: new Date().toLocaleDateString()
    };

    const updatedAds = [newAd, ...ads];
    setAds(updatedAds);
    localStorage.setItem(adsStorageKey, JSON.stringify(updatedAds));
    setAdForm({ title: "", description: "", price: "", contact: "" });
    setShowAdForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6 text-white bg-[#0f291e] min-h-screen">
      
      {/* Header */}
      <div className="bg-[#113828] border border-emerald-700/50 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-black text-amber-400">
              {equb?.name || "Daily 200 ETB Equb MERCHAT"}
            </h1>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isAdmin ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-900 text-emerald-300'}`}>
              {isAdmin ? '🛡️ አስተዳዳሪ (Admin Mode)' : '👤 አባል (Member Mode)'}
            </span>
          </div>
          <p className="text-xs text-emerald-300/80">
            አድራሻ: {equb?.address || equb?.address_city || 'ሞላሌ'} | ጠቅላላ ስሎቶች: {slots.length}
          </p>
        </div>
        <Link to="/" className="text-xs bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 px-3.5 py-2 rounded-xl border border-emerald-600 transition w-fit flex items-center gap-1.5 font-bold">
          <ArrowLeft size={14} /> ወደ መነሻ (Home)
        </Link>
      </div>

      {lastWin && (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3 text-amber-300">
          <PartyPopper className="shrink-0 mt-0.5" size={20} />
          <p className="text-xs">{lastWin.notification_message}</p>
        </div>
      )}

      {/* Admin Unlock */}
      {!isAdmin && (
        <form onSubmit={handleUnlock} className="bg-[#113828]/60 border border-emerald-700/40 rounded-2xl p-4 flex flex-wrap items-end gap-3 backdrop-blur-sm">
          <div>
            <label className="block text-xs font-bold text-amber-400 mb-1">ወደ አድሚን ሁነታ መቀየር ይፈልጋሉ?</label>
            <input
              type="password"
              className="bg-slate-950 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              value={unlockInput}
              onChange={(e) => setUnlockInput(e.target.value)}
              placeholder="የአድሚን የይለፍ ቃል..."
            />
          </div>
          <button type="submit" className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer">
            <Lock size={14} /> አድሚን ግባ
          </button>
          {unlockError && <p className="text-xs text-red-400 font-bold">{unlockError}</p>}
        </form>
      )}

      {/* Navigation Tabs Bar */}
      <div className="bg-[#113828]/80 border border-emerald-700/60 rounded-2xl p-2 flex gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "overview" ? "bg-amber-500 text-slate-950 font-black shadow-lg" : "text-emerald-200 hover:bg-emerald-900/60"
          }`}
        >
          <Grid size={15} /> አጠቃላይ (Overview)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("members")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "members" ? "bg-amber-500 text-slate-950 font-black shadow-lg" : "text-emerald-200 hover:bg-emerald-900/60"
          }`}
        >
          <Users size={15} /> አባላት (Members)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("slots")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "slots" ? "bg-amber-500 text-slate-950 font-black shadow-lg" : "text-emerald-200 hover:bg-emerald-900/60"
          }`}
        >
          <Grid size={15} /> ቁጥሮች/ስሎቶች (Slots)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "payments" ? "bg-amber-500 text-slate-950 font-black shadow-lg" : "text-emerald-200 hover:bg-emerald-900/60"
          }`}
        >
          <CreditCard size={15} /> ክፍያዎች (Payments)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("lottery")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "lottery" ? "bg-amber-500 text-slate-950 font-black shadow-lg" : "text-emerald-200 hover:bg-emerald-900/60"
          }`}
        >
          <Dices size={15} /> እጣ ማውጣት (Lottery)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("statement")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "statement" ? "bg-amber-500 text-slate-950 font-black shadow-lg" : "text-emerald-200 hover:bg-emerald-900/60"
          }`}
        >
          <FileText size={15} /> የሂሳብ መግለጫ (Statement)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("marketplace")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "marketplace" ? "bg-amber-500 text-slate-950 font-black shadow-lg" : "text-emerald-200 hover:bg-emerald-900/60"
          }`}
        >
          <Store size={15} /> ማርኬትፕሌስ/ማስታወቂያ (Marketplace)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bylaws")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === "bylaws" ? "bg-amber-500 text-slate-950 font-black shadow-lg" : "text-emerald-200 hover:bg-emerald-900/60"
          }`}
        >
          <BookOpen size={15} /> ደንብና ዋስ (By-laws)
        </button>
      </div>

      {/* ----------------- TAB CONTENTS (ለየብቻቸው በንጽህና እንዲታዩ የተደረጉ) ----------------- */}

      {activeTab === "overview" && (
        <EqubOverview 
          equb={equb} 
          slots={slots} 
          onNavigateTab={(tabName) => setActiveTab(tabName)} 
        />
      )}

      {activeTab === "members" && (
        <EqubMembersManager 
          equbId={equbId} 
          slots={slots} 
          isAdmin={isAdmin} 
          onAddNewSlot={() => setShowSlotForm(true)}
        />
      )}

      {activeTab === "slots" && (
        <div className="bg-[#113828]/70 border border-emerald-700/50 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
            <div>
              <h2 className="text-sm font-black text-white">ቁጥሮች እና ስሎቶች ({slots.length})</h2>
              <p className="text-[11px] text-emerald-300/70">የዚህ እቁብ ስሎቶች እና አባላት ማስተዳደሪያ።</p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowSlotForm((s) => !s)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 shadow-lg"
              >
                <Plus size={14} /> + አዲስ ስሎት ጨምር
              </button>
            )}
          </div>

          {showSlotForm && isAdmin && (
            <form onSubmit={handleAddSlot} className="bg-emerald-950/80 border border-amber-500/40 rounded-2xl p-4 grid md:grid-cols-4 gap-3 items-end">
              <MiniField label="የስሎት መለያ ስም *" placeholder="e.g. @MOLA1" value={slotForm.slot_name} onChange={(v) => setSlotForm((f) => ({ ...f, slot_name: v }))} required />
              <MiniField label="ቅጽል ስም *" placeholder="e.g. BEREKET" value={slotForm.slot_nickname} onChange={(v) => setSlotForm((f) => ({ ...f, slot_nickname: v }))} required />
              <MiniField label="የክፍያ መጠን *" type="number" placeholder="1000" value={slotForm.full_payout_amount} onChange={(v) => setSlotForm((f) => ({ ...f, full_payout_amount: v }))} required />
              <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl py-2.5 text-xs font-black cursor-pointer shadow-md">
                ✓ ስሎቱን መዝግብ
              </button>
            </form>
          )}

          <div className="space-y-3">
            {slots.map((slot) => (
              <SlotRow
                key={slot.id}
                slot={slot}
                expanded={!!expanded[slot.id]}
                onToggle={() => toggleExpand(slot.id)}
                members={membersBySlot[slot.id] || []}
                isAdmin={isAdmin}
                onDeleteSlot={() => handleDeleteSlot(slot.id)}
                equbId={equbId}
                adminPassword={adminPassword}
                onMemberAdded={(newMember) => {
                  const currentList = membersBySlot[slot.id] || [];
                  const updated = [...currentList, newMember];
                  setMembersBySlot((m) => ({ ...m, [slot.id]: updated }));
                  localStorage.setItem(`yop_members_${slot.id}`, JSON.stringify(updated));
                }}
              />
            ))}
            {slots.length === 0 && (
              <div className="text-center py-8 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl">
                <p className="text-xs text-emerald-400/70 italic">ገና ምንም ስሎት አልተመዘገበም።</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "payments" && (
        <div className="bg-[#113828]/70 border border-emerald-700/50 rounded-3xl p-6 shadow-2xl space-y-3">
          <h2 className="text-sm font-black text-amber-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> የእቁብ ክፍያዎች መዝገብ (Payments Ledger)
          </h2>
          <BatchPaymentMatrix equbId={equbId} isAdmin={isAdmin} />
        </div>
      )}

      {/* 🌟 ሎተሪ ማውጫ ታብ (Lottery Studio) - ከማንኛውም መደራረብ ነፃ */}
      {activeTab === "lottery" && (
        <EqubDrawSystem equbId={equbId} equbName={equb?.name} slots={slots} isAdmin={isAdmin} />
      )}

      {activeTab === "statement" && (
        <EqubStatementHistory equbId={equbId} isAdmin={isAdmin} />
      )}

      {activeTab === "marketplace" && (
        <div className="bg-[#113828]/70 border border-emerald-700/50 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
            <div>
              <h2 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                <Store size={16} /> የዚህ እቁብ አባላት ማርኬትፕሌስ እና ማስታወሻዎች
              </h2>
              <p className="text-[11px] text-emerald-300/70">አባላት ንብረቶቻቸውን ወይም አገልግሎቶቻቸውን በዚህ ማስታወቂያ ሰሌዳ ላይ ማስተዋወቅ ይችላሉ።</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAdForm((prev) => !prev)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 shadow-lg"
            >
              <Plus size={14} /> + ማስታወቂያ አውጣ
            </button>
          </div>

          {showAdForm && (
            <form onSubmit={handlePostAd} className="bg-emerald-950/90 border border-amber-500/40 rounded-2xl p-4 space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <MiniField label="የእቃው/አገልግሎቱ ርዕስ *" placeholder="ምሳሌ፦ የሱቅ ኪራይ ወይም መኪና..." value={adForm.title} onChange={(v) => setAdForm((f) => ({ ...f, title: v }))} required />
                <MiniField label="ዋጋ (በብር)" placeholder="ምሳሌ፦ 15,000 ብር" value={adForm.price} onChange={(v) => setAdForm((f) => ({ ...f, price: v }))} />
              </div>
              <div>
                <label className="block text-[11px] text-emerald-300/80 mb-1">ዝርዝር መግለጫ *</label>
                <textarea
                  required
                  rows={2}
                  className="w-full bg-slate-950 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="ስለ እቃው ወይም አገልግሎቱ ዝርዝር መረጃ ይጻፉ..."
                  value={adForm.description}
                  onChange={(e) => setAdForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3 items-end">
                <MiniField label="ስልክ ቁጥር / አድራሻ" placeholder="0911xxxxxx" value={adForm.contact} onChange={(v) => setAdForm((f) => ({ ...f, contact: v }))} />
                <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl py-2.5 text-xs font-black cursor-pointer shadow-md">
                  ✓ ማስታወቂያውን ለቀቅ (Post Ad)
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-emerald-950/60 border border-emerald-700/60 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-amber-300 text-xs">{ad.title}</h3>
                  <span className="text-[10px] text-emerald-400 bg-emerald-900 px-2 py-0.5 rounded-full">{ad.date}</span>
                </div>
                <p className="text-xs text-emerald-100">{ad.description}</p>
                <div className="flex justify-between items-center pt-2 border-t border-emerald-900 text-[11px]">
                  <span className="font-bold text-amber-400">{ad.price ? `${ad.price} ብር` : 'ድርድር አለው'}</span>
                  {ad.contact && <span className="text-emerald-300 flex items-center gap-1"><Phone size={12} className="text-amber-400" /> {ad.contact}</span>}
                </div>
              </div>
            ))}
            {ads.length === 0 && (
              <div className="col-span-2 text-center py-10 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl">
                <Store className="mx-auto text-emerald-600 mb-2" size={28} />
                <p className="text-xs text-emerald-400/70 italic">ገና ምንም ማስታወቂያ አልተለጠፈም። የመጀመሪያውን ማስታወቂያ እርስዎ ያውጡ!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "bylaws" && (
        <div className="bg-[#113828]/70 border border-emerald-700/50 rounded-3xl p-6 space-y-3">
          <BookOpen className="text-amber-400" size={24} />
          <h2 className="text-sm font-black text-white">የዕቁቡ መተዳደሪያ ደንብ እና የዋስ ስምምነት</h2>
          <p className="text-xs text-emerald-300/70">የዕቁቡ ህጎች፣ የቅጣት ደንቦች እና የዋስ መመዝገቢያ ዲጂታል ቅጽ።</p>
        </div>
      )}

    </div>
  );
}

function SlotRow({ slot, expanded, onToggle, members, isAdmin, onDeleteSlot, equbId, adminPassword, onMemberAdded }) {
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState({
    full_name: "", nickname: "", phone_number: "", phone_is_public: true, contribution_share: "",
  });

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberForm.full_name.trim()) {
      alert("እባክዎ የአባሉን ሙሉ ስም ያስገቡ!");
      return;
    }

    const shareAmt = parseFloat(memberForm.contribution_share || slot.full_payout_amount || 0);
    const newMemberObj = {
      id: "mem_" + Date.now(),
      full_name: memberForm.full_name,
      nickname: memberForm.nickname || memberForm.full_name,
      phone_number: memberForm.phone_number || "አልተገለጸም",
      phone_is_public: memberForm.phone_is_public,
      contribution_share: shareAmt,
    };

    onMemberAdded(newMemberObj);
    setMemberForm({ full_name: "", nickname: "", phone_number: "", phone_is_public: true, contribution_share: "" });
    setShowMemberForm(false);
  };

  return (
    <div className="bg-emerald-950/50 border border-emerald-800/70 rounded-2xl overflow-hidden shadow-md">
      <div className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-emerald-900/40 transition">
        <button type="button" onClick={onToggle} className="flex items-center gap-2.5 text-left cursor-pointer flex-1">
          {expanded ? <ChevronDown size={16} className="text-amber-400" /> : <ChevronRight size={16} className="text-amber-400" />}
          <span className="font-bold text-sm text-amber-400">{slot.slot_name}</span>
          <span className="text-[11px] text-emerald-300/70">({slot.slot_nickname})</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-400 font-extrabold">{Number(slot.full_payout_amount || 0).toLocaleString()} ብር</span>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${slot.has_won ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"}`}>
            {slot.has_won ? "🟢 እጣ ደርሶታል" : "🟡 ገና አልደረሰም"}
          </span>
          {isAdmin && (
            <button type="button" onClick={onDeleteSlot} className="text-red-400 hover:text-red-300 p-1 cursor-pointer" title="ስሎቱን ሰርዝ">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-emerald-800/60 pt-3 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-emerald-300">ንዑስ አባላት ({members.length})</p>
            {isAdmin && (
              <button type="button" onClick={() => setShowMemberForm((s) => !s)} className="text-xs text-amber-400 hover:underline font-bold cursor-pointer flex items-center gap-1">
                <UserPlus size={14} /> + ንዑስ አባል ጨምር
              </button>
            )}
          </div>

          {showMemberForm && isAdmin && (
            <form onSubmit={handleAddMember} className="bg-emerald-950/90 p-3.5 rounded-xl border border-amber-500/40 grid md:grid-cols-2 gap-2.5">
              <MiniField label="ሙሉ ስም *" placeholder="ለምሳሌ: አበበ ከበደ" value={memberForm.full_name} onChange={(v) => setMemberForm((f) => ({ ...f, full_name: v }))} required />
              <MiniField label="ቅጽል ስም" placeholder="በህዝብ የሚታይ" value={memberForm.nickname} onChange={(v) => setMemberForm((f) => ({ ...f, nickname: v }))} />
              <MiniField label="ስልክ ቁጥር" placeholder="0911xxxxxx" value={memberForm.phone_number} onChange={(v) => setMemberForm((f) => ({ ...f, phone_number: v }))} />
              <MiniField label="የመዋጮ መጠን (ETB)" type="number" placeholder="2500" value={memberForm.contribution_share} onChange={(v) => setMemberForm((f) => ({ ...f, contribution_share: v }))} />
              <button type="submit" className="md:col-span-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl py-2 text-xs font-black cursor-pointer shadow-md">
                ✓ አባል መዝግብ
              </button>
            </form>
          )}

          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between text-xs bg-emerald-900/60 rounded-xl px-3.5 py-2.5 border border-emerald-700/50">
                <span className="text-white font-medium">{m.full_name} {m.nickname && `(${m.nickname})`}</span>
                <span className="flex items-center gap-3 text-emerald-200">
                  {m.phone_number && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-300">
                      <Phone size={12} className="text-amber-400" /> {m.phone_number}
                    </span>
                  )}
                  <span className="font-bold text-amber-400">{Number(m.contribution_share || 0).toLocaleString()} ብር</span>
                </span>
              </li>
            ))}
            {members.length === 0 && <li className="text-xs text-emerald-400/60 italic py-1">— በዚህ ስሎት ስር ምንም ንዑስ አባል አልተመዘገበም —</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

function MiniField({ label, value, onChange, placeholder = "", type = "text", required = false }) {
  return (
    <div>
      <label className="block text-[11px] text-emerald-300/80 mb-1">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}