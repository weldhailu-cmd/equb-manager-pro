import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function MainSlotManager({ onBackHome }) {
  const { t } = useLanguage();

  // የስሎቶች መዋቅር ናሙና (State)
  const [slots, setSlots] = useState([
    {
      id: 1,
      slotName: "ስሎት 1 (Slot 1)",
      slotNickname: "የገብረኤል ስጦታ", // እጣ ውስጥ የሚወዳደርበት ስም
      targetAmount: 100, // የጠቅላላ ስሎቱ ማነጻጸሪያ መጠን
      subMembers: [
        { id: 101, fullName: "አበበ ከበደ", nickname: "አባ ዮናስ", phone: "0911******XX", amount: 25 },
        { id: 102, fullName: "ካሳሁን ታደሰ", nickname: "ካሴ", phone: "0922******XX", amount: 25 },
        { id: 103, fullName: "ሰላማዊት አሰፋ", nickname: "ሰላም", phone: "0933******XX", amount: 25 },
        { id: 104, fullName: "መኮንን አበበ", nickname: "መኮ", phone: "0944******XX", amount: 25 },
      ]
    }
  ]);

  // አዲስ ንዑስ አባል (Sub-Member) የመጨመር ተግባር
  const handleAddSubMember = (slotId) => {
    setSlots(prevSlots =>
      prevSlots.map(slot => {
        if (slot.id === slotId) {
          const newSubMember = {
            id: Date.now(),
            fullName: "",
            nickname: "",
            phone: "",
            amount: 0
          };
          return { ...slot, subMembers: [...slot.subMembers, newSubMember] };
        }
        return slot;
      })
    );
  };

  // የንዑስ አባል መረጃዎችን ማስተካከል
  const handleSubMemberChange = (slotId, memberId, field, value) => {
    setSlots(prevSlots =>
      prevSlots.map(slot => {
        if (slot.id === slotId) {
          const updatedMembers = slot.subMembers.map(member => {
            if (member.id === memberId) {
              let processedValue = value;
              if (field === 'phone') {
                // ስልክ ቁጥር ሲገባ የመጨረሻዎቹ አራት ዲጂቶች በ XX እንዲጠበቁ ማድረግ
                processedValue = value.length > 4 ? value.slice(0, -4) + "XX" : value;
              }
              return { ...member, [field]: processedValue };
            }
            return member;
          });
          return { ...slot, subMembers: updatedMembers };
        }
        return slot;
      })
    );
  };

  return (
    <div className="p-6 bg-emerald-950 text-white rounded-xl shadow-xl max-w-4xl mx-auto my-6 border border-emerald-800">
      
      {/* ወደ መነሻ ገጽ መውጫ በተን (Back to Home) */}
      <div className="mb-4">
        <button 
          onClick={onBackHome}
          className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-2 transition duration-200"
        >
          {t('back_home') || "← ወደ መነሻ ገጽ"}
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-amber-400">{t('main_slots_title')}</h2>
      <p className="text-sm text-emerald-200 mb-6">{t('main_slots_desc')}</p>

      {slots.map((slot, slotIndex) => {
        const totalCollected = slot.subMembers.reduce((sum, m) => sum + Number(m.amount), 0);
        const isBalanced = totalCollected === slot.targetAmount;

        return (
          <div key={slot.id} className="bg-emerald-900/60 p-5 rounded-lg mb-6 border border-emerald-700">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-emerald-800">
              <div>
                <span className="text-xs uppercase bg-amber-500 text-emerald-950 px-2 py-1 rounded font-bold">
                  {t('slot_number') || "ስሎት ቁጥር"} {slotIndex + 1}
                </span>
                <input 
                  type="text" 
                  value={slot.slotNickname}
                  onChange={(e) => {
                    const updated = [...slots];
                    updated[slotIndex].slotNickname = e.target.value;
                    setSlots(updated);
                  }}
                  placeholder={t('slot_nickname') || "የስሎት ኒክኔም (እጣ ውስጥ የሚወዳደርበት ስም)"}
                  className="mt-2 block w-full bg-emerald-950 border border-emerald-700 rounded p-2 text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* ሚዛን ማስተካከያ (Not Balanced / Balance Warning) */}
              <div className="text-right">
                <span className="text-xs text-emerald-300 block">{t('total_slot_contribution') || "አጠቃላይ መዋጮ"}: {totalCollected} ብር</span>
                {isBalanced ? (
                  <span className="text-emerald-400 text-sm font-bold">{t('balanced_success') || "✓ ሚዛኑ ትክክል ነው"}</span>
                ) : (
                  <span className="text-red-400 text-sm font-bold animate-pulse">{t('not_balanced_warning') || "⚠️ ሚዛኑ አልጠበቀም!"}</span>
                )}
              </div>
            </div>

            <h4 className="text-sm font-semibold text-emerald-200 mb-3">{t('sub_members_list') || "የንዑስ አባላት ዝርዝር"}</h4>
            
            <div className="space-y-3">
              {slot.subMembers.map((member) => (
                <div key={member.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-emerald-950/80 p-3 rounded border border-emerald-800/60 items-center">
                  
                  {/* ሙሉ ስም */}
                  <div>
                    <label className="text-[10px] text-emerald-400 block">{t('full_name') || "ሙሉ ስም"}</label>
                    <input 
                      type="text" 
                      value={member.fullName}
                      onChange={(e) => handleSubMemberChange(slot.id, member.id, 'fullName', e.target.value)}
                      placeholder="ሙሉ ስም"
                      className="w-full bg-emerald-900 border border-emerald-700 rounded p-1.5 text-xs text-white"
                    />
                  </div>

                  {/* ቅጽል ስም */}
                  <div>
                    <label className="text-[10px] text-emerald-400 block">{t('nickname_label') || "ቅጽል ስም"}</label>
                    <input 
                      type="text" 
                      value={member.nickname}
                      onChange={(e) => handleSubMemberChange(slot.id, member.id, 'nickname', e.target.value)}
                      placeholder="ቅጽል ስም"
                      className="w-full bg-emerald-900 border border-emerald-700 rounded p-1.5 text-xs text-white"
                    />
                  </div>

                  {/* ስልክ ቁጥር (መጨረሻው በ XX የሚታይ) */}
                  <div>
                    <label className="text-[10px] text-emerald-400 block">{t('phone_label') || "ስልክ ቁጥር (XX)"}</label>
                    <input 
                      type="text" 
                      value={member.phone}
                      onChange={(e) => handleSubMemberChange(slot.id, member.id, 'phone', e.target.value)}
                      placeholder="0911XX"
                      className="w-full bg-emerald-900 border border-emerald-700 rounded p-1.5 text-xs text-white"
                    />
                  </div>

                  {/* የመዋጮ መጠን */}
                  <div>
                    <label className="text-[10px] text-emerald-400 block">{t('contribution_label') || "መዋጮ መጠን (ብር)"}</label>
                    <input 
                      type="number" 
                      value={member.amount}
                      onChange={(e) => handleSubMemberChange(slot.id, member.id, 'amount', e.target.value)}
                      className="w-full bg-emerald-900 border border-emerald-700 rounded p-1.5 text-xs text-amber-300 font-bold"
                    />
                  </div>

                </div>
              ))}
            </div>

            {/* ንዑስ አባል ጨምር (Add Sub-Member) በተን */}
            <button 
              onClick={() => handleAddSubMember(slot.id)}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-4 py-2 rounded text-xs transition duration-200 shadow"
            >
              {t('add_sub_member') || "+ ንዑስ አባል ጨምር"}
            </button>

          </div>
        );
      })}
    </div>
  );
}