import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import { useDispatch } from 'react-redux';
import postsSlice from './postsSlice';
import imageSlice from './imageSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsSlice,
    images: imageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
