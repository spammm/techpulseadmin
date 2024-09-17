import { Link, Outlet } from 'react-router-dom';
import { LogoutButton } from '../../entities/LogoutButton';
import { useAppSelector } from '../appStore';

import styles from './MainLayout.module.scss';

export const MainLayout: React.FC = () => {
  const userRole = useAppSelector((state) => state.profile.profile?.role);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <nav className={styles.controls}>
          <ul>
            <li>
              <Link to="/">Главная</Link>
            </li>
            <li>
              <Link to="/posts">Статьи</Link>
            </li>
            <li>
              <Link to="/posts/new">Создать статью</Link>
            </li>
            {userRole === 'admin' && (
              <li>
                <Link to="/users/create">Создать пользователя</Link>
              </li>
            )}
            {(userRole === 'admin' || userRole === 'manager') && (
              <>
                <li>
                  <Link to="/users">Пользователи</Link>
                </li>
                <li>
                  <Link to="/comments">Коментарии</Link>
                </li>
              </>
            )}
            <li>
              <Link to="/profile">Мой профиль</Link>
            </li>
          </ul>
          <LogoutButton />
        </nav>
      </header>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Tech Pulse Admin Panel</p>
      </footer>
    </div>
  );
};
