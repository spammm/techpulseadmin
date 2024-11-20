import { IUser } from '../../../shared/types';

export interface UserState {
  users: { [id: string]: IUser };
  selectedUser: IUser | null;
  filteredUsers: IUser[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  disableFilter: 'all' | 'active' | 'disabled';
  userTypeFilter: 'all' | 'clients' | 'users';
}
