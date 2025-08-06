import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users';

// Registrar usuario
const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

// Iniciar sesión
const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);

  if (res.data?.user && res.data?.token) {
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', JSON.stringify(res.data.token));
  }

  return res.data;
};

// Cerrar sesión
const logout = async () => {
  const token = JSON.parse(localStorage.getItem('token'));

  if (!token) return;

  await axios.delete(`${API_URL}/logout`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
