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
