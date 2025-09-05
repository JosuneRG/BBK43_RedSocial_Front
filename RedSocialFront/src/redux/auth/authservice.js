import axios from 'axios';

// 👇 Asegúrate que este puerto es el del backend
const API_URL = 'http://localhost:3000/users';

// Registrar usuario (ahora el back devuelve { user, token })
const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  if (res.data?.token) {
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', JSON.stringify(res.data.token));
  }
  return res.data;
};

// Iniciar sesión
const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  if (res.data) {
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', JSON.stringify(res.data.token));
  }
  return res.data;
};

// Cerrar sesión
const logout = async () => {
  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) return;

  await axios.get(`${API_URL}/logout`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const authService = { register, login, logout };
export default authService;
