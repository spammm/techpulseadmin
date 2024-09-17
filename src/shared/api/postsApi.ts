import api from './api';
import { IPost } from '../types/post';

export const fetchPosts = async (
  page: number = 1,
  filters: {
    search?: string;
    tags?: string[];
    author?: string;
    published?: 'all' | 'published' | 'unpublished';
  } = {}
): Promise<{ posts: IPost[]; totalPages: number }> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());

  if (filters.search) {
    queryParams.append('search', filters.search);
  }

  if (filters.author) {
    queryParams.append('author', filters.author);
  }

  if (filters.published && filters.published !== 'all') {
    queryParams.append('published', filters.published);
  }

  const queryString = queryParams.toString();
  const response = await api.get<{ posts: IPost[]; totalPages: number }>(
    `/posts?${queryString}`,
    {
      params: { tags: filters.tags },
    }
  );
  return response.data;
};

export const fetchPostById = async (id: string): Promise<IPost> => {
  const response = await api.get<IPost>(`/posts/${id}`);
  return response.data;
};

export const fetchPostByUrl = async (url: string): Promise<IPost> => {
  const response = await api.get<IPost>(
    `/posts/find?fieldName=url&fieldValue=${url}`
  );
  return response.data;
};

export const createPost = async (
  postData: Omit<
    IPost,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'url'
    | 'viewCount'
    | 'published'
    | 'image'
    | 'imageLinks'
  >
): Promise<IPost> => {
  const response = await api.post<IPost>(`/posts`, postData);
  return response.data;
};

export const updatePost = async (
  id: string,
  postData: Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>
): Promise<IPost> => {
  const response = await api.put<IPost>(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};
