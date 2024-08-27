import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUsers } from '../../store/userSlice';
import { RootState, AppDispatch } from '../../store/store';
import styles from './UserListPage.module.scss';

export const UserListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const users = useSelector((state: RootState) => state.user.users);
  const userStatus = useSelector((state: RootState) => state.user.status);
  const error = useSelector((state: RootState) => state.user.error);

  useEffect(() => {
    if (
      userStatus === 'idle' ||
      (userStatus === 'succeeded' && users.length === 0)
    ) {
      dispatch(fetchUsers());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      if (error === 'Unauthorized') {
        navigate('/login');
      }
    }
  }, [error, navigate]);

  return (
    <div className={styles.userListContainer}>
      <h1 className={styles.title}>Список пользователей</h1>
      {userStatus === 'loading' && <p>Загрузка...</p>}
      {userStatus === 'succeeded' && (
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.id} className={styles.userItem}>
              <div className={styles.userAvatar}>
                <img src={user.avatar} alt={user.username} />
              </div>
              <div className={styles.userInfo}>
                <Link to={`/users/${user.id}`} className={styles.userLink}>
                  {user.username}
                </Link>
                <p className={styles.userRole}>Роль: {user.role}</p>
                {user.email && (
                  <p className={styles.userEmail}>Email: {user.email}</p>
                )}
                <p
                  className={styles.userStatus}
                  style={{
                    color: user.disable ? 'red' : 'green',
                  }}
                >
                  {user.disable ? 'Заблокирован' : 'Активный'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {userStatus === 'failed' && (
        <p className={styles.error}>Ошибка: {error}</p>
      )}
    </div>
  );
};
