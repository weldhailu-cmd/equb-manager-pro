import React, { useState, useEffect } from 'react';

const BatchPaymentMatrix = ({ equbId }) => {
  const [members, setMembers] = useState([]);
  const [roundsCount, setRoundsCount] = useState(12); // አጠቃላይ የዙሮች ብዛት (ለምሳሌ 12 ወር)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [contributionAmount, setContributionAmount] = useState(1000);
  const [paymentsMatrix, setPaymentsMatrix] = useState({}); // { memberId: { roundNum: true/false } }
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // አባላትን እና ቀደም ሲል የተደረጉ ክፍያዎችን ከቤዝ መዝገብ (Backend) መጥራት
  useEffect(() => {
    fetchData();
  }, [equbId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. አባላትን ማምጣት
      const memRes = await fetch(`/api/equbs/${equbId}/members/`);
      const memData = await memRes.json();
      setMembers(memData);

      // 2. የተደረጉ ክፍያዎችን ማምጣት
      const payRes = await fetch(`/api/equbs/${equbId}/payments/`);
      const payData = await payRes.json();

      // ማትሪክሱን ማዋቀር (Matrix Mapping)
      const matrix = {};
      payData.forEach(p => {
        if (!matrix[p.member_id]) {
          matrix[p.member_id] = {};
        }
        if (p.status === 'paid') {
          matrix[p.member_id][p.round_number] = true;
        }
      });
      setPaymentsMatrix(matrix);
    } catch (error) {
      console.error("ዳታ በመጫን ላይ ስህተት ተፈጥሯል:", error);
    } finally {
      setLoading(false);
    }
  };

  // የ Checkbox ሲቀየር የસ્થታዊ (State) መረጃውን ማሻሻል
  const handleCheckboxChange = (memberId, roundNum) => {
    setPaymentsMatrix(prev => {
      const memberPayments = prev[memberId] || {};
      return {
        ...prev,
        [memberId]: {
          ...memberPayments,
          [roundNum]: !memberPayments[roundNum]
        }
      };
    });
  };

  // ሁሉንም የክፍያ ለውጦች ወደ ሰርቨር (Batch Save) መላክ
  const handleSaveAllPayments = async () => {
    setSaving(true);
    setMessage('');
    try {
      // ማትሪክሱን ወደ ባች ፔይመንት ሎብል (Batch Payload) መቀየር
      const paymentsList = [];
      Object.keys(paymentsMatrix).forEach(memberId => {
        Object.keys(paymentsMatrix[memberId]).forEach(roundNum => {
          if (paymentsMatrix[memberId][roundNum]) {
            paymentsList.push({
              member_id: parseInt(memberId),
              amount: contributionAmount,
              status: 'paid'
            });
          }
        });
      });

      // ለአያንዳንዱ ዙር መረጃ መላክ ይቻላል ወይም በዙር ተኮር መላክ
      for (let r = 1; r <= roundsCount; r++) {
        const roundPayments = members
          .filter(m => paymentsMatrix[m.id] && paymentsMatrix[m.id][r])
          .map(m => ({
            member_id: m.id,
            amount: contributionAmount,
            status: 'paid'
          }));

        if (roundPayments.length > 0) {
          await fetch(`/api/equbs/${equbId}/payments/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              round_number: r,
              payment_date: paymentDate,
              payments: roundPayments
            })
          });
        }
      }

      setMessage('✅ ክፍያዎቹ በሳካ ሁኔታ ተመዝግበዋል!');
      fetchData();
    } catch (error) {
      console.error("ክፍያ ሲመዝገብ ስህተት ተፈጥሯል:", error);
      setMessage('❌ ማስቀመጥ አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">መረጃ በመጫን ላይ...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-7xl mx-auto my-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">የእቁብ ክፍያ ማትሪክስ (Batch Payment Matrix)</h2>
          <p className="text-sm text-gray-500">አባላት በክፍለ ዙር የፈጸሟቸውን ክፍያዎች በሳጥን (Checkbox) ምልክት ያድርጉ</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">የቀን መቁረጫ</label>
            <input 
              type="date" 
              value={paymentDate} 
              onChange={(e) => setPaymentDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={handleSaveAllPayments}
            disabled={saving}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition shadow-sm disabled:opacity-50"
          >
            {saving ? 'በመመዝገብ ላይ...' : 'ለውጦችን መዝግብ'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-3 mb-4 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* የሰንጠረዥ ክፍል (Table Container with Horizontal Scroll) */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r">
                የአባል ስም
              </th>
              {Array.from({ length: roundsCount }, (_, i) => i + 1).map(round => (
                <th key={round} className="px-3 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider border-r min-w-[70px]">
                  ዙር {round}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.length === 0 ? (
              <tr>
                <td colSpan={roundsCount + 1} className="px-4 py-6 text-center text-gray-400">
                  ምንም አባላት አልተገኙም።
                </td>
              </tr>
            ) : (
              members.map(member => (
                <tr key={member.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white z-10 border-r whitespace-nowrap shadow-sm">
                    {member.full_name}
                    <span className="block text-xs text-gray-400 font-normal">{member.phone_number}</span>
                  </td>
                  {Array.from({ length: roundsCount }, (_, i) => i + 1).map(round => {
                    const isChecked = paymentsMatrix[member.id]?.[round] || false;
                    return (
                      <td key={round} className="px-3 py-3 text-center border-r">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(member.id, round)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>* ሳጥኑን በመንካት ክፍያ መዝገብ ወይም ማጥፋት ይቻላል።</span>
        <span>አጠቃላይ አባላት: {members.length}</span>
      </div>
    </div>
  );
};

export default BatchPaymentMatrix;