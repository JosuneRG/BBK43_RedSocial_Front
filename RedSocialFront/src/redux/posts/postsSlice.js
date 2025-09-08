// src/redux/posts/postsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postsService from "./postsService";

const initialState = {
  posts: [],
  isLoading: false,
  post: {},
  error: null,
};

export const getAll = createAsyncThunk("posts/getAll", async (_, thunkAPI) => {
  try { return await postsService.getAll(); }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

export const getById = createAsyncThunk("posts/getById", async (id, thunkAPI) => {
  try { return await postsService.getById(id); }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

export const getPostByName = createAsyncThunk("posts/getPostByName", async (name, thunkAPI) => {
  try { return await postsService.getPostByName(name); }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message); }
});

export const updatePost = createAsyncThunk("posts/update", async ({ id, formData }, thunkAPI) => {
  try {
    const token = localStorage.getItem("token"); // 🔧 sin JSON.parse
    return await postsService.update(id, formData, token);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const deletePost = createAsyncThunk("posts/delete", async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem("token"); // 🔧 sin JSON.parse
    return await postsService.remove(id, token);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
});

// 👉 like / unlike automático
export const toggleLike = createAsyncThunk("posts/toggleLike", async (id, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const token = localStorage.getItem("token"); // 🔧 sin JSON.parse

    const current = state.posts.post;
    const authUser = state.auth.user;
    const userId = authUser?._id;

    const likes = (current?.likes || []).map(String);
    const hasLiked = userId ? likes.includes(String(userId)) : false;

    if (hasLiked) {
      return await postsService.unlike(id, token); // -> post actualizado (poblado)
    } else {
      return await postsService.like(id, token);
    }
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.post = {};
      state.posts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAll
      .addCase(getAll.pending, (state) => { state.isLoading = true; })
      .addCase(getAll.fulfilled, (state, action) => {
        state.posts = action.payload || [];
        state.isLoading = false;
      })
      .addCase(getAll.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      })

      // getById
      .addCase(getById.pending, (state) => { state.isLoading = true; })
      .addCase(getById.fulfilled, (state, action) => {
        state.post = action.payload || {};
        state.isLoading = false;
      })
      .addCase(getById.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      })

      // update
      .addCase(updatePost.pending, (state) => { state.isLoading = true; })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload?.post;
        if (updated) {
          state.post = updated;
          state.posts = state.posts.map((p) => p._id === updated._id ? updated : p);
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      })

      // delete
      .addCase(deletePost.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.posts = state.posts.filter((p) => p._id !== id);
        if (state.post?._id === id) state.post = {};
      })

      // 👉 toggleLike
      .addCase(toggleLike.fulfilled, (state, action) => {
        const updated = action.payload; // el back devuelve el post poblado
        if (updated?._id) {
          state.post = updated;
          state.posts = state.posts.map((p) => (p._id === updated._id ? updated : p));
        }
      });
  },
});

export const { reset } = postsSlice.actions;
export default postsSlice.reducer;
