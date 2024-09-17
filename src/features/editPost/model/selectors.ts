import { RootState } from '../../../app/appStore';

export const selectActivePost = (state: RootState) => state.posts.activePost;
