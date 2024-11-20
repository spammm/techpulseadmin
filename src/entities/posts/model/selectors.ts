import type { RootState } from '../../../shared/model';
// Edit Post Selectors
export const selectActivePost = (state: RootState) => state.posts.activePost;
export const selectCurrentUser = (state: RootState) => state.profile.profile;

// Post List Selectors
export const selectPosts = (state: RootState) => state.posts.posts;
export const selectPostsStatus = (state: RootState) => state.posts.status;
export const selectPostStatus = (state: RootState) =>
  state.posts.activePostStatus;
export const selectPostsError = (state: RootState) => state.posts.error;
export const selectPostsFilters = (state: RootState) => state.posts.filters;
export const selectPostsPagination = (state: RootState) =>
  state.posts.pagination;
export const selectPostsUser = (state: RootState) => state.profile.profile;
