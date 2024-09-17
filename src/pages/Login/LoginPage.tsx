import { LoginForm } from '../../features/auth/ui/LoginForm';

import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
  return (
    <section className={styles.login}>
      <h1>Авторизация</h1>
      <div>
        <LoginForm />
      </div>
    </section>
  );
};
