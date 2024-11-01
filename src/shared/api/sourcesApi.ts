import api from './api';
import { ISources } from '../types/sources';

export const fetchAllSources = async (): Promise<ISources[]> => {
  const response = await api.get(`/sources`);
  return response.data;
};

export const createSource = async (source: ISources): Promise<ISources> => {
  const response = await api.post(`/sources`, source);
  return response.data;
};

export const deleteSource = async (id: number): Promise<void> => {
  await api.delete(`/sources/${id}`);
};
