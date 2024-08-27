import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './ImageModal.module.scss';

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
  const [formData, setFormData] = useState({
    imageLink: '',
    alt: '',
    sourceLink: '',
    sourceName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedData = {
      imageLink: formData.imageLink.trim(),
      alt: formData.alt.trim(),
      sourceLink: formData.sourceLink.trim(),
      sourceName: formData.sourceName.trim(),
    };

    if (trimmedData.imageLink && trimmedData.alt) {
      onSubmit(trimmedData);
      onClose();
    } else {
      alert('Пожалуйста, заполните обязательные поля.');
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Добавить изображение</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="imageLink">
              Ссылка на изображение (обязательно)
            </label>
            <input
              type="text"
              id="imageLink"
              name="imageLink"
              value={formData.imageLink}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="alt">Описание изображения (обязательно)</label>
            <input
              type="text"
              id="alt"
              name="alt"
              value={formData.alt}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="sourceLink">Ссылка на источник изображения</label>
            <input
              type="text"
              id="sourceLink"
              name="sourceLink"
              value={formData.sourceLink}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="sourceName">Имя источника изображения</label>
            <input
              type="text"
              id="sourceName"
              name="sourceName"
              value={formData.sourceName}
              onChange={handleChange}
            />
          </div>
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
