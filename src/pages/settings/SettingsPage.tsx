import styles from './SettingsPage.module.scss';
import { PresetSources } from './ui/PresetSources';

export const SettingsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Редактировать настройки</h1>
      <div className={styles.controls}>
        <PresetSources />
      </div>
    </div>
  );
};
