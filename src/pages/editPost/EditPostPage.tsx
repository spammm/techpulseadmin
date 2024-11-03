import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useEditPost,
  selectActivePost,
  EditPostForm,
} from '../../features/editPost';

import styles from './EditPostPage.module.scss';

export const EditPostPage: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const { handleFieldChange, handleSubmit: submitPost } = useEditPost(url);
  const activePost = useSelector(selectActivePost);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activePost) {
      submitPost(activePost);
    }
  };

  if (!activePost) return null;

  return (
    <div className={styles.editPostForm}>
      <h1>Редактировать новость</h1>
      <EditPostForm
        activePost={activePost}
        handleFieldChange={handleFieldChange}
        handleSubmit={handleSubmit}
        handleImageSelect={(image) =>
          handleFieldChange('image', {
            ...image,
            src: `${image.smallSrc}`,
          })
        }
      />
    </div>
  );
};
