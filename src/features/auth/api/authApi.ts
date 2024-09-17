import { api } from '../../../shared/api';

const API_SERVER = import.meta.env.VITE_API_SERVER;

export const loginUser = async (
  username: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await api.post<{
    accessToken: string;
    refreshToken: string;
  }>(API_SERVER + '/auth/login', {
    username,
    password,
  });

  if (response.data.accessToken && response.data.refreshToken) {
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('token', response.data.accessToken);
  } else {
    console.error('Access token or refresh token is missing');
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    logoutUser();
    throw new Error('Refresh token is missing');
  }

  try {
    const response = await api.post<{ accessToken: string }>(
      `${API_SERVER}/auth/refresh-token`,
      { refreshToken }
    );

    const newAccessToken = response.data.accessToken;
    localStorage.setItem('token', newAccessToken);

    return newAccessToken;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    logoutUser();
    throw new Error('Unable to refresh token');
  }
};
