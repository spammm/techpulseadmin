import { Link } from 'react-router-dom';
import { IUser } from '../../../../shared/types/user';
import { useAppDispatch, useAppSelector } from '../../../../shared/model';
import { deleteUser } from '../..';

import styles from './UserList.module.scss';

type UserListProps = {
  users: IUser[];
};

export const UserList: React.FC<UserListProps> = ({ users }) => {
  const dispatch = useAppDispatch();
  const currentProfileRole = useAppSelector(
    (state) => state.profile.profile?.role
  );

  const handleDelete = (userId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <ul className={styles.userList}>
      {users.map((user) => (
        <li key={user.id} className={styles.userItem}>
          <div className={styles.userAvatar}>
            <img src={user.avatar} alt={user.username} />
          </div>
          <div className={styles.userInfo}>
            <Link to={`/users/${user.id}`} className={styles.userLink}>
              {user.username || user.email}
            </Link>
            <p className={styles.userRole}>Роль: {user.role}</p>
            {user.email && (
              <p className={styles.userEmail}>Email: {user.email}</p>
            )}
            <p
              className={styles.userStatus}
              style={{ color: user.disable ? 'red' : 'green' }}
            >
              {user.disable ? 'Заблокирован' : 'Активный'}
            </p>
            {currentProfileRole === 'admin' && (
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(user.id)}
              >
                Удалить
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
