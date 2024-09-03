import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './ImageSelector.module.scss';
import { RootState } from '../../store/store';
import { IPostImage } from '../../types/image';

interface ImageSelectorProps {
  onSelectImage: (image: IPostImage) => void;
  defaultImageId?: number;
}

const API_SERVER = import.meta.env.VITE_API_SERVER;

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  onSelectImage,
  defaultImageId,
}) => {
  const images = useSelector((state: RootState) => state.images.images);
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
                backgroundImage: `url(${API_SERVER}${selectedImage.smallSrc})`,
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
                  backgroundImage: `url(${`${API_SERVER}${image.smallSrc}`})`,
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
