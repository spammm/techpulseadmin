import api from './api';
import { IPost } from '../types/post';

/**
 * Функция для получения списка постов с фильтрацией по параметрам.
 * @param {number} [page=1] - Номер страницы.
 * @param {Object} filters - Фильтры для поиска постов.
 * @param {string} [filters.search] - Поиск по заголовкам, подзаголовкам и содержимому.
 * @param {string[]} [filters.tags] - Массив тегов для фильтрации.
 * @param {string} [filters.author] - Автор поста.
 * @param {'all' | 'published' | 'unpublished'} [filters.published] - Статус публикации.
 * @returns {Promise<{ posts: IPost[]; totalPages: number }>} Возвращает список постов и количество страниц.
 * @throws {Error} Ошибка запроса данных.
 */
export const fetchPosts = async (
  page: number = 1,
  filters: {
    search?: string;
    tags?: string[];
    author?: string;
    published?: 'all' | 'published' | 'unpublished';
  } = {}
): Promise<{ posts: IPost[]; totalPages: number }> => {
  try {
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
  } catch (error) {
    console.error('Ошибка при загрузке постов:', error);
    throw new Error('Не удалось загрузить посты');
  }
};

/**
 * Функция для получения поста по его идентификатору.
 * @param {string} id - Идентификатор поста.
 * @returns {Promise<IPost>} Возвращает пост по указанному ID.
 * @throws {Error} Ошибка запроса данных.
 */
export const fetchPostById = async (id: string): Promise<IPost> => {
  try {
    const response = await api.get<IPost>(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при загрузке поста с ID ${id}:`, error);
    throw new Error('Не удалось загрузить пост');
  }
};

/**
 * Функция для получения поста по URL.
 * @param {string} url - URL поста.
 * @returns {Promise<IPost>} Возвращает пост по указанному URL.
 * @throws {Error} Ошибка запроса данных.
 */
export const fetchPostByUrl = async (url: string): Promise<IPost> => {
  try {
    const response = await api.get<IPost>(
      `/posts/find?fieldName=url&fieldValue=${url}`
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при загрузке поста с URL ${url}:`, error);
    throw new Error('Не удалось загрузить пост');
  }
};

/**
 * Функция для создания нового поста.
 * @param {Omit<IPost, 'id' | 'createdAt' | 'updatedAt' | 'url' | 'viewCount' | 'published' | 'image' | 'imageLinks'>} postData - Данные для создания поста.
 * @returns {Promise<IPost>} Возвращает созданный пост.
 * @throws {Error} Ошибка запроса на создание поста.
 */
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
  try {
    const response = await api.post<IPost>(`/posts`, postData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании поста:', error);
    throw new Error('Не удалось создать пост');
  }
};

/**
 * Функция для обновления поста.
 * @param {string} id - Идентификатор поста.
 * @param {Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>} postData - Данные для обновления поста.
 * @returns {Promise<IPost>} Возвращает обновленный пост.
 * @throws {Error} Ошибка запроса на обновление поста.
 */
export const updatePost = async (
  id: string,
  postData: Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>
): Promise<IPost> => {
  try {
    const response = await api.put<IPost>(`/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении поста:', error);
    throw new Error('Не удалось обновить пост');
  }
};

/**
 * Функция для удаления поста.
 * @param {string} id - Идентификатор поста.
 * @returns {Promise<void>} Возвращает промис, который выполняется после удаления поста.
 * @throws {Error} Ошибка запроса на удаление поста.
 */
export const deletePost = async (id: string): Promise<void> => {
  try {
    await api.delete(`/posts/${id}`);
  } catch (error) {
    console.error('Ошибка при удалении поста:', error);
    throw new Error('Не удалось удалить пост');
  }
};
