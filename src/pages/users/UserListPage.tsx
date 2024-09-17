import { useEffect, useState, useTransition } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/appStore';
import { UserList } from './ui/UserList';
import { fetchUsers } from '../../features/users';
import { Pagination, SearchInput, StatusFilter } from '../../shared/ui';

import styles from './UserListPage.module.scss';

export const UserListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, status, error } = useAppSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'disabled'
  >('all');
  const [tab, setTab] = useState<'users' | 'clients'>('users');
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users
    .filter((user) =>
      tab === 'users' ? user.role !== 'client' : user.role === 'client'
    )
    .filter((user) =>
      searchTerm
        ? user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((user) =>
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? !user.disable
        : user.disable
    );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleTabChange = (newTab: 'users' | 'clients') => {
    startTransition(() => {
      setTab(newTab);
    });
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
          className={`${styles.tab} ${tab === 'users' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('users')}
          disabled={isPending}
        >
          Пользователи
        </button>
        <button
          className={`${styles.tab} ${
            tab === 'clients' ? styles.activeTab : ''
          }`}
          onClick={() => handleTabChange('clients')}
          disabled={isPending}
        >
          Клиенты
        </button>
      </div>

      <div className={styles.filters}>
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
        <StatusFilter
          status={statusFilter}
          setStatus={setStatusFilter}
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
