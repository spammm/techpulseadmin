import { RootState } from './hooks';

export const selectRole = (state: RootState) => state.profile.profile?.role;
