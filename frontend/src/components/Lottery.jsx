import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function Lottery({ equbId }) {
  const [winners, setWinners] = useState([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [drawDate, setDrawDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (equbId) {
      fetchWinners();
    }
  }, [equbId]);

  const fetchWinners = async () => {
    try {
      const res = await API.get(`/equbs/${equbId}/winners/`);
      setWinners(res.data);
      if (res.data.length > 0) {
        setRoundNumber(res.data.length + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDraw = async () => {
    if (!equbId) {
      setMessage("እባክዎ መጀመሪያ እቁብ ይምረጡ።");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await API.post(`/equbs/${equbId}/draw/`, { 
        round_number: parseInt(roundNumber),
        draw_date: drawDate
      });
      
      const winnerName = res.data.winner?.full_name || "ተሳታፊ";
      setMessage(`ዕጣው በተሳካ ሁኔታ ወጥቷል! አሸናፊ: ${winnerName}`);
      fetchWinners();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "ዕጣ ማውጣት አልተቻለም።");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-blue-900">የዕጣ ማውጫ (Lottery Draw)</h3>
          <p className="text-sm text-gray-500">ለዚህ እቁብ የድል ማጣሪያ እና አሸናፊዎች አስተዳደር</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="date"
            value={drawDate}
            onChange={(e) => setDrawDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm outline-none"
          />
          <button
            onClick={handleDraw}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 shadow text-sm whitespace-nowrap"
          >
            {loading ? "እየወጣ ነው..." : `ዙር ${roundNumber} ዕጣ አውጣ`}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-4 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-sm">
          {message}
        </div>
      )}

      <h4 className="text-md font-semibold text-gray-800 mb-3">ያለፉ አሸናፊዎች ዝርዝር</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
              <th className="p-3 border-b">ዙር</th>
              <th className="p-3 border-b">አሸናፊ ስም</th>
              <th className="p-3 border-b">ስልክ ቁጥር</th>
              <th className="p-3 border-b">ቀን</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {winners.length > 0 ? (
              winners.map((win, idx) => (
                <tr key={win.id || idx} className="hover:bg-gray-50 border-b">
                  <td className="p-3 font-medium text-gray-900">ዙር {win.round_number}</td>
                  <td className="p-3 font-semibold text-blue-900">{win.full_name}</td>
                  <td className="p-3">{win.phone_number || "-"}</td>
                  <td className="p-3">{win.draw_date || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  እስካሁን የወጣ አሸናፊ የለም።
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}