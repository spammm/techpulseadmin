import { useEffect, useId, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImageList } from '../../ImageList';
import { RootState, AppDispatch } from '../../../app/appStore';
import { IPostImage } from '../../../shared/types/image';
import {
  loadImages,
  uploadImageThunk,
  updateImageThunk,
} from '../model/imageSlice';
import { Input } from '../../../shared/ui';

import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  postId?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = memo(
  ({ postId }) => {
    const id = useId();
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.images);

    useEffect(() => {
      if (postId) dispatch(loadImages(postId));
    }, [dispatch, postId]);

    const getToken = () => localStorage.getItem('token');

    const handleUpload = (file: File) => {
      const token = getToken();
      if (token) {
        dispatch(uploadImageThunk({ file, postId }));
      } else {
        console.error('Необходимо войти в систему');
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleUpload(e.target.files[0]);
      }
    };

    const handleUpdateImage = (
      imageId: number,
      updatedData: Partial<IPostImage>
    ) => {
      const token = getToken();
      if (token) {
        dispatch(updateImageThunk({ imageId, updatedData }));
      } else {
        console.error('Необходимо войти в систему');
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
            onChange={handleFileChange}
          />
        </div>
        {!loading && postId && <ImageList onUpdateImage={handleUpdateImage} />}
        {loading && <p>Загрузка изображений...</p>}
      </div>
    );
  }
);
