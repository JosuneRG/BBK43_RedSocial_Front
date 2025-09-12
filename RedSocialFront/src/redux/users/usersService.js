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

export const followUser = async (userId) => {
  const res = await axios.post(`${API}/${userId}/follow`, null, { headers: authHeader() });
  return res.data;
};

export const unfollowUser = async (userId) => {
  const res = await axios.post(`${API}/${userId}/unfollow`, null, { headers: authHeader() });
  return res.data;
};

export const getMyNetwork = async () => {
  const res = await axios.get(`${API}/me/network`, { headers: authHeader() });
  return res.data; // {followers, following, followersCount, followingCount}
};

export const getMyLikedPosts = async () => {
  const res = await axios.get(`${API}/me/liked-posts`, { headers: authHeader() });
  return res.data; // array de posts
};

export const requestPasswordReset = async (email) => {
  const res = await axios.post(`${API}/forgot-password`, { email });
  return res.data; // { message, resetLink, token, expiresAt }
};

export const doResetPassword = async ({ token, newPassword }) => {
  const res = await axios.post(`${API}/reset-password`, { token, newPassword });
  return res.data; // { message }
};

const usersService = { search, getProfile, getMe, updateMe, changePassword, uploadAvatar, followUser, unfollowUser, getMyNetwork, getMyLikedPosts };
export default usersService;
