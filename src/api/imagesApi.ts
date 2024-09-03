import api from './api';
import { IPostImage } from '../types/image';

export const fetchImagesByPostId = async (
  postId: number
): Promise<IPostImage[]> => {
  const response = await api.get(`/images/post/${postId}`);
  return response.data;
};

export const uploadImage = async (
  file: File,
  postId?: number
): Promise<IPostImage> => {
  const formData = new FormData();
  formData.append('file', file);
  if (postId) formData.append('postId', postId.toString());
  const response = await api.post('/images/upload', formData);
  return response.data;
};

export const updateImage = async (
  imageId: number,
  updatedData: Partial<IPostImage>
): Promise<void> => {
  await api.patch(`/images/${imageId}`, updatedData);
};
