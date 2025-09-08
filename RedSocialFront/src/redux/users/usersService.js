import axios from 'axios';

const API = 'http://localhost:3000/users';

const authHeader = () => {
  const token = localStorage.getItem('token'); // string plano
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token. Inicia sesión.');
  }
  const res = await axios.get(`${API}/getProfile`, {
    headers: authHeader(),
  });
  return res.data;
};

const search = async (q) => {
  const res = await axios.get(`${API}/search/${encodeURIComponent(q)}`);
  return res.data;
};

export const getMe = async () => {
  const res = await axios.get(`${API}/getProfile`, { headers: authHeader() });
  return res.data;
};

export const updateMe = async (payload) => {
  const res = await axios.put(`${API}/me`, payload, { headers: authHeader() });
  return res.data;
};

export const changePassword = async (payload) => {
  const res = await axios.put(`${API}/me/password`, payload, { headers: authHeader() });
  return res.data;
};

export const uploadAvatar = async (file) => {
  const fd = new FormData();
  fd.append('avatar', file);
  const res = await axios.put(`${API}/me/avatar`, fd, {
    headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

const usersService = { search, getProfile, getMe, updateMe, changePassword, uploadAvatar };
export default usersService;
