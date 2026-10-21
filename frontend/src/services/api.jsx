// frontend/src/services/api.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Members APIs
export const fetchMembers = async () => {
  const res = await fetch(`${API_BASE}/api/members`);
  if (!res.ok) throw new Error('የአባላትን መረጃ ማምጣት አልተቻለም');
  return res.json();
};

export const createMember = async (memberData) => {
  const res = await fetch(`${API_BASE}/api/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  if (!res.ok) throw new Error('አባሉን መመዝገብ አልተቻለም');
  return res.json();
};

export const updatePaymentStatus = async (memberId, status) => {
  const res = await fetch(`${API_BASE}/api/members/${memberId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status: status }),
  });
  if (!res.ok) throw new Error('የክፍያ ሁኔታ ማስተካከል አልተቻለም');
  return res.json();
};

export const deleteMember = async (memberId) => {
  const res = await fetch(`${API_BASE}/api/members/${memberId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('አባል መስረዝ አልተቻለም');
  return res.json();
};

// Draw API
export const triggerEqubDraw = async (equbId = 1) => {
  const res = await fetch(`${API_BASE}/api/draw?equb_id=${equbId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('ዕጣ ማውጣት አልተቻለም');
  return res.json();
};

// Fraud & OCR APIs
export const fetchFraudLogs = async () => {
  const res = await fetch(`${API_BASE}/api/fraud-logs`);
  if (!res.ok) throw new Error('የማጭበርበር መዝገቦችን ማምጣት አልተቻለም');
  return res.json();
};

export const scanReceipt = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/ocr/scan`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('OCR ደረሰኝ ማንበብ አልተቻለም');
  return res.json();
};