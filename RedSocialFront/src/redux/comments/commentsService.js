// src/redux/comments/commentsService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/comments';

export const fetchCommentsByPost = async (postId) => {
  const res = await axios.get(`${API_URL}/post/${postId}`);
  return res.data;
};

export const addComment = async ({ postId, content, token }) => {
  const res = await axios.post(
    `${API_URL}/${postId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.comment;
};

export const deleteComment = async ({ commentId, token }) => {
  const res = await axios.delete(`${API_URL}/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 👇 NUEVO: actualizar comentario
export const updateComment = async ({ commentId, content, token }) => {
  const res = await axios.put(
    `${API_URL}/${commentId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  // devuelve el comentario actualizado (populado)
  return res.data.comment;
};

export const likeComment = async (commentId) => {
  const res = await axios.post(`${API}/${commentId}/like`, null, { headers: authHeader() });
  return res.data;
};

export const unlikeComment = async (commentId) => {
  const res = await axios.post(`${API}/${commentId}/unlike`, null, { headers: authHeader() });
  return res.data;
};
