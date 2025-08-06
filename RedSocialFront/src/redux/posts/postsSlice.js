import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postsService from "./postsService";

const initialState = {
  posts: [],
  isLoading: false,
  post: {},
};

export const getAll = createAsyncThunk("posts/getAll", async (_, thunkAPI) => {
  try {
    return await postsService.getAll();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getById = createAsyncThunk("posts/getById", async (id, thunkAPI) => {
  try {
    return await postsService.getById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getPostByName = createAsyncThunk("posts/getPostByName", async (postName, thunkAPI) => {
  try {
    return await postsService.getPostByName(postName);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAll.fulfilled, (state, action) => {
        state.posts = action.payload || [];
        state.isLoading = false;
      })
      .addCase(getAll.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getById.fulfilled, (state, action) => {
        state.post = action.payload || {};
        state.isLoading = false;
      })

      .addCase(getPostByName.fulfilled, (state, action) => {
        state.posts = action.payload || [];
        state.isLoading = false;
      });
  },
});

export const { reset } = postsSlice.actions;
export default postsSlice.reducer;
