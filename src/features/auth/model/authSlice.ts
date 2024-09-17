import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { loginUser, logoutUser, refreshAccessToken } from '../api/authApi';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { accessToken, refreshToken } = await loginUser(username, password);
      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const refreshAccess = createAsyncThunk(
  'auth/refreshAccess',
  async (_, { rejectWithValue }) => {
    try {
      const newToken = await refreshAccessToken();
      return newToken;
    } catch (error) {
      console.error('Не удалось обновить токен: ', error);
      return rejectWithValue('Не удалось обновить токен');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(refreshAccess.fulfilled, (state, action) => {
        state.token = action.payload;
        localStorage.setItem('token', action.payload);
      })
      .addCase(refreshAccess.rejected, (state) => {
        state.token = null;
        state.refreshToken = null;
        logoutUser();
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
