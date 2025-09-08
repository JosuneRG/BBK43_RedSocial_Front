import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import usersService from './usersService';

const initialState = {
  me: null,
  searchResults: [],
  isLoading: false,
  error: null,
};

/* ============ THUNKS ============ */

// Perfil del usuario autenticado
export const getMyProfile = createAsyncThunk('users/me', async (_, thunkAPI) => {
  try {
    return await usersService.getProfile(); // GET /users/getProfile
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Actualizar datos básicos (username, email, bio…)
export const updateProfile = createAsyncThunk('users/update', async (payload, thunkAPI) => {
  try {
    return await usersService.updateMe(payload); // PUT /users/me
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Cambiar contraseña
export const updatePassword = createAsyncThunk('users/password', async (payload, thunkAPI) => {
  try {
    return await usersService.changePassword(payload); // PUT /users/me/password
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Subir avatar
export const updateAvatar = createAsyncThunk('users/avatar', async (file, thunkAPI) => {
  try {
    return await usersService.uploadAvatar(file); // PUT /users/me/avatar
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Buscar perfiles por username
export const searchUsers = createAsyncThunk('users/search', async (q, thunkAPI) => {
  try {
    return await usersService.search(q); // GET /users/search/:q
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

/* ============ SLICE ============ */

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSearch(state) {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // getMyProfile
    builder
      .addCase(getMyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.me = action.payload || null;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error al cargar perfil';
        state.me = null;
      });

    // updateProfile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) state.me = action.payload; // el back devuelve user actualizado
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error al actualizar perfil';
      });

    // updatePassword
    builder
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error al cambiar contraseña';
      });

    // updateAvatar
    builder
      .addCase(updateAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!action.payload) return;
        // Si el back devolvió usuario completo, úsalo; si sólo avatar, actualiza campo
        if (action.payload.avatar && !action.payload._id) {
          state.me = { ...(state.me || {}), avatar: action.payload.avatar };
        } else {
          state.me = action.payload;
        }
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error al subir avatar';
      });

    // searchUsers
    builder
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error buscando usuarios';
      });
  },
});

export const { clearSearch } = usersSlice.actions;
export default usersSlice.reducer;
