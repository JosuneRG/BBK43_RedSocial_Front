// src/redux/comments/commentsService.js
import axios from 'axios';

const API = 'http://localhost:3000/comments';

// Listar comentarios de un post
const getByPost = async (postId) => {
  const res = await axios.get(`${API}/post/${postId}`);
  return res.data; // array de comments populate user
};

// Crear comentario (auth)
const add = async (postId, content) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const res = await axios.post(
    `${API}/${postId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // { message, comment }
};

// Eliminar comentario (auth; autor o dueño post)
const remove = async (commentId) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const res = await axios.delete(`${API}/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // { message }
};

const commentsService = { getByPost, add, remove };
export default commentsService;
