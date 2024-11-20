import { IPost } from '../../../shared/types';

export type CreatePost = Omit<
  IPost,
  'id' | 'createdAt' | 'updatedAt' | 'url' | 'image' | 'published' | 'viewCount'
>;

export interface PostsState {
  posts: IPost[];
  activePost: IPost | null;
  activePostStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
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


