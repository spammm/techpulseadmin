import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.scss';
import { Header } from '../../features/Header';
import { Footer } from '../../features/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
