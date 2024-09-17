import { RootState } from '../../../app/appStore';

export const selectUserProfile = (state: RootState) => state.profile.profile;
