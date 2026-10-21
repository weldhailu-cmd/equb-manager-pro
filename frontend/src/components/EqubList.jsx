import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function EqubList({ onSelectEqub }) {
  const [equbs, setEqubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [activeEqub, setActiveEqub] = useState(null);
  const [password, setPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchEqubs();
  }, []);

  const fetchEqubs = async () => {
    try {
      setLoading(true);
      const response = await API.get("/equbs/");
      setEqubs(response.data);
    } catch (err) {
      console.error(err);
      setError("የእቁብ ዝርዝሮችን ማምጣት አልተቻለም።");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (eq) => {
    setActiveEqub(eq);
    setPassword("");
    setModalError("");
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    if (!activeEqub) return;

    try {
      setChecking(true);
      setModalError("");
      await API.post(`/equbs/${activeEqub.id}/verify/`, { password });
      
      onSelectEqub(activeEqub);
      setActiveEqub(null);
    } catch (err) {
      setModalError(err.response?.data?.detail || "የይለፍ ቃል ስህተት ነው!");
    } finally {
      setChecking(false);
    }
  };

  const handleDeleteEqub = async (e, equbId) => {
    e.stopPropagation();
    if (!window.confirm("ይህን እቁብ እና የተያያዙ መረጃዎችን ሙሉ በሙሉ ማጥፋት ትፈልጋለህ?")) {
      return;
    }

    try {
      await API.delete(`/equbs/${equbId}/`);
      setEqubs(equbs.filter((eq) => eq.id !== equbId));
    } catch (err) {
      console.error(err);
      alert("እቁቡን ማጥፋት አልተቻለም።");
    }
  };

  if (loading) return <div className="text-center py-6 text-gray-500">እየተጫነ ነው...</div>;
  if (error) return <div className="text-center py-6 text-red-500">{error}</div>;

  return (
    <div className="mt-8 relative">
      <h3 className="text-xl font-bold text-gray-800 mb-4">የተፈጠሩ እቁቦች ዝርዝር ({equbs.length})</h3>
      
      {equbs.length === 0 ? (
        <p className="text-gray-400 text-sm">እስካሁን የተፈጠረ እቁብ የለም።</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {equbs.map((eq) => (
            <div
              key={eq.id}
              onClick={() => handleCardClick(eq)}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer relative flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-emerald-800">{eq.name}</h4>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteEqub(e, eq.id)}
                    className="text-red-500 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition z-10 shadow-sm"
                    title="እቁብ አጥፋ"
                  >
                    🗑️
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-1">📍 ከተማ: {eq.address_city}</p>
                <p className="text-sm text-gray-500 mb-4">💳 ዓይነት: {eq.service_fee_type}</p>
              </div>

              <button className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-medium py-2 rounded-lg transition text-sm">
                እቁብን ክፈት / 🔒 ቆልፍ
              </button>
            </div>
          ))}
        </div>
      )}

      {activeEqub && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                🔒
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{activeEqub.name}</h3>
                <p className="text-xs text-gray-500">Enter the Equb password / የእቁብ የይለፍ ቃል ያስገቡ</p>
              </div>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-xs font-medium">
                {modalError}
              </div>
            )}

            <form onSubmit={handleVerifyPassword}>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="የይለፍ ቃል ያስገቡ..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  autoFocus
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveEqub(null)}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition text-sm"
                >
                  ሰርዝ (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={checking}
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition text-sm shadow-md disabled:bg-gray-400"
                >
                  {checking ? "እየመረመረ ነው..." : "ክፈት (Open)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}