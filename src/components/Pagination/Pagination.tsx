import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 1) return pages;

    // Первая страница
    if (currentPage > 3) {
      pages.push(1, 2, 3, '...');
    }

    // Текущая страница и соседние страницы
    if (currentPage > 1 && currentPage <= totalPages) {
      if (currentPage > 3) pages.push(currentPage - 1);
      pages.push(currentPage);
      if (currentPage < totalPages - 2) pages.push(currentPage + 1);
    }

    // Последние страницы
    if (currentPage < totalPages - 2) {
      pages.push('...', totalPages - 2, totalPages - 1, totalPages);
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className={styles.pageButton}
      >
        Предыдущая
      </button>
      {getPages().map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            className={styles.pageButton}
            onClick={() => handlePageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ) : (
          <span key={index} className={styles.ellipsis}>
            {page}
          </span>
        )
      )}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className={styles.pageButton}
      >
        Следующая
      </button>
    </div>
  );
};
