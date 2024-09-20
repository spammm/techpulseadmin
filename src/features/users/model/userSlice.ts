import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteUser as deleteUserApi,
  fetchUsers as fetchUsersApi,
} from '../../../shared/api/usersApi';
import { IUser } from '../../../shared/types/user';

interface UserState {
  users: IUser[];
  filteredUsers: IUser[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  disableFilter: boolean | 'all';
  userTypeFilter: 'all' | 'client' | 'nonClient';
}

const initialState: UserState = {
  users: [],
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

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId: number) => {
    await deleteUserApi(userId);
    return userId;
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
    },
    applyFilters: (state) => {
      let filtered = state.users;

      if (state.userTypeFilter === 'client') {
        filtered = filtered.filter((user) => user.role === 'client');
      } else if (state.userTypeFilter === 'nonClient') {
        filtered = filtered.filter((user) => user.role !== 'client');
      }

      if (state.disableFilter !== 'all') {
        filtered = filtered.filter(
          (user) => user.disable === state.disableFilter
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
        state.users = action.payload;
        state.filteredUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.filteredUsers = state.filteredUsers.filter(
          (user) => user.id !== action.payload
        );
      });
  },
});

export const {
  setSearchQuery,
  setDisableFilter,
  setUserTypeFilter,
  applyFilters,
} = userSlice.actions;
export default userSlice.reducer;
