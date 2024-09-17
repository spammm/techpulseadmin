import { Link } from 'react-router-dom';
import { IUser } from '../../../shared/types/user';

import styles from './DashboardLinks.module.scss';

type DashboardLinksProps = {
  userProfile: IUser | null;
};

export const DashboardLinks: React.FC<DashboardLinksProps> = ({
  userProfile,
}) => {
  return (
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
  );
};
