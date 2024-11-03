import { useState } from 'react';
import ReactDOM from 'react-dom';
import { IPostImage } from '../../types/image';
import { ImageSelector } from '../ImageSelector';

import styles from './ImageModal.module.scss';

interface ModalProps {
  onClose: () => void;
  onSubmit: (data: {
    src: string;
    alt: string;
    sourceUrl?: string;
    sourceName?: string;
    width?: number;
    height?: number;
  }) => void;
}

export const ImageModal: React.FC<ModalProps> = ({ onClose, onSubmit }) => {
  const [selectedImage, setSelectedImage] = useState<IPostImage | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedImage) {
      onSubmit({
        src: `${selectedImage.src}`,
        alt: selectedImage.alt,
        sourceUrl: selectedImage.sourceUrl || '',
        sourceName: selectedImage.source || '',
        width: selectedImage.width || 800,
        height: selectedImage.height || 600,
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
