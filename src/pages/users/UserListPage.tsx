import { UsersListContainer } from '../../entities/users';
import styles from './UserListPage.module.scss';

export const UserListPage: React.FC = () => {
  return (
    <div className={styles.userListContainer}>
      <h1 className={styles.title}>Список пользователей</h1>
      <UsersListContainer />
    </div>
  );
};
