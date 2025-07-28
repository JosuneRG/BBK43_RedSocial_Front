import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';

// Recuperar usuario y token desde localStorage
const userStorage = JSON.parse(localStorage.getItem('user'));
const tokenStorage = JSON.parse(localStorage.getItem('token'));

const initialState = {
  // user: userStorage ? userStorage : null,
  // token: tokenStorage ? tokenStorage : null,
  user: user || null,
  token: token || null,
  isError: false,
  isSuccess: false,
  message: '',
};

// Thunk: Registro
export const register = createAsyncThunk('auth/register',
  async (user, thunkAPI) => {
    try 
    {
      return await authService.register(user)
    } 
    catch (error) 
    {
      const message = error.response.data.errors.map((error) => `${error.msg} | `)
      
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Thunk: Login
export const login = createAsyncThunk('auth/login', async (userData) => {
  try 
  {
    return await authService.login(user)
  } 
  catch (error) 
  {
    const message = error.response.data.error
    return thunkAPI.rejectWithValue(message)
  }
});

// Thunk: Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    return await authService.logout();
  } catch (error) {
    console.error(error);
  }
});

// Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isSuccess = true
        state.message = action.payload.message
      })

      .addCase(register.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })

      .addCase(login.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })

      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isSuccess = true
        state.message = action.payload.message
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
      })
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
