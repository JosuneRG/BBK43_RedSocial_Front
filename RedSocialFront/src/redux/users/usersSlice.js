// src/redux/users/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import usersService from './usersService';

const initialState = {
  me: null,
  results: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Buscar usuarios por nombre
export const searchUsers = createAsyncThunk('users/search', async (q, thunkAPI) => {
  try {
    return await usersService.search(q);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
});

// Obtener mi perfil (token)
export const getMyProfile = createAsyncThunk('users/me', async (_, thunkAPI) => {
  try {
    return await usersService.getProfile();
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUsers: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    clearResults: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // search
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload || [];
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Error al buscar usuarios';
      })

      // me
      .addCase(getMyProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.me = action.payload || null;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.me = null;
        state.isError = true;
        state.message = action.payload || 'Error al cargar mi perfil';
      });
  },
});

export const { resetUsers, clearResults } = usersSlice.actions;
export default usersSlice.reducer;
