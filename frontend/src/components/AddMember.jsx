import React, { useState } from "react";
import { addMember } from "../lib/api";

export default function AddMember({ equbId, slotId, password, onSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (slotId) {
        await addMember(equbId, slotId, password, { name, phone });
      } else {
        await addMember(equbId, { name, phone });
      }
      setName("");
      setPhone("");
      if (onSuccess) onSuccess();
      alert("አባሉ በተሳካ ሁኔታ ተመዝግቧል!");
    } catch (err) {
      setError(typeof err === "string" ? err : "አባልን መመዝገብ አልተቻለም።");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
      <h3 className="font-medium text-gray-900 text-sm">አዲስ አባል መዝግብ</h3>
      {error && <div className="text-xs text-red-600">{error}</div>}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">የአባሉ ስም</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="ሙሉ ስም ያስገቡ"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">ስልክ ቁጥር</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="09..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? "በመመዝገብ ላይ..." : "አባል ጨምር"}
      </button>
    </form>
  );
}