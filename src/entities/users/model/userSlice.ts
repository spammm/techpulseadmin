import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  getUserProfile,
  deleteUser as deleteUserApi,
  fetchUsers as fetchUsersApi,
  createUser as createUserApi,
  updateUserProfile as updateUserProfileApi,
} from '../../../shared/api/usersApi';
import { IUser } from '../../../shared/types/user';

interface UserState {
  users: { [id: string]: IUser };
  selectedUser: IUser | null;
  filteredUsers: IUser[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  disableFilter: 'all' | 'active' | 'disabled';
  userTypeFilter: 'all' | 'clients' | 'users';
}

const initialState: UserState = {
  users: {},
  selectedUser: null,
  filteredUsers: [],
  status: 'idle',
  error: null,
  searchQuery: '',
  disableFilter: 'all',
  userTypeFilter: 'all',
};

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  const users = await fetchUsersApi();
  return users;
});

export const createUser = createAsyncThunk(
  'user/createUser',
  async (data: { username: string; password: string; role: IUser['role'] }) => {
    const newUser = await createUserApi(data);
    return newUser;
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId: number) => {
    await deleteUserApi(userId);
    return userId;
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setDisableFilter: (state, action) => {
      state.disableFilter = action.payload;
    },
    setUserTypeFilter: (state, action) => {
      state.userTypeFilter = action.payload;
      console.log('action', action);
    },
    applyFilters: (state) => {
      let filtered = Object.values(state.users);

      if (state.userTypeFilter === 'clients') {
        filtered = filtered.filter((user) => user.role === 'client');
      } else if (state.userTypeFilter === 'users') {
        filtered = filtered.filter((user) => user.role !== 'client');
      }

      if (state.disableFilter !== 'all') {
        filtered = filtered.filter(
          (user) => user.disable === (state.disableFilter === 'disabled')
        );
      }

      if (state.searchQuery) {
        filtered = filtered.filter(
          (user) =>
            user.username
              ?.toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }

      state.filteredUsers = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        action.payload.forEach((user: IUser) => {
          state.users[user.id] = user;
        });
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        delete state.users[action.payload];
      })
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users[action.payload.id] = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users[action.payload.id] = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const user = action.payload;
        state.users[user.id] = user;
      });
  },
});

export const selectUserById = (state: { users: UserState }, userId: string) =>
  state.users.users[userId];

export const selectFilteredUsers = (state: { users: UserState }) =>
  state.users.filteredUsers;

export const {
  setSearchQuery,
  setDisableFilter,
  setUserTypeFilter,
  applyFilters,
} = userSlice.actions;
export default userSlice.reducer;
