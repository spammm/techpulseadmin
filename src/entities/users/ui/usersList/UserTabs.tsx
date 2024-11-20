import styles from './UserTabs.module.scss';

interface UserTabsProps {
  userTypeFilter: 'all' | 'users' | 'clients';
  handleTabChange: (newTab: 'all' | 'users' | 'clients') => void;
  isPending: boolean;
}

const UserTabs: React.FC<UserTabsProps> = ({
  userTypeFilter,
  handleTabChange,
  isPending,
}) => {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${
          userTypeFilter === 'all' ? styles.activeTab : ''
        }`}
        onClick={() => handleTabChange('all')}
        disabled={isPending}
      >
        Все
      </button>
      <button
        className={`${styles.tab} ${
          userTypeFilter === 'users' ? styles.activeTab : ''
        }`}
        onClick={() => handleTabChange('users')}
        disabled={isPending}
      >
        Пользователи
      </button>
      <button
        className={`${styles.tab} ${
          userTypeFilter === 'clients' ? styles.activeTab : ''
        }`}
        onClick={() => handleTabChange('clients')}
        disabled={isPending}
      >
        Клиенты
      </button>
    </div>
  );
};

export { UserTabs };
