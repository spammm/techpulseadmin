import { useState } from 'react';
import { Input } from '../shared/Input';
import styles from './ImageItem.module.scss';
import { IPostImage } from '../../types/image';
import { Button } from '../shared/Button';

const API_SERVER = import.meta.env.VITE_API_SERVER;

interface ImageItemProps {
  image: IPostImage;
  onUpdateImage: (imageId: number, updatedData: Partial<IPostImage>) => void;
}

export const ImageItem: React.FC<ImageItemProps> = ({
  image,
  onUpdateImage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<IPostImage>(image);
  const handleEditChange = (field: keyof IPostImage, value: string) => {
    setEditedImage({ ...editedImage, [field]: value });
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateImage(editedImage.id, editedImage);
    setIsEditing(false);
  };

  return (
    <div className={styles.listItem}>
      <img
        src={`${API_SERVER}${editedImage.src}`}
        alt={editedImage.alt}
        className={styles.preview}
      />
      <div className={styles.fields}>
        <Input
          label="URL:"
          defaultValue={`${API_SERVER}${editedImage.src}`}
          readOnly
          className={styles.input}
        />

        <Input
          label="Описание:"
          value={editedImage.alt}
          onChange={(e) => handleEditChange('alt', e.target.value)}
          className={styles.input}
        />
        <Input
          label="URL Источника:"
          value={editedImage.sourceUrl || ''}
          onChange={(e) => handleEditChange('sourceUrl', e.target.value)}
          className={styles.input}
        />
        <Input
          label="Источник:"
          value={editedImage.source || ''}
          onChange={(e) => handleEditChange('source', e.target.value)}
          className={styles.input}
        />
        <input type="hidden" name="width" defaultValue={editedImage?.width} />
        <input type="hidden" name="height" defaultValue={editedImage?.height} />
        {isEditing && (
          <Button
            className={styles.saveButton}
            onClick={handleSave}
            text="Сохранить"
          />
        )}
      </div>
    </div>
  );
};
