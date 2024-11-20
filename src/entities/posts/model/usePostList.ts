import { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../shared/model';
import { loadPosts, removePost, setFilters, setPage } from './postsSlice';
import { useDebounce } from '../../../shared/lib/hooks';
import {
  selectPosts,
  selectPostsError,
  selectPostsFilters,
  selectPostsPagination,
  selectPostsStatus,
  selectPostsUser,
} from './selectors';

const usePostList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const status = useAppSelector(selectPostsStatus);
  const error = useAppSelector(selectPostsError);
  const filters = useAppSelector(selectPostsFilters);
  const pagination = useAppSelector(selectPostsPagination);
  const user = useAppSelector(selectPostsUser);

  const loading = status === 'loading';

  const debouncedFilters = useDebounce(filters, 1300);

  useEffect(() => {
    if (error) {
      toast.error(`Ошибка при загрузке постов: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    dispatch(loadPosts({ page: pagination.currentPage }));
  }, [dispatch, debouncedFilters, pagination.currentPage]);

  const handleDelete = useCallback(
    (postId: number) => {
      if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
        dispatch(removePost(postId.toString()));
      }
    },
    [dispatch]
  );

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const valueToSet = name === 'published' && !value ? 'all' : value;
      dispatch(setFilters({ [name]: valueToSet }));
    },
    [dispatch]
  );

  const handleTagChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.split(',').map((tag) => tag.trim());
      dispatch(setFilters({ tags: value }));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setFilters({ search: e.target.value.trim() }));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setPage(newPage));
    },
    [dispatch]
  );

  return {
    posts,
    status,
    loading,
    filters,
    pagination,
    user,
    handleDelete,
    handleFilterChange,
    handleTagChange,
    handleSearchChange,
    handlePageChange,
  };
};

export default usePostList;
