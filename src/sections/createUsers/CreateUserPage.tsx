import { CreateUserForm } from '../../features/usersCreate';

import styles from './CreateUserPage.module.scss';

export const CreateUserPage: React.FC = () => {
  return (
    <div className={styles.createUserContainer}>
      <h1>Создать пользователя</h1>
      <CreateUserForm />
    </div>
  );
};
