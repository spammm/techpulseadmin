import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ISources } from '../../types/sources';
import {
  fetchAllSources,
  createSource,
  deleteSource,
} from '../../api/sourcesApi';

interface SourcesState {
  sources: ISources[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

const initialState: SourcesState = {
  sources: [],
  loading: false,
  error: null,
  loaded: false,
};

export const fetchSourcesThunk = createAsyncThunk(
  'sources/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const sources = await fetchAllSources();
      return sources;
    } catch (error: unknown) {
      console.log('Ошибка при загрузке источников:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('Неизвестная ошибка');
      }
    }
  }
);

export const createSourceThunk = createAsyncThunk(
  'sources/create',
  async (source: ISources, { rejectWithValue }) => {
    try {
      const newSource = await createSource(source);
      return newSource;
    } catch (error: unknown) {
      console.log('Ошибка при создании источника:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('Неизвестная ошибка');
      }
    }
  }
);

export const deleteSourceThunk = createAsyncThunk(
  'sources/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteSource(id);
      return id;
    } catch (error: unknown) {
      console.log('Ошибка при удалении источника:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('Неизвестная ошибка');
      }
    }
  }
);

const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSourcesThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.loaded = false;
    });
    builder.addCase(
      fetchSourcesThunk.fulfilled,
      (state, action: PayloadAction<ISources[]>) => {
        state.loading = false;
        state.sources = action.payload;
        state.loaded = true;
      }
    );
    builder.addCase(fetchSourcesThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.loaded = false;
    });

    builder.addCase(createSourceThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createSourceThunk.fulfilled,
      (state, action: PayloadAction<ISources>) => {
        state.loading = false;
        state.sources.push(action.payload);
      }
    );
    builder.addCase(createSourceThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(deleteSourceThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteSourceThunk.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.sources = state.sources.filter(
          (source) => source?.id !== action.payload
        );
      }
    );
    builder.addCase(deleteSourceThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default sourcesSlice.reducer;
