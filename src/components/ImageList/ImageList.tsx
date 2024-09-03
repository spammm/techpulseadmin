import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ImageItem } from './ImageItem';
import { IPostImage } from '../../types/image';
import styles from './ImageList.module.css';

interface ImageListProps {
  onUpdateImage: (imageId: number, updatedData: Partial<IPostImage>) => void;
}

export const ImageList: React.FC<ImageListProps> = ({ onUpdateImage }) => {
  const imageLinks = useSelector((state: RootState) => state.images.images);

  return (
    <div className={styles.list}>
      {imageLinks.map((image) => (
        <ImageItem key={image.id} image={image} onUpdateImage={onUpdateImage} />
      ))}
    </div>
  );
};
