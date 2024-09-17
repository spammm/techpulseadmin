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

    if (currentPage > 3) {
      pages.push(1, '...');
    }

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push('...', totalPages);
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
