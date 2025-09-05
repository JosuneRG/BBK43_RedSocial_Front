// src/redux/auth/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';

const userStorage = JSON.parse(localStorage.getItem('user'));
const tokenStorage = JSON.parse(localStorage.getItem('token'));

const initialState = {
  user: userStorage || null,
  token: tokenStorage || null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Registro
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user); // { message, user?, token? }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Login
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    return await authService.login(userData); // { message, user, token }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // si tu back devuelve user y token, podrías guardarlos aquí
        // state.user = action.payload.user || null;
        // state.token = action.payload.token || null;
        state.message = action.payload?.message || 'Usuario registrado con éxito';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Error al registrar';
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message || 'Inicio de sesión correcto';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Credenciales inválidas';
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
