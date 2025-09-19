// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import auth from '../redux/auth/authSlice';
import posts from '../redux/posts/postsSlice';
import users from '../redux/users/usersSlice';
import comments from '../redux/comments/commentsSlice';
import presence from '../redux/chat/presenceSlice'; // 👈 NUEVO

export const store = configureStore({
  reducer: { 
    auth,
    posts,
    users,
    comments,
    presence, // 👈
  },
});
