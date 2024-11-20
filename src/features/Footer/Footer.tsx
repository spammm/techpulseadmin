import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>&copy; {currentYear} Tech Pulse Admin Panel</p>
    </footer>
  );
};
