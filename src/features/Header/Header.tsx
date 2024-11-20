import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAppSelector } from '../../shared/model';
import { selectRole } from '../../shared/model/selectors';
import { LogoutButton } from '../auth';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole = useAppSelector(selectRole);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={styles.header}>
      <button className={styles.menuToggle} onClick={toggleMenu}>
        ☰
      </button>
      <nav className={clsx(styles.controls, { [styles.open]: isMenuOpen })}>
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
          <li>
            <LogoutButton />
          </li>
        </ul>
      </nav>
    </header>
  );
};
