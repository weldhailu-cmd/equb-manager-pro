import api from './api';

// --- EQUB CORE APIs ---
export const createEqub = async (equbData) => {
  const response = await api.post('/equbs/', equbData);
  return response.data;
};

export const getEqubs = async () => {
  const response = await api.get('/equbs/');
  return response.data;
};

export async function getEqub(id) {
  const response = await api.get(`/equbs/${id}`);
  return response.data;
}

export async function verifyAdmin(equbId, password) {
  const response = await api.post(`/equbs/${equbId}/verify-admin`, { password });
  return response.data;
}

// --- SLOTS & MEMBERS APIs ---
export async function listSlotsPublic(equbId) {
  const response = await api.get(`/equbs/${equbId}/slots/public`);
  return response.data;
}

export async function listSlotsAdmin(equbId, password) {
  const response = await api.get(`/equbs/${equbId}/slots/admin`, {
    headers: { 'x-admin-password': password },
  });
  return response.data;
}

export async function createSlot(equbId, password, data) {
  const response = await api.post(`/equbs/${equbId}/slots`, data, {
    headers: { 'x-admin-password': password },
  });
  return response.data;
}

export async function listMembersPublic(equbId, slotId) {
  const response = await api.get(`/equbs/${equbId}/slots/${slotId}/members/public`);
  return response.data;
}

export async function listMembersAdmin(equbId, slotId, password) {
  const response = await api.get(`/equbs/${equbId}/slots/${slotId}/members/admin`, {
    headers: { 'x-admin-password': password },
  });
  return response.data;
}

export const addMember = async (equbId, slotIdOrData, passwordOrData, optionalData) => {
  if (optionalData !== undefined) {
    const response = await api.post(`/equbs/${equbId}/slots/${slotIdOrData}/members`, optionalData, {
      headers: { 'x-admin-password': passwordOrData },
    });
    return response.data;
  } else {
    const response = await api.post(`/equbs/${equbId}/members/`, slotIdOrData);
    return response.data;
  }
};

export const toggleSlotPayment = async ({ slotId, subSlotId }) => {
  const response = await api.patch(`/slots/${slotId}/sub-slots/${subSlotId}/toggle-payment`);
  return response.data;
};

export const transferOwnership = async (transferData) => {
  const response = await api.post('/slots/transfer', transferData);
  return response.data;
};

// --- DRAWS & LOTTERY APIs ---
export async function runDraw(equbId, password, slotId) {
  const response = await api.post(`/equbs/${equbId}/draw`, { slot_id: slotId }, {
    headers: { 'x-admin-password': password },
  });
  return response.data;
}

export async function listDrawsPublic(equbId) {
  const response = await api.get(`/equbs/${equbId}/draws/public`);
  return response.data;
}

export const drawEqubWinner = async () => {
  const response = await api.post('/draw/winner');
  return response.data;
};

// --- MARKETPLACE APIs ---
export async function getMarketplacePosts() {
  const response = await api.get('/marketplace');
  return response.data;
}

export const listMarketplacePosts = getMarketplacePosts;

export async function createMarketplacePost(postData) {
  const response = await api.post('/marketplace', postData);
  return response.data;
}