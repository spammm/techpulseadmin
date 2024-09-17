import { useSelector } from 'react-redux';
import {
  selectUserProfile,
  DashboardWelcome,
  DashboardLinks,
} from '../../features/dashboard';

import styles from './DashboardPage.module.scss';

export const DashboardPage: React.FC = () => {
  const userProfile = useSelector(selectUserProfile);

  return (
    <div className={styles.dashboard}>
      <DashboardWelcome userProfile={userProfile} />
      <p className={styles.intro}>
        Это ваша админ-панель, где вы можете управлять контентом, пользователями
        и другими аспектами сайта.
      </p>
      <DashboardLinks userProfile={userProfile} />
    </div>
  );
};

export default DashboardPage;
