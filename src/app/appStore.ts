import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from '../shared/model/store/userSlice';
import postsReducer from '../shared/model/store/postsSlice';
import imageReducer from '../entities/ImageUploader/model/imageSlice';
import authReducer from '../features/auth/model/authSlice';
import profileReducer from '../features/profile/model/profileSlice';
import commentsReducer from '../features/comments/model/commentsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
    posts: postsReducer,
    images: imageReducer,
    auth: authReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
