// src/redux/auth/authService.js
import axios from 'axios';

// ⚠️ TU BACK corre en 3000 con rutas /users (según tu server.js)
const API_URL = 'http://localhost:3000/users';

const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    // Opcional: si tu back devuelve { user, token } puedes guardarlos aquí
    if (res.data?.token) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', JSON.stringify(res.data.token));
    }
    return res.data; // { message, user?, token? }
  } catch (err) {
    // Propaga mensaje legible
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Error en registro';
    throw new Error(msg);
  }
};

const login = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData);
    if (res.data) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', JSON.stringify(res.data.token));
    }
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Error en login';
    throw new Error(msg);
  }
};

const logout = async () => {
  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) return;

  try {
    await axios.get(`${API_URL}/logout`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } finally {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};

const authService = { register, login, logout };
export default authService;
