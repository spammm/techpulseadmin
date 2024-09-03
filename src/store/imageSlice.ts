import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchImagesByPostId,
  uploadImage,
  updateImage,
} from '../api/imagesApi';
import { IPostImage } from '../types/image';

interface ImageState {
  images: IPostImage[];
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  images: [],
  loading: false,
  error: null,
};

/**
 * Загрузка списка изображений для поста.
 * @param postId - Идентификатор поста.
 * @returns Массив изображений, связанных с постом.
 */
export const loadImages = createAsyncThunk(
  'images/loadImages',
  async (postId: number, { rejectWithValue }) => {
    try {
      return await fetchImagesByPostId(postId);
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
      return rejectWithValue('Не удалось загрузить изображения');
    }
  }
);

/**
 * Загрузка нового изображения на сервер.
 * @param file - Файл изображения для загрузки.
 * @param postId - Идентификатор поста.
 * @returns Данные о загруженном изображении.
 */
export const uploadImageThunk = createAsyncThunk(
  'images/uploadImage',
  async (
    { file, postId }: { file: File; postId: number | undefined },
    { rejectWithValue }
  ) => {
    try {
      return await uploadImage(file, postId);
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
      return rejectWithValue('Ошибка загрузки изображения');
    }
  }
);

/**
 * Обновление информации об изображении.
 * @param imageId - Идентификатор изображения.
 * @param updatedData - Обновленные данные для изображения.
 * @returns Объект с обновленным изображением.
 */
export const updateImageThunk = createAsyncThunk(
  'images/updateImage',
  async (
    {
      imageId,
      updatedData,
    }: { imageId: number; updatedData: Partial<IPostImage> },
    { rejectWithValue }
  ) => {
    try {
      await updateImage(imageId, updatedData);
      return { imageId, updatedData };
    } catch (error) {
      console.error('Ошибка обновления изображения:', error);
      return rejectWithValue('Ошибка обновления изображения');
    }
  }
);

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    clearImages(state) {
      state.images = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadImages.fulfilled,
        (state, action: PayloadAction<IPostImage[]>) => {
          state.images = action.payload;
          state.loading = false;
        }
      )
      .addCase(loadImages.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Не удалось загрузить изображения';
      })
      .addCase(
        uploadImageThunk.fulfilled,
        (state, action: PayloadAction<IPostImage>) => {
          state.images.push(action.payload);
        }
      )
      .addCase(updateImageThunk.fulfilled, (state, action) => {
        const { imageId, updatedData } = action.payload;
        const imageIndex = state.images.findIndex((img) => img.id === imageId);
        if (imageIndex !== -1) {
          state.images[imageIndex] = {
            ...state.images[imageIndex],
            ...updatedData,
          };
        }
      });
  },
});

export const { clearImages } = imageSlice.actions;

export default imageSlice.reducer;
