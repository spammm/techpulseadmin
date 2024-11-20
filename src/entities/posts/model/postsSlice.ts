import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchPosts,
  fetchPostById,
  fetchPostByUrl,
  createPost,
  updatePost,
  deletePost,
} from '../../../shared/api/postsApi';
import type { IPost } from '../../../shared/types/post';
import type { PostsState, CreatePost } from '../types/postSliceTypes';

export const initialState: PostsState = {
  posts: [],
  activePost: null,
  activePostStatus: 'idle',
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
  async (url: string, { rejectWithValue }) => {
    try {
      const response = await fetchPostByUrl(url);
      return response;
    } catch (error) {
      console.error('Failed to load post by URL:', error);
      return rejectWithValue('Failed to load post by URL');
    }
  }
);

export const loadPosts = createAsyncThunk(
  'posts/loadPosts',
  async (params: { page: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { posts: PostsState };
      const { search, tags, author, published = 'all' } = state.posts.filters;
      const response = await fetchPosts(params.page, {
        search,
        tags,
        author,
        published,
      });
      return response;
    } catch (error) {
      console.error('Error loading posts:', error);
      return rejectWithValue('Failed to load posts');
    }
  }
);

export const loadPostById = createAsyncThunk(
  'posts/loadPostById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetchPostById(id);
      return response;
    } catch (error) {
      console.error('Error loading post by ID:', error);
      return rejectWithValue('Failed to load post by ID');
    }
  }
);

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (postData: CreatePost, { rejectWithValue }) => {
    try {
      const response = await createPost(postData);
      return response;
    } catch (error) {
      console.error('Error adding new post:', error);
      return rejectWithValue('Failed to add new post');
    }
  }
);

export const editPost = createAsyncThunk(
  'posts/editPost',
  async (
    {
      id,
      postData,
    }: {
      id: string;
      postData: Omit<IPost, 'id' | 'createdAt' | 'updatedAt' | 'owner'>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await updatePost(id, postData);
      return response;
    } catch (error) {
      console.error('Error editing post:', error);
      return rejectWithValue('Failed to edit post');
    }
  }
);

export const removePost = createAsyncThunk(
  'posts/removePost',
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePost(id);
      return id;
    } catch (error) {
      console.error('Error removing post:', error);
      return rejectWithValue('Failed to remove post');
    }
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
        state.error = (action.payload as string) || 'Error loading posts';
      })
      .addCase(loadPostById.pending, (state) => {
        state.activePostStatus = 'loading';
      })
      .addCase(loadPostById.fulfilled, (state, action) => {
        state.activePostStatus = 'succeeded';
        state.activePost = action.payload;
      })
      .addCase(loadPostById.rejected, (state, action) => {
        state.activePostStatus = 'failed';
        state.error = (action.payload as string) || 'Error loading posts';
      })
      .addCase(loadPostByUrl.pending, (state) => {
        state.activePostStatus = 'loading';
      })
      .addCase(loadPostByUrl.fulfilled, (state, action) => {
        state.activePostStatus = 'succeeded';
        state.activePost = action.payload;
      })
      .addCase(loadPostByUrl.rejected, (state, action) => {
        state.activePostStatus = 'failed';
        state.error = (action.payload as string) || 'Error loading post';
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.activePostStatus = 'succeeded';
        state.posts.unshift(action.payload);
      })
      .addCase(addNewPost.pending, (state) => {
        state.activePostStatus = 'loading';
        state.error = null;
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.activePostStatus = 'failed';
        state.error = (action.payload as string) || 'Error to create post';
      })
      .addCase(editPost.pending, (state) => {
        state.activePostStatus = 'loading';
        state.error = null;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.activePostStatus = 'failed';
        state.error = (action.payload as string) || 'Error to save post';
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.activePost = action.payload;
        state.activePostStatus = 'succeeded';
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
