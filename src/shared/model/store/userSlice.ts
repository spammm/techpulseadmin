import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  getUserProfile,
  fetchUsers as fetchUsersApi,
  updateUserProfile as updateUserProfileApi,
  createUser as createUserApi,
} from '../../api/usersApi';
import { IUser } from '../../types/user';

interface UserState {
  users: IUser[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  users: [],
  status: 'idle',
  error: null,
};

export const createUser = createAsyncThunk(
  'user/createUser',
  async (data: { username: string; password: string; role: IUser['role'] }) => {
    const newUser = await createUserApi(data);
    return newUser;
  }
);

export const updateUserProfile = createAsyncThunk<
  IUser,
  { id: string; profileData: Partial<IUser> },
  { rejectValue: { statusCode: number; message: string } }
>('user/updateProfile', async ({ id, profileData }, { rejectWithValue }) => {
  try {
    const updatedUser = await updateUserProfileApi(id, profileData);
    return updatedUser;
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      return rejectWithValue({
        statusCode: error.response.status,
        message: error.response.data.message,
      });
    } else {
      return rejectWithValue({
        statusCode: 500,
        message: 'Неизвестная ошибка',
      });
    }
  }
});

export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (userId: string) => {
    const response = await getUserProfile(userId);
    return response;
  }
);

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  const users = await fetchUsersApi();
  return users;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const user = action.payload;
        const existingUserIndex = state.users.findIndex(
          (u) => u.id === user.id
        );

        if (existingUserIndex !== -1) {
          // Если пользователь уже существует, обновляем его
          state.users[existingUserIndex] = user;
        } else {
          // Если пользователя нет, добавляем его
          state.users.push(user);
        }
      });
  },
});

export default userSlice.reducer;
