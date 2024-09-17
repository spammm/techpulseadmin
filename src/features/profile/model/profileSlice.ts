import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import {
  getUserProfile,
  updateUserProfile as updateUserProfileApi,
} from '../../../shared/api/usersApi';
import { IUser } from '../../../shared/types/user';

interface ProfileState {
  profile: IUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

type SetFieldPayload = {
  field: keyof IUser;
  value: IUser[keyof IUser];
};

const initialState: ProfileState = {
  profile: null,
  status: 'idle',
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const userProfile = await getUserProfile('me');
      return userProfile;
    } catch (error) {
      console.error('Не удалось загрузить профиль пользователя', error);
      return rejectWithValue('Не удалось загрузить профиль пользователя');
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  IUser,
  { id: string; profileData: Partial<IUser> },
  { rejectValue: { statusCode: number; message: string } }
>('profile/updateProfile', async ({ id, profileData }, { rejectWithValue }) => {
  try {
    const updatedUser = await updateUserProfileApi(id, profileData);
    return updatedUser;
  } catch (error) {
    if (error instanceof AxiosError && error.response && error.response.data) {
      return rejectWithValue({
        statusCode: error.response.status,
        message: error.response.data.message,
      });
    } else {
      return rejectWithValue({
        statusCode: 500,
        message: 'Неизвестная ошибка',
      });
    }
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setField: (state, action: PayloadAction<SetFieldPayload>) => {
      if (state.profile) {
        const { field, value } = action.payload;
        // Проверяем, что значение поля не undefined
        if (Object.prototype.hasOwnProperty.call(state.profile, field)) {
          (state.profile[field] as IUser[keyof IUser]) = value;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || null;
      });
  },
});

export const { setField } = profileSlice.actions;
export default profileSlice.reducer;
