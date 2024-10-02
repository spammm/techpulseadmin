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

    pages.push(1);

    if (currentPage > 4) {
      pages.push('...');
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
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
            className={`${styles.pageButton} ${
              page === currentPage ? styles.active : ''
            }`}
            onClick={() => handlePageChange(page)}
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
