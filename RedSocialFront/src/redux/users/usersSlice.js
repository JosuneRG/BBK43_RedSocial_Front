// src/redux/users/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import usersService, {
  followUser,
  unfollowUser,
  getMyNetwork,
  getMyLikedPosts,
} from './usersService';

const initialState = {
  me: null,
  searchResults: [],
  isLoading: false,
  error: null,

  network: {
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
  },
  likedPosts: [],
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

// Follow / Unfollow
export const doFollow = createAsyncThunk('users/follow', async (userId, thunkAPI) => {
  try {
    return await followUser(userId); // { message }
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const doUnfollow = createAsyncThunk('users/unfollow', async (userId, thunkAPI) => {
  try {
    return await unfollowUser(userId); // { message }
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const fetchMyNetwork = createAsyncThunk('users/network', async (_, thunkAPI) => {
  try {
    return await getMyNetwork(); // {followers, following, followersCount, followingCount}
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const fetchMyLikedPosts = createAsyncThunk('users/likedPosts', async (_, thunkAPI) => {
  try {
    return await getMyLikedPosts(); // posts[]
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
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

    // network / liked posts
    builder
      .addCase(fetchMyNetwork.fulfilled, (state, action) => {
        state.network = action.payload || state.network;
      })
      .addCase(fetchMyLikedPosts.fulfilled, (state, action) => {
        state.likedPosts = action.payload || [];
      });

    // updateProfile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) state.me = action.payload; // back devuelve user actualizado
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
        if (action.payload.avatar && !action.payload._id) {
          // sólo avatar
          state.me = { ...(state.me || {}), avatar: action.payload.avatar };
        } else {
          // usuario completo
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

    // doFollow / doUnfollow — actualización inmediata del estado
    builder
      .addCase(doFollow.fulfilled, (state, action) => {
        // El servicio no devuelve el usuario seguido; actualizamos por ID mínimo.
        // A efectos del botón, basta con marcar que seguimos a "algo".
        // Si quieres precisión, llama a fetchMyNetwork luego (lo hacemos en el botón).
        // Aquí, si ya tenemos me.following o network.following, añadimos un placeholder.
        const lastTarget = action.meta.arg; // userId seguido
        if (state.me) {
          const arr = Array.isArray(state.me.following) ? state.me.following : [];
          if (!arr.some((id) => String(id) === String(lastTarget))) {
            state.me.following = [...arr, lastTarget];
          }
        }
        if (state.network) {
          const arr = Array.isArray(state.network.following) ? state.network.following : [];
          if (!arr.some((u) => String(u?._id || u) === String(lastTarget))) {
            state.network.following = [...arr, { _id: lastTarget }];
            state.network.followingCount = (state.network.followingCount || 0) + 1;
          }
        }
      })
      .addCase(doUnfollow.fulfilled, (state, action) => {
        const lastTarget = action.meta.arg; // userId dejado de seguir
        if (state.me && Array.isArray(state.me.following)) {
          state.me.following = state.me.following.filter((id) => String(id) !== String(lastTarget));
        }
        if (state.network && Array.isArray(state.network.following)) {
          state.network.following = state.network.following.filter(
            (u) => String(u?._id || u) !== String(lastTarget)
          );
          state.network.followingCount = Math.max(
            0,
            (state.network.followingCount || 0) - 1
          );
        }
      });
  },
});

export const { clearSearch } = usersSlice.actions;
export default usersSlice.reducer;
