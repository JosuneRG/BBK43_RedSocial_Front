// src/redux/users/usersService.js
import axios from 'axios';

const API = 'http://localhost:3000/users';

// Buscar perfiles por username
const search = async (q) => {
  const res = await axios.get(`${API}/search/${encodeURIComponent(q)}`);
  return res.data; // array de usuarios (sin password)
};

// Perfil del usuario autenticado
const getProfile = async () => {
  const token = JSON.parse(localStorage.getItem('token'));
  const res = await axios.get(`${API}/getProfile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // user sin password
};

// Obtener usuario por id (si añades este endpoint)
// const getById = async (id) => {
//   const res = await axios.get(`${API}/${id}`);
//   return res.data;
// };

const usersService = { search, getProfile };
export default usersService;
