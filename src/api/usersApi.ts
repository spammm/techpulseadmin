import api from './api';
import { IUser } from './../types/user';

export const getUserProfile = async (userId: string): Promise<IUser> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (
  userId: string,
  profileData: Partial<IUser>
): Promise<IUser> => {
  const response = await api.patch(`/users/${userId}`, profileData);
  return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
};

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const fetchUsers = async (): Promise<IUser[]> => {
  const response = await api.get('/users');
  return response.data;
};
