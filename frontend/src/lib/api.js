// ============================================
// ProvinceApp — API Client
// All backend calls go through here
// Change VITE_API_URL in .env to switch environments
// ============================================
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('province_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 (token expired) globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('province_token');
      localStorage.removeItem('province_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ===== AUTH =====
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ===== RESTAURANTS =====
export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
};

// ===== MENU =====
export const menuAPI = {
  getByRestaurant: (restaurantId) => api.get(`/menu/${restaurantId}`),
};

// ===== ORDERS =====
export const orderAPI = {
  place: (data) => api.post('/orders', data),
  myOrders: () => api.get('/orders/my'),
};

// ===== ACADEMICS =====
export const academicsAPI = {
  getCourses: (instId = 'lpu') => api.get('/academics/courses', { params: { inst_id: instId } }),
  getSubjects: (courseId, sem) => api.get(`/academics/courses/${courseId}/subjects`, { params: { sem } }),
  getResources: (chapterId) => api.get(`/academics/resources/${chapterId}`),
};

// ===== PG =====
export const pgAPI = {
  getAll: (params) => api.get('/pg', { params }),
};

// ===== CLUBS =====
export const clubsAPI = {
  getAll: (params) => api.get('/clubs', { params }),
  join: (clubId) => api.post(`/clubs/${clubId}/join`),
};

// ===== CONFESSION =====
export const confessionAPI = {
  getAll: (instId = 'lpu', page = 1) => api.get('/confession', { params: { inst_id: instId, page } }),
  post: (text, instId = 'lpu') => api.post('/confession', { text, inst_id: instId }),
  react: (id, type) => api.post(`/confession/${id}/react`, { type }),
};

// ===== DISCUSSION =====
export const discussionAPI = {
  getAll: (params) => api.get('/discussion', { params }),
  post: (data) => api.post('/discussion', data),
  vote: (id, delta) => api.post(`/discussion/${id}/vote`, { delta }),
};

// ===== LOST & FOUND =====
export const lostFoundAPI = {
  getAll: (params) => api.get('/lostfound', { params }),
  post: (data) => api.post('/lostfound', data),
  resolve: (id) => api.patch(`/lostfound/${id}/resolve`),
};

// ===== FEEDBACK =====
export const feedbackAPI = {
  submit: (data) => api.post('/feedback', data),
};

// ===== CHAT =====
export const chatAPI = {
  getMessages: (instId = 'lpu') => api.get(`/chat/${instId}`),
  send: (data) => api.post('/chat', data),
};

// ===== MOCK TESTS =====
export const mockTestAPI = {
  getAll: (params) => api.get('/mocktest', { params }),
};

// ===== FAQ =====
export const faqAPI = {
  getAll: (params) => api.get('/faq', { params }),
};

// ===== ANNOUNCEMENTS =====
export const announcementAPI = {
  getAll: (instId = 'lpu') => api.get('/announcements', { params: { inst_id: instId } }),
};

export default api;
