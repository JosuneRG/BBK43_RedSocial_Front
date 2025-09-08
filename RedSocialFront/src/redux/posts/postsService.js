// src/redux/posts/postsService.js
import axios from "axios";

const API_URL = "http://localhost:3000";

const getAll = async () => {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data;
};

const getById = async (id) => {
  const res = await axios.get(`${API_URL}/posts/${id}`);
  return res.data;
};

const getPostByName = async (postTitle) => {
  const res = await axios.get(`${API_URL}/posts/search/${postTitle}`);
  return res.data;
};

const update = async (id, formData, token) => {
  const res = await axios.put(`${API_URL}/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // { message, post }
};

const remove = async (id, token) => {
  const res = await axios.delete(`${API_URL}/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 👉 Like / Unlike: devuelven el post actualizado (poblado)
const like = async (id, token) => {
  const res = await axios.post(`${API_URL}/posts/${id}/like`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const unlike = async (id, token) => {
  const res = await axios.post(`${API_URL}/posts/${id}/unlike`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const postsService = {
  getAll,
  getById,
  getPostByName,
  update,
  remove,
  like,
  unlike,
};

export default postsService;
