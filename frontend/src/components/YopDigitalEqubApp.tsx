import React, { useState } from 'react';
import { 
  Users, Wallet, Calendar, Trophy, Send, Download, 
  Printer, CheckCircle2, AlertCircle, Search, RefreshCw, X
} from 'lucide-react';

// Types Definition
interface SubSlot {
  id: string;
  name: string;
  phone: string;
  sharePercentage: number;
  amount: number;
  paidStatus: 'Paid' | 'Pending';
  telegramId?: string;
}

interface MainSlot {
  id: string;
  slotNumber: number;
  totalAmount: number;
  status: 'Completed' | 'Pending' | 'Active';
  winner?: string;
  subSlots: SubSlot[];
}

export default function YopDigitalEqubApp() {
  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<MainSlot | null>(null);
  const [receiptData, setReceiptData] = useState<SubSlot | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Mock Equb Data
  const [slots, setSlots] = useState<MainSlot[]>([
    {
      id: '1',
      slotNumber: 1,
      totalAmount: 10000,
      status: 'Completed',
      winner: 'ሀይለወልደ ኪዳን',
      subSlots: [
        { id: 's1', name: 'ሀይለወልደ ኪዳን', phone: '+251911223344', sharePercentage: 50, amount: 5000, paidStatus: 'Paid', telegramId: '@hailu_dev' },
        { id: 's2', name: 'አበበ ከበደ', phone: '+251922334455', sharePercentage: 50, amount: 5000, paidStatus: 'Paid', telegramId: '@abebe_k' }
      ]
    },
    {
      id: '2',
      slotNumber: 2,
      totalAmount: 10000,
      status: 'Active',
      subSlots: [
        { id: 's3', name: 'ጫላ ደሳለኝ', phone: '+251933445566', sharePercentage: 100, amount: 10000, paidStatus: 'Pending', telegramId: '@chala_d' }
      ]
    }
  ]);

  // Feature 1: Export Data to CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Slot,Name,Phone,Share %,Amount,Status\n";
    
    slots.forEach(slot => {
      slot.subSlots.forEach(sub => {
        csvContent += `${slot.slotNumber},${sub.name},${sub.phone},${sub.sharePercentage}%,${sub.amount},${sub.paidStatus}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Equb_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("የዕቁብ ዳታ በ CSV ፋይል መልኩ በተሳካ ሁኔታ ኤክስፖርት ሆኗል!");
  };

  // Feature 2: Send Telegram Notification
  const handleSendTelegramAlert = (user: SubSlot) => {
    showNotification(`ለ ${user.name} (${user.telegramId || user.phone}) በቴሌግራም መልዕክት ተልኳል!`);
  };

  // Notification Helper
  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Feature 3: Print Receipt Trigger
  const handlePrint = () => {
    window.print();
  };

  // Filtered slots based on search term
  const filteredSlots = slots.map(slot => ({
    ...slot,
    subSlots: slot.subSlots.filter(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      sub.phone.includes(searchTerm)
    )
  })).filter(slot => slot.subSlots.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Yop Digital Equb Management</h1>
          <p className="text-slate-500 text-sm mt-1">የዲጂታል ዕቁብ ክፍያዎች እና የዕጣ ማውጫ ዳሽቦርድ</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      {/* Search & Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">ጠቅላላ አባላት</p>
            <p className="text-2xl font-bold text-slate-800">120</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><Wallet className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">የተሰበሰበ ካፒታል</p>
            <p className="text-2xl font-bold text-slate-800">1,200,000 ETB</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Trophy className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">የደረሰው/የወጣው ዕጣ</p>
            <p className="text-2xl font-bold text-slate-800">12/24</p>
          </div>
        </div>
      </div>

      {/* Main Slots List & Table */}
      <main className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">የዕቁብ Slots እና የአባላት ዝርዝር</h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text"
              placeholder="በስም ወይም በስልክ ቁጥር ፈልግ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Slot #</th>
                <th className="p-4">የአባል ስም</th>
                <th className="p-4">ድርሻ (%)</th>
                <th className="p-4">ክፍያ (ETB)</th>
                <th className="p-4">ሁኔታ</th>
                <th className="p-4 text-center">እርምጃዎች (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSlots.map((slot) => 
                slot.subSlots.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-700">Slot #{slot.slotNumber}</td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{sub.name}</div>
                      <div className="text-xs text-slate-400">{sub.phone}</div>
                    </td>
                    <td className="p-4 text-slate-600">{sub.sharePercentage}%</td>
                    <td className="p-4 font-semibold text-slate-800">{sub.amount.toLocaleString()} ETB</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        sub.paidStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {sub.paidStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleSendTelegramAlert(sub)}
                          title="በቴሌግራም መልዕክት ላክ"
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => setReceiptData(sub)}
                          title="ደረሰኝ አትም/ተመልከት"
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Payment Receipt Modal */}
      {receiptData && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button 
              onClick={() => setReceiptData(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div id="printable-receipt" className="p-2">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Yop Digital Equb</h3>
                <p className="text-xs text-slate-500">የክፍያ ደረሰኝ (Payment Receipt)</p>
              </div>

              <div className="space-y-3 text-sm border-t border-b border-dashed border-slate-200 py-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">የከፋይ ስም:</span>
                  <span className="font-semibold text-slate-800">{receiptData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ስልክ ቁጥር:</span>
                  <span className="text-slate-800">{receiptData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">የተከፈለ መጠን:</span>
                  <span className="font-bold text-emerald-600">{receiptData.amount.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">የድርሻ መጠን:</span>
                  <span className="text-slate-800">{receiptData.sharePercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ቀን:</span>
                  <span className="text-slate-800">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-3 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all"
                >
                  <Printer className="w-4 h-4" /> ደረሰኝ አትም (Print)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}