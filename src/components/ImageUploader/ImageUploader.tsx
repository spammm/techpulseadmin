import { useEffect, useId, useState } from 'react';
import styles from './ImageUploader.module.css';
import { Input } from '../shared/Input';
import { ImageList } from '../ImageList';
import { uploadImage } from '../../api/uploadApi';

interface ImageUploaderProps {
  onUpload: (links: { src: string; alt: string }[]) => void;
  defaultImageLinks?: { src: string; alt: string }[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  defaultImageLinks = [],
}) => {
  const id = useId();
  const [imageLinks, setImageLinks] =
    useState<{ src: string; alt: string }[]>(defaultImageLinks);

  useEffect(() => {
    if (defaultImageLinks.length > 0) {
      setImageLinks(defaultImageLinks);
    }
  }, [defaultImageLinks]);

  useEffect(() => {
    onUpload(imageLinks);
  }, [imageLinks, onUpload]);

  const handleUpload = async (file: File) => {
    try {
      const token = localStorage.getItem('token'); // Получаем токен из localStorage
      if (!token) {
        throw new Error('Необходимо войти в систему');
      }

      const data = await uploadImage(file, token);
      const link = {
        src: `${import.meta.env.VITE_API_SERVER}${data.path}`,
        alt: file.name,
      };

      setImageLinks((prevLinks) => [...prevLinks, link]);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
    }
  };

  return (
    <div className={styles.imageLoader}>
      <div className={styles.selectFile}>
        <label htmlFor={id} className={styles.label}>
          Загрузка изображений
        </label>
        <Input
          id={id}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleUpload(e.target.files[0]);
            }
          }}
        />
      </div>
      <ImageList imageLinks={imageLinks} />
    </div>
  );
};
