import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import { RootState, AppDispatch } from '../../store/store';
import {
  loadPosts,
  removePost,
  setFilters,
  setPage,
} from '../../store/postsSlice';
import { Button } from '../shared/Button';
import { Pagination } from './../Pagination/Pagination';
import { useDebounce } from '../../hooks';

import styles from './PostList.module.scss';

const CLIENT_SITE_HOST = import.meta.env.VITE_SITE_HOST;

const PostList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const posts = useSelector((state: RootState) => state.posts.posts);
  const status = useSelector((state: RootState) => state.posts.status);
  const error = useSelector((state: RootState) => state.posts.error);
  const filters = useSelector((state: RootState) => state.posts.filters);
  const pagination = useSelector((state: RootState) => state.posts.pagination);
  const user = useSelector((state: RootState) => state.user.profile);

  const debouncedFilters = useDebounce(filters, 1300);

  useEffect(() => {
    if (error) {
      toast.error(`Ошибка при загрузке постов: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    dispatch(loadPosts({ page: pagination.currentPage }));
  }, [dispatch, debouncedFilters, pagination.currentPage]);

  const handleDelete = (postId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      dispatch(removePost(postId.toString()));
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.split(',').map((tag) => tag.trim());
    dispatch(setFilters({ tags: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value.trim() }));
  };

  return (
    <div className={styles.postList}>
      <div className={styles.filters}>
        <input
          type="text"
          name="search"
          placeholder="Поиск по заголовку/подзаголовку"
          value={filters.search}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <input
          type="text"
          name="tags"
          placeholder="Фильтр по тегам (через запятую)"
          value={filters.tags.join(', ')}
          onChange={handleTagChange}
          className={styles.tagInput}
        />
        <select
          name="published"
          value={filters.published}
          onChange={handleFilterChange}
          className={styles.selectInput}
        >
          <option value="published">Опубликованно</option>
          <option value="unpublished">Не опубликовано</option>
          <option value="all">Все</option>
        </select>
        <input
          type="text"
          name="author"
          placeholder="Фильтр по автору"
          value={filters.author || ''}
          onChange={handleFilterChange}
          className={styles.authorInput}
        />
      </div>

      <div
        className={`${styles.postsContainer} ${
          status === 'loading' ? styles.loading : ''
        }`}
      >
        {posts.length === 0 && status !== 'loading' ? (
          <div>Нет доступных постов</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className={styles.postItem}>
              {post.image && post.image.src && (
                <img
                  src={post.image.src}
                  alt={post.image.alt}
                  className={styles.thumbnail}
                />
              )}
              <div className={styles.postContent}>
                <h3>
                  <Link
                    to={`/posts/${post.url}`}
                    title={post?.viewCount?.toString()}
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className={styles.subtitle}>{post.subtitle}</p>
                <p className={styles.meta}>
                  Автор:{' '}
                  {post.authorName ||
                    post.owner?.username ||
                    'Неизвестный автор'}{' '}
                  | Просмотры: {post.viewCount} |
                  {post.published ? 'Опубликовано' : 'Не опубликовано'} | Дата
                  создания: {new Date(post.createdAt).toLocaleDateString()} |
                  {post.publishedAt &&
                    `Дата публикации: ${new Date(
                      post.publishedAt
                    ).toLocaleDateString()}`}
                </p>
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                {post.published && (
                  <>
                    <br />
                    <a
                      href={`${CLIENT_SITE_HOST}/news/${post.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Открыть страницу на основном сайте
                    </a>
                  </>
                )}
                {user?.role === 'admin' && (
                  <div className={styles.actions}>
                    <Button
                      text="Удалить"
                      onClick={() => handleDelete(post.id)}
                      className={styles.deleteButton}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(newPage) => dispatch(setPage(newPage))}
      />
    </div>
  );
};

export { PostList };
