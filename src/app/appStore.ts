import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import postsReducer from '../shared/model/store/postsSlice';
import sourcesReducer from '../shared/model/store/sourcesSlice';
import imageReducer from '../features/ImageUploader/model/imageSlice';
import authReducer from '../features/auth/model/authSlice';
import profileReducer from '../features/profile/model/profileSlice';
import commentsReducer from '../features/comments/model/commentsSlice';
import userReducer from '../entities/users/model/userSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    profile: profileReducer,
    posts: postsReducer,
    images: imageReducer,
    auth: authReducer,
    comments: commentsReducer,
    sources: sourcesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
