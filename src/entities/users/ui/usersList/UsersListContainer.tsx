import { UserList } from './UserList';
import { useUsersList } from '../../model/useUsersList';
import { UserTabs } from './UserTabs';
import { SearchInput, StatusFilter, Pagination } from '../../../../shared/ui';

import styles from './UsersListContainer.module.scss';

const UsersListContainer: React.FC = () => {
  const {
    status,
    error,
    searchQuery,
    userTypeFilter,
    disableFilter,
    paginatedUsers,
    filteredUsers,
    usersPerPage,
    isPending,
    currentPage,
    setCurrentPage,
    handleTabChange,
    handleSearchChange,
    handleStatusFilterChange,
    statusOptions,
  } = useUsersList();

  if (status === 'loading') return <p>Загрузка...</p>;
  if (status === 'failed') return <p>Ошибка: {error}</p>;
  return (
    <>
      <UserTabs
        userTypeFilter={userTypeFilter}
        handleTabChange={handleTabChange}
        isPending={isPending}
      />

      <div className={styles.filters}>
        <SearchInput value={searchQuery} onChange={handleSearchChange} />
        <StatusFilter
          status={disableFilter}
          setStatus={handleStatusFilterChange}
          options={statusOptions}
        />
      </div>

      {isPending ? (
        <p>Загрузка данных...</p>
      ) : (
        <UserList users={paginatedUsers} />
      )}

      <Pagination
        totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export { UsersListContainer };
