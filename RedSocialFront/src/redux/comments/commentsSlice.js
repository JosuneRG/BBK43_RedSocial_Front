// src/redux/comments/commentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentsService from './commentsService';

const initialState = {
  items: [],       // comentarios del post actual
  isLoading: false,
  isError: false,
  message: '',
};

// Thunks
export const fetchComments = createAsyncThunk('comments/fetchByPost', async (postId, thunkAPI) => {
  try {
    return await commentsService.getByPost(postId);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const addComment = createAsyncThunk('comments/add', async ({ postId, content }, thunkAPI) => {
  try {
    const data = await commentsService.add(postId, content);
    return data.comment;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const deleteComment = createAsyncThunk('comments/delete', async (commentId, thunkAPI) => {
  try {
    await commentsService.remove(commentId);
    return commentId;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    resetComments: (state) => {
      state.items = [];
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(addComment.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload);
      });
  },
});

export const { resetComments } = commentsSlice.actions;
export default commentsSlice.reducer;
