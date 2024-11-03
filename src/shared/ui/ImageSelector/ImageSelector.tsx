import { useEffect, useState } from 'react';
import { IPostImage } from '../../types/image';
import { useAppSelector } from '../../../app/appStore';

import styles from './ImageSelector.module.scss';

export interface ImageSelectorProps {
  onSelectImage: (image: IPostImage) => void;
  defaultImageId?: number;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  onSelectImage,
  defaultImageId,
}) => {
  const images = useAppSelector((state) => state.images.images);
  const [selectedImage, setSelectedImage] = useState<IPostImage | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (image: IPostImage) => {
    setSelectedImage(image);
    setIsOpen(false);
    onSelectImage(image);
  };

  useEffect(() => {
    if (defaultImageId && images.length) {
      const image = images.find((img) => img.id === defaultImageId);
      if (image) setSelectedImage(image);
    }
  }, [defaultImageId, images]);

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
        {selectedImage ? (
          <>
            <div
              className={styles.preview}
              style={{
                backgroundImage: `url(${selectedImage.smallSrc})`,
              }}
            />
            <span>{selectedImage.alt}</span>
          </>
        ) : (
          <span>Выберите изображение</span>
        )}
      </div>
      {isOpen && (
        <ul className={styles.options}>
          {images.map((image) => (
            <li
              key={image.id}
              className={styles.option}
              onClick={() => handleSelect(image)}
            >
              <div
                className={styles.preview}
                style={{
                  backgroundImage: `url(${`${image.smallSrc}`})`,
                }}
              />
              <span>{image.alt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
