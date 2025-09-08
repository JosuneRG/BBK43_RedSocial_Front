// src/redux/comments/commentsSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCommentsByPost, addComment, deleteComment } from './commentsService';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

export const getComments = createAsyncThunk(
  'comments/getByPost',
  async (postId, thunkAPI) => {
    try {
      return await fetchCommentsByPost(postId);
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/create',
  async ({ postId, content }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token'); // 🔧 sin JSON.parse
      return await addComment({ postId, content, token });
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const removeComment = createAsyncThunk(
  'comments/remove',
  async (commentId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token'); // 🔧 sin JSON.parse
      await deleteComment({ commentId, token });
      return commentId;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    resetComments: (state) => {
      state.items = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get
      .addCase(getComments.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(getComments.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload || []; })
      .addCase(getComments.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      // create
      .addCase(createComment.fulfilled, (s, a) => {
        if (a.payload) s.items.unshift(a.payload);
      })

      // remove
      .addCase(removeComment.fulfilled, (s, a) => {
        s.items = s.items.filter(c => c._id !== a.payload);
      });
  },
});

export const { resetComments } = commentsSlice.actions;
export default commentsSlice.reducer;
