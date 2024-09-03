import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ImageSelector } from '../ImageSelector/ImageSelector';
import { IPostImage } from '../../types/image';
import styles from './ImageModal.module.scss';

const API_SERVER = import.meta.env.VITE_API_SERVER;

interface ModalProps {
  onClose: () => void;
  onSubmit: (data: {
    imageLink: string;
    alt: string;
    sourceLink?: string;
    sourceName?: string;
  }) => void;
}

export const ImageModal: React.FC<ModalProps> = ({ onClose, onSubmit }) => {
  const [selectedImage, setSelectedImage] = useState<IPostImage | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedImage) {
      onSubmit({
        imageLink: `${API_SERVER}${selectedImage.src}`,
        alt: selectedImage.alt,
        sourceLink: selectedImage.sourceUrl || '',
        sourceName: selectedImage.source || '',
      });
      onClose();
    } else {
      alert('Пожалуйста, выберите изображение.');
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Добавить изображение</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Выберите изображение (обязательно)</label>
            <ImageSelector onSelectImage={setSelectedImage} />
          </div>
          {selectedImage && (
            <>
              <div className={styles.formGroup}>
                <label>Описание изображения (обязательно)</label>
                <input type="text" value={selectedImage.alt} readOnly />
              </div>
              <div className={styles.formGroup}>
                <label>Ссылка на источник изображения</label>
                <input
                  type="text"
                  value={selectedImage.sourceUrl || ''}
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label>Имя источника изображения</label>
                <input
                  type="text"
                  value={selectedImage.source || ''}
                  readOnly
                />
              </div>
            </>
          )}
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
            <button type="submit">Добавить</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
