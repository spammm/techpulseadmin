import { IUser } from '../../../shared/types/user';

import styles from './DashboardWelcome.module.scss';

type DashboardWelcomeProps = {
  userProfile: IUser | null;
};

export const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({
  userProfile,
}) => {
  return (
    <h1 className={styles.welcomeMessage}>
      Добро пожаловать, {userProfile?.firstName || userProfile?.username}!
    </h1>
  );
};
