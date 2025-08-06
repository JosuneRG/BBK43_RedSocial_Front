import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';

// Recuperar usuario y token desde localStorage
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

// Thunk: Registro
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (error) {
    const message = error.response?.data?.errors
      ? error.response.data.errors.map((e) => e.msg).join(' | ')
      : error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Thunk: Login
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    return await authService.login(userData);
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Thunk: Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  localStorage.removeItem('user');
  localStorage.removeItem('token');
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
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || 'Usuario registrado con éxito';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Error al registrar';
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
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
