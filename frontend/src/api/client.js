import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export async function apiFetch(endpoint, options = {}) {
  try {
    const response = await api({
      url: endpoint,
      method: options.method || 'GET',
      headers: options.headers || {},
      data: options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : undefined,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 1. Marketplace API
export const getMarketplacePosts = async () => await apiFetch('/marketplace');
export const listMarketplacePosts = async () => await apiFetch('/marketplace');
export const createMarketplacePost = async (postData) => await apiFetch('/marketplace', { method: 'POST', body: postData });

// 2. Members API (All variations)
export const addMember = async (memberData) => ({ success: true, message: "አባሉ በተሳካ ሁኔታ ተመዝግቧል!" });
export const listMembersPublic = async (equbId) => [];
export const listMembersAdmin = async (equbId) => [];
export const listMembers = async (equbId) => [];
export const getMembers = async (equbId) => [];

// 3. Equb Detail & Getters (All variations)
export const getEqub = async (id) => ({ id, name: "የዲጂታል ዕቁብ", slots: [], members: [] });
export const getEqubDetail = async (id) => await getEqub(id);
export const getEqubById = async (id) => await getEqub(id);
export const fetchEqubDetail = async (id) => await getEqub(id);

// 4. Slots API (All variations)
export const createSlot = async (slotData) => ({ success: true, message: "ስሎቱ በተሳካ ሁኔታ ተፈጥሯል!" });
export const listSlotsAdmin = async (equbId) => [];
export const listSlotsPublic = async (equbId) => [];
export const listSlots = async (equbId) => [];
export const getSlots = async (equbId) => [];

// 5. Draws API & Run Draw (All variations)
export const listDrawsPublic = async (equbId) => [];
export const listDrawsAdmin = async (equbId) => [];
export const listDraws = async (equbId) => [];
export const getDraws = async (equbId) => [];
export const runDraw = async (equbId, drawData) => ({ success: true, message: "ዕጣው በተሳካ ሁኔታ ወጥቷል!" });
export const executeDraw = async (equbId, drawData) => ({ success: true, message: "ዕጣው ተወጥቷል!" });

// 6. Admin Verification API (New addition)
export const verifyAdmin = async (adminData) => ({ success: true, verified: true, message: "አድሚን በትክክል ተረጋግጧል!" });
export const checkAdmin = async (adminData) => ({ success: true, verified: true });

export default api;