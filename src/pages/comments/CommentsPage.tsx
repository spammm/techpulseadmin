import { useEffect, useState, useTransition } from 'react';
import {
  fetchComments,
  updateCommentStatus,
  setPublishedFilter,
  setModeratedFilter,
  setSearchTerm,
  setPage,
  CommentList,
} from '../../entities/comments';
import { Pagination, SearchInput, StatusFilter } from '../../shared/ui';
import { useAppDispatch, useAppSelector } from '../../shared/model';
import { useDebounce } from '../../shared/lib/hooks';

import styles from './CommentsPage.module.scss';

export const CommentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { comments, status, filters, pagination, error } = useAppSelector(
    (state) => state.comments
  );

  const [searchTerm, setSearchTermLocal] = useState(filters.searchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 2000);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      dispatch(fetchComments());
    });
  }, [dispatch, filters, pagination.currentPage, debouncedSearchTerm]);

  const handlePublishedChange = (commentId: number, published: boolean) => {
    dispatch(
      updateCommentStatus({
        commentId,
        updates: { published, moderated: published ? true : false },
      })
    );
  };

  const handleModeratedChange = (commentId: number, moderated: boolean) => {
    dispatch(updateCommentStatus({ commentId, updates: { moderated } }));
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTermLocal(searchTerm);
    dispatch(setSearchTerm(debouncedSearchTerm));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const publishedOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Опубликованные', value: 'published' },
    { label: 'Неопубликованные', value: 'unpublished' },
  ];

  const moderatedOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Промодерированные', value: 'moderated' },
    { label: 'Непромодерированные', value: 'unmoderated' },
  ];

  return (
    <div className={styles.commentsPage}>
      <h1>Администрирование комментариев</h1>
      <div className={styles.filters}>
        <SearchInput value={searchTerm} onChange={handleSearch} />
        <StatusFilter
          status={filters.published}
          setStatus={(status) => dispatch(setPublishedFilter(status))}
          options={publishedOptions}
        />
        <StatusFilter
          status={filters.moderated}
          setStatus={(status) => dispatch(setModeratedFilter(status))}
          options={moderatedOptions}
        />
      </div>

      {isPending && <p>Загрузка изменений...</p>}

      {status === 'loading' && <p>Загрузка комментариев...</p>}
      {status === 'failed' && <p>Ошибка: {error}</p>}

      {comments.length > 0 ? (
        <CommentList
          comments={comments}
          onPublishedChange={handlePublishedChange}
          onModeratedChange={handleModeratedChange}
        />
      ) : (
        <p>Нет комментариев для отображения.</p>
      )}

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
