import { EditPostForm } from '../../entities/posts';

import styles from './EditPostPage.module.scss';

export const EditPostPage: React.FC = () => {
  return (
    <div className={styles.editPostForm}>
      <h1>Редактировать новость</h1>
      <EditPostForm />
    </div>
  );
};
