import { useEffect, useState, useTransition } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/appStore';
import { UserList } from './ui/UserList';
import {
  fetchUsers,
  setSearchQuery,
  setUserTypeFilter,
  setDisableFilter,
  applyFilters,
} from '../../entities/users';
import { Pagination, SearchInput, StatusFilter } from '../../shared/ui';
import styles from './UserListPage.module.scss';

export const UserListPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    status,
    error,
    searchQuery,
    userTypeFilter,
    disableFilter,
    filteredUsers,
  } = useAppSelector((state) => state.users);

  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
    dispatch(applyFilters());
  }, [dispatch, status, searchQuery, userTypeFilter, disableFilter]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleTabChange = (newTab: 'all' | 'users' | 'clients') => {
    startTransition(() => {
      dispatch(setUserTypeFilter(newTab));
    });
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const handleStatusFilterChange = (status: 'all' | 'active' | 'disabled') => {
    dispatch(setDisableFilter(status));
  };

  const statusOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Активные', value: 'active' },
    { label: 'Заблокированные', value: 'disabled' },
  ];

  if (status === 'loading') return <p>Загрузка...</p>;
  if (status === 'failed') return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.userListContainer}>
      <h1 className={styles.title}>Список пользователей</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            userTypeFilter === 'all' ? styles.activeTab : ''
          }`}
          onClick={() => handleTabChange('all')}
          disabled={isPending}
        >
          Все
        </button>
        <button
          className={`${styles.tab} ${
            userTypeFilter === 'users' ? styles.activeTab : ''
          }`}
          onClick={() => handleTabChange('users')}
          disabled={isPending}
        >
          Пользователи
        </button>
        <button
          className={`${styles.tab} ${
            userTypeFilter === 'clients' ? styles.activeTab : ''
          }`}
          onClick={() => handleTabChange('clients')}
          disabled={isPending}
        >
          Клиенты
        </button>
      </div>

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
    </div>
  );
};
