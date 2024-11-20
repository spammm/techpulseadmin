import { RootState } from '../../../shared/model';

// Users list
export const selectUserById = (state: RootState, userId: string) =>
  state.users.users[userId];
export const selectFilteredUsers = (state: RootState) =>
  state.users.filteredUsers;
export const selectUsersTypeFilter = (state: RootState) =>
  state.users.userTypeFilter;
export const selectUsersSearchQuery = (state: RootState) =>
  state.users.searchQuery;
export const selectUsersDisableFilter = (state: RootState) =>
  state.users.disableFilter;

// Users profile
export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectUsersError = (state: RootState) => state.users.error;
