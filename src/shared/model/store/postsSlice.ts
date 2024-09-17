import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchPosts,
  fetchPostById,
  fetchPostByUrl,
  createPost,
  updatePost,
  deletePost,
} from '../../api/postsApi';
import { IPost } from '../../types/post';

interface PostsState {
  posts: IPost[];
  activePost: IPost | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  filters: {
    search: string;
    sortBy: string;
    tags: string[];
    author?: string;
    published?: 'all' | 'published' | 'unpublished';
  };
}

const initialState: PostsState = {
  posts: [],
  activePost: null,
  status: 'idle',
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
  filters: {
    search: '',
    published: 'all',
    sortBy: 'createdAt',
    tags: [],
  },
};

export const loadPostByUrl = createAsyncThunk(
  'posts/loadPostByUrl',
  async (url: string) => {
    const response = await fetchPostByUrl(url);
    return response;
  }
);

export const loadPosts = createAsyncThunk(
  'posts/loadPosts',
  async (params: { page: number }, { getState }) => {
    const state = getState() as { posts: PostsState };
    const { search, tags, author, published = 'all' } = state.posts.filters;

    const response = await fetchPosts(params.page, {
      search,
      tags,
      author,
      published,
    });

    return response;
  }
);

export const loadPostById = createAsyncThunk(
  'posts/loadPostById',
  async (id: string) => {
    const response = await fetchPostById(id);
    return response;
  }
);

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (
    postData: Omit<
      IPost,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'url'
      | 'image'
      | 'published'
      | 'viewCount'
    >
  ) => {
    const response = await createPost(postData);
    return response;
  }
);

export const editPost = createAsyncThunk(
  'posts/editPost',
  async ({
    id,
    postData,
  }: {
    id: string;
    postData: Omit<IPost, 'id' | 'createdAt' | 'updatedAt' | 'owner'>;
  }) => {
    const response = await updatePost(id, postData);
    return response;
  }
);

export const removePost = createAsyncThunk(
  'posts/removePost',
  async (id: string) => {
    await deletePost(id);
    return id;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setActivePost(state: PostsState, action: PayloadAction<IPost | null>) {
      state.activePost = action.payload;
    },
    setFilters(
      state: PostsState,
      action: PayloadAction<Partial<PostsState['filters']>>
    ) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage(state: PostsState, action: PayloadAction<number>) {
      state.pagination.currentPage = action.payload;
    },
    updateActivePostField<K extends keyof IPost>(
      state: PostsState,
      action: PayloadAction<{ field: K; value: IPost[K] }>
    ) {
      if (state.activePost) {
        state.activePost[action.payload.field] = action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload.posts;
        state.pagination.totalPages = action.payload.totalPages;
      })
      .addCase(loadPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(loadPostById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadPostById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.activePost = action.payload;
      })
      .addCase(loadPostById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(loadPostByUrl.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadPostByUrl.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.activePost = action.payload;
      })
      .addCase(loadPostByUrl.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.activePost = action.payload;
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post.id !== Number(action.payload)
        );
      });
  },
});

export const { setActivePost, setFilters, setPage, updateActivePostField } =
  postsSlice.actions;

export default postsSlice.reducer;
