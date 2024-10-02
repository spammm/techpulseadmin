import { useEffect } from 'react';

import styles from './Notification.module.scss';

type NotificationProps = {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
};

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    if (!onClose) return;

    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      {message}
      {onClose && (
        <button
          onClick={onClose}
          className={styles.closeButton}
          title="Закрыть"
        >
          Закрыть
        </button>
      )}
    </div>
  );
};
