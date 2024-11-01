import { ProfileForm } from '../../features/profile';
import styles from './ProfilePage.module.scss';

export const ProfilePage: React.FC = () => {
  return (
    <div className={styles.profileContainer}>
      <h1>Редактировать профиль</h1>
      <ProfileForm />
    </div>
  );
};
