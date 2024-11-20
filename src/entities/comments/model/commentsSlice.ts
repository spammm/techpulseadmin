import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IComment } from '../../../shared/types/comment';
import { api } from '../../../shared/api';

interface CommentsState {
  comments: IComment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    published: 'all' | 'published' | 'unpublished';
    moderated: 'all' | 'moderated' | 'unmoderated';
    searchTerm: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

const initialState: CommentsState = {
  comments: [],
  status: 'idle',
  error: null,
  filters: {
    published: 'all',
    moderated: 'all',
    searchTerm: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (_, { getState }) => {
    const state = getState() as { comments: CommentsState };
    const { filters, pagination } = state.comments;

    const response = await api.get('/comments', {
      params: {
        page: pagination.currentPage,
        published: filters.published,
        moderated: filters.moderated,
        search: filters.searchTerm,
      },
    });

    return response.data;
  }
);

export const updateCommentStatus = createAsyncThunk(
  'comments/updateCommentStatus',
  async (data: { commentId: number; updates: Partial<IComment> }) => {
    const response = await api.patch(
      `/comments/${data.commentId}`,
      data.updates
    );
    return response.data;
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setPublishedFilter(
      state,
      action: PayloadAction<'all' | 'published' | 'unpublished'>
    ) {
      state.filters.published = action.payload;
    },
    setModeratedFilter(
      state,
      action: PayloadAction<'all' | 'moderated' | 'unmoderated'>
    ) {
      state.filters.moderated = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.filters.searchTerm = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload;
        state.pagination.totalPages = 1;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(updateCommentStatus.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment.id === action.payload.id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      });
  },
});

export const {
  setPublishedFilter,
  setModeratedFilter,
  setSearchTerm,
  setPage,
} = commentsSlice.actions;

export default commentsSlice.reducer;
