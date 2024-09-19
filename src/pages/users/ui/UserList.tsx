import { Link } from 'react-router-dom';
import { IUser } from '../../../shared/types/user';

import styles from './UserList.module.scss';

type UserListProps = {
  users: IUser[];
};

export const UserList: React.FC<UserListProps> = ({ users }) => {
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
          </div>
        </li>
      ))}
    </ul>
  );
};
