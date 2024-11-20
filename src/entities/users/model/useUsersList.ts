import { useState, useEffect, useTransition } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/model';
import {
  fetchUsers,
  applyFilters,
  setUserTypeFilter,
  setSearchQuery,
  setDisableFilter,
} from './userSlice';
import {
  selectUsersStatus,
  selectUsersError,
  selectUsersSearchQuery,
  selectUsersTypeFilter,
  selectUsersDisableFilter,
  selectFilteredUsers,
} from './selectors';

export const useUsersList = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectUsersStatus);
  const error = useAppSelector(selectUsersError);
  const searchQuery = useAppSelector(selectUsersSearchQuery);
  const userTypeFilter = useAppSelector(selectUsersTypeFilter);
  const disableFilter = useAppSelector(selectUsersDisableFilter);
  const filteredUsers = useAppSelector(selectFilteredUsers);

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

  return {
    status,
    error,
    searchQuery,
    userTypeFilter,
    disableFilter,
    filteredUsers,
    paginatedUsers,
    isPending,
    currentPage,
    usersPerPage,
    setCurrentPage,
    handleTabChange,
    handleSearchChange,
    handleStatusFilterChange,
    statusOptions,
  };
};
