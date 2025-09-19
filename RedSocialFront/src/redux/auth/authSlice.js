// src/redux/auth/authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';
import { initSocket, disconnectSocket } from "../../lib/socket";

const userStorage = JSON.parse(localStorage.getItem('user') || 'null');
const tokenStorage = localStorage.getItem('token') || null;

const initialState = {
  user: userStorage,
  token: tokenStorage,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Registro
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Error al registrar');
  }
});

// Login
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {

    const res = await authService.login(userData);
    // 👉 Guardar en localStorage
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    // 👉 Conectar socket con token
    initSocket(res.token);

    return res;
    // return await authService.login(userData); // { message, user, token }
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Credenciales inválidas');
  }
});

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
   try {
    await authService.logout();
    // 👉 Eliminar del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 👉 Desconectar socket
    disconnectSocket();

    return true;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
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
        // Asegura estado limpio
        state.user = null;
        state.token = null;
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
