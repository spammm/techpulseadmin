import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './Dashboard.module.scss';

export const Dashboard: React.FC = () => {
  const userProfile = useSelector((state: RootState) => state.user.profile);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.welcomeMessage}>
        Добро пожаловать, {userProfile?.firstName || userProfile?.username}!
      </h1>
      <p className={styles.intro}>
        Это ваша админ-панель, где вы можете управлять контентом, пользователями
        и другими аспектами сайта.
      </p>
      <div className={styles.linksContainer}>
        <Link to="/posts" className={styles.linkCard}>
          <h2>Управление постами</h2>
          <p>Создавайте, редактируйте и удаляйте посты.</p>
        </Link>
        {(userProfile?.role === 'admin' || userProfile?.role === 'manager') && (
          <Link to="/users" className={styles.linkCard}>
            <h2>Управление пользователями</h2>
            <p>Просмотр и управление пользователями сайта.</p>
          </Link>
        )}
        <Link to="/profile" className={styles.linkCard}>
          <h2>Мой профиль</h2>
          <p>Просмотрите и обновите информацию о своем профиле.</p>
        </Link>
        {userProfile?.role === 'admin' && (
          <Link to="/settings" className={styles.linkCard}>
            <h2>Настройки</h2>
            <p>Управление настройками сайта.</p>
          </Link>
        )}
      </div>
    </div>
  );
};
