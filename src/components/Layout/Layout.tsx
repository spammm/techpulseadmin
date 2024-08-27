import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';
import { LogoutButton } from '../LogoutButton/LogoutButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export const Layout: React.FC = () => {
  // Получаем роль пользователя из глобального состояния
  const userRole = useSelector((state: RootState) => state.user.profile?.role);

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
              <li>
                <Link to="/users">Пользователи</Link>
              </li>
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
