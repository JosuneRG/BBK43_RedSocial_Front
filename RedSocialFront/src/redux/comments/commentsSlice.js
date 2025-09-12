// src/redux/comments/commentsSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchCommentsByPost,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from './commentsService';

const initialState = { items: [], isLoading: false, error: null };

export const getComments = createAsyncThunk('comments/get', async (postId, thunkAPI) => {
  try { return await fetchCommentsByPost(postId); }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

export const createComment = createAsyncThunk('comments/create', async ({ postId, content }, thunkAPI) => {
  try { return await addComment({ postId, content }); }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

export const editComment = createAsyncThunk(
  'comments/update',
  async ({ commentId, content }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token'); // guardado en string
      return await updateComment({ commentId, content, token });
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const removeComment = createAsyncThunk('comments/remove', async (commentId, thunkAPI) => {
  try { return await deleteComment(commentId); }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

export const toggleCommentLike = createAsyncThunk('comments/toggleLike', async ({ commentId, hasLiked }, thunkAPI) => {
  try { return hasLiked ? await unlikeComment(commentId) : await likeComment(commentId); }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

const slice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    resetComments: (s) => { s.items = []; s.isLoading = false; s.error = null; },
  },
  extraReducers: (b) => {
    b
      .addCase(getComments.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(getComments.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload || []; })
      .addCase(getComments.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      .addCase(createComment.fulfilled, (s, a) => { if (a.payload) s.items.unshift(a.payload); })
      .addCase(editComment.fulfilled, (s, a) => {
        const upd = a.payload; // comentario actualizado
        if (!upd?._id) return;
        s.items = s.items.map(c => (c._id === upd._id ? upd : c));
      })
      .addCase(removeComment.fulfilled, (s, a) => {
        s.items = s.items.filter(i => i._id !== a.payload);
      })
      .addCase(toggleCommentLike.fulfilled, (s, a) => {
        const c = a.payload;
        s.items = s.items.map(i => i._id === c._id ? c : i);
      });
  },
});

export const { resetComments } = slice.actions;
export default slice.reducer;
