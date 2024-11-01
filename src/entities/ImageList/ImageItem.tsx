import { useState } from 'react';
import { IPostImage } from '../../shared/types/image';
import { Input, Button } from '../../shared/ui';

import styles from './ImageItem.module.scss';

interface ImageItemProps {
  image: IPostImage;
  onUpdateImage: (imageId: number, updatedData: Partial<IPostImage>) => void;
  apiServer?: string;
}

export const ImageItem: React.FC<ImageItemProps> = ({
  image,
  onUpdateImage,
  apiServer = import.meta.env.VITE_API_SERVER,
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

  const presetDALLE: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setEditedImage({
      ...editedImage,
      sourceUrl: 'https://openai.com/index/dall-e-3/',
      source: 'Изображение сгенерировано нейросетью DALL•Е 3',
    });
    setIsEditing(true);
  };

  return (
    <div className={styles.listItem}>
      <img
        src={`${apiServer}${editedImage.src}`}
        alt={editedImage.alt}
        className={styles.preview}
      />

      <div className={styles.fields}>
        <Input
          label="URL:"
          defaultValue={`${apiServer}${editedImage.src}`}
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
        <Button onClick={presetDALLE} className={styles.dallePreserButton}>
          DALL•E 3
        </Button>
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
