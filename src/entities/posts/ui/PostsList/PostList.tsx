import clsx from 'clsx';
import PostFilters from './PostFilters';
import PostItem from './PostItem';
import { Pagination } from '../../../../shared/ui';
import usePostList from '../../model/usePostList';
import styles from './PostList.module.scss';

const PostList: React.FC = () => {
  const {
    posts,
    loading,
    filters,
    pagination,
    user,
    handleDelete,
    handleFilterChange,
    handleTagChange,
    handleSearchChange,
    handlePageChange,
  } = usePostList();

  return (
    <div className={styles.postList}>
      <PostFilters
        filters={filters}
        onSearchChange={handleSearchChange}
        onTagChange={handleTagChange}
        onFilterChange={handleFilterChange}
      />

      <div
        className={clsx(styles.postsContainer, {
          [styles.loading]: loading,
        })}
      >
        {status === 'loading' && <p>Загрузка...</p>}
        {posts.length === 0 && status !== 'loading' && (
          <p>Нет доступных постов</p>
        )}
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            userRole={user?.role || 'guest'}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export { PostList };
