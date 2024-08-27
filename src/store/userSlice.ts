import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, logoutUser } from '../api/authApi';
import {
  getUserProfile,
  fetchUsers as fetchUsersApi,
  updateUserProfile as updateUserProfileApi,
  createUser as createUserApi, // Импортируем API для создания пользователя
} from '../api/usersApi';
import { IUser } from '../types/user';

interface UserState {
  profile: IUser | null;
  users: IUser[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  users: [],
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'user/login',
  async ({ username, password }: { username: string; password: string }) => {
    const { accessToken } = await loginUser(username, password);
    localStorage.setItem('token', accessToken);

    const userProfile = await getUserProfile('me');
    return userProfile;
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (data: { username: string; password: string; role: IUser['role'] }) => {
    const newUser = await createUserApi(data);
    return newUser;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: { id: string; profileData: Partial<IUser> }) => {
    const { id, profileData } = data;
    const updatedProfile = await updateUserProfileApi(id, profileData);
    return updatedProfile;
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async () => {
    const userProfile = await getUserProfile('me');
    return userProfile;
  }
);

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  const users = await fetchUsersApi();
  return users;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.profile = null;
      logoutUser();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.profile?.id === action.payload.id) {
          state.profile = action.payload;
        }
        const userIndex = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.users.length) state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
