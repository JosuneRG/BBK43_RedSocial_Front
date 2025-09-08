import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

// Al cargar la app, si hay token en localStorage, fija el header por defecto
const existingToken = localStorage.getItem('token');
if (existingToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}

const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  if (res.data?.token) {
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token); // string plano
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  }
  return res.data;
};

const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  if (res.data?.token) {
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token); // string plano
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  }
  return res.data;
};

const logout = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await axios.get(`${API_URL}/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {}
  }
  delete axios.defaults.headers.common['Authorization'];
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const authService = { register, login, logout };
export default authService;
